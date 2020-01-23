---
title: Knowledge store projections Tutorial 
titleSuffix: Azure Cognitive Search
description: Examples of common patterns on how to project enriched documents into the knowledge store for use with Power BI or Azure ML.

manager: eladz
author: vkurpad
ms.author: vikurpad
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/15/2020
---

# Knowledge store projections Tutorial: Effectively use projections to export enrichments to the knowledge store

> [!IMPORTANT] 
> Knowledge store is currently in public preview. Preview functionality is provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 
> The [REST API version 2019-05-06-Preview](search-api-preview.md) provides preview features. There is currently limited portal support, and no .NET SDK support.

Projections enable you to export your enriched documents for use in scenarios other than search. If you are new to the knowledge store or projections, start [here](knowledge-store-concept-intro.md).

Knowledge store projections support three types of projections
1. Tables
2. Objects
3. Files

As the knowledge store is an Azure Storage account, table projections are Azure Storage tables and are governed by the storage limits on tables, for more information, see [table storage limits](https://docs.microsoft.com/rest/api/storageservices/understanding-the-table-service-data-model). It is useful to know that the entity size cannot exceed 1 MB and a single property can be no bigger than 64 KB. These constraints make tables a good solution for storing a large number of small entities. 

Object and file projections are written to blob storage, object projections are saved as JSON files and can contain content from the document and any skill outputs or enrichments. The enrichment pipeline can also extract binaries like images, these binaries are projected as file projections. When a binary object is projected as an object projection, only the metadata associated with it is saved as a JSON blob. 

To learn how you work with projections, let's start with a few example scenarios. This tutorial assumes you're familiar with the enrichment process specifically, [skillsets](cognitive-search-working-with-skillsets.md). Projections are defined in the knowledge store object of the skillset, see [knowledge store](knowledge-store-concept-intro.md) for details. For all the scenarios, we will work with a sample skillset that you can use the [`import data wizard`](cognitive-search-quickstart-blob.md) to generate. In the `import data wizard` start with a blob datasource, on the add cognitive skills tab, add the entity recognition, key phrases, and language detection skills. Be sure to select the `Enable OCR and merge all text into merged_content field` option. Leave the knowledge store options empty, we'll be working with the knowledge store object in the skillset in the rest of this tutorial. Once you complete the import data workflow, you should have a valid enrichment pipeline of a datasource, skillset, indexer, and index. In the following sections of this tutorial, we will use the [REST APIs to work with the enrichment pipeline](search-get-started-postman.md).

> [!IMPORTANT] 
> When experimenting with projections, it is useful to [set the indexer cache property](search-howto-incremental-index.md) to ensure cost control. Editing projections will result in the entire document being enriched again if the indexer cache is not set. When the cache is set and only the projections updated, skillset executions for previously enriched documents do not result in any Cognitive Services charges.

If you view the skillset JSON in the portal, or GET the skillset using the REST API, you will see a skillset similar to the following snippet.

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

We can now add the `knowledgeStore` object and configuring the projections for each of the scenarios as needed. To create a projection, you either use a shaper skill to create a custom object that contains all the data you intend to project, or you use the inline shaping syntax for inputs to define the projections. This tutorial will demonstrate both options, you can choose to use either of the options for projections you create.

## Projecting to Tables for scenarios like Power BI

Power BI can read from tables and discover relationships based on the keys that the knowledge store projections create, this makes tables a good option to project data when you're trying to build a dashboard on your enriched data. Assuming we're trying to build a dashboard where we can visualize the key phrases extracted from documents as a word cloud, we can add a shaper skill to the skillset to create a custom shape that has the document-specific details and key phrases. Add the shaper skill to the skillset to create a new enrichment called ```pbiShape``` on the ```document```.

### Using a Shaper skill to create a custom shape

Create a custom shape that you would like to project, here we create a custom object that contains some metadata properties, key phrases, and entities. The object is called pbiShape and is parented under `/document`. 

> [!IMPORTANT] 
> Source paths for enrichments are required to be well formed JSON objects, before they can be projected. The enrichment tree can represent enrichments that are not well formed JSON, for example when a enrichment is parented to a primitve like a string. Note how `KeyPhrases` and `Entities` are wrapped into a valid JSON object with the `sourceContext`, this is required as `keyphrases` and `entities` are enrichments on primitives and need to be converted to valid JSON before they can be projected.

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
Now that we have all the data needed to project to tables we can update the knowledgeStore object with the table definitions.

Start by setting the knowledgeStore property on the skillset. 

```json
{
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

Set the ```storageConnectionString``` property to a valid V2 general purpose storage account connection string. In this scenario we define three tables in the projection object, note that each table requires a ```tableName```, ```source``` and ```generatedKeyName``` property, there is an additional ```referenceKeyName``` property that is optional. 

### Slicing 

When starting with a consolidated shape where all the content that needs to be projected is in a single shape (or node), slicing provides you with the ability to slice a single node into multiple tables or objects. Here, the ```pbiShape``` object is sliced into multiple tables. The slicing feature enables you to pull out parts of the shape, ```keyPhrases``` and ```Entities``` into separate tables. This is useful as multiple entities and keyPhrases are associated with each document. Slicing implicity generates a relationship between the parent and child tables, using the ```generatedKeyName``` in the parent table to create a column with the same name in the child table. 

### Naming relationships
The ```generatedKeyName``` and ```referenceKeyName``` properties are used to relate data across tables or even across projection types. Each row in the child table/projection has a property pointing back to the parent. The name of the column or property in the child is the ```referenceKeyName``` from the parent. When the ```referenceKeyName``` is not provided, the service defaults it to the ```generatedKeyName``` from the parent. PowerBI relies on these generated keys to discover relationships within the tables. If you need the column in the child table named differently, set the ```referenceKeyName``` property on the parent table. One example would be to set the ```generatedKeyName``` as ID on the pbiDocument table and the ```referenceKeyName``` as DocumentID. This would result in the column in the pbiEntities and pbiKeyPhrases tables containing the document id being named DocumentID.

You now have a working projection with three tables. Importing these tables into Power BI should result in Power BI auto discovering the relationships, allowing you to filter.

## Projecting to Objects

Object projections do not have the same limitations as table projections, are better suited for projecting large documents. In this example, we project the entire document to an object projection. Object projections are limited to a single projection in a container.
To define an object projection, we will use the ```objects``` array in the projections. You can generate a new shape using the shaper skill or use inline shaping of the object projection. While the tables example demonstrated the approach of creating a shape and slicing, this example demonstrates the use of inline shaping.

```json
{
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
## Projecting to Files

File projections are images that are either extracted from the source document or outputs of enrichments that can be projected out of the enrichment process. File projections, similar to object projections are implemented as blobs and contain the image. To generate a file projection, we use the ```files``` array in the projection object. This example projects all images extracted from the document to a container called samplefile.

```json
{
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

Sometimes you might need to project content across projection types. For example, if you need to save the OCR results of text and layout text in addition to the table projections, object projections would be a better option for this data. Let's now create a projection object in the knowledge store to project the document, key phrases and entities as tables, OCR text and layout text as object projections and the images as files.

```json
{
        "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<Acct Name>;AccountKey=<Acct Key>;",
        "projections": [
             {
                "tables": [
                    {
                        "tableName": "sampleDocument",
                        "generatedKeyName": "Documentid",
                        "source": "/document/pbiShape"
                    },
                    {
                        "tableName": "sampleKeyPhrases",
                        "generatedKeyName": "KeyPhraseid",
                        "source": "/document/pbiShape/keyPhrases/*"
                    }
                ],
                "objects": [
                    {
                        "storageContainer": "sampleocrtext",
                        "generatedKeyName": "ocrText",
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
                        "storageContainer": "sampleocrlayout",
                        "generatedKeyName": "ocrLayoutText",
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
                "files": [
                    {
                        "storageContainer": "fullfile",
                        "source": "/document/normalized_images/*"
                    }
                ]
            }
        ]
    }
```

Object projections require a container name for each projection, multiple object projections or file projections cannot share containers. Notice that the `generatedKeyName` and `referenceKeyName` properties are optional for objects and files.

### Relationships

This example also highlights another feature of projections, by defining multiple types of projections within the same projection object, there is a relationship expressed within and across the different types (tables, objects, files) of projections, allowing you to start with a table row for a document and find all the OCR text for the images within that document in the object projection. If you do not want the data related, define the projections in different projection objects, for example the following snippet will result in the tbles being related, but no relationships between the tables and the OCR text projections. Projection groups are useful when you want to project the same data in different shapes for different needs. For example, a projection group for the Power BI dashboard and another projection group for using the data to train a AI model for a skill.
When building projections of different types, file and object projections are generated first and the paths are added to the tables.

```json
{
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
### Projections with inline shaping and multiple types

Continuing with the earlier scenario, if we now want to add the images as well to the projections and ensure that all the data is related, the knowledgeStore object will be edited to be:

```json
{
        "storageConnectionString": "DefaultEndpointsProtocol=https;AccountName=<Acct Name>;AccountKey=<Acct Key>;",
        "projections": [
            {
                "tables": [
                    {
                        "tableName": "inlineDocument",
                        "generatedKeyName": "Id",
                        "referenceKeyName": "documentId",
                        "source": null,
                        "sourceContext": "/document",
                        "inputs": [
                            {
                                "name": "inlinePath",
                                "source": "/document/metadata_storage_path"
                            },
                            {
                                "name": "inlineContent",
                                "source": "/document/content"
                            }
                        ]
                    },
                    {
                        "tableName": "inlineKeyPhrases",
                        "generatedKeyName": "Id",
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
                        "tableName": "inlineEntities",
                        "generatedKeyName": "Id",
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
                "objects": [
                    {
                        "storageContainer": "inlineocrtext",
                        "generatedKeyName": "inlineocrtext",
                        "source": null,
                        "sourceContext": "/document/normalized_images/*/text",
                        "inputs": [
                            {
                                "name": "inlineOcrText",
                                "source": "/document/normalized_images/*/text"
                            }
                        ]
                    },
                    {
                        "storageContainer": "inlineocrlayout",
                        "generatedKeyName": "inlineocrlayout",
                        "source": null,
                        "sourceContext": "/document/normalized_images/*/layoutText",
                        "inputs": [
                            {
                                "name": "inlineOcrLayoutText",
                                "source": "/document/normalized_images/*/layoutText"
                            }
                        ]
                    }
                ],
                "files": [
                    {
                        "storageContainer": "inlineimages",
                        "generatedKeyName": "inlineocrimages",
                        "source": "/document/normalized_images/*"
                    }
                ]
            }
        ]
    }
```
These examples demonstrated the common patterns on how to use projections, you should now also have a good understanding of the concepts on building a projection for your specific scenario.

## Common Issues

When defining a projection, there are a few common issues that can cause unanticipated results.

1. Not shaping string enrichments. When strings are enriched, for example ```merged_content``` enriched with key phrases, the enriched property is represented as a child of merged_content within the enrichment tree. But at projection time, this needs to be transformed to a valid JSON object with a name and a value.
2. Omitting the ```/*``` at the end of a source path. If for example, the source of a projection is ```/document/pbiShape/keyPhrases``` the key phrases array is projected as a single object/row. Setting the source path to ```/document/pbiShape/keyPhrases/*``` yields a single row or object for each of the key phrases.
3. Path selectors are case sensitive and can lead to missing input warnings if you do not use the exact case for the selector.

