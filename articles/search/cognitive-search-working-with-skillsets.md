---
title: Skillset concepts and workflow
titleSuffix: Azure Cognitive Search
description: Skillsets are where you author an AI enrichment pipeline in Azure Cognitive Search. Learn important concepts and details about skillset composition.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 08/10/2021
---

# Skillset concepts in Azure Cognitive Search

This article is for developers who need a deeper understanding of skillset concepts and composition, and assumes familiarity with the high-level concepts and workflows of [AI enrichment](cognitive-search-concept-intro.md).

A skillset is a reusable resource in Azure Cognitive Search that is attached to [an indexer](search-indexer-overview.md). It contains one or more skills, which are atomic operations that call built-in AI or external custom processing over documents retrieved from an external data source.

From the onset of skillset processing to its conclusion, skills read and write to an enriched document. An enriched document is initially just the raw content extracted from a data source, but with each skill execution, it gains structure and substance. Ultimately, nodes from an enriched document are then [mapped to fields](cognitive-search-output-field-mapping.md) in a search index, or [mapped to projections](knowledge-store-projection-overview.md) in a knowledge store, so that the content can be queried or consumed by other apps.

:::image type="content" source="media/knowledge-store-concept-intro/knowledge-store-concept-intro.png" alt-text="Knowledge store in pipeline diagram" border="false":::

## Skillset definition

Skills have context, and inputs and outputs that are often chained together. The following example demonstrates two [built-in skills](cognitive-search-predefined-skills.md) that work together and introduces some of the terminology of skillset definition. 

+ Skill #1 is a [Text Split skill](cognitive-search-skill-textsplit.md) that accepts the contents of the "reviews_text" source field as input, and splits that content into "pages" of 5000 characters as output. Splitting large text into smaller chunks can produce better outcomes during natural language processing.

+ Skill #2 is a [Sentiment Detection skill](cognitive-search-skill-sentiment.md) accepts "pages" as input, and produces a new field called "Sentiment" as output that contains the results of sentiment analysis.

```json
{
    "skills": [
        {
            "@odata.type": "#Microsoft.Skills.Text.SplitSkill",
            "name": "#1",
            "description": null,
            "context": "/document/reviews_text",
            "defaultLanguageCode": "en",
            "textSplitMode": "pages",
            "maximumPageLength": 5000,
            "inputs": [
                {
                    "name": "text",
                    "source": "/document/reviews_text"
                }
            ],
            "outputs": [
                {
                    "name": "textItems",
                    "targetName": "pages"
                }
            ]
        },
        {
            "@odata.type": "#Microsoft.Skills.Text.SentimentSkill",
            "name": "#2",
            "description": null,
            "context": "/document/reviews_text/pages/*",
            "defaultLanguageCode": "en",
            "inputs": [
                {
                    "name": "text",
                    "source": "/document/reviews_text/pages/*",
                }
            ],
            "outputs": [
                {
                    "name": "score",
                    "targetName": "Sentiment"
                }
            ]
        }
. . . 
}
```

Key points to notice about the above example are that inputs and outputs are name-value pairs, you can match the outputs of one skill to the inputs of downstream skills, and that all skills have context that determines where in the enrichment tree the processing occurs.

For more detail about how inputs and outputs are formulated, see [How to reference annotations](cognitive-search-concept-annotations-syntax.md).

## Enrichment tree

An enriched document is a temporary data structure created during skillset execution that collects all of the changes introduced through skills. It also includes any unprocessed fields retrieved verbatim from the external data source. An enriched document exists for the duration of skillset execution, but can be cached or persisted to a knowledge store. 

Initially, an enriched document is simply the content extracted from a data source during [*document cracking*](search-indexer-overview.md#document-cracking), where text and images are extracted from the source and made available for language or image analysis. 

Articulation of the root node of an enrichment tree varies for each data source type. The following table shows the state of a document entering into the enrichment pipeline for several supported data sources:

|Data Source\Parsing Mode|Default|JSON, JSON Lines & CSV|
|---|---|---|
|Blob Storage|/document/content<br>/document/normalized_images/*<br>…|/document/{key1}<br>/document/{key2}<br>…|
|Azure SQL|/document/{column1}<br>/document/{column2}<br>…|N/A |
|Cosmos DB|/document/{key1}<br>/document/{key2}<br>…|N/A|

As skills execute, they add new nodes to the enrichment tree. These new nodes can then be used as inputs for downstream skills, and will eventually be projected into a knowledge store, or mapped to index fields. Skills that create content, such as translated strings, will write their output to the enriched document. Likewise, skills that consume the output of upstream skills will read from the enriched document to get the necessary inputs. 

:::image type="content" source="media/cognitive-search-working-with-skillsets/skillset-def-enrichment-tree.png" alt-text="Skills read and write from enrichment tree" border="false":::

An enrichment tree consists of extracted content and metadata pulled from the source, plus any new nodes that are created by a skill, such as `translated_text` from the [Text Translation skill](cognitive-search-skill-text-translation.md), `keyPhrases` from the [Key Phrase Extraction skill](cognitive-search-skill-keyphrases.md), or `locations` from [Entity Recognition skill](cognitive-search-skill-entity-recognition-v3.md). Although you can [visualize and work with an enrichment tree](cognitive-search-debug-session.md) through a visual editor, it's mostly an internal structure. 

Enrichments aren't mutable: once created, nodes cannot be edited. As your skillsets get more complex, so will your enrichment tree, but not all nodes in the enrichment tree need to make it to the index or the knowledge store. You can selectively persist just a subset of the enrichment outputs so that you are only keeping what you intend to use.

Because a skill's inputs and outputs are reading from and writing to enrichment trees, one of tasks you'll complete as part of skillset design is creating [output field mappings](cognitive-search-output-field-mapping.md) that move content out of the enrichment tree, and into a field in a search index or knowledge store.

> [!NOTE]
> The enrichment tree format enables the enrichment pipeline to attach metadata to even primitive data types. This will not be a valid JSON object, but can be projected into a valid JSON format in projection definitions in a knowledge store.

## Context

Each skill has a context, which can be the entire document (`/document`) or one of its parts (`/document/countries/`). A context determines:

+ The number of times the skill executes, over a single value (once per field, per document), or for context values of type collection, adding an `/*` at the end will result in the skill being invoked once for each instance in the collection. 

+ Output declaration, or where in the enrichment tree the skill outputs are added. Outputs are always added to the tree as children of the context node.

+ Shape of the inputs. For multi-level collections, setting the context to the parent collection will affect the shape of the input for the skill. For example if you have an enrichment tree with a list of countries/regions, each enriched with a list of states containing a list of ZIP codes, how you set the context will determine how the input is interpreted.

|Context|Input|Shape of Input|Skill Invocation|
|-------|-----|--------------|----------------|
|`/document/countries/*` |`/document/countries/*/states/*/zipcodes/*` |A list of all ZIP codes in the country/region |Once per country/region |
|`/document/countries/*/states/*` |`/document/countries/*/states/*/zipcodes/*` |A list of ZIP codes in the state | Once per combination of country/region and state|

## Enrichment example

Using the [hotel reviews skillset](https://github.com/Azure-Samples/azure-search-sample-data/blob/master/hotelreviews/HotelReviews_skillset.json) as a reference point, this example explains how an [enrichment tree](cognitive-search-working-with-skillsets.md#enrichment-tree) evolves through skill execution. 

This example also shows:

+ How a skill's context and inputs work to determine how many times a skill executes
+ What the shape of the input is based on the context

In this example, source fields from a CSV file include customer reviews about hotels ("reviews_text") and ratings ("reviews_rating"). The indexer adds metadata fields from Blob storage, and skills add translated text, sentiment scores, and key phrase detection.

In the hotel reviews example, a "document" within the enrichment process represents a single hotel review.

> [!TIP]
> You can create a search index and knowledge store for this data in [Azure portal](knowledge-store-create-portal.md) or through [Postman and the REST APIs](knowledge-store-create-rest.md). You can also use [Debug Sessions](cognitive-search-debug-session.md) for insights into skillset composition, dependencies, and effects on an enrichment tree. Images in this article are pulled from Debug Sessions.

Conceptually, the initial enrichment tree looks as follows:

![enrichment tree after document cracking](media/cognitive-search-working-with-skillsets/enrichment-tree-doc-cracking.png "Enrichment tree after document cracking and before skill execution")

The root node for all enrichments is `"/document"`. When working with blob indexers, the `"/document"` node will have child nodes of `"/document/content"` and `"/document/normalized_images"`. When working with CSV data, as we are in this example, the column names will map to nodes beneath `"/document"`.

### Skill #1: Split skill

When source content consists of large chunks of text, it's helpful to break it into smaller components for greater accuracy of language, sentiment, and key phrase detection. There are two grains available: pages and sentences. A page consists of approximately 5000 characters.

A text split skill is typically first in a skillset.

```json
"@odata.type": "#Microsoft.Skills.Text.SplitSkill",
"name": "#1",
"description": null,
"context": "/document/reviews_text",
"defaultLanguageCode": "en",
"textSplitMode": "pages",
"maximumPageLength": 5000,
"inputs": [
{
    "name": "text",
    "source": "/document/reviews_text"
}
],
"outputs": [
{
    "name": "textItems",
    "targetName": "pages"
}
```

With the skill context of `"/document/reviews_text"`, the split skill will execute once for the `reviews_text`. The skill output is a list where the `reviews_text` is chunked into 5000 character segments. The output from the split skill is named `pages` and it is added to the enrichment tree. The `targetName` feature allows you to rename a skill output before being added to the enrichment tree.

The enrichment tree now has a new node placed under the context of the skill. This node is available to any skill, projection, or output field mapping. 
 
![enrichment tree after skill #1](media/cognitive-search-working-with-skillsets/enrichment-tree-skill1.png "Enrichment tree after  skill #1 executes")

To access any of the enrichments added to a node by a skill, the full path for the enrichment is needed. For example, if you want to use the text from the ```pages``` node as an input to another skill, you will need to specify it as ```"/document/reviews_text/pages/*"```.

### Skill #2 Language detection

Hotel review documents include customer feedback expressed in multiple languages. The language detection skill determines which language is used. The result is then passed to key phrase extraction and sentiment detection, taking language into consideration when detecting sentiment and phrases.

While the language detection skill is the third (skill #3) skill defined in the skillset, it is the next skill to execute. Since it is not blocked by requiring any inputs, it will execute in parallel with the previous skill. Like the split skill that preceded it, the language detection skill is also invoked once for each document. The enrichment tree now has a new node for language.

 ![enrichment tree after skill #2](media/cognitive-search-working-with-skillsets/enrichment-tree-skill2.png "Enrichment tree after skill #2 executes")

### Skills #3 and #4 (sentiment analysis and key phrase detection)

Customer feedback reflects a range of positive and negative experiences. The sentiment analysis skill analyzes the feedback and assigns a score along a continuum of negative to positive numbers, or neutral if sentiment is undetermined. Parallel to sentiment analysis, key phrase detection identifies and extracts words and short phrases that appear consequential.

Given the context of `/document/reviews_text/pages/*`, both sentiment analysis and key phrase skills will be invoked once for each of the items in the `pages` collection. The output from the skill will be a node under the associated page element. 

You should now be able to look at the rest of the skills in the skillset and visualize how the tree of enrichments will continue to grow with the execution of each skill. Some skills, such as the merge skill and the shaper skill, also create new nodes but only use data from existing nodes and don't create net new enrichments.

![enrichment tree after all skills](media/cognitive-search-working-with-skillsets/enrichment-tree-final.png "Enrichment tree after  all skills")

The colors of the connectors in the tree above indicate that the enrichments were created by different skills and the nodes will need to be addressed individually and will not be part of the object returned when selecting the parent node.

### Skill #5 Shaper skill

If output includes a [knowledge store](knowledge-store-concept-intro.md), add a [Shaper skill](cognitive-search-skill-shaper.md) as a last step. The Shaper skill creates data shapes out of nodes in an enrichment tree. For example, you might want to consolidate multiple nodes into a single shape. You can then project this shape as a table (nodes become the columns in a table), passing the shape by name to a table projection.

The Shaper skill is easy to work with because it focuses shaping under one skill. Alternatively, you can opt for in-line shaping within each skill. The Shaper Skill does not add or detract from an enrichment tree, so it's not visualized. Instead, you can think of a Shaper skill as the means by which you re-articulate the enrichment tree you already have.

```json
{
  "@odata.type": "#Microsoft.Skills.Util.ShaperSkill",
  "name": "#5",
  "description": null,
  "context": "/document",
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
    },
    {
      "name": "pages",
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
        },
        {
          "name": "keyphrase",
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
  ],
  "outputs": [
    {
      "name": "output",
      "targetName": "tableprojection"
    }
  ]
}
```

## Next steps

With an introduction and example behind you, try creating your first skillset using [built-in skills](cognitive-search-predefined-skills.md).

> [!div class="nextstepaction"]
> [Create your first skillset](cognitive-search-defining-skillset.md)
