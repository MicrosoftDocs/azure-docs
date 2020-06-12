---
title: Projection concepts (preview)
titleSuffix: Azure Cognitive Search
description: Save and shape your enriched data from the AI enrichment indexing pipeline into a knowledge store for use in scenarios other than full text search. Knowledge store is currently in public preview.

manager: nitinme
author: vkurpad
ms.author: vikurpad
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/08/2020
---

# Knowledge store "projections" in Azure Cognitive Search

> [!IMPORTANT] 
> Knowledge store is currently in public preview. Preview functionality is provided without a service level agreement, and is not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 
> The [REST API version 2019-05-06-Preview](search-api-preview.md) provides preview features. There is currently limited portal support, and no .NET SDK support.

Azure Cognitive Search enables content enrichment through built-in cognitive skills and custom skills as part of indexing. Enrichments create new information where none previously existed: extracting information from images, detecting sentiment, key phrases, and entities from text, to name a few. Enrichments also add structure to undifferentiated text. All of these processes result in documents that make full text search more effective. In many instances, enriched documents are useful for scenarios other than search, such as for knowledge mining.

Projections, a component of [knowledge store](knowledge-store-concept-intro.md), are views of enriched documents that can be saved to physical storage for knowledge mining purposes. A projection lets you "project" your data into a shape that aligns with your needs, preserving relationships so that tools like Power BI can read the data with no additional effort.

Projections can be tabular, with data stored in rows and columns in Azure Table storage, or JSON objects stored in Azure Blob storage. You can define multiple projections of your data as it is being enriched. Multiple projections are useful when you want the same data shaped differently for individual use cases.

The knowledge store supports three types of projections:

+ **Tables**: For data that's best represented as rows and columns, table projections allow you to define a schematized shape or projection in Table storage. Only valid JSON objects can be projected as tables, the enriched document can contain nodes that are not named JSON objects and when projecting these objects, create a valid JSON object with a shaper skill or inline shaping.

+ **Objects**: When you need a JSON representation of your data and enrichments, object projections are saved as blobs. Only valid JSON objects can be projected as objects, the enriched document can contain nodes that are not named JSON objects and when projecting these objects, create a valid JSON object with a shaper skill or inline shaping.

+ **Files**: When you need to save the images extracted from the documents, file projections allow you to save the normalized images to blob storage.

To see projections defined in context, step through [Create a knowledge store in REST](knowledge-store-create-rest.md).

## Projection groups

In some cases, you will need to project your enriched data in different shapes to meet different objectives. The knowledge store allows you to define multiple groups of projections. Projection groups have the following key characteristics of mutual exclusivity and relatedness.

### Mutual exclusivity

All content projected into a single group is independent of data projected into other projection groups.
This independence implies that you can have the same data shaped differently, yet repeated in each projection group.

### Relatedness

Projection groups now allow you to project your documents across projection types while preserving the relationships across projection types. All content projected within a single projection group preserves relationships within the data across projection types. Within tables, relationships are based on a generated key and each child node retains a reference to the parent node. Across types (tables, objects and files), relationships are preserved when a single node is projected across different types. For example, consider a scenario where you have a document containing images and text. You could project the text to tables or objects and the images to files where the tables or objects have a column/property containing the file URL.

## Input shaping

Getting your data in the right shape or structure is key to effective use, be it tables or objects. The ability to shape or structure your data based on how you plan to access and use it is a key capability exposed as the **Shaper** skill within the skillset.  

Projections are easier to define when you have an object in the enrichment tree that matches the schema of the projection. The updated [Shaper skill](cognitive-search-skill-shaper.md) allows you to compose an object from different nodes of the enrichment tree and parent them under a new node. The **Shaper** skill allows you to define complex types with nested objects.

When you have a new shape defined that contains all the elements you need to project out, you can now use this shape as the source for your projections or as an input to another skill.

## Projection slicing

When defining a projection group, a single node in the enrichment tree can be sliced into multiple related tables or objects. Adding a projection with a source path that is a child of an existing projection will result in the child node being sliced out of the parent node and projected into the new yet related table or object. This technique allows you to define a single node in a shaper skill that can be the source for all of your projections.

## Table projections

Because it makes importing easier, we recommend table projections for data exploration with Power BI. Additionally, table projections allow for changing the cardinality between table relationships. 

You can project a single document in your index into multiple tables, preserving the relationships. When projecting to multiple tables, the complete shape will be projected into each table, unless a child node is the source of another table within the same group.

### Defining a table projection

When defining a table projection within the `knowledgeStore` element of your skillset, start by mapping a node on the enrichment tree to the table source. Typically this node is the output of a **Shaper** skill that you added to the list of skills to produce a specific shape that you need to project into tables. The node you choose to project can be sliced to project into multiple tables. The tables definition is a list of tables that you want to project.

Each table requires three properties:

+ tableName: The name of the table in Azure Storage.

+ generatedKeyName: The column name for the key that uniquely identifies this row.

+ source: The node from the enrichment tree you are sourcing your enrichments from. This node is usually the output of a shaper, but could be the output of any of the skills.

Here is an example of table projections.

```json
{
    "name": "your-skillset",
    "skills": [
      …your skills
    ],
"cognitiveServices": {
… your cognitive services key info
    },

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
}
```

As demonstrated in this example, the key phrases and entities are modeled into different tables and will contain a reference back to the parent (MainTable) for each row.

## Object projections

Object projections are JSON representations of the enrichment tree that can be sourced from any node. In many cases, the same **Shaper** skill that creates a table projection can be used to generate an object projection. 

```json
{
    "name": "your-skillset",
    "skills": [
      …your skills
    ],
"cognitiveServices": {
… your cognitive services key info
    },

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
}
```

Generating an object projection requires a few object-specific attributes:

+ storageContainer: The blob container where the objects will be saved
+ source: The path to the node of the enrichment tree that is the root of the projection

## File projection

File projections are similar to object projections and only act on the `normalized_images` collection. Similar to object projections, file projections are saved in the blob container with folder prefix of the base64 encoded value of the document ID. File projections cannot share the same container as object projections and need to be projected into a different container.

```json
{
    "name": "your-skillset",
    "skills": [
      …your skills
    ],
"cognitiveServices": {
… your cognitive services key info
    },

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
}
```

## Projection lifecycle

Your projections have a lifecycle that is tied to the source data in your data source. As your data is updated and reindexed, your projections are updated with the results of the enrichments ensuring your projections are eventually consistent with the data in your data source. The projections inherit the delete policy you've configured for your index. Projections are not deleted when the indexer or the search service itself is deleted.

## Using projections

After the indexer is run, you can read the projected data in the containers or tables you specified through projections.

For analytics, exploration in Power BI is as simple as setting Azure Table storage as the data source. You can easily create a set of visualizations on your data using the relationships within.

Alternatively, if you need to use the enriched data in a data science pipeline, you could [load the data from blobs into a Pandas DataFrame](../machine-learning/team-data-science-process/explore-data-blob.md).

Finally, if you need to export your data from the knowledge store, Azure Data Factory has connectors to export the data and land it in the database of your choice. 

## Next steps

As a next step, create your first knowledge store using sample data and instructions.

> [!div class="nextstepaction"]
> [Create a knowledge store in REST](knowledge-store-create-rest.md).

For a tutorial covering advanced projections concepts like slicing, inline shaping and relationships, start with [define projections in a knowledge store](knowledge-store-projections-examples.md)

> [!div class="nextstepaction"]
> [Define projections in a knowledge store](knowledge-store-projections-examples.md)
