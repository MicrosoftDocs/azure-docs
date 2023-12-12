---
title: Migrate from v3.0 to v3.1 REST API - Speech service
titleSuffix: Azure AI services
description: This document helps developers migrate code from v3.0 to v3.1 of the Speech to text REST API.
#services: cognitive-services
author: heikora
manager: dongli
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 09/15/2023
ms.author: heikora
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Migrate code from v3.0 to v3.1 of the REST API

The Speech to text REST API is used for [Batch transcription](batch-transcription.md) and [Custom Speech](custom-speech-overview.md). Changes from version 3.0 to 3.1 are described in the sections below.

> [!IMPORTANT]
> Speech to text REST API v3.2 is available in preview. 
> [Speech to text REST API](rest-speech-to-text.md) v3.1 is generally available. 
> Speech to text REST API v3.0 will be retired on April 1st, 2026. For more information, see the Speech to text REST API [v3.0 to v3.1](migrate-v3-0-to-v3-1.md) and [v3.1 to v3.2](migrate-v3-1-to-v3-2.md) migration guides.

## Base path

You must update the base path in your code from `/speechtotext/v3.0` to `/speechtotext/v3.1`. For example, to get base models in the `eastus` region, use `https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base` instead of `https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/models/base`.

Please note these additional changes:
- The `/models/{id}/copyto` operation (includes '/') in version 3.0 is replaced by the `/models/{id}:copyto` operation (includes ':') in version 3.1.
- The `/webhooks/{id}/ping` operation (includes '/') in version 3.0 is replaced by the `/webhooks/{id}:ping` operation (includes ':') in version 3.1.
- The `/webhooks/{id}/test` operation (includes '/') in version 3.0 is replaced by the `/webhooks/{id}:test` operation (includes ':') in version 3.1.

For more details, see [Operation IDs](#operation-ids) later in this guide.

## Batch transcription

> [!NOTE]
> Don't use Speech to text REST API v3.0 to retrieve a transcription created via Speech to text REST API v3.1. You'll see an error message such as the following: "The API version cannot be used to access this transcription. Please use API version v3.1 or higher."

In the [Transcriptions_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create) operation the following three properties are added:
- The `displayFormWordLevelTimestampsEnabled` property can be used to enable the reporting of word-level timestamps on the display form of the transcription results. The results are returned in the `displayWords` property of the transcription file. 
- The `diarization` property can be used to specify hints for the minimum and maximum number of speaker labels to generate when performing optional diarization (speaker separation). With this feature, the service is now able to generate speaker labels for more than two speakers. To use this property you must also set the `diarizationEnabled` property to `true`. 
- The `languageIdentification` property can be used specify settings for language identification on the input prior to transcription. Up to 10 candidate locales are supported for language identification. The returned transcription will include a new `locale` property for the recognized language or the locale that you provided. 

The `filter` property is added to the [Transcriptions_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_List), [Transcriptions_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListFiles), and [Projects_ListTranscriptions](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListTranscriptions) operations. The `filter` expression can be used to select a subset of the available resources. You can filter by `displayName`, `description`, `createdDateTime`, `lastActionDateTime`, `status`, and `locale`. For example: `filter=createdDateTime gt 2022-02-01T11:00:00Z`

If you use webhook to receive notifications about transcription status, please note that the webhooks created via V3.0 API cannot receive notifications for V3.1 transcription requests. You need to create a new webhook endpoint via V3.1 API in order to receive notifications for V3.1 transcription requests.

## Custom Speech

### Datasets

The following operations are added for uploading and managing multiple data blocks for a dataset:
 - [Datasets_UploadBlock](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_UploadBlock) - Upload a block of data for the dataset. The maximum size of the block is 8MiB.
 - [Datasets_GetBlocks](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_GetBlocks) - Get the list of uploaded blocks for this dataset.
 - [Datasets_CommitBlocks](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_CommitBlocks) - Commit blocklist to complete the upload of the dataset. 

To support model adaptation with [structured text in markdown](how-to-custom-speech-test-and-train.md#structured-text-data-for-training) data, the [Datasets_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Create) operation now supports the **LanguageMarkdown** data kind. For more information, see [upload datasets](how-to-custom-speech-upload-data.md#upload-datasets). 

### Models

The [Models_ListBaseModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListBaseModels) and [Models_GetBaseModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetBaseModel) operations return information on the type of adaptation supported by each base model.

```json 
"features": {
    "supportsAdaptationsWith": [
        "Acoustic",
        "Language",
        "LanguageMarkdown",
        "Pronunciation"
    ]
}
```

The [Models_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_Create) operation has a new `customModelWeightPercent` property where you can specify the weight used when the Custom Language Model (trained from plain or structured text data) is combined with the Base Language Model. Valid values are integers between 1 and 100. The default value is currently 30.

The `filter` property is added to the following operations:

- [Datasets_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_List)
- [Datasets_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_ListFiles)
- [Endpoints_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_List)
- [Evaluations_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_List)
- [Evaluations_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_ListFiles)
- [Models_ListBaseModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListBaseModels)
- [Models_ListCustomModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListCustomModels)
- [Projects_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_List)
- [Projects_ListDatasets](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListDatasets)
- [Projects_ListEndpoints](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListEndpoints)
- [Projects_ListEvaluations](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListEvaluations)
- [Projects_ListModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListModels)

The `filter` expression can be used to select a subset of the available resources. You can filter by `displayName`, `description`, `createdDateTime`, `lastActionDateTime`, `status`, `locale`, and `kind`. For example: `filter=locale eq 'en-US'`

Added the [Models_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListFiles) operation to get the files of the model identified by the given ID.

Added the [Models_GetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetFile) operation to get one specific file (identified with fileId) from a model (identified with ID). This lets you retrieve a **ModelReport** file that provides information on the data processed during training. 

## Operation IDs

You must update the base path in your code from `/speechtotext/v3.0` to `/speechtotext/v3.1`. For example, to get base models in the `eastus` region, use `https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base` instead of `https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/models/base`.

The name of each `operationId` in version 3.1 is prefixed with the object name. For example, the `operationId` for "Create Model" changed from [CreateModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateModel) in version 3.0 to [Models_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_Create) in version 3.1.

|Path|Method|Version 3.1 Operation ID|Version 3.0 Operation ID|
|---------|---------|---------|---------|
|`/datasets`|GET|[Datasets_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_List)|[GetDatasets](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetDatasets)|
|`/datasets`|POST|[Datasets_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Create)|[CreateDataset](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateDataset)|
|`/datasets/{id}`|DELETE|[Datasets_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Delete)|[DeleteDataset](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteDataset)|
|`/datasets/{id}`|GET|[Datasets_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Get)|[GetDataset](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetDataset)|
|`/datasets/{id}`|PATCH|[Datasets_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Update)|[UpdateDataset](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateDataset)|
|`/datasets/{id}/blocks:commit`|POST|[Datasets_CommitBlocks](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_CommitBlocks)|Not applicable|
|`/datasets/{id}/blocks`|GET|[Datasets_GetBlocks](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_GetBlocks)|Not applicable|
|`/datasets/{id}/blocks`|PUT|[Datasets_UploadBlock](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_UploadBlock)|Not applicable|
|`/datasets/{id}/files`|GET|[Datasets_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_ListFiles)|[GetDatasetFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetDatasetFiles)|
|`/datasets/{id}/files/{fileId}`|GET|[Datasets_GetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_GetFile)|[GetDatasetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetDatasetFile)|
|`/datasets/locales`|GET|[Datasets_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_ListSupportedLocales)|[GetSupportedLocalesForDatasets](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetSupportedLocalesForDatasets)|
|`/datasets/upload`|POST|[Datasets_Upload](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Upload)|[UploadDatasetFromForm](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UploadDatasetFromForm)|
|`/endpoints`|GET|[Endpoints_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_List)|[GetEndpoints](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEndpoints)|
|`/endpoints`|POST|[Endpoints_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Create)|[CreateEndpoint](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateEndpoint)|
|`/endpoints/{id}`|DELETE|[Endpoints_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Delete)|[DeleteEndpoint](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteEndpoint)|
|`/endpoints/{id}`|GET|[Endpoints_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Get)|[GetEndpoint](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEndpoint)|
|`/endpoints/{id}`|PATCH|[Endpoints_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Update)|[UpdateEndpoint](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateEndpoint)|
|`/endpoints/{id}/files/logs`|DELETE|[Endpoints_DeleteLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_DeleteLogs)|[DeleteEndpointLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteEndpointLogs)|
|`/endpoints/{id}/files/logs`|GET|[Endpoints_ListLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_ListLogs)|[GetEndpointLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEndpointLogs)|
|`/endpoints/{id}/files/logs/{logId}`|DELETE|[Endpoints_DeleteLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_DeleteLog)|[DeleteEndpointLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteEndpointLog)|
|`/endpoints/{id}/files/logs/{logId}`|GET|[Endpoints_GetLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_GetLog)|[GetEndpointLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEndpointLog)|
|`/endpoints/base/{locale}/files/logs`|DELETE|[Endpoints_DeleteBaseModelLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_DeleteBaseModelLogs)|[DeleteBaseModelLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteBaseModelLogs)|
|`/endpoints/base/{locale}/files/logs`|GET|[Endpoints_ListBaseModelLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_ListBaseModelLogs)|[GetBaseModelLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetBaseModelLogs)|
|`/endpoints/base/{locale}/files/logs/{logId}`|DELETE|[Endpoints_DeleteBaseModelLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_DeleteBaseModelLog)|[DeleteBaseModelLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteBaseModelLog)|
|`/endpoints/base/{locale}/files/logs/{logId}`|GET|[Endpoints_GetBaseModelLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_GetBaseModelLog)|[GetBaseModelLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetBaseModelLog)|
|`/endpoints/locales`|GET|[Endpoints_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_ListSupportedLocales)|[GetSupportedLocalesForEndpoints](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetSupportedLocalesForEndpoints)|
|`/evaluations`|GET|[Evaluations_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_List)|[GetEvaluations](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEvaluations)|
|`/evaluations`|POST|[Evaluations_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Create)|[CreateEvaluation](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateEvaluation)|
|`/evaluations/{id}`|DELETE|[Evaluations_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Delete)|[DeleteEvaluation](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteEvaluation)|
|`/evaluations/{id}`|GET|[Evaluations_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Get)|[GetEvaluation](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEvaluation)|
|`/evaluations/{id}`|PATCH|[Evaluations_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Update)|[UpdateEvaluation](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateEvaluation)|
|`/evaluations/{id}/files`|GET|[Evaluations_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_ListFiles)|[GetEvaluationFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEvaluationFiles)|
|`/evaluations/{id}/files/{fileId}`|GET|[Evaluations_GetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_GetFile)|[GetEvaluationFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEvaluationFile)|
|`/evaluations/locales`|GET|[Evaluations_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_ListSupportedLocales)|[GetSupportedLocalesForEvaluations](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetSupportedLocalesForEvaluations)|
|`/healthstatus`|GET|[HealthStatus_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/HealthStatus_Get)|[GetHealthStatus](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetHealthStatus)|
|`/models`|GET|[Models_ListCustomModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListCustomModels)|[GetModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetModels)|
|`/models`|POST|[Models_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_Create)|[CreateModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateModel)|
|`/models/{id}:copyto`<sup>1</sup>|POST|[Models_CopyTo](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_CopyTo)|[CopyModelToSubscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CopyModelToSubscription)|
|`/models/{id}`|DELETE|[Models_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_Delete)|[DeleteModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteModel)|
|`/models/{id}`|GET|[Models_GetCustomModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetCustomModel)|[GetModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetModel)|
|`/models/{id}`|PATCH|[Models_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_Update)|[UpdateModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateModel)|
|`/models/{id}/files`|GET|[Models_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListFiles)|Not applicable|
|`/models/{id}/files/{fileId}`|GET|[Models_GetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetFile)|Not applicable|
|`/models/{id}/manifest`|GET|[Models_GetCustomModelManifest](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetCustomModelManifest)|[GetModelManifest](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetModelManifest)|
|`/models/base`|GET|[Models_ListBaseModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListBaseModels)|[GetBaseModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetBaseModels)|
|`/models/base/{id}`|GET|[Models_GetBaseModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetBaseModel)|[GetBaseModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetBaseModel)|
|`/models/base/{id}/manifest`|GET|[Models_GetBaseModelManifest](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetBaseModelManifest)|[GetBaseModelManifest](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetBaseModelManifest)|
|`/models/locales`|GET|[Models_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListSupportedLocales)|[GetSupportedLocalesForModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetSupportedLocalesForModels)|
|`/projects`|GET|[Projects_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_List)|[GetProjects](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetProjects)|
|`/projects`|POST|[Projects_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_Create)|[CreateProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateProject)|
|`/projects/{id}`|DELETE|[Projects_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_Delete)|[DeleteProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteProject)|
|`/projects/{id}`|GET|[Projects_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_Get)|[GetProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetProject)|
|`/projects/{id}`|PATCH|[Projects_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_Update)|[UpdateProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateProject)|
|`/projects/{id}/datasets`|GET|[Projects_ListDatasets](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListDatasets)|[GetDatasetsForProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetDatasetsForProject)|
|`/projects/{id}/endpoints`|GET|[Projects_ListEndpoints](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListEndpoints)|[GetEndpointsForProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEndpointsForProject)|
|`/projects/{id}/evaluations`|GET|[Projects_ListEvaluations](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListEvaluations)|[GetEvaluationsForProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEvaluationsForProject)|
|`/projects/{id}/models`|GET|[Projects_ListModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListModels)|[GetModelsForProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetModelsForProject)|
|`/projects/{id}/transcriptions`|GET|[Projects_ListTranscriptions](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListTranscriptions)|[GetTranscriptionsForProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscriptionsForProject)|
|`/projects/locales`|GET|[Projects_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListSupportedLocales)|[GetSupportedProjectLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetSupportedProjectLocales)|
|`/transcriptions`|GET|[Transcriptions_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_List)|[GetTranscriptions](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscriptions)|
|`/transcriptions`|POST|[Transcriptions_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create)|[CreateTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateTranscription)|
|`/transcriptions/{id}`|DELETE|[Transcriptions_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Delete)|[DeleteTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteTranscription)|
|`/transcriptions/{id}`|GET|[Transcriptions_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Get)|[GetTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscription)|
|`/transcriptions/{id}`|PATCH|[Transcriptions_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Update)|[UpdateTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateTranscription)|
|`/transcriptions/{id}/files`|GET|[Transcriptions_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListFiles)|[GetTranscriptionFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscriptionFiles)|
|`/transcriptions/{id}/files/{fileId}`|GET|[Transcriptions_GetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_GetFile)|[GetTranscriptionFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscriptionFile)|
|`/transcriptions/locales`|GET|[Transcriptions_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListSupportedLocales)|[GetSupportedLocalesForTranscriptions](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetSupportedLocalesForTranscriptions)|
|`/webhooks`|GET|[WebHooks_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_List)|[GetHooks](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetHooks)|
|`/webhooks`|POST|[WebHooks_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Create)|[CreateHook](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateHook)|
|`/webhooks/{id}:ping`<sup>2</sup>|POST|[WebHooks_Ping](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Ping)|[PingHook](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/PingHook)|
|`/webhooks/{id}:test`<sup>3</sup>|POST|[WebHooks_Test](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Test)|[TestHook](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/TestHook)|
|`/webhooks/{id}`|DELETE|[WebHooks_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Delete)|[DeleteHook](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteHook)|
|`/webhooks/{id}`|GET|[WebHooks_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Get)|[GetHook](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetHook)|
|`/webhooks/{id}`|PATCH|[WebHooks_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Update)|[UpdateHook](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateHook)|

<sup>1</sup> The `/models/{id}/copyto` operation (includes '/') in version 3.0 is replaced by the `/models/{id}:copyto` operation (includes ':') in version 3.1.

<sup>2</sup> The `/webhooks/{id}/ping` operation (includes '/') in version 3.0 is replaced by the `/webhooks/{id}:ping` operation (includes ':') in version 3.1.

<sup>3</sup> The `/webhooks/{id}/test` operation (includes '/') in version 3.0 is replaced by the `/webhooks/{id}:test` operation (includes ':') in version 3.1.

## Next steps

* [Speech to text REST API](rest-speech-to-text.md)
* [Speech to text REST API v3.1 reference](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1)
* [Speech to text REST API v3.0 reference](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0)


