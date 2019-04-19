---
title: Knowledge Store introduction and overview - Azure Search
description: Send enchriched documents to Azure storage where you can view, reshape, and consume enriched documents in Azure Search and in other applications.
manager: eladz
author: Vkurpad
services: search
ms.service: search
ms.devlang: NA
ms.topic: overview
ms.date: 05/02/2019
ms.author: vikurpad

---
# What is Knowledge Store in Azure Search?

Knowledge Store is an optional feature of Azure Search, currently in public preview, that persists enriched documents and metadata created by an AI-based indexing pipeline. Knowledge Store is backed by an Azure storage account that you configure as part of the pipeline. When enabled, the search service uses this storage account to cache a representation of each enriched document.

Stored data can be manipulated into new shapes, resulting in an Azure Search index schema that might have been difficult to create previously, or as an intermediate structure for some other tool or application.

![Knowledge Store in pipeline diagram](./media/knowledge-store-concept-intro/pipeline-knowledge-store.png "Knowledge Store in pipeline diagram")

Before this preview, AI-enriched documents were created and stored in-memory while in transit to an Azure Search index. 

With this preview, Knowledge Store adds an intermediate repository to persist the output of each skill as returned from the invocation, and decouples the index from the enrichment pipeline so that you can view, reshape, and consume the documents in potentially new ways. 

Enriched documents in Knowledge Store give these benefits:

+ Refine an indexing pipeline while debugging steps and skillset definitions. 
+ Shape the data into new forms.
+ Consume raw annotations in analytics and reporting tools other than search. 

> [!Note]
> Not familiar with AI-based indexing using Cognitive Services? Azure Search integrates with Cognitive Services Vision and Language features to extract and rich source data using Optical Character Recognition (OCR) over image files, entity recognition and key phrase extraction from text files, and more. For more information, see [What is cognitive search](cognitive-search-concept-intro.md).

## Example illustration

The following illustration shows a collection of tables, each one containing enriched documents. Tables and their contents are created by an indexing pipeline in Azure Search. If you are already familiar with AI-based indexing, the skillset definition determines the creation, organization, and substance of each enriched document.

PUT IMAGE HERE

## Components required for Knowledge Store

Knowledge Store is an optional extension to the AI-based indexing in Azure Search. You need the following services and artifacts to use this feature.

### 1 - Data

The data or documents you want to enrich must exist in an Azure data source supported by Azure Search indexers: 

+ Azure Blob storage
+ Azure Table storage
+ Azure Cosmos DB
+ Azure SQL Database

You will need a connection string and permissions to access the data.

### 2 - Azure Search service

You also need an Azure Search service and the REST API to create and configure objects used for data enrichment. The REST API for Knowledge Store is `api-version=2019-05-06-Preview`.

Azure Search provides the indexer feature, and indexers are used to drive the entire process end-to-end, resulting in persisted, enriched documents in Azure storage.

| Object | REST API | Description |
|--------|----------|-------------|
| data source | [Create Data Source](https://docs.microsoft.com/rest/api/searchservice/create-data-source)  | A resource identifying an external Azure data source providing source data used to create enriched documents.  |
| skillset | [Create Skillset](https://docs.microsoft.com/rest/api/searchservice/create-skillset)  | A resource coordinating the use of [predefined skills](cognitive-search-predefined-skills.md) and [custom cognitive skills](cognitive-search-custom-skill-interface.md) used in an enrichment pipeline during indexing. |
| index | [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index)  | A schema expressing an Azure Search index. Fields in the index map to fields in source data or to fields manufactured during the enrichment phase (for example, a field for organization names created by entity recognition). |
| indexer | [Create Indexer (api-version=2019-05-06)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)  | A resource defining components used during indexing: including a data source, a skillset, field associations from source and intermediary data structures to target index, and the index itself. Running the indexer is the trigger for data ingestion and enrichment. The output is a search corpus based on the index schema, populated with source data, enriched through skillsets.  |

### 3 - Cognitive Services

Enrichments are based on the Computer Vision and Language features in Cognitive Services. Cognitive Services functionality is leveraged during indexing through your skillset. A skillset is a composition of skills, and skills are bound to specific Computer Vision and Language features.

### 4 - Storage account

If your data originates from Azure Blob or Table storage, you are already set. Otherwise, you will need an Azure storage account. Tables and objects in Azure storage contain the enriched documents created by the AI-based indexing pipeline.

The storage account is specified in the skillset. In `api-version=2019-05-06-Preview`, a skillset definition includes a Knowledge Store definition so that you can provide account information.

### 5 - Access and consume

Once the enrichments exist in storage, any tool or technology that connects to Azure blob or table storage can be used to explore, analyze, or consume the contents. The following list is a start:

+ Storage explorer to view enriched document structure and content. Consider this a baseline tool.
+ Power BI with Power Query for natural language queries, or use the reporting and analysis tools if you have numeric data.
+ Azure Data Factory for further manipulation.
+ Azure Search index for full-text search over content.

## Document persistence

Within the storage account the enrichments can be expressed as tables within Azure Table storage or as objects in Azure Blob storage. Recall that enrichments, once stored, can be used as a source to load data into other databases and tools,

+ Table storage is useful when you want a schema-aware representation of the data in tabular form. If you want to reshape or recombine elements in new ways, table storage gives you the necessary granularity.

+ Blob storage creates one all-inclusive JSON representation of each document. You can use both storage options in one skillset to get a full range of expressions.

+ Azure Search persists content in an Azure Search index. You can use Search explorer, Postman, or you can write code that renders search results in an app. An index is required to run an indexer, but once you have enriched documents and if you no longer need the indexer, you can delete all of Azure Search objects (index, data source, indexer, skillset) to save space in your service.

Along with document contents, enriched documents include the metadata of the skillset version that produced the enrichments.  

## Enrichments ??

The knowledge store consists of an annotation cache and projections. The cache is used by the service internally to cache the results from skills and track changes. The projections are where you define the schema and structure of the enrichments that match your intended use.  

## Why do you need the knowledge store? 

Projections: Application requiring search may also need to store the data to serve needs like transactional, analytical or reporting. The knowledge store enables the transformation of the document and enrichments to service these other needs.  

The knowledge store provides two options for projecting the document and associated enrichments. An object or hierarchical representation in JSON for scenarios like data science pipelines and a tabular representation with relationships for scenarios like data analysis or exporting the data as data frames for machine learning. The enriched projections can then be easily imported into other data stores. 

## Lifecycle of Projections 

Adding the knowledge store to your skillset continues to allow you to leverage the lifecycle management features of the indexer. As your input documents are edited or deleted, those changes are propagated thought the annotation cache to the projections. Ensuring that your projected data is a current representation of your inputs at the end of the indexer run. 

While you can edit the data in the projections, any edits will be overwritten if the document in the data source is updated. 

The annotation cache has a lifecycle that is tied to the skillset, but the projections will continue to exist even when the skillset is deleted. Once a projection is created, you as the owner of the storage account are responsible deleting it if it is no longer needed. 
 
 
 
 
 
For instance, if one of the goals of the enrichment process is to also create a dataset used to train a model, projecting the data into the object store would be one way to use the data in your data science pipelines. Alternatively, if you want to create a quick Power BI dashboard based on the enriched documents the tabular projection would work well. 

Reprocess Skillsets: As skillsets evolve and underlying models improve, you need to manage consistency of the documents in the index. You can choose when you update documents created with earlier versions of the skillset to the current version. This “reprocessing” of documents relies on the annotation cache to determine which skills need to be rerun, thereby improving efficiency and lowering costs. 

BACKGROUND

When using cognitive search without the Knowledge Store, the enrichment process leverages the AI skills to create an in memory representation of the document contents and enrichments. Nodes from this enrichment tree are then selectively pushed into the index, these enrichments exist only in memory and for the duration the document is in the enrichment pipeline. The enrichments that are not mapped to a field in the index are not persisted once the document is pushed to the index. 

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





## Where do I start?

We recommend the Free service for learning purposes, but be aware that the number of free transactions is limited to 20 documents per day, per subscription.

When using multple services, create all of your services in the same region for best performance and to minimize costs. You are not charged for bandwidth for inbound data or outbound data that goes to another service in the same region.

**Step 1: [Create an Azure Search resource](search-create-service-portal.md)** 

**Step 2: [Create an Azure storage account]()** 

**Step 3: [Create a Cognitive Services resource]()** 

**Step 4: [Test-drive with the portal](cognitive-search-quickstart-blob.md)** 

**Step 5: [Test-drive with sample data using REST and Postman]()** 

You can use REST `api-version=2019-05-06-Preview`. This step uses the REST APIs to construct an AI-based pipeline. In the newest preview API, the Skillset object provides the Knowledge Store definitions.

## Takeaways

Knowledge Store offers a variety of benefits including but not limited to enabling use of the enriched documents in scenarios other than search, cost controls, and managing drift in your enrichment process. These features are all available to use simply by adding a storage account to your skillset and using the updated expression language as described in [How to use Knowledge Store](knowledge-store-howto.md). 

## Next steps

The simplest approach for creating enriched documents is through the **Import data** wizard.

> [!div class="nextstepaction"]
> [Quickstart: Try cognitive search in a portal walkthrough](cognitive-search-quickstart-blob.md)