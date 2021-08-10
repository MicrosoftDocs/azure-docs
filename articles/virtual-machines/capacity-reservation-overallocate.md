---
title: Overallocating Capacity Reservation in Azure (preview)
description: Learn how overallocation works when it comes to Capacity Reservation.
author: vargupt
ms.author: vargupt
ms.service: virtual-machines #Required
ms.topic: how-to
ms.date: 08/09/2021
ms.reviewer: cynthn, jushiman
ms.custom: template-how-to
---

# Overallocating Capacity Reservation (preview)

Azure permits association of extra VMs beyond the reserved count of a Capacity Reservation to facilitate burst and other scale out scenarios, without the overhead of managing around the limits of reserved capacity. The only difference is that the count of VMs beyond the quantity reserved does not receive the capacity availability SLA benefit. As long as Azure has available capacity that meets the virtual machine requirements, the extra allocations will succeed. 

The Instance View of a Capacity Reservation Group provides a snapshot of usage for each member Capacity Reservation. You can use the Instance View to see how overallocation works. 

This article assumes you've created a Capacity Reservation Group (`myCapacityReservationGroup`), a member Capacity Reservation (`myCapacityReservation`), and a virtual machine (*myVM1*) that is associated to the group. Go to [Create a Capacity Reservation](capacity-reservation-create.md) and [Associate a VM to a Capacity Reservation](capacity-reservation-associate-vm.md) for more details.

> [!IMPORTANT]
> Capacity Reservation is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 


## Instance View for Capacity Reservation Group 

The Instance View for a Capacity Reservation Group will look like this: 

```rest
GET 
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/myCapacityReservationGroup? $expand=instanceview&api-version=2021-07-01
```

```json
{ 
    "name": "myCapacityReservationGroup", 
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/myCapacityReservationGroup", 
    "type": "Microsoft.Compute/capacityReservationGroups", 
    "location": "eastus", 
    "properties": { 
        "capacityReservations": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/MYCAPACITYRESERVATIONGROUP/capacityReservations/MYCAPACITYRESERVATION" 
            } 
        ], 
        "virtualMachinesAssociated": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM1" 
            } 
        ], 
        "instanceView": { 
            "capacityReservations": [ 
                { 
                    "name": "myCapacityReservation", 
"utilizationInfo": { 
                        "virtualMachinesAllocated": [ 
                            { 
                                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM1" 
                            } 
                        ] 
                    }, 
                    "statuses": [ 
                        { 
                            "code": "ProvisioningState/succeeded", 
                            "level": "Info", 
                            "displayStatus": "Provisioning succeeded", 
                            "time": "<time>" 
                        } 
                    ] 
                } 
            ] 
        } 
    } 
} 
```

Lets say we create another virtual machine named *myVM2* and associate it with the above Capacity Reservation Group. 

The Instance View for the Capacity Reservation Group will now look like this: 

```json
{ 
    "name": "myCapacityReservationGroup", 
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/myCapacityReservationGroup", 
    "type": "Microsoft.Compute/capacityReservationGroups", 
    "location": "eastus", 
    "properties": { 
        "capacityReservations": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/MYCAPACITYRESERVATIONGROUP/capacityReservations/MYCAPACITYRESERVATION" 
            } 
        ], 
        "virtualMachinesAssociated": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM1" 
            }, 
 { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM2" 
            } 
        ], 
        "instanceView": { 
            "capacityReservations": [ 
                { 
                    "name": "myCapacityReservation", 
"utilizationInfo": { 
                        "virtualMachinesAllocated": [ 
                            { 
                                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM1" 
                            }, 
{ 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM2" 
            } 
                        ] 
                    }, 
                    "statuses": [ 
                        { 
                            "code": "ProvisioningState/succeeded", 
                            "level": "Info", 
                            "displayStatus": "Provisioning succeeded", 
                            "time": "<time>" 
                        } 
                    ] 
                } 
            ] 
        } 
    } 
} 
``` 

Notice that the length of `virtualMachinesAllocated` (2) is greater than `capacity` (1). This valid state is referred to as *overallocated*. 

> [!IMPORTANT]
> Azure won't stop allocations just because a Capacity Reservation is fully consumed. Auto-scale rules, temporary scale-out, and related requirements will work beyond the quantity of reserved capacity as long as Azure has available capacity.  


## States and considerations  

There are three valid states for a given Capacity Reservations: 

| State  | Status  | Considerations  |
|---|---|---|
| Reserved capacity available  | Length of `virtualMachinesAllocated` < `capacity`  | Is all the reserved capacity needed? Optionally reduce the capacity to reduce costs.  |
| Reservation consumed  | Length of `virtualMachinesAllocated` == `capacity`  | Additional VMs won't receive the capacity SLA unless some existing VMs are deallocated. Optionally try to increase the capacity so extra planned VMs will receive an SLA.  |
| Reservation overallocated  | Length of `virtualMachinesAllocated` > `capacity`  | Additional VMs won't receive the capacity SLA. Also, the quantity of VMs (Length of `virtualMachinesAllocated` – `capacity`) won't receive a capacity SLA if deallocated. Optionally increase the capacity to add capacity SLA to more of the existing VMs.  |


## Deleting VMs

Another important property of Capacity Reservation is that all VMs are treated equally. Resuming our example, *myVM1* was created first and *myVM2* was added second. At some point later, we decide *myVM1* is no longer needed and we delete *myVM1*: 

```rest
DELETE 
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM1?api-version=2021-07-01
```

The `myCapacityReservation` object state will automatically change to reflect the new state of consumption. The `myCapacityReservationGroup` Instance View will now return this state: 

```json
{ 
    "name": "myCapacityReservationGroup", 
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/myCapacityReservationGroup", 
    "type": "Microsoft.Compute/capacityReservationGroups", 
    "location": "eastus", 
    "properties": { 
        "capacityReservations": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/MYCAPACITYRESERVATIONGROUP/capacityReservations/MYCAPACITYRESERVATION" 
            } 
        ], 
        "virtualMachinesAssociated": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM2" 
            } 
        ], 
        "instanceView": { 
            "capacityReservations": [ 
                { 
                    "name": "myCapacityReservation", 
"utilizationInfo": { 
                        "virtualMachinesAllocated": [ 
                            { 
                                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM2" 
                            } 
                        ] 
                    }, 
                    "statuses": [ 
                        { 
                            "code": "ProvisioningState/succeeded", 
                            "level": "Info", 
                            "displayStatus": "Provisioning succeeded", 
                            "time": "<time>" 
                        } 
                    ] 
                } 
            ] 
        } 
    } 
}
```

## Next steps

> [!div class="nextstepaction"]
> [Learn how to remove VMs from a Capacity Reservation](capacity-reservation-remove-vm.md)