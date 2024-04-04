---
title: Define projections
titleSuffix: Azure AI Search
description: Learn how to define table, object, and file projections in a knowledge store by reviewing syntax and examples.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 03/18/2024
---

# Define projections in a knowledge store

[Projections](knowledge-store-projection-overview.md) are the component of a [knowledge store definition](knowledge-store-concept-intro.md) that determines where AI enriched content is stored in Azure Storage. Projections determine the type, quantity, and composition of the data structures containing your content.

In this article, learn the syntax for each type of projection:

+ [Table projections](#define-a-table-projection)
+ [Object projections](#define-an-object-projection)
+ [File projections](#define-a-file-projection)

Recall that projections are defined under the "knowledgeStore" property of a skillset.

```json
"knowledgeStore" : {
    "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<Acct Name>;AccountKey=<Acct Key>;",
    "projections": [
      {
        "tables": [ ],
        "objects": [ ],
        "files": [ ]
      }
    ]
}
```

If you need more background before getting started, review [this check list](knowledge-store-projection-overview.md#checklist-for-getting-started) for tips and workflow.

> [!TIP]
> When developing projections, [enable enrichment caching (preview)](search-howto-incremental-index.md) so that you can reuse existing enrichments while editing projection definitions. Enrichment caching is a preview feature, so be sure to use the preview REST API (api-version=2020-06-30-preview or later) on the indexer request. Without caching, simple edits to a projection will result in a full reprocess of enriched content. By caching the enrichments, you can iterate over projections without incurring any skillset processing charges.

## Requirements

All projections have source and destination properties. The source is always internal content from an enrichment tree created during skillset execution. The destination is the name and type of an external object that's created and populated in Azure Storage.

Except for file projections, which only accept binary images, the source must be:

+ Valid JSON
+ A path to a node in the enrichment tree (for example, `"source": "/document/objectprojection"`)

While a node might resolve to a single field, a more common representation is a reference to a complex shape. Complex shapes are created through a shaping methodology, either a [Shaper skill](cognitive-search-skill-shaper.md) or [an inline shaping definition](knowledge-store-projection-shape.md#inline-shape), but usually a Shaper skill. The fields or elements of the shape determine the fields in containers and tables.

Shaper skills are favored because it outputs JSON, where as most skills don't output valid JSON on their own. In many cases, the same data shape created by a Shaper skill can be used equally by both table and object projections.

Given source input requirements, knowing how to [shape data](knowledge-store-projection-shape.md) becomes a practical requirement for projection definition, especially if you're working with tables.

## Define a table projection

Table projections are recommended for scenarios that call for data exploration, such as analysis with Power BI or workloads that consume data frames. The tables section of a projections array is a list of tables that you want to project.

To define a table projection, use the `tables` array in the projections property. A table projection has three required properties:

| Property | Description |
|----------|-------------|
| tableName | Determines the name of a new table created in Azure Table Storage.  |
| generatedKeyName | Column name for the key that uniquely identifies each row. The value is system-generated. If you omit this property, a column will be created automatically that uses the table name and "key" as the naming convention. |
| source | A path to a node in an enrichment tree. The node should be a reference to a complex shape that determines which columns are created in the table.|

In table projections, "source" is usually the output of a [Shaper skill](cognitive-search-skill-shaper.md) that defines the shape of the table. Tables have rows and columns, and shaping is the mechanism by which rows and columns are specified. You can use a [Shaper skill or inline shapes](knowledge-store-projection-shape.md). The Shaper skill produces valid JSON, but the source could be the output from any skill, if valid JSON.

> [!NOTE]
> Table projections are subject to the [storage limits](/rest/api/storageservices/understanding-the-table-service-data-model) imposed by Azure Storage. The entity size cannot exceed 1 MB and a single property can be no bigger than 64 KB. These constraints make tables a good solution for storing a large number of small entities.

### Single table example

The schema of a table is specified partly by the projection (table name and key), and also by the source that provides the shape of table (columns). This example shows just one table so that you can focus on the details of the definition.

```json
"projections" : [
  {
    "tables": [
      { "tableName": "Hotels", "generatedKeyName": "HotelId", "source": "/document/tableprojection" }
    ]
  }
]
```

Columns are derived from the "source". The following data shape containing HotelId, HotelName, Category, and Description will result in creation of those columns in the table.

```json
{
    "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
    "name": "#3",
    "description": null,
    "context": "/document",
    "inputs": [
    {
        "name": "HotelId",
        "source": "/document/HotelId"
    },
    {
        "name": "HotelName",
        "source": "/document/HotelName"
    },
    {
        "name": "Category",
        "source": "/document/Category"
    },
    {
        "name": "Description",
        "source": "/document/Description"
    },
    ],
    "outputs": [
    {
        "name": "output",
        "targetName": "tableprojection"
    }
    ]
}
```

### Multiple table (slicing) example

A common pattern for table projections is to have multiple related tables, where system-generated partitionKey and rowKey columns are created to support cross-table relationships for all tables under the same projection group. 

Creating multiple tables can be useful if you want control over how related data is aggregated. If enriched content has unrelated or independent components, for example the keywords extracted from a document might be unrelated from the entities recognized in the same document, you can split those fields out into adjacent tables.

When you're projecting to multiple tables, the complete shape is projected into each table, unless a child node is the source of another table within the same group. Adding a projection with a source path that is a child of an existing projection results in the child node being sliced out of the parent node and projected into the new yet related table. This technique allows you to define a single node in a Shaper skill that can be the source for all of your projections.

The pattern for multiple tables consists of:

+ One table as the parent or main table
+ Additional tables to contain slices of the enriched content

For example, assume a Shaper skill outputs an "EnrichedShape" that contains hotel information, plus enriched content like key phrases, locations, and organizations. The main table would include fields that describe the hotel (ID, name, description, address, category). Key phrases would get the key phrase column. Entities would get the entity columns.

```json
"projections" : [
  {
    "tables": [
    { "tableName": "MainTable", "generatedKeyName": "HotelId", "source": "/document/EnrichedShape" },
    { "tableName": "KeyPhrases", "generatedKeyName": "KeyPhraseId", "source": "/document/EnrichedShape/*/KeyPhrases/*" },
    { "tableName": "Entities", "generatedKeyName": "EntityId", "source": "/document/EnrichedShape/*/Entities/*" }
    ]
  }
]
```

### Naming relationships

The `generatedKeyName` and `referenceKeyName` properties are used to relate data across tables or even across projection types. Each row in the child table has a property pointing back to the parent. The name of the column or property in the child is the `referenceKeyName` from the parent. When the `referenceKeyName` isn't provided, the service defaults it to the `generatedKeyName` from the parent. 

Power BI relies on these generated keys to discover relationships within the tables. If you need the column in the child table named differently, set the `referenceKeyName` property on the parent table. One example would be to set the `generatedKeyName` as ID on the tblDocument table and the `referenceKeyName` as DocumentID. This would result in the column in the tblEntities and tblKeyPhrases tables containing the document ID being named DocumentID.

## Define an object projection

Object projections are JSON representations of the enrichment tree that can be sourced from any node. In comparison with table projections, object projections are simpler to define and are used when projecting whole documents. Object projections are limited to a single projection in a container and can't be sliced.

To define an object projection, use the `objects` array in the projections property. An object projection has three required properties:

| Property | Description |
|----------|-------------|
| storageContainer | Determines the name of a new container created in Azure Storage.  |
| generatedKeyName | Column name for the key that uniquely identifies each row. The value is system-generated. If you omit this property, a column will be created automatically that uses the table name and "key" as the naming convention. |
| source | A path to a node in an enrichment tree that is the root of the projection. The node is usually a reference to a complex data shape that determines blob structure.|

The following example projects individual hotel documents, one hotel document per blob, into a container called `hotels`.

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
        "storageContainer": "hotels",
        "source": "/document/objectprojection",
        }
      ]
    },
    {
        "files": [ ]
    }
  ]
}
```

The source is the output of a Shaper skill, named `"objectprojection"`. Each blob will have a JSON representation of each field input.

```json
    {
      "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
      "name": "#3",
      "description": null,
      "context": "/document",
      "inputs": [
        {
          "name": "HotelId",
          "source": "/document/HotelId"
        },
        {
          "name": "HotelName",
          "source": "/document/HotelName"
        },
        {
          "name": "Category",
          "source": "/document/Category"
        },
        {
          "name": "keyPhrases",
          "source": "/document/HotelId/keyphrases/*"
        },
      ],
      "outputs": [
        {
          "name": "output",
          "targetName": "objectprojection"
        }
      ]
    }
```

## Define a file projection

File projections are always binary, normalized images, where normalization refers to potential resizing and rotation for use in skillset execution. File projections, similar to object projections, are created as blobs in Azure Storage, and contain binary data (as opposed to JSON).

To define a file projection, use the `files` array in the projections property. A files projection has three required properties:

| Property | Description |
|----------|-------------|
| storageContainer | Determines the name of a new container created in Azure Storage.  |
| generatedKeyName | Column name for the key that uniquely identifies each row. The value is system-generated. If you omit this property, a column will be created automatically that uses the table name and "key" as the naming convention. |
| source | A path to a node in an enrichment tree that is the root of the projection. For images files, the  source is always `/document/normalized_images/*`.  File projections only act on the `normalized_images` collection. Neither indexers nor a skillset will pass through the original non-normalized image.|

The destination is always a blob container, with a folder prefix of the base64 encoded value of the document ID. If there are multiple images, they'll be placed together in the same folder. File projections can't share the same container as object projections and need to be projected into a different container. 

The following example projects all normalized images extracted from the document node of an enriched document, into a container called `myImages`.

```json
"projections": [
    {
        "tables": [ ],
        "objects": [ ],
        "files": [
            {
                "storageContainer": "myImages",
                "source": "/document/normalized_images/*"
            }
        ]
    }
]
```

## Test projections

You can process projections by following these steps:

1. Set the knowledge store's `storageConnectionString` property to a valid V2 general purpose storage account connection string.  

1. [Update the skillset](/rest/api/searchservice/update-skillset) by issuing a PUT request with your projection definition in the body of the skillset.

1. [Run the indexer](/rest/api/searchservice/run-indexer) to put the skillset into execution. 

1. [Monitor indexer execution](search-howto-monitor-indexers.md) to check progress and catch any errors.

1. Use Azure portal to verify object creation in Azure Storage.

1. If you're projecting tables, [import them into Power BI](knowledge-store-connect-power-bi.md) for table manipulation and visualization. In most cases, Power BI will auto-discover the relationships among tables.

## Common issues

Omitting any of the following steps can result in unexpected outcomes. Check for the following conditions if your output doesn't look right.

+ String enrichments aren't shaped into valid JSON. When strings are enriched, for example `merged_content` enriched with key phrases, the enriched property is represented as a child of `merged_content` within the enrichment tree. The default representation isn't well-formed JSON. At projection time, make sure to transform the enrichment into a valid JSON object with a name and a value. Using a Shaper skill or defining inline shapes will help resolve this issue.

+ Omission of `/*` at the end of a source path. If the source of a projection is `/document/projectionShape/keyPhrases`, the key phrases array is projected as a single object/row. Instead, set the source path to `/document/projectionShape/keyPhrases/*` to yield a single row or object for each of the key phrases.

+ Path syntax errors. [Path selectors](cognitive-search-concept-annotations-syntax.md) are case-sensitive and can lead to missing input warnings if you don't use the exact case for the selector. 

## Next steps

The next step walks you through shaping and projection of output from a rich skillset. If your skillset is complex, the following article provides examples of both shapes and projections.

> [!div class="nextstepaction"]
> [Detailed example of shapes and projections](knowledge-store-projection-example-long.md)
