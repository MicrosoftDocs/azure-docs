---
title: Remove a virtual machine association from a Capacity Reservation group (preview)
description: Learn how to remove a virtual machine from a Capacity Reservation group.
author: vargupt
ms.author: vargupt
ms.service: virtual-machines #Required
ms.topic: how-to
ms.date: 08/09/2021
ms.reviewer: cynthn, jushiman
ms.custom: template-how-to
---

# Remove a VM association from a Capacity Reservation Group (preview)

This article walks you through the steps of removing a VM association to a Capacity Reservation Group. To learn more about capacity reservations, see the [overview article](capacity-reservation-overview.md). 

> [!IMPORTANT]
> Capacity Reservation is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Because both the VM and the underlying Capacity Reservation logically occupy capacity, Azure imposes some constraints on this process to avoid ambiguous allocation states and unexpected errors.  

There are two ways to change an association: 
1. Option 1: Deallocate the Virtual Machine, change the Capacity Reservation Group property, and optionally restart the virtual machine
1. Option 2: Update the reserved quantity to zero and then change the Capacity Reservation Group property


## Deallocate the VM

The first option is to deallocate the Virtual Machine, change the Capacity Reservation Group property, and optionally restart the VM. 

### [API](#tab/api1)

1. Deallocate the VM

    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{virtualMachineName}/deallocate?api-version=2021-04-01
    ```

1. Update the VM to remove association with the Capacity Reservation Group
    
    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{virtualMachineName}/update?api-version=2021-04-01
    ```
    In the request body, set the `capacityReservationGroup` property to empty to remove the VM association to the group:

    ```json
     {
    "location": "eastus",
    "properties": {
        "capacityReservation": {
            "capacityReservationGroup": {
            }
        }
    }
    }
    ```

### [Portal](#tab/portal1)

<!-- no images necessary if steps are straightforward --> 

1. Open [Azure portal](https://portal.azure.com)
1. Go to your Virtual Machine and select **Overview**
1. Select **Stop** 
    1. You'll know your VM is deallocated when the status changes to *Stopped (deallocated)*
    1. At this point in the process, the VM is still associated with the Capacity Reservation Group, which is reflected in the `virtualMachinesAssociated` property of the Capacity Reservation 
1. Select **Configuration**
1. Set the **Capacity Reservation Group** value to *None*
    1. The VM is no longer associated with the Capacity Reservation Group 

### [PowerShell](#tab/powershell1)

1. Deallocate the Virtual Machine

    ```powershell-interactive
    Stop-AzVM
    -ResourceGroupName "myResourceGroup"
    -Name "myVM"
    ```

    Once the status changes to **Stopped (deallocated)**, the virtual machine is deallocated.

1. Update the VM to remove association with the Capacity Reservation Group by setting the `CapacityReservationGroupId` property to empty:

    ```powershell-interactive
    $VirtualMachine =
    Get-AzVM
    -ResourceGroupName "myResourceGroup"
    -Name "myVM"
    
    Update-AzVM
    -ResourceGroupName "myResourceGroup"
    -VM $VirtualMachine
    -CapacityReservationGroupId " "
    ```

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Update the reserved quantity to zero 

The second option involves updating the reserved quantity to zero and then changing the Capacity Reservation Group property.

This option works well when the virtual machine can’t be deallocated and when a reservation is no longer needed. For example, you may create a capacity reservation to temporarily assure capacity during a large-scale deployment. Once completed, the reservation is no longer needed. 

### [API](#tab/api2)

1. Update the reserved quantity to zero 

    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}/CapacityReservations/{CapacityReservationName}?api-version=2021-04-01
    ```

    In the request body, include the following:
    
    ```json
    {
    "sku":
        {
        "capacity": 0
        }
    }
    ```
    
    Note that `capacity` property is set to 0 above.

1. Update the VM to remove the association with the Capacity Reservation Group

    ```rest
    PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{VirtualMachineName}/update?api-version=2021-04-01
    ```

    In the request body, set the `capacityReservationGroup` property to empty to remove the association:
    
    ```json
    {
    "location": "eastus",
    "properties": {
        "capacityReservation": {
            "capacityReservationGroup": {
            }
        }
    }
    } 
    ```

### [Portal](#tab/portal2)

<!-- no images necessary if steps are straightforward --> 

1. Open [Azure portal](https://portal.azure.com)
1. Go to your Capacity Reservation Group and select **Overview**
1. Select **Reservations** 
1. Select **Manage Reservation** at the top of the page 
1. On the *Manage Reservations* blade:
    1. Enter `0` in the **Instances** field
    1. Select **Save** 
1. Go to your Virtual Machine and select **Configuration**
1. Set the **Capacity Reservation Group** value to *None*
    1. Note that the VM is no longer associated with the Capacity Reservation Group

### [PowerShell](#tab/powershell2)

1. Update reserved quantity to zero

    ```powershell-interactive
    New-AzCapacityReservation
    -ResourceGroupName "myResourceGroup"
    -Location "eastus"
    -Zone "1"
    -ReservationGroupName "myCapacityReservationGroup"
    -Name "myCapacityReservation"
    -Sku "Standard_D2s_v3"
    -CapacityToReserve 0
    ```

1. Update the VM to remove association with the Capacity Reservation Group by setting the `CapacityReservationGroupId` property to empty:

    ```powershell-interactive
    $VirtualMachine =
    Get-AzVM
    -ResourceGroupName "myResourceGroup"
    -Name "myVM"
    
    Update-AzVM
    -ResourceGroupName "myResourceGroup"
    -VM $VirtualMachine
    -CapacityReservationGroupId " "
    ```

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Next steps

> [!div class="nextstepaction"]
> [Learn about overallicating a Capacity Reservation](capacity-reservation-overallocate.md)