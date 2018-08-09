---
 title: include file
 description: include file
 services: virtual-machines
 author: shants123
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 07/05/2018
 ms.author: shants
 ms.custom: include file
---

Azure periodically performs updates to improve the reliability, performance, and security of the host infrastructure for virtual machines. These updates range from patching software components in the hosting environment (like operating system, hypervisor, and various agents deployed on the host), upgrading networking components, to hardware decommissioning. The majority of these updates are performed without any impact to the hosted virtual machines. However, there are cases where updates do have an impact:

- If a reboot-less update is possible, Azure uses memory preserving maintenance to pause the VM while the host is updated or the VM is moved to an already updated host altogether.

- If maintenance requires a reboot, you get a notice of when the maintenance is planned. In these cases, you'll also be given a time window where you can start the maintenance yourself, at a time that works for you.

This page describes how Microsoft Azure performs both types of maintenance. For more information about unplanned events (outages), see Manage the availability of virtual machines for [Windows](../articles/virtual-machines/windows/manage-availability.md) or [Linux](../articles/virtual-machines/linux/manage-availability.md).

Applications running in a virtual machine can gather information about upcoming updates by using the Azure Metadata Service for [Windows](../articles/virtual-machines/windows/instance-metadata-service.md) or [Linux](../articles/virtual-machines/linux/instance-metadata-service.md).

For "how-to" information on managing planned maintenance, see "Handling planned maintenance notifications" for [Linux](../articles/virtual-machines/linux/maintenance-notifications.md) or [Windows](../articles/virtual-machines/windows/maintenance-notifications.md).

## Memory preserving maintenance

When updates don't require a full reboot, memory preserving maintenance mechanisms are used to limit the impact to the virtual machine. The virtual machine is paused for up to 30 seconds, preserving the memory in RAM, while the hosting environment applies the necessary updates and patches, or moves the VM to an already updated host. The virtual machine is then resumed and the clock of the virtual machine is automatically synchronized. 

These non-rebootful maintenance operations are applied fault domain by fault domain, and progress is stopped if any warning health signals are received.

Some applications may be impacted by these types of updates. Applications that perform real-time event processing, like media streaming or transcoding, or high throughput networking scenarios, may not be designed to tolerate a 30 second pause. <!-- sooooo, what should they do? --> In case the VM is being moved to a different host, some sensitive workloads might notice a slight performance degradation in the few minutes leading up to the Virtual Machine pause. 


## Maintenance requiring a reboot

When VMs need to be rebooted for planned maintenance, you are notified in advance. Planned maintenance has two phases: the self-service window and a scheduled maintenance window.

The **self-service window** lets you initiate the maintenance on your VMs. During this time, you can query each VM to see their status and check the result of your last maintenance request.

When you start self-service maintenance, your VM is moved to a node that has already been updated and then powers it back on. Because the VM reboots, the temporary disk is lost and dynamic IP addresses associated with virtual network interface are updated.

If you start self-service maintenance and there is an error during the process, the operation is stopped, the VM is not updated and you get the option to retry the self-service maintenance. 

When the self-service window has passed, the **scheduled maintenance window** begins. During this time window, you can still query for the maintenance window, but no longer be able to start the maintenance yourself.

For information on managing maintenance requiring a reboot, see "Handling planned maintenance notifications" for [Linux](../articles/virtual-machines/linux/maintenance-notifications.md) or [Windows](../articles/virtual-machines/windows/maintenance-notifications.md). 

### Availability Considerations during Scheduled Maintenance 

If you decide to wait until the scheduled maintenance window, there are a few things to consider for maintaining the highest availability of your VMs. 

#### Paired Regions

Each Azure region is paired with another region within the same geography, together they make a regional pair. During scheduled maintenance, Azure will only update the VMs in a single region of a region pair. For example, when updating the Virtual Machines in North Central US, Azure will not update any Virtual Machines in South Central US at the same time. However, other regions such as North Europe can be under maintenance at the same time as East US. Understanding how region pairs work can help you better distribute your VMs across regions. For more information, see [Azure region pairs](https://docs.microsoft.com/azure/best-practices-availability-paired-regions).

#### Availability sets and scale sets

When deploying a workload on Azure VMs, you can create the VMs within an availability set to provide high availability to your application. This ensures that during either an outage or rebootful maintenance events, at least one virtual machine is available.

Within an availability set, individual VMs are spread across up to 20 update domains (UDs). During scheduled maintenance, only a single update domain is impacted at any given time. Be aware that the order of update domains being impacted does not necessarily happen sequentially. 

Virtual machine scale sets are an Azure compute resource that enables you to deploy and manage a set of identical VMs as a single resource. The scale set is automatically deployed across update domains, like VMs in an availability set. Just like with availability sets, with scale sets only a single update domain is impacted at any given time during scheduled maintenance.

For more information about configuring your virtual machines for high availability, see Manage the availability of your virtual machines for [Windows](../articles/virtual-machines/windows/manage-availability.md) or [Linux](../articles/virtual-machines/linux/manage-availability.md).
