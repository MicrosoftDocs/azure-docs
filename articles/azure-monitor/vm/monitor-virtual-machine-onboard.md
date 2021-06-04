---
title: Monitor Azure virtual machines with Azure Monitor - Configure monitoring
description: Describes how to configure virtual machines for monitoring in Azure Monitor. Monitor virtual machines and their workloads with Azure Monitor scenario.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/02/2021

---

# Monitor virtual machines with Azure Monitor - Configure monitoring
This article is part of the [Monitoring virtual machines and their workloads in Azure Monitor scenario](monitor-virtual-machine.md). It describes how to configure Azure Monitor to most effectively monitor you Azure and hybrid virtual machines.

Depending on your particular environment and business requirements, you may not want to implement all features enabled by this configuration. Each section will describe what features are enabled by that configuration and whether it will potentially result in additional cost. This will help you to assess whether to perform each step of the configuration. See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) for detailed pricing information.

A general description of each feature enabled by this configuration is provided in the [overview for scenario](monitor-virtual-machine.md). It also includes links to content providing a detailed description of each feature to further help you assess your requirements.

> [!NOTE]
> The features enabled by the configuration support monitoring workloads running on your virtual machine, but you'll typically require additional configuration depending your particular workloads. See [Workload monitoring](monitor-virtual-machine-workloads.md) for details on this configuration.

## Configuration overview
The following table lists the steps that must be performed for this configuration. 

| Step | Description |
|:---|:---|
| [No configuration](#no-configuration) | Activity log and platform metrics for the Azure virtual machine hosts are automatically collected with no configuration.  |
| [Create and prepare Log Analytics workspace](#create-and-prepare-log-analytics-workspace) | Create a Log Analytics workspace and configure it for VM insights. Depending on your particular requirements, you may configure multiple workspaces. |
| [Send Activity log to Log Analytics workspace](#send-activity-log-to-log-analytics-workspace) | Send the Activity log to the workspace to analyze it with other log data. |
| [Prepare hybrid machines](#prepare-hybrid-machines) | Hybrid machines either need the Azure Arc agent installed so they can be managed like Azure virtual machines or have their agents installed manually. |
| [Enable VM insights on machines](#enable-vm-insights-on-machines) | Onboard machines to VM insights while deploys required agents and begins collecting data from guest operating system. |
| [Send guest performance data to Metrics (optional)](#send-guest-performance-data-to-metrics-optional) | Optionally install the diagnostic extension on Azure virtual machines to send performance data to Azure Monitor Metrics. |



## No configuration
Azure Monitor provides a basic level of monitoring for Azure virtual machines at no cost and with no configuration. Platform metrics for Azure virtual machines include important metrics such as CPU, network, and disk utilization and can be viewed on the Overview page for the machine in the Azure portal. The Activity log is also collected automatically and includes the recent activity of the machine such as any configuration changers and when it's been stopped and started. | 

## Create and prepare Log Analytics workspace
You require at least one Log Analytics workspace to support VM insights and to collect telemetry from the Log Analytics agent. There is no cost for the workspace, but you do incur ingestion and retention costs when you collect data. 

Many environments will use a single workspace for all their virtual machines and other Azure resources they monitor. You can even share a workspace used by Azure Security Center and Azure Sentinel, although many customers choose to segregate their availability and performance telemetry from security data. If you're just getting started with Azure Monitor, then start with a single workspace and consider creating additional workspaces as your requirements evolve.

See [Designing your Azure Monitor Logs deployment](../logs/design-logs-deployment.md) for complete details on logic that you should consider for designing a workspace configuration.

### Multihoming agents
Multihoming refers to a virtual machine that connects to multiple workspaces. There typically is little reason to multihome agents for Azure Monitor alone. Having an agent send data to multiple workspaces will most likely create duplicate data in each workspace, increasing your overall cost. You can combine data from multiple workspaces using [cross workspace queries]() and [workbooks]().

One reason you may consider multihoming though is an environment with Azure Security Center or Azure Sentinel stored in a separate workspace than Azure Monitor. A machine being monitored by each service would need to send data to each workspace. The Windows agent supports this scenario since it can send to up to four workspaces. The Linux agent though can currently only send to a single workspace. If you want to use have Azure Monitor and Azure Security Center or Azure Sentinel monitor a common set of Linux machines, then the services would need to share the same workspace.

### Workspace permissions
The access mode of the workspace defines which users are able to access different sets of data. See [Manage access to log data and workspaces in Azure Monitor](../logs/manage-access.md) for details on defining your access mode and configuring permissions. If you're just getting started with Azure Monitor, then consider accepting the defaults when you create your workspace and configure its permissions later.


### Prepare the workspace for VM insights
You must prepare each workspace for VM insights before enabling monitoring for any virtual machines. This installs required solutions that support data collection from the Log Analytics agent. This configuration only needs to be completed once for each workspace. See [Enable VM insights overview](vminsights-enable-overview.md) for details on this configuration using the Azure portal in addition to other methods.


## Send Activity log to Log Analytics workspace
You can view the platform metrics and Activity log collected for each virtual machine host in the Azure portal. Send this data into the same Log Analytics workspace as VM insights to analyze it with the other monitoring data collected for the virtual machine. There is no cost for  ingestion or retention of Activity log data. See [Create diagnostic settings](../essentials/diagnostic-settings.md) for details on creating a diagnostic setting to send the Activity log to your Log Analytics workspace.

## Prepare hybrid machines
A hybrid machine is a machine that's not running in Azure. This is a virtual machine running in another cloud or a virtual or physical machine running on-premises in your data center. Install Azure Arc on hybrid machines so you can manage them similar to Azure virtual machines. Azure Arc enabled servers using the same process you use for Azure virtual machines. There is no additional cost for Azure Arc, but there will be a cost for the data collected in the workspace once the hybrid machines are enabled for VM insights. See [Plan and deploy Arc enabled servers](../../azure-arc/servers/plan-at-scale-deployment.md) for a complete guide on preparing your hybrid machines for Azure. This includes enabling individual machines and using [Azure Policy]() to enable your entire hybrid environment at scale.

Conditions where you can't use Azure Arc for your hybrid machines include the following:

- The operating system of the machine is not supported by Azure Arc enabled servers agent. See [Supported operating systems](../azure-arc/servers/agent-overview.md#prerequisites).
- Your security policy does not allow machines to connect directly to Azure. The Log Analytics agent can use the [Log Analytics gateway](../agents/gateway.md) whether or not Azure Arc is installed. The Azure Arc agent though must connect directly to Azure.

See [Enable VM insights for a hybrid virtual machine](vminsights-enable-hybrid.md) to manually install the Log Analytics agent and Dependency agent on those hybrid machines that can't use Azure Arc. 

## Enable VM insights on machines
When you enable VM insights on a machine, it installs the Log Analytics agent and Dependency agent, connects it to a workspace, and starts collecting performance data. This enables most monitoring scenarios and allows you to start using performance views and workbooks to analyze trends for a variety of guest operating system metrics, enables the map feature of VM insights for analyzing running processes and dependencies between machines, and collects data required for you to create a variety of alert rules.

You can enable VM insights on individual machines using the same methods for Azure virtual machines and Azure Arc enabled servers. This includes onboarding individual machines with the Azure portal or resource manager templates, or enable machines at scale using Azure Policy. There is no direct cost for VM insights, but there is a cost for the ingestion and retention of data collected in the Log Analytics workspace.

See [Enable VM insights overview](vminsights-enable-overview.md) for different options to enable VM insights for your machines. See [Enable VM insights by using Azure Policy](vminsights-enable-policy.md) to create a policy that will automatically enable VM insights on any new machines as they're created.

### Network requirements

See [Log Analytics gateway] for details on configuring and using the Log Analytics gateway.
See [Use Azure Private Link to securely connect networks to Azure Monitor](../logs/private-link-security.md) for details on private link.


## Send guest performance data to Metrics (optional)
The [diagnostics extension](../agents/diagnostics-extension-overview.md) was developed for Azure virtual machines before the development of Azure Monitor. It can only be used for Azure virtual machines and can be challenging to configure at scale. You need to configure each virtual machine either in the Azure portal or using a resource manager templates. 

The diagnostic extension is required for the following scenarios that are not currently supported by the VM insights and the Log Analytics agent. If you don't require these scenarios, then deploying the diagnostic extension will add unnecessary complexity to your environment.

- Collect data from logs not supported by the Log Analytics agent. This will typically be to support a workload monitoring scenario. See [Summary of agents](../agents/agents-overview.md#summary-of-agents) for a comparison of the data collected.
- Send guest performance data to Azure Metrics for analysis in metrics explorer and metric alerts. Note that you can create metric alerts for certain guest performance counters stored in Logs. See [Alerts]() for details.
- Send guest performance and event data to Azure Event Hubs to forward it outside of Azure.

> [!NOTE]
> The diagnostic extension only supports Azure virtual machines. It does not support hybrid machines even if they're using Azure Arc.

Install the diagnostics extension for a single Windows virtual machine in the Azure portal from the **Diagnostics setting** option in the VM menu. Select the option to enable **Azure Monitor** in the **Sinks** tab. To enable the extension from a template or command line for multiple virtual machines, see [Installation and configuration](../agents/diagnostics-extension-overview.md#installation-and-configuration). Unlike the Log Analytics agent, the data to collect is defined in the configuration for the extension on each virtual machine. See [Install and configure Telegraf](../essentials/collect-custom-metrics-linux-telegraf.md#install-and-configure-telegraf) for details on configuring the Telegraf agents on Linux virtual machines. The **Diagnostic setting** menu option is available for Linux, but it will only allow you to send data to Azure storage.

![Diagnostic setting](media/monitor-vm-azure/diagnostic-setting.png)


## Next steps

* [Analyze monitoring data collected for virtual machines.](monitor-virtual-machine-analyze.md)
* [Create alerts from collected data.](monitor-virtual-machine-alerts.md)
* [Monitor workloads running on virtual machines.](monitor-virtual-machine-workloads.md)