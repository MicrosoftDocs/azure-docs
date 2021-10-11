---
title: Projection concepts
titleSuffix: Azure Cognitive Search
description: Save and shape your enriched data from the AI enrichment indexing pipeline into a knowledge store for use in scenarios other than full text search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/11/2021
---

# Knowledge store "projections" in Azure Cognitive Search

Projections are the component of a [knowledge store definition](knowledge-store-concept-intro.md) that determines how your AI enriched content is stored in Azure Storage. Projections determine both the type of data structure and the number.

Projections can be tables, objects, or files in Azure Storage. You can specify multiple sets of each type if data isolation is required. It's common to use just one set, but the following example shows two so that you can see how the groups are arranged and how projections fit into a larger knowledge store definition.

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

Projections are an array of complex collections under a `knowledgeStore` definition in a [skillset object](/rest/api/searchservice/create-skillset), which is in turn referenced by an [indexer](rest/api/searchservice/create-indexer). If you are unfamiliar with these concepts, start with [AI enrichment](cognitive-search-concept-intro.md) for an introduction.

## Types of data structures

A knowledge store is a logical construction that's physically expressed in Azure Storage as tables, JSON objects, or binary image files.

| Projection | Storage | Usage |
|------------|---------|-------|
| Tables | Azure Table Storage | Used for data that's best represented as rows and columns. Table projections allow you to define a schematized shape or projection. Only valid JSON objects can be projected as tables. Since an enriched document can contain nodes that are not named JSON objects, you'll add a [Shaper skill or use inline shaping](knowledge-store-projection-shape.md) within a skill to create valid JSON. |
| Objects | Azure Blob Storage | Used when you need a JSON representation of your data and enrichments. As with table projections, only valid JSON objects can be projected as objects, and shaping can help you do that. |
| Files | Azure Blob Storage | Used when you need to save normalized, binary image files. |

You can define multiple projections of your data as it is being enriched. Multiple projections are useful when you want the same data (skillset output) shaped differently for individual use cases.

## Use projection groups for isolation and relatedness

Each set of tables, objects, and files is a *project group*, and you can have multiple groups if storage requirements include supporting different tools and scenarios. For example, you might use one group for design and debug of a skillset, capturing output for further examination, while a second set collects output used for an online app, with a third for data science workloads.

Projection groups have the following key characteristics of mutual exclusivity and relatedness. 

| Principle | Description |
|-----------|-------------|
| Mutual exclusivity | Each group is fully isolated from other groups to support different data shaping scenarios. For example, if you are testing different table structures and combinations, you would put each set in a different projection group for AB testing. Each group obtains data from the same source (enrichment tree) but is fully isolated from the table-object-file combination of any peer projection groups.|
| Relatedness | Within a projection group, content in tables, objects, and files are related. Knowledge store uses generated keys as reference points to a common parent node. For example, consider a scenario where you have a document containing images and text. You could project the text to tables and the images to binary files, and both tables and objects will have a column/property containing the file URL.|

<!-- ## Knowledge Store composition

The knowledge store consists of an annotation cache and projections. The *cache* is used by the service internally to cache the results from skills and track changes. A *projection* defines the schema and structure of the enrichments that match your intended use.

Within Azure Storage, projections can be articulated as tables, objects, or files.

+ As an object, the projection maps to Blob storage, where the projection is saved to a container, within which are the objects or hierarchical representations in JSON for scenarios like a data science pipeline.

+ As a table, the projection maps to Table storage. A tabular representation preserves relationships for scenarios like data analysis or export as data frames for machine learning. The enriched projections can then be easily imported into other data stores. 

You can create multiple projections in a knowledge store to accommodate various constituencies in your organization. A developer might need access to the full JSON representation of an enriched document, while data scientists or analysts might want granular or modular data structures shaped by your skillset.

For instance, if one of the goals of the enrichment process is to also create a dataset used to train a model, projecting the data into the object store would be one way to use the data in your data science pipelines. Alternatively, if you want to create a quick Power BI dashboard based on the enriched documents the tabular projection would work well. -->

## Table projections

Table projections are recommended for scenarios that call for data exploration, such as analysis with Power BI. The tables definition is a list of tables that you want to project. Each table requires three properties:

+ tableName: The name of the table in Azure Table Storage.

+ generatedKeyName: The column name for the key that uniquely identifies this row.

+ source: The node from the enrichment tree you are sourcing your enrichments from. This node is usually the output of a Shaper skill that defines the shape of the table. Tables have rows and columns, and shaping is the mechanism by which rows and columns are specified. You can use a [Shaper skill or inline shapes](knowledge-store-projection-shape.md). The Shaper skill produces valid JSON, but could be the output from any skill, if valid JSON. 

As demonstrated in this example, the key phrases and entities are modeled into different tables and will contain a reference back to the parent (MainTable) for each row. 

```json
"knowledgeStore": {
  "storageConnectionString": "an Azure storage connection string",
  "projections" : [
    {
      "tables": [
        { "tableName": "MainTable", "generatedKeyName": "SomeId", "source": "/document/EnrichedShape" },
        { "tableName": "KeyPhrases", "generatedKeyName": "KeyPhraseId", "source": "/document/EnrichedShape/*/KeyPhrases/*" },
        { "tableName": "Entities", "generatedKeyName": "EntityId", "source": "/document/EnrichedShape/*/Entities/*" }
      ]
    },
    {
      "objects": [ ]
    },
    {
      "files": [ ]
    }
  ]
}
```

The enrichment node specified in "source" can be sliced to project into multiple tables. The reference to "EnrichedShape" is the output of a Shaper skill (not shown). The inputs of the skill determine table composition and the rows that fill it. Generated keys and common fields within each table provide the basis for table relationships.

## Object projections

Object projections are JSON representations of the enrichment tree that can be sourced from any node. In many cases, the same Shaper skill that creates a table projection can be used to generate an object projection. 

Generating an object projection requires a few object-specific attributes:

+ storageContainer: The blob container where the objects will be saved

+ source: The path to the node of the enrichment tree that is the root of the projection

```json
"knowledgeStore": {
  "storageConnectionString": "an Azure storage connection string",
  "projections" : [
    {
      "tables": [ ]
    },
    {
      "objects": [
        {
          "storageContainer": "hotelreviews", 
          "source": "/document/hotel"
        }
      ]
    },
    {
        "files": [ ]
    }
  ]
}
```

## File projections

File projections only act on the `normalized_images` collection, but are otherwise similar to object projections in that they are saved in a blob container, with a folder prefix of the base64 encoded value of the document ID. 

File projections cannot share the same container as object projections and need to be projected into a different container. File projections have the same properties as object projections:

+ storageContainer: The blob container where the objects will be saved

+ source: The path to the node of the enrichment tree that is the root of the projection

```json
"knowledgeStore": {
  "storageConnectionString": "an Azure storage connection string",
  "projections" : [
    {
      "tables": [ ]
    },
    {
      "objects": [ ]
    },
    {
        "files": [
              {
              "storageContainer": "ReviewImages",
              "source": "/document/normalized_images/*"
            }
        ]
    }
  ]
}
```

## Projection shaping

Projections are easier to define when you have an object in the enrichment tree that matches the schema of the projection, be it tables or objects. The ability to shape or structure your data based on planned usage is typically achieved by adding a [Shaper skill](cognitive-search-skill-shaper.md) to your skillset. Shapes produced from a Shaper skill are used as the `source` for a projection, but can also be used as an input to another skill.

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

Within a table projection group, a single node in the enrichment tree can be sliced into multiple related tables, so that each table contains a category of data. This can be useful for analysis, where you can control if and how related data is aggregated.

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

## Using projections

After the indexer is run, you can read the projected data in the containers or tables you specified through projections.

+ Use [Storage Explorer](knowledge-store-view-storage-explorer.md) to verify object creation and content.

+ Use [Power BI for data exploration](knowledge-store-connect-power-bi.md). This tool works best when the data is in Azure Table Storage. Within Power BI, you can manipulate data into new tables that are easier to query and analyze.

+ Use enriched data in blob container in a data science pipeline. For example, you can [load the data from blobs into a Pandas DataFrame](/azure/architecture/data-science-process/explore-data-blob).

+ Finally, if you need to export your data from the knowledge store, Azure Data Factory has connectors to export the data and land it in the database of your choice. 

## Next steps

As a next step, create your first knowledge store using sample data and instructions. For more advanced concepts like slicing, inline shaping, and relationships, see [Define projections in a knowledge store](knowledge-store-projections-examples.md).

> [!div class="nextstepaction"]
> [Create a knowledge store in REST](knowledge-store-create-rest.md).