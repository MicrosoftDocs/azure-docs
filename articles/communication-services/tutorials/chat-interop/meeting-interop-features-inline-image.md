---
title: Enable Inline Image Support in your Chat app
titleSuffix: An Azure Communication Services quickstart
description: In this tutorial, you'll learn how to enable inline image interoperability with the Azure Communication Chat SDK
author: jopeng
ms.author: jopeng
ms.date: 03/27/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.custom: mode-other
---

# Tutorial: Enable inline interoperability features in your Chat app

## Add inline image support
The Chat SDK is designed to work with Microsoft Teams seamlessly. Specifically, Chat SDK provides a solution to receive inline images sent by users from Microsoft Teams. Currently this feature is only available in the Chat SDK for JavaScript. 

The Chat SDK for JavaScript provides `previewUrl` and `url` for each inline images. Please note that some GIF images fetched from `previewUrl` might not be animated and a static preview image would be returned instead. Developers are expected to use the `url` if the intention is to fetch animated images only.

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

[!INCLUDE [Teams Inline Image Interop with JavaScript SDK](./includes/meeting-interop-features-inline-image-javascript.md)]

## Next steps

For more information, see the following articles:

- Learn more about other [supported interoperability features](../../concepts/interop/guest/capabilities.md) 
- Check out our [chat hero sample](../../samples/chat-hero-sample.md)
- Learn more about [how chat works](../../concepts/chat/concepts.md)
