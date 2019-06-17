---
 title: include file
 description: include file
 services: log-analytics
 author: MGoedtel
 ms.service: log-analytics
 ms.topic: include
 ms.date: 06/10/2019
 ms.author: magoedte
 ms.custom: include file
---


The following limits apply to each Log Analytics workspace in the current consumption-based pricing tier introduced in April 2018:

|     | Per GB 2018 |
| --- | --- | 
| Data volume collected per day | None |
| Data retention period | 30 to 730 days<sup>1</sup> |

The following limits apply to each Log Analytics workspace the most recent legacy pricing tiers:

|  | Free | Standalone (Per GB) | Per Node (OMS) |
| --- | --- | --- | --- | --- | --- |--- |
| Data volume collected per day |500 MB<sup>2</sup> |None |None |
| Data retention period |7 days | 30 to 730 days<sup>1</sup> | 30 to 730 days<sup>1</sup> |

The following limits apply to each Log Analytics workspace the oldest legacy pricing tiers:

|  | Standard | Premium | 
| --- | --- | --- | --- | --- | --- |--- |
| Data volume collected per day | None | None | 
| Data retention period |30 days | 365 days |

<sup>1</sup>Data retention beyond 31 days is available for additional charges. Learn more about [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

<sup>2</sup>When your workspace reaches the 500-MB daily data transfer limit, data analysis stops and resumes at the start of the next day. A day is based on UTC.

>[!NOTE]
>Depending on how long you've been using Log Analytics, you might have access to legacy pricing tiers. Learn more about [Log Analytics legacy pricing tiers](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#legacy-pricing-tiers). 
>

The following limits apply to Azure Log Analytics resources (workspaces) per subscription.

| Pricing tier    | Number of workspaces per subscription | Comments
| --- | --- | --- |
| Free tier  | 10 | This limit can't be increased. |
| All tiers other than Free | N/A | You're limited by the number of resources within a resource group and the number of resource groups per subscription. | 

The following limits apply to the Log Analytics APIs:

| Category | Limits | Comments
| --- | --- | --- |
| Data Collector API | Maximum size for a single post is 30 MB.<br>Maximum size for field values is 32 KB. | Split larger volumes into multiple posts.<br>Fields longer than 32 KB are truncated. |
| Search API | 5,000 records returned for non-aggregated data.<br>500,000 records for aggregated data. | Aggregated data is a search that includes the `summarize` command.
 
