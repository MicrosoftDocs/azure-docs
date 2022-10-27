---
title: Enable VM insights overview
description: Learn how to deploy and configure VM insights and find out about the system requirements.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/24/2022
ms.custom: references_regions

---

# Enable VM insights overview

This article provides an overview of the options available to enable VM insights to monitor the health and performance of:

- Azure virtual machines.
- Azure virtual machine scale sets.
- Hybrid virtual machines connected with Azure Arc.
- On-premises virtual machines.
- Virtual machines hosted in another cloud environment.

## Installation options and supported machines

The following table shows the installation methods available for enabling VM insights on supported machines.

| Method | Scope |
|:---|:---|
| [Azure portal](vminsights-enable-portal.md) | Enable individual machines with the Azure portal. |
| [Azure Policy](vminsights-enable-policy.md) | Create policy to automatically enable when a supported machine is created. |
| [Azure Resource Manager templates](../vm/vminsights-enable-resource-manager.md) | Enable multiple machines by using any of the supported methods to deploy a Resource Manager template, such as the Azure CLI and PowerShell. |
| [PowerShell](vminsights-enable-powershell.md) | Use a PowerShell script to enable multiple machines. Log Analytics agent only. |
| [Manual install](vminsights-enable-hybrid.md) | Virtual machines or physical computers on-premises with other cloud environments. Log Analytics agent only. |

## Supported Azure Arc machines

VM insights is available for Azure Arc-enabled servers in regions where the Arc extension service is available. You must be running version 0.9 or above of the Azure Arc agent.

## Supported operating systems

VM insights supports any operating system that supports the Dependency agent and either the Azure Monitor agent (preview) or Log Analytics agent. For a complete list, see [Azure Monitor agent overview](../agents/agents-overview.md#supported-operating-systems).

> [!IMPORTANT]
> If the Ethernet device for your virtual machine has more than nine characters, it won't be recognized by VM insights and data won't be sent to the InsightsMetrics table. The agent will collect data from [other sources](../agents/agent-data-sources.md).

### Linux considerations

See the following list of considerations on Linux support of the Dependency agent that supports VM insights:

- Only default and SMP Linux kernel releases are supported.
- Nonstandard kernel releases, such as physical address extension (PAE) and Xen, aren't supported for any Linux distribution. For example, a system with the release string of *2.6.16.21-0.8-xen* isn't supported.
- Custom kernels, including recompilations of standard kernels, aren't supported.
- For Debian distros other than version 9.4, the Map feature isn't supported. The Performance feature is available only from the Azure Monitor menu. It isn't available directly from the left pane of the Azure VM.
- CentOSPlus kernel is supported.

The Linux kernel must be patched for the Spectre and Meltdown vulnerabilities. For more information, consult your Linux distribution vendor. Run the following command to check for availability if Spectre/Meltdown has been mitigated:

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

VM insights requires a Log Analytics workspace. For requirements of this workspace, see [Configure Log Analytics workspace for VM insights](vminsights-configure-workspace.md).

> [!NOTE]
> VM Insights doesn't support sending data to more than one Log Analytics workspace (multi-homing).
>

## Network requirements

- For the network requirements for the Log Analytics agent, see [Network requirements](../agents/log-analytics-agent.md#network-requirements).
- The Dependency agent requires a connection from the virtual machine to the address 169.254.169.254. This address identifies the Azure metadata service endpoint. Ensure that firewall settings allow connections to this endpoint.

## Agents

When you enable VM insights for a machine, the following agents are installed. For the network requirements for these agents, see [Network requirements](../agents/log-analytics-agent.md#network-requirements).

> [!IMPORTANT]
> VM insights support for the Azure Monitor agent is currently in public preview. The Azure Monitor agent has several advantages over the Log Analytics agent. It's the preferred agent for virtual machines and virtual machine scale sets. For a comparison of the agent and information on migrating, see [Migrate to Azure Monitor agent from Log Analytics agent](../agents/azure-monitor-agent-migration.md).

- **[Azure Monitor agent](../agents/azure-monitor-agent-overview.md) or [Log Analytics agent](../agents/log-analytics-agent.md):** Collects data from the virtual machine or virtual machine scale set and delivers it to the Log Analytics workspace.
- **Dependency agent**: Collects discovered data about processes running on the virtual machine and external process dependencies, which are used by the [Map feature in VM insights](../vm/vminsights-maps.md). The Dependency agent relies on the Azure Monitor agent or Log Analytics agent to deliver its data to Azure Monitor.

## Changes for the Azure Monitor agent

There are several changes in the process for enabling VM insights when you use the Azure Monitor agent:

- **Workspace configuration:** You no longer need to [enable VM insights on the Log Analytics workspace](vminsights-configure-workspace.md) because the Azure Monitor agent doesn't use the *VMInsights* management pack.
- **Data collection rule (DCR):** The Azure Monitor agent uses [data collection rules](../essentials/data-collection-rule-overview.md) to configure its data collection. VM insights creates a DCR that's automatically deployed if you enable your machine by using the Azure portal. If you use other methods to onboard your machines, you might need to install the DCR first.
- **Agent deployment:** There are minor changes to the process for onboarding virtual machines and virtual machine scale sets to VM insights in the Azure portal. You must now select which agent you want to use, and you must select a DCR for the Azure Monitor agent. For more information, see [Enable VM insights in the Azure portal](vminsights-enable-portal.md).

## Data collection rule (Azure Monitor agent)

When you enable VM insights on a machine with the Azure Monitor agent, you must specify a [data collection rule](../essentials/data-collection-rule-overview.md) to use. The DCR specifies the data to collect and the workspace to use. VM insights creates a default DCR if one doesn't already exist. For more information on how to create and edit the VM insights DCR, see [Enable VM insights for the Azure Monitor agent
](vminsights-enable-portal.md#enable-vm-insights-for-azure-monitor-agent).

> [!IMPORTANT]
> Don't create your own DCR to support VM insights. The DCR created by VM insights includes a special data stream required for its operation. You can edit this DCR to collect more data, such as Windows and Syslog events, but you should create more DCRs and associate them with the machine.

The DCR is defined by the options in the following table.

| Option | Description |
|:---|:---|
| Guest performance | Specifies whether to collect performance data from the guest operating system. This option is required for all machines. |
| Processes and dependencies | Collects information about processes running on the virtual machine and dependencies between machines. This information enables the [Map feature in VM insights](vminsights-maps.md). This is optional and enables the [VM insights Map feature](vminsights-maps.md) for the machine. |
| Log Analytics workspace | Workspace to store the data. Only workspaces with VM insights are listed. |

## Management packs (Log Analytics agent)

When a Log Analytics workspace is configured for VM insights, two management packs are forwarded to all the Windows computers connected to that workspace. The management packs are named *Microsoft.IntelligencePacks.ApplicationDependencyMonitor* and *Microsoft.IntelligencePacks.VMInsights*. They're written to *%Programfiles%\Microsoft Monitoring Agent\Agent\Health Service State\Management Packs*.

The data source used by the *ApplicationDependencyMonitor* management pack is **%Program files%\Microsoft Monitoring Agent\Agent\Health Service State\Resources\<AutoGeneratedID>\Microsoft.EnterpriseManagement.Advisor.ApplicationDependencyMonitorDataSource.dll*. The data source used by the *VMInsights* management pack is *%Program files%\Microsoft Monitoring Agent\Agent\Health Service State\Resources\<AutoGeneratedID>\ Microsoft.VirtualMachineMonitoringModule.dll*.

## Migrate from Log Analytics agent

The Azure Monitor agent and the Log Analytics agent can both be installed on the same machine during migration. Running both agents might lead to duplication of data and increased cost. If a machine has both agents installed, you'll see a warning in the Azure portal that you might be collecting duplicate data.

> [!WARNING]
> Collecting duplicate data from a single machine with both the Azure Monitor agent and Log Analytics agent can result in the following consequences:
>
> - Extra ingestion cost from sending duplicate data to the Log Analytics workspace.
> - The Map feature of VM insights might be inaccurate because it doesn't check for duplicate data.

:::image type="content" source="media/vminsights-enable-portal/both-agents-installed.png" lightbox="media/vminsights-enable-portal/both-agents-installed.png" alt-text="Screenshot that shows both agents installed.":::

You must remove the Log Analytics agent yourself from any machines that are using it. Before you do this step, ensure that the machine isn't relying on any other solutions that require the Log Analytics agent. For more information, see [Migrate to Azure Monitor agent from Log Analytics agent](../agents/azure-monitor-agent-migration.md).

After you verify that no Log Analytics agents are still connected to your Log Analytics workspace, you can [remove the *VMInsights* solution from the workspace](vminsights-configure-workspace.md#remove-vminsights-solution-from-workspace). It's no longer needed.

> [!NOTE]
> To check if you have any machines with both agents sending data to your Log Analytics workspace, run the following [log query](../logs/log-query-overview.md) in [Log Analytics](../logs/log-analytics-overview.md). This query will show the last heartbeat for each computer. If a computer has both agents, it will return two records, each with a different `category`. The Azure Monitor agent will have a `category` of *Azure Monitor Agent*. The Log Analytics agent will have a `category` of *Direct Agent*.
>
> ```KQL
> Heartbeat
> | summarize max(TimeGenerated) by Computer, Category
> | sort by Computer
> ```

## Diagnostic and usage data

Microsoft automatically collects usage and performance data through your use of Azure Monitor. Microsoft uses this data to improve the quality, security, and integrity of the service.

To provide accurate and efficient troubleshooting capabilities, the Map feature includes data about the configuration of your software. The data provides information such as the operating system and version, IP address, DNS name, and workstation name. Microsoft doesn't collect names, addresses, or other contact information.

For more information about data collection and usage, see the [Microsoft Online Services Privacy Statement](https://go.microsoft.com/fwlink/?LinkId=512132).

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-dsr-and-stp-note.md)]

## Next steps

To learn how to use the Performance monitoring feature, see [View VM insights Performance](../vm/vminsights-performance.md). To view discovered application dependencies, see [View VM insights Map](../vm/vminsights-maps.md).
