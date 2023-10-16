---
title: Transfer calls
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to transfer calls.
author: tophpalmer
ms.author: chpalm
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 08/10/2021
ms.custom: template-how-to

#Customer intent: As a developer, I want to learn how to transfer calls so that users have the option to transfer calls.
---

# Transfer calls

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

During an active call, you may want to transfer the call to another person or number. Let's learn how. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

[!INCLUDE [Transfer calls Client-side JavaScript](./includes/transfer-calls/transfer-calls-web.md)]

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)