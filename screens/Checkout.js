import React, {
    useState,
    useEffect
} from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Button,
    ToastAndroid
} from "react-native"
import {
    Card,
    Paragraph
} from 'react-native-paper';
import {
    Ionicons,
    Feather,
    EvilIcons
} from '@expo/vector-icons';
import {
    Appbar,
    ActivityIndicator
} from 'react-native-paper';
import {
    Checkbox
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Shippingaddress from './Shippingaddress';
import Billingaddress from './Billingaddress';
import {
    CardField,
    useStripe
} from '@stripe/stripe-react-native';
import {
    useConfirmPayment
} from '@stripe/stripe-react-native';
import Stripe from 'react-native-stripe-api';
import Showcountrystate from './Showcountrystate';
export default function Checkout({
    route,
    navigation
}) {
    const [checked, setChecked] = React.useState(false);
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [contact, setcontact] = useState("")
    const [firstname, setfirstname] = useState("")
    const [lastname, setlastname] = useState("")
    const [country, setcountry] = useState("")
    const [city, setcity] = useState("")
    const [State, setState] = useState("")
    const [postcode, setpostcode] = useState("")
    const [cartitems, setCartitems] = useState([])
    const [carttotals, setCarttotals] = useState([])
    const {
        confirmPayment,
        loading
    } = useConfirmPayment();
    const [paymentmethod, setpaymentmethod] = useState("")
    const [paymentmethodtitle, setpaymentmethodtitle] = useState("")
    const [address1, setaddress1] = useState("")
    const [address2, setaddress2] = useState("")
    const [bafetched, setbafetched] = useState(false)
    const [safetched, setsafetched] = useState(false)
    const [cardnumber, setcardnumber] = useState("")
    const [cvc, setcvc] = useState("")
    const [expmonth, setexpmonth] = useState("")
    const [expyear, setexpyear] = useState("")
    const [rendercomplete, setrendercomplete] = useState(false)
    const [sk, setsk] = useState("")


    //shipping
    const [shad,setshippingAddress]=useState([])
    const [countrylist,setCountrylist] = useState([])
    const [Statelist,setStatelist] = useState([])
    const [countryShip,setCountryShip] = useState("")
    const [StateShip,setStateShip] = useState("")
    const [isaddressfetched,  setisaddressfetched] = useState(false)
    const [rendercompleteShip, setrendercompleteShip] = useState(false)
    const updateaddressfetched = () =>{
        setisaddressfetched(false)
      }
    const fetchshippingaddress= async ()=>{
        console.log("Fetching shipping Address API")
          let token = await getData()
          fetch("https://olikraft.com/api/letscms/v1/address/shipping",{
              headers:{
                  letscms_token:token
              }
          })
          .then(response => response.json())
          .then((res) => {
              // console.log(res.data.address)
              if(typeof res.data.address.country != "undefined"){
              setshippingAddress(res.data.address)
              setCountrylist(res.data.countries)
              setStatelist(res.data.states)
              setStateShip(res.data.address.state)
              setCountryShip(res.data.address.country)
              setisaddressfetched(true)
              setrendercompleteShip(true)
              updatesa()
            }
            else{
              setrendercompleteShip(true)
            }
          })
          .catch(error => console.log(error))
      }
      React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
         fetchshippingaddress()
         console.log("Fetching shipping Address UseEffect")
        });
        return unsubscribe;
      }, [navigation]);

    //shipping

    const updatesa = () => {
        setsafetched(true)
    }

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

    const fetchcheckout = async () => {
        let token = await getData()

        fetch("https://olikraft.com/api/letscms/v1/checkout?coupons[]=" + route.params.coupon, {
                headers: {
                    letscms_token: token
                }
            })
            .then(response => response.json())
            .then((res) => {
                // console.log("hello",res.data.payment_gateways.strie.secret_key)
                setaddress1(res.data.customer.address_1)
                setaddress2(res.data.customer.address_2)
                setcity(res.data.customer.city)
                setcountry(res.data.customer.country)
                setfirstname(res.data.customer.first_name)
                setlastname(res.data.customer.last_name)
                setState(res.data.customer.state)
                setpostcode(res.data.customer.postcode)
                setcontact(res.data.customer.phone)
                setEmail(res.data.customer.email)
                setCartitems(res.data.cart_items)
                setCarttotals(res.data.cart_totals)
                setpaymentmethod("stripe")
                setpaymentmethodtitle("Stripe")
                setsk(res.data.payment_gateways.stripe.secret_key)
                setrendercomplete(true)
            })
            .catch(error => console.log(error))

    }

    const placeorder = async () => {
        setrendercomplete(false)
        let token = await getData()
        const client = new Stripe(sk);
        const cardtoken = await client.createToken({
            number: cardnumber,
            exp_month: expmonth,
            exp_year: expyear,
            cvc: cvc,
            address_line1: address1,
            address_line2: address2,
            address_city: city,
            address_state: State,
            address_zip: postcode,
            address_country: country,
        });
        console.log("helllooooo", State, country)
        // console.log(car
        if (Object.keys(cardtoken)[0] != "error") {
            let stripetoken = cardtoken.id
            fetch('https://olikraft.com/api/letscms/v1/order/create', {
                    method: "POST",
                    headers: {
                        "letscms_token": token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        first_name: firstname,
                        last_name: lastname,
                        country: country,
                        city: city,
                        state: State,
                        postcode: postcode,
                        phone: contact,
                        email: email,
                        payment_method: paymentmethod,
                        payment_method_title: paymentmethodtitle,
                        address_1: address1,
                        address_2: address2,
                        coupons: route.params.coupon,
                        stripe_card_token: stripetoken
                    }),

                }, )
                .then(response => response.json())
                .then((response) => {

                    alert("Order Successfully Placed.Thanks for ordering!!")
                    navigation.navigate("Orderconfirmation", {
                        orderid: response.data.order_id,
                        cartitems: route.params.cartitems,
                        carttotals: route.params.carttotals
                    })


                })
                .catch(function (error) {
                    console.log(error,"%%%%%%");
                    
                });
        } else if (Object.keys(cardtoken)[0] === "error") {

            alert(cardtoken.error.message)
            navigation.navigate("Mycart")

        }
    }

    // const fetchPaymentIntentClientSecret = async () => {
    //     let token = await getData()
    //     const response = await fetch("https://olikraft.com/api/letscms/v1/stripe/createPaymentIntent", {
    //       method: 'POST',
    //       headers: {
    //         letscms_token:token,
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         // paymentmethod:"card",
    //         // amount: 1099,
    //         "amount": "5000",
    //         "currency": "usd",
    //         "description": "Olikraft new",
    //         // "customer":"pi_3JTjXiEyBNY91bY31xsafO67_secret_FbC3Nkel7fnyB4gV4WS6MWs5C",
    //         "metadata": {
    //             "customer_name": "Dinesh Chandak",
    //             "customer_email": "shubhchintak.co@gmail.com",
    //             // "order_id": "9819",
    //             "site_url": "https://olikraft.com"
    //         },
    //         "capture_method": "automatic",
    //         "payment_method_types": {
    //             "0": "card"
    //         }
    //       }),
    //     });
    //     const {cs} = await response.json();
    //     // const clientSecret = 111111
    //     // const abc  = await response.json()
    //     // console.log("hello",await response.json())
    //     console.log(cs)
    //     return cs;



    // };

    const handlePayPress = async () => {

        // const billingDetails = {
        //     "amount": "4999",
        //     "currency": "usd",
        //     "description": "Olikraft new",
        //     // "customer":"pi_3JTjXiEyBNY91bY31xsafO67_secret_FbC3Nkel7fnyB4gV4WS6MWs5C",
        //     "metadata": {
        //         "customer_name": "Dinesh Chandak",
        //         "customer_email": "shubhchintak.co@gmail.com",
        //         // "order_id": "9819",
        //         "site_url": "https://olikraft.com"
        //     },
        //     "capture_method": "automatic",
        //     "payment_method_types": {
        //         "0": "card"
        //     }
        //   };
        // //   console.log("hellooooooo")
        //   // Fetch the intent client secret from the backend
        //   const clientSecret = await fetchPaymentIntentClientSecret();
        //   console.log(clientSecret)
        //   // Confirm the payment with the card details
        //   const {paymentIntent, error} = await confirmPayment(clientSecret, {
        //     type: 'Card',
        //     billingDetails,
        //   });

        //   if (error) {
        //     console.log('Payment confirmation error', error);
        //   } else if (paymentIntent) {
        //     console.log('Success from promise', paymentIntent);
        //   }


    };
    useEffect(() => {
        fetchcheckout()
    }, [])

    return (
        <View style={{flex:1,width:"100%",justifyContent:'center'}}>
            {rendercomplete && <View>
                <Appbar.Header style={styles.item}>
                    <Ionicons style={styles.icon} name="arrow-back" size={24} color="white" onPress={()=>
                        {navigation.goBack()}} />
                        <Appbar.Content title="Checkout" titleStyle={styles.title} />

                </Appbar.Header>
            </View>}
            {rendercomplete && <ScrollView style={{marginBottom:15}}>
                <Card style={{marginTop:20,borderRadius:10,elevation:10}}>
                    <View style={{flexDirection:"row"}}>
                        <Text style={{flex:1,fontSize:18,marginLeft:16,marginTop:10,fontWeight:"bold"}}>General
                            Information</Text>
                        {/* <View style={{marginTop:10,marginRight:15}}>
                            <EvilIcons name="pencil" size={30} color="black" />
                        </View> */}
                    </View>
                    <Card.Content>

                        <View>
                            <Text style={styles.name}>Name</Text>
                            <TextInput style={{ height: 20}} value={`${firstname} ${lastname}`}
                                placeholder="Full Name" />



                            <Text style={styles.name}>Email</Text>
                            <TextInput style={{ height: 20}} value={email} placeholder="Email" />


                            <Text style={styles.name}>Contact No#</Text>
                            <TextInput style={{ height: 20}} value={contact} placeholder="Enter here..." />
                        </View>
                    </Card.Content>


                </Card>


                {/* <Shippingaddress navigation={navigation} updatesa={updatesa} /> */}

                <View>
                {((countryShip.length>0 && StateShip.length>0 ) && rendercompleteShip) ? (<Card style={{marginTop:20,borderRadius:10,shadowColor:"grey",elevation:10}}>
                   <View style={{flexDirection:"row"}}>
                       <Text style={{flex:1,fontSize:18,marginLeft:16,marginTop:10,fontWeight:"bold",color:"black"}}>Shipping Address</Text>
                        <View style={{marginTop:10,marginRight:15}}>
                           <EvilIcons name="pencil" size={30} color="black" onPress={()=>{navigation.navigate("Address",{"name" :"shipping","data":shad,"clist":countrylist,"slist":Statelist})}}/>
                       </View>
                   </View>
                   <Card.Content style={{marginTop:10}}>
                       <Paragraph style={{fontSize:12,}}>{shad.first_name} {shad.last_name}</Paragraph>
                       <Paragraph style={{fontSize:12,}}>{shad.address_1}</Paragraph>
                       <Paragraph style={{fontSize:12,}}>{shad.address_2}</Paragraph>
                       <Paragraph style={{fontSize:12,}}>{shad.city} {shad.postcode}</Paragraph>
                        <Showcountrystate country={countryShip} state={StateShip} countrylist={countrylist} statelist={Statelist} updateaddressfetched={updateaddressfetched} isaddressfetched={isaddressfetched} /> 
                     </Card.Content>
                </Card>):(<Text style={{textAlign:"center",fontSize:25,margin:10}}>No Shipping Address Added</Text>)}
                       {( rendercompleteShip === false) && (<Card style={{marginTop:20,borderRadius:10,shadowColor:"grey",elevation:10}}>
                       <ActivityIndicator animating={true} color={"rgb(5,23,41)"} size="large"/>
                       </Card>) } 
               </View>

                {/* {
                checked
                ?
                <Billingaddress navigation={navigation} updateba={updateba} /> */}

                {/* <View style={{flexDirection:"row"}}>
                    <Checkbox status={checked ? 'checked' : 'unchecked' } onPress={()=> {
                        setChecked(!checked);
                        }}
                        color="black"
                        />
                        <Text style={{marginTop:6,color:"black"}}>Same as Billing address</Text>
                </View> */}
                <Card style={{marginTop:20,borderRadius:10,elevation:10}}>
                    <View style={{flexDirection:"row"}}>
                        <Text style={{flex:1,fontSize:18,marginLeft:16,marginTop:10,fontWeight:"bold"}}>Order Payment
                            Information</Text>
                        {/* <View style={{marginTop:10,marginRight:15}}>
                            <EvilIcons name="pencil" size={30} color="black" />
                        </View> */}
                    </View>
                    <Card.Content>
                        { route.params.cartitems.map((item,idx)=>{return(
                        <ScrollView contentContainerStyle={{flex:1,justifyContent:"center"}} key={item.product_id}>
                            <View style={{margin:15,flex:1}} key={idx}>
                                <Text style={{fontSize:13,fontWeight:"bold",marginBottom:5}}>
                                    {item.product_name}
                                </Text>

                                <View style={{flexDirection:"row"}}>
                                    <Text style={{color:"grey"}}>
                                        ${item.product_price} x {item.quantity}
                                    </Text>
                                    <Text
                                        style={{flex:1,fontWeight:"bold",fontSize:14,marginRight:"5%",textAlign:"right"}}>
                                        ${+Number(item.line_total).toFixed(2)}
                                    </Text>
                                </View>
                            </View>

                        </ScrollView>
                        )})}
                        <View style={{justifyContent:"flex-start",flex:1}}>
                            <View style={{justifyContent:"flex-end",borderBottomWidth:0.5,margin:10}}>
                                <View style={{flexDirection:'row',paddingBottom:5}}>
                                    <Text style={{flex:1,fontSize:13,fontWeight:"bold",marginLeft:5}}>
                                        Item Total
                                    </Text>
                                    <Text
                                        style={{flex:1,textAlign:"right",fontSize:13,fontWeight:"bold",marginRight:25}}>
                                        ${+Number(route.params.carttotals.cart_contents_total).toFixed(2)}
                                    </Text>
                                </View>
                                <View style={{flexDirection:'row',paddingBottom:10}}>
                                    <Text style={{flex:1,fontSize:13,fontWeight:"bold",marginLeft:5}}>
                                        Shipping
                                    </Text>
                                    <Text
                                        style={{flex:1,textAlign:"right",fontSize:13,fontWeight:"bold",marginRight:25}}>
                                        ${+Number(route.params.carttotals.shipping_total).toFixed(2)}
                                    </Text>
                                </View>
                                <View style={{flexDirection:'row',paddingBottom:10}}>
                                    <Text style={{flex:1,fontSize:13,fontWeight:"bold",marginLeft:5}}>
                                        Coupon Discounts
                                    </Text>
                                    <Text
                                        style={{flex:1,textAlign:"right",fontSize:13,fontWeight:"bold",marginRight:25}}>
                                        ${+Number(route.params.carttotals.discount_total).toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                            <View style={{marginHorizontal:10,marginBottom:15,justifyContent:"center"}}>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={{flex:1,fontSize:13,fontWeight:"bold",marginLeft:5}}>
                                        Grand Total
                                    </Text>
                                    <Text
                                        style={{flex:1,textAlign:"right",fontSize:13,fontWeight:"bold",marginRight:25}}>
                                        ${+Number(route.params.carttotals.total).toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {/* <View style={{flex:1,margin:15}}>
                            <Text style={{fontWeight:"bold",paddingVertical:10}}>Enter Mobile number:</Text>
                            <TextInput placeholder="Enter mobile number"
                                style={{borderWidth:1, height: 40,padding: 10,backgroundColor:"white"}}
                                onChangeText={setphone} value={phone} />
                        </View> */}
                    </Card.Content>


                </Card>
                <Card style={{marginTop:20,borderRadius:10,elevation:10}}>
                    <View>
                        <Text style={{fontWeight:"bold",marginHorizontal:15,marginTop:10}}>Enter your card details
                            here</Text>

                    </View>
                    {/* <CardField postalCodeEnabled={true} placeholder={{
                        number: '4242 4242 4242 4242',
                        }} cardStyle={{
                        backgroundColor: '#FFFFFF',
                        textColor: 'black',
                        }} style={{
                        width: '100%',
                        height: 50,
                        marginVertical: 10,
                        }} // onCardChange={(cardDetails)=> {
                        // console.log('cardDetails', cardDetails);
                        // }}
                        // onFocus={(focusedField) => {
                        // console.log('focusField', focusedField);
                        // }}
                        /> */}
                        <Card.Content>
                            <ScrollView>
                                <View style={styles.content}>
                                    <Text>Card Number</Text>
                                    <View style={styles.form}>
                                        <TextInput
                                            style={{ height: 40,padding: 10,backgroundColor:"white",borderRadius:8,borderWidth:0.5}}
                                            onChangeText={setcardnumber} value={cardnumber} keyboardType="number-pad"
                                            placeholder="4242424242424242" />
                                    </View>
                                    <View style={{flexDirection:"row"}}>
                                        <View style={{flex:1,margin:5}}>
                                            <Text>Expiry Month</Text>
                                            <View style={styles.form}>
                                                <TextInput
                                                    style={{ height: 40,padding: 10,backgroundColor:"white",borderRadius:8,borderWidth:0.5}}
                                                    onChangeText={setexpmonth} value={expmonth} keyboardType="number-pad"
                                                    placeholder="01 to 12" />
                                            </View>
                                        </View>
                                        <View style={{flex:1,margin:5}}>
                                            <Text>Expiry Year</Text>
                                            <View style={styles.form}>
                                                <TextInput
                                                    style={{ height: 40,padding: 10,backgroundColor:"white",textAlignVertical:"top",borderRadius:8,borderWidth:0.5}}
                                                    onChangeText={setexpyear} value={expyear} placeholder="year" keyboardType="number-pad" />
                                            </View>
                                        </View>
                                    </View>
                                    <Text>CVC</Text>
                                    <View style={styles.form}>
                                        <TextInput
                                            style={{ height: 40,padding: 10,backgroundColor:"white",borderRadius:8,borderWidth:0.5}}
                                            onChangeText={setcvc} value={cvc} placeholder="123" keyboardType="number-pad" />
                                    </View>

                                </View>
                            </ScrollView>
                        </Card.Content>
                        {/* <Button onPress={handlePayPress} title="Pay" /> */}
                </Card>


            </ScrollView>
            }
            {rendercomplete && <View>
                <View style={styles.button}>
                    <TouchableOpacity style={styles.cancel}>
                        <Text style={{fontSize:14,fontWeight:"bold"}}>Payable Amount</Text>
                        <Text
                            style={{fontSize:14,fontWeight:"bold"}}>${+Number(route.params.carttotals.total).toFixed(2)}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.send} onPress={()=>{

                        if(cardnumber&&expmonth&&expyear&&cvc)
                        {
                            placeorder()
                        }
                        else
                        {
                            alert("Please Fill your Card Details")
                        }


                    }}>
                        <Text style={{color:"white",fontSize:17,fontWeight:"bold"}}>Place Order</Text>
                    </TouchableOpacity>
                </View>
            </View>}
            {
            rendercomplete === false && <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <ActivityIndicator animating={true} color={"rgb(5,23,41)"} size="large" />
            </View>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgb(249,249,249)",

        height: "100%"
    },
    item: {
        backgroundColor: 'rgb(5,23,41)',
        height: Platform.OS === 'android' ? 35 : 55

    },
    icon: {
        marginLeft: 20
    },

    title: {
        fontSize: 17
    },
    content: {

        // borderWidth:1,
        // marginTop:10,
        padding: 20
    },
    form: {
        backgroundColor: "white",
        //  borderRadius:8,
        //  borderWidth:0.5,
        // padding:10,
        marginVertical: 10,
        borderColor: "grey",

    },
    name: {
        fontSize: 12,
        color: "grey",
        marginTop: 10,

    },

    button: {
        backgroundColor: "white",
        elevation: 5,
        // marginTop:10,
        borderColor: "grey",
        flexDirection: "row",
        padding: 15
    },
    cancel: {
        backgroundColor: "white",
        height: 50,
        width: 300,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "flex-start",
        flex: 1
    },
    send: {
        backgroundColor: "rgb(33,184,97)",
        height: 50,
        width: 300,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    }
})