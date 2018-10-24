---
title: What is Azure Content Moderator?
titlesuffix: Azure Cognitive Services
description: Learn how to use Content Moderator to track, flag, assess, and filter inappropriate material in user-generated content.
services: cognitive-services
author: sanjeev3
manager: cgronlun

ms.service: cognitive-services
ms.component: content-moderator
ms.topic: overview
ms.date: 10/22/2018
ms.author: sajagtap
#Customer intent: As a developer of content-providing software, I want to ensure that only appropriate content is delivered to my users.
---

# What is Content Moderator?

The Content Moderator service is a utility that scans text, image, or video content for material that is potentially offensive, undesirable, or otherwise risky. When such material is found, the service applies appropriate labels (flags) to the content. Your app can then handle flagged content as desired in order to comply with regulations or maintain the intended environment for users. See the [Image](image-moderation-api.md), [Text](text-moderation-api.md), and [Video](video-moderation-api.md) moderation topics to learn more about what the different content flags indicate.

## Where it is used

The following are a few scenarios in which a software developer or team would use Content Moderator:

- Online marketplaces moderating product catalogs and user-generated content
- Gaming companies moderating user-generated game artifacts and chat rooms
- Social messaging platforms moderating images, text, and videos added by their users
- Enterprise media companies implementing centralized content moderation for their content
- K-12 education solution providers filtering out content that is inappropriate or offensive for students and educators

## What it includes

The Content Moderator service consists of several web service APIs available through both REST calls and a .NET SDK. It also includes the human review tool, which allows human reviewers to aid the service and improve or fine-tune its moderation function.

> [!NOTE]
> The [Workflow API](try-review-api-workflow.md) is not yet available through the .NET SDK.

![Content Moderator block diagram](images/content-moderator-block-diagram.png)

### Content Moderator APIs

The Content Moderator service includes APIs for the following scenarios.

| Action | Description |
| ------ | ----------- |
|[**Text moderation**](text-moderation-api.md)| Use this API to scan text for offensive or suggestive material, profanity, and personally identifiable information (PII).|
|[**Custom term lists**](try-terms-list-api.md)| Use this API to scan text against a custom lists of terms in addition to the built-in terms. Use custom lists to block or allow content according to your own content policies.|  
|[**Image moderation**](image-moderation-api.md)| Use this API to scan images for adult or racy content, detect text in images with the Optical Character Recognition (OCR) capability, and detect faces.|
|[**Custom image lists**](try-image-list-api.md)| Use this API to scan images against a custom lists of images. Use custom image lists to filter out instances of commonly recurring content that you don't want to classify again.|
|[**Video moderation**](video-moderation-api.md)| Use this API to scan videos for adult or racy content.|
|[**Review**](try-review-api-job.md)| Use the [Jobs](try-review-api-job.md), [Reviews](try-review-api-review.md), and [Workflow](try-review-api-workflow.md) operations to create and automate human-in-the-loop workflows with the human review tool.|

### Human review tool

The Content Moderator service also includes the web-based [human review tool](Review-Tool-User-Guide/human-in-the-loop.md). 

![Content Moderator Home Page](images/homepage.PNG)

You can use the Review APIs to set up team reviews of text, image, and video content, according to filters that you specify. Then, human moderators can make the final moderation decisions. The human input does not train the service, but the combined work of the service and human review teams allows developers to strike the right balance between efficiency and accuracy.

## Next steps

Follow the [Quickstart](quick-start.md) to get started using Content Moderator.
