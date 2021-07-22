---
title: Modifying a Capacity Reservation in Azure (preview)
description: Learn how to modify a Capacity Reservation.
author: vargupt
ms.author: vargupt
ms.service: virtual-machines #Required
ms.topic: how-to
ms.date: 07/30/2021
ms.reviewer: cynthn, jushiman
ms.custom: template-how-to
---

# Modifying a Capacity Reservation 

After creating a Capacity Reservation Group and Capacity Reservation, you may want to modify your reservations. This article explains how to do the following using API and Azure portal:

> [!div class="checklist"]
> * Update the number of instances reserved in a Capacity Reservation 
> * Resize VMs associated with a Capacity Reservation Group
> * Delete the Capacity Reservation Group and Capacity Reservation

> [!IMPORTANT]
> Capacity Reservation is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Update the number of instances reserved 

Update the number of virtual machine instances reserved in a capacity reservation.  

> [!IMPORTANT]
> In rare cases when Azure cannot fulfill additional capacity requests, it is possible that the reservation goes into a *Failed* state and becomes unavailable until the [quantity is restored to the original amount](#restore-instance-quantity).


### [API](#tab/api)

```rest
    PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{capacityReservationName}?api-version=2021-04-01
``` 
    
In the request body, update the `capacity` property to the new count that you want to reserve: 
    
```json
{ 
    "capacity": 5,
} 
```

Please note that `capacity` property is set to 5 now in this example.


### [Portal](#tab/portal) 

1. Open the [Azure portal](https://portal.azure.com)
1. Go to your Capacity Reservation Group
1. Select **Overview** 
1. Select **Reservations** 
1. Select **Manage Reservation** at the top 
1. On the *Manage Reservations* page, enter the new quantity to be reserved in the **Instances** field 
1. Select **Save** 

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Resizing VMs associated with a Capacity Reservation Group 

You can resize virtual machines already associated with a capacity reservation group. Once the virtual machine is resized to the target size, in order to get capacity SLAs, a capacity reservation group must be explicitly referenced as a property of the virtual machine.  

If the virtual machine being resized is currently attached to a capacity reservation group and that group doesn’t have a reservation for the target size, then either create a new reservation for that size or remove the virtual machine from the reservation group before resizing. 

Check if the target size is part of the reservation group: 

### [API](#tab/api)

First, get the names of all Capacity Reservations within the group.
 
```rest
    GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}?api-version=2021-04-01
``` 

```json
{ 
    "name": "<CapacityReservationGroupName>", 
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{CapacityReservationGroupName}", 
    "type": "Microsoft.Compute/capacityReservationGroups", 
    "location": "eastUS", 
    "zones": [ 
        "1" 
    ], 
    "properties": { 
        "capacityReservations": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{capacityReservationName1}" 
            }, 
{ 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{capacityReservationName2}" 
            } 
        ] 
    } 
} 
```

Next, find out the VM size reserved for each reservation. The following example is for `capacityReservationName1`, but you can repeat this step for other reservations.

```rest
    GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{capacityReservationName1}?api-version=2021-04-01
``` 

```json
{ 
    "name": "capacityReservationName1", 
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{capacityReservationName1}", 
    "type": "Microsoft.Compute/capacityReservationGroups/capacityReservations", 
    "location": "eastUS", 
    "sku": { 
        "name": "Standard_D2s_v3", 
        "capacity": 3 
    }, 
    "zones": [ 
        "1" 
    ], 
    "properties": { 
        "reservationId": "<reservationId>", 
        "provisioningTime": "<provisioningTime>", 
        "provisioningState": "Succeeded" 
    } 
}  
```

### [Portal](#tab/portal)

1. Open the [Azure portal](https://portal.azure.com)
1. Go to your Capacity Reservation Group
1. Select **Overview** 
1. Select **Reservations** 
1. Look at the *VM size* reserved for each reservation 
    1. If the target VM size is not part of the group, [create a new capacity reservation](capacity-reservation-create.md) for the target VM 
    1. If the target VM size already exists in the group, [resize the virtual machine](\windows\resize-vm.md) 

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Deleting a Capacity Reservation Group and Capacity Reservation 

Azure allows a Capacity Reservation Group to be deleted when all the member Capacity Reservations have been deleted and no virtual machines are associated to the group.  

In order to delete a capacity reservation, first find out all of the virtual machines that are associated to it. The list of virtual machines is available under `virtualMachinesAssociated` property. 

### [API](#tab/api)

First, find all virtual machines associated with the Capacity Reservation Group and dissociate them.
 
```rest
    GET InstanceView https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}?$expand=instanceView&api-version=2021-04-01
``` 

```json
{ 
    "name": "<capacityReservationGroupName>", 
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{capacityReservationGroupName}", 
    "type": "Microsoft.Compute/capacityReservationGroups", 
    "location": "eastus", 
    "properties": { 
        "capacityReservations": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{capacityReservationGroupName}/capacityReservations/{capacityReservationName}" 
            } 
        ], 
        "virtualMachinesAssociated": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{VirtualMachineName1}" 
            }, 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{VirtualMachineName2}" 
            } 
        ], 
        "instanceView": { 
            "capacityReservations": [ 
                { 
                    "name": "{capacityReservationName}", 
                    "utilizationInfo": { 
                        "virtualMachinesAllocated": [ 
                            { 
                                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{VirtualMachineName1}" 
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
From the above response, find the names of all virtual machines under the `virtualMachinesAssociated` property and remove them from the Capacity Reservation Group using the steps in [Remove a VM association to a Capacity Reservation](capacity-reservation-remove-vm.md). 

Once all the virtual machines are removed from the Capacity Reservation Group, delete the member Capacity Reservation(s):

```rest
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{capacityReservationName}?api-version=2021-04-01
```

Lastly, delete the parent Capacity Reservation Group.

```rest
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}?api-version=2021-04-01
```


### [Portal](#tab/portal)

1. Open the [Azure portal](https://portal.azure.com)
1. Go to your Capacity Reservation Group
1. Select **Resources** 
1. Find out all the virtual machines that are associated with the group
1. [Disassociate every virtual machine](capacity-reservation-remove-vm.md)
1. Delete every Capacity Reservation in the group
    1. Go to **Reservations**
    1. Select each reservation 
    1. Select **Delete**
1. Delete the Capacity Reservation Group
    1. Go to the Capacity Reservation Group
    1. Select **Delete** at the top of the page

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Restore instance quantity 

A well-formed request for reducing the quantity reserved should always succeed irrespective of the number of virtual machines associated with the reservation. However, increasing the quantity reserved may require additional quota and for Azure to fulfill the additional capacity request. In a rare scenario in which Azure can’t fulfill the additional capacity request, it is possible that the reservation goes into a *Failed* state and becomes unavailable until the quantity reserved is restored to the original amount.  

> [!NOTE]
> If a reservation is in a *Failed* state, all the VMs that are associated with the reservation will continue to work as normal.  

For example, let’s say `myCapacityReservation` has a quantity reservation of 5. You request 5 additional instances, making the total quantity reserved equal 10. However, due to a constrained capacity situation in the region, Azure can’t fulfill the additional 5 quantity requested. In this case, `myCapacityReservation` will fail to meet its intended state of 10 quantity reserved and will go into a *Failed* state. 

In order to resolve this failure, take the following steps to locate the old quantity reserved value:  

1. Go to [Application Change Analysis](https://ms.portal.azure.com/#blade/Microsoft_Azure_ChangeAnalysis/ChangeAnalysisBaseBlade) in the Azure portal 
1. Select the applicable **Subscription**, **Resource group**, and **Time range** in the filters
    1. You can only go back up to 14 days in the past in the **Time range** filter 
1. Search for the name of the capacity reservation
1. Look for the change in `sku.capacity` property for that reservation 
    1. The old quantity reserved will be the value under the **Old Value** column 

Update `myCapacityReservation` to the old quantity reserved. Once updated, the reservation will be available immediately for use with your virtual machines. 


## Next steps

> [!div class="nextstepaction"]
> [Learn about adding code to articles](availability.md)