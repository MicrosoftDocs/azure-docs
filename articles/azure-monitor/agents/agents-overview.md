---
title: Overview of the Azure monitoring agents| Microsoft Docs
description: This article provides a detailed overview of the Azure agents available which support monitoring virtual machines hosted in Azure or hybrid environment.
services: azure-monitor

ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/22/2021
---

# Overview of Azure Monitor agents

Virtual machines and other compute resources require an agent to collect monitoring data required to measure the performance and availability of their guest operating system and workloads. This article describes the agents used by Azure Monitor and helps you determine which you need to meet the requirements for your particular environment.

> [!NOTE]
> Azure Monitor recently launched a new agent, the Azure Monitor agent, that provides all capabilities necessary to collect guest operating system monitoring data. While there are multiple legacy agents that exist due to the consolidation of Azure Monitor and Log Analytics, each with their unique capabilities with some overlap, we recommend that you use the new agent that aims to consolidate features from all existing agents, and provide additional benefits. [Learn More](./azure-monitor-agent-overview.md)

## Summary of agents

The following tables provide a quick comparison of the Azure Monitor agents for Windows and Linux. Further detail on each is provided in the section below.

### Windows agents

| | Azure Monitor agent | Diagnostics<br>extension (WAD) | Log Analytics<br>agent | Dependency<br>agent |
|:---|:---|:---|:---|:---|
| **Environments supported** | Azure<br>Other cloud (Azure Arc)<br>On-premises (Azure Arc)  | Azure | Azure<br>Other cloud<br>On-premises | Azure<br>Other cloud<br>On-premises | 
| **Agent requirements**  | None | None | None | Requires Log Analytics agent |
| **Data collected** | Event Logs<br>Performance | Event Logs<br>ETW events<br>Performance<br>File based logs<br>IIS logs<br>.NET app logs<br>Crash dumps<br>Agent diagnostics logs | Event Logs<br>Performance<br>File based logs<br>IIS logs<br>Insights and solutions<br>Other services | Process dependencies<br>Network connection metrics |
| **Data sent to** | Azure Monitor Logs<br>Azure Monitor Metrics | Azure Storage<br>Azure Monitor Metrics<br>Event Hub | Azure Monitor Logs | Azure Monitor Logs<br>(through Log Analytics agent) |
| **Services and**<br>**features**<br>**supported** | Log Analytics<br>Metrics explorer | Metrics explorer | VM insights<br>Log Analytics<br>Azure Automation<br>Azure Security Center<br>Azure Sentinel | VM insights<br>Service Map |

### Linux agents

| | Azure Monitor agent | Diagnostics<br>extension (LAD) | Telegraf<br>agent | Log Analytics<br>agent | Dependency<br>agent |
|:---|:---|:---|:---|:---|:---|
| **Environments supported** | Azure<br>Other cloud (Azure Arc)<br>On-premises (Azure Arc) | Azure | Azure<br>Other cloud<br>On-premises | Azure<br>Other cloud<br>On-premises | Azure<br>Other cloud<br>On-premises |
| **Agent requirements**  | None | None | None | None | Requires Log Analytics agent |
| **Data collected** | Syslog<br>Performance | Syslog<br>Performance | Performance | Syslog<br>Performance| Process dependencies<br>Network connection metrics |
| **Data sent to** | Azure Monitor Logs<br>Azure Monitor Metrics<sup>1</sup> | Azure Storage<br>Event Hub | Azure Monitor Metrics | Azure Monitor Logs | Azure Monitor Logs<br>(through Log Analytics agent) |
| **Services and**<br>**features**<br>**supported** | Log Analytics<br>Metrics explorer | | Metrics explorer | VM insights<br>Log Analytics<br>Azure Automation<br>Azure Security Center<br>Azure Sentinel | VM insights<br>Service Map |

<sup>1</sup> There's a limitation today on Azure Monitor Agent for Linux wherein using Azure Monitor Metrics as the *only* destination is not supported. Using it alongwith Azure Monitor Logs works. This limitation will be addressed in the next extension update.

## Azure Monitor agent

The [Azure Monitor agent](azure-monitor-agent-overview.md) is meant to replace the Log Analytics agent, Azure Diagnostic extension and Telegraf agent for both Windows and Linux machines. It can send data to both Azure Monitor Logs and Azure Monitor Metrics and uses [Data Collection Rules (DCR)](data-collection-rule-overview.md) which provide a more scalable method of configuring data collection and destinations for each agent.

Use the Azure Monitor agent if you need to:

- Collect guest logs and metrics from any machine in Azure, in other clouds, or on-premises. ([Azure Arc enabled servers](../../azure-arc/servers/overview.md) required for machines outside of Azure.) 
- Manage data collection configuration centrally, using [data collection rules](./data-collection-rule-overview.md) and use Azure Resource Manager (ARM) templates or policies for management overall
- Send data to Azure Monitor Logs and Azure Monitor Metrics for analysis with Azure Monitor. 
- Leverage Windows event filtering or multi-homing for logs on Windows and Linux
<!--- Send data to Azure Storage for archiving.
- Send data to third-party tools using [Azure Event Hubs](./diagnostics-extension-stream-event-hubs.md).
- Manage the security of your machines using [Azure Security Center](../../security-center/security-center-introduction.md)  or [Azure Sentinel](../../sentinel/overview.md). (Available in private preview.)
- Use [VM insights](../vm/vminsights-overview.md) which allows you to monitor your machines at scale and monitors their processes and dependencies on other resources and external processes..  
- Manage the security of your machines using [Azure Security Center](../../security-center/security-center-introduction.md)  or [Azure Sentinel](../../sentinel/overview.md).
- Use different [solutions](../monitor-reference.md#insights-and-core-solutions) to monitor a particular service or application. */
-->
Limitations of the Azure Monitor Agent include:
- Cannot use the Log Analytics solutions in production (only available in preview, [see what's supported](./azure-monitor-agent-overview.md#supported-services-and-features)).
- No support yet for networking scenarios involving private links. 
- No support yet collecting custom logs (files) or IIS log files. 
- No support yet for Event Hubs and Storage accounts as destinations.
- No support for Hybrid Runbook workers.


## Log Analytics agent

The [Log Analytics agent](./log-analytics-agent.md) collects monitoring data from the guest operating system and workloads of virtual machines in Azure, other cloud providers, and on-premises machines. It sends data to a Log Analytics workspace. The Log Analytics agent is the same agent used by System Center Operations Manager, and you can multihome agent computers to communicate with your management group and Azure Monitor simultaneously. This agent is also required by certain insights in Azure Monitor and other services in Azure.

> [!NOTE]
> The Log Analytics agent for Windows is often referred to as Microsoft Monitoring Agent (MMA). The Log Analytics agent for Linux is often referred to as OMS agent.

Use the Log Analytics agent if you need to:

* Collect logs and performance data from Azure virtual machines or hybrid machines hosted outside of Azure.
* Send data to a Log Analytics workspace to take advantage of features supported by [Azure Monitor Logs](../logs/data-platform-logs.md) such as [log queries](../logs/log-query-overview.md).
* Use [VM insights](../vm/vminsights-overview.md) which allows you to monitor your machines at scale and monitors their processes and dependencies on other resources and external processes..  
* Manage the security of your machines using [Azure Security Center](../../security-center/security-center-introduction.md)  or [Azure Sentinel](../../sentinel/overview.md).
* Use [Azure Automation Update Management](../../automation/update-management/overview.md), [Azure Automation State Configuration](../../automation/automation-dsc-overview.md), or [Azure Automation Change Tracking and Inventory](../../automation/change-tracking/overview.md) to deliver comprehensive management of your Azure and non-Azure machines.
* Use different [solutions](../monitor-reference.md#insights-and-core-solutions) to monitor a particular service or application.

Limitations of the Log Analytics agent include:

- Cannot send data to Azure Monitor Metrics, Azure Storage, or Azure Event Hubs.
- Difficult to configure unique monitoring definitions for individual agents.
- Difficult to manage at scale since each virtual machine has a unique configuration.

## Azure diagnostics extension

The [Azure Diagnostics extension](./diagnostics-extension-overview.md) collects monitoring data from the guest operating system and workloads of Azure virtual machines and other compute resources. It primarily collects data into Azure Storage but also allows you to define data sinks to also send data to other destinations such as Azure Monitor Metrics and Azure Event Hubs.

Use Azure diagnostic extension if you need to:

- Send data to Azure Storage for archiving or to analyze it with tools such as [Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md).
- Send data to [Azure Monitor Metrics](../essentials/data-platform-metrics.md) to analyze it with [metrics explorer](../essentials/metrics-getting-started.md) and to take advantage of features such as near real-time [metric alerts](../alerts/alerts-metric-overview.md) and [autoscale](../autoscale/autoscale-overview.md) (Windows only).
- Send data to third-party tools using [Azure Event Hubs](./diagnostics-extension-stream-event-hubs.md).
- Collect [Boot Diagnostics](/troubleshoot/azure/virtual-machines/boot-diagnostics) to investigate VM boot issues.

Limitations of Azure diagnostics extension include:

- Can only be used with Azure resources.
- Limited ability to send data to Azure Monitor Logs.

## Telegraf agent

The [InfluxData Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md) is used to collect performance data from Linux computers to Azure Monitor Metrics.

Use Telegraf agent if you need to:

* Send data to [Azure Monitor Metrics](../essentials/data-platform-metrics.md) to analyze it with [metrics explorer](../essentials/metrics-getting-started.md) and to take advantage of features such as near real-time [metric alerts](../alerts/alerts-metric-overview.md) and [autoscale](../autoscale/autoscale-overview.md) (Linux only).

## Dependency agent

The Dependency agent collects discovered data about processes running on the machine and external process dependencies. 

Use the Dependency agent if you need to:

* Use the Map feature [VM insights](../vm/vminsights-overview.md) or the [Service Map](../vm/service-map.md) solution.

Consider the following when using the Dependency agent:

- The Dependency agent requires the Log Analytics agent to be installed on the same machine.
- On Linux computers, the Log Analytics agent must be installed before the Azure Diagnostic Extension.

## Virtual machine extensions

The [Azure Monitor agent](./azure-monitor-agent-install.md#virtual-machine-extension-details) is only available as a virtual machine extension. The Log Analytics extension for [Windows](../../virtual-machines/extensions/oms-windows.md) and [Linux](../../virtual-machines/extensions/oms-linux.md) install the Log Analytics agent on Azure virtual machines. The Azure Monitor Dependency extension for [Windows](../../virtual-machines/extensions/agent-dependency-windows.md) and [Linux](../../virtual-machines/extensions/agent-dependency-linux.md) install the Dependency agent on Azure virtual machines. These are the same agents described above but allow you to manage them through [virtual machine extensions](../../virtual-machines/extensions/overview.md). You should use extensions to install and manage the agents whenever possible.

On hybrid machines, use [Azure Arc enabled servers](../../azure-arc/servers/manage-vm-extensions.md) to deploy the Azure Monitor agent, Log Analytics and Azure Monitor Dependency VM extensions.

## Supported operating systems

The following tables list the operating systems that are supported by the Azure Monitor agents. See the documentation for each agent for unique considerations and for the installation process. See Telegraf documentation for its supported operating systems. All operating systems are assumed to be x64. x86 is not supported for any operating system.

### Windows

| Operating system | Azure Monitor agent | Log Analytics agent | Dependency agent | Diagnostics extension | 
|:---|:---:|:---:|:---:|:---:|
| Windows Server 2019                                      | X | X | X | X |
| Windows Server 2019 Core                                 | X |   |   |   |
| Windows Server 2016                                      | X | X | X | X |
| Windows Server 2016 Core                                 | X |   |   | X |
| Windows Server 2012 R2                                   | X | X | X | X |
| Windows Server 2012                                      | X | X | X | X |
| Windows Server 2008 R2 SP1                               | X | X | X | X |
| Windows Server 2008 R2                                   |   |   | X | X |
| Windows Server 2008 SP2                                   |   | X |  |  |
| Windows 10 Enterprise<br>(including multi-session) and Pro<br>(Server scenarios only)  | X | X | X | X |
| Windows 8 Enterprise and Pro<br>(Server scenarios only)  |   | X | X |   |
| Windows 7 SP1<br>(Server scenarios only)                 |   | X | X |   |

### Linux

| Operating system | Azure Monitor agent <sup>1</sup> | Log Analytics agent <sup>1</sup> | Dependency agent | Diagnostics extension <sup>2</sup>| 
|:---|:---:|:---:|:---:|:---:
| Amazon Linux 2017.09                                        |   | X |   |   |
| CentOS Linux 8                                              | X <sup>3</sup> | X | X |   |
| CentOS Linux 7                                              | X | X | X | X |
| CentOS Linux 6                                              |   | X |   |   |
| CentOS Linux 6.5+                                           |   | X | X | X |
| Debian 10 <sup>1</sup>                                      | X |   |   |   |
| Debian 9                                                    | X | X | x | X |
| Debian 8                                                    |   | X | X |   |
| Debian 7                                                    |   |   |   | X |
| OpenSUSE 13.1+                                              |   |   |   | X |
| Oracle Linux 8                                              | X <sup>3</sup> | X |   |   |
| Oracle Linux 7                                              | X | X |   | X |
| Oracle Linux 6                                              |   | X |   |   |
| Oracle Linux 6.4+                                           |   | X |   | X |
| Red Hat Enterprise Linux Server 8.2, 8.3, 8.4               | X <sup>3</sup> | X | X |   |
| Red Hat Enterprise Linux Server 8                           | X <sup>3</sup> | X | X |   |
| Red Hat Enterprise Linux Server 7                           | X | X | X | X |
| Red Hat Enterprise Linux Server 6                           |   | X | X |   |
| Red Hat Enterprise Linux Server 6.7+                        |   | X | X | X |
| SUSE Linux Enterprise Server 15.2                           | X <sup>3</sup> |   |   |   |
| SUSE Linux Enterprise Server 15.1                           | X <sup>3</sup> | X |   |   |
| SUSE Linux Enterprise Server 15 SP1                         | X | X | X |   |
| SUSE Linux Enterprise Server 15                             | X | X | X |   |
| SUSE Linux Enterprise Server 12 SP5                         | X | X | X | X |
| SUSE Linux Enterprise Server 12                             | X | X | X | X |
| Ubuntu 20.04 LTS                                            | X | X | X |   |
| Ubuntu 18.04 LTS                                            | X | X | X | X |
| Ubuntu 16.04 LTS                                            | X | X | X | X |
| Ubuntu 14.04 LTS                                            |   | X |   | X |

<sup>1</sup> Requires Python (2 or 3) to be installed on the machine.

<sup>3</sup> Known issue collecting Syslog events in versions prior to 1.9.0
#### Dependency agent Linux kernel support

Since the Dependency agent works at the kernel level, support is also dependent on the kernel version. The following table lists the major and minor Linux OS release and supported kernel versions for the Dependency agent.

| Distribution | OS version | Kernel version |
|:---|:---|:---|
|  Red Hat Linux 8   | 8.2     | 4.18.0-193.\*el8_2.x86_64 |
|                    | 8.1     | 4.18.0-147.\*el8_1.x86_64 |
|                    | 8.0     | 4.18.0-80.\*el8.x86_64<br>4.18.0-80.\*el8_0.x86_64 |
|  Red Hat Linux 7   | 7.9     | 3.10.0-1160 |
|                    | 7.8     | 3.10.0-1136 |
|                    | 7.7     | 3.10.0-1062 |
|                    | 7.6     | 3.10.0-957  |
|                    | 7.5     | 3.10.0-862  |
|                    | 7.4     | 3.10.0-693  |
| Red Hat Linux 6    | 6.10    | 2.6.32-754 |
|                    | 6.9     | 2.6.32-696  |
| CentOS Linux 8     | 8.2     | 4.18.0-193.\*el8_2.x86_64 |
|                    | 8.1     | 4.18.0-147.\*el8_1.x86_64 |
|                    | 8.0     | 4.18.0-80.\*el8.x86_64<br>4.18.0-80.\*el8_0.x86_64 |
| CentOS Linux 7     | 7.9     | 3.10.0-1160 |
|                    | 7.8     | 3.10.0-1136 |
|                    | 7.7     | 3.10.0-1062 |
| CentOS Linux 6     | 6.10    | 2.6.32-754.3.5<br>2.6.32-696.30.1 |
|                    | 6.9     | 2.6.32-696.30.1<br>2.6.32-696.18.7 |
| Ubuntu Server      | 20.04   | 5.4\* |
|                    | 18.04   | 5.3.0-1020<br>5.0 (includes Azure-tuned kernel)<br>4.18*<br>4.15* |
|                    | 16.04.3 | 4.15.\* |
|                    | 16.04   | 4.13.\*<br>4.11.\*<br>4.10.\*<br>4.8.\*<br>4.4.\* |
| SUSE Linux 12 Enterprise Server | 15     | 4.12.14-150\*
|                                 | 12 SP4 | 4.12.* (includes Azure-tuned kernel) |
|                                 | 12 SP3 | 4.4.* |
|                                 | 12 SP2 | 4.4.* |
| Debian                          | 9      | 4.9  | 

## Next steps

Get more details on each of the agents at the following:

- [Overview of the Azure Monitor agent](./azure-monitor-agent-overview.md)
- [Overview of the Log Analytics agent](./log-analytics-agent.md)
- [Azure Diagnostics extension overview](./diagnostics-extension-overview.md)
- [Collect custom metrics for a Linux VM with the InfluxData Telegraf agent](../essentials/collect-custom-metrics-linux-telegraf.md)
