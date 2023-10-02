---
title: Customize a speech model with the Azure AI Video Indexer API
description: Learn how to customize a speech model with the Azure AI Video Indexer API.
ms.topic: how-to
ms.date: 03/06/2023
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Customize a speech model with the API

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

[!INCLUDE [speech model](./includes/speech-model.md)]

Azure AI Video Indexer lets you create custom language models to customize speech recognition by uploading adaptation text, namely text from the domain whose vocabulary you'd like the engine to adapt to or aligning word or name pronunciation with how it should be written. 

For a detailed overview and best practices for custom speech models, see [Customize a speech model with Azure AI Video Indexer](customize-speech-model-overview.md). 

You can use the Azure AI Video Indexer APIs to create and edit custom language models in your account. You can also use the website, as described in [Customize speech model using the Azure AI Video Indexer website](customize-speech-model-with-website.md). 

The following are descriptions of some of the parameters: 

|Name   | Type |  Description |  
|---|---|---|
|`displayName`      |string |The desired name of the dataset/model.|
|`locale`           |string |The language code of the dataset/model. For full list, see [Language support](language-support.md).|
|`kind`             |integer|0 for a plain text dataset, 1 for a pronunciation dataset.| 
|`description`      |string |Optional description of the dataset/model.|
|`contentUrl`       |uri    |URL of source file used in creation of dataset.| 
|`customProperties` |object |Optional properties of dataset/model.| 

## Create a speech dataset 

The [create speech dataset](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Create-Speech-Dataset) API creates a dataset for training a speech model. You upload a file that is used to create a dataset with this call. The content of a dataset can't be modified after it's created. 
To upload a file to a dataset, you must update parameters in the Body, including a URL to the text file to be uploaded. The description and custom properties fields are  optional. The following is a sample of the body:

```json
{
    "displayName": "Pronunciation Dataset",
    "locale": "en-US",
    "kind": "Pronunciation",
    "description": "This is a pronunciation dataset.",
    "contentUrl": https://contoso.com/location,
    "customProperties": {
        "tag": "Pronunciation Dataset Example"
    }
}
```

### Response 

The response provides metadata on the newly created dataset following the format of this example JSON output: 

```json
{ 
    "id": "000000-0000-0000-0000-f58ac7002ae9", 
    "properties": { 
        "acceptedLineCount": 0, 
        "rejectedLineCount": 0, 
        "duration": null, 
        "error": null 
    }, 
    "displayName": "Contoso plain text", 
    "description": "AVI dataset", 
    "locale": "en-US", 
    "kind": "Language", 
    "status": "Waiting", 
    "lastActionDateTime": "2023-02-28T13:24:27Z", 
    "createdDateTime": "2023-02-28T13:24:27Z", 
    "customProperties": null 
} 
```

## Create a speech model 

The [create a speech model](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Create-Speech-Model) API creates and trains a custom speech model that could then be used to improve the transcription accuracy of your videos. It must contain at least one plain text dataset and can optionally have pronunciation datasets. Create it with all of the relevant dataset files as a model’s datasets can't be added or updated after its creation. 

When creating a speech model, you must update parameters in the Body, including a list of strings where the strings are the dataset/s the model will include. The description and custom properties fiels are optional. The following is a sample of the body:

```json
{
    "displayName": "Contoso Speech Model",
    "locale": "en-US",
    "datasets": ["ff3d2bc4-ab5a-4522-b599-b3d5ba768c75", "87c8962d-1d3c-44e5-a2b2-c696fddb9bae"],
    "description": "Contoso ads example model",
    "customProperties": {
        "tag": "Example Model"
    }
}
```

### Response 

The response provides metadata on the newly created model following the format of this example JSON output: 

```json{ 
    "id": "00000000-0000-0000-0000-85be4454cf", 
    "properties": { 
        "deprecationDates": { 
            "adaptationDateTime": null, 
            "transcriptionDateTime": "2025-04-15T00:00:00Z" 
        }, 
        "error": null 
    }, 
    "displayName": "Contoso speech model", 
    "description": "Contoso speech model for video indexer", 
    "locale": "en-US", 
    "datasets": ["00000000-0000-0000-0000-f58ac7002ae9"], 
    "status": "Processing", 
    "lastActionDateTime": "2023-02-28T13:36:28Z", 
    "createdDateTime": "2023-02-28T13:36:28Z", 
    "customProperties": null 
} 
```

## Get speech dataset 

The [get speech dataset](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Speech-Dataset) API returns information on the specified dataset.  

### Response 

The response provides metadata on the specified dataset following the format of this example JSON output: 

```json
{ 
    "id": "00000000-0000-0000-0000-f58002ae9", 
    "properties": { 
        "acceptedLineCount": 41, 
        "rejectedLineCount": 0, 
        "duration": null, 
        "error": null 
    }, 
    "displayName": "Contoso plain text", 
    "description": "AVI dataset", 
    "locale": "en-US", 
    "kind": "Language", 
    "status": "Complete", 
    "lastActionDateTime": "2023-02-28T13:24:43Z", 
    "createdDateTime": "2023-02-28T13:24:27Z", 
    "customProperties": null 
} 
```

## Get speech datasets files 

The [get speech dataset files](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Speech-Dataset-Files) API returns the files and metadata of the specified dataset. 

### Response 

The response provides a URL with the dataset files and metadata following the format of this example JSON output: 

```json
[{ 
    "datasetId": "00000000-0000-0000-0000-f58ac72a", 
    "fileId": "00000000-0000-0000-0000-cb190769c", 
    "name": "languagedata", 
    "contentUrl": "", 
    "kind": "LanguageData", 
    "createdDateTime": "2023-02-28T13:24:43Z", 
    "properties": { 
        "size": 1517 
    } 
}, { 
    "datasetId": "00000000-0000-0000-0000-f58ac72” 
    "fileId": "00000000-0000-0000-0000-2369192e", 
    "name": "normalized.txt", 
    "contentUrl": "", 
    "kind": "LanguageData", 
    "createdDateTime": "2023-02-28T13:24:43Z", 
    "properties": { 
        "size": 1517 
    } 
}, { 
    "datasetId": "00000000-0000-0000-0000-f58ac7", 
    "fileId": "00000000-0000-0000-0000-05f1e306", 
    "name": "report.json", 
    "contentUrl": "", 
    "kind": "DatasetReport", 
    "createdDateTime": "2023-02-28T13:24:43Z", 
    "properties": { 
        "size": 78 
    } 
}] 
```

## Get the specified account datasets

The [get speech datasets](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Speech-Datasets) API returns information on all of the specified accounts datasets.  

### Response 

The response provides metadata on the datasets in the specified account following the format of this example JSON output: 

```json
[{ 
    "id": "00000000-0000-0000-abf5-4dad0f", 
    "properties": { 
        "acceptedLineCount": 41, 
        "rejectedLineCount": 0, 
        "duration": null, 
        "error": null 
    }, 
    "displayName": "test", 
    "description": "string", 
    "locale": "en-US", 
    "kind": "Language", 
    "status": "Complete", 
    "lastActionDateTime": "2023-02-27T08:42:02Z", 
    "createdDateTime": "2023-02-27T08:41:39Z", 
    "customProperties": null 
}] 
```

## Get the specified speech model 

The [get speech model](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Speech-Model) API returns information on the specified model.  

### Response 

The response provides metadata on the specified model following the format of this example JSON output: 

```json
{ 
    "id": "00000000-0000-0000-0000-5685be445", 
    "properties": { 
        "deprecationDates": { 
            "adaptationDateTime": null, 
            "transcriptionDateTime": "2025-04-15T00:00:00Z" 
        }, 
        "error": null 
    }, 
    "displayName": "Contoso speech model", 
    "description": "Contoso speech model for video indexer", 
    "locale": "en-US", 
    "datasets": ["00000000-0000-0000-0000-f58ac7002"], 
    "status": "Complete", 
    "lastActionDateTime": "2023-02-28T13:36:38Z", 
    "createdDateTime": "2023-02-28T13:36:28Z", 
    "customProperties": null 
} 
```

## Get the specified account speech models 

The [get speech models](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Speech-Models) API returns information on all of the models in the specified account.  

### Response 

The response provides metadata on all of the speech models in the specified account following the format of this example JSON output: 

```json
[{ 
    "id": "00000000-0000-0000-0000-5685be445", 
    "properties": { 
        "deprecationDates": { 
            "adaptationDateTime": null, 
            "transcriptionDateTime": "2025-04-15T00:00:00Z" 
        }, 
        "error": null 
    }, 
    "displayName": "Contoso speech model", 
    "description": "Contoso speech model for video indexer", 
    "locale": "en-US", 
    "datasets": ["00000000-0000-0000-0000-f58ac7002a"], 
    "status": "Complete", 
    "lastActionDateTime": "2023-02-28T13:36:38Z", 
    "createdDateTime": "2023-02-28T13:36:28Z", 
    "customProperties": null 
}] 
```

## Delete speech dataset 

The [delete speech dataset](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Delete-Speech-Dataset) API deletes the specified dataset. Any model that was trained with the deleted dataset continues to be available until the model is deleted. You cannot delete a dataset while it is in use for indexing or training.

### Response 

There's no returned content when the dataset is deleted successfully. 

## Delete a speech model 

The [delete speech model](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Delete-Speech-Model) API deletes the specified speech model. You cannot delete a model while it is in use for indexing or training. 

### Response 

There's no returned content when the speech model is deleted successfully. 

## Next steps

[Customize a speech model using the website](customize-speech-model-with-website.md)

