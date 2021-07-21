---
title: Overallocating Capacity Reservation in Azure (preview)
description: Learn how overallocation works when it comes to Capacity Reservation.
author: vargupt
ms.author: vargupt
ms.service: virtual-machines #Required
ms.topic: how-to
ms.date: 07/30/2021
ms.reviewer: cynthn, jushiman
ms.custom: template-how-to
---

# Overallocating Capacity Reservation

Azure permits association of additional VMs beyond the reserved count of a Capacity Reservation in order to facilitate burst and other scale out scenarios, without the overhead of managing around the limits of reserved capacity. The only difference is that the count of VMs beyond the quantity reserved does not receive the capacity availability SLA benefit. As long as Azure has available capacity that meets the virtual machine requirements, the additional allocations will succeed. 

The Instance View of a Capacity Reservation Group provides a snapshot of utilization for each member Capacity Reservation. We can use the Instance View to see how overallocation works. 

Assume we created a Capacity Reservation Group (`myCapacityReservationGroup`), a member Capacity Reservation (`myCapacityReservation`), and a virtual machine (*myVM1*) that is associated to the group. Please click [here]() for details on how to create a group and a member capacity reservation and [here]() for details on how to create a virtual machine and associate it to a group.

The Instance View for Capacity Reservation Group will look like this: 

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

Now let’s say we create another virtual machine (*myVM2*) and associate it with the above Capacity Reservation Group. 

The Instance View for Capacity Reservation Group will now look like this: 

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

Notice that the length of `virtualMachinesAllocated` (2) is greater than `capacity` (1). This valid state is referred to as *overallocated*. Azure will not stop allocations just because a Capacity Reservation is fully consumed. Auto-scale rules, temporary scale out, and related requirements will simply work even beyond the quantity of reserved capacity so long as Azure has additional available capacity.  

There are three valid states for a given Capacity Reservations: 

| State  | Status  | Considerations  |
|---|---|---|
| Reserved capacity available  | Length of `virtualMachinesAllocated` < `capacity`  | Is all the reserved capacity needed? Optionally reduce the capacity to reduce costs.  |
| Reservation consumed  | Length of `virtualMachinesAllocated` == `capacity`  | Additional VMs will not receive the capacity SLA unless some existing VMs are deallocated. Optionally try to increase the capacity so additional planned VMs will receive an SLA.  |
| Reservation overallocated  | Length of `virtualMachinesAllocated` > `capacity`  | Additional VMs will not receive the capacity SLA. Also, the quantity of VMs (Length of `virtualMachinesAllocated` – `capacity`) will not receive a capacity SLA if deallocated. Optionally increase the capacity to add capacity SLA to more of the existing VMs.  |

Another important property of Capacity Reservation is that all VMs are treated equally. Resuming our example, *myVM1* was created first and *myVM2* was added second. At some point later, we decide *myVM1* is no longer needed. We simply delete *myVM1*: 

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

Customers do not have to manage which VMs are “in” or “out” of the reserved space. All allocated Standard_D2s_v3 VMs with the `capacityReservationGroup` property set to `myCapacityReservationGroup` count towards the `virtualMachinesAllocated` property of `myCapacityReservation`. The virtual machines can be created and deleted in any order and Azure will manage the Capacity Reservation state automatically. 

There is no support within a reservation for designating a set of VMs that are protected and a set that are not. To segment VMs in that manner, allocate the less important VMs outside the reservation or to a different reservation group. 


## Next steps

> [!div class="nextstepaction"]
> [Learn about adding code to articles](availability.md)