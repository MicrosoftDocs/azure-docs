---
title: Maintenance and updates for Windows VMs in Azure | Microsoft Docs
description: Overview of maintence and updates for Windows virtual machines running in Azure.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-service-management,azure-resource-manager

ms.assetid: eb4b92d8-be0f-44f6-a6c3-f8f7efab09fe
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 07/12/2017
ms.author: cynthn

---
# Planned maintenance for Windows virtual machines 

Azure periodically performs updates 
improve the reliability, performance, and security of the host
infrastructure for virtual machines. These updates range from
patching software components in the hosting environment (OS, hypervisor
and various agents deployed on the host), upgrading networking
components, to hardware decommissioning.

The majority of these updates are performed without any impact to the hosted
virtual machines.

However, there are cases where updates do have an impact:

-   In-place VM migration during the maintenance (where VMs are not rebooted) is called **VM preserving maintenance**.

-   Maintenance that requires a reboot or redeploy to hosted
    virtual machines is called **VM restarting maintenance**.

Please note that this page describes how Microsoft Azure performs
planned maintenance. For more information about unplanned events
(outages), see [Manage the availability of virtual
machines](manage-availability.md).


## VM preserving maintenance with In-place VM migration

WHen updates don't require a full reboot, an in-place
live migration (memory-preserving update) is used. During the update the virtual machine is paused for about 30 seconds,
preserving the memory in RAM, while the hosting environment applies the necessary updates and patches.
The virtual machine is then resumed.
After resuming, the clock of the virtual machine is automatically
synchronized.

For VMs in availability sets, update domains are updated one at a time. Pausing all VMs in the UD, resuming them and then going on to the next UD.

Some applications may be impacted by these types of updates. Applications that perform real-time event processing, media streaming 
or transcoding, or high throughput networking scenarios, for example,
may not be designed to tolerate a 30 second pause. <!-- sooooo, what should they do? -->
Applications running in a virtual machine can learn about upcoming
updates by calling the [Scheduled Events](../virtual-machines-scheduled-events.md)
API of the [Azure Metadata Service](../virtual-machines-instancemetadataservice-overview.md).

## Impactful maintenance for virtual machines

When VMs need to be rebooted for planned maintenance, you will be notified at least 30 days in advance. 

Planned maintenance has two phases: the Pre-emptive (or self-service)
Maintenance Window and a Scheduled Maintenance Window.

The **Pre-emptive Maintenance Window** lets you initiate the maintenance on your VMs at a time that works for you. DUring this time, you can query each VM to see their status  and check the result of your last initiated maintenance request.

When the pre-emptive window has passed, the **Scheduled Maintenance Window** begins. During this time window, you can still query for the maintenance
window, but no longer be able to start the maintenance yourself.

## Availability Considerations during Planned Maintenance 

### Paired Regions

Each Azure region is paired with another region within the same
geography, together making a regional pair. When executing maintenance,
Azure will only update the Virtual Machine instances in a single region
of its pair. For example, when updating the Virtual Machines in North
Central US, Azure will not update any Virtual Machines in South Central
US at the same time. This will be scheduled at a separate time, enabling
failover or load balancing between regions. However, other regions such
as North Europe can be under maintenance at the same time as East US.
Read more about [Azure region
pairs](https://docs.microsoft.com/azure/best-practices-availability-paired-regions).

### Single Instance VMs vs. Availability Set or VM scale set

When deploying a workload using virtual machines in Azure, you can create the VMs within an availability set in order to provide
high availability to your application. This configuration ensures that during
either an outage or maintenance events, at least one virtual machine is available.

Within an availability set, individual VMs are spread across up to 20
update domains. During planned maintenance, only a single update domain
is impacted at any given time. The order of update domains being
impacted may not proceed sequentially during planned maintenance. For single instance VMs (not part of availability set), there is no way to predict or determine which and how many VMs
are impacted together.

Virtual machine scale sets are an Azure compute resource that enables
you to deploy and manage a set of identical VMs as a single resource.
The scale set provides similar guarantees to an availability set in the
form of update domains. 

For more information about configuring your virtual machines for high
availability, see [*Manage the availability of your Windows virtual
machines*](../linux/manage-availability.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

### Scheduled Events

Azure Metadata Service enables you to discover information about your
Virtual Machine hosted in Azure. Scheduled Events, one of the exposed
categories, surfaces information regarding upcoming events (for example,
reboot) so your application can prepare for them and limit disruption.

For more information about scheduled events, refer to [Azure Metadata
Service - Scheduled
Events](../virtual-machines-scheduled-events.md).

## Maintenance Discovery and Notifications

Maintenance schedule is visible to customers at the level of individual
VMs. You can use Azure portal, API, PowerShell, or CLI to query for the
pre-emptive and scheduled maintenance windows. In addition, expect to
receive a notification (email) in the case where one (or more) of your
VMs are impacted during the process.

Both pre-emptive maintenance and scheduled maintenance phases begin with
a notification. Expect to receive a single notification per Azure
subscription. The notification is sent to the subscription’s admin
and co-admin by default. You can also configure the audience for the
maintenance notification.

### View the Maintenance Window in the portal 

You can use the Azure portal and look for VMs scheduled for maintenance.

1.  Sign in to the Azure portal.

2.  Click and open the **Virtual Machines** blade.

3.  Click the **Columns** button to open the list of available columns
    to choose from

4.  Select and add the **Maintenance Window** columns. VMs that are
    scheduled for maintenance have the maintenance windows
    surfaced. Once maintenance is completed or aborted for a, the
    maintenance window is no longer be presented.

### Query maintenance details using the Azure API

Use the [get VM information
API](https://docs.microsoft.com/rest/api/compute/virtualmachines/virtualmachines-get)
and look for the instance view to discover the maintenance details on an
individual VM. The response includes the following elements:

  - isCustomerInitiatedMaintenanceAllowed: Indicates whether you can now initiate pre-emptive redeploy on the VM.

  - preMaintenanceWindowStartTime: The start time of the pre-emptive maintenance window.

  - preMaintenanceWindowEndTime: The end time of the pre-emptive maintenance window. After this time, you will no longer be able to initiate maintenance on this VM.
    
  - maintenanceWindowStartTime: The start time of the scheduled maintenance window when your VM are impacted.

  - maintenanceWindowEndTime: The end time of the scheduled maintenance window.
  
  - lastOperationResultCode: The result of your last Maintenance-Redeploy operation.
 
  - lastOperationMessage:  Message describing the result of your last Maintenance-Redeploy operation.

## Pre-emptive Redeploy

Pre-emptive redeploy action provides the flexibility to control the time
when maintenance is applied to your VMs in Azure. Planned
maintenance begins with a pre-emptive maintenance window where you can
decide on the exact time for each of your VMs to be rebooted. The
following are use cases where such a functionality is useful:

-   Maintenance need to be coordinated with the end customer.

-   The scheduled maintenance window offered by Azure is not sufficient.
    It could be that the window happens to be on the busiest time of the
    week or it is too long.

-   For multi-instance or multi-tier applications, you need sufficient
    time between two VMs or a certain sequence to follow.

When you call for pre-emptive redeploy on a VM, it moves the VM to an
already updated node and then powers it
back on, retaining all your configuration options and associated
resources. While doing so, the temporary disk is lost and dynamic IP
addresses associated with virtual network interface are updated.

Pre-emptive redeploy is enabled once per VM. If there is an error during the process, the operation is aborted,
the VM is not impacted and it is excluded from the planned
maintenance iteration. You will be contacted in a later time with a new schedule
and offered a new opportunity to schedule and sequence the impact on
your VMs.



