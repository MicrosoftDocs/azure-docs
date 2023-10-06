---
title: Sources of data in Azure Monitor
description: Describes the data available to monitor the health and performance of your Azure resources and the applications running on them.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 11/17/2022
ms.reviewer: shseth

---

# Sources of monitoring data for Azure Monitor

Azure Monitor is based on a [common monitoring data platform](data-platform.md) that includes 
- [Metrics](essentials/data-platform-metrics.md)
- [Logs](logs/data-platform-logs.md)
- [Traces](app/asp-net-trace-logs.md) 
- [Changes](change/change-analysis.md) 

This platform allows data from multiple resources to be analyzed together using a common set of tools in Azure Monitor. Monitoring data may also be sent to other locations to support certain scenarios, and some resources may write to other locations before they can be collected into Logs or Metrics.

This article describes common sources of monitoring data collected by Azure Monitor in addition to the monitoring data created by Azure resources. Links are provided to detailed information on configuration required to collect this data to different locations.

Some of these data sources use the [new data ingestion pipeline](essentials/data-collection.md) in Azure Monitor. This article will be updated as other data sources transition to this new data collection method.

> [!NOTE]
> Access to data in the Log Analytics Workspaces is governed as outline [here](logs/manage-access.md).
>

## Application tiers

Sources of monitoring data from Azure applications can be organized into tiers, the highest tiers being your application itself and the lower tiers being components of Azure platform. The method of accessing data from each tier varies. The application tiers are summarized in the table below, and the sources of monitoring data in each tier are presented in the following sections. See [Monitoring data locations in Azure](monitor-reference.md) for a description of each data location and how you can access its data.

:::image type="content" source="media/overview/overview-simple-20230707-opt.svg" alt-text="Diagram that shows an overview of Azure Monitor with data sources on the left sending data to a central data platform and features of Azure Monitor on the right that use the collected data." border="false" lightbox="media/overview/overview-blowout-20230707-opt.svg":::

### Azure

The following table briefly describes the application tiers that are specific to Azure. Following the link for further details on each in the sections below.

| Tier | Description | Collection method |
|:---|:---|:---|
| [Azure Tenant](#azure-tenant) | Data about the operation of tenant-level Azure services, such as Azure Active Directory. | View Azure Active Directory data in portal or configure collection to Azure Monitor using a tenant diagnostic setting. |
| [Azure subscription](#azure-subscription) | Data related to the health and management of cross-resource services in your Azure subscription such as Resource Manager and Service Health. | View in portal or configure collection to Azure Monitor using a log profile. |
| [Azure resources](#azure-resources) |  Data about the operation and performance of each Azure resource. | Metrics collected automatically, view in Metrics Explorer.<br>Configure diagnostic settings to collect logs in Azure Monitor.<br>Monitoring solutions and Insights available for more detailed monitoring for specific resource types. |

### Azure, other cloud, or on-premises 
The following table briefly describes the application tiers that may be in Azure, another cloud, or on-premises. Following the link for further details on each in the sections below.

| Tier | Description | Collection method |
|:---|:---|:---|
| [Operating system (guest)](#operating-system-guest) | Data about the operating system on compute resources. | Install Azure Monitor agent on virtual machines, scale sets and Arc-enabled servers to collect logs and metrics into Azure Monitor. |
| [Application Code](#application-code) | Data about the performance and functionality of the actual application and code, including performance traces, application logs, and user telemetry. | Instrument your code to collect data into Application Insights. |
| [Custom sources](#custom-sources) | Data from external services or other components or devices. | Collect log or metrics data into Azure Monitor from any REST client. |

## Azure tenant
Telemetry related to your Azure tenant is collected from tenant-wide services such as Azure Active Directory.

:::image type="content" source="media/data-sources/tenant.png" lightbox="media/data-sources/tenant.png" alt-text="Diagram that shows Azure tenant collection." border="false":::


### Azure Active Directory Audit Logs
[Azure Active Directory reporting](../active-directory/reports-monitoring/overview-reports.md) contains the history of sign-in activity and audit trail of changes made within a particular tenant. 

| Destination | Description | Reference |
|:---|:---|:---|
| Azure Monitor Logs | Configure Azure AD logs to be collected in Azure Monitor to analyze them with other monitoring data. | [Integrate Azure AD logs with Azure Monitor logs](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md) |
| Azure Storage | Export Azure AD logs to Azure Storage for archiving. | [Tutorial: Archive Azure AD logs to an Azure storage account](../active-directory/reports-monitoring/quickstart-azure-monitor-route-logs-to-storage-account.md) |
| Event Hubs | Stream Azure AD logs to other locations using Event Hubs. | [Tutorial: Stream Azure Active Directory logs to an Azure event hub](../active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md). |

## Azure subscription
Telemetry related to the health and operation of your Azure subscription.

:::image type="content" source="media/data-sources/azure-subscription.png" lightbox="media/data-sources/azure-subscription.png" alt-text="Diagram that shows Azure subscription collection." border="false":::

### Azure Activity log 
The [Azure Activity log](essentials/platform-logs-overview.md) includes service health records along with records on any configuration changes made to the resources in your Azure subscription. The Activity log is available to all Azure resources and represents their _external_ view.

| Destination | Description | Reference |
|:---|:---|:---|
| Activity log | The Activity log is collected into its own data store that you can view from the Azure Monitor menu or use to create Activity log alerts. |[Query the Activity log with the Azure portal](essentials/activity-log.md#view-the-activity-log) |
| Azure Monitor Logs | Configure Azure Monitor Logs to collect the Activity log to analyze it with other monitoring data. | [Collect and analyze Azure activity logs in Log Analytics workspace in Azure Monitor](essentials/activity-log.md) |
| Azure Storage | Export the Activity log to Azure Storage for archiving. | [Archive Activity log](essentials/resource-logs.md#send-to-azure-storage)  |
| Event Hubs | Stream the Activity log to other locations using Event Hubs | [Stream Activity log to Event Hubs](essentials/resource-logs.md#send-to-azure-event-hubs). |

### Azure Service Health
[Azure Service Health](../service-health/service-health-overview.md) provides information about the health of the Azure services in your subscription that your application and resources rely on.

| Destination | Description | Reference |
|:---|:---|:---|
| Activity log<br>Azure Monitor Logs | Service Health records are stored in the Azure Activity log, so you can view them in the Azure portal or perform any other activities you can perform with the Activity log. | [View service health notifications by using the Azure portal](../service-health/service-notifications.md) |

### Azure Monitor Change Analysis

[Change Analysis](./change/change-analysis.md) provides insights into your Azure application changes, increases observability, and reduces mean time to repair.

| Destination | Description | Reference |
| ----------- | ----------- | --------- |
| Azure Resource Manager control plane changes | Change Analysis provides a historical record of how the Azure resources that host your application have changed over time, using Azure Resource Graph | [Resources | Get Changes](../governance/resource-graph/how-to/get-resource-changes.md) |
| Resource configurations and settings changes | Change Analysis securely queries and computes IP Configuration rules, TLS settings, and extension versions to provide more change details in the app. | [Azure Resource Manager configuration changes](./change/change-analysis.md#azure-resource-manager-resource-properties-changes) |
| Web app in-guest changes | Every 30 minutes, Change Analysis captures the deployment and configuration state of an application. | [Diagnose and solve problems tool for Web App](./change/change-analysis-visualizations.md#diagnose-and-solve-problems-tool-for-web-app) |

## Azure resources
Metrics and resource logs provide information about the _internal_ operation of Azure resources. These are available for most Azure services, and monitoring solutions and insights collect additional data for particular services.

:::image type="content" source="media/data-sources/data-source-azure-resources.svg" lightbox="media/data-sources/data-source-azure-resources.svg" alt-text="Diagram that shows Azure resource collection." border="false":::


### Platform metrics 
Most Azure services will send [platform metrics](essentials/data-platform-metrics.md) that reflect their performance and operation directly to the metrics database. The specific [metrics will vary for each type of resource](essentials/metrics-supported.md). 

| Destination | Description | Reference |
|:---|:---|:---|
| Azure Monitor Metrics | Platform metrics will write to the Azure Monitor metrics database with no configuration. Access platform metrics from Metrics Explorer.  | [Getting started with Azure Metrics Explorer](essentials/metrics-getting-started.md)<br>[Supported metrics with Azure Monitor](essentials/metrics-supported.md) |
| Azure Monitor Logs | Copy platform metrics to Logs for trending and other analysis using Log Analytics. | [Azure diagnostics direct to Log Analytics](essentials/resource-logs.md#send-to-log-analytics-workspace) |
| Azure Monitor Change Analysis | Change Analysis detects various types of changes, from the infrastructure layer through application deployment. | [Use Change Analysis in Azure Monitor](./change/change-analysis.md) |
| Event Hubs | Stream metrics to other locations using Event Hubs. |[Stream Azure monitoring data to an event hub for consumption by an external tool](essentials/stream-monitoring-data-event-hubs.md) |

### Resource logs
[Resource logs](essentials/platform-logs-overview.md) provide insights into the _internal_ operation of an Azure resource.  Resource logs are created automatically, but you must create a diagnostic setting to specify a destination for them to be collected for each resource.

The configuration requirements and content of resource logs vary by resource type, and not all services yet create them. See [Supported services, schemas, and categories for Azure resource logs](essentials/resource-logs-schema.md) for details on each service and links to detailed configuration procedures. If the service isn't listed in this article, then that service doesn't currently create resource logs.

| Destination | Description | Reference |
|:---|:---|:---|
| Azure Monitor Logs | Send resource logs to Azure Monitor Logs for analysis with other collected log data. | [Collect Azure resource logs in Log Analytics workspace in Azure Monitor](essentials/resource-logs.md#send-to-log-analytics-workspace) |
| Storage | Send resource logs to Azure Storage for archiving. | [Archive Azure resource logs](essentials/resource-logs.md#send-to-azure-storage) |
| Event Hubs | Stream resource logs to other locations using Event Hubs. |[Stream Azure resource logs to an event hub](essentials/resource-logs.md#send-to-azure-event-hubs) |

## Operating system (guest)
Compute resources in Azure, in other clouds, and on-premises have a guest operating system to monitor. With the installation of an agent, you can gather telemetry from the guest into Azure Monitor to analyze it with the same monitoring tools as the Azure services themselves.

:::image type="content" source="media/data-sources/compute-resources.png" lightbox="media/data-sources/compute-resources.png" alt-text="Diagram that shows compute data collection." border="false":::


### Azure Monitor agent 
[Install the Azure Monitor agent](agents/azure-monitor-agent-manage.md) for comprehensive monitoring and management of your Windows or Linux virtual machines, scale sets and Arc-enabled servers. The Azure Monitor agent replaces the Log Analytics agent and Azure diagnostic extension.

| Destination | Description | Reference |
|:---|:---|:---|
| Azure Monitor Logs | The Azure Monitor agent allows you to collect logs from data sources that you configure using [data collection rules](agents/data-collection-rule-azure-monitor-agent.md) or from monitoring solutions that provide additional insights into applications running on the machine. These can be sent to one or more Log Analytics workspaces. | [Data sources and destinations](agents/azure-monitor-agent-overview.md#data-sources-and-destinations) |
| Azure Monitor Metrics (preview) | The Azure Monitor agent allows you to collect performance counters and send them to Azure Monitor metrics database  | [Data sources and destinations](agents/azure-monitor-agent-overview.md#data-sources-and-destinations) |


### Log Analytics agent 
[Install the Log Analytics agent](agents/log-analytics-agent.md) for comprehensive monitoring and management of your Windows or Linux virtual machines. The virtual machine can be running in Azure, another cloud, or on-premises. The Log Analytics agent is still supported but has been replaced by the Azure Monitor agent. 

| Destination | Description | Reference |
|:---|:---|:---|
| Azure Monitor Logs | The Log Analytics agent connects to Azure Monitor either directly or through System Center Operations Manager and allows you to collect data from data sources that you configure or from monitoring solutions that provide additional insights into applications running on the virtual machine. | [Agent data sources in Azure Monitor](agents/agent-data-sources.md)<br>[Connect Operations Manager to Azure Monitor](agents/om-agents.md) |

### Azure diagnostic extension
Enabling the Azure diagnostics extension for Azure Virtual machines allows you to collect logs and metrics from the guest operating system of Azure compute resources including Azure Cloud Service (classic) Web and Worker Roles, Virtual Machines, Virtual Machine Scale Sets, and Service Fabric.

| Destination | Description | Reference |
|:---|:---|:---|
| Storage | Azure diagnostics extension always writes to an Azure Storage account. | [Install and configure Azure diagnostics extension (WAD)](agents/diagnostics-extension-windows-install.md)<br>[Use Linux Diagnostic Extension to monitor metrics and logs](../virtual-machines/extensions/diagnostics-linux.md) |
| Azure Monitor Metrics (preview) | When you configure the Diagnostics Extension to collect performance counters, they are written to the Azure Monitor metrics database. | [Send Guest OS metrics to the Azure Monitor metric store using a Resource Manager template for a Windows virtual machine](essentials/collect-custom-metrics-guestos-resource-manager-vm.md) |
| Event Hubs | Configure the Diagnostics Extension to stream the data to other locations using Event Hubs.  | [Streaming Azure Diagnostics data by using Event Hubs](agents/diagnostics-extension-stream-event-hubs.md)<br>[Use Linux Diagnostic Extension to monitor metrics and logs](../virtual-machines/extensions/diagnostics-linux.md) |
| Application Insights Logs | Collect logs and performance counters from the compute resource supporting your application to be analyzed with other application data. | [Send Cloud Service, Virtual Machine, or Service Fabric diagnostic data to Application Insights](agents/diagnostics-extension-to-application-insights.md) |


### VM insights 
[VM insights](vm/vminsights-overview.md) provides a customized monitoring experience for virtual machines providing features beyond core Azure Monitor functionality. It requires a Dependency Agent on Windows and Linux virtual machines that integrates with the Log Analytics agent to collect discovered data about processes running on the virtual machine and external process dependencies.

| Destination | Description | Reference |
|:---|:---|:---|
| Azure Monitor Logs | Stores data about processes and dependencies on the agent. | [Using VM insights Map to understand application components](vm/vminsights-maps.md) |



## Application Code
Detailed application monitoring in Azure Monitor is done with [Application Insights](/azure/application-insights/), which collects data from applications running on various platforms. The application can be running in Azure, another cloud, or on-premises.


:::image type="content" source="media/data-sources/applications.png" lightbox="media/data-sources/applications.png" alt-text="Diagram that shows application data collection." border="false":::


### Application data
When you enable Application Insights for an application by installing an instrumentation package, it collects metrics and logs related to the performance and operation of the application. Application Insights stores the data it collects in the same Azure Monitor data platform used by other data sources. It includes extensive tools for analyzing this data, but you can also analyze it with data from other sources using tools such as Metrics Explorer, Log Analytics, and Change Analysis.

| Destination | Description | Reference |
|:---|:---|:---|
| Azure Monitor Logs | Operational data about your application including page views, application requests, exceptions, and traces. | [Analyze log data in Azure Monitor](logs/log-query-overview.md) |
|                    | Dependency information between application components to support Application Map and telemetry correlation. | [Telemetry correlation in Application Insights](app/distributed-tracing-telemetry-correlation.md) <br> [Application Map](app/app-map.md) |
|            | Results of availability tests that test the availability and responsiveness of your application from different locations on the public Internet. | [Monitor availability and responsiveness of any web site](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) |
| Azure Monitor Metrics | Application Insights collects metrics describing the performance and operation of the application in addition to custom metrics that you define in your application into the Azure Monitor metrics database. | [Log-based and pre-aggregated metrics in Application Insights](app/pre-aggregated-metrics-log-metrics.md)<br>[Application Insights API for custom events and metrics](app/api-custom-events-metrics.md) |
| Azure Monitor Change Analysis | Change Analysis detects and provides insights on various types of changes in your application. | [Use Change Analysis in Azure Monitor](./change/change-analysis.md) |
| Azure Storage | Send application data to Azure Storage for archiving. | [Export telemetry from Application Insights](/previous-versions/azure/azure-monitor/app/export-telemetry) |
|            | Details of availability tests are stored in Azure Storage. Use Application Insights in the Azure portal to download for local analysis. Results of availability tests are stored in Azure Monitor Logs. | [Monitor availability and responsiveness of any web site](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) |
|            | Profiler trace data is stored in Azure Storage. Use Application Insights in the Azure portal to download for local analysis.  | [Profile production applications in Azure with Application Insights](app/profiler-overview.md) 
|            | Debug snapshot data that is captured for a subset of exceptions is stored in Azure Storage. Use Application Insights in the Azure portal to download for local analysis.  | [How snapshots work](app/snapshot-debugger.md#how-snapshots-work) |

## Insights
[Insights](monitor-reference.md) collect data to provide additional insights into the operation of a particular service or application. They may address resources in different application tiers and even multiple tiers.


### Container insights
[Container insights](containers/container-insights-overview.md) provides a customized monitoring experience for [Azure Kubernetes Service (AKS)](../aks/index.yml). It collects additional data about these resources described in the following table.

| Destination | Description | Reference |
|:---|:---|:---|
| Azure Monitor Logs | Stores monitoring data for AKS including inventory, logs, and events. Metric data is also stored in Logs in order to leverage its analysis functionality in the portal. | [Understand AKS cluster performance with Container insights](containers/container-insights-analyze.md) |
| Azure Monitor Metrics | Metric data is stored in the metric database to drive visualization and alerts. | [View container metrics in metrics explorer](containers/container-insights-analyze.md#view-container-metrics-in-metrics-explorer) |
| Azure Kubernetes Service | Provides direct access to your Azure Kubernetes Service (AKS) container logs (stdout/stderror), events, and pod metrics in the portal. | [How to view Kubernetes logs, events, and pod metrics in real-time](containers/container-insights-livedata-overview.md) |

### VM insights
[VM insights](vm/vminsights-overview.md) provides a customized experience for monitoring virtual machines. A description of the data collected by VM insights is included in the [Operating System (guest)](#operating-system-guest) section above.

## Custom sources
In addition to the standard tiers of an application, you may need to monitor other resources that have telemetry that can't be collected with the other data sources. For these resources, write this data to either Metrics or Logs using an Azure Monitor API.


:::image type="content" source="media/data-sources/custom.png" lightbox="media/data-sources/custom.png" alt-text="Diagram that shows custom data collection." border="false":::


| Destination | Method | Description | Reference |
|:---|:---|:---|:---|
| Azure Monitor Logs | Logs ingestion API | Collect log data from any REST client and store in Log Analytics workspace using a data collection rule. | [Logs ingestion API in Azure Monitor](logs/logs-ingestion-api-overview.md) |
|                    | Data Collector API | Collect log data from any REST client and store in Log Analytics workspace. | [Send log data to Azure Monitor with the HTTP Data Collector API (preview)](logs/data-collector-api.md) |
| Azure Monitor Metrics | Custom Metrics API | Collect metric data from any REST client and store in Azure Monitor metrics database. | [Send custom metrics for an Azure resource to the Azure Monitor metric store by using a REST API](essentials/metrics-store-custom-rest-api.md) |


## Other services
Other services in Azure write data to the Azure Monitor data platform. This allows you to analyze data collected by these services with data collected by Azure Monitor and apply the same analysis and visualization tools.

| Service | Destination | Description | Reference |
|:---|:---|:---|:---|
| [Microsoft Defender for Cloud](../security-center/index.yml) | Azure Monitor Logs | Microsoft Defender for Cloud stores the security data it collects in a Log Analytics workspace, which allows it to be analyzed with other log data collected by Azure Monitor.  | [Data collection in Microsoft Defender for Cloud](../security-center/security-center-enable-data-collection.md) |
| [Microsoft Sentinel](../sentinel/index.yml) | Azure Monitor Logs | Microsoft Sentinel stores the data it collects from different data sources in a Log Analytics workspace, which allows it to be analyzed with other log data collected by Azure Monitor.  | [Connect data sources](../sentinel/quickstart-onboard.md) |


## Next steps

- Learn more about the [types of monitoring data collected by Azure Monitor](data-platform.md) and how to view and analyze this data.
- List the [different locations where Azure resources store data](monitor-reference.md) and how you can access it.
