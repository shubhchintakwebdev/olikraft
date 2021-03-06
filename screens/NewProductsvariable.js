import React, {useState,useEffect} from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, } from 'react-native'
import { Ionicons,Entypo,FontAwesome5,EvilIcons,Octicons,FontAwesome} from '@expo/vector-icons';
import { Appbar, List, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SliderBox } from "react-native-image-slider-box";

import NewAttributesarray from './NewAttributes';
const useForceUpdate = () => useState()[1];
const axios = require('axios');

export default function NewProductsvariable({route,navigation}) {
    const [titles, settitles] = useState([]);
    const [opt, setopt] = useState([]);
    const [Counter,setCounter] = useState(1)
    const [name,setName] = useState()
    const [images,setimages] = useState(route.params.Images)
    const [price, setprice] = useState()
    const [saleprice , setsaleprice] = useState()
    const [rating,setrating] = useState()
    const [pro,setPro] = useState([])
    const forceUpdate = useForceUpdate();
    const [proid,setid] = useState(route.params.pid)
    const [varid,setvarid] = useState(route.params.id)
    const [hasidchanged ,sethasidchanged] = useState(false)
    const [rendercomplete, setrendercomplete] = useState(false)
    function matchvardetails2(option,title){
        settitles([...titles, title]);
        setopt([...opt, option]);
        
        // console.log(theArray)
    }

    function updateid (id,images){
        setvarid(id);
        setimages(images)
        settitles([])
        setopt([])
        sethasidchanged(true)
        // forceUpdate()
        // fetchrootitem()
    }
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

      
      const addtocart=async ()=>{
        let token = await getData()

            fetch('https://olikraft.com/api/letscms/v1/cart/add-item', {
                method:"POST",
                headers:{
                    "letscms_token":token,
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                product_id:varid,
                quantity:Counter,
                }),
                
              },)
              .then(response => response.json())
              .then((response) =>{
                
                alert(response.message)
                navigation.navigate("Mycart")
                
              })
              .catch(function (error) {
                console.log(error);
              });
        
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
        console.log("hello",varid)
        axios.get('https://olikraft.com/api/letscms/v1/product/' + varid, {
            Headers:{
                letscms_token:token
            }
          })
          .then(function (response) {
                setPro(response.data.data)
                setName(response.data.data.name)
                setprice(Number(response.data.data.regular_price))
                setsaleprice(Number(response.data.data.sale_price))
                setrating(response.data.data.average_rating)
                setrendercomplete(true)
          })
          .catch(function (error) {
            console.log(error);
          })

          
    }

   
    
    useEffect(()=>{
        fetchrootitem()
        if(hasidchanged){
         
            sethasidchanged(false)
            fetchrootitem()
        }
        // 
        // console.log(route.params.pid)
    },[hasidchanged])
    // let Image_Http_URL ={ uri: pro.image};
    let discount=( Math.abs(price - saleprice) ) / price 
    let discountPrice = Math.abs(price - saleprice)
    
  
    return (
        <View style={{flex:1}}>
            {rendercomplete && <View >
            <Appbar.Header style = {styles.item}>
                <Ionicons style ={styles.icon} name="arrow-back" size={24} color="rgb(5,23,41)" onPress={()=>{navigation.navigate("BNS")}}/>
                <Appbar.Content title="" titleStyle={styles.title}/>

            </Appbar.Header>
            </View>}
           
            { rendercomplete && <ScrollView style={{flex:1}}>
           
                <View  style={{elevation:15,padding:5,borderRadius:10,backgroundColor:"white"}}>
                    <SliderBox images={route.params.Images} sliderBoxHeight={270} resizeMode="contain"/>
                </View>
                <View style={{flexDirection:"row",padding:10}}>
                    <Text style={{marginLeft:5,fontSize:16,flex:1,fontWeight:"bold"}}>{name}</Text>
                    <View style={{flex:0.5,alignItems:"flex-end",marginRight:16,justifyContent:"center"}}>
                        <TouchableOpacity style={{backgroundColor:"white",justifyContent:"center",alignItems:"center",borderRadius:50,height:40,width:40}} onPress={()=>{navigation.navigate("Mycart")}}>
                            <FontAwesome5 name="shopping-bag" size={16} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{backgroundColor:"rgb(33,184,97)",borderRadius:5,marginLeft:15,width:"15%",flexDirection:"row",justifyContent:"space-evenly"}}>
                    <Text style={{color:"white",fontSize:16}}>{rating}</Text>
                    <EvilIcons style={{marginTop:3}} name="star" size={20} color="white" />
                </View>
                {(saleprice != 0)&&<View>
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
                            </View>}
                   {!(saleprice != 0)&&<View style={{flexDirection:"row",width:"50%",padding:10,marginLeft:5,}}>
                                <Text style={{color:"rgb(5,23,41)",fontSize:15,flex:0.5,fontWeight:"bold"}}>
                                    ${price}
                                </Text>
                            </View> }
                
                <NewAttributesarray id = {proid} Images={route.params.Images} match={matchvardetails2} titles={titles} opt={opt} chooseoption={route.params.opt} updateid={updateid}/>
                
                <View style={{flex:1,padding:15,justifyContent:"flex-start"}}>
                    <Text style={{color:"black",fontSize:19}}>Quantity</Text>
                    <View style={{flexDirection:"row",backgroundColor:"white",padding:5,marginVertical:5,borderWidth:0.5,borderColor:"grey"}}>
                        <View style={{flex:1,marginLeft:5,justifyContent:"center"}}>
                            <Entypo name="minus" size={24} color="black" onPress={decrement} disabled={Counter === 1}/>
                        </View>
                        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                            <Text style={{fontWeight:"bold",fontSize:16}}>{Counter}</Text>
                        </View>
                        <View style={{flex:1,justifyContent:"center",alignItems:"flex-end",marginRight:10}}>
                            <Entypo name="plus" size={24} color="black" onPress={increment}/>
                        </View>
                </View>
                {/* <View style={{padding:5}}>
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
                   
                </View> */}
                <View style={{flexDirection:"row",padding:5}}>
                    <Image source={require("../assets/moneyback.png")} style={{resizeMode:"stretch",height:50,width:50,marginRight:15}}/>
                    <Image source={require("../assets/mcafee.png")} style={{height:50,width:50,resizeMode:"stretch"}}/>
                </View>

                <TouchableOpacity style={{backgroundColor:"white",elevation:5,height:40,borderRadius:15,justifyContent:"center"}} onPress={()=>{navigation.navigate("ProductDetails",{"id":proid})}} >
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
                </TouchableOpacity>         
                <TouchableOpacity style={{backgroundColor:"white",elevation:5,height:40,marginTop:10,borderRadius:15,justifyContent:"center"}}
                onPress={()=>{navigation.navigate("Productreview",{"id":proid})}}>
                    <View style={{flexDirection:"row"}}>
                        <View style={{flex:1,alignItems:"flex-start",marginLeft:15}}>
                            <FontAwesome name="star-half-full" size={24} color="black" />
                        </View>
                        <View >
                            <Text style={{fontSize:15,color:"black"}}>Rating and Reviews</Text>
                        </View>
                        <View  style={{flex:1,alignItems:"flex-end",marginRight:15}}>
                            <FontAwesome name="angle-right" size={24} color="black" />
                        </View>
                    </View>
                </TouchableOpacity>                       
            </View>
            </ScrollView>
            }
            {
            rendercomplete && <View style={{alignItems:"center",padding:20}}>
                    <TouchableOpacity style={{backgroundColor:'rgb(33,184,97)',borderRadius:10,height:50,width:380,display:"flex",justifyContent:"center",alignItems:"center"}} onPress={addtocart}>
                        <Text style={{color:"white",fontSize:16}}>Buy Now</Text>
                    </TouchableOpacity>
                </View>
            }
            {
                rendercomplete === false && <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <ActivityIndicator animating={true} color={"rgb(5,23,41)"} size="large"/>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create ({
  
    item: {
       backgroundColor : 'white',height:35,paddingBottom:17
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