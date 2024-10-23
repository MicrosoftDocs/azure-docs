---
title: "include file" 
description: "include file" 
services: azure-monitor
author: rboucher
ms.topic: "include"
ms.date: 10/06/2024
ms.author: robb
ms.custom: "include file"
---


**Data collection volume and retention**

| Pricing tier | Limit per day | Data retention | Comment |
|:---|:---|:---|:---|
| [Pay-as-you-go](../articles/azure-monitor/logs/cost-logs.md#pricing-model)<br>(introduced April 2018) | No limit | Up to 730 days interactive retention/<br> up to 12 years [data archive](../articles/azure-monitor/logs/data-retention-configure.md) | Data retention beyond 31 days is available for extra charges. Learn more about [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor). |
| [Commitment tiers](../articles/azure-monitor/logs/cost-logs.md#commitment-tiers)<br>(introduced November 2019) | No limit | Up to 730 days interactive retention/<br> up to 12 years [data archive](../articles/azure-monitor/logs/data-retention-configure.md) | Data retention beyond 31 days is available for extra charges. Learn more about [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor). |
| [Legacy Per Node (OMS)](../articles/azure-monitor/logs/cost-logs.md#per-node-pricing-tier)<br>(introduced April 2016) | No limit | 30 to 730 days | Data retention beyond 31 days is available for extra charges. Learn more about [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor). Access to use tier is limited to subscriptions that contained a Log Analytics workspace or Application Insights resource on April 2, 2018, or are linked to an Enterprise Agreement that started before February 1, 2019 and is still active.  |
| [Legacy Standalone tier](../articles/azure-monitor/logs/cost-logs.md#standalone-pricing-tier)<br>(introduced April 2016) | No limit | 30 to 730 days | Data retention beyond 31 days is available for extra charges. Learn more about [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor). Access to use tier is limited to subscriptions that contained a Log Analytics workspace or Application Insights resource on April 2, 2018, or are linked to an Enterprise Agreement that started before February 1, 2019 and is still active.|
| [Legacy Free tier](../articles/azure-monitor/logs/cost-logs.md#free-trial-pricing-tier)<br>(introduced April 2016) | 500 MB | 7 days | When your workspace reaches the 500-MB-per-day limit, data ingestion stops and resumes at the start of the next day. A day is based on UTC. Data collected by Microsoft Defender for Cloud isn't included in this 500-MB-per-day limit and continues to be collected above this limit. Creating new workspaces in, or moving existing workspaces into, the legacy Free Trial pricing tier is possible only until July 1, 2022.  |
| [Legacy Standard tier](../articles/azure-monitor/logs/cost-logs.md#standard-and-premium-pricing-tiers) | No limit | 30 days  | Retention can't be adjusted. This tier hasn't been available to any new workspaces since October 1, 2016.|
| [Legacy Premium tier](../articles/azure-monitor/logs/cost-logs.md#standard-and-premium-pricing-tiers) | No limit | 365 days  | Retention can't be adjusted. This tier hasn't been available to any new workspaces since October 1, 2016.|

**Number of workspaces per subscription**

| Pricing tier    | Workspace limit | Comments
|:---|:---|:---|
| Legacy Free tier  | 10 | This limit can't be increased. Creating new workspaces in, or moving existing workspaces into, the legacy Free Trial pricing tier is possible only until July 1, 2022. |
| All other tiers | No limit | You're limited by the number of resources within a resource group and the number of resource groups per subscription. |

<a name="azure-portal"></a>

**Azure portal**

| Category | Limit | Comments |
|:---|:---|:---|
| Maximum records returned by a log query | 30,000 | Reduce results by using query scope, time range, and filters in the query. |

**Data Collector API**

| Category | Limit | Comments |
|:---|:---|:---|
| Maximum size for a single post | 30 MB | Split larger volumes into multiple posts. |
| Maximum size for field values  | 32 KB | Fields longer than 32 KB are truncated. |

<a name="la-query-api"></a>

**Query API**

| Category | Limit | Comments |
|:---|:---|:---|
| Maximum records returned in a single query | 500,000 | |
| Maximum size of data returned | ~104 MB (~100 MiB)|The API returns up to 64 MB of compressed data, which translates to up to 100 MB of raw data. |
| Maximum query running time | 10 minutes | See [Timeouts](../articles/azure-monitor/logs/api/timeouts.md) for details.|
| Maximum request rate | 200 requests per 30 seconds per Microsoft Entra user or client IP address | See [Log queries and language](../articles/azure-monitor/service-limits.md#log-queries-and-language).|

**Azure Monitor Logs connector**

| Category | Limit | Comments |
|:---|:---|:---|
| Maximum size of data | ~16.7 MB (~16 MiB) | The connector infrastructure dictates that limit is set lower than query API limit. |
| Maximum number of records | 500,000 | |
| Maximum connector timeout | 110 second | |
| Maximum query timeout | 100 second | |
| Charts | | The Logs page and the connector use different charting libraries for visualization. Some functionality isn't currently available in the connector. |

**Summary rules**

| Category | Limit |
|:---|:---|
| Maximum number of active rules in a workspace | 30 |
| Maximum number of results per bin | 500,000 |
| Maximum results set volume | 100 MB |
| Query time-out for bin processing | 10 minutes |

**General workspace limits**

| Category | Limit | Comments |
|:---|:---|:---|
| Maximum columns in a table         | 500 | **AzureDiagnostics** -- columns above the limit are added to the dynamic 'AdditionalFields' column <br> **Custom log created by Data collector API** -- columns above the limit are added to the dynamic 'AdditionalFields' column <br> **Custom log** -- contact support for more |
| Maximum number of custom log tables | 500 | Contact support for more |
| Maximum characters for column name | 45 | |

<b id="data-ingestion-volume-rate">Data ingestion volume rate</b>

Azure Monitor is a high-scale data service that serves thousands of customers sending Terabytes of data daily at a growing pace. To isolate and prevent interruptions in multitenancy service from sudden ingestion bursts, a default ingestion volume rate limit is placed in workspaces and set to 500 MB per minute compressed, which is translated to approximately **6 GB per minute uncompressed**. This limit applies to data ingested from Azure resources via [Diagnostic settings](../articles/azure-monitor/essentials/diagnostic-settings.md). The limit doesn't apply to data ingested from [agents](../articles/azure-monitor/agents/agents-overview.md), or Data Collection Rules.

When the ingested volume rate reaches 80% of the rate limit set in workspace, an event is sent to the `Operation` table in your workspace every 6 hours while the threshold is exceeded. When volume rate limit is reached, a retry mechanism attempts to ingest the data four times in a period of 12 hours and drop it if fails, an event is sent to the `Operation` table in your workspace every 6 hours while the threshold is exceeded. 

If your ingestion volume rate continues to exceed threshold or you're expecting to reach it sometime soon, **you can request to increase this limit by opening a support request**.

It's recommended to create an alert to get notified proactively when nearing or reaching ingestion limits. See [Monitor health of Log Analytics workspace in Azure Monitor](../articles/azure-monitor/logs/monitor-workspace.md).

>[!NOTE]
>Depending on how long you've been using Log Analytics, you might have access to legacy pricing tiers. Learn more about [Log Analytics legacy pricing tiers](../articles/azure-monitor/logs/cost-logs.md#legacy-pricing-tiers).
