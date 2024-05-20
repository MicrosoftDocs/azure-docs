---
title: Enable VM Insights overview
description: Learn how to deploy and configure VM Insights and find out about the system requirements.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.reviewer: xpathak
ms.date: 09/28/2023
ms.custom: references_regions

---

# Enable VM Insights overview

This article provides an overview of how to enable VM Insights to monitor the health and performance of:

- Azure virtual machines.
- Azure Virtual Machine Scale Sets.
- Hybrid virtual machines connected with Azure Arc.
- On-premises virtual machines.
- Virtual machines hosted in another cloud environment.

> [!NOTE]
> Configuring a Log Analytics workspace for using VM Insights by using the Log Analytics agent is no longer supported.

## Installation options and supported machines

The following table shows the installation methods available for enabling VM Insights on supported machines.

| Method | Scope |
|:---|:---|
| [Azure portal](vminsights-enable-portal.md) | Enable individual machines with the Azure portal. |
| [Azure Policy](vminsights-enable-policy.md) | Create policy to automatically enable when a supported machine is created. |
| [Azure Resource Manager templates](../vm/vminsights-enable-resource-manager.md) | Enable multiple machines by using any of the supported methods to deploy a Resource Manager template, such as the Azure CLI and PowerShell. |
| [PowerShell](vminsights-enable-powershell.md) | Use a PowerShell script to enable multiple machines. |
| [Manual install](vminsights-enable-hybrid.md) | Virtual machines or physical computers on-premises with other cloud environments.|

### Supported Azure Arc machines

VM Insights is available for Azure Arc-enabled servers in regions where the Arc extension service is available. You must be running version 0.9 or above of the Azure Arc agent.

## Supported operating systems

VM Insights supports all operating systems supported by the Dependency agent and either Azure Monitor Agent or Log Analytics agent. For a complete list of operating systems supported by Azure Monitor Agent and Log Analytics agent, see [Azure Monitor agent overview](../agents/agents-overview.md#supported-operating-systems).

Dependency Agent supports the same [Windows versions that Azure Monitor Agent supports](../agents/agents-overview.md#supported-operating-systems), except Windows Server 2008 SP2 and Azure Stack HCI.
For Dependency Agent Linux support, see [Dependency Agent Linux support](../vm/vminsights-dependency-agent-maintenance.md#dependency-agent-linux-support).

> [!IMPORTANT]
> If the Ethernet device for your virtual machine has more than nine characters, it won't be recognized by VM Insights and data won't be sent to the InsightsMetrics table. The agent will collect data from [other sources](../agents/agent-data-sources.md).

### Linux considerations

Consider the following before you install Dependency agent for VM Insights on a Linux machine:

- Only default and SMP Linux kernel releases are supported.
- Nonstandard kernel releases, such as physical address extension (PAE) and Xen, aren't supported for any Linux distribution. For example, a system with the release string of *2.6.16.21-0.8-xen* isn't supported.
- Custom kernels, including recompilations of standard kernels, aren't supported.
- For Debian distros other than version 9.4, the Map feature isn't supported. The Performance feature is available only from the Azure Monitor menu. It isn't available directly from the left pane of the Azure VM.
- CentOSPlus kernel is supported.
- Installing Dependency agent taints the Linux kernel and you might lose support from your Linux distribution until the machine resets.

The Linux kernel must be patched for the Spectre and Meltdown vulnerabilities. For more information, consult with your Linux distribution vendor. Run the following command to check for availability if Spectre/Meltdown has been mitigated:

```
$ grep . /sys/devices/system/cpu/vulnerabilities/*
```

Output for this command looks similar to the following and specify whether a machine is vulnerable to either issue. If these files are missing, the machine is unpatched.

```
/sys/devices/system/cpu/vulnerabilities/meltdown:Mitigation: PTI
/sys/devices/system/cpu/vulnerabilities/spectre_v1:Vulnerable
/sys/devices/system/cpu/vulnerabilities/spectre_v2:Vulnerable: Minimal generic ASM retpoline
```

## Agents

When you enable VM Insights for a machine, the following agents are installed. 

> [!IMPORTANT]
> Azure Monitor Agent has several advantages over the legacy Log Analytics agent, which will be deprecated by August 2024. After this date, Microsoft will no longer provide any support for the Log Analytics agent. [Migrate to Azure Monitor agent](../agents/azure-monitor-agent-migration.md) before August 2024 to continue ingesting data.


- **[Azure Monitor agent](../agents/azure-monitor-agent-overview.md) or [Log Analytics agent](../agents/log-analytics-agent.md):** Collects data from the virtual machine or Virtual Machine Scale Set and delivers it to the Log Analytics workspace.
- **Dependency agent**: Collects discovered data about processes running on the virtual machine and external process dependencies, which are used by the [Map feature in VM Insights](../vm/vminsights-maps.md). The Dependency agent relies on the Azure Monitor Agent or Log Analytics agent to deliver its data to Azure Monitor. If you use Azure Monitor Agent, the Dependency agent is required for the Map feature. If you don't need the map feature, you don't need to install the Dependency agent.

### Network requirements

- For Azure Monitor Agent, the machine must have access to the following HTTPS endpoints:
	- global.handler.control.monitor.azure.com
	- `<virtual-machine-region-name>`.handler.control.monitor.azure.com (example: westus.handler.control.azure.com)
	- `<log-analytics-workspace-id>`.ods.opinsights.azure.com (example: 12345a01-b1cd-1234-e1f2-1234567g8h99.ods.opinsights.azure.com)
    (If using private links on the agent, you must also add the [data collection endpoints](../essentials/data-collection-endpoint-overview.md#components-of-a-dce))

    For more information, see [Define Azure Monitor Agent network settings](../agents/azure-monitor-agent-data-collection-endpoint.md).

- The Dependency agent requires a connection from the virtual machine to the address 169.254.169.254. This address identifies the Azure metadata service endpoint. Ensure that firewall settings allow connections to this endpoint.

## VM Insights data collection rule 

To enable VM Insights on a machine with Azure Monitor Agent, associate a VM insights [data collection rule (DCR)](../essentials/data-collection-rule-overview.md) with the agent. VM Insights creates a default data collection rule if one doesn't already exist.

The data collection rule specifies the data to collect and the workspace to use:  

| Option | Description |
|:---|:---|
| Guest performance | Specifies whether to collect [performance data](/azure/azure-monitor/vm/vminsights-performance) from the guest operating system. This option is required for all machines. The collection interval for performance data is every 60 seconds.|
| Processes and dependencies | Collects information about processes running on the virtual machine and dependencies between machines. This information enables the [Map feature in VM Insights](vminsights-maps.md). This is optional and enables the [VM Insights Map feature](vminsights-maps.md) for the machine. |
| Log Analytics workspace | Workspace to store the data. Only workspaces with VM Insights are listed. |

> [!IMPORTANT]
> VM Insights automatically creates a data collection rule that includes a special data stream required for its operation. Do not modify the VM Insights data collection rule or create your own data collection rule to support VM Insights. To collect additional data, such as Windows and Syslog events, create separate data collection rules and associate them with your machines.

If you associate a data collection rule with the Map feature enabled to a machine on which Dependency Agent isn't installed, the Map view won't be available. To enable the Map view, set `enableAMA property = true` in the Dependency Agent extension when you install Dependency Agent. We recommend following the procedure described in [Enable VM Insights for Azure Monitor Agent](vminsights-enable-portal.md#enable-vm-insights-for-azure-monitor-agent).

## Enable network isolation using Private Link

By default, Azure Monitor Agent connects to a public endpoint to connect to your Azure Monitor environment. To enable network isolation for VM Insights, associate your VM Insights data collection rule to a data collection endpoint linked to an Azure Monitor Private Link Scope, as described in [Enable network isolation for Azure Monitor Agent by using Private Link](../agents/azure-monitor-agent-private-link.md).


## Diagnostic and usage data

Microsoft automatically collects usage and performance data through your use of Azure Monitor. Microsoft uses this data to improve the quality, security, and integrity of the service.

To provide accurate and efficient troubleshooting capabilities, the Map feature includes data about the configuration of your software. The data provides information such as the operating system and version, IP address, DNS name, and workstation name. Microsoft doesn't collect names, addresses, or other contact information.

For more information about data collection and usage, see the [Microsoft Online Services Privacy Statement](https://go.microsoft.com/fwlink/?LinkId=512132).

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-dsr-and-stp-note.md)]

## Next steps

To learn how to use the Performance monitoring feature, see [View VM Insights Performance](../vm/vminsights-performance.md). To view discovered application dependencies, see [View VM Insights Map](../vm/vminsights-maps.md).
