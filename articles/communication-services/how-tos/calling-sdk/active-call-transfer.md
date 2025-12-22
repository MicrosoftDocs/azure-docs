---
title: Active Call Transfer
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to transfer active calls between clients.
author: probableprime
ms.author: dmceachern
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 10/03/2025
ms.custom: template-how-to

#Customer intent: As a developer, I want to learn how to transfer calls between devices so that users have the option to transfer calls to their other devices while in a call.
---

# Active Call Transfer

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

During an active call, you may want to transfer the call to device that you are signed in on. Let's learn how. 



## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)

[!INCLUDE [Transfer active calls Client-side JavaScript](./includes/active-call-transfer/active-call-transfer.md)]

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)