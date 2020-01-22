---
title: Use the Video Indexer APIs to customize language models - Azure
titlesuffix: Azure Media Services
description: This article shows how to customize a Language model with the Video Indexer APIs.
services: media-services
author: anikaz
manager: johndeu

ms.service: media-services
ms.subservice: video-indexer
ms.topic: article
ms.date: 01/14/2020
ms.author: anzaman
---

# Customize a Language model with the Video Indexer APIs

Video Indexer lets you create custom Language models to customize speech recognition by uploading adaptation text, namely text from the domain whose vocabulary you'd like the engine to adapt to. Once you train your model, new words appearing in the adaptation text will be recognized. 

For a detailed overview and best practices for custom Language models, see [Customize a Language model with Video Indexer](customize-language-model-overview.md).

You can use the Video Indexer APIs to create and edit custom Language models in your account, as described in this topic. You can also use the website, as described in [Customize Language model using the Video Indexer website](customize-language-model-with-api.md).

## Create a Language model

The [create a language model](https://api-portal.videoindexer.ai/docs/services/Operations/operations/Create-Language-Model?) API creates a new custom Language model in the specified account. You can upload files for the Language model in this call. Alternatively, you can create the Language model here and upload files for the model later by updating the Language model.

> [!NOTE]
> You must still train the model with its enabled files for the model to learn the contents of its files. Directions on training a language are in the next section.

To upload files to be added to the Language model, you must upload files in the body using form-data in addition to providing values for the required parameters above. There are two ways to do this: 

1. Key will be the file name and value will be the txt file
2. Key will be the file name and value will be a URL to txt file

### Response

The response provides metadata on the newly created Language model along with metadata on each of the model's files following the format of the example JSON output.

```json
{
    "id": "dfae5745-6f1d-4edd-b224-42e1ab57a891",
    "name": "TestModel",
    "language": "En-US",
    "state": "None",
    "languageModelId": "00000000-0000-0000-0000-000000000000",
    "files": [
    {
        "id": "25be7c0e-b6a6-4f48-b981-497e920a0bc9",
        "name": "hellofile",
        "enable": true,
        "creator": "John Doe",
        "creationTime": "2018-04-28T11:55:34.6733333"
    },
    {
        "id": "33025f5b-2354-485e-a50c-4e6b76345ca7",
        "name": "worldfile",
        "enable": true,
        "creator": "John Doe",
        "creationTime": "2018-04-28T11:55:34.86"
    }
    ]
}

```

## Train a Language model

The [train a language model](https://api-portal.videoindexer.ai/docs/services/operations/operations/Train-Language-Model?&pattern=train) API trains a custom Language model in the specified account with the contents in the files that were uploaded to and enabled in the language model. 

> [!NOTE]
> You must first create the Language model and upload its files. You can upload files either when creating the language model or by updating the Language model. 

### Response

The response provides metadata on the newly trained Language model along with metadata on each of the model's files following the format of the example JSON output.

```json
{
    "id": "41464adf-e432-42b1-8e09-f52905d7e29d",
    "name": "TestModel",
    "language": "En-US",
    "state": "Waiting",
    "languageModelId": "531e5745-681d-4e1d-b124-12e5ab57a891",
    "files": [
    {
        "id": "84fcf1ac-1952-48f3-b372-18f768eedf83",
        "name": "RenamedFile",
        "enable": false,
        "creator": "John Doe",
        "creationTime": "2018-04-27T20:10:10.5233333"
    },
    {
        "id": "9ac35b4b-1381-49c4-9fe4-8234bfdd0f50",
        "name": "hellofile",
        "enable": true,
        "creator": "John Doe",
        "creationTime": "2018-04-27T20:10:10.68"
    }
    ]
}
```

You should use the returned **id** value of the language model for the **linguisticModelId** parameter when [uploading a video to index](https://api-portal.videoindexer.ai/docs/services/operations/operations/Upload-video?) and for the **languageModelId** parameter when [reindexing a video](https://api-portal.videoindexer.ai/docs/services/operations/operations/Re-index-video?).

 
## Delete a Language model

The [delete a language model](https://api-portal.videoindexer.ai/docs/services/operations/operations/Delete-Language-Model?&pattern=delete) API deletes a custom Language model from the specified account. Any video that was using the deleted Language model will keep the same index until you re-index the video. If you re-index the video, you can assign a new Language model to the video. Otherwise, Video Indexer will use its default model to re-index the video.

### Response

There is no returned content when the Language model is deleted successfully.

## Update a Language model

The [update a language model](https://api-portal.videoindexer.ai/docs/services/operations/operations/Update-Language-Model?&pattern=update) API updates a custom Language person model in the specified account.

> [!NOTE]
> You must have already created the Language model. You can use this call to enable or disable all files under the model, update the name of the Language model, and upload files to be added to the language model.

To upload files to be added to the Language model, you must upload files in the body using form-data in addition to providing values for the required parameters above. There are two ways to do this: 

1. Key will be the file name and value will be the txt file
2. Key will be the file name and value will be a URL to txt file


### Response

The response provides metadata on the newly trained Language model along with metadata on each of the model's files following the format of the example JSON output.

```json
{
    "id": "41464adf-e432-42b1-8e09-f52905d7e29d",
    "name": "TestModel",
    "language": "En-US",
    "state": "Waiting",
    "languageModelId": "531e5745-681d-4e1d-b124-12e5ab57a891",
    "files": [
    {
        "id": "84fcf1ac-1952-48f3-b372-18f768eedf83",
        "name": "RenamedFile",
        "enable": true,
        "creator": "John Doe",
        "creationTime": "2018-04-27T20:10:10.5233333"
    },
    {
        "id": "9ac35b4b-1381-49c4-9fe4-8234bfdd0f50",
        "name": "hellofile",
        "enable": true,
        "creator": "John Doe",
        "creationTime": "2018-04-27T20:10:10.68"
    }
    ]
}
```

Use the **id** of the files returned in the response to download the contents of the file.

## Update a file from a Language model

The [update a file](https://api-portal.videoindexer.ai/docs/services/operations/operations/Update-Language-Model-file?&pattern=update) allows you to update the name and **enable** state of a file in a custom Language model in the specified account.

### Response

The response provides metadata on the file that you updated following the format of the example JSON output below.

```json
{
  "id": "84fcf1ac-1952-48f3-b372-18f768eedf83",
  "name": "RenamedFile",
  "enable": false,
  "creator": "John Doe",
  "creationTime": "2018-04-27T20:10:10.5233333"
}
```
Use the **id** of the file returned in the response to download the contents of the file.

## Get a specific Language model

The [get](https://api-portal.videoindexer.ai/docs/services/operations/operations/Get-Language-Model?&pattern=get) API returns information on the specified Language model in the specified account such as language and the files that are in the Language model. 

### Response

The response provides metadata on the specified Language model along with metadata on each of the model's files following the format of the example JSON output below.

```json
{
    "id": "dfae5745-6f1d-4edd-b224-42e1ab57a891",
    "name": "TestModel",
    "language": "En-US",
    "state": "None",
    "languageModelId": "00000000-0000-0000-0000-000000000000",
    "files": [
    {
        "id": "25be7c0e-b6a6-4f48-b981-497e920a0bc9",
        "name": "hellofile",
        "enable": true,
        "creator": "John Doe",
        "creationTime": "2018-04-28T11:55:34.6733333"
    },
    {
        "id": "33025f5b-2354-485e-a50c-4e6b76345ca7",
        "name": "worldfile",
        "enable": true,
        "creator": "John Doe",
        "creationTime": "2018-04-28T11:55:34.86"
    }
    ]
}
```

Use the **id** of the file returned in the response to download the contents of the file.

## Get all the Language models

The [get all](https://api-portal.videoindexer.ai/docs/services/operations/operations/Get-Language-Models?&pattern=get) API returns all of the custom Language models in the specified account in a list.

### Response

The response provides a list of all of the Language models in your account and each of their metadata and files following the format of the example JSON output below.

```json
[
    {
        "id": "dfae5745-6f1d-4edd-b224-42e1ab57a891",
        "name": "TestModel",
        "language": "En-US",
        "state": "None",
        "languageModelId": "00000000-0000-0000-0000-000000000000",
        "files": [
        {
            "id": "25be7c0e-b6a6-4f48-b981-497e920a0bc9",
            "name": "hellofile",
            "enable": true,
            "creator": "John Doe",
            "creationTime": "2018-04-28T11:55:34.6733333"
        },
        {
            "id": "33025f5b-2354-485e-a50c-4e6b76345ca7",
            "name": "worldfile",
            "enable": true,
            "creator": "John Doe",
            "creationTime": "2018-04-28T11:55:34.86"
        }
        ]
    },
    {
        "id": "dfae5745-6f1d-4edd-b224-42e1ab57a892",
        "name": "AnotherTestModel",
        "language": "En-US",
        "state": "None",
        "languageModelId": "00000000-0000-0000-0000-000000000001",
        "files": []
    }
]
```

## Delete a file from a Language model

The [delete](https://api-portal.videoindexer.ai/docs/services/operations/operations/Delete-Language-Model-File?&pattern=delete) API deletes the specified file from the specified Language model in the specified account. 

### Response

There is no returned content when the file is deleted from the Language model successfully.

## Get metadata on a file from a Language model

The [get metadata of a file](https://api-portal.videoindexer.ai/docs/services/operations/operations/Get-Language-Model-File-Data?&pattern=get%20language%20model) API returns the contents of and metadata on the specified file from the chosen Language model in the your account.

### Response

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

### Response

The response will be the download of a text file with the contents of the file in the JSON format. 

## Next steps

[Customize Language model using website](customize-language-model-with-website.md)
