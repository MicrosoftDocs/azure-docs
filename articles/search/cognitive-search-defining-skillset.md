---
title: Create a skillset
titleSuffix: Azure Cognitive Search
description: Define data extraction, natural language processing, or image analysis steps to enrich and extract structured information from your data for use in Azure Cognitive Search.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 08/14/2021
---

# Create a skillset in Azure Cognitive Search

![indexer stages](media/cognitive-search-defining-skillset/indexer-stages-skillset.png "indexer stages")

A skillset defines the operations that extract and enrich data to make it searchable. A skillset executes after document cracking, when text and image content are extracted from source documents, and after any fields from the source document are (optionally) mapped to destination fields in an index or knowledge store.

In this article, you'll learn the steps of creating a skillset. For reference, this article uses the [Create Skillset (REST API)](/rest/api/searchservice/create-skillset). 

Some usage rules for skillsets include the following:

+ A skillset is a top-level resource, which means it can be created once and referenced by many indexers.
+ A skillset must contain at least one skill.
+ A skillset can repeat skills of the same type (for example, multiple Shaper skills).

Recall that [indexers](search-howto-create-indexers.md) drive skillset execution, which means that you will also need a [data source](search-data-sources-gallery.md) and [index](search-what-is-an-index.md) before you can test your skillset.

> [!TIP]
> In the early stages of skillset design, we recommend that you enable [enrichment caching](cognitive-search-incremental-indexing-conceptual.md) to lower the cost of development. You might also consider projecting skillset output to a [knowledge store](knowledge-store-concept-intro.md) so that you can view output more easily. Both caching and knowledge store require Azure Storage. You can use the same resource for both tasks.

## Skillset definition

In the [REST API](/rest/api/searchservice/create-skillset), a skillset is authored in JSON and has the following sections:

```json
{
   "name":"skillset-template",
   "description":"A description makes the skillset self-documenting (comments aren't allowed in JSON itself)",
   "skills":[
      
   ],
   "cognitiveServices":{
      "@odata.type":"#Microsoft.Azure.Search.CognitiveServicesByKey",
      "description":"A Cognitive Services resource in the same region as Azure Cognitive Search",
      "key":"<Your-Cognitive-Services-Multiservice-Key>"
   },
   "knowledgeStore":{
      "storageConnectionString":"<Your-Azure-Storage-Connection-String>",
      "projections":[
         {
            "tables":[ ],
            "objects":[ ],
            "files":[ ]
         }
      ]
    },
    "encryptionKey":{ }
}
```

After the name and description, a skillset has four main properties:

+ `skills` array, an unordered collection of skills, for which the search service determines the sequence of execution based on the inputs required for each skill. If skills are independent, they will execute in parallel. Skills can be utilitarian (like splitting text), transformational (based on AI from Cognitive Services), or custom skills that you provide. An example of a skills array is provided below.

+ `cognitiveServices` is used for [billable skills](cognitive-search-predefined-skills.md) that call Cognitive Services APIs. Remove this section if you aren't using billable skills or Custom Entity Lookup.

+ `knowledgeStore`, (optional) specifies an Azure Storage account and settings for projecting skillset output into tables, blobs, and files in Azure Storage. Remove this section if you don't need a knowledge store.

+ `encryptionKey`, (optional) specifies an Azure Key Vault and [customer-managed keys](search-security-manage-encryption-keys.md) used to encrypt sensitive content in a skillset definition. Remove this property if you aren't using customer-managed encryption.

## Example of a skills array

The skills array specifies which skills to execute. This example shows two built-in skills, with a third for a custom skill that is part of the skillset, but executes externally in a module that you provide.

```json
"skills":[
  {
    "@odata.type": "#Microsoft.Skills.Text.V3.EntityRecognitionSkill",
    "context": "/document",
    "categories": [ "Organization" ],
    "defaultLanguageCode": "en",
    "inputs": [
      {
        "name": "text",
        "source": "/document/content"
      }
    ],
    "outputs": [
      {
        "name": "organizations",
        "targetName": "orgs"
      }
    ]
  },
  {
    "@odata.type": "#Microsoft.Skills.Text.SentimentSkill",
    "inputs": [
      {
        "name": "text",
        "source": "/document/content"
      }
    ],
    "outputs": [
      {
        "name": "score",
        "targetName": "mySentiment"
      }
    ]
  },
  {
    "@odata.type": "#Microsoft.Skills.Custom.WebApiSkill",
    "description": "Calls an Azure function, which in turn calls Bing Entity Search",
    "uri": "https://indexer-e2e-webskill.azurewebsites.net/api/InvokeTextAnalyticsV3?code=foo",
    "httpHeaders": {
        "Ocp-Apim-Subscription-Key": "foobar"
    },
    "context": "/document/orgs/*",
    "inputs": [
      {
        "name": "query",
        "source": "/document/orgs/*"
      }
    ],
    "outputs": [
      {
        "name": "description",
        "targetName": "companyDescription"
      }
    ]
  }
]
```

> [!NOTE]
> You can build complex skillsets with looping and branching, using the [Conditional skill](cognitive-search-skill-conditional.md) to create the expressions. The syntax is based on the [JSON Pointer](https://tools.ietf.org/html/rfc6901) path notation, with a few modifications to identify nodes in the enrichment tree. A `"/"` traverses a level lower in the tree and  `"*"` acts as a for-each operator in the context. Numerous examples in this article illustrate the syntax. 

## How built-in skills are structured

Each built-in skill is unique in terms of the inputs and parameters it takes. The documentation for each skill describes all of the properties of a given skill. Although there are difference, most skills share a common set of parameters and are similarly patterned. To illustrate several points, the [Entity Recognition skill](cognitive-search-skill-entity-recognition-v3.md) provides an example:

```json
{
  "@odata.type": "#Microsoft.Skills.Text.V3.EntityRecognitionSkill",
  "context": "/document",
  "categories": [ "Organization" ],
  "defaultLanguageCode": "en",
  "inputs": [
    {
      "name": "text",
      "source": "/document/content"
    }
  ],
  "outputs": [
    {
      "name": "organizations",
      "targetName": "orgs"
    }
  ]
}
```

+ Common parameters include `"odata.type"` which uniquely identifies the skill, `inputs`, and `outputs`. The other properties, namely`"categories"` and `"defaultLanguageCode"`, are examples of properties that are specific to Entity Recognition. 

+ `"context"` is a node in an enrichment tree and it represents the level at which operations take place. All skills have this property. If the `"context"` field is not explicitly set, the default context is the document. In the example, the context is the whole document, meaning that the entity recognition skill is called once per document.

  The context also determines where outputs are also produced in the enrichment tree. In this example, the skill returns a property called `organizations`, captured as `orgs`, which is added as a child node of `"/document"`. In downstream skills, the path to this newly-created enrichment node is `"/document/orgs"`. For a particular document, the value of `"/document/orgs"` is an array of organizations extracted from the text (for example: `["Microsoft", "LinkedIn"]`).

+ This skill has one input called "text", with a source input set to `"/document/content"`. An input's name is a valid value that's defined for the skill. The source is a path to a node in the enrichment tree. In this example, the skill operates on the *content* field of each document, which is a standard field created by the Azure Blob indexer. 

+ Outputs exist only during processing. To chain this output to a downstream skill's input, reference the output as `"/document/orgs"`. To send output to a field in a search index, [create an output field mapping](cognitive-search-output-field-mapping.md) in an indexer. To send output to a knowledge store, [create a projection](knowledge-store-projection-overview.md).

Outputs from the one skill can conflict with outputs from a different skill. If you have multiple skills returning the same output, use the `targetName` for name disambiguation in enrichment node paths.

Some situations call for referencing each element of an array separately. For example, suppose you want to pass *each element* of `"/document/orgs"` separately to another skill. To do so, add an asterisk to the path: `"/document/orgs/*"` 

The second skill for sentiment analysis follows the same pattern as the first enricher. It takes `"/document/content"` as input, and returns a sentiment score for each content instance. Since you did not set the `"context"` field explicitly, the output (mySentiment) is now a child of `"/document"`.

```json
    {
      "@odata.type": "#Microsoft.Skills.Text.SentimentSkill",
      "inputs": [
        {
          "name": "text",
          "source": "/document/content"
        }
      ],
      "outputs": [
        {
          "name": "score",
          "targetName": "mySentiment"
        }
      ]
    },
```

## Adding a custom skill

Recall the structure of the custom Bing entity search enricher:

```json
    {
      "@odata.type": "#Microsoft.Skills.Custom.WebApiSkill",
     "description": "This skill calls an Azure function, which in turn calls Bing Entity Search",
      "uri": "https://indexer-e2e-webskill.azurewebsites.net/api/InvokeTextAnalyticsV3?code=foo",
      "httpHeaders": {
          "Ocp-Apim-Subscription-Key": "foobar"
      },
      "context": "/document/orgs/*",
      "inputs": [
        {
          "name": "query",
          "source": "/document/orgs/*"
        }
      ],
      "outputs": [
        {
          "name": "description",
          "targetName": "companyDescription"
        }
      ]
    }
```

This definition is a [custom skill](cognitive-search-custom-skill-web-api.md) that calls a web API as part of the enrichment process. For each organization identified by entity recognition, this skill calls a web API to find the description of that organization. The orchestration of when to call the web API and how to flow the information received is handled internally by the enrichment engine. However, the initialization necessary for calling this custom API must be provided in the JSON (such as uri, httpHeaders, and the inputs expected). For guidance in creating a custom web API for the enrichment pipeline, see [How to define a custom interface](cognitive-search-custom-skill-interface.md).

Notice that the "context" field is set to `"/document/orgs/*"` with an asterisk, meaning the enrichment step is called *for each* organization under `"/document/orgs"`. 

Output, in this case a company description, is generated for each organization identified. When referring to the description in a downstream step (for example, in key phrase extraction), you would use the path ```"/document/orgs/*/description"``` to do so. 

## Skills output

The skillset generates enriched documents that collect the output of each enrichment step. Consider the following example of unstructured text:

*"In its fourth quarter, Microsoft logged $1.1 billion in revenue from LinkedIn, the social networking company it bought last year. The acquisition enables Microsoft to combine LinkedIn capabilities with its CRM and Office capabilities. Stockholders are excited with the progress so far."*

Using the sentiment analyzer and entity recognition, a likely outcome would be a generated structure similar to the following illustration:

![Sample output structure](media/cognitive-search-defining-skillset/enriched-doc.png "Sample output structure")

Enriched documents exist in the enrichment pipeline as temporary data structures. To export the enrichments for consumption outside of the pipeline, follow one or more these approaches:

+ Map skill outputs to [fields in a search index](cognitive-search-output-field-mapping.md)
+ Map skill outputs to [data shapes](knowledge-store-projection-shape.md) for subsequent [projection into a knowledge store](knowledge-store-projections-examples.md)
+ Send whole, enriched documents to blob storage via knowledge store

You can also [cache enrichments](cognitive-search-incremental-indexing-conceptual.md), but the storage and format is not intended to be human-readable.

<a name="next-step"></a>

## Next steps

Context and input source fields are paths to nodes in an enrichment tree. As a next step, learn more about path syntax.

> [!div class="nextstepaction"]
> [Referencing annotations in a skillset](cognitive-search-concept-annotations-syntax.md).
