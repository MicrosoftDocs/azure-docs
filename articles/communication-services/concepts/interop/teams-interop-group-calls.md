---
title: Capabilities for Microsoft Teams users in Azure Communication Services group calls
titleSuffix: An Azure Communication Services concept document
description: Experience for Microsoft Teams users joining an Azure Communication Services group call
author: jamescadd
ms.author: jacadd
ms.date: 4/15/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.custom: mode-other, devx-track-js
---

# Capabilities for Microsoft Teams users in Azure Communication Services group calls

Azure Communication Services is interoperable with Microsoft Teams. This is especially helpful for business-to-consumer use cases, where an external customer in a custom, branded Azure-powered app or website communicates with an employee using Microsoft Teams. This allows the external customer to enjoy a custom experience, and the employee to have all their communication needs satisfied in a single hub: Teams. 
Azure Communication Services can interoperate with Teams in three ways:
-	Azure clients can add an individual Teams user to a 1:1 and group calls. This is ideal for customer service situations where your application is adding Teams-hosted subject matter experts to a call to help agents improve their first call resolution rates.
-	Azure clients can directly call a Teams Voice App, such as Auto Attendant and Call Queues. Azure Communication Services enables you to connect customers from your website or application to Teams Voice Apps to handle requests and later handoff to Teams agents as configured in Teams admin center. 
-	Azure clients can join Teams meetings. This type of interoperability is described on a separate page.

This page details capabilities for Teams (or Microsoft 365) users in a call with Communication Services users (scenario #1). Your service can orchestrate and manage these calls, including adding Teams users to these calls, using Call automation SDK. Read more about it [here](../call-automation/call-automation-teams-interop.md).

[!INCLUDE [Teams Phone license](../../includes/teams-phone-license-include.md)]

M365/Teams user can take calls with Communication Services users via Teams client or [a custom client](../teams-endpoint.md) built using the Azure Communication Services SDKs. To learn about features available for Communication Services user, refer to [voice and video capabilities](../voice-video-calling/calling-sdk-features.md) document.


| **Group of features**              | **Capability**                                               | **M365 user on a custom client**  | **M365 user on a Teams client** |
|---------------------------|-----------------------------------------------------------------------|-----------------------------------|-----------------------------------|
| Core capabilities           | Answer an incoming 1:1 or group call from Communication Services       | ✔️                                 | ✔️                                 |
|                            | Reject an incoming 1:1 or group call from Communication Services     | ✔️                                 | ✔️                                 |
|  Roster                    | Add another Teams user to group call (From your tenant or another federated tenant | ✔️                    | ✔️                                 |
|                           | Promote a one-to-one call into a group call by adding Azure Communication Services user      | ❌              | N/A                               |
|                           | Add an Azure Communication Services user to group call                  | ❌                                | N/A                               |
|                           | Add PSTN user to group call                                             | ❌                                | ❌                                |
|                           | Remove a participant from group call                                    | ✔️                                 | ✔️                                 |
|                           | Placing a call honors Teams external access configuration/federation    | ✔️                              | ✔️                                 |
|                           | Adding Teams users honors Teams external access configuration/federation | ✔️                                 | ✔️                                 |
|                           | List participants                                                        | ✔️                                 | ✔️                                 |
| Mid call control         | Turn your video on/off                                                    | ✔️                                  | ✔️  |
|                          | Turn off incoming video                                                   | ❌                                 | ✔️  |
|                           | Mute/Unmute mic                                                          | ✔️                                  | ✔️  |
|                         | Mute another participant                                                   | ❌                                 | ✔️  |
|                          | Switch between cameras                                                    | ✔️                                  | ✔️  |
|                          | Place participant on local hold/un-hold                                   | ✔️                                  | ✔️  |
|                          | Indicator of dominant speakers in the call                                | ✔️                                  | ✔️  |
|                          | Choose speaker device for calls                                           | ✔️                                  | ✔️  |
|                        | Choose microphone for calls                                                  | ✔️                                  | ✔️  |
|                             | Indicator of participant's state Idle, Early media, Connected, On hold, Disconnected     | ✔️              | ✔️  |
|                          | Indicator of call's state Ringing, Connected, On Hold                       | ✔️                                  | ✔️  |
|                          | Indicate participants being muted                                            | ✔️                                  | ✔️  |
|                           | Indicate participants' reasons for terminating the call                    | ✔️                                  | ❌ |
|                            | Mute notifications                                                       | N/A                                | ✔️  |
| Screen sharing           |  Share the entire screen from within the application                         | ✔️                                  | ✔️  |
|                           | Share a specific application (from the list of running applications)      | ✔️                                  | ✔️  |
|                          | Share a web browser tab from the list of open tabs                         | ✔️                                  | ✔️  |
|                           | Share content in "content-only" mode                                        | ✔️                                  | ✔️  |
|                           | Receive video stream with content for "content-only" screen sharing experience| ✔️                                  | ✔️  |
|                            | Share content in "standout" mode                                             | ❌                                 | ✔️  |
|                            | Receive video stream with content for a "standout" screen sharing experience  | ❌                                 | ✔️  |
|                           | Share content in "side-by-side" mode                                          | ❌                                 | ✔️  |
|                          | Receive video stream with content for "side-by-side" screen sharing experience | ❌                                 | ✔️  |
|                          | Share content in "reporter" mode                                              | ❌                                 | ✔️  |
|                          | Receive video stream with content for "reporter" screen sharing experience    | ❌                                 | ✔️  |
|                          | Share system audio during screen sharing                                        | ✔️                                  | ✔️  |
| Device Management (MVP)       | Ask for permission to use audio and/or video                              | ✔️                                  | ✔️  |
|                            | Get camera list                                                                | ✔️                                  | ✔️  |
|                                 | Set camera                                                              | ✔️                                  | ✔️  |
|                            | Get selected camera                                                         | ✔️                                  | ✔️  |
|                                     | Get microphone list                                                   | ✔️                                  | ✔️  |
|                               | Set microphone                                                            | ✔️                                  | ✔️  |
|                              | Get selected microphone                                                    | ✔️                                  | ✔️  |
|                           | Get speakers list                                                             | ✔️                                  | ✔️  |
|                         | Set speaker                                                                      | ✔️                                  | ✔️  |
|                         | Get selected speaker                                                              | ✔️                                  | ✔️  |
|                          | Test your mic, speaker, and camera with an audio testing service                  | ✔️ (available by calling 8:echo123) | ✔️  |
| Engagement              | Raise and lower hand                                                             | ✔️                                  | ✔️  |
|                          | Indicate other participants' raised and lowered hands                           | ✔️                                  | ✔️  |
|                           | Trigger reactions                                                             | ❌                                 | ✔️  |
|                          | Indicate other participants' reactions                                       | ❌                                 | ✔️  |
| Recording               | 	Be notified of the call being recorded                       	              | ✔️	                                  | ✔️ |
|                         |   Teams compliance recording                                                   | ✔️                                   | ✔️ |
|	                          | Manage Teams transcription	                                                 | ❌                                 | ✔️  |
|                         |	Receive information of call being transcribed	                                | ✔️                                   | ✔️ |
|                          | Manage Teams closed captions	                                                  | ✔️                                   | ✔️ |


