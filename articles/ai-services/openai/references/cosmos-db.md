---
title: Azure OpenAI on your Azure Cosmos DB data Python & REST API reference
titleSuffix: Azure OpenAI
description: Learn how to use Azure OpenAI on your Azure Cosmos DB data Python & REST API.
manager: nitinme
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 03/12/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom: devx-track-python
---

# Data source - Azure Cosmos DB for MongoDB vCore

The configurable options of Azure Cosmos DB for MongoDB vCore when using Azure OpenAI On Your Data. This data source is supported in API version `2024-02-01`.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
|`parameters`| [Parameters](#parameters)| True| The parameters to use when configuring Azure Cosmos DB for MongoDB vCore.|
| `type`| string| True | Must be `azure_cosmos_db`. |

## Parameters

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `database_name` | string | True | The MongoDB vCore database name to use with Azure Cosmos DB.|
| `container_name` | string | True | The name of the Azure Cosmos DB resource container.|
| `index_name` | string | True | The MongoDB vCore index name to use with Azure Cosmos DB.|
| `fields_mapping` | [FieldsMappingOptions](#fields-mapping-options) | True | Customized field mapping behavior to use when interacting with the search index.|
| `authentication`| [ConnectionStringAuthenticationOptions](#connection-string-authentication-options)| True | The authentication method to use when accessing the defined data source. |
| `embedding_dependency` | One of [DeploymentNameVectorizationSource](#deployment-name-vectorization-source), [EndpointVectorizationSource](#endpoint-vectorization-source) | True | The embedding dependency for vector search.|
| `in_scope` | boolean | False | Whether queries should be restricted to use of indexed data. Default is `True`.| 
| `role_information`| string | False | Give the model instructions about how it should behave and any context it should reference when generating a response. You can describe the assistant's personality and tell it how to format responses.|
| `strictness` | integer | False | The configured strictness of the search relevance filtering. The higher of strictness, the higher of the precision but lower recall of the answer. Default is `3`.| 
| `top_n_documents` | integer | False | The configured top number of documents to feature for the configured query. Default is `5`. |

## Connection string authentication options

The authentication options for Azure OpenAI On Your Data when using a connection string.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `connection_string`|string|True|The connection string to use for authentication.|
| `type`|string|True| Must be `connection_string`.|


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

## API key authentication options

The authentication options for Azure OpenAI On Your Data when using an API key.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `key`|string|True|The API key to use for authentication.|
| `type`|string|True| Must be `api_key`.|

## Fields mapping options

The settings to control how fields are processed.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `content_fields` | string[] | True | The names of index fields that should be treated as content. |
| `vector_fields` | string[] | True | The names of fields that represent vector data.|
| `content_fields_separator` | string | False | The separator pattern that content fields should use. Default is `\n`.|
| `filepath_field` | string | False | The name of the index field to use as a filepath. |
| `title_field` | string | False | The name of the index field to use as a title. |
| `url_field` | string | False | The name of the index field to use as a URL.|

## Examples

Prerequisites:
* Configure the role assignments from the user to the Azure OpenAI resource. Required role: `Cognitive Services OpenAI User`.
* Install [Az CLI](/cli/azure/install-azure-cli) and run `az login`.
* Define the following environment variables: `AzureOpenAIEndpoint`, `ChatCompletionsDeploymentName`,`ConnectionString`, `Database`, `Container`, `Index`, `EmbeddingDeploymentName`.
```bash
export AzureOpenAIEndpoint=https://example.openai.azure.com/
export ChatCompletionsDeploymentName=turbo
export ConnectionString='mongodb+srv://username:***@example.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000'
export Database=testdb
export Container=testcontainer
export Index=testindex
export EmbeddingDeploymentName=ada
```

# [Python 1.x](#tab/python)

Install the latest pip packages `openai`, `azure-identity`.

```python

import os
from openai import AzureOpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

endpoint = os.environ.get("AzureOpenAIEndpoint")
deployment = os.environ.get("ChatCompletionsDeploymentName")
connection_string = os.environ.get("ConnectionString")
database = os.environ.get("Database")
container = os.environ.get("Container")
index = os.environ.get("Index")
embedding_deployment_name = os.environ.get("EmbeddingDeploymentName")

token_provider = get_bearer_token_provider(
    DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default")

client = AzureOpenAI(
    azure_endpoint=endpoint,
    azure_ad_token_provider=token_provider,
    api_version="2024-02-01",
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
                "type": "azure_cosmos_db",
                "parameters": {
                    "authentication": {
                        "type": "connection_string",
                        "connection_string": connection_string
                    },
                    "database_name": database,
                    "container_name": container,
                    "index_name": index,
                    "fields_mapping": {
                        "content_fields": [
                            "content"
                        ],
                        "vector_fields": [
                            "contentvector"
                        ]
                    },
                    "embedding_dependency": {
                        "type": "deployment_name",
                        "deployment_name": embedding_deployment_name
                    }
                }
            }
        ],
    }
)

print(completion.model_dump_json(indent=2))


```

# [REST](#tab/rest)

```bash

az rest --method POST \
 --uri $AzureOpenAIEndpoint/openai/deployments/$ChatCompletionsDeploymentName/chat/completions?api-version=2024-02-01 \
 --resource https://cognitiveservices.azure.com/ \
 --body \
'
{
    "data_sources": [
      {
        "type": "azure_cosmos_db",
        "parameters": {
          "authentication": {
            "type": "connection_string",
            "connection_string": "'$ConnectionString'"
          },
          "database_name": "'$Database'",
          "container_name": "'$Container'",
          "index_name": "'$Index'",
          "fields_mapping": {
            "content_fields": [
              "content"
            ],
            "vector_fields": [
              "contentvector"
            ]
          },
          "embedding_dependency": {
            "type": "deployment_name",
            "deployment_name": "'$EmbeddingDeploymentName'"
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
