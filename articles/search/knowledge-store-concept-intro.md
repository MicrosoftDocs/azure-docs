---
title: Introduction to knowledge store (preview)
titleSuffix: Azure Cognitive Search
description: Send enriched documents to Azure Storage where you can view, reshape, and consume enriched documents in Azure Cognitive Search and in other applications. This feature is in public preview.

author: HeidiSteen
manager: nitinme
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 12/11/2019
---

# Introduction to knowledge stores in Azure Cognitive Search

> [!IMPORTANT] 
> Knowledge store is currently in public preview. Preview functionality is provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 
> The [REST API version 2019-05-06-Preview](search-api-preview.md) provides preview features. There is currently limited portal support, and no .NET SDK support.

A knowledge store is a feature of Azure Cognitive Search that persists output from an [AI enrichment pipeline](cognitive-search-concept-intro.md) for later analysis or other downstream processing. An *enriched document* is a pipeline's output, created from content that has been extracted, structured, and analyzed using AI processes. In a standard AI pipeline, enriched documents are transitory, used only during indexing and then discarded. With knowledge store, enriched documents are preserved. 

If you have used cognitive skills with Azure Cognitive Search in the past, you already know that *skillsets* move a document through a sequence of enrichments. The outcome can be a search index, or (new in this preview) projections in a knowledge store. The two outputs, search index and knowledge store, derive from the same content input, but output is structured, stored, and used in very different ways.

Physically, a knowledge store is [Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-account-overview), either Azure Table storage, Azure Blob storage, or both. Any tool or process that can connect to Azure Storage can consume the contents of a knowledge store.

![Knowledge store in pipeline diagram](./media/knowledge-store-concept-intro/knowledge-store-concept-intro.svg "Knowledge store in pipeline diagram")

## Benefits of knowledge store

A knowledge store gives you structure, context, and actual content - gleaned from unstructured and semi-structured data files like blobs, image files that have undergone analysis, or even structured data that is reshaped into new forms. In a [step-by-step walkthrough](knowledge-store-howto.md), you can see first-hand how a dense JSON document is partitioned out into substructures, reconstituted into new structures, and otherwise made available for downstream processes like machine learning and data science workloads.

Although it's useful to see what an AI enrichment pipeline can produce, the real potential of a knowledge store is the ability to reshape data. You might start with a basic skillset, and then iterate over it to add increasing levels of structure, which you can then combine into new structures, consumable in other apps besides Azure Cognitive Search.

Enumerated, the benefits of knowledge store include the following:

+ Consume enriched documents in [analytics and reporting tools](#tools-and-apps) other than search. Power BI with Power Query is a compelling choice, but any tool or app that can connect to Azure Storage can pull from a knowledge store that you create.

+ Refine an AI-indexing pipeline while debugging steps and skillset definitions. A knowledge store shows you the product of a skillset definition in an AI-indexing pipeline. You can use those results to design a better skillset because you can see exactly what the enrichments look like. You can use [Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer?tabs=windows) in Azure Storage to view the contents of a knowledge store.

+ Shape the data into new forms. The reshaping is codified in skillsets, but the point is that a skillset can now provide this capability. The [Shaper skill](cognitive-search-skill-shaper.md) in Azure Cognitive Search has been extended to accommodate this task. Reshaping allows you to define a projection that aligns with your intended use of the data while preserving relationships.

> [!Note]
> New to AI enrichment and cognitive skills? Azure Cognitive Search integrates with Cognitive Services Vision and Language features to extract and enrich source data using Optical Character Recognition (OCR) over image files, entity recognition and key phrase extraction from text files, and more. For more information, see [AI enrichment in Azure Cognitive Search](cognitive-search-concept-intro.md).

## Requirements 

Azure Storage is required. It provides physical storage. You can use Blob storage, Table storage or both. Blob storage is used for intact enriched documents, usually when the output is going to downstream processes. Table storage is for slices of enriched documents, commonly used for analysis and reporting.

Skillset is required. It contains the `knowledgeStore` definition, and it determines the structure and composition of an enriched document. You cannot create a knowledge store using an empty skillset. You must have at least one skill in a skillset 

Indexer is required. A skillset is invoked by an indexer, thus an indexer drives the execution. Indexers come with their own set of requirements and attributes. Several of these attributes have a direct bearing on a knowledge store.

+ One requirement is a [supported Azure data source](search-indexer-overview.md#supported-data-sources) (the pipeline that ultimately creates the knowledge store starts by pulling data from a supported source on Azure). 
+ A second requirement is a search index. An indexer requires that you provide an index schema, even if you never plan to use it. The only requirement of an index schema is that you specify one field as the key.
+ Field mappings are optional, used to alias a source field to a destination field. If a default field mapping needs modification (name or type), you can create a field mapping within an indexer. For knowledge store output, the destination can be a field in a blob object or table.
+ Schedules and other indexer properties, such as change detection mechanisms provided by various data sources, can also be applied to a knowledge store. For example, you can schedule enrichment at regular interals to refresh the contents. 

## Create a knowledge store

To use knowledge store, use the portal or the preview REST API (`api-version=2019-05-06-Preview`) to add a `knowledgeStore` definition.

A `knowledgeStore` definition is contained within a [skillset](cognitive-search-working-with-skillsets.md), which in turn is invoked by an [indexer](search-indexer-overview.md). A skillset defines step-wise operations in an indexing pipeline. During pipeline execution, Azure Cognitive Search creates a space in your Azure Storage account and projects the enriched documents as blobs or into tables, depending on your configuration.

### Use the portal

Run **Import data** wizard. For initial exploration, this is the fastest way to create your first knowledge store.

Start by choosing a supported data source. The next step is where you specify end-to-end enrichment: attaching a resource, selecting skills, and setting options for creating a knowledge store. Extraction, enrichment, and storage occurs after the last step when you run the wizard.

### Use the preview REST API

Currently, the preview REST API is the only mechanism by which you can create a knowledge store. Reference content for this preview feature is located in [Preview REST API feference](#kstore-rest-api) section of this article. 

## Physical composition

A *projection*, which is an element of a `knowledgeStore` definition,  articulates the schema and structure of output so that it matches your intended use. You can define multiple projections if you have applications that consume the data in different formats and shapes. 

Projections can be articulated as objects or tables:

+ As an object, the projection maps to Blob storage, where the projection is saved to a container, within which are the objects or hierarchical representations in JSON for scenarios like a data science pipeline.

+ As a table, the projection maps to Table storage. A tabular representation preserves relationships for scenarios like data analysis or export as data frames for machine learning. The enriched projections can then be easily imported into other data stores. 

You can create multiple projections in a knowledge store to accommodate various constituencies in your organization. A developer might need access to the full JSON representation of an enriched document, while data scientists or analysts might want granular or modular data structures shaped by your skillset.

For example, if one of the goals of the enrichment process is to also create a dataset used to train a model, projecting the data into the object store would be one way to use the data in your data science pipelines. Alternatively, if you want to create a quick Power BI dashboard based on the enriched documents the tabular projection would work well.

<a name="tools-and-apps"></a>

## Connect with tools and apps

Once the enrichments exist in storage, any tool or technology that connects to Azure Blob or Table storage can be used to explore, analyze, or consume the contents. The following list is a start:

+ [Storage Explorer](knowledge-store-view-storage-explorer.md) to view enriched document structure and content. Consider this as your baseline tool for viewing knowledge store contents.

+ [Power BI](knowledge-store-connect-power-bi.md) for the reporting and analysis tools if you have numeric data.

+ [Azure Data Factory](https://docs.microsoft.com/azure/data-factory/) for further manipulation.

<a name="kstore-rest-api"></a>

## Preview REST API reference

In this preview, you can create a knowledge store using the **Create Skillset** REST API `api-version=2019-05-06-Preview` that contains a `knowledgeStore` definition.

### Create Skillset (api-version=2019-05-06-Preview)

A skillset is a resource coordinating the use of [built-in skills](cognitive-search-predefined-skills.md) and [custom cognitive skills](cognitive-search-custom-skill-interface.md) used in an enrichment pipeline during indexing. 

This section extends the [Create Skillset](https://docs.microsoft.com/rest/api/searchservice/create-skillset) reference to include additional elements that creates a knowledge store. In the preview API, a skillset has a `knowledgeStore` definition as a child element.

### JSON representation of a knowledge store

The following JSON specifies a `knowledgeStore`, which is part of a skillset, which is invoked by an indexer (not shown). If you are already familiar with AI enrichment, a skillset determines the creation, organization, and substance of each enriched document. A skillset must contain at least one skill, most likely a Shaper skill if you are modulating data structures.

A `knowledgeStore` consists of a connection and projections. 

+ Connection is to a storage account in the same region as Azure Cognitive Search. 

+ Projections can be tabular, JSON objects or files. `Tables` define the physical expression of enriched documents in Azure Table storage. `Objects` define the physical JSON objects in Azure Blob storage. `Files` are binaries like images that were extracted from the document that will be persisted.

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
               
            ], 
            "files": [

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
            ],
            "files": [
                
            ]  
        }        
    ]     
    } 
}
```

This sample does not contain any images, for an example of how to use file projections see [Working with projections](knowledge-store-projection-overview.md).

## Next steps

Knowledge store offers persistence of enriched documents, useful when designing a skillset, or the creation of new structures and content for consumption by any client applications capable of accessing an Azure Storage account.

The simplest approach for creating enriched documents is [through the portal](knowledge-store-create-portal.md), but you can also use Postman and REST API, which is more useful if you want insight into how objects are created and referenced.

> [!div class="nextstepaction"]
> [Create a knowledge store using Postman and REST](knowledge-store-create-rest.md)
