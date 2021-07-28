---
title: Skillset concepts and workflow
titleSuffix: Azure Cognitive Search
description: Skillsets are where you author an AI enrichment pipeline in Azure Cognitive Search. Learn important concepts and details about skillset composition.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/28/2021
---

# Skillset concepts in Azure Cognitive Search

This article is for developers who need a deeper understanding of skillset concepts and composition, and assumes familiarity with the high-level concepts of [AI enrichment](cognitive-search-concept-intro.md).

A skillset is a reusable resource in Azure Cognitive Search that is attached to [an indexer](search-indexer-overview.md) and specifies a collection of skills used for analyzing, transforming, and enriching text or image content so that it can be ingested during indexing. 

A skillset creates an enriched document, a temporal data structure that exists for the duration of skillset execution, but can be cached or persisted to a knowledge store. An enriched document is initially just the raw content extracted from a data source, but with each skill execution, it gains structure and substance. Skills that create content, such as translated strings, will write their output to the enriched document. Likewise, skills that consume the output of upstream skills will read from the enriched document to get the necessary inputs.

## Example of a simple skillset

Skills have inputs and outputs, and often the output of one skill becomes the input of another in chain of processes. The following example illustrates a basic skillset by showing two [built-in skills](cognitive-search-predefined-skills.md) that are provided in Cognitive Search.

+ Skill #1 is a [Text Split skill](cognitive-search-skill-textsplit.md) that accepts the contents of the "reviews_text" field as input, and splits that content into "pages" of 5000 characters as output.

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

## Inputs and outputs

A skillset transforms the content of a search document as it moves through skillset execution, creating new information or structures that can be used in a search index. This "created content" is represented in a hierarchical structure called an *enrichment tree*. An enrichment tree consists of the extracted content, plus any new fields that contain content created by a skill, such as translated_text from the [Text Translation skill](cognitive-search-skill-text-translation[]), keyPhrases from the Key Phrase Extraction skill](cognitive-search-skill-keyphrases.md), or locations from [Entity Recognition skill](cognitive-search-skill-entity-recognition-v3.md). Although you can [visualize and work with an enrichment tree](cognitive-search-debug-session.md) through a visual editor, it's mostly an internal structure. 

Having a high-level understanding of an enrichment tree is relevant to understanding how inputs and outputs work for each skill.Inputs are read from the enrichment tree. Outputs write back to the enrichment tree. 

Because a skill's inputs and outputs are reading from and writing to enrichment trees, one of tasks you'll complete as part of skillset design is creating [output field mappings](cognitive-search-output-field-mapping.md) that move content out of the enrichment tree, and into a field in a search index or knowledge store.

## Context

Each skill has a context, which can be the entire document (`/document`) or one of its parts (`/document/countries/`). A context determines:

+ The number of times the skill executes, over a single value (once per field, per document), or for context values of type collection, adding an `/*` at the end will result in the skill being invoked once for each instance in the collection. 

+ Output declaration, or where in the enrichment tree the skill outputs are added. Outputs are always added to the tree as children of the context node.

+ Shape of the inputs. For multi-level collections, setting the context to the parent collection will affect the shape of the input for the skill. For example if you have an enrichment tree with a list of countries/regions, each enriched with a list of states containing a list of ZIP codes, how you set the context will determine how the input is interpreted.

|Context|Input|Shape of Input|Skill Invocation|
|-------|-----|--------------|----------------|
|`/document/countries/*` |`/document/countries/*/states/*/zipcodes/*` |A list of all ZIP codes in the country/region |Once per country/region |
|`/document/countries/*/states/*` |`/document/countries/*/states/*/zipcodes/*` |A list of ZIP codes in the state | Once per combination of country/region and state|

## Enrichment tree

In the progression of [steps in an enrichment pipeline](cognitive-search-concept-intro.md#enrichment-steps), content processing follows the [*document cracking*](search-indexer-overview.md#document-cracking) phase where text and images are extracted from the source. Image content can then be routed to skills that specify image processing, while text content is queued for text processing. For source documents that contain large quantities of text, you can set a *parsing mode* on the indexer to segment text into smaller chunks for more optimal processing. 

![Knowledge store in pipeline diagram](./media/knowledge-store-concept-intro/knowledge-store-concept-intro.svg "Knowledge store in pipeline diagram")

Once a document is in the enrichment pipeline, it is represented as a tree of content and associated enrichments. This tree is instantiated as the output of document cracking.  The enrichment tree format enables the enrichment pipeline to attach metadata to even primitive data types, it is not a valid JSON object but can be projected into a valid JSON format. The following table shows the state of a document entering into the enrichment pipeline:

|Data Source\Parsing Mode|Default|JSON, JSON Lines & CSV|
|---|---|---|
|Blob Storage|/document/content<br>/document/normalized_images/*<br>…|/document/{key1}<br>/document/{key2}<br>…|
|SQL|/document/{column1}<br>/document/{column2}<br>…|N/A |
|Cosmos DB|/document/{key1}<br>/document/{key2}<br>…|N/A|

 As skills execute, they add new nodes to the enrichment tree. These new nodes may then be used as inputs for downstream skills, projecting to the knowledge store, or mapping to index fields. Enrichments aren't mutable: once created, nodes cannot be edited. As your skillsets get more complex, so will your enrichment tree, but not all nodes in the enrichment tree need to make it to the index or the knowledge store. 

You can selectively persist only a subset of the enrichments to the index or the knowledge store. -->

## Next steps

As a next step, create your first skillset with more [built-in skills](cognitive-search-predefined-skills.md).

> [!div class="nextstepaction"]
> [Create your first skillset](cognitive-search-defining-skillset.md)
