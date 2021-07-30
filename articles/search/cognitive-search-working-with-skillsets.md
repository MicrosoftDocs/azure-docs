---
title: Skillset concepts and workflow
titleSuffix: Azure Cognitive Search
description: Skillsets are where you author an AI enrichment pipeline in Azure Cognitive Search. Learn important concepts and details about skillset composition.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/30/2021
---

# Skillset concepts in Azure Cognitive Search

This article is for developers who need a deeper understanding of skillset concepts and composition, and assumes familiarity with the high-level concepts and workflows of [AI enrichment](cognitive-search-concept-intro.md).

A skillset is a reusable resource in Azure Cognitive Search that is attached to [an indexer](search-indexer-overview.md). It contains one or more skills, which are atomic operations that call built-in AI or external custom processing over documents retrieved from an external data source.

From the onset of skillset processing to its conclusion, skills read and write to an enriched document. An enriched document is initially just the raw content extracted from a data source, but with each skill execution, it gains structure and substance. Skills that create content, such as translated strings, will write their output to the enriched document. Likewise, skills that consume the output of upstream skills will read from the enriched document to get the necessary inputs. 

:::image type="content" source="media/cognitive-search-working-with-skillsets/skillset-def-enrichment-tree.png" alt-text="Skills read and write from enrichment tree" border="false":::

Ultimately, nodes from an enriched document are then [mapped to fields](cognitive-search-output-field-mapping.md) in a search index or knowledge store, so that the content can be queried or consumed by other apps.

## Illustrative example

Skills have context, and inputs and outputs that are often chained together. The following example demonstrates two [built-in skills](cognitive-search-predefined-skills.md) that work together. After reviewing this example, if you want more detail about how input and output formulation, see [How to reference annotations](cognitive-search-concept-annotations-syntax.md).

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

## Enrichment tree

An enriched document is a temporal data structure created during skillset execution that collects all of changes that are introduced through skills. It also includes any unprocessed fields that you want to use verbatim from the external data source. An enriched document exists for the duration of skillset execution, but can be cached or persisted to a knowledge store. 

Initially, an enriched document is simply the content extracted from a data source during [*document cracking*](search-indexer-overview.md#document-cracking), where text and images are extracted from the source and made available for language or image analysis. The articulation of the root node of the tree varies for each data source type. The following table shows the state of a document entering into the enrichment pipeline for several supported data sources:

|Data Source\Parsing Mode|Default|JSON, JSON Lines & CSV|
|---|---|---|
|Blob Storage|/document/content<br>/document/normalized_images/*<br>…|/document/{key1}<br>/document/{key2}<br>…|
|Azure SQL|/document/{column1}<br>/document/{column2}<br>…|N/A |
|Cosmos DB|/document/{key1}<br>/document/{key2}<br>…|N/A|

As skills execute, they add new nodes to the enrichment tree. These new nodes can then be used as inputs for downstream skills, and will eventually be projected into a knowledge store, or mapped to index fields. 

An enrichment tree consists of extracted content, plus any new fields that contain content created by a skill, such as translated_text from the [Text Translation skill](cognitive-search-skill-text-translation.md), keyPhrases from the [Key Phrase Extraction skill](cognitive-search-skill-keyphrases.md), or locations from [Entity Recognition skill](cognitive-search-skill-entity-recognition-v3.md). Although you can [visualize and work with an enrichment tree](cognitive-search-debug-session.md) through a visual editor, it's mostly an internal structure. 

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

## Next steps

As a next step, create your first skillset with more [built-in skills](cognitive-search-predefined-skills.md).

> [!div class="nextstepaction"]
> [Create your first skillset](cognitive-search-defining-skillset.md)
