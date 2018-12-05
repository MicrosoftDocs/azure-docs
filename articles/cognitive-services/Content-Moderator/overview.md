---
title: What is Azure Content Moderator?
titlesuffix: Azure Cognitive Services
description: Learn how to use Content Moderator to track, flag, assess, and filter inappropriate material in user-generated content.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: content-moderator
ms.topic: overview
ms.date: 10/22/2018
ms.author: pafarley
#Customer intent: As a developer of content management software, I want to find out whether Azure Content Moderator is the right solution for my moderation needs.
---

# What is Azure Content Moderator?

The Azure Content Moderator API is a cognitive service that checks text, image, and video content for material that is potentially offensive, risky, or otherwise undesirable. When such material is found, the service applies appropriate labels (flags) to the content. Your app can then handle flagged content in order to comply with regulations or maintain the intended environment for users. See the [Content Moderator APIs](#content-moderator-apis) section to learn more about what the different content flags indicate.

## Where it is used

The following are a few scenarios in which a software developer or team would use Content Moderator:

- Online marketplaces that moderate product catalogs and other user-generated content
- Gaming companies that moderate user-generated game artifacts and chat rooms
- Social messaging platforms that moderate images, text, and videos added by their users
- Enterprise media companies that implement centralized moderation for their content
- K-12 education solution providers filtering out content that is inappropriate for students and educators

## What it includes

The Content Moderator service consists of several web service APIs available through both REST calls and a .NET SDK. It also includes the human review tool, which allows human reviewers to aid the service and improve or fine-tune its moderation function.

![block diagram for Content Moderator showing the Moderation APIs, Review APIs, and human review tool](images/content-moderator-block-diagram.png)

### Content Moderator APIs

The Content Moderator service includes APIs for the following scenarios.

| Action | Description |
| ------ | ----------- |
|[**Text moderation**](text-moderation-api.md)| Scans text for offensive content, sexually explicit or suggestive content, profanity, and personally identifiable information (PII).|
|[**Custom term lists**](try-terms-list-api.md)| Scans text against a custom list of terms in addition to the built-in terms. Use custom lists to block or allow content according to your own content policies.|  
|[**Image moderation**](image-moderation-api.md)| Scans images for adult or racy content, detects text in images with the Optical Character Recognition (OCR) capability, and detects faces.|
|[**Custom image lists**](try-image-list-api.md)| Scans images against a custom list of images. Use custom image lists to filter out instances of commonly recurring content that you don't want to classify again.|
|[**Video moderation**](video-moderation-api.md)| Scans videos for adult or racy content and returns time markers for said content.|
|[**Review**](try-review-api-job.md)| Use the [Jobs](try-review-api-job.md), [Reviews](try-review-api-review.md), and [Workflow](try-review-api-workflow.md) operations to create and automate human-in-the-loop workflows with the human review tool. The Workflow API is not yet available through the .NET SDK.|

### Human review tool

The Content Moderator service also includes the web-based [human review tool](Review-Tool-User-Guide/human-in-the-loop.md). 

![Content Moderator human review tool homepage](images/homepage.PNG)

You can use the Review APIs to set up team reviews of text, image, and video content, according to filters that you specify. Then, human moderators can make the final moderation decisions. The human input does not train the service, but the combined work of the service and human review teams allows developers to strike the right balance between efficiency and accuracy.

## Next steps

Follow the [Quickstart](quick-start.md) to get started using Content Moderator.
