---
title: Use entity recognition with the Text Analytics API 
titleSuffix: Azure Cognitive Services
description: Learn how to recognize entities using the Text Analytics REST API.
services: cognitive-services
author: ashmaka

manager: cgronlun
ms.service: cognitive-services
ms.component: text-analytics
ms.topic: article
ms.date: 10/01/2018
ms.author: ashmaka
---

# How to use Named Entity Recognition in Text Analytics (Preview)

The [Entity Recognition API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-V2-1-Preview/operations/5ac4251d5b4ccd1554da7634) takes unstructured text, and for each JSON document, returns a list of disambiguated entities with links to more information on the web (Wikipedia and Bing). 

## Entity Linking and Named Entity Recognition

The Text Analytics' `entities` endpoint supprts both named entity recognition (NER) and entity linking.

### Entity Linking
Entity linking is the ability to identify and disambiguate the identity of an entity found in text (e.g. determining whether the "Mars" is being used as the planet or as the Roman god of war). This process requires the presence of a knowledge base to which recognized entities are linked - Wikipedia is used as the knowledge base for the `entities` endpoint Text Analytics.

In Text Analytics [Version 2.1-Preview](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-V2-1-Preview/operations/5ac4251d5b4ccd1554da7634), only entity linking is available.

### Named Entity Recognition (NER)
Named entity recognition (NER) is the ability to identify different entities in text and categorize them into pre-defined classes. The supported classes of entities are listed below.

In Text Analytics Version 2.1 preview (`https://[region].api.cognitive.microsoft.com/text/analytics/v2.1-preview/entities`), both entity linking and named entity recognition (NER) are available.

### Language support

Using entity linking in various languages requires using a corresponding knowledge base in each language. For entity linking in Text Analytics, this means each language that is supported by the `entities` endpoint will link to the corresponding Wikipedia corpus in that language. Since the size of corpora varies between languages, it is expected that the entity linking functionality's recall will also vary.

## Supported Types for Named Entity Recognition

| Type  | SubType | Example |
|:-----------   |:------------- |:---------|
| Person        | N/A\*         | "Jeff", "Bill Gates"     |
| Location      | N/A\*         | "Redmond, Washington", "Paris"  |
| Organization  | N/A\*         | "Microsoft"   |
| Quantity      | Number        | "6", "six"     | 
| Quantity      | Percentage    | "50%", "fifty percent"| 
| Quantity      | Ordinal       | "2nd", "second"     | 
| Quantity      | NumberRange   | "4 to 8"     | 
| Quantity      | Age           | "90 day old", "30 years old"    | 
| Quantity      | Currency      | "$10.99"     | 
| Quantity      | Dimension     | "10 miles", "40 cm"     | 
| Quantity      | Temperature   | "32 degrees"    |
| DateTime      | N/A\*         | "6:30PM February 4, 2012"      | 
| DateTime      | Date          | "May 2nd, 2017", "05/02/2017"   | 
| Date Time     | Time          | "8am", "8:00"  | 
| DateTime      | DateRange     | "May 2nd to May 5th"    | 
| DateTime      | TimeRange     | "6pm to 7pm"     | 
| DateTime      | Duration      | "1 minute and 45 seconds"   | 
| DateTime      | Set           | "every Tuesday"     | 
| DateTime      | TimeZone      |    | 
| URL           | N/A\*         | "http://www.bing.com"    |
| Email         | N/A\*         | "support@contoso.com" |
\* Depending on the input and extracted entities, certain entities may omit the `SubType`.



## Preparation

You must have JSON documents in this format: id, text, language

For currently supported languages, please see [this list](../text-analytics-supported-languages.md).

Document size must be under 5,000 characters per document, and you can have up to 1,000 items (IDs) per collection. The collection is submitted in the body of the request. The following example is an illustration of content you might submit to the entity linking end.

```
{"documents": [{"id": "1",
				"language": "en",
                "text": "Jeff bought three dozen eggs because there was a 50% discount."
				},
               {"id": "2",
            	"language": "en",
                "text": "The Great Depression began in 1929. By 1933, the GDP in America fell by 25%."
                }
               ]
}
```    
    
## Step 1: Structure the request

Details on request definition can be found in [How to call the Text Analytics API](text-analytics-how-to-call-api.md). The following points are restated for convenience:

+ Create a **POST** request. Review the API documentation for this request: [Entity Linking API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics.V2.0/operations/5ac4251d5b4ccd1554da7634)

+ Set the HTTP endpoint for key phrase extraction. It must include the `/entities` resource: `https://westus.api.cognitive.microsoft.com/text/analytics/v2.1-preview/entities`

+ Set a request header to include the access key for Text Analytics operations. For more information, see [How to find endpoints and access keys](text-analytics-how-to-access-key.md).

+ In the request body, provide the JSON documents collection you prepared for this analysis

> [!Tip]
> Use [Postman](text-analytics-how-to-call-api.md) or open the **API testing console** in the [documentation](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-V2-1-Preview/operations/5ac4251d5b4ccd1554da7634) to structure a request and POST it to the service.

## Step 2: Post the request

Analysis is performed upon receipt of the request. The service accepts up to 100 requests per minute. Each request can be a maximum of 1 MB.

Recall that the service is stateless. No data is stored in your account. Results are returned immediately in the response.

## Step 3: View results

All POST requests return a JSON formatted response with the IDs and detected properties.

Output is returned immediately. You can stream the results to an application that accepts JSON or save the output to a file on the local system, and then import it into an application that allows you to sort, search, and manipulate the data.

An example of the output for entity linking is shown next:

```json
{
    "Documents": [
        {
            "Id": "1",
            "Entities": [
                {
                    "Name": "Jeff",
                    "Matches": [
                        {
                            "Text": "Jeff",
                            "Offset": 0,
                            "Length": 4
                        }
                    ],
                    "Type": "Person"
                },
                {
                    "Name": "three dozen",
                    "Matches": [
                        {
                            "Text": "three dozen",
                            "Offset": 12,
                            "Length": 11
                        }
                    ],
                    "Type": "Quantity",
                    "SubType": "Number"
                },
                {
                    "Name": "50",
                    "Matches": [
                        {
                            "Text": "50",
                            "Offset": 49,
                            "Length": 2
                        }
                    ],
                    "Type": "Quantity",
                    "SubType": "Number"
                },
                {
                    "Name": "50%",
                    "Matches": [
                        {
                            "Text": "50%",
                            "Offset": 49,
                            "Length": 3
                        }
                    ],
                    "Type": "Quantity",
                    "SubType": "Percentage"
                }
            ]
        },
        {
            "Id": "2",
            "Entities": [
                {
                    "Name": "Great Depression",
                    "Matches": [
                        {
                            "Text": "The Great Depression",
                            "Offset": 0,
                            "Length": 20
                        }
                    ],
                    "WikipediaLanguage": "en",
                    "WikipediaId": "Great Depression",
                    "WikipediaUrl": "https://en.wikipedia.org/wiki/Great_Depression",
                    "BingId": "d9364681-98ad-1a66-f869-a3f1c8ae8ef8"
                },
                {
                    "Name": "1929",
                    "Matches": [
                        {
                            "Text": "1929",
                            "Offset": 30,
                            "Length": 4
                        }
                    ],
                    "Type": "DateTime",
                    "SubType": "DateRange"
                },
                {
                    "Name": "By 1933",
                    "Matches": [
                        {
                            "Text": "By 1933",
                            "Offset": 36,
                            "Length": 7
                        }
                    ],
                    "Type": "DateTime",
                    "SubType": "DateRange"
                },
                {
                    "Name": "Gross domestic product",
                    "Matches": [
                        {
                            "Text": "GDP",
                            "Offset": 49,
                            "Length": 3
                        }
                    ],
                    "WikipediaLanguage": "en",
                    "WikipediaId": "Gross domestic product",
                    "WikipediaUrl": "https://en.wikipedia.org/wiki/Gross_domestic_product",
                    "BingId": "c859ed84-c0dd-e18f-394a-530cae5468a2"
                },
                {
                    "Name": "United States",
                    "Matches": [
                        {
                            "Text": "America",
                            "Offset": 56,
                            "Length": 7
                        }
                    ],
                    "WikipediaLanguage": "en",
                    "WikipediaId": "United States",
                    "WikipediaUrl": "https://en.wikipedia.org/wiki/United_States",
                    "BingId": "5232ed96-85b1-2edb-12c6-63e6c597a1de",
                    "Type": "Location"
                },
                {
                    "Name": "25",
                    "Matches": [
                        {
                            "Text": "25",
                            "Offset": 72,
                            "Length": 2
                        }
                    ],
                    "Type": "Quantity",
                    "SubType": "Number"
                },
                {
                    "Name": "25%",
                    "Matches": [
                        {
                            "Text": "25%",
                            "Offset": 72,
                            "Length": 3
                        }
                    ],
                    "Type": "Quantity",
                    "SubType": "Percentage"
                }
            ]
        }
    ],
    "Errors": []
}
```


## Summary

In this article, you learned concepts and workflow for entity linking using Text Analytics in Cognitive Services. In summary:

+ [Entities API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-V2-1-Preview/operations/5ac4251d5b4ccd1554da7634) is available for selected languages.
+ JSON documents in the request body include an id, text, and language code.
+ POST request is to a `/entities` endpoint, using a personalized [access key and an endpoint](text-analytics-how-to-access-key.md) that is valid for your subscription.
+ Response output, which consists of linked entities (including confidence scores, offsets, and web links, for each document ID) can be used in any application

## See also 

 [Text Analytics overview](../overview.md)  
 [Frequently asked questions (FAQ)](../text-analytics-resource-faq.md)</br>
 [Text Analytics product page](//go.microsoft.com/fwlink/?LinkID=759712) 

## Next steps

> [!div class="nextstepaction"]
> [Text Analytics API](https://westus.dev.cognitive.microsoft.com/docs/services/TextAnalytics-V2-1-Preview/operations/5ac4251d5b4ccd1554da7634)
