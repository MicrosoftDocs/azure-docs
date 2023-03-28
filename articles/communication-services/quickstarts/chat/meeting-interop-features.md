---
title: Enable Teams interoperability features in your Chat app
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to enable Chat Interop features with the Azure Communication Chat SDK
author: jpeng-ms
ms.author: jpeng-ms
ms.date: 03/27/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: teams-interop
zone_pivot_groups: acs-plat-web
ms.custom: mode-other
---

# Quickstart: Enable Teams interoperability features in your Chat app

The Chat SDK is designed to work with Microsoft Teams seamlessly. From real-time chat messages, typing indicators, read receipts, to inline images, The Chat SDK delivers a comprehensive solution to messaging communications. To learn more about supported interoperability features, [please visite here.](../../concepts/interop/guest/capabilities.md) 

## Add inline image support
Chat SDK privides a solution to receive inline images sent by users from Microsoft Teams. Currently this feature is only avaliable in the Chat SDK for JavaScript. 


[!INCLUDE [Public Preview Notice](../../../../includes/public-preview-include.md)]

::: zone pivot="platform-web"
[!INCLUDE [Teams interop with JavaScript SDK](./includes/meeting-interop-features-inline-image-javascript.md)]
::: zone-end


## Next steps

For more information, see the following articles:

- Check out our [chat hero sample](../../samples/chat-hero-sample.md)
- Learn more about [how chat works](../../concepts/chat/concepts.md)
