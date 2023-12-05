---
title: Faiss Index Lookup tool in Azure Machine Learning prompt flow
titleSuffix: Azure Machine Learning
description: The Faiss Index Lookup tool empowers you to query within a user-provided Faiss-based vector store and extract contextually relevant information from a domain knowledge base.
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

# Faiss Index Lookup tool

Faiss Index Lookup is a tool tailored for querying within a user-provided Faiss-based vector store. In combination with our large language model (LLM) tool, it empowers you to extract contextually relevant information from a domain knowledge base.

## Prerequisites

- Prepare an accessible path on Azure Blob Storage. If a new storage account needs to be created, see [Azure Storage account](../../../storage/common/storage-account-create.md).
- Create related Faiss-based index files on Blob Storage. We support the LangChain format (index.faiss + index.pkl) for the index files. You can prepare it either by employing the promptflow-vectordb SDK or following the quick guide from [LangChain documentation](https://python.langchain.com/docs/modules/data_connection/vectorstores/integrations/faiss). For steps on building an index by using the promptflow-vectordb SDK, see the [sample notebook for creating a Faiss index](https://aka.ms/pf-sample-build-faiss-index).
- Based on where you put your own index files, the identity used by the promptflow runtime should be granted with certain roles. For more information, see [Steps to assign an Azure role](../../../role-based-access-control/role-assignments-steps.md).

    | Location | Role |
    | ---- | ---- |
    | Workspace datastores or workspace default blob | AzureML Data Scientist |
    | Other blobs | Storage Blob Data Reader |

> [!NOTE]
> When legacy tools switch to code-first mode and you encounter the error `embeddingstore.tool.faiss_index_lookup.search is not found`, see [Troubleshoot guidance](./troubleshoot-guidance.md).

## Inputs

The tool accepts the following inputs:

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| path | string | URL or path for the vector store.<br><br>Blob URL format:<br>https://`<account_name>`.blob.core.windows.net/`<container_name>`/`<path_and_folder_name>`<br><br>AML datastore URL format:<br>azureml://subscriptions/`<your_subscription>`/resourcegroups/`<your_resource_group>`/workspaces/`<your_workspace>`/data/`<data_path>`<br><br>Relative path to workspace datastore `workspaceblobstore`:<br>`<path_and_folder_name>`<br><br> Public http/https URL (for public demonstration):<br>http(s)://`<path_and_folder_name>` | Yes |
| vector | list[float] | The target vector to be queried, which the LLM tool can generate. | Yes |
| top_k | integer | The count of the top-scored entities to return. Default value is 3. | No |

## Outputs

The following sample is an example for a JSON format response returned by the tool, which includes the top-scored entities. The entity follows a generic schema of vector search results provided by the promptflow-vectordb SDK. For the Faiss Index Search, the following fields are populated:

| Field name | Type | Description |
| ---- | ---- | ----------- |
| text | string | Text of the entity. |
| score | float | Distance between the entity and the query vector. |
| metadata | dict | Customized key-value pairs that you provide when you create the index. |

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
