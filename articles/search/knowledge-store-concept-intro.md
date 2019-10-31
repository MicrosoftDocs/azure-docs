---
title: Introduction to knowledge store (preview)
titleSuffix: Azure Cognitive Search
description: Send enriched documents to Azure storage where you can view, reshape, and consume enriched documents in Azure Cognitive Search and in other applications.

author: HeidiSteen
manager: nitinme
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---

# Introduction to knowledge stores in Azure Cognitive Search

> [!Note]
> Knowledge store is in preview and not intended for production use. The [REST API version 2019-05-06-Preview](search-api-preview.md) provides this feature. There is no .NET SDK support at this time.
>

Knowledge store is a feature of Azure Cognitive Search that persists output from an [AI enrichment pipeline](cognitive-search-concept-intro.md) for later analysis or other downstream processing. An *enriched document* is a pipeline's output, created from content that has been extracted, structured, and analyzed using AI processes. In a standard AI pipeline, enriched documents are transitory, used only during indexing and then discarded. With knowledge store, enriched documents are preserved. 

If you have used cognitive skills with Azure Cognitive Search in the past, you already know that *skillsets* move a document through a sequence of enrichments. The outcome can be a search index, or (new in this preview) projections in a knowledge store. The two outputs, search index and knowledge store, share the same content, but are stored and used in very different ways.

Physically, a knowledge store is [Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-account-overview), either Azure Table storage, Azure Blob storage, or both. Any tool or process that can connect to Azure Storage can consume the contents of a knowledge store.

![Knowledge store in pipeline diagram](./media/knowledge-store-concept-intro/knowledge-store-concept-intro.svg "Knowledge store in pipeline diagram")

To use knowledge store, add a `knowledgeStore` element to a skillset that defines step-wise operations in an indexing pipeline. During execution, Azure Cognitive Search creates a space in your Azure storage account and projects the enriched documents as blobs or into tables, depending on your configuration.

## Benefits of knowledge store

A knowledge store gives you structure, context, and actual content - gleaned from unstructured and semi-structured data files like blobs, image files that have undergone analysis, or even structured data that is reshaped into new forms. In a [step-by-step walkthrough](knowledge-store-howto.md), you can see first-hand how a dense JSON document is partitioned out into substructures, reconstituted into new structures, and otherwise made available for downstream processes like machine learning and data science workloads.

Although it's useful to see what an AI enrichment pipeline can produce, the real power of knowledge store is the ability to reshape data. You might start with a basic skillset, and then iterate over it to add increasing levels of structure, which you can then combine into new structures, consumable in other apps besides Azure Cognitive Search.

Enumerated, the benefits of knowledge store include the following:

+ Consume enriched documents in [analytics and reporting tools](#tools-and-apps) other than search. Power BI with Power Query is a compelling choice, but any tool or app that can connect to Azure storage can pull from a knowledge store that you create.

+ Refine an AI-indexing pipeline while debugging steps and skillset definitions. A knowledge store shows you the product of a skillset definition in an AI-indexing pipeline. You can use those results to design a better skillset because you can see exactly what the enrichments look like. You can use [Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer?tabs=windows) in Azure storage to view the contents of a knowledge store.

+ Shape the data into new forms. The reshaping is codified in skillsets, but the point is that a skillset can now provide this capability. The [Shaper skill](cognitive-search-skill-shaper.md) in Azure Cognitive Search has been extended to accommodate this task. Reshaping allows you to define a projection that aligns with your intended use of the data while preserving relationships.

> [!Note]
> New to AI enrichment and cognitive skills? Azure Cognitive Search integrates with Cognitive Services Vision and Language features to extract and enrich source data using Optical Character Recognition (OCR) over image files, entity recognition and key phrase extraction from text files, and more. For more information, see [AI enrichment in Azure Cognitive Search](cognitive-search-concept-intro.md).

## Creating a knowledge store

A knowledge store is part of a [skillset](cognitive-search-working-with-skillsets.md), which in turn is part of an [indexer](search-indexer-overview.md). 

In this preview, you can create a knowledge store using the REST API and `api-version=2019-05-06-Preview`, or through the **Import data** wizard in the portal.

### JSON representation of a knowledge store

The following JSON specifies a `knowledgeStore`, which is part of a skillset, which is invoked by an indexer (not shown). If you are already familiar with AI enrichment, a skillset determines the creation, organization, and substance of each enriched document. A skillset must contain at least one skill, most likely a Shaper skill if you are modulating data structures.

A `knowledgeStore` consists of a connection and projections. 

+ Connection is to a storage account in the same region as Azure Cognitive Search. 

+ Projections are tables-objects pairs. `Tables` define the physical expression of enriched documents in Azure Table storage. `Objects` define the physical objects in Azure Blob storage.

```json
{
  "name": "my-new-skillset",
  "description": "Example showing knowledgeStore placement in a skillset.",
  "skills":
  [
    {
    "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
    "context": "/document/content/phrases/*",
    "inputs": [
        {
        "name": "text",
        "source": "/document/content/phrases/*"
        },
        {
        "name": "sentiment",
        "source": "/document/content/phrases/*/sentiment"
        }
    ],
    "outputs": [
        {
        "name": "output",
        "targetName": "analyzedText"
        }
    ]
    },
  ],
  "cognitiveServices": 
    {
    "@odata.type": "#Microsoft.Azure.Search.CognitiveServicesByKey",
    "description": "mycogsvcs resource in West US 2",
    "key": "<your key goes here>"
    },
  "knowledgeStore": { 
    "storageConnectionString": "<your connection string goes here>", 
    "projections": [ 
        { 
            "tables": [  
            { "tableName": "Reviews", "generatedKeyName": "ReviewId", "source": "/document/Review" , "sourceContext": null, "inputs": []}, 
            { "tableName": "Sentences", "generatedKeyName": "SentenceId", "source": "/document/Review/Sentences/*", "sourceContext": null, "inputs": []}, 
            { "tableName": "KeyPhrases", "generatedKeyName": "KeyPhraseId", "source": "/document/Review/Sentences/*/KeyPhrases", "sourceContext": null, "inputs": []}, 
            { "tableName": "Entities", "generatedKeyName": "EntityId", "source": "/document/Review/Sentences/*/Entities/*" ,"sourceContext": null, "inputs": []} 

            ], 
            "objects": [ 
               
            ]      
        },
        { 
            "tables": [ 
            ], 
            "objects": [ 
                { 
                "storageContainer": "Reviews", 
                "format": "json", 
                "source": "/document/Review", 
                "key": "/document/Review/Id" 
                } 
            ]      
        }        
    ]     
    } 
}
```

### Sources of data for a knowledge store

If a knowledge store is output from an AI enrichment pipeline, what are the inputs? The original data that you want to extract, enrich, and ultimately save to a knowledge store can originate from any Azure data source supported by search indexers: 

* [Azure Cosmos DB](search-howto-index-cosmosdb.md)

* [Azure Blob storage](search-howto-indexing-azure-blob-storage.md)

* [Azure Table storage](search-howto-indexing-azure-tables.md)

* [Azure SQL](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)

The indexers and skillsets you create extract and enrich or transform this content as part of an indexing workload, and then save the results to a knowledge store.

### REST APIs used in creation of a knowledge store

Only two APIs have the extensions required for creating a knowledge store (Create Skillset and Create Indexer). Other APIs are used as-is.

| Object | REST API | Description |
|--------|----------|-------------|
| data source | [Create Data Source](https://docs.microsoft.com/rest/api/searchservice/create-data-source)  | A resource identifying an external Azure data source providing source data used to create enriched documents.  |
| skillset | [Create Skillset (api-version=2019-05-06-Preview)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)  | A resource coordinating the use of [built-in skills](cognitive-search-predefined-skills.md) and [custom cognitive skills](cognitive-search-custom-skill-interface.md) used in an enrichment pipeline during indexing. A skillset has a `knowledgeStore` definition as a child element. |
| index | [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index)  | A schema expressing an search index. Fields in the index map to fields in source data or to fields manufactured during the enrichment phase (for example, a field for organization names created by entity recognition). |
| indexer | [Create Indexer (api-version=2019-05-06)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)  | A resource defining components used during indexing: including a data source, a skillset, field associations from source and intermediary data structures to target index, and the index itself. Running the indexer is the trigger for data ingestion and enrichment. The output is a search index based on the index schema, populated with source data, enriched through skillsets.  |

### Physical composition of a knowledge store

 A *projection*, which is an element of a `knowledgeStore` definition,  articulates the schema and structure of output so that it matches your intended use. You can define multiple projections if you have applications that consume the data in different formats and shapes. 

Projections can be articulated as objects or tables:

+ As an object, the projection maps to Blob storage, where the projection is saved to a container, within which are the objects or hierarchical representations in JSON for scenarios like a data science pipeline.

+ As a table, the projection maps to Table storage. A tabular representation preserves relationships for scenarios like data analysis or export as data frames for machine learning. The enriched projections can then be easily imported into other data stores. 

You can create multiple projections in a knowledge store to accommodate various constituencies in your organization. A developer might need access to the full JSON representation of an enriched document, while data scientists or analysts might want granular or modular data structures shaped by your skillset.

For example, if one of the goals of the enrichment process is to also create a dataset used to train a model, projecting the data into the object store would be one way to use the data in your data science pipelines. Alternatively, if you want to create a quick Power BI dashboard based on the enriched documents the tabular projection would work well.

<a name="tools-and-apps"></a>

## Connecting with tools and apps

Once the enrichments exist in storage, any tool or technology that connects to Azure Blob or Table storage can be used to explore, analyze, or consume the contents. The following list is a start:

+ [Storage Explorer](knowledge-store-view-storage-explorer.md) to view enriched document structure and content. Consider this as your baseline tool for viewing knowledge store contents.

+ [Power BI](knowledge-store-connect-power-bi.md) for the reporting and analysis tools if you have numeric data.

+ [Azure Data Factory](https://docs.microsoft.com/azure/data-factory/) for further manipulation.

## Next steps

Knowledge store offers persistence of enriched documents, useful when designing a skillset, or the creation of new structures and content for consumption by any client applications capable of accessing an Azure Storage account.

The simplest approach for creating enriched documents is through the **Import data** wizard, but you can also use Postman and REST API, which is more useful if you want insight into how objects are created and referenced.

> [!div class="nextstepaction"]
> [Create a knowledge store using the portal](knowledge-store-create-portal.md)
> [Create a knowledge store using Postman and the REST APi](knowledge-store-create-rest.md)
