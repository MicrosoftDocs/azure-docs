---
title: Modify a Capacity Reservation in Azure
description: Learn how to modify a Capacity Reservation.
author: bdeforeest
ms.author: bidefore
ms.service: virtual-machines
ms.topic: how-to
ms.date: 11/22/2022
ms.reviewer: cynthn, jushiman
ms.custom: template-how-to, devx-track-azurecli, devx-track-azurepowershell
---

# Modify a Capacity Reservation

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Uniform scale set :heavy_check_mark: Flexible scale sets

After creating a Capacity Reservation group and Capacity Reservation, you may want to modify your reservations. This article explains how to do the following actions using API, Azure portal, and PowerShell. 

> [!div class="checklist"]
> * Update the number of instances reserved in a Capacity Reservation 
> * Resize VMs associated with a Capacity Reservation group
> * Delete the Capacity Reservation group and Capacity Reservation

## Update the number of instances reserved 

Update the number of virtual machine instances reserved in a Capacity Reservation.  

> [!IMPORTANT]
> In rare cases when Azure cannot fulfill the request to increase the quantity reserved for existing Capacity Reservations, it is possible that a reservation goes into a *Failed* state and becomes unavailable until the [quantity is restored to the original amount](#restore-instance-quantity).

### [API](#tab/api1)

```rest
    PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{capacityReservationName}?api-version=2021-04-01
``` 
    
In the request body, update the `capacity` property to the new count that you want to reserve: 
    
```json
{
    "sku":
    {
        "capacity": 5
    }
} 
```

Note that the `capacity` property is set to 5 now in this example.


### [Portal](#tab/portal1) 

1. Open the [Azure portal](https://portal.azure.com)
1. Go to your Capacity Reservation group
1. Select **Overview** 
1. Select **Reservations** 
1. Select **Manage Reservation** at the top 
1. On the *Manage Reservations* page, enter the new quantity to be reserved in the **Instances** field 
1. Select **Save** 

### [CLI](#tab/cli1)
In order to update the quantity reserved, use `az capacity reservation update` with the updated `capacity ` property.

 ```azurecli-interactive
 az capacity reservation update 
 -c myCapacityReservationGroup 
 -n myCapacityReservation 
 -g myResourceGroup2 
 --capacity 5
 ```

### [PowerShell](#tab/powershell1)

In order to update the quantity reserved, use `New-AzCapacityReservation` with the updated `capacityToReserve` property.

```powershell-interactive
Update-AzCapacityReservation
-ResourceGroupName "myResourceGroup"
-ReservationGroupName "myCapacityReservationGroup"
-Name "myCapacityReservation"
-CapacityToReserve 5
```

To learn more, go to Azure PowerShell command [Update-AzCapacityReservation](/powershell/module/az.compute/update-azcapacityreservation).

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Resize VMs associated with a Capacity Reservation group 

You must do one of the following options if the VM being resized is currently attached to a Capacity Reservation group and that group doesn’t have a reservation for the target size:
- Create a new reservation for that size
- Remove the virtual machine from the reservation group before resizing. 

Check if the target size is part of the reservation group: 

### [API](#tab/api2)

1. Get the names of all Capacity Reservations within the group.
 
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

1. Find out the VM size reserved for each reservation. The following example is for `capacityReservationName1`, but you can repeat this step for other reservations.

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

1. Consider the following scenarios: 
    1. If the target VM size is not part of the group, [create a new Capacity Reservation](capacity-reservation-create.md) for the target VM 
    1. If the target VM size already exists in the group, [resize the virtual machine](resize-vm.md) 

### [Portal](#tab/portal2)

1. Open the [Azure portal](https://portal.azure.com)
1. Go to your Capacity Reservation group
1. Select **Overview** 
1. Select **Reservations** 
1. Look at the *VM size* reserved for each reservation 
    1. If the target VM size is not part of the group, [create a new Capacity Reservation](capacity-reservation-create.md) for the target VM 
    1. If the target VM size already exists in the group, [resize the virtual machine](resize-vm.md) 

### [CLI](#tab/cli2)

1. Get the names of all Capacity Reservations within the Capacity Reservation group with `az capacity reservation group show`

    ```azurecli-interactive
    az capacity reservation group show 
    -g myResourceGroup
    -n myCapacityReservationGroup 
    ```

1. From the response, find the names of all the Capacity Reservations

1. Run the following commands to find out the VM size(s) reserved for each reservation

    ```azurecli-interactive
    az capacity reservation show
    -g myResourceGroup
    -c myCapacityReservationGroup 
    -n myCapacityReservation 
    ```

1. Consider the following scenarios: 
    1. If the target VM size is not part of the group, [create a new Capacity Reservation](capacity-reservation-create.md) for the target VM 
    1. If the target VM size already exists in the group, [resize the virtual machine](resize-vm.md) 


### [PowerShell](#tab/powershell2)

1. Get the names of all Capacity Reservations within the group with `Get-AzCapacityReservationGroup`

    ```powershell-interactive
    Get-AzCapacityReservationGroup
    -ResourceGroupName "myResourceGroup"
    -Name "myCapacityReservationGroup"
    ```

1. From the response, find the names of all the Capacity Reservations

1. Run the following commands to find out the VM size(s) reserved for each reservation

    ```powershell-interactive
    $CapRes =
    Get-AzCapacityReservation
    -ResourceGroupName "myResourceGroup"
    -ReservationGroupName "myCapacityReservationGroup"
    -Name "mycapacityReservation"
    
    $CapRes.Sku
    ```

1. Consider the following scenarios: 
    1. If the target VM size is not part of the group, [create a new Capacity Reservation](capacity-reservation-create.md) for the target VM 
    1. If the target VM size already exists in the group, [resize the virtual machine](resize-vm.md) 


To learn more, go to Azure PowerShell commands [Get-AzCapacityReservationGroup](/powershell/module/az.compute/get-azcapacityreservationgroup) and [Get-AzCapacityReservation](/powershell/module/az.compute/get-azcapacityreservation).

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Delete a Capacity Reservation group and Capacity Reservation 

Azure allows a group to be deleted when all the member Capacity Reservations have been deleted and no VMs are associated to the group.  

To delete a Capacity Reservation, first find out all of the virtual machines that are associated to it. The list of virtual machines is available under `virtualMachinesAssociated` property. 

### [API](#tab/api3)

First, find all virtual machines associated with the Capacity Reservation group and dissociate them.
 
```rest
    GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}?$expand=instanceView&api-version=2021-04-01
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
From the above response, find the names of all virtual machines under the `virtualMachinesAssociated` property and remove them from the Capacity Reservation group using the steps in [Remove a VM association to a Capacity Reservation](capacity-reservation-remove-vm.md). 

Once all the virtual machines are removed from the Capacity Reservation group, delete the member Capacity Reservation(s):

```rest
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{capacityReservationName}?api-version=2021-04-01
```

Lastly, delete the parent Capacity Reservation group.

```rest
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}?api-version=2021-04-01
```


### [Portal](#tab/portal3)

1. Open the [Azure portal](https://portal.azure.com)
1. Go to your Capacity Reservation group
1. Select **Resources** 
1. Find out all the virtual machines that are associated with the group
1. [Disassociate every virtual machine](capacity-reservation-remove-vm.md)
1. Delete every Capacity Reservation in the group
    1. Go to **Reservations**
    1. Select each reservation 
    1. Select **Delete**
1. Delete the Capacity Reservation group
    1. Go to the Capacity Reservation group
    1. Select **Delete** at the top of the page

### [CLI](#tab/cli3)

Find out all the virtual machines associated with Capacity Reservation group and dissociate them.

1. Run the following command: 
    
    ```azurecli-interactive
    az capacity reservation group show
    -g myResourceGroup
    -n myCapacityReservationGroup
    ```

1. From the above response, find out the names of all the virtual machines under the `VirtualMachinesAssociated` property and remove them from the Capacity Reservation group using the steps detailed in [Remove a virtual machine association from a Capacity Reservation group](capacity-reservation-remove-vm.md).

1. Once all the virtual machines are removed from the group, proceed to the next steps. 

1. Delete the Capacity Reservation:

    ```azurecli-interactive
    az capacity reservation delete 
    -g myResourceGroup 
    -c myCapacityReservationGroup 
    -n myCapacityReservation 
    ```

1. Delete the Capacity Reservation group:

    ```azurecli-interactive
    az capacity reservation group delete 
    -g myResourceGroup 
    -n myCapacityReservationGroup
    ```

### [PowerShell](#tab/powershell3)

Find out all the virtual machines associated with Capacity Reservation group and dissociate them.

1. Run the following command: 
    
    ```powershell-interactive
    Get-AzCapacityReservationGroup
    -ResourceGroupName "myResourceGroup"
    -Name "myCapacityReservationGroup"
    ```

1. From the above response, find out the names of all the virtual machines under the `VirtualMachinesAssociated` property and remove them from the Capacity Reservation group using the steps detailed in [Remove a virtual machine association from a Capacity Reservation group](capacity-reservation-remove-vm.md).

1. Once all the virtual machines are removed from the group, proceed to the next steps. 

1. Delete the Capacity Reservation:

    ```powershell-interactive
    Remove-AzCapacityReservation
    -ResourceGroupName "myResourceGroup"
    -ReservationGroupName "myCapacityReservationGroup"
    -Name "myCapacityReservation"
    ```

1. Delete the Capacity Reservation group:

    ```powershell-interactive
    Remove-AzCapacityReservationGroup
    -ResourceGroupName "myResourceGroup"
    -Name "myCapacityReservationGroup"
    ```

To learn more, go to Azure PowerShell commands [Get-AzCapacityReservationGroup](/powershell/module/az.compute/get-azcapacityreservationgroup), [Remove-AzCapacityReservation](/powershell/module/az.compute/remove-azcapacityreservation), and [Remove-AzCapacityReservationGroup](/powershell/module/az.compute/remove-azcapacityreservationgroup).

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Restore instance quantity 

A well-formed request for reducing the quantity reserved should always succeed no matter the number of VMs associated with the reservation. However, increasing the quantity reserved may require more quota and for Azure to fulfill the additional capacity request. In a rare scenario in which Azure can’t fulfill the request to increase the quantity reserved for existing reservations, it is possible that the reservation goes into a *Failed* state and becomes unavailable until the quantity reserved is restored to the original amount.  

> [!NOTE]
> If a reservation is in a *Failed* state, all the VMs that are associated with the reservation will continue to work as normal.  

For example, let’s say `myCapacityReservation` has a quantity reserved 5. You request 5 extra instances, making the total quantity reserved equal 10. However, because of a constrained capacity situation in the region, Azure can’t fulfill the additional 5 quantity requested. In this case, `myCapacityReservation` will fail to meet its intended state of 10 quantity reserved and will go into a *Failed* state. 

To resolve this failure, take the following steps to locate the old quantity reserved value:  

1. Go to [Application Change Analysis](https://portal.azure.com/#blade/Microsoft_Azure_ChangeAnalysis/ChangeAnalysisBaseBlade) in the Azure portal 
1. Select the applicable **Subscription**, **Resource group**, and **Time range** in the filters
    - You can only go back up to 14 days in the past in the **Time range** filter 
1. Search for the name of the Capacity Reservation
1. Look for the change in `sku.capacity` property for that reservation 
    - The old quantity reserved will be the value under the **Old Value** column 

Update `myCapacityReservation` to the old quantity reserved. Once updated, the reservation will be available immediately for use with your virtual machines. 


## Next steps

> [!div class="nextstepaction"]
> [Learn how to remove VMs from a Capacity Reservation](capacity-reservation-remove-vm.md)
