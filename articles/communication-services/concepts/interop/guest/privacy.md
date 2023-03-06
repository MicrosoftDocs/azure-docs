---
title: User privacy for Teams external users
titleSuffix: An Azure Communication Services concept document
description: User privacy requirements in Azure Communication Services support for Teams external users
author: tomaschladek
ms.author: tchladek
ms.date: 7/9/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Privacy
Interoperability between Azure Communication Services and Microsoft Teams enables your applications and users to participate in Teams calls, meetings, and chats. It is your responsibility to ensure that the users of your application are notified when recording or transcription are enabled in a Teams call or meeting.

Microsoft will indicate to you via the Azure Communication Services API that recording or transcription has commenced, and you must communicate this fact, in real-time, to your users within your application's user interface. You agree to indemnify Microsoft for all costs and damages incurred due to your failure to comply with this obligation.

## Chat storage

All chat messages sent by Teams users or Communication Services users during a Teams meeting are stored in the geographic region associated with the Microsoft 365 organization hosting the meeting. For more information, review the article [Location of data in Microsoft Teams](/microsoftteams/location-of-data-in-teams). For each Teams external user joining via Azure Communication Services SDKs in the meetings, there is a copy of the most recently sent message stored in the geographic region associated with the Communication Services resource used to develop the Communication Services application. Review the article [Region availability and data residency](./privacy.md).

Azure Communication Services will delete all copies of the most recently sent message per Teams retention policies. If no retention policy is defined, Azure Communication Services deletes data after 30 days. For more information about Teams retention policies, review the article [Learn about retention for Microsoft Teams](/microsoft-365/compliance/retention-policies-teams).

## Next steps

- [Authenticate as Teams external user](../../../quickstarts/identity/access-tokens.md)
- [Join Teams meeting audio and video as Teams external user](../../../quickstarts/voice-video-calling/get-started-teams-interop.md)
- [Join Teams meeting chat as Teams external user](../../../quickstarts/chat/meeting-interop.md)
- [Join meeting options](../../../how-tos/calling-sdk/teams-interoperability.md)
- [Communicate as Teams user](../../teams-endpoint.md).
