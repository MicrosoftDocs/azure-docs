---
title: Phone capabilities supported for Teams users
titleSuffix: An Azure Communication Services concept document
description: Provides an overview of phone capabilities supported for Teams users in Azure Communication Services Calling SDK.
author: tomaschladek
manager: chpalmer
services: azure-communication-services

ms.author: tchladek
ms.date: 12/01/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---
# Phone capabilities for Teams user in Calling SDK

The Azure Communication Services Calling SDK for JavaScript enables Teams user devices to drive voice and video communication experiences. This page provides detailed descriptions of phone calling features. To get started right away, check out [Calling quickstarts](../../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md). 

## Phone capabilities
The following list of capabilities is supported for scenarios where at least one phone number participates in 1:1 or group call:

| Group of features | Capability                                                                                                          | JavaScript |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- | ---------- | 
| Core Capabilities | Place a one-to-one call to the phone number                                                                             | ✔️        |
|                   | Place a group call with at least one phone number                                                                   | ✔️        |
|                   | Promote a one-to-one call with a phone number into a group call                                                     | ✔️        |
|                   | User can dial into a group call                                                                                     | ❌        |
|                   | Dial out from a group call to a phone number                                                                          | ✔️        |
|                   | Make an Emergency call                                                                                              |   ✔️      |
|                   | Honor Security desk policy for emergency calls                                                                      |   ✔️      |
|                   | Provide a static emergency location for Teams calling plans in case of emergency calls                                |   ✔️      |
| Connectivity      | Teams calling plans                                                                                                 |   ✔️      |
|                   | Teams direct routings                                                                                               |   ✔️      |
|                   | Teams operator connect                                                                                              |   ✔️      |
|                   | Azure Communication Services direct offers                                                                          |   ✔️      |
|                   | Azure Communication Services direct routing                                                                         |   ✔️      |
| Mid call control  | Turn your video on/off                                                                                              | ✔️*       |
|                   | Mute/Unmute mic                                                                                                     | ✔️        |
|                   | Switch between cameras                                                                                              | ✔️*        |
|                   | Local hold/un-hold                                                                                                  | ✔️        |
|                   | Indicator of dominant speakers in the call                                                                          | ✔️        |
|                   | Choose speaker device for calls                                                                                     | ✔️        |
|                   | Choose microphone for calls                                                                                         | ✔️        |
|                   | Indicator of participant's state<br/>*Idle, Early media, Connecting, Connected, On hold, In Lobby, Disconnected*    | ✔️        |
|                   | Indicator of call's state <br/>*Early Media, Incoming, Connecting, Ringing, Connected, Hold, Disconnecting, Disconnected* | ✔️        |
|                   | Indicate participants being muted                                                                                   | ✔️        |
|                   | Indicate participants' reasons for terminating the call                                                             | ✔️        |
| Screen sharing    | Share the entire screen from within the application                                                                 | ✔️*        |
|                   | Share a specific application (from the list of running applications)                                                | ✔️*        |
|                   | Share a web browser tab from the list of open tabs                                                                  | ✔️*        |
|                   | Share content in "content-only" mode                                                                                | ✔️*        |
|                   | Receive video stream with content for "content-only" screen sharing experience                                      | ✔️*        |
|                   | Share content in "standout" mode                                                                                    | ❌         |
|                   | Receive video stream with content for a "standout" screen sharing experience                                          | ❌         |
|                   | Share content in "side-by-side" mode                                                                                | ❌         |
|                   | Receive video stream with content for "side-by-side" screen sharing experience                                      | ❌         |
|                   | Share content in "reporter" mode                                                                                    | ❌         |
|                   | Receive video stream with content for "reporter" screen sharing experience                                          | ❌         |
| Roster            | List participants                                                                                                   | ✔️        |
|                   | Add an Azure Communication Services user                                                                             | ❌        |
|                   | Add a Teams user                                                                                                    | ✔️        |
|                   | Adding Teams user honors Teams external access configuration                                                        |   ✔️      |
|                   | Adding Teams user honors Teams guest access configuration                                                           |   ✔️      |
|                   | Add a phone number                                                                                                  | ✔️        |
|                   | Remove a participant                                                                                                | ✔️        |
|                   | Adding Teams user honors information barriers                                                                       |   ✔️      |
| Device Management | Ask for permission to use  audio and/or video                                                                       | ✔️*        |
|                   | Get camera list                                                                                                     | ✔️*        |
|                   | Set camera                                                                                                          | ✔️*        |
|                   | Get selected camera                                                                                                 | ✔️*        |
|                   | Get microphone list                                                                                                 | ✔️        |
|                   | Set microphone                                                                                                      | ✔️        |
|                   | Get selected microphone                                                                                             | ✔️        |
|                   | Get speakers list                                                                                                   | ✔️        |
|                   | Set speaker                                                                                                         | ✔️        |
|                   | Get selected speaker                                                                                                | ✔️        |
| Video Rendering   | Render single video in many places (local camera or remote stream)                                                  | ✔️*        |
|                   | Set / update scaling mode                                                                                           | ✔️*        |
|                   | Render remote video stream                                                                                          | ✔️*        |
| Recording & transcription | Manage Teams convenient recording                                                                           | ❌ |
|                   | Receive information of call being recorded                                                                          |   ✔️      |
|                   | Manage Teams transcription                                                                                          | ❌ |
|                   | Receive information of call being transcribed                                                                       |   ✔️      |
|                   | Support for compliance recording                                                                                    |   ✔️      |
| Media             | Support for early media                                                                                             | ✔️        |
|                   | Place a phone call honors location-based routing                                                                    |   ❌      |
|                   | Support for survivable branch appliance                                                                             |   ❌      |
| Accessibility     | Receive closed captions                                                                                             | ❌ |
| Advanced call routing   | Does start a call and add user operations honor forwarding rules                                              |   ✔️      |
|                   | Read and configure call forwarding rules                                                                             |   ❌      |
|                   | Does start a call and add user operations honor simultaneous ringing                                                 |   ✔️      |
|                   | Read and configure simultaneous ringing                                                                              |   ❌      |
|                   | Placing participant on hold plays music on hold                                                                      |   ✔️     |
|                   | Being placed by Teams user on Teams client on hold plays music on hold                                               |   ✔️      |
|                   | Park a call                                                                                                          |   ❌      |
|                   | Be parked                                                                                                            |   ✔️      |
|                   | Transfer a call to a user                                                                                           |   ✔️      |
|                   | Be transferred to a user or call                                                                                     |   ✔️      |
|                   | Transfer a call to a call                                                                                            |   ✔️      |
|                   | Transfer a call to Voicemail                                                                                         |   ❌      |
|                   | Be transferred to voicemail                                                                                           |   ✔️      |
|                   | Merge ongoing calls                                                                                                  |   ❌      |
|                   | Does start a call and add user operations honor shared line configuration                                            |   ✔️      |
|                   | Start a call on behalf of the Teams user                                                                             |   ❌      |
|                   | Read and configure shared line configuration                                                                         |   ❌      |
|                   | Receive a call from Teams auto attendant                                                                             |   ✔️      |
|                   | Transfer a call to Teams auto attendant                                                                              |   ✔️      |
|                   | Receive a call from Teams call queue                                                                                 |   ✔️      |
|                   | Transfer a call from Teams call queue                                                                                |   ✔️      |
| Teams caller ID policies | Block incoming caller ID                                                                                      |   ❌      |
|                   | Override the caller ID policy                                                                                        |   ❌      |
|                   | Calling Party Name                                                                                                   |   ❌      |
|                   | Replace the caller ID with                                                                                           |   ❌      |
|                   | Replace the caller ID with this service number                                                                       |   ❌      |
| Teams dial out plan policies | Start a phone call honoring dial plan policy                                                              |   ❌      |
| DevOps            | [Azure Metrics](../../metrics.md)                                                                                   | ✔️ |
|                   | [Azure Monitor](../../analytics/logs/voice-and-video-logs.md)                                                                     | ✔️ |
|                   | [Azure Communication Services Insights](../../analytics/logs/voice-and-video-logs.md)                                             | ✔️ |
|                   | [Azure Communication Services Voice and video calling events](../../../../event-grid/communication-services-voice-video-events.md) | ❌ |
|                   | [Teams Call Analytics](/MicrosoftTeams/use-call-analytics-to-troubleshoot-poor-call-quality)                        | ✔️ |
|                   | [Teams real-time Analytics](/microsoftteams/use-real-time-telemetry-to-troubleshoot-poor-meeting-quality)           | ❌ |

Notes:
 
* Participants joining via phone number can't see video content. Therefore actions involving video do not impact them but can apply when VoIP participants join.
* Currently, *Placing participant on hold plays music on hold* feature, is only available in JavaScript.
## Next steps

> [!div class="nextstepaction"]
> [Get started with calling](../../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md)

For more information, see the following articles:
- Familiarize yourself with general [call flows](../../call-flows.md)
- Learn about [call types](../../voice-video-calling/about-call-types.md)
