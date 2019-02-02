---
title: Custom cognitive search skill - Azure Search
description: Extend capabilities of cognitive search skillsets by calling out to Web APIs
services: search
manager: pablocas
author: luiscabrer

ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: conceptual
ms.date: 01/31/2019
ms.author: luisca
ms.custom: seojan2018
---

#	 Custom Web API skill

The **Custom Web API** skill allows you to extend the functionality of cognitive search by calling to out to a custom web api endpoint to enhance enrichments performed by predefined skills. Similar to other predefined skills a **Custom Web API** skill has inputs and outputs. Depending on the inputs (which are unconstrained), your Web API will receive a _JSON_ payload when the indexer to which this skillset is associated runs. Your Web API is expected to also return a _JSON_ payload (whose structure is dependent on any outputs defined in the skill) as a response along with a success status code, for the results to be treated as custom enrichments. Any other response is considered an error and no enrichments are performed.

The structure of the JSON payloads is described further down in this document.

> [!NOTE]
> The indexer execution will attempt to retry upto a few times for certain standard HTTP status codes returned from the Web API. These HTTP status codes are: 
> * `503 Service Unavailable`
> * `429 Too Many Requests`

## @odata.type  
Microsoft.Skills.Custom.WebApiSkill

## Skill parameters

Parameters are case-sensitive.

| Parameter name	 | Description |
|--------------------|-------------|
| uri | The URI of the web api to which the _JSON_ payload will be sent. Only **https** URI scheme is allowed |
| httpMethod | The method to use while sending the payload. Allowed methods are `PUT` or `POST` |
| httpHeaders | A collection of key-value pairs where the keys represent header names and values represent header values that will be sent to your Web API along with the payload. The following headers are prohibited from being in this collection:  `Accept`, `Accept-Charset`, `Accept-Encoding`, `Content-Length`, `Content-Type`, `Cookie`, `Host`, `TE`, `Upgrade`, `Via` |
| timeout | (Optional) When specified, indicates the timeout for the http client making the API call. It must be formatted as an XSD "dayTimeDuration" value (a restricted subset of an [ISO 8601 duration](https://www.w3.org/TR/xmlschema11-2/#dayTimeDuration) value). For example, `PT60S` for 60 seconds. If not set, a default value of 30 seconds is chosen. The timeout can be set to a maximum of 90 seconds and a minimum of 1 second. |
| batchSize | (Optional) Indicates how many "data records" (see _JSON_ payload structure below) will be sent per API call. If not set, a default of 1000 is chosen. We recommend that you make use of this parameter to achieve a suitable tradeoff between indexing throughput and load on your API |

## Skill inputs

There are no "predefined" inputs for this skill. You can choose one or more fields that would be already available at the time of this skill's execution as inputs and the _JSON_ payload sent to the Web API will have different fields.

## Skill outputs

There are no "predefined" outputs for this skill. Depending on the response your Web API will return, add output fields so that they can be picked up from the _JSON_ response.


##	Sample definition

```json
  {
        "@odata.type": "#Microsoft.Skills.Custom.WebApiSkill",
        "description": "Translator custom skill",
        "uri": "https://contoso.translate.com",
        "batchSize": 1,
        "context": "/document",
        "inputs": [
          {
            "name": "text",
            "source": "/document/content"
          },
          {
            "name": "targetLanguage",
            "source": "/document/destinationLanguage"
          }
        ],
        "outputs": [
          {
            "name": "translation",
            "targetName": "translatedText"
          }
        ]
      }
```
##	Sample input JSON structure

This _JSON_ structure represents the payload that will be sent to your Web API.
It will always follow these constraints:

1. The top-level entity is called `values` and will be an array of objects. The number of such objects will be at most the `batchSize`
2. Each object in the `values` array will have
    * A `recordId` property that is a **unique** string, used to identify that record.
    * A `data` property that is a json object. The fields of the `data` property will be those specified in the `inputs` section of the skill definition. The value of those fields will be from the `source` of those fields (which could be from a field in the document, or potentially from another skill)

```json
{
    "values": [
      {
        "recordId": "0",
        "data":
           {
             "text": "Este es un contrato en Inglés",
             "targetLanguage": "en"
           }
      }
    ]
}
```

##	Sample output JSON structure

The "output" corresponds to the response returned from your web api. The web api should only return a _JSON_ payload (verified by looking at the `Content-Type` response header) and should satisfy the following constraints:

1. There should be a top-level entity called `values` which should be an array of objects.
2. The number of objects in the array should be the same as the number of objects sent to the web api.
3. Each object should have
   * A `recordId` property
   * A `data` property, which is an object where the fields are enrichments matching the fields in the `output` and whose value is considered the enrichment.
   * An `errors` property, an array listing any errors encountered that will be added to the indexer execution history. This property is required, but can have a `null` value.
   * A `warnings` property, an array listing any warnings encountered that will be added to the indexer execution history. This property is required, but can have a `null` value.
4. The objects in the `values` array need not be in the same order as the objects in the `values` array sent as a request to the Web API. However, the `recordId` is used for correlation so any record in the response containing a `recordId` which was not part of the original request to the Web API will be discarded.

```json
{
    "values": [
        {
            "recordId": "0",
            "data": {
                "translation": "This is a contract in English"
            },
            "errors": null,
            "warnings": null
        }
    ]
}

```

## Error cases
In addition to your Web API being unavailable, or sending out non-successful status codes the following are considered erroneous cases

* If the Web API returns a success status code but the response indicates that it is not `application/json` then the response is considered invalid and no enrichments will be performed.
* If there are **invalid** (with `recordId` not in the original request, or with duplicate values) records in the response `values` array, no enrichment will be performed for **those** records.

For cases when the Web API is unavailable or returns a HTTP error, a friendly error with any available details about the HTTP error will be added to the indexer execution history.

## See also

+ [How to define a skillset](cognitive-search-defining-skillset.md)
+ [Add custom skill to cognitive search](cognitive-search-custom-skill-interface.md)
+ [Create a custom skill using the Text Translate API](cognitive-search-create-custom-skill-example.md)