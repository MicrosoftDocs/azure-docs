---
title: Enable Inline Image Support in your Chat app
titleSuffix: An Azure Communication Services quickstart
description: In this tutorial, you learn how to enable inline image interoperability with the Azure Communication Chat SDK.
author: jpeng-ms
ms.author: jopeng
ms.date: 03/27/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.custom: mode-other, devx-track-js
---

# Tutorial: Enable inline image support in your Chat app

The Chat SDK is designed to work with Microsoft Teams seamlessly. Specifically, Chat SDK provides a solution to receive inline images sent by users from Microsoft Teams. Currently this feature is only available in the Chat SDK for JavaScript. 

## Add inline image support

Inline images are images that are copied and pasted directly into the send box of the Teams client. For images that were uploaded via the "Upload from this device" menu or via drag-and-drop, such as images dragged directly to the send box in Teams, you need to refer to [this tutorial](./meeting-interop-features-file-attachment.md) to enable it as the part of the file sharing feature. (See the section "Handling Image Attachment.") To copy an image, the Teams user can either use their operating system's context menu to copy the image file and then paste it into the send box of their Teams client or use keyboard shortcuts.

The Chat SDK for JavaScript provides `previewUrl` and `url` for each inline image. Note that some GIF images fetched from `previewUrl` might not be animated, and a static preview image may be returned instead. Developers are expected to use the `url` if the intention is to fetch animated images only.


::: zone pivot="platform-javascript" [!INCLUDE [Teams Inline Image Interop with JavaScript SDK](./includes/meeting-interop-features-inline-image-javascript.md)] ::: zone-end

::: zone pivot="programming-language-python" [!INCLUDE [Teams Inline Image Interop with Python SDK](./includes/meeting-interop-features-inline-image-python.md)] ::: zone-end

::: zone pivot="programming-language-java" [!INCLUDE [Teams Inline Image Interop with Java SDK](./includes/meeting-interop-features-inline-image-java.md)] ::: zone-end

::: zone pivot="programming-language-csharp" [!INCLUDE [Teams Inline Image Interop with C# SDK](./includes/meeting-interop-features-inline-image-csharp.md)] ::: zone-end


## Next steps

For more information, see the following articles:

- Learn more about other [supported interoperability features](../../concepts/interop/guest/capabilities.md) 
- Check out our [chat hero sample](../../samples/chat-hero-sample.md)
- Learn more about [how chat works](../../concepts/chat/concepts.md)
