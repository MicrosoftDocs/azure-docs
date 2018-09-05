---
title: Azure Content Moderator get started | Microsoft Docs
description: How to get started with Azure Content Moderator.
services: cognitive-services
author: sanjeev3
manager: mikemcca
ms.service: cognitive-services
ms.component: content-moderator
ms.topic: article
ms.date: 01/15/2018
ms.author: sajagtap
---

# Get started with Content Moderator

You get started with Content Moderator APIs and the review tool in the following ways:

- [Start with the review tool](#start-with-the-review-tool) to create both the API keys and a review team. Explore the review tool and learn how to integrate by using the Content Moderator APIs.
- [Subscribe to Content Moderator](#start-with-the-apis) in the Azure portal. You still need to sign up online to create a review team.
- [Use the Flow connector and templates](https://flow.microsoft.com/connectors/shared_cognitiveservicescontentmoderator/content-moderator/) to check out a wide range of integrations with an easy-to-use designer.

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
Review the auto-moderated tags, change if needed, and submit by using the **Next** button. As your business application calls the Moderator APIs, the tagged content starts queuing up, ready to be reviewed by the human review teams. You quickly review large volumes of content using this approach.

![Review results](images/reviewresults.png)

Learn how to use all the [review tool's features](Review-Tool-User-Guide/human-in-the-loop.md) or continue with the next section to learn about the APIs. Skip the sign-up step because you have the API key provisioned for you in the review tool as shown in the [Managing credentials](review-tool-user-guide/credentials.md) article.

### Use the APIs

Now that you've explored the content moderation and review tool experience, learn how to integrate Content Moderator with your business applications. Use the following section to learn more and fast-track your understanding with the SDKs and samples.

## Start with the APIs

[Subscribe to Content Moderator](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesContentModerator) in the Azure portal. Start with one of the following APIs:

### Image moderation

Start with the [API console](try-image-api.md) or use the [.NET quickstart](image-moderation-quickstart-dotnet.md) to scan images and detect potential adult and racy content by using tags, confidence scores, and other extracted information.

### Text moderation

Start with the [API console](try-text-api.md) or use the [.NET quickstart](text-moderation-quickstart-dotnet.md) to scan text content for potential profanity, machine-assisted unwanted text classification (preview), and personally identifiable information (PII). 


### Video moderation

Start with the [.NET quickstart](video-moderation-api.md) to scan videos and detect potential adult and racy content. 


### Review APIs

Start here by choosing from the Job, Review, and Workflow APIs.

- The [Job API](try-review-api-job.md) scans your content by using the moderation APIs and generates reviews in the review tool. 
- The [Review API](try-review-api-review.md) directly creates image, text, or video reviews for human moderators without first scanning the content. 
- The [Workflow API](try-review-api-workflow.md) creates, updates, and gets details about the custom workflows that your team creates.

## Next steps

Learn more about content moderation starting with the [image moderation API](image-moderation-api.md).
