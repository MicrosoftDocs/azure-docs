---
title: Support for government clouds
titleSuffix: An Azure Communication Services concept document
description: Support for external user from Azure Communication Services connecting to Microsoft Teams in government clouds
author: tinaharter
ms.author: tinaharter
ms.date: 9/22/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Support for government clouds
Azure Communication Services are also support Government Cloud, but the Government Cloud account can only communicate within the Government Cloud tenant. The following table show supported M365 Term and Azure Term:

| M365 Term | Azure Term | Supported |
| --- | --- | --- |
| GCC-M | Public | ❌ |
| GCC-H | USGov | ✔️ |
| DoD | USNAT | ❌ |

## Supported use cases

The following table show supported use cases for Gov Cloud user with Azure Communication Services:

| Scenario | Supported |
| --- | --- |
| Join Teams meeting | ✔️ |
| Join channel Teams meeting [1] | ✔️ |
| Join Teams webinar | ❌ |
| [Join Teams live events](/microsoftteams/teams-live-events/what-are-teams-live-events).| ❌ |
| Join [Teams meeting scheduled in application for personal use](https://www.microsoft.com/microsoft-teams/teams-for-home) | ❌ |
| Join Teams 1:1 or group call | ❌ |
| Join Teams 1:1 or group chat | ❌ |

- [1] Gov cloud users can join a channel Teams meeting with audio and video, but they won't be able to send or receive any chat messages
