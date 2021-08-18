---
title: Azure Communication Services Calling SDK overview
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the Calling SDK.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 06/30/2021
ms.topic: overview
ms.service: azure-communication-services
---
# Calling SDK overview

[!INCLUDE [SDP Plan B Deprecation Notice](../../includes/plan-b-sdp-deprecation.md)]

The Calling SDK enables end-user devices to drive voice and video communication experiences. This page provides detailed descriptions of Calling features, including platform and browser support information. To get started right away, please check out [Calling quickstarts](../../quickstarts/voice-video-calling/getting-started-with-calling.md) or [Calling hero sample](../../samples/calling-hero-sample.md). 

Once you've started development, check out the [known issues page](../known-issues.md) to find bugs we're working on.

Key features of the Calling SDK:

- **Addressing** - Azure Communication Services provides generic [identities](../identity-model.md) that are used to address communication endpoints. Clients use these identities to authenticate to the service and communicate with each other. These identities are used in Calling APIs that provides clients visibility into who is connected to a call (the roster).
- **Encryption** - The Calling SDK encrypts traffic and prevents tampering on the wire. 
- **Device Management and Media** - The Calling SDK provides facilities for binding to audio and video devices, encodes content for efficient transmission over the communications dataplane, and renders content to output devices and views that you specify. APIs are also provided for screen and application sharing.
- **PSTN** - The Calling SDK can receive and initiate voice calls with the traditional publically switched telephony system, [using phone numbers you acquire in the Azure portal](../../quickstarts/telephony-sms/get-phone-number.md) or programmatically.
- **Teams Meetings** - The Calling SDK can [join Teams meetings](../../quickstarts/voice-video-calling/get-started-teams-interop.md) and interact with the Teams voice and video dataplane. 
- **Notifications** - The Calling SDK provides APIs allowing clients to be notified of an incoming call. In situations where your app is not running in the foreground, patterns are available to [fire pop-up notifications](../notifications.md) ("toasts") to inform end-users of an incoming call. 

## Detailed capabilities 

The following list presents the set of features which are currently available in the Azure Communication Services Calling SDKs.


| Group of features | Capability                                                                                                          | JS  | Windows | Java (Android) | Objective-C (iOS) |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- | --- | ------- | -------------- | ----------------- |
| Core Capabilities | Place a one-to-one call between two users                                                                           | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Place a group call with more than two users (up to 350 users)                                                       | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Promote a one-to-one call with two users into a group call with more than two users                                 | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Join a group call after it has started                                                                              | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Invite another VoIP participant to join an ongoing group call                                                       | ✔️   | ✔️       | ✔️              | ✔️                 |
| Mid call control  | Turn your video on/off                                                                                              | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Mute/Unmute mic                                                                                                     | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Switch between cameras                                                                                              | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Local hold/un-hold                                                                                                  | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Active speaker                                                                                                      | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Choose speaker for calls                                                                                            | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Choose microphone for calls                                                                                         | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Show state of a participant<br/>*Idle, Early media, Connecting, Connected, On hold, In Lobby, Disconnected*         | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Show state of a call<br/>*Early Media, Incoming, Connecting, Ringing, Connected, Hold, Disconnecting, Disconnected* | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Show if a participant is muted                                                                                      | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Show the reason why a participant left a call                                                                       | ✔️   | ✔️       | ✔️              | ✔️                 |
| Screen sharing    | Share the entire screen from within the application                                                                 | ✔️   | ❌       | ❌              | ❌                 |
|                   | Share a specific application (from the list of running applications)                                                | ✔️   | ❌       | ❌              | ❌                 |
|                   | Share a web browser tab from the list of open tabs                                                                  | ✔️   | ❌       | ❌              | ❌                 |
|                   | Participant can view remote screen share                                                                            | ✔️   | ✔️       | ✔️              | ✔️                 |
| Roster            | List participants                                                                                                   | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Remove a participant                                                                                                | ✔️   | ✔️       | ✔️              | ✔️                 |
| PSTN              | Place a one-to-one call with a PSTN participant                                                                     | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Place a group call with PSTN participants                                                                           | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Promote a one-to-one call with a PSTN participant into a group call                                                 | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Dial-out from a group call as a PSTN participant                                                                    | ✔️   | ✔️       | ✔️              | ✔️                 |
| General           | Test your mic, speaker, and camera with an audio testing service (available by calling 8:echo123)                   | ✔️   | ✔️       | ✔️              | ✔️                 |
| Device Management | Ask for permission to use  audio and/or video                                                                       | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Get camera list                                                                                                     | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Set camera                                                                                                          | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Get selected camera                                                                                                 | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Get microphone list                                                                                                 | ✔️   | ✔️       | ❌              | ❌                 |
|                   | Set microphone                                                                                                      | ✔️   | ✔️       | ❌              | ❌                 |
|                   | Get selected microphone                                                                                             | ✔️   | ✔️       | ❌              | ❌                 |
|                   | Get speakers list                                                                                                   | ✔️   | ✔️       | ❌              | ❌                 |
|                   | Set speaker                                                                                                         | ✔️   | ✔️       | ❌              | ❌                 |
|                   | Get selected speaker                                                                                                | ✔️   | ✔️       | ❌              | ❌                 |
| Video Rendering   | Render single video in many places (local camera or remote stream)                                                  | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Set / update scaling mode                                                                                           | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Render remote video stream                                                                                          | ✔️   | ✔️       | ✔️              | ✔️                 |


## Calling SDK streaming support
The Communication Services Calling SDK supports the following streaming configurations:

| Limit                                                         | Web                         | Windows/Android/iOS        |
| ------------------------------------------------------------- | --------------------------- | -------------------------- |
| **# of outgoing streams that can be sent simultaneously**     | 1 video or 1 screen sharing | 1 video + 1 screen sharing |
| **# of incoming streams that can be rendered simultaneously** | 1 video or 1 screen sharing | 6 video + 1 screen sharing |

While the Calling SDK won't enforce these limits, your users may experience performance degradation if they're exceeded.

## Calling SDK timeouts

The following timeouts apply to the Communication Services Calling SDKs:

| Action                                                                      | Timeout in seconds |
| --------------------------------------------------------------------------- | ------------------ |
| Reconnect/removal participant                                               | 120                |
| Add or remove new modality from a call (Start/stop video or screen sharing) | 40                 |
| Call Transfer operation timeout                                             | 60                 |
| 1:1 call establishment timeout                                              | 85                 |
| Group call establishment timeout                                            | 85                 |
| PSTN call establishment timeout                                             | 115                |
| Promote 1:1 call to a group call timeout                                    | 115                |

## JavaScript Calling SDK support by OS and browser

The following table represents the set of supported browsers which are currently available. We support the most recent three versions of the browser unless otherwise indicated.

| Platform     | Chrome | Safari | Edge (Chromium) | Notes                                                                                                                                                                                                       |
| ------------ | ------ | ------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Android      | ✔️      | ❌      | ❌               | Outgoing Screen Sharing is not supported.                                                                                                                                                                   |
| iOS          | ❌      | ✔️      | ❌               | [An iOS app on Safari can't enumerate/select mic and speaker devices](../known-issues.md#enumerating-devices-isnt-possible-in-safari-when-the-application-runs-on-ios-or-ipados) (for example, Bluetooth); this is a limitation of the OS, and there's always only one device, OS controls default device selection. Outgoing screen sharing is not supported. |
| macOS        | ✔️      | ✔️      | ❌               | Safari 14+/macOS 11+ needed for outgoing video support.                                                                                                                                                     |
| Windows      | ✔️      | ❌      | ✔️               |                                                                                                                                                                                                             |
| Ubuntu/Linux | ✔️      | ❌      | ❌               |                                                                                                                                                                                                             |

* For Safari versions 13.1+ are supported, 1:1 calls are not supported on Safari.
* Unless otherwise specified, the past 3 versions of each browser are supported.

## Android Calling SDK support

* Support for Android API Level 21 or Higher

* Support for Java 7 or higher

* Support for Android Studio 2.0

## iOS Calling SDK support

* Support for iOS 10.0+ at build time, and iOS 12.0+ at run time

* Xcode 12.0+

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