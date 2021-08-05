---
title: Associate a virtual machine scale set to a Capacity Reservation Group (preview)
description: Learn how to associate a new or existing virtual machine scale set to a Capacity Reservation group.
author: vargupt
ms.author: vargupt
ms.service: virtual-machines #Required
ms.topic: how-to
ms.date: 07/30/2021
ms.reviewer: cynthn, jushiman
ms.custom: template-how-to
---

# Associate a virtual machine scale set to a Capacity Reservation Group (preview)

Virtual Machine Scale Sets have two modes: 

1. **Uniform Orchestration Mode:** In this mode, virtual machine scale sets use a VM profile or a template to scale up to the desired capacity. While there's some ability to manage or customize individual VM instances, Uniform uses identical VM instances. These instances are exposed through the virtual machine scale sets VM APIs and aren't compatible with the standard Azure IaaS VM API commands. Since the scale set performs all the actual VM operations, reservations are associated with the virtual machine scale set directly. Once the scale set is associated with the reservation, all the subsequent VM allocations will be done against the reservation. 
1. **Flexible Orchestration Mode:** In this mode, you get more flexibility managing the individual virtual machine scale set VM instances as they can use the standard Azure IaaS VM APIs instead of using the scale set interface. This mode won't work with Capacity Reservation during public preview.

To learn more about these modes, go to [Virtual Machine Scale Sets Orchestration Modes](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md). The rest of this article will cover how to associate a Uniform virtual machine scale set to a Capacity Reservation Group. 

> [!IMPORTANT]
> Capacity Reservation is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Limitations of scale sets in Uniform Orchestration 

- For Virtual Machine Scale Sets in Uniform orchestration to be compatible with Capacity Reservation, the `singlePlacementGroup` property must be set to *False*. 
- The **Static Fixed Spreading** availability option for multi-zone Uniform scale sets is not supported with Capacity Reservation. This option requires use of 5 Fault Domains while the reservations only support up to 3 Fault Domains for general purpose sizes. The recommended approach is to use the **Max Spreading** option that spreads VMs across as many FDs as possible within each zone. If needed, configure a custom Fault Domain configuration of 3 or less. 

There are some other restrictions while using Capacity Reservation. For the complete list, refer the [Capacity Reservations overview](capacity-reservation-overview.md).  


## Associate a new virtual machine scale set to a Capacity Reservation Group

To associate a new Uniform virtual machine scale set to a Capacity Reservation Group, construct the following PUT request to the *Microsoft.Compute* provider:

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMScaleSetName}?api-version=2021-04-01
```

Add the `capacityReservationGroup` property in the `virtualMachineProfile` as shown below: 

```json
{ 
    "name": "<VMScaleSetName>", 
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMScaleSetName}", 
    "type": "Microsoft.Compute/virtualMachineScaleSets", 
    "location": "eastus", 
    "sku": { 
        "name": "Standard_D2s_v3", 
        "tier": "Standard", 
        "capacity": 3 
}, 
"properties": { 
    "virtualMachineProfile": { 
        "capacityReservation": { 
            "capacityReservationGroup":{ 
                "id":”subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroup/{CapacityReservationGroupName}” 
            } 
         }, 
        "osProfile": { 
            … 
        }, 
        "storageProfile": { 
            … 
        }, 
        "networkProfile": { 
            …,
            "extensionProfile": { 
                … 
            } 
        } 
    } 
```


## Associate an existing virtual machine scale set to Capacity Reservation Group 

For Public Preview, to associate an existing Uniform scale set to a Capacity Reservation Group, it is required to first deallocate the virtual machine scale set and then do the association at the time of reallocation. This ensures all of the VMs in the scale set consume capacity reservation at the time of reallocation. 

Please refer to the steps the section above on how to associate virtual machine scale set to a Capacity Reservation Group.


## View virtual machine scale set association with Instance View 

Once the Uniform virtual machine scale set is associated with the Capacity Reservation Group, all the subsequent VM allocations will happen against the Capacity Reservation. Azure automatically finds the matching Capacity Reservation in the group and consumes a reserved slot. 

The Capacity Reservation Group *Instance View* will reflect the new scale set VMs under the `virtualMachinesAssociated` & `virtualMachinesAllocated` properties as shown below: 

```rest
GET Instance View https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}?$expand=instanceview&api-version=2021-04-01 
```

```json
{ 
    "name": "<CapacityReservationGroupName>", 
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{CapacityReservationGroupName}", 
    "type": "Microsoft.Compute/capacityReservationGroups", 
    "location": "eastus" 
}, 
    "properties": { 
        "capacityReservations": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{CapacityReservationName}" 
            } 
        ], 
        "virtualMachinesAssociated": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMScaleSetName}/virtualMachines/{VirtualMachineId}" 
            } 
        ], 
        "instanceView": { 
            "capacityReservations": [ 
                { 
                    "name": "<CapacityReservationName>", 
                    "utilizationInfo": { 
                        "virtualMachinesAllocated": [ 
                            { 
                                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMScaleSetName}/virtualMachines/{VirtualMachineId}" 
                            } 
                        ] 
                    },
                    "statuses": [ 
                        { 
                            "code": "ProvisioningState/succeeded", 
                            "level": "Info", 
                            "displayStatus": "Provisioning succeeded", 
                            "time": "2021-05-25T15:12:10.4165243+00:00" 
                        } 
                    ] 
                } 
            ] 
        } 
    } 
} 
```  

## Important notes on Upgrade Policies 

- **Automatic Upgrade** – In this mode, VMs are automatically associated with the Capacity Reservation Group without any further action from you. When the VMs are reallocated, they start consuming the reserved capacity. 
- **Rolling Upgrade** – In this mode, VMs are associated with the Capacity Reservation Group without any further action from you. They're updated in batches with an optional pause time between batches. When the VMs are reallocated, they start consuming the reserved capacity. 
- **Manual Upgrade** – In this mode, nothing happens to the VM when the virtual machine scale set is updated. You'll need to do individual updates to each VM by [upgrading them with the latest Scale Set model](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-scale-set.md).  


## Region and Availability Zones considerations 

Virtual machine scale sets can be created regionally or in one or more Availability Zones to protect them from data-center-level failure. Learn more about multi-zonal virtual machine scale sets, refer to [Virtual Machine Scale Sets that use Availability Zones](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md).  

 
>[!IMPORTANT]
> The location (Region and Availability Zones) of the virtual machine scale set and the Capacity Reservation Group must match for the association to succeed. For a regional scale set, the region must match between the scale set and the Capacity Reservation Group. For a zonal scale set, both the regions and the zones must match between the scale set and the Capacity Reservation Group. 


When a scale set is spread across multiple zones, it always attempts to deploy evenly across the included Availability Zones. Because of that even deployment, a Capacity Reservation Group should always have the same quantity of reserved VMs in each zone. As an illustration of why this is important, consider the example below.   

In this example, each zone has a different quantity reserved. Let’s say that the virtual machine scale set scales out to 75 instances. Since scale set will always attempt to deploy evenly across zones, the VM distribution should look like this: 

| Zone  | Quantity Reserved  | No. of scale set VMs in each zone  | Unused Quantity Reserved  | Overallocated   |
|---|---|---|---|---|
| 1  | 40  | 25  | 15  | 0  |
| 2  | 20  | 25  | 0  | 5  |
| 3  | 15  | 25  | 0  | 10  |

In this case, the scale set is incurring extra cost for 15 unused instances in Zone 1. The scale-out is also relying on 5 VMs in Zone 2 and 10 VMs in Zone 3 that aren't protected by Capacity Reservation. If each zone had 25 capacity instances reserved, then all 75 VMs would be protected by Capacity Reservation and the deployment wouldn't incur any extra cost for unused instances.  

Since the reservations can be [overallocated](capacity-reservation-overallocate.md), the scale set can continue to scale normally beyond the limits of the reservation. The only difference is that the VMs allocated above the quantity reserved aren't covered by Capacity Reservation SLA. To learn more, go to [Overallocating Capacity Reservation](capacity-reservation-overallocate.md).


## Next steps

> [!div class="nextstepaction"]
> [Learn how to remove a scale set association from a Capacity Reservation](capacity-reservation-remove-vm-scale-set.md)