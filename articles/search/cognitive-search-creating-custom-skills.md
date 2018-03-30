---
title: How to create custom cognitive skills for an augmentation pipeline (Azure Search) | Microsoft Docs
description: Modify or build a cognitive skill to add custom logic or semantics to enrich text or image content.
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

# Creating custom skills

Cognitive Search allows you to apply enrichment steps to your data. We call each of these enrichment steps, cognitive skills. 

Some of these skills are ready to be consumed. You can for instance, extract the key-phrases of a piece or text,  extract what entities are mentioned in text, or even do OCR on an image. 

You may, however, need to create your own custom skills. For instance, you may want to use your own medical entities extractor, or you may have your own contract classifier. Whatever custom capability you may want to build, we provide a simple and clear interface for connecting your custom skill to the rest of the enrichment pipeline.

## Web API custom skill interface

Today, the only mechanism to interact with a custom skill is through a web-api interface.  The Web API needs to meet the following requirements:

### 1.  Web API Input Format

The Web API will receive an array of records to be processed. Each record will contain a "property bag" that will be the input provided to your Web-API. 

Imagine that you want to create a very simple enricher that will identify the first date mentioned in the text of a contract.

In this case your skill would a single inputs which is the contract text, let's call it *contractText*. You skill will also have a single output which is the date of the contract. To make our enricher more interesting, we will return this *contactDate* in the shape of a complex type.

Your Web-API should be ready to receive a batch of input records. Note that each of the members of the *values* array will represent the input for a particular record. Each of these values is required to have *recordId* member that is the unique id for a particular record. When your enricher returns the results it will also need to provide back this *recordId* in order to allow the caller to match the record results to their input.
Each of the values also has a *data* member which is essentially a bag of input fields for each record.

To be more concrete, for our example above, your Web-API should expect requests that look like this:

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
In reality your service may get called with 100s of records instead of only 2 records.

### 2.  Web API Output Format

The format of the output is a set of records that contains the *recordId*, and a property bag 

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

Note that this example has only one output, but you could output more than one property. 

## Errors and Warning

As the previous example shows, you may return error and warning messages for each record. 

## Consuming your custom as an enrichment step in a skillset

When you create your Web-API enricher, note that you can describe http headers and parameters as part of the request. The snippet below shows how request parameters and http headers may be described as part of the skillset definition.

```json
{
    "skills": [
      {
        "@odata.type": "#Microsoft.Azure.Search.WebApiSkill",
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
To learn more about hooking up skills and custom skills as part of the skills to be executed, 
see [Defining Skill Set](cognitive-search-defining-skillset.md). 