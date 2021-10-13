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

[Projections](knowledge-store-projection-overview.md) are the physical expression of enriched documents in a [knowledge store](knowledge-store-concept-intro.md) and take the form of tables, objects, or files in Azure Storage. If you are creating a knowledge store, defining and shaping projections is most of the work. This article introduces the concepts and workflow you'll need to know in advance.

## What are projections?

Projections are the physical tables, objects, and files in Azure Storage that contain enriched content produced by a skillset in Azure Cognitive Search. Projections are specified under the "knowledgeStore" property of a [skillset](/rest/api/searchservice/create-skillset) and are used during indexer invocation to create and load objects in Azure Storage with enriched content. If you are unfamiliar with these concepts, start with [AI enrichment](cognitive-search-concept-intro.md) for an introduction.

The following example illustrates the placement of projections under knowledgeStore, 

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

## Types of projections and usage scenarios

A knowledge store is a logical construction that's physically expressed as a loose collection of tables, JSON objects, or binary image files in Azure Storage.

| Projection | Storage | Usage |
|------------|---------|-------|
| Tables | Azure Table Storage | Used for data that's best represented as rows and columns. Table projections allow you to define a schematized shape. Only valid JSON objects can be projected as tables. Since an enriched document can contain nodes that are not named JSON objects, you'll add a [Shaper skill or use inline shaping](knowledge-store-projection-shape.md) within a skill to create valid JSON. |
| Objects | Azure Blob Storage | Used when you need a JSON representation of your data and enrichments. As with table projections, only valid JSON objects can be projected as objects, and shaping can help you do that. |
| Files | Azure Blob Storage | Used when you need to save normalized, binary image files. |

You can define multiple projections of your data as it is being enriched. Multiple projections are useful when you want the same data (skillset output) shaped differently for individual use cases. A developer might need access to the full JSON representation of an enriched document, while data scientists or analysts might want granular or modular data structures shaped by your skillset.

For instance, if one of the goals of the enrichment process is to also create a dataset used to train a model, projecting the data into the object store would be one way to use the data in your data science pipelines. Alternatively, if you want to create a quick Power BI dashboard based on the enriched documents the tabular projection would work well. A tabular representation preserves relationships for scenarios like data analysis or export as data frames for machine learning. The enriched projections can then be easily imported into other data stores.

## Projection groups for isolation and relatedness

Projections are an array of complex collections, which means that you can specify multiple sets of each type. It's common to use just one projection group, but you might use multiple if storage requirements include supporting different tools and scenarios. For example, you might use one group for design and debug of a skillset, while a second set collects output used for an online app, with a third for data science workloads.

The same skillset output is used to populate all groups under projections.

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

## Shaping a projection

Projection shaping applies to table projections and object projections, and refers to the structure of what each one contains.

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

## Projection slicing

Projection slicing applies to table projections. Within a table projection group, a single node in the enrichment tree can be sliced into multiple related tables, so that each table contains a category of data. This can be useful for analysis, where you can control if and how related data is aggregated.

To create multiple child tables, start with parent table, and then create additional tables that build off the parent's source. In this example, "KeyPhrases" and "Entities" take slices of "/document/EnrichedShape".

```json
"tables": [
  { "tableName": "MainTable", "generatedKeyName": "SomeId", "source": "/document/EnrichedShape" },
  { "tableName": "KeyPhrases", "generatedKeyName": "KeyPhraseId", "source": "/document/EnrichedShape/*/KeyPhrases/*" },
  { "tableName": "Entities", "generatedKeyName": "EntityId", "source": "/document/EnrichedShape/*/Entities/*" }
]
```

When projecting to multiple tables, the complete shape will be projected into each table, unless a child node is the source of another table within the same group. Adding a projection with a source path that is a child of an existing projection will result in the child node being sliced out of the parent node and projected into the new yet related table or object. This technique allows you to define a single node in a Shaper skill that can be the source for all of your projections.

## Projection lifecycle

Projections have a lifecycle that is tied to the source data in your data source. As source data is updated and reindexed, projections are updated with the results of the enrichments, ensuring your projections are eventually consistent with the data in your data source. However, projections are also independently stored in Azure Storage. They will not be deleted when the indexer or the search service itself is deleted. 

## Working with projections

After the indexer is run, you can read the projected data in the containers or tables you specified through projections.

+ Use [Storage Explorer](knowledge-store-view-storage-explorer.md) to verify object creation and content.

+ Use [Power BI for data exploration](knowledge-store-connect-power-bi.md). This tool works best when the data is in Azure Table Storage. Within Power BI, you can manipulate data into new tables that are easier to query and analyze.

+ Use enriched data in blob container in a data science pipeline. For example, you can [load the data from blobs into a Pandas DataFrame](/azure/architecture/data-science-process/explore-data-blob).

+ Finally, if you need to export your data from the knowledge store, Azure Data Factory has connectors to export the data and land it in the database of your choice.

## Checklist for working with projections

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