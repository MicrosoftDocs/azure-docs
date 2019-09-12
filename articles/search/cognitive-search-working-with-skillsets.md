---
title: Working with skillsets - Azure Search
description: Skillsets in cognitive search enable orchestration of AI enrichments, understanding a few concepts and how skillsets works allows you to build complex skillsets
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
A skillset comprises of three properties:
+	```skills```, an unordered collection of skills where the platform determines the sequence of execution based on the inputs required for each skill. 
+	```cognitiveServices```, the cognitive services key required for billing the cognitive skills invoked.
+	```knowledgeStore```, the storage account where your enriched documents can be projected in addition to the search index.

Skillsets are authored in JSON, you can build complex skillsets with looping and [branching](https://docs.microsoft.com/en-us/azure/search/cognitive-search-skill-conditional) using the expression language. The expression language uses the [JSON Pointer](https://tools.ietf.org/html/rfc6901) path notation with a few modifications to identify nodes in the enrichment tree. A ```"/"``` traverses a level lower in the tree and  ```"*"``` acts as a for each operator in the context. These concepts are best described with an example, to illustrate some of the concepts and capabilities, we will walk through the [hotel reviews sample](knowledge-store-connect-powerbi.md) skillset. To view the skillset once you've followed the import data workflow, you will need to use a REST API client to [get the skillset](https://docs.microsoft.com/en-us/rest/api/searchservice/get-skillset).

## Concepts
### Enrichment tree
To envision how a skillset progressively enriches your document, let’s start with what the document looks like before any enrichment. The output of document cracking is dependent on the data source and the specific parsing mode selected. This is also the state of the document that the [field mappings](search-indexer-field-mappings.md) can source content from when adding data to the search index.
![Knowledge store in pipeline diagram](./media/knowledge-store-concept-intro/annotationstore_sans_internalcache.png "Knowledge store in pipeline diagram")

The enrichment tree is the JSON representation of the document and enrichments as it flows through the enrichment pipeline. 

|Data Source\Parsing Mode|Default|JSON|JSON Lines/CSV|
|---|---|---|---|
|Blob Storage|/document/content<br>/document/normalized_images/*<br>…|/document/{key1}<br>/document/{key2}<br>…|/document/{key1}<br>/document/{key2}<br>… |
|SQL|/document/{column1}<br>/document/{column2}<br>…|N/A |N/A|
|Cosmos DB|/document/{key1}<br>/document/{key2}<br>…|N/A|N/A|


The tree is instantiated as the output of document cracking and the table above describes the state of a document entering into the enrichment pipeline. As skills execute, they add new nodes to the enrichment tree and those new nodes can then be used as inputs for downstream skills, projecting to the knowledge store or mapping to index fields. Enrichments are not mutable, nodes can only be created not edited. As your skillsets get more complex, so will your enrichment tree, but not all nodes in the enrichment tree need to make it to the index or the knowledge store. You can selectively persist only a subset of the enrichments to the index or the knowledge store.
For the rest of this document, we will assume we are working with [hotel reviews example](https://docs.microsoft.com/en-us/azure/search/knowledge-store-connect-powerbi), but the same concepts apply to enriching documents from all other data sources.

### Context
Each skill requires a context. A context determines:
+	The number of times the skill executes, based on the nodes selected. For context values of type collection, adding an ```/*``` at the end will result in the skill being invoked once for each instance in the collection. 
+	Where in the enrichment tree the skill outputs are parented. Outputs are always added to the tree as children of the context node.
+	The nodes to be enriched. For contexts that contain multiple nested collections the context performs the equivalent of a flatmap to yield a set of nodes that will be enriched.
+	Where in the tree the input is evaluated. Inputs can only be sourced from nodes scoped by the context. 

### SourceContext
The sourceContext is only used in shaper skills and projections to be able to construct multi-level, nested objects. The sourceContext enables you to construct a hierarchical, anonymous type object, which would require multiple skills if only using the context. This concept is further described with an example in the projections section.

### Projections
Projection is the process of selecting the nodes from the enrichment tree to be saved in the knowledge store. Projections are custom shapes of the document (content and enrichments) that can be outputted as either table or object projections. To learn more about working with projections, see [working with projections](knowledge-store-projection-overview.md).

|Source |Destination |Selector |
|---|---|---|
|Document content |Index| Field mapping |
|Enrichment (skill) output| Index| Output field mapping |
|Document content |Knowledge store |Projection |
|Enrichment output |Knowledge store |Projection |

The matrix above describes the type of selector you choose based on the source and destination of the data.

## Enrichment tree lifecycle
Let’s now step through the hotel reviews skillset and look at how the enrichment tree evolves with the execution of each skill and how the context and inputs work to determine how many times a skill executes and what the shape of the input is based on the context. Since we're using the delimited text parsing mode for the indexer, a document within the enrichment process represents a single row within the CSV file.

### Skill #1: Split skill 
![enrichment tree after document cracking](media/cognitive-search-working-with-skillsets/enrichment-tree-before.png "Enrichment tree after document cracking and before skill execution")

With the skill context of ```"/document/reviews_text"```, this skill will execute once for the review_text. The skill output is a list where the reviews_text is chunked into 5000 character segments. The output from the split skill is named pages and added to the enrichment tree. The targetName feature allows you to rename a skill output before being added to the enrichment tree.
The enrichment tree now has a new node parented under the context of the skill and this node is available to any skill, projection, or output field mapping.
 While the document ```"/document"``` is the root node for all enrichments, when ```"/document"``` is addressed, the only child properties are ```"/document/content"```, ```"/document/normalized_images/*"``` when working with blob indexers or the column names here since we are working with CSV data. To access any of the enrichments that were added to a node by a skill, the full path for the enrichments is needed. For example, if you want to use the text from the ```pags``` node as an input to another skill, you will need to select it as ```"/document/reviews_text/pages/*"```.
 
 ![enrichment tree after skill #1](media/cognitive-search-working-with-skillsets/enrichment-tree-after.png "Enrichment tree after  skill #1 executes")
 
 ### Skill #2: Key phrases skill 
With the context of ```/document/reviews_text/pages/*``` the key phrases skill will be invoked once for each of the items in the pages collection. The output from the skill will be parented under each of the page elements.

 You should now be able to look at the remainder of the skills in the skillset and be able to visualize how the tree of enrichments continues to grow with the execution of each skill. Some skills like the merge skill and the shaper skill also create new nodes, but only use data from existing nodes and don't create any net new enrichments.

![enrichment tree after all skills](media/cognitive-search-working-with-skillsets/enrichment-tree-projections.png "Enrichment tree after  all skills")
The colors of the connectors in the tree above indicate that the enrichments were created by different skills and the nodes will need to be addressed individually.

## Knowledge store
Skillsets also define a knowledge store where your enriched documents can be projected as tables or objects. To save your enriched data in the knowledge store, you define a set of projections of your enriched document. To learn more about the knowledge store see [what is knowledge store?](knowledge-store-concept-intro.md)
### Slicing projections
When defining a table projection group, a single node in the enrichment tree can be sliced into multiple related tables. Adding a table with a source path that is a child of an existing table projection will result in the child node being sliced out of the parent node and projected into the new yet related table. This allows you to define a single node in a shaper skill that can be the source for all your table projections. 
### Shaping projections
There are two ways to define a projection. You could use a shaper skill to create a new node that is the root node for all the enrichments you are projecting. Then in your projections, you only reference the output of the shaper skill. You could also inline shape a projection within the projection the definition itself.
The shaper approach ensures that all the mutations of the enrichment tree are contained within the skills and output is an object that can be reused, but it is more verbose. Inline shaping allows you to create the shape you need, but is an anonymous object and is only available to the projection it is defined for. Either approach works, the skillset created for you in the portal workflow contains both approaches. It uses a shaper skill for the table projections, but also uses inline shaping to project the key phrases table.

To extend the example further, you can use only a shaper skill by creating a new node for the key phrases. To create a shape that you can project into three tables namely hotelReviewsDocument, hotelReviewsPages and hotelReviewsKeyPhrases, the two options are
#### Shaper skill and projection 
> [!Note]
> Some of the columns from the document table have been removed from this example for brevity.
>
```json
{
    "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
    "name": "#5",
    "description": null,
    "context": "/document",
    "inputs": [
        
        {
            "name": "name",
            "source": "/document/name",
            "sourceContext": null,
            "inputs": []
        },
        {
            "name": "reviews_date",
            "source": "/document/reviews_date",
            "sourceContext": null,
            "inputs": []
        },
        
        {
            "name": "reviews_rating",
            "source": "/document/reviews_rating",
            "sourceContext": null,
            "inputs": []
        },
        {
            "name": "reviews_text",
            "source": "/document/reviews_text",
            "sourceContext": null,
            "inputs": []
        },
        {
            "name": "reviews_title",
            "source": "/document/reviews_title",
            "sourceContext": null,
            "inputs": []
        },
        {
            "name": "AzureSearch_DocumentKey",
            "source": "/document/AzureSearch_DocumentKey",
            "sourceContext": null,
            "inputs": []
        },  
        {
            "name": "pages",
            "source": null,
            "sourceContext": "/document/reviews_text/pages/*",
            "inputs": [
                {
                    "name": "SentimentScore",
                    "source": "/document/reviews_text/pages/*/Sentiment",
                    "sourceContext": null,
                    "inputs": []
                },
                {
                    "name": "LanguageCode",
                    "source": "/document/Language",
                    "sourceContext": null,
                    "inputs": []
                },
                {
                    "name": "Page",
                    "source": "/document/reviews_text/pages/*",
                    "sourceContext": null,
                    "inputs": []
                },
                {
                    "name": "keyphrase",
                    "sourceContext": "/document/reviews_text/pages/*/Keyphrases/*",
                    "inputs": [
                        {
                            "source": "/document/reviews_text/pages/*/Keyphrases/*",
                            "name": "Keyphrases"
                        }
                        
                    ]
                }
            ]
        }
    ],
    "outputs": [
        {
            "name": "output",
            "targetName": "tableprojection"
        }
    ]
}
```
With the newly minted tableprojection node, we can now use the slicing feature to project parts of the tableprojection node into different tables.
> [!Note]
> This is only a snippet of the projection within the knowledge store configuration.
>
```json
"projections": [
    {
        "tables": [
            {
                "tableName": "hotelReviewsDocument",
                "generatedKeyName": "Documentid",
                "source": "/document/tableprojection"
            },
            {
                "tableName": "hotelReviewsPages",
                "generatedKeyName": "Pagesid",
                "source": "/document/tableprojection/pages/*"
            },
            {
                "tableName": "hotelReviewsKeyPhrases",
                "generatedKeyName": "KeyPhrasesid",
                "source": "/document/tableprojection/pages/*/keyphrase/*"
            }
        ]
    }
]
```

#### Inline shaping projections
The inline shaping approach does not require a shaper skill and all shapes needed for the projections are created at the time they are needed. To project the same data as the previous example, here is the inline projection option.
```json
"projections": [
    {
        "tables": [
            {
                "tableName": "hotelReviewsInlineDocument",
                "generatedKeyName": "Documentid",
                "sourceContext": "/document",
                
                "inputs": [
                    {
                        "name": "name",
                        "source": "/document/name"
                    },
                    {
                        "name": "reviews_date",
                        "source": "/document/reviews_date"
                    },
                    
                    {
                        "name": "reviews_rating",
                        "source": "/document/reviews_rating"
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
                        "name": "AzureSearch_DocumentKey",
                        "source": "/document/AzureSearch_DocumentKey"
                    }
                                
                ]
            },
            {
                "tableName": "hotelReviewsInlinePages",
                "generatedKeyName": "Pagesid",
                "sourceContext": "/document/reviews_text/pages/*",
                
                "inputs": [
                        {
                    "name": "SentimentScore",
                    "source": "/document/reviews_text/pages/*/Sentiment"
                    },
                    {
                        "name": "LanguageCode",
                        "source": "/document/Language"
                    },
                    {
                        "name": "Page",
                        "source": "/document/reviews_text/pages/*"
                    }
                ]
            },
            {
                "tableName": "hotelReviewsInlineKeyPhrases",
                "generatedKeyName": "KeyPhraseId",
                "sourceContext": "/document/reviews_text/pages/*/Keyphrases/*",
                "inputs": [
                    {
                        "name": "Keyphrases",
                        "source": "/document/reviews_text/pages/*/Keyphrases/*"
                    }
                ]
            }
        ]
    }
]
```
One observation from both the approaches is how keyPhrases  are projected using the sourceContext. This is because the key phrases is a collection of strings that is a child of the review text, a primitive, but projections require a JSON object. The sourceContext wraps the primitives into an object with a named property enabling even primitives to be projected independently.

## Next steps

As a next step, create your first skillset with cognitive skills.

> [!div class="nextstepaction"]
> [Create your first skillset](cognitive-search-defining-skillset.md).