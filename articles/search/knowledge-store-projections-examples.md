---
title: Define projections
titleSuffix: Azure Cognitive Search
description: Learn how to define table, object, and file projections in a knowledge store by reviewing syntax and examples.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/15/2021
---

# Define projections in a knowledge store

Projections are the component of a [knowledge store definition](knowledge-store-concept-intro.md) that determines how AI enriched content is stored in Azure Storage. Projections determine the type, quantity, and composition of the data structures containing your content.

In this article, learn how to build out projections for each type:

+ [Table projections](#define-a-table-projection)
+ [Object projections](#define-an-object-projection)
+ [File projections](#define-a-file-projection)

Projections are defined under the "knowledgeStore" property of a skillset.

```json
"knowledgeStore" : {
    "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<Acct Name>;AccountKey=<Acct Key>;",
    "projections": [
      {
        "tables": [  ],
        "objects": [ ],
        "files": [ ]
      }
    ]
```

If you need more background before getting started, review [this check list](knowledge-store-projection-overview.md#checklist-for-working-with-projections) for tips and workflow.

> [!TIP]
> When developing projections, [enable enrichment caching](search-howto-incremental-index.md) so that you can reuse existing enrichments while editing projection definitions. Without caching, simple edits to a projection will result in a full reprocess of enriched content. By caching the enrichments, you can iterative over projections without incurring any skillset processing charges.

## Projection requirements

All projections have source and destination properties. The source is from an enrichment tree created during skillset execution. The destination is the name of the object that will be created in Azure Storage.

With the exception of file projections, which store binary files, the source must be:

+ Valid JSON
+ A path to a node in the enrichment tree (for example, `"source": "/document/objectprojection"`)

While a node might be a single field, a more common representation is a reference to a complex data shape. Complex data shapes are created through a shaping methodology, either a Shaper skill or inline definition.

Given source input requirements, knowing how to [shape data](knowledge-store-projection-shape.md) becomes a practical requirement for projection definition, especially if you are working with tables.

## Define a table projection

Table projections are recommended for scenarios that call for data exploration, such as analysis with Power BI or workloads that consume data frames. The tables definition is a list of tables that you want to project.

A table projection has three required properties:

| Property | Description |
|----------|-------------|
| tableName | Determines the name of a new table created in Azure Table Storage.  |
| generatedKeyName | Column name for the key that uniquely identifies each row. The value is system-generated. If you omit this property, a column will be created automatically that uses the table name and "key" as the naming convention. |
| source | A path to a node in an enrichment tree. The node should be a reference to a complex data shape that determines which columns are created in the table.|

In table projections, "source" is usually the output of a [Shaper skill](cognitive-search-skill-shaper.md) that defines the shape of the table. Tables have rows and columns, and shaping is the mechanism by which rows and columns are specified. You can use a [Shaper skill or inline shapes](knowledge-store-projection-shape.md). The Shaper skill produces valid JSON, but the source could be the output from any skill, if valid JSON.

> [!NOTE]
> Table projections are subject to the [storage limits](/rest/api/storageservices/understanding-the-table-service-data-model) imposed by Azure Storage. The entity size cannot exceed 1 MB and a single property can be no bigger than 64 KB. These constraints make tables a good solution for storing a large number of small entities.

### Single table example

The schema of a table is specified partly by the projection (table name and key), and also by the source that provides the shape of table (columns).

```json
"projections" : [
  {
    "tables": [
      { "tableName": "Hotels", "generatedKeyName": "HotelId", "source": "/document/tableprojection" }
    ]
  }
]
```

Columns provided by an enriched shape like the one shown below will be the HotelId, HotelName, Category, Description.

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

### Multiple table example

A common pattern for table projections is to have multiple tables. All tables are created with partitionKey and rowKey columns to support cross-table relationships.

The following example shows table projections for enrichments that include Key Phrases and Entity Recognition. Because key phrases and entities are not directly correlated, you would model these projections as separate tables, with a main table that contains a representation of the main document. 

For example, if you are generating key phrases and location entities from a hotel catalog, the main table would include fields that describe the hotel (ID, name, description, address, category).

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

The enrichment node specified in "source" can be sliced to project into multiple tables. Within "EnrichedShape", there are nodes for KeyPhrases and Entities. As you can see from the example above, you can define tables that contain a subset of columns. As noted earlier, generated values provide the basis for table relationships.

### Naming relationships

The `generatedKeyName` and `referenceKeyName` properties are used to relate data across tables or even across projection types. Each row in the child table has a property pointing back to the parent. The name of the column or property in the child is the `referenceKeyName` from the parent. When the `referenceKeyName` is not provided, the service defaults it to the `generatedKeyName` from the parent. 

Power BI relies on these generated keys to discover relationships within the tables. If you need the column in the child table named differently, set the `referenceKeyName` property on the parent table. One example would be to set the `generatedKeyName` as ID on the tblDocument table and the `referenceKeyName` as DocumentID. This would result in the column in the tblEntities and tblKeyPhrases tables containing the document ID being named DocumentID.

## Define an object projection

Object projections are JSON representations of the enrichment tree that can be sourced from any node. In comparison with table projections, object projections are simpler to define and are used when projecting whole documents. Object projections are limited to a single projection in a container and cannot be sliced.

To define an object projection, use the `objects` array in the projections property.

The source is the path to a node of the enrichment tree that is the root of the projection. Although it is not required, the node path is usually the output of a Shaper skill. This is because most skills do not output valid JSON objects on their own, which means that some form of shaping is necessary. In many cases, the same Shaper skill that creates a table projection can be used to generate an object projection. Alternatively, the source can also be set to a node with [an inline shaping](knowledge-store-projection-shape.md#inline-shape) to provide the structure.

The destination is always a blob container.

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

The source is the output of a Shaper skill, named "objectprojection". Each blob will have a JSON representation of each field input.

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

File projections are always binary, normalized images, where normalization refers to potential resizing and rotation for use in skillset execution. File projections, similar to object projections, are created as blobs in Azure Storage, and contain the image.

To define a file projection, use the `files` array in the projections property.

The source is always `/document/normalized_images/*`. File projections only act on the `normalized_images` collection. Neither indexers nor a skillset will pass through the original non-normalized image.

The destination is always a blob container, with a folder prefix of the base64 encoded value of the document ID. File projections cannot share the same container as object projections and need to be projected into a different container. 

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

## Projecting to multiple types

A more complex scenario might require you to project content across projection types. For example, projecting key phrases and entities to tables, saving OCR results of text and layout text as objects, and then projecting the images as files. 

Steps for multiple projection types:

1. Create a table with a row for each document.
1. Create a table related to the document table with each key phrase identified as a row in this table.
1. Create a table related to the document table with each entity identified as a row in this table.
1. Create an object projection with the layout text for each image.
1. Create a file projection, projecting each extracted image.
1. Create a cross-reference table that contains references to the document table, object projection with the layout text, and the file projection.

### Shape data for cross-projection

To get the shapes needed for these projections, start by adding a new Shaper skill that creates a shaped object called `crossProjection`. 

```json
{
    "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
    "name": "ShaperForCrossProjection",
    "description": null,
    "context": "/document",
    "inputs": [
        {
            "name": "metadata_storage_name",
            "source": "/document/metadata_storage_name",
            "sourceContext": null,
            "inputs": []
        },
        {
            "name": "keyPhrases",
            "source": null,
            "sourceContext": "/document/merged_content/keyphrases/*",
            "inputs": [
                {
                    "name": "KeyPhrases",
                    "source": "/document/merged_content/keyphrases/*"
                }

            ]
        },
        {
            "name": "entities",
            "source": null,
            "sourceContext": "/document/merged_content/entities/*",
            "inputs": [
                {
                    "name": "Entities",
                    "source": "/document/merged_content/entities/*/name"
                }

            ]
        },
        {
            "name": "images",
            "source": null,
            "sourceContext": "/document/normalized_images/*",
            "inputs": [
                {
                    "name": "image",
                    "source": "/document/normalized_images/*"
                },
                {
                    "name": "layoutText",
                    "source": "/document/normalized_images/*/layoutText"
                },
                {
                    "name": "ocrText",
                    "source": "/document/normalized_images/*/text"
                }
                ]
        }
 
    ],
    "outputs": [
        {
            "name": "output",
            "targetName": "crossProjection"
        }
    ]
}
```

### Define table, object, and file projections

From the consolidated crossProjection object, slice the object into multiple tables, capture the OCR output as blobs, and then save the image as files (also in Blob storage).

```json
"knowledgeStore" : {
    "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<Acct Name>;AccountKey=<Acct Key>;",
    "projections": [
            {
            "tables": [
                {
                    "tableName": "crossDocument",
                    "generatedKeyName": "Id",
                    "source": "/document/crossProjection"
                },
                {
                    "tableName": "crossEntities",
                    "generatedKeyName": "EntityId",
                    "source": "/document/crossProjection/entities/*"
                },
                {
                    "tableName": "crossKeyPhrases",
                    "generatedKeyName": "KeyPhraseId",
                    "source": "/document/crossProjection/keyPhrases/*"
                },
                {
                    "tableName": "crossReference",
                    "generatedKeyName": "CrossId",
                    "source": "/document/crossProjection/images/*"
                }
                    
            ],
            "objects": [
                {
                    "storageContainer": "crossobject",
                    "generatedKeyName": "crosslayout",
                    "source": null,
                    "sourceContext": "/document/crossProjection/images/*/layoutText",
                    "inputs": [
                        {
                            "name": "OcrLayoutText",
                            "source": "/document/crossProjection/images/*/layoutText"
                        }
                    ]
                }
            ],
            "files": [
                {
                    "storageContainer": "crossimages",
                    "generatedKeyName": "crossimages",
                    "source": "/document/crossProjection/images/*/image"
                }
            ]
        }
    ]
}
```

Object projections require a container name for each projection. Object projections and file projections cannot share a container. 

### Relationships among table, object, and file projections

This example also highlights another feature of projections. By defining multiple types of projections within the same projection object, there is a relationship expressed within and across the different types (tables, objects, files). This allows you to start with a table row for a document and find all the OCR text for the images within that document in the object projection. 

If you do not want the data related, define the projections in different projection groups. For example, the following snippet will result in the tables being related, but without relationships between the tables and the object (OCR text) projections. 

Projection groups are useful when you want to project the same data in different shapes for different needs. For example, a projection group for the Power BI dashboard, and another projection group for capturing data used to train a machine learning model wrapped in a custom skill.

When building projections of different types, file and object projections are generated first, and the paths are added to the tables.

```json
"knowledgeStore" : {
    "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<Acct Name>;AccountKey=<Acct Key>;",
    "projections": [
        {
            "tables": [
                {
                    "tableName": "unrelatedDocument",
                    "generatedKeyName": "Documentid",
                    "source": "/document/projectionShape"
                },
                {
                    "tableName": "unrelatedKeyPhrases",
                    "generatedKeyName": "KeyPhraseid",
                    "source": "/document/projectionShape/keyPhrases"
                }
            ],
            "objects": [
                
            ],
            "files": []
        }, 
        {
            "tables": [],
            "objects": [
                {
                    "storageContainer": "unrelatedocrtext",
                    "source": null,
                    "sourceContext": "/document/normalized_images/*/text",
                    "inputs": [
                        {
                            "name": "ocrText",
                            "source": "/document/normalized_images/*/text"
                        }
                    ]
                },
                {
                    "storageContainer": "unrelatedocrlayout",
                    "source": null,
                    "sourceContext": "/document/normalized_images/*/layoutText",
                    "inputs": [
                        {
                            "name": "ocrLayoutText",
                            "source": "/document/normalized_images/*/layoutText"
                        }
                    ]
                }
            ],
            "files": []
        }
    ]
}
```

## Test projections

You can process projections by following these steps:

1. Set the knowledge store's `storageConnectionString` property to a valid V2 general purpose storage account connection string.  

1. Update the skillset by issuing a [PUT request](/rest/api/searchservice/update-skillset).

1. After updating the skillset, [run the indexer](/rest/api/searchservice/run-indexer). 

1. Monitor indexer execution to check progress and catch any errors.

1. In Azure Storage, [use Storage Explorer](knowledge-store-view-storage-explorer.md) to verify object creation.

1. If you are projecting tables, [import them into Power BI](knowledge-store-connect-power-bi.md) for table manipulation and visualization. In most cases, Power BI will auto-discover the relationships among tables.

## Common Issues

When defining a projection, there are a few common issues that can cause unanticipated results. Check for these issues if the output in knowledge store isn't what you expect.

+ String enrichments are not shaped into valid JSON. When strings are enriched, for example `merged_content` enriched with key phrases, the enriched property is represented as a child of `merged_content` within the enrichment tree. The default representation is not well-formed JSON. So at projection time, make sure to transform the enrichment into a valid JSON object with a name and a value.

+ Omission of `/*` at the end of a source path. If the source of a projection is `/document/projectionShape/keyPhrases`, the key phrases array is projected as a single object/row. Instead, set the source path to `/document/projectionShape/keyPhrases/*` to yield a single row or object for each of the key phrases.

+ Path syntax errors. Path selectors are case-sensitive and can lead to missing input warnings if you do not use the exact case for the selector.

## Next steps

The examples in this article demonstrate common patterns on how to create projections. Now that you have a good understanding of the concepts, you are better equipped to build projections for your specific scenario.

As you explore new features, consider incremental enrichment as your next step. Incremental enrichment is based on caching, which lets you reuse any enrichments that are not otherwise affected by a skillset modification. This is especially useful for pipelines that include OCR and image analysis.

> [!div class="nextstepaction"]
> [Configure caching for incremental enrichment i](search-howto-incremental-index.md)
