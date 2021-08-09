---
title: Azure Monitor agent overview
description: Overview of the Azure Monitor agent, which collects monitoring data from the guest operating system of virtual machines.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/22/2021
ms.custom: references_regions
---

# Azure Monitor agent overview
The Azure Monitor agent collects monitoring data from the guest operating system of Azure virtual machines and delivers it to Azure Monitor. This article provides an overview of the Azure Monitor agent and includes information on how to install it and how to configure data collection.

## Relationship to other agents
The Azure Monitor agent replaces the following legacy agents that are currently used by Azure Monitor to collect guest data from virtual machines ([view known gaps](/azure/azure-monitor/faq#is-the-new-azure-monitor-agent-at-parity-with-existing-agents)):

- [Log Analytics agent](./log-analytics-agent.md): Sends data to a Log Analytics workspace and supports VM insights and monitoring solutions.
- [Diagnostic extension](./diagnostics-extension-overview.md): Sends data to Azure Monitor Metrics (Windows only), Azure Event Hubs, and Azure Storage.
- [Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md): Sends data to Azure Monitor Metrics (Linux only).

In addition to consolidating this functionality into a single agent, the Azure Monitor agent provides the following benefits over the existing agents:

- **Scope of monitoring:** Centrally configure collection for different sets of data from different sets of VMs.
- **Linux multi-homing:** Send data from Linux VMs to multiple workspaces.
- **Windows event filtering:** Use XPATH queries to filter which Windows events are collected.
- **Improved extension management:** Azure Monitor agent uses a new method of handling extensibility that's more transparent and controllable than management packs and Linux plug-ins in the current Log Analytics agents.

### Current limitations
When compared with the existing agents, this new agent doesn't yet have full parity.
- **Comparison with Log Analytics agents (MMA/OMS):**
	- Not all Log Analytics solutions are supported today. See [what's supported](#supported-services-and-features).
	- No support for Azure Private Links.
	- No support for collecting custom logs or IIS logs.
- **Comparison with Azure Diagnostics extensions (WAD/LAD):**
	- No support for Event Hubs and Storage accounts as destinations.

### Changes in data collection
The methods for defining data collection for the existing agents are distinctly different from each other. Each method has challenges that are addressed with the Azure Monitor agent.

- The Log Analytics agent gets its configuration from a Log Analytics workspace. It's easy to centrally configure but difficult to define independent definitions for different virtual machines. It can only send data to a Log Analytics workspace.
- Diagnostic extension has a configuration for each virtual machine. It's easy to define independent definitions for different virtual machines but difficult to centrally manage. It can only send data to Azure Monitor Metrics, Azure Event Hubs, or Azure Storage. For Linux agents, the open-source Telegraf agent is required to send data to Azure Monitor Metrics.

The Azure Monitor agent uses [data collection rules](data-collection-rule-overview.md) to configure data to collect from each agent. Data collection rules enable manageability of collection settings at scale while still enabling unique, scoped configurations for subsets of machines. They're independent of the workspace and independent of the virtual machine, which allows them to be defined once and reused across machines and environments. See [Configure data collection for the Azure Monitor agent](data-collection-rule-azure-monitor-agent.md).

## Should I switch to the Azure Monitor agent?
The Azure Monitor agent replaces the [legacy agents for Azure Monitor](agents-overview.md). To start transitioning your VMs off the current agents to the new agent, consider the following factors:

- **Environment requirements:** The Azure Monitor agent supports [these operating systems](./agents-overview.md#supported-operating-systems) today. Support for future operating system versions, environment support, and networking requirements will most likely be provided in this new agent. Assess whether your environment is supported by the Azure Monitor agent. If not, you might need to stay with the current agent. If the Azure Monitor agent supports your current environment, consider transitioning to it.
- **Current and new feature requirements:** The Azure Monitor agent introduces several new capabilities such as filtering, scoping, and multi-homing. But it isn't at parity yet with the current agents for other functionality such as custom log collection and integration with all solutions. ([See the solutions in preview](/azure/azure-monitor/faq#which-log-analytics-solutions-are-supported-on-the-new-azure-monitor-agent).) Most new capabilities in Azure Monitor will be made available only with the Azure Monitor agent. Over time, more functionality will be available only in the new agent. Consider whether the Azure Monitor agent has the features you require and if there are some features that you can temporarily do without to get other important features in the new agent. If the Azure Monitor agent has all the core capabilities you require, consider transitioning to it. If there are critical features that you require, continue with the current agent until the Azure Monitor agent reaches parity.
- **Tolerance for rework:** If you're setting up a new environment with resources such as deployment scripts and onboarding templates, assess the effort involved. If the setup will take a significant amount of work, consider setting up your new environment with the new agent as it's now generally available. A deprecation date will be published for the Log Analytics agents in August 2021. The current agents will be supported for several years after deprecation begins.

## Supported resource types
Azure virtual machines, virtual machine scale sets, and Azure Arc–enabled servers are currently supported. Azure Kubernetes Service and other compute resource types aren't currently supported.

## Supported regions
The Azure Monitor agent is available in all public regions that support Log Analytics. Government regions and clouds aren't currently supported.
## Supported services and features
The following table shows the current support for the Azure Monitor agent with other Azure services.

| Azure service | Current support | More information |
|:---|:---|:---|
| [Azure Security Center](../../security-center/security-center-introduction.md) | Private preview | [Sign-up link](https://aka.ms/AMAgent) |
| [Azure Sentinel](../../sentinel/overview.md) | Private preview | [Sign-up link](https://aka.ms/AMAgent) |

The following table shows the current support for the Azure Monitor agent with Azure Monitor features.

| Azure Monitor feature | Current support | More information |
|:---|:---|:---|
| [VM insights](../vm/vminsights-overview.md) | Private preview  | [Sign-up link](https://forms.office.com/r/jmyE821tTy) |
| [VM insights guest health](../vm/vminsights-health-overview.md) | Public preview | Available only on the new agent |
| [SQL insights](../insights/sql-insights-overview.md) | Public preview | Available only on the new agent |

The following table shows the current support for the Azure Monitor agent with Azure solutions.

| Solution | Current support | More information |
|:---|:---|:---|
| [Change Tracking](../../automation/change-tracking/overview.md) | Supported as File Integrity Monitoring in the Azure Security Center private preview.  | [Sign-up link](https://aka.ms/AMAgent) |
| [Update Management](../../automation/update-management/overview.md) | Use Update Management v2 (private preview) that doesn't require an agent. | [Sign-up link](https://www.yammer.com/azureadvisors/threads/1064001355087872) |

## Coexistence with other agents
The Azure Monitor agent can coexist with the existing agents so that you can continue to use their existing functionality during evaluation or migration. This capability is important because of the limitations that support existing solutions. Be careful in collecting duplicate data because it could skew query results and generate more charges for data ingestion and retention. 

For example, VM insights uses the Log Analytics agent to send performance data to a Log Analytics workspace. You might also have configured the workspace to collect Windows events and Syslog events from agents. If you install the Azure Monitor agent and create a data collection rule for these same events and performance data, it will result in duplicate data.

As such, ensure you're not collecting the same data from both agents. If you are, ensure they're going to separate destinations.

## Costs
There's no cost for the Azure Monitor agent, but you might incur charges for the data ingested. For details on Log Analytics data collection and retention and for customer metrics, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Data sources and destinations
The following table lists the types of data you can currently collect with the Azure Monitor agent by using data collection rules and where you can send that data. For a list of insights, solutions, and other solutions that use the Azure Monitor agent to collect other kinds of data, see [What is monitored by Azure Monitor?](../monitor-reference.md).

The Azure Monitor agent sends data to Azure Monitor Metrics or a Log Analytics workspace supporting Azure Monitor Logs.

| Data source | Destinations | Description |
|:---|:---|:---|
| Performance        | Azure Monitor Metrics<sup>1</sup><br>Log Analytics workspace | Numerical values measuring performance of different aspects of operating system and workloads |
| Windows event logs | Log Analytics workspace | Information sent to the Windows event logging system |
| Syslog             | Log Analytics workspace | Information sent to the Linux event logging system |

<sup>1</sup> There's a limitation today on the Azure Monitor agent for Linux. Using Azure Monitor Metrics as the *only* destination isn't supported. Using it along with Azure Monitor Logs works. This limitation will be addressed in the next extension update.

## Supported operating systems
For a list of the Windows and Linux operating system versions that are currently supported by the Azure Monitor agent, see [Supported operating systems](agents-overview.md#supported-operating-systems).

## Security
The Azure Monitor agent doesn't require any keys but instead requires a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#system-assigned-managed-identity). You must have a system-assigned managed identity enabled on each virtual machine before you deploy the agent.

## Networking
The Azure Monitor agent supports Azure service tags. Both AzureMonitor and AzureResourceManager tags are required. The Azure Monitor agent doesn't yet work with Azure Monitor Private Link Scopes. If the machine connects through a proxy server to communicate over the internet, review the following requirements to understand the network configuration required.

### Proxy configuration

The Azure Monitor agent extensions for Windows and Linux can communicate either through a proxy server or a Log Analytics gateway to Azure Monitor by using the HTTPS protocol. Use it for Azure virtual machines, Azure virtual machine scale sets, and Azure Arc for servers. Use the extensions settings for configuration as described in the following steps. Both anonymous and basic authentication by using a username and password are supported.

1. Use this flowchart to determine the values of the *setting* and *protectedSetting* parameters first.

   ![Flowchart to determine the values of setting and protectedSetting parameters when you enable the extension.](media/azure-monitor-agent-overview/proxy-flowchart.png)


1. After the values for the *setting* and *protectedSetting* parameters are determined, provide these additional parameters when you deploy the Azure Monitor agent by using PowerShell commands. The following examples are for Azure virtual machines.

	| Parameter | Value |
	|:---|:---|
	| SettingString | A JSON object from the preceding flowchart converted to a string. Skip if not applicable. An example is {"proxy":{"mode":"application","address":"http://[address]:[port]","auth": false}}. |
	| ProtectedSettingString | A JSON object from the preceding flowchart converted to a string. Skip if not applicable. An example is {"proxy":{"username": "[username]","password": "[password]"}}. |


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

- [Install the Azure Monitor agent](azure-monitor-agent-install.md) on Windows and Linux virtual machines.
- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.