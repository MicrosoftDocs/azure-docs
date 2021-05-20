---
title: Monitor Azure virtual machines with Azure Monitor
description: Describes how to collect and analyze monitoring data from virtual machines in Azure using Azure Monitor.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/05/2020

---

# Monitoring Azure virtual machines with Azure Monitor - Onboard
This article describes how to configure virtual machine monitoring in Azure Monitor. 

## Types of machines

| Type | Description |
|:---|:---|
| Azure virtual machines | Virtual machines running in Azure have host data collected automatically. They require an agent to collect data from the guest operating system. |
| Hybrid machines | A hybrid machine is a virtual machine running in another cloud or a virtual or physical machine running on-premises in your data center. Hybrid machines are supported by Azure Monitor using [Azure Arc enabled servers](../azure-arc/servers/overview.md). Once connected to Azure Arc, the machine can be managed like any other Azure virtual machine.
| Virtual machine scale set | | 

## Configuration overview
The following table lists the steps that must be performed for this configuration. 

| Configuration step | Actions completed | Features enabled |
|:---|:---|:---|
| No configuration | - Host platform metrics sent to Metrics.<br>- Activity log collected | - Metrics explorer for host<br>- Metrics alerts for host<br>- Activity log alerts |
| Create and prepare Log Analytics workspace | - Log Analytics workspace created | - VM insights enabled  |
| [Enable VM insights](#enable-vm-insights) | - Log Analytics agent installed.<br>- Dependency agent installed.<br>- Guest performance data sent to Logs.<br>- Process and dependency details sent to Logs | - Performance charts and workbooks for guest performance data<br>- Log queries for guest performance data<br>- Dependency map |
| Enable Arc on hybrid machines | |
| [Configure additional data collection](#configure-log-analytics-workspace) | - Events collected from guest. | - Log queries for guest events.<br>- Log alerts for guest events. |
| [Create diagnostic setting for virtual machine](#collect-platform-metrics-and-activity-log) | - Platform metrics collected to Logs.<br>- Activity log collected to Logs. | - Log queries for host metrics.<br>- Log alerts for host metrics.<br>- Log queries for Activity log.


| Configuration step | Description |
|:---|:---|
| No configuration | Activity log and platform metrics for the Azure virtual machine hosts are automatically collected with no configuration. You can view the Activity log in the Azure portal and use Metrics explorer to analyze host metrics. |
| Create and prepare Log Analytics workspace | Create and configure a Log Analytics workspace to enable VM insights and other features of Azure Monitor. You can also use an existing Log Analytics workspace or create multiple workspaces depending on your particular requirements. |
| Enable Arc on hybrid machines | |

| [Enable VM insights](#enable-vm-insights) | - Log Analytics agent installed.<br>- Dependency agent installed.<br>- Guest performance data sent to Logs.<br>- Process and dependency details sent to Logs | - Performance charts and workbooks for guest performance data<br>- Log queries for guest performance data<br>- Dependency map |

| [Configure additional data collection](#configure-log-analytics-workspace) | - Events collected from guest. | - Log queries for guest events.<br>- Log alerts for guest events. |
| [Create diagnostic setting for virtual machine](#collect-platform-metrics-and-activity-log) | - Platform metrics collected to Logs.<br>- Activity log collected to Logs. | - Log queries for host metrics.<br>- Log alerts for host metrics.<br>- Log queries for Activity log.


### Optional

| Configuration step | Actions completed | Features enabled |
|:---|:---|:---|
| [Install the diagnostics extension and telegraf agent](#enable-diagnostics-extension-and-telegraf-agent) | - Guest performance data collected to Metrics. | - Metrics explorer for guest.<br>- Metrics alerts for guest.  |


## Create Log Analytics workspace
The first step in any Azure Monitor implementation is creating one or more Log Analytics workspaces. The number that you create, their location, and their configuration will depend on your particular environment and business requirements.



## Collect Activity log
You can view the platform metrics and Activity log collected for each virtual machine host in the Azure portal. Collect this data into the same Log Analytics workspace as VM insights to analyze it with the other monitoring data collected for the virtual machine. This collection is configured with a [diagnostic setting](../essentials/diagnostic-settings.md). Collect the Activity log with a [diagnostic setting for the subscription](../essentials/diagnostic-settings.md#create-in-azure-portal).

## Enable VM insights
[VM insights](../vm/vminsights-overview.md) is the feature in Azure Monitor for monitoring virtual machines It provides the following additional value over standard Azure Monitor features.

- Simplified onboarding of Log Analytics agent and Dependency agent to enable monitoring of a virtual machine guest operating system and workloads. 
- Pre-defined trending performance charts and workbooks that allow you to analyze core performance metrics from the virtual machine's guest operating system.
- Dependency map that displays processes running on each virtual machine and the interconnected components with other machines and external sources.



You need to enable VM insights on each workspace. You can do this through the portal or an ARM template. It only needs to be done once per workspace though, so if you have a small number of workspaces, the portal may be the easiest method.
Enable VM insights from the **Insights** option in the virtual machine menu of the Azure portal. See [Enable VM insights overview](vminsights-enable-overview.md) for details and other configuration methods.

![Enable VM insights](media/monitor-vm-azure/enable-vminsights.png)

## Configure additional data collection
The Log Analytics agent used by VM insights sends data to a [Log Analytics workspace](../logs/data-platform-logs.md). You can enable the collection of additional performance data, events, and other monitoring data from the agent by configuring the Log Analytics workspace. It only needs to be configured once, since any agent connecting to the workspace will automatically download the configuration and immediately start collecting the defined data. 

You can access the configuration for the workspace directly from VM insights by selecting **Workspace configuration** from the **Get Started**. Click on the workspace name to open its menu.

![Workspace configuration](media/monitor-vm-azure/workspace-configuration.png)

Select **Advanced Settings** from the workspace menu and then **Data** to configure data sources. For Windows agents, select **Windows Event Logs** and add common event logs such as *System* and *Application*. For Linux agents, select **Syslog** and add common facilities such as *kern* and *daemon*. See [Agent data sources in Azure Monitor](../agents/agent-data-sources.md) for a list of the data sources available and details on configuring them. 

![Configure events](media/monitor-vm-azure/configure-events.png)


> [!NOTE]
> You can configure performance counters to be collected from the workspace configuration, but this may be redundant with the performance counters collected by VM insights. VM insights collects the most common set of counters at a frequency of once per minute. Only configure performance counters to be collected by the workspace if you want to collect counters not already collected by VM insights or if you have existing queries using performance data.

## Network requirements

## Onboard Azure virtual machines

## Onboard hybrid machines






## Collect platform metrics
You can view the platform metrics and Activity log collected for each virtual machine host in the Azure portal. Collect this data into the same Log Analytics workspace as VM insights to analyze it with the other monitoring data collected for the virtual machine. This collection is configured with a [diagnostic setting](../essentials/diagnostic-settings.md). Collect the Activity log with a [diagnostic setting for the subscription](../essentials/diagnostic-settings.md#create-in-azure-portal).

Collect platform metrics with a diagnostic setting for the virtual machine. Unlike other Azure resources, you cannot create a diagnostic setting for a virtual machine in the Azure portal but must use [another method](../essentials/diagnostic-settings.md#create-using-powershell). The following examples show how to collect metrics for a virtual machine using both PowerShell and CLI.

```powershell
Set-AzDiagnosticSetting -Name vm-diagnostics -ResourceId "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-vm" -Enabled $true -MetricCategory AllMetrics -workspaceId "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace"
```

```azurecli
az monitor diagnostic-settings create \
--name VM-Diagnostics 
--resource /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-vm \
--metrics '[{"category": "AllMetrics","enabled": true}]' \
--workspace /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/my-resource-group/providers/microsoft.operationalinsights/workspaces/my-workspace
```

## Send performance data to Metrics (optional)
VM insights is based on the Log Analytics agent that sends data to a Log Analytics workspace. This supports multiple features of Azure Monitor such as [log queries](../logs/log-query-overview.md), [log alerts](../alerts/alerts-log.md), and [workbooks](../visualize/workbooks-overview.md). The [diagnostics extension](../agents/diagnostics-extension-overview.md) collects performance data from the guest operating system of Windows virtual machines to Azure Storage and optionally sends performance data to [Azure Monitor Metrics](../essentials/data-platform-metrics.md). For Linux virtual machines, the [Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md) is required to send data to Azure Metrics.  This enables other features of Azure Monitor such as [metrics explorer](../essentials/metrics-getting-started.md) and [metrics alerts](../alerts/alerts-metric.md). You can also configure the diagnostics extension to send events and performance data outside of Azure Monitor using Azure Event Hubs.

Install the diagnostics extension for a single Windows virtual machine in the Azure portal from the **Diagnostics setting** option in the VM menu. Select the option to enable **Azure Monitor** in the **Sinks** tab. To enable the extension from a template or command line for multiple virtual machines, see [Installation and configuration](../agents/diagnostics-extension-overview.md#installation-and-configuration). Unlike the Log Analytics agent, the data to collect is defined in the configuration for the extension on each virtual machine.

![Diagnostic setting](media/monitor-vm-azure/diagnostic-setting.png)

See [Install and configure Telegraf](../essentials/collect-custom-metrics-linux-telegraf.md#install-and-configure-telegraf) for details on configuring the Telegraf agents on Linux virtual machines. The **Diagnostic setting** menu option is available for Linux, but it will only allow you to send data to Azure storage.




## Next steps

* [Learn how to analyze data in Azure Monitor logs using log queries.](../logs/get-started-queries.md)
* [Learn about alerts using metrics and logs in Azure Monitor.](../alerts/alerts-overview.md)