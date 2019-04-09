---
title: CalcHistogram method - Knowledge Exploration Service API
titlesuffix: Azure Cognitive Services
description: Learn how to use the CalcHistogram method in the Knowledge Exploration Service (KES) API.
services: cognitive-services
author: bojunehsu
manager: nitinme

ms.service: cognitive-services
ms.subservice: knowledge-exploration
ms.topic: conceptual
ms.date: 03/26/2016
ms.author: paulhsu
---

# calchistogram Method
The *calchistogram* method computes the objects matching a structured query expression and calculates the distribution of their attribute values.

## Request
`http://<host>/calchistogram?expr=<expr>[&options]` 

Name|Value|Description
----|-----|-----------
expr | Text string | Structured query expression that specifies the index entities over which to calculate histograms.
attributes | Text string (default="") | Comma-delimited list of attribute to included in the response.
count	| Number (default=10) | Number of results to return.
offset	| Number (default=0) | Index of the first result to return.

## Response (JSON)
JSONPath | Description
----|----
$.expr | *expr* parameter from the request.
$.num_entities | Total number of matching entities.
$.histograms |	Array of histograms, one for each requested attribute.
$.histograms[\*].attribute | Name of the attribute over which the histogram was computed.
$.histograms[\*].distinct_values | Number of distinct values among matching entities for this attribute.
$.histograms[\*].total_count | Total number of value instances among matching entities for this attribute.
$.histograms[\*].histogram | Histogram data for this attribute.
$.histograms[\*].histogram[\*].value | Attribute value.
$.histograms[\*].histogram[\*].logprob	| Total natural log probability of matching entities with this attribute value.
$.histograms[\*].histogram[\*].count	| Number of matching entities with this attribute value.
$.aborted | True if the request timed out.

### Example
In the academic publications example, the following calculates a histogram of publication counts by year and by keyword for a particular author since 2013:

`http://<host>/calchistogram?expr=And(Composite(Author.Name=='jaime teevan'),Year>=2013)&attributes=Year,Keyword&count=4`

The response indicates that there are 37 papers matching the query expression.  For the *Year* attribute, there are 3 distinct values, one for each year since 2013.  The total paper count over the 3 distinct values is 37.  For each *Year*, the histogram shows the value, total natural log probability, and count of matching entities.     

The histogram for *Keyword* shows that there are 34 distinct keywords. As a paper may be associated with multiple keywords, the total count (53) can be larger than the number of matching entities.  Although there are 34 distinct values, the response only includes the top 4 because of the "count=4" parameter.

```json
{
  "expr": "And(Composite(Author.Name=='jaime teevan'),Y>=2013)",
  "num_entities": 37,
  "histograms": [
    {
      "attribute": "Y",
      "distinct_values": 3,
      "total_count": 37,
      "histogram": [
        {
          "value": 2014,
          "logprob": -6.894,
          "count": 15
        },
        {
          "value": 2013,
          "logprob": -6.927,
          "count": 12
        },
        {
          "value": 2015,
          "logprob": -7.082,
          "count": 10
        }
      ]
    },
    {
      "attribute": "Keyword",
      "distinct_values": 34,
      "total_count": 53,
      "histogram": [
        {
          "value": "crowdsourcing",
          "logprob": -7.142,
          "count": 9
        },
        {
          "value": "information retrieval",
          "logprob": -7.389,
          "count": 4
        },
        {
          "value": "personalization",
          "logprob": -7.623,
          "count": 3
        },
        {
          "value": "mobile search",
          "logprob": -7.674,
          "count": 2
        }
      ]
    }
  ]
}
```	
