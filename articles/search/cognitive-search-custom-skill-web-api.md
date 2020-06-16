---
title: Custom Web API skill in skillsets
titleSuffix: Azure Cognitive Search
description: Extend capabilities of Azure Cognitive Search skillsets by calling out to Web APIs. Use the Custom Web API skill to integrate your custom code.

manager: nitinme
author: luiscabrer
ms.author: luisca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---

# Custom Web API skill in an Azure Cognitive Search enrichment pipeline

The **Custom Web API** skill allows you to extend AI enrichment by calling out to a Web API endpoint providing custom operations. Similar to built-in skills, a **Custom Web API** skill has inputs and outputs. Depending on the inputs, your Web API receives a JSON payload when the indexer runs, and outputs a JSON payload as a response, along with a success status code. The response is expected to have the outputs specified by your custom skill. Any other response is considered an error and no enrichments are performed.

The structure of the JSON payloads are described further down in this document.

> [!NOTE]
> The indexer will retry twice for certain standard HTTP status codes returned from the Web API. These HTTP status codes are: 
> * `502 Bad Gateway`
> * `503 Service Unavailable`
> * `429 Too Many Requests`

## @odata.type  
Microsoft.Skills.Custom.WebApiSkill

## Skill parameters

Parameters are case-sensitive.

| Parameter name	 | Description |
|--------------------|-------------|
| uri | The URI of the Web API to which the _JSON_ payload will be sent. Only **https** URI scheme is allowed |
| httpMethod | The method to use while sending the payload. Allowed methods are `PUT` or `POST` |
| httpHeaders | A collection of key-value pairs where the keys represent header names and values represent header values that will be sent to your Web API along with the payload. The following headers are prohibited from being in this collection:  `Accept`, `Accept-Charset`, `Accept-Encoding`, `Content-Length`, `Content-Type`, `Cookie`, `Host`, `TE`, `Upgrade`, `Via` |
| timeout | (Optional) When specified, indicates the timeout for the http client making the API call. It must be formatted as an XSD "dayTimeDuration" value (a restricted subset of an [ISO 8601 duration](https://www.w3.org/TR/xmlschema11-2/#dayTimeDuration) value). For example, `PT60S` for 60 seconds. If not set, a default value of 30 seconds is chosen. The timeout can be set to a maximum of 230 seconds and a minimum of 1 second. |
| batchSize | (Optional) Indicates how many "data records" (see _JSON_ payload structure below) will be sent per API call. If not set, a default of 1000 is chosen. We recommend that you make use of this parameter to achieve a suitable tradeoff between indexing throughput and load on your API |
| degreeOfParallelism | (Optional) When specified, indicates the number of calls the indexer will make in parallel to the endpoint you have provided. You can decrease this value if your endpoint is failing under too high of a request load, or raise it if your endpoint is able to accept more requests and you would like an increase in the performance of the indexer.  If not set, a default value of 5 is used. The degreeOfParallelism can be set to a maximum of 10 and a minimum of 1. |

## Skill inputs

There are no "predefined" inputs for this skill. You can choose one or more fields that would be already available at the time of this skill's execution as inputs and the _JSON_ payload sent to the Web API will have different fields.

## Skill outputs

There are no "predefined" outputs for this skill. Depending on the response your Web API will return, add output fields so that they can be picked up from the _JSON_ response.


## Sample definition

```json
  {
        "@odata.type": "#Microsoft.Skills.Custom.WebApiSkill",
        "description": "A custom skill that can identify positions of different phrases in the source text",
        "uri": "https://contoso.count-things.com",
        "batchSize": 4,
        "context": "/document",
        "inputs": [
          {
            "name": "text",
            "source": "/document/content"
          },
          {
            "name": "language",
            "source": "/document/languageCode"
          },
          {
            "name": "phraseList",
            "source": "/document/keyphrases"
          }
        ],
        "outputs": [
          {
            "name": "hitPositions"
          }
        ]
      }
```
## Sample input JSON structure

This _JSON_ structure represents the payload that will be sent to your Web API.
It will always follow these constraints:

* The top-level entity is called `values` and will be an array of objects. The number of such objects will be at most the `batchSize`
* Each object in the `values` array will have
    * A `recordId` property that is a **unique** string, used to identify that record.
    * A `data` property that is a _JSON_ object. The fields of the `data` property will correspond to the "names" specified in the `inputs` section of the skill definition. The value of those fields will be from the `source` of those fields (which could be from a field in the document, or potentially from another skill)

```json
{
    "values": [
      {
        "recordId": "0",
        "data":
           {
             "text": "Este es un contrato en Inglés",
             "language": "es",
             "phraseList": ["Este", "Inglés"]
           }
      },
      {
        "recordId": "1",
        "data":
           {
             "text": "Hello world",
             "language": "en",
             "phraseList": ["Hi"]
           }
      },
      {
        "recordId": "2",
        "data":
           {
             "text": "Hello world, Hi world",
             "language": "en",
             "phraseList": ["world"]
           }
      },
      {
        "recordId": "3",
        "data":
           {
             "text": "Test",
             "language": "es",
             "phraseList": []
           }
      }
    ]
}
```

## Sample output JSON structure

The "output" corresponds to the response returned from your Web API. The Web API should only return a _JSON_ payload (verified by looking at the `Content-Type` response header) and should satisfy the following constraints:

* There should be a top-level entity called `values` which should be an array of objects.
* The number of objects in the array should be the same as the number of objects sent to the Web API.
* Each object should have:
   * A `recordId` property
   * A `data` property, which is an object where the fields are enrichments matching the "names" in the `output` and whose value is considered the enrichment.
   * An `errors` property, an array listing any errors encountered that will be added to the indexer execution history. This property is required, but can have a `null` value.
   * A `warnings` property, an array listing any warnings encountered that will be added to the indexer execution history. This property is required, but can have a `null` value.
* The objects in the `values` array need not be in the same order as the objects in the `values` array sent as a request to the Web API. However, the `recordId` is used for correlation so any record in the response containing a `recordId` which was not part of the original request to the Web API will be discarded.

```json
{
    "values": [
        {
            "recordId": "3",
            "data": {
            },
            "errors": [
              {
                "message" : "'phraseList' should not be null or empty"
              }
            ],
            "warnings": null
        },
        {
            "recordId": "2",
            "data": {
                "hitPositions": [6, 16]
            },
            "errors": null,
            "warnings": null
        },
        {
            "recordId": "0",
            "data": {
                "hitPositions": [0, 23]
            },
            "errors": null,
            "warnings": null
        },
        {
            "recordId": "1",
            "data": {
                "hitPositions": []
            },
            "errors": null,
            "warnings": {
                "message": "No occurrences of 'Hi' were found in the input text"
            }
        },
    ]
}

```

## Error cases
In addition to your Web API being unavailable, or sending out non-successful status codes the following are considered erroneous cases:

* If the Web API returns a success status code but the response indicates that it is not `application/json` then the response is considered invalid and no enrichments will be performed.
* If there are **invalid** (with `recordId` not in the original request, or with duplicate values) records in the response `values` array, no enrichment will be performed for **those** records.

For cases when the Web API is unavailable or returns a HTTP error, a friendly error with any available details about the HTTP error will be added to the indexer execution history.

## See also

+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Add custom skill to an AI enrichment pipeline](cognitive-search-custom-skill-interface.md)
+ [Example: Creating a custom skill for AI enrichment](cognitive-search-create-custom-skill-example.md)
