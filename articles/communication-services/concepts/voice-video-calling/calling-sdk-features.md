---
title: Azure Communication Services calling client library overview
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of the calling client library.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-communication-services
---
# Calling client library overview

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

There are two separate families of Calling client libraries, for *clients* and *services.* Currently available client libraries are intended for end-user experiences: websites and native apps.

The Service client libraries are yet available, and provide "raw" access to the voice and video data planes, suitable for integration with bots and other services.

## Calling client library capabilities

The following list presents the set of features which are currently available in the Azure Communication Services Calling client libraries.

| Group of features | Capability                                                                                                          | JS  | Java (Android) | Objective-C (iOS) |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- | --- | -------------- | ----------------- |
| Hardware settings | Mute/Unmute mic                                                                                                     | ✔️   | ✔️              | ✔️                 |
|                   | Switch between cameras                                                                                              | ✔️   | ✔️              | ✔️                 |
|                   | Local hold/un-hold                                                                                                  | ✔️   | ✔️              | ✔️                 |
|                   | Active speaker                                                                                                      | ✔️   | ✔️              | ✔️                 |
|                   | Choose speaker for calls                                                                                            | ✔️   | ✔️              | ✔️                 |
|                   | Choose microphone for calls                                                                                         | ✔️   | ✔️              | ✔️                 |
|                   | Show state of a participant<br/>*Idle, Early media, Connecting, Connected, On hold, In Lobby, Disconnected*          | ✔️   | ✔️              | ✔️                 |
|                   | Show state of a call<br/>*Early Media, Incoming, Connecting, Ringing, Connected, Hold, Disconnecting, Disconnected* | ✔️   | ✔️              | ✔️                 |
|                   | Show if a participant is muted                                                                                      | ✔️   | ✔️              | ✔️                 |
|                   | Show the reason why a participant left a call                                                                       | ✔️   | ✔️              | ✔️                 |
| Screen sharing    | Share the entire screen from within the application                                                                 | ✔️   | ❌              | ❌                 |
|                   | Share a specific application (from the list of running applications)                                                | ✔️   | ❌              | ❌                 |
|                   | Share a web browser tab from the list of open tabs                                                                  | ✔️   | ❌              | ❌                 |
|                   | Participant can view remote screen share                                                                            | ✔️   | ✔️              | ✔️                 |
| Roster            | List participants                                                                                                   | ✔️   | ✔️              | ✔️                 |
|                   | Remove a participant                                                                                                | ✔️   | ✔️              | ✔️                 |
| PSTN              | Connect PSTN participants into group calls (dial out from the meetings)                                             | ✔️   | ✔️              | ✔️                 |

## Calling client library browser support

The following table represents the set of supported browsers and versions which are currently available.

|                                  | Windows          | macOS          | Android | Linux  | Ubuntu | iOS    |
| -------------------------------- | ---------------- | -------------- | ------- | ------ | ------ | ------ |
| **Calling client library** | Chrome*, new Edge | Chrome*, Safari** | Chrome*  | Chrome* | Chrome* | Safari** |


*Note that the latest version of Chrome is supported in addition to the previous two releases.<br/>

**Note that Safari versions 13.1+ are supported. Outgoing video for Safari macOS is not yet supported, but it is supported on iOS. Outgoing screen sharing is only supported on desktop iOS.

## Next steps

> [!div class="nextstepaction"]
> [Get started with calling](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

For more information, see the following articles:
- Familiarize yourself with general [call flows](../call-flows.md)
- Learn about [call types](../voice-video-calling/about-call-types.md)
- [Plan your PSTN solution](../telephony-sms/plan-solution.md)
