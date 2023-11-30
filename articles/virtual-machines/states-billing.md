---
title: States and billing status
description: Learn about the provisioning and power states that a virtual machine can enter. Provisioning and power states affect billing. 
services: virtual-machines
author: mimckitt
ms.service: virtual-machines
ms.subservice: billing
ms.topic: conceptual
ms.date: 10/31/2023
ms.author: mimckitt
ms.reviewer: cynthn, mattmcinnes
ms.custom: kr2b-contr-experiment
---

# States and billing status of Azure Virtual Machines

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Azure Virtual Machines (VM) instances go through different states. There are *provisioning* and *power* states. This article describes these states and highlights when customers are billed for instance usage.

## Get states using Instance View

The instance view API provides VM running-state information. For more information, see [Virtual Machines - Instance View](/rest/api/compute/virtualmachines/instanceview).

Azure Resources Explorer provides a simple UI for viewing the VM running state: [Resource Explorer](https://resources.azure.com/).

The VM provisioning state is available, in slightly different forms, from within the VM properties `provisioningState` and the InstanceView. In the VM InstanceView, there's an element within the `status` array in the form of `ProvisioningState/<state>[/<errorCode>]`.

To retrieve the power state of all the VMs in your subscription, use the [Virtual Machines - List All API](/rest/api/compute/virtualmachines/listall) with parameter `statusOnly` set to `true`.

> [!NOTE]
> [Virtual Machines - List All API](/rest/api/compute/virtualmachines/listall) with parameter `statusOnly` set to `true` retrieves the power states of all VMs in a subscription. However, in some rare situations, the power state may not available due to intermittent issues in the retrieval process. In such situations, we recommend retrying using the same API or using [Azure Resource Health](../service-health/resource-health-overview.md) to check the power state of your VMs.

## Power states and billing

The power state represents the last known state of the VM.

:::image type="content" source="./media/virtual-machines-common-states-lifecycle/vm-power-states.png" alt-text="Diagram shows the power states a V M can go through, as described below.":::

The following table provides a description of each instance state and indicates whether that state is billed for instance usage.

| Power state | Description | Billing |  
|---|---|---|
| Creating | Virtual machine is allocating resources. | Not Billed* | 
| Starting| Virtual machine is powering up. | Billed |
| Running | Virtual machine is fully up. This state is the standard working state. | Billed |
| Stopping | This state is transitional between running and stopped. | Billed |
| Stopped | The virtual machine is allocated on a host but not running. Also called *PoweredOff* state or *Stopped (Allocated)*. This state can be result of invoking the `PowerOff` API operation or invoking shutdown from within the guest OS. The *Stopped* state might also be observed briefly during VM creation or while starting a VM from *Stopped (Deallocated)* state.  | Billed |
| Deallocating | This state is transitional between *Running* and *Deallocated*. | Not billed* |
| Deallocated | The virtual machine has released the lease on the underlying hardware. If the machine is powered off it is shown as *Stopped (Deallocated)*. If it has entered [hibernation](./hibernate-resume.md) it is shown as *Hibernated (Deallocated)* | Not billed* |

\* Some Azure resources, such as [Disks](https://azure.microsoft.com/pricing/details/managed-disks) and [Networking](https://azure.microsoft.com/pricing/details/bandwidth/) continue to incur charges.

Example of PowerState in JSON:

```json
{
  "code": "PowerState/running",
  "level": "Info",
  "displayStatus": "VM running"
}
```

## Provisioning states

The provisioning state is the status of a user-initiated, control-plane operation on the VM. These states are separate from the power state of a VM.

| Provisioning state | Description |
|---|---|
| Creating | Virtual machine is being created. |
| Updating | Virtual machine is updating to the latest model. Some non-model changes to a virtual machine such as start and restart fall under the updating state. |
| Failed | Last operation on the virtual machine resource was unsuccessful. |
| Succeeded | Last operation on the virtual machine resource was successful. |
| Deleting | Virtual machine is being deleted. |
| Migrating | Seen when migrating from Azure Service Manager to Azure Resource Manager. |

## OS Provisioning states

OS Provisioning states only apply to virtual machines created with a [generalized](./linux/imaging.md#generalized-images) OS image. [Specialized](./linux/imaging.md#specialized-images) images and disks attached as OS disk don't display these states. The OS provisioning state isn't shown separately. It's a substate of the Provisioning State in the VM InstanceView. For example, `ProvisioningState/creating/osProvisioningComplete`.

:::image type="content" source="./media/virtual-machines-common-states-lifecycle/os-provisioning-states.png" alt-text="Diagram shows the O S provisioning states a V M can go through, as described below.":::

| OS Provisioning state | Description |
|---|---|
| OSProvisioningInProgress | The VM is running and the initialization (setup) of the Guest OS is in progress. |
| OSProvisioningComplete | This state is a short-lived state. The virtual machine quickly transitions from this state to *Success*. If extensions are still being installed, you continue to see this state until installation is complete. |
| Succeeded | The user-initiated actions have completed. |
| Failed | Represents a failed operation. For more information and possible solutions, see the error code. |

## Troubleshooting VM states

To troubleshoot specific VM state issues, see [Troubleshoot Windows VM deployments](/troubleshoot/azure/virtual-machines/troubleshoot-deployment-new-vm-windows) and [Troubleshoot Linux VM deployments](/troubleshoot/azure/virtual-machines/troubleshoot-deployment-new-vm-linux).

To troubleshoot hibernation, see [Troubleshoot VM hibernation](/hibernate-resume-troubleshooting.md).

For other troubleshooting help visit [Azure Virtual Machines troubleshooting documentation](/troubleshoot/azure/virtual-machines/welcome-virtual-machines).

## Next steps

- Review the [Azure Cost Management and Billing documentation](../cost-management-billing/index.yml)
- Use the [Azure Pricing calculator](https://azure.microsoft.com/pricing/calculator/) to plan your deployments.
- Learn more about monitoring your VM, see [Monitor virtual machines in Azure](../azure-monitor/vm/monitor-vm-azure.md).
