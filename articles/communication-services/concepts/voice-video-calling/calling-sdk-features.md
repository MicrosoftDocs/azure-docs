---
title: Azure Communication Services calling client library overview
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the calling client library.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2021
ms.topic: overview
ms.service: azure-communication-services
---
# Calling client library overview

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]


There are two separate families of Calling client libraries, for *clients* and *services.* Currently available client libraries are intended for end-user experiences: websites and native apps.

The Service client libraries are not yet available, and provide access to the raw voice and video data planes, suitable for integration with bots and other services.

## Calling client library capabilities

The following list presents the set of features which are currently available in the Azure Communication Services Calling client libraries.

| Group of features | Capability                                                                                                          | JS  | Java (Android) | Objective-C (iOS)
| ----------------- | ------------------------------------------------------------------------------------------------------------------- | ---  | -------------- | -------------
| Core Capabilities | Place a one-to-one call between two users                                                                           | ✔️   | ✔️            | ✔️
|                   | Place a group call with more than two users (up to 350 users)                                                       | ✔️   | ✔️            | ✔️
|                   | Promote a one-to-one call with two users into a group call with more than two users                                 | ✔️   | ✔️            | ✔️
|                   | Join a group call after it has started                                                                              | ✔️   | ✔️            | ✔️
|                   | Invite another VoIP participant to join an ongoing group call                                                       | ✔️   | ✔️            | ✔️
|  Mid call control | Turn your video on/off                                                                                              | ✔️   | ✔️            | ✔️ 
|                   | Mute/Unmute mic                                                                                                     | ✔️   | ✔️            | ✔️         
|                   | Switch between cameras                                                                                              | ✔️   | ✔️            | ✔️           
|                   | Local hold/un-hold                                                                                                  | ✔️   | ✔️            | ✔️           
|                   | Active speaker                                                                                                      | ✔️   | ✔️            | ✔️           
|                   | Choose speaker for calls                                                                                            | ✔️   | ✔️            | ✔️           
|                   | Choose microphone for calls                                                                                         | ✔️   | ✔️            | ✔️           
|                   | Show state of a participant<br/>*Idle, Early media, Connecting, Connected, On hold, In Lobby, Disconnected*         | ✔️   | ✔️            | ✔️           
|                   | Show state of a call<br/>*Early Media, Incoming, Connecting, Ringing, Connected, Hold, Disconnecting, Disconnected* | ✔️   | ✔️            | ✔️           
|                   | Show if a participant is muted                                                                                      | ✔️   | ✔️            | ✔️           
|                   | Show the reason why a participant left a call                                                                       | ✔️   | ✔️            | ✔️     
| Screen sharing    | Share the entire screen from within the application                                                                 | ✔️   | ❌            | ❌           
|                   | Share a specific application (from the list of running applications)                                                | ✔️   | ❌            | ❌           
|                   | Share a web browser tab from the list of open tabs                                                                  | ✔️   | ❌            | ❌           
|                   | Participant can view remote screen share                                                                            | ✔️   | ✔️            | ✔️         
| Roster            | List participants                                                                                                   | ✔️   | ✔️            | ✔️           
|                   | Remove a participant                                                                                                | ✔️   | ✔️            | ✔️         
| PSTN              | Place a one-to-one call with a PSTN participant                                                                     | ✔️   | ✔️            | ✔️   
|                   | Place a group call with PSTN participants                                                                           | ✔️   | ✔️            | ✔️
|                   | Promote a one-to-one call with a PSTN participant into a group call                                                 | ✔️   | ✔️            | ✔️
|                   | Dial-out from a group call as a PSTN participant                                                                    | ✔️   | ✔️            | ✔️   
| General           | Test your mic, speaker, and camera with an audio testing service (available by calling 8:echo123)                   | ✔️   | ✔️            | ✔️ 
| Device Management | Ask for permission to use  audio and/or video                                                                       | ✔️   | ✔️            | ✔️
|                   | Get camera list                                                                                                     | ✔️   | ✔️            | ✔️ 
|                   | Set camera                                                                                                          | ✔️   | ✔️            | ✔️
|                   | Get selected camera                                                                                                 | ✔️   | ✔️            | ✔️
|                   | Get microphone list                                                                                                 | ✔️   | ✔️            | ✔️
|                   | Set microphone                                                                                                      | ✔️   | ✔️            | ✔️
|                   | Get selected microphone                                                                                             | ✔️   | ✔️            | ✔️
|                   | Get speakers list                                                                                                   | ✔️   | ✔️            | ✔️
|                   | Set speaker                                                                                                         | ✔️   | ✔️            | ✔️
|                   | Get selected speaker                                                                                                | ✔️   | ✔️            | ✔️
| Video Rendering   | Render single video in many places (local camera or remote stream)                                                  | ✔️   | ✔️            | ✔️
|                   | Set / update scaling mode                                                                                           | ✔️   | ✔️            | ✔️ 
|                   | Render remote video stream                                                                                          | ✔️   | ✔️            | ✔️

## Calling client library streaming support
The Communication Services calling client library supports the following streaming configurations:

| Limit          |Web | Android/iOS|
|-----------|----|------------|
|**# of outgoing streams that can be sent simultaneously** |1 video + 1 screen sharing | 1 video + 1 screen sharing|
|**# of incoming streams that can be rendered simultaneously** |1 video + 1 screen sharing| 6 video + 1 screen sharing |

## Calling client library timeouts

The following timeouts apply to the Communication Services calling client libraries:

| Action           | Timeout in seconds |
| -------------- | ---------- |
| Reconnect/removal participant | 120 |
| Add or remove new modality from a call (Start/stop video or screen sharing) | 40 |
| Call Transfer operation timeout | 60 |
| 1:1 call establishment timeout | 85 |
| Group call establishment timeout | 85 |
| PSTN call establishment timeout | 115 |
| Promote 1:1 call to a group call timeout | 115 |

## JavaScript calling client library support by OS and browser

The following table represents the set of supported browsers which are currently available. We support the most recent three versions of the browser unless otherwise indicated.

| Platform                         | Chrome | Safari*  | Edge (Chromium) | 
| -------------------------------- | -------| ------  | --------------  |
| Android                          |  ✔️    | ❌     | ❌             |
| iOS                              |  ❌    | ✔️**** | ❌             |
| macOS***                         |  ✔️    | ✔️**   | ❌             |
| Windows***                       |  ✔️    | ❌     | ✔️             |
| Ubuntu/Linux                     |  ✔️    | ❌     | ❌             |

*Safari versions 13.1+ are supported, 1:1 calls are not supported on Safari. 

**Safari 14+/macOS 11+ needed for outgoing video support. 

***Outgoing screen sharing is supported only on desktop platforms (Windows, macOS, and Linux), regardless of the browser version, and is not supported on any mobile platform (Android, iOS, iPad, and tablets).

****An iOS app on Safari can't enumerate/select mic and speaker devices (for example, Bluetooth); this is a limitation of the OS, and there's always only one device.


## Calling client - browser security model

### User WebRTC over HTTPS

WebRTC APIs like `getUserMedia` require that the app that calls these APIs is served over HTTPS.

For local development, you can use `http://localhost`.

### Embed the Communication Services Calling SDK in an iframe

A new [permissions policy (also called a feature policy)](https://www.w3.org/TR/permissions-policy-1/#iframe-allow-attribute) is being adopted by various browsers. This policy affects calling scenarios by controlling how applications can access a device's camera and microphone through a cross-origin iframe element.

If you want to use an iframe to host part of the app from a different domain, you must add the `allow` attribute with the correct value to your iframe.

For example, this iframe allows both camera and microphone access:

```html
<iframe allow="camera *; microphone *">
```

## Next steps

> [!div class="nextstepaction"]
> [Get started with calling](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

For more information, see the following articles:
- Familiarize yourself with general [call flows](../call-flows.md)
- Learn about [call types](../voice-video-calling/about-call-types.md)
- [Plan your PSTN solution](../telephony-sms/plan-solution.md)
