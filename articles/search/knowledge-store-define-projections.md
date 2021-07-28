---
title: Define projections in a knowledge store 
titleSuffix: Azure Cognitive Search
description: Define the data structures in a knowledge store by shaping projections.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/30/2021
---

<!-- HOTEL REVIEWS -->

# Define data structures in a knowledge store

When enriching content in Azure Cognitive Search, you can send the output to a [knowledge store](knowledge-store-concept-intro.md) in Azure Storage. This article explains how to shape a projection to get the data structures you want for analysis in Power BI or other knowledge mining apps.

*Projection* is the process of selecting the nodes from the enrichment tree and creating a physical expression of them in the knowledge store. Projections are custom shapes of the document (content and enrichments) that can be output as either table or object projections. 

A projection is also an element in a skillset definition. How you set up a projection determines what goes into blobs, tables, and files in Azure Storage. For more information, see [working with projections](knowledge-store-projection-overview.md).

![Field mapping options](./media/cognitive-search-working-with-skillsets/field-mapping-options.png "Field mapping options for enrichment pipeline")

## Approaches for defining projections

There are two ways to shape enriched content to that it can be projected into a knowledge store:

+ Use the [Shaper skill](cognitive-search-skill-shaper.md) to create a new node that is the root node for all the enrichments you are projecting. Then, in your projections, you would only reference the output of the Shaper skill.

+ Use an inline shape a projection within the projection definition itself.

Using the Shaper skill is more verbose than inline shaping, but ensures that all the mutations of the enrichment tree are contained within the skills and that the output is an object that can be reused. In contrast, inline shaping allows you to create the shape you need, but is an anonymous object and is only available to the projection for which it is defined.

The approaches can be used together or separately. In this article, a skillset example shows both approaches, using a shaper skill for the table projections, and inline shaping to project the key phrases table.

## Use a Shaper skill

<!-- INTRO - TBD -->

### SourceContext

Within a Shaper skill, an input can have a `sourceContext` element that is used only in skill inputs and projections. It is used to construct multi-level, nested objects. You may need to create a new object to either pass it as an input to a skill or project into the knowledge store. As enrichment nodes may not be a valid JSON object in the enrichment tree and referencing a node in the tree only returns that state of the node when it was created, using the enrichments as skill inputs or projections requires you to create a well formed JSON object. The `sourceContext` enables you to construct a hierarchical, anonymous type object, which would require multiple skills if you were only using the context. 

Using `sourceContext` is shown in the following examples. Look at the skill output that generated an enrichment to determine if it is a valid JSON object and not a primitive type.

```json
{
    "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
    "name": "#5",
    "description": null,
    "context": "/document",
    "inputs": [        
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

With the `tableprojection` node defined in the `outputs` section above, we can now use the slicing feature to project parts of the `tableprojection` node into different tables:


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

## Inline shaping projections

The inline shaping approach does not require a shaper skill, as all shapes needed for the projections are created at the time they are used. To project the same data as the previous example, the inline projection option would look like this:

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
  
One observation from both the approaches is how values of `"Keyphrases"` are projected using the `"sourceContext"`. The `"Keyphrases"` node, which contains a collection of strings, is itself a child of the page text. However, because projections require a JSON object and the page is a primitive (string), the `"sourceContext"` is used to wrap the key phrase into an object with a named property. This technique enables even primitives to be projected independently.

### Slicing projections

When defining a table projection group, a single node in the enrichment tree can be sliced into multiple related tables. If you add a table with a source path that is a child of an existing table projection, the resulting child node will not be a child of the existing table projection, but instead will be projected into the new, related, table. This slicing technique allows you to define a single node in a shaper skill that can be the source for all your table projections. 

To extend the example, you could choose to remove the inline shaping and use a shaper skill to create a new node for the key phrases. To create a shape projected into three tables, namely, `hotelReviewsDocument`, `hotelReviewsPages`, and `hotelReviewsKeyPhrases`, the two options are described in the following sections.

## Next steps

This article describes the concepts and principles of projection shapes. As a next step, see how these are applied in patterns for table, object, and file projections.

> [!div class="nextstepaction"]
> [Projection patterns for Power BI](knowledge-store-projections-examples.md)
