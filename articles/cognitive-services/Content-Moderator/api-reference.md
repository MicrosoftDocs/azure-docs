---
title: API reference for Content Moderator  | Microsoft Docs
description: Learn about the Image and Text Moderation, and Review APIs for Content Moderator.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 06/25/2017
ms.author: sajagtap
---

# API Reference #
You get started with the Content Moderator APIs in the following ways:

  1. [Subscribe to the Content Moderator API](https://portal.azure.com/#create/Microsoft.CognitiveServices/apitype/ContentModerator) on the Microsoft Azure portal.
  1. Sign up for the [content moderator review tool](http://contentmoderator.cognitive.microsoft.com/).

If you sign up for the review tool, you will find your free tier key in the **Credentials** TAB under **Settings** as shown in the following screenshot:

![Your Content Moderator API Key](images/7-Settings-Credentials.png)

## Content Moderation APIs ##

| API Description | API Reference |
| -------------------- |-------------|
| **Image Moderation** : Scan images and get back predicted tags, their confidence scores, and other extracted information. Use this information to implement your post-moderation workflow: publish, reject, or review the content within your systems.   | [Image Moderation API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66c "Image Moderation API Reference")   |
| **Text Moderation API** : Scan text content and get back identified profanity terms and Personal Identifiable Information (PII). Use this information to implement your post-moderation workflow: publish, reject, or review the content within your systems. | [Text Moderation API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66f "Text Moderation API Reference")   |
| **List Management API** : Create and manage custom exclusion or inclusion lists of images and text. If enabled, the Image/Match and Text/Screen operations do fuzzy matching of the submitted content against your custom lists, and skip the ML-based moderation step for efficiency. | [List Management API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f675 "List Management API Reference")   |

## Review APIs ##

| API Description | API Reference |
| -------------------- |-------------|
| **Review Tool API**: Initiate scan-and-review moderation workflows with both image and text content. The moderation job scans your content by using the Image and Text Moderation APIs. It then uses the defined and default workflows to generate reviews. Once your human moderators have reviewed the auto-assigned tags and prediction data and submitted their final decision, the Review Tool API submits all information to your API endpoint. | [Review Tool API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/580519483f9b0709fc47f9c5 "Review Tool API Reference")   |
| **Workflow API**: Create, update, and get details of the custom workflows created by your team. (Workflows are defined using the Review Tool.) Workflows typically use Content Moderator, but can also use certain other APIs that are available as connectors within the Review Tool. | [Workflow API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/5813b46b3f9b0711b43c4c59 "Workflow API Reference")   |
