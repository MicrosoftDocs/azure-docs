---
title: Customize a Person model with Azure AI Video Indexer API
description: Learn how to customize a Person model with the Azure AI Video Indexer API.
author: anikaz
manager: johndeu
ms.topic: article
ms.date: 01/14/2020
ms.author: kumud
---

# Customize a Person model with the Azure AI Video Indexer API

[!INCLUDE [Gate notice](./includes/face-limited-access.md)]

Azure AI Video Indexer supports face detection and celebrity recognition for video content. The celebrity recognition feature covers about one million faces based on commonly requested data source such as IMDB, Wikipedia, and top LinkedIn influencers. Faces that aren't recognized by the celebrity recognition feature are detected but left unnamed. After you upload your video to Azure AI Video Indexer and get results back, you can go back and name the faces that weren't recognized. Once you label a face with a name, the face and name get added to your account's Person model. Azure AI Video Indexer will then recognize this face in your future videos and past videos.

You can use the Azure AI Video Indexer API to edit faces that were detected in a video, as described in this topic. You can also use the Azure AI Video Indexer website, as described in [Customize Person model using the Azure AI Video Indexer website](customize-person-model-with-api.md).

## Managing multiple Person models

Azure AI Video Indexer supports multiple Person models per account. This feature is currently available only through the Azure AI Video Indexer APIs.

If your account caters to different use-case scenarios, you might want to create multiple Person models per account. For example, if your content is related to sports, you can then create a separate Person model for each sport (football, basketball, soccer, and so on).

Once a model is created, you can use it by providing the model ID of a specific Person model when uploading/indexing or reindexing a video. Training a new face for a video updates the specific custom model that the video was associated with.

Each account has a limit of 50 Person models. If you don't need the multiple Person model support, don't assign a Person model ID to your video when uploading/indexing or reindexing. In this case, Azure AI Video Indexer uses the default custom Person model in your account.

## Create a new Person model

To create a new Person model in the specified account, use the [create a person model](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Create-Person-Model) API.

The response provides the name and generated model ID of the Person model that you just created following the format of the example below.

```json
{
    "id": "227654b4-912c-4b92-ba4f-641d488e3720",
    "name": "Example Person Model"
}
```

You then use the **id** value for the **personModelId** parameter when [uploading a video to index](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Upload-Video) or [reindexing a video](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Re-Index-Video).

## Delete a Person model

To delete a custom Person model from the specified account, use the [delete a person model](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Delete-Person-Model) API.

Once the Person model is deleted successfully, the index of your current videos that were using the deleted model will remain unchanged until you reindex them. Upon reindexing, the faces that were named in the deleted model won't be recognized by Azure AI Video Indexer in your current videos that were indexed using that model but the faces will still be detected. Your current videos that were indexed using the deleted model will now use your account's default Person model. If faces from the deleted model are also named in your account's default model, those faces will continue to be recognized in the videos.

There's no returned content when the Person model is deleted successfully.

## Get all Person models

To get all Person models in the specified account, use the [get a person model](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Person-Models) API.

The response provides a list of all of the Person models in your account (including the default Person model in the specified account) and each of their names and IDs following the format of the example below.

```json
[
    {
        "id": "59f9c326-b141-4515-abe7-7d822518571f",
        "name": "Default"
    }, 
    {
        "id": "9ef2632d-310a-4510-92e1-cc70ae0230d4",
        "name": "Test"
    }
]
```

You can choose which model you want to use for a video by using the `id` value of the Person model for the `personModelId` parameter when [uploading a video to index](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Upload-Video) or [reindexing a video](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Re-Index-Video).

## Update a face

This command allows you to update a face in your video with a name using the ID of the video and ID of the face. This action then updates the Person model that the video was associated with upon uploading/indexing or reindexing. If no Person model was assigned, it updates the account's default Person model.

The system then recognizes the occurrences of the same face in your other current videos that share the same Person model. Recognition of the face in your other current videos might take some time to take effect as this is a batch process.

You can update a face that Azure AI Video Indexer recognized as a celebrity with a new name. The new name that you give will take precedence over the built-in celebrity recognition.

To update the face, use the [update a video face](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Update-Video-Face) API.

Names are unique for Person models, so if you give two different faces in the same Person model the same `name` parameter value, Azure AI Video Indexer views the faces as the same person and converges them once you reindex your video.

## Next steps

[Customize Person model using the Azure AI Video Indexer website](customize-person-model-with-website.md)
