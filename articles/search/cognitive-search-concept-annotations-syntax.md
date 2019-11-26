---
title: Reference inputs and outputs in skillsets
titleSuffix: Azure Cognitive Search
description: Explains the annotation syntax and how to reference an annotation in the inputs and outputs of a skillset in an AI enrichment pipeline in Azure Cognitive Search.

manager: nitinme
author: LuisCabrer
ms.author: luisca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---
# How to reference annotations in an Azure Cognitive Search skillset

In this article, you learn how to reference annotations in skill definitions, using examples to illustrate various scenarios. As the content of a document flows through a set of skills, it gets enriched with annotations. Annotations can be  used as inputs for further downstream enrichment, or mapped to an output field in an index. 
 
Examples in this article are based on the *content* field generated automatically by [Azure Blob indexers](search-howto-indexing-azure-blob-storage.md) as part of the document cracking phase. When referring to documents from a Blob container, use a format such as `"/document/content"`, where the *content* field is part of the *document*. 

## Background concepts

Before reviewing the syntax, let's revisit a few important concepts to better understand the examples provided later in this article.

| Term | Description |
|------|-------------|
| Enriched Document | An enriched document is an internal structure created and used by the pipeline to hold all annotations related to a document. Think of an enriched document as a tree of annotations. Generally, an annotation created from a previous annotation becomes its child.<p/>Enriched documents only exist for the duration of skillset execution. Once content is mapped to the search index, the enriched document is no longer needed. Although you don't interact with enriched documents directly, it's useful to have a mental model of the documents when creating a skillset. |
| Enrichment Context | The context in which the enrichment takes place, in terms of which element is enriched. By default, the enrichment context is at the `"/document"` level, scoped to individual documents. When a skill runs, the outputs of that skill become [properties of the defined context](#example-2).|

<a name="example-1"></a>
## Example 1: Simple annotation reference

In Azure Blob storage, suppose you have a variety of files containing references to people's names that you want to extract using entity recognition. In the skill definition below, `"/document/content"` is the textual representation of the entire document, and "people" is an extraction of full names for entities identified as persons.

Because the default context is `"/document"`, the list of people can now be referenced as `"/document/people"`. In this specific case `"/document/people"` is an annotation, which could now be mapped to a field in an index, or used in another skill in the same skillset.

```json
  {
    "@odata.type": "#Microsoft.Skills.Text.EntityRecognitionSkill",
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

To invoke the right number of iterations, set the context as `"/document/people/*"`, where the asterisk (`"*"`) represents all the nodes in the enriched document as descendants of `"/document/people"`. Although this skill is only defined once in the skills array, it is called for each member within the document until all members are processed.

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

Notice that the cardinality of `"/document/people/*/lastname"` is larger than that of document. There may be 10 lastname nodes while there is only one document node for this document. In that case, the system will automatically create an array of  `"/document/people/*/lastname"` containing all of the elements in the document.

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



## See also
+ [How to integrate a custom skill into an enrichment pipeline](cognitive-search-custom-skill-interface.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Create Skillset (REST)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)
+ [How to map enriched fields to an index](cognitive-search-output-field-mapping.md)
