---
title: Vector DB Lookup tool in Azure Machine Learning prompt flow
titleSuffix: Azure Machine Learning
description: Vector DB Lookup is a vector search tool that you can use to search the top-scored similar vectors from a vector database.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom:
  - ignite-2023
ms.topic: reference
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 11/02/2023
---

# Vector DB Lookup tool

Vector DB Lookup is a vector search tool that you can use to search for the top-scored similar vectors from a vector database. This tool is a wrapper for multiple third-party vector databases. Current supported databases are listed in the following table.

| Name | Description |
| --- | --- |
| Azure AI Search (formerly Cognitive Search) | Microsoft's cloud search service with built-in AI capabilities that enrich all types of information to help identify and explore relevant content at scale. |
| Qdrant | Qdrant is a vector-similarity search engine. It provides a production-ready service with a convenient API to store, search, and manage points (that is, vectors) with an extra payload. |
| Weaviate | Weaviate is an open-source vector database that stores objects and vectors. You can combine vector search with structured filtering. |

This tool will support more vector databases.

## Prerequisites

The tool searches data from a third-party vector database. To use it, create resources in advance and establish a connection between the tool and the resource.

  - **Azure AI Search**:
    - Create the resource [Azure AI Search](../../../search/search-create-service-portal.md).
    - Add a `Cognitive search` connection. Fill the `API key` field with `Primary admin key` from the `Keys` section of the created resource. Fill the `API base` field with the URL. The URL format is `https://{your_serive_name}.search.windows.net`.

  - **Qdrant**:
    - Follow the [installation](https://qdrant.tech/documentation/quick-start/) to deploy Qdrant to a self-maintained cloud server.
    - Add a `Qdrant` connection. Fill the `API base` field with your self-maintained cloud server address and fill the `API key` field.

  - **Weaviate**:
    - Follow the [installation](https://weaviate.io/developers/weaviate/installation) to deploy Weaviate to a self-maintained instance.
    - Add a `Weaviate` connection. Fill the `API base` field with your self-maintained instance address and fill the `API key` field.

> [!NOTE]
> When legacy tools switch to the code-first mode and you encounter the error `embeddingstore.tool.vector_db_lookup.search' is not found`, see [Troubleshoot guidance](./troubleshoot-guidance.md).

## Inputs

The tool accepts the following inputs:

- **Azure AI Search**

  | Name | Type | Description | Required |
  | ---- | ---- | ----------- | -------- |
  | connection | CognitiveSearchConnection | The created connection for accessing to Azure AI Search endpoint. | Yes |
  | index_name | string | The index name created in Azure AI Search resource. | Yes |
  | text_field | string | The text field name. The returned text field populates the text of output. | No |
  | vector_field | string | The vector field name. The target vector is searched in this vector field. | Yes |
  | search_params | dict | The search parameters. It's key-value pairs. Except for parameters in the tool input list previously mentioned, more search parameters can be formed into a JSON object as search_params. For example, use `{"select": ""}` as search_params to select the returned fields, use `{"search": ""}` to perform a [hybrid search](../../../search/search-get-started-vector.md#hybrid-search). | No |
  | search_filters | dict | The search filters. It's key-value pairs. The input format is like `{"filter": ""}`. | No |
  | vector | list | The target vector to be queried, which the Embedding tool can generate. | Yes |
  | top_k | int | The count of top-scored entities to return. Default value is 3. | No |

- **Qdrant**

  | Name | Type | Description | Required |
  | ---- | ---- | ----------- | -------- |
  | connection | QdrantConnection | The created connection for accessing to Qdrant server. | Yes |
  | collection_name | string | The collection name created in a self-maintained cloud server. | Yes |
  | text_field | string | The text field name. The returned text field populates the text of output. | No |
  | search_params | dict | The search parameters can be formed into a JSON object as search_params. For example, use `{"params": {"hnsw_ef": 0, "exact": false, "quantization": null}}` to set search_params. | No |
  | search_filters | dict | The search filters. It's key-value pairs. The input format is like `{"filter": {"should": [{"key": "", "match": {"value": ""}}]}}`. | No |
  | vector | list | The target vector to be queried, which the Embedding tool can generate. | Yes |
  | top_k | int | The count of top-scored entities to return. Default value is 3. | No |

- **Weaviate**

  | Name | Type | Description | Required |
  | ---- | ---- | ----------- | -------- |
  | connection | WeaviateConnection | The created connection for accessing to Weaviate. | Yes |
  | class_name | string | The class name. | Yes |
  | text_field | string | The text field name. The returned text field populates the text of output. | No |
  | vector | list | The target vector to be queried, which the Embedding tool can generate. | Yes |
  | top_k | int | The count of top-scored entities to return. Default value is 3. | No |

## Outputs

The following sample is an example JSON format response returned by the tool, which includes the top-scored entities. The entity follows a generic schema of vector search result provided by the promptflow-vectordb SDK.

- **Azure AI Search**

  For Azure AI Search, the following fields are populated:

  | Field name | Type | Description |
  | ---- | ---- | ----------- |
  | original_entity | dict | Original response JSON from search REST API|
  | score | float | @search.score from the original entity, which evaluates the similarity between the entity and the query vector |
  | text | string | Text of the entity|
  | vector | list | Vector of the entity|

  <details>
    <summary>Output</summary>
    
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
  </details>

- **Qdrant**

  For Qdrant, the following fields are populated:

  | Field name | Type | Description |
  | ---- | ---- | ----------- |
  | original_entity | dict | Original response JSON from the search REST API|
  | metadata | dict | Payload from the original entity|
  | score | float | Score from the original entity, which evaluates the similarity between the entity and the query vector|
  | text | string | Text of the payload|
  | vector | list | Vector of the entity|

  <details>
    <summary>Output</summary>
    
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
  </details>

- **Weaviate**

  For Weaviate, the following fields are populated:
  
  | Field name | Type | Description |
  | ---- | ---- | ----------- |
  | original_entity | dict | Original response JSON from the search REST API|
  | score | float | Certainty from the original entity, which evaluates the similarity between the entity and the query vector|
  | text | string | Text in the original entity|
  | vector | list | Vector of the entity|

  <details>
    <summary>Output</summary>
    
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
  </details>
