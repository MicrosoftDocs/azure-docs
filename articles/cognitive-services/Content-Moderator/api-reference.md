---
title: API reference for Content Moderator  | Microsoft Docs
description: Learn about the Review API, Image and Text Moderation APIs, and List Management API for the Content Moderator.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 02/19/2017
ms.author: sajagtap
---

# API Reference #
You get started with the Content Moderator APIs in the following ways:

  1. [Subscribe to the Content Moderator API](https://portal.azure.com/#create/Microsoft.CognitiveServices/apitype/ContentModerator) on the Microsoft Azure portal.
  1. Sign up for the [content moderator review tool](http://contentmoderator.cognitive.microsoft.com/).

If you sign up for the review tool, you will find your free tier key in the **Credentials** TAB under **Settings** as shown in the following screenshot:

![Your Content Moderator API Key](images/7-Settings-Credentials.png)

## Image Moderation API ##

Use the image moderation API to scan your images and get back predicted tags, their confidence scores, and other extracted information. Use this information to implement your post-moderation workflow such as publish, reject, or review the content within your systems.

[**Image Moderation API Reference**](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66c "Image Moderation API")

## Text Moderation API ##

Use the text moderation API to scan your text content and get back identified profanity terms, predicted tags and confidence scores. Use this information to implement your post-moderation workflow such as publish, reject, or review the content within your systems.

[**Text Moderation API Reference**](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66f "Text Moderation API")

## Review API ##

Use the review API to initiate scan-and-review moderation workflows with both image and text content. The moderation job scans your content by using the image and text moderation APIs. It then uses the default and custom workflows defined within the review tool to generate reviews within the review tool. Once your human moderators have reviewed the auto-assigned tags and prediction data and submitted their final decision, the review API submits all information to your API endpoint.

[**Review API Reference**](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/580519483f9b0709fc47f9c5 "Content Moderator Review API")

## Workflow API ##

Use this API to create, update, and get details of your custom workflows created by your team. You or your team colleagues define these workflows in the review tool. These workflows use Content Moderator or even other APIs available as connectors within the review tool.

[**Workflow API Reference**](https://westus.dev.cognitive.microsoft.com/docs/services/580519463f9b070e5c591178/operations/5813b46b3f9b0711b43c4c59 "Content Moderator Workflow API")

## List Management API ##

Use this API to create and manage your custom exclusion or inclusion lists of images and text. If enabled, the **Image/Match** and **Text/Screen** operations do fuzzy matching of the submitted content against your custom lists and skip the ML-based moderation step for efficiency.

[**List Management API Reference**](https://westus.dev.cognitive.microsoft.com/docs/services/57cf755e3f9b070c105bd2c2/operations/57cf755e3f9b070868a1f675 "Content Moderator List Management API")
