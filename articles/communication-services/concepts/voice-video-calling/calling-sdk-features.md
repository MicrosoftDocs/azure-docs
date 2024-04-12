---
title: Azure Communication Services Calling SDK overview
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the Calling SDK capabilities limitations features for video and audio.
author: sloanster
manager: chpalm
services: azure-communication-services

ms.author: micahvivion
ms.date: 03/04/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: devx-track-js
---
# Calling SDK overview

Azure Communication Services allows end-user browsers, apps, and services to drive voice and video communication. This page focuses on Calling client SDK, which can be embedded in websites and native applications. This page provides detailed descriptions of Calling client features such as platform and browser support information. Services programmatically manages and access calls using the [Call Automation APIs](../call-automation/call-automation.md). The [Rooms API](../rooms/room-concept.md) is an optional Azure Communication Services API that adds additional features to a voice or video call, such as roles and permissions.

[!INCLUDE [Survey Request](../../includes/survey-request.md)]

To build your own user experience with the Calling SDK, check out [Calling quickstarts](../../quickstarts/voice-video-calling/getting-started-with-calling.md) or [Calling hero sample](../../samples/calling-hero-sample.md).

If you'd like help with the end-user experience, the Azure Communication Services UI Library provides a collection of open-source production-ready UI components to drop into your application. With this set of prebuilt controls, you can create beautiful communication experiences using [Microsoft's Fluent design language](https://developer.microsoft.com/en-us/fluentui#/). If you want to learn more about the UI Library, visit [the overview site](../ui-library/ui-library-overview.md) or [Storybook](https://aka.ms/acsstorybook).

Once you start development, check out the [known issues page](../known-issues.md) to find bugs we're working on.

**SDK links**

| Platform | Web (JavaScript) | Windows (.NET) |  iOS | Android | Other |
| -------------- | ---------- |   ---- | -------------- | -------------- | ------------------------------ |
| Calling | [npm](https://www.npmjs.com/package/@azure/communication-calling) | [NuGet](https://www.nuget.org/packages/Azure.Communication.Calling.WindowsClient) |  [GitHub](https://github.com/Azure/Communication/releases) | [Maven](https://search.maven.org/artifact/com.azure.android/azure-communication-calling/)| |
| UI Library| [npm](https://www.npmjs.com/package/@azure/communication-react) | - |  [GitHub](https://github.com/Azure/communication-ui-library-ios) | [GitHub](https://github.com/Azure/communication-ui-library-android) | [GitHub](https://github.com/Azure/communication-ui-library), [Storybook](https://azure.github.io/communication-ui-library/?path=/story/overview--page) |

**Key features** 
- **Device Management and Media** - The Calling SDK provides facilities for binding to audio and video devices, encodes content for efficient transmission over the communications dataplane, and renders content to output devices and views that you specify. APIs are also provided for screen and application sharing.
- **PSTN** - The Calling SDK can initiate voice calls with the traditional publicly switched telephone network, [using phone numbers you acquire in the Azure portal](../../quickstarts/telephony/get-phone-number.md) or programmatically. You can also bring your own numbers using session border controllers. 
- **Teams Meetings & Calling** - The Calling SDK can [join Teams meetings](../../quickstarts/voice-video-calling/get-started-teams-interop.md) and interact with the Teams voice and video dataplane.
- **Encryption** - The Calling SDK encrypts traffic and prevents tampering on the wire.
- **Addressing** - Azure Communication Services provides generic [identities](../identity-model.md) that are used to address communication endpoints. Clients use these identities to authenticate to the service and communicate with each other. These identities are used in Calling APIs that provide clients visibility into who is connected to a call (the roster).
- **User Access Security**
  - **Roster** control, **schedule** control, and user **roles/permissions** are enforced through [Virtual Rooms](../rooms/room-concept.md).
  - Ability for a user to **Initiate a new call** or to **Join an existing call** can be managed through [User Identities and Tokens](../identity-model.md) 
- **Notifications** - The Calling SDK provides APIs allowing clients to be notified of an incoming call. In situations where your app isn't running in the foreground, patterns are available to [fire pop-up notifications](../notifications.md) ("toasts") to inform end-users of an incoming call.
- **Media Stats** - The Calling SDK provides comprehensive insights into [the metrics](media-quality-sdk.md) of your VoIP and video calls. With this information, developers have a clearer understanding of call quality and can make informed decisions to further enhance their communication experience.
- **Video Constraints** - The Calling SDK provides APIs that gain the ability to regulate [video quality among other parameters](../../quickstarts/voice-video-calling/get-started-video-constraints.md) during video calls by adjusting parameters such as resolution and frame rate supporting different call situations for different levels of video quality
- **User Facing Diagnostics (UFD)** - The Calling SDK provides [events](user-facing-diagnostics.md) that are designed to provide insights into underlying issues that could affect call quality. Developers can subscribe to triggers such as weak network signals or muted microphones, ensuring that they're always aware of any factors impacting the calls.

## Detailed capabilities

The following list presents the set of features that are currently available in the Azure Communication Services Calling SDKs.

| Group of features | Capability                                                                                                          | JS  | Windows | Java (Android) | Objective-C (iOS) |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- | --- | ------- | -------------- | ----------------- |
| Core Capabilities | Place a one-to-one call between two users                                                                           | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Place a group call with more than two users (up to 100 users)                                                       | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Promote a one-to-one call with two users into a group call with more than two users                                 | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Join a group call after it has started                                                                              | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Invite another VoIP participant to join an ongoing group call                                                       | ✔️   | ✔️       | ✔️              | ✔️                 |
| Mid call control  | Turn your video on/off                                                                                              | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Mute/Unmute mic                                                                                                     | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Mute other participants    |✔️<sup>1</sup>        |   ✔️<sup>1</sup>       |    ✔️<sup>1</sup>              |     ✔️<sup>1</sup>      |
|                   | Switch between cameras                                                                                              | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Local hold/un-hold                                                                                                  | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Active speaker                                                                                                      | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Choose speaker for calls                                                                                            | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Choose microphone for calls                                                                                         | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Show state of a participant<br/>*Idle, Early media, Connecting, Connected, On hold, In Lobby, Disconnected*         | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Show state of a call<br/>*Early Media, Incoming, Connecting, Ringing, Connected, Hold, Disconnecting, Disconnected* | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Show if a participant is muted                                                                                      | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Show the reason why a participant left a call                                                                       | ✔️   | ✔️       | ✔️              | ✔️                 |
| Screen sharing    | Share the entire screen from within the application                                                                 | ✔️  | ✔️<sup>2</sup>  | ✔️<sup>2</sup>   | ✔️<sup>2</sup>               |
|                   | Share a specific application (from the list of running applications)                                                | ✔️   | ✔️<sup>2</sup>     | ❌              | ❌                 |
|                   | Share a web browser tab from the list of open tabs                                                                  | ✔️   |        |               |                |
|                   | Share system audio during screen sharing                                                                            | ✔️   | ❌       | ❌              | ❌                 |
|                   | Participant can view remote screen share                                                                            | ✔️   | ✔️       | ✔️              | ✔️                 |
| Roster            | List participants                                                                                                   | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Remove a participant                                                                                                | ✔️   | ✔️       | ✔️              | ✔️                 |
| PSTN              | Place a one-to-one call with a PSTN participant                                                                     | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Place a group call with PSTN participants                                                                           | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Promote a one-to-one call with a PSTN participant into a group call                                                 | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Dial-out from a group call as a PSTN participant                                                                    | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Support for early media                                                                                             | ✔️   | ✔️       | ✔️              | ✔️                 |
| General           | Test your mic, speaker, and camera with an audio testing service (available by calling 8:echo123)                   | ✔️   | ✔️       | ✔️              | ✔️                 |
| Device Management | Ask for permission to use  audio and/or video                                                                       | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Get camera list                                                                                                     | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Set camera                                                                                                          | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Get selected camera                                                                                                 | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Get microphone list                                                                                                 | ✔️   | ✔️       | ❌ <sup>3</sup>             | ❌<sup>3</sup>                 |
|                   | Set microphone                                                                                                      | ✔️   | ✔️       | ❌ <sup>3</sup>             | ❌    <sup>3</sup>             |
|                   | Get selected microphone                                                                                             | ✔️   | ✔️       | ❌   <sup>3</sup>           | ❌          <sup>3</sup>       |
|                   | Get speakers list                                                                                                   | ✔️   | ✔️       | ❌     <sup>3</sup>         | ❌     <sup>3</sup>            |
|                   | Set speaker                                                                                                         | ✔️   | ✔️       | ❌ <sup>3</sup>             | ❌   <sup>3</sup>              |
|                   | Get selected speaker                                                                                                | ✔️   | ✔️       | ❌  <sup>3</sup>            | ❌     <sup>3</sup>            |
| Video Rendering   | Render single video in many places (local camera or remote stream)                                                  | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Set / update scaling mode                                                                                           | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Render remote video stream                                                                                          | ✔️   | ✔️       | ✔️              | ✔️                 |
| Video Effects     | [Background Blur](../../quickstarts/voice-video-calling/get-started-video-effects.md)          | ✔️   | ✔️       | ✔️              | ✔️                 |
|                   | Custom background image                                                                                             | ✔️   | ❌       | ❌              | ❌                 |
| Audio Effects     | [Music Mode](./music-mode.md)          | ❌   | ✔️       | ✔️              | ✔️                 |
|      | [Audio filters](../../how-tos/calling-sdk/manage-audio-filters.md)          | ❌   | ✔️       | ✔️              | ✔️                 |


<sup>1</sup> The capability to Mute Others is currently in public preview.
<sup>2</sup> The Share Screen capability can be achieved using Raw Media APIs. To learn more visit [the raw media access quickstart guide](../../quickstarts/voice-video-calling/get-started-raw-media-access.md).
<sup>3</sup> The Calling SDK doesn't have an explicit API for these functions, you should use the Android & iOS OS APIs to achieve instead.

## JavaScript Calling SDK support by OS and browser

The following table represents the set of supported browsers, which are currently available. **We support the most recent three major versions of the browser (most recent three minor versions for Safari)**  unless otherwise indicated.

| Platform     | Chrome | Safari | Edge  | Firefox |  Webview |  Electron |
| ------------ | ------ | ------ | ------ | ------- | ------- |  ------- |
| Android      | ✔️      | ❌      | ✔️           | ❌      | ✔️     | ❌      |
| iOS          | ✔️      | ✔️      | ❌           | ❌      | ✔️      | ❌      |
| macOS        | ✔️      | ✔️      | ✔️           | ✔️      | ❌      | ✔️     |
| Windows      | ✔️      | ❌      | ✔️           | ✔️      | ❌      | ✔️     |
| Ubuntu/Linux | ✔️      | ❌      | ❌           | ❌      | ❌      | ❌     |

- Outgoing Screen Sharing isn't supported on iOS or Android mobile browsers.
- Firefox support is in public preview.
- Currently, the calling SDK only supports Android System WebView on Android, iOS WebView(WKWebView) in public preview. Other types of embedded browsers or WebView on other OS platforms aren't officially supported, for example, GeckoView, Chromium Embedded Framework (CEF), Microsoft Edge WebView2. Running JavaScript Calling SDK on these platforms isn't actively tested, it might or might not work.
- [An iOS app on Safari can't enumerate/select mic and speaker devices](../known-issues.md#enumerating-devices-isnt-possible-in-safari-when-the-application-runs-on-ios-or-ipados) (for example, Bluetooth). This issue is a limitation of iOS, and the operating system controls default device selection.

## Calling client - browser security model

### Use WebRTC over HTTPS

WebRTC APIs like `getUserMedia` require that the app that calls these APIs is served over HTTPS. For local development, you can use `http://localhost`.

### Embed the Communication Services Calling SDK in an iframe

A new [permissions policy (also called a feature policy)](https://www.w3.org/TR/permissions-policy-1/#iframe-allow-attribute) is available in various browsers. This policy affects calling scenarios by controlling how applications can access a device's camera and microphone through a cross-origin iframe element.

If you want to use an iframe to host part of the app from a different domain, you must add the `allow` attribute with the correct value to your iframe.

For example, this iframe allows both camera and microphone access:

```html
<iframe allow="camera *; microphone *">
```

## Android Calling SDK support

- Support for Android API Level 21 or Higher
- Support for Java 7 or higher
- Support for Android Studio 2.0
- **Android Auto** and **IoT devices running Android** are currently not supported

## iOS Calling SDK support

- Support for iOS 10.0+ at build time, and iOS 12.0+ at run time
- Xcode 12.0+
- Support for **iPadOS** 13.0+


## Maximum call duration

**The maximum call duration is 30 hours**, participants that reach the maximum call duration lifetime of 30 hours will be disconnected from the call.

## Supported number of incoming video streams

The Azure Communication Services Calling SDK supports the following streaming configurations:

| Limit                                                         | Web                         | Windows/Android/iOS        |
| ------------------------------------------------------------- | --------------------------- | -------------------------- |
| **Maximum # of outgoing local streams that can be sent simultaneously**     | 1 video and 1 screen sharing | 1 video + 1 screen sharing |
| **Maximum # of incoming remote streams that can be rendered simultaneously** | 9 videos + 1 screen sharing on desktop browsers*, 4 videos + 1 screen sharing on web mobile browsers | 9 videos + 1 screen sharing |

\* Starting from Azure Communication Services Web Calling SDK version [1.16.3](https://github.com/Azure/Communication/blob/master/releasenotes/acs-javascript-calling-library-release-notes.md#1163-stable-2023-08-24)
While the Calling SDK doesn't enforce these limits, your users might experience performance degradation if they're exceeded. Use the API of [Optimal Video Count](../../how-tos/calling-sdk/manage-video.md?pivots=platform-web#remote-video-quality) to determine how many current incoming video streams your web environment can support.

## Supported video resolutions
The Azure Communication Services Calling SDK automatically adjusts resolutions of video and screen share streams during the call.

> [!NOTE]
> The resolution can vary depending on the number of participants on a call, the amount of bandwidth available to the client, hardware capabilities of local participant who renders remote video streans and other overall call parameters.

The Azure Communication Services Calling SDK supports sending following video resolutions

| Maximum video resolution | WebJS | iOS | Android | Windows |
| ------------- | ----- | ----- | ------- | ------- |
| **Sending video**    | 720P  | 720P  | 720P    | 1080P   |
| **Sending screen share**    | 1080P  | 1080P  | 1080P    | 1080P   |
| **Receiving a remote video stream or screen share** | 1080P | 1080P | 1080P   | 1080P   | 

## Number of participants on a call support
- Up to 350 users can join a group call, Room or Teams + ACS call. The maximum number of users that can join through WebJS calling SDK or Teams web client is capped at 100 participants, the remaining calling end point will need to join using Android, iOS, or Windows calling SDK or related Teams desktop or mobile client apps.
- Once the call size reaches 100+ participants in a call, only the top 4 most dominant speakers that have their video camera turned can be seen.
- When the number of people on the call is 100+, the viewable number of incoming video renders automatically decreases from 3x3 (9 incoming videos) down to 2x2 (4 incoming videos).
- When the number of users goes below 100, the number of supported incoming videos goes back up to 3x3 (9 incoming videos).

## Calling SDK timeouts
The following timeouts apply to the Communication Services Calling SDKs:

| Action                                                                      | Timeout in seconds |
| --------------------------------------------------------------------------- | ------------------ |
| Reconnect/removal participant                                               | 60                |
| Add or remove new modality from a call (Start/stop video or screen sharing) | 40                 |
| Call Transfer operation timeout                                             | 60                 |
| 1:1 call establishment timeout                                              | 85                 |
| Group call establishment timeout                                            | 85                 |
| PSTN call establishment timeout                                             | 115                |
| Promote 1:1 call to a group call timeout                                    | 115                |

## Next steps

> [!div class="nextstepaction"]
> [Get started with calling](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

For more information, see the following articles:

- Familiarize yourself with general [call flows](../call-flows.md)
- Learn about [call types](../voice-video-calling/about-call-types.md)
- Learn about [call automation API](../call-automation/call-automation.md) that enables you to build server-based calling workflows that can route and control calls with client applications.
- [Plan your PSTN solution](../telephony/plan-solution.md)
