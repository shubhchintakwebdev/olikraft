import React,{useState, useRef, useEffect} from 'react'
import { Appbar, ActivityIndicator } from 'react-native-paper';
import { View,Text,Image,TouchableOpacity,Alert,StyleSheet } from 'react-native'
import { SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import YoutubePlayer from 'react-native-youtube-iframe';
import {Icon} from 'react-native-elements';



const Tutorials = ({navigation}) => {
    const [rendercomplete, setrendercomplete] = useState(false)
    useEffect(()=>{
        setTimeout(() => {
            setrendercomplete(true)
          }, 2000);
        
    },[])
    return (
        <View style={{flex:1,backgroundColor:"#f9f9f9"}}>
            {rendercomplete && <View>
                <Appbar.Header style = {{backgroundColor:"rgb(5,23,41)",height:Platform.OS === 'android' ? 35 :55}}>
                <Ionicons style ={styles.icon} name="arrow-back" size={24} color="white"  onPress={()=>{navigation.goBack()}}/>
                <Appbar.Content title="Tutorials" titleStyle={{fontSize:20}}/>
              {/* <TouchableOpacity onPress={()=>{navigation.navigate("Mycart")}}><SimpleLineIcons name="bag" size={25} color="white" style={{marginRight:10}}/></TouchableOpacity> */}
            </Appbar.Header>
            </View>
            }
            {rendercomplete && <View>
            <View style={{height:"100%",width:"100%",padding:25}}>
            <Text style={{color:"rgb(5,23,41)",fontSize:24,marginBottom:15}}>Yarn Wilner (with Umbrella Swift) Setup Guid</Text>
            {/* <TouchableOpacity onPress={()=>{Linking.openURL('https://youtu.be/9y190XTkUtU')}}>
            <Image source={require("../assets/topcomponentimage2.jpg")} style={{height:200,width:"100%",marginTop:8}}/>
            </TouchableOpacity> */}
            

            <YoutubePlayer
                height={220}
                play ={false}
                videoId={'9y190XTkUtU'}
            /> 
            <Text style={{color:"grey",fontSize:15}}>With you, our customers being one of our top priorities. We have specially put together video tutorials to aid you in using our products the best ways possible!</Text>
            <Text style={{color:"grey",fontSize:15,marginTop:8}}>Please feel free to drop us an email <Text style={{color:"rgb(5,23,41)",textDecorationLine:"underline"}}>support@olikraft.com</Text></Text>
            <Text style={{color:"grey",fontSize:15,marginTop:8}}>If you have any questions on how to get started with your products. We will be glad to assist you.</Text>
            </View>     
            </View> }   
            {
                rendercomplete === false && <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <ActivityIndicator animating={true} color={"rgb(5,23,41)"} size="large"/>
                </View>
            } 
        </View>
    )
}

const styles = StyleSheet.create ({
   
    icon: {
        marginLeft: 20
    },

   
})

export default Tutorials
