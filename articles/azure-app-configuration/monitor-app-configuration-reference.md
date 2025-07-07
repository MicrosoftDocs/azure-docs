---
title: Monitoring Azure App Configuration data reference
description: Important Reference material needed when you monitor App Configuration
services: azure-app-configuration
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 05/05/2021
ms.custom: horz-monitor
---


# Monitoring App Configuration data reference

This article is a reference for the monitoring data collected by App Configuration. See [Monitoring App Configuration](monitor-app-configuration.md) for how to collect and analyze monitoring data for App Configuration.

## Metrics 
Resource Provider and Type: [App Configuration Platform Metrics](/azure/azure-monitor/essentials/metrics-supported#microsoftappconfigurationconfigurationstores)

| Metric | Unit | Description |
|-------|-----| ----- |
| HTTP Incoming Request Count	| Count	| Total number of incoming HTTP Request |
| HTTP Incoming Request Duration | Milliseconds | Server side duration of an HTTP Request |
| Throttled HTTP Request Count | Count |	Throttled requests are HTTP requests that receive a response with a status code of 429 |
| Daily Storage Usage | Percent |	Represents the amount of storage in use as a percentage of the maximum allowance. This metric is updated at least once daily. |
| Request Quota Usage | Percent |	Represents the current total request usage in percentage. |
| Replication Latency | Milliseconds |	Represents the average time it takes for a replica to be consistent with current state. |
| Snapshot Storage Size | Count | Represents the total storage usage of configuration snapshot(s) in bytes. |

For more information, see a list of [all platform metrics supported in Azure Monitor](/azure/azure-monitor/essentials/metrics-supported).


## Metric Dimensions
App Configuration has the following dimensions associated with its metrics.

| Metric Name | Dimension description |
|-------|-----|
| HTTP Incoming Request Count | The supported dimensions are the **HttpStatusCode**, **AuthenticationScheme**, and **Endpoint** of each request. **AuthenticationScheme** can be filtered by "AAD" or "HMAC" authentication.   |
| HTTP Incoming Request Duration | The supported dimensions are the **HttpStatusCode**, **AuthenticationScheme**, and **Endpoint** of each request. **AuthenticationScheme** can be filtered by "AAD" or "HMAC" authentication. |
| Throttled HTTP Request Count | The **Endpoint** of each request is included as a dimension.  |
| Daily Storage Usage | This metric does not have any dimensions.  |
| Request Quota Usage | The supported dimensions are the **OperationType** ("Read"or "Write") and **Endpoint** of each request.  |
| Replication Latency | The **Endpoint** of the replica that data was replicated to is included as a dimension.  |
| Snapshot Storage Size | This metric does not have any dimensions.  |

 For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/essentials/data-platform-metrics#multi-dimensional-metrics).

## Resource logs
This section lists the category types of resource log collected for App Configuration. 

| Resource log type | Further information|
|-------|-----|
| HttpRequest | [App Configuration Resource Log Category Information](/azure/azure-monitor/essentials/resource-logs-categories) |

For more information, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/essentials/resource-logs-schema).
 
## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs Kusto tables relevant to App Configuration and available for query by Log Analytics.

|Resource type | Notes |
|-------|-----|
| [AACAudit](/azure/azure-monitor/reference/tables/AACAudit) | Azure App Configuration audit logs. |
| [AACHttpRequest](/azure/azure-monitor/reference/tables/AACHttpRequest) | Entries of every HTTP request sent to a selected app configuration resource. |
| [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity) | Entries from the Azure Activity log that provide insight into any subscription-level or management group level events that have occurred in Azure. |

For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](/azure/azure-monitor/reference/tables/microsoft-appconfiguration_configurationstores).

### Diagnostics tables

App Configuration uses the [AACHttpRequest Table](/azure/azure-monitor/reference/tables/aachttprequest) to store resource log information.

**HTTP Requests**

|Property | Type | Description |
|-------|-----| ----- |
|Category	|string	|The log category of the event, always HttpRequest. 
|ClientIPAddress |	string|	IP Address of the client that sent the request.
|ClientRequestId|	string|	Request ID provided by client.
|CorrelationId|	string|	An ID provided by the client to correlate multiple requests.
|DurationMs|	int	|The duration of the operation in milliseconds.
|HitCount|	int	|The number of requests that the record is associated with.
|Method	string|	HTTP| HTTP request method (get or post)
|RequestId|	string|	Unique request ID generated by server.
|RequestLength|	int	|Length in bytes of the HTTP request.
|RequestURI|	string|	URI of the request, can include key and label name. 
|_ResourceId|	string|	A unique identifier for the resource that the record is associated with
|ResponseLength|	int|	Length in bytes of the HTTP response.
|SourceSystem| string|	
|StatusCode|	int	|HTTP Status Code of the request.
|TenantId|	string	|WorkspaceId of the request. 
|TimeGenerated|	datetime|	Timestamp (UTC) when log was generated because a request was sent
|Type	|string|	The name of the table
|UserAgent|	string|	User Agent provided by the client.


## See Also

* See [Monitoring Azure App Configuration](monitor-app-configuration.md) for a description of monitoring Azure App Configuration.
* See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
