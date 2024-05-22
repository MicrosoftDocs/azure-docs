---
title: Migrate from v3.0 to v3.1 REST API - Speech service
titleSuffix: Azure AI services
description: This document helps developers migrate code from v3.0 to v3.1 of the Speech to text REST API.
author: heikora
manager: dongli
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 4/15/2024
ms.author: heikora
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Migrate code from v3.0 to v3.1 of the REST API

The Speech to text REST API is used for [Batch transcription](batch-transcription.md) and [custom speech](custom-speech-overview.md). Changes from version 3.0 to 3.1 are described in the sections below.

> [!IMPORTANT]
> Speech to text REST API v3.2 is available in preview. 
> [Speech to text REST API](rest-speech-to-text.md) v3.1 is generally available. 
> Speech to text REST API v3.0 will be retired on April 1st, 2026. For more information, see the Speech to text REST API [v3.0 to v3.1](migrate-v3-0-to-v3-1.md) and [v3.1 to v3.2](migrate-v3-1-to-v3-2.md) migration guides.

## Base path

You must update the base path in your code from `/speechtotext/v3.0` to `/speechtotext/v3.1`. For example, to get base models in the `eastus` region, use `https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base` instead of `https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/models/base`.

Note these other changes:
- The `/models/{id}/copyto` operation (includes '/') in version 3.0 is replaced by the `/models/{id}:copyto` operation (includes ':') in version 3.1.
- The `/webhooks/{id}/ping` operation (includes '/') in version 3.0 is replaced by the `/webhooks/{id}:ping` operation (includes ':') in version 3.1.
- The `/webhooks/{id}/test` operation (includes '/') in version 3.0 is replaced by the `/webhooks/{id}:test` operation (includes ':') in version 3.1.

For more information, see [Operation IDs](#operation-ids) later in this guide.

## Batch transcription

> [!NOTE]
> Don't use Speech to text REST API v3.0 to retrieve a transcription created via Speech to text REST API v3.1. You'll see an error message such as the following: "The API version cannot be used to access this transcription. Please use API version v3.1 or higher."

In the [Transcriptions_Create](/rest/api/speechtotext/transcriptions/create) operation the following three properties are added:
- The `displayFormWordLevelTimestampsEnabled` property can be used to enable the reporting of word-level timestamps on the display form of the transcription results. The results are returned in the `displayWords` property of the transcription file.
- The `diarization` property can be used to specify hints for the minimum and maximum number of speaker labels to generate when performing optional diarization (speaker separation). With this feature, the service is now able to generate speaker labels for more than two speakers. To use this property, you must also set the `diarizationEnabled` property to `true`. With the v3.1 API, we have increased the number of speakers that can be identified through diarization from the two speakers supported by the v3.0 API. It's recommended to keep the number of speakers under 30 for better performance.
- The `languageIdentification` property can be used specify settings for language identification on the input prior to transcription. Up to 10 candidate locales are supported for language identification. The returned transcription includes a new `locale` property for the recognized language or the locale that you provided. 

The `filter` property is added to the [Transcriptions_List](/rest/api/speechtotext/transcriptions/list), [Transcriptions_ListFiles](/rest/api/speechtotext/transcriptions/list-files), and [Projects_ListTranscriptions](/rest/api/speechtotext/projects/list-transcriptions) operations. The `filter` expression can be used to select a subset of the available resources. You can filter by `displayName`, `description`, `createdDateTime`, `lastActionDateTime`, `status`, and `locale`. For example: `filter=createdDateTime gt 2022-02-01T11:00:00Z`

If you use webhook to receive notifications about transcription status, note that the webhooks created via V3.0 API can't receive notifications for V3.1 transcription requests. You need to create a new webhook endpoint via V3.1 API in order to receive notifications for V3.1 transcription requests.

## Custom speech

### Datasets

The following operations are added for uploading and managing multiple data blocks for a dataset:
 - [Datasets_UploadBlock](/rest/api/speechtotext/datasets/upload-block) - Upload a block of data for the dataset. The maximum size of the block is 8MiB.
 - [Datasets_GetBlocks](/rest/api/speechtotext/datasets/get-blocks) - Get the list of uploaded blocks for this dataset.
 - [Datasets_CommitBlocks](/rest/api/speechtotext/datasets/commit-blocks) - Commit blocklist to complete the upload of the dataset. 

To support model adaptation with [structured text in markdown](how-to-custom-speech-test-and-train.md#structured-text-data-for-training) data, the [Datasets_Create](/rest/api/speechtotext/datasets/create) operation now supports the **LanguageMarkdown** data kind. For more information, see [upload datasets](how-to-custom-speech-upload-data.md#upload-datasets). 

### Models

The [Models_ListBaseModels](/rest/api/speechtotext/models/list-base-models) and [Models_GetBaseModel](/rest/api/speechtotext/models/get-base-model) operations return information on the type of adaptation supported by each base model.

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

The [Models_Create](/rest/api/speechtotext/models/create) operation has a new `customModelWeightPercent` property where you can specify the weight used when the Custom Language Model (trained from plain or structured text data) is combined with the Base Language Model. Valid values are integers between 1 and 100. The default value is currently 30.

The `filter` property is added to the following operations:

- [Datasets_List](/rest/api/speechtotext/datasets/list)
- [Datasets_ListFiles](/rest/api/speechtotext/datasets/list-files)
- [Endpoints_List](/rest/api/speechtotext/endpoints/list)
- [Evaluations_List](/rest/api/speechtotext/evaluations/list)
- [Evaluations_ListFiles](/rest/api/speechtotext/evaluations/list-files)
- [Models_ListBaseModels](/rest/api/speechtotext/models/list-base-models)
- [Models_ListCustomModels](/rest/api/speechtotext/models/list-custom-models)
- [Projects_List](/rest/api/speechtotext/projects/list)
- [Projects_ListDatasets](/rest/api/speechtotext/projects/list-datasets)
- [Projects_ListEndpoints](/rest/api/speechtotext/projects/list-endpoints)
- [Projects_ListEvaluations](/rest/api/speechtotext/projects/list-evaluations)
- [Projects_ListModels](/rest/api/speechtotext/projects/list-models)

The `filter` expression can be used to select a subset of the available resources. You can filter by `displayName`, `description`, `createdDateTime`, `lastActionDateTime`, `status`, `locale`, and `kind`. For example: `filter=locale eq 'en-US'`

Added the [Models_ListFiles](/rest/api/speechtotext/models/list-files) operation to get the files of the model identified by the given ID.

Added the [Models_GetFile](/rest/api/speechtotext/models/get-file) operation to get one specific file (identified with fileId) from a model (identified with ID). This lets you retrieve a **ModelReport** file that provides information on the data processed during training. 

## Operation IDs

You must update the base path in your code from `/speechtotext/v3.0` to `/speechtotext/v3.1`. For example, to get base models in the `eastus` region, use `https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base` instead of `https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/models/base`.

The name of each `operationId` in version 3.1 is prefixed with the object name. For example, the `operationId` for "Create Model" changed from [CreateModel](/rest/api/speechtotext/create-model/create-model?view=rest-speechtotext-v3.0&preserve-view=true) in version 3.0 to [Models_Create](/rest/api/speechtotext/models/create?view=rest-speechtotext-v3.1&preserve-view=true) in version 3.1.

The `/models/{id}/copyto` operation (includes '/') in version 3.0 is replaced by the `/models/{id}:copyto` operation (includes ':') in version 3.1.

The `/webhooks/{id}/ping` operation (includes '/') in version 3.0 is replaced by the `/webhooks/{id}:ping` operation (includes ':') in version 3.1.

The `/webhooks/{id}/test` operation (includes '/') in version 3.0 is replaced by the `/webhooks/{id}:test` operation (includes ':') in version 3.1.

## Next steps

* [Speech to text REST API](rest-speech-to-text.md)
* [Speech to text REST API v3.1 reference](/rest/api/speechtotext/operation-groups?view=rest-speechtotext-v3.1&preserve-view=true)
* [Speech to text REST API v3.0 reference](/rest/api/speechtotext/operation-groups?view=rest-speechtotext-v3.0&preserve-view=true)


