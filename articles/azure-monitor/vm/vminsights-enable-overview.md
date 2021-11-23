---
title: Enable VM insights overview
description: Learn how to deploy and configure VM insights. Find out the system requirements.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/22/2020
ms.custom: references_regions

---

# Enable VM insights overview

This article provides an overview of the options available to enable VM insights to monitor health and performance of the following:

- Azure virtual machines 
- Azure virtual machine scale sets
- Hybrid virtual machines connected with Azure Arc
- On-premises virtual machines
- Virtual machines hosted in another cloud environment.  

To set up VM insights:

* Enable a single Azure virtual machine, Azure virtual machine scale set, or Azure Arc machine by selecting **Insights** directly from their menu in the Azure portal.
* Enable multiple Azure virtual machines, Azure virtual machines, or Azure Arc machines by using Azure Policy. This method ensures that on existing and new VMs and scale sets, the required dependencies are installed and properly configured. Noncompliant virtual machines and scale sets are reported, so you can decide whether to enable them and to remediate them.
* Enable multiple Azure virtual machines, Azure Arc virtual machines, Azure virtual machine scale sets, or Azure Arc machines across a specified subscription or resource group by using PowerShell.
* Enable VM insights to monitor VMs or physical computers hosted in your corporate network or other cloud environment.

## Supported machines
VM insights supports the following machines:

- Azure virtual machine
- Azure virtual machine scale set
- Hybrid virtual machine connected with Azure Arc

> [!IMPORTANT]
> If the ethernet device for your virtual machine has more than nine characters, then it won’t be recognized by VM insights and data won’t be sent to the InsightsMetrics table. The agent will collect data from [other sources](../agents/agent-data-sources.md).

## Supported Azure Arc machines
VM insights is available for Azure Arc-enabled servers in regions where the Arc extension service is available. You must be running version 0.9 or above of the Arc Agent.

| Connected source | Supported | Description |
|:--|:--|:--|
| Windows agents | Yes | Along with the [Log Analytics agent for Windows](../agents/log-analytics-agent.md), Windows agents need the Dependency agent. For more information, see [supported operating systems](../agents/agents-overview.md#supported-operating-systems). |
| Linux agents | Yes | Along with the [Log Analytics agent for Linux](../agents/log-analytics-agent.md), Linux agents need the Dependency agent. For more information, see [supported operating systems](#supported-operating-systems). |
| System Center Operations Manager management group | No | |

## Supported operating systems

VM insights supports any operating system that supports the Log Analytics agent and Dependency agent. See [Overview of Azure Monitor agents
](../agents/agents-overview.md#supported-operating-systems) for a complete list.

> [!IMPORTANT]
> The VM insights guest health feature has more limited operating system support while it's in public preview. See [Enable VM insights guest health (preview)](../vm/vminsights-health-enable.md) for a detailed list.

### Linux considerations
See the following list of considerations on Linux support of the Dependency agent that supports VM insights:

- Only default and SMP Linux kernel releases are supported.
- Nonstandard kernel releases, such as Physical Address Extension (PAE) and Xen, aren't supported for any Linux distribution. For example, a system with the release string of *2.6.16.21-0.8-xen* isn't supported.
- Custom kernels, including recompilations of standard kernels, aren't supported.
- For Debian distros other than version 9.4, the map feature isn't supported, and the Performance feature is available only from the Azure Monitor menu. It isn't available directly from the left pane of the Azure VM.
- CentOSPlus kernel is supported.

The Linux kernel must be patched for the Spectre and Meltdown vulnerabilities. Please consult your Linux distribution vendor for more details. Run the following command to check for available if Spectre/Meltdown has been mitigated:

```
$ grep . /sys/devices/system/cpu/vulnerabilities/*
```

Output for this command will look similar to the following and specify whether a machine is vulnerable to either issue. If these files are missing, the machine is unpatched.

```
/sys/devices/system/cpu/vulnerabilities/meltdown:Mitigation: PTI
/sys/devices/system/cpu/vulnerabilities/spectre_v1:Vulnerable
/sys/devices/system/cpu/vulnerabilities/spectre_v2:Vulnerable: Minimal generic ASM retpoline
```


## Log Analytics workspace
VM insights requires a Log Analytics workspace. See [Configure Log Analytics workspace for VM insights](vminsights-configure-workspace.md) for details and requirements of this workspace.
## Agents
VM insights requires the following two agents to be installed on each virtual machine or virtual machine scale set to be monitored. To onboard the resource, install these agents and connect them to the workspace.  See [Network requirements](../agents/log-analytics-agent.md#network-requirements) for the network requirements for these agents.

- [Log Analytics agent](../agents/log-analytics-agent.md). Collects events and performance data from the virtual machine or virtual machine scale set and delivers it to the Log Analytics workspace. Deployment methods for the Log Analytics agent on Azure resources use the VM extension for [Windows](../../virtual-machines/extensions/oms-windows.md) and [Linux](../../virtual-machines/extensions/oms-linux.md).
- Dependency agent. Collects discovered data about processes running on the virtual machine and external process dependencies, which are used by the [Map feature in VM insights](../vm/vminsights-maps.md). The Dependency agent relies on the Log Analytics agent to deliver its data to Azure Monitor. Deployment methods for the Dependency agent on Azure resources use the VM extension for [Windows](../../virtual-machines/extensions/agent-dependency-windows.md) and [Linux](../../virtual-machines/extensions/agent-dependency-linux.md).

> [!NOTE]
> The Log Analytics agent is the same agent used by System Center Operations Manager. VM insights can monitor agents that are also monitored by Operations Manager if they are directly connected, and you install the Dependency agent on them. Agents connected to Azure Monitor through a [management group connection](../tform/../agents/om-agents.md) cannot be monitored by VM insights.

The following are multiple methods for deploying these agents. 

| Method | Description |
|:---|:---|
| [Azure portal](../vm/vminsights-enable-portal.md) | Install both agents on a single virtual machine, virtual machine scale set, or hybrid virtual machines connected with Azure Arc. |
| [Resource Manager templates](../vm/vminsights-enable-resource-manager.md) | Install both agents using any of the supported methods to deploy a Resource Manager template including CLI and PowerShell. |
| [Azure Policy](../vm/vminsights-enable-policy.md) | Assign  Azure Policy initiative to automatically install the agents when a virtual machine or virtual machine scale set is created. |
| [Manual install](../vm/vminsights-enable-hybrid.md) | Install the agents in the guest operating system on computers hosted outside of Azure including in your datacenter or other cloud environments. |


## Network requirements

- See [Network requirements](../agents/log-analytics-agent.md#network-requirements) for the network requirements for the Log Analytics agent.
- The dependency agent requires a connection from the virtual machine to the address 169.254.169.254. This is the Azure metadata service endpoint. Ensure that firewall settings allow connections to this endpoint.


## Management packs
When a Log Analytics workspace is configured for VM insights, two management packs are forwarded to all the Windows computers connected to that workspace. The management packs are named *Microsoft.IntelligencePacks.ApplicationDependencyMonitor* and *Microsoft.IntelligencePacks.VMInsights* and are written to *%Programfiles%\Microsoft Monitoring Agent\Agent\Health Service State\Management Packs*. 

The data source used by the *ApplicationDependencyMonitor* management pack is **%Program files%\Microsoft Monitoring Agent\Agent\Health Service State\Resources\<AutoGeneratedID>\Microsoft.EnterpriseManagement.Advisor.ApplicationDependencyMonitorDataSource.dll*. The data source used by the *VMInsights* management pack is *%Program files%\Microsoft Monitoring Agent\Agent\Health Service State\Resources\<AutoGeneratedID>\ Microsoft.VirtualMachineMonitoringModule.dll*.

## Diagnostic and usage data

Microsoft automatically collects usage and performance data through your use of the Azure Monitor service. Microsoft uses this data to improve the quality, security, and integrity of the service. 

To provide accurate and efficient troubleshooting capabilities, the Map feature includes data about the configuration of your software. The data provides information such as the operating system and version, IP address, DNS name, and workstation name. Microsoft doesn't collect names, addresses, or other contact information.

For more information about data collection and usage, see the [Microsoft Online Services Privacy Statement](https://go.microsoft.com/fwlink/?LinkId=512132).

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-dsr-and-stp-note.md)]

## Next steps

To learn how to use the Performance monitoring feature, see [View VM insights Performance](../vm/vminsights-performance.md). To view discovered application dependencies, see [View VM insights Map](../vm/vminsights-maps.md).
