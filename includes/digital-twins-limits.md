---
author: baanders
description: include file for Azure Digital Twins limits
ms.service: digital-twins
ms.topic: include
ms.date: 4/8/2021
ms.author: baanders
---

### Functional limits

The following table lists the functional limits of Azure Digital Twins. 

> [!TIP]
> For modeling recommendations to operate within these functional limits, see [Best practices for designing models](../articles/digital-twins/concepts-models.md#best-practices-for-designing-models).

| Area | Capability | Default limit | Adjustable? |
| --- | --- | --- | --- |
| Azure resource | Number of Azure Digital Twins instances in a region, per subscription | 10 | Yes |
| Digital twins | Number of twins in an Azure Digital Twins instance | 200,000 | Yes |
| Digital twins | Number of incoming relationships to a single twin | 5,000 | No |
| Digital twins | Number of outgoing relationships from a single twin | 5,000 | No |
| Digital twins | Maximum size (of JSON body in a PUT or PATCH request) of a single twin | 32 KB | No |
| Digital twins | Maximum request payload size | 32 KB | No | 
| Routing | Number of endpoints for a single Azure Digital Twins instance | 6 | No |
| Routing | Number of routes for a single Azure Digital Twins instance | 6 | Yes |
| Models | Number of models within a single Azure Digital Twins instance | 10,000 | Yes |
| Models | Number of models that can be uploaded in a single API call | 250 | No |
| Models | Maximum size (of JSON body in a PUT or PATCH request) of a single model | 1 MB | No |
| Models | Number of items returned in a single page | 100 | No |
| Query | Number of items returned in a single page | 100 | Yes |
| Query | Number of `AND` / `OR` expressions in a query | 50 | Yes |
| Query | Number of array items in an `IN` / `NOT IN` clause | 50 | Yes |
| Query | Number of characters in a query | 8,000 | Yes |
| Query | Number of `JOINS` in a query | 5 | Yes |

### Rate limits

The following table reflects the rate limits of different APIs.

| API | Capability | Default limit | Adjustable? |
| --- | --- | --- | --- |
| Models API | Number of requests per second | 100 | Yes |
| Digital Twins API | Number of read requests per second | 1,000 | Yes |
| Digital Twins API | Number of patch requests per second | 1,000 | Yes |
| Digital Twins API | Number of create/delete operations per second across **all twins and relationships** | 50 | Yes |
| Digital Twins API | Number of create/update/delete operations per second on a **single twin** or its relationships | 10 | No |
| Query API | Number of requests per second | 500 | Yes |
| Query API | [Query Units](../articles/digital-twins/concepts-query-units.md) per second | 4,000 | Yes |
| Event Routes API | Number of requests per second | 100 | Yes |

### Other limits

Limits on data types and fields within DTDL documents for Azure Digital Twins models can be found within its spec documentation in GitHub: [*Digital Twins Definition Language (DTDL) - version 2*](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md).
 
Query latency details and other query limitations can be found in [*How-to: Query the twin graph*](../articles/digital-twins/how-to-query-graph.md).
