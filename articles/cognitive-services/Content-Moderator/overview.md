---
title: Azure Content Moderator overview | Microsoft Docs
description: Learn how to use Content Moderator to track, flag, assess, and filter inappropriate content in user-generated content.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 06/15/2017
ms.author: sajagtap
---

# What is Content Moderator?

Content moderation is the process of monitoring user-generated content on online and social media websites, chat and messaging platforms, enterprise environments, gaming platforms, and peer communication platforms. The goal is to track, flag, assess, and filter out offensive and unwanted content that creates risk for your organization. Moderated content might include text, images, and videos.

## Included APIs

Content moderation in Content Moderator consists of several web service APIs that augment human reviews, and the review tool:

![Content Moderator block diagram](images/content-moderator-block-diagram.png)

Content Moderator includes the following APIs and review tool:
  - [**Text moderation API**](text-moderation-api.md): Use this API to scan text for profanity filtering, detect potential personally identifiable information (PII) and classify it for undesirable content.
  - [**Custom term list API**](try-terms-list-api.md): Use this API to match against custom lists of terms in addition to the built-in terms. Use these lists to block or allow content as per your content policies.  
  - [**Image moderation API**](image-moderation-api.md): Use this API to scan images for adult and racy content, detect text in images with the Optical Character Recognition (OCR) capability, and detect faces.
  - [**Custom image list API**](try-image-list-api.md): Use this API to match against custom lists of images, pre-identified content that you don’t need to classify again.
  - [**Video moderation API**](video-moderation-api.md): Use this API to scan videos for potential adult and racy content.
  - [**Review APIs**](try-review-api-job.md): Use the [Jobs](try-review-api-job.md), [Reviews](try-review-api-review.md), and [Workflow](try-review-api-workflow.md) operations to create and automate human-in-the-loop workflows within the review tool.

## Built-in human-in-the-loop review tool

Your Content Moderator subscription includes the built-in [human review tool](Review-Tool-User-Guide/human-in-the-loop.md). Use the previously mentioned Review API to create reviews of text, images, and videos for your human moderators to take final decisions.

## Next steps

Use the [Quickstart](quick-start.md) to get started with Content Moderator.
