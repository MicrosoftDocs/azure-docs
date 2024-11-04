---
title: Developer integration with multimedia redirection for WebRTC-based calling apps in a remote session
description: Learn how to integrate a website with multimedia redirection for WebRTC-based calling apps in a remote session from Azure Virtual Desktop, a Windows 365 Cloud PC, or Microsoft Dev Box.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 10/04/2024
---

# Developer integration with multimedia redirection for WebRTC-based calling apps in a remote session

Multimedia redirection redirects video playback and calls in a remote session from Azure Virtual Desktop, a Windows 365 Cloud PC, or Microsoft Dev Box to your local device for faster processing and rendering.

Call redirection optimizes audio calls for WebRTC-based calling apps, reducing latency, and improving call quality. The connection happens between the local device and the telephony app server, where WebRTC calls are offloaded from a remote session to a local device. After the connection is established, call quality becomes dependent on the web page or app providers, just as it would with a non-redirected call.

Call redirection can work with most WebRTC-based calling apps without modifications. However, there might be unsupported scenarios or you might want to provide a different experience in a remote session. 

This article provides information about supported API interfaces and instance methods, and shows JavaScript code snippets that you can use with the [`mediaDevices` property of the Navigator interface](https://developer.mozilla.org/docs/Web/API/Navigator/mediaDevices).

The navigator interface is part of the [Media Capture and Streams API](https://developer.mozilla.org/docs/Web/API/Media_Capture_and_Streams_API) to integrate your website with call redirection. Together with the [WebRTC API](https://developer.mozilla.org/docs/Web/API/WebRTC_API), these APIs provide support for streaming audio and video data with WebRTC-based calling apps. Multimedia redirection replaces the implementation of the `mediaDevices` object in the APIs to detect call redirection, handle disconnection and reconnection events, and collect diagnostic information.

> [!TIP]
> When you want to test your integration with multimedia redirection, you can enable call redirection to be available for all websites. For more information, see [Enable call redirection for all sites for testing](multimedia-redirection-video-playback-calls.md#enable-call-redirection-for-all-sites-for-testing).

## Supported API interfaces and instance methods

Call redirection is designed to seamlessly replace standard WebRTC usage with an implementation that redirects calls from a remote session to the local device.

Here's a list of the supported interfaces and instance methods used by call redirection from the [Media Capture and Streams API](https://developer.mozilla.org/docs/Web/API/Media_Capture_and_Streams_API) and [WebRTC API](https://developer.mozilla.org/docs/Web/API/WebRTC_API):

- [`AnalyserNode`](https://developer.mozilla.org/docs/Web/API/AnalyserNode)
- [`AudioContext`](https://developer.mozilla.org/docs/Web/API/AudioContext)
- [`HTMLAudioElement`](https://developer.mozilla.org/docs/Web/API/HTMLAudioElement)
- [`MediaDevices`](https://developer.mozilla.org/docs/Web/API/MediaDevices)
    - [`enumerateDevices`](https://developer.mozilla.org/docs/Web/API/MediaDevices/enumerateDevices)
    - [`getUserMedia`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getUserMedia)
- [`MediaStream`](https://developer.mozilla.org/docs/Web/API/MediaStream)
- [`MediaStreamAudioDestinationNode`](https://developer.mozilla.org/docs/Web/API/MediaStreamAudioDestinationNode)
- [`MediaStreamAudioSourceNode`](https://developer.mozilla.org/docs/Web/API/MediaStreamAudioSourceNode)
- [`MediaStreamTrack`](https://developer.mozilla.org/docs/Web/API/MediaStreamTrack)
- [`RTCDataChannel`](https://developer.mozilla.org/docs/Web/API/RTCDataChannel)
- [`RTCPeerConnection`](https://developer.mozilla.org/docs/Web/API/RTCPeerConnection)
- [`RTCRtpReceiver`](https://developer.mozilla.org/docs/Web/API/RTCRtpReceiver)
- [`RTCRtpSender`](https://developer.mozilla.org/docs/Web/API/RTCRtpSender)
- [`RTCRtpTransceiver`](https://developer.mozilla.org/docs/Web/API/RTCRtpTransceiver)

### Known limitations

Call redirection has the following API limitations:

- Only a limited number of `WebAudio` nodes are supported currently.

- `setSinkId` on an `HTMLAudioElement` works for WebRTC `srcObject` tracks, however any local playback, such as a ringtone, always plays on the default audio output of the remote session.

- As some APIs return synchronously under normal conditions but have to be proxies when used with call redirection, it's possible that the state of an object isn't available immediately.

## Detect call redirection

To detect whether call redirection is active, you can check the `isCallRedirectionEnabled` property of the `MediaDevices` object. If this property is `true`, call redirection is active. If this property is `undefined` or `false`, call redirection isn't active.

```javascript
window.navigator.mediaDevices['isCallRedirectionEnabled'] = true;
```

## Detect disconnection from a remote session

When a user disconnects and reconnects to a remote session when using call redirection on a web page, the local WebRTC instance that supported the objects is no longer available. Typically, if a user refreshes the page, they're able to make calls again.

The web page can detect and handle these disconnect and reconnect events by tearing down and recreating all WebRTC objects, audio or video elements, and `MediaStream` or `MediaStreamTrack` interfaces. This approach eliminates the need to refresh the web page.

To get notified of these events, register the `rdpClientConnectionStateChanged` event on the `MediaDevices` object, as shown in the following example. This event contains the new state, which can be either `connected` or `disconnected`.

```javascript
navigator.mediaDevices.addEventListener('rdpClientConnectionStateChanged', () => 
    console.log("state change: " + event.detail.state);
);
```

## Call redirection diagnostics

The following example lists the properties exposed on the `MediaDevices` object. They provide specific diagnostic info about the versions of call redirection being used and session identifiers. This information is useful when reporting issues to Microsoft and we recommend you collect it as part of your own telemetry or diagnostics data.

```javascript
window.navigator.mediaDevices['mmrClientVersion'];
window.navigator.mediaDevices['mmrHostVersion'];
window.navigator.mediaDevices['mmrExtensionVersion'];

window.navigator.mediaDevices['activityId'];
window.navigator.mediaDevices['connectionId'];
```

Here's what each property represents:

- **mmrClientVersion**: the version of the file `MsMmrDVCPlugin.dll` on the local machine, which comes as part of Windows App and the Remote Desktop app.

- **mmrHostVersion**: the version of the file `MsMMRHost.exe` installed on the session host, Cloud PC, or dev box.

- **mmrExtensionVersion**: the version of the Microsoft Multimedia Redirection extension running in the browser.

- **activityId**: a unique identifier that Microsoft uses to associate telemetry to a specific session and maps to current web page multimedia redirection is redirecting.

- **connectionId**: a unique identifier that Microsoft uses to associate telemetry to a specific session and relates to the given connection between the local device and the remote session.

All of this information is available to the end user in the details of the browser extension, but this example provides a programmatic way to collect it.

## Call redirection logs 

By default, multimedia redirection doesn't log to the console. The browser extension has a button to for users to collect logs. The following example shows how you can enable console logs programmatically. You might want to do enable console logs programmatically if you're working on integration or capturing an issue that requires longer running logs than the option in the browser extension interface provides.

```javascript
window.navigator.mediaDevices['mmrConsoleLoggingEnabled'] = true;
```

You might also want to programmatically collect multimedia redirection logs to aid in investigations. All logs for the web page are also available by registering for the `mmrExtensionLog` event on the document.

The event object has two properties under **detail**:

- **Level**: denotes what kind of trace the entry is and allows you to filter for specific events. Level is one of the following values: 
   - info
   - verbose
   - warning
   - error

- **Message**: the text-based trace message.

The following example shows how to register for the `mmrExtensionLog` event:

```javascript
document.addEventListener('mmrExtensionLog', () =>
    console.log("MMR event, level:" + event.detail.level + " : " + event.detail.message);
);
```

## Related content

Learn more about [Multimedia redirection for video playback and calls in a remote session](multimedia-redirection-video-playback-calls.md).
