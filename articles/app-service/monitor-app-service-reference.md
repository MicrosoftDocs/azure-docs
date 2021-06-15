---
title: Monitoring App Service data reference
description: Important reference material needed when you monitor App Service
author: msangapu-msft
ms.topic: reference
ms.author: msangapu
ms.service: App-Service
ms.custom: subject-monitoring
ms.date: 04/16/2021
---

# Monitoring App Service data reference

See [Monitoring App Service](monitor-app-service.md) for details on collecting and analyzing monitoring data for App Service.

## Metrics

This section lists all the automatically collected platform metrics collected for App Service.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| App Service Plans | [Microsoft.Web/serverfarms](/azure/azure-monitor/essentials/metrics-supported#microsoftwebserverfarms)
| Web apps | [Microsoft.Web/sites](/azure/azure-monitor/essentials/metrics-supported#microsoftwebsites) |
| Staging slots | [Microsoft.Web/sites/slots](/azure/azure-monitor/essentials/metrics-supported#microsoftwebsitesslots) 
| App Service Environment | [Microsoft.Web/hostingEnvironments](/azure/azure-monitor/essentials/metrics-supported#microsoftwebhostingenvironments)
| App Service Environment Front-end | [Microsoft.Web/hostingEnvironments/multiRolePools](/azure/azure-monitor/essentials/metrics-supported#microsoftwebhostingenvironmentsmultirolepools)


For more information, see a list of [all platform metrics supported in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/metrics-supported).


## Metric Dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](/azure/azure-monitor/platform/data-platform-metrics#multi-dimensional-metrics).

App Service does not have any metrics that contain dimensions.

## Resource logs
<!-- REQUIRED. Please  keep headings in this order -->

This section lists the types of resource logs you can collect for App Service. 

<!-- List all the resource log types you can have and what they are for -->  

For reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).

<!--  OPTION 2 -  Link to the resource logs as above, but work in extra information not found in the automated metric-supported reference article.  NOTE: YOU WILL NOW HAVE TO MANUALLY MAINTAIN THIS SECTION to make sure it stays in sync with the resource-log-categories link. You can group these sections however you want provided you include the proper links back to resource-log-categories article. 
-->

<!-- Example format. Add extra information -->

### Web Sites

Resource Provider and Type: [Microsoft.web/sites](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsites)

| Category | Display Name | *TODO replace this label with other information*  |
|:---------|:-------------|------------------|
| AppServiceAppLogs   | App Service Application Logs | *TODO other important information about this type* |
| AppServiceAuditLogs | Access Audit Logs            | *TODO other important information about this type* |
|  etc.               |                              |                                                   |  

### Web Site Slots

Resource Provider and Type: [Microsoft.web/sites/slots](/azure/azure-monitor/platform/resource-logs-categories#microsoftwebsitesslots)

| Category | Display Name | *TODO replace this label with other information*  |
|:---------|:-------------|------------------|
| AppServiceAppLogs   | App Service Application Logs | *TODO other important information about this type* |
| AppServiceAuditLogs | Access Audit Logs            | *TODO other important information about this type* |
|  etc.               |                              |                                                   |  


| App Service Environment | [Microsoft.Web/hostingEnvironments](/azure/azure-monitor/essentials/metrics-supported#microsoftwebhostingenvironments)


--------------**END Examples** -------------

## Azure Monitor Logs tables

Azure App Service uses Kusto tables from Azure Monitor Logs. You can query these tables with Log analytics. For a list of App Service tables used by Kusto, see the [Azure Monitor Logs table reference - App Service tables](https://docs.microsoft.com/azure/azure-monitor/reference/tables/tables-resourcetype#app-services). 

<!-- REQUIRED. Please keep heading in this order -->

This section refers to all of the Azure Monitor Logs Kusto tables relevant to App Service and available for query by Log Analytics. 

|Resource Type | Notes |
|-------|-----|
| [App services](/azure/azure-monitor/reference/tables/tables-resourcetype#app-services) | |

## Activity log
<!-- REQUIRED. Please keep heading in this order -->

The following table lists the operations related to App Service that may be created in the Activity log.

<!-- Fill in the table with the operations that can be created in the Activity log for the service. -->
| Operation | Description |
|:---|:---|
| | |
| | |

<!-- NOTE: This information may be hard to find or not listed anywhere.  Please ask your PM for at least an incomplete list of what type of messages could be written here. If you can't locate this, contact azmondocs@microsoft.com for help -->

For more information on the schema of Activity Log entries, see [Activity  Log schema](/azure/azure-monitor/essentials/activity-log-schema). 

## Schemas
<!-- REQUIRED. Please keep heading in this order -->

The following schemas are in use by App Service

<!-- List the schema and their usage. This can be for resource logs, alerts, event hub formats, etc depending on what you think is important. -->

## See Also

<!-- replace below with the proper link to your main monitoring service article -->
- See [Monitoring Azure App Service](monitor-service-name.md) for a description of monitoring Azure App Service.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/insights/monitor-azure-resources) for details on monitoring Azure resources.