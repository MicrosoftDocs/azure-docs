---
title: Azure Content Moderator get started | Microsoft Docs
description: How to get started with Azure Content Moderator.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 01/15/2018
ms.author: sajagtap
---

# Get started with Content Moderator

You get started with Content Moderator APIs and review tool in the following ways:

- [Start with the review tool](#start-with-the-review-tool) to create both, the API keys and a review team.
- [Start with the Azure portal](#start-with-the-azure-portal) to subscribe to the APIs. You still need to sign up online to create a review team.

Regardless of the option you choose, see the [Managing credentials](review-tool-user-guide/credentials.md) article to find your API credentials.

## Start with the review tool
[Sign up](http://contentmoderator.cognitive.microsoft.com/) on the Content Moderator review tool web site.

![Content Moderator Home Page](images/homepage.PNG)

### Create a review team
Give your team a name. If you want to invite your colleagues, you can do so by entering their email addresses.

![Invite team member](images/QuickStart-2-small.png)

### Upload images or enter text
Click **Try > Image** or **Try > Text**. Upload up to five sample images or enter sample text for moderation.

![Try Image or Text Moderation](images/tryimagesortext.png)

### Submit for automated moderation
Submit your content for automated moderation. Internally, the review tool calls the moderation APIs to scan your content. Once the scanning is complete, you see a message informing you about the results waiting for your review.

![Moderate files](images/submitted.png)

### Review and confirm results
Review the auto-moderated tags, change if needed, and submit by using the **Next** button. As your business application calls the Moderator APIs, the tagged content starts queuing up, ready to be reviewed by the human review teams. You can quickly review large volumes of content using this approach.

![Review results](images/reviewresults.png)

### Next steps

Learn how to use all the review tool's features or continue with the next section to learn about the APIs. Skip the sign up step because you have the API key provisioned for you in the review tool as shown in the [Managing credentials](review-tool-user-guide/credentials.md) article.

## Start with the Azure portal

[Subscribe to Content Moderator](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesContentModerator) in the Azure portal. You need to create an Azure account if you do not have one already. Browse all the [Content Moderator APIs](api-reference.md) and start with the one that you are interested in.

### Use the image moderation APIs

Scan images and detect potential adult and racy content by using tags, confidence scores, and other extracted information. 

### Use the text moderation APIs

Scan text content. Profanity terms and personally identifiable information (PII) are returned. 

### Use the video moderation API

Scan videos and detect potential adult and racy content. 

### Use the review APIs

Choose from the Job, Review, and the Workflow APIs.
- The Job API scans your content by using the moderation APIs and uses default workflows to generate reviews in the review tool. 
- The Review API directly creates image, text, or video reviews for human moderators without scanning the content. 
- The Workflow API creates, updates, and get details about the custom workflows that your team creates.
