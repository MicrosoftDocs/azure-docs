---
title: What is Azure AI Content Moderator?
titleSuffix: Azure AI services
description: Learn how to use Content Moderator to track, flag, assess, and filter inappropriate material in user-generated content.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: overview
ms.date: 11/06/2021
ms.author: pafarley
ms.custom: cog-serv-seo-aug-2020
keywords: content moderator, Azure AI Content Moderator, online moderator, content filtering software, content moderation service, content moderation

#Customer intent: As a developer of content management software, I want to find out whether Azure AI Content Moderator is the right solution for my moderation needs.
---

# What is Azure AI Content Moderator?

[!INCLUDE [deprecation notice](includes/tool-deprecation.md)]

[!INCLUDE [Azure AI services rebrand](../includes/rebrand-note.md)]

Azure AI Content Moderator is an AI service that lets you handle content that is potentially offensive, risky, or otherwise undesirable. It includes the AI-powered content moderation service which scans text, image, and videos and applies content flags automatically.

You may want to build content filtering software into your app to comply with regulations or maintain the intended environment for your users.

This documentation contains the following article types:  

* [**Quickstarts**](client-libraries.md) are getting-started instructions to guide you through making requests to the service.  
* [**How-to guides**](try-text-api.md) contain instructions for using the service in more specific or customized ways.  
* [**Concepts**](text-moderation-api.md) provide in-depth explanations of the service functionality and features.  

For a more structured approach, follow a Training module for Content Moderator.
* [Introduction to Content Moderator](/training/modules/intro-to-content-moderator/)
* [Classify and moderate text with Azure AI Content Moderator](/training/modules/classify-and-moderate-text-with-azure-content-moderator/)

## Where it's used

The following are a few scenarios in which a software developer or team would require a content moderation service:

- Online marketplaces that moderate product catalogs and other user-generated content.
- Gaming companies that moderate user-generated game artifacts and chat rooms.
- Social messaging platforms that moderate images, text, and videos added by their users.
- Enterprise media companies that implement centralized moderation for their content.
- K-12 education solution providers filtering out content that is inappropriate for students and educators.

> [!IMPORTANT]
> You cannot use Content Moderator to detect illegal child exploitation images. However, qualified organizations can use the [PhotoDNA Cloud Service](https://www.microsoft.com/photodna "Microsoft PhotoDNA Cloud Service") to screen for this type of content.

## What it includes

The Content Moderator service consists of several web service APIs available through both REST calls and a .NET SDK.

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

## Data privacy and security

As with all of the Azure AI services, developers using the Content Moderator service should be aware of Microsoft's policies on customer data. See the [Azure AI services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

## Next steps

* Complete a [client library or REST API quickstart](client-libraries.md) to implement the basic scenarios in code.
