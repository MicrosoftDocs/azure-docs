---
title: Moderate text by using the Text Moderation API in Azure Content Moderator | Microsoft Docs
description: Test-drive text moderation by using the Text Moderation API in the online console.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 08/05/2017
ms.author: sajagtap
---

# Moderate text by using the online console

Use the [Text Moderation API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66f) in Azure Content Moderator to scan your text content. The operation scans your content for profanity, and compares it against custom and shared blacklists.

## Use the API console
Before you can test-drive the API in the online console, you need your subscription key. This is found on the **Settings** tab, in the **Ocp-Apim-Subscription-Key** box. For more information, see [Overview](overview.md).

1.	Go to the [Text Moderation API reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66f). 

  The **Text - Screen** page opens.

2. For **Open API testing console**, select the region that most closely describes your location. 

  ![Text - Screen page region selection](images/test-drive-region.png)

  The **Text - Screen** API console opens.

3.  Select the query parameters that you want to use in your text screen. For this example, use the default value for **language**. For **autocorrect** and **PII**, select **true**.

  ![Text - Screen console query parameters](images/test-drive-text-api-1.png)
 
4.	For **Content-Type**, select the type of content you want to screen. For this example, use the default **text/plain** content type. In the **Ocp-Apim-Subscription-Key** box, enter your subscription key.

5.	In the **Request body** box, enter some text. Deliberately include a typo or two.

  ![Text - Screen console Response body text entry](images/test-drive-text-api-2.png)

6.	See how the API handled the misspelled words and personally identifiable information (PII).

  ![Text - Screen console Response content box results](images/test-drive-text-api-3.png)

## Next steps

* Learn how to use the [Image Moderation API](try-image-api.md).
