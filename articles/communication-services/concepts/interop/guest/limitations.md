---
title: Known issues and limitations
titleSuffix: An Azure Communication Services concept document
description: Known issues and limitations of Azure Communication Services support for Teams external users
author: tomaschladek
ms.author: tchladek
ms.date: 7/9/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Known issues and limitations

- When using Microsoft Graph to [list the participants in a Teams meeting](/graph/api/call-list-participants), details for Communication Services users are not currently included.
- Teams meetings support up to 1000 participants, but the Azure Communication Services Calling SDK currently only supports 350 participants, and Chat SDK supports 250 participants. 
- With [Cloud Video Interop for Microsoft Teams](/microsoftteams/cloud-video-interop), some devices have seen issues when a Communication Services user shares their screen.
- [Teams activity handler events](/microsoftteams/platform/bots/bot-basics?tabs=csharp) for bots don't fire when Communication Services users join a Teams meeting.

## Next steps

- [Authenticate as Teams external user](../../../quickstarts/identity/access-tokens.md)
- [Join Teams meeting audio and video as Teams external user](../../../quickstarts/voice-video-calling/get-started-teams-interop.md)
- [Join Teams meeting chat as Teams external user](../../../quickstarts/chat/meeting-interop.md)
- [Join meeting options](../../../how-tos/calling-sdk/teams-interoperability.md)
- [Communicate as Teams user](../../teams-endpoint.md).
