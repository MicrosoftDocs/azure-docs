---
title: Try the Image API in Azure Content Moderator | Microsoft Docs
description: Try Image API from the online console
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 08/05/2017
ms.author: sajagtap
---

# Try the Image Moderation API #

## About the Image Moderation API ##
Use the [Image Moderation API](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66c) to initiate scan-and-review moderation workflows with text content. The moderation job scans your content for profanity, comparing it against custom and/or shared blacklists.

## Try with the API console ##
Before you can test-drive the API from the online console, you will need the **Ocp-Apim-Subscription-Key**. This is found under the Settings tab, as shown below.

![Content Moderator credentials in the review tool](Review-Tool-User-Guide/images/credentials-2-reviewtool.png)

1.	Navigate to the **[Image Moderation API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66c)** page. Click the button that most closely describes your location, under Open API testing console.

  ![Try Image Moderation API Step 1](images/test-drive-region.png)

2.  You will land on the **Image - Evaluate** API console.

3.  Enter your subscription key in the **Ocp-Apim-Subscription-Key** field.

  ![Try Image Moderation API Step 2](images/test-image-api-1.PNG)

4.  Use the default sample image included in the **Request Body** field. 

   ![Try Image Moderation API Step 3](images/test-image-api-2.PNG)

5.  This is the image on that URL:

  ![Try Image Moderation API Sample Image](images/sample-image.PNG)

5. Click "**Send**".

6. You see a response back from the API that includes this information:
- The Adult and racy match boolean values
- The Adult and Racy match confidence scores

  ![Try Image Moderation API Step 3](images/test-image-api-3.PNG)

## Text detection via OCR capability

1. Click the "**OCR**" option on the left hand side menu. You land on the [OCR reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66b) page.

2. Click the button that most closely describes your location, under **Open API testing console**.

  ![Try Image Moderation API Step 1](images/test-drive-region.png)

  You land on the [OCR test console](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66b).

3. Enter your subscription key in the **Ocp-Apim-Subscription-Key** field.

4.  Use the default sample image included in the **Request Body** field. This is the same image as above.

5. Click **Send**. You will see the extracted text in the JSON as shown below:

  ![Try Image Moderation API OCR](images/test-image-ocr.PNG)

## Next steps ##

To learn how to use the text moderation API, see the [Try text moderation](try-text-api.md) article.
