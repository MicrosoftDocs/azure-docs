---
title: Government clouds accounts as Teams user
titleSuffix: An Azure Communication Services concept document
description: Azure Communication Services support for government clouds accounts as Teams user
author: tinaharter
ms.author: tinaharter
ms.date: 9/22/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Communication as Gov Cloud Teams user
Teams user with Azure Communication Services does not support Government Cloud for now. The following table show supported M365 Term and Azure Term:

| M365 Term | Azure Term | Supported |
| --- | --- | --- |
| GCC-M | Public | ❌ |
| GCC-H | USGov | ❌ |
| DoD | USNAT | ❌ |
| AirGap Clouds | USSEC | ❌ |
| DEOS | Edge | ❌ |

## Supported use cases

The following table show supported use cases for Gov Cloud Teams user with Azure Communication Services:

| Scenario | Supported |
| --- | --- |
| Make a voice-over-IP (VoIP) call to Teams user | ❌ |
| Make a phone (PSTN) call | ❌ |
| Accept incoming voice-over-IP (VoIP) call for Teams user | ❌ |
| Accept incoming phone (PSTN) for Teams user | ❌ |
| Join Teams meeting | ❌ |
| Join channel Teams meeting | ❌ |
| Join Teams webinar | ❌ |
| [Join Teams live events](/microsoftteams/teams-live-events/what-are-teams-live-events).| ❌ |
| Join [Teams meeting scheduled in an application for personal use](https://www.microsoft.com/microsoft-teams/teams-for-home) | ❌ |
| Join Teams 1:1 or group call | ❌ |
| Send a message to 1:1 chat, group chat or Teams meeting chat| ❌ |
| Get messages from 1:1 chat, group chat or Teams meeting chat | ❌ |