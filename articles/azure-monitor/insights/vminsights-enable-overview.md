---
title: Enable Azure Monitor for VMs (preview) overview | Microsoft Docs
description: This article describes how you deploy and configure Azure Monitor for VMs and the required system requirements.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: 
ms.assetid: 
ms.service: azure-monitor
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/22/2019
ms.author: magoedte
---

# Enable Azure Monitor for VMs (preview) overview

This article provides an overview of the options available to setup Azure Monitor for VMs to monitor the health, performance, and discover application dependencies running on Azure virtual machines and virtual machine scale sets, on-premise VMs, or VMs hosted in another cloud environment.  

You enable Azure Monitor for VMs by using one of the following methods:

* Enable a single Azure virtual machine or virtual machine scale set by selecting **Insights (preview)** directly from the VM or virtual machine scale set.
* Enable two or more Azure VMs and virtual machine scale sets by using Azure Policy. Through this method, the required dependencies of existing and new VMs and scale sets are installed and properly configured. Non-compliant VMs and scale sets are reported, so you can decide whether to enable them and how you want to remediate them.
* Enable two or more Azure VMs or virtual machine scale sets across a specified subscription or resource group by using PowerShell.
* Enable to monitor virtual machines or physical computers hosted in your corporate network or other cloud environment.

## Prerequisites

Before you start, make sure that you understand the information in the following sections.

### Log Analytics

Azure Monitor for VMs supports a Log Analytics workspace in the following regions:

- West Central US
- East US
- Canada Central<sup>1</sup>
- UK South<sup>1</sup>
- West Europe
- Southeast Asia<sup>1</sup>

<sup>1</sup> This region doesn't currently support the Health feature of Azure Monitor for VMs.

>[!NOTE]
>Azure virtual machines can be deployed from any region and aren't limited to the supported regions for the Log Analytics workspace.
>

If you don't have a workspace, you can create one with one of the following methods:
* [The Azure CLI](../../azure-monitor/learn/quick-create-workspace-cli.md)
* [PowerShell](../../azure-monitor/learn/quick-create-workspace-posh.md)
* [The Azure portal](../../azure-monitor/learn/quick-create-workspace.md)
* [Azure Resource Manager](../../azure-monitor/platform/template-workspace-configuration.md)

If you're enabling monitoring for a single Azure VM or virtual machine scale set in the Azure portal, you can create a workspace during this process.

For the at-scale scenario using Azure Policy, Azure PowerShell, or Azure Resource Manager templates, your Log Analytics workspace first needs the following configured:

* Install the ServiceMap and InfrastructureInsights solutions. You can complete this installation by using an Azure Resource Manager template that's provided or by using the **Configure Workspace** option found on the **Get Started** tab.
* Configure the Log Analytics workspace to collect performance counters.

To configure your workspace for the at-scale scenario, you can configure it using one of the following methods:

* [Azure PowerShell](vminsights-enable-at-scale-powershell.md#set-up-a-log-analytics-workspace)
* From the **Configure Workspace** option on the Azure Monitor for VMs [Policy Coverage](vminsights-enable-at-scale-policy.md#manage-policy-coverage-feature-overview) page

### Supported operating systems

The following table lists the Windows and Linux operating systems that are supported with Azure Monitor for VMs. A full list that details the major and minor Linux OS release and supported kernel versions is provided later in this section.

|OS version |Performance |Maps |Health |
|-----------|------------|-----|-------|
|Windows Server 2019 | X | X | X |
|Windows Server 2016 1803 | X | X | X |
|Windows Server 2016 | X | X | X |
|Windows Server 2012 R2 | X | X | X |
|Windows Server 2012 | X | X | |
|Windows Server 2008 R2 | X | X| |
|Red Hat Enterprise Linux (RHEL) 6, 7| X | X| X |
|Ubuntu 14.04, 16.04, 18.04 | X | X | X |
|CentOS Linux 6, 7 | X | X | X |
|SUSE Linux Enterprise Server (SLES) 11, 12 | X | X | X |
|Debian 8, 9.4 | X<sup>1</sup> | | X |

<sup>1</sup> The Performance feature of Azure Monitor for VMs is available only from Azure Monitor. It isn't available when you access it directly from the left pane of the Azure VM.

>[!NOTE]
>The following information applies to support of the Linux operating system:
> - Only default and SMP Linux kernel releases are supported.
> - Nonstandard kernel releases, such as Physical Address Extension (PAE) and Xen, aren't supported for any Linux distribution. For example, a system with the release string of *2.6.16.21-0.8-xen* isn't supported.
> - Custom kernels, including recompiles of standard kernels, aren't supported.
> - CentOSPlus kernel is supported.

#### Red Hat Linux 7

| OS version | Kernel version |
|:--|:--|
| 7.4 | 3.10.0-693 |
| 7.5 | 3.10.0-862 |
| 7.6 | 3.10.0-957 |

#### Red Hat Linux 6

| OS version | Kernel version |
|:--|:--|
| 6.9 | 2.6.32-696 |
| 6.10 | 2.6.32-754 |

### CentOSPlus
| OS version | Kernel version |
|:--|:--|
| 6.9 | 2.6.32-696.18.7<br>2.6.32-696.30.1 |
| 6.10 | 2.6.32-696.30.1<br>2.6.32-754.3.5 |

#### Ubuntu Server

| OS version | Kernel version |
|:--|:--|
| Ubuntu 18.04 | kernel 4.15.* |
| Ubuntu 16.04.3 | kernel 4.15.* |
| 16.04 | 4.4.\*<br>4.8.\*<br>4.10.\*<br>4.11.\*<br>4.13.\* |
| 14.04 | 3.13.\*<br>4.4.\* |

#### SUSE Linux 11 Enterprise Server

| OS version | Kernel version
|:--|:--|
|11 SP4 | 3.0.* |

#### SUSE Linux 12 Enterprise Server

| OS version | Kernel version
|:--|:--|
|12 SP2 | 4.4.* |
|12 SP3 | 4.4.* |

### The Microsoft Dependency agent

The Azure Monitor for VMs Map feature gets its data from the Microsoft Dependency agent. The Dependency agent relies on the Log Analytics agent for its connection to Log Analytics. Therefore, your system must have the Log Analytics agent installed and configured with the Dependency agent.

Whether you enable Azure Monitor for VMs for a single Azure VM or you use the at-scale deployment method, you need to use the Azure VM Dependency agent extension to install the agent as part of the experience.

In a hybrid environment, you can download and install the Dependency agent in either of two ways: manually, or by using an automated deployment method for virtual machines that are hosted outside Azure.

The following table describes the connected sources that the Map feature supports in a hybrid environment.

| Connected source | Supported | Description |
|:--|:--|:--|
| Windows agents | Yes | In addition to the [Log Analytics agent for Windows](../../azure-monitor/platform/log-analytics-agent.md), Windows agents require the Microsoft Dependency agent. For a complete list of operating system versions, see [supported operating systems](#supported-operating-systems). |
| Linux agents | Yes | In addition to the [Log Analytics agent for Linux](../../azure-monitor/platform/log-analytics-agent.md), Linux agents require the Microsoft Dependency agent. For a complete list of operating system versions, see [supported operating systems](#supported-operating-systems). |
| System Center Operations Manager management group | No | |

The Dependency agent can be downloaded from the following locations:

| File | OS | Version | SHA-256 |
|:--|:--|:--|:--|
| [InstallDependencyAgent-Windows.exe](https://aka.ms/dependencyagentwindows) | Windows | 9.8.1 | 622C99924385CBF539988D759BCFDC9146BB157E7D577C997CDD2674E27E08DD |
| [InstallDependencyAgent-Linux64.bin](https://aka.ms/dependencyagentlinux) | Linux | 9.8.1 | 3037934A5D3FB7911D5840A9744AE9F980F87F620A7F7B407F05E276FE7AE4A8 |

## Role-based access control

To enable and access the features in Azure Monitor for VMs, you need to be assigned the following access roles:

- To enable it, you must have the *Log Analytics contributor* role.

- To view performance, health, and map data, you must have the *Monitoring Reader* role for the Azure VM. The Log Analytics workspace must be configured for Azure Monitor for VMs.

For more information about how to control access to a Log Analytics workspace, see [Manage workspaces](../../azure-monitor/platform/manage-access.md).

## How to enable Azure Monitor for VMs (preview)

You enable Azure Monitor for VMs by using one of the following methods described in the following table.

| Deployment state | Method | Description |
|------------------|--------|-------------|
| Single Azure VM or virtual machine scale set | [Directly from the VM](vminsights-enable-single-vm.md) | You can enable a single Azure virtual machine by selecting **Insights (preview)** directly from the VM or virtual machine scale set. |
| Multiple Azure VMs or virtual machine scale sets | [Azure Policy](vminsights-enable-at-scale-policy.md) | You can enable multiple Azure VMs using Azure Policy and available policy definitions. |
| Multiple Azure VMs or virtual machine scale sets | [Azure PowerShell or Azure Resource Manager templates](vminsights-enable-at-scale-powershell.md) | You can enable multiple Azure VMs or virtual machine scale sets across a specified subscription or resource group using Azure PowerShell or Azure Resource Manager templates. |
| Hybrid cloud | [Enable for Hybrid environment](vminsights-enable-hybrid-cloud.md) | You can deploy to virtual machines or physical computers that are hosted in your datacenter or other cloud environments. |

## Performance counters enabled

Azure Monitor for VMs configures a Log Analytics workspace to collect the performance counters that it uses. The following table lists the objects and counters that are collected every 60 seconds.

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

## Diagnostic and usage data

Microsoft automatically collects usage and performance data through your use of the Azure Monitor service. Microsoft uses this data to provide and improve the quality, security, and integrity of the service. To provide accurate and efficient troubleshooting capabilities, data from the Map feature includes information about the configuration of your software, such as the operating system and version, IP address, DNS name, and workstation name. Microsoft doesn't collect names, addresses, or other contact information.

For more information about data collection and usage, see the [Microsoft Online Services Privacy Statement](https://go.microsoft.com/fwlink/?LinkId=512132).

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-dsr-and-stp-note.md)]

## Next steps

Now that monitoring is enabled for your virtual machine, this information is available for analysis with Azure Monitor for VMs. To learn how to use the Health feature, see [View Azure Monitor for VMs Health](vminsights-health.md). To view discovered application dependencies, see [View Azure Monitor for VMs Map](vminsights-maps.md).
