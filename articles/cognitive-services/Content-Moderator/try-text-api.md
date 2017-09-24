---
title: Try the Text API in Azure Content Moderator | Microsoft Docs
description: Try Text API from the online console
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 08/05/2017
ms.author: sajagtap
---

# Text Moderation API

Use the [Text Moderation API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66f) to scan-your text content. The operation scans your content for profanity, comparing it against custom and/or shared blacklists.

## Use the API console
Before you can test-drive the API from the online console, you will need the **Ocp-Apim-Subscription-Key**. This is found under the **Settings** tab, as shown in the [Overview](overview.md) article.

1.	Navigate to the **[Text Moderation API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66f)** page. Click the button that most closely describes your location, under Open API testing console.

  ![Test Drive Text Moderation API Step 1](images/test-drive-region.png)

2.  You will land on the **Text - Screen** API reference.
 
3.	Fill in the desired values. For this example, use the default value for **language**, and select “**true**” for **autocorrect** and **PII**.

  ![Test Drive Text Moderation API Step 1](images/test-drive-text-api-1.png)
 
4.	Specify the Content-Type and enter your subscription key. For this example, use the default “**text/plain**” text type.

5.	Enter some text in the Request Body field. Deliberately include a typo or two.

  ![Test Drive Text Moderation API Step 1](images/test-drive-text-api-2.png)

6.	Notice how the API handled the misspelled words and personally identifiable information.

  ![Test Drive Text Moderation API Step 1](images/test-drive-text-api-3.png)

## Next steps

To learn how to use the image moderation API, see the [Try Image Moderation API](try-image-api.md) article.
