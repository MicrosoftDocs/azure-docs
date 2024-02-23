---
title: Sources of data in Azure Monitor
description: Describes the data available to monitor the health and performance of your Azure resources and the applications running on them.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 02/15/2024

---

# Sources of monitoring data for Azure Monitor

Azure Monitor can collect data from a variety of sources, and different sources use difference collection methods and send data to different repositories in the Azure Monitor data platform. Different Azure Monitor features access different repositories, so it's important to not only understand how to collect data from the different sources in your environment, but you also need to understand where that data is stored so you know your options for analyzing it.

This article describes common sources of monitoring data collected by Azure Monitor. Links are provided to detailed information on configuration required to collect this data to different locations.

:::image type="content" source="media/overview/overview-simple-20230707-opt.svg" alt-text="Diagram that shows an overview of Azure Monitor with data sources on the left sending data to a central data platform and features of Azure Monitor on the right that use the collected data." border="false" lightbox="media/overview/overview-blowout-20230707-opt.svg":::

> [!IMPORTANT]
> There is a cost for collecting and retaining most types of data in Azure Monitor. To minimize your cost, ensure that you don't collect any more data than you require and that your environment is configured to optimize your costs. See [Cost optimization in Azure Monitor](cost-optimization.md) for a summary of recommendations.

## Azure resources
Most resources in Azure generate similar monitoring data described in the following table. There may be additional data that can be collected from specific services by enabling other features of Azure Monitor. Regardless of the services your monitoring though, this table is a good place to start.

| Data type | Description | Data collection method |
|:---|:---|:---|
|  [Activity log](essentials/activity-log.md) | Provides insight into subscription-level events for Azure services including service health records and configuration changes. | Collected automatically. View in the Azure portal or create a diagnostic setting to send it to other destinations including [Azure Monitor Logs](essentials/activity-log.md), [Azure Storage](essentials/resource-logs.md#send-to-azure-storage), [Event Hubs](essentials/resource-logs.md#send-to-azure-event-hubs). |
| [Platform metrics](essentials/data-platform-metrics.md) | Numerical values that are automatically collected at regular intervals for different aspects of a resource. The specific [metrics will vary for each type of resource](essentials/metrics-supported.md).  | Collected automatically and stored in [Azure Monitor Metrics](./essentials/data-platform-metrics.md). View in metrics explorer or create a diagnostic setting to send it to other destinations including Log Analytics workspace, Azure Storage, Event Hubs. |
| [Resource logs](essentials/resource-logs.md) | Provide insight into operations that were performed within an Azure resource. The content of resource logs varies by the Azure service and resource type. See [Supported services, schemas, and categories for Azure resource logs](essentials/resource-logs-schema.md) for details on each service and links to detailed configuration procedures.  | Create a diagnostic setting to send it to other destinations including[Azure Monitor Logs](essentials/activity-log.md), [Azure Storage](essentials/resource-logs.md#send-to-azure-storage), [Event Hubs](essentials/resource-logs.md#send-to-azure-event-hubs).|


## Microsoft Entra 

| Data type | Description | Data collection method |
|:---|:---|:---|
| Audit logs | History of sign-in activity and audit trail of changes made within a particular tenant. | Collected automatically. View in the Azure portal or create a diagnostic setting to send it to other destinations  [Log Analytics workspace](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md), [Azure Storage](../active-directory/reports-monitoring/quickstart-azure-monitor-route-logs-to-storage-account.md), [Event Hubs](../active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md). |
| Sign-in logs | Information about sign-ins and how your resources are used by your users. | Collected automatically. View in the Azure portal or create a diagnostic setting to send it to other destinations  [Log Analytics workspace](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md), [Azure Storage](../active-directory/reports-monitoring/quickstart-azure-monitor-route-logs-to-storage-account.md), [Event Hubs](../active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md). |
| Provisioning logs | Activities performed by the provisioning service, such as the creation of a group in ServiceNow or a user imported from Workday. | Collected automatically. View in the Azure portal or create a diagnostic setting to send it to other destinations  [Log Analytics workspace](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md), [Azure Storage](../active-directory/reports-monitoring/quickstart-azure-monitor-route-logs-to-storage-account.md), [Event Hubs](../active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md). |

## Virtual machines
Azure virtual machines and Arc-enabled servers create the same activity logs and platform metrics as other Azure resources, but these are for the host and not the guest operating system running on the machine. To gather this information, you require the [Azure Monitor agent](./agents/agents-overview.md) or [SCOM Managed Instance](./vm/scom-managed-instance-overview.md). The following table includes the most common data to collect from VMs. See [Monitor virtual machines with Azure Monitor: Collect data](./vm/monitor-virtual-machine-data-collection.md) for a more complete description of the different kinds of data you can collect from virtual machines.

| Data type | Description | Data collection method |
|:---|:---|:---|
| Client Events | Logs for the client operating system and different applications. Includes the Windows event log and Syslog on Linux machines. | Deploy the Azure Monitor agent (AMA) and create a data collection rule (DCR) to send data to Log Analytics workspace.<br><br>Enable SCOM MI and deploy required management packs. |
| Client Performance data |  | Deploy the Azure Monitor agent (AMA) and create a data collection rule (DCR) to send data to Azure Monitor Metrics and/or Log Analytics workspace.<br><br>Enable WM insights to send predefined aggregated performance data to Log Analytics workspace.<br><br>Enable SCOM MI and deploy required management packs. |
| Processes and dependencies | Details about processes running on the machine and their dependencies on other machines and external services. Enables the [map feature in VM insights](vm/vminsights-maps.md). | Enable VM insights on the machine with the *processes and dependencies* option. See [Enable VM Insights overview](./vm/vminsights-enable-overview.md) for installation options. |
| Management pack data | If you have an existing investment in SCOM, you can migrate to the cloud while retaining your investment in existing management packs using [SCOM MI](./vm/scom-managed-instance-overview.md). | SCOM MI stores data collected by management packs in an instance of SQL MI. See [Configure Log Analytics for Azure Monitor SCOM Managed Instance](/system-center/scom/configure-log-analytics-for-scom-managed-instance) to send this data to a Log Analytics workspace. |

## Kubernetes cluster

| Data type | Description | Data collection method |
|:---|:---|:---|
| Cluster Metrics |  | Enable managed Prometheus for the cluster to send cluster metrics to an [Azure Monitor workspace](./essentials/azure-monitor-workspace-overview.md). See [Enable monitoring for Kubernetes clusters](./containers/kubernetes-monitoring-enable.md). |
| Logs |  | Enable Container insights for the cluster to send container logs to a Log Analytics workspace. See [Enable monitoring for Kubernetes clusters](./containers/kubernetes-monitoring-enable.md). |


## Custom sources
For any monitoring data that you can't collect with the other methods described in this article, you can use that APIs in the following table to send data to Azure Monitor.

| Data type | Description | Data collection method |
|:---|:---|:---|
| Logs | Collect log data from any REST client and store in Log Analytics workspace. | Create a data collection rule to define destination workspace and any data transformations. See [Logs ingestion API in Azure Monitor](logs/logs-ingestion-api-overview.md). |
| Metrics | Collect custom metrics for Azure resources from any REST client. | See [Send custom metrics for an Azure resource to the Azure Monitor metric store by using a REST API](essentials/metrics-store-custom-rest-api.md). |




## Application Code
Detailed application monitoring in Azure Monitor is done with [Application Insights](/azure/application-insights/), which collects data from applications running on various platforms in Azure, another cloud, or on-premises. When you enable Application Insights for an application, it collects metrics and logs related to the performance and operation of the application. Application Insights stores the data it collects in the same Azure Monitor data platform used by other data sources and includes extensive tools for analyzing this data beyond the standard tools such as Metrics Explorer and Log Analytics.


| Data type | Description | Data collection method |
|:---|:---|:---|
| Logs | Operational data about your application including page views, application requests, exceptions, and traces. Also includes dependency information between application components to support Application Map and telemetry correlation. |  |
| Metrics | |
| Performance traces |  |




| Destination | Description | Reference |
|:---|:---|:---|
| Azure Monitor Logs |  | [Analyze log data in Azure Monitor](logs/log-query-overview.md) |
|                    |  | [Telemetry correlation in Application Insights](app/distributed-trace-data.md) <br> [Application Map](app/app-map.md) |
| Azure Monitor Metrics | Application Insights collects metrics describing the performance and operation of the application in addition to custom metrics that you define in your application into the Azure Monitor metrics database. | [Log-based and pre-aggregated metrics in Application Insights](app/pre-aggregated-metrics-log-metrics.md)<br>[Application Insights API for custom events and metrics](app/api-custom-events-metrics.md) |
| Azure Monitor Change Analysis | Change Analysis detects and provides insights on various types of changes in your application. | [Use Change Analysis in Azure Monitor](./change/change-analysis.md) |
| Azure Storage | Send application data to Azure Storage for archiving. | [Export telemetry from Application Insights](/previous-versions/azure/azure-monitor/app/export-telemetry) |
|            | Details of availability tests are stored in Azure Storage. Use Application Insights in the Azure portal to download for local analysis. Results of availability tests are stored in Azure Monitor Logs. | [Monitor availability and responsiveness of any web site](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) |
|            | Profiler trace data is stored in Azure Storage. Use Application Insights in the Azure portal to download for local analysis.  | [Profile production applications in Azure with Application Insights](app/profiler-overview.md) 
|            | Debug snapshot data that is captured for a subset of exceptions is stored in Azure Storage. Use Application Insights in the Azure portal to download for local analysis.  | [How snapshots work](app/snapshot-debugger.md#how-snapshots-work) |




## Custom sources
In addition to the standard tiers of an application, you may need to monitor other resources that have telemetry that can't be collected with the other data sources. For these resources, write this data to either Metrics or Logs using an Azure Monitor API.


| Destination | Method | Description | Reference |
|:---|:---|:---|:---|
| Azure Monitor Logs | Logs ingestion API | Collect log data from any REST client and store in Log Analytics workspace using a data collection rule. | [Logs ingestion API in Azure Monitor](logs/logs-ingestion-api-overview.md) |
| Azure Monitor Metrics | Custom Metrics API | Collect metric data from any REST client and store in Azure Monitor metrics database. | [Send custom metrics for an Azure resource to the Azure Monitor metric store by using a REST API](essentials/metrics-store-custom-rest-api.md) |


## Other services
Other services in Azure write data to the Azure Monitor data platform. This allows you to analyze data collected by these services with data collected by Azure Monitor and apply the same analysis and visualization tools.

| Service | Destination | Description | Reference |
|:---|:---|:---|:---|
| [Microsoft Defender for Cloud](../security-center/index.yml) | Azure Monitor Logs | Microsoft Defender for Cloud stores the security data it collects in a Log Analytics workspace, which allows it to be analyzed with other log data collected by Azure Monitor.  | [Data collection in Microsoft Defender for Cloud](../security-center/security-center-enable-data-collection.md) |
| [Microsoft Sentinel](../sentinel/index.yml) | Azure Monitor Logs | Microsoft Sentinel stores the data it collects from different data sources in a Log Analytics workspace, which allows it to be analyzed with other log data collected by Azure Monitor.  | [Connect data sources](../sentinel/quickstart-onboard.md) |


## Next steps

- Learn more about the [types of monitoring data collected by Azure Monitor](data-platform.md) and how to view and analyze this data.
