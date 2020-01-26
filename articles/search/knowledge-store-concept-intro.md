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

Knowledge store is a feature of Azure Cognitive Search that persists output from an [AI enrichment pipeline](cognitive-search-concept-intro.md) for independent analysis or downstream processing. An *enriched document* is a pipeline's output, created from content that has been extracted, structured, and analyzed using AI processes. In a standard AI pipeline, enriched documents are transitory, used only during indexing and then discarded. With knowledge store, enriched documents are preserved. 

If you have used cognitive skills in the past, you already know that *skillsets* move a document through a sequence of enrichments. The outcome can be a search index, or (new in this preview) projections in a knowledge store. The two outputs, search index and knowledge store, are products of the same pipeline; derived from the same inputs, but resulting in output that is structured, stored, and used in very different ways.

Physically, a knowledge store is [Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-account-overview), either Azure Table storage, Azure Blob storage, or both. Any tool or process that can connect to Azure Storage can consume the contents of a knowledge store.

![Knowledge store in pipeline diagram](./media/knowledge-store-concept-intro/knowledge-store-concept-intro.svg "Knowledge store in pipeline diagram")

## Benefits of knowledge store

A knowledge store gives you structure, context, and actual content - gleaned from unstructured and semi-structured data files like blobs, image files that have undergone analysis, or even structured data, reshaped into new forms. In a [step-by-step walkthrough](knowledge-store-create-rest.md), you can see first-hand how a dense JSON document is partitioned out into substructures, reconstituted into new structures, and otherwise made available for downstream processes like machine learning and data science workloads.

Although it's useful to see what an AI enrichment pipeline can produce, the real potential of a knowledge store is the ability to reshape data. You might start with a basic skillset, and then iterate over it to add increasing levels of structure, which you can then combine into new structures, consumable in other apps besides Azure Cognitive Search.

Enumerated, the benefits of knowledge store include the following:

+ Consume enriched documents in [analytics and reporting tools](#tools-and-apps) other than search. Power BI with Power Query is a compelling choice, but any tool or app that can connect to Azure Storage can pull from a knowledge store that you create.

+ Refine an AI-indexing pipeline while debugging steps and skillset definitions. A knowledge store shows you the product of a skillset definition in an AI-indexing pipeline. You can use those results to design a better skillset because you can see exactly what the enrichments look like. You can use [Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer?tabs=windows) in Azure Storage to view the contents of a knowledge store.

+ Shape the data into new forms. The reshaping is codified in skillsets, but the point is that a skillset can now provide this capability. The [Shaper skill](cognitive-search-skill-shaper.md) in Azure Cognitive Search has been extended to accommodate this task. Reshaping allows you to define a projection that aligns with your intended use of the data while preserving relationships.

> [!Note]
> New to AI enrichment and cognitive skills? Azure Cognitive Search integrates with Cognitive Services Vision and Language features to extract and enrich source data using Optical Character Recognition (OCR) over image files, entity recognition and key phrase extraction from text files, and more. For more information, see [AI enrichment in Azure Cognitive Search](cognitive-search-concept-intro.md).

## Physical storage

The physical expression of a knowledge store is articulated through the `projections` element of a `knowledgeStore` definition in a Skillset. The projection defines a structure of the output so that it matches your intended use.

Projections can be articulated as tables, objects, or files.

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

+ Table storage is used when you define `tables`. Define a table projection when you need tabular reporting structures for inputs to analytical tools or export as data frames to other data stores. You can specify multiple `tables` to get a subset or cross section of enriched documents. Within the same projection group, table relationships are preserved so that you can work with all of them.

+ Blob storage is used when you define `objects` or `files`. The physical representation of an `object` is a hierarchical JSON structure that represents an enriched document. A `file` is an image extracted from a document, transferred intact to Blob storage.

A single projection object contains one set of `tables`, `objects`, `files`, and for many scenarios, creating one projection might be enough. 

However, it is possible to create multiple sets of `table`-`object`-`file` projections, and you might do that if you want different data relationships. Within a set, data is related, assuming those relationships exist and can be detected. If you create additional sets, the documents in each group are never related. An example of using multiple projection groups might be if you want the same data projected for use with your online system and it needs to be represented a specific way, you also want the same data projected for use in a data science pipeline that is represented differently.

## Requirements 

[Azure Storage](https://docs.microsoft.com/azure/storage/) is required. It provides physical storage. You can use Blob storage, Table storage or both. Blob storage is used for intact enriched documents, usually when the output is going to downstream processes. Table storage is for slices of enriched documents, commonly used for analysis and reporting.

[Skillset](cognitive-search-working-with-skillsets.md) is required. It contains the `knowledgeStore` definition, and it determines the structure and composition of an enriched document. You cannot create a knowledge store using an empty skillset. You must have at least one skill in a skillset.

[Indexer](search-indexer-overview.md) is required. A skillset is invoked by an indexer, which drives the execution. Indexers come with their own set of requirements and attributes. Several of these attributes have a direct bearing on a knowledge store:

+ Indexers require a [supported Azure data source](search-indexer-overview.md#supported-data-sources) (the pipeline that ultimately creates the knowledge store starts by pulling data from a supported source on Azure). 

+ Indexers require a search index. An indexer requires that you provide an index schema, even if you never plan to use it. A minimal index has one string field, designated as the key.

+ Indexers provide optional field mappings, used to alias a source field to a destination field. If a default field mapping needs modification (to use a different name or type), you can create a [field mapping](search-indexer-field-mappings.md) within an indexer. For knowledge store output, the destination can be a field in a blob object or table.

+ Indexers have schedules and other properties, such as change detection mechanisms provided by various data sources, can also be applied to a knowledge store. For example, you can [schedule](search-howto-schedule-indexers.md) enrichment at regular intervals to refresh the contents. 

## How to create a knowledge store

To create knowledge store, use the portal or the preview REST API (`api-version=2019-05-06-Preview`).

### Use the Azure portal

The **Import data** wizard includes options for creating a knowledge store. For initial exploration, [create your first knowledge store in four steps](knowledge-store-connect-power-bi.md).

1. Select a supported data source.

1. Specify enrichment: attach a resource, select skills, and specify a knowledge store. 

1. Create an index schema. The wizard requires it and can infer one for you.

1. Run the wizard. Extraction, enrichment, and storage occur in this last step.

### Use Create Skillset and the preview REST API

A `knowledgeStore` is defined within a [skillset](cognitive-search-working-with-skillsets.md), which in turn is invoked by an [indexer](search-indexer-overview.md). During enrichment, Azure Cognitive Search creates a space in your Azure Storage account and projects the enriched documents as blobs or into tables, depending on your configuration.

Currently, the preview REST API is the only mechanism by which you can create a knowledge store programmatically. An easy way to explore is [create your first knowledge store using Postman and the REST API](knowledge-store-create-rest.md).

Reference content for this preview feature is located in the [API reference](#kstore-rest-api) section of this article. 

<a name="tools-and-apps"></a>

## How to connect with tools and apps

Once the enrichments exist in storage, any tool or technology that connects to Azure Blob or Table storage can be used to explore, analyze, or consume the contents. The following list is a start:

+ [Storage Explorer](knowledge-store-view-storage-explorer.md) to view enriched document structure and content. Consider this as your baseline tool for viewing knowledge store contents.

+ [Power BI](knowledge-store-connect-power-bi.md) for reporting and analysis. 

+ [Azure Data Factory](https://docs.microsoft.com/azure/data-factory/) for further manipulation.

<a name="kstore-rest-api"></a>

## API reference

This section is a version of the [Create Skillset (REST API)](https://docs.microsoft.com/rest/api/searchservice/create-skillset) reference doc, modified to include a `knowledgeStore` definition. 

### Example - knowledgeStore embedded in a Skillset

The following example shows `knowledgeStore` at the bottom of a skillset definition. 

* Use **POST** or **PUT** to formulate the request.
* Use the `api-version=2019-05-06-Preview` version of the REST API to access knowledge store functionality. 

```http
POST https://[servicename].search.windows.net/skillsets?api-version=2019-05-06-Preview
api-key: [admin key]
Content-Type: application/json
```

The body of request is a JSON document that defines a skillset, which includes `knowledgeStore`.

```json
{
  "name": "my-skillset-name",
  "description": "Extract organization entities and generate a positive-negative sentiment score from each document.",
  "skills":
  [
    {
      "@odata.type": "#Microsoft.Skills.Text.EntityRecognitionSkill",
      "categories": [ "Organization" ],
      "defaultLanguageCode": "en",
      "inputs": [
        {
          "name": "text",
          "source": "/document/content"
        }
      ],
      "outputs": [
        {
          "name": "organizations",
          "targetName": "organizations"
        }
      ]
    },
    {
      "@odata.type": "#Microsoft.Skills.Text.SentimentSkill",
      "inputs": [
        {
          "name": "text",
          "source": "/document/content"
        }
      ],
      "outputs": [
        {
          "name": "score",
          "targetName": "mySentiment"
        }
      ]
    },
  ],
  "cognitiveServices": 
    {
    "@odata.type": "#Microsoft.Azure.Search.CognitiveServicesByKey",
    "description": "mycogsvcs resource in West US 2",
    "key": "<YOUR-COGNITIVE-SERVICES-KEY>"
    },
    "knowledgeStore": { 
        "storageConnectionString": "<YOUR-AZURE-STORAGE-ACCOUNT-CONNECTION-STRING>", 
        "projections": [ 
            { 
                "tables": [  
                { "tableName": "Organizations", "generatedKeyName": "OrganizationId", "source": "/document/organizations*"}, 
                { "tableName": "Sentiment", "generatedKeyName": "SentimentId", "source": "/document/mySentiment"}
                ], 
                "objects": [ ], 
                "files": [  ]       
            }    
        ]     
    } 
}
```

### Request body syntax  

The following JSON specifies a `knowledgeStore`, which is part of a [`skillset`](https://docs.microsoft.com/rest/api/searchservice/create-skillset), which is invoked by an `indexer` (not shown). If you are already familiar with AI enrichment, a skillset determines the composition of an enriched document. A skillset must contain at least one skill, most likely a Shaper skill if you are modulating data structures.

The syntax for structuring the request payload is as follows.

```json
{   
    "name" : "Required for POST, optional for PUT requests which sets the name on the URI",  
    "description" : "Optional. Anything you want, or null",  
    "skills" : "Required. An array of skills. Each skill has an odata.type, name, input and output parameters",
    "cognitiveServices": "A key to Cognitive Services, used for billing.",
    "knowledgeStore": { 
        "storageConnectionString": "<YOUR-AZURE-STORAGE-ACCOUNT-CONNECTION-STRING>", 
        "projections": [ 
            { 
                "tables": [ 
                    { "tableName": "<NAME>", "generatedKeyName": "<FIELD-NAME>", "source": "<DOCUMENT-PATH>" },
                    { "tableName": "<NAME>", "generatedKeyName": "<FIELD-NAME>", "source": "<DOCUMENT-PATH>" },
                    . . .
                ], 
                "objects": [ 
                    {
                    "storageContainer": "<BLOB-CONTAINER-NAME>", 
                    "source": "<DOCUMENT-PATH>", 
                    }
                ], 
                "files": [ 
                    {
                    "storageContainer": "<BLOB-CONTAINER-NAME>",
                    "source": "/document/normalized_images/*"
                    }
                ]  
            },
            {
                "tables": [ ],
                "objects": [ ],
                "files":  [ ]
            }  
        ]     
    } 
}
```

A `knowledgeStore` has two properties: a `storageConnectionString` to an Azure Storage account, and `projections` that defines physical storage. You can use any storage account, but it's cost-effective to use services in the same region.

A `projections` collection contains projection objects. Each projection object must have `tables`, `objects`, `files` (one of each), which are either specified or null. The syntax above shows two objects, one fully specified and the other fully null. Within a projection object, once it is expressed in storage, any relationships among the data, if detected, are preserved. 

Create as many projection objects as you need to support isolation and specific scenarios (for example, data structures used for exploration, versus those needed in a data science workload). You can get isolation and customization for specific scenarios by setting `source` and `storageContainer` or `table` to different values within an object. For more information and examples, see [Working with projections in a knowledge store](knowledge-store-projection-overview.md).

|Property      | Applies to | Description|  
|--------------|------------|------------|  
|`storageConnectionString`| `knowledgeStore` | Required. In this format: `DefaultEndpointsProtocol=https;AccountName=<ACCOUNT-NAME>;AccountKey=<ACCOUNT-KEY>;EndpointSuffix=core.windows.net`|  
|`projections`| `knowledgeStore` | Required. A collection of property objects consisting of `tables`, `objects`, `files` and their respective properties. Unused projections can be set to null.|  
|`source`| All projections| The path to the node of the enrichment tree that is the root of the projection. This node is the output of any of the skills in the skillset. Paths start with `/document/`, representing the enriched document but can be extended to `/document/content/` or to nodes within the document tree. Examples: `/document/countries/*` (all countries), or `/document/countries/*/states/*` (all states in all countries). For more information on document paths, see [Skillset concepts and composition](cognitive-search-working-with-skillsets.md).|
|`tableName`| `tables`| A table to create in Azure Table storage. |
|`storageContainer`| `objects`, `files`| Name of a container to create in Azure Blob storage. |
|`generatedKeyName`| `tables`| A column created in the table that uniquely identifies a document. The enrichment pipeline populates this column with generated values.|


### Response  

 For a successful request, you should see status code "201 Created". By default, the response body will contain the JSON for the skillset definition that was created. Recall that the knowledge store is not created until you invoke an indexer that references this skillset.

## Next steps

Knowledge store offers persistence of enriched documents, useful when designing a skillset, or the creation of new structures and content for consumption by any client applications capable of accessing an Azure Storage account.

The simplest approach for creating enriched documents is [through the portal](knowledge-store-create-portal.md), but you can also use Postman and REST API, which is more useful if you want insight into how objects are created and referenced.

> [!div class="nextstepaction"]
> [Create a knowledge store using Postman and REST](knowledge-store-create-rest.md)
