---
title: Azure OpenAI on your Azure Cosmos DB data Python & REST API reference
titleSuffix: Azure OpenAI
description: Learn how to use Azure OpenAI on your data Python & REST API.
manager: nitinme
ms.service: azure-ai-openai
ms.topic: conceptual
ms.date: 02/14/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom:
---

# Azure Cosmos DB for MongoDB vCore Data Source

A specific representation of configurable options for Azure Cosmos DB for MongoDB vCore when using Azure OpenAI on your data.

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
| `endpoint` | string | True | The absolute endpoint path for the Azure Search resource to use.|
| `fields_mapping` | [FieldMappingOptions](#field-mapping-options) | True | Customized field mapping behavior to use when interacting with the search index.|
| `authentication`| [ConnectionStringAuthenticationOptions](#connection-string-authentication-options)| True | The authentication method to use when accessing the defined data source. |
| `embedding_dependency` | One of [DeploymentNameVectorizationSource](#deployment-name-vectorization-source), [EndpointVectorizationSource](#endpoint-vectorization-source) | True | The embedding dependency for vector search.|
| `in_scope` | boolean | False | Whether queries should be restricted to use of indexed data. Default is `True`.| 
| `role_information`| string | False | Give the model instructions about how it should behave and any context it should reference when generating a response. You can describe the assistant's personality and tell it how to format responses. There's a 100 token limit for it, and it counts against the overall token limit.|
| `strictness` | integer | False | The configured strictness of the search relevance filtering. The higher of strictness, the higher of the precision but lower recall of the answer. Default is `3`.| 
| `top_n_documents` | integer | False | The configured top number of documents to feature for the configured query. Default is `5`. |

## Connection String Authentication Options

The authentication options for Azure OpenAI On Your Data when using a connection string.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `connection_string`|string|True|The connection string to use for authentication.|
| `type`|string|True| Must be `connection_string`.|


## Deployment Name Vectorization Source

The details of a a vectorization source, used by Azure OpenAI On Your Data when applying vector search, that is based on an internal embeddings model deployment name in the same Azure OpenAI resource.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `deployment_name`|string|True|The embedding model deployment name within the same Azure OpenAI resource. This enables you to use vector search without Azure OpenAI api-key and without Azure OpenAI public network access.|
| `type`|string|True| Must be `deployment_name`.|

## Endpoint Vectorization Source

The details of a a vectorization source, used by Azure OpenAI On Your Data when applying vector search, that is based on a public Azure OpenAI endpoint call for embeddings.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `endpoint`|string|True|Specifies the resource endpoint URL from which embeddings should be retrieved. It should be in the format of https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/embeddings. The api-version query parameter is not allowed.|
| `authentication`| [ApiKeyAuthenticationOptions](#api-key-authentication-options)|True | Specifies the authentication options to use when retrieving embeddings from the specified endpoint.|
| `type`|string|True| Must be `endpoint`.|

## Field Mapping Options

Optional settings to control how fields are processed when using a configured Azure Search resource.

|Name | Type | Required | Description |
|--- | --- | --- | --- |
| `content_fields` | string[] | True | The names of index fields that should be treated as content. |
| `vector_fields` | string[] | True | The names of fields that represent vector data.|
| `content_fields_separator` | string | False | The separator pattern that content fields should use. Default is `\n`.|
| `filepath_field` | string | False | The name of the index field to use as a filepath. |
| `title_field` | string | False | The name of the index field to use as a title. |
| `url_field` | string | False | The name of the index field to use as a URL.|

## Examples

Before run this example, make sure to:
* Define the following environment variables: `AOAIEndpoint`, `ChatCompletionsDeploymentName`,`ConnectionString`, `Database`, `Container`, `Index`, `EmbeddingDeploymentName`.

# [Python](#tab/python)

```python

import os
from openai import AzureOpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

endpoint = os.environ.get("AOAIEndpoint")
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
 --uri $AOAIEndpoint/openai/deployments/$ChatCompletionsDeploymentName/chat/completions?api-version=2024-02-15-preview \
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
