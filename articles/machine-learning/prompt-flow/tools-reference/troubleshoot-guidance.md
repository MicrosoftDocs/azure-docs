---
title: Troubleshoot guidance
titleSuffix: Azure Machine Learning
description: This article addresses frequent questions about tool usage.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: ChenJieting
ms.author: chenjieting
ms.reviewer: lagayhar
ms.date: 09/05/2023
---

# Troubleshoot guidance

This article addresses frequent questions about tool usage.

## Error "package tool is not found" occurs when updating the flow for code first experience.

When you update flows for code first experience, if the flow utilized these tools (Faiss Index Lookup, Vector Index Lookup, Vector DB Lookup, Content Safety (Text)), you may encounter the error message like below:

<code><i>Package tool 'embeddingstore.tool.faiss_index_lookup.search' is not found in the current environment.</i></code>

To resolve the issue, you have two options:

- **Option 1**
  - Update your runtime to latest version. 
  - Click on "Raw file mode" to switch to the raw code view, then open the "flow.dag.yaml" file.
     ![how-to-switch-to-raw-file-mode](../media/faq/switch-to-raw-file-mode.png)
  - Update the tool names.
     ![how-to-update-tool-name](../media/faq/update-tool-name.png)
     
      | Tool | New tool name |
      | ---- | ---- |
      | Faiss Index Lookup tool | promptflow_vectordb.tool.faiss_index_lookup.FaissIndexLookup.search |
      | Vector Index Lookup | promptflow_vectordb.tool.vector_index_lookup.VectorIndexLookup.search |
      | Vector DB Lookup | promptflow_vectordb.tool.vector_db_lookup.VectorDBLookup.search |
      | Content Safety (Text) | content_safety_text.tools.content_safety_text_tool.analyze_text |
  - Save the "flow.dag.yaml" file.

- **Option 2**
  - Update your runtime to latest version.
  - Remove the old tool and re-create a new tool.