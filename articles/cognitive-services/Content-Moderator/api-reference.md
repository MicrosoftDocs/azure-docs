---
title: API reference - Content Moderator
titlesuffix: Azure Cognitive Services
description: Learn about the various content moderation and review APIs for Content Moderator.
services: cognitive-services
author: sanjeev3
manager: nitinme

ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: reference
ms.date: 05/29/2019
ms.author: sajagtap

---

# Content Moderator API reference

You can get started with Azure Content Moderator APIs in the following ways:

- In the Azure portal, [subscribe to the Content Moderator API](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesContentModerator).
- See [Try Content Moderator on the web](quick-start.md) to sign up with the [Content Moderator Review tool](https://contentmoderator.cognitive.microsoft.com/).

## Moderation APIs

You can use the following Content Moderator APIs to set up your post-moderation workflows.

| Description | Reference |
| -------------------- |-------------|
| **Image Moderation API**<br /><br />Scan images and detect potential adult and racy content by using tags, confidence scores, and other extracted information. <br /><br />Use this information to publish, reject, or review the content in your post-moderation workflow. <br /><br />| [Image Moderation API reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66c "Image Moderation API reference")   |
| **Text Moderation API**<br /><br />Scan text content. Profanity terms and personal data are returned. <br /><br />Use this information to publish, reject, or review the content in your post-moderation workflow.<br /><br /> | [Text Moderation API reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66f "Text Moderation API reference")   |
| **Video Moderation API**<br /><br />Scan videos and detect potential adult and racy content. <br /><br />Use this information to publish, reject, or review the content in your post-moderation workflow.<br /><br /> | [Video Moderation API overview](video-moderation-api.md "Video Moderation API overview")   |
| **List Management API**<br /><br />Create and manage custom exclusion or inclusion lists of images and text. If enabled, the **Image - Match** and **Text - Screen** operations do fuzzy matching of the submitted content against your custom lists. <br /><br />For efficiency, you can skip the machine learning-based moderation step.<br /><br /> | [List Management API reference](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f675 "List Management API reference")   |

## Review APIs

The Review APIs have the following components:

| Description | Reference |
| -------------------- |-------------|
| **Jobs**<br /><br /> Initiate scan-and-review moderation workflows for both image and text content. A moderation job scans your content by using the Image Moderation API and the Text Moderation API. Moderation jobs use the defined and default workflows to generate reviews. <br /><br />After a human moderator has reviewed the auto-assigned tags and prediction data and submitted a content moderation decision, the Review API submits all information to your API endpoint.<br /><br /> | [Job reference](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/580519483f9b0709fc47f9c5 "Job reference")   |
| **Reviews**<br /><br />Use the Review tool to directly create image or text reviews for human moderators.<br /><br /> After a human moderator has reviewed the auto-assigned tags and prediction data and submitted a content moderation decision, the Review API submits all information to your API endpoint.<br /><br /> | [Review reference](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/580519483f9b0709fc47f9c4 "Review reference")   |
| **Workflows**<br /><br />Create, update, and get details about the custom workflows that your team creates. You define workflows by using the Review tool. <br /> <br />Workflows typically use Content Moderator, but can also use certain other APIs that are available as connectors in the Review tool.<br /><br /> | [Workflow reference](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/5813b46b3f9b0711b43c4c59 "Workflow reference")   |