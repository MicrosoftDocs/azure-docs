---
title: UI Library Teams Embed
titleSuffix: An Azure Communication Services quickstart
description: In this document, you'll learn how the Azure Communication Services UI Library Teams Embed capability can be used to build turnkey calling experiences.
author: tophpalmer
ms.author: chpalm
ms.date: 06/30/2021
ms.topic: quickstart
ms.service: azure-communication-services

---

# Teams Embed

[!INCLUDE [Public Preview Notice](../../includes/private-preview-include.md)]

Teams Embed is an Azure Communication Services capability focused on common business-to-consumer and business-to-business calling interactions. The core of the Teams Embed system is [video and voice calling](../voice-video-calling/calling-sdk-features.md), but the Teams Embed system builds on Azure's calling primitives to deliver a complete user experience based on Microsoft Teams meetings.

Teams Embed SDK is closed-source and make these capabilities available to you in a turnkey, composite format. You drop Teams Embed into your app's canvas, and the SDK generates a complete user experience. Because this user experience is very similar to Microsoft Teams meetings, you can take advantage of:

- Reduced development time and engineering complexity.
- End-user familiarity with Teams experience.
- Ability to re-use [Teams end-user training content.](https://support.microsoft.com/office/meetings-in-teams-e0b0ae21-53ee-4462-a50d-ca9b9e217b67)

The Teams Embed SDK's provides most features supported in Teams meetings, including:

## Joining a meeting

The users can join easily over the meeting using the Teams meeting URL to a simpler and great experience, just like the Teams application. Adding the capability to the user to be part of extensive live meetings without losing the experience of the simplicity of the Teams application.

## Pre-meeting experience

As a participant of any of the meetings, you can set up a default configuration for audio and video devices. Add your name and bring your own image avatar.

## Meeting experience

Customize the user experience, adjust the capabilities accordingly to your needs. You will control the overall experience during the meetings.

- [**Video background blur effect**](https://support.microsoft.com/office/change-your-background-for-a-teams-meeting-f77a2381-443a-499d-825e-509a140f4780): The user can add a blur effect or change their background.

- [**Content sharing**](https://support.microsoft.com/office/share-content-in-a-meeting-in-teams-fcc2bf59-aecd-4481-8f99-ce55dd836ce8): The user can share video, photo, or the whole screen, and the users will see the shared content.

- [**Multiple layout options for the video gallery**](https://support.microsoft.com/office/using-video-in-microsoft-teams-3647fc29-7b92-4c26-8c2d-8a596904cdae): Bring the capabilities to select the layout default options during the meeting: large gallery, together mode, focus, pinning, and spotlight. And adapt the layout accordingly of the device resolution.

- [**Turn Video On/Off**](https://support.microsoft.com/office/using-video-in-microsoft-teams-3647fc29-7b92-4c26-8c2d-8a596904cdae#bkmk_turnvideoonoff): Bring the possibility to the users to manage their video during the meeting.

- **Attendee actions**: The user can ["raise the hand"](https://support.microsoft.com/en-us/office/raise-your-hand-in-a-teams-meeting-bb2dd8e1-e6bd-43a6-85cf-30822667b372), mute & unmute their microphone, change the camera or audio configuration, hang up and many more actions.

- [**Multilanguage support**](https://support.microsoft.com/topic/languages-supported-in-microsoft-teams-for-education-293792c3-352e-4b24-9fc2-4c28b5de2db8): Support 56 languages during the whole teams experience.

## Quality and security

The Teams Embed SDK is built under Teams Quality standards so for video quality you can see [the bandwidth requirements.](https://docs.microsoft.com/microsoftteams/prepare-network#bandwidth-requirements)

You can use an Azure Communication Service access token, more information [how generate and manage access tokens.](https://docs.microsoft.com/azure/communication-services/quickstarts/access-tokens)

## Features list

| Feature                                                             | Availability |
|---------------------------------------------------------------------|--------------|
| *Meeting actions*                                                   |              |
| Background blur                                                     | Yes          |
| Background video image                                              | Yes          |
| Call roster                                                         | Yes          |
| Call state                                                          | Yes          |
| Customize the layout: colors, icons, buttons                         | Partially          |
| isHandRaised event                                                  | Yes          |
| isMuted event                                                       | Yes          |
| isSendingVideo event                                                | Yes          |
| Participants count                                                  | Yes          |
| Change audio routing                                                | Yes          |
| Change camera                                                       | Yes          |
| Change meeting views                                                | Yes          |
| Call screen icons                                                   | Yes          |
| Dynamic call NxN layout changing                                    | Yes          |
| Flaky Network Handling                                              | Yes          |
| Hang up                                                             | Yes          |
| Local pinning   of participant                                      | Yes          |
| Rise/Lower hand                                                     | Yes          |
| Mute/Un-mute                                                        | Yes          |
| Put on hold                                                         | Yes          |
| Remove from meeting                                                 | Yes          |
| Share photo                                                         | Yes          |
| Share screen                                                        | Yes          |
| Share video                                                         | Yes          |
| Start/Stop video                                                    | Yes          |
| UI Event: in call user tile touch                                   | Yes          |
| UI Event: name plate touch                                          | Yes          |
| View sharing                                                        | Yes          |
| Supports 56 languages                                               | Yes          |
| Chat                                                                | No           |
| Customize the screen background color​                               | No          |
| Customize the top/bottom bar color​                                  | No          |
| Call PSTN                                                           | No           |
| Recording and transcript                                            | No           |
| Whiteboard sharing                                                  | No           |
| Breaking into rooms                                                 | No           |
| *Pre-meeting experience*                                            |              |
| Join group call with GUID and ACS token                             | Yes          |
| Join meeting with Live meeting URL and ACS token                    | Yes          |
| Join meeting with meeting URL and ACS token                         | Yes          |
| Join via waiting in lobby                                           | Yes          |
| Joining can configure display name, enable photo   sharing          | Yes          |
| Joining can configure to show call staging view (pre call screen)   | Yes          |
| Joining can configure to show name plate on call screen             | Yes          |
| Customize the looby, join button background color​                   | No          |
| Customize the looby, screen background color​                        | No          |

For more information about how to start into the Embed SDK, [samples guide](../../quickstarts/meeting/samples-for-teams-embed.md) or if you want to learn more about the SDK capabilities see the [Getting Started guide.](../../quickstarts/meeting/getting-started-with-teams-embed.md)
