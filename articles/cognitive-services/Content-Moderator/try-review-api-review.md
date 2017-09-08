---
title: Try Review operations in Azure Content Moderator | Microsoft Docs
description: Try Review API's Review operations
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 08/05/2017
ms.author: sajagtap
---

# Try the review operations

Use the Review API's [Review operations](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/580519483f9b0709fc47f9c4) to create image or text reviews within the review tool for human moderation. You would use this operation based on your post-moderation business logic after you have scanned your content using any of the Content Moderator image or text APIs or other Cognitive Services. Once your human moderators have reviewed the auto-assigned tags and prediction data and submitted their final decision, the Review API submits all information to your API endpoint.

## Try with the API console
Before you can test-drive the API from the online console, you will need a few values.

- teamName: The team name you created when you set up your review tool account. 
- ContentId: A string, this is passed to the API and returned through the callback, and is useful for associating internal identifiers or metadata with the results of a moderation job.
- Metadata: Custom key value pairs returned to your API endpoint during the callback. Additionally, if the key is a short code defined within the review tool, it shows up as a tag.
- Ocp-Apim-Subscription-Key: This is found under the Settings tab, as shown below.

![Content Moderator credentials in the review tool](Review-Tool-User-Guide/images/credentials-2-reviewtool.png)

The simplest way to access a testing console is from the Credentials window.
1.	From the Credentials window, click **[API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/580519483f9b0709fc47f9c4)**.

2.	Navigate to the **Review – Create** operation. Click the button that most closely describes your location, under Open API testing console.

  ![Test Drive Review Step 2](images/test-drive-region.png)
  
3.	Fill in the required values, and edit the Request Body to specify the content (for example, image location), metadata, and other information associated with the content.

  ![Test Drive Review Step 3](images/test-drive-review-1.PNG)
  
4.	Click **Send**. A Review ID is created. Copy this to use in the next steps.

  ![Test Drive Review Step 4](images/test-drive-review-2.PNG)
  
5.	Click **Get**, then open the API by clicking the button matching your region.

  ![Test Drive Review Step 5](images/test-drive-review-3.PNG)
  
6.	Fill in **teamName** and the **Review ID** you just created. Enter your subscription key and click Send. The results of the scan are returned.

  ![Test Drive Review Step 6](images/test-drive-review-4.PNG)
  
7.	Go to the Content Moderator Dashboard, and click **Review > Image**. The image you just scanned displays, ready for human review.

  ![Test Drive Review Step 7](images/test-drive-review-5.PNG)

## Next steps

To learn how to define workflows, see the [Moderation workflows](try-review-api-workflow.md) article.
