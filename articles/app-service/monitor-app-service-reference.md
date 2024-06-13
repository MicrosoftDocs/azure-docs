---
title: Azure App Service monitoring data reference
description: This article contains important reference material you need when you monitor Azure App Service.
ms.date: 03/07/2024
ms.custom: horz-monitor
ms.topic: reference
author: msangapu-msft
ms.author: msangapu
ms.service: app-service
---

# Azure App Service monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure App Service](monitor-app-service.md) for details on the data you can collect for Azure App Service and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Web

The following tables list the automatically collected platform metrics for App Service.

|Metric Type | Resource Provider / Type Namespace<br/> and link to individual metrics |
|-------|-----|
| Web apps | [Microsoft.Web/sites](/azure/azure-monitor/reference/supported-metrics/microsoft-web-sites-metrics)
| App Service Plans | [Microsoft.Web/serverfarms](/azure/azure-monitor/reference/supported-metrics/microsoft-web-serverfarms-metrics)
| Staging slots | [Microsoft.Web/sites/slots](/azure/azure-monitor/reference/supported-metrics/microsoft-web-sites-slots-metrics)
| App Service Environment | [Microsoft.Web/hostingEnvironments](/azure/azure-monitor/reference/supported-metrics/microsoft-web-hostingenvironments-metrics)
| App Service Environment Front-end | [Microsoft.Web/hostingEnvironments/multiRolePools](/azure/azure-monitor/reference/supported-metrics/microsoft-web-hostingenvironments-multirolepools-metrics)
| App Service Environment Worker Pools | [Microsoft.Web/hostingEnvironments/workerPools](/azure/azure-monitor/reference/supported-metrics/microsoft-web-hostingenvironments-workerpools-metrics)

>[!NOTE]
>Azure App Service, Functions, and Logic Apps share the Microsoft.Web/sites namespace dating back to when they were a single service. Refer to the **Metric** column in the [Microsoft.Web/sites](/azure/azure-monitor/reference/supported-metrics/microsoft-web-sites-metrics) table to see which metrics apply to which services. The **Metrics** interface in the Azure portal for each service shows only the metrics that apply to that service.

>[!NOTE]
>App Service Plan metrics are available only for plans in *Basic*, *Standard*, and *Premium* tiers.

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]
[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

Some metrics in the following namespaces have the listed dimensions:

**Microsoft.Web/sites**

- Instance
- workflowName
- status
- accountName

**Microsoft.Web/serverFarms**,<br>
**Microsoft.Web/sites/slots**,<br>
**Microsoft.Web/hostingEnvironments**,<br>
**Microsoft.Web/hostingenvironments/multirolepools,**<br>
**Microsoft.Web/hostingenvironments/workerpools**

- Instance

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Web

- [Microsoft.Web/hostingEnvironments](/azure/azure-monitor/reference/supported-logs/microsoft-web-hostingenvironments-logs)
- [Microsoft.Web/sites](/azure/azure-monitor/reference/supported-logs/microsoft-web-sites-logs)
- [Microsoft.Web/sites/slots](/azure/azure-monitor/reference/supported-logs/microsoft-web-sites-slots-logs)

The following table lists more information about resource logs you can collect for App Service. 

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

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]
### App Services

Microsoft.Web/sites
- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity)
- [LogicAppWorkflowRuntime](/azure/azure-monitor/reference/tables/logicappworkflowruntime)
- [AppServiceAuthenticationLogs](/azure/azure-monitor/reference/tables/appserviceauthenticationlogs)
- [AppServiceServerlessSecurityPluginData](/azure/azure-monitor/reference/tables/appserviceserverlesssecurityplugindata)
- [AzureMetrics](/azure/azure-monitor/reference/tables/azuremetrics)
- [AppServiceAppLogs](/azure/azure-monitor/reference/tables/appserviceapplogs)
- [AppServiceAuditLogs](/azure/azure-monitor/reference/tables/appserviceauditlogs)
- [AppServiceConsoleLogs](/azure/azure-monitor/reference/tables/appserviceconsolelogs)
- [AppServiceFileAuditLogs](/azure/azure-monitor/reference/tables/appservicefileauditlogs)
- [AppServiceHTTPLogs](/azure/azure-monitor/reference/tables/appservicehttplogs)
- [FunctionAppLogs](/azure/azure-monitor/reference/tables/functionapplogs)
- [AppServicePlatformLogs](/azure/azure-monitor/reference/tables/appserviceplatformlogs)
- [AppServiceIPSecAuditLogs](/azure/azure-monitor/reference/tables/appserviceipsecauditlogs)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]

The following table lists common activity log operations related to App Service. This list isn't exhaustive. For all Microsoft.Web resource provider operations, see [Microsoft.Web resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftweb).

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

## Related content

- See [Monitor App Service](monitor-app-service.md) for a description of monitoring App Service.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.