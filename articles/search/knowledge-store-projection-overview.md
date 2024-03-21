---
title: Projection concepts
titleSuffix: Azure AI Search
description: Introduces projection concepts and best practices. If you are creating a knowledge store in Azure AI Search, projections determine the type, quantity, and composition of objects in Azure Storage.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 01/18/2024
---

# Knowledge store "projections" in Azure AI Search

Projections define the physical tables, objects, and files in a [**knowledge store**](knowledge-store-concept-intro.md) that accept content from an Azure AI Search enrichment pipeline. If you're creating a knowledge store, defining and shaping projections is most of the work.

This article introduces projection concepts and workflow so that you have some background before you start coding.

Projections are defined in Azure AI Search skillsets, but the end results are the table, object, and image file projections in Azure Storage.

:::image type="content" source="media/knowledge-store-concept-intro/kstore-in-storage-explorer.png" alt-text="Projections expressed in Azure Storage" border="true":::

## Types of projections and usage

A knowledge store is a logical construction that's physically expressed as a loose collection of tables, JSON objects, or binary image files in Azure Storage.

| Projection | Storage | Usage |
|------------|---------|-------|
| [Tables](knowledge-store-projections-examples.md#define-a-table-projection) | Azure Table Storage | Used for data that's best represented as rows and columns, or whenever you need granular representations of your data (for example, as data frames). Table projections allow you to define a schematized shape, using a [Shaper skill or use inline shaping](knowledge-store-projection-shape.md) to specify columns and rows. You can organize content into multiple tables based on familiar normalization principles. Tables that are in the same group are automatically related. |
| [Objects](knowledge-store-projections-examples.md#define-an-object-projection) | Azure Blob Storage | Used when you need the full JSON representation of your data and enrichments in one JSON document. As with table projections, only valid JSON objects can be projected as objects, and shaping can help you do that. |
| [Files](knowledge-store-projections-examples.md#define-a-file-projection) | Azure Blob Storage | Used when you need to save normalized, binary image files. |

## Projection definition

Projections are specified under the "knowledgeStore" property of a [skillset](/rest/api/searchservice/create-skillset). Projection definitions are used during indexer invocation to create and load objects in Azure Storage with enriched content. If you're unfamiliar with these concepts, start with [AI enrichment](cognitive-search-concept-intro.md) for an introduction.

The following example illustrates the placement of projections under knowledgeStore, and the basic construction. The name, type, and content source make up a projection definition.

```json
"knowledgeStore" : {
    "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<Acct Name>;AccountKey=<Acct Key>;",
    "projections": [
      {
        "tables": [
          { "tableName": "ks-museums-main", "generatedKeyName": "ID", "source": "/document/tableprojection" },
          { "tableName": "ks-museumEntities", "generatedKeyName": "ID","source": "/document/tableprojection/Entities/*" }
        ],
        "objects": [
          { "storageContainer": "ks-museums", "generatedKeyName": "ID", "source": "/document/objectprojection" }
        ],
        "files": [ ]
      }
    ]
```

## Projection groups

Projections are an array of complex collections, which means that you can specify multiple sets of each type. It's common to use just one projection group, but you might use multiple if storage requirements include supporting different tools and scenarios. For example, you might use one group for design and debug of a skillset, while a second set collects output used for an online app, with a third for data science workloads.

The same skillset output is used to populate all groups under projections. The following example shows two.

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

Projection groups have the following key characteristics of mutual exclusivity and relatedness. 

| Principle | Description |
|-----------|-------------|
| Mutual exclusivity | Each group is fully isolated from other groups to support different data shaping scenarios. For example, if you're testing different table structures and combinations, you would put each set in a different projection group for AB testing. Each group obtains data from the same source (enrichment tree) but is fully isolated from the table-object-file combination of any peer projection groups.|
| Relatedness | Within a projection group, content in tables, objects, and files are related. Knowledge store uses generated keys as reference points to a common parent node. For example, consider a scenario where you have a document containing images and text. You could project the text to tables and the images to binary files, and both tables and objects have a column/property containing the file URL.|

## Projection "source"

The source parameter is the third component of a projection definition. Because projections store data from an AI enrichment pipeline, the source of a projection is always the output of a skill. As such, output might be a single field (for example, a field of translated text), but often it's a reference to a data shape.

Data shapes come from your skillset. Among all of the built-in skills provided in Azure AI Search, there's a utility skill called the [**Shaper skill**](cognitive-search-skill-shaper.md) that's used to create data shapes. You can include Shaper skills (as many as you need) to support the projections in the knowledge store.

Shapes are frequently used with table projections, where the shape not only specifies which rows go into the table, but also which columns are created (you can also pass a shape to an object projection).

Shapes can be complex and it's out of scope to discuss them in depth here, but the following example briefly illustrates a basic shape. The output of the Shaper skill is specified as the source of a table projection. Within the table projection itself will be columns for "metadata-storage_path", "reviews_text", "reviews_title", and so forth, as specified in the shape.

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

## Projection lifecycle

Projections have a lifecycle that is tied to the source data in your data source. As source data is updated and reindexed, projections are updated with the results of the enrichments, ensuring your projections are eventually consistent with the data in your data source. However, projections are also independently stored in Azure Storage. They won't be deleted when the indexer or the search service itself is deleted. 

## Consume in apps

After the indexer is run, connect to projections and consume the data in other apps and workloads.

+ Use Azure portal to verify object creation and content in Azure Storage.

+ Use [Power BI for data exploration](knowledge-store-connect-power-bi.md). This tool works best when the data is in Azure Table Storage. Within Power BI, you can manipulate data into new tables that are easier to query and analyze.

+ Use enriched data in blob container in a data science pipeline. For example, you can [load the data from blobs into a Pandas DataFrame](/azure/architecture/data-science-process/explore-data-blob).

+ Finally, if you need to export your data from the knowledge store, Azure Data Factory has connectors to export the data and land it in the database of your choice.

## Checklist for getting started

Recall that projections are exclusive to knowledge stores, and aren't used to structure a search index.

1. In Azure Storage, get a connection string from **Access Keys** and verify the account is StorageV2 (general purpose V2).

1. While in Azure Storage, familiarize yourself with existing content in containers and tables so that you choose nonconflicting names for the projections. A knowledge store is a loose collection of tables and containers. Consider adopting a naming convention to keep track of related objects.

1. In Azure AI Search, [enable enrichment caching (preview)](search-howto-incremental-index.md) in the indexer and then [run the indexer](search-howto-run-reset-indexers.md) to execute the skillset and populate the cache. This is a preview feature, so be sure to use the preview REST API (api-version=2020-06-30-preview or later) on the indexer request. Once the cache is populated, you can modify projection definitions in a knowledge store free of charge (as long as the skills themselves aren't modified).

1. In your code, all projections are defined solely in a skillset. There are no indexer properties (such as field mappings or output field mappings) that apply to projections. Within a skillset definition, you'll focus on two areas: knowledgeStore property and skills array.

   1. Under knowledgeStore, specify table, object, file projections in the `projections` section. Object type, object name, and quantity (per the number of projections you define) are determined in this section.

   1. From the skills array, determine which skill outputs should be referenced in the `source` of each projection. All projections have a source. The source can be the output of an upstream skill, but is often the output of a Shaper skill. The composition of your projection is determined through shapes. 

1. If you're adding projections to an existing skillset, [update the skillset](/rest/api/searchservice/update-skillset) and [run the indexer](/rest/api/searchservice/run-indexer).

1. Check your results in Azure Storage. On subsequent runs, avoid naming collisions by deleting objects in Azure Storage or changing project names in the skillset.

1. If you're using [Table projections](knowledge-store-projections-examples.md#define-a-table-projection) check [Understanding the Table Service data model](/rest/api/storageservices/Understanding-the-Table-Service-Data-Model) and [Scalability and performance targets for Table storage](../storage/tables/scalability-targets.md) to make sure your data requirements are within Table storage documented limits.

## Next steps

Review syntax and examples for each projection type.

> [!div class="nextstepaction"]
> [Define projections in a knowledge store](knowledge-store-projections-examples.md)
