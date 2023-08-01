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
ms.custom: mimckitt, devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template, devx-track-linux
---

# Create a Virtual Machine Scale Set that uses Availability Zones

Azure availability zones are fault-isolated locations within an Azure region that provide redundant power, cooling, and networking. They allow you to run applications with high availability and fault tolerance to data center failures. Azure regions that support Availability Zones have a minimum of three separate zones. Each availability zone consists of one or more data centers equipped with independent infrastructure power, network and cooling. Availability zones are connected by a high-performance network with a round-trip latency of less than 2ms. For more information, see [Overview of Availability Zones](../availability-zones/az-overview.md).

To protect your Virtual Machine Scale Sets from datacenter-level failures, you can create a scale set across Availability Zones. , each with their own independent power source, network, and cooling. 

## Availability considerations

When you deploy a regional (non-zonal) scale set into one or more zones as of API version *2017-12-01*, you have the following availability options:

- Max spreading (platformFaultDomainCount = 1)
- Static fixed spreading (platformFaultDomainCount = 5)
- Spreading aligned with storage disk fault domains (platformFaultDomainCount = 2 or 3)

With max spreading, the scale set spreads your VMs across as many fault domains as possible within each zone. This spreading could be across greater or fewer than five fault domains per zone. With static fixed spreading, the scale set spreads your VMs across exactly five fault domains per zone. If the scale set cannot find five distinct fault domains per zone to satisfy the allocation request, the request fails.

**We recommend deploying with max spreading for most workloads**, as this approach provides the best spreading in most cases. If you need replicas to be spread across distinct hardware isolation units, we recommend spreading across Availability Zones and utilize max spreading within each zone.

> [!NOTE]
> With max spreading, you only see one fault domain in the scale set VM instance view and in the instance metadata regardless of how many fault domains the VMs are spread across. The spreading within each zone is implicit.

### Placement groups

> [!IMPORTANT]
> Placement groups only apply to Virtual Machine Scale Sets running in Uniform orchestration mode.

When you deploy a scale set, you also have the option to deploy with a single [placement group](./virtual-machine-scale-sets-placement-groups.md) per Availability Zone, or with multiple per zone. For regional (non-zonal) scale sets, the choice is to have a single placement group in the region or to have multiple in the region. If the scale set property called `singlePlacementGroup` is set to false, the scale set can be composed of multiple placement groups and has a range of 0-1,000 VMs. When set to the default value of true, the scale set is composed of a single placement group, and has a range of 0-100 VMs. For most workloads, we recommend multiple placement groups, which allows for greater scale. In API version *2017-12-01*, scale sets default to multiple placement groups for single-zone and cross-zone scale sets, but they default to single placement group for regional (non-zonal) scale sets.

> [!NOTE]
> If you use max spreading, you must use multiple placement groups.

### Zone balancing

Finally, for scale sets deployed across multiple zones, you also have the option of choosing "best effort zone balance" or "strict zone balance". A scale set is considered "balanced" if each zone has the same number of VMs +\\- 1 VM as all other zones for the scale set. For example:

- A scale set with 2 VMs in zone 1, 3 VMs in zone 2, and 3 VMs in zone 3 is considered balanced. There is only one zone with a different VM count and it is only 1 less than the other zones.
- A scale set with 1 VM in zone 1, 3 VMs in zone 2, and 3 VMs in zone 3 is considered unbalanced. Zone 1 has 2 fewer VMs than zones 2 and 3.

It's possible that VMs in the scale set are successfully created, but extensions on those VMs fail to deploy. These VMs with extension failures are still counted when determining if a scale set is balanced. For instance, a scale set with 3 VMs in zone 1, 3 VMs in zone 2, and 3 VMs in zone 3 is considered balanced even if all extensions failed in zone 1 and all extensions succeeded in zones 2 and 3.

With best-effort zone balance, the scale set attempts to scale in and out while maintaining balance. However, if for some reason this is not possible (for example, if one zone goes down, the scale set cannot create a new VM in that zone), the scale set allows temporary imbalance to successfully scale in or out. On subsequent scale-out attempts, the scale set adds VMs to zones that need more VMs for the scale set to be balanced. Similarly, on subsequent scale in attempts, the scale set removes VMs from zones that need fewer VMs for the scale set to be balanced. With "strict zone balance", the scale set fails any attempts to scale in or out if doing so would cause unbalance.

To use best-effort zone balance, set *zoneBalance* to *false*. This setting is the default in API version *2017-12-01*. To use strict zone balance, set *zoneBalance* to *true*.

>[!NOTE]
> The `zoneBalance` property can only be set if the zones property of the scale set contains more than one zone. If there are no zones or only one zone specified, then zoneBalance property should not be set.

## Single-zone and zone-redundant scale sets

When you deploy a Virtual Machine Scale Set, you can choose to use a single Availability Zone in a region, or multiple zones.

When you create a scale set in a single zone, you control which zone all those VM instances run in, and the scale set is managed and autoscales only within that zone. A zone-redundant scale set lets you create a single scale set that spans multiple zones. As VM instances are created, by default they are evenly balanced across zones. Should an interruption occur in one of the zones, a scale set does not automatically scale out to increase capacity. A best practice would be to configure autoscale rules based on CPU or memory usage. The autoscale rules would allow the scale set to respond to a loss of the VM instances in that one zone by scaling out new instances in the remaining operational zones.

To use Availability Zones, your scale set must be created in a [supported Azure region](../availability-zones/az-region.md). You can create a scale set that uses Availability Zones with one of the following methods:

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

### Single-zone scale set

The following example creates a single-zone scale set named *myScaleSet* in zone *1*:

```azurecli
az vmss create \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --image <SKU image> \
    --upgrade-policy-mode automatic \
    --admin-username azureuser \
    --generate-ssh-keys \
    --zones 1
```

For a complete example of a single-zone scale set and network resources, see [this sample CLI script](scripts/cli-sample-single-availability-zone-scale-set.md#sample-script)

### Zone-redundant scale set

To create a zone-redundant scale set, you use a *Standard* SKU public IP address and load balancer. For enhanced redundancy, the *Standard* SKU creates zone-redundant network resources. For more information, see [Azure Load Balancer Standard overview](../load-balancer/load-balancer-overview.md) and [Standard Load Balancer and Availability Zones](../load-balancer/load-balancer-standard-availability-zones.md).

To create a zone-redundant scale set, specify multiple zones with the `--zones` parameter. The following example creates a zone-redundant scale set named *myScaleSet* across zones *1,2,3*:

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

To use Availability Zones, you must create your scale set in a supported Azure region. Add the `-Zone` parameter to the [New-AzVmssConfig](/powershell/module/az.compute/new-azvmssconfig) command and specify which zone to use (such as zone *1*, *2*, or *3*).

### Single-zone scale set

The following example creates a single-zone scale set named *myScaleSet* in *East US 2* zone *1*. The Azure network resources for virtual network, public IP address, and load balancer are automatically created. When prompted, provide your own desired administrative credentials for the VM instances in the scale set:

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
  -Zone "1"
```

### Zone-redundant scale set

To create a zone-redundant scale set, specify multiple zones with the `-Zone` parameter. The following example creates a zone-redundant scale set named *myScaleSet* across *East US 2* zones *1, 2, 3*. The zone-redundant Azure network resources for virtual network, public IP address, and load balancer are automatically created. When prompted, provide your own desired administrative credentials for the VM instances in the scale set:

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

The process to create a scale set that uses an Availability Zone is the same as detailed in the getting started article for [Linux](quick-create-template-linux.md) or [Windows](quick-create-template-windows.md). To use Availability Zones, you must create your scale set in a supported Azure region. Add the `zones` property to the *Microsoft.Compute/virtualMachineScaleSets* resource type in your template and specify which zone to use (such as zone *1*, *2*, or *3*).

### Single-zone scale set

The following example creates a Linux single-zone scale set named *myScaleSet* in *East US 2* zone *1*:

```json
{
  "type": "Microsoft.Compute/virtualMachineScaleSets",
  "name": "myScaleSet",
  "location": "East US 2",
  "apiVersion": "2017-12-01",
  "zones": ["1"],
  "sku": {
    "name": "Standard_A1",
    "capacity": "2"
  },
  "properties": {
    "upgradePolicy": {
      "mode": "Automatic"
    },
    "virtualMachineProfile": {
      "storageProfile": {
        "osDisk": {
          "caching": "ReadWrite",
          "createOption": "FromImage"
        },
        "imageReference":  {
          "publisher": "myPublisher",
          "offer": "myOffer",
          "sku": "mySKU",
          "version": "latest"
        }
      },
      "osProfile": {
        "computerNamePrefix": "myvmss",
        "adminUsername": "azureuser",
        "adminPassword": "P@ssw0rd!"
      }
    }
  }
}
```

For a complete example of a single-zone scale set and network resources, see [this sample Resource Manager template](https://github.com/Azure/vm-scale-sets/blob/master/z_deprecated/preview/zones/singlezone.json)

### Zone-redundant scale set

To create a zone-redundant scale set, specify multiple values in the `zones` property for the *Microsoft.Compute/virtualMachineScaleSets* resource type. The following example creates a zone-redundant scale set named *myScaleSet* across *East US 2* zones *1,2,3*:

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

If you create a public IP address or a load balancer, specify the *"sku": { "name": "Standard" }"* property to create zone-redundant network resources. You also need to create a Network Security Group and rules to permit any traffic. For more information, see [Azure Load Balancer Standard overview](../load-balancer/load-balancer-overview.md) and [Standard Load Balancer and Availability Zones](../load-balancer/load-balancer-standard-availability-zones.md).

For a complete example of a zone-redundant scale set and network resources, see [this sample Resource Manager template](https://github.com/Azure/vm-scale-sets/blob/master/z_deprecated/preview/zones/multizone.json)

## Update scale set to add availability zones

You can modify a scale to expand the set of zones over which to spread VM instances. This allows you to take advantage of higher zonal availability SLA (99.99%) vs regional availability SLA (99.95%), or expand your scale set to take advantage of new availability zones that were not available when the scale set was created.

> [!IMPORTANT]
> Update virtual machine scale sets to add availability zones is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA).

This feature can be used with API version 2023-03-01 or greater.

### Enable your subscription to use zonal expansion feature

You must register for four feature flags on your subscription:

### [Azure CLI](#tab/cli)

```azurecli
az feature register --namespace Microsoft.Compute --name VmssAllowRegionalToZonalMigration
az feature register --namespace Microsoft.Compute --name VmssAllowExpansionOfAvailabilityZones
az feature register --namespace Microsoft.Compute --name EnableVmssFlexExpansionOfAvailabilityZones
az feature register --namespace Microsoft.Compute --name EnableVmssFlexRegionalToZonalMigration
```

You can check the registration status of each feature by using:

```azurecli
az feature show --namespace Microsoft.Compute --name \<feature-name\>
```

### [Azure PowerShell](#tab/powershell)

```powershell
Register-AzProviderPreviewFeature -Name VmssAllowRegionalToZonalMigration -ProviderNamespace Microsoft.Compute
Register-AzProviderPreviewFeature -Name VmssAllowExpansionOfAvailabilityZones -ProviderNamespace Microsoft.Compute
Register-AzProviderPreviewFeature -Name EnableVmssFlexExpansionOfAvailabilityZones -ProviderNamespace Microsoft.Compute
Register-AzProviderPreviewFeature -Name EnableVmssFlexRegionalToZonalMigration -ProviderNamespace Microsoft.Compute
```

You can check the registration status of each feature by using:

```powershell
Get-AzProviderPreviewFeature -Name <feature-name> -ProviderNamespace Microsoft.Compute
```

### Expand scale set to use availability zones
You can update the scale set to scale out instances to one or more additional availability zones, up to the number of availablity zones supported by the region (for regions that support zones, the minimum number of zones is 3). 

> [!IMPORTANT]
> When you expand the scale set to additionnal zones, the original instances are not migrated or changed. When you scale out, new instances will be created and spread evenly across the selected availability zones. When you scale in the scale set, any regional instances will be priorized for removal first. After that, instances will be removed based on the [scale in policy](virtual-machine-scale-sets-scale-in-policy.md). 

### Expand scale set to use availability zones

You can update the scale set to scale out instances to one or more additional availability zones, up to the number of availablity zones supported by the region (for regions that support zones, the minimum number of zones is 3). 

Expanding to a zonal scale set is done in 3 steps:

1. Prepare for zonal expansion
2. Update zones parameter on the scale set
3. Add new zonal instances and remove original instances

#### Prepare for zonal expansion

> [!WARNING]
>This preview allows you to add zones to the scale set. You cannot remove zones once they have been added, or go back to a regional scale set.

In order to prepare for zonal expansion:
* Ensure that you have enough quota for the VM size in the selected region to handle additional instances. Learn more about [checking and requesting additional quota if needed.](../virtual-machines/quotas.md)
* Ensure that the VM size and disk types you are using are available in all the desired zones. You can use the [Compute Resources SKUs API](/rest/api/compute/resource-skus/list?tabs=HTTP) to determine which sizes are available in which zones. 

#### Update the zones parameter on the scale set

Update the scale set to change the zones parameter.

### [Azure Portal](#tab/portal)

1. Navigate to the scale set you want to update
1. On the Properties tab of the scale set landing page, find the Availability zone property and press **Edit**
1. On the Edit Location dialog box which appears, select the desired zone(s)
1. Select **Apply**.

### [Azure CLI](#tab/cli2)

```azurecli
az vmss update --set zones=["1","2","3"] -n *myscaleset* -g *myResourceGroup*
```

### [Azure PowerShell](#tab/powershell2)

```azurepowershell
# Get the VMSS object
$vmss = Get-AzVmss -ResourceGroupName *resource-group-name* -VMScaleSetName *vmss-name*

# Update the zones parameter
$vmss.Zones = @("1", "2", "3")

# Apply the changes
Update-AzVmss -ResourceGroupName *resource-group-name* -VMScaleSetName *vmss-name* -VirtualMachineScaleSet $vmss
```

### [REST API](#tab/template2)

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



## Next steps

Now that you have created a scale set in an Availability Zone, you can learn how to [Deploy applications on Virtual Machine Scale Sets](tutorial-install-apps-cli.md) or [Use autoscale with Virtual Machine Scale Sets](tutorial-autoscale-cli.md).

