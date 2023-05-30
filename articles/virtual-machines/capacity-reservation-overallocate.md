---
title: Overallocating Capacity Reservation in Azure
description: Learn how overallocation works when it comes to Capacity Reservation.
author: bdeforeest
ms.author: bidefore
ms.service: virtual-machines
ms.topic: how-to
ms.date: 04/24/2023
ms.reviewer: cynthn, jushiman, mattmcinnes
ms.custom: template-how-to
---

# Overallocating Capacity Reservation

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Uniform scale set :heavy_check_mark: Flexible scale sets

Azure permits the association of extra VMs above the number of Capacity Reservations. These VMs are available to allow for burst and other scale-out scenarios without the limits of reserved capacity. The only difference is that the count of VMs beyond the quantity reserved doesn't receive the capacity availability SLA benefit. As long as Azure has available capacity that meets the virtual machine requirements, the extra allocation succeeds. 

The Instance View of a Capacity Reservation group provides a snapshot of usage for each member Capacity Reservation. You can use the Instance View to see how overallocation works. 

This article assumes you have created a Capacity Reservation group (`myCapacityReservationGroup`), a member Capacity Reservation (`myCapacityReservation`), and a virtual machine (*myVM1*) that is associated to the group. Go to [Create a Capacity Reservation](capacity-reservation-create.md) and [Associate a VM to a Capacity Reservation](capacity-reservation-associate-vm.md) for more details.

## Instance View for Capacity Reservation group 

The Instance View for a Capacity Reservation group looks like this: 

```rest
GET 
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/myCapacityReservationGroup?$expand=instanceview&api-version=2021-04-01
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

Let's say we create another virtual machine named *myVM2* and associate it with the above Capacity Reservation group. 

The Instance View for the Capacity Reservation group now looks like this: 

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
> Azure won't stop allocations just because a Capacity Reservation is fully consumed. Auto-scale rules, temporary scale-out, and related requirements will work beyond the quantity of reserved capacity as long as Azure has available capacity and other constraints such as available quota are met.  


## States and considerations  

There are three valid states for a given Capacity Reservations: 

| State  | Status  | Considerations  |
|---|---|---|
| Reserved capacity available  | Length of `virtualMachinesAllocated` < `capacity`  | Is all the reserved capacity needed? Optionally reduce the capacity to reduce costs.  |
| Reservation consumed  | Length of `virtualMachinesAllocated` == `capacity`  | Additional VMs won't receive the capacity SLA unless some existing VMs are deallocated. Optionally try to increase the capacity so extra planned VMs will receive an SLA.  |
| Reservation overallocated  | Length of `virtualMachinesAllocated` > `capacity`  | Additional VMs won't receive the capacity SLA. Also, the quantity of VMs (Length of `virtualMachinesAllocated` – `capacity`) won't receive a capacity SLA if deallocated. Optionally increase the capacity to add capacity SLA to more of the existing VMs.  |


## Next steps

> [!div class="nextstepaction"]
> [Learn how to remove VMs from a Capacity Reservation](capacity-reservation-remove-vm.md)
