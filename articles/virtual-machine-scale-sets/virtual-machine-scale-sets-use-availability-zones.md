---
title: Create an Azure scale set that uses Availability Zones
description: Learn how to create Azure Virtual Machine Scale Sets that use Availability Zones for increased redundancy against outages
author: mimckitt
ms.author: mimckitt
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.subservice: availability
ms.date: 11/22/2022
ms.reviewer: jushiman
ms.custom: mimckitt, devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template
---

# Create a Virtual Machine Scale Set that uses Availability Zones

Azure availability zones are fault-isolated locations within an Azure region that provide redundant power, cooling, and networking. They allow you to run applications with high availability and fault tolerance to data center failures. Azure regions that support Availability Zones have a minimum of three separate zones. Each availability zone consists of one or more data centers equipped with independent infrastructure power, network, and cooling. Availability zones are connected by a high-performance network with a round-trip latency of less than 2 milliseconds. For more information, see [Overview of Availability Zones](../availability-zones/az-overview.md).

To protect your Virtual Machine Scale Sets from datacenter-level failures, you can create a scale set across Availability Zones. To use Availability Zones, your scale set must be created in a [supported Azure region](../availability-zones/az-region.md).

## Design considerations for availability zones

Virtual Machine Scale Sets supports three zonal deployment models:

- Zone redundant or zone spanning (recommended)
- Zonal or zone aligned (single zone)
- Regional

### Zone redundant or zone spanning

A zone redundant or zone spanning scale set spreads instances across all selected zones, `"zones": ["1","2","3"]`. By default, the scale set performs a best effort approach to evenly spread instances across selected zones. However, you can specify that you want strict zone balance by setting `"zoneBalance": "true"` in your deployment. Each VM and its disks are zonal, so they are pinned to a specific zone. Instances between zones are connected by high-performance network with low latency. In the event of a zonal outage or connectivity issue, connectivity to instances within the affected zone may be compromised, while instances in other availability zones should be unaffected. You may add capacity to the scale set during a zonal outage, and the scale set adds more instances to the unaffected zones. When the zone is restored, you may need to scale down your scale set to the original capacity. A best practice would be to configure [autoscale](virtual-machine-scale-sets-autoscale-overview.md) rules based on CPU or memory usage. The autoscale rules would allow the scale set to respond to a loss of the VM instances in that one zone by scaling out new instances in the remaining operational zones.

Spreading instances across availability zones meets the 99.99% SLA for instances spread across availability zones, and is recommended for most workloads in Azure.

### Zonal or zone aligned (single zone)

A zonal or zone aligned scale set places instances in a single availability zone `"zones": ['1']`. Each VM and its disks are zonal, so they are pinned to a specific zone. This configuration is primarily used when you need lower latency between instances.

### Regional

A regional Virtual Machine Scale Set is when the zone assignment isn't explicitly set (`"zones"=[]` or `"zones"=null`). In this configuration, the scale set creates Regional (not-zone pinned) instances and implicitly places instances throughout the region. There is no guarantee for balance or spread across zones, or that instances land in the same availability zone. Disk colocation is guaranteed for Ultra and Premium v2 disks, best effort for Premium V1 disks, and not guaranteed for Standard SKU (SSD or HDD) disks.

In the rare case of a full zonal outage, any or all instances within the scale set may be impacted.

### Fault domains and availability zones
A fault domain a fault isolation group within an availability zone or datacenter of hardware nodes that share the same power, networking, cooling, and platform maintenance schedule. VM instances that are on different fault domains are not likely to be impacted by the same planned or unplanned outage. You can specify how instances are spread across fault domains within a region or zone.

- Max spreading (platformFaultDomainCount = 1)
- Static fixed spreading (platformFaultDomainCount = 5)
- Spreading aligned with storage disk fault domains (platformFaultDomainCount = 2 or 3, for regional deployments only)

With max spreading, the scale set spreads your VMs across as many fault domains as possible within each zone. This spreading could be across greater or fewer than five fault domains per zone. With static fixed spreading, the scale set spreads your VMs across exactly five fault domains per zone. If the scale set can't find five distinct fault domains per zone to satisfy the allocation request, the request fails.

**We recommend deploying with max spreading for most workloads**, as this approach provides the best spreading in most cases. If you need replicas to be spread across distinct hardware isolation units, we recommend spreading across Availability Zones and utilize max spreading within each zone.

> [!NOTE]
> With max spreading, you only see one fault domain in the scale set VM instance view and in the instance metadata regardless of how many fault domains the VMs are spread across. The spreading within each zone is implicit.

### Placement groups

> [!IMPORTANT]
> Placement groups only apply to Virtual Machine Scale Sets running in Uniform orchestration mode.

When you deploy a scale set, you can deploy with a single [placement group](./virtual-machine-scale-sets-placement-groups.md) per Availability Zone, or with multiple per zone. For regional (non-zonal) scale sets, the choice is to have a single placement group in the region or to have multiple in the region. If the scale set property called `singlePlacementGroup` is set to false, the scale set can be composed of multiple placement groups and has a range of 0-1,000 VMs. When set to the default value of true, the scale set is composed of a single placement group, and has a range of 0-100 VMs. For most workloads, we recommend multiple placement groups, which allows for greater scale. In API version *2017-12-01*, scale sets default to multiple placement groups for single-zone and cross-zone scale sets, but they default to single placement group for regional (non-zonal) scale sets.



> [!NOTE]
> If you use max spreading, you must use multiple placement groups.

### Zone balancing

Finally, for scale sets deployed across multiple zones, you also have the option of choosing "best effort zone balance" or "strict zone balance." A scale set is considered "balanced" if each zone has the same number of VMs +\\- 1 VM as all other zones for the scale set. For example:

- A scale set with 2 VMs in zone 1, 3 VMs in zone 2, and 3 VMs in zone 3 is considered balanced. There is only one zone with a different VM count and it is only 1 less than the other zones.
- A scale set with 1 VM in zone 1, 3 VMs in zone 2, and 3 VMs in zone 3 is considered unbalanced. Zone 1 has 2 fewer VMs than zones 2 and 3.

It's possible that VMs in the scale set are successfully created, but extensions on those VMs fail to deploy. These VMs with extension failures are still counted when determining if a scale set is balanced. For instance, a scale set with 3 VMs in zone 1, 3 VMs in zone 2, and 3 VMs in zone 3 is considered balanced even if all extensions failed in zone 1 and all extensions succeeded in zones 2 and 3.

With best-effort zone balance, the scale set attempts to scale in and out while maintaining balance. However, if for some reason zone balance isn't possible (for example, if one zone goes down, the scale set can't create a new VM in that zone), the scale set allows temporary imbalance to successfully scale in or out. On subsequent scale-out attempts, the scale set adds VMs to zones that need more VMs for the scale set to be balanced. Similarly, on subsequent scale in attempts, the scale set removes VMs from zones that need fewer VMs for the scale set to be balanced. With "strict zone balance", the scale set fails any attempts to scale in or out if doing so would cause unbalance.

To use best-effort zone balance, set *zoneBalance* to *false*. This setting is the default in API version *2017-12-01*. To use strict zone balance, set *zoneBalance* to *true*.

>[!NOTE]
> The `zoneBalance` property can only be set if the zones property of the scale set contains more than one zone. If there are no zones or only one zone specified, then zoneBalance property should not be set.

## Create zone spanning or zonal scale sets

When you deploy a Virtual Machine Scale Set, you can choose to use a single Availability Zone in a region, or multiple zones.

 You can create a scale set that uses Availability Zones with one of the following methods:

- [Azure portal](#use-the-azure-portal)
- [Azure CLI](#use-the-azure-cli)
- [Azure PowerShell](#use-azure-powershell)
- [Azure Resource Manager templates](#use-azure-resource-manager-templates)

## Use the Azure portal

The process to create a scale set that uses an Availability Zone is the same as detailed in the [getting started article](quick-create-portal.md). When you select a supported Azure region, you can create a scale set in one or more available zones, as shown in the following example:

![Create a scale set in a single Availability Zone](media/virtual-machine-scale-sets-use-availability-zones/vmss-az-portal.png)

The scale set and supporting resources, such as the Azure load balancer and public IP address, are created in the single zone that you specify.

## Use the Azure CLI

The process to create a scale set that uses an Availability Zone is the same as detailed in the [getting started article](quick-create-cli.md). To use Availability Zones, you must create your scale set in a supported Azure region.

Add the `--zones` parameter to the [az vmss create](/cli/azure/vmss) command and specify which zone to use (such as zone *1*, *2*, or *3*).

```azurecli
az vmss create \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --image <SKU Image> \
    --upgrade-policy-mode automatic \
    --admin-username azureuser \
    --generate-ssh-keys \
    --zones 1 2 3
```

It takes a few minutes to create and configure all the scale set resources and VMs in the zone(s) that you specify. For a complete example of a zone-redundant scale set and network resources, see [this sample CLI script](scripts/cli-sample-zone-redundant-scale-set.md#sample-script)

## Use Azure PowerShell

To use Availability Zones, you must create your scale set in a supported Azure region. Add the `-Zone` parameter to the [New-AzVmssConfig](/powershell/module/az.compute/new-azvmssconfig) command and specify which zone or zones to use (such as zone *1*, *2*, or *3*).

```powershell
New-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -Location "EastUS2" `
  -VMScaleSetName "myScaleSet" `
  -VirtualNetworkName "myVnet" `
  -SubnetName "mySubnet" `
  -PublicIpAddressName "myPublicIPAddress" `
  -LoadBalancerName "myLoadBalancer" `
  -UpgradePolicy "Automatic" `
  -Zone "1", "2", "3"
```

## Use Azure Resource Manager templates

The process to create a scale set that uses an Availability Zone is the same as detailed in the getting started article for [Linux](quick-create-template-linux.md) or [Windows](quick-create-template-windows.md).

```json
{
  "type": "Microsoft.Compute/virtualMachineScaleSets",
  "name": "myScaleSet",
  "location": "East US 2",
  "apiVersion": "2017-12-01",
  "zones": [
        "1",
        "2",
        "3"
      ]
}
```

If you create a public IP address or a load balancer, specify the `"sku": {"name":"Standard"}` property to create zone-redundant network resources. You also need to create a Network Security Group and rules to permit any traffic. For more information, see [Azure Load Balancer Standard Overview](../load-balancer/load-balancer-overview.md) and [Standard Load Balancer and Availability Zones](../load-balancer/load-balancer-standard-availability-zones.md).

For a complete example of a zone-redundant scale set and network resources, see our [sample Resource Manager template](https://github.com/Azure/vm-scale-sets/blob/master/z_deprecated/preview/zones/multizone.json).

## Update scale set to add availability zones

You can modify a scale to expand the set of zones over which to spread VM instances. Expanding allows you to take advantage of higher zonal availability SLA (99.99%) versus regional availability SLA (99.95%). Or expand your scale set to take advantage of new availability zones that were not available when the scale set was created.

> [!IMPORTANT]
> Updating Virtual Machine Scale Sets to add availability zones is currently in preview. Previews are made available to you on the condition that you agree to the [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA).

> [!IMPORTANT]
> This preview is intended for stateless workloads on Virtual Machine Scale Sets. Scale sets with stateful workloads or used with **Service Fabric or Azure Kubernetes Services are not supported for zonal expansion**.

This feature can be used with API version 2023-03-01 or greater.

### Enable your subscription to use zonal expansion feature

You must register for four feature flags on your subscription:

### [Azure CLI](#tab/cli-1)


```azurecli
az feature register --namespace Microsoft.Compute --name VmssAllowRegionalToZonalMigration
az feature register --namespace Microsoft.Compute --name VmssAllowExpansionOfAvailabilityZones
az feature register --namespace Microsoft.Compute --name VmssFlexAllowExpansionOfAvailabilityZones
az feature register --namespace Microsoft.Compute --name VmssFlexAllowRegionalToZonalMigration
```

You can check the registration status of each feature by using:

```azurecli
az feature show --namespace Microsoft.Compute --name \<feature-name\>
```

### [Azure PowerShell](#tab/powershell-1)


```powershell
Register-AzProviderPreviewFeature -Name VmssAllowRegionalToZonalMigration -ProviderNamespace Microsoft.Compute
Register-AzProviderPreviewFeature -Name VmssAllowExpansionOfAvailabilityZones -ProviderNamespace Microsoft.Compute
Register-AzProviderPreviewFeature -Name VmssFlexAllowExpansionOfAvailabilityZones -ProviderNamespace Microsoft.Compute
Register-AzProviderPreviewFeature -Name VmssFlexAllowRegionalToZonalMigration -ProviderNamespace Microsoft.Compute
```

You can check the registration status of each feature by using:

```powershell
Get-AzProviderPreviewFeature -Name <feature-name> -ProviderNamespace Microsoft.Compute
```
---

### Expand scale set to use availability zones
You can update the scale set to scale out instances to one or more additional availability zones, up to the number of availability zones supported by the region. For regions that support zones, the minimum number of zones is 3.

> [!IMPORTANT]
> When you expand the scale set to additional zones, the original instances are not migrated or changed. When you scale out, new instances will be created and spread evenly across the selected availability zones. When you scale in the scale set, any regional instances will be priorized for removal first. After that, instances will be removed based on the [scale in policy](virtual-machine-scale-sets-scale-in-policy.md).

Expanding to a zonal scale set is done in 3 steps:

1. Prepare for zonal expansion
2. Update zones parameter on the scale set
3. Add new zonal instances and remove original instances

#### Prepare for zonal expansion

> [!WARNING]
> This preview allows you to add zones to the scale set. You can't go back to a regional scale set or remove zones once they have been added.

In order to prepare for zonal expansion:
* [Check that you have enough quota](../virtual-machines/quotas.md) for the VM size in the selected region to handle more instances.
* Check that the VM size and disk types you are using are available in all the desired zones. You can use the [Compute Resources SKUs API](/rest/api/compute/resource-skus/list?tabs=HTTP) to determine which sizes are available in which zones
* Validate that the scale set configuration is valid for zonal scale sets:
    * `platformFaultDomainCount` must be set to 1 or 5. Fixed spreading with 2 or 3 fault domains isn't supported for zonal deployments.
    * Capacity reservations are not supported during zone expansion. Once the scale set is fully zonal (no more regional instances), you can add a capacity reservation group to the scale set.
    * Azure Dedicated Host deployments are not supported.

#### Update the zones parameter on the scale set

Update the scale set to change the zones parameter.

### [Azure portal](#tab/portal-2)

1. Navigate to the scale set you want to update
1. On the Properties tab of the scale set landing page, find the **Availability zone** property and press **Edit**
1. On the **Edit Location** dialog box, select the desired zone(s)
1. Select **Apply**

### [Azure CLI](#tab/cli-2)

```azurecli
az vmss update --set zones=["1","2","3"] -n < myScaleSet > -g < myResourceGroup >
```

### [Azure PowerShell](#tab/powershell-2)

```azurepowershell
# Get the Virtual Machine Scale Set object
$vmss = Get-AzVmss -ResourceGroupName < resource-group-name > -VMScaleSetName < vmss-name >

# Update the zones parameter
$vmss.Zones = [Collections.Generic.List[string]]('1','2','3')

# Apply the changes
Update-AzVmss -ResourceGroupName < resource-group-name > -VMScaleSetName < vmss-name > -VirtualMachineScaleSet $vmss
```

### [REST API](#tab/template-2)

```json
PATCH /subscriptions/subscriptionid/resourceGroups/resourcegroupo/providers/Microsoft.Compute/virtualMachineScaleSets/myscaleset?api-version=2023-03-01

```javascript
{
  "zones": [
    "1",
    "2",
    "3"
  ]
}
```
---

### Add new zonal instances and remove original instances

#### Manually scale out and in

[Update the capacity](virtual-machine-scale-sets-autoscale-overview.md) of the scale set to add more instances. The new capacity should be set to the original capacity plus the number of new instances. For example, if your scale set had 5 regional instances and you would like to scale out so that you have 3 instances in each of 3 zones, you should set the capacity to 14.

You can update the zones parameter and the scale set capacity in the same ARM template or REST API call.

When you are satisfied that the new instances are ready, scale in your scale set to remove the original regional instances. You can either manually delete the specific regional instances, or scale in by reducing the scale set capacity. When scaling in via reducing scale set capacity, the platform will always prefer removing the regional instances, then follow the scale in policy.

#### Automate with Rolling upgrades + MaxSurge

With [Rolling upgrades + MaxSurge](virtual-machine-scale-sets-upgrade-policy.md), new zonal instances are created and brought up-to-date with the latest scale model in batches. Once a batch of new instances is added to the scale set and report as healthy, a batch of old instances are automated removed from the scale set. Upgrades continue until all instances are brought up-to-date.

> [!IMPORTANT]
> Rolling upgrades with MaxSurge is currently under Public Preview. It is only available for VMSS Uniform Orchestration Mode.

### Preview known issues and limitations

* The preview is targeted to stateless workloads on Virtual Machine Scale Sets.

* Scale sets running Service Fabric or Azure Kubernetes Service are not supported.

* You can't remove or replace zones, only add zones

* You can't update from a zone spanning or zonal scale set to a regional scaleset.

* `platformFaultDomainCount` must be set to 1 or 5. Fixed spreading with 2 or 3 fault domains isn't supported for zonal deployments.

* Capacity reservations are not supported during zone expansion. Once the scale set is fully zonal (no more regional instances), you can add a capacity reservation group to the scale set.

* Azure Dedicated Host deployments are not supported

## Next steps

Now that you have created a scale set in an Availability Zone, you can learn how to [Deploy applications on Virtual Machine Scale Sets](tutorial-install-apps-cli.md) or [Use autoscale with Virtual Machine Scale Sets](tutorial-autoscale-cli.md).
