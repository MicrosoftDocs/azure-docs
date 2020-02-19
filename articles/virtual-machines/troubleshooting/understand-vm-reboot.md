---
title: Understand a system reboot for an Azure VM | Microsoft Docs
description: Lists the events that can cause a VM to reboot
services: virtual-machines
documentationcenter: ''
author: genlin
manager: dcscontentpm
editor: ''
tags: ''

ms.service: virtual-machines

ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/31/2018
ms.author: genli

---

# Understand a system reboot for Azure VM

Azure virtual machines (VMs) might sometimes reboot for no apparent reason, without evidence of your having initiated the reboot operation. This article lists the actions and events that can cause VMs to reboot and provides insight into how to avoid unexpected reboot issues or reduce the impact of such issues.

## Configure the VMs for high availability

The best way to protect an application that's running on Azure against VM reboots and downtime is to configure the VMs for high availability.

To provide this level of redundancy to your application, we recommend that you group two or more VMs in an availability set. This configuration ensures that during either a planned or unplanned maintenance event, at least one VM is available and meets the 99.95 percent [Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_5/).

For more information about availability sets, see [Manage the availability of VMs](../windows/manage-availability.md)

## Resource Health information

Azure Resource Health is a service that exposes the health of individual Azure resources and provides actionable guidance for troubleshooting problems. In a cloud environment where it isn’t possible to directly access servers or infrastructure elements, the goal of Resource Health is to reduce the time that you spend on troubleshooting. In particular, the aim is to reduce the time that you spend determining whether the root of the problem lies in the application or in an event inside the Azure platform. For more information, see [Understand and use Resource Health](../../resource-health/resource-health-overview.md).

## Actions and events that can cause the VM to reboot

### Planned maintenance

Microsoft Azure periodically performs updates across the globe to improve the reliability, performance, and security of the host infrastructure that underlies VMs. Many of these updates, including memory-preserving updates, are performed without any impact on your VMs or cloud services.

However, some updates do require a reboot. In such cases, the VMs are shut down while we patch the infrastructure, and then the VMs are restarted.

To understand what Azure planned maintenance is and how it can affect the availability of your Linux VMs, see the articles listed here. The articles provide background about the Azure planned maintenance process and how to schedule planned maintenance to further reduce the impact.

- [Planned maintenance for VMs in Azure](../windows/planned-maintenance.md)
- [How to schedule planned maintenance on Azure VMs](../windows/classic/planned-maintenance-schedule.md)

### Memory-preserving updates

For this class of updates in Microsoft Azure, users experience no impact on their running VMs. Many of these updates are to components or services that can be updated without interfering with the running instance. Some are platform infrastructure updates on the host operating system that can be applied without a reboot of the VMs.

These memory-preserving updates are accomplished with technology that enables in-place live migration. When it is being updated, the VM is placed in a *paused* state. This state preserves the memory in RAM while the underlying host operating system receives the necessary updates and patches. The VM is resumed within 30 seconds of being paused. After the VM is resumed, its clock is automatically synchronized.

Because of the short pause period, deploying updates through this mechanism greatly reduces the impact on the VMs. However, not all updates can be deployed in this way. 

Multi-instance updates (for VMs in an availability set) are applied one update domain at a time.

> [!NOTE]
> Linux machines that have old kernel versions are affected by a kernel panic during this update method. To avoid this issue, update to kernel version 3.10.0-327.10.1 or later. For more information, see [An Azure Linux VM on a 3.10-based kernel panics after a host node upgrade](https://support.microsoft.com/help/3212236).

### User-initiated reboot or shutdown actions

If you perform a reboot from the Azure portal, Azure PowerShell, command-line interface, or REST API, you can find the event in the [Azure Activity Log](../../azure-monitor/platform/platform-logs-overview.md).

If you perform the action from the VM's operating system, you can find the event in the system logs.

Other scenarios that usually cause the VM to reboot include multiple configuration-change actions. You'll ordinarily see a warning message indicating that executing a particular action will result in a reboot of the VM. Examples include any VM resize operations, changing the password of the administrative account, and setting a static IP address.

### Azure Security Center and Windows Update

Azure Security Center monitors daily Windows and Linux VMs for missing operating-system updates. Security Center retrieves a list of available security and critical updates from Windows Update or Windows Server Update Services (WSUS), depending on which service is configured on a Windows VM. Security Center also checks for the latest updates for Linux systems. If your VM is missing a system update, Security Center recommends that you apply system updates. The application of these system updates is controlled through the Security Center in the Azure portal. After you apply some updates, VM reboots might be required. For more information, see [Apply system updates in Azure Security Center](../../security-center/security-center-apply-system-updates.md).

Like on-premises servers, Azure does not push updates from Windows Update to Windows VMs, because these machines are intended to be managed by their users. You are, however, encouraged to leave the automatic Windows Update setting enabled. Automatic installation of updates from Windows Update can also cause reboots to occur after the updates are applied. For more information, see [Windows Update FAQ](https://support.microsoft.com/help/12373/windows-update-faq).

### Other situations affecting the availability of your VM

There are other cases in which Azure might actively suspend the use of a VM. You'll receive email notifications before this action is taken, so you'll have a chance to resolve the underlying issues. Examples of issues that affect VM availability include security violations and the expiration of payment methods.

### Host server faults

The VM is hosted on a physical server that is running inside an Azure datacenter. The physical server runs an agent called the Host Agent in addition to a few other Azure components. When these Azure software components on the physical server become unresponsive, the monitoring system triggers a reboot of the host server to attempt recovery. The VM is usually available again within five minutes and continues to live on the same host as previously.

Server faults are usually caused by hardware failure, such as the failure of a hard disk or solid-state drive. Azure continuously monitors these occurrences, identifies the underlying bugs, and rolls out updates after the mitigation has been implemented and tested.

Because some host server faults can be specific to that server, a repeated VM reboot situation might be improved by manually redeploying the VM to another host server. This operation can be triggered by using the **redeploy** option on the details page of the VM, or by stopping and restarting the VM in the Azure portal.

### Auto-recovery

If the host server cannot reboot for any reason, the Azure platform initiates an auto-recovery action to take the faulty host server out of rotation for further investigation. 

All VMs on that host are automatically relocated to a different, healthy host server. This process is usually complete within 15 minutes. To learn more about the auto-recovery process, see [Auto-recovery of VMs](https://azure.microsoft.com/blog/service-healing-auto-recovery-of-virtual-machines).

### Unplanned maintenance

On rare occasions, the Azure operations team might need to perform maintenance activities to ensure the overall health of the Azure platform. This behavior might affect VM availability, and it usually results in the same auto-recovery action as described earlier.  

Unplanned maintenance include the following:

- Urgent node defragmentation
- Urgent network switch updates

### VM crashes

VMs might restart because of issues within the VM itself. The workload or role that's running on the VM might trigger a bug check within the guest operating system. For help determining the reason for the crash, view the system and application logs for Windows VMs, and the serial logs for Linux VMs.

### Storage-related forced shutdowns

VMs in Azure rely on virtual disks for operating system and data storage that is hosted on the Azure Storage infrastructure. Whenever the availability or connectivity between the VM and the associated virtual disks is affected for more than 120 seconds, the Azure platform performs a forced shutdown of the VMs to avoid data corruption. The VMs are automatically powered back on after storage connectivity has been restored. 

The duration of the shutdown can be as short as five minutes but can be significantly longer. The following is one of the specific cases that is associated with storage-related forced shutdowns: 

**Exceeding IO limits**

VMs might be temporarily shut down when I/O requests are consistently throttled because the volume of I/O operations per second (IOPS) exceeds the I/O limits for the disk. (Standard disk storage is limited to 500 IOPS.) To mitigate this issue, use disk striping or configure the storage space inside the guest VM, depending on the workload. For details, see [Configuring Azure VMs for Optimal Storage Performance](https://blogs.msdn.com/b/mast/archive/2014/10/14/configuring-azure-virtual-machines-for-optimal-storage-performance.aspx).

### Other incidents

In rare circumstances, a widespread issue can affect multiple servers in an Azure datacenter. If this issue occurs, the Azure team sends email notifications to the affected subscriptions. You can check the [Azure Service Health dashboard](https://azure.microsoft.com/status/) and the Azure portal for the status of ongoing outages and past incidents.
