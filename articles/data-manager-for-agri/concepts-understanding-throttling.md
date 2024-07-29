---
title: API throttling guidance for Azure Data Manager for Agriculture
description: This article provides information on API throttling limits to plan usage in Azure Data Manager for Agriculture.
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 11/15/2023
ms.custom: template-concept
---

# API throttling guidance for Azure Data Manager for Agriculture

Throttling limits the number of requests to a service in a time span to prevent the overuse of resources. The throttling of the REST API in Azure Data Manager for Agriculture allows more consistent performance within a time span for customers who call the service's APIs.

Azure Data Manager for Agriculture can handle a high volume of requests. If an overwhelming number of requests occur from a few customers, throttling helps maintain optimal performance and reliability for all customers.

Throttling limits are contingent on the selected version and the capabilities of the product that a customer is using. Azure Data Manager for Agriculture supports two distinct versions:

- **Standard**: The version that we generally recommend.
- **Basic**: Suitable for prototyping requirements.

These limits operate within three time windows (per one minute, per five minutes, and per one month) to safeguard against sudden surges in traffic.

This article shows you how to track the number of requests that remain before you reach the limit, and how to respond when you reach the limit. Throttling limits apply to [these APIs](/rest/api/data-manager-for-agri/#data-plane-rest-apis).

## Classification of APIs

Azure Data Manager for Agriculture APIs fall into three main categories:

- **Write operations**: APIs that use REST API methods like `PATCH`, `POST`, and `DELETE` for altering data.
- **Read operations**: APIs that use the REST API method type `GET` to retrieve data, including search APIs of the method type `POST`.
- **Long-running job operations**: Long-running asynchronous job APIs that use the REST API method type `PUT`.

The overall available quota units, as explained in the following table, are shared among these categories. For instance, using the entire quota on write operations means no remaining quota for other operations. Each operation consumes a specific unit of quota, which helps you track the remaining quota for further use.

Operation | Unit cost for each request|
----------| -------------------------- |
Write   | 5 |
Read|   1 <sup>1</sup>|
Long-running job: [solution inference](/rest/api/data-manager-for-agri/#solution-inferences) | 5 |
Long-running job: [farm operation](/rest/api/data-manager-for-agri/#farm-operations) | 5 |
Long-running job: image rasterization | 2 |
Long-running job: cascading deletion of an entity | 2 |
Long-running job: [weather ingestion](/rest/api/data-manager-for-agri/#weather) | 1 |
Long-running job: [satellite ingestion](/rest/api/data-manager-for-agri/#satellite) | 1 |

<sup>1</sup>An extra unit cost is taken into account for each item returned in the response when you're retrieving more than one item.

## API limits for the Basic version

The following table lists the total available units per category for the Basic version:

Operation | Throttling time window | Units reset after each time window|
----------| -------------------------- | ------------------------------ |
Write/read| Per one minute    | 25,000 |
Write/read| Per five minutes| 100,000|
Write/read| Per one month| 5,000,000 |
Long-running job| Per five minutes| 1000|
Long-running job| Per one month| 100,000 |

## API limits for the Standard version

The Standard version offers a fivefold increase in API quota per month, compared to the Basic version. All other quota limits remain unchanged.

The following table lists the total available units per category for the Standard version:

Operation | Throttling time window | Units reset after each time window|
----------| -------------------------- | ------------------------------ |
Write/read| Per one minute    | 25,000 |
Write/read| Per five minutes| 100,000|
Write/read| Per one month| 25,000,000 <sup>1</sup> |
Long-running job| Per five minutes| 1000|
Long-running job| Per one month| 500,000 <sup>1</sup>|

<sup>1</sup>This limit is five times the Basic version's limit.

## Error code

When you reach the limit, you receive the HTTP status code **429 Too many requests**. The response includes a **Retry-After** value, which specifies the number of seconds your application should wait (or sleep) before it sends the next request.

If you send a request before the retry value elapses, your request isn't processed and a new retry value is returned. After the specified time elapses, you can make requests again to Azure Data Manager for Agriculture. Trying to establish a TCP connection or using different user authentication methods doesn't bypass these limits, because they're specific to each tenant.

## Frequently asked questions

### If I exhaust the allocated API quota entirely for write operations within a per-minute time window, can I successfully make requests for read operations within the same time window?

The quota limits are shared among the listed operation categories. Using the entire quota for write operations implies no remaining quota for other operations. This article details the specific quota units consumed for each operation.

### How can I calculate the total number of successful requests allowed for a particular time window?

The total allowed number of successful API requests depends on the version that you provisioned and the time window in which you make requests.

For instance, with the Standard version, you can make 25,000 (units reset after each time window) / 5 (unit cost for each request) = 5,000 write operation APIs within a one-minute time window. Or you can use a combination of 4,000 write operations and 5,000 read operations, which results in 4,000 * 5 + 5,000 * 1 = 25,000 total units of consumption.

Similarly, for the Basic version, you can perform 5,000,000 (units reset after each time window) / 1 (unit cost for each request) = 5,000,000 read operation APIs within a one-month time window.

### How many sensor events can a customer ingest as the maximum number?

The system allows a maximum of 100,000 event ingestions per hour. Although new events are continually accepted, there might be a delay in processing. The delay might mean that these events aren't immediately available for real-time egress scenarios alongside the ingestion.

## Next steps

- [Learn about the hierarchy model and how to create and organize your agriculture data](./concepts-hierarchy-model.md)
- [Test the Azure Data Manager for Agriculture REST APIs](/rest/api/data-manager-for-agri)
- [Learn about common API response headers](/rest/api/data-manager-for-agri/common-rest-response-headers)
