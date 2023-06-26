---
title: Remove a Virtual Machine Scale Set association from a Capacity Reservation group
description: Learn how to remove a Virtual Machine Scale Set from a Capacity Reservation group.
author: bdeforeest
ms.author: bidefore
ms.service: virtual-machines
ms.topic: how-to
ms.date: 11/22/2022
ms.reviewer: cynthn, jushiman
ms.custom: template-how-to, devx-track-azurepowershell
---

# Remove a Virtual Machine Scale Set association from a Capacity Reservation group 

**Applies to:** :heavy_check_mark: Uniform scale set :heavy_check_mark: Flexible scale sets

This article walks you through removing a Virtual Machine Scale Set association from a Capacity Reservation group. To learn more about capacity reservations, see the [overview article](capacity-reservation-overview.md). 

Because both the VM and the underlying Capacity Reservation logically occupy capacity, Azure imposes some constraints on this process to avoid ambiguous allocation states and unexpected errors.  

There are two ways to change an association: 
- Option 1: Deallocate the Virtual Machine Scale Set, change the Capacity Reservation group property at the scale set level, and then update the underlying VMs
- Option 2: Update the reserved quantity to zero and then change the Capacity Reservation group property


## Deallocate the Virtual Machine Scale Set

The first option is to deallocate the Virtual Machine Scale Set, change the Capacity Reservation group property at the scale set level, and then update the underlying VMs. 

Go to [upgrade policies](#upgrade-policies) for more information about automatic, rolling, and manual upgrades. 

### [API](#tab/api1)

1. Deallocate the Virtual Machine Scale Set

    ```rest
    POST  https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMScaleSetName}/deallocate?api-version=2021-04-01
    ```

1. Update the Virtual Machine Scale Set to remove association with the Capacity Reservation group
    
    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMScaleSetName}/update?api-version=2021-04-01
    ```
    In the request body, set the `capacityReservationGroup` property to null to remove the Virtual Machine Scale Set association to the group:

    ```json
    {
    "location": "eastus",
    "properties": {
        "virtualMachineProfile": {
            "capacityReservation": {
                "capacityReservationGroup":{
                    "id":null    
                }
            }
        }
    }
    }
    ```

### [CLI](#tab/cli1)

1. Deallocate the Virtual Machine Scale Set. The following command will deallocate all virtual machines within the scale set: 

    ```azurecli-interactive
    az vmss deallocate
    --location eastus
    --resource-group myResourceGroup 
    --name myVMSS 
    ```

1. Update the scale set to remove association with the Capacity Reservation group. Setting the `capacity-reservation-group` property to None removes the association of scale set to the Capacity Reservation group: 

    ```azurecli-interactive
    az vmss update 
    --resource-group myresourcegroup 
    --name myVMSS 
    --capacity-reservation-group None
    ```


### [PowerShell](#tab/powershell1)

1. Deallocate the Virtual Machine Scale Set. The following command will deallocate all virtual machines within the scale set: 

    ```powershell-interactive
    Stop-AzVmss
    -ResourceGroupName "myResourceGroup"
    -VMScaleSetName "myVmss"
    ```

1. Update the scale set to remove association with the Capacity Reservation group. Setting the `CapacityReservationGroupId` property to null removes the association of scale set to the Capacity Reservation group: 

    ```powershell-interactive
    $vmss =
    Get-AzVmss
    -ResourceGroupName "myResourceGroup"
    -VMScaleSetName "myVmss"
    
    Update-AzVmss
    -ResourceGroupName "myResourceGroup"
    -VMScaleSetName "myvmss"
    -VirtualMachineScaleSet $vmss
    -CapacityReservationGroupId $null
    ```

To learn more, go to Azure PowerShell commands [Stop-AzVmss](/powershell/module/az.compute/stop-azvmss), [Get-AzVmss](/powershell/module/az.compute/get-azvmss), and [Update-AzVmss](/powershell/module/az.compute/update-azvmss).

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Update the reserved quantity to zero 

The second option involves updating the reserved quantity to zero and then changing the Capacity Reservation group property.

This option works well when the scale set cannot be deallocated and when a reservation is no longer needed. For example, you may create a Capacity Reservation to temporarily assure capacity during a large-scale deployment. Once completed, the reservation is no longer needed. 

Go to [upgrade policies](#upgrade-policies) for more information about automatic, rolling, and manual upgrades. 

### [API](#tab/api2)

1. Update the reserved quantity to zero 

    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}/CapacityReservations/{CapacityReservationName}?api-version=2021-04-01
    ```

    In the request body, include the following parameters:
    
    ```json
    {
    "sku": 
        {
        "capacity": 0
        }
    } 
    ```
    
    Note that `capacity` property is set to 0.

1. Update the Virtual Machine Scale Set to remove the association with the Capacity Reservation group

    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMScaleSetName}/update?api-version=2021-04-01
    ```

    In the request body, set the `capacityReservationGroup` property to null to remove the association:
    
    ```json
    {
    "location": "eastus",
    "properties": {
        "virtualMachineProfile": {
            "capacityReservation": {
                "capacityReservationGroup":{
                    "id":null
                }
            }
        }
    }
    }
    ```

### [CLI](#tab/cli2)

1. Update reserved quantity to zero:

    ```azurecli-interactive
    az capacity reservation update 
    -g myResourceGroup 
    -c myCapacityReservationGroup 
    -n myCapacityReservation 
    --capacity 0
    ```

2. Update the scale set to remove association with Capacity Reservation group by setting the `capacity-reservation-group` property to None: 

    ```azurecli-interactive
    az vmss update 
    --resource-group myResourceGroup 
    --name myVMSS 
    --capacity-reservation-group None
    ```

### [PowerShell](#tab/powershell2)

1. Update reserved quantity to zero:

    ```powershell-interactive
    Update-AzCapacityReservation
    -ResourceGroupName "myResourceGroup"
    -ReservationGroupName "myCapacityReservationGroup"
    -Name "myCapacityReservation"
    -CapacityToReserve 0
    ```

2. Update the scale set to remove association with Capacity Reservation group by setting the `CapacityReservationGroupId` property to null: 

    ```powershell-interactive
    $vmss =
    Get-AzVmss
    -ResourceGroupName "myResourceGroup"
    -VMScaleSetName "myVmss"
    
    Update-AzVmss
    -ResourceGroupName "myResourceGroup"
    -VMScaleSetName "myvmss"
    -VirtualMachineScaleSet $vmss
    -CapacityReservationGroupId $null
    ```

To learn more, go to Azure PowerShell commands [New-AzCapacityReservation](/powershell/module/az.compute/new-azcapacityreservation), [Get-AzVmss](/powershell/module/az.compute/get-azvmss), and [Update-AzVmss](/powershell/module/az.compute/update-azvmss).

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Upgrade policies

- **Automatic Upgrade** – In this mode, the scale set VM instances are automatically dissociated from the Capacity Reservation group without any further action from you.
- **Rolling Upgrade** – In this mode, the scale set VM instances are dissociated from the Capacity Reservation group without any further action from you. However, they are updated in batches with an optional pause time between them.
- **Manual Upgrade** – In this mode, nothing happens to the scale set VM instances when the Virtual Machine Scale Set is updated. You will need to individually remove each scale set VM by [upgrading it with the latest Scale Set model](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy.md).


## Next steps

> [!div class="nextstepaction"]
> [Learn about overallocating a Capacity Reservation](capacity-reservation-overallocate.md)
