---
title: Enable File Attachnment Support in your Chat app
titleSuffix: An Azure Communication Services quickstart
description: In this tutorial, you'll learn how to enable file attachment interoperability with the Azure Communication Chat SDK
author: jopeng
ms.author: jopeng
ms.date: 05/15/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.custom: mode-other
---

# Tutorial: Enable file attachment support in your Chat app

## Add file attachment support
The Chat SDK is designed to work with Microsoft Teams seamlessly. Specifically, Chat SDK provides a solution to receive file attachment sent by users from Microsoft Teams. Currently this feature is only available in the Chat SDK for JavaScript. 

The Chat SDK for JavaScript provides `previewUrl` and `url` for each file attachment. Specifically, `url` provides a direct download URL to the file. While `previewUrl` provides a link to a webpage on SharePoint where the user can see the content of the file, edit the file and download the file if premission allows. 

You should be aware of couple constraints that come with this feature:

1. The Teams admin of the sender's tenant could have impose policies that limits or disable this feature entirely. For example, the Teams admin could disable certain permissions (such as "Anyone") that could cause the file attachment URLs (`previewUrl` and `Url`) to be inaccessible. 
2. We currently only support the following file permissions:
   - "Anyone", and
   - "People you choose" (with email adress)
   The Teams user sending the file should be made aware of that all other permissions (such as "People in your organization") are not supported. The Teams user should double check if the default permission is supported after uploading the file on their Teams client. 
3. The direct download URL (`url`) might be inaccessible if file is protected (files with restricted permissions such as file being password protected or shared with a specific email address owner)

Please note that Microsoft Teams renders image attachments as inline images in the Teams client. Developers that wanted to achieve the same behaviour are expected to leverage the `contentType` of `teamsImage` with logic that converts image attachments. Please see the bottom of the page for more details.

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

[!INCLUDE [Teams File Attachment Interop with JavaScript SDK](./includes/meeting-interop-features-file-attachment-javascript.md)]

## Next steps

For more information, see the following articles:

- Learn more about [how you can enable inline image support](./meeting-interop-features-inline-image.md)
- Learn more about other [supported interoperability features](../../concepts/interop/guest/capabilities.md)
- Check out our [chat hero sample](../../samples/chat-hero-sample.md)
- Learn more about [how chat works](../../concepts/chat/concepts.md)
