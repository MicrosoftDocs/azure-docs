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

This section lists the types of resource logs you can collect for App Service. 

| Log type | Windows | Windows Container | Linux | Linux Container | Description |
|-|-|-|-|-|-|
| AppServiceConsoleLogs | Java SE & Tomcat | Yes | Yes | Yes | Standard output and standard error |
| AppServiceHTTPLogs | Yes | Yes | Yes | Yes | Web server logs |
| AppServiceEnvironmentPlatformLogs | Yes | N/A | Yes | Yes | App Service Environment: scaling, configuration changes, and status logs|
| AppServiceAuditLogs | Yes | Yes | Yes | Yes | Login activity via FTP and Kudu |
| AppServiceFileAuditLogs | Yes | Yes | TBA | TBA | File changes made to the site content; **only available for Premium tier and above** |
| AppServiceAppLogs | ASP .NET | ASP .NET | Java SE & Tomcat Blessed Images <sup>1</sup> | Java SE & Tomcat Blessed Images <sup>1</sup> | Application logs |
| AppServiceIPSecAuditLogs  | Yes | Yes | Yes | Yes | Requests from IP Rules |
| AppServicePlatformLogs  | TBA | Yes | Yes | Yes | Container operation logs |
| AppServiceAntivirusScanAuditLogs | Yes | Yes | Yes | Yes | [Anti-virus scan logs](https://azure.github.io/AppService/2020/12/09/AzMon-AppServiceAntivirusScanAuditLogs.html) using Microsoft Defender; **only available for Premium tier** | 

<sup>1</sup> For Java SE apps, add "$WEBSITE_AZMON_PREVIEW_ENABLED" to the app settings and set it to 1 or to true.

For reference, see a list of [all resource logs category types supported in Azure Monitor](/azure/azure-monitor/platform/resource-logs-schema).

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

This section refers to all of the Azure Monitor Logs Kusto tables relevant to App Service and available for query by Log Analytics. 

|Resource Type | Notes |
|-------|-----|
| [App services](/azure/azure-monitor/reference/tables/tables-resourcetype#app-services) | |

## Activity log
<!-- REQUIRED. Please keep heading in this order -->

The following table lists the operations related to App Service that may be created in the Activity log.

| Operation | Description |
|:---|:---|
|'Create or Update Web App'| App was created or updated|
|'Delete Web App'| App was deleted |
|'Create Web App Backup'| Backup of app|
|'Get Web App Publishing Profile'| Download of publishing profile |
|'Publish Web App'| |
|'Restart Web App'| |
|'Start Web App'| |
|'Stop Web App'| |
|'Swap Web App Slots'| |
|'Get Web App Slots Differences'| |
|'Apply Web App Configuration'| |
|'Reset Web App Configuration'| |
|'Approve Private Endpoint Connections '| |
|'Functions Web Apps '| |
|'List Web Apps Sync Function Trigger Status'| |
|'Network Trace Web Apps'| |
|'Newpassword Web Apps'| |
|'Sync Web Apps'| |
|'Migrate MySql Web Apps'| |
|'Recover Web Apps'| |
|'Restore Web Apps Snapshots'| |
|'Restore Web Apps From Deleted App'| |
|'Sync Web Apps Function Triggers'| |
|'Discovers an existing app backup'| |
|'Get Zipped Container Logs for Web App'| |
|'Restore Web App From Backup Blob'| |

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