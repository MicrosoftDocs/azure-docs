---
title: Create a skillset
titleSuffix: Azure Cognitive Search
description: A skillset defines data extraction, natural language processing, and image analysis steps. A skillset is attached to indexer. It's used to enrich and extract information from source data for use in Azure Cognitive Search.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/31/2022
---

# Create a skillset in Azure Cognitive Search

![indexer stages](media/cognitive-search-defining-skillset/indexer-stages-skillset.png "indexer stages")

A skillset defines the operations that extract and enrich data to make it searchable. It executes after text and images are extracted, and after [field mappings](search-indexer-field-mappings.md) are processed.

This article explains how to create a skillset with the [Create Skillset (REST API)](/rest/api/searchservice/create-skillset). Rules for skillset definition include:

+ A skillset is a top-level resource, which means it can be created once and referenced by many indexers.
+ A skillset must contain at least one skill.
+ A skillset can repeat skills of the same type (for example, multiple Shaper skills).

An indexer drives skillset execution. You need an [indexer](search-howto-create-indexers.md), [data source](search-data-sources-gallery.md), and [search index](search-what-is-an-index.md) before you can test your skillset.

> [!TIP]
> Enable [enrichment caching](cognitive-search-incremental-indexing-conceptual.md) to reuse the content you've already processed and lower the cost of development.

## Add a skillset definition

Start with the basic structure. In the [Create Skillset REST API](/rest/api/searchservice/create-skillset), the body of the request is authored in JSON and has the following sections:

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

+ `skills` array, an unordered [collection of skills](cognitive-search-predefined-skills.md), for which the search service determines the sequence of execution based on the inputs required for each skill. If skills are independent, they execute in parallel. Skills can be utilitarian (like splitting text), transformational (based on AI from Cognitive Services), or custom skills that you provide. An example of a skills array is provided in the next section.

+ `cognitiveServices` is used for [billable skills](cognitive-search-predefined-skills.md) that call Cognitive Services APIs. Remove this section if you aren't using billable skills or Custom Entity Lookup. [Attach a resource](cognitive-search-attach-cognitive-services.md) if you are.

+ `knowledgeStore` (optional) specifies an Azure Storage account and settings for projecting skillset output into tables, blobs, and files in Azure Storage. Remove this section if you don't need it, otherwise [specify a knowledge store](knowledge-store-create-rest.md).

+ `encryptionKey` (optional) specifies an Azure Key Vault and [customer-managed keys](search-security-manage-encryption-keys.md) used to encrypt sensitive content in a skillset definition. Remove this property if you aren't using customer-managed encryption.

## Insert a skills array

Inside the skillset definition, the skills array specifies which skills to execute. All skills have a type, context, inputs, and outputs. The following example shows two unrelated, [built-in skills](cognitive-search-predefined-skills.md). Notice that each skill has a type, context, inputs, and outputs. 

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
    "context": "/document",
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
  }
]
```

> [!NOTE]
> You can build complex skillsets with looping and branching using the [Conditional skill](cognitive-search-skill-conditional.md) to create the expressions. The syntax is based on the [JSON Pointer](https://tools.ietf.org/html/rfc6901) path notation, with a few modifications to identify nodes in the enrichment tree. A `"/"` traverses a level lower in the tree and `"*"` acts as a for-each operator in the context. Numerous examples in this article illustrate the [the syntax](cognitive-search-skill-annotation-language.md). 

### How built-in skills are structured

Each skill is unique in terms of its input values and the parameters that it takes. The [documentation for each skill](cognitive-search-predefined-skills.md) describes all of the parameters and properties of a given skill. Although there are differences, most skills share a common set and are similarly patterned. To illustrate several points, the [Entity Recognition skill](cognitive-search-skill-entity-recognition-v3.md) provides an example:

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

Common parameters include "odata.type", "inputs", and "outputs". The other parameters, namely "categories" and "defaultLanguageCode", are examples of parameters that are specific to Entity Recognition. 

+ **"odata.type"** uniquely identifies each skill. You can find the type in the [skill reference documentation](cognitive-search-predefined-skills.md). 

+ **"context"** is a node in an enrichment tree and it represents the level at which operations take place. All skills have this property. If the "context" field isn't explicitly set, the default context is `"/document"`. In the example, the context is the whole document, which means that the entity recognition skill is called once per document.

  The context also determines where outputs are produced in the enrichment tree. In this example, the skill returns a property called `"organizations"`, captured as `orgs`, which is added as a child node of `"/document"`. In downstream skills, the path to this node is `"/document/orgs"`. For a particular document, the value of `"/document/orgs"` is an array of organizations extracted from the text (for example: `["Microsoft", "LinkedIn"]`). For more information about path syntax, see [How to reference annotations in a skillset](cognitive-search-concept-annotations-syntax.md).

+ **"inputs"** specify the origin of the incoming data and how it's used. In the [Entity Recognition](cognitive-search-skill-entity-recognition-v3.md) skill, one of the inputs is `"text"`, which is the content to be analyzed for entities. The content is sourced from the `"/document/content"` node in an enrichment tree. In an enrichment tree, `"/document"` is the root node. For documents retrieved by an Azure Blob indexer, the `content` field of each document is a standard field created by the indexer. 

+ **"outputs"** represent the output of the skill. Each skill is designed to emit specific kinds of output, which are referenced by name in the skillset. In Entity Recognition, `"organizations"` is one of the outputs it supports. The documentation for each skill describes the outputs it can produce.

Outputs exist only during processing. To chain this output to the input of a downstream skill, reference the output as `"/document/orgs"`. To send output to a field in a search index, [create an output field mapping](cognitive-search-output-field-mapping.md) in an indexer. To send output to a knowledge store, [create a projection](knowledge-store-projection-overview.md).

Outputs from the one skill can conflict with outputs from a different skill. If you have multiple skills that return the same output, use the `"targetName"` for name disambiguation in enrichment node paths.

Some situations call for referencing each element of an array separately. For example, suppose you want to pass *each element* of `"/document/orgs"` separately to another skill. To do so, add an asterisk to the path: `"/document/orgs/*"`.

The second skill for sentiment analysis follows the same pattern as the first enricher. It takes `"/document/content"` as input, and returns a sentiment score for each content instance. Since you didn't set the "context" field explicitly, the output (mySentiment) is now a child of `"/document"`.

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
}
```

## Set context and input source

1. Set the skill's [context property](cognitive-search-working-with-skillsets.md#context). Context determines the level at which operations take place, and where outputs are produced in the enrichment tree. It's usually one of the following examples:

    | Context example | Description |
    |-----------------|-------------|
    | "context": "/document"  | (Default) Inputs and outputs are at the document level. |
    | "context": "/document/pages/*" | Some skills like sentiment analysis perform better over smaller chunks of text. If you're splitting a large content field into pages or sentences, the context should be over each component part. |
    | "context": "/document/normalized_images/*" | Inputs and outputs are one per image in the parent document. |

1. Set the skill's input source to the node that's providing the data to be processed. For text-based skills, it's a field in the document or row that provides text. For image-based skills, the node providing the input is normalized images.

    | Source example | Description |
    |-----------------|-------------|
    | "source": "/document/content"  | For blobs, the source is usually the blob's content property. |
    | "source": "/document/some-named-field" | For text-based skills, such as entity recognition or key phrase extraction, the origin should be a field that contains sufficient text to be analyzed, such as a "description" or "summary". |
    | "source": "/document/normalized_images/*" | For image content, the source is image that's been normalized during document cracking. |

If the skill iterates over an array, both context and input source should include `/*` in the correct positions. 

## Add a custom skill

This section includes an example of a [custom skill](cognitive-search-custom-skill-web-api.md). The URI points to an Azure Function, which in turn invokes the model or transformation that you provide. For more information, see [Define a custom interface](cognitive-search-custom-skill-interface.md).

Although the custom skill is executing code that is external to the pipeline, in a skills array, it's just another skill. Like the built-in skills, it has a type, context, inputs, and outputs. It also reads and writes to an enrichment tree, just as the built-in skills do. Notice that the "context" field is set to `"/document/orgs/*"` with an asterisk, meaning the enrichment step is called *for each* organization under `"/document/orgs"`.

Output, such as the company description in this example, is generated for each organization that's identified. When referring to the node in a downstream step (for example, in key phrase extraction), you would use the path `"/document/orgs/*/companyDescription"` to do so. 

```json
{
  "@odata.type": "#Microsoft.Skills.Custom.WebApiSkill",
  "description": "This skill calls an Azure function, which in turn calls custom code",
  "uri": "https://indexer-e2e-webskill.azurewebsites.net/api/InvokeCode?code=foo",
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

## Send output to an index

As each skill executes, its output is added as nodes in a document's enrichment tree. Enriched documents exist in the pipeline as temporary data structures. To create a permanent data structure, and gain full visibility into what a skill is actually producing, send the output to a search index or a [knowledge store](knowledge-store-concept-intro.md).

In the early stages of skillset evaluation, checking preliminary results is important. We recommend a search index over a knowledge store because it's simpler to set up. For each skill output, [define an output field mapping](cognitive-search-output-field-mapping.md) in the indexer, and a field in the search index.

:::image type="content" source="media/cognitive-search-defining-skillset/skillset-indexer-index-combo.png" alt-text="Object diagram that shows the person entity as a skill output, indexer field mapping, and index field.":::

After you run the indexer, use [Search Explorer](search-explorer.md) to return documents from the index and check the contents of each field to determine what the skillset detected or created.

This screenshot shows the results of an entity recognition skill that detected persons, locations, organizations, and other entities in a chunk of text. You can view the results to decide whether a skill adds value to your solution.

:::image type="content" source="media/cognitive-search-defining-skillset/doc-in-search-explorer.png" alt-text="Screenshot of a document in Search Explorer.":::

## Tips for a first skillset

+ Assemble a representative sample of your content in Blob Storage or another supported data source and run the [**Import data** wizard](search-import-data-portal.md). 

  The wizard automates several steps that can be challenging the first time around. It defines fields in an index, field mappings in an indexer, and projections in a knowledge store if you're using one. For some skills, such as OCR or image analysis, the wizard adds utility skills that merge the image and text content that was separated during document cracking.

+ Alternatively, you can [import sample Postman collections](https://github.com/Azure-Samples/azure-search-postman-samples) that provide a full articulation of the object definitions required to evaluate a skill.

## Next steps

Context and input source fields are paths to nodes in an enrichment tree. As a next step, learn more about the path syntax for nodes in an enrichment tree.

> [!div class="nextstepaction"]
> [Referencing annotations in a skillset](cognitive-search-concept-annotations-syntax.md)
