---
title: Evaluate method - Knowledge Exploration Service API
titlesuffix: Azure Cognitive Services
description: Learn how to use the Evaluate method in the Knowledge Exploration Service (KES) API.
services: cognitive-services
author: bojunehsu
manager: cgronlun

ms.service: cognitive-services
ms.component: knowledge-exploration
ms.topic: conceptual
ms.date: 03/26/2016
ms.author: paulhsu
---

# evaluate Method

The *evaluate* method evaluates and returns the output of a structured query expression based on the index data.

Typically, an expression will be obtained from a response to the interpret method.  But you can also compose query expressions yourself (see [Structured Query Expression](Expressions.md)).  

## Request 

`http://<host>/evaluate?expr=<expr>&attributes=<attrs>[&<options>]`   

Name|Value|Description
----|----|----
expr       | Text string | Structured query expression that selects a subset of index entities.
attributes | Text string | Comma-delimited list of attributes to include in response.
count	   | Number (default=10) | Maximum number of results to return.
offset     | Number (default=0) | Index of the first result to return.
orderby |	Text string | Name of attribute used to sort the results, followed by optional sort order (default=asc): "*attrname*[:(asc&#124;desc)]".  If not specified, the results are returned by decreasing natural log probability.
timeout  | Number (default=1000) | Timeout in milliseconds. Only results computed before the timeout has elapsed are returned.

Using the *count* and *offset* parameters, a large number of results may be obtained incrementally over multiple requests.
  
## Response (JSON)
JSONPath|Description
----|----
$.expr | *expr* parameter from the request.
$.entities | Array of 0 or more object entities matching the structured query expression. 
$.aborted | True if the request timed out.

Each entity contains a *logprob* value and the values of the requested attributes.

## Example
In the academic publications example, the following request passes a structured query expression (potentially from the output of an *interpret* request) and retrieves a few attributes for the top 2 matching entities:

`http://<host>/evaluate?expr=Composite(Author.Name=='jaime teevan')&attributes=Title,Y,Author.Name,Author.Id&count=2`

The response contains the top 2 ("count=2") most likely matching entities.  For each entity, the title, year, author name, and author ID attributes are returned.  Note how the structure of composite attribute values matches the way they are specified in the data file. 

```json
{
  "expr": "Composite(Author.Name=='jaime teevan')",
  "entities": 
  [
    {
      "logprob": -6.645,
      "Ti": "personalizing search via automated analysis of interests and activities",
      "Y": 2005,
      "Author": [
        {
          "Name": "jaime teevan",
          "Id": 1968481722
        },
        {
          "Name": "susan t dumais",
          "Id": 676500258
        },
        {
          "Name": "eric horvitz",
          "Id": 1470530979
        }
      ]
    },
    {
      "logprob": -6.764,
      "Ti": "the perfect search engine is not enough a study of orienteering behavior in directed search",
      "Y": 2004,
      "Author": [
        {
          "Name": "jaime teevan",
          "Id": 1982462162
        },
        {
          "Name": "christine alvarado",
          "Id": 2163512453
        },
        {
          "Name": "mark s ackerman",
          "Id": 2055132526
        },
        {
          "Name": "david r karger",
          "Id": 2012534293
        }
      ]
    }
  ]
}
```
