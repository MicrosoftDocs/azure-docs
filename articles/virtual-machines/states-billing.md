---
title: States and billing of Azure Virtual Machines 
description: Overview of various states a VM can enter and when a user is billed. 
services: virtual-machines
author: mimckitt
ms.service: virtual-machines
ms.subservice: billing
ms.topic: conceptual
ms.date: 03/8/2021
ms.author: mimckitt
ms.reviewer: cynthn
---

# States and billing of Azure Virtual Machines

Azure Virtual Machines (VMs) go through different states that can be categorized into *provisioning* and *power* states. The purpose of this article is to describe these states and specifically highlight when customers are billed for instance usage. 

## Get states using Instance View

The instance view API provides VM running-state information. For more information, see the [Virtual Machines - Instance View](/rest/api/compute/virtualmachines/instanceview) API documentation.

Azure Resources explorer provides a simple UI for viewing the VM running state: [Resource Explorer](https://resources.azure.com/).

Provisioning states are visible on VM properties and instance view. Power states are available in instance view of VM.

To retrieve the power state of all the VMs in your subscription, use the [Virtual Machines - List All API](/rest/api/compute/virtualmachines/listall) with parameter **statusOnly** set to *true*.

> [!NOTE]
> [Virtual Machines - List All API](/rest/api/compute/virtualmachines/listall) with parameter **statusOnly** set to true will retrieve the power states of all VMs in a subscription. However, in some rare situations, the power state may not available due to intermittent issues in the retrieval process. In such situations, we recommend retrying using the same API or using [Azure Resource Health](../service-health/resource-health-overview.md) or [Azure Resource Graph](..//governance/resource-graph/overview.md) to check the power state of your VMs.
 
## Power states and billing

The power state represents the last known state of the VM.

:::image type="content" source="./media/virtual-machines-common-states-lifecycle/vm-power-states.png" alt-text="Image shows diagram of the power states a VM can go through. ":::

The following table provides a  description of each instance state and indicates whether it is billed for instance usage or not.

| Power state | Description | Billing |  
|---|---|---|
| Starting| Virtual Machine is powering up. | Billed | 
| Running | Virtual Machine is fully up. This is the standard working state. | Billed | 
| Stopping | This is a transitional state between running and stopped. | Billed| 
|Stopped | The Virtual Machine is allocated on a host but not running. Also called PoweredOff state or *Stopped (Allocated)*. This can be result of invoking the PowerOff API operation or invoking shutdown from within the guest OS. The Stopped state may also be observed briefly during VM creation or while starting a VM from Deallocated state.  | Billed | 
| Deallocating | This is the transitional state between running and deallocated. | Not billed* | 
| Deallocated | The Virtual Machine has released the lease on the underlying hardware and is completely powered off. This state is also referred to as *Stopped (Deallocated)*. | Not billed* | 

&#42; Some Azure resources, such as [Disks](https://azure.microsoft.com/pricing/details/managed-disks) and [Networking](https://azure.microsoft.com/pricing/details/bandwidth/) will continue to incur charges.


## Provisioning states

A provisioning state is the status of a user-initiated, control-plane operation on the VM. These states are separate from the power state of a VM.

:::image type="content" source="./media/virtual-machines-common-states-lifecycle/vm-provisioning-states.png" alt-text="Image shows the provisioning states a VM can go through.":::

| Provisioning state | Description | Power state | Billing | 
|---|---|---|---|
| Create | Virtual machine creation. | Starting | Not billed* | 
| Update | Updates the model for an existing virtual machine. Some non-model changes to a virtual machine such as start and restart fall under the update state. | Running | Billed | 
| Delete | Virtual machine deletion. | Deallocating | Not billed* |
| Deallocate | Virtual machine is fully stopped and removed from the underlying host. Deallocating a virtual machine is considered an update and will display provisioning states similar to updating. | Deallocating | Not billed* | 

&#42; Some Azure resources, such as [Disks](https://azure.microsoft.com/pricing/details/managed-disks) and [Networking](https://azure.microsoft.com/pricing/details/bandwidth/) will continue to incur charges.

## OS Provisioning states
OS Provisioning states only apply to virtual machines created with an OS image. Specialized images will not display these states. 

:::image type="content" source="./media/virtual-machines-common-states-lifecycle/os-provisioning-states.png" alt-text="Image shows the OS provisioning states a VM can go through.":::

| OS Provisioning state | Description | Power state | Billing | 
|---|---|---|---|
| OSProvisioningInProgress | The VM is running and the installation of the Guest OS is in progress. | Running | Billed | 
| OSProvisioningComplete | This is a short-lived state. The virtual machine quickly transitions from this state to **Success**. If extensions are still being installed you will continue to see this state until they are complete. | Running | Billed | 
| Succeeded | The user-initiated actions have completed. | Running | Billed | 
| Failed | Represents a failed operation. Refer to the error code for more information and possible solutions. | Running  | Billed | 


## Next steps
- Review the [Azure Cost Management and Billing documentation](../cost-management-billing/index.yml)
- Use the [Azure Pricing calculator](https://azure.microsoft.com/pricing/calculator/) to plan your deployments.
- Learn more about monitoring your VM, see [Monitor virtual machines in Azure](../azure-monitor/vm/monitor-vm-azure.md).
