---
title: Monitor virtual machines with Azure Monitor
description: Describes how to collect and analyze monitoring data from virtual machines in Azure using Azure Monitor.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/02/2021

---

# Monitoring virtual machines with Azure Monitor
This scenario describes how to use Azure Monitor monitor the health and performance of  virtual machines and the workloads using Azure Monitor. It includes collection of telemetry critical for monitoring, analysis and visualization of collected data to identify trends, and how to configure alerting to be proactively notified of critical issues.

This article introduces the scenario, provides general concepts for monitoring virtual machines, and describes the relevant features of Azure Monitor. If you want to jump right into a specific area then please refer to the other articles that are part of this scenario described in the following table.

| Article | Description |
|:---|:---|
| [Enable monitoring](monitor-virtual-machine-onboard.md) | Configuration of Azure Monitor required to monitor virtual machines. This includes enabling VM insights and enabling each virtual machines for monitoring.  |
| [Analyze](monitor-virtual-machine-analyze.md) | Analyze monitoring data collected by Azure Monitor from virtual machines and their guest operating systems and applications to identify trends and critical information. |
| [Alerts](monitor-virtual-machine-alerts.md)   | Create alerts to proactively identify critical issues in your monitoring data. |
| [Monitor security](monitor-virtual-machine-security.md) | Describes Azure services for monitoring security of virtual machines. |
| [Monitor workloads](monitor-virtual-machine-workloads.md) | Monitor applications and other workloads running on your virtual machines. |

> [!IMPORTANT]
> This scenario does not include features that are not generally available. This includes features in public preview such as [Azure Monitor agent](../agents/azure-monitor-agent.md) and [virtual machine guest health](vminsights-health-overview.md) that have the potential to significantly modify the recommendations made here. The scenario will be updated as preview features move into general availability.


## Types of machines
This scenario includes monitoring of the following type of machines using Azure Monitor. Many of the processes described here are the same regardless of the type of machine. Considerations for different types of machines are clearly identified where appropriate.

- Azure virtual machines
- Azure virtual machine scale sets
- Hybrid machines which are virtual machines running in other clouds, with a managed service provider, or om-premises. They also include physical machines running on-premises.

## Layers of monitoring
There are fundamentally three layers to a virtual machine that require monitoring. Each layer has a distinct set of telemetry and monitoring requirements. 


| Layer | Description |
|:---|:---|
| Virtual machine host | This is the host virtual machine in Azure. Azure Monitor has no access to the host in other clouds but must rely on information collected from the guest operating system. The host can be useful for tracking activity such as configuration changes, but typically isn't used for significant alerting. |
| Guest operating system | Operating system running on the virtual machine which is some version of either Windows or Linux. A significant amount of monitoring data is available from the guest operating system such as performance data and events. VM insights in Azure Monitor provides a significant amount of logic for monitoring the health and performance of the guest operating system. |
| Workloads | Workloads running in the guest operating system that support your business applications. Azure Monitor provides predefined monitoring for some workloads, you typically need to configure data collection and alerting for other workloads using monitoring data that they generate. |
| Application | The business application that depends on your virtual machines can be monitored using [Application Insights](../app/app-insights-overview.md). This is no different than the monitoring of an application running on any other platform. 

Application monitoring in Azure Monitor is provided by [Application insights](../app/app-insights-overview.md). This will measure the performance and availability of the application regardless of the platform that it's running on. 

## Agents
Any monitoring tool such as Azure Monitor requires an agent installed on a machine to collect data from its guest operating system. Azure Monitor currently has multiple agents that collect different data, send data to different locations, and support different features. VM insights manages the deployment and configuration of the agents that most customers will use, but you should be aware of the different agents that are described in the following table in case you require the particular scenarios that they support. See [Overview of Azure Monitor agents](../agents/agents-overview.md) for a detailed description and comparison of the different agents.

> [!NOTE]
> The Azure Monitor agent is currently in public preview and yet included in this scenario. When it becomes generally available and fully supported by tools that use it such as VM insights, Azure Security Center, and Azure Sentinel, then it will completely replace the Log Analytics agent, diagnostic extension, and Telegraf agent.

- [Log Analytics agent](../agents/agents-overview.md#log-analytics-agent) - Supports virtual machines in Azure, other cloud environments, and on-premises. Sends data to Azure Monitor Logs. Supports VM insights and monitoring solutions. This is the same agent used for System Center Operations Manager.
- [Dependency agent](../agents/agents-overview.md#dependency-agent) - Collects data about the processes running on the virtual machine and their dependencies. Relies on the Log Analytics agent to transmit data into Azure and supports VM insights, Service Map, and Wire Data 2.0 solutions.
- [Azure Diagnostic extension](../agents/agents-overview.md#azure-diagnostics-extension) - Available for Azure Monitor virtual machines only. Can collect data to multiple locations but primarily used to collect guest performance data into Azure Monitor Metrics for Windows virtual machines.
- [Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md) - Send performance data from Linux machines into Azure Monitor Metrics.






### Virtual machine host
Virtual machines in Azure generate the following data for the virtual machine host the same as other Azure resources as described in [Monitoring data](../essentials/monitor-azure-resource.md#monitoring-data).










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

* [Analyze monitoring data collected for virtual machines.](monitor-virtual-machine-analyze.md)
