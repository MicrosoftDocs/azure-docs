---
title: Monitoring App Service data reference
description: Important reference material needed when you monitor App Service
author: msangapu-msft
ms.topic: reference
ms.author: msangapu
ms.service: app-service
ms.custom: subject-monitoring
ms.date: 06/29/2023
---

# Monitoring App Service data reference

This reference applies to the use of Azure Monitor for monitoring App Service. See [Monitoring App Service](monitor-app-service.md) for details on collecting and analyzing monitoring data for App Service.

## Metrics

This section lists all the automatically collected platform metrics collected for App Service.  

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| App Service Plans | [Microsoft.Web/serverfarms](../azure-monitor/essentials/metrics-supported.md#microsoftwebserverfarms)
| Web apps | [Microsoft.Web/sites](../azure-monitor/essentials/metrics-supported.md#microsoftwebsites) |
| Staging slots | [Microsoft.Web/sites/slots](../azure-monitor/essentials/metrics-supported.md#microsoftwebsitesslots) 
| App Service Environment | [Microsoft.Web/hostingEnvironments](../azure-monitor/essentials/metrics-supported.md#microsoftwebhostingenvironments)
| App Service Environment Front-end | [Microsoft.Web/hostingEnvironments/multiRolePools](../azure-monitor/essentials/metrics-supported.md#microsoftwebhostingenvironmentsmultirolepools)


For more information, see a list of [all platform metrics supported in Azure Monitor](../azure-monitor/essentials/metrics-supported.md).


## Metric Dimensions

For more information on what metric dimensions are, see [Multi-dimensional metrics](../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics).

App Service doesn't have any metrics that contain dimensions.

## Resource logs

This section lists the types of resource logs you can collect for App Service. 

| Log type | Windows | Windows Container | Linux | Linux Container | Description |
|-|-|-|-|-|-|
| AppServiceConsoleLogs | Java SE & Tomcat | Yes | Yes | Yes | Standard output and standard error |
| AppServiceHTTPLogs | Yes | Yes | Yes | Yes | Web server logs |
| AppServiceEnvironmentPlatformLogs | Yes | N/A | Yes | Yes | App Service Environment: scaling, configuration changes, and status logs|
| AppServiceAuditLogs | Yes | Yes | Yes | Yes | Login activity via FTP and Kudu |
| AppServiceFileAuditLogs | Yes | Yes | TBA | TBA | File changes made to the site content; **only available for Premium tier and above** |
| AppServiceAppLogs | ASP.NET | ASP.NET | Java SE & Tomcat Images <sup>1</sup> | Java SE & Tomcat Blessed Images <sup>1</sup> | Application logs |
| AppServiceIPSecAuditLogs  | Yes | Yes | Yes | Yes | Requests from IP Rules |
| AppServicePlatformLogs  | TBA | Yes | Yes | Yes | Container operation logs |
| AppServiceAntivirusScanAuditLogs | Yes | Yes | Yes | Yes | [Anti-virus scan logs](https://azure.github.io/AppService/2020/12/09/AzMon-AppServiceAntivirusScanAuditLogs.html) using Microsoft Defender for Cloud; **only available for Premium tier** | 

<sup>1</sup> For Java SE apps, add "$WEBSITE_AZMON_PREVIEW_ENABLED" to the app settings and set it to 1 or to true.

For reference, see a list of [all resource logs category types supported in Azure Monitor](../azure-monitor/essentials/resource-logs-schema.md).

## Azure Monitor Logs tables

Azure App Service uses Kusto tables from Azure Monitor Logs. You can query these tables with Log analytics. For a list of App Service tables used by Kusto, see the [Azure Monitor Logs table reference - App Service tables](/azure/azure-monitor/reference/tables/tables-resourcetype#app-services). 

## Activity log

The following table lists common operations related to App Service that may be created in the Activity log. This is not an exhaustive list.

| Operation | Description |
|:---|:---|
|Create or Update Web App| App was created or updated|
|Delete Web App| App was deleted |
|Create Web App Backup| Backup of app|
|Get Web App Publishing Profile| Download of publishing profile |
|Publish Web App| App deployed |
|Restart Web App| App restarted|
|Start Web App| App started |
|Stop Web App| App stopped|
|Swap Web App Slots| Slots were swapped|
|Get Web App Slots Differences| Slot differences|
|Apply Web App Configuration| Applied configuration changes|
|Reset Web App Configuration| Configuration changes reset|
|Approve Private Endpoint Connections| Approved private endpoint connections|
|Network Trace Web Apps| Started network trace|
|Newpassword Web Apps| New password created |
|Get Zipped Container Logs for Web App| Get container logs |
|Restore Web App From Backup Blob| App restored from backup|

For more information on the schema of Activity Log entries, see [Activity  Log schema](../azure-monitor/essentials/activity-log-schema.md). 

## See Also

- See [Monitoring Azure App Service](monitor-app-service.md) for a description of monitoring Azure App Service.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.
