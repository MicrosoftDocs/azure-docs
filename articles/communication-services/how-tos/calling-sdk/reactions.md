---
title: Reactions
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to send and receive reactions.
author: jamescadd
manager: chpalm
ms.author: jacadd
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 10/20/2023
ms.custom: template-how-to
---

# Reactions

This article describes how to implement reactions for Azure Communication Services Calling SDKs. This capability enables participants in a group call or meeting to send and receive reactions with participants in Azure Communication Services and Microsoft Teams. 

The configuration and policy settings in Microsoft Teams control reactions for users in Teams meetings. For more information, see [Manage reactions in Teams meetings and webinars](/microsoftteams/manage-reactions-meetings) and [Meeting options in Microsoft Teams](https://support.microsoft.com/office/meeting-options-in-microsoft-teams-53261366-dbd5-45f9-aae9-a70e6354f88e).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md).

## Limits on reactions

The system pulls reactions by batches at regular intervals. Current batch limitation is 20,000 reactions pulled every 3 seconds.

If the number of reactions exceeds the limit, leftover reactions are sent in the next batch.

## Support

The following tables define support for reactions in Azure Communication Services.

Teams meeting support is based on [Teams policy](/microsoftteams/manage-reactions-meetings).

### Identities and call types

The following table shows support for reactions in different call and identity types. 

| Identities | Teams interop meeting | Room | 1:1 call | Group call | Teams interop Group Call |
| --- | --- | --- | --- | --- | --- |
| Communication Services user | ✔️ | ✔️ |   | ✔️ | ✔️ |
| Microsoft 365 user	| ✔️ |   |   | ✔️ | ✔️ |

### Operations

The following table shows support for reactions in Calling SDK to individual identity types. 

| Operations | Communication Services user | Microsoft 365 user |
| --- | --- | --- |
| Send specific reactions (like, love, laugh, applause, surprised) | ✔️ | ✔️ |
| Receive specific reactions (like, love, laugh, applause, surprised) | ✔️ | ✔️ |

### SDKs

The following table shows support for Together Mode feature in individual Azure Communication Services SDKs.

| Platforms | Web | Web UI | iOS | iOS UI | Android | Android UI | Windows |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Is Supported | ✔️ | ✔️ |   |   |   |   |   |


[!INCLUDE [Reactions JavaScript](./includes/reactions/reactions-web.md)]

## Next steps

- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
