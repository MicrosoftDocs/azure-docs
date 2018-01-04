---
title: Azure Content Moderator get started | Microsoft Docs
description: How to get started with Azure Content Moderator.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 09/15/2017
ms.author: sajagtap
---

# Get started with Content Moderator

You get started with Content Moderator in the following ways:

- In the Azure portal, [subscribe to the Content Moderator APIs](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesContentModerator).
- Sign up for the [Content Moderator Review tool](http://contentmoderator.cognitive.microsoft.com/) to interactively explore the content moderation and review tool.

Regardless of the option you choose, see the [Managing credentials](review-tool-user-guide/credentials.md) article to find your API credentials.

The rest of this article assumes that you chose the review tool sign up option.

## Sign up for the review tool
You can either sign up with your Microsoft account or create an account on the Content Moderator web site.
Navigate to the [Content Moderator sign up](http://contentmoderator.cognitive.microsoft.com/) page. Click **Sign Up**.

![Content Moderator Home Page](images/homepage.PNG)

## Create a review team
Give your team a name. If you want to invite your colleagues, you can do so by entering their email addresses.

![Invite team member](images/QuickStart-2-small.png)

## Upload images or enter text
Click **Try > Image** or **Try > Text**. Upload up to five sample images or enter sample text for moderation.

![Try Image or Text Moderation](images/tryimagesortext.png)

## Submit for automated moderation
Submit your content for automated moderation. Internally, the review tool calls the moderation APIs to scan your content. Once the scanning is complete, you see a message informing you about the results waiting for your review.

![Moderate files](images/submitted.png)

## Review and confirm results
As your business application calls the Moderator APIs, the tagged content starts queuing up, ready to be reviewed by the human review teams. You can quickly review large volumes of content using this approach. You are doing a few different things as part of your moderation workflow such as browsing the tagged content, changing the tags, and submitting your decisions.

![Review results](images/reviewresults.png)

## Next steps: Use the APIs
Once you have explored the review tool, test drive the [Content Moderator APIs](api-reference.md), starting with the [Image moderation API](try-image-api.md) to scan your images, text, and videos in bulk and optionally, create reviews for human moderators.
