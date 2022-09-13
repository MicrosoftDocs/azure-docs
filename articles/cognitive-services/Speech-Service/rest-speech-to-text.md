---
title: Speech-to-text REST API - Speech service
titleSuffix: Azure Cognitive Services
description: Get reference documentation for Speech-to-text REST API.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: reference
ms.date: 09/10/2022
ms.author: eur
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Speech-to-text REST API

Speech-to-text REST API is used for [Batch transcription](batch-transcription.md) and [Custom Speech](custom-speech-overview.md). 

> [!IMPORTANT]
> Speech-to-text REST API v3.1 is currently in public preview. Once it's generally available, version 3.0 of the [Speech to Text REST API](rest-speech-to-text.md) will be retired. For more information, see the [Speech-to-text REST API v3.1 migration guide](migrate-v3-0-to-v3-1.md).

> [!div class="nextstepaction"]
> [See the Speech to Text API v3.1 preview reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1-preview1/)

> [!div class="nextstepaction"]
> [See the Speech to Text API v3.0 reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/)

Use Speech-to-text REST API to:

- [Custom Speech](custom-speech-overview.md): With Custom Speech, you can upload your own data, test and train a custom model, compare accuracy between models, and deploy a model to a custom endpoint. Copy models to other subscriptions if you want colleagues to have access to a model that you built, or if you want to deploy a model to more than one region.
- [Batch transcription](batch-transcription.md): Transcribe audio files as a batch from multiple URLs or an Azure container. 

Speech-to-text REST API includes such features as:

- Get logs for each endpoint if logs have been requested for that endpoint.
- Request the manifest of the models that you create, to set up on-premises containers.
- Upload data from Azure storage accounts by using a shared access signature (SAS) URI.
- Bring your own storage. Use your own storage accounts for logs, transcription files, and other data.
- Some operations support webhook notifications. You can register your webhooks where notifications are sent.

## Datasets

Datasets are applicable for [Custom Speech](custom-speech-overview.md). You can use datasets to train and test the performance of different models. For example, you can compare the performance of a model trained with a specific dataset to the performance of a model trained with a different dataset.

See [Upload training and testing datasets](how-to-custom-speech-upload-data.md?pivots=rest-api) for examples of how to upload datasets. This table includes all the operations that you can perform on datasets.

|Path|Method|Operation ID|
|---|---|---|
|`/datasets/{id}/blocks:commit`|POST|[Datasets_CommitBlocks](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_CommitBlocks)|
|`/datasets`|POST|[Datasets_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Create)|
|`/datasets/{id}`|DELETE|[Datasets_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Delete)|
|`/datasets/{id}`|GET|[Datasets_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Get)|
|`/datasets/{id}/blocks`|GET|[Datasets_GetDatasetBlocks](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_GetDatasetBlocks)|
|`/datasets/{id}/files/{fileId}`|GET|[Datasets_GetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_GetFile)|
|`/datasets`|GET|[Datasets_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_List)|
|`/datasets/{id}/files`|GET|[Datasets_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_ListFiles)|
|`/datasets/locales`|GET|[Datasets_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_ListSupportedLocales)|
|`/datasets/{id}`|PATCH|[Datasets_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Update)|
|`/datasets/upload`|POST|[Datasets_Upload](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_Upload)|
|`/datasets/{id}/blocks`|PUT|[Datasets_UploadBlock](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Datasets_UploadBlock)|

## Endpoints

Endpoints are applicable for [Custom Speech](custom-speech-overview.md). You must deploy a custom endpoint to use a Custom Speech model.  

See [Deploy a model](how-to-custom-speech-deploy-model.md?pivots=rest-api) for examples of how to manage deployment endpoints. This table includes all the operations that you can perform on endpoints.

|Path|Method|Operation ID|
|---|---|---|
|`/endpoints`|POST|[Endpoints_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Create)|
|`/endpoints/{id}`|DELETE|[Endpoints_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Delete)|
|`/endpoints/base/{locale}/files/logs/{logId}`|DELETE|[Endpoints_DeleteBaseModelLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_DeleteBaseModelLog)|
|`/endpoints/base/{locale}/files/logs`|DELETE|[Endpoints_DeleteBaseModelLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_DeleteBaseModelLogs)|
|`/endpoints/{id}/files/logs/{logId}`|DELETE|[Endpoints_DeleteLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_DeleteLog)|
|`/endpoints/{id}/files/logs`|DELETE|[Endpoints_DeleteLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_DeleteLogs)|
|`/endpoints/{id}`|GET|[Endpoints_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Get)|
|`/endpoints/base/{locale}/files/logs/{logId}`|GET|[Endpoints_GetBaseModelLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_GetBaseModelLog)|
|`/endpoints/{id}/files/logs/{logId}`|GET|[Endpoints_GetLog](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_GetLog)|
|`/endpoints`|GET|[Endpoints_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_List)|
|`/endpoints/base/{locale}/files/logs`|GET|[Endpoints_ListBaseModelLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_ListBaseModelLogs)|
|`/endpoints/{id}/files/logs`|GET|[Endpoints_ListLogs](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_ListLogs)|
|`/endpoints/locales`|GET|[Endpoints_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_ListSupportedLocales)|
|`/endpoints/{id}`|PATCH|[Endpoints_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Endpoints_Update)|

## Evaluations

Evaluations are applicable for [Custom Speech](custom-speech-overview.md). You can use evaluations to compare the performance of different models. For example, you can compare the performance of a model trained with a specific dataset to the performance of a model trained with a different dataset.

See [Test recognition quality](how-to-custom-speech-inspect-data.md?pivots=rest-api) and [Test accuracy](how-to-custom-speech-evaluate-data.md?pivots=rest-api) for examples of how to test and evaluate Custom Speech models. This table includes all the operations that you can perform on evaluations.

|Path|Method|Operation ID|
|---|---|---|
|`/evaluations`|POST|[Evaluations_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Create)|
|`/evaluations/{id}`|DELETE|[Evaluations_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Delete)|
|`/evaluations/{id}`|GET|[Evaluations_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Get)|
|`/evaluations/{id}/files/{fileId}`|GET|[Evaluations_GetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_GetFile)|
|`/evaluations`|GET|[Evaluations_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_List)|
|`/evaluations/{id}/files`|GET|[Evaluations_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_ListFiles)|
|`/evaluations/locales`|GET|[Evaluations_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_ListSupportedLocales)|
|`/evaluations/{id}`|PATCH|[Evaluations_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Update)|

## Health status

Health status provides insights about the overall health of the service and sub-components.

|Path|Method|Operation ID|
|---|---|---|
|`/healthstatus`|GET|[HealthStatus_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/HealthStatus_Get)|

## Models

Models are applicable for [Custom Speech](custom-speech-overview.md) and [Batch Transcription](batch-transcription.md). You can use models to transcribe audio files. For example, you can use a model trained with a specific dataset to transcribe audio files. 

See [Train a model](how-to-custom-speech-train-model.md?pivots=rest-api) and [Custom Speech model lifecycle](how-to-custom-speech-model-and-endpoint-lifecycle.md?pivots=rest-api) for examples of how to train and manage Custom Speech models. This table includes all the operations that you can perform on models.

|Path|Method|Operation ID|
|---|---|---|
|`/models/{id}:copyto`|POST|[Models_CopyTo](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_CopyTo)|
|`/models`|POST|[Models_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_Create)|
|`/models/{id}`|DELETE|[Models_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_Delete)|
|`/models/base/{id}/manifest`|GET|[Models_GetBaseModelManifest](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetBaseModelManifest)|
|`/models/{id}`|GET|[Models_GetCustomModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetCustomModel)|
|`/models/{id}/manifest`|GET|[Models_GetCustomModelManifest](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetCustomModelManifest)|
|`/models/{id}/files/{fileId}`|GET|[Models_GetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_GetFile)|
|`/models/base/{id}`|GET|[Models_ListBaseModel](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListBaseModel)|
|`/models/base`|GET|[Models_ListBaseModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListBaseModels)|
|`/models`|GET|[Models_ListCustomModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListCustomModels)|
|`/models/{id}/files`|GET|[Models_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListFiles)|
|`/models/locales`|GET|[Models_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_ListSupportedLocales)|
|`/models/{id}`|PATCH|[Models_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Models_Update)|

## Projects

Projects are applicable for [Custom Speech](custom-speech-overview.md). Custom Speech projects contain models, training and testing datasets, and deployment endpoints. Each project is specific to a [locale](language-support.md?tabs=stt-tts). For example, you might create a project for English in the United States.

See [Create a project](how-to-custom-speech-create-project.md?pivots=rest-api) for examples of how to create projects. This table includes all the operations that you can perform on projects.

|Path|Method|Operation ID|
|---|---|---|
|`/projects`|POST|[Projects_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_Create)|
|`/projects/{id}`|DELETE|[Projects_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_Delete)|
|`/projects/{id}`|GET|[Projects_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_Get)|
|`/projects`|GET|[Projects_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_List)|
|`/projects/{id}/datasets`|GET|[Projects_ListDatasets](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListDatasets)|
|`/projects/{id}/endpoints`|GET|[Projects_ListEndpoints](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListEndpoints)|
|`/projects/{id}/evaluations`|GET|[Projects_ListEvaluations](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListEvaluations)|
|`/projects/{id}/models`|GET|[Projects_ListModels](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListModels)|
|`/projects/locales`|GET|[Projects_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListSupportedLocales)|
|`/projects/{id}/transcriptions`|GET|[Projects_ListTranscriptions](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_ListTranscriptions)|
|`/projects/{id}`|PATCH|[Projects_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Projects_Update)|


## Transcriptions

Transcriptions are applicable for [Batch Transcription](batch-transcription.md). Batch transcription is used to transcribe a large amount of audio in storage. You should send multiple files per request or point to an Azure Blob Storage container with the audio files to transcribe.

See [Create a transcription](batch-transcription-create.md?pivots=rest-api) for examples of how to create a transcription from multiple audio files. This table includes all the operations that you can perform on transcriptions.

|Path|Method|Operation ID|
|---|---|---|
|`/transcriptions`|POST|[Transcriptions_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create)|
|`/transcriptions/{id}`|DELETE|[Transcriptions_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Delete)|
|`/transcriptions/{id}`|GET|[Transcriptions_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Get)|
|`/transcriptions/{id}/files/{fileId}`|GET|[Transcriptions_GetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_GetFile)|
|`/transcriptions`|GET|[Transcriptions_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_List)|
|`/transcriptions/{id}/files`|GET|[Transcriptions_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListFiles)|
|`/transcriptions/locales`|GET|[Transcriptions_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListSupportedLocales)|
|`/transcriptions/{id}`|PATCH|[Transcriptions_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Update)|


## Web hooks

Web hooks are applicable for [Custom Speech](custom-speech-overview.md) and [Batch Transcription](batch-transcription.md). In particular, web hooks apply to [datasets](#datasets), [endpoints](#endpoints), [evaluations](#evaluations), [models](#models), and [transcriptions](#transcriptions). Web hooks can be used to receive notifications about creation, processing, completion, and deletion events.

This table includes all the web hook operations that are available with the speech-to-text REST API.

|Path|Method|Operation ID|
|---|---|---|
|`/webhooks`|POST|[WebHooks_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Create)|
|`/webhooks/{id}`|DELETE|[WebHooks_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Delete)|
|`/webhooks/{id}`|GET|[WebHooks_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Get)|
|`/webhooks`|GET|[WebHooks_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_List)|
|`/webhooks/{id}:ping`|POST|[WebHooks_Ping](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Ping)|
|`/webhooks/{id}:test`|POST|[WebHooks_Test](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Test)|
|`/webhooks/{id}`|PATCH|[WebHooks_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Update)|


## Next steps

- [Create a Custom Speech project](how-to-custom-speech-create-project.md)
- [Get familiar with batch transcription](batch-transcription.md)

