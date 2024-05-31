---
title: Enable file attachment support in your Chat app
titleSuffix: An Azure Communication Services quickstart
description: In this tutorial, you learn how to enable file attachment interoperability with the Azure Communication Chat SDK.
author: jopeng
ms.author: jopeng
ms.date: 05/15/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.custom: mode-other, devx-track-js
zone_pivot_groups: acs-interop-chat-tutorial-js-csharp
---

# Tutorial: Enable file attachment support in your Chat app

The Chat SDK works seamlessly with Microsoft Teams in the context of a meeting. Only a Teams user can send file attachments to an Azure Communication Services user. An Azure Communication Services user can't send file attachments to a Teams user. For the current capabilities, see [Teams interop Chat](../../concepts/interop/guest/capabilities.md).

## Add file attachment support

The Chat SDK provides the `previewUrl` property for each file attachment. Specifically, `previewUrl` links to a webpage on SharePoint where the user can see the content of the file, edit the file, and download the file if permission allows.

Some constraints are associated with this feature:

- The Teams admin of the sender's tenant could impose policies that limit or disable this feature entirely. For example, the Teams admin could disable certain permissions (such as `Anyone`) that could cause the file attachment URL (`previewUrl`) to be inaccessible.
- We currently support only two file permissions:

    - `Anyone`
    - `People you choose` (with email address)

   Let your Teams users know that all other permissions (such as `People in your organization`) aren't supported. Your Teams users should double-check to make sure the default permission is supported after they upload the file on their Teams client.
- The direct download URL (`url`) isn't supported.

In addition to regular files (with `AttachmentType` of `file`), the Chat SDK also provides the `AttachmentType` property of `image`. Azure Communication Services users can attach images in a way that mirrors the behavior of how the Microsoft Teams client converts image attachment to inline images at the UI layer. For more information, see [Handle image attachments](#handle-image-attachments).

Azure Communication Services users can add images via **Upload from this device**, which renders on the Teams side and the Chat SDK returns such attachments as `image`. For images uploaded via **Attach cloud files**, images are treated as regular files on the Teams side so that the Chat SDK returns such attachments as `file`.

Also note that Azure Communication Services users can only upload files by using drag-and-drop or via the attachment menu commands **Upload from this device** and **Attach cloud files**. Certain types of messages with embedded media (such as video clips, audio messages, and weather cards) aren't currently supported.

::: zone pivot="programming-language-javascript"
[!INCLUDE [Teams File Attachment Interop with JavaScript SDK](./includes/meeting-interop-features-file-attachment-javascript.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [Teams File Attachment Interop with C# SDK](./includes/meeting-interop-features-file-attachment-csharp.md)]
::: zone-end

## Next steps

- Learn more about [how you can enable inline image support](./meeting-interop-features-inline-image.md).
- Learn more about other [supported interoperability features](../../concepts/interop/guest/capabilities.md).
- Check out our [Chat hero sample](../../samples/chat-hero-sample.md).
- Learn more about [how Chat works](../../concepts/chat/concepts.md).
