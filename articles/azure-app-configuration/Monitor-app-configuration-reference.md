---
title: Monitoring Azure App Configuration data reference  
description: Important reference material needed when you monitor App Configuration 
author: AlexandraKemperMS
ms.author: alkemper
ms.service: azure-app-configuration
ms.custom: subject-monitoring
ms.date: 05/01/2021
---

# Monitoring App Configuration data reference
See [Monitoring App Configuration](monitor-app-configuration.md) for details on collecting and analyzing monitoring data for App Configuration.

## Metrics 
Resource Provider and Type: [App Configuration Platform Metrics](/azure/azure-monitor/essentials/metrics-supported#microsoftappconfigurationconfigurationstores)

| Metric | Unit| Description |
|--- | ----| ------|      
| Http Incoming Request Count | Count | Total number of incoming http requests.|  
| Http Incoming Request Duration | Count |Latency of an Http Request|  
| Throttled Http Request Count |Count| Throttled requests are Http Requests that return a 429 Status Code (too many requests)| 
 

For more information, see a list of [all platform metrics supported in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported).


## Metric Dimensions
App Configuration does not have any metrics that contain dimensions, they are all counts of Http Requests. For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

## Resource logs
This section lists the category types of resource log collected for App Configuration. 

| Resource Log Type | Further Information|
|-------|-----|
| HttpRequest | [App Configuration Resource Log Category Information](/azure/azure-monitor/platform/resource-logs-categories) |

For more information, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).
 
## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs Kusto tables relevant to App Configuration and available for query by Log Analytics.

|Resource Type | Notes |
|-------|-----|
| [AACHttpRequest](azure/azure-monitor/reference/tables/aachttprequest) | Entries of every Http request sent to a selected app configuration resource. |
| [AzureActivity](/azure/azure-monitor/reference/tables/tables-resourcetype#virtual-machine-scale-sets) | Entries from the Azure Activity log that provide insight into any subscription-level or management group level events that have occurred in Azure. |

For a reference of all Azure Monitor Logs / Log Analytics tables, see the [Azure Monitor Log Table Reference](/azure/azure-monitor/reference/tables/tables-resourcetype).

### Diagnostics tables
<!-- REQUIRED. Please keep heading in this order -->
<!-- If your service uses the AzureDiagnostics table in Azure Monitor Logs / Log Analytics, list what fields you use and what they are for. Azure Diagnostics is over 500 columns wide with all services using the fields that are consistent across Azure Monitor and then adding extra ones just for themselves.  If it uses service specific diagnostic table, refers to that table. If it uses both, put both types of information in. Most services in the future will have their own specific table. If you have questions, contact azmondocs@microsoft.com -->

App Configuration uses the [Azure Diagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table and the [TODO whatever additional] table to store resource log information. The following columns are relevant.
**Azure Diagnostics**
| Property | Description |
|:--- |:---|
|  |  |
|  |  |
**Http Requests**
| Property | Description |
|:--- |:---|
|  |  |
|  |  |

## Activity log

The following table lists the operations related to App Configuration that may be created in the Activity log.
| Operation | Description |
|:---|:---|
| List a key/all keys| |
| List a feature flag/ all feature flags| |
|Create a key/feature flag ||

For more information on the schema of Activity Log entries, see [Activity  Log schema](/azure/azure-monitor/essentials/activity-log-schema). 

## Schemas
The following schemas are in use by App Configuration
<!-- List the schema and their usage. This can be for resource logs, alerts, event hub formats, etc depending on what you think is important. -->

## See Also

- See [Monitoring Azure App Configuration](monitor-app-configuration-name.md) for a description of monitoring Azure App Configuration.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.

