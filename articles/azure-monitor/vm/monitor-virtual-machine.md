---
title: Monitor virtual machines with Azure Monitor
description: Describes how to collect and analyze monitoring data from virtual machines in Azure using Azure Monitor.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/26/2021

---

# Monitoring virtual machines with Azure Monitor
This scenario describes how to use Azure Monitor to collect and analyze monitoring data from virtual machines and the workloads running on them to maintain their health and performance. It includes collection of telemetry critical for monitoringanalysis and visualization of collected data to identify trends, and how to configure alerting to be proactively notified of critical issues.

This article provides concepts for monitoring virtual machines in Azure Monitor and guidance to the available content. If you want to jump right into some procedures, see the articles below.

| Article | Description |
|:---|:---|
| Enable | Enable VM insights feature of Azure Monitor and onboard virtual machines for monitoring. This includes Azure virtual machines and hybrid machines in other clouds and on-premises. |
| Analyze | Analyze monitoring data collected by Azure Monitor from virtual machines and their guest operating systems and applications. |
| Alert   | Create alerts based on performance and other data on the virtual machine.

> [!IMPORTANT]
> This scenario does not include features that are in public preview but not generally available. This includes features such as [Azure Monitor Agent]() and [virtual machine guest health]() that have the potential to significantly modify the recommendations made here. The scenario will be updated as preview features move into general availability.


## Layers of monitoring
There are fundamentally three layers to a virtual machine that require monitoring. Each layer has a distinct set of telemetry and monitoring requirements.

:::image type="content" source="media/monitor-virtual-machines/virtual-machine-layers.png" alt-text="Virtual machine layers":::


| Layer | Requirements | Data collected | Alerting requirements |
|:---|:---|:---|:---|
| Virtual machine host | None for Azure virtual machines<br>Azure Arc required for hybrid machines | Platform metrics<br>Activity log | Typically not useful for alerting since performance metrics are collected from the guest operating system. Virtual machine status could be done with the Activity log for the host machine, but this is considered a beginner scenario as opposed to heartbeat from the guest operating system which is a more useful alerting mechanism.  |
| Guest operating system | Agent installed on guest operating system | Performance data | Performance metrics from the guest operating system such as CPU, memory, and disk. |
| Applications | Agent installed on guest operating system<br>Application Insights for synthetic transactions | | These are the workloads running on the VM that support your business applications. For customer using SCOM, these workloads are typically being monitored by packaged or custom management packs. There are a variety of different alerting strategies that can be used to alert on these workloads such as service up/down, events, and synthetic transactions. |


Application monitoring in Azure Monitor is provided by [Application insights](../app/app-insights-overview.md). This will measure the performance and availability of the application regardless of the platform that it's running on. 


### Virtual machine host
Virtual machines in Azure generate the following data for the virtual machine host the same as other Azure resources as described in [Monitoring data](../essentials/monitor-azure-resource.md#monitoring-data).

## Types of machines

| Type | Description |
|:---|:---|
| Azure virtual machines | Virtual machines running in Azure have host data collected automatically. They require an agent to collect data from the guest operating system. |
| Hybrid machines | A hybrid machine is a virtual machine running in another cloud or a virtual or physical machine running on-premises in your data center. Hybrid machines are supported by Azure Monitor using [Azure Arc enabled servers](../azure-arc/servers/overview.md). Once connected to Azure Arc, the machine can be managed like any other Azure virtual machine.
| Virtual machine scale set | | 


## Agents
You require an agent which runs locally on each virtual machine and sends data to Azure Monitor to collect data from the guest operating system of a virtual machine. Multiple agents are available for Azure Monitor with each collecting different data and writing data to different locations. Get a detailed comparison of the different agents at [Overview of the Azure Monitor agents](../agents/agents-overview.md). 

- [Log Analytics agent](../agents/agents-overview.md#log-analytics-agent) - Available for virtual machines in Azure, other cloud environments, and on-premises. Collects data to Azure Monitor Logs. Supports VM insights and monitoring solutions. This is the same agent used for System Center Operations Manager.
- [Dependency agent](../agents/agents-overview.md#dependency-agent) - Collects data about the processes running on the virtual machine and their dependencies. Relies on the Log Analytics agent to transmit data into Azure and supports VM insights, Service Map, and Wire Data 2.0 solutions.
- [Azure Diagnostic extension](../agents/agents-overview.md#azure-diagnostics-extension) - Available for Azure Monitor virtual machines only. Can collect data to multiple locations but primarily used to collect guest performance data into Azure Monitor Metrics for Windows virtual machines.
- [Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md) - Collect performance data from Linux VMs into Azure Monitor Metrics.





### Collect platform metrics and Activity log
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



## Enable VM insights
[VM insights](../vm/vminsights-overview.md) is the feature in Azure Monitor for monitoring virtual machines It provides the following additional value over standard Azure Monitor features.

- Simplified onboarding of Log Analytics agent and Dependency agent to enable monitoring of a virtual machine guest operating system and workloads. 
- Pre-defined trending performance charts and workbooks that allow you to analyze core performance metrics from the virtual machine's guest operating system.
- Dependency map that displays processes running on each virtual machine and the interconnected components with other machines and external sources.



You need to enable VM insights on each workspace. You can do this through the portal or an ARM template. 

![Enable VM insights](media/monitor-vm-azure/enable-vminsights.png)


### Integration with Azure Monitor

- Azure Security Center and Azure Sentinel store data in a Log Analytics workspace and use the same KQL language for log queries. Even if you choose to use a [different workspace for these services](), you can still use [cross resource queries]() to combine availability and performance data with security data in log queries or workbooks.
- Create log query alerts combining security data with availability and performance data.
- Azure Security Center and Azure Sentinel the same Log Analytics agent meaning that you can collect security data without deploying additional agents to the machine.



## System Center Operations Manager
System Center Operations Manager provides granular monitoring of workloads on virtual machines. See the [Cloud Monitoring Guide](/azure/cloud-adoption-framework/manage/monitor/) for a comparison of monitoring platforms and different strategies for implementation.

If you have an existing Operations Manager environment that you intend to keep using, you can integrate it with Azure Monitor to provide additional functionality. The Log Analytics agent used by Azure Monitor is the same one used for Operations Manager so that you have monitored virtual machines send data to both. You still need to add the agent to VM insights and configure the workspace to collect additional data as specified above, but the virtual machines can continue to run their existing management packs in a Operations Manager environment without modification.

Features of Azure Monitor that augment an existing Operations Manager features include the following:

- Use Log Analytics to interactively analyze your log and performance data.
- Use log alerts to define alerting conditions across multiple virtual machines and using long term trends that aren't possible using alerts in Operations Manager.   

See [Connect Operations Manager to Azure Monitor](../agents/om-agents.md) for details on connecting your existing Operations Manager management group to your Log Analytics workspace.


## Next steps

* [Learn how to analyze data in Azure Monitor logs using log queries.](../logs/get-started-queries.md)
* [Learn about alerts using metrics and logs in Azure Monitor.](../alerts/alerts-overview.md)