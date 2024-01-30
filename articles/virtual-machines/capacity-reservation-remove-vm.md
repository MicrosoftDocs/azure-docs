---
title: Remove a virtual machine association from a Capacity Reservation group
description: Learn how to remove a virtual machine from a Capacity Reservation group.
author: bdeforeest
ms.author: bidefore
ms.service: virtual-machines
ms.topic: how-to
ms.date: 04/24/2023
ms.reviewer: cynthn, jushiman, mattmcinnes
ms.custom: template-how-to, devx-track-azurepowershell
---

# Remove a VM association from a Capacity Reservation group

This article walks you through the steps of removing a VM association to a Capacity Reservation group. To learn more about capacity reservations, see the [overview article](capacity-reservation-overview.md). 

Because both the VM and the underlying Capacity Reservation logically occupy capacity, Azure imposes some constraints on this process to avoid ambiguous allocation states and unexpected errors.  

There are two ways to change an association: 
- Option 1: Deallocate the virtual machine, change the Capacity Reservation group property, and optionally restart the virtual machine
- Option 2: Update the reserved quantity to zero and then change the Capacity Reservation group property

## Deallocate the VM

The first option is to deallocate the VM, change the Capacity Reservation group property, and optionally restart the VM. 

### [API](#tab/api1)

1. Deallocate the VM

    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{virtualMachineName}/deallocate?api-version=2021-04-01
    ```

1. Update the VM to remove association with the Capacity Reservation group
    
    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{virtualMachineName}/update?api-version=2021-04-01
    ```
    In the request body, set the `capacityReservationGroup` property to null to remove the VM association to the group:

    ```json
     {
    "location": "eastus",
    "properties": {
        "capacityReservation": {
            "capacityReservationGroup": {
                "id":null
            }
        }
    }
    }
    ```

### [Portal](#tab/portal1)

<!-- no images necessary if steps are straightforward --> 

1. Open [Azure portal](https://portal.azure.com)
1. Go to your VM and select **Overview**
1. Select **Stop** 
    1. You will know your VM is deallocated when the status changes to *Stopped (deallocated)*
    1. At this point in the process, the VM is still associated with the Capacity Reservation group, which is reflected in the `virtualMachinesAssociated` property of the Capacity Reservation 
1. Select **Configuration**
1. Set the **Capacity Reservation group** value to *None*
    - The VM is no longer associated with the Capacity Reservation group 

### [CLI](#tab/cli1)

1. Deallocate the virtual machine

    ```azurecli-interactive
    az vm deallocate 
    -g myResourceGroup 
    -n myVM
    ```

    Once the status changes to **Stopped (deallocated)**, the virtual machine is deallocated.

1. Update the VM to remove association with the Capacity Reservation group by setting the `capacity-reservation-group` property to None:

    ```azurecli-interactive
    az vm update 
    -g myresourcegroup 
    -n myVM 
    --capacity-reservation-group None
    ```

### [PowerShell](#tab/powershell1)

1. Deallocate the virtual machine

    ```powershell-interactive
    Stop-AzVM
    -ResourceGroupName "myResourceGroup"
    -Name "myVM"
    ```

    Once the status changes to **Stopped (deallocated)**, the virtual machine is deallocated.

1. Update the VM to remove association with the Capacity Reservation group by setting the `CapacityReservationGroupId` property to null:

    ```powershell-interactive
    $VirtualMachine =
    Get-AzVM
    -ResourceGroupName "myResourceGroup"
    -Name "myVM"
    
    Update-AzVM
    -ResourceGroupName "myResourceGroup"
    -VM $VirtualMachine
    -CapacityReservationGroupId $null
    ```

To learn more, go to Azure PowerShell commands [Stop-AzVM](/powershell/module/az.compute/stop-azvm), [Get-AzVM](/powershell/module/az.compute/get-azvm), and [Update-AzVM](/powershell/module/az.compute/update-azvm).

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Update the reserved quantity to zero 

The second option involves updating the reserved quantity to zero and then changing the Capacity Reservation group property.

This option works well when the virtual machine can’t be deallocated and when a reservation is no longer needed. For example, you may create a Capacity Reservation to temporarily assure capacity during a large-scale deployment. Once completed, the reservation is no longer needed. 

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

1. Update the VM to remove the association with the Capacity Reservation group

    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{VirtualMachineName}/update?api-version=2021-04-01
    ```

    In the request body, set the `capacityReservationGroup` property to null to remove the association:
    
    ```json
    {
    "location": "eastus",
    "properties": {
        "capacityReservation": {
            "capacityReservationGroup": {
                "id":null
            }
        }
    }
    } 
    ```

### [Portal](#tab/portal2)

<!-- no images necessary if steps are straightforward --> 

1. Open [Azure portal](https://portal.azure.com)
1. Go to your Capacity Reservation group and select **Overview**
1. Select **Reservations** 
1. Select **Manage Reservation** at the top of the page 
1. On the *Manage Reservations* blade:
    1. Enter `0` in the **Instances** field
    1. Select **Save** 
1. Go to your VM and select **Configuration**
1. Set the **Capacity Reservation group** value to *None*
    - Note that the VM is no longer associated with the Capacity Reservation group

### [CLI](#tab/cli2)

1. Update reserved quantity to zero

   ```azurecli-interactive
   az capacity reservation update 
   -g myResourceGroup
   -c myCapacityReservationGroup 
   -n myCapacityReservation 
   --capacity 0
   ```

1. Update the VM to remove association with the Capacity Reservation group by setting the `capacity-reservation-group` property to None:

    ```azurecli-interactive
    az vm update 
    -g myresourcegroup 
    -n myVM 
    --capacity-reservation-group None
    ```


### [PowerShell](#tab/powershell2)

1. Update reserved quantity to zero

    ```powershell-interactive
    Update-AzCapacityReservation
    -ResourceGroupName "myResourceGroup"
    -ReservationGroupName "myCapacityReservationGroup"
    -Name "myCapacityReservation"
    -CapacityToReserve 0
    ```

1. Update the VM to remove association with the Capacity Reservation group by setting the `CapacityReservationGroupId` property to null:

    ```powershell-interactive
    $VirtualMachine =
    Get-AzVM
    -ResourceGroupName "myResourceGroup"
    -Name "myVM"
    
    Update-AzVM
    -ResourceGroupName "myResourceGroup"
    -VM $VirtualMachine
    -CapacityReservationGroupId $null
    ```

To learn more, go to Azure PowerShell commands [New-AzCapacityReservation](/powershell/module/az.compute/new-azcapacityreservation), [Get-AzVM](/powershell/module/az.compute/get-azvm), and [Update-AzVM](/powershell/module/az.compute/update-azvm).

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Next steps

> [!div class="nextstepaction"]
> [Learn how to associate a scale set to a Capacity Reservation group](capacity-reservation-associate-virtual-machine-scale-set.md)
