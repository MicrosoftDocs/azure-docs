---
title: Lifecycle and states of a VM in Azure 
description: Overview of the lifecycle of a VM in Azure including descriptions of the various states a VM can be in at any time.
services: virtual-machines
author: shandilvarun
ms.service: virtual-machines
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 08/09/2018
ms.author: vashan
---

# Virtual machines lifecycle and states

Azure Virtual Machines (VMs) go through different states that can be categorized into *provisioning* and *power* states. The purpose of this article is to describe these states and specifically highlight when customers are billed for instance usage. 
 
## Power states

The power state represents the last known state of the VM.

:::image type="content" source="./media/virtual-machines-common-states-lifecycle/vm-power-states.png" alt-text="Alt text that describes the content of the image.":::

The following table provides a  description of each instance state and indicates whether it is billed for instance usage or not.

| State | Description | Billing |  
|---|---|---|
| Starting| Virtual Machine is powering up. |Not billed | 
| Running | Virtual Machine is fully up. This is the standard working state. | | Billed | 
| Stopping | This is a transitional state between running and stopped. | Billed| 
|Stopped  | The Virtual Machine is has been shut down from within the Guest OS or using PowerOff APIs. In this state, the virtual machine is still leasing the underlying hardware. | Billed | 
| Deallocating | This is the transitional state between running and deallocated. | Not billed | 
| Deallocated | The Virtual Machine has released the lease on the underlying hardware and is completely powered off. | Not billed | 

&#42; Some Azure resources, such as Disks and Networking, incur charges. Software licenses on the instance do not incur charges.


## Provisioning states

A provisioning state is the status of a user-initiated, control-plane operation on the VM. These states are separate from the power state of a VM.

:::image type="content" source="./media/virtual-machines-common-states-lifecycle/vm-provisioning-states.png" alt-text="Alt text that describes the content of the image.":::

| State | Description | Billing | 
|---|---|---|
| Create | Virtual machine creation | | 
| Update | Updates the model for an existing virtual machine. Some non=model changes to a virtual machine such as start and restart fall under the update state | | 
| Delete | Virtual machine deletion | | 
| Deallocate | Virtual machine is fully stopped and removed from the underlying host. Deallocating a virtual machine is considered and update and will display provisioning states similar to updating. | | 

## OS Provisioning states
OS Provisioning states only apply to virtual machines created with an OS image. Specialized images will not display these states. 

:::image type="content" source="./media/virtual-machines-common-states-lifecycle/os-provisioning-states.png" alt-text="Alt text that describes the content of the image.":::


| State | Description | Billing | 
|---|---|---|
| OSProvisioningInProgress | The VM is running and the installation of the Guest OS is in progress | | 
| OSProvisioningComplete | This is a short-lived state. The virtual machine quickly transitions from this state to **Success**. If extensions are still being installed you will continue to see this state until they are complete. | | 
| Succeeded | The user-initiated actions have completed. | | 
| Failed | Represents a failed operation. Refer to the error codes to get more information and possible solutions. | |



## VM instance view

The instance view API provides VM running-state information. For more information, see the [Virtual Machines - Instance View](/rest/api/compute/virtualmachines/instanceview) API documentation.

Azure Resources explorer provides a simple UI for viewing the VM running state: [Resource Explorer](https://resources.azure.com/).

Provisioning states are visible on VM properties and instance view. Power states are available in instance view of VM.

To retrieve the power state of all the VMs in your subscription, use the [Virtual Machines - List All API](/rest/api/compute/virtualmachines/listall) with parameter **statusOnly** set to *true*.

## Next steps

To learn more about monitoring your VM, see [Monitor virtual machines in Azure](../azure-monitor/insights/monitor-vm-azure.md).
