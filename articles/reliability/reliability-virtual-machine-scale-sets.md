---
title: Reliability in Azure Virtual Machine Scale Sets
description: Learn about reliability in Azure Virtual Machine Scale Sets. 
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-virtual-machine-scale-sets
ms.date: 10/31/2024
---

# Reliability in Virtual Machine Scale Sets

This article contains information on [availability zones support](#availability-zone-support) for Virtual Machine Scale Sets.  

>[!NOTE]
>Virtual Machine Scale Sets can only be deployed into one region. If you want to deploy VMs across multiple regions, see [Virtual Machines-Disaster recovery: cross-region failover](./reliability-virtual-machines.md#cross-region-disaster-recovery-and-business-continuity).


## Availability zone support

[!INCLUDE [Availability zone description](./includes/reliability-availability-zone-description-include.md)]

With [Azure Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/flexible-virtual-machine-scale-sets), you can create and manage a group of load balanced VMs. The number of VMs can automatically increase or decrease in response to demand or a defined schedule. Scale sets provide high availability to your applications, and allow you to centrally manage, configure, and update many VMs. There's no cost for the scale set itself. You only pay for each VM instance that you create.

Virtual Machine Scale Sets supports both zonal and zone-redundant deployments within a region:

- **Zonal deployment.** When you create a scale set in a single zone, you control which zone all the VMs of that set run in. The scale set is managed and autoscales only within that zone.

- **Zone-redundant deployment.**  A zone-redundant scale set lets you create a single scale set that spans multiple zones. By default, as VMs are created, they're evenly balanced across zones.


### Prerequisites

1. To use availability zones, your scale set must be created in a [supported Azure region](./availability-zones-region-support.md).

1. All VMs - even single instance VMs - should be deployed into a scale set using [flexible orchestration](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes#scale-sets-with-flexible-orchestration) mode to future-proof your application for scaling and availability. 


### SLA

Because availability zones are physically separate and provide distinct power sources, network, and cooling - service-level agreements (SLAs) are increased. For more information, see the [SLA for Microsoft Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

#### Create a Virtual Machine Scale Set with availability zones enabled

You can create a scale set that uses availability zones with one of the following methods:


# [Azure portal](#tab/portal)

The process to create a scale set that uses a zonal deployment is the same as detailed in the [getting started article](/azure/virtual-machine-scale-sets/flexible-virtual-machine-scale-sets-portal). When you select a supported Azure region, you can create a scale set in one or more available zones, as shown in the following example:

![Create a scale set in a single availability zone](/azure/virtual-machine-scale-sets/media/virtual-machine-scale-sets-use-availability-zones/vmss-az-portal.png)

The scale set and supporting resources, such as the Azure load balancer and public IP address, are created in the single zone that you specify.

# [Azure CLI](#tab/cli)


### Zonal scale set

The following example creates a single-zone scale set named *myScaleSet* in zone *1*:

```azurecli

az vmss create \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --orchestration-mode flexible \
    --image <SKU Image> \
    --upgrade-policy-mode automatic \
    --admin-username azureuser \
    --generate-ssh-keys \
    --zones 1
```

For a complete example of a single-zone scale set and network resources, see [our sample CLI script](/azure/virtual-machine-scale-sets/scripts/cli-sample-single-availability-zone-scale-set#sample-script)

### Zone-redundant scale set

To create a zone-redundant scale set, you use a *Standard* SKU public IP address and load balancer. For enhanced redundancy, the *Standard* SKU creates zone-redundant network resources. For more information, see [Azure Load Balancer Standard overview](../load-balancer/load-balancer-overview.md) and [Standard Load Balancer and Availability Zones](../load-balancer/load-balancer-standard-availability-zones.md).

To create a zone-redundant scale set, specify multiple zones with the `--zones` parameter. The following example creates a zone-redundant scale set named *myScaleSet* across zones *1,2,3*:

```azurecli
az vmss create \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --orchestration-mode flexible \
    --image <SKU Image> \
    --upgrade-policy-mode automatic \
    --admin-username azureuser \
    --generate-ssh-keys \
    --zones 1 2 3
```


It may take a few minutes to create and configure all the scale set resources and VMs in the zone(s) that you specify. For a complete example of a zone-redundant scale set and network resources, see [our sample CLI script](/azure/virtual-machine-scale-sets/scripts/cli-sample-zone-redundant-scale-set#sample-script).

# [Azure PowerShell](#tab/powershell)


### Zonal scale set

The following example creates a single-zone scale set named *myScaleSet* in *East US 2* zone *1*. The Azure network resources for virtual network, public IP address, and load balancer are automatically created. When prompted, provide your own desired administrative credentials for the VMs in the scale set:

```powershell
New-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -Location "EastUS2" `
  -OrchestrationMode "flexible" ``
  -VMScaleSetName "myScaleSet" `
  -OrchestrationMode "Flexible" `
  -VirtualNetworkName "myVnet" `
  -SubnetName "mySubnet" `
  -PublicIpAddressName "myPublicIPAddress" `
  -LoadBalancerName "myLoadBalancer" `
  -UpgradePolicy "Automatic" `
  -Zone "1"
```

### Zone-redundant scale set

To create a zone-redundant scale set, specify multiple zones with the `-Zone` parameter. The following example creates a zone-redundant scale set named *myScaleSet* across *East US 2* zones *1, 2, 3*. The zone-redundant Azure network resources for virtual network, public IP address, and load balancer are automatically created. When prompted, provide your own desired administrative credentials for the VMs in the scale set:

```powershell
New-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -Location "EastUS2" `
  -OrchestrationMode "Flexible" ``
  -VMScaleSetName "myScaleSet" `
  -VirtualNetworkName "myVnet" `
  -SubnetName "mySubnet" `
  -PublicIpAddressName "myPublicIPAddress" `
  -LoadBalancerName "myLoadBalancer" `
  -UpgradePolicy "Automatic" `
  -Zone "1", "2", "3"
```

# [Azure Resource Manager templates](#tab/resource)

The process to create a scale set that uses an availability zone is the same as detailed in the getting started article for [Linux](/azure/virtual-machine-scale-sets/quick-create-template-linux) or [Windows](/azure/virtual-machine-scale-sets/quick-create-template-windows). To use availability zones, you must create your scale set in a supported Azure region. Add the `zones` property to the *Microsoft.Compute/virtualMachineScaleSets* resource type in your template and specify which zone to use (such as zone *1*, *2*, or *3*).


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


----

### Zonal failover support

Virtual Machine Scale Sets are created with five fault domains by default in Azure regions with no zones. For the regions that support availability zone deployment of Virtual Machine Scale Sets and this option is selected, the default value of the fault domain count is 1 for each of the zones. In this case, *FD=1* implies that the VM instances belonging to the scale set are spread across many racks on a best effort basis. For more information, see [Choosing the right number of fault domains for Virtual Machine Scale Set](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-manage-fault-domains).

### Low-latency design

It's recommended that you configure Virtual Machine Scale Sets with zone-redundancy. However, if your application has strict low latency requirements, you may need to implement a zonal for your scale sets VMs. With a zonal scale sets deployment, it's recommended that you create multiple scale set VMs across more than one zone. For example, you can create one scale sets instance that's pinned to zone 1 and one instance pinned to zone 2 or 3. You also need to use a load balancer or other application logic to direct traffic to the appropriate scale sets during a zone outage.

>[!Important]
>If you opt out of zone-aware deployment, you forego protection from isolation of underlying faults. Opting out from availability zone configuration forces reliance on resources that don't obey zone placement and separation (including underlying dependencies of these resources). These resources shouldn't be expected to survive zone-down scenarios. Solutions that leverage such resources should define a disaster recovery strategy and configure a recovery of the solution in another region.

### Safe deployment techniques

To have more control over where you deploy your VMs, you should deploy zonal, instead of regional, scale set VMs. However, zonal VMs only provide zone isolation and not zone redundancy. To achieve full zone-redundancy with zonal VMs, there should be two or more VMs across different zones.

It's also recommended that you use the max spreading deployment option for your zone-redundant VMs. For more information, see the [spreading options](#spreading-options).


#### Spreading options

When you deploy a scale set into one or more availability zones, you have the following spreading options (as of API version *2017-12-01*):

- **Max spreading (platformFaultDomainCount = 1)**. Max spreading is the recommended deployment option, as it provides the best spreading in most cases. If you spread replicas across distinct hardware isolation units, it's recommended that you spread across availability zones and utilize max spreading within each zone.
    
  With max spreading, the scale set spreads your VMs across as many fault domains as possible within each zone. This spreading could be across greater or fewer than five fault domains per zone. 
  
  > [!NOTE]
  > With max spreading, regardless of how many fault domains the VMs are spread across, you can only see one fault domain in both the scale set VM instance view and the instance metadata. The spreading within each zone is implicit.

- **Static fixed spreading (platformFaultDomainCount = 5)**. With static fixed spreading, the scale set spreads your VMs exactly across five fault domains per zone. If the scale set can't find five distinct fault domains per zone to satisfy the allocation request, the request fails.

- **Spreading aligned with managed disks fault domains (platformFaultDomainCount = 2 or 3)** You can consider aligning the number of scale set fault domains with the number of managed disks fault domains. This alignment can help prevent loss of quorum if an entire managed disks fault domain goes down. The fault domain count can be set to less than or equal to the number of managed disks fault domains available in each of the regions. To learn about the number of Managed Disks fault domains by region, see [insert doc here](link here).

#### Zone balancing

For scale sets deployed across multiple zones (zone-redundant), you can choose either *best effort zone balance* or *strict zone balance*. A scale set is considered "balanced" if each zone has the same number of VMs (plus or minus one VM) as all other zones in the scale set. For example:

| Scale Set | VMs in Zone 1 | VMs in Zone 2 | VMs in Zone 3 | Zone Balancing | 
| ---------- | ---------------- | ---------------- | ---------------- | ----------------- | 
| Balanced scale set | 2 | 3 | 3 | This scale set is considered balanced. There's only one zone with a different VM count and it's only 1 less than the other zones. | 
| Unbalanced scale set | 1 | 3 | 3 | This scale set is considered unbalanced. Zone 1 has 2 fewer VMs than zones 2 and 3. |

It's possible that VMs in the scale set are successfully created, but extensions on those VMs fail to deploy. The VMs with extension failures are still counted when determining if a scale set is balanced. For instance, a scale set with *3 VMs* in **zone 1**, *3 VMs* in **zone 2**, and *3 VMs* in **zone 3** is considered balanced even if all extensions failed in zone 1 and all extensions succeeded in zones 2 and 3.

With best-effort zone balance, the scale set attempts to scale in and out while maintaining balance. However, if for some reason the balancing isn't possible (for example, if one zone goes down, the scale set can't create a new VM in that zone), the scale set allows temporary imbalance to successfully scale in or out. On subsequent scale-out attempts, the scale set adds VMs to zones that need more VMs for the scale set to be balanced. Similarly, on subsequent scale in attempts, the scale set removes VMs from zones that need fewer VMs for the scale set to be balanced. With "strict zone balance", the scale set fails any attempts to scale in or out if doing so would cause unbalance.

To use best-effort zone balance, set `zoneBalance` to *false*. The `zoneBalance` setting is the default in API version *2017-12-01*. To use strict zone balance, set `zoneBalance` to *true*.


### Migrate to availability zone support

To learn how to redeploy a regional scale set to availability zone support, see [Migrate Virtual Machines and Virtual Machine Scale Sets to availability zone support](./migrate-vm.md).


## Additional guidance


### Placement groups

> [!IMPORTANT]
> Placement groups only apply to Virtual Machine Scale Sets running in Uniform orchestration mode.

When you deploy a Virtual Machine Scale Set, you have the option to deploy with a single or multiple [placement groups](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-placement-groups) per availability zone. For regional scale sets, the choice is to have a single placement group in the region or to have multiple placement groups in the region. If the scale set property `singlePlacementGroup` is set to *false*, the scale set can be composed of multiple placement groups and has a range of 0-1000 VMs. When set to the default value of *true*, the scale set is composed of a single placement group and has a range of 0-100 VMs. For most workloads, we recommend multiple placement groups, which allows for greater scale. In API version *2017-12-01*, scale sets default to multiple placement groups for single-zone and cross-zone scale sets, but they default to single placement group for regional  scale sets.

## Next steps
> [!div class="nextstepaction"]
> [Reliability in Azure](/azure/reliability/availability-zones-overview)

> [!div class="nextstepaction"]
> [Deploy applications on Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/tutorial-install-apps-cli) 

> [!div class="nextstepaction"]
> [Use autoscale with Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/tutorial-autoscale-cli).
