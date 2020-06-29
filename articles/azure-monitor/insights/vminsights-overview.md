---
title: What is Azure Monitor for VMs?
description: Overview of Azure Monitor for VMs which monitors the health and performance of the Azure VMs in addition to automatically discovering and mapping application components and their dependencies. 
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/11/2020

---

# What is Azure Monitor for VMs?

Azure Monitor for VMs monitors your Azure virtual machines (VM), virtual machine scale sets, and Azure Arc for servers at scale. It analyzes the performance and health of your Windows and Linux VMs, and monitors their processes and dependencies on other resources and external processes. It includes support for monitoring performance and application dependencies for VMs that are hosted on-premises or in another cloud provider. The following key features deliver in-depth insight:

- **Pre-defined trending performance charts**: Display core performance metrics from the guest VM operating system.

- **Dependency map**: Displays the interconnected components with the VM from various resource groups and subscriptions.  

>[!NOTE]
>We recently [announced changes](https://azure.microsoft.com/updates/updates-to-azure-monitor-for-virtual-machines-preview-before-general-availability-release/
) we are making to the Health feature based on the feedback we have received from our public preview customers. Given the number of changes we will be making, we are going to stop offering the Health feature for new customers. Existing customers can continue to use the health feature. For more details, please refer to our [General Availability FAQ](vminsights-ga-release-faq.md).  

Integration with Azure Monitor Logs delivers powerful aggregation and filtering, allowing Azure Monitor for VMs to analyze data trends over time. You can view this data in a single VM from the virtual machine directly, or you can use Azure Monitor to deliver an aggregated view of your VMs where the view supports Azure resource-context or workspace-context modes. For more information, see [access modes overview](../platform/design-logs-deployment.md#access-mode).

![Virtual machine insights perspective in the Azure portal](media/vminsights-overview/vminsights-azmon-directvm.png)

Azure Monitor for VMs can deliver predictable performance and availability of vital applications. It identifies performance bottlenecks and network issues and can also help you understand whether an issue is related to other dependencies.  

## Pricing

When you deploy Azure Monitor for VMs, the data that's collected by your VMs is ingested and stored in Azure Monitor. Performance and dependency data collected are stored in a Log Analytics workspace. Based on the pricing that's published on the [Azure Monitor pricing page](https://azure.microsoft.com/pricing/details/monitor/), Azure Monitor for VMs is billed for:

- The data that's ingested and stored.
- The alert rules that are created.
- The notifications that are sent. 

The log size varies by the string lengths of performance counters, and it can increase with the number of logical disks and network adapters allocated to the VM. If you already have a workspace and are collecting these counters, no duplicate charges are applied. If you're already using Service Map, the only change you'll see is the additional connection data that's sent to Azure Monitor.​

## Supported operating systems

The following table lists the Windows and Linux operating systems that Azure Monitor for VMs supports. Later in this section, you'll find a full list that details the major and minor Linux OS release and supported kernel versions.

|OS version |Performance |Maps |
|-----------|------------|-----|
|Windows Server 2019 | X | X |
|Windows Server 2016 1803 | X | X |
|Windows Server 2016 | X | X |
|Windows Server 2012 R2 | X | X |
|Windows Server 2012 | X | X |
|Windows Server 2008 R2 | X | X|
|Windows 10 1803 | X | X |
|Windows 8.1 | X | X |
|Windows 8 | X | X |
|Windows 7 SP1 | X | X |
|Red Hat Enterprise Linux (RHEL) 6, 7| X | X| 
|Ubuntu 18.04, 16.04 | X | X |
|CentOS Linux 7, 6 | X | X |
|SUSE Linux Enterprise Server (SLES) 12 | X | X |
|Debian 9.4, 8 | X<sup>1</sup> | |

<sup>1</sup> The Performance feature of Azure Monitor for VMs is available only from Azure Monitor. It isn't available directly from the left pane of the Azure VM.

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
| 18.04 | 5.3.0-1020<br>5.0 (includes Azure-tuned kernel)<br>4.18*<br>4.15* |
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


## Role-based access control

To enable and access the features in Azure Monitor for VMs, you must have the *Log Analytics contributor* role. To view performance, health, and map data, you must have the *monitoring reader* role for the Azure VM. The Log Analytics workspace must be configured for Azure Monitor for VMs.

For more information about how to control access to a Log Analytics workspace, see [Manage workspaces](../../azure-monitor/platform/manage-access.md).

## Next steps

To understand the requirements and methods that help you monitor your virtual machines, review [Deploy Azure Monitor for VMs](vminsights-enable-overview.md).
