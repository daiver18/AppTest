/**
 * @format
 */
import React from 'react';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

firebase.messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Mensaje manejado en el background!', remoteMessage);
});

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
