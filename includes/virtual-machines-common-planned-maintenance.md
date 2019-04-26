---
 title: include file
 description: include file
 services: virtual-machines
 author: shants123
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 12/14/2018
 ms.author: shants
 ms.custom: include file
---

Azure periodically updates platform to improve the reliability, performance, and security of the host infrastructure for virtual machines. These updates range from patching software components in the hosting environment, upgrading networking components, to hardware decommissioning. The majority of these updates have no impact to the hosted virtual machines. However, there are cases where updates do have an impact and Azure chooses the least impactful method for updates:

- If a non-rebootful update is possible, the VM is paused while the host is updated or it is live migrated to an already updated host.

- If maintenance requires a reboot, you get a notice of when the maintenance is planned. Azure will also give a time window where you can start the maintenance yourself, at a time that works for you. Azure is investing in technologies to reduce the cases when the VMs have to be rebooted for planned platform maintenance. 

This page describes how Azure performs both types of maintenance. For more information about unplanned events (outages), see Manage the availability of virtual machines for [Windows](../articles/virtual-machines/windows/manage-availability.md) or [Linux](../articles/virtual-machines/linux/manage-availability.md).

You can get in-VM notification about upcoming maintenance by using the Scheduled Events for [Windows](../articles/virtual-machines/windows/scheduled-events.md) or [Linux](../articles/virtual-machines/linux/scheduled-events.md).

For "how-to" information on managing planned maintenance, see "Handling planned maintenance notifications" for [Linux](../articles/virtual-machines/linux/maintenance-notifications.md) or [Windows](../articles/virtual-machines/windows/maintenance-notifications.md).

## Maintenance not requiring a reboot

The goal for most maintenance that doesn't require a reboot is less than 10 seconds pause for the VM. In certain cases memory preserving maintenance mechanisms are used, which pauses the VM for up to 30 seconds and preserves the memory in RAM. The virtual machine is then resumed and the clock of the virtual machine is automatically synchronized. Azure is increasingly using live migration technologies and improving memory preserving maintenance mechanism to reduce the pause duration.

These non-rebootful maintenance operations are applied fault domain by fault domain, and progress is stopped if any warning health signals are received. 

Some applications may be impacted by these types of updates. In case the VM is live migrated to a different host, some sensitive workloads might notice a slight performance degradation in the few minutes leading up to the VM pause. Such applications can benefit from using Scheduled Events for [Windows](../articles/virtual-machines/windows/scheduled-events.md) or [Linux](../articles/virtual-machines/linux/scheduled-events.md) to prepare for VM maintenance and have no impact during Azure maintenance. Azure is also working on maintenance control features for such ultra-sensitive applications. 


## Maintenance requiring a reboot

In the rare case when VMs need to be rebooted for planned maintenance, you are notified in advance. Planned maintenance has two phases: the self-service window and a scheduled maintenance window.

The **self-service window** lets you start the maintenance on your VMs. During this time, you can query each VM to see their status and check the result of your last maintenance request.

When you start self-service maintenance, your VM is redeployed to an already updated node. Because the VM reboots, the temporary disk is lost and dynamic IP addresses associated with virtual network interface are updated.

If you start self-service maintenance and there is an error during the process, the operation is stopped, the VM is not updated and you get the option to retry the self-service maintenance. 

When the self-service window has passed, the **scheduled maintenance window** begins. During this time window, you can still query for the maintenance window, but can't start the maintenance yourself.

For information on managing maintenance requiring a reboot, see "Handling planned maintenance notifications" for [Linux](../articles/virtual-machines/linux/maintenance-notifications.md) or [Windows](../articles/virtual-machines/windows/maintenance-notifications.md). 

### Availability Considerations during Scheduled Maintenance 

If you decide to wait until the scheduled maintenance window, there are a few things to consider for maintaining the highest availability of your VMs. 

#### Paired Regions

Each Azure region is paired with another region within the same geography and together they make a regional pair. In scheduled maintenance phase, Azure will only update the VMs in a single region of a region pair. For example, when updating the VM in North Central US, Azure won't update any VM in South Central US at the same time. However, other regions such as North Europe can be under maintenance at the same time as East US. Understanding how region pairs work can help you better distribute your VMs across regions. For more information, see [Azure region pairs](https://docs.microsoft.com/azure/best-practices-availability-paired-regions).

#### Availability sets and scale sets

When deploying a workload on Azure VMs, you can create the VMs within an availability set to provide high availability to your application. This ensures that during either an outage or rebootful maintenance events, at least one VM is available.

Within an availability set, individual VMs are spread across up to 20 update domains (UDs). During scheduled maintenance, only a single update domain is updated at any given time. The order of update domains being updated doesn't necessarily happen sequentially. 

Virtual machine scale sets are an Azure compute resource that enables you to deploy and manage a set of identical VMs as a single resource. The scale set is automatically deployed across update domains, like VMs in an availability set. Just like with availability sets, with scale sets only a single update domain is updated at any given time during scheduled maintenance.

For more information about configuring your VMs for high availability, see Manage the availability of your virtual machines for [Windows](../articles/virtual-machines/windows/manage-availability.md) or [Linux](../articles/virtual-machines/linux/manage-availability.md).
