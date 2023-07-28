---
title: Attach virtual machine to a Virtual Machine Scale Set
description: How to attach a virtual machine to a Virtual Machine Scale Set
author: fitzgeraldsteele 
ms.author: fisteele 
ms.topic: overview
ms.service: virtual-machine-scale-sets
ms.date: 05/05/2023
ms.reviewer: jushiman
---

# Attach VMs to a Virtual Machine Scale Set

> [!IMPORTANT]
> You can only attach VMs to a Virtual Machine Scale Set in **Flexible orchestration mode**. For more information, see [Orchestration modes for Virtual Machine Scale Sets](./virtual-machine-scale-sets-orchestration-modes.md).

You can attach a standalone virtual machine to a Virtual Machine Scale Set. Attaching a standalone virtual machine is available when you need a different configuration on a specific virtual machine than what is defined in the scaling profile, or when the scale set does not have a virtual machine scaling profile. Manually attaching virtual machines gives you full control over instance naming and placement into a specific availability zone or fault domain. The virtual machine doesn't have to match the configuration in the virtual machine scaling profile, so you can specify parameters like operating system, networking configuration, on-demand or Spot, and VM size.

## Attach a new VM to a Virtual Machine Scale Set

Attach a virtual machine to a Virtual Machine Scale Set at the time of VM creation by specifying the `virtualMachineScaleSet` property. 

> [!NOTE]
> Attaching a virtual machine to Virtual Machine Scale Set does not by itself update any VM networking parameters such as load balancers. If you would like this virtual machine to receive traffic from any load balancer, you must manually configure the VM network interface to receive traffic from the load balancer.  Learn more about [Load balancers](../virtual-network/network-overview.md#load-balancers).

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



### Exceptions to attaching a VM to a Virtual Machine Scale Set

- The VM must be in the same resource group as the scale set.
- If the scale set is regional (no availability zones specified), the virtual machine must also be regional. 
- If the scale set is zonal or spans multiple zones (one or more availability zones specified), the virtual machine must be created in one of the zones spanned by the scale set. For example, you can't create a virtual machine in Zone 1, and place it in a scale set that spans Zones 2 and 3.
- The scale set must be in Flexible orchestration mode, and the singlePlacementGroup property must be false.
- You must attach the VM at the time of VM creation. You can't attach an existing VM to a scale set.
- You can't detach a VM from a Virtual Machine Scale Set.

## What's next
Learn how to manage updates and maintenance using [Maintenance notification](virtual-machine-scale-sets-maintenance-notifications.md), [Maintenance configurations](../virtual-machines/maintenance-configurations.md), and [Scheduled Events](../virtual-machines/linux/scheduled-events.md)
