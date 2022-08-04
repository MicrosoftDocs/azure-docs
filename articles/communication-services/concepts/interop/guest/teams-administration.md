---
title: Teams controls for Teams guest
titleSuffix: An Azure Communication Services concept document
description: Teams administrator controls to impact Azure Communication Services support for Teams guests
author: tomaschladek
ms.author: tchladek
ms.date: 7/9/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Teams administrator controls
Teams administrators have the following policies to control the experience for Teams guests in Teams meetings.

|Setting name|Policy scope|Description| Supported |
| ---- | ----| ----| --- |
| [Anonymous users can join a meeting](/microsoftteams/meeting-settings-in-teams#allow-anonymous-users-to-join-meetings) | organization-wide | If disabled, Teams guests can't join Teams meeting | ✔️ |
| [Let anonymous people join a meeting](/microsoftteams/meeting-settings-in-teams#allow-anonymous-users-to-join-meetings) | per-organizer |  If disabled, Teams guests can't join Teams meeting | ✔️ |
| [Let anonymous people start a meeting](/microsoftteams/meeting-settings-in-teams#allow-anonymous-users-to-join-meetings)| per-organizer | If enabled, Teams guests can start a Teams meeting without Teams user | ✔️ |
| [Automatically admit people](/microsoftteams/meeting-policies-participants-and-guests#automatically-admit-people) | per-organizer | If set to "Everyone", Teams guests can bypass lobby. Otherwise, Teams guests have to wait in the lobby until an authenticated user admits them.| ✔️ |
| [Who can present in meetings](/microsoftteams/meeting-policies-in-teams-general#designated-presenter-role-mode) | per-user | Controls who in the Teams meeting can share screen | ❌ |
| [Blocked anonymous join client types](/powershell/module/skype/set-csteamsmeetingpolicy) | per-organizer | If property "BlockedAnonymousJoinClientTypes" is set to "Teams" or "Null", the Teams guests via Azure Communication Services can join Teams meeting | ✔️ |

Your custom application should consider user authentication and other security measures to protect Teams meetings. Be mindful of the security implications of enabling anonymous users to join meetings. Use the [Teams security guide](/microsoftteams/teams-security-guide#addressing-threats-to-teams-meetings) to configure capabilities available to anonymous users.

## Next steps

- [Authenticate as Teams guest](../../../quickstarts/access-tokens.md)
- [Join Teams meeting audio and video as Teams guest](../../../quickstarts/voice-video-calling/get-started-teams-interop.md)
- [Join Teams meeting chat as Teams guest](../../../quickstarts/chat/meeting-interop.md)
- [Join meeting options](../../../how-tos/calling-sdk/teams-interoperability.md)
- [Communicate as Teams user](../../teams-endpoint.md).
