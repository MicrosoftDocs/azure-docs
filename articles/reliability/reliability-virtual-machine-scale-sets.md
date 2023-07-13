---
title: Reliability in Azure Virtual Machine Scale Sets
description: Find out about reliability in Azure Virtual Machine Scale Sets
author: anaharris-ms
ms.author: anaharris
ms.topic: overview
ms.custom: subject-reliability
ms.service: virtual-machine-scale-sets
ms.date: 06/12/2023
---

# Reliability in Virtual Machine Scale Sets

This article contains [specific reliability recommendations for Virtual Machine Scale Sets](#reliability-recommendations), as well as detailed information on VMSS regional resiliency with [availability zones](#availability-zone-support) and [cross-region resiliency with disaster recovery](#disaster-recovery-cross-region-failover). 

For an architectural overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).


## Reliability recommendations

[!INCLUDE [Reliability recommendations](includes/reliability-recommendations-include.md)]

### Reliability recommendations summary

| Category | Priority |Recommendation |  
|---------------|--------|---|
| [**Scalability**](#scalability) |:::image type="icon" source="../reliability/media/icon-recommendation-medium.svg":::| [VMSS-1: Deploy using Flexible scale set instead of simple Virtual Machines](#-vmss-1-deploy-vms-with-flexible-orchestration-mode) |
| |:::image type="icon" source="../reliability/media/icon-recommendation-high.svg":::| [VMSS-5: VMSS Autoscale is set to Manual scale](#-vmss-5-use-autoscale-based-on-custom-metrics-and-schedules) |
| |:::image type="icon" source="../reliability/media/icon-recommendation-low.svg":::| [VMSS-6: VMSS Custom scale-in policies is not set to default](#-vmss-6-set-the-vmss-custom-scale-in-to-the-default-policy) |
| [**High Availability**](#high-availability) |:::image type="icon" source="../reliability/media/icon-recommendation-high.svg":::| [VMSS-4: Automatic repair policy is not enabled](#-vmss-4-enable-automatic-repair-policy) |
| [**Disaster Recovery**](#disaster-recovery) |:::image type="icon" source="../reliability/media/icon-recommendation-low.svg":::| [VMSS-2: Protection Policy is disabled for all VMSS instances](#-vmss-2-use-vmss-protection-policy-to-treat-specific-vm-instances-differently) |
| [**Monitoring**](#monitoring) |:::image type="icon" source="../reliability/media/icon-recommendation-medium.svg":::| [VMSS-3: VMSS Application health monitoring is not enabled](#-vmss-3-enable-vmss-application-health-monitoring) |


### Scalability

#### :::image type="icon" source="../reliability/media/icon-recommendation-medium.svg"::: **VMSS-1: Deploy VMs with flexible orchestration mode** 

All VMs -even single instance VMs - should be deployed into a scale set using [flexible orchestration](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md#scale-sets-with-flexible-orchestration.md) mode to future-proof your application for scaling and availability. Flexible orchestration offers high availability guarantees (up to 1000 VMs) by spreading VMs across fault domains in a region or within an availability zone.

For more information on when to use scale sets instead of VMs, see [When to use scale sets instead of virtual machines?](../virtual-machine-scale-sets/virtual-machine-scale-sets-design-overview.md#when-to-use-scale-sets-instead-of-virtual-machines)

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machine-scale-sets/code/vmss-1/vmss-1.kql":::

----

#### :::image type="icon" source="../reliability/media/icon-recommendation-high.svg"::: **VMSS-5: Use autoscale based on custom metrics and schedules.** 

[Autoscale is a built-in feature of Azure Monitor](../azure-monitor/autoscale/autoscale-overview.md) that helps the performance and cost-effectiveness of your resources by adding and removing instances based on demand. In addition, you can choose to scale your resources manually to a specific instance count or in accordance with metric(s) thresholds. You can also schedule instance counts that scale during designated time windows.

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machine-scale-sets/code/vmss-5/vmss-5.kql":::

----


#### :::image type="icon" source="../reliability/media/icon-recommendation-low.svg"::: **VMSS-6: Set the VMSS Custom scale-in to the default policy** 

>[!IMPORTANT]
>Flexible orchestration for Virtual Machine Scale Sets does not currently support scale-in policy.

The [VMSS custom scale-in policy feature](../virtual-machine-scale-sets/virtual-machine-scale-sets-scale-in-policy.md) gives you a way to configure the order in which virtual machines are scaled-in. There are three scale in policy configurations:

- [Default](../virtual-machine-scale-sets/virtual-machine-scale-sets-scale-in-policy.md?WT.mc_id=Portal-Microsoft_Azure_Monitoring#default-scale-in-policy)
- [NewestVM](../virtual-machine-scale-sets/virtual-machine-scale-sets-scale-in-policy.md?WT.mc_id=Portal-Microsoft_Azure_Monitoring#newestvm-scale-in-policy)
- [OldestVM](../virtual-machine-scale-sets/virtual-machine-scale-sets-scale-in-policy.md?WT.mc_id=Portal-Microsoft_Azure_Monitoring#oldestvm-scale-in-policy)

A Virtual Machine Scale Set deployment can be scaled-out or scaled-in based on an array of metrics, including platform and user-defined custom metrics. While a scale-out creates new virtual machines based on the scale set model, a scale-in affects running virtual machines that may have different configurations and/or functions as the scale set workload evolves.

It's not necessary that you specify a scale-in policy if you only want the default ordering to be followed, as the default custom scale-in policy provides the best algorithm and flexibility for the majority of the scenarios. The default ordering is as follows:

1. Balance virtual machines across availability zones (if the scale set is deployed with availability zone support).
1. Balance virtual machines across fault domains (best effort).
1. Delete virtual machine with the highest instance ID.

Only use the *Newest* and *Oldest* policies when your workload requires that the oldest or newest VMs should be deleted after balancing across availability zones.

>[!NOTE]
>Balancing across availability zones or fault domains doesn't move instances across availability zones or fault domains. The balancing is achieved through the deletion of virtual machines from the unbalanced availability zones or fault domains until the distribution of virtual machines becomes balanced.


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machine-scale-sets/code/vmss-6/vmss-6.kql":::

----

### High availability

#### :::image type="icon" source="../reliability/media/icon-recommendation-high.svg"::: **VMSS-4: Enable automatic repair policy** 

To achieve high availability for applications, [enable automatic instance repairs](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-instance-repairs.md#requirements-for-using-automatic-instance-repairs) to maintain a set of healthy instances. When the Application Health extension or Load Balancer health probes find that an instance is unhealthy, automatic instance repairs deletes the unhealthy instance and creates a new one to replace it.

A grace period can be set using the property `automaticRepairsPolicy.gracePeriod`. The grace period, specified in minutes and in ISO 8601 format, can range between 10 to 90 minutes, and has a default value of 30 minutes.

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machine-scale-sets/code/vmss-4/vmss-4.kql":::

----

### Disaster recovery

#### :::image type="icon" source="../reliability/media/icon-recommendation-low.svg"::: **VMSS-2: Use VMSS Protection Policy to treat specific VM instances differently** 

Use [VMSS Protection Policy](../-machine-scale-sets/virtual-machine-scale-sets-instance-protection.md) if you want specific instances to be treated differently from the rest of the scale set instance.

As your application processes traffic, there can be situations where you want specific instances to be treated differently from the rest of the scale set instance. For example, certain instances in the scale set could be performing long-running operations, and you don’t want these instances to be scaled-in until the operations complete. You might also have specialized a few instances in the scale set to perform different tasks than other members of the scale set. You require these special VMs not to be modified with the other instances in the scale set. Instance protection provides the additional controls to enable these and other scenarios for your application.

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machine-scale-sets/code/vmss-2/vmss-2.kql":::

----
### Monitoring

#### :::image type="icon" source="../reliability/media/icon-recommendation-medium.svg"::: **VMSS-3: Enable VMSS Application health monitoring** 

Monitoring your application health is an important signal for managing and upgrading your deployment. Azure Virtual Machine Scale Sets provide support for rolling upgrades, including Automatic OS-Image Upgrades and Automatic VM Guest Patching, which rely on health monitoring of the individual instances to upgrade your deployment. You can also use [Application Health Extension](../virtual-machine-scale-sets/virtual-machine-scale-sets-health-extension.md) to monitor the application health of each instance in your scale set and perform instance repairs using Automatic Instance Repairs.


# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/compute/virtual-machine-scale-sets/code/vm-3/vm-3.kql":::

----

## Availability zone support

[!INCLUDE [next step](includes/reliability-availability-zone-description-include.md)]

With [Azure virtual machine scale sets](flexible-virtual-machine-scale-sets.md) you can create and manage a group of load balanced VMs. The number of VM instances can automatically increase or decrease in response to demand or a defined schedule. Scale sets provide high availability to your applications, and allow you to centrally manage, configure, and update many VMs. There's no cost for the scale set itself. You only pay for each VM instance that you create.

Virtual machine scale sets supports both zonal and zone-redundant deployments within a region:

- **Zonal deployment.** When you create a scale set in a single zone, you control which zone all the VM instances of that set run in. The scale set is managed and autoscales only within that zone. 
- **Zone redundant deployment.**  A zone-redundant scale set lets you create a single scale set that spans multiple zones. By default, as VM instances are created, they are evenly balanced across zones.


### Prerequisites

1. To use availability zones, your scale set must be created in a [supported Azure region](./availability-zones-service-support.md).

1. Make sure you use the correct orchestration mode.  
    - [Flexible orchestration](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md#scale-sets-with-flexible-orchestration.md) supports both zonal and zone redundancy.

    - [Uniform orchestration](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md#scale-sets-with-uniform-orchestration) only supports zone redundancy across availability zoness.

1. When you deploy a regional (non-zonal) scale set into one or more zones as of API version 2017-12-01, you have the following availability options: 


### SLA improvements

Because availability zones are physically separate and provide distinct power source, network, and cooling, SLAs (Service-level agreements) increase. For more information, see the [SLA for Microsoft Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

#### Create a machine scale set with availability zones enabled

You can create a scale set that uses availability zones with one of the following methods:


# [Azure portal](#tab/portal)

The process to create a scale set that uses a zonal deployment is the same as detailed in the [getting started article](quick-create-portal.md). When you select a supported Azure region, you can create a scale set in one or more available zones, as shown in the following example:

![Create a scale set in a single availability zone](media/virtual-machine-scale-sets-use-availability-zones/vmss-az-portal.png)

The scale set and supporting resources, such as the Azure load balancer and public IP address, are created in the single zone that you specify.

# [Azure CLI](#tab/cli)


### Zonal scale set

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

# [Azure PowerShell](#tab/powershell)


### Zonal scale set

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

# [Azure Resource Manager templates](#tab/resource)

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


----

### Zonal failover support

### Fault tolerance

### Zone down experience

If your VMSS has been deployed in a zone redundant configuration, across multiple availability zones, VMSS will automatically failover to another availability zone in the case of a zone outage. 

#### Zone outage preparation and recovery

You can set up your VMSS to failover to another zone using the Site Recovery service. For more information, see [Site Recovery](../site-recovery/site-recovery-overview.md).

### Low-latency design

Zonal deployment is recommended when super low latency is required, and can be achieved by using VMSS Flex and PPGs for resources alignment. You can combine VMs with other services such as zonal load balancer, IP, NAT Gateway, and especially those services that are running on physical HW/Azure Large Instances (AVS, SAP, Epic, Oracle).

### Safe deployment techniques

#### Spreading options

When you deploy a regional (non-zonal) scale set into one or more zones as of API version *2017-12-01*, you have the following availability options:

- Max spreading (platformFaultDomainCount = 1)
- Static fixed spreading (platformFaultDomainCount = 5)
- Spreading aligned with storage disk fault domains (platformFaultDomainCount = 2 or 3)

With max spreading, the scale set spreads your VMs across as many fault domains as possible within each zone. This spreading could be across greater or fewer than five fault domains per zone. With static fixed spreading, the scale set spreads your VMs across exactly five fault domains per zone. If the scale set cannot find five distinct fault domains per zone to satisfy the allocation request, the request fails.

#### Zone balancing

For scale sets deployed across multiple zones, you also have the option of choosing "best effort zone balance" or "strict zone balance". A scale set is considered "balanced" if each zone has the same number of VMs +\\- 1 VM as all other zones for the scale set. For example:

- A scale set with 2 VMs in zone 1, 3 VMs in zone 2, and 3 VMs in zone 3 is considered balanced. There is only one zone with a different VM count and it is only 1 less than the other zones.
- A scale set with 1 VM in zone 1, 3 VMs in zone 2, and 3 VMs in zone 3 is considered unbalanced. Zone 1 has 2 fewer VMs than zones 2 and 3.

It's possible that VMs in the scale set are successfully created, but extensions on those VMs fail to deploy. These VMs with extension failures are still counted when determining if a scale set is balanced. For instance, a scale set with 3 VMs in zone 1, 3 VMs in zone 2, and 3 VMs in zone 3 is considered balanced even if all extensions failed in zone 1 and all extensions succeeded in zones 2 and 3.

With best-effort zone balance, the scale set attempts to scale in and out while maintaining balance. However, if for some reason this is not possible (for example, if one zone goes down, the scale set cannot create a new VM in that zone), the scale set allows temporary imbalance to successfully scale in or out. On subsequent scale-out attempts, the scale set adds VMs to zones that need more VMs for the scale set to be balanced. Similarly, on subsequent scale in attempts, the scale set removes VMs from zones that need fewer VMs for the scale set to be balanced. With "strict zone balance", the scale set fails any attempts to scale in or out if doing so would cause unbalance.

To use best-effort zone balance, set *zoneBalance* to *false*. This setting is the default in API version *2017-12-01*. To use strict zone balance, set *zoneBalance* to *true*.


>[!NOTE]
> The `zoneBalance` property can only be set if the zones property of the scale set contains more than one zone. If there are no zones or only one zone specified, then zoneBalance property should not be set.


**We recommend deploying with max spreading for most workloads**, as this approach provides the best spreading in most cases. If you need replicas to be spread across distinct hardware isolation units, we recommend spreading across Availability Zones and utilize max spreading within each zone.

> [!NOTE]
> With max spreading, you only see one fault domain in the scale set VM instance view and in the instance metadata regardless of how many fault domains the VMs are spread across. The spreading within each zone is implicit.


### Availability zone redeployment and migration

## Disaster recovery: cross-region failover

### Cross-region disaster recovery in multi-region geography

#### Outage detection, notification, and management
#### Set up disaster recovery and outage detection 

### Single-region geography disaster recovery

### Capacity and proactive disaster recovery resiliency

## Additional guidance

### Placement groups

> [!IMPORTANT]
> Placement groups only apply to Virtual Machine Scale Sets running in Uniform orchestration mode.

When you deploy a scale set, you also have the option to deploy with a single [placement group](../virtual-machine-scale-sets-placement-groups.md) per availability zone, or with multiple per zone. For regional (non-zonal) scale sets, the choice is to have a single placement group in the region or to have multiple in the region. If the scale set property called `singlePlacementGroup` is set to false, the scale set can be composed of multiple placement groups and has a range of 0-1,000 VMs. When set to the default value of true, the scale set is composed of a single placement group, and has a range of 0-100 VMs. For most workloads, we recommend multiple placement groups, which allows for greater scale. In API version *2017-12-01*, scale sets default to multiple placement groups for single-zone and cross-zone scale sets, but they default to single placement group for regional (non-zonal) scale sets.

## Next steps
> [!div class="nextstepaction"]
> [Reliability in Azure](/azure/reliability/availability-zones-overview)

> [!div class="nextstepaction"]
> [Deploy applications on Virtual Machine Scale Sets](tutorial-install-apps-cli.md) 

> [!div class="nextstepaction"]
> [Use autoscale with Virtual Machine Scale Sets](tutorial-autoscale-cli.md).