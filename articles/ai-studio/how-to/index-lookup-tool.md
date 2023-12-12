---
title: Index lookup tool for flows in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces the Index Lookup Vector tool for flows in Azure AI Studio.
author: e-straight
manager: nitinme
ms.service: azure-ai-services
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/30/2023
ms.author: eur
---

# Index Lookup tool for Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../../includes/preview-ai-studio.md)]

The prompt flow *Index Lookup* tool is designed to allow the usage of common vector indices (including Azure Cognitive Search, FAISS, Pinecone). This allows for RAG flows to be implemented in prompt flow using a variety of indices. The tool automatically detects the indicies in the workspace and allows the selection of the index to be used in the flow.

## Build with the Index Lookup tool 

1. Create or open a flow in Azure AI Studio. For more information, see [Create a flow](../flow-develop.md).
1. Select **+ More tools** > **Index Lookup** to add the Index Lookup tool to your flow.

    :::image type="content" source="../../media/prompt-flow/index-lookup-tool.png" alt-text="Screenshot of the Index Lookup tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/common-index-lookup-tool.png":::

1. Enter values for the Index Lookup tool input parameters described [here](#inputs). The [LLM tool](llm-tool.md) can generate the vector input.
1. Add more tools to your flow as needed, or select **Run** to run the flow.
1. The outputs are described [here](#outputs).


## Inputs

The following are available input parameters:

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| mlindex_content | string | Type of Index to be used. Input depends on Index type. Example of an Azure Cog Search Index JSON can be seen below the table* | Yes |
| queries | string, Union[string, List[String]] | The text to be queried.| Yes |
|query_type | string | The type of query to be performed. Options include Keyword, Semantic, Hybrid, etc.  | Yes |
| top_k | integer | The count of top-scored entities to return. Default value is 3. | No |

\**ACS JSON Example:*
```json
embeddings:
  api_base: <api_base>
  api_type: azure
  api_version: 2023-07-01-preview
  batch_size: '1'
  connection:
    id: /subscriptions/<subscription>/resourceGroups/<resource_group>/providers/Microsoft.MachineLearningServices/workspaces/<workspace> /connections/<AOAI_connection>
  connection_type: workspace_connection
  deployment: <embedding_deployment>
  dimension: <embedding_model_dimension>
  kind: open_ai
  model: <embedding_model>
  schema_version: <version>
index:
  api_version: 2023-07-01-Preview
  connection:
    id: /subscriptions/<subscription>/resourceGroups/<resource_group>/providers/Microsoft.MachineLearningServices/workspaces/<workspace> /connections/<cogsearch_connection>
  connection_type: workspace_connection
  endpoint: <cogsearch_endpoint>
  engine: azure-sdk
  field_mapping:
    content: id
    embedding: content_vector_open_ai
    metadata: id
  index: <index_name>
  kind: acs
  semantic_configuration_name: azureml-default



```

## Outputs

The following JSON format response is an example returned by the tool that includes the top-k scored entities. The entity follows a generic schema of vector search result provided by promptflow-vectordb SDK. For the Vector Index Search, the following fields are populated:

| Field Name | Type | Description |
| ---- | ---- | ----------- |
| metadata | dict | Customized key-value pairs provided by user when creating the index |
| page_content | string | Content of the vector chunk being used in the lookup |
| score | float | Depends on index type defined in Vector Index. If index type is Faiss, score is L2 distance. If index type is Azure AI Search, score is cosine similarity. |


  
```json
[
  {
    "metadata":{
      "answers":{},
      "captions":{
        "highlights":"sample_highlight1",
        "text":"sample_text1"
      },
      "page_number":44,
      "source":{
        "filename":"sample_file1.pdf",
        "mtime":1686329994,
        "stats":{
          "chars":4385,
          "lines":41,
          "tiktokens":891
        },
        "url":"sample_url1.pdf"
      },
      "stats":{
        "chars":4385,"lines":41,"tiktokens":891
      }
    },
    "page_content":"vector chunk",
    "score":0.021349556744098663
  },

  {
    "metadata":{
      "answers":{},
      "captions":{
        "highlights":"sample_highlight2",
        "text":"sample_text2"
      },
      "page_number":44,
      "source":{
        "filename":"sample_file2.pdf",
        "mtime":1686329994,
        "stats":{
          "chars":4385,
          "lines":41,
          "tiktokens":891
        },
        "url":"sample_url2.pdf"
      },
      "stats":{
        "chars":4385,"lines":41,"tiktokens":891
      }
    },
    "page_content":"vector chunk",
    "score":0.021349556744098663
  },
    
]

```


## Next steps

- [Learn more about how to create a flow](../flow-develop.md)
