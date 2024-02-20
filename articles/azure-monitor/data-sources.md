---
title: Sources of data in Azure Monitor
description: Describes the data available to monitor the health and performance of your Azure resources and the applications running on them.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 15/20224

---

# Sources of monitoring data for Azure Monitor

Azure Monitor can collect data from a variety of sources, and different sources use difference collection methods and send data to different repositories in the Azure Monitor data platform. Different Azure Monitor features access different repositories, so it's important to not only understand how to collect data from the different sources in your environment, but you also need to understand where that data is stored so you know your options for analyzing it.

This article describes common sources of monitoring data collected by Azure Monitor. Links are provided to detailed information on configuration required to collect this data to different locations.

:::image type="content" source="media/overview/overview-simple-20230707-opt.svg" alt-text="Diagram that shows an overview of Azure Monitor with data sources on the left sending data to a central data platform and features of Azure Monitor on the right that use the collected data." border="false" lightbox="media/overview/overview-blowout-20230707-opt.svg":::


| Data source | Data type | Description | Data platform destinations and collection method |
|:---|:---|:---|:---|
| Azure resources | [Activity log](essentials/activity-log.md) | Provides insight into subscription-level events for Azure services including service health records and configuration changes. | Collected automatically. View in the Azure portal or create a diagnostic setting to send it to other destinations including[Azure Monitor Logs](essentials/activity-log.md), [Azure Storage](essentials/resource-logs.md#send-to-azure-storage), [Event Hubs](essentials/resource-logs.md#send-to-azure-event-hubs). |
| | Platform metrics | Numerical values that are automatically collected at regular intervals for different aspects of a resource. | Collected automatically and stored in [Azure Monitor Metrics](./essentials/data-platform-metrics.md). View in metrics explorer or create a diagnostic setting to send it to other destinations including Log Analytics workspace, Azure Storage, Event Hubs. |
| | [Resource logs](essentials/resource-logs.md) | Provide insight into operations that were performed within an Azure resource. The content of resource logs varies by the Azure service and resource type.  | Create a diagnostic setting to send it to other destinations including[Azure Monitor Logs](essentials/activity-log.md), [Azure Storage](essentials/resource-logs.md#send-to-azure-storage), [Event Hubs](essentials/resource-logs.md#send-to-azure-event-hubs).|
| Microsoft Entra | Audit logs<br>Sign-in logs<br>Provisioning logs | History of sign-in activity and audit trail of changes made within a particular tenant.<br>Information about sign-ins and how your resources are used by your users.<br>Activities performed by the provisioning service, such as the creation of a group in ServiceNow or a user imported from Workday. | Collected automatically. View in the Azure portal or create a diagnostic setting to send it to other destinations  [Log Analytics workspace](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md), [Azure Storage](../active-directory/reports-monitoring/quickstart-azure-monitor-route-logs-to-storage-account.md), [Event Hubs](../active-directory/reports-monitoring/tutorial-azure-monitor-stream-logs-to-event-hub.md). |
| Virtual machines | Events<br>Performance data | Azure virtual machines create the same activity logs and platform metrics as other Azure resources, but these are for the host and not the guest operating system running on the machine. To monitor the workloads running on the virtual machine, you require such telemetry as Windows and Syslog events, performance data, service and deamon details, and  | To gather this information, you require the Azure Monitor agent, which can run on both Azure virtual machines and Arc-enabled servers. | 
| Kubernetes cluster | Metrics | | |
| | Logs | | |
| Custom sources | Logs | In addition to the standard tiers of an application, you may need to monitor other resources that have telemetry that can't be collected with the other data sources. For these resources, write this data to either Metrics or Logs using an Azure Monitor API. | [Logs ingestion API in Azure Monitor](logs/logs-ingestion-api-overview.md) |
| | Metrics | | [Send custom metrics for an Azure resource to the Azure Monitor metric store by using a REST API](essentials/metrics-store-custom-rest-api.md) |


| Destination | Method | Description | Reference |
|:---|:---|:---|:---|
| Azure Monitor Logs | Logs ingestion API | Collect log data from any REST client and store in Log Analytics workspace using a data collection rule. | [Logs ingestion API in Azure Monitor](logs/logs-ingestion-api-overview.md) |




### Azure Monitor Change Analysis

[Change Analysis](./change/change-analysis.md) provides insights into your Azure application changes, increases observability, and reduces mean time to repair.

| Destination | Description | Reference |
| ----------- | ----------- | --------- |
| Azure Resource Manager control plane changes | Change Analysis provides a historical record of how the Azure resources that host your application have changed over time, using Azure Resource Graph | [Resources | Get Changes](../governance/resource-graph/how-to/get-resource-changes.md) |
| Resource configurations and settings changes | Change Analysis securely queries and computes IP Configuration rules, TLS settings, and extension versions to provide more change details in the app. | [Azure Resource Manager configuration changes](./change/change-analysis.md#azure-resource-manager-resource-properties-changes) |
| Web app in-guest changes | Every 30 minutes, Change Analysis captures the deployment and configuration state of an application. | [Diagnose and solve problems tool for Web App](./change/change-analysis-visualizations.md#diagnose-and-solve-problems-tool-for-web-app) |



### Platform metrics 
Most Azure services will send [platform metrics](essentials/data-platform-metrics.md) that reflect their performance and operation directly to the metrics database. The specific [metrics will vary for each type of resource](essentials/metrics-supported.md). 

| Destination | Description | Reference |
|:---|:---|:---|
| Azure Monitor Metrics | Platform metrics will write to the Azure Monitor metrics database with no configuration. Access platform metrics from Metrics Explorer.  | [Analyze metrics with Azure Monitor metrics explorer](essentials/analyze-metrics.md) <br>[Supported metrics with Azure Monitor](essentials/metrics-supported.md) |
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
|                    | Dependency information between application components to support Application Map and telemetry correlation. | [Telemetry correlation in Application Insights](app/distributed-trace-data.md) <br> [Application Map](app/app-map.md) |
|            | Results of availability tests that test the availability and responsiveness of your application from different locations on the public Internet. | [Monitor availability and responsiveness of any web site](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) |
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
