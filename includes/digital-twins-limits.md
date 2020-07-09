---
author: baanders
description: include file for Azure Digital Twins limits
ms.service: digital-twins
ms.topic: include
ms.date: 6/9/2020
ms.author: baanders
---

### Functional limits

The table below lists the functional limits of Azure Digital Twins in the current preview.

| Area | Capability | Default limit | Adjustable? |
| --- | --- | --- | --- |
| Azure resource | Number of Azure Digital Twins instances in a region, per subscription | 10 | Yes |
| Digital twins | Number of twins in an Azure Digital Twins instance | 200,000 | Yes |
| Routing | Number of endpoints for a single Azure Digital Twins instance | 6 | No |
| Routing | Number of routes for a single Azure Digital Twins instance | 6 | Yes |
| Models | Number of models within a single Azure Digital Twins instance | 10,000 | Yes |
| Models | Number of models that can be uploaded in a single API call | 250 | No |
| Models | Number of items returned in a single page | 100 | No |
| Query | Number of items returned in a single page | 100 | No |
| Query | Number of `AND` / `OR` expressions in a query | 50 | Yes |
| Query | Number of array items in an `IN` / `NOT IN` clause | 50 | Yes |
| Query | Number of characters in a query | 8,000 | Yes |
| Query | Number of `JOINS` in a query | 1 | Yes |

### Rate limits

This table reflects the rate limits of different APIs.

| API | Capability | Default limit | Adjustable? |
| --- | --- | --- | --- |
| Models API | Number of requests per second | 100 | Yes |
| Digital Twins API | Number of requests per second | 1,000 | Yes |
| Query API | Number of requests per second | 500 | Yes |
| Query API | Query units per second | 4,000 | Yes |
| Event Routes API | Number of requests per second | 100 | Yes |

### Other limits

Limits on data types and fields within DTDL documents for Azure Digital Twins models can be found within its spec documentation in GitHub: [Digital Twins Definition Language (DTDL) - version 2](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md).
 
Query latency details and other guidelines on writing queries during preview can be found in [How-to: Query the twin graph](../articles/digital-twins/how-to-query-graph.md).