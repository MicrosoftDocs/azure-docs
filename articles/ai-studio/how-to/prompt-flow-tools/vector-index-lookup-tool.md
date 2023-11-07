---
title: Vector index lookup tool for flows in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces the Vector index lookup tool for flows in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: eur
---

# Vector index lookup tool for flows in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../../includes/preview-ai-studio.md)]

The prompt flow *Vector index lookup* tool is tailored for querying within vector index such as Azure AI Search. You can extract contextually relevant information from a domain knowledge base.

## Build with the Vector index lookup tool

1. Create or open a flow in Azure AI Studio. For more information, see [Create a flow](../flow-develop.md).
1. Select **+ More tools** > **Vector Index Lookup** to add the Vector index lookup tool to your flow.

    :::image type="content" source="../../media/prompt-flow/vector-index-lookup-tool.png" alt-text="Screenshot of the Vector Index Lookup tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/vector-index-lookup-tool.png":::

1. Enter values for the Vector index lookup tool input parameters described [here](#inputs). The [LLM tool](llm-tool.md) can generate the vector input.
1. Add more tools to your flow as needed, or select **Run** to run the flow.
1. The outputs are described [here](#outputs).


## Inputs

The following are available input parameters:

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| path | string | blob/AML asset/datastore URL for the VectorIndex.<br><br>blob URL format:<br>https://`<account_name>`.blob.core.windows.net/`<container_name>`/`<path_and_folder_name>`.<br><br>AML asset URL format:<br>azureml://subscriptions/`<your_subscription>`/resourcegroups/`<your_resource_group>>`/workspaces/`<your_workspace>`/data/`<asset_name and optional version/label>`<br><br>AML datastore URL format:<br>azureml://subscriptions/`<your_subscription>`/resourcegroups/`<your_resource_group>`/workspaces/`<your_workspace>`/datastores/`<your_datastore>`/paths/`<data_path>` | Yes |
| query | string, list[float] | The text to be queried.<br>or<br>The target vector to be queried. The [LLM tool](llm-tool.md) can generate the vector input. | Yes |
| top_k | integer | The count of top-scored entities to return. Default value is 3. | No |

## Outputs

The following JSON format response is an example returned by the tool that includes the top-k scored entities. The entity follows a generic schema of vector search result provided by promptflow-vectordb SDK. For the Vector Index Search, the following fields are populated:

| Field Name | Type | Description |
| ---- | ---- | ----------- |
| text | string | Text of the entity |
| score | float | Depends on index type defined in Vector Index. If index type is Faiss, score is L2 distance. If index type is Azure AI Search, score is cosine similarity. |
| metadata | dict | Customized key-value pairs provided by user when creating the index |
| original_entity | dict | Depends on index type defined in Vector Index. The original response json from search REST API|

  
```json
[
  {
    "text": "sample text #1",
    "vector": null,
    "score": 0.0,
    "original_entity": null,
    "metadata": {
      "link": "http://sample_link_1",
      "title": "title1"
    }
  },
  {
    "text": "sample text #2",
    "vector": null,
    "score": 0.07032840698957443,
    "original_entity": null,
    "metadata": {
      "link": "http://sample_link_2",
      "title": "title2"
    }
  },
  {
    "text": "sample text #0",
    "vector": null,
    "score": 0.08912381529808044,
    "original_entity": null,
    "metadata": {
      "link": "http://sample_link_0",
      "title": "title0"
    }
  }
]
```


## Next steps

- [Learn more about how to create a flow](../flow-develop.md)

