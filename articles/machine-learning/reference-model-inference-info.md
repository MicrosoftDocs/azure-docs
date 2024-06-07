---
title: Azure AI Model Inference Get Info
titleSuffix: Azure Machine Learning
description: Reference for Azure AI Model Inference Get Info API
manager: scottpolly
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: conceptual
ms.date: 05/03/2024
ms.reviewer: msakande 
reviewer: msakande
ms.author: fasantia
author: santiagxf
ms.custom: 
 - build-2024
---

# Reference: Info | Azure Machine Learning

Returns the information about the model deployed under the endpoint.

```http
GET /info?api-version=2024-04-01-preview
```

## URI Parameters


| Name | In  | Required | Type | Description |
| --- | --- | --- | --- | --- |
| api-version | query | True | string | The version of the API in the format "YYYY-MM-DD" or "YYYY-MM-DD-preview". |


## Request Header


| Name | Required | Type | Description |
| --- | --- | --- | --- |
| azureml-model-deployment |     | string | Name of the deployment you want to route the request to. Supported for endpoints that support multiple deployments. |


## Responses


| Name | Type | Description |
| --- | --- | --- |
| 200 OK | [ModelInfo](#modelinfo) | OK  |


## Security


### Authorization

The token with the `Bearer:` prefix, e.g. `Bearer abcde12345`

**Type**: apiKey  
**In**: header  


### AADToken

Azure Active Directory OAuth2 authentication

**Type**: oauth2  
**Flow**: application  
**Token UR**L: https://login.microsoftonline.com/common/oauth2/v2.0/token  


## Examples

### Get model information from a chat completion model

#### Sample Request

```http
GET /info?api-version=2024-04-01-preview
```

#### Sample Response

Status code: 200

```json
{
  "model_name": "phi3-mini",
  "model_type": "chat_completion",
  "model_provider_name": "Microsoft"
}
```

## Definitions

| Name | Description |
| --- | --- |
| [ModelInfo](#modelinfo) | The information about the deployed model.   |
| [ModelType](#modeltype) | The infernce task associated with the mode. |


### ModelInfo

The information about the deployed model.

| Name | Type | Description |
| --- | --- | --- |
| model\_name | string | The name of the model. |
| model\_provider\_name | string | The provider of the model. |
| model\_type | [ModelType](#modeltype) | The infernce task associated with the mode. |

### ModelType

The infernce task associated with the mode.


| Name | Type | Description |
| --- | --- | --- |
| audio\_generation | string | A text-to-audio generative model.  |
| chat_completion | string | A model capable of taking chat-formatted messages and generate responses.    |
| embeddings | string | A model capable of generating embeddings from a text.    |
| image\_embeddings | string | A model capable of generating embeddings from an image and text description.  |
| image\_generation | string | A model capable of generating images from an image and text description.  |
| text\_generation | string | A text generation model.    |
