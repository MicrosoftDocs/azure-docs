---
title: UI Mobile Library
titleSuffix: An Azure Communication Services - UI Mobile Library
description: In this document, introduce the UI Mobile Library
author: jorgegarc

ms.author: jorgegarc
ms.date: 09/14/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

# UI Mobile Library

UI Mobile Library is an Azure Communication Services capability focused on common business-to-consumer and business-to-business calling interactions. The core of the Mobile UI Library is [video and voice calling](../voice-video-calling/calling-sdk-features), and it builds on Azure's calling primitives to deliver a complete user experience based on calling and meetings primitives.

The UI Mobile Library objective is provide these capabilities available to you in a turnkey, composite format. You drop the UI SDK into your favorite mobile development app's canvas, and the SDK generates a complete user experience. Because this user experience is very lightly, you can take advantage of reduce the development time and engineering complexity.

## Composites

Composites are higher-level components composed of UI components that deliver turn-key solutions for common communication scenarios using Azure Communication Services.
Developers can easily instantiate the Composite using an Azure Communication Services access token and the required configuration attributed for call or chat.

| Composite                                                                   | Use Cases                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [CallComposite](../../quickstarts/voice-video-calling/getting-started-with-calling)  TBD final link| Calling experience that allows users to start or join a call. Inside the experience users can configure their devices, participate in the call with video and see other participants, including those with video turn on. For Teams Interop is includes lobby functionality for user to wait to be admitted. |

## Platform support

|Platform | Versions|
|---------|---------|
| iOS     | iOS 13+ |
| Android | v23+    |

## Installing Mobile UI Library

``` java
TBD Maven Android repo
```

``` iOS
TBD Cocoapods iOS repo
```


## Scenarios

### Joining a meeting

The users can join easily over the meeting using the Teams meeting URL to a simpler and great experience, just like the Teams application. Adding the capability to the user to be part of extensive live meetings without losing the experience of the simplicity of the Teams application.

### Pre-meeting experience

As a participant of any of the meetings, you can set up a default configuration for audio and video devices. Add your name and bring your own image avatar.

<img src="../media/mobile-ui/teams_meet.png" alt="Pre-meeting experience" width="75%"/>

### Meeting experience

Customize the user experience, adjust the capabilities accordingly to your needs. You will control the overall experience during the meetings.

<img src="../media/mobile-ui/Calling_composite.png" alt="Meeting experience" width="40%"/>

### Quality and security

You can secure using an Azure Communication Service access token, more information [how generate and manage access tokens.](../../quickstarts/access-tokens)

More scenarios please visit [use cases site](mobile-ui-usesscenarios.md) to discover more about UI Mobile Library.

### More details

- **Device selector**: The user can select their audio and video devices.

- **Theming**: Bring the capabilities customize the primary color of the meeting experience.

- **Turn Video On/Off**: Bring the possibility to the users to manage their video during the meeting.

- **Multilingual support**: Support 56 languages during the whole teams experience.

***We expect to add more scenarios ahead of the UI Library being in General Availability.***

## What UI Artifact is Best for my Project?

Understanding these requirements will help you choose the right client library:

- **How much customization do you desire?** Azure Communication core client libraries don't have a UX and are designed so you can build whatever UX you want. UI Library components provide UI assets at the cost of reduced customization.
- **What platforms are you targeting?** Different platforms have different capabilities.


Details about feature availability in the [UI Library is available here](mobile-ui-usesscenarios.md), but key trade-offs are summarized below.

| Client library / SDK  | Implementation Complexity | Customization Ability | Calling |  [Teams Interop](../../concepts/teams-interop) |
| --------------------- | ------------------------- | --------------------- |  ---- | ----------------------------------------------------------------------------------------------- |
| Composite Components  | Low                       | Low                   |         ✔    | ✔                                                                                               |
| Base Components       | Medium                    | Medium                |         ✔    | ✔                                                                                               |
| Core client libraries | High                      | High                  |         ✔    | ✔                                                                                               |



## Learn and go

For more information about how to start with the UI Mobile library, please follow [our Quickstarts guides TBD](../../quickstarts/voice-video-calling/getting-started-with-calling).