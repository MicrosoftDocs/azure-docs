---
title: Knowledge Store introduction and overview - Azure Search
description: Send enchriched documents to Azure storage where you can view, reshape, and consume enriched documents in Azure Search and in other applications.
manager: cgronlun
author: HeidiSteen
services: search
ms.service: search
ms.devlang: NA
ms.topic: overview
ms.date: 05/02/2019
ms.author: heidist

---
# What is Knowledge Store in Azure Search?

Knowledge Store is a public preview feature ... 

![Cognitive search pipeline diagram](./media/cognitive-search-intro/cogsearch-architecture.png "Cognitive Search pipeline overview")

Link list:

[What is Knowledge Store in Azure Search](knowledge-store-concept-intro.md) ** concepts, architecture, use cases
[How to use Knowledge Store](knowledge-store-howto.md) ** procedural
[Shaper cognitive search skill - Azure Search](cognitive-search-skill-shaper.md) ** reference
[What is "cognitive search" in Azure Search](cognitive-search-concept-intro.md) ** reference
[Quickstart: Create an AI indexing pipeline in Azure Search](cognitive-search-quickstart-blob.md) ** portal
[What is Azure Search > Feature list](search-what-is-azure-search.md) ** Feature list entry

> [!NOTE]
> As you expand scope by increasing the frequency of processing, adding more documents, or adding more AI algorithms, you will need to attach a billable Cognitive Services resource. Charges accrue when calling APIs in Cognitive Services, and for image extraction as part of the document-cracking stage in Azure Search. There are no charges for text extraction from documents.
>
> Execution of built-in skills is charged at the existing [Cognitive Services pay-as-you go price](https://azure.microsoft.com/pricing/details/cognitive-services/). Image extraction pricing is described on the [Azure Search pricing page](https://go.microsoft.com/fwlink/?linkid=2042400). Learn [more](cognitive-search-attach-cognitive-services.md).

## Components of Knowledge Store

A cognitive search pipeline is based on [Azure Search *indexers*](search-indexer-overview.md) that crawl data sources and provide end-to-end index processing. Skills are now attached to indexers, intercepting and enriching documents according to the skillset you define. Once indexed, you can access content via search requests through all [query types supported by Azure Search](search-query-overview.md).  If you are new to indexers, this section walks you through the steps.

<a name="feature-concepts"></a>

## Key features and concepts

| Concept | Description| Links |
|---------|------------|-------|
|
<a name="where-do-i-start"></a>

## Where do I start?

**Step 1: [Create an Azure Search resource](search-create-service-portal.md)** 

**Step 2: Try some quickstarts and examples for hands-on experience**

+ [Quickstart (portal)](cognitive-search-quickstart-blob.md)
+ [Tutorial (HTTP requests)](cognitive-search-tutorial-blob.md)
+ [Example custom skills (C#)](cognitive-search-create-custom-skill-example.md)

We recommend the Free service for learning purposes, but be aware that the number of free transactions is limited to 20 documents per day. To run both the quickstart and tutorial in one day, use a smaller file set (10 documents) so that you can fit in both exercises.

**Step 3: Review the API**

You can use REST `api-version=2019-05-06` on requests or the .NET SDK. 

This step uses the REST APIs to build a cognitive search solution. Only two APIs are added or extended for cognitive search. Other APIs have the same syntax as the generally available versions.

| REST API | Description |
|-----|-------------|
| [Create Data Source](https://docs.microsoft.com/rest/api/searchservice/create-data-source)  | A resource identifying an external data source providing source data used to create enriched documents.  |
| [Create Skillset (api-version=2019-05-06)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)  | A resource coordinating the use of [predefined skills](cognitive-search-predefined-skills.md) and [custom cognitive skills](cognitive-search-custom-skill-interface.md) used in an enrichment pipeline during indexing. |
| [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index)  | A schema expressing an Azure Search index. Fields in the index map to fields in source data or to fields manufactured during the enrichment phase (for example, a field for organization names created by entity recognition). |
| [Create Indexer (api-version=2019-05-06)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)  | A resource defining components used during indexing: including a data source, a skillset, field associations from source and intermediary data structures to target index, and the index itself. Running the indexer is the trigger for data ingestion and enrichment. The output is a search corpus based on the index schema, populated with source data, enriched through skillsets.  |

**Checklist: A typical workflow**

1. Subset your Azure source data into a representative sample. Indexing takes time so start with a small, representative data set and then build it up incrementally as your solution matures.

1. Create a [data source object](https://docs.microsoft.com/rest/api/searchservice/create-data-source) in Azure Search to provide a connection string for data retrieval.

1. Create a [skillset](https://docs.microsoft.com/rest/api/searchservice/create-skillset) with enrichment steps.

1. Define the [index schema](https://docs.microsoft.com/rest/api/searchservice/create-index). The *Fields* collection includes fields from source data. You should also stub out additional fields to hold generated values for content created during enrichment.

1. Define the [indexer](https://docs.microsoft.com/rest/api/searchservice/create-skillset) referencing the data source, skillset, and index.

1. Within the indexer, add *outputFieldMappings*. This section maps output from the skillset (in step 3) to the inputs fields in the index schema (in step 4).

1. Send *Create Indexer* request you just created (a POST request with an indexer definition in the request body) to express the indexer in Azure Search. This step is how you run the indexer, invoking the pipeline.

1. Run queries to evaluate results and modify code to update skillsets, schema, or indexer configuration.

1. [Reset the indexer](search-howto-reindex.md) before rebuilding the pipeline.

For more information about specific questions or problems, see [Troubleshooting tips](cognitive-search-concept-troubleshooting.md).

## Next steps

+ [Cognitive search documentation](cognitive-search-resources-documentation.md)
+ [Quickstart: Try cognitive search in a portal walkthrough](cognitive-search-quickstart-blob.md)
+ [Tutorial: Learn the cognitive search APIs](cognitive-search-tutorial-blob.md)
