---
title: What is Azure Content Moderator?
titleSuffix: Azure Cognitive Services
description: Learn how to use Content Moderator to track, flag, assess, and filter inappropriate material in user-generated content.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: overview
ms.date: 04/14/2020
ms.author: pafarley

#Customer intent: As a developer of content management software, I want to find out whether Azure Content Moderator is the right solution for my moderation needs.
---

# What is Azure Content Moderator?

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

Azure Content Moderator is a cognitive service that checks text, image, and video content for material that is potentially offensive, risky, or otherwise undesirable. When this material is found, the service applies appropriate labels (flags) to the content. Your app can then handle flagged content in order to comply with regulations or maintain the intended environment for users. See the [Moderation APIs](#moderation-apis) section to learn more about what the different content flags indicate.

## Where it's used

The following are a few scenarios in which a software developer or team would use Content Moderator:

- Online marketplaces that moderate product catalogs and other user-generated content.
- Gaming companies that moderate user-generated game artifacts and chat rooms.
- Social messaging platforms that moderate images, text, and videos added by their users.
- Enterprise media companies that implement centralized moderation for their content.
- K-12 education solution providers filtering out content that is inappropriate for students and educators.

> [!NOTE]
> You cannot use Content Moderator to detect illegal child exploitation images. However, qualified organizations can use the [PhotoDNA Cloud Service](https://www.microsoft.com/photodna "Microsoft PhotoDNA Cloud Service") to screen for this type of content.

## What it includes

The Content Moderator service consists of several web service APIs available through both REST calls and a .NET SDK. It also includes the Review tool, which allows human reviewers to aid the service and improve or fine-tune its moderation function.

## Moderation APIs

The Content Moderator service includes Moderation APIs, which check content for material that is potentially inappropriate or objectionable.

![block diagram for Content Moderator moderation APIs](images/content-moderator-mod-api.png)

The following table describes the different types of moderation APIs.

| API group | Description |
| ------ | ----------- |
|[**Text moderation**](text-moderation-api.md)| Scans text for offensive content, sexually explicit or suggestive content, profanity, and personal data.|
|[**Custom term lists**](try-terms-list-api.md)| Scans text against a custom list of terms along with the built-in terms. Use custom lists to block or allow content according to your own content policies.|  
|[**Image moderation**](image-moderation-api.md)| Scans images for adult or racy content, detects text in images with the Optical Character Recognition (OCR) capability, and detects faces.|
|[**Custom image lists**](try-image-list-api.md)| Scans images against a custom list of images. Use custom image lists to filter out instances of commonly recurring content that you don't want to classify again.|
|[**Video moderation**](video-moderation-api.md)| Scans videos for adult or racy content and returns time markers for said content.|

## Review APIs

The Review APIs let you integrate your moderation pipeline with human reviewers. Use the [Jobs](review-api.md#jobs), [Reviews](review-api.md#reviews), and [Workflow](review-api.md#workflows) operations to create and automate human-in-the-loop workflows with the [Review tool](#review-tool) (below).

> [!NOTE]
> The Workflow API is not yet available in the .NET SDK but can be used with the REST endpoint.

![block diagram for Content Moderator review APIs](images/content-moderator-rev-api.png)

## Review tool

The Content Moderator service also includes the web-based [Review tool](Review-Tool-User-Guide/human-in-the-loop.md), which hosts the content reviews for human moderators to process. The human input doesn't train the service, but the combined work of the service and human review teams allows developers to strike the right balance between efficiency and accuracy. The Review tool also provides a user-friendly front end for several Content Moderator resources.

![Content Moderator Review tool homepage](images/homepage.PNG)

## Data privacy and security

As with all of the Cognitive Services, developers using the Content Moderator service should be aware of Microsoft's policies on customer data. See the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

## Next steps

Get started using the Content Moderator service by following the instructions in [Try Content Moderator on the web](quick-start.md).
