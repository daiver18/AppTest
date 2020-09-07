import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {fcmService} from './src/FCM/FCMService';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    fcmService.register(
      this.onRegister,
      this.onNotification,
      this.onOpenNotification,
    );
  }

  onRegister = (token) => {
    console.log('[NotificationFCM] onRegister:  ', token);
  };

  onNotification = (notify) => {
    console.log('[NotificationFCM] onNotification:  ', notify);
  };

  onOpenNotification = (notify) => {
    console.log('[NotificationFCM] onOpenNotification:  ', notify);
  };

  render() {
    console.log('run App');
    return (
      <View style={styles.container}>
        <TouchableOpacity onPressIn={() => console.log('pressed')}>
          <Text> App RNPushNotifiaction with firebase </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
