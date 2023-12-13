---
title: Support for government clouds as Teams user
titleSuffix: An Azure Communication Services concept document
description: Support for Teams user from Azure Communication Services connecting to Microsoft Teams in government clouds
author: tinaharter
ms.author: tinaharter
ms.date: 9/22/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Support for government clouds as Teams user
Developers can integrate Azure Communication Services to connect to Microsoft Teams also in government clouds. Azure Communication Services allows connecting to Microsoft 365 cloud that meets government security and compliance requirements.  The following sections show supported clouds and scenarios for Teams users.

## Supported cloud parity between Microsoft 365 and Azure 
The following table shows pair of government clouds that are currently supported by Azure Communication Services:

| Microsoft 365 cloud| Azure cloud| Support |
| --- | --- | --- |
| [GCC](/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc) | Public | ❌ |
| [GCC-H](/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc-high-and-dod) | [US Government](../../../../azure-government/documentation-government-welcome.md) | ❌ |

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