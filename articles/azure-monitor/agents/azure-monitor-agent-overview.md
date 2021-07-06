---
title: Azure Monitor agent overview
description: Overview of the Azure Monitor agent (AMA), which collects monitoring data from the guest operating system of virtual machines.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/25/2021
ms.custom: references_regions
---

# Azure Monitor agent overview
The Azure Monitor agent (AMA) collects monitoring data from the guest operating system of Azure virtual machines and delivers it to Azure Monitor. This article provides an overview of the Azure Monitor agent including how to install it and how to configure data collection.

## Relationship to other agents
The Azure Monitor Agent replaces the following agents that are currently used by Azure Monitor to collect guest data from virtual machines ([view known gaps](/azure/azure-monitor/faq#is-the-new-azure-monitor-agent-at-parity-with-existing-agents)):

- [Log Analytics agent](./log-analytics-agent.md) - Sends data to Log Analytics workspace and supports VM insights and monitoring solutions.
- [Diagnostic extension](./diagnostics-extension-overview.md) - Sends data to Azure Monitor Metrics (Windows only), Azure Event Hubs, and Azure Storage.
- [Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md) - Sends data to Azure Monitor Metrics (Linux only).

In addition to consolidating this functionality into a single agent, the Azure Monitor Agent provides the following benefits over the existing agents:

- Scope of monitoring. Centrally configure collection for different sets of data from different sets of VMs.  
- Linux multi-homing: Send data from Linux VMs to multiple workspaces.
- Windows event filtering: Use XPATH queries to filter which Windows events are collected.
- Improved extension management: Azure Monitor agent uses a new method of handling extensibility that is more transparent and controllable than management packs and Linux plug-ins in the current Log Analytics agents.

### Changes in data collection
The methods for defining data collection for the existing agents are distinctly different from each other, and each have challenges that are addressed with Azure Monitor agent.

- Log Analytics agent gets its configuration from a Log Analytics workspace. It's easy to centrally configure but difficult to define independent definitions for different virtual machines. It can only send data to a Log Analytics workspace.

- Diagnostic extension has a configuration for each virtual machine. It's easy to define independent definitions for different virtual machines but difficult to centrally manage. It can only send data to Azure Monitor Metrics, Azure Event Hubs, or Azure Storage. For Linux agents, the open source Telegraf agent is required to send data to Azure Monitor Metrics.

Azure Monitor agent uses [Data Collection Rules (DCR)](data-collection-rule-overview.md) to configure data to collect from each agent. Data collection rules enable manageability of collection settings at scale while still enabling unique, scoped configurations for subsets of machines. They are independent of the workspace and independent of the virtual machine, which allows them to be defined once and reused across machines and environments. See [Configure data collection for the Azure Monitor agent (preview)](data-collection-rule-azure-monitor-agent.md).

## Should I switch to Azure Monitor agent?
Azure Monitor agent coexists with the [generally available agents for Azure Monitor](agents-overview.md), but you may consider transitioning your VMs off the current agents during the Azure Monitor agent public preview period. Consider the following factors when making this determination.

- **Environment requirements.** Azure Monitor agent supports [these operating systems](./agents-overview.md#supported-operating-systems) today latest operating systems and future environment support such as new operating system versions and types of networking requirements will most likely be provided only in this new agent. You should assess whether your environment is supported by Azure Monitor agent. If not, then you may need to stay with the current agent. If Azure Monitor agent supports your current environment, then you should consider transitioning to it.
- **Current and new feature requirements.** Azure Monitor agent introduces several new capabilities such as filtering, scoping, and multi-homing, but it isn’t at parity yet with the current agents for other functionality such as custom log collection and integration with all solutions ([see solutions in preview](/azure/azure-monitor/faq#which-log-analytics-solutions-are-supported-on-the-new-azure-monitor-agent)). Most new capabilities in Azure Monitor will only be made available with Azure Monitor agent, so over time more functionality will only be available in the new agent. Consider whether Azure Monitor agent has the features you require and if there are some features that you can temporarily do without to get other important features in the new agent. If Azure Monitor agent has all the core capabilities you require, then consider transitioning to it. If there are critical features that you require, then continue with the current agent until Azure Monitor agent reaches parity.
- **Tolerance for rework.** If you're setting up a new environment with resources such as deployment scripts and onboarding templates, assess the effort involved. If it will take a significant amount of work, then consider setting up your new environment with the new agent as it is now generally available. A deprecation date published for the Log Analytics agents in August 2021. The current agents will be supported for several years once deprecation begins.

## Supported resource types
Azure virtual machines, virtual machine scale sets, and Azure Arc enabled servers are currently supported. Azure Kubernetes Service and other compute resource types are not currently supported.


## Supported regions
Azure Monitor agent is available in all public regions that supports Log Analytics. Government regions and clouds are not currently supported.
## Supported services and features
The following table shows the current support for Azure Monitor agent with other Azure services.

| Azure service | Current support |
|:---|:---|
| [Azure Security Center](../../security-center/security-center-introduction.md) | Private preview |
| [Azure Sentinel](../../sentinel/overview.md) | Private preview |


The following table shows the current support for Azure Monitor agent with Azure Monitor features.

| Azure Monitor feature | Current support |
|:---|:---|
| [VM Insights](../vm/vminsights-overview.md) | Private preview  |
| [VM Insights guest health](../vm/vminsights-health-overview.md) | Public preview |

The following table shows the current support for Azure Monitor agent with Azure solutions.

| Solution | Current support |
|:---|:---|
| [Change Tracking](../../automation/change-tracking/overview.md) | Supported as File Integrity Monitoring (FIM) in Azure Security Center private preview.  |
| [Update Management](../../automation/update-management/overview.md) | Use Update Management v2 (private preview) that doesn’t require an agent. |
| [SQL Server](../insights/sql-insights-overview.md) | Support by SQL insights which is currently in public preview. |



## Coexistence with other agents
The Azure Monitor agent can coexist with the existing agents so that you can continue to use their existing functionality during evaluation or migration. This is particularly important because of the limitations supporting existing solutions. You should be careful though in collecting duplicate data since this could skew query results and result in additional charges for data ingestion and retention. 

For example, VM insights uses the Log Analytics agent to send performance data to a Log Analytics workspace. You may also have configured the workspace to collect Windows events and Syslog events from agents. If you install the Azure Monitor agent and create a data collection rule for these same events and performance data, it will result in duplicate data.

As such, ensure you're not collecting the same data from both agents, and if so, ensure they are going to separate destinations.


## Costs
There is no cost for Azure Monitor agent, but you may incur charges for the data ingested. See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) for details on Log Analytics data collection and retention and for customer metrics.

## Data sources and destinations
The following table lists the types of data you can currently collect with the Azure Monitor agent using data collection rules and where you can send that data. See [What is monitored by Azure Monitor?](../monitor-reference.md) for a list of insights, solutions, and other solutions that use the Azure Monitor agent to collect other kinds of data.


The Azure Monitor agent sends data to Azure Monitor Metrics or a Log Analytics workspace supporting Azure Monitor Logs.

| Data Source | Destinations | Description |
|:---|:---|:---|
| Performance        | Azure Monitor Metrics<br>Log Analytics workspace | Numerical values measuring performance of different aspects of operating system and workloads. |
| Windows Event logs | Log Analytics workspace | Information sent to the Windows event logging system. |
| Syslog             | Log Analytics workspace | Information sent to the Linux event logging system. |


## Supported operating systems
See [Supported operating systems](agents-overview.md#supported-operating-systems) for a list of the Windows and Linux operating system versions that are currently supported by the Azure Monitor agent.



## Security
The Azure Monitor agent doesn't require any keys but instead requires a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#system-assigned-managed-identity). You must have a system-assigned managed identity enabled on each virtual machine before deploying the agent.

## Networking
The Azure Monitor agent supports Azure service tags (both AzureMonitor and AzureResourceManager tags are required) but does not yet work with Azure Monitor Private Link Scopes or direct proxies.


## Next steps

- [Install Azure Monitor agent](azure-monitor-agent-install.md) on Windows and Linux virtual machines.
- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.
