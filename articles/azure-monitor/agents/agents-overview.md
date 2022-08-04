---
title: Overview of the Azure monitoring agents| Microsoft Docs
description: This article provides a detailed overview of the Azure agents that are available and support monitoring virtual machines hosted in an Azure or hybrid environment.
services: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 7/11/2022
ms.reviewer: shseth
---

# Overview of Azure Monitor agents

Virtual machines and other compute resources require an agent to collect monitoring data required to measure the performance and availability of their guest operating system and workloads. Many legacy agents exist today for this purpose. Eventually, they'll all be replaced by the new consolidated [Azure Monitor agent](./azure-monitor-agent-overview.md). This article describes the legacy agents and the new Azure Monitor agent.

The general recommendation is to use the Azure Monitor agent if you aren't bound by [these limitations](./azure-monitor-agent-overview.md#current-limitations) because it consolidates the features of all the legacy agents listed here and provides [other benefits](#azure-monitor-agent).
If you do require the limitations today, you may continue to use the other legacy agents listed here until **August 2024**. [Learn more](./azure-monitor-agent-overview.md).

## Summary of agents

The following tables provide a quick comparison of the telemetry agents for Windows and Linux. More information on each agent is provided in the following sections.

### Windows agents

| | Azure Monitor agent | Diagnostics<br>extension (WAD) | Log Analytics<br>agent | 
|:---|:----|:---|:---|
| **Environments supported** | Azure<br>Other cloud (Azure Arc)<br>On-premises (Azure Arc)<br>[Windows Client OS (preview)](./azure-monitor-agent-windows-client.md)  | Azure | Azure<br>Other cloud<br>On-premises |  
| **Agent requirements**  | None | None | None | 
| **Data collected** | Event Logs<br>Performance<br>File based logs (preview)<br> | Event Logs<br>ETW events<br>Performance<br>File based logs<br>IIS logs<br>.NET app logs<br>Crash dumps<br>Agent diagnostics logs | Event Logs<br>Performance<br>File based logs<br>IIS logs<br>Insights and solutions<br>Other services |
| **Data sent to** | Azure Monitor Logs<br>Azure Monitor Metrics<sup>1</sup> | Azure Storage<br>Azure Monitor Metrics<br>Event Hub | Azure Monitor Logs | 
| **Services and**<br>**features**<br>**supported** | Log Analytics<br>Metrics explorer<br>Microsoft Sentinel ([view scope](./azure-monitor-agent-overview.md#supported-services-and-features)) | Metrics explorer | VM insights<br>Log Analytics<br>Azure Automation<br>Microsoft Defender for Cloud<br>Microsoft Sentinel |

### Linux agents

|                                                   | Azure Monitor agent                                                                                                                       | Diagnostics<br>extension (LAD) | Telegraf<br>agent                   | Log Analytics<br>agent                                                                                 | 
| :------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------- | :---------------------------------- | :----------------------------------------------------------------------------------------------------- | 
| **Environments supported**                        | Azure<br>Other cloud (Azure Arc)<br>On-premises (Azure Arc)                                                                               | Azure                          | Azure<br>Other cloud<br>On-premises | Azure<br>Other cloud<br>On-premises                                                                    |
| **Agent requirements**                            | None                                                                                                                                      | None                           | None                                | None                                                                                                   | 
| **Data collected**                                | Syslog<br>Performance<br>File based logs (preview)<br>                                                                                    | Syslog<br>Performance          | Performance                         | Syslog<br>Performance                                                                                  | 
| **Data sent to**                                  | Azure Monitor Logs<br>Azure Monitor Metrics<sup>1</sup>                                                                                   | Azure Storage<br>Event Hub     | Azure Monitor Metrics               | Azure Monitor Logs                                                                                     | 
| **Services and**<br>**features**<br>**supported** | Log Analytics<br>Metrics explorer<br>Microsoft Sentinel ([view scope](./azure-monitor-agent-overview.md#supported-services-and-features)) |                                | Metrics explorer                    | VM insights<br>Log Analytics<br>Azure Automation<br>Microsoft Defender for Cloud<br>Microsoft Sentinel | 

<sup>1</sup> To review other limitations of using Azure Monitor Metrics, see [quotas and limits](../essentials/metrics-custom-overview.md#quotas-and-limits). On Linux, using Azure Monitor Metrics as the only destination is supported in v.1.10.9.0 or higher.

## Azure Monitor agent

The [Azure Monitor agent](azure-monitor-agent-overview.md) is meant to replace the Log Analytics agent, Azure Diagnostics extension, and Telegraf agent for Windows and Linux machines. It can send data to Azure Monitor Logs and Azure Monitor Metrics and uses [data collection rules (DCRs)](../essentials/data-collection-rule-overview.md). DCRs provide a more scalable method of configuring data collection and destinations for each agent.

Use the Azure Monitor agent to gain these benefits:

- Collect guest logs and metrics from any machine in Azure, in other clouds, or on-premises. ([Azure Arc-enabled servers](../../azure-arc/servers/overview.md) are required for machines outside of Azure.)
-	Collect specific data types from specific machines with granular targeting via [DCRs](../essentials/data-collection-rule-overview.md) as compared to the "all or nothing" mode that the Log Analytics agent supports.
-	Use XPath queries to filter Windows events that get collected, which helps to further reduce ingestion and storage costs.
- Centrally configure collection for different sets of data from different sets of VMs.
- Simplify management of data collection. Send data from Windows and Linux VMs to multiple Log Analytics workspaces (for example, "multihoming") and/or other [supported destinations](./azure-monitor-agent-overview.md#data-sources-and-destinations). Every action across the data collection lifecycle, from onboarding to deployment to updates, is easier, scalable, and centralized (in Azure) by using DCRs.
- Manage dependent solutions or services. The Azure Monitor agent uses a new method of handling extensibility that's more transparent and controllable than management packs and Linux plug-ins in the legacy Log Analytics agents. This management experience is identical for machines in Azure or on-premises/other clouds via Azure Arc, at no added cost.
-  Use Managed Identity (for virtual machines) and Azure Active Directory device tokens (for clients), which are much more secure and "hack proof" than certificates or workspace keys that legacy agents use. This agent performs better at higher events-per-second upload rates compared to legacy agents.
- Manage data collection configuration centrally by using [DCRs](../essentials/data-collection-rule-overview.md), and use Azure Resource Manager templates or policies for management overall.
- Send data to Azure Monitor Logs and Azure Monitor Metrics (preview) for analysis with Azure Monitor.
- Use Windows event filtering or multihoming for logs on Windows and Linux.

<!--- Send data to Azure Storage for archiving.
- Send data to third-party tools by using [Azure Event Hubs](./diagnostics-extension-stream-event-hubs.md).
- Manage the security of your machines by using [Microsoft Defender for Cloud](../../security-center/security-center-introduction.md) or [Microsoft Sentinel](../../sentinel/overview.md). (Available in private preview.)
- Use [VM insights](../vm/vminsights-overview.md), which allows you to monitor your machines at scale and monitors their processes and dependencies on other resources and external processes.  
- Manage the security of your machines by using [Microsoft Defender for Cloud](../../security-center/security-center-introduction.md) or [Microsoft Sentinel](../../sentinel/overview.md).
- Use different [solutions](../monitor-reference.md#insights-and-curated-visualizations) to monitor a particular service or application. */
-->

When compared with the legacy agents, the Azure Monitor agent has [these limitations currently](./azure-monitor-agent-overview.md#current-limitations).

## Log Analytics agent

> [!WARNING]
> The Log Analytics agents are on a deprecation path and will no longer be supported after August 31, 2024.

The legacy [Log Analytics agent](./log-analytics-agent.md) collects monitoring data from the guest operating system and workloads of virtual machines in Azure, other cloud providers, and on-premises machines. It sends data to a Log Analytics workspace. The Log Analytics agent is the same agent used by System Center Operations Manager. You can multihome agent computers to communicate with your management group and Azure Monitor simultaneously. This agent is also required by certain insights in Azure Monitor and other services in Azure.

> [!NOTE]
> The Log Analytics agent for Windows is often referred to as Microsoft Monitoring Agent (MMA). The Log Analytics agent for Linux is often referred to as OMS agent.

Use the Log Analytics agent if you need to:

* Collect logs and performance data from Azure virtual machines or hybrid machines hosted outside of Azure.
* Send data to a Log Analytics workspace to take advantage of features supported by [Azure Monitor Logs](../logs/data-platform-logs.md), such as [log queries](../logs/log-query-overview.md).
* Use [VM insights](../vm/vminsights-overview.md), which allows you to monitor your machines at scale and monitor their processes and dependencies on other resources and external processes.  
* Manage the security of your machines by using [Microsoft Defender for Cloud](../../security-center/security-center-introduction.md) or [Microsoft Sentinel](../../sentinel/overview.md).
* Use [Azure Automation Update Management](../../automation/update-management/overview.md), [Azure Automation State Configuration](../../automation/automation-dsc-overview.md), or [Azure Automation Change Tracking and Inventory](../../automation/change-tracking/overview.md) to deliver comprehensive management of your Azure and non-Azure machines.
* Use different [solutions](../monitor-reference.md#insights-and-curated-visualizations) to monitor a particular service or application.

Limitations of the Log Analytics agent:

- Can't send data to Azure Monitor Metrics, Azure Storage, or Azure Event Hubs
- Difficult to configure unique monitoring definitions for individual agents
- Difficult to manage at scale because each virtual machine has a unique configuration

## Azure Diagnostics extension

The [Azure Diagnostics extension](./diagnostics-extension-overview.md) collects monitoring data from the guest operating system and workloads of Azure virtual machines and other compute resources. It primarily collects data into Azure Storage. It also allows you to define data sinks to send data to other destinations, such as Azure Monitor Metrics and Azure Event Hubs.

Use the Azure Diagnostics extension if you need to:

- Send data to Azure Storage for archiving or to analyze it with tools such as [Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md).
- Send data to [Azure Monitor Metrics](../essentials/data-platform-metrics.md) to analyze it with [Metrics Explorer](../essentials/metrics-getting-started.md) and to take advantage of features such as near-real-time [metric alerts](../alerts/alerts-metric-overview.md) and [autoscale](../autoscale/autoscale-overview.md) (Windows only).
- Send data to third-party tools by using [Azure Event Hubs](./diagnostics-extension-stream-event-hubs.md).
- Collect [Boot Diagnostics](/troubleshoot/azure/virtual-machines/boot-diagnostics) to investigate VM boot issues.

Limitations of the Azure Diagnostics extension:

- Can only be used with Azure resources
- Limited ability to send data to Azure Monitor Logs

## Telegraf agent

The [InfluxData Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md) is used to collect performance data from Linux computers to send to Azure Monitor Metrics.

Use the Telegraf agent if you need to:

* Send data to [Azure Monitor Metrics](../essentials/data-platform-metrics.md) to analyze it with [Metrics Explorer](../essentials/metrics-getting-started.md) and to take advantage of features such as near-real-time [metric alerts](../alerts/alerts-metric-overview.md) and [autoscale](../autoscale/autoscale-overview.md) (Linux only).

## Virtual machine extensions

The [Azure Monitor agent](./azure-monitor-agent-manage.md#virtual-machine-extension-details) is only available as a virtual machine extension. The Log Analytics extension for [Windows](../../virtual-machines/extensions/oms-windows.md) and [Linux](../../virtual-machines/extensions/oms-linux.md) install the Log Analytics agent on Azure virtual machines. These are the same agents described above but allow you to manage them through [virtual machine extensions](../../virtual-machines/extensions/overview.md). You should use extensions to install and manage the agents whenever possible.

On hybrid machines, use [Azure Arc-enabled servers](../../azure-arc/servers/manage-vm-extensions.md) to deploy the Azure Monitor agent, Log Analytics, and Azure Monitor Dependency VM extensions.

## Supported operating systems

The following tables list the operating systems that are supported by the Azure Monitor agents. See the documentation for each agent for unique considerations and for the installation process. See Telegraf documentation for its supported operating systems. All operating systems are assumed to be x64. x86 is not supported for any operating system.

### Windows

| Operating system | Azure Monitor agent | Log Analytics agent | Diagnostics extension | 
|:---|:---:|:---:|:---:|:---:|
| Windows Server 2022                                      | X |   |   |
| Windows Server 2022 Core                                 | X |   |   |
| Windows Server 2019                                      | X | X | X |
| Windows Server 2019 Core                                 | X |   |   |
| Windows Server 2016                                      | X | X | X |
| Windows Server 2016 Core                                 | X |   | X |
| Windows Server 2012 R2                                   | X | X | X |
| Windows Server 2012                                      | X | X | X |
| Windows Server 2008 R2 SP1                               | X | X | X |
| Windows Server 2008 R2                                   |   |   | X |
| Windows Server 2008 SP2                                  |   | X |   |
| Windows 11 client OS                                     | X<sup>2</sup> |  |  |
| Windows 10 1803 (RS4) and higher                         | X<sup>2</sup> |  |  |
| Windows 10 Enterprise<br>(including multi-session) and Pro<br>(Server scenarios only<sup>1</sup>)  | X | X | X | 
| Windows 8 Enterprise and Pro<br>(Server scenarios only<sup>1</sup>)  |   | X |   |
| Windows 7 SP1<br>(Server scenarios only<sup>1</sup>)                 |   | X |   |
| Azure Stack HCI                                          |   | X |   |

<sup>1</sup> Running the OS on server hardware, for example, machines that are always connected, always turned on, and not running other workloads (PC, office, browser)<br>
<sup>2</sup> Using the Azure Monitor agent [client installer (preview)](./azure-monitor-agent-windows-client.md)

### Linux

| Operating system | Azure Monitor agent <sup>1</sup> | Log Analytics agent <sup>1</sup> | Diagnostics extension <sup>2</sup>| 
|:---|:---:|:---:|:---:|:---:
| AlmaLinux 8.*                                               | X | X |   |
| Amazon Linux 2017.09                                        |   | X |   |
| Amazon Linux 2                                              |   | X |   |
| CentOS Linux 8                                              | X <sup>3</sup> | X |   |
| CentOS Linux 7                                              | X | X | X |
| CentOS Linux 6                                              |   | X |   |
| CentOS Linux 6.5+                                           |   | X | X |
| Debian 11 <sup>1</sup>                                      | X |   |   |
| Debian 10 <sup>1</sup>                                      | X |   |   |
| Debian 9                                                    | X | X | X |
| Debian 8                                                    |   | X |   |
| Debian 7                                                    |   |   | X |
| OpenSUSE 13.1+                                              |   |   | X |
| Oracle Linux 8                                              | X <sup>3</sup> | X |   |
| Oracle Linux 7                                              | X | X | X |
| Oracle Linux 6                                              |   | X |   |
| Oracle Linux 6.4+                                           |   | X | X |
| Red Hat Enterprise Linux Server 8.5, 8.6                    | X | X |   |
| Red Hat Enterprise Linux Server 8, 8.1, 8.2, 8.3, 8.4       | X <sup>3</sup> | X |   |
| Red Hat Enterprise Linux Server 7                           | X | X | X |
| Red Hat Enterprise Linux Server 6                           |   | X |   |
| Red Hat Enterprise Linux Server 6.7+                        |   | X | X |
| Rocky Linux 8.*                                             | X | X |   |
| SUSE Linux Enterprise Server 15.2                           | X <sup>3</sup> |   |   |
| SUSE Linux Enterprise Server 15.1                           | X <sup>3</sup> | X |   |
| SUSE Linux Enterprise Server 15 SP1                         | X | X |   |
| SUSE Linux Enterprise Server 15                             | X | X |   |
| SUSE Linux Enterprise Server 12 SP5                         | X | X | X |
| SUSE Linux Enterprise Server 12                             | X | X | X |
| Ubuntu 22.04 LTS                                            | X |   |   |
| Ubuntu 20.04 LTS                                            | X | X | X <sup>4</sup> |
| Ubuntu 18.04 LTS                                            | X | X | X |
| Ubuntu 16.04 LTS                                            | X | X | X |
| Ubuntu 14.04 LTS                                            |   | X | X |

<sup>1</sup> Requires Python (2 or 3) to be installed on the machine.<br>
<sup>2</sup> Known issue collecting Syslog events in versions prior to 1.9.0.<br>
<sup>3</sup> Not all kernel versions are supported. Check the supported kernel versions in the following table.

## Next steps

For more information on each of the agents, see the following articles:

- [Overview of the Azure Monitor agent](./azure-monitor-agent-overview.md)
- [Overview of the Log Analytics agent](./log-analytics-agent.md)
- [Azure Diagnostics extension overview](./diagnostics-extension-overview.md)
- [Collect custom metrics for a Linux VM with the InfluxData Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md)
