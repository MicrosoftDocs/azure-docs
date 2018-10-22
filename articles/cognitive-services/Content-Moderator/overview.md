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

The Content Moderation service scans text, image, or video content for material that is potentially offensive, undesirable, or otherwise risky. Your app can then handle flagged content appropriately in order to comply with regulations or maintain an intended environment for users.

## Where it is used

The following are a few example scenarios where Content Moderator can be used:

- Online marketplaces moderating product catalogs and user-generated content
- Gaming companies moderating user-generated game artifacts and chat rooms
- Social messaging platforms moderating images, text, and videos added by their users
- Enterprise media companies implementing centralized content moderation for their content
- K-12 education solution providers filtering out content that is inappropriate or offensive for students and educators

## What it includes

Content Moderator consists of several web service APIs available through both REST calls and native SDKs. It also includes the human review tool, which allows human reviewers to aid the service and improve or fine-tune its moderation function.

![Content Moderator block diagram](images/content-moderator-block-diagram.png)

### APIs

The Content Moderator service includes the following APIs.
- [**Text moderation**](text-moderation-api.md): Use this API to scan text for offensive or suggestive material, profanity, and personally identifiable information (PII).
- [**Custom term list**](try-terms-list-api.md): Use this API to scan text against a custom lists of terms in addition to the built-in terms. Use custom lists to block or allow content according to your own content policies.  
- [**Image moderation**](image-moderation-api.md): Use this API to scan images for adult or racy content, detect text in images with the Optical Character Recognition (OCR) capability, and detect faces.
- [**Custom image list**](try-image-list-api.md): Use this API to scan images against a custom lists of images. Use custom image lists to filter out instances of commonly recurring content that you don't want to classify again.
- [**Video moderation**](video-moderation-api.md): Use this API to scan videos for adult or racy content.
- [**Review APIs**](try-review-api-job.md): Use the [Jobs](try-review-api-job.md), [Reviews](try-review-api-review.md), and [Workflow](try-review-api-workflow.md) operations to create and automate human-in-the-loop workflows within the human review tool.

### Human review tool

Your Content Moderator subscription includes the built-in [human review tool](Review-Tool-User-Guide/human-in-the-loop.md). Use the previously mentioned Review API to initiate reviews of text, images, and videos so that your human moderators can make the final decisions.

![Content Moderator video review tool](images/video-review-default-view.png)

## Next steps

Follow the [Quickstart](quick-start.md) to get started with Content Moderator.
