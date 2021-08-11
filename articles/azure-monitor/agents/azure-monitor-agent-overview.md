---
title: Azure Monitor agent overview
description: Overview of the Azure Monitor agent (AMA), which collects monitoring data from the guest operating system of virtual machines.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/22/2021
ms.custom: references_regions
---

# Azure Monitor agent overview
The Azure Monitor agent (AMA) collects monitoring data from the guest operating system of Azure virtual machines and delivers it to Azure Monitor. This article provides an overview of the Azure Monitor agent including how to install it and how to configure data collection.

## Relationship to other agents
The Azure Monitor Agent replaces the following legacy agents that are currently used by Azure Monitor to collect guest data from virtual machines ([view known gaps](/azure/azure-monitor/faq#is-the-new-azure-monitor-agent-at-parity-with-existing-agents)):

- [Log Analytics agent](./log-analytics-agent.md) - Sends data to Log Analytics workspace and supports VM insights and monitoring solutions.
- [Diagnostic extension](./diagnostics-extension-overview.md) - Sends data to Azure Monitor Metrics (Windows only), Azure Event Hubs, and Azure Storage.
- [Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md) - Sends data to Azure Monitor Metrics (Linux only).

In addition to consolidating this functionality into a single agent, the Azure Monitor Agent provides the following benefits over the existing agents:

- Scope of monitoring. Centrally configure collection for different sets of data from different sets of VMs.  
- Linux multi-homing: Send data from Linux VMs to multiple workspaces.
- Windows event filtering: Use XPATH queries to filter which Windows events are collected.
- Improved extension management: Azure Monitor agent uses a new method of handling extensibility that is more transparent and controllable than management packs and Linux plug-ins in the current Log Analytics agents.

### Current limitations
When compared with the existing agents, this new agent does not yet have full parity:  
- **Comparison with Log Analytics Agents (MMA/OMS)**
	- Not all Log Analytics Solutions are supported today. See [what's supported](#supported-services-and-features)
	- No support for Private Links 
	- No support for collecting custom logs or IIS logs
          
- **Comparison with Azure Diagnostic Extensions (WAD/LAD)**
	- No support for Event Hubs and Storage accounts as destinations

### Changes in data collection
The methods for defining data collection for the existing agents are distinctly different from each other, and each have challenges that are addressed with Azure Monitor agent.

- Log Analytics agent gets its configuration from a Log Analytics workspace. It's easy to centrally configure but difficult to define independent definitions for different virtual machines. It can only send data to a Log Analytics workspace.

- Diagnostic extension has a configuration for each virtual machine. It's easy to define independent definitions for different virtual machines but difficult to centrally manage. It can only send data to Azure Monitor Metrics, Azure Event Hubs, or Azure Storage. For Linux agents, the open source Telegraf agent is required to send data to Azure Monitor Metrics.

Azure Monitor agent uses [Data Collection Rules (DCR)](data-collection-rule-overview.md) to configure data to collect from each agent. Data collection rules enable manageability of collection settings at scale while still enabling unique, scoped configurations for subsets of machines. They are independent of the workspace and independent of the virtual machine, which allows them to be defined once and reused across machines and environments. See [Configure data collection for the Azure Monitor agent](data-collection-rule-azure-monitor-agent.md).

## Should I switch to Azure Monitor agent?
Azure Monitor agent replaces the [legacy agents for Azure Monitor](agents-overview.md), and you can start transitioning your VMs off the current agents to the new agent considering the following factors:

- **Environment requirements.** Azure Monitor agent supports [these operating systems](./agents-overview.md#supported-operating-systems) today. Support for future operating system versions, environment support, and networking requirements will most likely be provided in this new agent. You should assess whether your environment is supported by Azure Monitor agent. If not, then you may need to stay with the current agent. If Azure Monitor agent supports your current environment, then you should consider transitioning to it.
- **Current and new feature requirements.** Azure Monitor agent introduces several new capabilities such as filtering, scoping, and multi-homing, but it isn’t at parity yet with the current agents for other functionality such as custom log collection and integration with all solutions ([see solutions in preview](/azure/azure-monitor/faq#which-log-analytics-solutions-are-supported-on-the-new-azure-monitor-agent)). Most new capabilities in Azure Monitor will only be made available with Azure Monitor agent, so over time more functionality will only be available in the new agent. Consider whether Azure Monitor agent has the features you require and if there are some features that you can temporarily do without to get other important features in the new agent. If Azure Monitor agent has all the core capabilities you require, then consider transitioning to it. If there are critical features that you require, then continue with the current agent until Azure Monitor agent reaches parity.
- **Tolerance for rework.** If you're setting up a new environment with resources such as deployment scripts and onboarding templates, assess the effort involved. If it will take a significant amount of work, then consider setting up your new environment with the new agent as it is now generally available. A deprecation date will be published for the Log Analytics agents in August 2021. The current agents will be supported for several years once deprecation begins.

## Supported resource types
Azure virtual machines, virtual machine scale sets, and Azure Arc-enabled servers are currently supported. Azure Kubernetes Service and other compute resource types are not currently supported.


## Supported regions
Azure Monitor agent is available in all public regions that supports Log Analytics. Government regions and clouds are not currently supported.
## Supported services and features
The following table shows the current support for Azure Monitor agent with other Azure services.

| Azure service | Current support | More information |
|:---|:---|:---|
| [Azure Security Center](../../security-center/security-center-introduction.md) | Private preview | [Sign up link](https://aka.ms/AMAgent) |
| [Azure Sentinel](../../sentinel/overview.md) | Private preview | [Sign up link](https://aka.ms/AMAgent) |


The following table shows the current support for Azure Monitor agent with Azure Monitor features.

| Azure Monitor feature | Current support | More information |
|:---|:---|:---|
| [VM Insights](../vm/vminsights-overview.md) | Private preview  | [Sign up link](https://forms.office.com/r/jmyE821tTy) |
| [VM Insights guest health](../vm/vminsights-health-overview.md) | Public preview | Available only on the new agent |
| [SQL insights](../insights/sql-insights-overview.md) | Public preview | Available only on the new agent |

The following table shows the current support for Azure Monitor agent with Azure solutions.

| Solution | Current support | More information |
|:---|:---|:---|
| [Change Tracking](../../automation/change-tracking/overview.md) | Supported as File Integrity Monitoring (FIM) in Azure Security Center private preview.  | [Sign up link](https://aka.ms/AMAgent) |
| [Update Management](../../automation/update-management/overview.md) | Use Update Management v2 (private preview) that doesn’t require an agent. | [Sign up link](https://www.yammer.com/azureadvisors/threads/1064001355087872) |



## Coexistence with other agents
The Azure Monitor agent can coexist with the existing agents so that you can continue to use their existing functionality during evaluation or migration. This is particularly important because of the limitations supporting existing solutions. You should be careful though in collecting duplicate data since this could skew query results and result in additional charges for data ingestion and retention. 

For example, VM Insights uses the Log Analytics agent to send performance data to a Log Analytics workspace. You may also have configured the workspace to collect Windows events and Syslog events from agents. If you install the Azure Monitor agent and create a data collection rule for these same events and performance data, it will result in duplicate data.

As such, ensure you're not collecting the same data from both agents. If you are, ensure they are going to separate destinations.


## Costs
There is no cost for Azure Monitor agent, but you may incur charges for the data ingested. See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) for details on Log Analytics data collection and retention and for customer metrics.

## Data sources and destinations
The following table lists the types of data you can currently collect with the Azure Monitor agent using data collection rules and where you can send that data. See [What is monitored by Azure Monitor?](../monitor-reference.md) for a list of insights, solutions, and other solutions that use the Azure Monitor agent to collect other kinds of data.


The Azure Monitor agent sends data to Azure Monitor Metrics or a Log Analytics workspace supporting Azure Monitor Logs.

| Data Source | Destinations | Description |
|:---|:---|:---|
| Performance        | Azure Monitor Metrics<sup>1</sup><br>Log Analytics workspace | Numerical values measuring performance of different aspects of operating system and workloads. |
| Windows Event logs | Log Analytics workspace | Information sent to the Windows event logging system. |
| Syslog             | Log Analytics workspace | Information sent to the Linux event logging system. |

<sup>1</sup> There's a limitation today on Azure Monitor Agent for Linux wherein using Azure Monitor Metrics as the *only* destination is not supported. Using it alongwith Azure Monitor Logs works. This limitation will be addressed in the next extension update.

## Supported operating systems
See [Supported operating systems](agents-overview.md#supported-operating-systems) for a list of the Windows and Linux operating system versions that are currently supported by the Azure Monitor agent.



## Security
The Azure Monitor agent doesn't require any keys but instead requires a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#system-assigned-managed-identity). You must have a system-assigned managed identity enabled on each virtual machine before deploying the agent.

## Networking
The Azure Monitor agent supports Azure service tags (both AzureMonitor and AzureResourceManager tags are required) but does not yet work with Azure Monitor Private Link Scopes. If the machine connects through a proxy server to communicate over the internet, review requirements below to understand the network configuration required.

### Proxy configuration

The Azure Monitor agent extensions for Windows and Linux can communicate either through a proxy server or Log Analytics gateway to Azure Monitor using the HTTPS protocol (for Azure virtual machines, Azure virtual machine scale sets and Azure Arc for servers). This is configured using extensions settings as described below, and supports both anonymous and basic authentication (username/password) are supported.  

1. Use this simple flowchart to determine the values of *setting* and *protectedSetting* parameters first:

   ![Flowchart to determine the values of setting and protectedSetting parameters when enabling the extension](media/azure-monitor-agent-overview/proxy-flowchart.png)


2. Once the values *setting* and *protectedSetting* parameters are determined, provide these additional parameters when deploying the Azure Monitor agent using PowerShell commands (examples below for Azure virtual machines):

	| Parameter | Value |
	|:---|:---|
	| SettingString | JSON object from flowchart above, converted to string; skip if not applicable. Example: {"proxy":{"mode":"application","address":"http://[address]:[port]","auth": false}} |
	| ProtectedSettingString | JSON object from flowchart above, converted to string; skip if not applicable. Example: {"proxy":{"username": "[username]","password": "[password]"}} |


# [Windows](#tab/PowerShellWindows)
```powershell
Set-AzVMExtension -ExtensionName AzureMonitorWindowsAgent -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion 1.0 -SettingString <settingString> -ProtectedSettingString <protectedSettingString>
```

# [Linux](#tab/PowerShellLinux)
```powershell
Set-AzVMExtension -ExtensionName AzureMonitorLinuxAgent -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName <resource-group-name> -VMName <virtual-machine-name> -Location <location> -TypeHandlerVersion 1.5 -SettingString <settingString> -ProtectedSettingString <protectedSettingString>
```

---

## Next steps

- [Install Azure Monitor agent](azure-monitor-agent-install.md) on Windows and Linux virtual machines.
- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.