---
title: Interface definition for custom skills in a cognitive search pipeline (Azure Search) | Microsoft Docs
description: Custom data extraction interface for web-api custom skill in cognitive search pipeline in Azure Search.
manager: pablocas
author: luiscabrer
services: search
ms.service: search
ms.devlang: NA
ms.topic: conceptual
ms.date: 08/14/2018
ms.author: luisca
---

# How to add a custom skill to a cognitive search pipeline

A [cognitive search indexing pipeline](cognitive-search-concept-intro.md) in Azure Search can be assembled from [predefined skills](cognitive-search-predefined-skills.md) as well as custom skills that you personally create and add to the pipeline. In this article, learn how to create a custom skill that exposes an interface allowing it to be included in a cognitive search pipeline. 

Building a custom skill gives you a way to insert transformations unique to your content. A custom skill executes independently, applying whatever enrichment step you require. For example, you could define field-specific custom entities, build custom classification models to differentiate business and financial contracts and documents, or add a speech recognition skill to reach deeper into audio files for relevant content. For a step-by-step example, see [Example: creating a custom skill](cognitive-search-create-custom-skill-example.md).

 Whatever custom capability you require, there is a simple and clear interface for connecting a custom skill to the rest of the enrichment pipeline. The only requirement for inclusion in a [skillset](cognitive-search-defining-skillset.md) is the ability to accept inputs and emit outputs in ways that are consumable within the skillset as a whole. The focus of this article is on the input and output formats that the enrichment pipeline requires.

## Web API custom skill interface

Custom WebAPI skill endpoints must return a response within a 5 minute window. The indexing pipeline is synchronous and indexing will produce a timeout error if a response is not received in that window.”

Currently, the only mechanism for interacting with a custom skill is through a Web API interface. The Web API needs must meet the requirements described in this section.

### 1.  Web API Input Format

The Web API must accept an array of records to be processed. Each record must contain a "property bag" that is the input provided to your Web API. 

Suppose you want to create a simple enricher that identifies the first date mentioned in the text of a contract. In this example, the skill accepts a single input *contractText* as the contract text. The skill also has a single output, which is the date of the contract. To make the enricher more interesting, return this *contractDate* in the shape of a multi-part complex type.

Your Web API should be ready to receive a batch of input records. Each member of the *values* array represents the input for a particular record. Each record is required to have the following elements:

+ A *recordId* member that is the unique identifier for a particular record. When your enricher returns the results, it must provide this *recordId* in order to allow the caller to match the record results to their input.

+ A *data* member, which is essentially a bag of input fields for each record.

To be more concrete, per the example above, your Web API should expect requests that look like this:

```json
{
    "values": [
      {
        "recordId": "a1",
        "data":
           {
             "contractText": 
                "This is a contract that was issues on November 3, 2017 and that involves... "
           }
      },
      {
        "recordId": "b5",
        "data":
           {
             "contractText": 
                "In the City of Seattle, WA on February 5, 2018 there was a decision made..."
           }
      },
      {
        "recordId": "c3",
        "data":
           {
             "contractText": null
           }
      }
    ]
}
```
In reality, your service may get called with hundreds or thousands of records instead of only the three shown here.

### 2. Web API Output Format

The format of the output is a set of records containing a *recordId*, and a property bag 

```json
{
  "values": 
  [
      {
        "recordId": "b5",
        "data" : 
        {
            "contractDate":  { "day" : 5, "month": 2, "year" : 2018 }
        }
      },
      {
        "recordId": "a1",
        "data" : {
            "contractDate": { "day" : 3, "month": 11, "year" : 2017 }                    
        }
      },
      {
        "recordId": "c3",
        "data" : 
        {
        },
        "errors": [ { "message": "contractText field required "}   ],  
        "warnings": [ {"message": "Date not found" }  ]
      }
    ]
}
```

This particular example has only one output, but you could output more than one property. 

### Errors and Warning

As shown in the previous example, you may return error and warning messages for each record.

## Consuming custom skills from skillset

When you create a Web API enricher, you can describe HTTP headers and parameters as part of the request. The snippet below shows how request parameters and HTTP headers may be described as part of the skillset definition.

```json
{
    "skills": [
      {
        "@odata.type": "#Microsoft.Skills.Custom.WebApiSkill",
        "description": "This skill calls an Azure function, which in turn calls TA sentiment",
        "uri": "https://indexer-e2e-webskill.azurewebsites.net/api/DateExtractor?language=en",
        "context": "/document",
        "httpHeaders": {
            "DateExtractor-Api-Key": "foo"
        },
        "inputs": [
          {
            "name": "contractText",
            "source": "/document/content"
          }
        ],
        "outputs": [
          {
            "name": "contractDate",
            "targetName": "date"
          }
        ]
      }
  ]
}
```

## Next steps

+ [Example: Creating a custom skill for the Translate Text API](cognitive-search-create-custom-skill-example.md)
+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Create Skillset (REST)](https://docs.microsoft.com/rest/api/searchservice/create-skillset)
+ [How to map enriched fields](cognitive-search-output-field-mapping.md)
