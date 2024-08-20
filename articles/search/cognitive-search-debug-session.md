---
title: Debug Sessions concepts
titleSuffix: Azure AI Search
description: Debug Sessions, accessed through the Azure portal, provides an IDE-like environment where you can identify and fix errors, validate changes, and push changes to skillsets in an Azure AI Search enrichment pipeline.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 08/20/2024
---

# Debug Sessions in Azure AI Search

Debug Sessions is a visual editor that works with an existing skillset in the Azure portal, exposing the structure and content of a single enriched document as it's produced by an indexer and skillset for the duration of the session. Because you're working with a live document, the session is interactive - you can identify errors, modify and invoke skill execution, and validate the results in real time. If your changes resolve the problem, you can commit them to a published skillset to apply the fixes globally.

This article explains supported scenarios and how the editor is organized. Tabs and sections of the editor unpack different layers of the skillset so that you can examine skillset structure, flow, and the content it generates at run time.

## Supported scenarios

+ Built-in skills for [AI enrichment](cognitive-search-concept-intro.md) (OCR, image analysis, Entity Recognition, Sentiment Analysis, Keyword Extraction)

+ Built-in skills for [integrated vectorization](vector-search-integrated-vectorization.md), with data chunking through Text Split, and vectorization through an embedding skill

+ Custom skills used to integrate external processing that you provide.

Compare the following images for the first two scenarios. Skills for applied AI enrichment can run sequentially or in parallel if there are no dependencies. Output field mappings send enriched or generated content from in-memory data structures to fields in an index.

:::image type="content" source="media/cognitive-search-debug/debug-session-flow-applied-ai.png" alt-text="Screenshot of a debug session for OCR and image analysis." lightbox="media/cognitive-search-debug/debug-session-flow-applied-ai.png":::

Skills for integrated vectorization typically include Text Split and embeddings. A Text Split skills chunks a document into pages. Projection mappings control parent-chunk indexing. This skillset skips the parent index and creates an index with just chunked content, using metadata to identify the source of the chunk.

:::image type="content" source="media/cognitive-search-debug/debug-session-flow-integrated-vectorization.png" alt-text="Screenshot of a debug session for integrated vectorization." lightbox="media/cognitive-search-debug/debug-session-flow-integrated-vectorization.png":::

## Limitations

Debug sessions work with all generally available [indexer data sources](search-data-sources-gallery.md) and most preview data sources, with the following exceptions:

+ SharePoint Online indexer.

+ Azure Cosmos DB for MongoDB indexer.

+ For the Azure Cosmos DB for NoSQL, if a row fails during index and there's no corresponding metadata, the debug session might not pick the correct row.

+ For the SQL API of Azure Cosmos DB, if a partitioned collection was previously non-partitioned, the debug session won't find the document.

+ For custom skills, a user-assigned managed identity isn't supported for a debug session connection to Azure Storage. As stated in the prerequisites, you can use a system managed identity, or specify a full access connection string that includes a key. For more information, see [Connect a search service to other Azure resources using a managed identity](search-howto-managed-identities-data-sources.md).

## How a debug session works

When you start a session, the search service creates a copy of the skillset, indexer, and a data source containing a single document used to test the skillset. All session state is saved to a new blob container created by the Azure AI Search service in an Azure Storage account that you provide. The name of the generated container has a prefix of `ms-az-cognitive-search-debugsession`. The prefix is required because it mitigates the chance of accidentally exporting session data to another container in your account. 

A cached copy of the enriched document and skillset is loaded into the visual editor so that you can inspect the content and metadata of the enriched document, with the ability to check each document node and edit any aspect of the skillset definition. Any changes made within the session are cached. Those changes won't affect the published skillset unless you commit them. Committing changes will overwrite the production skillset.

If the enrichment pipeline doesn't have any errors, a debug session can be used to incrementally enrich a document, test and validate each change before committing the changes.

## Debug session layout

The visual editor is organized into a surface area showing a progression of operations, starting with document cracking, followed by skills, mappings, and an index.

Select any skill or mapping, and a pane opens to side showing relevant information.

:::image type="content" source="media/cognitive-search-debug/debug-session-skills-pane.png" lightbox="media/cognitive-search-debug/debug-sessions-skills-pane.png" alt-text="Screenshot showing a skill details pane with drilldown for more information.":::

Follow the links to drill further into skills processing. For example, the following screenshot shows the output of the first iteration of the Text Split skill. 

:::image type="content" source="media/cognitive-search-debug/debug-session-skills-detail-expression-evaluator.png" lightbox="media/cognitive-search-debug/debug-session-skills-detail-expression-evaluator.png" alt-text="Screenshot showing a skill details pane with Expression Evaluator for a given output.":::

### Skill details pane

Skill details have the following sections.

+ **Iterations**: Show you how many times a skill executes. You can check the inputs and outputs of each one.
+ **Skill Settings**: View or edit the JSON skillset definition.
+ **Errors and warnings**: Shows the errors or warnings specific to this skill.

## Enriched Data Structure

The **Enriched Data Structure** pane slides out to the side when you select the blue show or hide arrow symbol. It's human readable representation of what the enriched document contains. Previous screenshots in this article show examples of the enriched data structure.

## Next steps

Now that you understand the elements of debug sessions, start your first debug session on an existing skillset.

> [!div class="nextstepaction"]
> [How to debug a skillset](cognitive-search-how-to-debug-skillset.md)
