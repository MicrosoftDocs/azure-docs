---
title: AI enrichment concepts
titleSuffix: Azure AI Search
description: Content extraction, natural language processing (NLP), and image processing can create searchable content in Azure AI Search indexes.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/27/2023

---
# AI enrichment in Azure AI Search

In Azure AI Search, *AI enrichment* calls the APIs of [Azure AI services](/azure/ai-services/what-are-ai-services) to process content that isn't full text searchable in its raw form. Through enrichment, analysis and inference are used to create searchable content and structure where none previously existed. 

Because Azure AI Search is a full text search solution, the purpose of AI enrichment is to improve the utility of your content in search-related scenarios:

+ Apply translation and language detection for multi-lingual search
+ Apply entity recognition to extract people names, places, and other entities from large chunks of text
+ Apply key phrase extraction to identify and output important terms
+ Apply Optical Character Recognition (OCR) to recognize printed and handwritten text in binary files
+ Apply image analysis to describe image content, and output the descriptions as searchable text fields

AI enrichment is an extension of an [**indexer pipeline**](search-indexer-overview.md) that connects to Azure data sources. An enrichment pipeline has all of the components of an indexer pipeline (indexer, data source, index), plus a [**skillset**](cognitive-search-working-with-skillsets.md) that specifies atomic enrichment steps.

The following diagram shows the progression of AI enrichment:

  :::image type="content" source="media/cognitive-search-intro/cognitive-search-enrichment-architecture.png" alt-text="Diagram of an enrichment pipeline." border="true":::

**Import** is the first step. Here, the indexer connects to a data source and pulls content (documents) into the search service. [Azure Blob Storage](../storage/blobs/storage-blobs-overview.md) is the most common resource used in AI enrichment scenarios, but any supported data source can provide content.

**Enrich & Index** covers most of the AI enrichment pipeline:

+ Enrichment starts when the indexer ["cracks documents"](search-indexer-overview.md#document-cracking) and extracts images and text. The kind of processing that occurs next depends on your data and which skills you've added to a skillset. If you have images, they can be forwarded to skills that perform image processing. Text content is queued for text and natural language processing. Internally, skills create an ["enriched document"](cognitive-search-working-with-skillsets.md#enrichment-tree) that collects the transformations as they occur.

+ Enriched content is generated during skillset execution, and is temporary unless you save it. You can enable an [enrichment cache](cognitive-search-incremental-indexing-conceptual.md) to persist cracked documents and skill outputs for subsequent reuse during future skillset executions.

+ To get content into a search index, the indexer must have mapping information for sending enriched content to target field. [Field mappings](search-indexer-field-mappings.md) (explicit or implicit) set the data path from source data to a search index. [Output field mappings](cognitive-search-output-field-mapping.md) set the data path from enriched documents to an index.

+ Indexing is the process wherein raw and enriched content is ingested into the physical data structures of a [search index](search-what-is-an-index.md) (its files and folders). Lexical analysis and tokenization occur in this step.

**Exploration** is the last step. Output is always a [search index](search-what-is-an-index.md) that you can query from a client app. Output can optionally be a [knowledge store](knowledge-store-concept-intro.md) consisting of blobs and tables in Azure Storage that are accessed through data exploration tools or downstream processes. If you're creating a knowledge store, [projections](knowledge-store-projection-overview.md) determine the data path for enriched content. The same enriched content can appear in both indexes and knowledge stores.

## When to use AI enrichment

Enrichment is useful if raw content is unstructured text, image content, or content that needs language detection and translation. Applying AI through the [**built-in skills**](cognitive-search-predefined-skills.md) can unlock this content for full text search and data science applications. 

You can also create [**custom skills**](cognitive-search-create-custom-skill-example.md) to provide external processing.
Open-source, third-party, or first-party code can be integrated into the pipeline as a custom skill. Classification models that identify salient characteristics of various document types fall into this category, but any external package that adds value to your content could be used.

### Use-cases for built-in skills

Built-in skills are based on the Azure AI services APIs: [Azure AI Computer Vision](../ai-services/computer-vision/index.yml) and [Language Service](../ai-services/language-service/overview.md). Unless your content input is small, expect to [attach a billable Azure AI services resource](cognitive-search-attach-cognitive-services.md) to run larger workloads.

A [skillset](cognitive-search-defining-skillset.md) that's assembled using built-in skills is well suited for the following application scenarios:

+ **Image processing** skills include [Optical Character Recognition (OCR)](cognitive-search-skill-ocr.md) and identification of [visual features](cognitive-search-skill-image-analysis.md), such as facial detection, image interpretation, image recognition (famous people and landmarks), or attributes like image orientation. These skills create text representations of image content for full text search in Azure AI Search.

+ **Machine translation** is provided by the [Text Translation](cognitive-search-skill-text-translation.md) skill, often paired with [language detection](cognitive-search-skill-language-detection.md) for multi-language solutions.

+ **Natural language processing** analyzes chunks of text. Skills in this category include [Entity Recognition](cognitive-search-skill-entity-recognition-v3.md), [Sentiment Detection (including opinion mining)](cognitive-search-skill-sentiment-v3.md), and [Personal Identifiable Information Detection](cognitive-search-skill-pii-detection.md). With these skills, unstructured text is mapped as searchable and filterable fields in an index. 

### Use-cases for custom skills

[**Custom skills**](cognitive-search-create-custom-skill-example.md) execute external code that you provide and wrap in the [custom skill web interface](cognitive-search-custom-skill-interface.md). Several examples of custom skills can be found in the [azure-search-power-skills](https://github.com/Azure-Samples/azure-search-power-skills/blob/main/README.md) GitHub repository.

Custom skills aren’t always complex. For example, if you have an existing package that provides pattern matching or a document classification model, you can wrap it in a custom skill. 

## Storing output

In Azure AI Search, an indexer saves the output it creates. A single indexer run can create up to three data structures that contain enriched and indexed output.

| Data store | Required | Location | Description |
|------------|----------|----------|-------------|
| [**searchable index**](search-what-is-an-index.md) | Required | Search service | Used for full text search and other query forms. Specifying an index is an indexer requirement. Index content is populated from skill outputs, plus any source fields that are mapped directly to fields in the index. |
| [**knowledge store**](knowledge-store-concept-intro.md) | Optional | Azure Storage | Used for downstream apps like knowledge mining or data science. A knowledge store is defined within a skillset. Its definition determines whether your enriched documents are projected as tables or objects (files or blobs) in Azure Storage. |
| [**enrichment cache**](cognitive-search-incremental-indexing-conceptual.md) | Optional | Azure Storage | Used for caching enrichments for reuse in subsequent skillset executions. The cache stores imported, unprocessed content (cracked documents). It also stores the enriched documents created during skillset execution. Caching is helpful if you're using image analysis or OCR, and you want to avoid the time and expense of reprocessing image files. |

Indexes and knowledge stores are fully independent of each other. While you must attach an index to satisfy indexer requirements, if your sole objective is a knowledge store, you can ignore the index after it's populated.

## Exploring content

After you've defined and loaded a [search index](search-what-is-an-index.md) or a [knowledge store](knowledge-store-concept-intro.md), you can explore its data.

### Query a search index

[Run queries](search-query-overview.md) to access the enriched content generated by the pipeline. The index is like any other you might create for Azure AI Search: you can supplement text analysis with custom analyzers, invoke fuzzy search queries, add filters, or experiment with scoring profiles to tune search relevance.

### Use data exploration tools on a knowledge store

In Azure Storage, a [knowledge store](knowledge-store-concept-intro.md) can assume the following forms: a blob container of JSON documents, a blob container of image objects, or tables in Table Storage. You can use [Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md), [Power BI](knowledge-store-connect-power-bi.md), or any app that connects to Azure Storage to access your content.

+ A blob container captures enriched documents in their entirety, which is useful if you're creating a feed into other processes. 

+ A table is useful if you need slices of enriched documents, or if you want to include or exclude specific parts of the output. For analysis in Power BI, tables are the recommended data source for data exploration and visualization in Power BI.

## Availability and pricing

Enrichment is available in regions that have Azure AI services. You can check the availability of enrichment on the [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=search) page. 

Billing follows a pay-as-you-go pricing model. The costs of using built-in skills are passed on when a multi-region Azure AI services key is specified in the skillset. There are also costs associated with image extraction, as metered by Azure AI Search. Text extraction and utility skills, however, aren't billable. For more information, see [How you're charged for Azure AI Search](search-sku-manage-costs.md#how-youre-charged-for-azure-ai-search).

## Checklist: A typical workflow

An enrichment pipeline consists of [*indexers*](search-indexer-overview.md) that have [*skillsets*](cognitive-search-working-with-skillsets.md). Post-indexing, you can query an index to validate your results.

Start with a subset of data in a [supported data source](search-indexer-overview.md#supported-data-sources). Indexer and skillset design is an iterative process. The work goes faster with a small representative data set.

1. Create a [data source](/rest/api/searchservice/create-data-source) that specifies a connection to your data.

1. [Create a skillset](cognitive-search-defining-skillset.md). Unless your project is small, you should [attach an Azure AI multi-service resource](cognitive-search-attach-cognitive-services.md). If you're [creating a knowledge store](knowledge-store-create-rest.md), define it within the skillset.

1. [Create an index schema](search-how-to-create-search-index.md) that defines a search index.

1. [Create and run the indexer](search-howto-create-indexers.md) to bring all of the above components together. This step retrieves the data, runs the skillset, and loads the index. 

   An indexer is also where you specify field mappings and output field mappings that set up the data path to a search index.

   Optionally, [enable enrichment caching](cognitive-search-incremental-indexing-conceptual.md) in the indexer configuration. This step allows you to reuse existing enrichments later on.

1. [Run queries](search-query-create.md) to evaluate results or [start a debug session](cognitive-search-how-to-debug-skillset.md) to work through any skillset issues.

To repeat any of the above steps, [reset the indexer](search-howto-reindex.md) before you run it. Or, delete and recreate the objects on each run (recommended if you’re using the free tier). If you enabled caching the indexer pulls from the cache if data is unchanged at the source, and if your edits to the pipeline don't invalidate the cache.

## Next steps

+ [Quickstart: Create a skillset for AI enrichment](cognitive-search-quickstart-blob.md)
+ [Tutorial: Learn about the AI enrichment REST APIs](cognitive-search-tutorial-blob.md)
+ [Skillset concepts](cognitive-search-working-with-skillsets.md)
+ [Knowledge store concepts](knowledge-store-concept-intro.md)
+ [Create a skillset](cognitive-search-defining-skillset.md)
+ [Create a knowledge store](knowledge-store-create-rest.md)