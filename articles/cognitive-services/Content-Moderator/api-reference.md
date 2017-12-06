---
title: Content moderation API reference for Azure Content Moderator  | Microsoft Docs
description: Content moderation and Review APIs of Content Moderator
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 06/25/2017
ms.author: sajagtap
---

# Content Moderator API reference
You get started with the Content Moderator APIs in the following ways:

  1. [Subscribe to the Content Moderator API](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesContentModerator) on the Microsoft Azure portal.
  1. Sign up for the [Content Moderator review tool](http://contentmoderator.cognitive.microsoft.com/). See the screenshot in the [Overview](overview.md) article.

## Content moderation

| API Description | API Reference |
| -------------------- |-------------|
| **Image Moderation**: Scan images and detect possible adult and racy content, with tags and confidence scores, and other extracted information. Use this information to implement your post-moderation workflow: publish, reject, or review the content.   | [Image Moderation API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66c "Image Moderation API Reference")   |
| **Text Moderation**: Scan text content and get back identified profanity terms and Personal Identifiable Information (PII). Use this information to implement your post-moderation workflow: publish, reject, or review the content. | [Text Moderation API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66f "Text Moderation API Reference")   |
| **Video Moderation**: Scan videos and detect potential adult and racy content. Use this information to implement your post-moderation workflow: publish, reject, or review the content. | [Video Moderation API Overview](video-moderation-api.md "Video Moderation API Overview")   |
| **List Management**: Create and manage custom exclusion or inclusion lists of images and text. If enabled, the Image/Match and Text/Screen operations do fuzzy matching of the submitted content against your custom lists, and skip the ML-based moderation step for efficiency. | [List Management API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f675 "List Management API Reference")   |

## Review API

| Description | Reference |
| -------------------- |-------------|
| **Jobs**: Initiate scan-and-review moderation workflows with both image and text content. The moderation job scans your content by using the Image and Text Moderation APIs. It then uses the defined and default workflows to generate reviews. Once your human moderators have reviewed the auto-assigned tags and prediction data and submitted their final decision, the API submits all information to your API endpoint. | [Job Reference](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/580519483f9b0709fc47f9c5 "Job Reference")   |
| **Reviews**: Directly create image or text reviews in the review tool for human moderators. Once your human moderators have reviewed the tags and meta data and submitted their final decision, the API submits all information to your API endpoint. | [Review Reference](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/580519483f9b0709fc47f9c4 "Review Reference")   |
| **Workflows**: Create, update, and get details of the custom workflows created by your team. (Workflows are defined using the Review Tool.) Workflows typically use Content Moderator, but can also use certain other APIs that are available as connectors within the Review Tool. | [Workflow Reference](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/5813b46b3f9b0711b43c4c59 "Workflow Reference")   |
