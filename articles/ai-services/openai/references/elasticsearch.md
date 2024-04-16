---
title: Azure OpenAI on your Elasticsearch data Python & REST API reference
titleSuffix: Azure OpenAI
description: Learn how to use Azure OpenAI on your Elasticsearch data Python & REST API.
manager: nitinme
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 03/14/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom: devx-track-python
---

# Data source - Elasticsearch (preview)

The configurable options for Elasticsearch when using Azure OpenAI On Your Data. This data source is supported in API version `2024-02-15-preview`.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
|`parameters`| [Parameters](#parameters)| True| The parameters to use when configuring Elasticsearch.|
| `type`| string| True | Must be `elasticsearch`. |

## Parameters

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `endpoint` | string | True | The absolute endpoint path for the Elasticsearch resource to use.|
| `index_name` | string | True | The name of the index to use in the referenced Elasticsearch.|
| `authentication`| One of [KeyAndKeyIdAuthenticationOptions](#key-and-key-id-authentication-options), [EncodedApiKeyAuthenticationOptions](#encoded-api-key-authentication-options)| True | The authentication method to use when accessing the defined data source. |
| `embedding_dependency` | One of [DeploymentNameVectorizationSource](#deployment-name-vectorization-source), [EndpointVectorizationSource](#endpoint-vectorization-source), [ModelIdVectorizationSource](#model-id-vectorization-source) | False | The embedding dependency for vector search. Required when `query_type` is `vector`.|
| `fields_mapping` | [FieldsMappingOptions](#fields-mapping-options) | False | Customized field mapping behavior to use when interacting with the search index.|
| `in_scope` | boolean | False | Whether queries should be restricted to use of indexed data. Default is `True`.| 
| `query_type` | [QueryType](#query-type) | False | The query type to use with Elasticsearch. Default is `simple` |
| `role_information`| string | False | Give the model instructions about how it should behave and any context it should reference when generating a response. You can describe the assistant's personality and tell it how to format responses.|
| `strictness` | integer | False | The configured strictness of the search relevance filtering. The higher of strictness, the higher of the precision but lower recall of the answer. Default is `3`.| 
| `top_n_documents` | integer | False | The configured top number of documents to feature for the configured query. Default is `5`. |

## Key and key ID authentication options

The authentication options for Azure OpenAI On Your Data when using an API key.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `key`|string|True|The Elasticsearch key to use for authentication.|
| `key_id`|string|True|The Elasticsearch key ID to use for authentication.|
| `type`|string|True| Must be `key_and_key_id`.|

## Encoded API key authentication options

The authentication options for Azure OpenAI On Your Data when using an Elasticsearch encoded API key.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `encoded_api_key`|string|True|The Elasticsearch encoded API key to use for authentication.|
| `type`|string|True| Must be `encoded_api_key`.|

## Deployment name vectorization source

The details of the vectorization source, used by Azure OpenAI On Your Data when applying vector search. This vectorization source is based on an internal embeddings model deployment name in the same Azure OpenAI resource. This vectorization source enables you to use vector search without Azure OpenAI api-key and without Azure OpenAI public network access.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `deployment_name`|string|True|The embedding model deployment name within the same Azure OpenAI resource. |
| `type`|string|True| Must be `deployment_name`.|

## Endpoint vectorization source

The details of the vectorization source, used by Azure OpenAI On Your Data when applying vector search. This vectorization source is based on the Azure OpenAI embedding API endpoint.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `endpoint`|string|True|Specifies the resource endpoint URL from which embeddings should be retrieved. It should be in the format of `https://{YOUR_RESOURCE_NAME}.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/embeddings`. The api-version query parameter isn't allowed.|
| `authentication`| [ApiKeyAuthenticationOptions](#api-key-authentication-options)|True | Specifies the authentication options to use when retrieving embeddings from the specified endpoint.|
| `type`|string|True| Must be `endpoint`.|

## Model ID vectorization source

The details of the vectorization source, used by Azure OpenAI On Your Data when applying vector search. This vectorization source is based on Elasticsearch model ID.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `model_id`|string|True| Specifies the model ID to use for vectorization. This model ID must be defined in Elasticsearch.|
| `type`|string|True| Must be `model_id`.|

## API key authentication options

The authentication options for Azure OpenAI On Your Data when using an API key.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `key`|string|True|The API key to use for authentication.|
| `type`|string|True| Must be `api_key`.|

## Fields mapping options

Optional settings to control how fields are processed when using a configured Elasticsearch resource.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `content_fields` | string[] | False | The names of index fields that should be treated as content. |
| `vector_fields` | string[] | False | The names of fields that represent vector data.|
| `content_fields_separator` | string | False | The separator pattern that content fields should use. Default is `\n`.|
| `filepath_field` | string | False | The name of the index field to use as a filepath. |
| `title_field` | string | False | The name of the index field to use as a title. |
| `url_field` | string | False | The name of the index field to use as a URL.|

## Query type

The type of Elasticsearch retrieval query that should be executed when using it with Azure OpenAI On Your Data.

|Enum Value | Description |
|---|---|
|`simple`	|Represents the default, simple query parser.|
|`vector`	|Represents vector search over computed data.|

## Examples

Prerequisites:
* Configure the role assignments from the user to the Azure OpenAI resource. Required role: `Cognitive Services OpenAI User`.
* Install [Az CLI](/cli/azure/install-azure-cli) and run `az login`.
* Define the following environment variables: `AzureOpenAIEndpoint`, `ChatCompletionsDeploymentName`, `SearchEndpoint`, `IndexName`, `Key`, `KeyId`.
```bash
export AzureOpenAIEndpoint=https://example.openai.azure.com/
export ChatCompletionsDeploymentName=turbo
export SearchEndpoint='https://example.eastus.azurecontainer.io'
export IndexName=testindex
export Key='***'
export KeyId='***'
```
# [Python 1.x](#tab/python)

Install the latest pip packages `openai`, `azure-identity`.

```python
import os
from openai import AzureOpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

endpoint = os.environ.get("AzureOpenAIEndpoint")
deployment = os.environ.get("ChatCompletionsDeploymentName")
index_name = os.environ.get("IndexName")
search_endpoint = os.environ.get("SearchEndpoint")
key = os.environ.get("Key")
key_id = os.environ.get("KeyId")

token_provider = get_bearer_token_provider(
    DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default")

client = AzureOpenAI(
    azure_endpoint=endpoint,
    azure_ad_token_provider=token_provider,
    api_version="2024-02-15-preview",
)

completion = client.chat.completions.create(
    model=deployment,
    messages=[
        {
            "role": "user",
            "content": "Who is DRI?",
        },
    ],
    extra_body={
        "data_sources": [
            {
                "type": "elasticsearch",
                "parameters": {
                    "endpoint": search_endpoint,
                    "index_name": index_name,
                    "authentication": {
                        "type": "key_and_key_id",
                        "key": key,
                        "key_id": key_id
                    }
                }
            }
        ]
    }
)

print(completion.model_dump_json(indent=2))

```

# [REST](#tab/rest)

```bash

az rest --method POST \
 --uri $AzureOpenAIEndpoint/openai/deployments/$ChatCompletionsDeploymentName/chat/completions?api-version=2024-02-15-preview \
 --resource https://cognitiveservices.azure.com/ \
 --body \
'
{
    "data_sources": [
      {
        "type": "elasticsearch",
        "parameters": {
          "endpoint": "'$SearchEndpoint'",
          "index_name": "'$IndexName'",
          "authentication": {
            "type": "key_and_key_id",
            "key": "'$Key'",
            "key_id": "'$KeyId'"
          }
        }
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "Who is DRI?"
      }
    ]
}
'
```

---
