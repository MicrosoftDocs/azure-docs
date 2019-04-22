---
title: Sources of data in Azure Monitor | Microsoft Docs
description: Describes the data available to monitor the health and performance of your Azure resources and the applications running on them.
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn

ms.service: azure-monitor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/16/2019
ms.author: bwren

---

# Sources of monitoring data for Azure Monitor
Azure Monitor is based on a [common monitoring data platform](data-platform.md) that includes [Logs](data-platform-logs.md) and [Metrics](data-platform-metrics.md). Collecting data into this platform allows data from multiple resources to be analyzed together using a common set of tools in Azure Monitor. There are also other locations where monitoring data may be sent to support other scenarios, and some resources may write to other locations before they can be collected into Metrics and Logs.

This article describes the different sources of monitoring data collected by Azure Monitor in addition to the monitoring data created by Azure resources. Links are provided to detailed information on configuration required to collect this data to different locations.

## Application tiers

Monitoring data from Azure applications can be organized into tiers, the highest tiers being your application itself and the lower tiers being components of Azure platform. The method of accessing data from each tier varies. The application tiers are summarized in the table below, and the sources of monitoring data in each tier are presented in the following sections.


![Monitoring tiers](../media/overview/overview.png)


### Azure
The application tiers in the following table are specific to Azure.

| Tier | Description | Collection method |
|:---|:---|:---|
| [Azure Tenant](#azure-tenant) | Data about the operation of tenant-level Azure services, such as Azure Active Directory. | View in portal or configure using a tenant diagnostic setting. |
| [Azure subscription](#azure-subscription) |  Telemetry related to the health and operation of Azure itself. | View in portal or configure collection using a log profile. |
| [Azure resources](#azure-resources) |  Data about the operation and performance of each Azure resource. | Metrics collected automatically.<br>Configure diagnostic settings to collect logs.<br>Monitoring solutions and Insights available for more detailed monitoring for specific resource types. |

### Azure, other cloud, or on-premises 
The application tiers in the following table may be in Azure, another cloud, or on-premises.

| Tier | Description | Collection method |
|:---|:---|:---|
| [Guest operating system](#guest-operating-system) | Data about the operating system on compute resources. | Install an agent such as the Windows Azure Diagnostic Agent or Linux Azure Diagnostic Agent. For Azure virtual machines, install Azure Diagnostic Extension and Azure Monitor for VMs. |
| [Application](#applications) | Data about the performance and functionality of the actual application and code, including performance traces, application logs, and user telemetry. | Instrument your code for Application Insights. |

## Azure tenant
Telemetry related to your Azure tenant is collected from tenant-wide services such as Azure Active Directory.

![Azure tenant collection](media/data-sources/tenant.png)

### Azure Active Directory Audit Logs
[Azure Active Directory reporting](../../active-directory/reports-monitoring/overview-reports.md) contains the history of sign-in activity and audit trail of changes made within a particular tenant. 

| Destination | Description | Reference |
|:---|:---|:---|
| Azure Monitor Logs | Configure Azure AD logs to be collected in Azure Monitor. | [Integrate Azure AD logs with Azure Monitor logs (preview)](../../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md) |
| Azure Storage | Export Azure AD logs to Azure Storage for archiving. | [Tutorial: Archive Azure AD logs to an Azure storage account (preview)](../../active-directory/reports-monitoring/quickstart-azure-monitor-route-logs-to-storage-account.md) |
| Event Hub | Stream Azure AD logs to other locations using Event Hubs | [Tutorial: Stream Azure Active Directory logs to an Azure event hub (preview)](../../active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md). |



## Azure subscription
Telemetry related to the health and operation of Azure itself includes data about the operation and management of your Azure subscription.

![Azure subscription](media/data-sources/azure-subscription.png)

### Azure Activity Log 
The [Azure Activity Log](activity-logs-overview.md) includes service health records along with records on any configuration changes made to your Azure resources. The Activity log is available to all Azure resources and represents their _external_ view.

| Destination | Description | Reference |
|:---|:---|
| Activity Log | The Activity Log is collected into its own data store that you can view from the Azure Monitor menu or create Activity Log alerts. | [Query the Activity Log in the Azure portal](activity-logs-overview.md#query-the-activity-log-in-the-azure-portal) |
| Azure Storage | Export the Activity log to storage for archiving. | [Archive Activity Log](activity-log-export.md#archive-activity-log)  |
| Azure Monitor Logs | Copy the Activity Log to Azure Monitor Logs to analyze it with other monitoring data. |  |
| Event Hubs | Stream the Activity log to other locations using Event Hubs | [Stream Activity Log to Event Hub](activity-log-export.md#stream-activity-log-to-event-hub). |

### Azure Service Health
[Azure Service Health](service-notifications.md) provides information about the health of the Azure services in your subscription that your application and resources rely on. 

| Destination | Description | Reference |
|:---|:---|:---|
| Activity Log<br>Logs | Service Health records are stored in the Azure Activity log, so you can view them in the Activity Log Explorer or copy them into Azure Monitor Logs. | |


## Azure resources
Metrics and resource level diagnostic logs provide information about the _internal_ operation of Azure resources. These are available for most Azure services, and monitoring solutions and insights collect additional data for particular services.

![Azure resource collection](media/data-sources/azure-resources.png)


### Platform metrics 
Most Azure services will generate [platform metrics](data-platform-metrics.md) that reflect their performance and operation. The specific [metrics will vary for each type of resource](metrics-supported.md). 

| Destination | Description | Reference |
|:---|:---|:---|
| Azure Monitor Metrics | Platform metrics will write to the Azure Monitor metrics database with no configuration. Access platform metrics from metrics explorer.  | [Getting started with Azure Metrics Explorer](metrics-getting-started.md) |
| Azure Monitor Logs | Copy platform metrics to Logs for trending and other analysis using Log Analytics. | [Azure diagnostics direct to Log Analytics](collect-azure-metrics-logs.md#azure-diagnostics-direct-to-log-analytics) |


### Resource diagnostic logs
[Diagnostic logs](diagnostic-logs-overview.md) provide insights into the _internal_ operation of an Azure resource. The configuration requirements and content of these logs [varies by resource type](diagnostic-logs-schema.md). Diagnostic logs are not enabled by default. You must enable them and specify a destination for each resource. 

| Destination | Description | Reference |
|:---|:---|:---|
| Storage | Send Diagnostic logs to Azure Storage for archiving. | [Archive Azure Diagnostic Logs](archive-diagnostic-logs.md) |
| Azure Monitor Logs | Send Diagnostic Logs to Azure Monitor Logs for analysis with other collected log data. Some resources can write directly to Azure Monitor while others write to a storage account before being imported into Log Analytics. | [Stream Azure Diagnostic Logs to Log Analytics workspace in Azure Monitor](diagnostic-logs-stream-log-store.md) <br> [Use the Azure portal to collect logs from Azure Storage](azure-storage-iis-table.md#use-the-azure-portal-to-collect-logs-from-azure-storage)  |.
| EventHubs | Export Diagnostic logs to Event Hub for redirection to other services. |[Stream Azure Diagnostic Logs to an event hub](diagnostic-logs-stream-event-hubs.md) |



### Other services
The Azure services in the following table do not currently store their data in the Azure Monitor data platform like other services.

| Service | Description | Reference |
|:---|:---|:---|
| Storage | Metrics for storage accounts are collected in Azure Monitor along with other resources, but logs are written to the storage account. You can import these logs into a Log Analytics workspace in Azure Monitor, but this requires custom configuration. You can also retrieve this data with the Storage Analytics API.  | [Azure Storage metrics in Azure Monitor](../../storage/common/storage-metrics-in-azure-monitor.md)<br>[Azure Storage analytics logging](../../storage/common/storage-analytics-logging.md)<br>[Storage Analytics API](https://docs.microsoft.com/rest/api/storageservices/storage-analytics)<br>[Query Azure Storage analytics logs in Azure Log Analytics](https://azure.microsoft.com/blog/query-azure-storage-analytics-logs-in-azure-log-analytics/) |
| App Service | Metrics for app services are collected in Azure Monitor along with other resources. Logs are written to file, table, or blob storage. | [Enable diagnostics logging for apps in Azure App Service](../../app-service/troubleshoot-diagnostic-logs.md)  |



## Guest operating system
Compute resources in Azure, in other clouds, and on-premises have a guest operating system to monitor. With the installation of one or more agents, you can gather telemetry from the guest into the same monitoring tools as the Azure services themselves.

![Azure compute resource collection](media/data-sources/compute-resources.png)

### Azure Diagnostic extension
Enabling the Azure Diagnostics extension for Azure Virtual machines allows you to collect logs and metrics from Azure compute resources including Azure Cloud Service (classic) Web and Worker Roles, Virtual Machines, Virtual Machine scale sets, and Service Fabric.

| Destination | Description | Reference |
|:---|:---|:---|
| Storage | When you enable the Diagnostics Extension, it will write to a storage account by default. | [Store and view diagnostic data in Azure Storage](diagnostics-extension-to-storage.md) |
| Event Hubs | Configure the Diagnostics Extension to send to Event Hubs to stream the data to other locations.  | [Streaming Azure Diagnostics data in the hot path by using Event Hubs](diagnostics-extension-stream-event-hubs.md) |
| Azure Monitor Metrics | When you configure the Diagnostics Extension to collect performance counters, they are written to the Azure Monitor metrics database. | [Send Guest OS metrics to the Azure Monitor metric store using a Resource Manager template for a Windows virtual machine](collect-custom-metrics-guestos-resource-manager-vm.md) |
| Application Insights Logs | Collect logs and performance counters from the compute resource supporting your application to be analyzed with other application data. | [Send Cloud Service, Virtual Machine, or Service Fabric diagnostic data to Application Insights](diagnostics-extension-to-application-insights.md) |

### Log Analytics agent 
Comprehensive monitoring and management of your Windows or Linux virtual machines or physical computer is delivered with the Log Analytics agent. The virtual machine can be running in Azure, another cloud, or on-premises.

| Destination | Description | Reference |
|:---|:---|:---|
| Azure Monitor Logs | The Log Analytics agent connects to Azure Monitor either directly or through System Center Operations Manager and allows you to collect data from data sources that you configure or from monitoring solutions that provide additional insights into applications running on the virtual machine. | [Agent data sources in Azure Monitor](agent-data-sources.md)<br>[Monitoring solutions in Azure Monitor](../insights/solutions.md) |


### Azure Monitor for VMs 
[Azure Monitor for VMs](../insights/vminsights-overview.md) provides a customized monitoring experience for virtual machines providing features beyond core Azure Monitor functionality, including service status and VM health. It requires a Dependency Agent on Windows and Linux virtual machines that integrates with the Log Analytics agent to collect discovered data about processes running on the virtual machine and external process dependencies.

| Destination | Description | Reference |
|:---|:---|:---|
| Azure Monitor Logs | Stores data about processes and dependencies on the agent. | [Using Azure Monitor for VMs (preview) Map to understand application components](../insights/vminsights-maps.md) |
| VM Storage | Azure Monitor for VMs stores heath state information in a custom location. This is only available to Azure Monitor for BVMs in the Azure portal in addition to the [Azure Resource health REST API](/rest/api/resourcehealth/). | [Understand the health of your Azure virtual machines](../insights/vminsights-health.md)<br>[Azure Resource health REST API](https://docs.microsoft.com/rest/api/resourcehealth/) |



## Applications
Detailed application monitoring in Azure Monitor is done with [Application Insights](https://docs.microsoft.com/azure/application-insights/) which collects data from applications running on a variety of platforms. The application can be running in Azure, another cloud, or on-premises.

![Application data collection](media/data-sources/applications.png)


### Application data
When you enable Application Insights for an application by installing an instrumentation package, it collects metrics and logs related to the performance and operation of the application. Application Insights stores the data it collects in the same Azure Monitor data platform used by other data sources. It includes extensive tools for analyzing this data, but you can also analyze it with data from other sources using tools such as Metrics Explorer and Log Analytics.

| Destination | Description | Reference |
|:---|:---|:---|
| Azure Monitor Logs | Application Insights supports multiple kinds of data in Azure Monitor Logs: | |
|                    | Operational data about your application including page views, application requests, and exceptions. | [Analyze log data in Azure Monitor](../log-query/log-query-overview.md) |
|                    | Dependency information between application components to support Application Map and telemetry correlation. | [Telemetry correlation in Application Insights](../app/correlation.md) <br> [Application Map](../app/app-map.md) |
|            | Results of availability tests that test the availability and responsiveness of your application from different locations on the public Internet. |[Monitor availability and responsiveness of any web site](../app/monitor-web-app-availability.md) |
| Azure Monitor Metrics | Application Insights collects metrics describing the performance and operation of the application in addition to custom metrics that you define in your application into the Azure Monitor metrics database. | [Log-based and pre-aggregated metrics in Application Insights](../app/pre-aggregated-metrics-log-metrics.md)<br>[Application Insights API for custom events and metrics](../app/api-custom-events-metrics.md) |

You can also use Application Insights to [create a custom metric](../app/api-custom-events-metrics.md).  This allows you to define your own logic for calculating a numeric value and then storing that value with other metrics that can be accessed from metric analytics and used for [Autoscale](autoscale-custom-metric.md) and metric alerts. |
| Azure Storage | Archive application data to storage by configuring [continuous export](/../app/export-telemetry.md). |


## Monitoring Solutions and Insights
[Monitoring solutions](../insights/solutions.md) and Insights collect data to provide additional insights into the operation of a particular service or application. They may address resources in different application tiers and even multiple tiers.

### Monitoring solutions

| Destination | Description | Reference
|:---|:---|:---|
| Azure Monitor Logs | Monitoring solutions collect data into Azure Monitor logs where it may be analyzed using the query language or [views](view-designer.md) that are typically included in the solution. | [Data collection details for monitoring solutions in Azure](../insights/solutions-inventory.md)<br>[Analyze log data in Azure Monitor](../log-query/log-query-overview.md) |


### Azure Monitor for Containers
[Azure Monitor for Containers](../insights/container-insights-overview.md) provides a customized monitoring experience for [Azure Kubernetes Service (AKS)](/azure/aks/). It collects additional data about these resources described in the following table.

| Destination | Description | Reference |
|:---|:---|:---|
| Azure Monitor Logs | Stores monitoring data for AKS including inventory, logs, and events. Metric data is also stored in Logs in order to leverage its analysis functionality in the portal. | [Understand AKS cluster performance with Azure Monitor for containers](../insights/container-insights-analyze.md) |
| Azure Monitor Metrics | Metric data is stored in the metric database to drive visualization and alerts. | [View container metrics in metrics explorer](../insights/container-insights-analyze.md#view-container-metrics-in-metrics-explorer) |
| Container Diagnostics | Audit log and control plane logs are stored in a custom location before they're moved to a Log Analytics workspace. |  |
| Azure Kubernetes Service | In order to a near real time experience, Azure Monitor for Containers presents data directly from the Azure Kubernetes service in the Azure portal. | [How to view container logs real time with Azure Monitor for containers (preview)](../insights/container-insights-live-logs.md) |

### Azure Monitor for VMs
[Azure Monitor for VMs]() provides a customized experience for monitoring virtual machines. A description of the data collected by Azure Monitor for VMs is included in the [Guest Operating System](#guest-operating-system) section above.

## Custom sources
In addition to the standard tiers of an application, you may need to monitor other resources that have telemetry that can't be collected with the other data sources. For these resources, you need to write this data using an Azure Monitor API.

![Custom collection](media/data-sources/custom.png)

| Destination | Method | Description | Reference |
|:---|:---|:---|:---|
| Azure Monitor Logs | Data Collector API | Collect log data from any REST client and store in Log Analytics workspace. | [Send log data to Azure Monitor with the HTTP Data Collector API (public preview)](data-collector-api.md) |
| Azure Monitor Metrics | Custom Metrics API | Collect metric data from any REST client and store in Azure Monitor metrics database. | [Send custom metrics for an Azure resource to the Azure Monitor metric store by using a REST API](metrics-store-custom-rest-api.md) |


## Other services
Other services in Azure write data to the Azure Monitor data platform. This allows you to analyze data collected by these services with data collected by Azure Monitor and leverage the same analysis and visualization tools.

| Service | Destination | Description | Reference |
|:---|:---|:---|:---|
| [Azure Security Center](/azure/security-center/) | Azure Monitor Logs | Azure Security Center stores the data it collects in a Log Analytics workspace which allows it to be analyzed with other log data collected by Azure Monitor.  | [Data collection in Azure Security Center](../../security-center/security-center-enable-data-collection.md) |
| [Azure Sentinel](/azure/sentinel/) | Azure Monitor Logs | Azure Sentinel stores the data it collects in a Log Analytics workspace which allows it to be analyzed with other log data collected by Azure Monitor. Certain data sources that you add to Azure Sentinel will add monitoring solutions to the workspace. |  |


## Next steps

- Learn more about the [types of monitoring data collected by Azure Monitor](data-platform.md) and how to view and analyze this data.
