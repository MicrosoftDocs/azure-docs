---
title: Working with skillsets - Azure Search
description: Skillsets in cognitive search enable orchestration of AI enrichments
manager: eladz
author: vkurpad
services: search
ms.service: search
ms.topic: conceptual
ms.date: 05/02/2019
ms.author: vikurpad
ms.subservice: cognitive-search
---
# Working with skillsets

Skillsets define the AI skills that are invoked within the enrichment pipeline to enrich each document. 
A skillset primarily comprises of three properties:
+	Skills is an unordered collection of skills where the platform determines the sequence of execution based on the inputs required for each skill. 
+	CognitiveServices is the cognitive services key required for billing the cognitive skills invoked
+	KnowledgeStore is the storage account where your enriched documents can be projected in addition to the search index.
Skillsets are authored in JSON, you can build complex skillsets with looping and branching using the expression language. The expression language uses a path notation to represent nodes in the enrichment tree where a "/" traverses a level lower in the tree and  "*" acts as a for each operator in the context. These concepts are best described in with an example. We will be using the [JFK Files sample](https://github.com/microsoft/AzureSearch_JFK_Files/blob/master/JfkWebApiSkills/JfkInitializer/skillset.jsonf_Q?e=HJQEAK) to illustrate some of the concepts and capabilities. But first, we will introduce a few concepts.

# Concepts
## Enrichment Tree
To envision how a skillset progressively enriches your document, let’s start with what the document looks like before any enrichment. The output of document cracking is dependent on the data source and the specific parsing mode selected. 
|Data Source\Parsing Mode |Default |JSON | JSON Lines, CSV |
|---|---|---|---|---|
|Blob Storage |/document/content<br>/document/normalized_images/*<br>… |/document/{key1}<br>/document/{key2}<br>… |/document/{key1}<br>/document/{key2}<br>… |
|SQL |/document/{column1}<br>/document/{column2}<br>… |   |   |
|Cosmos DB |/document/{key1}<br>/document/{key2}<br>… |   |   |

The enrichment tree refers to the JSON representation of the document and enrichments as it flows through the enrichment pipeline. The tree is instantiated as the output of document cracking and the table above describes the state of a document entering into the enrichment pipeline. As skills execute they add new nodes to the enrichment tree and those new nodes can then be used as inputs for downstream skills. Enrichments are not mutable, nodes can only be created not edited. As your skillsets get more complex, so will your enrichment tree, but not all nodes in the enrichment tree need to make it to the index or the knowledge store. You can selectively persist only a subset of the enrichments to the index or the knowledge store.
For the rest of this document we will assume we are working with PDF files in blob storage, but the same concepts apply to enriching documents from all other data sources.

## Context
Each skill requires a context. A context determines:
+	The number of times the skill executes, based on the nodes selected. For of type collection, adding an * at the end will result in the skill being invoked once for each instance in the collection. 
+	Where in the enrichment tree the skill outputs are parented. Outputs are always added to the tree as children of the context node.
+	The nodes to be enriched. For contexts that contain multiple nested collections the context performs the equivalent of a flatmap to yield a set of nodes that will be enriched.
+	Where in the tree the input is evaluated. Inputs can only be sourced from nodes scoped by the context. 

## SourceContext
The sourceContext is only used in Shaper skills and projections to be able to build multi-level nested objects. The context is limiting in scenarios where you need to create a nested object as all inputs within a specified context are flattened. When you are building a nested hierarchy, the source context allows you to define a new object with named properties. This is a concept that is described with an example in the projections section.

## Projections
Projection is the process of selecting the nodes from the enrichment tree to be added to the knowledge store. Projections are custom shapes of the document content and enrichments that can be outputted as either table or object projections. To learn more about working with projections, see [working with projections](knowledge-store-projection-overview.md).

|Source |Destination |Selector |
|---|---|---|
|Document content |Index| Field mapping |
|Enrichment output| Index| Output field mapping |
|Document content |Knowledge store |Projection |
|Enrichment output |Knowledge store |Projection |

# Document Lifecycle
Let’s now step through a skillset and look at how the enrichment tree evolves with the execution of each skill and how the context and inputs work to determine how many times a skill executes and what the shape of the input is based on the context.

One important aspect of the enrichment tree is the scope of the enrichments addressable with a specific path. Let’s look at the JFK Files sample skillset, and evaluate the document state, inputs and outputs as each skill executes.
## Skill #1: OCR Skill 
With the skill context of ```"/document/normalized_images/*"```, this skill will execute once for each image in the document. The skill generates a set out outputs, the outputs we want are the text and layoutText . Since neither of these nodes exist in the enrichment tree you don’t need to rename them with a targetName option. If you did have an existing node with the same name, the targetName allows you to create the node with a different name.
The enrichment tree now has the new nodes parented under the context of the skill and these nodes are available to any downstream skills, projections or output field mappings.
 While the document ```"/document"``` is the root node for all enrichments, when ```"/document"``` is addressed, the only child properties are ```"/document/content"```, ```"/document/normalized_images/*"```. To access any of the enrichments that were added to a node in a subsequent skill, the full path for those enrichments are needed. For example, if you want to use the text from OCR as an input to another skill, you will need to select it as ```"/document/normalized_images/*/text"```.
 ![enrichment tree after document cracking](media/cogntive-search-working-with-skillsets/enricment-tree-before.png "Enrichment tree after document cracking and before skill execution")
 ![enrichment tree after skill #1](media/cogntive-search-working-with-skillsets/enricment-tree-after.png "Enrichment tree after  skill #1 executes")
 You should now be able to look at the remainder of the skills in the skillset and be able to visualize how the tree of enrichments continues to grow with the execution of each skill. Skills like the merge skill and the shaper skill create new nodes from existing nodes, but do not affect the existing nodes. 

# Knowledge Store
Skillsets also define a knowledge store where your enriched documents can be projected as tables or objects. To save your enriched data in the knowledge store, you define a set of projections of your enriched document. To learn more about the knowledge store see [what is knowledge store?](knowledge-store-concept-intro.md)
## Slicing Projections
When defining a table projection group, a single node in the enrichment tree can be sliced into multiple related tables. Adding a table with a source path that is a child of an existing table projection will result in the child node being sliced out of the parent node and projected into the new yet related table. This allows you to define a single node in a shaper skill that can be the source for all your table projections. 
## Shaping Projections
There are two ways to define a projection. You could use a shaper skill to create a new node that is the root node for all the enrichments you are projecting. You could also inline shape a projection within the projection the definition itself.
One advantage of the shaper approach is that it ensures that all the mutations of the enrichment tree are contained within the skills which does make debugging issues with your skillset easier. Either approach works, the following example demonstrates each of the approaches. Assuming we are working with a set of reviews and enrich the reviews enriched with key phrases, entities and sentiment analysis. The enrichment tree in fig 3 represents the state after all enrichments are complete.
![enrichment tree after all skills](media/cogntive-search-working-with-skillsets/enricment-tree-projection.png "Enrichment tree before projection")
To create a shape that you can project into three tables namely Reviews, KeyPhrases and Entities, the two options are
### Shaper Skill 
```json
{
    "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
    "context": "/document",
    "inputs": [
        {
            "name": "review",
            "source": "/document/review"
        },
{
            "name": "sentiment",
            "source": "/document/review/sentiment"
        },
        {
            "name": "keyPhrases",
            "sourceContext": "/document/review/keyPhrases/*",
            "inputs": [
              {
                  "name": "keyPhrases",
                  "source": "/document/review/keyPhrases/*"
              }
            ]
        },
{
            "name": "entities",
            "sourceContext": "/document/review/entites/*",
            "inputs": [
              {
                  "name": "entities",
                  "source": "/document/review/entites/*"
              }
            ]
        }


    ],
    "outputs": [
        {
            "name": "output",
            "targetName": "reviewProjection"
        }
    ]
}
```
### Inline Shaping
Within the projections object of the knowledge store definition, you can select the nodes of the enrichment tree to project.
```json
{

    "projections" : [
        {
          "tables": [
            { "tableName": "Reviews", "generatedKeyName": "ReviewId", "sourceContext": "/document", "inputs":[
{ "name": "review",
"source": "/document/review"
},
{ "name": "sentiment",
"source": "/document/review/sentiment"
}]},
            { "tableName": "KeyPhrases", "generatedKeyName": "KeyPhraseId", "sourceContext": "/document", "inputs":[
{ "name": "keyPhrases",
"source": "/document/review/keyPhrases/*"
}]},
            { "tableName": "Entities", "generatedKeyName": "EntityId", "sourceContext": "/document", "inputs":[
{ "name": "entities",
"source": "/document/review/entities/*"
}] }
          ]
        },
        {
          "objects": [
            
          ]
        }
      ]

}
```
One observation from both the approaches is how keyPhrases and entities are projected using the sourceContext. This is because the entities and key phrases are collections of strings that are children of the review text, but projections require a JSON object. The sourceContext wraps the primitives into an object with a named property enabling even primitives to be projected independently.


## Next steps

As a next step, create your first skillset.

> [!div class="nextstepaction"]
> [Create your first skillset](cognitive-search-defining-skillset.md).