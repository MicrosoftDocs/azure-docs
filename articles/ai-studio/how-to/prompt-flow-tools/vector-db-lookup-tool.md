---
title: Vector DB Lookup tool for flows in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces the Vector DB Lookup tool for flows in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/15/2023
ms.reviewer: eur
ms.author: eur
---

# Vector DB Lookup tool for flows in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../../includes/preview-ai-studio.md)]

The prompt flow *Vector DB Lookup* tool is a vector search tool that allows users to search top-k similar vectors from vector database. This tool is a wrapper for multiple third-party vector databases. The list of current supported databases is as follows.

| Name | Description |
| --- | --- |
| Azure AI Search | Microsoft's cloud search service with built-in AI capabilities that enrich all types of information to help identify and explore relevant content at scale. |
| Qdrant | Qdrant is a vector similarity search engine that provides a production-ready service. Qdrant has a convenient API that can be used to store, search and manage points (that is, vectors) with an extra payload. |
| Weaviate | Weaviate is an open source vector database that stores both objects and vectors. Vector search can be combined with structured filtering. |

## Prerequisites

The tool searches data from a third-party vector database. To use it, you should create resources in advance and establish connection between the tool and the resource.

**Azure AI Search:**
- Create resource [Azure AI Search](../../../search/search-create-service-portal.md).
- Add an Azure AI Search connection. Fill "API key" field with "Primary admin key" from "Keys" section of created resource, and fill "API base" field with the URL, the URL format is `https://{your_serive_name}.search.windows.net`.

**Qdrant:**
- Follow the [installation](https://qdrant.tech/documentation/quick-start/) to deploy Qdrant to a self-maintained cloud server.
- Add "Qdrant" connection. Fill "API base" with your self-maintained cloud server address and fill "API key" field.

**Weaviate:**
- Follow the [installation](https://weaviate.io/developers/weaviate/installation) to deploy Weaviate to a self-maintained instance.
- Add "Weaviate" connection. Fill "API base" with your self-maintained instance address and fill "API key" field.


## Build with the Vector DB Lookup tool

1. Create or open a flow in Azure AI Studio. For more information, see [Create a flow](../flow-develop.md).
1. Select **+ More tools** > **Vector DB Lookup** to add the Vector DB Lookup tool to your flow.

    :::image type="content" source="../../media/prompt-flow/vector-db-lookup-tool.png" alt-text="Screenshot of the Vector DB Lookup tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/embedding-tool.png":::

1. Select the connection to one of your provisioned resources. For example, select **CognitiveSearchConnection**.
1. Enter values for the Vector DB Lookup tool input parameters described [here](#inputs-and-outputs).
1. Add more tools to your flow as needed, or select **Run** to run the flow.
1. The outputs are described [here](#inputs-and-outputs).


## Inputs and outputs

The tool accepts the following inputs:
- [Azure AI Search](#azure-ai-search)
- [Qdrant](#qdrant)
- [Weaviate](#weaviate)

The JSON output includes the top-k scored entities. The entity follows a generic schema of vector search result provided by promptflow-vectordb SDK. 

## Outputs

The following JSON format response is an example returned by the tool that includes the top-k scored entities. The entity follows a generic schema of vector search result provided by promptflow-vectordb SDK. 


### Azure AI Search

#### Azure AI Search inputs

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| connection | CognitiveSearchConnection | The created connection for access to the Azure AI Search endpoint. | Yes |
| index_name | string | The index name created in an Azure AI Search resource. | Yes |
| text_field | string | The text field name. The returned text field populates the text of output. | No |
| vector_field | string | The vector field name. The target vector is searched in this vector field. | Yes |
| search_params | dict | The search parameters. It's key-value pairs. Except for parameters in the tool input list mentioned previously, more search parameters can be formed into a JSON object as search_params. For example, use `{"select": ""}` as search_params to select the returned fields, use `{"search": ""}` to perform a [hybrid search](../../../search/search-get-started-vector.md#hybrid-search). | No |
| search_filters | dict | The search filters. It's key-value pairs, the input format is like `{"filter": ""}` | No |
| vector | list | The target vector to be queried. The Vector DB Lookup tool can generate this vector. | Yes |
| top_k | int | The count of top-scored entities to return. Default value is 3 | No |

#### Azure AI Search outputs

For Azure AI Search, the following fields are populated:

| Field Name | Type | Description |
| ---- | ---- | ----------- |
| original_entity | dict | the original response json from search REST API|
| score | float |  @search.score from the original entity, which evaluates the similarity between the entity and the query vector |
| text | string | text of the entity|
| vector | list | vector of the entity|

  
```json
[
  {
    "metadata": null,
    "original_entity": {
      "@search.score": 0.5099789,
      "id": "",
      "your_text_filed_name": "sample text1",
      "your_vector_filed_name": [-0.40517663431890405, 0.5856996257406859, -0.1593078462266455, -0.9776269170785785, -0.6145604369828972],
      "your_additional_field_name": ""
    },
    "score": 0.5099789,
    "text": "sample text1",
    "vector": [-0.40517663431890405, 0.5856996257406859, -0.1593078462266455, -0.9776269170785785, -0.6145604369828972]
  }
]
```

### Qdrant

#### Qdrant inputs

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| connection | QdrantConnection | The created connection for accessing to Qdrant server. | Yes |
| collection_name | string | The collection name created in self-maintained cloud server. | Yes |
| text_field | string | The text field name. The returned text field populates the text of output. | No |
| search_params | dict | The search parameters can be formed into a JSON object as search_params. For example, use `{"params": {"hnsw_ef": 0, "exact": false, "quantization": null}}` to set search_params. | No |
| search_filters | dict | The search filters. It's key-value pairs, the input format is like `{"filter": {"should": [{"key": "", "match": {"value": ""}}]}}` | No |
| vector | list | The target vector to be queried. The Vector DB Lookup tool can generate this vector. | Yes |
| top_k | int | The count of top-scored entities to return. Default value is 3 | No |


#### Qdrant outputs

For Qdrant, the following fields are populated:

| Field Name | Type | Description |
| ---- | ---- | ----------- |
| original_entity | dict | the original response json from search REST API|
| metadata | dict | payload from the original entity|
| score | float | score from the original entity, which evaluates the similarity between the entity and the query vector|
| text | string | text of the payload|
| vector | list | vector of the entity|
  
```json
[
  {
    "metadata": {
      "text": "sample text1"
    },
    "original_entity": {
      "id": 1,
      "payload": {
        "text": "sample text1"
      },
      "score": 1,
      "vector": [0.18257418, 0.36514837, 0.5477226, 0.73029673],
      "version": 0
    },
    "score": 1,
    "text": "sample text1",
    "vector": [0.18257418, 0.36514837, 0.5477226, 0.73029673]
  }
]
```


### Weaviate

#### Weaviate inputs

  | Name | Type | Description | Required |
  | ---- | ---- | ----------- | -------- |
  | connection | WeaviateConnection | The created connection for accessing to Weaviate. | Yes |
  | class_name | string | The class name. | Yes |
  | text_field | string | The text field name. The returned text field populates the text of output. | No |
  | vector | list | The target vector to be queried. The Vector DB Lookup tool can generate this vector. | Yes |
  | top_k | int | The count of top-scored entities to return. Default value is 3 | No |

#### Weaviate outputs

For Weaviate, the following fields are populated:

| Field Name | Type | Description |
| ---- | ---- | ----------- |
| original_entity | dict | the original response json from search REST API|
| score | float | certainty from the original entity, which evaluates the similarity between the entity and the query vector|
| text | string | text in the original entity|
| vector | list | vector of the entity|
  
```json
[
  {
    "metadata": null,
    "original_entity": {
      "_additional": {
        "certainty": 1,
        "distance": 0,
        "vector": [
          0.58,
          0.59,
          0.6,
          0.61,
          0.62
        ]
      },
      "text": "sample text1."
    },
    "score": 1,
    "text": "sample text1.",
    "vector": [
      0.58,
      0.59,
      0.6,
      0.61,
      0.62
    ]
  }
]
```


## Next steps

- [Learn more about how to create a flow](../flow-develop.md)



