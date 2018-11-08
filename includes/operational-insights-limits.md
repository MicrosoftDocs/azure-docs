---
 title: include file
 description: include file
 services: log-analytics
 author: MGoedtel
 ms.service: log-analytics
 ms.topic: include
 ms.date: 05/16/2018
 ms.author: magoedte
 ms.custom: include file
---

The following limits apply to Log Analytics resources per subscription:

| Resource | Default Limit | Comments
| --- | --- | --- |
| Number of free workspaces per subscription | 10 | This limit cannot be increased. |
| Number of paid workspaces per subscription | N/A | You are limited by the number of resources within a resource group and number of resource groups per subscription | 

>[!NOTE]
>As of April 2, 2018, new workspaces in a new subscription will automatically use the *Per GB* pricing plan.  For existing subscriptions created before April 2, or a subscription that was tied to an existing EA enrollment, you can continue choosing between the three pricing tiers for new workspaces. 
>

The following limits apply to each Log Analytics workspace:

|  | Free | Standard | Premium | Standalone | OMS | Per GB |
| --- | --- | --- | --- | --- | --- |--- |
| Data volume collected per day |500 MB<sup>1</sup> |None |None | None | None | None
| Data retention period |7 days |1 month |12 months | 1 month<sup>2</sup> | 1 month <sup>2</sup>| 1 month <sup>2</sup>|

<sup>1</sup> When customers reach their 500 MB daily data transfer limit, data analysis stops and resumes at the start of the next day. A day is based on UTC.

<sup>2</sup> The data retention period for the Standalone, OMS, and Per GB pricing plans can be increased to 730 days.

| Category | Limits | Comments
| --- | --- | --- |
| Data Collector API | Maximum size for a single post is 30 MB<br>Maximum size for field values is 32 KB | Split larger volumes into multiple posts<br>Fields longer than 32 KB are truncated. |
| Search API | 5000 records returned for non-aggregated data<br>500000 records for aggregated data | Aggregated data is a search that includes the `summarize` command
 
