---
title: Cognitive search for data extraction, natural language AI processing in Azure Search | Microsoft Docs
description: Content extraction, natural language processing (NLP) and image processing to create searchable content in Azure Search indexing using cognitive skills and AI algorithms
manager: cgronlun
author: HeidiSteen
services: search
ms.service: search
ms.devlang: NA
ms.topic: conceptual
ms.date: 08/07/2018
ms.author: heidist
---
# What is cognitive search?

Cognitive search creates searchable information out of non-searchable content by attaching AI algorithms to an indexing pipeline. AI integration is through *cognitive skills*, enriching source documents en route to a search index. 

**Natural language processing** skills include [entity recognition](cognitive-search-skill-named-entity-recognition.md), language detection, [key phrase extraction](cognitive-search-skill-keyphrases.md), text manipulation, and sentiment detection. With these skills, unstructured text becomes structured, mapped to searchable and filterable fields in an index.

**Image processing** includes [OCR](cognitive-search-skill-ocr.md) and identification of [visual features](cognitive-search-skill-image-analysis.md), such as facial detection, image interpretation, image recognition (famous people and landmarks) or attributes like colors or image orientation. You can create text-representations of image content, searchable using all the query capabilities of Azure Search.

![Cognitive search pipeline diagram](./media/cognitive-search-intro/cogsearch-architecture.png "Cognitive Search pipeline overview")

The cognitive skills in Azure Search are based on the same AI algorithms used in Cognitive Services APIs: [Named Entity Recognition API](cognitive-search-skill-named-entity-recognition.md), [Key Phrase Extraction API](cognitive-search-skill-keyphrases.md), and [OCR API](cognitive-search-skill-ocr.md) are just a few. 

Natural language and image processing is applied during the data ingestion phase, with results becoming part of a document's composition in a searchable index in Azure Search. Data is sourced as an Azure data set and then pushed through an indexing pipeline using whichever [built-in skills](cognitive-search-predefined-skills.md) you need. The architecture is extensible so if the built-in skills are not sufficient, you can create and attach [custom skills](cognitive-search-create-custom-skill-example.md) to integrate custom processing. Examples might be a custom entity module or document classifier targeting a specific domain such as finance, scientific publications, or medicine.

> [!NOTE]
> Cognitive Search is in public preview. Skillset execution, and image extraction and normalization are currently offered for free. At a later time, the pricing for these capabilities will be announced. 

## Components of cognitive search

Cognitive search is a preview feature of [Azure Search](search-what-is-azure-search.md), available on all tiers in South Central US and West Europe. 

The cognitive search pipeline is based on [Azure Search *indexers*](search-indexer-overview.md) that crawl data sources and provide end-to-end index processing. Skills are now attached to indexers, intercepting and enriching documents according to the skillset you define. Once indexed, you can access content via search requests through all [query types supported by Azure Search](search-query-overview.md).  If you are new to indexers, this section walks you through the steps.

### Source data and document cracking phase

At the start of the pipeline, you have unstructured text or non-text content (such as image and scanned document JPEG files). Data must exist in an Azure data storage service that can be accessed by an indexer. Indexers can "crack" source documents to extract text from source data.

![Document cracking phase](./media/cognitive-search-intro/document-cracking-phase-blowup.png "document cracking")

 Supported sources include Azure blob storage, Azure table storage, Azure SQL Database, and Azure Cosmos DB. Text-based content can be extracted from the following file types: PDFs, Word, PowerPoint, CSV files. For the full list, see [Supported formats](search-howto-indexing-azure-blob-storage.md#supported-document-formats).

### Cognitive skills and enrichment phase

Enrichment is through *cognitive skills* performing atomic operations. For example, once you have text content from a PDF, you can apply entity recognition language detection, or key phrase extraction to produce new fields in your index that are not available natively in the source. Altogether, the collection of skills used in your pipeline is called a *skillset*.  

![Enrichment phase](./media/cognitive-search-intro/enrichment-phase-blowup.png "enrichment phase")

A skillset is based on [predefined cognitive skills](cognitive-search-predefined-skills.md) or [custom skills](cognitive-search-create-custom-skill-example.md) you provide and connect to the skillset. A skillset can be minimal or highly complex, and determines not only the type of processing, but also the order of operations. A skillset plus the field mappings defined as part of an indexer fully specifies the enrichment pipeline. For more information about pulling all of these pieces together, see [Define a skillset](cognitive-search-defining-skillset.md).

Internally, the pipeline generates a collection of enriched documents. You can decide which parts of the enriched documents should be mapped to indexable fields in your search index. For example, if you applied the key phrases extraction and the entity recognition skills, then those new fields would become part of the enriched document, and they can be mapped to fields on your index. See [Annotations](cognitive-search-concept-annotations-syntax.md) to learn more about input/output formations.

### Search index and query-based access

When processing is finished, you have a search corpus consisting of enriched documents, fully text-searchable in Azure Search. [Querying the index](search-query-overview.md) is how developers and users access the enriched content generated by the pipeline. 

![Index with search icon](./media/cognitive-search-intro/search-phase-blowup.png "Index with search icon")

The index is like any other you might create for Azure Search: you can supplement with custom analyzers, invoke fuzzy search queries, add filtered search, or experiment with scoring profiles to reshape the search results.

Indexes are generated from an index schema that defines the fields, attributes, and other constructs attached to a specific index, such as scoring profiles and synonym maps. Once an index is defined and populated, you can index incrementally to pick up new and updated source documents. Certain modifications require a full rebuild. You should use a small data set until the schema design is stable. For more information, see [How to rebuild an index](search-howto-reindex.md).

<a name="feature-concepts"></a>

## Key features and concepts

| Concept | Description| Links |
|---------|------------|-------|
| Skillset | A top-level named resource containing a collection of skills. A skillset is the enrichment pipeline. It is invoked during indexing by an indexer. | [Define a skillset](cognitive-search-defining-skillset.md) |
| Cognitive skill | An atomic transformation in an enrichment pipeline. Often, it is a component that extracts or infers structure, and therefore augments your understanding of the input data. Almost always, the output is text-based and the processing is natural language processing or image processing that extracts or generates text from image inputs. Output from a skill can be mapped to a field in an index, or used as an input for a downstream enrichment. A skill is either predefined and provided by Microsoft, or custom: created and deployed by you. | [Predefined skills](cognitive-search-predefined-skills.md) |
| Data extraction | Covers a broad range of processing, but pertaining to cognitive search, the named entity recognition skill is most typically used to extract data (an entity) from a source that doesn't provide that information natively. | [Named Entity Recognition Skill](cognitive-search-skill-named-entity-recognition.md)| 
| Image processing | Infers text from an image, such as the ability to recognize a landmark, or extracts text from an image. Common examples include OCR for lifting characters from a scanned document (JPEG) file, or recognizing a street name in a photograph containing a street sign. | [Image Analysis Skill](cognitive-search-skill-image-analysis.md) or [OCR Skill](cognitive-search-skill-ocr.md)
| Natural language processing | Text processing for insights and information about text inputs. Language detection, sentiment analysis, and key phrase extraction are skills that fall under natural language processing.  | [Key Phrase Extraction Skill](cognitive-search-skill-keyphrases.md), [Language Detection Skill](cognitive-search-skill-language-detection.md), [Sentiment Analysis Skill](cognitive-search-skill-sentiment.md) |
| Document cracking | The process of extracting or creating text content from non-text sources during indexing. Optical character recognition (OCR) is an example, but generally it refers to core indexer functionality as the indexer extracts content from application files. The data source providing source file location, and the indexer definition providing field mappings, are both key factors in document cracking. | See [Indexers](search-indexer-overview.md) |
| Shaping | Consolidate text fragments into a larger structure, or conversely break down larger text chunks into a manageable size for further downstream processing. | [Shaper Skill](cognitive-search-skill-shaper.md), [Text Merger Skill](cognitive-search-skill-textmerger.md), [Text Split Skill](cognitive-search-skill-textsplit.md) |
| Enriched documents | A transitory internal structure, not directly accessible in code. Enriched documents are generated during processing, but only final outputs are persisted in a search index. Field mappings determine which data elements are added to the index. | See [Accessing enriched documents](cognitive-search-tutorial-blob.md#access-enriched-document). |
| Indexer |  A crawler that extracts searchable data and metadata from an external data source and populates an index based on field-to-field mappings between the index and your data source for document cracking. For cognitive search enrichments, the indexer invokes a skillset, and contains the field mappings associating enrichment output to target fields in the index. The indexer definition contains all of the instructions and references for pipeline operations, and the pipeline is invoked when you run the indexer. | [Indexers](search-indexer-overview.md) |
| Data Source  | An object used by an indexer to connect to an external data source of supported types on Azure. | See [Indexers](search-indexer-overview.md) |
| Index | A persisted search corpus in Azure Search, built from an index schema that defines field structure and usage. | [Indexes in Azure Search](search-what-is-an-index.md) | 


## Where do I start?

**Step 1: Create a search service in a region providing the APIs** 

+ South Central US
+ West Europe

**Step 2: Hands-on experience to master the workflow**

+ [Quickstart (portal)](cognitive-search-quickstart-blob.md)
+ [Tutorial (HTTP requests)](cognitive-search-tutorial-blob.md)
+ [Example custom skills (C#)](cognitive-search-create-custom-skill-example.md)

**Step 3: Review the API (REST only)**

Currently, only REST APIs are provided. Use `api-version=2017-11-11-Preview` on all requests. Use the following APIs to build a cognitive search solution. Only two APIs are added or extended for cognitive search. Other APIs have the same syntax as the generally available versions.

| REST API | Description |
|-----|-------------|
| [Create Data Source](https://docs.microsoft.com/rest/api/searchservice/create-data-source)  | A resource identifying an external data source providing source data used to create enriched documents.  |
| [Create Skillset (api-version=2017-11-11-Preview)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)  | A resource coordinating the use of [predefined skills](cognitive-search-predefined-skills.md) and [custom cognitive skills](cognitive-search-custom-skill-interface.md) used in an enrichment pipeline during indexing. |
| [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index)  | A schema expressing an Azure Search index. Fields in the index map to fields in source data or to fields manufactured during the enrichment phase (for example, a field for organization names created by entity recognition). |
| [Create Indexer (api-version=2017-11-11-Preview)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)  | A resource defining components used during indexing: including a data source, a skillset, field associations from source and intermediary data structures to target index, and the index itself. Running the indexer is the trigger for data ingestion and enrichment. The output is a search corpus based on the index schema, populated with source data, enriched through skillsets.  |

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
