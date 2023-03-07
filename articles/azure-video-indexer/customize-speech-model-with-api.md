---
title: Customize a speech model with Azure Video Indexer API
description: Learn how to customize a speech model with the Azure Video Indexer API.
ms.topic: how-to
ms.date: ms.date: 03/06/2023
---

# Customize a speech model with API

Banner box: Speech model customization, including pronunciation training, is only supported in Video Indexer Azure trial accounts and Resource Manager accounts. It is not supported in classic accounts. For guidance on how to update your account type at no cost, see https://learn.microsoft.com/en-us/azure/azure-video-indexer/connect-classic-account-to-arm. For guidance on using the classic custom language experience, see https://learn.microsoft.com/en-us/azure/azure-video-indexer/customize-language-model-overview 

 

Customize a Speech model with the Azure Video Indexer API 

Azure Video Indexer lets you create custom Language models to customize speech recognition by uploading adaptation text, namely text from the domain whose vocabulary you'd like the engine to adapt to or aligning word or name pronunciation with how it should be written. 

For a detailed overview and best practices for custom speech models, see Customize a Speech model with Azure Video Indexer. 

You can use the Azure Video Indexer APIs to create and edit custom Language models in your account, as described in this article. You can also use the website, as described in Customize Speech model using the Azure Video Indexer website. 

 

The following are descriptions of some of the parameters: 

Name    Type   Description   

displayName   string   The desired name of the dataset/model 

locale    string   The language code of the dataset/model. For full list, see Language support 

kind    integer  0 for a plain text dataset, 1 for a pronunciation dataset 

description   string   Optional description of the dataset/model 

contentUrl   uri   URL of source file used in creation of dataset 

customProperties  object   Optional properties of dataset/model 

 

Create a speech dataset 

The create speech dataset API creates a dataset for training a speech model. You upload a file that is used to create a dataset with this call. The content of a dataset cannot be modified after its created. 

Response 

The response provides metadata on the newly created dataset following the format of this example JSON output: 

JSONCopy 

{ 

    "id": "9bba92-f958-4215-84fa-f58ac7002ae9", 

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

Create a speech model 

The create a speech model  API creates and trains a custom speech model that could then be used to improve the transcription accuracy of your videos. It must contain at least one plain text dataset and can optionally have pronunciation datasets. Create it with all of the relevant dataset files as a model’s datasets cannot be added or updated after its creation. 

Response 

The response provides metadata on the newly created model following the format of this example JSON output: 

JSONCopy 

{ 

    "id": "09494629-a024-4e2a-99af-85be4454cf", 

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

    "datasets": ["9b32ba92-f958-4215-84fa-f58ac7002ae9"], 

    "status": "Processing", 

    "lastActionDateTime": "2023-02-28T13:36:28Z", 

    "createdDateTime": "2023-02-28T13:36:28Z", 

    "customProperties": null 

} 

Get Speech Dataset 

The get speech dataset API returns information on the specified dataset.  

Response 

The response provides metadata on the specified dataset following the format of this example JSON output: 

JSONCopy 

 

{ 

    "id": "9b32ba92-f958-4215-84fa-f58002ae9", 

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

Get Speech Dataset Files 

The get speech dataset files API returns the files and metadata of the specified dataset. 

Response 

The response provides a URL with the dataset files and metadata following the format of this example JSON output: 

JSONCopy 

 

[{ 

    "datasetId": "9b32ba92-f958-4215-84fa-f58ac72a", 

    "fileId": "cdb841bf-7533-43d1-ae0e-cb190769c", 

    "name": "languagedata", 

    "contentUrl": "", 

    "kind": "LanguageData", 

    "createdDateTime": "2023-02-28T13:24:43Z", 

    "properties": { 

        "size": 1517 

    } 

}, { 

    "datasetId": "9b32ba92-f958-4215-84fa-f58ac72” 

    "fileId": "f9b11410-67e3-4fd7-8b57-2369192e", 

    "name": "normalized.txt", 

    "contentUrl": "", 

    "kind": "LanguageData", 

    "createdDateTime": "2023-02-28T13:24:43Z", 

    "properties": { 

        "size": 1517 

    } 

}, { 

    "datasetId": "9b32ba92-f958-4215-84fa-f58ac7", 

    "fileId": "e2a5e93d-9727-43b3-81cf-05f1e306", 

    "name": "report.json", 

    "contentUrl": "", 

    "kind": "DatasetReport", 

    "createdDateTime": "2023-02-28T13:24:43Z", 

    "properties": { 

        "size": 78 

    } 

}] 

Get Speech Dataset 

The get speech datasets API returns information on all of the specified accounts datasets.  

Response 

The response provides metadata on the datasets in the specified account following the format of this example JSON output: 

JSONCopy 

 

[{ 

    "id": "70c4320c-7ed3-48d4-abf5-4dad0f", 

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

Get Speech Model 

The get speech model API returns information on the specified model.  

Response 

The response provides metadata on the specified model following the format of this example JSON output: 

JSONCopy 

 

{ 

    "id": "09494629-a024-4e2a-99af-5685be445", 

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

    "datasets": ["9b32ba92-f958-4215-84fa-f58ac7002"], 

    "status": "Complete", 

    "lastActionDateTime": "2023-02-28T13:36:38Z", 

    "createdDateTime": "2023-02-28T13:36:28Z", 

    "customProperties": null 

} 

Get Speech Models 

The get speech models API returns information on all of the models in the specified account.  

Response 

The response provides metadata on all of the speech models in the specified account following the format of this example JSON output: 

[{ 

    "id": "09494629-a024-4e2a-99af-5685be445", 

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

    "datasets": ["9b32ba92-f958-4215-84fa-f58ac7002a"], 

    "status": "Complete", 

    "lastActionDateTime": "2023-02-28T13:36:38Z", 

    "createdDateTime": "2023-02-28T13:36:28Z", 

    "customProperties": null 

}] 

Delete speech dataset 

The delete speech dataset API deletes a the specified dataset. Any model that was trained with the deleted dataset will continue to be available until the model is deleted. 

Response 

There's no returned content when the dataset is deleted successfully. 

Delete a speech model 

The delete speech model API deletes the specified speech model.  

Response 

There's no returned content when the speech model is deleted successfully. 

## Next steps

[Customize a speech model using the website](customize-speech-model-with-website.md)

