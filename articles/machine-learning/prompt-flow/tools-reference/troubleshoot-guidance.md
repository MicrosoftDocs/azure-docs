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

## Why I can't create or upgrade my flow when I disable public network access of storage account?
Prompt flow rely on fileshare to store snapshot of flow. Prompt flow didn't support private storage account now. Here are some workarounds you can try:
- Make the storage account as public access enabled if there is no security concern. 
- If you are only using UI to authoring promptflow, you can add following flights (flight=PromptFlowCodeFirst=false) to use our old UI.
- You can use our CLI/SDK to authoring promptflow, CLI/SDK authong didn't rely on fileshare. See [Integrate Prompt Flow with LLM-based application DevOps ](../how-to-integrate-with-llm-app-devops.md). 


## Why I can't upgrade my old flow?
Prompt flow rely on fileshare to store snapshot of flow. If fileshare have some issue, you may encounter this issue. Here are some workarounds you can try:
- If you are using private storage account, please see [Why I can't create or upgrade my flow when I disable public network access of storage account?](#why-i-cant-create-or-upgrade-my-flow-when-i-disable-public-network-access-of-storage-account)
- If the storage account is enabled public access, please check whether there are datastore named `workspaceworkingdirectory` in your workspace, it should be fileshare type.
![workspaceworkingdirectory](../media/faq/workingdirectory.png) 
    - If you didn't get this datastore, you need add it in your workspace.
        - Create fileshare with name `code-391ff5ac-6576-460f-ba4d-7e03433c68b6`
        - Create data store with name `workspaceworkingdirectory` . See [Create datastores](../../how-to-datastore.md)
    - If you have `workspaceworkingdirectory` datastore but its type is `blob` instead of `fileshare`, please create new workspace and use storage didn't enable hierarchical namespaces ADLS Gen2 as workspace default storage account. See [Create workspace](../../how-to-manage-workspace.md#create-a-workspace)