---
ms.author: enricohuang
title: Azure Communication Calling Web SDK in Android WebView environment
titleSuffix: An Azure Communication Services document
description: In this quickstart, you'll learn how to integrate Azure Communication Calling WebJS SDK in an Android WebView environment
author: sloanster
services: azure-communication-services
ms.date: 12/09/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
---

Webview technology is an embeddable browser that can be integrated directly into a native mobile application. If you want to develop an Azure Communication Services calling application directly a native Android application, besides using the Azure Communication Calling Android SDK, you can also use Azure Communication Calling Web SDK on Android WebView. In this quickstart, you'll learn how to run webapps developed with the Azure Communication Calling Web SDK in an Android WebView environment.

## Prerequisites
[!INCLUDE [Public Preview](../../../../includes/public-preview-include-document.md)]

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Android Studio](https://developer.android.com/studio), for creating your Android application.
- A web application using the Azure Communication Calling Web SDK. [Get started with the web calling sample](../../../../samples/web-calling-sample.md).

 This quickstart guide assumes that you already have an Android WebView application.
 If you don't have one, you can [download the WebViewQuickstart sample app](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/WebViewQuickstart).

 If you use the [WebViewQuickstart sample app](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/WebViewQuickstart),
 all the necessary configurations and permission handling are in place. You can skip to Known Issues.
 All you have to do is update the `defaultUrl` in `MainActivity` to the url of the calling web application you deployed and build the application.

## Add permissions to application manifest

To request the permissions required to make a call, you must declare the permissions in the application manifest. (app/src/main/AndroidManifest.xml)
Make sure you have the following permissions added to the application manifest:
```xml
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.CAMERA" />
```

## Request permissions at run time
Adding permissions to the application manifest isn't enough. You must also [request the dangerous permissions at runtime](https://developer.android.com/training/permissions/requesting) to access camera and microphone.

You have to call `requestPermissions()` and override `onRequestPermissionsResult`.
Besides app permissions, you have to handle browser permission requests by overriding `WebChromeClient.onPermissionRequest`

The [WebViewQuickstart sample app](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/WebViewQuickstart)
also shows how to handle permission requests from browser and request app permissions at runtime.

## WebView configuration
Azure Communication Calling Web SDK requires JavaScript enabled.
In some cases, we saw `play() can only be initiated by a user gesture` error message in Android WebView environment, and users aren't able to hear incoming audio.
Therefore, we recommend setting  `MediaPlaybackRequiresUserGesture` to false.

```java
WebSettings settings = webView.getSettings();
settings.setJavaScriptEnabled(true);
settings.setMediaPlaybackRequiresUserGesture(false);
```

## Known issues

### MediaDevices.enumerateDevices() API returns empty labels

  It's a [known issue](https://bugs.chromium.org/p/chromium/issues/detail?id=669492) on Android WebView.
  The issue will affect the following API in Web SDK:

- DeviceManager.getCameras()
- DeviceManager.getMicrophones()
- DeviceManager.getSpeakers() (If the device supports speaker enumeration)

  The value of name field in the result object will be an empty string. This issue won't affect the function of streaming in the video call but the application users won't be able to know the camera label they select for sending the video.
  To provide a better UI experience, you can use the following workaround in the web application to get device labels and map the label by `deviceId`.

  Although we can't get device labels from MediaDevices.enumerateDevices(), we can get the label from MediaStreamTrack.
  This workaround requires the web application to use getUserMedia to get the stream and map the `deviceId`.
  If there are many cameras and microphones on the Android device, it may take a while to collect labels.

```js
async function getDeviceLabels() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const result = {};
    for (let i = 0; i < devices.length; i++) {
        const device = devices[i];
        if(device.kind != 'audioinput' && device.kind != 'videoinput') continue;
        if(device.label) continue;
        const deviceId = device.deviceId;
        const deviceConstraint = {
            deviceId: {
                exact: deviceId
            }
        };		
        const constraint = (device.kind == 'audioinput') ?
                { audio: deviceConstraint } :
                { video: deviceConstraint };
		try {
            const stream =  await navigator.mediaDevices.getUserMedia(constraint);
            stream.getTracks().forEach(track => {
                let namePrefix = '';
                if (device.kind == 'audioinput') {
                    namePrefix = 'microphone:';
                } else if(device.kind == 'videoinput') {
                    namePrefix = 'camera:';
                }
                if (track.label === '' && deviceId == 'default') {
                    result[namePrefix + deviceId] = 'Default';
                } else {
                    result[namePrefix + deviceId] = track.label;
                }
                track.stop();
            });
		} catch(e) {
		    console.error(`get stream failed: ${device.kind} ${deviceId}`, e);
		}
    }
    return result;
}
```

:::image type="content" source="../../media/android-webview/get-device-label.png" alt-text="Screenshot of getDeviceLabels() result.":::

After you get the mapping between deviceId and label, you can use it to relate the label with the `id` from `DeviceManager.getCameras()` or `DeviceManager.getMicrophones()`

:::image type="content" source="../../media/android-webview/device-name-workaround.png" alt-text="Screenshot showing the device name workaround.":::
