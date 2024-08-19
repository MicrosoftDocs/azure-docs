---
title: How to pass contextual data between calls
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to pass contextual data between calls.
author: aakanmu
ms.author: aakanmu
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 05/14/2024
ms.custom: template-how-to
---

# Passing Contextual Information

In this article, you learn how to pass along custom contextual information when routing calls with Azure Communication Services Calling SDKs. This capability allows users to pass metadata about the call, callee, or any other information that is relevant to their application or business logic.

Contextual information supported includes both freeform custom headers and the standard User-to-User Information (UUI) SIP header. Also when you receive an inbound call, the custom headers and UUI are included in the incomingCall payload.

All custom context data is opaque to Calling SDK or SIP protocols and its content is unrelated to any basic functions.

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- A user access token to enable the calling client. For more information, see [Create and manage access tokens](../../quickstarts/identity/access-tokens.md).
- Optional: Complete the quickstart to [add voice calling to your application](../../quickstarts/voice-video-calling/getting-started-with-calling.md)


[!INCLUDE [Passing Contextual Data - Client-side JavaScript](./includes/call-context/call-context-web.md)]

## Next steps
- [Learn how to manage calls](./manage-calls.md)
- [Learn how to manage video](./manage-video.md)
- [Learn how to record calls](./record-calls.md)
- [Learn how to transcribe calls](./call-transcription.md)