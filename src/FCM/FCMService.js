import {Alert} from 'react-native';
import firebase from '@react-native-firebase/app';
import type {Notification, NotificationOpen} from 'react-native-firebase';

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListener(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  checkPermission = (onRegister) => {
    firebase
      .messaging()
      .hasPermission()
      .then((enable) => {
        enable ? this.getToken(onRegister) : this.requestPermission(onRegister);
      })
      .catch((er) => {
        console.log('permission rejected ', er);
      });
  };

  getToken = (onRegister) => {
    firebase
      .messaging()
      .getToken()
      .then((fcmToken) => {
        fcmToken
          ? onRegister(fcmToken)
          : console.log('usuario no tiene un token de dispositivo ', fcmToken);
      })
      .catch((er) => {
        console.log('getToken rejected ', er);
      });
  };

  requestPermission = (onRegister) => {
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch((er) => {
        console.log('Request Permission rejected ', er);
      });
  };

  deleteToken = () => {
    firebase
      .messaging()
      .deleteToken()
      .catch((er) => {
        console.log('Delete Token erro ', er);
      });
  };

  createNotificationListener = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    // Triggered para cuando se recibe una notificacion enstando en foreground
    this.notificationListener = firebase
      .messaging()
      .onMessage(async (remoteMessage) => {
        onNotification(remoteMessage.notification);
        Alert.alert(
          'A new notificacion in foreground',
          remoteMessage.notification.title,
        );
      });

    this.notificationBackgroundListener = firebase
      .messaging()
      .onNotificationOpenedApp((remoteMessage) => {
        console.log(
          'La notificación hizo que la aplicación se abriera desde el background state:',
          remoteMessage.notification,
        );
      });

    // Check whether an initial notification is available
    this.notificationQuitListener = firebase
      .messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'La notificación hizo que la aplicación se abriera desde el quit state:',
            remoteMessage.notification,
          );
        }
      });

    this.onTokenRefreshListener = firebase
      .messaging()
      .onTokenRefresh((fcmToken) => {
        console.log('new Token: ');
        onRegister(fcmToken);
      });
  };

  unRegister = () => {
    this.notificationListener();
    this.notificationBackgroundListener();
    this.notificationQuitListener();
    this.onTokenRefreshListener();
  };

  buildChannel = (obj) => {
    // return new firebase.notificacions.Android.Channel(
    //   obj.channelID,
    //   obj.channelName,
    //   firebase.notificacions.Android.Importance.High,
    // ).setDescription(obj.channelDes);
  };

  buildNotification = (obj) => {
    // For Android
    firebase.notificacions().android.createChannel(obj.channel);

    // For Android and IOS
    return (
      new firebase.notificacions.notificacion()
        .setSound(obj.sound)
        .setNotificationId(obj.dataId)
        .setTitle(obj.title)
        .setBody(obj.content)
        .setData(obj.data)
        // For Android
        .android.setChannelId(obj.channel.channelID)
        .android.setLargeIcon(obj.largeIcon)
        .android.setSmallIcon(obj.smallIcon)
        .android.setColor(obj.colorBgIcon)
        .android.setPriority(firebase.notificacions.Android.Priority.High)
        .android.setVibrate(obj.vibrate)
        .android.setAutoCancel(true)
    );
  };

  scheduleNotification = (notificacion, days, minutes) => {
    const date = new Date();
    if (days) {
      date.setDate(date.getDate() + days);
    }
    if (minutes) {
      date.setMinutes(date.getMinutes + minutes);
    }

    firebase
      .notificacions()
      .scheduleNotification(notificacion, {fireDate: date.getTime()});
  };

  displayNotification = (notificacion) => {
    firebase
      .notificacions()
      .displayNotification(notificacion)
      .catch((er) => console.log('display notification error: ', er));
  };

  removeDeliveredNotification = (notificacion) => {
    firebase
      .notificacions()
      .removeDeliveredNotification(notificacion.notificacionId);
  };
}
export const fcmService = new FCMService();
