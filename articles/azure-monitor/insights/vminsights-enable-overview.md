---
title: Enable Azure Monitor for VMs (preview) overview | Microsoft Docs
description: Learn how to deploy and configure Azure Monitor for VMs. Find out the system requirements.
ms.service:  azure-monitor
ms.subservice: 
ms.topic: conceptual
author: mgoedtel
ms.author: magoedte
ms.date: 10/29/2019

---

# Enable Azure Monitor for VMs (preview) overview

This article provides an overview of the options available to set up Azure Monitor for VMs. Use Azure Monitor for VMs to monitor health and performance. Discover application dependencies that run on Azure virtual machines (VMs) and virtual machine scale sets, on-premises VMs, or VMs hosted in another cloud environment.  

To set up Azure Monitor for VMs:

* Enable a single Azure VM or virtual machine scale set by selecting **Insights (preview)** directly from the VM or virtual machine scale set.
* Enable two or more Azure VMs and virtual machine scale sets by using Azure Policy. This method ensures that on existing and new VMs and scale sets, the required dependencies are installed and properly configured. Noncompliant VMs and scale sets are reported, so you can decide whether to enable them and to remediate them.
* Enable two or more Azure VMs or virtual machine scale sets across a specified subscription or resource group by using PowerShell.
* Enable Azure Monitor for VMs to monitor VMs or physical computers hosted in your corporate network or other cloud environment.

## Prerequisites

Before you start, make sure that you understand the information in the following sections. 

>[!NOTE]
>The following information described in this section is also applicable to the [Service Map solution](service-map.md).  

### Log Analytics

Azure Monitor for VMs supports a Log Analytics workspace in the following regions:

- West Central US
- West US<sup>1</sup>
- West US 2<sup>1</sup>
- South Central US<sup>1</sup>
- East US
- East US2<sup>1</sup>
- Central US<sup>1</sup>
- North Central US<sup>1</sup>
- Canada Central
- UK South
- North Europe<sup>1</sup>
- West Europe
- East Asia<sup>1</sup>
- Southeast Asia
- Central India<sup>1</sup>
- Japan East<sup>1</sup>
- Australia East<sup>1</sup>
- Australia Southeast<sup>1</sup>

<sup>1</sup> This region doesn't currently support the Health feature of Azure Monitor for VMs.

>[!NOTE]
>You can deploy Azure VMs from any region. These VMs aren't limited to the regions supported by the Log Analytics workspace.
>

If you don't have a workspace, you can create one by using one of these resources:
* [The Azure CLI](../../azure-monitor/learn/quick-create-workspace-cli.md)
* [PowerShell](../../azure-monitor/learn/quick-create-workspace-posh.md)
* [The Azure portal](../../azure-monitor/learn/quick-create-workspace.md)
* [Azure Resource Manager](../../azure-monitor/platform/template-workspace-configuration.md)

You can also create a workspace while you're enabling monitoring for a single Azure VM or virtual machine scale set in the Azure portal.

To set up an at-scale scenario that uses Azure Policy, Azure PowerShell, or Azure Resource Manager templates, in your Log Analytics workspace:

* Install the ServiceMap and InfrastructureInsights solutions. You can complete this installation by using a provided Azure Resource Manager template. Or on the **Get Started** tab, select **Configure Workspace**.
* Configure the Log Analytics workspace to collect performance counters.

To configure your workspace for the at-scale scenario, use one of the following methods:

* Use [Azure PowerShell](vminsights-enable-at-scale-powershell.md#set-up-a-log-analytics-workspace).
* On the Azure Monitor for VMs [**Policy Coverage**](vminsights-enable-at-scale-policy.md#manage-policy-coverage-feature-overview) page, select **Configure Workspace**. 

### Supported operating systems

The following table lists the Windows and Linux operating systems that Azure Monitor for VMs supports. Later in this section, you'll find a full list that details the major and minor Linux OS release and supported kernel versions.

|OS version |Performance |Maps |Health |
|-----------|------------|-----|-------|
|Windows Server 2019 | X | X | X |
|Windows Server 2016 1803 | X | X | X |
|Windows Server 2016 | X | X | X |
|Windows Server 2012 R2 | X | X | X |
|Windows Server 2012 | X | X | |
|Windows Server 2008 R2 | X | X|  |
|Windows 10 1803 | X | X | |
|Windows 8.1 | X | X | |
|Windows 8 | X | X | |
|Windows 7 SP1 | X | X | |
|Red Hat Enterprise Linux (RHEL) 6, 7| X | X| X |
|Ubuntu 18.04, 16.04 | X | X | X |
|CentOS Linux 7, 6 | X | X | X |
|SUSE Linux Enterprise Server (SLES) 12 | X | X | X |
|Debian 9.4, 8 | X<sup>1</sup> | | X |

<sup>1</sup> The Performance feature of Azure Monitor for VMs is available only from Azure Monitor. It isn't available directly from the left pane of the Azure VM.

>[!NOTE]
>The Health feature of Azure Monitor for VMs does not support [nested virtualization](../../virtual-machines/windows/nested-virtualization.md) in an Azure VM.
>

>[!NOTE]
>In the Linux operating system:
> - Only default and SMP Linux kernel releases are supported.
> - Nonstandard kernel releases, such as Physical Address Extension (PAE) and Xen, aren't supported for any Linux distribution. For example, a system with the release string of *2.6.16.21-0.8-xen* isn't supported.
> - Custom kernels, including recompilations of standard kernels, aren't supported.
> - CentOSPlus kernel is supported.
> - The Linux kernel must be patched for the Spectre vulnerability. Please consult your Linux distribution vendor for more details.

#### Red Hat Linux 7

| OS version | Kernel version |
|:--|:--|
| 7.6 | 3.10.0-957 |
| 7.5 | 3.10.0-862 |
| 7.4 | 3.10.0-693 |

#### Red Hat Linux 6

| OS version | Kernel version |
|:--|:--|
| 6.10 | 2.6.32-754 |
| 6.9 | 2.6.32-696 |

#### CentOSPlus

| OS version | Kernel version |
|:--|:--|
| 6.10 | 2.6.32-754.3.5<br>2.6.32-696.30.1 |
| 6.9 | 2.6.32-696.30.1<br>2.6.32-696.18.7 |

#### Ubuntu Server

| OS version | Kernel version |
|:--|:--|
| 18.04 | 5.0 (includes Azure-tuned kernel)<br>4.18*<br>4.15* |
| 16.04.3 | 4.15.* |
| 16.04 | 4.13.\*<br>4.11.\*<br>4.10.\*<br>4.8.\*<br>4.4.\* |

#### SUSE Linux 12 Enterprise Server

| OS version | Kernel version |
|:--|:--|
|12 SP4 | 4.12.* (includes Azure-tuned kernel) |
|12 SP3 | 4.4.* |
|12 SP2 | 4.4.* |

#### Debian 

| OS version | Kernel version |
|:--|:--|
| 9 | 4.9 | 

### The Microsoft Dependency agent

The Map feature in Azure Monitor for VMs gets its data from the Microsoft Dependency agent. The Dependency agent relies on the Log Analytics agent for its connection to Log Analytics. So your system must have the Log Analytics agent installed and configured with the Dependency agent.

Whether you enable Azure Monitor for VMs for a single Azure VM or you use the at-scale deployment method, use the Azure VM Dependency agent extension for [Windows](../../virtual-machines/extensions/agent-dependency-windows.md) or [Linux](../../virtual-machines/extensions/agent-dependency-linux.md) to install the agent as part of the experience.

>[!NOTE]
>The following information described in this section is also applicable to the [Service Map solution](service-map.md).  

In a hybrid environment, you can download and install the Dependency agent manually or using an automated method.

The following table describes the connected sources that the Map feature supports in a hybrid environment.

| Connected source | Supported | Description |
|:--|:--|:--|
| Windows agents | Yes | Along with the [Log Analytics agent for Windows](../../azure-monitor/platform/log-analytics-agent.md), Windows agents need the Dependency agent. For more information, see [supported operating systems](#supported-operating-systems). |
| Linux agents | Yes | Along with the [Log Analytics agent for Linux](../../azure-monitor/platform/log-analytics-agent.md), Linux agents need the Dependency agent. For more information, see [supported operating systems](#supported-operating-systems). |
| System Center Operations Manager management group | No | |

You can download the Dependency agent from these locations:

| File | OS | Version | SHA-256 |
|:--|:--|:--|:--|
| [InstallDependencyAgent-Windows.exe](https://aka.ms/dependencyagentwindows) | Windows | 9.9.2 | 6DFF19B9690E42CA190E3B69137C77904B657FA02895033EAA4C3A6A41DA5C6A |
| [InstallDependencyAgent-Linux64.bin](https://aka.ms/dependencyagentlinux) | Linux | 9.9.1 | 1CB447EF30FC042FE7499A686638F3F9B4F449692FB9D80096820F8024BE4D7C |

## Role-based access control

To enable and access the features in Azure Monitor for VMs, you must have the *Log Analytics contributor* role. To view performance, health, and map data, you must have the *monitoring reader* role for the Azure VM. The Log Analytics workspace must be configured for Azure Monitor for VMs.

For more information about how to control access to a Log Analytics workspace, see [Manage workspaces](../../azure-monitor/platform/manage-access.md).

## How to enable Azure Monitor for VMs (preview)

Enable Azure Monitor for VMs by using one of the methods described in this table:

| Deployment state | Method | Description |
|------------------|--------|-------------|
| Single Azure VM or virtual machine scale set | [Enable from the VM](vminsights-enable-single-vm.md) | You can enable a single Azure VM by selecting **Insights (preview)** directly from the VM or virtual machine scale set. |
| Multiple Azure VMs or virtual machine scale sets | [Enable through Azure Policy](vminsights-enable-at-scale-policy.md) | You can enable multiple Azure VMs by using Azure Policy and available policy definitions. |
| Multiple Azure VMs or virtual machine scale sets | [Enable through Azure PowerShell or Azure Resource Manager templates](vminsights-enable-at-scale-powershell.md) | You can enable multiple Azure VMs or virtual machine scale sets across a specified subscription or resource group by using Azure PowerShell or Azure Resource Manager templates. |
| Hybrid cloud | [Enable for the hybrid environment](vminsights-enable-hybrid-cloud.md) | You can deploy to VMs or physical computers that are hosted in your datacenter or other cloud environments. |

## Performance counters enabled 

Azure Monitor for VMs configures a Log Analytics workspace to collect the performance counters that it uses. The following tables list the objects and counters that are collected every 60 seconds.

>[!NOTE]
>The following list of performance counters enabled by Azure Monitor for VMs does not limit you from enabling additional counters you need to collect from VMs reporting to the workspace. Also, if you disable these counters, it will prevent the set of performance charts included with the Performance feature from showing resource utilization from your VMs.

### Windows performance counters

|Object name |Counter name |
|------------|-------------|
|LogicalDisk |% Free Space |
|LogicalDisk |Avg. Disk sec/Read |
|LogicalDisk |Avg. Disk sec/Transfer |
|LogicalDisk |Avg. Disk sec/Write |
|LogicalDisk |Disk Bytes/sec |
|LogicalDisk |Disk Read Bytes/sec |
|LogicalDisk |Disk Reads/sec |
|LogicalDisk |Disk Transfers/sec |
|LogicalDisk |Disk Write Bytes/sec |
|LogicalDisk |Disk Writes/sec |
|LogicalDisk |Free Megabytes |
|Memory |Available MBytes |
|Network Adapter |Bytes Received/sec |
|Network Adapter |Bytes Sent/sec |
|Processor |% Processor Time |

### Linux performance counters

|Object name |Counter name |
|------------|-------------|
|Logical Disk |% Used Space |
|Logical Disk |Disk Read Bytes/sec |
|Logical Disk |Disk Reads/sec |
|Logical Disk |Disk Transfers/sec |
|Logical Disk |Disk Write Bytes/sec |
|Logical Disk |Disk Writes/sec |
|Logical Disk |Free Megabytes |
|Logical Disk |Logical Disk Bytes/sec |
|Memory |Available MBytes Memory |
|Network |Total Bytes Received |
|Network |Total Bytes Transmitted |
|Processor |% Processor Time |

## Management packs

When Azure Monitor for VMs is enabled and configured with a Log Analytics workspace, a management pack is forwarded to all the Windows computers reporting to that workspace. If you have [integrated your System Center Operations Manager management group](../../azure-monitor/platform/om-agents.md) with the Log Analytics workspace, the Service Map management pack is deployed from the management group to the Windows computers reporting to the management group.  

The management pack is named *Microsoft.IntelligencePacks.ApplicationDependencyMonitor*. Its written to `%Programfiles%\Microsoft Monitoring Agent\Agent\Health Service State\Management Packs\` folder. The data source that the management pack uses is `%Program files%\Microsoft Monitoring Agent\Agent\Health Service State\Resources\<AutoGeneratedID>\Microsoft.EnterpriseManagement.Advisor.ApplicationDependencyMonitorDataSource.dll`.

## Diagnostic and usage data

Microsoft automatically collects usage and performance data through your use of the Azure Monitor service. Microsoft uses this data to improve the quality, security, and integrity of the service. 

To provide accurate and efficient troubleshooting capabilities, the Map feature includes data about the configuration of your software. The data provides information such as the operating system and version, IP address, DNS name, and workstation name. Microsoft doesn't collect names, addresses, or other contact information.

For more information about data collection and usage, see the [Microsoft Online Services Privacy Statement](https://go.microsoft.com/fwlink/?LinkId=512132).

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-dsr-and-stp-note.md)]

Now that you've enabled monitoring for your VM, monitoring information is available for analysis in Azure Monitor for VMs.

## Next steps

To learn how to use the Health feature, see [View Azure Monitor for VMs Health](vminsights-health.md). To view discovered application dependencies, see [View Azure Monitor for VMs Map](vminsights-maps.md).
