---
title: SDKs and samples - Content Moderator, Python, Java, Node.js, and .NET
titlesuffix: Azure Cognitive Services
description: Get SDKs and samples for Content Moderator
services: cognitive-services
author: sanjeev3
manager: cgronlun

ms.service: cognitive-services
ms.component: content-moderator
ms.topic: sample
ms.date: 02/27/2018
ms.author: sajagtap
---

# Content Moderator SDKs and samples

## SDKs for Python, Java, Node.js, and .NET

- [Content Moderator SDK for Python](https://pypi.python.org/pypi/azure-cognitiveservices-vision-contentmoderator)
- [Content Moderator SDK for Java](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-cognitiveservices-contentmoderator%22)
- [Content Moderator SDK for Node.js](https://www.npmjs.com/package/azure-cognitiveservices-contentmoderator)
- [Content Moderator SDK for .NET](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.ContentModerator/)

## .NET SDK samples

The following list includes links to the code samples built using the Azure Content Moderator SDK for .NET.

- **Helper library**: [Create a Content Moderator client for use in other samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/ModeratorHelper/Clients.cs). See [quickstart](content-moderator-helper-quickstart-dotnet.md).

### Moderation 
- **Image moderation**: [Evaluate an image for adult and racy content, text, and faces](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/ImageModeration/Program.cs). See [quickstart](image-moderation-quickstart-dotnet.md).
- **Custom images**: [Moderate with custom image lists](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/ImageListManagement/Program.cs). See [quickstart](image-lists-quickstart-dotnet.md).

> [!NOTE]
> There is a maximum limit of **5 image lists** with each list to **not exceed 10,000 images**.
>

- **Text moderation**: [Screen text for profanity and personally identifiable information (PII)](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/TextModeration/Program.cs). See [quickstart](text-moderation-quickstart-dotnet.md).
- **Custom terms**: [Moderate with custom term lists](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/TermListManagement/Program.cs). See [quickstart](term-lists-quickstart-dotnet.md).

> [!NOTE]
> There is a maximum limit of **5 term lists** with each list to **not exceed 10,000 terms**.
>

- **Video moderation**: [Scan a video for adult and racy content and get results](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/VideoModeration/Program.cs). See [quickstart](video-moderation-api.md).

### Review
- **Image jobs**: [Start a moderation job that scans and creates reviews](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/ImageJobs/Program.cs). See [quickstart](moderation-jobs-quickstart-dotnet.md).
- **Image reviews**: [Create reviews for human-in-the-loop](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/ImageReviews/Program.cs). See [quickstart](moderation-reviews-quickstart-dotnet.md).
- **Video reviews**: [Create video reviews for human-in-the-loop](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/VideoReviews/Program.cs). See [quickstart](video-reviews-quickstart-dotnet.md)
- **Video transcript reviews**: [Create video transcript reviews for human-in-the-loop](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/VideoTranscriptReviews/Program.cs) See [quickstart](video-reviews-quickstart-dotnet.md)

See all .NET samples at the [Content Moderator .NET samples on GitHub](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/ContentModerator).

## REST API samples in C#

- [Image moderation](https://github.com/MicrosoftContentModerator/ContentModerator-API-Samples/tree/master/ImageModeration)
- [Text moderation](https://github.com/MicrosoftContentModerator/ContentModerator-API-Samples/tree/master/TextModeration)
- [Video moderation](https://github.com/MicrosoftContentModerator/ContentModerator-API-Samples/tree/master/VideoModeration)
- [Image reviews](https://github.com/MicrosoftContentModerator/ContentModerator-API-Samples/tree/master/ImageReviews)
- [Image jobs](https://github.com/MicrosoftContentModerator/ContentModerator-API-Samples/tree/master/ImageJob)

For walkthroughs of these samples, check out the [on-demand webinar](https://info.microsoft.com/cognitive-services-content-moderator-ondemand.html).

## Tutorials
- [eCommerce catalog moderation](https://github.com/MicrosoftContentModerator/samples-eCommerceCatalogModeration). See [tutorial](ecommerce-retail-catalog-moderation.md).
- [Facebook content moderation](https://github.com/MicrosoftContentModerator/samples-fbPageModeration). See [tutorial](facebook-post-moderation.md).
- [Video and transcript moderation and review solution](https://github.com/MicrosoftContentModerator/VideoReviewConsoleApp) See [tutorial](video-transcript-moderation-review-tutorial-dotnet.md)

## On-demand webinars
- [Machine-assisted content moderation at scale with Content Moderator](https://info.microsoft.com/cognitive-services-content-moderator-ondemand.html)
