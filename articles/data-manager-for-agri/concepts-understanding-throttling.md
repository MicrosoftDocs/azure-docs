---
title: APIs throttling guidance for customers using Azure Data Manager for Agriculture.
description: Provides information on APIs throttling limits to plan usage. 
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 04/18/2023
ms.custom: template-concept
---

# APIs throttling guidance for Azure Data Manager for Agriculture.

The APIs throttling in Azure Data Manager for Agriculture allows more consistent performance within a time span for customers calling our service APIs. Throttling limits, the number of requests to our service in a time span to prevent overuse of resources. Azure Data Manager for Agriculture is designed to handle a high volume of requests, if an overwhelming number of requests occur by few customers, throttling helps maintain optimal performance and reliability for all customers.

Throttling limits vary based on product type and capabilities being used. Currently we have two versions, standard and basic (for your POC needs).

## Data Plane Service API limits 

Throttling category |	Units available per Standard version|	Units available per Basic version |
|:------|:------|:------|
Per Minute	| 25,000 |	25,000 |
Per 5 Minutes|	100,000|	100,000 |
Per Month|	25,000,000|	5,000,000|

### Maximum requests allowed per type for standard version
API Type|	Per minute|	Per 5 minutes|	Per month|
|:------|:------|:------|:------|
PUT	|5,000	|20,000	|5,000,000
PATCH	|5,000	|20,000	|5,000,000
POST	|5,000	|20,000	|5,000,000
DELETE	|5,000	|20,000	|5,000,000
GET (single object)	|25,000	|100,000	|25,000,000
LIST with paginated response	|25,000 results	|100,000 results	|25,000,000 results

### Maximum requests allowed per type for basic version
API Type|	Per minute|	Per 5 minutes|	Per month|
|:------|:------|:------|:------|
PUT	|5,000	|20,000	|1,000,000
PATCH	|5,000	|20,000	|1,000,000
POST	|5,000	|20,000	|1,000,000
DELETE	|5,000	|20,000	|1,000,000
GET (single object)	|25,000	|100,000	|5,000,000
LIST with paginated response	|25,000 results	|100,000 results	|5,000,000 results

### Throttling cost by API type
API Type|	Cost per request| 
|:------|:------:|
PUT	|5
PATCH	|5
POST	|5
DELETE	|5
GET (single object)	|1
GET Sensor Events	|1 + 0.01 per result
LIST with paginated response	|1 per request + 1 per result

## Jobs create limits per instance of our service
The maximum queue size for each job type is 10,000.

### Total units available
Throttling category|	Units available per Standard version|	Units available per Basic version|
|:------|:------|:------|
Per 5 Minutes	|1,000	|1,000
Per Month	|500,000	|100,000


### Maximum create job requests allowed for standard version
Job Type|	Per 5 mins|	Per month|
|:------|:------|:------|
Cascade delete|	500|	250,000
Satellite|	1,000|	500,000
Model inference|	200|	100,000
Farm Operation|	200|	100,000
Rasterize|	500|	250,000
Weather|	1,000|	250,000


### Maximum create job requests allowed for basic version
Job Type|	Per 5 mins|	Per month
|:------|:------|:------|
Cascade delete|	500|	50,000
Satellite|	1,000|	100,000
Model inference|	200|	20,000
Farm Operation|	200|	20,000
Rasterize|	500|	50,000
Weather|	1000|	100,000

### Sensor events limits
100,000 event ingestion per hour by our sensor job.

## Error code
When you reach the limit, you receive the HTTP status code **429 Too many requests**. The response includes a **Retry-After** value, which specifies the number of seconds your application should wait (or sleep) before sending the next request. If you send a request before the retry value has elapsed, your request isn't processed and a new retry value is returned.

After waiting for specified time, you can also close and reopen your connection to Azure Data Manager for Agriculture. 

## Next steps
* See the Hierarchy Model and learn how to create and organize your agriculture data  [here](./concepts-hierarchy-model.md).
* Understand our APIs [here](/rest/api/data-manager-for-agri).
