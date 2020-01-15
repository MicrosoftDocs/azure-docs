---
title: Use the Video Indexer APIs to customize a Language model - Azure  
titlesuffix: Azure Media Services
description: This article shows how to customize a Language model with the Video Indexer APIs.
services: media-services
author: anikaz
manager: johndeu

ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 13/14/2020
ms.author: anzaman
---

# Customize a Language model with the Video Indexer APIs

Video Indexer lets you create custom Language models to customize speech recognition by uploading adaptation text, namely text from the domain whose vocabulary you'd like the engine to adapt to. Once you train your model, new words appearing in the adaptation text will be recognized. 

For a detailed overview and best practices for custom Language models, see [Customize a Language model with Video Indexer](customize-language-model-overview.md).

You can use the Video Indexer APIs to create and edit custom Language models in your account, as described in this topic. You can also use the website, as described in [Customize Language model using the Video Indexer website](customize-language-model-with-api.md).

## Create a Language model

The [create a languate model](https://api-portal.videoindexer.ai/docs/services/Operations/operations/Create-Language-Model?) API creates a new custom Language model in the specified account. You can upload files for the Language model in this call. Alternatively, you can create the Language model here and upload files for the model later by updating the Language model.

> [!NOTE]
> You must still train the model with its enabled files for the model to learn the contents of its files. Directions on training a language are in the next section.

To upload files to be added to the Language model, you must upload files in the body using form-data in addition to providing values for the required parameters above. There are two ways to do this: 

1. Key will be the file name and value will be the txt file
2. Key will be the file name and value will be a URL to txt file

## Train a Language model

The [train a language model](https://api-portal.videoindexer.ai/docs/services/operations/operations/Train-Language-Model?&pattern=train) API trains a custom Language model in the specified account with the contents in the files that were uploaded to and enabled in the language model. 

> [!NOTE]
> You must first create the Language model and upload its files. You can upload files either when creating the language model or by updating the Language model. 

A response from the API, returns **id**. You should use the **id** value of the language model for the **linguisticModelId** parameter when [uploading a video to index](https://api-portal.videoindexer.ai/docs/services/operations/operations/Upload-video?) and for the **languageModelId** parameter when [reindexing a video](https://api-portal.videoindexer.ai/docs/services/operations/operations/Re-index-video?).
 
## Delete a Language model

The [delete a language model](https://api-portal.videoindexer.ai/docs/services/operations/operations/Delete-Language-Model?&pattern=delete) API deletes a custom Language model from the specified account. Any video that was using the deleted Language model will keep the same index until you re-index the video. If you re-index the video, you can assign a new Language model to the video. Otherwise, Video Indexer will use its default model to re-index the video.

## Update a Language model

The [update a language model](https://api-portal.videoindexer.ai/docs/services/operations/operations/Update-Language-Model?&pattern=update) API updates a custom Language person model in the specified account.

> [!NOTE]
> You must have already created the Language model. You can use this call to enable or disable all files under the model, update the name of the Language model, and upload files to be added to the language model.

To upload files to be added to the Language model, you must upload files in the body using form-data in addition to providing values for the required parameters above. There are two ways to do this: 

1. Key will be the file name and value will be the txt file
2. Key will be the file name and value will be a URL to txt file

Use the **id** of the files returned in the response to download the contents of the file.

## Update a file from a Language model

The [update a file](https://api-portal.videoindexer.ai/docs/services/operations/operations/Update-Language-Model-file?&pattern=update) allows you to update the name and **enable** state of a file in a custom Language model in the specified account.

Use the **id** of the file returned in the response to download the contents of the file.

## Get a specific Language model

The [get](https://api-portal.videoindexer.ai/docs/services/operations/operations/Get-Language-Model?&pattern=get) API returns information on the specified Language model in the specified account such as language and the files that are in the Language model. 

Use the **id** of the file returned in the response to download the contents of the file.

## Get all the Language models

The [get all](https://api-portal.videoindexer.ai/docs/services/operations/operations/Get-Language-Models?&pattern=get) API returns all of the custom Language models in the specified account in a list.

## Delete a file from a Language model

The [delete](https://api-portal.videoindexer.ai/docs/services/operations/operations/Delete-Language-Model-File?&pattern=delete) API deletes the specified file from the specified Language model in the specified account. 

## Get metadata on a file from a Language model

The [get metadata of a file](https://api-portal.videoindexer.ai/docs/services/operations/operations/Get-Language-Model-File-Data?&pattern=get%20language%20model) API returns the contents of and metadata on the specified file from the chosen Language model in the your account.

The response provides the contents and metadata of the file in JSON format, similar to this:

```json
{
    "content": "hello\r\nworld",
    "id": "84fcf1ac-1952-48f3-b372-18f768eedf83",
    "name": "Hello",
    "enable": true,
    "creator": "John Doe",
    "creationTime": "2018-04-27T20:10:10.5233333"
}
```

> [!NOTE]
> The contents of this example file are the words "hello" and world" in two separate lines.

## Download a file from a Language model

The [download a file](https://api-portal.videoindexer.ai/docs/services/operations/operations/Download-Language-Model-File-Content?) API downloads a text file containing the contents of the specified file from the specified Language model in the specified account. This text file should match the contents of the text file that was originally uploaded.

## Next steps

[Customize Language model using website](customize-language-model-with-website.md)
