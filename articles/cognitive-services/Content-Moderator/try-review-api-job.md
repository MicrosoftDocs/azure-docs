---
title: Run content moderation jobs in Azure Content Moderator | Microsoft Docs
description: Learn how to run content moderation jobs in the API console.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 08/03/2017
ms.author: sajagtap
---

# Run content moderation jobs in the API console

Use the Review API's [job operations](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/580519483f9b0709fc47f9c5) to initiate end-to-end content moderation jobs for image or text content in Azure Content Moderator. 

The moderation job scans your content by using the Content Moderator Image Moderation API or Text Moderation API. Then, the moderation job uses the default and custom workflows (defined by using the Review tool) to generate reviews in the Review tool. 

After a human moderator reviews the auto-assigned tags and prediction data and submits a final moderation decision, the Review API submits all information to your API endpoint.

## Use the API console
To test-drive the API by using the online console, you need a few values to enter into the console:

- **teamName**: The team name that you created when you set up your Review tool account. 
- **ContentId**: This string is passed to the API and returned through the callback. **ContentId** is useful for associating internal identifiers or metadata with the results of a moderation job.
- **Workflowname**: The name of the workflow that you created. For a quick test, you can use the value **Default**.
- **Ocp-Apim-Subscription-Key**: Located on the **Settings** tab. For more information, see [Overview](overview.md).

The simplest way to access a testing console is from the **Credentials** window.

1.	In the **Credentials** window, select [API reference](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/580519483f9b0709fc47f9c5).

  The **Job - Create** page opens.

2.	For **Open API testing console**, select the region that most closely describes your location.

  ![Job - Create page region selection](images/test-drive-job-1.png)

  The **Job - Create** API console opens. 
  
3.	Enter values for the required query parameters, and your subscription key. In the **Request body** box, specify the location of the information that you want to scan.

  ![Job - Create console query parameters, headers, and Request body box](images/test-drive-job-2.png)
  
4.	Select **Send**. A job ID is created. Copy this to use in the next steps.

  ![Job - Create console Response content box displays the job ID](images/test-drive-job-3.png)
  
5.	Select **Get**, and then open the API by selecting the button that matches your region.

  ![Job - Create console Get results](images/test-drive-job-4.png)
  
6.	Enter values for **teamName** and **JobID**. Enter your subscription key, and then select **Send**. The results of the scan are returned.

  ![Job - Create console Response content box](images/test-drive-job-5.png)
  
7.	On the Content Moderator Dashboard, select **Review** > **Image**. The image that you scanned appears, ready for human review.

  ![Review tool image of three cyclists](images/test-drive-job-6.png)

## Next steps

* Learn how to [create reviews with no scanning](try-review-api-review.md).
