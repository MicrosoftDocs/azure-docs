---
title: Together Mode
titleSuffix: An Azure Communication Services how-to guide
description: Make your Microsoft Teams virtual meetings feel more personal with Teams together mode.
author: cnwankwo
ms.author: cnwankwo
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.topic: how-to 
ms.date: 07/17/2024
ms.custom: template-how-to
---


# Together Mode
In this article, you learn how to implement Microsoft Teams together mode with Azure Communication Services Calling SDKs. This feature enhaces virtual meetings and calls, making them feel more personal. By creating a unified view that places everyone in a shared background, participants can connect seamlessly and collaborate effectively.

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user's access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)


[!INCLUDE [Together Mode Client-side JavaScript](./includes/together-mode/together-mode-web.md)]


## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)