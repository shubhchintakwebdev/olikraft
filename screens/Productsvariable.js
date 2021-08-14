import React, {useState,useEffect} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, TouchableHighlight,Switch } from 'react-native'
import { Ionicons,Entypo,FontAwesome5,EvilIcons,Octicons,FontAwesome} from '@expo/vector-icons';
import { Appbar, List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SliderBox } from "react-native-image-slider-box";
const axios = require('axios');
export default function Productsvariable({route,navigation}) {
    const [Counter,setCounter] = useState(1)
    const [name,setName] = useState("")
    const [images,setImages]=useState([])
    const [price, setprice] = useState(0)
    const [saleprice , setsaleprice] = useState(0)
    const [rating,setrating] = useState(0)
    const [pro,setPro] = useState([])
    const [Attributes,setAttributes] = useState([])
    const [Children,setChildren] = useState([])
    const getData = async () => {
        try {
          const value = await AsyncStorage.getItem('token')
          if(value !== null) 
          {
           return value
          }
        } catch(e) {
          console.log(e)
        }
      }

      function increment(){
        setCounter(Counter + 1)
    }

    function decrement(){
        if(Counter > 0){
            setCounter(Counter - 1)
        }
        else{
            setCounter(0)
        }
    }

    
    const fetchrootitem = async () =>{
        let token=getData()
        axios.get('https://olikraft.shubhchintak.co/api/letscms/v1/product/' + route.params.id, {
            Headers:{
                letscms_token:token
            }
          })
          .then(function (response) {
                setPro(response.data.data)
                setImages(response.data.data.gallery_images)
                setName(response.data.data.name)
                setprice(Number(response.data.data.regular_price))
                setsaleprice(Number(response.data.data.price))
                setrating(response.data.data.average_rating)
                setAttributes(Object.keys(response.data.data.attributes))
                setChildren(response.data.data.children)
          })
          .catch(function (error) {
            console.log(error);
          })
    }

    function fetchvaritem (id){
        let token=getData()
        axios.get("https://olikraft.shubhchintak.co/api/letscms/v1/product/" + id, {
            Headers:{
                letscms_token:token
            }
          })
          .then(function (response) {
                // setPro(response.data.data)
                // setImages(response.data.data.gallery_images)
                
                // console.log(response.data.data)
                setName(response.data.data.name)
                setprice(Number(response.data.data.regular_price))
                setsaleprice(Number(response.data.data.sale_price))
                setrating(response.data.data.average_rating)
          })
          .catch(function (error) {
            console.log(error);
          })
    }
    useEffect(()=>{
        fetchrootitem()
    },[])
    // let Image_Http_URL ={ uri: pro.image};
    let discount=( Math.abs(price - saleprice) ) / price 
    let discountPrice = Math.abs(price - saleprice)
    return (
        <View style={{flex:1}}>
            <View >
            <Appbar.Header style = {styles.item}>
                <Ionicons style ={styles.icon} name="arrow-back" size={24} color="rgb(5,23,41)" onPress={()=>{navigation.goBack()}}/>
                <Appbar.Content title="" titleStyle={styles.title}/>
                
            </Appbar.Header>
            </View>
            <ScrollView style={{flex:1}}>
                <View  style={{elevation:15,padding:5,borderRadius:10,backgroundColor:"white"}}>
                    <SliderBox images={images} sliderBoxHeight={300} />
                </View>
                <View style={{flexDirection:"row",padding:10}}>
                    <Text style={{marginLeft:5,fontSize:16,flex:1,fontWeight:"bold"}}>{name}</Text>
                    <View style={{flex:0.5,alignItems:"flex-end",marginRight:16,justifyContent:"center"}}>
                        <View style={{backgroundColor:"white",justifyContent:"center",alignItems:"center",borderRadius:50,height:40,width:40}}>
                            <FontAwesome5 name="shopping-bag" size={16} color="black" />
                        </View>
                    </View>
                </View>
                <View style={{backgroundColor:"rgb(33,184,97)",borderRadius:5,marginLeft:15,width:"15%",flexDirection:"row",justifyContent:"space-evenly"}}>
                    <Text style={{color:"white",fontSize:16}}>{rating}</Text>
                    <EvilIcons style={{marginTop:4}}name="star" size={20} color="white" />
                </View>
                {

                    (saleprice != discountPrice)
                        ?   <View>
                                <View style={{flexDirection:"row",width:"50%",padding:10,marginLeft:5,}}>
                                    <Text style={{color:"rgb(5,23,41)",fontSize:15,flex:0.5}}>
                                        ${saleprice}
                                    </Text>
                                    <Text style={{color:"grey",fontSize:15,flex:1,textDecorationLine:"line-through"}}>
                                        ${price}
                                    </Text>
                                </View>
                                <View style={{marginLeft:10,padding:5}}>
                                    <Text style={{color:"rgb(144,222,174)",fontSize:14,fontWeight:"bold"}}>You Save {(discount*100).toPrecision(4)}% (${discountPrice})</Text>
                                </View>
                            </View>
                            
                        :   <View style={{flexDirection:"row",width:"50%",padding:10,marginLeft:5,}}>
                                <Text style={{color:"rgb(5,23,41)",fontSize:15,flex:0.5,fontWeight:"bold"}}>
                                    ${saleprice}
                                </Text>
                            </View>

                }
                
                {   (Attributes.length != 0)? 
                    Attributes.map((att,idx)=>{
                        return(
                            <View key={idx}>
                                <View style={{marginLeft:15}}>
                                    <Text style={{color:"black",fontWeight:"bold",fontSize:19}}>{att} :</Text>
                                </View>
                                <View style={{flexDirection:"row",backgroundColor:"white",marginVertical:5,marginHorizontal:15,borderWidth:0.5,borderColor:"grey"}}>
                                    <TouchableOpacity style={{flex:1,marginLeft:5,padding:5,justifyContent:"center",alignItems:"center",}} onPress={()=>fetchvaritem(Children[0])}>
                                        <Text style={{fontSize:17,fontWeight:"bold"}}>8-inches</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity style={{flex:1,justifyContent:"center",padding:5,alignItems:"center",marginRight:10}} onPress={()=>fetchvaritem(Children[1])}>
                                        <Text style={{fontSize:17,fontWeight:"bold"}}>11-inches</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })
                    :<View></View>
                }
                
                <View style={{flex:1,padding:15,justifyContent:"flex-start"}}>
                    <Text style={{color:"black",fontSize:19}}>Quantity</Text>
                    <View style={{flexDirection:"row",backgroundColor:"white",padding:5,marginVertical:5,borderWidth:0.5,borderColor:"grey"}}>
                        <View style={{flex:1,marginLeft:5,justifyContent:"center"}}>
                            <Entypo name="minus" size={24} color="black" onPress={decrement}/>
                        </View>
                        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                            <Text style={{fontWeight:"bold",fontSize:16}}>{Counter}</Text>
                        </View>
                        <View style={{flex:1,justifyContent:"center",alignItems:"flex-end",marginRight:10}}>
                            <Entypo name="plus" size={24} color="black" onPress={increment}/>
                        </View>
                </View>
                <View style={{padding:5}}>
                    <Text style={{color:"black",fontSize:17,fontWeight:"bold"}}>
                        Package will include:
                    </Text>
                    <Text style={styles.listitem}>
                    {'\u2022'}Package item details 1
                    </Text>
                    <Text style={styles.listitem}>
                    {'\u2022'}Package item details 2
                    </Text>
                    <Text style={styles.listitem}>
                    {'\u2022'}Package item details 3
                    </Text>
                   
                </View>
                <View style={{flexDirection:"row",padding:5}}>
                    <Image source={require("../assets/moneyback.png")} style={{resizeMode:"stretch",height:50,width:50,marginRight:15}}/>
                    <Image source={require("../assets/mcafee.png")} style={{height:50,width:50,resizeMode:"stretch"}}/>
                </View>

                <View style={{backgroundColor:"white",elevation:5,height:40,borderRadius:15,justifyContent:"center"}}>
                    <View style={{flexDirection:"row"}}>
                        <View style={{flex:1,alignItems:"flex-start",marginLeft:15}}>
                            <Octicons name="info" size={24} color="black"  />
                        </View>
                        <View  style={{flex:1,alignItems:"center"}}>
                            <Text style={{fontSize:15,color:"black"}}>All Details</Text>
                        </View>
                        <View  style={{flex:1,alignItems:"flex-end",marginRight:15}}>
                            <FontAwesome name="angle-right" size={24} color="black" />
                        </View>
                    </View>
                </View>         
                <View style={{backgroundColor:"white",elevation:5,height:40,marginTop:10,borderRadius:15,justifyContent:"center"}}>
                    <View style={{flexDirection:"row"}}>
                        <View style={{flex:1,alignItems:"flex-start",marginLeft:15}}>
                            <FontAwesome name="star-half-full" size={24} color="black" />
                        </View>
                        <View >
                            <Text style={{fontSize:15,color:"black"}}>Rating and Reviews </Text>
                        </View>
                        <View  style={{flex:1,alignItems:"flex-end",marginRight:15}}>
                            <FontAwesome name="angle-right" size={24} color="black" />
                        </View>
                    </View>
                </View>                       
            </View>
            </ScrollView>
            <View style={{alignItems:"center",padding:20}}>
                    <TouchableOpacity style={{backgroundColor:'rgb(33,184,97)',borderRadius:10,height:50,width:380,display:"flex",justifyContent:"center",alignItems:"center"}} onPress={()=>{navigation.navigate("Mycart")}}>
                        <Text style={{color:"white",fontSize:16}}>Buy Now</Text>
                    </TouchableOpacity>
                </View>
        </View>
    )
}

const styles = StyleSheet.create ({
  
    item: {
       backgroundColor : 'white'
    },
    icon: {
        marginLeft: 20
    },

    title:{
        fontSize:17
    },

    edit:{
        marginRight:"3%"
    },
    listitem:{
        color:"grey"
    }
})