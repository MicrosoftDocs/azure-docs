---
 title: include file
 description: include file
 services: scheduler
 ms.service: scheduler
 author: derek1ee
 ms.topic: include
 ms.date: 08/16/2016
 ms.author: deli
 ms.custom: include file
---

The following table describes each of the major quotas, limits, defaults, and throttles in Azure Scheduler.

| Resource | Limit description |
| -------- | ----------------- |
| **Job size** | The maximum job size is 16,000. If a PUT or a PATCH operation results in a job size larger than this limit, a 400 Bad Request status code is returned. | 
| **Job collections** | The maximum number of job collections per Azure subscription is 200,000. | 
| **Jobs per collection** | By default, the maximum number of jobs is five jobs in a free job collection and 50 jobs in a standard job collection. You can change the maximum number of jobs on a job collection. All jobs in a job collection are limited to the value set on the job collection. If you attempt to create more jobs than the maximum jobs quota, the request fails with a 409 Conflict status code. | 
| **Time to start time** | The maximum "time to start time" is 18 months. |
| **Recurrence span** | The maximum recurrence span is 18 months. | 
| **Frequency** | By default, the maximum frequency quota is one hour in a free job collection and one minute in a standard job collection. <p>You can make the maximum frequency on a job collection lower than the maximum. All jobs in the job collection are limited to the value set on the job collection. If you attempt to create a job with a higher frequency than the maximum frequency on the job collection, the request fails with a 409 Conflict status code. | 
| **Body size** | The maximum body size for a request is 8,192 chars. |
| **Request URL size** | The maximum size for a request URL is 2,048 chars. |
| **Header count** | The maximum header count is 50 headers. | 
| **Aggregate header size** | The maximum aggregate header size is 4,096 chars. |
| **Timeout** | The request timeout is static, that is, not configurable. and is 60 seconds for HTTP actions. For longer running operations, follow the HTTP asynchronous protocols. For example, return a 202 immediately but continue working in the background. | 
| **Job history** | The maximum response body stored in job history is 2,048 bytes. |
| **Job history retention** | Job history is kept for up to two months or up to the last 1,000 executions. | 
| **Completed and faulted job retention** | Completed and faulted jobs are kept for 60 days. |
||| 

