---
title: Azure Monitor agent overview
description: Overview of the Azure Monitor agent (AMA), which collects monitoring data from the guest operating system of virtual machines.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/16/2021
ms.custom: references_regions
---

# Azure Monitor agent overview (preview)
The Azure Monitor agent (AMA) collects monitoring data from the guest operating system of virtual machines and delivers it to Azure Monitor. This articles provides an overview of the Azure Monitor agent including how to install it and how to configure data collection.

## Relationship to other agents
The Azure Monitor Agent replaces the following agents that are currently used by Azure Monitor to collect guest data from virtual machines:

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

- Log Analytics agent gets its configuration from a Log Analytics workspace. This is easy to centrally configure, but difficult to define independent definitions for different virtual machines. It can only send data to a Log Analytics workspace.

- Diagnostic extension has a configuration for each virtual machine. This is easy to define independent definitions for different virtual machines but difficult to centrally manage. It can only send data to Azure Monitor Metrics, Azure Event Hubs, or Azure Storage. For Linux agents, the open source Telegraf agent is required to send data to Azure Monitor Metrics.

Azure Monitor agent uses [Data Collection Rules (DCR)](data-collection-rule-overview.md) to configure data to collect from each agent. Data collection rules enable manageability of collection settings at scale while still enabling unique, scoped configurations for subsets of machines. They are independent of the workspace and independent of the virtual machine, which allows them to be defined once and reused across machines and environments. See [Configure data collection for the Azure Monitor agent (preview)](data-collection-rule-azure-monitor-agent.md).

## Should I switch to Azure Monitor agent?
Azure Monitor agent coexists with the [generally available agents for Azure Monitor](agents-overview.md), but you may consider transitioning your VMs off the current agents during the Azure Monitor agent public preview period. Consider the following factors when making this determination.

- **Environment requirements.** Azure Monitor agent has a more limited set of supported operating systems, environments, and networking requirements than the current agents. Future environment support such as new operating system versions and types of networking requirements will most likely be provided only in Azure Monitor agent. You should assess whether your environment is supported by Azure Monitor agent. If not, then you will need to stay with the current agent. If Azure Monitor agent supports your current environment, then you should consider transitioning to it.
- **Public preview risk tolerance.** While Azure Monitor agent has been thoroughly tested for the currently supported scenarios, the agent is still in public preview. Version updates and functionality improvements will occur frequently and may introduce bugs. You should assess your risk of a bug in the agent on your VMs that could stop data collection. If a gap in data collection isn’t going to have a significant impact on your services, then proceed with Azure Monitor agent. If you have a low tolerance for any instability, then you should stay with the generally available agents until Azure Monitor agent reaches this status.
- **Current and new feature requirements.** Azure Monitor agent introduces several new capabilities such as filtering, scoping, and multi-homing, but it isn’t at parity yet with the current agents for other functionality such as custom log collection and integration with solutions. Most new capabilities in Azure Monitor will only be made available with Azure Monitor agent, so over time more functionality will only be available in the new agent. You should consider whether Azure Monitor agent has the features you require and if there are some features that you can temporarily do without to get other important features in the new agent. If Azure Monitor agent has all the core capabilities you require then consider transitioning to it. If there are critical features that you require then continue with the current agent until Azure Monitor agent reaches parity.
- **Tolerance for rework.** If you're setting up a new environment with resources such as deployment scripts and onboarding templates, you should consider whether you will be able to rework them when Azure Monitor agent becomes generally available. If the effort for this rework will be minimal, then stay with the current agents for now. If it will take a significant amount of work, then consider setting up your new environment with the new agent. The Azure Monitor agent is expected to become generally available and a deprecation date published for the Log Analytics agents in 2021. The current agents will be supported for several years once deprecation begins.



## Current limitations
The following limitations apply during public preview of the Azure Monitor Agent:

- The Azure Monitor agent does not support solutions and insights such as VM insights and Azure Security Center. The only scenario currently supported is collecting data using the data collection rules that you configure. 
- Data collection rules must be created in the same region as any Log Analytics workspace used as a destination.
- Azure virtual machines, virtual machine scale sets, and Azure Arc enabled servers are currently supported. Azure Kubernetes Service and other compute resource types are not currently supported.
- The virtual machine must have access to the following HTTPS endpoints:
  - *.ods.opinsights.azure.com
  - *.ingest.monitor.azure.com
  - *.control.monitor.azure.com


## Supported regions
Azure Monitor agent currently supports resources in the following regions:

- East Asia
- Southeast Asia
- Australia Central
- Australia East
- Australia Southeast
- Canada Central
- North Europe
- West Europe
- France Central
- Germany West Central
- Central India
- Japan East
- Korea Central
- South Africa North
- Switzerland North
- UK South
- UK West
- Central US
- East US
- East US 2
- North Central US
- South Central US
- West US
- West US 2
- West Central US

## Coexistence with other agents
The Azure Monitor agent can coexist with the existing agents so that you can continue to use their existing functionality during evaluation or migration. This is particularly important because of the limitations in public preview in supporting existing solutions. You should be careful though in collecting duplicate data since this could skew query results and result in additional charges for data ingestion and retention.

For example, VM insights uses the Log Analytics agent to send performance data to a Log Analytics workspace. You may also have configured the workspace to collect Windows events and Syslog events from agents. If you install the Azure Monitor agent and create a data collection rule for these same events and performance data, it will result in duplicate data.


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