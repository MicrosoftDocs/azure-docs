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
Azure Monitor is based on a [common monitoring data platform](data-platform.md) that includes [Logs](data-platform-logs.md) and [Metrics](data-platform-metrics.md). Collecting data into a common platform allows data from multiple resources to be analyzed together using a common set of tools. There are also other locations where monitoring data may be sent to support other scenarios, and some resources may write to other locations before they can be collected into Metrics and Logs.

This article describes the different sources of monitoring data used by Azure Monitor and how it can be collected. Links are provided to detailed information on configuring and accessing this data.

## Application tiers

Monitoring data in Azure comes from a variety of sources that can be organized into tiers, the highest tiers being your application and any operating systems and the lower tiers being components of Azure platform. The method of accessing data from each tier varies as described in the sections below.


![Monitoring tiers](../media/overview/overview.png)


### Azure
The application tiers in the following table are specific to Azure.

| Tier | Description | Collection method |
|:---|:---|:---|
| [Azure Tenant](#azure-tenant) | Data about the operation of tenant-level Azure services, such as Azure Active Directory. | This data can be collected using a tenant diagnostic setting. |
| [Azure subscription](#azure-subscription) |  Telemetry related to the health and operation of Azure itself. | Collect this data using a log profile to collect the Activity log. |
| [Azure resources](#azure-resources) |  Data about the operation and performance of each Azure resource. | Metrics collected automatically. Configure diagnostic settings to collect logs. Monitoring solutions and Insights are available for more detailed monitoring for specific resource types. |

### Azure, other cloud, or on-premises 
The application tiers in the following table may be in Azure, another cloud, or on-premises.

| Tier | Description | Collection method |
|:---|:---|:---|
| [Guest operating system](#guest-operating-system) | Data about the operating system on compute resources. | To collect this type of data, you need to install an agent such as the Windows Azure Diagnostic Agent or Linux Azure Diagnostic Agent. |
| [Application](#application) | Data about the performance and functionality of the actual application and code, including performance traces, application logs, and user telemetry. | Instrument your code for Application Insights. |}

## Azure tenant
Telemetry related to your Azure tenant is collected from tenant-wide services such as Azure Active Directory.

![Azure tenant collection](media/data-sources/tenant.png)

### Azure Active Directory Audit Logs
[Azure Active Directory reporting](../../active-directory/reports-monitoring/overview-reports.md) contains the history of sign-in activity and audit trail of changes made within a particular tenant. 

| Destination | Description |
|:---|:---|
| Azure Monitor Logs | See [Integrate Azure AD logs with Azure Monitor logs (preview)](../../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics) for details on configuring them to be collected in Azure Monitor. |
| Storage || 
| Event Hub | |



## Azure subscription
Telemetry related to the health and operation of Azure itself includes data about the operation and management of your Azure subscription.

![Azure subscription](media/data-sources/azure-subscription.png)

### Azure Activity Log 
The [Azure Activity Log](activity-logs-overview.md) includes service health records along with records on any configuration changes made to your Azure resources. The Activity log is available to all Azure resources and represents their _external_ view.

| Destination | Description |
|:---|:---|
| Activity Log | The Activity Log is collected into its own data store that you can view from the Azure Monitor menu or create Activity Log alerts. |
| Azure Storage | Export the [Activity log to storage](activity-log-export.md#archive-activity-log) for archiving. |
| Azure Monitor Logs | Copy the Activity Log to Azure Monitor Logs to analyze it with other monitoring data. |
| Event Hubs | Stream the Activity log to other locations using [Event Hubs](activity-log-export.md#stream-activity-log-to-event-hub). |

### Azure Service Health
[Azure Service Health](service-notifications.md) provides information about the health of the Azure services in your subscription that your application and resources rely on. 

| Destination | Description |
|:---|:---|
| Activity Log<br>Logs | Service Health records are stored in the [Azure Activity log](activity-logs-overview.md), so you can view them in the Activity Log Explorer or copy them into Azure Monitor Logs. |


## Azure resources
Metrics and resource level diagnostic logs provide information about the _internal_ operation of Azure resources. These are available for most Azure services, and management solutions provide additional insights into particular services.

![Azure resource collection](media/data-sources/azure-resources.png)


### Platform metrics 
Most Azure services will generate [platform metrics](data-platform-metrics.md) that reflect their performance and operation. The specific [metrics will vary for each type of resource](metrics-supported.md). 

| Destination | Description |
|:---|:---|
| Azure Monitor Metrics | Platform metrics will write to the Azure Monitor metrics database with no configuration. Access platform metrics from [metrics explorer](metrics-getting-started.md).  |
| Azure Monitor Logs | [Copy platform metrics to Logs](collect-azure-metrics-logs.md#azure-diagnostics-direct-to-log-analytics) for trending and other analysis using Log Analytics. |


### Resource diagnostic logs
[Diagnostic logs](diagnostic-logs-overview.md) provide insights into the internal operation of an Azure resource. The configuration requirements and content of these logs [varies by resource type](diagnostic-logs-schema.md). Diagnostic logs are not enabled by default. You must enable them and specify a destination for each resource. 

| Destination | Description |
|:---|:---|
| Storage | Send Diagnostic logs to [Azure storage](archive-diagnostic-logs.md) for archiving. 
| Azure Monitor Logs | Send Diagnostic Logs [to Azure Monitor Logs](diagnostic-logs-stream-log-store.md) for analysis with other collected log data. Some resources can write directly to Azure Monitor while others write to a storage account before being [imported into Log Analytics](azure-storage-iis-table.md#use-the-azure-portal-to-collect-logs-from-azure-storage).
| EventHubs | Export Diagnostic logs to [Event Hub](../../event-hubs/event-hubs-about.md) for redirection to other services. | |

### Azure Monitor for Containers
[Azure Monitor for Containers](../insights/container-insights-overview.md) provides a customized monitoring experience for [Azure Kubernetes Service (AKS)](/azure/aks/). It collects additional data about these resources described in the following table.

| Destination | Description |
|:---|:---|
| Azure Monitor Logs | Stores monitoring data for AKS including inventory, logs, and events. Metric data is also stored in Logs in order to leverage its analysis functionality in the portal. |
| Azure Monitor Metrics | Metric data is stored in the metric database to drive visualization and alerts. |
| Container Diagnostics | Audit log and control plane logs are stored in a custom location before they're moved to a Log Analytics workspace. |
| Azure Kubernetes Service | In order to a near real time experience, Azure Monitor for Containers presents data directly from the Azure Kubernetes service in the Azure portal. |

### Other services
The Azure services in the following table do not currently store their data in the Azure Monitor data platform like other services.

| Service | Description |
|:---|:---|
| Storage | Metrics for storage accounts are collected in Azure Monitor along with other resources, but logs are [written to the storage account](../../storage/common/storage-metrics-in-azure-monitor.md). You can import these logs into a Log Analytics workspace in Azure Monitor, but this [requires custom configuration](https://azure.microsoft.com/blog/query-azure-storage-analytics-logs-in-azure-log-analytics/). You can also retrieve this data with the [Storage Analytics API](/rest/api/storageservices/storage-analytics).  |
| App Service | Metrics for app services are collected in Azure Monitor along with other resources. Logs are written to [file, table, or blob storage](../..//app-service/troubleshoot-diagnostic-logs.md). |



## Guest operating system
Compute resources in Azure, in other clouds, and on-premises have a guest operating system to monitor. With the installation of one or more agents, you can gather telemetry from the guest into the same monitoring tools as the Azure services themselves.

![Azure compute resource collection](media/data-sources/compute-resources.png)

### Azure Diagnostic extension
Enabling the Azure Diagnostics extension for Azure Virtual machines allows you to collect logs and metrics from Azure compute resources including Azure Cloud Service (classic) Web and Worker Roles, Virtual Machines, Virtual Machine scale sets, and Service Fabric.

| Destination | Description |
|:---|:---|
| Storage | When you enable the Diagnostics Extension, it will [write to a storage account](diagnostics-extension-stream-event-hubs.md) by default. |
| Event Hubs | Configure the Diagnostics Extension to [send to Event Hubs](diagnostics-extension-stream-event-hubs.md) to stream the data to other locations.  |
| Application Insights |  |
| Azure Monitor Metrics | When you configure the Diagnostics Extension to collect performance counters, they are written to the Azure Monitor metrics database. |


### Log Analytics agent 
Comprehensive monitoring and management of your Windows or Linux virtual machines or physical computer is delivered with the Log Analytics agent. The virtual machine can be running in Azure, another cloud, or on-premises.

| Destination | Description |
|:---|:---|
| Azure Monitor Logs | The Log Analytics agent connects to Azure Monitor either directly or through System Center Operations Manager and allows you to collect data from [data sources](agent-data-sources.md) that you configure or from [monitoring solutions](../insights/solutions.md) that provide additional insights into applications running on the virtual machine. |


### Azure Monitor for VMs 
[Azure Monitor for VMs](../insights/vminsights-overview.md) provides a customized monitoring experience for virtual machines providing features beyond core Azure Monitor functionality, including service status and VM health. It requires a Dependency Agent on Windows and Linux virtual machines that integrates with the Log Analytics agent to collect discovered data about processes running on the virtual machine and external process dependencies.

| Destination | Description |
|:---|:---|
| Azure Monitor Logs | Stores data about processes and dependencies on the agent. |
| VM Storage | Azure Monitor for VMs stores heath state information in a custom location. This is only available to Azure Monitor for BVMs in the Azure portal in addition to the [Azure Resource health REST API](/rest/api/resourcehealth/).



## Applications
Detailed application monitoring in Azure Monitor is done with [Application Insights](https://docs.microsoft.com/azure/application-insights/) which collects data from applications running on a variety of platforms. The application can be running in Azure, another cloud, or on-premises.

![Application data collection](media/data-sources/applications.png)


### Application data
When you enable Application Insights for an application by installing an instrumentation package, it collects metrics and logs related to the performance and operation of the application. Application Insights stores the data it collects in the same Azure Monitor data platform used by other data sources. It includes extensive tools for analyzing this data, but you can also analyze it with data from other sources using tools such as Metrics Explorer and Log Analytics.

| Destination | Description |
|:---|:---|
| Azure Monitor Logs | Operational data about your application including page views, application requests, and exceptions.<br>Dependency information between application components to support []() and [telemetry correlation](../../app/correlation).<br>Results of [availability tests](../../app/monitor-web-app-availability.md) that test the availability and responsiveness of your application from different locations on the public Internet. |
| Azure Monitor Metrics | Metrics describing the performance and operation of the application.<br>[Custom metrics](../../application-insights/app-insights-api-custom-events-metrics.md) that you define in your application. | 

You can also use Application Insights to [create a custom metric](../../application-insights/app-insights-api-custom-events-metrics.md).  This allows you to define your own logic for calculating a numeric value and then storing that value with other metrics that can be accessed from metric analytics and used for [Autoscale](autoscale-custom-metric.md) and metric alerts. |
| Azure Storage | Archive application data to storage by configuring [continuous export](/../../app/export-telemetry.md). |


## Monitoring Solutions 
[Monitoring solutions](../insights/solutions.md) collect data to provide additional insight into the operation of a particular service or application.

| Destination | Description |
|:---|:---|
| Azure Monitor Logs | Monitoring solutions collect data into Azure Monitor logs where it may be analyzed using the [query language](../log-query/log-query-overview.md) or [views](view-designer.md) that are typically included in the solution. |


## Custom sources
In addition to the standard tiers of an application, you may need to monitor other resources that have telemetry that can't be collected with the other data sources. For these resources, you need to write this data using an Azure Monitor API.

| Destination | Method | Description |
|:---|:---|:---|
| Azure Monitor Logs | [Data Collector API](data-collector-api.md) | Collect log data from any REST client and store in Log Analytics workspace. |
| Azure Monitor Metrics | [Custom Metrics API](metrics-store-custom-rest-api.md) | Collect metric data from any REST client and store in Azure Monitor metrics database. |


## Other services
Other services in Azure write data to the Azure Monitor data platform. This allows you to analyze data collected by these services with data collected by Azure Monitor and leverage the same analysis and visualization tools.

| Service | Destination | Description |
|:---|:---|:---|
| [Azure Security Center](/azure/security-center/) | Azure Monitor Logs |  |
| Azure Sentinel | Azure Monitor Logs |  |


## Next steps

- Learn more about the [types of monitoring data collected by Azure Monitor](data-platform.md) and how to view and analyze this data.
