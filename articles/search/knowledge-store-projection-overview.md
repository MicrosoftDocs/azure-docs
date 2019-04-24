---
title: Working with projections in knowledge store - Azure Search
description: Save and shape your enriched data from the AI indexing pipeline for use in scenarios other than search
manager: eladz
author: vkurpad
services: search
ms.service: search
ms.devlang: NA
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: vikurpad
ms.custom: seomay2019
---
# Working with projections
Projections are views of the enriched documents that can be saved to storage, and are part of the [Knowledge Store](knowledge-store-concept-intro.md) preview feature in Azure Search. The knowledge store allows you to "project" your data into a shape that aligns with your needs and preserves the relationships so tools like Power BI can read the data with no additional effort. Projections can be tabular, with data stored in rows and columns or objects, data stored in JSON blobs. 

You can define multiple projections of your data as it is being enriched. This is useful when you want the same data shaped differently for individual use cases. For an example of how to define projections in a skillset, see [define a skillset](cognitive-search-defining-skillset.md).

Azure Search enables you to enrich your content with AI skills before you insert them into the index. These enrichments add structure to your documents and make your search service more effective. In many instances, the enriched documents are useful for scenarios other than search as well. Projections are a feature in the knowledge store that allows you to save your enriched document in the shape that best enables these other applications.

The knowledge store supports two types of projections:

+ Tables: For scenarios where you have data that is best represented as rows and columns, table projections allow you to define a schematized shape or projection in table storage.

+ Objects: When you need a JSON representation of your data and enrichments, object projections you define are saved as blobs.

For getting started with projections, see [knowledge store walkthrough](cognitive-search-defining-skillset.md)

## Projection Groups

In some cases, you will need to project your enriched data in different shapes to meet different objectives. The knowledge store allows you to define multiple groups of projections. Projection groups have the following key characteristics.

### Mutually Exclusivity

All the content projected into a single group is independent of data projected into other projection groups. This implies that you can have the same data shaped differently yet repeated in each projection group. 
One constraint enforced in the projection groups is the mutual exclusivity of projection types with a projection group. You can only define either table projections or object projections within a single group, if you do require your data be projected into both tables and objects, you will need to define a projection group for tables and a second projection group for objects.

### Relationships

All content projected within a single projection group preserves relationships within the data. Relationships are based on a generated key and each child node includes a reference to the parent node. Relationships do not span across projection groups and tables or objects created in one projection group have no relationship to dta generated in other projection groups.

## Input Shaping
Getting your data in the right shape or structure is key to effective use, be it tables or objects. The ability to shape or structure your data based on how you plan to access and use it is a key capability exposed as the Shaper Skill within the skillset.  

Projections are easier to define when you have an object in the enrichment tree that matches the schema of the projection. The updated [shaper skill](cognitive-search-skill-shaper.md) allows you to compose an object from different nodes of the enrichment tree and parent them under a new node. The shaper skill allows you to define complex types with nested objects.

When you have a new shape defined that contains all the elements you need to project out, you can now use this shape as the source for your projections or as an input to another skill.

## Table Projections

In a number of scenarios, for example if you want to explore your data with Power BI, projecting your data as tables makes the process of importing the data easier. Table projections also give you the flexibility to change the cardinality of your data. You can now project a single document in your index into multiple tables, preserving the relationships.

When projecting to multiple tables, the complete shape will be projected into each table, unless a child node is the source of another table within the same group.

## Defining a Table Projection

When defining a table projection within the knowledgeStore object of your skillset, you start by mapping a node on the enrichment tree to the table source. Typically this node is the output of a shaper skill that you added to the list of skills to produce a specific shape that you need to project into tables. The node you choose to project can be sliced to project into multiple tables. The tables definition is a list of tables that you want to project. Each table requires three properties:

+ tableName: The name of the table in Azure Storage.
+ generatedKeyName: The column name for the key that uniquely identifies this row.
+ source: The node from the enrichment tree you are sourcing your enrichments from. This is usually the output of a shaper, but could be the output of any of the skills.

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
      "storageConnectionString": "a storage connection string",
      "projections" : [
        {
          "tables": [
            { "tableName": "MainTable", "generatedKeyName": "SomeId", "source": "/document/EnrichedShape" },
            { "tableName": "KeyPhrases", "generatedKeyName": "KeyPhraseId", "source": "/document/EnrichedShape/*/KeyPhrases/*" },
            { "tableName": "Entities", "generatedKeyName": "EntityId", "source": "/document/EnrichedShape/*/Entities/*" }
          ]
        },
        {
          "objects": [
            
          ]
        }
      ]
{
 
    "name": "your-skillset",
    "skills": [
      …your skills
      
    ],
"cognitiveServices": {
… your cognitive services key info
    },

    "knowledgeStore": {
      "storageConnectionString": "a storage connection string",
      "projections" : [
        {
          "tables": [
            { "tableName": "MainTable", "generatedKeyName": "SomeId", "source": "/document/EnrichedShape" },
            { "tableName": "KeyPhrases", "generatedKeyName": "KeyPhraseId", "source": "/document/EnrichedShape/*/KeyPhrases/*" },
            { "tableName": "Entities", "generatedKeyName": "EntityId", "source": "/document/EnrichedShape/*/Entities/*" }
          ]
        },
        {
          "objects": [
            
          ]
        }
      ]
    }
}
```
As demonstrated in this example, the key phrases and entities are modeled into different tables and will contain a reference back to the parent (MainTable) for each row. For example in  scenario a scenario where a case has multiple opinions and each opinion is being enriched by identifying entities contained within. You could model the projections as shown here.

![Entities and relationships in tables](media/knowledge-store-projections/-overviewtable-relationships.png "Modeling relationships in table projections")

## Object Projections
As described earlier, object projections are JSON representations of the enrichment tree that can be sourced from any node. In many cases, the same shaper skill defined to create the shape for table projections can be used to generate the object projection. If needed additional shaper skills can also be added to the skillset to generate new shapes of the enriched document needed for projecting as objects.
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
      "storageConnectionString": "a storage connection string",
      "projections" : [
{
          "tables": [ ]
        },
        {
          "objects": [
            {
              "storageContainer": "containername",
              "source": "/document/EnrichedShape/",
              "key": "/document/Id"
            }

          ]
        }
      ]
    }
  }
```

Generating an object projection requires a few object-specific attributes:

+ storageContainer: The container where the objects will be saved
+ source: The path to the node of the enrichment tree that is the root of the projection
+ key: A path that represents a unique key for the object to be stored. It will be used to create the name of the blob in the container.

## Using the Projections
After the indexer is run, you will be able to read the projected data in the containers or tables you specified when defining the projections. 

If you need to do analytics on your enriched data, exploring it in Power BI is as simple as setting Azure Table Storage as the data source in Power BI. You can very easily create a set of visualizations on your data that leverages the relationships within.

Alternatively, if you need to use the enriched data in a data science pipeline, you could [load the data from blobs into a Pandas DataFrame](../machine-learning/team-data-science-process/explore-data-blob.md).
If you need to export your data from the knowledge store, Azure Data Factory has connectors to export the data and land it in the database of your choice. 

## Next steps

As a next step, create your first knowledge store using sample data and instructions.

> [!div class="nextstepaction"]
> [How to create a knowlege store](knowledge-store-howto.md).