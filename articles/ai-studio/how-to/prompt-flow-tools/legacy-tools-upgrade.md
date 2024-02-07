---
title: Upgrade from legacy lookup tools to the preview Index Lookup tool
titleSuffix: Azure AI Studio
description:  This article helps users upgrade from legacy lookup tools to the preview Index Lookup tool.
author: e-straight
manager: balapv
ms.service: azure-ai-studio
ms.topic: conceptual
ms.date: 02/07/2024
ms.author: eur
---

# Upgrade from legacy lookup tools to the preview Index Lookup tool

[!INCLUDE [Azure AI Studio preview](../../includes/preview-ai-studio.md)]

Previously, in prompt flow for Azure AI Studio there were three different tools for looking up a vector index: the Faiss Index Lookup tool, the Vector DB Lookup Tool, and the Vector Index Lookup tool. We have combined and simplified these three tools into one new tool, known as the [*Index Lookup* tool](./index-lookup-tool.md). The *Index Lookup* tool enables the usage of common vector indices (such as Azure AI Search, FAISS, and Pinecone) for retrieval augmented generation (RAG) in prompt flow. The tool automatically detects the indices in the workspace and allows the selection of the index to be used in the flow. This article will help guide you through the process of upgrading from the legacy lookup tools to the new *Index Lookup* tool.

## Upgrade your tools

1. Update your runtime. In order to do this navigate to the Azure **ML Studio**. Once in **ML Studio** You can do this by clicking on the “Prompt flow” tab on the left side of ML Studio. 
1. Inside the Prompt flow tab, click on the “Runtimes” pivot tab, and then click on your runtime’s name. You should see an “Update” button near the top of the panel, click on that, and wait for the runtime to update itself. 
1. Navigate to your flow. You can do this by clicking on the “Prompt flow” tab on the left blade in AI Studio (or ML Studio), clicking on the “Flows” pivot tab, and then clicking on the name of your flow. 

1. Once inside the flow, click on the “+ More tools” button near the top of the pane. A dropdown should open and click on “Index Lookup [Preview]” to add an instance of the Index Lookup tool.

   :::image type="content" source="../../media/prompt-flow/upgrade-index-tools/index-dropdown.png" alt-text="Screenshot of the Index Lookup tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/upgrade-index-tools/index-dropdown.png":::

1. Name the new node and click  “Add”.

   :::image type="content" source="../../media/prompt-flow/upgrade-index-tools/save-node.png" alt-text="Screenshot of the Index Lookup tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/upgrade-index-tools/save-node.png":::

1. In the new node, click on the “mlindex_content” textbox. This should be the first textbox in the list.

   :::image type="content" source="../../media/prompt-flow/upgrade-index-tools/mlindex-box.png" alt-text="Screenshot of the Index Lookup tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/upgrade-index-tools/mlindex-box.png":::

1. In the Generate drawer that appears, follow the instructions below to upgrade from the three legacy tools:
- If using the legacy **Vector Index Lookup** tool, select “Registered Index" in the “index_type” dropdown. Select your vector index asset from the “mlindex_asset_id” dropdown.
- If using the legacy **Faiss Index Lookup** tool, select “Faiss” in the “index_type” dropdown and specify the same path as in the legacy tool.
- If using the legacy **Vector DB Lookup** tool, select AI Search or Pinecone depending on the DB type in the “index_type” dropdown and fill in the information as necessary.
8. After filling in the necessary information, click save. 
9. Upon returning to the node, there should be information populated in the “mlindex_content” textbox. Click on the “queries” textbox next, and select the search terms you want to query. You’ll want to select the same value as the input to the “embed_the_question” node, typically either “\${inputs.question}” or “${modify_query_with_history.output}” (the former if you’re in a standard flow and the latter if you’re in a chat flow).

   :::image type="content" source="../../media/prompt-flow/upgrade-index-tools/mlindex-with-content.png" alt-text="Screenshot of the Index Lookup tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/upgrade-index-tools/mlindex-with-content.png":::

10. Select a query type by clicking on the dropdown next to “query_type.” “Vector” will produce identical results as the legacy flow, but depending on your index configuration, other options including "Hybrid" and "Semantic" may be available.

    :::image type="content" source="../../media/prompt-flow/upgrade-index-tools/vector-search.png" alt-text="Screenshot of the Index Lookup tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/upgrade-index-tools/vector-search.png":::

11. Edit downstream components to consume the output of your newly added node, instead of the output of the legacy Vector Index Lookup node. 
12. Delete the Vector Index Lookup node and its parent embedding node. 
 



## Next steps

- [Learn more about how to create a flow](../flow-develop.md)
