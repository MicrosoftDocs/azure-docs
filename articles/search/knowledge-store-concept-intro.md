---
title: Knowledge store concepts
titleSuffix: Azure Cognitive Search
description: Send enriched documents to Azure Storage where you can view, reshape, and consume enriched documents in Azure Cognitive Search and in other applications.
author: HeidiSteen
manager: nitinme
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/30/2020
---

# Knowledge store in Azure Cognitive Search

Knowledge store is a feature of Azure Cognitive Search that persists output from an [AI enrichment pipeline](cognitive-search-concept-intro.md) into Azure Storage for independent analysis or downstream processing. An *enriched document* is a pipeline's output, created from content that has been extracted, structured, and analyzed using AI processes. In a standard AI pipeline, enriched documents are transitory, used only during indexing and then discarded. Creating a knowledge store preserves the enriched documents for inspection or for other knowledge mining scenarios.

If you have used cognitive skills in the past, you already know that *skillsets* move a document through a sequence of enrichments. The outcome can be a search index, or projections in a knowledge store. The two outputs, search index and knowledge store, are products of the same pipeline; derived from the same inputs, but resulting in output that is structured, stored, and used in very different ways.

Physically, a knowledge store is [Azure Storage](../storage/common/storage-account-overview.md), either Azure Table Storage, Azure Blob Storage, or both. Any tool or process that can connect to Azure Storage can consume the contents of a knowledge store.

Viewed through Storage Explorer, a knowledge store is just a collection of tables, objects, or files. The following example shows a knowledge store composed of three tables with fields that are either carried forward from the data source, or created through enrichments (see "sentiment score" and "translated_text").

:::image type="content" source="media/knowledge-store-concept-intro/kstore-in-storage-explorer.png" alt-text="Skills read and write from enrichment tree" border="true":::

## Benefits of knowledge store

A knowledge store gives you structure, context, and actual content - gleaned from unstructured and semi-structured data files like blobs, image files that have undergone analysis, or even structured data, reshaped into new forms. In a [step-by-step walkthrough](knowledge-store-create-rest.md), you can see first-hand how a dense JSON document is partitioned out into substructures, reconstituted into new structures, and otherwise made available for downstream processes like machine learning and data science workloads.

Although it's useful to see what an AI enrichment pipeline can produce, the real potential of a knowledge store is the ability to reshape data. You might start with a basic skillset, and then iterate over it to add increasing levels of structure, which you can then combine into new structures, consumable in other apps besides Azure Cognitive Search.

Enumerated, the benefits of knowledge store include the following:

+ Consume enriched documents in [analytics and reporting tools](#tools-and-apps) other than search. Power BI with Power Query is a compelling choice, but any tool or app that can connect to Azure Storage can pull from a knowledge store that you create.

+ Refine an AI-indexing pipeline while debugging steps and skillset definitions. A knowledge store shows you the product of a skillset definition in an AI-indexing pipeline. You can use those results to design a better skillset because you can see exactly what the enrichments look like. You can use [Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md?tabs=windows) in Azure Storage to view the contents of a knowledge store.

+ Shape the data into new forms. The reshaping is codified in skillsets, but the point is that a skillset can now provide this capability. The [Shaper skill](cognitive-search-skill-shaper.md) in Azure Cognitive Search has been extended to accommodate this task. Reshaping allows you to define a projection that aligns with your intended use of the data while preserving relationships.

> [!VIDEO https://www.youtube.com/embed/XWzLBP8iWqg?version=3]

## Physical storage

Knowledge stores are created in your [Azure Storage account](../storage/common/storage-account-overview.md), using Azure Table Storage, Azure Blob Storage, or both. 

The data structures within Azure Storage are articulated through the `projections` element of a `knowledgeStore` definition in a Skillset. The projection defines a structure of the output so that it matches your intended use.

Projections can be articulated as tables, objects, or files, and you can have multiple sets (or *projection groups*) to create multiple data structures for different purposes.

```json
"knowledgeStore": { 
    "storageConnectionString": "<YOUR-AZURE-STORAGE-ACCOUNT-CONNECTION-STRING>", 
    "projections": [ 
        { 
            "tables": [ ], 
            "objects": [ ], 
            "files": [ ]
        },
        { 
            "tables": [ ], 
            "objects": [ ], 
            "files": [ ]
        }
```

The type of projection you specify in this structure determines the type of storage used by knowledge store.

+ Table Storage is used when you define `tables`. Define a table projection when you need tabular reporting structures for inputs to analytical tools or export as data frames to other data stores. You can specify multiple `tables` to get a subset or cross section of enriched documents. Within the same projection group, table relationships are preserved so that you can work with all of them.

+ Blob storage is used when you define `objects` or `files`. The physical representation of an `object` is a hierarchical JSON structure that represents an enriched document. A `file` is an image extracted from a document, transferred intact to Blob storage.

A single projection object contains one set of `tables`, `objects`, `files`, and for many scenarios, creating one projection might be enough. 

However, it is possible to create multiple sets of `table`-`object`-`file` projections, and you might do that if you want different data relationships. Within a set, data is related, assuming those relationships exist and can be detected. If you create additional sets, the documents in each group are never related. An example of using multiple projection groups might be if you want the same data projected for use with your online system and it needs to be represented a specific way, you also want the same data projected for use in a data science pipeline that is represented differently.

## Requirements 

[Azure Storage](../storage/index.yml) is required. It provides physical storage. You can use Blob Storage, Table Storage or both. Blob Storage is used for intact enriched documents, usually when the output is going to downstream processes. Table Storage is for slices of enriched documents, commonly used for analysis and reporting.

[Skillset](cognitive-search-working-with-skillsets.md) is required. It contains the `knowledgeStore` definition, and it determines the structure and composition of an enriched document. You cannot create a knowledge store using an empty skillset. You must have at least one skill in a skillset.

[Indexer](search-indexer-overview.md) is required. A skillset is invoked by an indexer, which drives the execution. Indexers come with their own set of requirements and attributes. Several of these attributes have a direct bearing on a knowledge store:

+ Indexers require a [supported Azure data source](search-indexer-overview.md#supported-data-sources) (the pipeline that ultimately creates the knowledge store starts by pulling data from a supported source on Azure). 

+ Indexers require a search index. An indexer requires that you provide an index schema, even if you never plan to use it. A minimal index has one string field, designated as the key.

+ Indexers provide optional field mappings, used to alias a source field to a destination field. If a default field mapping needs modification (to use a different name or type), you can create a [field mapping](search-indexer-field-mappings.md) within an indexer. For knowledge store output, the destination can be a field in a blob object or table.

+ Indexers have schedules and other properties, such as change detection mechanisms provided by various data sources, can also be applied to a knowledge store. For example, you can [schedule](search-howto-schedule-indexers.md) enrichment at regular intervals to refresh the contents. 

## Create a knowledge store

To create knowledge store, use the portal or an API.

### [**Azure portal**](#tab/kstore-portal)

[Create your first knowledge store in four steps](knowledge-store-connect-power-bi.md) using the **Import data** wizard. The wizard walks you through the following tasks:

1. Select a supported data source that provides the raw content.

1. Specify enrichment: attach a Cognitive Services resource, select skills, and specify a knowledge store. In this step, you will choose an Azure Storage account and choose whether to create objects, tables, or both.

1. Create an index schema. The wizard requires it and can infer one for you.

1. Run the wizard. Extraction, enrichment, and storage occur in this last step.

When you use the wizard, several additional tasks are handled internally that you would otherwise have to handle in code. First, the projections (definitions of physical data structures in Azure Storage) are created for you. Secondly, output field mappings that associate enriched content with fields in an index or project are defined internally. When you create a knowledge store manually, your code will need to cover these steps.

### [**REST**](#tab/kstore-rest)

REST API version `2020-06-30` can be used to create a knowledge store through additions to a skillset.

+ [Create Skillset (api-version=2020-06-30)](/rest/api/searchservice/create-skillset)
+ [Update Skillset (api-version=2020-06-30)](/rest/api/searchservice/update-skillset)

A `knowledgeStore` is defined within a [skillset](cognitive-search-working-with-skillsets.md), which in turn is invoked by an [indexer](search-indexer-overview.md). During enrichment, Azure Cognitive Search creates a space in your Azure Storage account and projects the enriched documents as blobs or into tables, depending on your configuration.

An easy way to explore is to [create your first knowledge store using Postman](knowledge-store-create-rest.md).

### [**.NET SDK**](#tab/kstore-dotnet)

For .NET developers, use the [KnowledgeStore Class](/dotnet/api/azure.search.documents.indexes.models.knowledgestore) in the Azure.Search.Documents client library.

---

<a name="tools-and-apps"></a>

## Connect with apps

Once the enrichments exist in storage, any tool or technology that connects to Azure Blob or Table Storage can be used to explore, analyze, or consume the contents. The following list is a start:

+ [Storage Explorer](knowledge-store-view-storage-explorer.md) to view enriched document structure and content. Consider this as your baseline tool for viewing knowledge store contents.

+ [Power BI](knowledge-store-connect-power-bi.md) for reporting and analysis. 

+ [Azure Data Factory](../data-factory/index.yml) for further manipulation.

<!-- ## Knowledge Store composition

The knowledge store consists of an annotation cache and projections. The *cache* is used by the service internally to cache the results from skills and track changes. A *projection* defines the schema and structure of the enrichments that match your intended use. 

Within Azure storage, projections can be articulated as tables or objects:

+ As an object, the projection maps to Blob storage, where the projection is saved to a container, within which are the objects or hierarchical representations in JSON for scenarios like a data science pipeline.

+ As a table, the projection maps to Table storage. A tabular representation preserves relationships for scenarios like data analysis or export as data frames for machine learning. The enriched projections can then be easily imported into other data stores. 

You can create multiple projections in a knowledge store to accommodate various constituencies in your organization. A developer might need access to the full JSON representation of an enriched document, while data scientists or analysts might want granular or modular data structures shaped by your skillset.

For instance, if one of the goals of the enrichment process is to also create a dataset used to train a model, projecting the data into the object store would be one way to use the data in your data science pipelines. Alternatively, if you want to create a quick Power BI dashboard based on the enriched documents the tabular projection would work well.

 -->

## Content lifecycle

Each time you run the indexer and skillset, the knowledge store is updated if the skillset or underlying source data has changed. Any changes picked up by the indexer are propagated through the enrichment process to the projections in the knowledge store, ensuring that your projected data is a current representation of content in the originating data source. 

Generally, pipeline processing can be an all-or-nothing operation, but you can [enable caching of enriched documents](cognitive-search-incremental-indexing-conceptual.md) to reuse existing enrichments in subsequent runs of the indexer and skillset.

<!-- When a source document is new or updated, all skills are run on that document. If only the skillset changes, reprocessing is scoped to just those skills and documents affected by your edit. -->

### Changes to a skillset

Suppose that you have a pipeline composed of multiple skills, operating over a large body of static data (for example, scanned documents). Now suppose you need to tweak one of the skills in the skillset. Rather than starting over,an indexer can determine which skill is affected, and reprocess only that skill. Projections that are unaffected by the change remain intact in the knowledge store.

### Changes in the data

Scenarios can vary considerably, but lets suppose instead of static data, you have volatile data that changes between indexer invocations. Given no changes to the skillset, you are charged for processing the delta of new and modified documents. The timestamp information varies by data source, but in a blob container, the indexer looks at the `lastmodified` date to determine which blobs need to be ingested.

> [!Note]
> While you can edit the data in the projections, any edits will be overwritten on the next pipeline invocation, assuming the document in source data is updated. 

### Deletions

Although an indexer creates and updates structures and content in Azure Storage, it does not delete them. Projections continue to exist even when the indexer or skillset is deleted. As the owner of the storage account, you should delete a projection if it is no longer needed. 

## Next steps

Knowledge store offers persistence of enriched documents, useful when designing a skillset, or the creation of new structures and content for consumption by any client applications capable of accessing an Azure Storage account.

The simplest approach for creating enriched documents is [through the portal](knowledge-store-create-portal.md), but you can also use Postman and the REST API, which is more useful if you want insight into how objects are created and referenced.

> [!div class="nextstepaction"]
> [Create a knowledge store using Postman and REST](knowledge-store-create-rest.md)

You could also take closer look at [projections](knowledge-store-projection-overview.md). For a tutorial that demonstrates advanced projections concepts like slicing, inline shaping and relationships, start with [Projection patterns for analysis in Power BI](knowledge-store-projections-examples.md).
