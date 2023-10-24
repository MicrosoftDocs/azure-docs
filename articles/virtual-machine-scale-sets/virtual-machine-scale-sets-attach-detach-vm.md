---
title: Attach or detach a virtual machine to or from a Virtual Machine Scale Set
description: How to attach or detach a virtual machine to or from a Virtual Machine Scale Set
author: fitzgeraldsteele 
ms.author: fisteele 
ms.topic: overview
ms.service: virtual-machine-scale-sets
ms.date: 05/05/2023
ms.reviewer: jushiman
---

# Attaching a VM to a Virtual Machine Scale Set

> [!IMPORTANT]
> You can only attach VMs to a Virtual Machine Scale Set in **Flexible orchestration mode**. For more information, see [Orchestration modes for Virtual Machine Scale Sets](./virtual-machine-scale-sets-orchestration-modes.md).

There are times where you may want to attach a virtual machine to a Virtual Machine Scale Set to benefit from the scale, availability, and flexibility that comes with scale sets. There are two ways to attach VMs to scale sets: manually create a new VM into the scale set, or attach an existing VM to the scale set.

You can attach a standalone virtual machine to a Virtual Machine Scale Set. Attaching a standalone virtual machine is available when you need a different configuration on a specific virtual machine than what is defined in the scaling profile, or when the scale set doesn't have a virtual machine scaling profile. Manually attaching virtual machines gives you full control over instance naming and placement into a specific availability zone or fault domain. The virtual machine doesn't have to match the configuration in the virtual machine scaling profile, so you can specify parameters like operating system, networking configuration, on-demand or Spot, and VM size.

You can attach an existing VM to an existing Virtual Machine Scale set by specifying which scale set you would like to attach to. The VM doesn't have to be the same as the VMs already running in the scale set, meaning it can have a different operating system, network configuration, priority, disk, and more. 

In the next sections, we'll go over the different ways to attach a VM to a scale set.

## Attach a new VM to a Virtual Machine Scale Set

Attach a virtual machine to a Virtual Machine Scale Set at the time of VM creation by specifying the `virtualMachineScaleSet` property. 

> [!NOTE]
> Attaching a virtual machine to Virtual Machine Scale Set doesn't by itself update any VM networking parameters such as load balancers. If you would like this virtual machine to receive traffic from any load balancer, you must manually configure the VM network interface to receive traffic from the load balancer.  Learn more about [Load balancers](../virtual-network/network-overview.md#load-balancers).

### [Azure portal](#tab/portal)

1. Go to **Virtual Machines**.
1. Select **Create**
2. Select **Azure virtual machine**.
3. In the **Basics** tab, open the **Availability options** dropdown and select **Virtual Machine Scale Set**.
4. In the **Virtual Machine Scale Set** dropdown, select the scale set to which you want to add this virtual machine.
5. Optionally, specify the Availability zone or Fault domain to place the VM.

### [Azure CLI](#tab/cli)

```azurecli-interactive
az vm create 
  --name myVM \
  --resource-group myResourceGroup \
  --image Ubuntu2204 \
  --vmss myVMScaleSet \
  --platform-fault-domain 1
```

### [Azure PowerShell](#tab/powershell)

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

## Attach an existing VM to a Virtual Machine Scale Set (Preview)

> Attach an existing virtual machine to a Virtual Machine Scale Set after the time of VM creation by specifying the `virtualMachineScaleSet` property. Attaching an existing VM to a scale set with a fault domain count of 1 will incur no downtime. 

> [!NOTE]
> Attaching a virtual machine to Virtual Machine Scale Set doesn't by itself update any VM networking parameters such as load balancers. If you would like this virtual machine to receive traffic from any load balancer, you must manually configure the VM network interface to receive traffic from the load balancer.  Learn more about [Load balancers](../virtual-network/network-overview.md#load-balancers).
>

### [Azure portal](#tab/portal)

1. Go to **Virtual Machines**.
2. Select the Name of the virtual machine you'd like to attach to your scale set.
3. Under **Settings** select **Availability + scaling**.
4. In the **Scaling** section, select the **Get started** button. If the button is grayed out, your VM currently doesn't meet the requirements to be attached to a scale set.
5. The **Attach to a VMSS** blade will appear on the right side of the page. Select the scale set you'd like to attach the VM to in the **Select a VMSS dropdown**. 
6. Select the **Attach** button at the bottom to attach the VM.

### [Azure CLI](#tab/cli)

```azurecli-interactive
az vm update 
  --resource-group {resourceGroupName} \
  --name {vmName} \
  --set virtualMachineScaleSet.id='/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{scaleSetName}'
```

### [Azure PowerShell](#tab/powershell)

```azurepowershell-interactive
#Get VM information
$vm = Get-AzVM -ResourceGroupName $resourceGroupName -Name $vmName `

#Get scale set information
$vmss = Get-AzVmss -ResourceGroupName $resourceGroupName -Name $vmssName `

#Create scale set reference
$vmssReference – New-Object Microsoft.Azure.Management.Compute.Models.SubResource `
$vmsReference.Id = $vmss.Id `
$vm.VirtualMachineScaleSet = $vmssReference `

#Update the VM with the scale set ID
Update-AzVM -ResourceGroupName $resourceGroupName -VM $vm `
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
- The VM can't be attached to a scale set with `SinglePlacementGroup` set to true. 

# Detaching a VM from a Virtual Machine Scale Set (Preview)
Should you need to detach a VM from a scale set, you can follow the below steps to remove the VM from the scale set.

> [!NOTE]
> Detaching VMs created by the scale set will require the VM to be `Stopped` prior to the detach.

### [Azure portal](#tab/portal)

1. Go to **Virtual Machines**.
2. If your VM was created by the scale set, ensure the VM is `Stopped`. If the VM was created as a standalone VM, you can continue regardless of if the VM is `Running` or `Stopped`.
3. Select the Name of the virtual machine you'd like to attach to your scale set.
4. Under **Settings** select **Availability + scaling**.
5. Select the **Detach from the VMSS** button at the top of the page.
6. When prompted to confirm, press the blue **Detach** button.
7. Portal sends a notification when the VM has successfully detached.

### [Azure CLI](#tab/cli)

```azurecli-interactive
az vm update 
  --resource-group resourceGroupName \
  --name vmName \
  --set virtualMachineScaleSet.id=null 
```

### [Azure PowerShell](#tab/powershell)

```azurepowershell-interactive
#Get VM information
$vm = Get-AzVM -ResourceGroupName $resourceGroupName -Name $vmName 

#Get scale set reference
$vmssReference = New-Object Microsoft.Azure.Management.Compute.Models.SubResource 
$vm.VirtualMachineScaleSet = $vmssReference 

#Update the VM with the new scale set refence of null
Update-AzVM -ResourceGroupName $resourceGroupName -VM $vm 
```
--- 

### Limitations for detaching a VM from a scale set
- The scale set must use Flexible orchestration mode.
- The scale set must have a `platformFaultDomainCount` of **1**.

# Troubleshooting

## Attach an existing VM to an existing scale set troubleshooting (Preview)
| Error Message                                                                                                                                                         | Description                                                                                                                                       | Troubleshooting options                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| VmssDoesNotSupportattachingExistingAvsetVM                                                                                                                            | The VM that an attach to a scale set was attempted on is part of an Availability Set and cannot be attached to a scale set.                       | VMs in an Availability Set cannot be attached to a scale set.                                                                                                                                                                                               |
| VmssDoesNotSupportAttachingExistingVMMultiFD                                                                                                                          | The attach of the VM failed because the VM was trying to attach to a scale set with a platform fault domain count of more than 1.                 | VMs can only be attached to scale sets with a `platform fault domain count` of 1. Try attaching to a scale set with a platform fault domain count of 1 rather than a scale set with a platform fault domain count of more than 1.                             |
| VmssDoesNotSupportAttachingExistingVMUnmanagedDisk                                                                                                                    | VMs with unmanaged disks cannot be attached to a scale set.                                                                                       | To attach a VM with a disk to the scale set, ensure that the VM is using a managed disk. To learn about how to migrate from an unmanaged disk to a managed disk, visit the migration documentation.                                                         |
| VmssDoesNotSupportAttachingPPGVM                                                                                                                                      | The attach of the VM failed because the VM is part of a Proximity Placement Group.                                                                | VMs from a Proximity Placement Group cannot be attached to a scale set. Remove the VM from the Proximity Placement Group and then try to attach to the scale set. See the  documentation to learn about how to move a VM out of a Proximity Placement Group |
| OperationNotAllowed, Message: This operation is not allowed because referenced Virtual Machine Scale Set '{armId}' does not have orchestration mode set to 'Flexible' | The target scale set is a scale set with Uniform orchestration mode.                                                                              | Only scale sets with Flexible orchestration mode can have VMs attached to them. Please try attaching to a scale set with Flexible orchestration mode.                                                                                                       |
| PropertyChangeNotAllowed Changing property virtualMachineScaleSet.id is not allowed.                                                                                  | The Virtual Machine Scale Set ID cannot be changed to a different Virtual Machine Scale Set ID without detaching the VM from the scale set first. | Please detach the VM from the Virtual Machine Scale Set, and then attach to the new scale set.                                                                                                                                                              |  |

## Detach a VM from a scale set troubleshooting (Preview)
| Error Message                                                                        | Description                                                                                                                                       | Troubleshooting options                                                                                                |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| VmssDoesNotSupportDetachNonDeallocatedVM                                             | VMs that are created by the scale set with Flexible Orhcestration Mode must be deallocated before being detached from the scale set               | Deallocate the VM and ensure that the resource is in a `deallocated` power state before retrying the detach operation. |
| PropertyChangeNotAllowed Changing property virtualMachineScaleSet.id is not allowed. | The Virtual Machine Scale Set ID cannot be changed to a different Virtual Machine Scale Set ID without detaching the VM from the scale set first. | Ensure the `virtualMachineScaleSet.id` is set to the value of `null`. Incorrect values include: `""` and `"null"`.     |

## What's next
Learn how to manage updates and maintenance using [Maintenance notification](virtual-machine-scale-sets-maintenance-notifications.md), [Maintenance configurations](../virtual-machines/maintenance-configurations.md), and [Scheduled Events](../virtual-machines/linux/scheduled-events.md)
