import React, {useState,useEffect} from 'react'
import { View, Text,TouchableOpacity, ScrollView , StyleSheet} from 'react-native'
import { Card, Paragraph, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Myorderchild from './Myorderchild';

export default function Ontheway({navigation}) {
    const [orders, setOrders] = useState([])
    const [review,setReview]=useState(false)
    const [orderIdSelectedForReview,setOrderIdSelectedForReview]=useState("")
    const [rendercomplete, setrendercomplete] = useState(false)
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('token')
            if (value !== null) {
                return value
            }
        } catch (e) {
            console.log(e)
        }
    }
    const fetchOrders = async () => {
        let token = await getData()
        await fetch('https://olikraft.com/api/letscms/v1/orders', {
            
            headers: {
                "letscms_token": token
            }
        })
        .then(response => response.json())
        .then(function (response)
         {
           
            setOrders(response.data.orders.filter(order=>{
                return order.order_status === "processing"
            }))
            setrendercomplete(true)

        }).catch((e)=>{
            console.log(e)
        })
    }
    
    useEffect(() => 
    {
    fetchOrders()
    
    }, [])

    return (
        <View style={{flex:1}}>
        {<ScrollView >
        {   orders.length != 0 &&
            orders.map((order,idx)=>{
                
                return(
                    <Card style={{elevation:10,marginTop:15,borderRadius:10}} key={idx}>
                        <Card.Content>
                            <View>
                                <View style={{flexDirection:"row",alignItems:"flex-start"}}>
                                    <View style={{backgroundColor:"rgb(241,196,15)",width:"32%",alignItems:"center",borderRadius:5,padding:2}}>
                                        <Text style={{alignItems:"center",fontWeight:"bold",textTransform:"uppercase",color:"white",fontSize:12}}> {order.order_status}</Text>
                                    </View>
                                    <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                                        <Text style={{fontSize:14,color:"grey"}}>Order no# :{order.order_id}</Text>
                                    </View>
                                </View>
                                <Myorderchild id={order.order_id}/>
                            </View>
                            <View style={styles.button}> 
                                <TouchableOpacity style={styles.total}>
                                    <Text style={{color:"black",fontSize:14,fontWeight:"bold"}}>Total  :  ${order.total}</Text>
                                </TouchableOpacity>
                                
                                {/* <TouchableOpacity style={styles.send} onPress={()=>{setOrderIdSelectedForReview(order.order_id);setReview(true)}}>
                                    <Text style={{color:"black",fontSize:14,fontWeight:"bold"}}>Write a Review</Text>
                                </TouchableOpacity> */}
                            </View>
                        </Card.Content>
                    </Card>
                )
            })
           
       
         }
        
    </ScrollView>}
    {
                    orders.length === 0 && rendercomplete && <View style={{flex:1,justifyContent:"flex-start",alignItems:"center"}}>
                        <Text style={{fontWeight:"bold",fontSize:18}}>No orders made......</Text></View>
                } 
                 {
                rendercomplete === false && <View style={{flex:1,justifyContent:"flex-start",alignItems:"center"}}>
                <ActivityIndicator animating={true} color={"rgb(5,23,41)"} size="large"/>
                </View>
            }  
    </View>
    );
  }

  
const styles = StyleSheet.create ({
  
    item: {
       backgroundColor : 'rgb(5,23,41)',height:Platform.OS === 'android' ? 35 :55
    },
    icon: {
        marginLeft: 20,
    },

    title:{
        fontSize:17
    },
    edit:{
        marginRight:"3%"
    },
 
    button:{

        borderColor:"grey",
        flexDirection:"row",
        flex:1,
        justifyContent:"center",
        // marginTop:"10%"
       
    },
    total:{
        backgroundColor:"white",
        height:50,
        width:300,
       
        justifyContent:"center",
        alignItems:"center",
        flex:1,
        borderTopWidth:0.5,
        borderRightWidth:0.5,
        borderColor:"grey",
    },
    cancel:{
        backgroundColor:"white",
        height:50,
        width:300,
       
        justifyContent:"center",
        alignItems:"center",
        flex:1,
        borderTopWidth:0.5,
       
        borderColor:"grey",
    },
    send:{
       
        height:50,
        width:300,
        borderRightWidth:0.5,
        justifyContent:"center",
        alignItems:"center",
        flex:1,
        borderTopWidth:0.5,
        borderColor:"grey",
    }
    
})
