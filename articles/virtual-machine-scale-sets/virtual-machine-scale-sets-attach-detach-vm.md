---
title: Attach or detach a virtual machine to or from a Virtual Machine Scale Set
description: How to attach or detach a virtual machine to or from a Virtual Machine Scale Set
author: fitzgeraldsteele 
ms.author: fisteele 
ms.topic: overview
ms.service: virtual-machine-scale-sets
ms.custom: devx-track-azurecli
ms.date: 05/05/2023
ms.reviewer: jushiman
---

# Attach or detach a Virtual Machine to or from a Virtual Machine Scale Set

## Attaching a VM to a Virtual Machine Scale Set

> [!IMPORTANT]
> You can only attach VMs to a Virtual Machine Scale Set in **Flexible orchestration mode**. For more information, see [Orchestration modes for Virtual Machine Scale Sets](./virtual-machine-scale-sets-orchestration-modes.md).

There are times where you need to attach a virtual machine to a Virtual Machine Scale Set to benefit from the scale, availability, and flexibility that comes with scale sets. There are two ways to attach VMs to scale sets: manually create a new standalone VM in the scale set or attach an existing VM to the scale set.

You can attach a new standalone VM to a scale set when you need a different configuration on a specific VM than what's defined in the scaling profile, or when the scale set doesn't have a virtual machine scaling profile. Manually attaching VMs gives you full control over instance naming and placement into a specific availability zone or fault domain. The VM doesn't have to match the configuration in the virtual machine scaling profile, so you can specify parameters like operating system, networking configuration, on-demand or Spot, and VM size.

You can attach an existing VM to an existing Virtual Machine Scale Set by specifying which scale set you would like to attach to. The VM doesn't have to be the same as the VMs already running in the scale set, meaning it can have a different operating system, network configuration, priority, disk, and more. 


### Attach a new VM to a Virtual Machine Scale Set

Attach a virtual machine to a Virtual Machine Scale Set at the time of VM creation by specifying the `virtualMachineScaleSet` property. 

> [!NOTE]
> Attaching a virtual machine to Virtual Machine Scale Set doesn't by itself update any VM networking parameters such as load balancers. If you would like this virtual machine to receive traffic from any load balancer, you must manually configure the VM network interface to receive traffic from the load balancer.  Learn more about [Load balancers](../virtual-network/network-overview.md#load-balancers).

#### [Azure portal](#tab/portal-1)

1. Go to **Virtual Machines**.
1. Select **Create**
2. Select **Azure virtual machine**.
3. In the **Basics** tab, open the **Availability options** dropdown and select **Virtual Machine Scale Set**.
4. In the **Virtual Machine Scale Set** dropdown, select the scale set to which you want to add this virtual machine.
5. Optionally, specify the Availability zone or Fault domain to place the VM.

#### [Azure CLI](#tab/cli-1)

```azurecli-interactive
az vm create 
  --name myVM \
  --resource-group myResourceGroup \
  --image Ubuntu2204 \
  --vmss myVMScaleSet \
  --platform-fault-domain 1
```

#### [Azure PowerShell](#tab/powershell-1)

```azurepowershell-interactive
New-AzVm `
    -ResourceGroupName 'myResourceGroup' `
    -Name 'myVM' `
    -Location 'East US' `
    -VmssId 'myVmss' `
    -VirtualNetworkName 'myVnet' `
    -SubnetName 'mySubnet' `
    -SecurityGroupName 'myNetworkSecurityGroup' `
    -PublicIpAddressName 'myPublicIpAddress' `
    -OpenPorts 80,3389
```
---



### Exceptions to attaching a new VM to a Virtual Machine Scale Set

- The VM must be in the same resource group as the scale set.
- If the scale set is regional (no availability zones specified), the virtual machine must also be regional. 
- If the scale set is zonal or spans multiple zones (one or more availability zones specified), the virtual machine must be created in one of the zones spanned by the scale set. For example, you can't create a virtual machine in Zone 1, and place it in a scale set that spans Zones 2 and 3.
- The scale set must be in Flexible orchestration mode, and the singlePlacementGroup property must be false.

### Attach an existing VM to a Virtual Machine Scale Set (Preview)

Attach an existing virtual machine to a Virtual Machine Scale Set after the time of VM creation by specifying the `virtualMachineScaleSet` property. Attaching an existing VM to a scale set with a fault domain count of 1 doesn't require downtime. 

#### Enroll in the Preview

Register for the `SingleFDAttachDetachVMToVmss` feature flag using the [az feature register](/cli/azure/feature#az-feature-register) command:

```azurecli-interactive
az feature register --namespace "Microsoft.Compute" --name "SingleFDAttachDetachVMToVmss"
```

It takes a few minutes for the feature to register. Verify the registration status by using the [az feature show](/cli/azure/feature#az-feature-register) command:

```azurecli-interactive
az feature show --namespace "Microsoft.Compute" --name "SingleFDAttachDetachVMToVmss"
```


> [!NOTE]
> Attaching a virtual machine to Virtual Machine Scale Set doesn't by itself update any VM networking parameters such as load balancers. If you would like this virtual machine to receive traffic from any load balancer, you must manually configure the VM network interface to receive traffic from the load balancer. Learn more about [Load balancers](../virtual-network/network-overview.md#load-balancers).
>

#### [Azure portal](#tab/portal-2)

1. Go to **Virtual Machines**.
2. Select the name of the virtual machine you'd like to attach to your scale set.
3. Under **Settings** select **Availability + scaling**.
4. In the **Scaling** section, select the **Get started** button. If the button is grayed out, your VM currently doesn't meet the requirements to be attached to a scale set.
5. The **Attach to a VMSS** blade will appear on the right side of the page. Select the scale set you'd like to attach the VM to in the **Select a VMSS dropdown**. 
6. Select the **Attach** button at the bottom to attach the VM.

#### [Azure CLI](#tab/cli-2)

```azurecli-interactive
az vm update 
  --resource-group {resourceGroupName} \
  --name {vmName} \
  --set virtualMachineScaleSet.id='/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{scaleSetName}'
```

#### [Azure PowerShell](#tab/powershell-2)

```azurepowershell-interactive
#Get VM information
$vm = Get-AzVM -ResourceGroupName $resourceGroupName -Name $vmName `

#Get scale set information
$vmss = Get-AzVmss -ResourceGroupName $resourceGroupName -Name $vmssName `

#Update the VM with the scale set ID
Update-AzVM -ResourceGroupName $resourceGroupName -VM $vm  -VirtualMachineScaleSetId $vmss.Id
```
--- 

### Limitations for attaching an existing VM to a scale set
- The scale set must use Flexible orchestration mode.
- The scale set must have a `platformFaultDomainCount` of *1*.
- The VM and scale set must be in the same resource group. 
- The VM and target scale set must both be zonal, or they must both be regional. You can't attach a zonal VM to a regional scale set. 
- The VM can't be in a self-defined availability set. 
- The VM can't be in a `ProximityPlacementGroup`. 
- The VM can't be in an Azure Dedicated Host. 
- The VM must have a managed disk. 
- The scale set must have `properties.singlePlacementGroup` set to `False`.

## Detaching a VM from a Virtual Machine Scale Set (Preview)
Should you need to detach a VM from a scale set, you can follow the below steps to remove the VM from the scale set.

> [!NOTE]
> Detaching VMs created by the scale set will require the VM to be `Stopped` prior to the detach. VMs that were previously attached to the scale set can be detached while running.

### [Azure portal](#tab/portal-3)

1. Go to **Virtual Machines**.
2. If your VM was created by the scale set, ensure the VM is `Stopped`. If the VM was created as a standalone VM, you can continue regardless of if the VM is `Running` or `Stopped`.
3. Select the name of the virtual machine you'd like to attach to your scale set.
4. Under **Settings** select **Availability + scaling**.
5. Select the **Detach from the VMSS** button at the top of the page.
6. When prompted to confirm, select the **Detach** button.
7. Portal sends a notification when the VM is detached.

### [Azure CLI](#tab/cli-3)

```azurecli-interactive
az vm update 
  --resource-group resourceGroupName \
  --name vmName \
  --set virtualMachineScaleSet.id=null 
```

### [Azure PowerShell](#tab/powershell-3)

```azurepowershell-interactive
#Get VM information
$vm = Get-AzVM -ResourceGroupName $resourceGroupName -Name $vmName 

#Update the VM with the new scale set refence of $null
Update-AzVM -ResourceGroupName $resourceGroupName -VM $vm -VirtualMachineScaleSetId $null
```
--- 

### Limitations for detaching a VM from a scale set
- The scale set must use Flexible orchestration mode.
- The scale set must have a `platformFaultDomainCount` of **1**.
- VMs created by the scale set must be `Stopped` prior to being detached.

## Moving VMs between scale sets (Preview)

To move a VM from one scale set to another, use the following steps:
1. [Detach](#detaching-a-vm-from-a-virtual-machine-scale-set-preview) the VM from scale set A.
2. Once the detach completes, [attach](#attach-an-existing-vm-to-a-virtual-machine-scale-set-preview) the VM to scale set B.

### Limitations
The limitations for VMs to be [attached](#limitations-for-attaching-an-existing-vm-to-a-scale-set) or [detached](#limitations-for-detaching-a-vm-from-a-scale-set) to or from a scale set remain the same. 

## Troubleshooting

### Attach an existing VM to an existing scale set troubleshooting (Preview)

| Error Message                                                                                                                                                                                                                                  | Description                                                                                                                                                                      | Troubleshooting Options                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Referenced Virtual Machine Scale Set '{vmssName}' does not support attaching an existing Virtual Machine to it. For more information, see https://aka.ms/vmo/attachdetach.                                                                     | The subscription isn't enrolled in the Attach/Detach Preview.                                                                                                                    | Ensure that your subscription is enrolled in the feature. Reference the [documentation](#enroll-in-the-preview) to check if you're enrolled.                                                                                                                                                                                                                                   |
| The Virtual Machine Scale Set '{vmssUri}' referenced by the Virtual Machine does not exist.                                                                                                                                                    | The scale set resource doesn't exist, or isn't in Flexible Orchestration Mode.                                                                                                   | Check to see if the scale set exists. If it does, check if it's using Uniform Orchestration Mode.                                                                                                                                                                                                                                                                               |
| This operation is not allowed because referenced Virtual Machine Scale Set '{vmssName}' does not have orchestration mode set to 'Flexible'.                                                                                                    | The scale set isn't in Flexible Orchestration Mode.                                                                                                                              | Try attaching to another scale set with Flexible Orchestration Mode enabled.                                                                                                                                                                                                                                                                                                    |
| Referenced Virtual Machine '{vmName}' belongs to an Availability Set and attaching to a Virtual Machine Scale Set is not supported. For more information, see https://aka.ms/vmo/attachdetach.                                                 | `VmssDoesNotSupportAttachingExistingAvsetVM`: The VM that you attempted to attach is part of an Availability Set and can't be attached to a scale set.                           | VMs in an Availability Set can't be attached to a scale set.                                                                                                                                                                                                                                                                                                                    |
| Referenced Virtual Machine Scale Set '{vmssName}' does not support attaching an existing Virtual Machine to it because the Virtual Machine Scale Set has more than 1 fault domains. For more information, see https://aka.ms/vmo/attachdetach. | `VmssDoesNotSupportAttachingExistingVMMultiFD`: The attach of the VM failed because the VM was trying to attach to a scale set with a platform fault domain count of more than 1.| VMs can only be attached to scale sets with a `platform fault domain count` of 1. Try attaching to a scale set with a platform fault domain count of 1, rather than a scale set with a platform fault domain count of more than 1.                                                                                                                                               |
| Using a Virtual Machine '{vmName}' with unmanaged disks and attaching it to a Virtual Machine Scale Set is not supported. For more information, see https://aka.ms/vmo/attachdetach.                                                           | `VmssDoesNotSupportAttachingExistingVMUnmanagedDisk`: VMs with unmanaged disks can't be attached to a scale set.                                                                 | To attach a VM with a disk to the scale set, ensure that the VM is using a managed disk. Visit the [documentation](../virtual-machines/windows/convert-unmanaged-to-managed-disks.md) to learn how to migrate from an unmanged disk to a managed disk.                                                                                                                          |
| Referenced Virtual Machine '{vmName}' belongs to a proximity placement group (PPG) and attaching to a Virtual Machine Scale Set is not supported. For more information, see https://aka.ms/vmo/attachdetach.                                   | `VmssDoesNotSupportAttachingPPGVM`: The attach of the VM failed because the VM is part of a Proximity Placement Group.                                                           | VMs from a Proximity Placement Group can't be attached to a scale set. [Remove the VM from the Proximity Placement Group](../virtual-machines/windows/proximity-placement-groups.md#move-an-existing-vm-out-of-a-proximity-placement-group) and then try to attach to the scale set. See the  documentation to learn about how to move a VM out of a Proximity Placement Group. |
| PropertyChangeNotAllowed Changing property virtualMachineScaleSet.id isn't allowed.                                                                                                                                                            | The Virtual Machine Scale Set ID can't be changed to a different Virtual Machine Scale Set ID without detaching the VM from the scale set first.                                 | Detach the VM from the Virtual Machine Scale Set, and then attach to the new scale set.                                                                                                                                                                                                                                                                                         |

### Detach a VM from a scale set troubleshooting (Preview)
| Error Message                                                                                                                                                                                                                                                                                                  | Description                                                                                                                                                                                          | Troubleshooting options                                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Virtual Machine Scale Set does not support detaching of Virtual Machines from it. For more information, see https://aka.ms/vmo/attachdetach.                                                                                                                                                                   | The subscription isn't enrolled in the Attach/Detach Preview.                                                                                                                                       | Ensure that your subscription is enrolled in the feature. Reference the [documentation](#enroll-in-the-preview) to check if you're enrolled.                                                               |
| The Virtual Machine Scale Set '{vmssUri}' referenced by the Virtual Machine does not exist.                                                                                                                                                                                                                    | The scale set resource doesn't exist, or isn't in Flexible Orchestration Mode.                                                                                                                     | Check to see if the scale set exists. If it does, check if it's using Uniform Orchestration Mode.                                                                                                          |
| This operation is not allowed because referenced Virtual Machine Scale Set '{vmssName}' does not have orchestration mode set to 'Flexible'.                                                                                                                                                                    | The scale set isn't in Flexible Orchestration Mode.                                                                                                                                                  | Only scale sets with Flexible Orchestration Mode can have VMs detached from them.                                                                                                                          |
| Virtual Machine Scale Set '{vmssName}' does not support detaching an existing Virtual Machine from it because the Virtual Machine Scale Set has more than 1 fault domains. For more information, see https://aka.ms/vmo/attachdetach.                                                                          | The detach of the VM failed because the scale set it's in has more than 1 platform fault domain.                                                                                                     | VMs can only be detached from scale sets with a `platform fault domain count` of 1.                                                                                                                        |
| OperationNotAllowed, Message: This operation is not allowed because referenced Virtual Machine Scale Set '{armId}' does not have orchestration mode set to 'Flexible'                                                                                                                                          | The scale set you attempted to attach to or detach from is a scale set with Uniform Orchestration Mode.                                                                                              | Only scale sets with Flexible Orchestration Mode can have VMs detached from them.                                                                                                                          |
| Virtual Machine was created with a Virtual Machine Scale Set association and must be deallocated before being detached. Deallocate the virtual machine and ensure that the resource is in deallocated power state before retrying detach operation. For more information, see https://aka.ms/vmo/attachdetach. | `VmssDoesNotSupportDetachNonDeallocatedVM`: Virtual Machines created by the Virtual Machine Scale Set with Flexible Orchestration Mode must be deallocated before being detached from the scale set. | Deallocate the VM and ensure that the resource is in a `deallocated` power state before retrying the detach operation.                                                                                     |
| PropertyChangeNotAllowed Changing property virtualMachineScaleSet.id is not allowed.                                                                                                                                                                                                                           | The Virtual Machine Scale Set ID can't be changed to a different Virtual Machine Scale Set ID without detaching the VM from the scale set first.                                                    | Detach the VM from the Virtual Machine Scale Set, and then attach to the new scale set. Ensure the `virtualMachineScaleSet.id` is set to the value of `null`. Incorrect values include: `""` and `"null"`. |


## What's next
Learn how to manage updates and maintenance using [Maintenance notification](virtual-machine-scale-sets-maintenance-notifications.md), [Maintenance configurations](../virtual-machines/maintenance-configurations.md), and [Scheduled Events](../virtual-machines/linux/scheduled-events.md).
