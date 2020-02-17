---
title: Reviews, Workflows, and Jobs concepts - Content Moderator
titleSuffix: Azure Cognitive Services
description: In this article, you will learn about the core concepts of the Review tool; reviews, workflows, and jobs.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: conceptual
ms.date: 03/14/2019
ms.author: pafarley
#Customer intent: broad conceptual overview of key concepts
---

# Content moderation reviews, workflows, and jobs

Content Moderator combines machine-assisted moderation with human-in-the-loop capabilities to create an optimal moderation process for real-world scenarios. It does this through the cloud-based [Review tool](https://contentmoderator.cognitive.microsoft.com). In this guide, you will learn about the core concepts of the Review tool: reviews, workflows, and jobs.

## Reviews

In a review, content is uploaded to the Review tool and appears under the **Review** tab. From here, users can alter the applied tags and apply their own custom tags as appropriate. When a user submits a review, the results are sent to a specified callback endpoint, and the content is removed from the site.

![Review tool website open in a browser, on the Review tab](./Review-Tool-user-Guide/images/image-workflow-review.png)

See the [Review tool guide](./review-tool-user-guide/review-moderated-images.md) to get started creating reviews, or see the [REST API guide](./try-review-api-review.md) to learn how to do so programmatically.

## Workflows

A workflow is a cloud-based customized filter for content. Workflows can connect to a variety of services to filter content in different ways and then take the appropriate action. With the Content Moderator connector, a workflow can automatically apply moderation tags and create reviews with submitted content.

### View workflows

To view your existing workflows, go to the [Review tool](https://contentmoderator.cognitive.microsoft.com/) and select **Settings** > **Workflows**.

![Default workflow](images/default-workflow-listed.PNG)

Workflows can be completely described as JSON strings, which makes them accessible programmatically. If you select the **Edit** option for your workflow and then select the **JSON** tab, you'll see a JSON expression like the following:

```json
{
    "Type": "Logic",
    "If": {
        "ConnectorName": "moderator",
        "OutputName": "isAdult",
        "Operator": "eq",
        "Value": "true",
        "Type": "Condition"
        },
    "Then": {
    "Perform": [
    {
        "Name": "createreview",
        "CallbackEndpoint": null,
        "Tags": []
    }
    ],
    "Type": "Actions"
    }
}
```

See the [Review tool guide](./review-tool-user-guide/workflows.md) to get started creating and using workflows, or see the [REST API guide](./try-review-api-workflow.md) to learn how to do so programmatically.

## Jobs

A moderation job serves as a kind of wrapper for the functionality of content moderation, workflows and reviews. The job scans your content using the Content Moderator image moderation API or text moderation API and then checks it against the designated workflow. Based on the workflow results, it may or may not create a review for the content in the [Review tool](./review-tool-user-guide/human-in-the-loop.md). While both reviews and workflows can be created and configured with their respective APIs, the job API allows you to obtain a detailed report of the entire process (which can be sent to a specified callback endpoint).

See the [REST API guide](./try-review-api-job.md) to get started using jobs.

## Next steps

* Test drive the [Job API console](try-review-api-job.md), and use the REST API code samples. If you're familiar with Visual Studio and C#, also check out the [Jobs .NET quickstart](moderation-jobs-quickstart-dotnet.md). 
* For reviews, get started with the [Review API console](try-review-api-review.md), and use the REST API code samples. Then see the reviews section of the [.NET quickstart](dotnet-sdk-quickstart.md).
* For video reviews, use the [Video review quickstart](video-reviews-quickstart-dotnet.md), and learn how to [add transcripts to the video review](video-transcript-reviews-quickstart-dotnet.md).
