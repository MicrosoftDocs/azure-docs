---
title: Speech to text REST API - Speech service
titleSuffix: Azure AI services
description: Get reference documentation for Speech to text REST API.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: reference
ms.date: 11/29/2022
ms.author: eur
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Speech to text REST API

Speech to text REST API is used for [Batch transcription](batch-transcription.md) and [Custom Speech](custom-speech-overview.md). 

> [!IMPORTANT]
> Speech to text REST API v3.1 is generally available. Version 3.0 of the [Speech to text REST API](rest-speech-to-text.md) will be retired. For more information, see the [Migrate code from v3.0 to v3.1 of the REST API](migrate-v3-0-to-v3-1.md) guide.

> [!div class="nextstepaction"]
> [See the Speech to text REST API v3.1 reference documentation](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/)

> [!div class="nextstepaction"]
> [See the Speech to text REST API v3.0 reference documentation](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/)

Use Speech to text REST API to:

- [Custom Speech](custom-speech-overview.md): With Custom Speech, you can upload your own data, test and train a custom model, compare accuracy between models, and deploy a model to a custom endpoint. Copy models to other subscriptions if you want colleagues to have access to a model that you built, or if you want to deploy a model to more than one region.
- [Batch transcription](batch-transcription.md): Transcribe audio files as a batch from multiple URLs or an Azure container. 

Speech to text REST API includes such features as:

- Get logs for each endpoint if logs have been requested for that endpoint.
- Request the manifest of the models that you create, to set up on-premises containers.
- Upload data from Azure storage accounts by using a shared access signature (SAS) URI.
- Bring your own storage. Use your own storage accounts for logs, transcription files, and other data.
- Some operations support webhook notifications. You can register your webhooks where notifications are sent.

## Datasets

Datasets are applicable for [Custom Speech](custom-speech-overview.md). You can use datasets to train and test the performance of different models. For example, you can compare the performance of a model trained with a specific dataset to the performance of a model trained with a different dataset.

See [Upload training and testing datasets](how-to-custom-speech-upload-data.md?pivots=rest-api) for examples of how to upload datasets. This table includes all the operations that you can perform on datasets.

|Path|Method|Version 3.1|Version 3.0|
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

## Endpoints

Endpoints are applicable for [Custom Speech](custom-speech-overview.md). You must deploy a custom endpoint to use a Custom Speech model.  

See [Deploy a model](how-to-custom-speech-deploy-model.md?pivots=rest-api) for examples of how to manage deployment endpoints. This table includes all the operations that you can perform on endpoints.

|Path|Method|Version 3.1|Version 3.0|
|---------|---------|---------|---------|
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

## Evaluations

Evaluations are applicable for [Custom Speech](custom-speech-overview.md). You can use evaluations to compare the performance of different models. For example, you can compare the performance of a model trained with a specific dataset to the performance of a model trained with a different dataset.

See [Test recognition quality](how-to-custom-speech-inspect-data.md?pivots=rest-api) and [Test accuracy](how-to-custom-speech-evaluate-data.md?pivots=rest-api) for examples of how to test and evaluate Custom Speech models. This table includes all the operations that you can perform on evaluations.

|Path|Method|Version 3.1|Version 3.0|
|---------|---------|---------|---------|
|`/evaluations`|GET|[Evaluations_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_List)|[GetEvaluations](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEvaluations)|
|`/evaluations`|POST|[Evaluations_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Create)|[CreateEvaluation](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateEvaluation)|
|`/evaluations/{id}`|DELETE|[Evaluations_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Delete)|[DeleteEvaluation](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteEvaluation)|
|`/evaluations/{id}`|GET|[Evaluations_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Get)|[GetEvaluation](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEvaluation)|
|`/evaluations/{id}`|PATCH|[Evaluations_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_Update)|[UpdateEvaluation](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateEvaluation)|
|`/evaluations/{id}/files`|GET|[Evaluations_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_ListFiles)|[GetEvaluationFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEvaluationFiles)|
|`/evaluations/{id}/files/{fileId}`|GET|[Evaluations_GetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_GetFile)|[GetEvaluationFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetEvaluationFile)|
|`/evaluations/locales`|GET|[Evaluations_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Evaluations_ListSupportedLocales)|[GetSupportedLocalesForEvaluations](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetSupportedLocalesForEvaluations)|

## Health status

Health status provides insights about the overall health of the service and sub-components.

|Path|Method|Version 3.1|Version 3.0|
|---------|---------|---------|---------|
|`/healthstatus`|GET|[HealthStatus_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/HealthStatus_Get)|[GetHealthStatus](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetHealthStatus)|

## Models

Models are applicable for [Custom Speech](custom-speech-overview.md) and [Batch Transcription](batch-transcription.md). You can use models to transcribe audio files. For example, you can use a model trained with a specific dataset to transcribe audio files. 

See [Train a model](how-to-custom-speech-train-model.md?pivots=rest-api) and [Custom Speech model lifecycle](how-to-custom-speech-model-and-endpoint-lifecycle.md?pivots=rest-api) for examples of how to train and manage Custom Speech models. This table includes all the operations that you can perform on models.

|Path|Method|Version 3.1|Version 3.0|
|---------|---------|---------|---------|
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

## Projects

Projects are applicable for [Custom Speech](custom-speech-overview.md). Custom Speech projects contain models, training and testing datasets, and deployment endpoints. Each project is specific to a [locale](language-support.md?tabs=stt). For example, you might create a project for English in the United States.

See [Create a project](how-to-custom-speech-create-project.md?pivots=rest-api) for examples of how to create projects. This table includes all the operations that you can perform on projects.

|Path|Method|Version 3.1|Version 3.0|
|---------|---------|---------|---------|
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


## Transcriptions

Transcriptions are applicable for [Batch Transcription](batch-transcription.md). Batch transcription is used to transcribe a large amount of audio in storage. You should send multiple files per request or point to an Azure Blob Storage container with the audio files to transcribe.

See [Create a transcription](batch-transcription-create.md?pivots=rest-api) for examples of how to create a transcription from multiple audio files. This table includes all the operations that you can perform on transcriptions.

|Path|Method|Version 3.1|Version 3.0|
|---------|---------|---------|---------|
|`/transcriptions`|GET|[Transcriptions_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_List)|[GetTranscriptions](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscriptions)|
|`/transcriptions`|POST|[Transcriptions_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Create)|[CreateTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateTranscription)|
|`/transcriptions/{id}`|DELETE|[Transcriptions_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Delete)|[DeleteTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteTranscription)|
|`/transcriptions/{id}`|GET|[Transcriptions_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Get)|[GetTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscription)|
|`/transcriptions/{id}`|PATCH|[Transcriptions_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_Update)|[UpdateTranscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateTranscription)|
|`/transcriptions/{id}/files`|GET|[Transcriptions_ListFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListFiles)|[GetTranscriptionFiles](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscriptionFiles)|
|`/transcriptions/{id}/files/{fileId}`|GET|[Transcriptions_GetFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_GetFile)|[GetTranscriptionFile](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetTranscriptionFile)|
|`/transcriptions/locales`|GET|[Transcriptions_ListSupportedLocales](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/Transcriptions_ListSupportedLocales)|[GetSupportedLocalesForTranscriptions](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetSupportedLocalesForTranscriptions)|


## Web hooks

Web hooks are applicable for [Custom Speech](custom-speech-overview.md) and [Batch Transcription](batch-transcription.md). In particular, web hooks apply to [datasets](#datasets), [endpoints](#endpoints), [evaluations](#evaluations), [models](#models), and [transcriptions](#transcriptions). Web hooks can be used to receive notifications about creation, processing, completion, and deletion events.

This table includes all the web hook operations that are available with the Speech to text REST API.

|Path|Method|Version 3.1|Version 3.0|
|---------|---------|---------|---------|
|`/webhooks`|GET|[WebHooks_List](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_List)|[GetHooks](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetHooks)|
|`/webhooks`|POST|[WebHooks_Create](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Create)|[CreateHook](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CreateHook)|
|`/webhooks/{id}:ping`<sup>1</sup>|POST|[WebHooks_Ping](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Ping)|[PingHook](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/PingHook)|
|`/webhooks/{id}:test`<sup>2</sup>|POST|[WebHooks_Test](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Test)|[TestHook](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/TestHook)|
|`/webhooks/{id}`|DELETE|[WebHooks_Delete](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Delete)|[DeleteHook](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/DeleteHook)|
|`/webhooks/{id}`|GET|[WebHooks_Get](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Get)|[GetHook](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetHook)|
|`/webhooks/{id}`|PATCH|[WebHooks_Update](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-1/operations/WebHooks_Update)|[UpdateHook](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/UpdateHook)|

<sup>1</sup> The `/webhooks/{id}/ping` operation (includes '/') in version 3.0 is replaced by the `/webhooks/{id}:ping` operation (includes ':') in version 3.1.

<sup>2</sup> The `/webhooks/{id}/test` operation (includes '/') in version 3.0 is replaced by the `/webhooks/{id}:test` operation (includes ':') in version 3.1.

## Next steps

- [Create a Custom Speech project](how-to-custom-speech-create-project.md)
- [Get familiar with batch transcription](batch-transcription.md)

