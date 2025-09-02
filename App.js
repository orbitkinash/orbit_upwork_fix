/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  Platform,
  View,
} from 'react-native';

import {StripeProvider} from '@stripe/stripe-react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {store, persistor} from './src/store/index';
import {PersistGate} from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {HomeRoutes, BottomTabRoutes} from './src/NavigationRoutes';
import Home_Header from './src/shares/Home_Header';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';

import Splash from './src/screens/splash/index';
import My_Account from './src/screens/account/my-account';
import SMSHistory from './src/screens/account/sms_history/index';
import RequestHistory from './src/screens/account/request_history/index';
import PurchaseHistory from './src/screens/account/purchase_history/index';
import RequestDashboard from './src/screens/account/request_dashboard/index';
import RemitDashboard from './src/screens/account/remit_dashboard/index';
import SentDetails from './src/screens/account/remit_dashboard/sent_details';
import RecieveDetails from './src/screens/account/remit_dashboard/recieve_details';
import choosePlan from './src/screens/topup/choosePlan';
import RemitForm from './src/screens/topup/remitForm';
import RemitPay from './src/screens/topup/remitPay';
import Complete from './src/screens/topup/Complete';
import Step3 from './src/screens/topup/confirmPayment';
import SMS_Package from './src/screens/sms/sms_package';
import Buy_SMS from './src/screens/sms/buy_sms';
import RequestPlans from './src/screens/request/requestPlans';
import RequestSubmit from './src/screens/request/requestSubmit';
import RequestSuccess from './src/screens/request/requestSuccess';
import Contact from './src/screens/contact/index';
import FBpage from './src/screens/fb_page/index';
import FAQ from './src/screens/FAQ/index';
import SetPin from './src/screens/pin/index';
import Pin_Auth from './src/screens/pin/verify_pin';
import Check_pin from './src/screens/pin/check_otp';
import ResetPin from './src/screens/pin/reset_pin';
import Notification from './src/screens/notifications/index';
//  import TermsCondition from './src/screens/terms_cond/index';
import {TermsCondition} from './src/screens/terms_cond';
import axios from 'axios';
import { Base_URL } from './src/config';

const API_URL=`${Base_URL}notifications/push/save`;

const Stack = createStackNavigator();

////emewa99@yahoo.com
////Godislove@2023///

messaging().setBackgroundMessageHandler(async remoteMessage => {
  const user_token = await AsyncStorage.getItem('user_token');
  showMessage({
    message: remoteMessage.notification.title,
    description: remoteMessage.notification.body,
    position: 'top',
    type: 'info',
    autoHide: false,
  });

  const res = await axios({
    url:API_URL,
    method:'POST',
    headers:{
      "Accept": "application/json",
      "x-api-key": "3fd7977b-90b3-435f-b78a-eb53452a9e1d",
      "Authorization": `Bearer ${user_token}`,  // Ensure `token` is defined and accessible
      "Content-Type": "application/json",
    },
    data:remoteMessage,
  })
});

const App = () => {
  const [user, setuser] = useState('');

  const requestUserPermission =async()=>{
    const authStatus =await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        // console.log('Notification authorization status:', authStatus);
        getToken();
      }
  }

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    await AsyncStorage.setItem('fcm_token', token);
  };

  useEffect(() => {
    // messaging()
    //   .getToken()
    //   .then(token => {
    //     console.log('fcm_token --------------- > ', token);
    //     //this._onChangeToken(token, language)
    //     // console.log('token is ', token)
    //     AsyncStorage.setItem('fcm_token', token);
    //   });  

      requestUserPermission();

      const unsubscribe = messaging().onMessage(async remoteMessage => {
        const user_token = await AsyncStorage.getItem('user_token');
        showMessage({
          message: remoteMessage.notification?.title,
          description: remoteMessage.notification?.body,
          position: 'top',
          type: 'info',
          autoHide: false,
        });

        const res = await axios({
          url:API_URL,
          method:'POST',
          headers:{
            "Accept": "application/json",
            "x-api-key": "3fd7977b-90b3-435f-b78a-eb53452a9e1d",
            "Authorization": `Bearer ${user_token}`,  // Ensure `token` is defined and accessible
            "Content-Type": "application/json",
          },
          data:remoteMessage,
        })
      });

      messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {

          showMessage({
            message: remoteMessage.notification?.title,
            description: remoteMessage.notification?.body,
            position: 'top',
            type: 'info',
            autoHide: false,
          });
        }
      });

    return unsubscribe;

    // const subscribe = messaging().onMessage(async remoteMessage => {
    //   // console.log("=======================msg", remoteMessage)
    //   //alert(remoteMessage.notification.body);
    //   showMessage({
    //     message: remoteMessage.notification.title,
    //     description: remoteMessage.notification.body,
    //     position: 'top',
    //     type: 'info',
    //     autoHide: false,
    //   });

    //   // Handle notification that opens the app from a quit state
    //   messaging()
    //     .getInitialNotification()
    //     .then(remoteMessage => {
    //       if (remoteMessage) {
    //         console.log(
    //           'Notification caused app to open from quit state:',
    //           remoteMessage.notification,
    //         );
    //       }
    //     });
    // });

    // return subscribe;
  }, []);

  return (
    <AlertNotificationRoot>
      <StripeProvider
        publishableKey="pk_test_fDGlHWY1Cg8vftd23bO0GgHx"
        // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        merchantIdentifier={
          Platform.OS == 'ios' ? 'merchant.com.orbitrecharge' : 'com.orbit'
        } // required for Apple Pay
      >
        <SafeAreaView style={{flex: 1}}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <StatusBar backgroundColor="rgba(0, 0, 0, 0.6)"></StatusBar>
              <NavigationContainer>
                <Stack.Navigator initialRouteName="Splash">
                  <Stack.Screen
                    name="Splash"
                    component={Splash}
                    options={{headerShown: false}}
                  />

                  <Stack.Screen
                    name="HomeRoutes"
                    component={HomeRoutes}
                    options={{headerShown: false}}
                  />

                  <Stack.Screen
                    name="BottomTabRoutes"
                    component={BottomTabRoutes}
                    options={{headerShown: false}}
                  />
                  {/* <Stack.Screen
                name="Home_Header"
                component={Home_Header}
                options={{ headerShown: false }}
              /> */}
                  <Stack.Screen
                    name="choosePlan"
                    component={choosePlan}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Step3"
                    component={Step3}
                    options={{headerShown: false}}
                  />

                  <Stack.Screen
                    name="Complete"
                    component={Complete}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="RemitForm"
                    component={RemitForm}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="RemitPay"
                    component={RemitPay}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="My_Account"
                    component={My_Account}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="SMS_Package"
                    component={SMS_Package}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="SMSHistory"
                    component={SMSHistory}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="RequestHistory"
                    component={RequestHistory}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="PurchaseHistory"
                    component={PurchaseHistory}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="RequestDashboard"
                    component={RequestDashboard}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="RemitDashboard"
                    component={RemitDashboard}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="SentDetails"
                    component={SentDetails}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="RecieveDetails"
                    component={RecieveDetails}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Buy_SMS"
                    component={Buy_SMS}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="RequestPlans"
                    component={RequestPlans}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="RequestSubmit"
                    component={RequestSubmit}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="RequestSuccess"
                    component={RequestSuccess}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="FAQ"
                    component={FAQ}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="FBpage"
                    component={FBpage}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Contact"
                    component={Contact}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="SetPin"
                    component={SetPin}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Pin_Auth"
                    component={Pin_Auth}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Check_pin"
                    component={Check_pin}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="ResetPin"
                    component={ResetPin}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Notification"
                    component={Notification}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="TermsCondition"
                    component={TermsCondition}
                    options={{headerShown: false}}
                  />
                </Stack.Navigator>
              </NavigationContainer>
              {/* <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.6)'}} > */}
              <FlashMessage
                //style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.6)'}}
                position="center"
              />
              {/* </View> */}
            </PersistGate>
          </Provider>
        </SafeAreaView>
      </StripeProvider>
    </AlertNotificationRoot>
  );
};

export default App;
