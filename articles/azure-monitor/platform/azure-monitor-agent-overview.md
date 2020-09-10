---
title: Azure Monitor agent overview
description: Overview of the Azure Monitor agent (AMA), which collects monitoring data from the guest operating system of virtual machines.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 08/10/2020

---

# Azure Monitor agent overview (preview)
The Azure Monitor agent (AMA) collects monitoring data from the guest operating system of virtual machines and delivers it to Azure Monitor. This articles provides an overview of the Azure Monitor agent including how to install it and how to configure data collection.

## Relationship to other agents
The Azure Monitor Agent replaces the following agents that are currently used by Azure Monitor to collect guest data from virtual machines:

- [Log Analytics agent](log-analytics-agent.md) - Sends data to Log Analytics workspace and supports Azure Monitor for VMs and monitoring solutions.
- [Diagnostic extension](diagnostics-extension-overview.md) - Sends data to Azure Monitor Metrics (Windows only), Azure Event Hubs, and Azure Storage.
- [Telegraf agent](collect-custom-metrics-linux-telegraf.md) - Sends data to Azure Monitor Metrics (Linux only).

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



## Current limitations
The following limitations apply during public preview of the Azure Monitor Agent:

- The Azure Monitor agent does not support solutions and insights such as Azure Monitor for VMs and Azure Security Center. The only scenario currently supported is collecting data using the data collection rules that you configure. 
- Data collection rules must be created in the same region as any Log Analytics workspace used as a destination.
- Only Azure virtual machines are currently supported. On-premises virtual machines, virtual machine scale sets, Arc for Servers, Azure Kubernetes Service, and other compute resource types are not currently supported.
- The virtual machine must have access to the following HTTPS endpoints:
  - *.ods.opinsights.azure.com
  - *.ingest.monitor.azure.com
  - *.control.monitor.azure.com


## Coexistence with other agents
The Azure Monitor agent can coexist with the existing agents so that you can continue to use their existing functionality during evaluation or migration. This is particularly important because of the limitations in public preview in supporting existing solutions. You should be careful though in collecting duplicate data since this could skew query results and result in additional charges for data ingestion and retention.

For example, Azure Monitor for VMs uses the Log Analytics agent to send performance data to a Log Analytics workspace. You may also have configured the workspace to collect Windows events and Syslog events from agents. If you install the Azure Monitor agent and create a data collection rule for these same events and performance data, it will result in duplicate data.


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
The following operating systems are currently supported by the Azure Monitor agent.

### Windows 
  - Windows Server 2019
  - Windows Server 2016
  - Windows Server 2012
  - Windows Server 2012 R2

### Linux
  - CentOS 6<sup>1</sup>, 7
  - Debian 9, 10
  - Oracle Linux 6<sup>1</sup>, 7
  - RHEL 6<sup>1</sup>, 7
  - SLES 11, 12, 15
  - Ubuntu 14.04 LTS, 16.04 LTS, 18.04 LTS

> [!IMPORTANT]
> <sup>1</sup>For these distributions to send Syslog data, you must restart the rsyslog service one time after the agent is installed.


## Security
The Azure Monitor agent doesn't require any keys but instead requires a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md#system-assigned-managed-identity). You must have a system-assigned managed identity enabled on each virtual machine before deploying the agent.


## Install the Azure Monitor agent
The Azure Monitor Agent is implemented as an [Azure VM extension](../../virtual-machines/extensions/overview.md) with the details in the following table. 

| Property | Windows | Linux |
|:---|:---|:---|
| Publisher | Microsoft.Azure.Monitor  | Microsoft.Azure.Monitor |
| Type      | AzureMonitorWindowsAgent | AzureMonitorLinuxAgent  |
| TypeHandlerVersion  | 1.0 | 1.5 |

Install the Azure Monitor agent using any of the methods to install virtual machine agents including the following using PowerShell or CLI. Alternatively, you can install the agent and configure data collection on virtual machines in your Azure subscription using the portal with the procedure described in [Configure data collection for the Azure Monitor agent (preview)](data-collection-rule-azure-monitor-agent.md#create-using-the-azure-portal).

### Windows

# [CLI](#tab/CLI1)

```azurecli
az vm extension set --name AzureMonitorWindowsAgent --publisher Microsoft.Azure.Monitor --ids {resource ID of the VM}

```

# [PowerShell](#tab/PowerShell1)

```powershell
Set-AzVMExtension -Name AMAWindows -ExtensionType AzureMonitorWindowsAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName {Resource Group Name} -VMName {VM name} -Location eastus
```
---


### Linux

# [CLI](#tab/CLI2)

```azurecli
az vm extension set --name AzureMonitorLinuxAgent --publisher Microsoft.Azure.Monitor --ids {resource ID of the VM}

```

# [PowerShell](#tab/PowerShell2)

```powershell
Set-AzVMExtension -Name AMALinux -ExtensionType AzureMonitorLinuxAgent -Publisher Microsoft.Azure.Monitor -ResourceGroupName {Resource Group Name} -VMName {VM name} -Location eastus
```
---

## Next steps

- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.
