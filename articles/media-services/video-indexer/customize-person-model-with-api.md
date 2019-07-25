---
title: Use the Video Indexer API to customize a Person model - Azure  
titlesuffix: Azure Media Services
description: This article shows how to customize a Person model with the Video Indexer API.
services: media-services
author: anikaz
manager: johndeu

ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 05/15/2019
ms.author: anzaman
---

# Customize a Person model with the Video Indexer API

Video Indexer supports face detection and celebrity recognition for video content. The celebrity recognition feature covers approximately one million faces based on commonly requested data source such as IMDB, Wikipedia, and top LinkedIn influencers. Faces that are not recognized by the celebrity recognition feature are detected; however, they are left unnamed. After you upload you video to Video Indexer and get results back, you can go back and name the faces that were not recognized. Once you label a face with a name, the face and name get added to your account's Person model. Video Indexer will then recognize this face in your future videos and past videos.

You can use the Video Indexer API to edit faces that were detected in a video, as described in this topic. You can also use the Video Indexer website, as described in [Customize Person model using the Video Indexer website](customize-person-model-with-api.md).

## Managing multiple Person models 

Video Indexer supports multiple Person models per account. This feature is currently available only through the Video Indexer APIs.

If your account caters to different use-case scenarios, you might want to create multiple Person models per account. For example, if your content is related to sports, you can then create a separate Person model for each sport (football, basketball, soccer, etc.). 

Once a model is created, you can use it by providing the model ID of a specific Person model when uploading/indexing or reindexing a video. Training a new face for a video updates the specific custom model that the video was associated with.

Each account has a limit of 50 Person models. If you do not need the multiple Person model support, do not assign a Person model ID to your video when uploading/indexing or reindexing. In this case, Video Indexer uses the default custom Person model in your account.

## Create a new Person model

Create a new Person model in the specified account. 

### Request URL

This is a POST request.

```
https://api.videoindexer.ai/{location}/Accounts/{accountId}/Customization/PersonModels?name={name}&accessToken={accessToken}
```

Below is the request in Curl.

```curl
curl -v -X POST "https://api.videoindexer.ai/{location}/Accounts/{accountId}/Customization/PersonModels?name={name}&accessToken={accessToken}"
```

[See required parameters and test out using the Video Indexer Developer Portal](https://api-portal.videoindexer.ai/docs/services/operations/operations/Create-Person-Model?).

### Request parameters 

|**Name**|**Type**|**Required**|**Description**|
|---|---|---|---|
|location|string|Yes|The Azure region to which the call should be routed. For more information, see [Azure regions and Video Indexer](regions.md).|
|accountId|string|Yes|Globally unique identifier for the account|
|name|string|Yes|The name for the Person model|
|accessToken|string|Yes|Access token (must be of scope [Account Access Token](https://api-portal.videoindexer.ai/docs/services/authorization/operations/Get-Account-Access-Token?)) to authenticate against the call. Access tokens expire within 1 hour.|

### Request body

There is no further request body required for this call.

### Response

The response provides the name and generated model ID of the Person model that you just created following the format of the example below.

```json
{
    "id": "227654b4-912c-4b92-ba4f-641d488e3720",
    "name": "Example Person Model"
}
```

You should then use the **id** value for the **personModelId** parameter when [uploading a video to index](https://api-portal.videoindexer.ai/docs/services/operations/operations/Upload-video?) or [reindexing a video](https://api-portal.videoindexer.ai/docs/services/operations/operations/Re-index-video?).

## Delete a Person model

Delete a custom Person model from the specified account. 

Once the Person model is deleted successfully, the index of your current videos that were using the deleted model will remain unchanged until you reindex them. Upon reindexing, the faces that were named in the deleted model will not be recognized by Video Indexer in your current videos that were indexed using that model; however, those faces will still be detected. Your current videos that were indexed using the deleted model will now use your account's default Person model. If faces from the deleted model are also named in your account's default model, those faces will continue to be recognized in the videos.

### Request URL

```
https://api.videoindexer.ai/{location}/Accounts/{accountId}/Customization/PersonModels/{id}?accessToken={accessToken}
```

Below is the request in Curl.
```curl
curl -v -X DELETE "https://api.videoindexer.ai/{location}/Accounts/{accountId}/Customization/PersonModels/{id}?accessToken={accessToken}"
```

[See required parameters and test out using the Video Indexer Developer Portal](https://api-portal.videoindexer.ai/docs/services/operations/operations/Delete-Person-Model?).

### Request parameters

|**Name**|**Type**|**Required**|**Description**|
|---|---|---|---|
|location|string|Yes|The Azure region to which the call should be routed. For more information, see [Azure regions and Video Indexer](regions.md).|
|accountId|string|Yes|Globally unique identifier for the account|
|id|string|Yes|The Person model id (generated when the Person model is created)|
|accessToken|string|Yes|Access token (must be of scope [Account Access Token](https://api-portal.videoindexer.ai/docs/services/authorization/operations/Get-Account-Access-Token?)) to authenticate against the call. Access tokens expire within 1 hour.|

### Request body

There is no further request body required for this call.

### Response

There is no returned content when the Person model is deleted successfully.

## Get all Person models

Get all Person models in the specified account. 

### Request Call

This is a GET request.

```
https://api.videoindexer.ai/{location}/Accounts/{accountId}/Customization/PersonModels?accessToken={accessToken}
```

Below is the request in Curl.

```curl
curl -v -X GET "https://api.videoindexer.ai/{location}/Accounts/{accountId}/Customization/PersonModels?accessToken={accessToken}"
```

[See required parameters and test out using the Video Indexer Developer Portal](https://api-portal.videoindexer.ai/docs/services/operations/operations/Get-Person-Models?).

### Request parameters

|**Name**|**Type**|**Required**|**Description**|
|---|---|---|---|
|location|string|Yes|The Azure region to which the call should be routed. For more information, see [Azure regions and Video Indexer](regions.md).|
|accountId|string|Yes|Globally unique identifier for the account|
|accessToken|string|Yes|Access token (must be of scope [Account Access Token](https://api-portal.videoindexer.ai/docs/services/authorization/operations/Get-Account-Access-Token?)) to authenticate against the call. Access tokens expire within 1 hour.|

### Request body

There is no further request body required for this call.

### Response

The response provides a list of all of the Person models in your account (including the default Person model in the specified account) and each of their names and ids following the format of the example below.

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

You can choose which model you want to use for a video by using the **id** value of the Person model for the **personModelId** parameter when [uploading a video to index](https://api-portal.videoindexer.ai/docs/services/operations/operations/Upload-video?) or [reindexing a video](https://api-portal.videoindexer.ai/docs/services/operations/operations/Re-index-video?).

## Update a face

This command allows you to update a face in your video with a name using the ID of the video and ID of the face. This then updates the Person model that the video was associated with upon uploading/indexing or reindexing. If no Person model was assigned, it updates the account's default Person model. 

Once this happens, it recognizes the occurrences of the same face in your other current videos that share the same Person model. Recognition of the face in your other current videos might take some time to take effect as this is a batch process.

You can update a face that Video Indexer recognized as a celebrity with a new name. The new name that you give will take precedence over the built-in celebrity recognition.

### Request Call

This is a POST request.

```
https://api.videoindexer.ai/{location}/Accounts/{accountId}/Videos/{videoId}/Index/Faces/{faceId}?accessToken={accessToken}&newName={newName}
```

Below is the request in Curl.

```curl
curl -v -X PUT "https://api.videoindexer.ai/{location}/Accounts/{accountId}/Videos/{videoId}/Index/Faces/{faceId}?accessToken={accessToken}&newName={newName}"
```

[See required parameters and test out using the Video Indexer Developer Portal](https://api-portal.videoindexer.ai/docs/services/operations/operations/Update-Video-Face?).

### Request parameters

|**Name**|**Type**|**Required**|**Description**|
|---|---|---|---|
|location|string|Yes|The Azure region to which the call should be routed. For more information, see [Azure regions and Video Indexer](regions.md).|
|accountId|string|Yes|Globally unique identifier for the account|
|videoId|string|Yes|Id for the video in which the face that you want to update appears. This is created when the video is uploaded and indexed.|
|faceId|integer|Yes|Id for the face that will be updated. You can get the faceId from the video index|
|accessToken|string|Yes|Access token (must be of scope [Account Access Token](https://api-portal.videoindexer.ai/docs/services/authorization/operations/Get-Account-Access-Token?)) to authenticate against the call. Access tokens expire within 1 hour.|
|name|string|Yes|New name to update the face with.|

Names are unique for Person models, so if you give two different faces in the same Person model the same **name** parameter value, Video Indexer views the faces as the same person and converges them once you reindex your video. 

### Request body

There is no further request body required for this call.

### Response

There is no returned content when the face has been updated successfully.

## Next steps

[Customize Person model using the Video Indexer website](customize-person-model-with-website.md)
