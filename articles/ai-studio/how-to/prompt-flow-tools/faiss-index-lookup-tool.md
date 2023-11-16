---
title: Faiss Index Lookup tool for flows in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces the Faiss Index Lookup tool for flows in Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: eur
---

# Faiss Index Lookup tool for flows in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../../includes/preview-ai-studio.md)]

The prompt flow *Faiss Index Lookup* tool is tailored for querying within a user-provided Faiss-based vector store. In combination with the [Large Language Model (LLM) tool](llm-tool.md), it can help to extract contextually relevant information from a domain knowledge base.

## Build with the Faiss Index Lookup tool

1. Create or open a flow in Azure AI Studio. For more information, see [Create a flow](../flow-develop.md).
1. Select **+ More tools** > **Faiss Index Lookup** to add the Faiss Index Lookup tool to your flow.

    :::image type="content" source="../../media/prompt-flow/faiss-index-lookup-tool.png" alt-text="Screenshot of the Faiss Index Lookup tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/faiss-index-lookup-tool.png":::

1. Enter values for the Faiss Index Lookup tool input parameters described [here](#inputs). The [LLM tool](llm-tool.md) can generate the vector input.
1. Add more tools to your flow as needed, or select **Run** to run the flow.
1. The outputs are described [here](#outputs).

## Inputs

The following are available input parameters:

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| path | string | URL or path for the vector store.<br><br>blob URL format:<br>https://`<account_name>`.blob.core.windows.net/`<container_name>`/`<path_and_folder_name>`.<br><br>AML datastore URL format:<br>azureml://subscriptions/`<your_subscription>`/resourcegroups/`<your_resource_group>`/workspaces/`<your_workspace>`/data/`<data_path>`<br><br>relative path to workspace datastore `workspaceblobstore`:<br>`<path_and_folder_name>`<br><br> public http/https URL (for public demonstration):<br>http(s)://`<path_and_folder_name>` | Yes |
| vector | list[float] | The target vector to be queried. The [LLM tool](llm-tool.md) can generate the vector input. | Yes |
| top_k | integer | The count of top-scored entities to return. Default value is 3. | No |

## Outputs

The following JSON format response is an example returned by the tool that includes the top-k scored entities. The entity follows a generic schema of vector search result provided by promptflow-vectordb SDK. For the Faiss Index Search, the following fields are populated:

| Field Name | Type | Description |
| ---- | ---- | ----------- |
| text | string | Text of the entity |
| score | float |  Distance between the entity and the query vector |
| metadata | dict | Customized key-value pairs provided by user when creating the index |

```json
[
  {
    "metadata": {
      "link": "http://sample_link_0",
      "title": "title0"
    },
    "original_entity": null,
    "score": 0,
    "text": "sample text #0",
    "vector": null
  },
  {
    "metadata": {
      "link": "http://sample_link_1",
      "title": "title1"
    },
    "original_entity": null,
    "score": 0.05000000447034836,
    "text": "sample text #1",
    "vector": null
  },
  {
    "metadata": {
      "link": "http://sample_link_2",
      "title": "title2"
    },
    "original_entity": null,
    "score": 0.20000001788139343,
    "text": "sample text #2",
    "vector": null
  }
]
```

## Next steps

- [Learn more about how to create a flow](../flow-develop.md)

