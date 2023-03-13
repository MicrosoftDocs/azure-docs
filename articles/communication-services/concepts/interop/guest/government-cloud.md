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
Developers can integrate Azure Communication Services to connect to Microsoft Teams also in government clouds. Azure Communication Services allows connecting to Microsoft 365 cloud that meets government security and compliance requirements. The following sections show supported clouds and scenarios for external users from Azure Communication Services.

## Supported cloud parity between Microsoft 365 and Azure 
The following table shows pair of government clouds that are currently supported by Azure Communication Services:

| Microsoft 365 cloud| Azure cloud| Support |
| --- | --- | --- |
| [GCC](/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc) | Public | ❌ |
| [GCC-H](/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc-high-and-dod) | [US Government](../../../../azure-government/documentation-government-welcome.md) | ✔️ |

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