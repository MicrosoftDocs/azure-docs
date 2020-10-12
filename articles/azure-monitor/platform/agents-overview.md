---
title: Overview of the Azure monitoring agents| Microsoft Docs
description: This article provides a detailed overview of the Azure agents available which support monitoring virtual machines hosted in Azure or hybrid environment.
services: azure-monitor

ms.subservice:
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 09/02/2020
---

# Overview of Azure Monitor agents

Virtual machines and other compute resources require an agent to collect monitoring data required to measure the performance and availability of their guest operating system and workloads. This article describes the agents used by Azure Monitor and helps you determine which you need to meet the requirements for your particular environment.

> [!NOTE]
> Azure Monitor currently has multiple agents because of recent consolidation of Azure Monitor and Log Analytics. While there may be overlap in their features, each has unique capabilities. Depending on your requirements, you may need one or more of the agents on your virtual machines. 

You may have a specific set of requirements that can't be completely met with a single agent for a particular virtual machine. For example, you may want to use metric alerts which requires Azure diagnostics extension but also want to leverage the functionality of Azure Monitor for VMs which requires the Log Analytics agent and the Dependency agent. In cases such as this, you can use multiple agents, and this is a common scenario for customers who require functionality from each.

## Summary of agents

The following tables provide a quick comparison of the Azure Monitor agents for Windows and Linux. Further detail on each is provided in the section below.

> [!NOTE]
> The Azure Monitor agent is currently in preview with limited capabilities. This table will be updated 

### Windows agents

| | Azure Monitor agent (preview) | Diagnostics<br>extension (WAD) | Log Analytics<br>agent | Dependency<br>agent |
|:---|:---|:---|:---|:---|
| **Environments supported** | Azure | Azure | Azure<br>Other cloud<br>On-premises | Azure<br>Other cloud<br>On-premises | 
| **Agent requirements**  | None | None | None | Requires Log Analytics agent |
| **Data collected** | Event Logs<br>Performance | Event Logs<br>ETW events<br>Performance<br>File based logs<br>IIS logs<br>.NET app logs<br>Crash dumps<br>Agent diagnostics logs | Event Logs<br>Performance<br>File based logs<br>IIS logs<br>Insights and solutions<br>Other services | Process dependencies<br>Network connection metrics |
| **Data sent to** | Azure Monitor Logs<br>Azure Monitor Metrics | Azure Storage<br>Azure Monitor Metrics<br>Event Hub | Azure Monitor Logs | Azure Monitor Logs<br>(through Log Analytics agent) |
| **Services and**<br>**features**<br>**supported** | Log Analytics<br>Metrics explorer | Metrics explorer | Azure Monitor for VMs<br>Log Analytics<br>Azure Automation<br>Azure Security Center<br>Azure Sentinel | Azure Monitor for VMs<br>Service Map |

### Linux agents

| | Azure Monitor agent (preview) | Diagnostics<br>extension (LAD) | Telegraf<br>agent | Log Analytics<br>agent | Dependency<br>agent |
|:---|:---|:---|:---|:---|:---|
| **Environments supported** | Azure | Azure | Azure<br>Other cloud<br>On-premises | Azure<br>Other cloud<br>On-premises | Azure<br>Other cloud<br>On-premises |
| **Agent requirements**  | None | None | None | None | Requires Log Analytics agent |
| **Data collected** | Syslog<br>Performance | Syslog<br>Performance | Performance | Syslog<br>Performance| Process dependencies<br>Network connection metrics |
| **Data sent to** | Azure Monitor Logs<br>Azure Monitor Metrics | Azure Storage<br>Event Hub | Azure Monitor Metrics | Azure Monitor Logs | Azure Monitor Logs<br>(through Log Analytics agent) |
| **Services and**<br>**features**<br>**supported** | Log Analytics<br>Metrics explorer | | Metrics explorer | Azure Monitor for VMs<br>Log Analytics<br>Azure Automation<br>Azure Security Center<br>Azure Sentinel | Azure Monitor for VMs<br>Service Map |


## Azure Monitor agent (preview)
The [Azure Monitor agent](azure-monitor-agent-overview.md) is currently in preview and will replace the Log Analytics agent and Telegraf agent for both Windows and Linux virtual machines. It can to send data to both Azure Monitor Logs and Azure Monitor Metrics and uses [Data Collection Rules (DCR)](data-collection-rule-overview.md) which provide a more scalable method of configuring data collection and destinations for each agent.

Use the Azure Monitor agent if you need to:

- Collect guest logs and metrics from any virtual machine in Azure, in other clouds, or on-premises. (Azure only in preview.)
- Send data to Azure Monitor Logs and Azure Monitor Metrics for analysis with Azure Monitor. 
- Send data to Azure Storage for archiving.
- Send data to third-party tools using [Azure Event Hubs](diagnostics-extension-stream-event-hubs.md).
- Manage the security of your virtual machines using [Azure Security Center](../../security-center/security-center-intro.md)  or [Azure Sentinel](../../sentinel/overview.md). (Not available in preview.)

Limitations of the Azure Monitor agent include:

- Currently in public preview. See [Current limitations](azure-monitor-agent-overview.md#current-limitations) for a list of limitations during public preview.

## Log Analytics agent

The [Log Analytics agent](log-analytics-agent.md) collects monitoring data from the guest operating system and workloads of virtual machines in Azure, other cloud providers, and on-premises. It sends data to a Log Analytics workspace. The Log Analytics agent is the same agent used by System Center Operations Manager, and you can multihome agent computers to communicate with your management group and Azure Monitor simultaneously. This agent is also required by certain insights in Azure Monitor and other services in Azure.


> [!NOTE]
> The Log Analytics agent for Windows is often referred to as Microsoft Monitoring Agent (MMA). The Log Analytics agent for Linux is often referred to as OMS agent.



Use the Log Analytics agent if you need to:

* Collect logs and performance data from virtual or physical machines inside or outside of Azure. 
* Send data to a Log Analytics workspace to take advantage of features supported by [Azure Monitor Logs](data-platform-logs.md) such as [log queries](../log-query/log-query-overview.md).
* Use [Azure Monitor for VMs](../insights/vminsights-overview.md) which allows you to monitor your virtual machines at scale and monitors their processes and dependencies on other resources and external processes..  
* Manage the security of your virtual machines using [Azure Security Center](../../security-center/security-center-intro.md)  or [Azure Sentinel](../../sentinel/overview.md).
* Use [Azure Automation Update management](../../automation/update-management/update-mgmt-overview.md), [Azure Automation State Configuration](../../automation/automation-dsc-overview.md), or [Azure Automation Change Tracking and Inventory](../../automation/change-tracking.md) to deliver comprehensive management of your Azure VMs
* Use different [solutions](../monitor-reference.md#insights-and-core-solutions) to monitor a particular service or application.

Limitations of the Log Analytics agent include:

- Cannot send data to Azure Monitor Metrics, Azure Storage, or Azure Event Hubs.
- Difficult to configure unique monitoring definitions for individual agents.
- Difficult to manage at scale since each virtual machine has a unique configuration.

## Azure diagnostics extension

The [Azure Diagnostics extension](diagnostics-extension-overview.md) collects monitoring data from the guest operating system and workloads of Azure virtual machines and other compute resources. It primarily collects data into Azure Storage but also allows you to define data sinks to also send data to other destinations such as Azure Monitor Metrics and Azure Event Hubs.

Use Azure diagnostic extension if you need to:

- Send data to Azure Storage for archiving or to analyze it with tools such as [Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md).
- Send data to [Azure Monitor Metrics](data-platform-metrics.md) to analyze it with [metrics explorer](metrics-getting-started.md) and to take advantage of features such as near real-time [metric alerts](./alerts-metric-overview.md) and [autoscale](autoscale-overview.md) (Windows only).
- Send data to third-party tools using [Azure Event Hubs](diagnostics-extension-stream-event-hubs.md).
- Collect [Boot Diagnostics](../../virtual-machines/troubleshooting/boot-diagnostics.md) to investigate VM boot issues.

Limitations of Azure diagnostics extension include:

- Can only be used with Azure resources.
- Limited ability to send data to Azure Monitor Logs.

## Telegraf agent

The [InfluxData Telegraf agent](collect-custom-metrics-linux-telegraf.md) is used to collect performance data from Linux computers to Azure Monitor Metrics.

Use Telegraf agent if you need to:

* Send data to [Azure Monitor Metrics](data-platform-metrics.md) to analyze it with [metrics explorer](metrics-getting-started.md) and to take advantage of features such as near real-time [metric alerts](./alerts-metric-overview.md) and [autoscale](autoscale-overview.md) (Linux only). 



## Dependency agent

The Dependency agent collects discovered data about processes running on the virtual machine and external process dependencies. 

Use the Dependency agent if you need to:

* Use the Map feature [Azure Monitor for VMs](../insights/vminsights-overview.md) or the [Service Map](../insights/service-map.md) solution.

Consider the following when using the Dependency agent:

- The Dependency agent requires the Log Analytics agent to be installed on the same virtual machine.
- On Linux VMs, the Log Analytics agent must be installed before the Azure Diagnostic Extension.

## Virtual machine extensions

The Log Analytics extension for [Windows](../../virtual-machines/extensions/oms-windows.md) and [Linux](../../virtual-machines/extensions/oms-linux.md) install the Log Analytics agent on Azure virtual machines. The Azure Monitor Dependency extension for [Windows](../../virtual-machines/extensions/agent-dependency-windows.md) and [Linux](../../virtual-machines/extensions/agent-dependency-linux.md) install the Dependency agent on Azure virtual machines. These are the same agents described above but allow you to manage them through [virtual machine extensions](../../virtual-machines/extensions/overview.md). You should use extensions to install and manage the agents whenever possible.


## Supported operating systems
The following tables list the operating systems that are supported by the Azure Monitor agents. See the documentation for each agent for unique considerations and for the installation process. See Telegraf documentation for its supported operating systems. All operating systems are assumed to be x64. x86 is not supported for any operating system.

### Windows

| Operations system | Azure Monitor agent | Log Analytics agent | Dependency agent | Diagnostics extension | 
|:---|:---:|:---:|:---:|:---:|
| Windows Server 2019                                      | X | X | X | X |
| Windows Server 2016                                      | X | X | X | X |
| Windows Server 2016 Core                                 |   |   |   | X |
| Windows Server 2012 R2                                   | X | X | X | X |
| Windows Server 2012                                      | X | X | X | X |
| Windows Server 2008 R2                                   |   | X | X | X |
| Windows 10 Enterprise<br>(including multi-session) and Pro  | X | X | X | X |
| Windows 8 Enterprise and Pro                             |   | X | X |   |
| Windows 7 SP1                                            |   | X | X |   |


### Linux

| Operations system | Azure Monitor agent | Log Analytics agent | Dependency agent | Diagnostics extension | 
|:---|:---:|:---:|:---:|:---:
| Amazon Linux 2017.09                                     |   | X |   |   |
| CentOS Linux 8                                           |   | X |   |   |
| CentOS Linux 7                                           | X | X |   | X |
| CentOS Linux 7.8                                         | X | X | X | X |
| CentOS Linux 7.6                                         | X | X | X | X |
| CentOS Linux 6                                           | X | X |   |   |
| CentOS Linux 6.5+                                        | X | X |   | X |
| Debian 10                                                | X |   |   |   |
| Debian 9                                                 | X | X | x | X |
| Debian 8                                                 |   | X | X | X |
| Debian 7                                                 |   |   |   | X |
| OpenSUSE 13.1+                                           |   |   |   | X |
| Oracle Linux 7                                           | X | X |   | X |
| Oracle Linux 6                                           | X | X |   |   |
| Oracle Linux 6.4+                                        | X | X |   | X |
| Red Hat Enterprise Linux Server 8                        |   | X |   |   |
| Red Hat Enterprise Linux Server 7                        | X | X | X | X |
| Red Hat Enterprise Linux Server 6                        | X | X | X |   |
| Red Hat Enterprise Linux Server 6.7+                     | X | X | X | X |
| SUSE Linux Enterprise Server 15                          | X | X |   |   |
| SUSE Linux Enterprise Server 12                          | X | X | X | X |
| Ubuntu 20.04 LTS                                         |   | X |   |   |
| Ubuntu 18.04 LTS                                         | X | X | X | X |
| Ubuntu 16.04 LTS                                         | X | X | X | X |
| Ubuntu 14.04 LTS                                         | X | X |   | X |


#### Dependency agent Linux kernel support
Since the Dependency agent works at the kernel level, support is also dependent on the kernel version. The following table lists the major and minor Linux OS release and supported kernel versions for the Dependency agent.

| Distribution | OS version | Kernel version |
|:---|:---|:---|
|  Red Hat Linux 7   | 7.6     | 3.10.0-957  |
|                    | 7.5     | 3.10.0-862  |
|                    | 7.4     | 3.10.0-693  |
| Red Hat Linux 6    | 6.10    | 2.6.32-754 |
|                    | 6.9     | 2.6.32-696  |
| CentOSPlus         | 6.10    | 2.6.32-754.3.5<br>2.6.32-696.30.1 |
|                    | 6.9     | 2.6.32-696.30.1<br>2.6.32-696.18.7 |
| Ubuntu Server      | 18.04   | 5.3.0-1020<br>5.0 (includes Azure-tuned kernel)<br>4.18*<br>4.15* |
|                    | 16.04.3 | 4.15.* |
|                    | 16.04   | 4.13.\*<br>4.11.\*<br>4.10.\*<br>4.8.\*<br>4.4.\* |
| SUSE Linux 12 Enterprise Server | 12 SP4 | 4.12.* (includes Azure-tuned kernel) |
|                                 | 12 SP3 | 4.4.* |
|                                 | 12 SP2 | 4.4.* |
| Debian                          | 9      | 4.9  | 


## Next steps

Get more details on each of the agents at the following:

- [Overview of the Log Analytics agent](log-analytics-agent.md)
- [Azure Diagnostics extension overview](diagnostics-extension-overview.md)
- [Collect custom metrics for a Linux VM with the InfluxData Telegraf agent](collect-custom-metrics-linux-telegraf.md)

