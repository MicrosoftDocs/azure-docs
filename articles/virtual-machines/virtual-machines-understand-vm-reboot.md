---
title: Understand a system reboot for Azure VM | Microsoft Docs
description: Lists the events that can cause the VM to reboot
services: virtual-machines-windows, virtual-machines-linux, cloud-services
documentationcenter: ''
author: genlin
manager: willchen
editor: ''
tags: ''

ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/24/2017
ms.author: genli

---

# Understand a system reboot for Azure VM

Sometimes an Azure virtual machine (VM) may reboot for no apparent reason, and with no evidence of a user initiating the reboot operation. This article lists the events that can cause the VM to reboot and provides some insight into how to avoid the unexpected reboot issues or reduct the impact of the issue.

## Azure VM SLAs
Azure offers various service levels for Azure products:

- [Azure Service Level Agreements](https://azure.microsoft.com/support/legal/sla/)
- [SLA for VMs](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_5//)

## Configure the VMs for High Availability
The best way to protect your application running on Azure against any type of VM reboots and downtime is to configure the VMs for high availability.

To provide this level of redundancy to your application, we recommend that you group two or more VMs in an availability set. This configuration ensures that during either a planned or unplanned maintenance event, at least one VM is available and meets the 99.95% Azure SLA.

Details on how to configure and manage the availability of VMs can be found here:

- [Manage the availability of VMs](windows/manage-availability.md)
- [Configure availability of VMs](windows/classic/configure-availability.md)

## Resource Health Information 
Azure Resource health is a service that exposes the health of individual Azure resources and provides actionable guidance to troubleshoot problems. In a cloud environment where it isn’t possible to directly access servers or infrastructure elements, the goal for Resource health is to reduce the time customers spend on troubleshooting. In particular, reducing the time spent determining if the root of the problem lays inside the application or if it is caused by an event inside the Azure platform. For more information,  see [Understand and use Resource Health to troubleshoot this scenario in the future](../resource-health/resource-health-overview.md)

## Events that can cause the VM to reboot

### Planned Maintenance
Microsoft Azure periodically performs updates across the globe to improve the reliability, performance, and security of the host infrastructure that underlies VMs. Many of these updates are performed without any impact to your VMs or Cloud Services, including memory-preserving updates. 

However, some updates do require a reboot to your VMs to apply the required updates to the infrastructure. The VMs are shut down while we patch the infrastructure, and then the VMs are restarted.

Understand what Azure planned maintenance is and how it can affect the availability of your Linux VMs. These articles provide background about the Azure planned maintenance process and how to schedule planned maintenance to further reduce the impact.

- [Planned maintenance for VMs in Azure](windows/planned-maintenance.md)
- [How to Schedule Planned Maintenance on Azure VMs](windows/planned-maintenance-schedule.md)

### Memory-preserving updates   
For a class of updates in Microsoft Azure, customers do not see any impact to their running VMs. Many of these updates are to components or services that can be updated without interfering with the running instance. Some of these updates are platform infrastructure updates on the host operating system that can be applied without requiring a reboot of the VMs.

These updates are accomplished with technology that enables in-place live migration, also called a “memory-preserving” update. When updating, the VM is placed into a “paused” state, preserving the memory in RAM, while the underlying host operating system receives the necessary updates and patches. The VM is resumed within 30 seconds of being paused. After resuming, the clock of the VM is automatically synchronized.

Not all updates can be deployed by using this mechanism, but given the short pause period, deploying updates in this way greatly reduces impact to VMs.

Multi-instance updates (for VMs in an availability set) are applied one update domain at a time.

> [!Note]
> Linux machines with old kernel versions are affected by a kernel panic during this update method. To avoid this issue, update to kernel version 3.10.0-327.10.1 or a later version. For more information, see [An Azure Linux VM on a 3.10-based kernel panics after a host node upgrade](https://support.microsoft.com/help/3212236).     
    
### User initiated reboot/shutdown actions
 
If the reboot is performed from the Azure portal, Azure PowerShell, Command-Line interface, or Reset API, the event can be found in the [Azure Activity Log](../../monitoring-and-diagnostics/monitoring-overview-activity-logs.md.

If the action is performed from VM's operation system, the event can be found in system logs.

Other actions that implicitly cause the VM to reboot include multiple configuration change actions. Typically, the user sees a warning message indicating that executing a particular action, which results in a reboot of the VM.
Examples include any VM resize operations, changing the password of the administrative account and setting a static IP address.

### Azure Security center and Windows Updates
Azure Security Center monitors daily Windows and Linux VMs (VMs) for missing operating system updates. Security Center retrieves a list of available security and critical updates from Windows Update or Windows Server Update Services (WSUS), depending on which service is configured on a Windows VM. Security Center also checks for the latest updates in Linux systems. If your VM is missing a system update, Security Center recommends that you apply system updates. Applying these system updates is controlled via the Security Center section in Azure portal. After applying some updates, it is required that the VM reboots. For more information, see [Apply system updates in Azure Security Center](../security-center/security-center-apply-system-updates.md).

Like on-premises machine, Azure does not push Windows Updates to Windows Azure VMs since these machines are intended to be managed by the user.  Customers are, however encouraged to leave the automatic Windows Update setting enabled. Automatic installation of Windows Updates might also cause reboots to occur after the update has been applied. For more information, see [Windows Update FAQ](https://support.microsoft.com/help/12373/windows-update-faq).

### Other situations affecting the availability of your VM
There are other cases where Azure might actively suspend the use of a VM. Users receive email notifications before this action being taken and have a chance to mitigate the underlying issues. Examples are security violations, and payment method having expired.
        
### Other Incidents
In rare circumstances, a wide spread issue can impact multiple servers in an Azure data center.  If this event occurs, Azure team sends email notification to affected subscriptions. [Azure Service Health Dashboard](https://azure.microsoft.com/en-us/status/) and Azure portal are great places to visit and check on the status of on-going outages and as well past incidents.

### Host Server Faults 
The VM is hosted on a physical server running inside an Azure datacenter. The physical server runs an agent called the Host Agent in addition to few other Azure-specific components. When these Azure-specific software components running on the physical server become unresponsive, the monitoring system triggers a reboot of the host server to attempt recovery. This behavior causes the VM to be restarted. The VM continues to live on the same host as before. The VM typically is available again within five minutes.

Server faults are typically caused by hardware failure such as a failure in a hard drive or solid-state drive. Azure continuously monitors these occurrences, identifies the underlying bugs, and rolls out updates after the mitigation has been implemented and tested.

Since some host server faults can be specific to that server, your VMs repeated reboot situation might be improved by manually redeploying it to another host server. This operation  can be triggered by using the “redeploy” option on the details page of the VM, or by stopping and restarting the VM in the Azure portal.

### Auto-recovery
In case the host server cannot reboot for any reason, the Azure platform initiates an auto-recovery action to take the faulty host server out of rotation for further investigation. 
All VMs on that host are automatically relocated to a different, healthy host server. This process typically is complete within 15 minutes. The following blog on [Auto-recovery of VMs](https://azure.microsoft.com/blog/service-healing-auto-recovery-of-virtual-machines) describes the auto-recovery process.

### Unplanned maintenance
On rare occasions, Azure operations team may need to perform maintenance activities to ensure the overall health of the Azure Platform. This behavior may affect VM availability and typically results in the same auto-recovery action as described before.  

These activities include the following:

- Urgent Node defragmentation
- Urgent Network switch updates

### VM Crash 
VMs may restart due to issues within the VM itself. The work load or role running on the VM may trigger a bug check within the guest OS. For Windows VMs, reviewing system and application logs, and serial logs for Linux, may be helpful in determining the reason behind the crash.   

### Storage-related forced shutdowns
VMs in Azure rely on virtual disks for operating system and data storage that is hosted on the Azure Storage infrastructure. Whenever the availability or connectivity between the VM and the associated virtual disks is impacted for more than 120 seconds, the Azure platform performs a forced shutdown of the VMs to avoid data corruption. The VM is automatically powered back on after the storage connectivity has been restored. 

The duration of the shutdown can be as short as five minutes but can be significantly longer at times. The following is one of the specific cases that is associated with storage-related forced shutdowns: 

**Exceeding IO limits**

VM might be temporarily shut down when I/O requests are consistently throttled due to excessive IOPS, exceeding the I/O limits for disks. Standard disk storage is limited to 500 input/output operations per second (IOPS). Depending on the workload, a striped disk or configuring Storage Spaces inside the Guest VM may help mitigate the issue.  Details are available in this support article: Configuring Azure VMs for Optimal Storage Performance

Higher IOPS limits are available via Azure Premium Storage with up to 80,000 IOPs. For more information, See [High-Performance Premium Storage](../storage/storage-premium-storage.md).