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

# Teams administrator controls
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

## Next steps

- [Authenticate as Teams external user](../../../quickstarts/access-tokens.md)
- [Join Teams meeting audio and video as Teams external user](../../../quickstarts/voice-video-calling/get-started-teams-interop.md)
- [Join Teams meeting chat as Teams external user](../../../quickstarts/chat/meeting-interop.md)
- [Join meeting options](../../../how-tos/calling-sdk/teams-interoperability.md)
- [Communicate as Teams user](../../teams-endpoint.md).
