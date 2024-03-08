---
title: Projection examples
titleSuffix: Azure AI Search
description: Explore a detailed example that projects the output of a rich skillset into complex shapes that inform the structure and composition of content in a knowledge store.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 01/31/2023
---

# Detailed example of shapes and projections in a knowledge store

This article provides a detailed example that supplements [high-level concepts](knowledge-store-projection-overview.md) and [syntax-based articles](knowledge-store-projections-examples.md) by walking you through the shaping and projection steps required for fully expressing the output of a rich skillset in a [knowledge store](knowledge-store-concept-intro.md).

If your application requirements call for multiple skills and projections, this example can give you a better idea of how shapes and projections intersect.

## Download sample definitions

This example uses [Postman app](https://www.postman.com/downloads/) and the [Search REST APIs](/rest/api/searchservice/).

Clone or download [azure-search-postman-samples](https://github.com/Azure-Samples/azure-search-postman-samples) on GitHub and import the [**Projections collection**](https://github.com/Azure-Samples/azure-search-postman-samples/tree/main/projections) to step through this example yourself.

## Set up sample data

Sample documents aren't included with the Projections collection, but the [AI enrichment demo data files](https://github.com/Azure-Samples/azure-search-sample-data/tree/main/ai-enrichment-mixed-media) from the [azure-search-sample-data repo](https://github.com/Azure-Samples/azure-search-sample-data) contain text and images, and will work with the projections described in this example.

Create a blob container in Azure Storage and upload all 14 items.

While in Azure Storage, copy a connection string so that you can specify it in the Postman collection.

## Example skillset

To understand the dependency between shapes and projections, review the following skillset that creates enriched content. This skillset processes both raw images and text, producing outputs that will be referenced in shapes and projections.

Pay close attention to skill outputs (targetNames). Outputs written to the enriched document tree are referenced in projections and in shapes (via Shaper skills).

```json
{
    "name": "projections-demo-ss",
    "description": "Skillset that enriches blob data found in "merged_content". The enrichment granularity is a document.",
    "skills": [
        {
            "@odata.type": "#Microsoft.Skills.Text.V3.EntityRecognitionSkill",
            "name": "#1",
            "description": null,
            "context": "/document/merged_content",
            "categories": [
                "Person",
                "Quantity",
                "Organization",
                "URL",
                "Email",
                "Location",
                "DateTime"
            ],
            "defaultLanguageCode": "en",
            "minimumPrecision": null,
            "inputs": [
                {
                    "name": "text",
                    "source": "/document/merged_content"
                },
                {
                    "name": "languageCode",
                    "source": "/document/language"
                }
            ],
            "outputs": [
                {
                    "name": "persons",
                    "targetName": "people"
                },
                {
                    "name": "organizations",
                    "targetName": "organizations"
                },
                {
                    "name": "locations",
                    "targetName": "locations"
                }
            ]
        },
        {
            "@odata.type": "#Microsoft.Skills.Text.KeyPhraseExtractionSkill",
            "name": "#2",
            "description": null,
            "context": "/document/merged_content",
            "defaultLanguageCode": "en",
            "maxKeyPhraseCount": null,
            "inputs": [
                {
                    "name": "text",
                    "source": "/document/merged_content"
                },
                {
                    "name": "languageCode",
                    "source": "/document/language"
                }
            ],
            "outputs": [
                {
                    "name": "keyPhrases",
                    "targetName": "keyphrases"
                }
            ]
        },
        {
            "@odata.type": "#Microsoft.Skills.Text.LanguageDetectionSkill",
            "name": "#3",
            "description": null,
            "context": "/document",
            "inputs": [
                {
                    "name": "text",
                    "source": "/document/merged_content"
                }
            ],
            "outputs": [
                {
                    "name": "languageCode",
                    "targetName": "language"
                }
            ]
        },
        {
            "@odata.type": "#Microsoft.Skills.Text.MergeSkill",
            "name": "#4",
            "description": null,
            "context": "/document",
            "insertPreTag": " ",
            "insertPostTag": " ",
            "inputs": [
                {
                    "name": "text",
                    "source": "/document/content"
                },
                {
                    "name": "itemsToInsert",
                    "source": "/document/normalized_images/*/text"
                },
                {
                    "name": "offsets",
                    "source": "/document/normalized_images/*/contentOffset"
                }
            ],
            "outputs": [
                {
                    "name": "mergedText",
                    "targetName": "merged_content"
                }
            ]
        },
        {
            "@odata.type": "#Microsoft.Skills.Vision.OcrSkill",
            "name": "#5",
            "description": null,
            "context": "/document/normalized_images/*",
            "textExtractionAlgorithm": "printed",
            "lineEnding": "Space",
            "defaultLanguageCode": "en",
            "detectOrientation": true,
            "inputs": [
                {
                    "name": "image",
                    "source": "/document/normalized_images/*"
                }
            ],
            "outputs": [
                {
                    "name": "text",
                    "targetName": "text"
                },
                {
                    "name": "layoutText",
                    "targetName": "layoutText"
                }
            ]
        }
    ],
    "cognitiveServices": {
        "@odata.type": "#Microsoft.Azure.Search.CognitiveServicesByKey",
        "description": "An Azure AI services resource in the same region as Search.",
        "key": "<Azure AI services All-in-ONE KEY>"
    },
    "knowledgeStore": null
}
```

## Example Shaper skill

A [Shaper skill](cognitive-search-skill-shaper.md) is a utility for working with existing enriched content instead of creating new enriched content. Adding a Shaper to a skillset lets you create a custom shape that you can project into table or blob storage. Without a custom shape, projections are limited to referencing a single node (one projection per output), which isn't suitable for tables. Creating a custom shape aggregates various elements into a new logical whole that can be projected as a single table, or sliced and distributed across a collection of tables. 

In this example, the custom shape combines blob metadata and identified entities and key phrases. The custom shape is called `projectionShape` and is parented under `/document`. 

One purpose of shaping is to ensure that all enrichment nodes are expressed in well-formed JSON, which is required for projecting into knowledge store. This is especially true when an enrichment tree contains nodes that aren't well-formed JSON (for example, when an enrichment is parented to a primitive like a string).

Notice the last two nodes, `KeyPhrases` and `Entities`. These are wrapped into a valid JSON object with the `sourceContext`. This is required as `keyphrases` and `entities` are enrichments on primitives and need to be converted to valid JSON before they can be projected.

```json
{
    "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
    "name": "ShaperForTables",
    "description": null,
    "context": "/document",
    "inputs": [
        {
            "name": "metadata_storage_content_type",
            "source": "/document/metadata_storage_content_type",
            "sourceContext": null,
            "inputs": []
        },
        {
            "name": "metadata_storage_name",
            "source": "/document/metadata_storage_name",
            "sourceContext": null,
            "inputs": []
        },
        {
            "name": "metadata_storage_path",
            "source": "/document/metadata_storage_path",
            "sourceContext": null,
            "inputs": []
        },
        {
            "name": "metadata_content_type",
            "source": "/document/metadata_content_type",
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
            "name": "Entities",
            "source": null,
            "sourceContext": "/document/merged_content/entities/*",
            "inputs": [
                {
                    "name": "Entities",
                    "source": "/document/merged_content/entities/*/name"
                }

            ]
        }
    ],
    "outputs": [
        {
            "name": "output",
            "targetName": "projectionShape"
        }
    ]
}
```

### Add Shapers to a skillset

The example skillset introduced at the start of this article didn't include the Shaper skill, but Shaper skills belong in a skillset and are often placed towards the end.

Within a skillset, a Shaper skill might look like this:

```json
    "name": "projections-demo-ss",
    "skills": [
        {
            <Shaper skill goes here>
            }
        ],
    "cognitiveServices":  "A key goes here",
    "knowledgeStore": []
}  
```

## Projecting to tables

Drawing on the examples above, there's a known quantity of enrichments and data shapes that can be referenced in table projections. In the tables projection below, three tables are defined by setting the `tableName`, `source` and `generatedKeyName` properties.

All three of these tables will be related through generated keys and by the shared parent `/document/projectionShape`.

```json
"knowledgeStore" : {
    "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<Acct Name>;AccountKey=<Acct Key>;",
    "projections": [
        {
            "tables": [
                {
                    "tableName": "tblDocument",
                    "generatedKeyName": "Documentid",
                    "source": "/document/projectionShape"
                },
                {
                    "tableName": "tblKeyPhrases",
                    "generatedKeyName": "KeyPhraseid",
                    "source": "/document/projectionShape/keyPhrases/*"
                },
                {
                    "tableName": "tblEntities",
                    "generatedKeyName": "Entityid",
                    "source": "/document/projectionShape/Entities/*"
                }
            ],
            "objects": [],
            "files": []
        }
    ]
}
```

### Test your work

You can check projection definitions by following these steps:

1. Set the knowledge store's `storageConnectionString` property to a valid V2 general purpose storage account connection string.  

1. Update the skillset by issuing the PUT request.

1. After updating the skillset, run the indexer. 

You now have a working projection with three tables. [Importing these tables into Power BI](knowledge-store-connect-power-bi.md) should result in Power BI discovering the relationships.

Before moving on to the next example, let's revisit aspects of the table projection to understand the mechanics of slicing and relating data.

### Slicing a table into multiple child tables

Slicing is a technique that subdivides a whole consolidated shape into constituent parts. The outcome consists of separate but related tables that you can work with individually.

In the example, `projectionShape` is the consolidated shape (or enrichment node). In the projection definition, `projectionShape` is sliced into additional tables, which enables you to pull out parts of the shape, `keyPhrases` and `Entities`. In Power BI, this is useful as multiple entities and keyPhrases are associated with each document, and you'll get more insights if you can see entities and keyPhrases as categorized data.

Slicing implicitly generates a relationship between the parent and child tables, using the `generatedKeyName` in the parent table to create a column with the same name in the child table. 

### Naming relationships

The `generatedKeyName` and `referenceKeyName` properties are used to relate data across tables or even across projection types. Each row in the child table has a property pointing back to the parent. The name of the column or property in the child is the `referenceKeyName` from the parent. When the `referenceKeyName` isn't provided, the service defaults it to the `generatedKeyName` from the parent. 

Power BI relies on these generated keys to discover relationships within the tables. If you need the column in the child table named differently, set the `referenceKeyName` property on the parent table. One example would be to set the `generatedKeyName` as ID on the tblDocument table and the `referenceKeyName` as DocumentID. This would result in the column in the tblEntities and tblKeyPhrases tables containing the document ID being named DocumentID.

## Projecting blob documents

Object projections are JSON representations of the enrichment tree that can be sourced from any node. In comparison with table projections, object projections are simpler to define and are used when projecting whole documents. Object projections are limited to a single projection in a container and can't be sliced.

To define an object projection, use the `objects` array in the projections property.

The source is the path to a node of the enrichment tree that is the root of the projection. Although it isn't required, the node path is usually the output of a Shaper skill. This is because most skills don't output valid JSON objects on their own, which means that some form of shaping is necessary. In many cases, the same Shaper skill that creates a table projection can be used to generate an object projection. Alternatively, the source can also be set to a node with [an inline shaping](knowledge-store-projection-shape.md#inline-shape) to provide the structure.

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

## Projecting an image file

File projections are always binary, normalized images, where normalization refers to potential resizing and rotation for use in skillset execution. File projections, similar to object projections, are created as blobs in Azure Storage, and contain the image.

To define a file projection, use the `files` array in the projections property.

The source is always `/document/normalized_images/*`. File projections only act on the `normalized_images` collection. Neither indexers nor a skillset will pass through the original non-normalized image.

The destination is always a blob container, with a folder prefix of the base64 encoded value of the document ID. File projections can't share the same container as object projections and need to be projected into a different container. 

The following example projects all normalized images extracted from the document node of an enriched document, into a container called `myImages`.

```json
"knowledgeStore" : {
    "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<Acct Name>;AccountKey=<Acct Key>;",
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
}
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

Object projections require a container name for each projection. Object projections and file projections can't share a container. 

### Relationships among table, object, and file projections

This example also highlights another feature of projections. By defining multiple types of projections within the same projection object, there's a relationship expressed within and across the different types (tables, objects, files). This allows you to start with a table row for a document and find all the OCR text for the images within that document in the object projection. 

If you don't want the data related, define the projections in different projection groups. For example, the following snippet will result in the tables being related, but without relationships between the tables and the object (OCR text) projections. 

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

## Next steps

The example in this article demonstrates common patterns on how to create projections. Now that you have a good understanding of the concepts, you're better equipped to build projections for your specific scenario.

> [!div class="nextstepaction"]
> [Configure caching for incremental enrichment](search-howto-incremental-index.md)
