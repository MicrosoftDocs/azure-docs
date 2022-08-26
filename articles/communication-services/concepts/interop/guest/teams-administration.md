---
title: Teams controls for Teams external user
titleSuffix: An Azure Communication Services concept document
description: Teams administrator controls to impact Azure Communication Services support for Teams external users
author: tomaschladek
ms.author: tchladek
ms.date: 7/9/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Teams controls
Teams administrators control organization-wide policies and manage and assign user policies. Teams meeting policies are tied to the organizer of the Teams meeting. Teams meetings also have options to customize specific Teams meetings further.

## Teams policies
Teams administrators have the following policies to control the experience for Teams external users in Teams meetings.

|Setting name|Policy scope|Description| Supported |
| ---- | ----| ----| --- |
| [Anonymous users can join a meeting](/microsoftteams/meeting-settings-in-teams#allow-anonymous-users-to-join-meetings) | organization-wide | If disabled, Teams external users can't join Teams meeting | ✔️ |
| [Let anonymous people join a meeting](/microsoftteams/meeting-settings-in-teams#allow-anonymous-users-to-join-meetings) | per-organizer |  If disabled, Teams external users can't join Teams meeting | ✔️ |
| [Let anonymous people start a meeting](/microsoftteams/meeting-settings-in-teams#allow-anonymous-users-to-join-meetings)| per-organizer | If enabled, Teams external users can start a Teams meeting without Teams user | ✔️ |
| [Automatically admit people](/microsoftteams/meeting-policies-participants-and-guests#automatically-admit-people) | per-organizer | If set to "Everyone", Teams external users can bypass lobby. Otherwise, Teams external users have to wait in the lobby until an authenticated user admits them.| ✔️ |
| [Who can present in meetings](/microsoftteams/meeting-policies-in-teams-general#designated-presenter-role-mode) | per-user | Controls who in the Teams meeting can share screen | ❌ |
| [Blocked anonymous join client types](/powershell/module/skype/set-csteamsmeetingpolicy) | per-organizer | If property "BlockedAnonymousJoinClientTypes" is set to "Teams" or "Null", the Teams external users via Azure Communication Services can join Teams meeting | ✔️ |

Your custom application should consider user authentication and other security measures to protect Teams meetings. Be mindful of the security implications of enabling anonymous users to join meetings. Use the [Teams security guide](/microsoftteams/teams-security-guide#addressing-threats-to-teams-meetings) to configure capabilities available to anonymous users.

## Teams meeting options

Teams meeting organizers can also configure the Teams meeting options to adjust the experience for participants. The following options are supported in Azure Communication Services for external users:

|Option name|Description| Supported |
| --- | --- | --- |
| [Automatically admit people](/microsoftteams/meeting-policies-participants-and-guests#automatically-admit-people) | If set to "Everyone", Teams external users can bypass lobby. Otherwise, Teams external users have to wait in the lobby until an authenticated user admits them.| ✔️ |
| [Always let callers bypass the lobby](/microsoftteams/meeting-policies-participants-and-guests#allow-dial-in-users-to-bypass-the-lobby)| Participants joining through phone can bypass lobby | Not applicable |
| Announce when callers join or leave| Participants hear announcement sounds when phone participants join and leave the meeting | ✔️ |
| [Choose co-organizers](https://support.microsoft.com/office/add-co-organizers-to-a-meeting-in-teams-0de2c31c-8207-47ff-ae2a-fc1792d466e2)|  Not applicable to external users | ✔️ |
| [Who can present in meetings](/microsoftteams/meeting-policies-in-teams-general#designated-presenter-role-mode) | Controls who in the Teams meeting can share screen.  | ❌ |
|[Manage what attendees see](https://support.microsoft.com/office/spotlight-someone-s-video-in-a-teams-meeting-58be74a4-efac-4e89-a212-8d198182081e)|Teams organizer, co-organizer and presenter can spotlight videos for everyone. Azure Communication Services does not receive the spotlight signals. |❌|
|[Allow mic for attendees](https://support.microsoft.com/office/manage-attendee-audio-and-video-permissions-in-teams-meetings-f9db15e1-f46f-46da-95c6-34f9f39e671a)|If external user is attendee, then this option controls whether external user can send local audio |✔️|
|[Allow camera for attendees](https://support.microsoft.com/office/manage-attendee-audio-and-video-permissions-in-teams-meetings-f9db15e1-f46f-46da-95c6-34f9f39e671a)|If external user is attendee, then this option controls whether external user can send local video |✔️|
|[Record automatically](/graph/api/resources/onlinemeeting)|Records meeting when anyone starts the meeting. The user in the lobby does not start a recording.|✔️|
|Allow meeting chat|If enabled, external users can use the chat associated with the Teams meeting.|✔️|
|[Allow reactions](/microsoftteams/meeting-policies-in-teams-general#meeting-reactions)|If enabled, external users can use reactions in the Teams meeting |❌|
|[RTMP-IN](/microsoftteams/stream-teams-meetings)|If enabled, organizers can stream meetings and webinars to external endpoints by providing a Real-Time Messaging Protocol (RTMP) URL and key to the built-in Custom Streaming app in Teams. |Not applicable|
|[Provide CART Captions](https://support.microsoft.com/office/use-cart-captions-in-a-microsoft-teams-meeting-human-generated-captions-2dd889e8-32a8-4582-98b8-6c96cf14eb47)|Communication access real-time translation (CART) is a service in which a trained CART captioner listens to the speech and instantaneously translates all speech to text. As a meeting organizer, you can set up and offer CART captioning to your audience instead of the Microsoft Teams built-in live captions that are automatically generated.|❌|


## Next steps

- [Authenticate as Teams external user](../../../quickstarts/access-tokens.md)
- [Join Teams meeting audio and video as Teams external user](../../../quickstarts/voice-video-calling/get-started-teams-interop.md)
- [Join Teams meeting chat as Teams external user](../../../quickstarts/chat/meeting-interop.md)
- [Join meeting options](../../../how-tos/calling-sdk/teams-interoperability.md)
- [Communicate as Teams user](../../teams-endpoint.md).
