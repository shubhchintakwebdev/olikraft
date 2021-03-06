import React,{useState,useEffect} from 'react'
import { View,Text,ImageBackground,ScrollView,Image,TouchableOpacity } from 'react-native'
import { SimpleLineIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Searchbar} from "react-native-paper"

const axios=require("axios");
const TopComponent=({content,image,link,navigation})=>{
   
    return (
        <TouchableOpacity style={{width:325,height:175,margin:15}} onPress={()=>{navigation.navigate("Productsvariable",{"id":link})}}>
            <ImageBackground source={{uri:image}} style={{flex:1,justifyContent:"center"}} imageStyle={{borderRadius:25,height:175,backgroundColor:"black",opacity:0.7}}>
                <View style={{display:"flex",flexDirection:"row",justifyContent:"space-around",height:"100%",alignItems:"flex-end",paddingBottom:15}}>
                <Text style={{textAlign:"center",color:"white",fontSize:20}}>{content}</Text>
                <AntDesign name="arrowright" size={24} color="white" />
                </View>
            </ImageBackground>
        </TouchableOpacity>
    )
}
const ShopFromFavouriteComponent=({product,nprice,pprice,id,navigation,image,featured})=>{
    return(
        <TouchableOpacity onPress={()=>{navigation.navigate("Productsvariable",{"id":id})}}>
            {featured&&<View
                style={{width:325,height:100,margin:15,backgroundColor:"white",shadowColor: 'rgba(0, 0, 0, 0.2)',shadowOpacity: 1.5,shadowRadius: 5,elevation:1,display:"flex",flexDirection:"row",justifyContent:"space-around",padding:10}}>
                <Image source={{uri:image}} style={{height:75,width:75}} />
                <View>
                    <Text style={{fontSize:12,width:150}}>{product}</Text>
                    <Text style={{fontSize:15,fontWeight:"800",marginTop:10}}>${nprice} <Text style={{color:"red",textDecorationLine:"line-through"}}>{pprice?`$ ${pprice}`:""}</Text></Text>
                </View>
            </View>}
        </TouchableOpacity>
    )
}
const RecentReviewsComponent=({name,stars,comment,url})=>{
    let Image_Http_URL ={ uri: url};
    
    return (
        <View style={{width:400,height:150,margin:15,backgroundColor:"white",shadowColor: 'rgba(0, 0, 0, 0.2)',shadowOpacity: 1.5,shadowRadius: 5,elevation:1,display:"flex",flexDirection:"row",justifyContent:"space-around",padding:10}}>
            <View >
            <Image source={Image_Http_URL} style={{height:75,width:75,borderRadius:50,margin:10}}/>
            {/* {console.log(url)} */}
            </View>
            <View style={{flex:1}}> 
                <Text style={{fontSize:20,fontWeight:"800"}}>{name}</Text>
                <View style={{display:"flex",flexDirection:"row"}}>
                    {[...Array(stars)].map((item,index)=>{return  <AntDesign name="star" size={24} color="orange" key={index}/>})}
                    {[...Array(5-stars)].map((item,index)=>{return  <AntDesign name="staro" size={24} color="orange" key={index}/>})}
                </View>
                <Text style={{fontSize:14,color:"grey"}}>{comment}</Text>
            </View>
        </View>
    )
}
const Home = ({navigation}) => {
    const TCJSON = [{
        "content": "Stop winding yarn by hand",
        "image": "https://cdn.shopify.com/s/files/1/0434/1347/1386/files/Banner_1400x.progressive.png.jpg?v=1594881434",
        "link":48
    }, {
        "content": "Yarn Sets",
        "image": "https://cdn.shopify.com/s/files/1/0434/1347/1386/files/Banner2_1400x.progressive.png.jpg?v=1594881663",
        "link":35
    }]
    
    const [RRJSON, setRRJSON] = useState([])
    const [name, setName] = useState("")
    const [pro, setPro] = useState([])
    const getData = async () => {
        try {

            const value = await AsyncStorage.getItem('token')
            const jsonValue = await AsyncStorage.getItem('profileData')
            if (jsonValue) {
                let data = JSON.parse(jsonValue)
                setName(data.display_name.split(" ")[0])
            }
            if (value !== null) {
                return value
            }
        } catch (e) {
            console.log(e)
        }
    }
    const fetchProducts = async () => {
        let token = await getData()
        await axios.get(`https://olikraft.com/api/letscms/v1/products?page=1&search=${searchQuery}`, {
                Headers: {
                    letscms_token: token
                }
            })
            .then(function (response) {
                setPro(response.data.data.products)
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    const fetchRatings = async () => {
        let token = await getData()
        await axios.get(`https://olikraft.com/api/jet-cct/dashboard_reviews`, {
                Headers: {
                    letscms_token: token
                }
            })
            .then(function (response) {
                setRRJSON(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //       fetchProducts()
    //     });
    //     return unsubscribe;
    //   }, [navigation]);
      useEffect(()=>{
          fetchProducts()
          fetchRatings()
        },[])
    const [searchQuery, setSearchQuery] = React.useState('');
    const [focus,setFocus]=React.useState(false);
    const onChangeSearch = query => setSearchQuery(query);
    return (
       <View style={{flex:1,backgroundColor:"#f9f9f9",paddingTop:25}}>
           <ScrollView>
               <View
                   style={{marginLeft:'auto',marginRight:"auto",flex:1,justifyContent:"space-evenly",width:"100%",height:"100%"}}>
                   <View
                       style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginBottom:30,marginHorizontal:"10%"}}>
                       <Text style={{fontSize:20}}>Hi , {name}</Text>
                       <TouchableOpacity onPress={()=>{navigation.navigate("Mycart")}}>
                           <SimpleLineIcons name="bag" size={26} color="black" />
                       </TouchableOpacity>
                   </View>
                   <View style={{height:200}}>
                       <ScrollView horizontal>
                           {TCJSON.map((item,index)=>{return <TopComponent content={item.content} key={index} image={item.image} link={item.link}
                               navigation={navigation} />})}
                       </ScrollView>
                   </View>
                   <View
                       style={{display:"flex",flexDirection:"row",width:350,justifyContent:"space-evenly",marginBottom:20,marginTop:10}}>
                       <LinearGradient
                           style={{display:"flex",flexDirection:"row",width:150,height:75,justifyContent:"space-between",padding:10,borderRadius:15}}
                           colors={['#E0B042', '#E7E75F' , '#E78357' ]}>
                           <View>
                               <Text style={{fontSize:20,color:"white"}}>10 %</Text>
                               <Text style={{color:"white"}}>Flat Offer</Text>
                           </View>
                           <SimpleLineIcons name="badge" size={30} color="white" />
                       </LinearGradient>
                       <LinearGradient
                           style={{display:"flex",flexDirection:"row",width:150,height:75,justifyContent:"space-between",padding:10,borderRadius:15}}
                           colors={['#6BD1BB', '#9BE786' , '#95FB5F' ]}>
                           <View>
                               <Text style={{fontSize:20,color:"white"}}>Discount</Text>
                               <Text style={{color:"white"}}>Weekend Sale</Text>
                           </View>
                           <SimpleLineIcons name="present" size={30} color="white" />
                       </LinearGradient>
                   </View>
                   <TouchableOpacity onPress={()=>{navigation.navigate("Products")}}>
                       <View
                           style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginHorizontal:"5%"}}>
                           <Text style={{fontSize:22}}>Shop from Favourites</Text>
                           <AntDesign name="arrowright" size={24} color="black" style={{marginTop:4}} />
                       </View>
                   </TouchableOpacity>
                   <View style={{height:125}}>
                       <ScrollView horizontal>
                           {pro.length>0&&pro.map((item,index)=>{return <ShopFromFavouriteComponent product={item.name} nprice={item.price}
                               pprice={item.regular_price} key={index} id={item.id} navigation={navigation}
                               image={item.image} featured={item.featured} />})}
                       </ScrollView>
                   </View>
                   <View
                       style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginHorizontal:"5%"}}>
                       <Text style={{fontSize:22}}>Recent Reviews</Text>
                       <AntDesign name="arrowright" size={24} color="black" style={{marginTop:4}} onPress={()=>
                           navigation.navigate("Customerreview")}/>
                   </View>
                   <View style={{height:200}}>
                       <ScrollView horizontal>
                           {RRJSON.map((item,index)=>{return <RecentReviewsComponent name={item.name} stars={Number(item.rating_stars)}
                               comment={item.review} key={index} url={item.customer_pic} />})}
                       </ScrollView>
                   </View>
               </View>
           </ScrollView>
       </View>
    )
}

export default Home





