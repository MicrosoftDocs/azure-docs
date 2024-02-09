---
title: Create a skillset
titleSuffix: Azure AI Search
description: A skillset defines data extraction, natural language processing, and image analysis steps. A skillset is attached to indexer. It's used to enrich and extract information from source data for use in Azure AI Search.
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 07/14/2022
---

# Create a skillset in Azure AI Search

![indexer stages](media/cognitive-search-defining-skillset/indexer-stages-skillset.png "indexer stages")

A skillset defines the operations that extract and enrich data to make it searchable. It executes after text and images are extracted, and after [field mappings](search-indexer-field-mappings.md) are processed.

This article explains how to create a skillset with the [Create Skillset (REST API)](/rest/api/searchservice/create-skillset), but the same concepts and steps apply to other programming languages. 

Rules for skillset definition include:

+ A skillset must have a unique name within the skillset collection. When you define a skillset, you're creating a top-level resource that can be used by any indexer.
+ A skillset must contain at least one skill. A typical skillset has three to five. The maximum is 30.
+ A skillset can repeat skills of the same type (for example, multiple Shaper skills).
+ A skillset supports chained operations, looping, and branching.

Indexers drive skillset execution. You'll need an [indexer](search-howto-create-indexers.md), [data source](search-data-sources-gallery.md), and [index](search-what-is-an-index.md) before you can test your skillset.

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
      "description":"An Azure AI services resource in the same region as Azure AI Search",
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

+ `skills` array, an unordered [collection of skills](cognitive-search-predefined-skills.md). Skills can be utilitarian (like splitting text), transformational (based on AI from Azure AI services), or custom skills that you provide. An example of a skills array is provided in the next section.

+ `cognitiveServices` is used for [billable skills](cognitive-search-predefined-skills.md) that call Azure AI services APIs. Remove this section if you aren't using billable skills or Custom Entity Lookup. [Attach a resource](cognitive-search-attach-cognitive-services.md) if you are.

+ `knowledgeStore` (optional) specifies an Azure Storage account and settings for projecting skillset output into tables, blobs, and files in Azure Storage. Remove this section if you don't need it, otherwise [specify a knowledge store](knowledge-store-create-rest.md).

+ `encryptionKey` (optional) specifies an Azure Key Vault and [customer-managed keys](search-security-manage-encryption-keys.md) used to encrypt sensitive content (descriptions, connection strings, keys) in a skillset definition. Remove this property if you aren't using customer-managed encryption.

## Add skills

Inside the skillset definition, the skills array specifies which skills to execute. Three to five skills are common, but you can add as many skills as necessary, subject to [service limits](search-limits-quotas-capacity.md#indexer-limits).

The end result of an enrichment pipeline is textual content in either a search index or a knowledge store. For this reason, most skills either create text from images (OCR text, captions, tags), or analyze existing text to create new information (entities, key phrases, sentiment). Skills that operate independently are processed in parallel. Skills that depend on each other specify the output of one skill (such as key phrases) as the input of second skill (such as text translation). The search service determines the order of skill execution and the execution environment.

All skills have a type, context, inputs, and outputs. A skill might optionally have a name and description. The following example shows two unrelated [built-in skills](cognitive-search-predefined-skills.md) so that you can compare the basic structure.

```json
"skills": [
    {
        "@odata.type": "#Microsoft.Skills.Text.V3.EntityRecognitionSkill",
        "name": "#1",
        "description": "This skill detects organizations in the source content",
        "context": "/document",
        "categories": [
            "Organization"
        ],
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
        "name": "#2",
        "description": "This skill detects corporate logos in the source files",
        "@odata.type": "#Microsoft.Skills.Vision.ImageAnalysisSkill",
        "context": "/document/normalized_images/*",
        "visualFeatures": [
            "brands"
        ],
        "inputs": [
            {
                "name": "image",
                "source": "/document/normalized_images/*"
            }
        ],
        "outputs": [
            {
                "name": "brands"
            }
        ]
    }
]
```

Each skill is unique in terms of its input values and the parameters that it takes. [Skill reference documentation](cognitive-search-predefined-skills.md) describes all of the parameters and properties of a given skill. Although there are differences, most skills share a common set and are similarly patterned. 

> [!NOTE]
> You can build complex skillsets with looping and branching using the [Conditional skill](cognitive-search-skill-conditional.md) to create the expressions. The syntax is based on the [JSON Pointer](https://tools.ietf.org/html/rfc6901) path notation, with a few modifications to identify nodes in the enrichment tree. A `"/"` traverses a level lower in the tree and `"*"` acts as a for-each operator in the context. Numerous examples in this article illustrate the [the syntax](cognitive-search-skill-annotation-language.md). 

## Set skill context

Each skill has a [context property](cognitive-search-working-with-skillsets.md#skill-context) that determines the level at which operations take place. If the "context" property isn't explicitly set, the default is `"/document"`, where the context is the whole document (the skill is called once per document).

```json
"skills":[
  {
    "@odata.type": "#Microsoft.Skills.Text.V3.EntityRecognitionSkill",
    "context": "/document",
    "inputs": [],
    "outputs": []
  },
  {
      "@odata.type": "#Microsoft.Skills.Vision.ImageAnalysisSkill",
      "context": "/document/normalized_images/*",
      "visualFeatures": [],
      "inputs": [],
      "outputs": []
  }
]
```

Context is usually set to one of the following examples:

| Context example | Description |
|-----------------|-------------|
| "context": "/document"  | (Default) Inputs and outputs are at the document level. |
| "context": "/document/pages/*" | Some skills like sentiment analysis perform better over smaller chunks of text. If you're splitting a large content field into pages or sentences, the context should be over each component part. |
| "context": "/document/normalized_images/*" | For image content, inputs and outputs are one per image in the parent document. |

Context also determines where outputs are produced in the [enrichment tree](cognitive-search-working-with-skillsets.md#enrichment-tree). For example, the Entity Recognition skill returns a property called `"organizations"`, captured as `orgs`. If the context is `"/document"`, then an "organizations" node is added as a child of `"/document"`. If you then wanted to reference this node in downstream skills, the path would be `"/document/orgs"`.

## Define inputs

Skills read from and write to an enriched document. Skill inputs specify the origin of the incoming data. It's often the root node of the enriched document. For blobs, a typical skill input is the document's content property. 

[Skill reference documentation](cognitive-search-predefined-skills.md) for each skill describes the inputs it can consume. Each input has a "name" that identifies a specific input, and a "source" that specifies the location fo the data in the enriched document. The following example is from the Entity Recognition skill:

```json
"inputs": [
    {
        "name": "text", 
        "source": "/document/content"
    },
    {
        "name": "languageCode", 
        "source": "/document/language"
    }
]
```

+ Skills can have multiple inputs. The "name" is the specific input. For Entity Recognition, the specific inputs are "text" and "languageCode". 

+ The "source" property specifies which field or row provides the content to be processed. For text-based skills, the source is a field in the document or row that provides text. For image-based skills, the node providing the input is normalized images.

  | Source example | Description |
  |-----------------|-------------|
  | "source": "/document"  | For a tabular data set, a document corresponds to a row.|
  | "source": "/document/content"  | For blobs, the source is usually the blob's content property. |
  | "source": "/document/some-named-field" | For text-based skills, such as entity recognition or key phrase extraction, the origin should be a field that contains sufficient text to be analyzed, such as a "description" or "summary". |
  | "source": "/document/normalized_images/*" | For image content, the source is image that's been normalized during document cracking. |

If the skill iterates over an array, both context and input source should include `/*` in the correct positions.

## Define outputs

Each skill is designed to emit specific kinds of output, which are referenced by name in the skillset. A skill output has a "name" and an optional "targetName".

[Skill reference documentation](cognitive-search-predefined-skills.md) for each skill describes the outputs it can produce. The following example is from the Entity Recognition skill:

```json
"outputs": [
    {
        "name": "persons", 
        "targetName": "people"
    },
    {
        "name": "organizations", 
        "targetName": "orgs"
    },
    {
        "name": "locations", 
        "targetName": "places"
    }
]
```

+ Skills can have multiple outputs. The "name" identifies a specific output. For example, for Entity Recognition, output can be "persons", "locations", "organizations", among others. 

+ "targetName" specifies the name you would like this node to have in the enriched document. This is useful if skill outputs have the same name. If you have multiple skills that return the same output, use the `"targetName"` for name disambiguation in enrichment node paths. If the target name is unspecified, the name property is used for both.

Some situations call for referencing each element of an array separately. For example, suppose you want to pass *each element* of `"/document/orgs"` separately to another skill. To do so, add an asterisk to the path: `"/document/orgs/*"`.

Skill output is written to the enriched document as a new node in the enrichment tree. It might be a simple value, such as a sentiment score or language code. It could also be a collection, such as a list of organizations, people, or locations. Skill output can also be a complex structure, as is the case with the Shaper skill. The inputs of the skill determine the composition of the shape, but the output is the named object, which can be referenced in a search index, a knowledge store projection, or another skill by its name.

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

## Send output to a destination

Although skill output can be optionally cached for reuse purposes, it's usually temporary and exists only while skill execution is in progress.

+ To send output to a field in a search index, [create an output field mapping](cognitive-search-output-field-mapping.md) in an indexer.

+ To send output to a knowledge store, [create a projection](knowledge-store-projection-overview.md). 

+ To send output to a downstream skill, reference the output by its node name, such as `"/document/organization"`, in the downstream skill's input source property. See [Reference an annotation](cognitive-search-concept-annotations-syntax.md) for examples.

## Tips for a first skillset

+ Assemble a representative sample of your content in Blob Storage or another supported data source and run the [**Import data** wizard](search-import-data-portal.md). 

  The wizard automates several steps that can be challenging the first time around. It defines the skillset, index, and indexer, including field mappings and output field mappings. It will also define projections in a knowledge store if you're using one. For some skills, such as OCR or image analysis, the wizard adds utility skills that merge the image and text content that was separated during document cracking.

  After the wizard runs, you can open each object in the Azure portal to view its JSON definition. You can also use [Debug Sessions](cognitive-search-debug-session.md) to invoke skillset execution over a target document.

+ Alternatively, you can [import sample Postman collections](https://github.com/Azure-Samples/azure-search-postman-samples) that provide a full articulation of the object definitions required to evaluate a skill.

+ When you're ready to start from scratch on a new skillset, checking preliminary results is important. We recommend a search index for content validation because it's simpler to set up, in comparison to knowledge stores. 

  For each skill output, [define an output field mapping](cognitive-search-output-field-mapping.md) in the indexer, and a field in the search index.

  :::image type="content" source="media/cognitive-search-defining-skillset/skillset-indexer-index-combo.png" alt-text="Object diagram that shows the person entity as a skill output, indexer field mapping, and index field.":::

  After you run the indexer, use [Search Explorer](search-explorer.md) to return documents from the index and check the contents of each field to determine what the skillset detected or created.

  This screenshot shows the results of an entity recognition skill that detected persons, locations, organizations, and other entities in a chunk of text. You can view the results to decide whether a skill adds value to your solution.

  :::image type="content" source="media/cognitive-search-defining-skillset/doc-in-search-explorer.png" alt-text="Screenshot of a document in Search Explorer.":::

## Next steps

Context and input source fields are paths to nodes in an enrichment tree. As a next step, learn more about the path syntax for nodes in an enrichment tree.

> [!div class="nextstepaction"]
> [Referencing annotations in a skillset](cognitive-search-concept-annotations-syntax.md)
