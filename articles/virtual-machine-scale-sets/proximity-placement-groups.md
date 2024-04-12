---
title: Proximity placement groups for Virtual Machine Scale Sets
description: Learn about creating  proximity placement groups for Windows Virtual Machine Scale Sets in Azure. 
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: proximity-placement-groups
ms.date: 11/22/2022
ms.reviewer: mimckitt
ms.custom: cynthn, devx-track-azurepowershell

---

# Create a proximity placement group using PowerShell

> [!NOTE]
> Many of the steps listed in this document apply to Virtual Machine Scale Sets using Uniform Orchestration mode. We recommend using Flexible Orchestration for new workloads. For more information, see [Orchesration modes for Virtual Machine Scale Sets in Azure](virtual-machine-scale-sets-orchestration-modes.md).

Placing VMs in a single region reduces the physical distance between the instances. Placing them within a single availability zone will also bring them physically closer together. However, as the Azure footprint grows, a single availability zone might span multiple physical data centers, which might result in a network latency impacting your application. 

To get VMs as close as possible, achieving the lowest possible latency, you can deploy them within a proximity placement group.

A proximity placement group is a logical grouping used to make sure that Azure compute resources are physically located close to each other. Proximity placement groups are useful for workloads where low latency is a requirement.

- Low latency between stand-alone VMs.
- Low Latency between VMs in a single availability set or a Virtual Machine Scale Set. 
- Low latency between stand-alone VMs, VMs in multiple Availability Sets, or multiple scale sets. You can have multiple compute resources in a single placement group to bring together a multi-tiered application. 
- Low latency between multiple application tiers using different hardware types. For example, running the backend using M-series in an availability set and the front end on a D-series instance, in a scale set, in a single proximity placement group.

## Using Proximity Placement Groups 

A proximity placement group is a resource in Azure. You need to create one before using it with other resources. Once created, it could be used with virtual machines, availability sets, or Virtual Machine Scale Sets. 
You specify a proximity placement group when creating compute resources providing the proximity placement group ID. 

You can also move an existing resource into a proximity placement group. When moving a resource into a proximity placement group, you should stop (deallocate) the asset first since it will be redeployed potentially into a different data center in the region to satisfy the colocation constraint. 

In the case of availability sets and Virtual Machine Scale Sets, you should set the proximity placement group at the resource level rather than the individual virtual machines. 

A proximity placement group is a colocation constraint rather than a pinning mechanism. It is pinned to a specific data center with the deployment of the first resource to use it. Once all resources using the proximity placement group have been stopped (deallocated) or deleted, it is no longer pinned. Therefore, when using a proximity placement group with multiple VM series, it is important to specify all the required types upfront in a template when possible or follow a deployment sequence which will improve your chances for a successful deployment. If your deployment fails, restart the deployment with the VM size which has failed as the first size to be deployed.

## What to expect when using Proximity Placement Groups 
Proximity placement groups offer colocation in the same data center. However, because proximity placement groups represent an additional deployment constraint, allocation failures can occur. There are few use cases where you might see allocation failures when using proximity placement groups:

- When you ask for the first virtual machine in the proximity placement group, the data center is automatically selected. In some cases, a second request for a different virtual machine SKU might fail if it doesn't exist in that data center. In this case, an **OverconstrainedAllocationRequest** error is returned. To avoid this, try changing the order in which you deploy your SKUs or have both resources deployed using a single ARM template.
- 	In the case of elastic workloads, where you add and remove VM instances, having a proximity placement group constraint on your deployment might result in a failure to satisfy the request resulting in **AllocationFailure** error. 
- Stopping (deallocate) and starting your VMs as needed is another way to achieve elasticity. Since the capacity is not kept once you stop (deallocate) a VM, starting it again might result in an **AllocationFailure** error. 
- VM start and redeploy operations will continue to respect the Proximity Placement Group once successfully configured.

## Planned maintenance and Proximity Placement Groups

Planned maintenance events, like hardware decommissioning at an Azure datacenter, could potentially affect the alignment of resources in proximity placement groups. Resources might be moved to a different data center, disrupting the collocation and latency expectations associated with the proximity placement group.

### Check the alignment status

You can do the following to check the alignment status of your proximity placement groups.

- Proximity placement group colocation status can be viewed using the portal, CLI, and PowerShell.

    -   For PowerShell, colocation status can be obtained using Get-AzProximityPlacementGroup cmdlet by including the optional parameter ‘-ColocationStatus`.

    -   For CLI, colocation status can be obtained using `az ppg show` by including the optional parameter ‘--include-colocation-status`.

- For each proximity placement group, a **colocation status** property
    provides the current alignment status summary of the grouped resources. 

    - **Aligned**: Resource is within the same latency envelop of the proximity placement group.

    - **Unknown**: at least one of the VM resources are deallocated. Once they start successfully, the status will go back to **Aligned**.

    - **Not aligned**: at least one VM resource is not aligned with the proximity placement group. The specific resources which are not aligned will also be called out separately in the membership section

- For Availability Sets, you can see information about alignment of individual VMs in the Availability Set Overview page.

- For scale sets, information about alignment of individual instances can be seen in the **Instances** tab of the **Overview** page for the scale set. 

### Re-align resources 

If a proximity placement group is `Not Aligned`, you can stop\deallocate and then restart the affected resources. If the VM is in an availability set or a scale set, all VMs in the availability set or scale set must be stopped\deallocated first before restarting them.

If there is an allocation failure due to deployment constraints, you might have to stop\deallocate all resources in the affected proximity placement group (including the aligned resources) first and then restart them to restore alignment.

## Best practices 
- For the lowest latency, use proximity placement groups together with accelerated networking. For more information, see [Create a Linux virtual machine with Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md) or [Create a Windows virtual machine with Accelerated Networking](../virtual-network/create-vm-accelerated-networking-powershell.md).
- Deploy all VM sizes in a single template. In order to avoid landing on hardware that doesn't support all the VM SKUs and sizes you require, include all of the application tiers in a single template so that they will all be deployed at the same time.
- If you are scripting your deployment using PowerShell, CLI or the SDK, you might get an allocation error `OverconstrainedAllocationRequest`. In this case, you should stop/deallocate all the existing VMs, and change the sequence in the deployment script to begin with the VM SKU/sizes that failed. 
- When reusing an existing placement group from which VMs were deleted, wait for the deletion to fully complete before adding VMs to it.
- If latency is your first priority, put VMs in a proximity placement group and the entire solution in an availability zone. But, if resiliency is your top priority, spread your instances across multiple availability zones (a single proximity placement group cannot span zones).

## Create a proximity placement group
Create a proximity placement group using the [New-AzProximityPlacementGroup](/powershell/module/az.compute/new-azproximityplacementgroup) cmdlet. 

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


## Create a scale set in a proximity placement group

> [!IMPORTANT]
>Starting November 2023, VM scale sets created using PowerShell and Azure CLI will default to Flexible Orchestration Mode if no orchestration mode is specified. For more information about this change and what actions you should take, go to [Breaking Change for VMSS PowerShell/CLI Customers - Microsoft Community Hub](
https://techcommunity.microsoft.com/t5/azure-compute-blog/breaking-change-for-vmss-powershell-cli-customers/ba-p/3818295)

Create a scale in the proximity placement group using `-ProximityPlacementGroup $ppg.Id` to refer to the proximity placement group ID when you use [New-AzVMSS](/powershell/module/az.compute/new-azvmss) to create the scale set.

```azurepowershell-interactive
$scalesetName = "myVM"

New-AzVmss `
  -ResourceGroupName $resourceGroup `
  -Location $location `
  -OrchestrationMode "Uniform" `
  -VMScaleSetName $scalesetName `
  -VirtualNetworkName "myVnet" `
  -SubnetName "mySubnet" `
  -PublicIpAddressName "myPublicIPAddress" `
  -LoadBalancerName "myLoadBalancer" `
  -ProximityPlacementGroup $ppg.Id
```

You can see the instance in the placement group using [Get-AzProximityPlacementGroup](/powershell/module/az.compute/get-azproximityplacementgroup).

```azurepowershell-interactive
  Get-AzProximityPlacementGroup `
   -ResourceId $ppg.Id | Format-Table `
   -Wrap `
   -Property VirtualMachineScaleSets
```

## Next steps

You can also use the [Azure CLI](../virtual-machines/linux/proximity-placement-groups.md) to create proximity placement groups.
