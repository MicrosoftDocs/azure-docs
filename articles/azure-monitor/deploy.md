---
title: Deploy Azure Monitor
description: Describes the different steps required for a complete implementation of Azure Monitor to monitor all of the resources in your Azure subscription.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/27/2020

---

# Deploy Azure Monitor
Enabling Azure Monitor for monitoring of all your Azure resources is a combination of configuring Azure Monitor components to support particular features, and configuring Azure resources to generate monitoring data for Azure Monitor to collect. This article describes the different steps required for a complete implementation of Azure Monitor to monitor all of the resources in your Azure subscription. Basic descriptions for each step are provided with links to other documentation for detailed configuration requirements.

> [!IMPORTANT]
> The features of Azure Monitor and their configuration will vary depending on your business requirements balanced with the cost of the enabled features. Each step below will identify whether there is potential cost, and you should assess these costs before proceeding with that step. See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) for complete pricing details.

## Configuration goals
As you enable features in Azure Monitor, data will be sent to either [Azure Monitor Metrics](platform/data-platform-metrics.md) or [Azure Monitor Logs](platform/data-platform-logs.md). Each stores different kinds of data and enables different kinds of analysis and alerting. See [Compare Azure Monitor Metrics and Logs](platform/data-platform.md) for a comparison of the two and [Overview of alerts in Microsoft Azure](platform/alerts-overview.md) for a description of different alert types. 

Some data can be sent to both Metrics and Logs in order to leverage it using different features. In these cases, you may need to configure each separately. For example, metric data is automatically sent by Azure resources to Metrics, which supports metrics explorer and metric alerts. You have to create a diagnostic setting for each resource to send that same metric data to Logs, which allows you to analyze performance trends with other log data using Log Analytics. The sections below identify where data is sent and includes each step required to send data to all possible locations.

## Collect data from Azure resources

> [!NOTE]
> See [Monitoring Azure resources with Azure Monitor](insights/monitor-azure-resource.md) for a complete guide on monitoring virtual machines with Azure Monitor.

Some monitoring of Azure resources is available automatically with no configuration required, while you must perform configuration steps to collect additional monitoring data. The following table illustrates the configuration steps required to collect all available data from your Azure resources, including at which step different data is collected into Azure Monitor Metrics and Azure Monitor Logs. The sections below describe each step in further detail.

![Deploy Azure resource monitoring](media/deploy/deploy-azure-resources.png)

### No configuration
The following features of Azure Monitor are enabled out of the box with no configuration required when you create an Azure subscription. There is no cost associated with this monitoring.

#### Activity log
The [Activity log](platform/platform-logs-overview.md) provides insight into subscription-level events that have occurred in Azure. Events are automatically written to the Activity log when you create a new Azure resource, modify a resource, or perform a significant activity. You can view events in the Azure portal and create Activity log alerts when particular events are created. See [Azure Activity log](platform/activity-log.md) for details of the Activity log and how to view it in the Azure portal.

When you configure the Activity log to also be collected to a Log Analytics workspace, it enables you to analyze these events with other log data using log queries in Log Analytics and create log query alerts which provide more complex logic than Activity log alerts. See below for collecting the Activity log into a Log Analytics workspace.

#### Platform metrics
[Platform metrics](platform/metrics-supported.md) are collected automatically from Azure services into [Azure Monitor Metrics](platform/data-platform-metrics.md). This data is often presented on the **Overview** page in the Azure portal for different services. Metrics can be analyzed using [Metrics explorer](platform/metrics-getting-started.md) and can also be used for [metrics alerts](platform/alerts-metric-overview.md). 

When you configure platform metrics to also be collected to a Log Analytics workspace, it enables you to perform more complex analysis such as trending over time with other log data using log queries in Log Analytics. You can also retain the data for longer than 93 days which is the limit for Azure Monitor Metrics. See below for collecting platform metrics into a Log Analytics workspace.


### Create Log Analytics workspace
You require at least one [Log Analytics workspace](platform/design-logs-deployment.md) to enable [Azure Monitor Logs](platform/data-platform-logs.md), which is required for collecting logs from Azure resources, collecting data from the guest operating system of Azure virtual machines, and for most Azure Monitor insights. Other services such as Azure Sentinel and Azure Security Center also use a Log Analytics workspace and can share the same one that you use for Azure Monitor. You can start with a single workspace to support this monitoring, but see  [Designing your Azure Monitor Logs deployment](platform/design-logs-deployment.md) for guidance on when to use multiple workspaces.


There is no cost for creating a Log Analytics workspace, but there is a potential charge once you configure data to be collected into it. See [Manage usage and costs with Azure Monitor Logs](platform/manage-cost-storage.md) for details. See [Create a Log Analytics workspace in the Azure portal](learn/quick-create-workspace.md) to create an initial Log Analytics workspace. See [Manage access to log data and workspaces in Azure Monitor](platform/manage-access.md) to configure access to the workspace.
 

### Create diagnostic setting to collect Activity log into Logs
While the [Activity log](platform/platform-logs-overview.md) is collected automatically, you should configure it to also send events to your Log Analytics workspace, which enables you to analyze these events with other log data using log queries in Log Analytics and to create log query alerts which provide more complex logic than Activity log alerts. You can also configure the Activity log to send to Event Hubs if you require your monitoring data to be sent outside of Azure Monitor, such as to an external incident management system.

Create a [diagnostic setting](platform/diagnostic-settings.md) for your subscription to send Activity log entries to your Log Analytics workspace or to an event hub. There's no cost for this collection. See [Create diagnostic settings in Azure portal](platform/diagnostic-settings.md#create-in-azure-portal) for details.


### Create diagnostic setting to collect resource logs and platform metrics
Resources in Azure automatically generate [resource logs](platform/platform-logs-overview.md) that provide details of operations performed within the resource. Unlike platform metrics though, you need to configure resource logs to be collected. Collect them into a Log Analytics workspace to combine it with the other data used with Azure Monitor Logs and to Event Hubs if you require your data sent outside of Azure Monitor, such as to an external incident management system.

Create a [diagnostic setting](platform/diagnostic-settings.md) on each resource to collect its resource logs. Use the same diagnostic setting to send platform metrics for each resource to the same Log Analytics workspace, which allows you to analyze metrics and logs together using log queries. There is a cost for this collection so refer to [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) and [Event Hubs pricing](https://azure.microsoft.com/pricing/details/event-hubs/) before implementing across a significant number of resources. Also see [Manage usage and costs with Azure Monitor Logs](platform/manage-cost-storage.md) for details on optimizing the cost of your log collection.

See [Create diagnostic setting to collect resource logs and metrics in Azure](platform/diagnostic-settings.md#create-in-azure-portal) for details on creating a diagnostic setting. Since a diagnostic setting needs to be created for each Azure resource, see [Deploy Azure Monitor at scale](deploy-scale.md) for details on using [Azure policy](../governance/policy/overview.md) to have settings automatically created each time an Azure resource is created. 


### Enable insights and solutions
Insights and solutions provide monitoring for a particular service or solution. Insights use more recent features of Azure Monitor such as workbooks, so you will most likely use an insight if it's available for your service. If not, then install the solution which will still provide you with significant value beyond the standard features of Azure Monitor.

See [What is monitored by Azure Monitor?](monitor-reference.md) for a list of available insights and solutions.

#### Insights
Insights are automatically available in every Azure subscription. They will typically be enabled for each instance of their resource, using platform metrics and resources logs that you previously configured. Some insights may require some configuration for full functionality. 

For example, Azure Monitor for Key Vaults (preview) is automatically enabled for all key vaults using data from platform metrics that are automatically collected for all Azure resources. You can enable additional functionality though by creating a diagnostic settings for each key vault to collect its resource logs into a Log Analytics workspace.

There is no cost for most insights although you will be charged for any data that they ingest. See the documentation for each insight for any unique configuration or pricing information.

#### Solutions
Solutions must be added to a Log Analytics workspace. If you have multiple workspaces in your subscription, then you may need to enable the solution in each workspace with data to evaluate. Solutions may work with existing data or may collect additional data.

There is no cost to solutions although you will be charged for any data that they ingest.

See [Install a monitoring solution](insights/solutions.md#install-a-monitoring-solution) for details.


## Collect data from virtual machines

> [!NOTE]
> See [Monitoring Azure virtual machines with Azure Monitor](insights/monitor-vm-azure.md) for a complete guide on monitoring virtual machines with Azure Monitor. 

While platform metrics and the Activity log are collected automatically for each virtual machine host just like any other Azure resource, you need agents to collect data from the guest operating system. See [Overview of Azure Monitor agents](platform/agents-overview.md) for a comparison of the agents used by Azure Monitor. [Azure Monitor for VMs](insights/vminsights-overview.md) uses the Log Analytics agent and Dependency agent to collect data from the guest operating system of virtual machines and provide tools for using this data to analyze their health and performance. 


![Deploy Azure VM](media/deploy/deploy-azure-vm.png)

### Configure workspace for Azure Monitor for VMs
Azure Monitor for VMs requires a Log Analytics workspace which will typically be the same workspace as the one created to collect data from other Azure resources. Before you onboard any virtual machines, you must configure it for Azure Monitor for VMs. See [Enable Azure Monitor for VMs overview](insights/vminsights-enable-overview.md) for details.
 

### Enable Azure Monitor for VMs on each VM
Once a workspace has been enabled, you can onboard each virtual machine by installing the Log Analytics agent and Dependency agent. There are multiple methods for installing these agents including Azure Policy which allows you automatically configure each virtual machine as it's created. See [Enable Azure Monitor for VMs overview](insights/vminsights-enable-overview.md) for details.


### Configure workspace to collect events
Azure Monitor for VMs will collect performance data and the details and dependencies of processes from the guest operating system of each virtual machine. The Log Analytics agent can also collect logs from the guest including the event log from Windows and syslog from Linux. It retrieves the configuration for these logs from the Log Analytics workspace it's connected to. You only need to configure the workspace once, and each time an agent connects, it will download any configuration changes. 

See [Agent data sources in Azure Monitor](platform/agent-data-sources.md) for details on this configuration and the data sources that can be collected.

### Diagnostic extension and Telegraf agent
Azure Monitor for VMs will collect performance data to a Log Analytics workspace but not to Azure Monitor Metrics. Collecting this data into Metrics allow it to be analyzed with Metrics Explorer and used with metric alerts. This requires the diagnostic extension on Windows and the Telegraf agent on Linux.

See [Install and configure Windows Azure diagnostics extension (WAD)](platform/diagnostics-extension-windows-install.md) and [Collect custom metrics for a Linux VM with the InfluxData Telegraf agent](platform/collect-custom-metrics-linux-telegraf.md) for details.



## Monitor applications
Monitoring of your custom applications is performed by Azure Monitor using [Application Insights](app/app-insights-overview.md), which you must configure for each application you want to monitor. The configuration process will vary depending on the type of application being monitored and the type of monitoring that you want to perform. Data collected by Application Insights is stored in Azure Monitor Metrics, Azure Monitor Logs, and Azure blob storage, depending on the feature.

### Create an application resource
You must create a resource in Application Insights for each application that you're going to monitor. Log data collected by Application Insights is stored in Azure Monitor Logs but is separate from your Log Analytics workspace as described in [How is data in Azure Monitor Logs structured?](platform/data-platform-logs.md#how-is-data-in-azure-monitor-logs-structured). Currently in preview though is the ability to store your application data directly in a Log Analytics workspace with your other data. This simplifies your configuration and allows your application to take advantage of all the features of a Log Analytics workspace.

 When you create the application, you must select whether to use classic or workspace-based (preview). See [Create an Application Insights resource](app/create-new-resource.md) to create a classic application. 
See [Workspace-based Application Insights resources (preview)](app/create-workspace-resource.md) to create a workspace-based application.

### Configure codeless or code-based monitoring
To enable monitoring for an application, you must decide whether you will use codeless or code-based monitoring. The configuration process will vary depending on this decision and the type of application you're going to monitor.

**Codeless monitoring** is easiest to implement and can be configured after your code development. It doesn't require any updates to your code. See the following resources for details depending on the your application.

- [Applications hosted on Azure Web Apps](app/azure-web-apps.md)
- [Java applications](app/java-in-process-agent.md)
- [ASP.NET applications hosted in IIS on Azure VM or Azure virtual machine scale set](app/azure-vm-vmss-apps.md)
- [ASP.NET applications hosted in IIS on-premises VM](app/monitor-performance-live-website-now.md)


**Code-based monitoring** is more customizable and collects additional telemetry, but it requires adding a dependency to your code on the Application Insights SDK NuGet packages. See the following resources for details depending on your application.

- [ASP.NET Applications](app/asp-net.md)
- [ASP.NET Core Applications](app/asp-net-core.md)
- [.NET Console Applications](app/console.md)
- [Java](app/java-get-started.md)
- [Node.js](app/nodejs.md)
- [Python](app/opencensus-python.md)
- [Other platforms](app/platforms.md)

### Configure availability testing
Availability tests in Application Insights are recurring tests that monitor the availability and responsiveness of your application at regular intervals from points around the world. You can create a simple ping test for free or create a sequence of web requests to simulate user transactions which has associated cost. See [Monitor the availability of any website](app/monitor-web-app-availability.md) for summary of the different kinds of test and details on creating them.

### Configure Profiler
Profiler in Application Insights provides performance traces for .NET applications. It helps you identify the "hot" code path that takes the longest time when it's handling a particular web request. The process for configuring the profiler varies depending on the type of application. See [Profile production applications in Azure with Application Insights](app/profiler-overview.md) for details.

### Configure Snapshot Debugger
Snapshot Debugger in Application Insights monitors exception telemetry from your .NET application and collects snapshots on your top-throwing exceptions so that you have the information you need to diagnose issues in production. The process for configuring Snapshot Debugger varies depending on the type of application. See [Debug snapshots on exceptions in .NET apps](app/snapshot-debugger.md) for details.


## Visualize data
Insights and solutions will include their own workbooks and view for analyzing their data. You can create your own [visualizations using different methods](visualizations.md).

### Workbooks
[Workbooks](platform/workbooks-overview.md) in Azure Monitor allow you to create rich visual reports in the Azure portal. You can combine different sets of metric and log data collected in Azure Monitor to create unified interactive experiences. Insights include pre-built workbooks, and you can access a gallery of workbooks in the **Workbooks** tab of the Azure Monitor menu. See [Azure Monitor Workbooks](platform/workbooks-overview.md) for details on creating custom workbooks.

### Dashboards
[Azure dashboards](../azure-portal/azure-portal-dashboards.md) are the primary dashboarding technology for Azure and allow you to combine Azure Monitor data with data from other services to provide a single pane of glass over your Azure infrastructure. See [Create and share dashboards of Log Analytics data](learn/tutorial-logs-dashboards.md) for details on creating a dashboard that includes data from Azure Monitor Logs. See [Create custom KPI dashboards using Azure Application Insights](learn/tutorial-app-dashboards.md) for details on creating a dashboard that includes data from Application Insights. 

## Create alert rules
Alerts in Azure Monitor proactively notify you of important data or patterns identified in your monitoring data. [Alert rules](platform/alerts-overview.md) include the data to analyze, the criteria for when to generate and alert, and what actions to take. 


### Action groups
[Action groups](platform/action-groups.md) are a collection of notification preferences used by alert rules to determine the action to perform when an alert is triggered. Examples of actions include sending a mail or text, calling a webhook, or send data to an ITSM tool. Each alert rule requires at least one action group, and a single action group can be used by multiple alert rules.

See [Create and manage action groups in the Azure portal](platform/action-groups.md) for details on creating an action group and a description of the different actions it can include.


### Alert rules
There are multiple types of alert rules defined by the type of data that they use. Each has different capabilities, and a different cost. The basic strategy you should follow is to use the alert rule type with the lowest cost that provides the logic that you require.

- [Activity log rules](platform/activity-log-alerts.md). Creates an alert in response to a new Activity log event that matches specified conditions. There is no cost to these alerts so they should be your first choice. See [Create, view, and manage activity log alerts by using Azure Monitor](platform/alerts-activity-log.md) for details on creating an Activity log alert.
- [Metric alert rules](platform/alerts-metric-overview.md). Creates an alert in response to one or more metric values exceeding a threshold. Metric alerts are stateful meaning that the alert will automatically close when the value drops below the threshold, and it will only send out notifications when the state changes. There is a cost to metric alerts, but this is significantly less than log alerts. See [Create, view, and manage metric alerts using Azure Monitor](platform/alerts-metric.md) for details on creating a metric alert.
- [Log alert rules](platform/alerts-unified-log.md). Creates an alert when the results of a schedule query matches specified criteria. They are the most expensive of the alert rules, but they allow the most complex criteria. See [Create, view, and manage log alerts using Azure Monitor](platform/alerts-log.md) for details on creating a log query alert.
- [Application alerts](app/monitor-web-app-availability.md) allow you to perform proactive performance and availability testing of your web application. You can perform a simple ping test at no cost, but there is a cost to more complex testing. See [Monitor the availability of any website](app/monitor-web-app-availability.md) for a description of the different tests and details on creating them.


## Next steps

- See [Deploy Azure Monitor at scale using Azure Policy](deploy-scale.md).
