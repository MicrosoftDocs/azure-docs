---
title: Audit queries in Azure Monitor Logs
description: 
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/29/2020

---

# Audit queries in Azure Monitor Logs
This feature introduces the ability to audit Azure Monitor Logs queries. When enabled through the Azure Diagnostics mechanism, you will be able to collect telemetry about who ran a query, when the query was run, what tool was used to run the query, the query text, and performance stats around the query execution. This telemetry, as with any other Azure Diagnostics-based telemetry, can be sent to an Azure Storage Blob, Azure Event Hub, or into Azure Monitor Logs.

| Field | Description |
|:---|:---|
| TimeGenerated | UTC time when query was submitted. |
| CorrelationId | A unique ID to identify the query. Can be used in troubleshooting scenarios when contacting Microsoft. |
| AADObjectId |  |
| AADTenantId  |  |
| AADEmail |  |
| AADClientId | The ID and resolved name of the application that was used to invoke the query. |
| RequestClientApp |  |
| QueryTimeRangeStart | The start and end time specified for the query. These correlate to the time picker when using Azure Monitor UI, or explicit headers passed in when the query is sent via the API. Not populated in certain scenarios, such as when the user uses the Log Analytics UI, and specifies the time range inside the query rather than using the time picker. |
| QueryTimeRangeEnd |  |
| QueryText | The actual text of the query, as submitted. |
| RequestTarget | The API URL that was used to submit the query.  |
| RequestContext | The full list of resources that the user submitting the query requested to run the query against. A dynamic property containing (up to) three arrays of string: workspaces, applications, and resources. Subscription or resource group-targeted queries will show up under “resources”. Includes the target implied by RequestTarget. |
| RequestContextFilters | A set of filters specified as part of the query invocation. Contains up to three possible arrays of string within it: ResourceTypes (the type of resource to limit this query to), Workspaces (the list of workspaces to limit this query to), and WorkspaceRegions (the list of workspace regions to limit this query to). |
| ResponseCode | The HTTP response code returned upon submission. |
| ResponseDurationMs | The time it took for the response to be returned.  |
| StatsCPUTimeMs | A series of stats that profile the resource utilization of the query. Correspond to the stats found in the Log Analytics UI. Will only be populated if query returns 200 (ie, no problems). |
| StatsDataProcessedKB |  |
| StatsDataProcessedStart |  |
| StatsDataProcessedEnd  |  |
| StatsWorkspaceCount |  |
| StatsRegionCount |  |

-	Azure Alert traffic: while the initial authoring of an alert will be captured in these logs, once the alert is saved and enabled, the regular polling queries issued by Azure Alerts will not
-	On initial release, only workspace-centric queries will be logged. Queries run in resource-centric mode or queries run against an Application Insights resource running in APM 2.1 mode will be enabled for logging soon after the initial release, tentatively expected for late August. The docs will be updated as soon as that happens.
