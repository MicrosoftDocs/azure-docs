---
title: "PowerShell: Use proximity placement groups"
description: Learn about creating and using proximity placement groups using Azure PowerShell. 
services: virtual-machines
ms.service: virtual-machines

ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 01/24/2020
ms.author: cynthn
#pmcontact: zivr
---

# Deploy VMs to proximity placement groups using PowerShell


To get VMs as close as possible, achieving the lowest possible latency, you should deploy them within a [proximity placement group](co-location.md#proximity-placement-groups).

A proximity placement group is a logical grouping used to make sure that Azure compute resources are physically located close to each other. Proximity placement groups are useful for workloads where low latency is a requirement.


## Create a proximity placement group
Create a proximity placement group using the [New-AzProximityPlacementGroup](https://docs.microsoft.com/powershell/module/az.compute/new-azproximityplacementgroup) cmdlet. 

```azurepowershell-interactive
$resourceGroup = "myPPGResourceGroup"
$location = "East US"
$ppgName = "myPPG"
New-AzResourceGroup -Name $resourceGroup -Location $location
$ppg = New-AzProximityPlacementGroup `
   -Location $location `
   -Name $ppgName `
   -ResourceGroupName $resourceGroup `
   -ProximityPlacementGroupType Standard
```

## List proximity placement groups

You can list all of the proximity placement groups using the [Get-AzProximityPlacementGroup](/powershell/module/az.compute/get-azproximityplacementgroup) cmdlet.

```azurepowershell-interactive
Get-AzProximityPlacementGroup
```


## Create a VM

Create a VM in the proximity placement group using `-ProximityPlacementGroup $ppg.Id` to refer to the proximity placement group ID when you use [New-AzVM](https://docs.microsoft.com/powershell/module/az.compute/new-azvm) to create the VM.

```azurepowershell-interactive
$vmName = "myVM"

New-AzVm `
  -ResourceGroupName $resourceGroup `
  -Name $vmName `
  -Location $location `
  -OpenPorts 3389 `
  -ProximityPlacementGroup $ppg.Id
```

You can see the VM in the placement group using [Get-AzProximityPlacementGroup](/powershell/module/az.compute/get-azproximityplacementgroup).

```azurepowershell-interactive
Get-AzProximityPlacementGroup -ResourceId $ppg.Id |
    Format-Table -Property VirtualMachines -Wrap
```

## Existing VM

You can also add an existing VM to a proximity placement group. You need to stop\deallocate the VM first, then update the VM and restart.

```azurepowershell-interactive
Stop-AzVM -Name myVM -ResourceGroupName myResourceGroup
$ppg = Get-AzProximityPlacementGroup -ResourceGroupName myPPGResourceGroup -Name myPPG
$vm = Get-AzVM -ResourceGroupName myResourceGroup -Name myVM
Update-AzVM -VM $vm -ResourceGroupName $vm.ResourceGroupName -ProximityPlacementGroupId $ppg.Id
Restart-AzVM -Name myVM -ResourceGroupName myResourceGroup
```

## Availability Sets
You can also create an  availability set in your proximity placement group. Use the same `-ProximityPlacementGroup` parameter with the [New-AzAvailabilitySet](/powershell/module/az.compute/new-azavailabilityset) cmdlet to create an availability set and all of the VMs created in the availability set will also be created in the same proximity placement group.

## Scale sets

You can also create a scale set in your proximity placement group. Use the same `-ProximityPlacementGroup` parameter with [New-AzVmss](https://docs.microsoft.com/powershell/module/az.compute/new-azvmss) to create a scale set and all of the instances will be created in the same proximity placement group.

## Next steps

You can also use the [Azure CLI](../linux/proximity-placement-groups.md) to create proximity placement groups.
