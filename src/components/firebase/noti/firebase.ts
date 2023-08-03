import firebase from "firebase/app";
import "firebase/messaging";
import { firebaseConfig } from './constants';
import axios from "axios";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export let messaging: firebase.messaging.Messaging;

if (typeof window !== "undefined") {
  if (firebase.messaging.isSupported()) {
    messaging = firebase.messaging();
  }
}

export const getMessagingToken = async () => {
  let currentToken = "";
  if (!messaging) return;
  try {
    currentToken = await messaging.getToken({
      vapidKey: "BBC2euNKlvhHISl315JT_S2j8K42u5ajLUFvP7GQ5pn-MDAd8WF2LfdNk4vgdwvsX-dAEfnaAviZdsB33_8NHmY",
    });
    subscribeTokenToTopic(currentToken, "all");
    console.log("FCM registration token", currentToken);
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
  }
  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });

const subscribeTokenToTopic = (token: string, topic: string) => {
  fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
      method: 'POST',
      headers: new Headers({
          //Authorization: `key=AAAAwdTHxo8:APA91bHHAvF2F96v_QzRdt6_vutnXQXRml_sEc4eudh7XMhf8gkf-moefvA_9_LwPq29NQkDYGWTpTpvAZxBIhsB364SJ_2_8KOm70RYkx7cud_Ir8BDAqDggqu2IwRNeBYlHvIj_vbJ`
          Authorization: `key=AAAAiEbawrc:APA91bHuAJwzsawDC60mbs43VQfj66I2u5XUXjeFqaSTu8qineKoRoXxUi5NVIMUfX9J3IDBHBYQIRLwJu9DMjrBST-qEzJ81tW52XsD2_2Kj4tatrAT8jW2L9hRGg7Vv6oQEzOrHNsp`
      })
  })
      .then((response) => {
          if (response.status < 200 || response.status >= 400) {
              console.log(response.status, response);
          }
          console.log(`"${topic}" is subscribed`);
      })
      .catch((error) => {
          console.error(error.result);
      });
  return true;
};

export const setTokenSentToServer = (sent: string) => {
  window.localStorage.setItem('sentToServer', sent ? "1" : "0");
}
export const isTokenSentToServer = () => {
  return window.localStorage.getItem('sentToServer') === '1';
}

export const saveToken = (token : string) => {
  localStorage.setItem('tokenNoti', token);
  // $(".container-bell").addClass('smallBell');
  // $(".tooltipBig").hide();
  // $(".tooltipSmall").show();

  if (token) {
    messaging.deleteToken(token);
  }

  //parameters
  var deviceID = token;
  var userAgent = navigator.userAgent;
  var appName = "EZTRADE";

  axios.post('http://eztrade0.fpts.com.vn/api/ApiData/DeviceUserInfoUpdate', {
    Deviceid: deviceID,
    Useragent: userAgent,
    Appname: appName
})
  .then(response => {
    // Trả về phản hồi từ server API cho client
    console.log(response.data);
  })
  .catch(error => {
    // Trả về lỗi cho client nếu có lỗi xảy ra trong quá trình gửi yêu cầu hoặc nhận phản hồi từ server API
    console.log(error);
  });
}