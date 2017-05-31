---
title: VM restarting maintenance for Linux VMs in Azure | Microsoft Docs
description: VM restarting maintenance for Linux virtual machines.
services: virtual-machines-linux
documentationcenter: ''
author: zivr
manager: timlt
editor: ''
tags: azure-service-management,azure-resource-manager

ms.assetid: eb4b92d8-be0f-44f6-a6c3-f8f7efab09fe
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 03/27/2017
ms.author: zivr

---

# VM restarting maintenance

There are few cases where your VMs are rebooted due to planned
maintenance to the underlying infrastructure. Being impactful to the
availability of your VMs hosted in Azure, the following are now
available for you to use:

-   Notification sent at least 30 days before the impact.

-   Visibility to the maintenance windows per each VM.

-   Flexibility and control in setting the exact time for maintenance to
    impact your VMs.

Maintenance in Microsoft Azure is scheduled in iterations. Initial
iterations have smaller scope in order to reduce the risk involved in
rolling out new fixes and capabilities. Later iterations may span
multiple regions (never from the same region pair). A VM is included in a single maintenance iteration. If an iteration is aborted, remaining VMs are included in another, future, 
iteration.

The planned maintenance iteration has two phases: Pre-emptive
Maintenance Window and a Scheduled-Maintenance Window.

The **Pre-emptive Maintenance Window** provides you with the flexibility
to initiate the maintenance on your VMs. By doing so, you can determine
when your VMs are impacted, the sequence of the update, and the time
between each VM being maintained. You can query each VM to see whether
it is planned for maintenance and check the result of your last
initiated maintenance request.

The **Scheduled Maintenance Window** is when Azure has scheduled your
VMs for the maintenance. During this time window, which follows the
pre-emptive maintenance window, you can still query for the maintenance
window, but no longer be able to orchestrate the maintenance.

## Availability considerations during planned maintenance 

### Paired regions

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

### Single instance VMs vs. availability set or VM scale set

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
machines*](manage-availability.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

### Scheduled events

Azure Metadata Service enables you to discover information about your
Virtual Machine hosted in Azure. Scheduled Events, one of the exposed
categories, surfaces information regarding upcoming events (for example,
reboot) so your application can prepare for them and limit disruption.

For more information about scheduled events, refer to [Azure Metadata
Service - Scheduled
Events](../virtual-machines-scheduled-events.md).

## Maintenance discovery and notifications

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

### View the maintenance window in the portal 

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


## Pre-emptive redeploy

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
