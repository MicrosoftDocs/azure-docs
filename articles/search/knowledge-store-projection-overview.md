---
title: Projection concepts
titleSuffix: Azure Cognitive Search
description: Introduces projection concepts and best practices. If you are creating a knowledge store in Cognitive Search, projections will determine the type, quantity, and composition of objects in Azure Storage.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/15/2021
---

# Knowledge store "projections" in Azure Cognitive Search

Projections are the physical tables, objects, and files in a [**knowledge store**](knowledge-store-concept-intro.md) that accept content from a Cognitive Search AI enrichment pipeline. If you're creating a knowledge store, defining and shaping projections is most of the work.

This article introduces projection concepts and workflow so that you have some background before you start coding.

Projections are defined in Cognitive Search skillsets, but the end results are the table, object, and image file projections in Azure Storage.

:::image type="content" source="media/knowledge-store-concept-intro/projections-azure-storage.png" alt-text="Projections expressed in Azure Storage" border="true":::

## Types of projections and how they're used

A knowledge store is a logical construction that's physically expressed as a loose collection of tables, JSON objects, or binary image files in Azure Storage.

| Projection | Storage | Usage |
|------------|---------|-------|
| [Tables](knowledge-store-projection-overview.md#define-a-table-projection) | Azure Table Storage | Used for data that's best represented as rows and columns, or whenever you need granular representations of your data (for example, as data frames). Table projections allow you to define a schematized shape, using a [Shaper skill or use inline shaping](knowledge-store-projection-shape.md) to specify columns and rows. You can organize content into multiple tables based on familiar normalization principles. Tables that are in the same group are automatically related. |
| [Objects](knowledge-store-projection-overview.md#define-an-object-projection) | Azure Blob Storage | Used when you need the full JSON representation of your data and enrichments in one JSON document. As with table projections, only valid JSON objects can be projected as objects, and shaping can help you do that. |
| [Files](knowledge-store-projection-overview.md#define-a-file-projection) | Azure Blob Storage | Used when you need to save normalized, binary image files. |

## Projection definition

Projections are specified under the "knowledgeStore" property of a [skillset](/rest/api/searchservice/create-skillset). Projection definitions are used during indexer invocation to create and load objects in Azure Storage with enriched content. If you are unfamiliar with these concepts, start with [AI enrichment](cognitive-search-concept-intro.md) for an introduction.

The following example illustrates the placement of projections under knowledgeStore, and the basic construction. The name, type, and content source make up a projection definition.

```json
"knowledgeStore" : {
    "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<Acct Name>;AccountKey=<Acct Key>;",
    "projections": [
      {
        "tables": [
          { "tableName": "ks-museums", "generatedKeyName": "Documentid", "source": "/document/tableprojection" },
          { "tableName": "ks-museumsEntities", "generatedKeyName": "Entitiesid","source": "/document/tableprojection/Entities/*" }
        ],
        "objects": [
          { "storageContainer": "ks-museums", "generatedKeyName": "museumsKey", "source": "/document/objectprojection" }
        ],
        "files": [ ]
      }
    ]
```

## Projection groups

Projections are an array of complex collections, which means that you can specify multiple sets of each type. It's common to use just one projection group, but you might use multiple if storage requirements include supporting different tools and scenarios. For example, you might use one group for design and debug of a skillset, while a second set collects output used for an online app, with a third for data science workloads.

The same skillset output is used to populate all groups under projections. The following example shows two projection groups.

```json
"knowledgeStore" : {
    "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<Acct Name>;AccountKey=<Acct Key>;",
    "projections": [
        {
            "tables": [],
            "objects": [],
            "files": []
        }, 
        {
            "tables": [],
            "objects": [],
            "files": []
        }
    ]
}
```

Each set of tables, objects, and files is a *project group* that isolates it from shapes in other groups. Projection groups have the following key characteristics of mutual exclusivity and relatedness. 

| Principle | Description |
|-----------|-------------|
| Mutual exclusivity | Each group is fully isolated from other groups to support different data shaping scenarios. For example, if you are testing different table structures and combinations, you would put each set in a different projection group for AB testing. Each group obtains data from the same source (enrichment tree) but is fully isolated from the table-object-file combination of any peer projection groups.|
| Relatedness | Within a projection group, content in tables, objects, and files are related. Knowledge store uses generated keys as reference points to a common parent node. For example, consider a scenario where you have a document containing images and text. You could project the text to tables and the images to binary files, and both tables and objects will have a column/property containing the file URL.|

## Shaping projections

A data shape is a structure passed to a projection as its content "source". Shaping applies to table projections and object projections, and it determines the composition of what each one contains.

Projections are easier to define when you have an object in the enrichment tree that provides a schema for the projection, be it tables or objects. The ability to structure your data based on planned usage is typically achieved by adding a [Shaper skill](cognitive-search-skill-shaper.md) to your skillset. Shapes produced from a Shaper skill are used as the `source` for a projection, but can also be used as an input to another skill. The other alternative is to add inline shaping to a skill in

Simply put, for table projections, the Shaper skill determines the columns or fields in your tables. Inputs to the Shaper skill consist of nodes in an enrichment tree. Output is a structure that you specify in the table projection. In the following example, a table projection called "mytableprojection" will consist of the inputs, as specified by the Shaper skill.

```json
{
    "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
    "name": "ShaperForTables",
    "description": null,
    "context": "/document",
    "inputs": [
        {
            "name": "metadata_storage_path",
            "source": "/document/metadata_storage_path",
            "sourceContext": null,
            "inputs": []
        },
        {
          "name": "reviews_text",
          "source": "/document/reviews_text"
        }, 
        {
          "name": "reviews_title",
          "source": "/document/reviews_title"
        },
        {
          "name": "reviews_username",
          "source": "/document/reviews_username"
        },
    ],
    "outputs": [
      {
        "name": "output",
        "targetName": "mytableprojection"
      }
    ]
}
```

The Shaper skill allows you to compose an object from different nodes of the enrichment tree and parent them under a new node. It also allows you to define complex types with nested objects. For examples, see the [Shaper skill](cognitive-search-skill-shaper.md) documentation.

## Projection lifecycle

Projections have a lifecycle that is tied to the source data in your data source. As source data is updated and reindexed, projections are updated with the results of the enrichments, ensuring your projections are eventually consistent with the data in your data source. However, projections are also independently stored in Azure Storage. They will not be deleted when the indexer or the search service itself is deleted. 

## Consume projections in other apps

After the indexer is run, connect to projections and consume the data in other apps and workloads.

+ Use [Storage Explorer](knowledge-store-view-storage-explorer.md) to verify object creation and content.

+ Use [Power BI for data exploration](knowledge-store-connect-power-bi.md). This tool works best when the data is in Azure Table Storage. Within Power BI, you can manipulate data into new tables that are easier to query and analyze.

+ Use enriched data in blob container in a data science pipeline. For example, you can [load the data from blobs into a Pandas DataFrame](/azure/architecture/data-science-process/explore-data-blob).

+ Finally, if you need to export your data from the knowledge store, Azure Data Factory has connectors to export the data and land it in the database of your choice.

## Checklist for getting started

Recall that projections are exclusive to knowledge stores, and are not used to structure a search index.

1. Get the connection string for the Azure Storage account and verify the account is StorageV2 (general purpose V2). 

1. Familiarize yourself with existing content in containers and tables in Azure Storage so that you choose non-conflicting names for the projections. A knowledge store is a loose collection of tables and containers. Consider adopting a naming convention to keep track of related objects.

1. [Enable enrichment caching](search-howto-incremental-index.md) in the indexer and then [run the indexer](search-howto-run-reset-indexers.md) to execute the skillset and populate the cache. Once the cache is populated, you can modify projection definitions in a knowledge store free of charge (as long as the skills themselves are not modified).

1. All projections are defined solely in a skillset. There are no indexer properties (such as field mappings or output field mappings) that apply to projections. Within a skillset definition, you will work in two areas: knowledgeStore property and skills array.

   1. Under knowledgeStore, specify table, object, file in the `projections` section.

   1. From the skills array, determine which skill outputs will be referenced in the `source` of each projection. All projections have a source. The source can be the output of an upstream skill, but is often the output of a Shaper skill. The composition of your projection is determined through shapes. 

1. Save the skillset and [run the indexer](search-howto-run-reset-indexers.md). Check your results in Azure Storage. On subsequent runs, avoid naming collisions by deleting objects in Azure Storage or changing project names in the skillset.

## Next steps

Review syntax and examples for each projection type.

> [!div class="nextstepaction"]
> [Define projections in a knowledge store](knowledge-store-projections-examples.md)