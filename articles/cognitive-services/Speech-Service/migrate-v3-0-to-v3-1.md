---
title: Migrate from v3.0 to v3.1 REST API - Speech service
titleSuffix: Azure Cognitive Services
description: This document helps developers migrate code from v3.0 to v3.1 of the Speech to text REST API.
services: cognitive-services
author: heikora
manager: dongli
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: reference
ms.date: 09/01/2022
ms.author: heikora
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Migrate code from v3.0 to v3.1 of the REST API

The Speech-to-text REST API v3.1 is used for [Batch transcription](batch-transcription.md) and [Custom Speech](custom-speech-overview.md). Changes from version 3.0 to 3.1 are described in the sections below.

> [!IMPORTANT]
> Version 3.0 of the [Speech to Text REST API](rest-speech-to-text.md) will be retired. Please migrate your applications to the Speech-to-text REST API v3.1. If you're still using version 2.0, see [Migrate code from v2.0 to v3.0 of the REST API](migrate-v2-to-v3.md) for additional requirements.

## Path and operation IDs

You must update the base path in your code from `/speechtotext/v3.0` to `/speechtotext/v3.1`. For example, to get base models in the `eastus` region, use `https://eastus.api.cognitive.microsoft.com/speechtotext/v3.1/models/base` instead of `https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/models/base`.

The name of each `operationId` in version 3.1 is prefixed with the object name. For example, the `operationId` for "Create Model" changed from [CreateModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateModel) in version 3.0 to [Models_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_Create) in version 3.1.

|Path|Action|Version 3.0 Operation ID|Version 3.1 Operation ID|
|---------|---------|---------|---------|
|`/datasets`|GET|[GetDatasets](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetDatasets)|[Datasets_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_List)
|`/datasets`|POST|[CreateDataset](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateDataset)|[Datasets_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Create)
|`/datasets/{id}`|DELETE|[DeleteDataset](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteDataset)|[Datasets_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Delete)
|`/datasets/{id}`|GET|[GetDataset](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetDataset)|[Datasets_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Get)
|`/datasets/{id}`|PATCH|[UpdateDataset](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateDataset)|[Datasets_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Update)
|`/datasets/{id}/blocks:commit`|POST|Not applicable|[Datasets_CommitBlocks](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_CommitBlocks)
|`/datasets/{id}/blocks`|GET|Not applicable|[Datasets_GetDatasetBlocks](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_GetDatasetBlocks)
|`/datasets/{id}/blocks`|PUT|Not applicable|[Datasets_UploadBlock](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_UploadBlock)
|`/datasets/{id}/files`|GET|[GetDatasetFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetDatasetFiles)|[Datasets_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_ListFiles)
|`/datasets/{id}/files/{fileId}`|GET|[GetDatasetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetDatasetFile)|[Datasets_GetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_GetFile)
|`/datasets/locales`|GET|[GetSupportedLocalesForDatasets](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetSupportedLocalesForDatasets)|[Datasets_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_ListSupportedLocales)
|`/datasets/upload`|POST|[UploadDatasetFromForm](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UploadDatasetFromForm)|[Datasets_Upload](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Upload)
|`/endpoints`|GET|[GetEndpoints](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEndpoints)|[Endpoints_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_List)
|`/endpoints`|POST|[CreateEndpoint](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateEndpoint)|[Endpoints_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Create)
|`/endpoints/{id}`|DELETE|[DeleteEndpoint](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteEndpoint)|[Endpoints_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Delete)
|`/endpoints/{id}`|GET|[GetEndpoint](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEndpoint)|[Endpoints_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Get)
|`/endpoints/{id}`|PATCH|[UpdateEndpoint](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateEndpoint)|[Endpoints_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Update)
|`/endpoints/{id}/files/logs`|DELETE|[DeleteEndpointLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteEndpointLogs)|[Endpoints_DeleteLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_DeleteLogs)
|`/endpoints/{id}/files/logs`|GET|[GetEndpointLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEndpointLogs)|[Endpoints_ListLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_ListLogs)
|`/endpoints/{id}/files/logs/{logId}`|DELETE|[DeleteEndpointLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteEndpointLog)|[Endpoints_DeleteLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_DeleteLog)
|`/endpoints/{id}/files/logs/{logId}`|GET|[GetEndpointLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEndpointLog)|[Endpoints_GetLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_GetLog)
|`/endpoints/base/{locale}/files/logs`|DELETE|[DeleteBaseModelLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteBaseModelLogs)|[Endpoints_DeleteBaseModelLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_DeleteBaseModelLogs)
|`/endpoints/base/{locale}/files/logs`|GET|[GetBaseModelLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetBaseModelLogs)|[Endpoints_ListBaseModelLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_ListBaseModelLogs)
|`/endpoints/base/{locale}/files/logs/{logId}`|DELETE|[DeleteBaseModelLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteBaseModelLog)|[Endpoints_DeleteBaseModelLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_DeleteBaseModelLog)
|`/endpoints/base/{locale}/files/logs/{logId}`|GET|[GetBaseModelLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetBaseModelLog)|[Endpoints_GetBaseModelLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_GetBaseModelLog)
|`/endpoints/locales`|GET|[GetSupportedLocalesForEndpoints](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetSupportedLocalesForEndpoints)|[Endpoints_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_ListSupportedLocales)
|`/evaluations`|GET|[GetEvaluations](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEvaluations)|[Evaluations_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_List)
|`/evaluations`|POST|[CreateEvaluation](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateEvaluation)|[Evaluations_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Create)
|`/evaluations/{id}`|DELETE|[DeleteEvaluation](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteEvaluation)|[Evaluations_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Delete)
|`/evaluations/{id}`|GET|[GetEvaluation](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEvaluation)|[Evaluations_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Get)
|`/evaluations/{id}`|PATCH|[UpdateEvaluation](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateEvaluation)|[Evaluations_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Update)
|`/evaluations/{id}/files`|GET|[GetEvaluationFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEvaluationFiles)|[Evaluations_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_ListFiles)
|`/evaluations/{id}/files/{fileId}`|GET|[GetEvaluationFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEvaluationFile)|[Evaluations_GetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_GetFile)
|`/evaluations/locales`|GET|[GetSupportedLocalesForEvaluations](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetSupportedLocalesForEvaluations)|[Evaluations_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_ListSupportedLocales)
|`/healthstatus`|GET|[GetHealthStatus](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetHealthStatus)|[HealthStatus_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/HealthStatus_Get)
|`/models`|GET|[GetModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetModels)|[Models_ListCustomModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListCustomModels)
|`/models`|POST|[CreateModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateModel)|[Models_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_Create)
|`/models/{id}:copyto`|POST|Not applicable|[Models_CopyTo](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_CopyTo)
|`/models/{id}`|DELETE|[DeleteModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteModel)|[Models_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_Delete)
|`/models/{id}`|GET|[GetModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetModel)|[Models_GetCustomModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetCustomModel)
|`/models/{id}`|PATCH|[UpdateModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateModel)|[Models_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_Update)
|`/models/{id}/files`|GET|Not applicable|[Models_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListFiles)
|`/models/{id}/files/{fileId}`|GET|Not applicable|[Models_GetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetFile)
|`/models/{id}/manifest`|GET|[GetModelManifest](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetModelManifest)|[Models_GetCustomModelManifest](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetCustomModelManifest)
|`/models/base`|GET|[GetBaseModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetBaseModels)|[Models_ListBaseModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListBaseModels)
|`/models/base/{id}`|GET|[GetBaseModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetBaseModel)|[Models_ListBaseModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListBaseModel)
|`/models/base/{id}/manifest`|GET|[GetBaseModelManifest](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetBaseModelManifest)|[Models_GetBaseModelManifest](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetBaseModelManifest)
|`/models/locales`|GET|[GetSupportedLocalesForModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetSupportedLocalesForModels)|[Models_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListSupportedLocales)
|`/projects`|GET|[GetProjects](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetProjects)|[Projects_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_List)
|`/projects`|POST|[CreateProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateProject)|[Projects_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_Create)
|`/projects/{id}`|DELETE|[DeleteProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteProject)|[Projects_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_Delete)
|`/projects/{id}`|GET|[GetProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetProject)|[Projects_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_Get)
|`/projects/{id}`|PATCH|[UpdateProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateProject)|[Projects_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_Update)
|`/projects/{id}/datasets`|GET|[GetDatasetsForProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetDatasetsForProject)|[Projects_ListDatasets](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListDatasets)
|`/projects/{id}/endpoints`|GET|[GetEndpointsForProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEndpointsForProject)|[Projects_ListEndpoints](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListEndpoints)
|`/projects/{id}/evaluations`|GET|[GetEvaluationsForProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEvaluationsForProject)|[Projects_ListEvaluations](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListEvaluations)
|`/projects/{id}/models`|GET|[GetModelsForProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetModelsForProject)|[Projects_ListModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListModels)
|`/projects/{id}/transcriptions`|GET|[GetTranscriptionsForProject](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscriptionsForProject)|[Projects_ListTranscriptions](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListTranscriptions)
|`/projects/locales`|GET|[GetSupportedProjectLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetSupportedProjectLocales)|[Projects_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListSupportedLocales)
|`/transcriptions`|GET|[GetTranscriptions](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscriptions)|[Transcriptions_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_List)
|`/transcriptions`|POST|[CreateTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateTranscription)|[Transcriptions_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create)
|`/transcriptions/{id}`|DELETE|[DeleteTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteTranscription)|[Transcriptions_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Delete)
|`/transcriptions/{id}`|GET|[GetTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscription)|[Transcriptions_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Get)
|`/transcriptions/{id}`|PATCH|[UpdateTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateTranscription)|[Transcriptions_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Update)
|`/transcriptions/{id}/files`|GET|[GetTranscriptionFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscriptionFiles)|[Transcriptions_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListFiles)
|`/transcriptions/{id}/files/{fileId}`|GET|[GetTranscriptionFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscriptionFile)|[Transcriptions_GetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_GetFile)
|`/transcriptions/locales`|GET|[GetSupportedLocalesForTranscriptions](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetSupportedLocalesForTranscriptions)|[Transcriptions_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListSupportedLocales)
|`/webhooks`|GET|[GetHooks](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetHooks)|[WebHooks_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_List)
|`/webhooks`|POST|[CreateHook](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateHook)|[WebHooks_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Create)
|`/webhooks/{id}:ping`|POST|Not applicable|[WebHooks_Ping](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Ping)
|`/webhooks/{id}:test`|POST|Not applicable|[WebHooks_Test](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Test)
|`/webhooks/{id}`|DELETE|[DeleteHook](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteHook)|[WebHooks_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Delete)
|`/webhooks/{id}`|GET|[GetHook](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetHook)|[WebHooks_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Get)
|`/webhooks/{id}`|PATCH|[UpdateHook](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateHook)|[WebHooks_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Update)

## Batch transcription

In the [Transcriptions_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create) operation the following three properties are added:
- The **displayFormWordLevelTimestampsEnabled** property can be used to enable the reporting of word-level timestamps on the display form of the transcription results.
- The **diarization** property can be used to specify hints for the minimum and maximum number of speaker labels to generate when performing optional diarization (speaker separation). With this feature, the service is now able to generate speaker labels for more than two speakers.
- The **languageIdentification** property can be used specify settings for optional language identification on the input prior to transcription. Up to 10 candidate locales are supported for language identification. 

The **filter** property is added to the [Transcriptions_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_List), [Transcriptions_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListFiles), and [Projects_ListTranscriptions](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListTranscriptions) operations. The **filter** expression can be used to select a subset of the available resources. You can filter by `displayName`, `description`, `createdDateTime`, `lastActionDateTime`, `status`, and `locale`. For example: `filter=createdDateTime gt 2022-02-01T11:00:00Z`

## Custom Speech

### Datasets

The following operations are added for uploading and managing multiple data blocks for a dataset:
 - [Datasets_UploadBlock](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_UploadBlock) - Upload a block of data for the dataset. The maximum size of the block is 8MiB.
 - [Datasets_GetDatasetBlocks](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_GetDatasetBlocks) - Get the list of uploaded blocks for this dataset.
 - [Datasets_CommitBlocks](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_CommitBlocks) - Commit block list to complete the upload of the dataset. 

To support model adaptation with [structured text in markdown](how-to-custom-speech-test-and-train.md#structured-text-data-for-training) data, the [Datasets_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Create) operation now supports the **LanguageMarkdown** data kind. For more information, see [upload datasets](how-to-custom-speech-upload-data.md#upload-datasets). 

### Models

The [Models_ListBaseModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListBaseModels) and [Models_ListBaseModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListBaseModel) operations return information on the type of adaptation supported by each base model.

```json 
"features": {

    // some properties are omitted for brevity

    "supportsAdaptationsWith": [
        "Acoustic",
        "Language",
        "LanguageMarkdown",
        "Pronunciation"
    ]
}
```

The [Models_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_Create) operation has a new **customModelWeightPercent** property where you can specify the weight used when the Custom Language Model (trained from plain or structured text data) is combined with the Base Language Model. Valid values are integers between 1 and 100. The default value is currently 30.

The **filter** property is added to the following operations:

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

The **filter** expression can be used to select a subset of the available resources. You can filter by `displayName`, `description`, `createdDateTime`, `lastActionDateTime`, `status`, `locale`, and `kind`. For example: `filter=locale eq 'en-US'`

Added the [Models_GetCustomModelFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetCustomModelFiles) operation to get the files of the model identified by the given ID.

Added the [Models_GetCustomModelFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetCustomModelFile) operation to get one specific file (identified with fileId) from a model (identified with id). This lets you retrieve a **ModelReport** file that provides information on the data processed during training. 

## Next steps

* [Speech-to-text REST API](rest-speech-to-text.md)
* [Speech-to-text REST API v3.1 reference](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1)


