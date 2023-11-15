---
title: APIs throttling guidance for customers using Azure Data Manager for Agriculture.
description: Provides information on APIs throttling limits to plan usage.
author: BlackRider97
ms.author: ramithar
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 11/15/2023
ms.custom: template-concept
---
# APIs throttling guidance for Azure Data Manager for Agriculture.
The REST APIs throttling in Azure Data Manager for Agriculture allows more consistent performance within a time span for customers calling our service APIs. 

- Throttling limits, the number of requests to our service in a time span to prevent overuse of resources.
- Azure Data Manager for Agriculture is designed to handle a high volume of requests, if an overwhelming number of requests occur by few customers, throttling helps maintain optimal performance and reliability for all customers.
- Throttling limits are contingent on selected version and the specific capabilities of the product being used. Now, we support two distinct versions: **Standard** (recommended) and **Basic** (suitable for prototyping requirements). These limits operate within three different time windows (per 1 minute, per 5 minutes, and per one month) to safeguard against sudden surges in traffic.

This article shows you how to track the number of requests that remain before reaching the limit, and how to respond when you reach the limit. These [APIs](/rest/api/data-manager-for-agri/#data-plane-rest-apis), falling under the purview of the throttling limits.
 
##  Classification of APIs
We categorize all our APIs into three main parts for better understanding:
- **Write operations** - Comprising APIs utilizing REST API methods like `PATCH`, `POST`, and `DELETE` for altering data.
- **Read operations** - Encompassing APIs that use REST API method type `GET` to retrieve data including search APIs of method type `POST`.
- **Long running job operations** - Involving Long running asynchronous job APIs using the REST API method type `PUT`.

The overall available quota units as explained in the following table, are shared among these categories. For instance, using up the entire quota on write operations means no remaining quota for other operations. Each operation consumes a specific unit of quota, detailed in the table, helping tracking the remaining quota for further use.

Operation | Units cost for each request|
----------| -------------------------- |
Write   | 5 |
Read|   1 <sup>1</sup>|
Long running job [Solution inference](/rest/api/data-manager-for-agri/#solution-and-model-inferences) | 5 |
Long running job [Farm operation](/rest/api/data-manager-for-agri/#farm-operation-job) | 5 |
Long running job [Image rasterize](/rest/api/data-manager-for-agri/#image-rasterize-job) | 2 |
Long running job (Cascade delete of an entity) | 2 |
Long running job [Weather ingestion](/rest/api/data-manager-for-agri/#weather) | 1 |
Long running job [Satellite ingestion](/rest/api/data-manager-for-agri/#satellite-data-ingestion-job) | 1 |

<sup>1</sup>An extra unit cost is taken into account for each item returned in the response when more than one item is being retrieved.
 
## Basic version API limits
 
### Total available units
Operation | Throttling time window | Units reset after each time window.|
----------| -------------------------- | ------------------------------ |
Write/Read| per 1 Minute    | 25,000 |
Write/Read| per 5 Minutes|  100,000|
Write/Read| per one Month|  5,000,000 |
Long running job| per 5 Minutes|    1000|
Long running job| per one Month| 100,000 |

## Standard version API limits
Standard version offers a five times increase in API quota per month compared to the Basic version, while all other quota limits remain unchanged.

### Total available units
Operation | Throttling time window | Units reset after each time window.|
----------| -------------------------- | ------------------------------ |
Write/Read| per 1 Minute    | 25,000 |
Write/Read| per 5 Minutes|  100,000|
Write/Read| per one Month|  25,000,000 <sup>1</sup>
Long running job| per 5 Minutes|    1000|
Long running job| per one Month| 500,000 <sup>2</sup>|

<sup>1</sup>This limit is five times the Basic version limit.

<sup>2</sup>This limit is five times the Basic version limit.
 
## Error code
When you reach the limit, you receive the HTTP status code **429 Too many requests**. The response includes a **Retry-After** value, which specifies the number of seconds your application should wait (or sleep) before sending the next request. If you send a request before the retry value elapses, your request isn't processed and a new retry value is returned.
After the specified time elapses, you can make requests again to the Azure Data Manager for Agriculture. Attempting to establish a TCP connection or using different user authentication methods doesn't bypass these limits, as they're specific to each tenant.

## Frequently Asked Questions (FAQs)

### 1. If I exhaust the allocated API quota entirely for write operations within a per-minute time window, can I successfully make requests for read operations within the same time window?
The quota limits are shared among the listed operation categories. Using the entire quota for write operations implies no remaining quota for other operations. The specific quota units consumed for each operation are detailed in this article.

### 2. How can I calculate the total number of successful requests allowed for a particular time window?
The total allowed number of successful API requests depends on the specific version provisioned and the time window in which requests are made. For instance, with the Standard version, you can make 25,000 (Units reset after each time window) / 5 (Units cost for each request) = 5,000 write operation APIs within a 1-minute time window. Similarly, for the Basic version, you can perform 5,000,000 (Units reset after each time window) / 1 (Units cost for each request) = 5,000,000 read operation APIs within a one month time window.

### 3. How many sensor events can a customer ingest as the maximum number?
The system allows a maximum limit of 100,000 event ingestions per hour. While new events are continually accepted, there might be a delay in processing, resulting in these events not being immediately available for real-time egress scenarios alongside the ingestion.
 
## Next steps
* See the Hierarchy Model and learn how to create and organize your agriculture data  [here](./concepts-hierarchy-model.md).
* Understand our APIs [here](/rest/api/data-manager-for-agri).
* Also look at common API [response headers](/rest/api/data-manager-for-agri/common-rest-response-headers).
