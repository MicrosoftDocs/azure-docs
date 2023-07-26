---
title: Storage Task monitoring data reference
titleSuffix: Azure Storage
description: Important reference material needed when you monitor Azure Storage Tasks 
author: normesta

ms.service: storage-tasks
ms.custom: horz-monitor
ms.topic: reference
ms.date: 05/16/2023
ms.author: normesta
---

# Azure Storage Task monitoring data reference

See [Monitoring Azure Storage Tasks](monitor-service.md) for details on collecting and analyzing monitoring data for Azure Storage Tasks.

## Metrics

This section lists all the automatically collected platform metrics collected for Azure Storage Tasks.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Virtual Machine | [Microsoft.Compute/virtualMachine](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachines) |
| Virtual machine scale set | [Microsoft.Compute/virtualMachinescaleset](/azure/azure-monitor/platform/metrics-supported#microsoftcomputevirtualmachinescaleset) 

## Metric Dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

<!-- If storage tasks have no dimensions, then say "Azure Storage Tasks does not have any metrics that contain dimensions." -->

Azure Storage Tasks support the following dimensions for metrics in Azure Monitor.

| Dimension Name | Description |
| ------------------- | ----------------- |
| **Dimenension name** | Description|
| **Dimenension name** | Description|

## Resource logs

This section lists the types of resource logs you can collect for Azure Storage Tasks.

<!-- List all the resource log types you can have and what they are for -->  

For reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).

This section lists all the resource log category types collected for Azure Storage Tasks.  

|Resource Log Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Web Sites | [Microsoft.web/sites](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsites) |
| Web Site Slots | [Microsoft.web/sites/slots](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsitesslots) 

## Azure Monitor Logs tables

This section refers to all of the Azure Monitor Logs Kusto tables relevant to Azure Storage Tasks and available for query by Log Analytics.

<!--  Link to relevant bookmark in https://learn.microsoft.com/azure/azure-monitor/reference/tables/tables-resourcetype where your service tables are listed. These files are auto generated from the REST API.   If this article is missing tables that you and the PM know are available, both of you contact azmondocs@microsoft.com.  
-->

### Diagnostics tables
<!-- REQUIRED. Please keep heading in this order -->
<!-- If your service uses the AzureDiagnostics table in Azure Monitor Logs / Log Analytics, list what fields you use and what they are for. Azure Diagnostics is over 500 columns wide with all services using the fields that are consistent across Azure Monitor and then adding extra ones just for themselves.  If it uses service specific diagnostic table, refers to that table. If it uses both, put both types of information in. Most services in the future will have their own specific table. If you have questions, contact azmondocs@microsoft.com -->

Azure Storage Tasks uses the [Azure Diagnostics](/azure/azure-monitor/reference/tables/azurediagnostics) table and the [TODO whatever additional] table to store resource log information. The following columns are relevant.

**Azure Diagnostics**

| Property | Description |
|:--- |:---|
|  |  |
|  |  |

**[TODO Service-specific table]**

| Property | Description |
|:--- |:---|
|  |  |
|  |  |

## Activity log

The following table lists the operations that Azure Storage Tasks may record in the Activity log. This is a subset of the possible entries your might find in the activity log.

<!-- Fill in the table with the operations that can be created in the Activity log for the service by gathering the links for your namespaces or otherwise explaning what's available. For example, see the bookmark https://learn.microsoft.com/azure/role-based-access-control/resource-provider-operations#microsoftbatch -->
| Namespace | Description |
|:---|:---|
| | |
| | |

<!-- NOTE: Any additional operations may be hard to find or not listed anywhere.  Please ask your PM for at least any additional list of what messages could be written to the activity log. You can contact azmondocs@microsoft.com for help if needed. -->

See [all the possible resource provider operations in the activity log](/azure/role-based-access-control/resource-provider-operations).  

For more information on the schema of Activity Log entries, see [Activity  Log schema](/azure/azure-monitor/essentials/activity-log-schema).

## Schemas

The following schemas are in use by Azure Storage Tasks

<!-- List the schema and their usage. This can be for resource logs, alerts, event hub formats, etc depending on what you think is important. JSON messages, API responses not listed in the REST API docs and other similar types of info can be put here.  -->

## See Also

<!-- replace below with the proper link to your main monitoring service article -->
- See [Monitoring Azure Azure Storage Tasks](monitor-service-name.md) for a description of monitoring Azure Azure Storage Tasks.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.