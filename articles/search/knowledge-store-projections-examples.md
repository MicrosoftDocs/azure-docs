---
title: Define projections in a knowledge store 
titleSuffix: Azure Cognitive Search
description: Examples of common patterns on how to project enriched documents into the knowledge store for use with Power BI or Azure ML.

manager: eladz
author: vkurpad
ms.author: vikurpad
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/15/2020
---

# Knowledge store projections: How to shape and export enrichments

> [!IMPORTANT] 
> Knowledge store is currently in public preview. Preview functionality is provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 
> The [REST API version 2019-05-06-Preview](search-api-preview.md) provides preview features. There is currently limited portal support, and no .NET SDK support.

Projections are the physical expression of enriched documents in a knowledge store. Effective use of your enriched documents requires structure. In this article, you'll explore both structure and relationships, learning how to build out projection properties, as well as how to relate data across projection types you create. 

To create a projection, you must shape the data using either a [Shaper skill](cognitive-search-skill-shaper.md) to create a custom object or use the inline shaping syntax within a projection definition. 

A data shape contains all the data you intend to project, formed as a hierarchy of nodes. This article shows you several techniques for shaping data so that it can be projected into physical structures that are conducive to reporting, analysis, or downstream processing. 

The examples presented in this article can be found in this [REST API sample](https://github.com/Azure-Samples/azure-search-postman-samples/blob/master/projections/Projections%20Docs.postman_collection.json), which you can download and run in an HTTP client.

## Introduction to the examples

If you are familiar with [projections](knowledge-store-projection-overview.md), you'll recall that there are three types:

+ Tables
+ Objects
+ Files

Table projections are stored in Azure Table storage. Object and file projections are written to blob storage, where object projections are saved as JSON files, and can contain content from the source document as well as any skill outputs or enrichments. The enrichment pipeline can also extract binaries like images, these binaries are projected as file projections. When a binary object is projected as an object projection, only the metadata associated with it is saved as a JSON blob. 

To understand the intersection between data shaping and projections, we'll use the following skillset as the basis for exploring various configurations. This skillset processes raw image and text content. Projections will be defined from the contents of the document and the outputs of the skills, for the scenarios we want to support.

> [!IMPORTANT] 
> When experimenting with projections, it is useful to [set the indexer cache property](search-howto-incremental-index.md) to ensure cost control. Editing projections will result in the entire document being enriched again if the indexer cache is not set. When the cache is set and only the projections updated, skillset executions for previously enriched documents do not result in any new Cognitive Services charges.

```json
{
    "name": "azureblob-skillset",
    "description": "Skillset created from the portal. skillsetName: azureblob-skillset; contentField: merged_content; enrichmentGranularity: document; knowledgeStoreStorageAccount: confdemo;",
    "skills": [
        {
            "@odata.type": "#Microsoft.Skills.Text.EntityRecognitionSkill",
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
            "includeTypelessEntities": null,
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
                },
                {
                    "name": "entities",
                    "targetName": "entities"
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
        "description": "DemosCS",
        "key": "<COGNITIVE SERVICES KEY>"
    },
    "knowledgeStore": null
}
```

Using this skillset, with its null `knowledgeStore` as the basis, our first example fills in the `knowledgeStore` object, configured with projections that create tabular data structures we can use in other scenarios. 

## Projecting to tables

Projecting to tables in Azure Storage is useful for reporting and analysis using tools like Power BI. Power BI can read from tables and discover relationships based on the keys that are generated during projection. If you're trying to build a dashboard, having related data will simplify that task. 

Let's suppose we're trying to build a dashboard where we can visualize the key phrases extracted from documents as a word cloud. To create the right data structure, we can add a Shaper skill to the skillset to create a custom shape that has the document-specific details and key phrases. The custom shape will be called `pbiShape` on the `document` root node.

> [!NOTE] 
> Table projections are Azure Storage tables, governed by the storage limits imposed by Azure Storage. For more information, see [table storage limits](https://docs.microsoft.com/rest/api/storageservices/understanding-the-table-service-data-model). It is useful to know that the entity size cannot exceed 1 MB and a single property can be no bigger than 64 KB. These constraints make tables a good solution for storing a large number of small entities.

### Using a Shaper skill to create a custom shape

Create a custom shape that you can project into table storage. Without a custom shape, a projection can only reference a single node (one projection per output). Creating a custom shape lets you aggregate various elements into a new logical whole that can be projected as a single table, or sliced and distributed across a collection of tables. 

In this example, the custom shape combines metadata and identified entities and key phrases. The object is called `pbiShape` and is parented under `/document`. 

> [!IMPORTANT] 
> One purpose of shaping is to ensure that all enrichment nodes are expressed in well-formed JSON, which is required for projecting into knowledge store. This is especially true when an enrichment tree contains nodes that are not well-formed JSON (for example, when an enrichment is parented to a primitive like a string).
>
> Notice the last two nodes, `KeyPhrases` and `Entities`. These are wrapped into a valid JSON object with the `sourceContext`. This is required as `keyphrases` and `entities` are enrichments on primitives and need to be converted to valid JSON before they can be projected.
>


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
            "targetName": "pbiShape"
        }
    ]
}
```

Add the above Shaper skill to the skillset. 

```json
    "name": "azureblob-skillset",
    "description": "A friendly description of the skillset goes here.",
    "skills": [
        {
            Shaper skill goes here
            }
        ],
    "cognitiveServices":  "A key goes here",
    "knowledgeStore": []
}  
```

Now that we have all the data needed to project to tables, update the knowledgeStore object with the table definitions. In this example, we have three tables, defined by setting the `tableName`, `source` and `generatedKeyName` properties.

```json
"knowledgeStore" : {
    "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<Acct Name>;AccountKey=<Acct Key>;",
    "projections": [
        {
            "tables": [
                {
                    "tableName": "pbiDocument",
                    "generatedKeyName": "Documentid",
                    "source": "/document/pbiShape"
                },
                {
                    "tableName": "pbiKeyPhrases",
                    "generatedKeyName": "KeyPhraseid",
                    "source": "/document/pbiShape/keyPhrases/*"
                },
                {
                    "tableName": "pbiEntities",
                    "generatedKeyName": "Entityid",
                    "source": "/document/pbiShape/Entities/*"
                }
            ],
            "objects": [],
            "files": []
        }
    ]
}
```

You can process your work by following these steps:

1. Set the ```storageConnectionString``` property to a valid V2 general purpose storage account connection string.  

1. Update the skillset by issuing the PUT request.

1. After updating the skillset, run the indexer. 

You now have a working projection with three tables. Importing these tables into Power BI should result in Power BI auto-discovering the relationships.

Before moving on the next example, lets revisit aspects of the table projection to understand the mechanics of slicing and relating data.

### Slicing 

Slicing is a technique that subdivides a whole consolidated shape into constituent parts. The outcome consists of separate but related tables that you can work with individually.

In the example, `pbiShape` is the consolidated shape (or enrichment node). In the projection definition, `pbiShape` is sliced into additional tables, which enables you to pull out parts of the shape, ```keyPhrases``` and ```Entities```. In Power BI, this is useful as multiple entities and keyPhrases are associated with each document, and you will get more insights if you can see entities and keyPhrases as categorized data.

Slicing implicitly generates a relationship between the parent and child tables, using the ```generatedKeyName``` in the parent table to create a column with the same name in the child table. 

### Naming relationships

The ```generatedKeyName``` and ```referenceKeyName``` properties are used to relate data across tables or even across projection types. Each row in the child table/projection has a property pointing back to the parent. The name of the column or property in the child is the ```referenceKeyName``` from the parent. When the ```referenceKeyName``` is not provided, the service defaults it to the ```generatedKeyName``` from the parent. 

Power BI relies on these generated keys to discover relationships within the tables. If you need the column in the child table named differently, set the ```referenceKeyName``` property on the parent table. One example would be to set the ```generatedKeyName``` as ID on the pbiDocument table and the ```referenceKeyName``` as DocumentID. This would result in the column in the pbiEntities and pbiKeyPhrases tables containing the document id being named DocumentID.

## Projecting to objects

Object projections do not have the same limitations as table projections and are better suited for projecting large documents. In this example, we project the entire document to an object projection. Object projections are limited to a single projection in a container and cannot be sliced.

To define an object projection, we will use the ```objects``` array in the projections. You can generate a new shape using the Shaper skill or use inline shaping of the object projection. While the tables example demonstrated the approach of creating a shape and slicing, this example demonstrates the use of inline shaping. 

Inline shaping is the ability to create a new shape in the definition of the inputs to a projection. Inline shaping creates an anonymous object that is identical to what a Shaper skill would produce (in our case, `pbiShape`). Inline shaping is useful if you are defining a shape that you do not plan to reuse.

The projections property is an array. For this example, we are adding a new projection instance to the array, where the knowledgeStore definition contains inline projections. When using inline projections, you can omit the  Shaper skill.

```json
"knowledgeStore" : {
        "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<Acct Name>;AccountKey=<Acct Key>;",
        "projections": [
             {
                "tables": [ ],
                "objects": [
                    {
                        "storageContainer": "sampleobject",
                        "source": null,
                        "generatedKeyName": "myobject",
                        "sourceContext": "/document",
                        "inputs": [
                            {
                                "name": "metadata_storage_name",
                                "source": "/document/metadata_storage_name"
                            },
                            {
                                "name": "metadata_storage_path",
                                "source": "/document/metadata_storage_path"
                            },
                            {
                                "name": "content",
                                "source": "/document/content"
                            },
                            {
                                "name": "keyPhrases",
                                "source": "/document/merged_content/keyphrases/*"
                            },
                            {
                                "name": "entities",
                                "source": "/document/merged_content/entities/*/name"
                            },
                            {
                                "name": "ocrText",
                                "source": "/document/normalized_images/*/text"
                            },
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

## Projecting to file

File projections are images that are either extracted from the source document or outputs of enrichment that can be projected out of the enrichment process. File projections, similar to object projections, are implemented as blobs in Azure Storage, and contain the image. 

To generate a file projection, we use the `files` array in the projection object. This example projects all images extracted from the document to a container called `samplefile`.

```json
"knowledgeStore" : {
        "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<Acct Name>;AccountKey=<Acct Key>;",
        "projections": [
            {
                "tables": [ ],
                "objects": [ ],
                "files": [
                    {
                        "storageContainer": "samplefile",
                        "source": "/document/normalized_images/*"
                    }
                ]
            }
        ]
    }
```

## Projecting to multiple types

A more complex scenario might require you to project content across projection types. For example, if you need to project some data like key phrases and entities to tables, save the OCR results of text and layout text as objects, and then project the images as files. 

In this example, updates to the skillset include the following changes:

1. Create a table with a row for each document.
1. Create a table related to the document table with each key phrase identified as a row in this table.
1. Create a table related to the document table with each entity identified as a row in this table.
1. Create an object projection with the layout text for each image.
1. Create a file projection, projecting each extracted image.
1. Create a cross reference table that contains references to the document table, object projection with the layout text and the file projection.

These changes are reflected in the knowledgeStore definition further down. 

### Shape data for cross-projection

To get the shapes we need for these projections, start by adding a new Shaper skill that creates a shaped object called `crossProjection`. 

```json
{
    "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
    "name": "ShaperForCross",
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

From the consolidated crossProjection object, we can slice the object into multiple tables, capture the OCR output as blobs, and then save the image as files (also in Blob storage).

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

Object projections require a container name for each projection, object projections or file projections cannot share a container. 

### Relationships among table, object, and file projections

This example also highlights another feature of projections. By defining multiple types of projections within the same projection object, there is a relationship expressed within and across the different types (tables, objects, files), allowing you to start with a table row for a document and find all the OCR text for the images within that document in the object projection. 

If you do not want the data related, define the projections in different projection objects. For example, the following snippet will result in the tables being related, but without relationships between the tables and the object (OCR text) projections. 

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
                        "source": "/document/pbiShape"
                    },
                    {
                        "tableName": "unrelatedKeyPhrases",
                        "generatedKeyName": "KeyPhraseid",
                        "source": "/document/pbiShape/keyPhrases"
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

## Common Issues

When defining a projection, there are a few common issues that can cause unanticipated results. Check for these issues if the output in knowledge store isn't what you expect.

+ Not shaping string enrichments into valid JSON. When strings are enriched, for example `merged_content` enriched with key phrases, the enriched property is represented as a child of `merged_content` within the enrichment tree. The default representation is not well-formed JSON. So at projection time, make sure to transform the enrichment into a valid JSON object with a name and a value.

+ Omitting the ```/*``` at the end of a source path. If the source of a projection is `/document/pbiShape/keyPhrases`, the key phrases array is projected as a single object/row. Instead, set the source path to `/document/pbiShape/keyPhrases/*` to yield a single row or object for each of the key phrases.

+ Path syntax errors. Path selectors are case-sensitive and can lead to missing input warnings if you do not use the exact case for the selector.

## Next steps

The examples in this article demonstrate common patterns on how to create projections. Now that you have a good understanding of the concepts, you are better equipped to build projections for your specific scenario.

As you explore new features, consider incremental enrichment as your next step. Incremental enrichment is based on caching, which lets you reuse any enrichments that are not otherwise affected by a skillset modification. This is especially useful for pipelines that include OCR and image analysis.

> [!div class="nextstepaction"]
> [Introduction to incremental enrichment and caching](cognitive-search-incremental-indexing-conceptual.md)

For an overview on projections, learn more about capabilities like groups and slicing, and how you [define them in a skillset](knowledge-store-projection-overview.md)

> [!div class="nextstepaction"]
> [Projections in a knowledge store](knowledge-store-projection-overview.md)

