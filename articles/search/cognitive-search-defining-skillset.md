---
title: How to create a skillset or augmentation pipeline (Azure Search) | Microsoft Docs
description: Define a set of steps to augment and extract structured information from your data
services: search
manager: pablocas
author: luiscabrer
documentationcenter: ''

ms.assetid: 
ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 05/01/2018
ms.author: luisca
---

# How to create a skillset or augmentation pipeline

Cognitive Search allows you to apply enrichment steps to your data. We call each of these enrichment steps *cognitive skills*. There are many predefined cognitive skills, that you can consume out of the box. You can also build an entirely new skill from the ground up and connect it as part of the skillset. To view the list of existing skills, see [built-in skills](cognitive-search-concept-skills-skillsets.md). For guidance on building custom skills, see [How to create a custom skill](cognitive-search-creating-custom-skills.md).

In this article, learn how to express the complete enrichment pipeline once you are familiar with the skills you want to use. The enrichment pipeline is attached to an Azure Search indexer. Part of pipeline design is constructing the skillset itself. Another part is specifying an indexer. An indexer definition includes a reference to the skillset, field mappings used for connecting inputs to outputs, and the target index.

Key points to remember:

+ You can only have one skillset per indexer.
+ A skillset must have at least one skill. The same skill can be used multiple times within the same skillset.

## Begin with the end in mind

A recommended initial step is deciding which data to extract from your raw data and how you want to use that data in a search solution. Drawing a diagram of the enrichment steps can help you identify the necessary steps.

Suppose you are interested in processing a set of financial analyst comments. For each file, you want to extract company names and the general sentiment of the comments. You might also want to write a custom enricher that uses the Bing Entity Search service to find additional information about the company, such as what kind of business the company is engaged in.

Essentially, you want to end up with the following information indexed for each document:

| record-text | companies | sentiment | company descriptions |
|--------|-----|-----|-----|
|sample-record| ["Microsoft", "LinkedIn"] | 0.99 | ["Microsoft Corporation is an American multinational technology company ..." , "LinkedIn is a business- and employment-oriented social networking..."]

A diagram showing the enrichment pipeline might look like this:

![](media/cognitive-search-defining-skillset/sample-skillset.png)


Once you have a clear idea  of what the pipeline looks like, you can express the skillset that provides these steps. Functionally, the skillset is expressed when you upload your indexer definition to Azure Search. To learn more about how to upload your indexer, see the [indexer-documentation](https://docs.microsoft.com/rest/api/searchservice/create-indexer).


In the diagram, the *document cracking* step happens automatically. Essentially, Azure Search knows how to open well-known files and creates a *content* field containing the text extracted from each document. The white boxes are built-in enrichers, and the dotted "Bing Entity Search" box represents a custom enricher that you will need to create. As illustrated, the skillset contains three skills.


## Skillset definition in REST

A skillset is defined as an array of skills. Each skill defines the source of its inputs and the name of the outputs it produces. Using the [Create Skillset REST API](ref-create-skillset.md), this is how you can define a skillset corresponding to the previous diagram: 

```
PUT http://[servicename].search.windows.net/skillsets/[skillset name]?api-version=2017-11-11-Preview
api-key: [admin key]
Content-Type: application/json
```
```json
{
  "name": "MySkillSet",
  "description": 
  "Extract sentiment from financial records, extract company names, and then find additional information about each company mentioned.",
  "skills":
  [
    {
      "@odata.type": "#Microsoft.Azure.Search.NamedEntityRecognitionSkill",
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
          "targetName": "organizations"
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
      "@odata.type": "#Microsoft.Azure.Search.WebApiSkill",
     "description": "Calls an Azure function, which in turn calls Bing Entity Search",
      "uri": "https://indexer-e2e-webskill.azurewebsites.net/api/InvokeTextAnalyticsV3?code=foo",
      "httpHeaders": {
          "Ocp-Apim-Subscription-Key": "foobar",
      }
      "context": "/document/content/organizations/*",
      "inputs": [
        {
          "name": "query",
          "source": "/document/content/organizations/*"
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
}

```

## Create a skillset

Each skillset starts with a name and description. There is only one skillset per indexer. As a resource in your Azure Search service, a skillset is required to have a name when you [create it](ref-create-skillset.md), but that name can be different from the one provided within the skillset body. Name and description within JSON exists to help you keep track of what a skillset does (JSON does not allow comments).

```json
{
  "name": "My Friendly Name SkillSet",
  "description": 
  "This is our first skill set, it will extract sentiment from financial records, extract company names, and then find additional information about each company mentioned.",
  ...
}
```

The next piece in the skillset is an array of skills. You can think of each skill as a primitive of enrichment. Each skill performs a small task in this enrichment pipeline. Each one takes an input (or a set of inputs), and returns some outputs. The next few sections focus on how to specify predefined and custom skills, chaining skills together through input and output references. Inputs can come from source data or from another skill. Outputs can be mapped to a field in a search index or used as an input to a downstream skill.

## Add predefined skills

Let's look at the first skill, which is the predefined [named entity recognition skill](cognitive-search-skill-named-entity-recognition.md):

```json
    {
      "@odata.type": "#Microsoft.Azure.Search.NamedEntityRecognitionSkill",
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
          "targetName": "organizations"
        }
      ]
    }
```

Every predefined skill has odata.type, input, and output properties. Skill-specific properties provide additional information applicable to that skill. In the case of entity recognition, "categories" is one entity among a fixed set of entities that the pretrained model can recognize.

The skill has one input called "text", with a source input set to ```"/document/content"```. The skill (named entity recognition) operates on the *content* field of each document, which is a standard field created by the Azure blob indexer. 

The skill has one output called ```"organizations"```. Outputs exist only during processing. To chain this output to a downstream skill's input, reference the output as ```"/document/content/organizations"```.

For a particular document, the value of ```"/document/content/organizations"``` will be an array of organizations extracted from the text. 

For instance:

```json
["Microsoft", "LinkedIn"]
```
Some situations call for referencing each element of an array separately. For example, suppose you want to pass each element of ```"/document/content/organizations"``` separately to another skill (such as the custom Bing entity search enricher). You can refer to each element of the array by adding an asterisk to the path: ```"/document/content/organizations/*"``` 

The second skill for sentiment extraction follows the same pattern as the first enricher. It takes ```"/document/content"``` as input, and returns a sentiment score for each content instance.

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

## Add a custom skill

Recall the structure of the custom Bing entity search enricher:

```json
    {
      "@odata.type": "#Microsoft.Azure.Search.WebApiSkill",
     "description": "This skill calls an Azure function, which in turn calls Bing Entity Search",
      "uri": "https://indexer-e2e-webskill.azurewebsites.net/api/InvokeTextAnalyticsV3?code=foo",
      "httpHeaders": {
          "Ocp-Apim-Subscription-Key": "foobar",
      }
      "context": "/document/content/organizations/*",
      "inputs": [
        {
          "name": "query",
          "source": "/document/content/organizations/*"
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

This is a custom skill that calls a web-api as part of the enrichment process. In other words, for each organization identified by named entity recognition, this skill calls a web-api to find the description of that organization. The orchestration of when to call the web-api and how to flow the information received is handled internally by the enrichment engine, but initialization necessary for calling this custom-api must be provided in the JSON (such as uri, httpHeaders, and the inputs expected). To learn how to create a custom web-api, see [How to create a custom skill](cognitive-search-creating-custom-skills.md).

Notice that the "context" field is set to ```"/document/content/organizations/*"``` with an asterisk. That means that the enrichment step will be called *for each* organization that is part of ```"/document/content/organizations"```. 

It also means that the output (in this case, a company description) will be generated for each organization identified. If you needed to refer to the description in another downstream step (for example, in key phrase extraction), you would use the path ```"/document/content/organizations/*/description"``` to do so. 

## Enrichments create structure out of unstructured information

As you may have noticed by now, the skillset generates structured information out of unstructured data. In our example above, a document like this:

*"In its fourth quarter, Microsoft logged $1.1 billion in revenue from LinkedIn, the social networking company it bought last year. The acquisition will enable Microsoft to combine LinkedIn capabilities with its CRM and Office capabilities. Stockholders are excited with the progress so far."*

would generate a structure like this once it goes through the skillset:

![](media/cognitive-search-defining-skillset/enriched-doc.png)

Recall that this structure is internal. You cannot actually retrieve this graph in code.

## Next steps...

Now that you are familiar with the enrichment pipeline and skillsets, continue with [mapping fields into your index](cognitive-search-output-field-mapping.md).