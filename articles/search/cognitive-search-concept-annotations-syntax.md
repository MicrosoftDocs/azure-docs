---
title: Reference enriched nodes during skillset execution
titleSuffix: Azure AI Search
description: Explains the annotation syntax and how to reference inputs and outputs of a skillset in an AI enrichment pipeline in Azure AI Search.
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 01/18/2024
---

# Reference a path to enriched nodes using context and source properties an Azure AI Search skillset

During skillset execution, the engine builds an in-memory [enrichment tree](cognitive-search-working-with-skillsets.md#enrichment-tree) that captures each enrichment, such as recognized entities or translated text. In this article, learn how to reference an enrichment node in the enrichment tree so that you can pass output to downstream skills or specify an output field mapping for a search index field. 

This article uses examples to illustrate various scenarios. For the full syntax, see [Skill context and input annotation language language](cognitive-search-skill-annotation-language.md).

## Background concepts

Before reviewing the syntax, let's revisit a few important concepts to better understand the examples provided later in this article.

| Term | Description |
|------|-------------|
| "enriched document" | An enriched document is an in-memory structure that collects skill output as it's created and it holds all enrichments related to a document. Think of an enriched document as a tree. Generally, the tree starts at the root document level, and each new enrichment is created from a previous as its child.  |
| "node" | Within an enriched document, a node (sometimes referred to as an "annotation") is created and populated by a skill, such as "text" and "layoutText" in the OCR skill. An enriched document is populated with both enrichments and original source field values or metadata copied from the source. |
| "context" | The scope of enrichment, which is either the entire document, a portion of a document, or if you're working with images, the extracted images from a document. By default, the enrichment context is at the `"/document"` level, scoped to individual documents contained in the data source. When a skill runs, the outputs of that skill become [properties of the defined context](#example-2). |

## Paths for different scenarios

Paths are specified in the "context" and "source" properties of a skillset, and in the [output field mappings](cognitive-search-output-field-mapping.md) in an indexer.

:::image type="content" source="media/cognitive-search-annotations-syntax/content-source-annotation-path.png" alt-text="Screenshot of a skillset definition with context and source elements highlighted.":::

The example in the screenshot illustrates the path for an item in an Azure Cosmos DB collection.

+ `context` path is `/document/HotelId` because the collection is partitioned into documents by the `/HotelId` field.

+ `source` path is `/document/Description` because the skill is a translation skill, and the field that you'll want the skill to translate is the `Description` field in each document.

All paths start with `/document`. An enriched document is created in the "document cracking" stage of indexer execution, when the indexer opens a document or reads in a row from the data source. Initially, the only node in an enriched document is the [root node (`/document`)](cognitive-search-skill-annotation-language.md#document-root), and it's the node from which all other enrichments occur. 

The following list includes several common examples:

+ `/document` is the root node and indicates an entire blob in Azure Storage, or a row in a SQL table.
+ `/document/{key}` is the syntax for a document or item in an Azure Cosmos DB collection, where `{key}` is the actual key, such as `/document/HotelId` in the previous example.
+ `/document/content` specifies the "content" property of a JSON blob. 
+ `/document/{field}` is the syntax for an operation performed on a specific field, such as translating the `/document/Description` field, seen in the previous example.
+ `/document/pages/*` or `/document/sentences/*` become the context if you're breaking a large document into smaller chunks for processing. If "context" is `/document/pages/*`, the skill executes once over each page in the document. Because there might be more than one page or sentence, you'll append `/*` to catch them all.
+ `/document/normalized_images/*` is created during document cracking if the document contains images. All paths to images start with normalized_images. Since there are often multiple images embedded in a document, append `/*`.

Examples in the remainder of this article are based on the "content" field generated automatically by [Azure Blob indexers](search-howto-indexing-azure-blob-storage.md) as part of the [document cracking](search-indexer-overview.md#document-cracking) phase. When referring to documents from a Blob container, use a format such as `"/document/content"`, where the "content" field is part of the "document".

<a name="example-1"></a>

## Example 1: Simple annotation reference

In Azure Blob Storage, suppose you have a variety of files containing references to people's names that you want to extract using entity recognition. In the following skill definition, `"/document/content"` is the textual representation of the entire document, and "people" is an extraction of full names for entities identified as persons.

Because the default context is `"/document"`, the list of people can now be referenced as `"/document/people"`. In this specific case `"/document/people"` is an annotation, which could now be mapped to a field in an index, or used in another skill in the same skillset.

```json
  {
    "@odata.type": "#Microsoft.Skills.Text.V3.EntityRecognitionSkill",
    "categories": [ "Person"],
    "defaultLanguageCode": "en",
    "inputs": [
      {
        "name": "text",
        "source": "/document/content"
      }
    ],
    "outputs": [
      {
        "name": "persons",
        "targetName": "people"
      }
    ]
  }
```

<a name="example-2"></a>

## Example 2: Reference an array within a document

This example builds on the previous one, showing you how to invoke an enrichment step multiple times over the same document. Assume the previous example generated an array of strings with 10 people names from a single document. A reasonable next step might be a second enrichment that extracts the last name from a full name. Because there are 10 names, you want this step to be called 10 times in this document, once for each person. 

To invoke the right number of iterations, set the context as `"/document/people/*"`, where the asterisk (`"*"`) represents all the nodes in the enriched document as descendants of `"/document/people"`. Although this skill is only defined once in the skills array, it's called for each member within the document until all members are processed.

```json
  {
    "@odata.type": "#Microsoft.Skills.Custom.WebApiSkill",
    "description": "Fictitious skill that gets the last name from a full name",
    "uri": "http://names.azurewebsites.net/api/GetLastName",
    "context" : "/document/people/*",
    "defaultLanguageCode": "en",
    "inputs": [
      {
        "name": "fullname",
        "source": "/document/people/*"
      }
    ],
    "outputs": [
      {
        "name": "lastname",
        "targetName": "last"
      }
    ]
  }
```

When annotations are arrays or collections of strings, you might want to target specific members rather than the array as a whole. The above example generates an annotation called `"last"` under each node represented by the context. If you want to refer to this family of annotations, you could use the syntax `"/document/people/*/last"`. If you want to refer to a particular annotation, you could use an explicit index: `"/document/people/1/last`" to reference the last name of the first person identified in the document. Notice that in this syntax arrays are "0 indexed".

<a name="example-3"></a>

## Example 3: Reference members within an array

Sometimes you need to group all annotations of a particular type to pass them to a particular skill. Consider a hypothetical custom skill that identifies the most common last name from all the last names extracted in Example 2. To provide just the last names to the custom skill, specify the context as `"/document"` and the input as `"/document/people/*/lastname"`.

Notice that the cardinality of `"/document/people/*/lastname"` is larger than that of document. There may be 10 lastname nodes while there's only one document node for this document. In that case, the system will automatically create an array of  `"/document/people/*/lastname"` containing all of the elements in the document.

```json
  {
    "@odata.type": "#Microsoft.Skills.Custom.WebApiSkill",
    "description": "Fictitious skill that gets the most common string from an array of strings",
    "uri": "http://names.azurewebsites.net/api/MostCommonString",
    "context" : "/document",
    "inputs": [
      {
        "name": "strings",
        "source": "/document/people/*/lastname"
      }
    ],
    "outputs": [
      {
        "name": "mostcommon",
        "targetName": "common-lastname"
      }
    ]
  }
```

## Tips for annotation path troubleshooting

If you're having trouble with specifying skill inputs, these tips might help you move forward:

+ [Run the Import data wizard](search-import-data-portal.md) over your data to review the skillset definitions and field mappings that the wizard generates.

+ [Start a debug session](cognitive-search-how-to-debug-skillset.md) on a skillset to view the structure of an enriched document. You can edit the paths and other parts of the skill definition, and then run the skill to validate your changes.

## See also

+ [Skill context and input annotation language](cognitive-search-skill-annotation-language.md)
+ [How to integrate a custom skill into an enrichment pipeline](cognitive-search-custom-skill-interface.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Create Skillset (REST)](/rest/api/searchservice/create-skillset)
+ [How to map enriched fields to an index](cognitive-search-output-field-mapping.md)
