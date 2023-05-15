---
title: Get local user capabilities
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to get capabilities of the local user in a call.
author: elavarasid
ms.author: elavarasid
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to
ms.date: 03/24/2023
ms.custom: template-how-to
---
# Observe user's capabilities
Do I have permission to turn video on, do I have permission to turn mic on, do I have permission to share screen? Those are some examples of participant capabilities that you can learn from the capabilities API. Learning the capabilities can help build a user interface that only shows the buttons related to the actions the local user has permissions to.

## Prerequisites
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quick start to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

## Supported Platform - Web
[!INCLUDE [Capabilities JavaScript](./includes/capabilities/capabilities-web.md)]

## Supported Calltype
The feature is currently supported only for ACS Rooms call type.

## Next steps
- [Learn how to manage video](./manage-video.md)
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to record calls](./record-calls.md)
