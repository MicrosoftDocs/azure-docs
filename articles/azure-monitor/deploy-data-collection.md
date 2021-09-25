---
title: Deploy Azure Monitor
description: Describes the different steps required for a complete implementation of Azure Monitor to monitor all of the resources in your Azure subscription.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/27/2020

---

# Deploying Azure Monitor - Configure data collection
This article describes the different steps required for a complete implementation of Azure Monitor using a common configuration to monitor all of the resources in your Azure subscription. Basic descriptions for each step are provided with links to other documentation for detailed configuration requirements.


> [!IMPORTANT]
> The features of Azure Monitor and their configuration will vary depending on your business requirements balanced with the cost of the enabled features. Each step below will identify whether there is potential cost, and you should assess these costs before proceeding with that step. See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) for complete pricing details.
> 
## Create diagnostic setting to collect tenant and subscription logs
While the [Azure Active Directory logs](../active-directory/reports-monitoring/overview-reports.md) for your tenant and the [Activity log](essentials/platform-logs-overview.md) for your subscription are collected automatically, sending them to a Log Analytics workspace enables you to analyze these events with other log data using log queries in Log Analytics. This also allows you to create log query alerts which is the only way to alert on Azure Active Directory logs and provide more complex logic than Activity log alerts.

There's no cost for sending the Activity log to a workspace, but there is a data ingestion and retention charge for Azure Active Directory logs. 

See [Integrate Azure AD logs with Azure Monitor logs](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md) and [Create diagnostic settings to send platform logs and metrics to different destinations](essentials/diagnostic-settings.md) to create a diagnostic setting for your tenant and subscription to send log entries to your Log Analytics workspace. 

See [Create diagnostic setting to collect resource logs and metrics in Azure](essentials/diagnostic-settings.md#create-in-azure-portal) to create a diagnostic setting for an Azure resource. Since a diagnostic setting needs to be created for each Azure resource, see [Deploy Azure Monitor at scale](deploy-scale.md) for details on using [Azure Policy](../governance/policy/overview.md) to have settings automatically created each time an Azure resource is created.



## Create diagnostic setting to collect resource logs and platform metrics
Resources in Azure automatically generate [resource logs](essentials/platform-logs-overview.md) that provide details of operations performed within the resource. Unlike platform metrics though, you need to configure resource logs to be collected. Create a diagnostic setting to send them to a Log Analytics workspace to combine them with the other data used with Azure Monitor Logs. The same diagnostic setting can be used to also send the platform metrics for most resources to the same workspace, which allows you to analyze metric data using log queries with other collected data.

There is a cost for this collection so refer to [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) before implementing across a significant number of resources. Also see [Manage usage and costs with Azure Monitor Logs](logs/manage-cost-storage.md) for details on optimizing the cost of your log collection.


## Onboard at scale
Although some Azure Monitor features are configured once or a limited number of times, such creating a Log Analytics workspace or configuring a data collection rule, others must be repeated for each resource that you want to monitor. In addition to performing this configuration quickly for existing resources, you should have the expectation that monitoring is automatically configured for any new resources as they're created.

The tasks that will require at-scale configuration include the following:

- Diagnostic settings to collect resource logs from Azure resources.
- Agent deployment and configuration for virtual machines.

Each of these tasks can be performed for existing resources using command line methods including PowerShell and CLI. Use Azure Policy to automate these tasks for any new resources. See [Deploy Azure Monitor at scale by using Azure Policy](deploy-scale.md) for details on this configuration.


## Enable insights
Insights provide specialized monitoring for a particular service. Insights use more recent features of Azure Monitor such as workbooks, so you should use an insight if it's available for your service. They are automatically available in every Azure subscription but may require some configuration for full functionality. They will typically use platform metrics and resources logs that you previously configured and could collect additional data.

There is no cost for insights, but you may be charged for any data they collect.

See [What is monitored by Azure Monitor?](monitor-reference.md) for a list of available insights and solutions in Azure Monitor. See the documentation for each for any unique configuration or pricing information. 


## Collect data from virtual machines

> [!NOTE]
> See [Monitoring Azure virtual machines with Azure Monitor](vm/monitor-vm-azure.md) for a complete guide on monitoring virtual machines with Azure Monitor. 

Virtual machines generate similar data as other Azure resources, but you need an agent to collect data from the guest operating system. See [Overview of Azure Monitor agents](agents/agents-overview.md) for a comparison of the agents used by Azure Monitor. 

[VM insights](vm/vminsights-overview.md) uses the Log Analytics agent and Dependency agent to collect data from the guest operating system of virtual machines, so you can deploy these agents as part of the implementation of this insight. This enables the Log Analytics agent for other services that use it such as Azure Security Center.


[ ![Deploy Azure VM](media/deploy/deploy-azure-vm.png) ](media/deploy/deploy-azure-vm.png#lightbox)


### Enable VM insights on each virtual machine
Once a workspace has been configured, you can enable each virtual machine by installing the Log Analytics agent and Dependency agent. There are multiple methods for installing these agents including Azure Policy which allows you automatically configure each virtual machine as it's created. Performance data and process details collected by VM insights is stored in Azure Monitor Logs.

See [Enable VM insights overview](vm/vminsights-enable-overview.md) for options to deploy the agents to your virtual machines and enable them for monitoring.


### Configure workspace to collect events
VM insights will collect performance data and the details and dependencies of processes from the guest operating system of each virtual machine. The Log Analytics agent can also collect logs from the guest including the event log from Windows and syslog from Linux. It retrieves the configuration for these logs from the Log Analytics workspace it's connected to. You only need to configure the workspace once, and each time an agent connects, it will download any configuration changes. 

See [Agent data sources in Azure Monitor](agents/agent-data-sources.md) for details on configuring your Log Analytics workspace to collect additional data from your agent virtual machines.

> [!NOTE]
> You can also configure the workspace to collect performance counters, but this will most likely be redundant with performance data collected by VM insights. Performance data collected by the workspace will be stored in the *Perf* table, while performance data collected by VM insights is stored in the *InsightsMetrics* table. Configure performance collection in the workspace only if you require counters that aren't already collected by VM insights.

### Diagnostic extension and Telegraf agent
VM insights uses the Log Analytics agent which sends performance data to a Log Analytics workspace but not to Azure Monitor Metrics. Sending this data to Metrics allows it to be analyzed with Metrics Explorer and used with metric alerts. This requires the diagnostic extension on Windows and the Telegraf agent on Linux.

See [Install and configure Windows Azure diagnostics extension (WAD)](agents/diagnostics-extension-windows-install.md) and [Collect custom metrics for a Linux VM with the InfluxData Telegraf agent](essentials/collect-custom-metrics-linux-telegraf.md) for details on installing and configuring these agents.


## Monitor applications
Azure Monitor monitors your custom applications using [Application Insights](app/app-insights-overview.md), which you must configure for each application you want to monitor. The configuration process will vary depending on the type of application being monitored and the type of monitoring that you want to perform. Data collected by Application Insights is stored in Azure Monitor Metrics, Azure Monitor Logs, and Azure blob storage, depending on the feature. Performance data is stored in both Azure Monitor Metrics and Azure Monitor Logs with no additional configuration required.

### Create an application resource
You must create a resource in Application Insights for each application that you're going to monitor. Log data collected by Application Insights is stored in Azure Monitor Logs for a workspace-based application. Log data for classic applications is stored separate from your Log Analytics workspace as described in [Data structure](logs/data-platform-logs.md#data-structure).

 When you create the application, you must select whether to use classic or workspace-based. See [Create an Application Insights resource](app/create-new-resource.md) to create a classic application. 
See [Workspace-based Application Insights resources (preview)](app/create-workspace-resource.md) to create a workspace-based application.

### Configure codeless or code-based monitoring
To enable monitoring for an application, you must decide whether you will use codeless or code-based monitoring. The configuration process will vary depending on this decision and the type of application you're going to monitor.

**Codeless monitoring** is easiest to implement and can be configured after your code development. It doesn't require any updates to your code. See the following resources for details on enabling monitoring depending on the your application.

- [Applications hosted on Azure Web Apps](app/azure-web-apps.md)
- [Java applications](app/java-in-process-agent.md)
- [ASP.NET applications hosted in IIS on Azure VM or Azure virtual machine scale set](app/azure-vm-vmss-apps.md)
- [ASP.NET applications hosted in IIS on-premises](app/status-monitor-v2-overview.md)


**Code-based monitoring** is more customizable and collects additional telemetry, but it requires adding a dependency to your code on the Application Insights SDK NuGet packages. See the following resources for details on enabling monitoring depending on your application.

- [ASP.NET Applications](app/asp-net.md)
- [ASP.NET Core Applications](app/asp-net-core.md)
- [.NET Console Applications](app/console.md)
- [Java](app/java-in-process-agent.md)
- [Node.js](app/nodejs.md)
- [Python](app/opencensus-python.md)
- [Other platforms](app/platforms.md)

### Configure availability testing
Availability tests in Application Insights are recurring tests that monitor the availability and responsiveness of your application at regular intervals from points around the world. You can create a simple ping test for free or create a sequence of web requests to simulate user transactions which has associated cost. 

See [Monitor the availability of any website](app/monitor-web-app-availability.md) for summary of the different kinds of test and details on creating them.

### Configure Profiler
Profiler in Application Insights provides performance traces for .NET applications. It helps you identify the "hot" code path that takes the longest time when it's handling a particular web request. The process for configuring the profiler varies depending on the type of application. 

See [Profile production applications in Azure with Application Insights](app/profiler-overview.md) for details on configuring Profiler.

### Configure Snapshot Debugger
Snapshot Debugger in Application Insights monitors exception telemetry from your .NET application and collects snapshots on your top-throwing exceptions so that you have the information you need to diagnose issues in production. The process for configuring Snapshot Debugger varies depending on the type of application. 

See [Debug snapshots on exceptions in .NET apps](app/snapshot-debugger.md) for details on configuring Snapshot Debugger.
