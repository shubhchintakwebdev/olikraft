import React,{useEffect, useState} from 'react'
import { Appbar,Searchbar,ActivityIndicator } from 'react-native-paper';
import { ScrollView, View,Text,Image,TouchableOpacity } from 'react-native'
import { SimpleLineIcons,Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const axios = require('axios');
const ProductsComponent=({product,nprice,pprice,discount,discountPrice,image,id,navigation})=>{
    return (
      <TouchableOpacity onPress={()=>{navigation.navigate("Productsvariable",{"id":id})}}>
        <View style={{width:325,height:"auto",margin:15,backgroundColor:"white",shadowColor: 'rgba(0, 0, 0, 0.2)',shadowOpacity: 1.5,shadowRadius: 20,elevation:5,display:"flex",flexDirection:"row",justifyContent:"space-around",padding:10}}>
        {image != false && <Image source={{uri:image}} style={{height:75,width:75}}/>}
        <View>
            <Text style={{fontSize:18,width:150}}>{product}</Text>
            <Text style={{fontSize:15,fontWeight:"800",marginTop:10}}>${nprice} {discountPrice!=0&&<Text style={{color:"red",textDecorationLine:"line-through"}}>${pprice}</Text>}</Text>
            {discountPrice!=0&&<Text style={{color:"green",fontSize:14,fontWeight:"800",marginTop:5}}>You Save {(discount*100).toPrecision(4)}% (${discountPrice})</Text>}
        </View>
    </View>
    </TouchableOpacity>
    )
}
const Products = ({navigation}) => {
    const [pro,setPro]=useState([])
    const [rendercomplete, setrendercomplete] = useState(false)
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
      const fetchProducts=async ()=>{
        let token=await getData()
       await axios.get(`https://olikraft.com/api/letscms/v1/products?page=1&search=${searchQuery}`, {
           Headers:{
               letscms_token:token
           }
         })
         .then(function (response) {
           setPro(response.data.data.products)
           setrendercomplete(true)
         })
         .catch(function (error) {
            console.log(error);
         })
      }
      // useEffect(() => {
      //   const unsubscribe = navigation.addListener('focus', () => {
      //     fetchProducts()
      //   });
      //   return unsubscribe;
      // }, [navigation]);
      useEffect(()=>{fetchProducts()},[])
   const [searchQuery, setSearchQuery] = React.useState('');
    const [focus,setFocus]=React.useState(false);
    const onChangeSearch = query => setSearchQuery(query);
    return (
       <View style={{flex:1,backgroundColor:"#f9f9f9"}}>
         {rendercomplete && <View>
           <Appbar.Header style = {{backgroundColor:"rgb(5,23,41)",height:Platform.OS === 'android' ? 35 :55}}>
                <Appbar.Content title="Products" titleStyle={{fontSize:20}}/>
                 {focus&&<Searchbar onChangeText={onChangeSearch} onChange={fetchProducts} value={searchQuery} style={{height:30,width:150,marginRight:10}} onBlur={()=>{setFocus(!focus);setSearchQuery("");fetchProducts()}}/>}
                 {!focus&&<Ionicons name="search" size={25} color="white" onPress={()=>{setFocus(!focus)}} style={{marginRight:15}}/>}
                 <TouchableOpacity onPress={()=>{navigation.navigate("Mycart")}}><SimpleLineIcons name="bag" size={25} color="white" style={{marginRight:15}}/></TouchableOpacity>
            </Appbar.Header>
            </View>}
            {rendercomplete && <View style={{flex:1,height:"87%",width:"100%"}}>
             <ScrollView>
               <View style={{marginLeft:'auto',marginRight:"auto"}}>
                {pro.length>0&&pro.map((item,index)=>{return <ProductsComponent key={index} product={item.name} nprice={item.price} pprice={item.regular_price} discount={(Number(item.regular_price===""?item.price:item.regular_price)-Number(item.price))/Number(item.regular_price===""?item.price:item.regular_price)} discountPrice={Number(item.regular_price===""?item.price:item.regular_price)-Number(item.price)} image={item.image} id={item.id} navigation={navigation}/>})}
                {pro.length==0&&
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                  <Text style={{fontWeight:"bold"}}>Loading Results</Text>
                  </View>}
                </View>
            </ScrollView> 
            </View>}
            {
                rendercomplete === false && <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <ActivityIndicator animating={true} color={"rgb(5,23,41)"} size="large"/>
                </View>
            }
       </View>
    )
}
export default Products