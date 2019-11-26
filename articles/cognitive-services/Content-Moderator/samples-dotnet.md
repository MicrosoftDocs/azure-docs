---
title: Code samples - Content Moderator, .NET
titleSuffix: Azure Cognitive Services
description: Learn how to use Azure Cognitive Services Content Moderator in your .NET applications through the SDK.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: sample
ms.date: 01/10/2019
ms.author: pafarley

---
# Content Moderator .NET SDK samples

The following list includes links to the code samples built using the Azure Content Moderator SDK for .NET.

## Moderation

- **Image moderation**: [Evaluate an image for adult and racy content, text, and faces](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/ImageModeration/Program.cs). See the [.NET SDK quickstart](dotnet-sdk-quickstart.md).
- **Custom images**: [Moderate with custom image lists](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/ImageListManagement/Program.cs). See the[.NET SDK quickstart](dotnet-sdk-quickstart.md).

> [!NOTE]
> There is a maximum limit of **5 image lists** with each list to **not exceed 10,000 images**.
>

- **Text moderation**: [Screen text for profanity and personal data](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/TextModeration/Program.cs). See the[.NET SDK quickstart](dotnet-sdk-quickstart.md).
- **Custom terms**: [Moderate with custom term lists](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/TermListManagement/Program.cs). See the [.NET SDK quickstart](dotnet-sdk-quickstart.md).

> [!NOTE]
> There is a maximum limit of **5 term lists** with each list to **not exceed 10,000 terms**.
>

- **Video moderation**: [Scan a video for adult and racy content and get results](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/VideoModeration/Program.cs). See [quickstart](video-moderation-api.md).

## Review

- **Image jobs**: [Start a moderation job that scans and creates reviews](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/ImageJobs/Program.cs). See [quickstart](moderation-jobs-quickstart-dotnet.md).
- **Image reviews**: [Create reviews for human-in-the-loop](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/ImageReviews/Program.cs). See [quickstart](dotnet-sdk-quickstart.md).
- **Video reviews**: [Create video reviews for human-in-the-loop](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/VideoReviews/Program.cs). See [quickstart](video-reviews-quickstart-dotnet.md)
- **Video transcript reviews**: [Create video transcript reviews for human-in-the-loop](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/ContentModerator/VideoTranscriptReviews/Program.cs) See [quickstart](video-reviews-quickstart-dotnet.md)

See all .NET samples at the [Content Moderator .NET samples on GitHub](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/ContentModerator).
