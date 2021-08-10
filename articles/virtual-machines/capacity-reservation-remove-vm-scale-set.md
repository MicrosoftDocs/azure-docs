---
title: Remove a virtual machine scale set association from a Capacity Reservation group (preview)
description: Learn how to remove a virtual machine scale set from a Capacity Reservation group.
author: vargupt
ms.author: vargupt
ms.service: virtual-machines #Required
ms.topic: how-to
ms.date: 08/09/2021
ms.reviewer: cynthn, jushiman
ms.custom: template-how-to
---

# Remove a Virtual machine scale set association from a Capacity Reservation group 

This article walks you through the steps of removing a Virtual machine scale set association from a Capacity Reservation Group. To learn more about capacity reservations, see the [overview article](capacity-reservation-overview.md). 

> [!IMPORTANT]
> Capacity Reservation is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Because both the VM and the underlying Capacity Reservation logically occupy capacity, Azure imposes some constraints on this process to avoid ambiguous allocation states and unexpected errors.  

There are two ways to change an association: 
1. Option 1: Deallocate the Virtual machine scale set, change the Capacity Reservation Group property at the scale set level, and then update the underlying VMs
1. Option 2: Update the reserved quantity to zero and then change the Capacity Reservation Group property


## Deallocate the Virtual machine scale set

The first option is to deallocate the virtual machine scale set, change the Capacity Reservation Group property at the scale set level, and then update the underlying VMs. 

### [API](#tab/api1)

1. Deallocate the virtual machine scale set

    ```rest
    POST  https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMScaleSetName}/deallocate?api-version=2021-04-01
    ```

1. Update the virtual machine scale set to remove association with the Capacity Reservation Group
    
    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMScaleSetName}/update?api-version=2021-04-01
    ```
    In the request body, set the `capacityReservationGroup` property to empty to remove the virtual machine scale set association to the group:

    ```json
    {
   "location":"eastus",
   "properties":{
        "virtualMachineProfile":{
            "capacityReservation":{
                "capacityReservationGroup":{  
                }
            }
        }
    }
    }
    ```

### [Portal](#tab/portal1)

<!-- no images necessary if steps are straightforward --> 

Currently, Capacity Reservation for Uniform virtual machine scale sets isn't supported in Azure portal. The following steps will only remove the association of the Capacity Reservation Group at the virtual machine scale set level. The underlying VMs may still be associated with the group, depending on the upgrade policy set for the scale set. 

1. Open [Azure portal](https://portal.azure.com)
1. Go to your virtual machine scale set and select **Overview**
1. Select **Stop** 
    1. At this point in the process, the VMs in the scale set are still associated with the Capacity Reservation Group and are reflected in the `virtualMachinesAssociated` property of the Capacity Reservation 

Upgrade policies: 
- **Automatic Upgrade** – In this mode, VMs are automatically dissociated from the Capacity Reservation Group without any further action from you. With Automatic Upgrade, all the VMs can be brought down and updated at the same time.   
- **Rolling Upgrade** – In this mode, VMs are dissociated from the Capacity Reservation Group without any further action from you. They're updated in batches with an optional pause time between batches. 
- **Manual Upgrade** – In this mode, nothing happens to the VM when the virtual machine scale set is updated. You'll need to do individually remove each VM by [upgrading them with the latest Scale Set model](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-scale-set.md).

### [PowerShell](#tab/powershell1)

1. Deallocate the virtual machine scale set. The following will deallocate all virtual machines within the scale set: 

    ```powershell-interactive
    Stop-AzVmss
    -ResourceGroupName "myResourceGroup"
    -VMScaleSetName "myVmss"
    ```

1. Update the scale set to remove association with the Capacity Reservation Group. Setting the `CapacityReservationGroupId` property to empty removes the association of scale set to the Capacity Reservation Group: 

    ```powershell-interactive
    $vmss =
    Get-AzVmss
    -ResourceGroupName "myResourceGroup"
    -VMScaleSetName "myVmss"
    
    Update-AzVmss
    -ResourceGroupName "myResourceGroup"
    -VMScaleSetName "myvmss"
    -VirtualMachineScaleSet $vmss
    -CapacityReservationGroupId ""
    ```

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Update the reserved quantity to zero 

The second option involves updating the reserved quantity to zero and then changing the Capacity Reservation Group property.

This option works well when the virtual machine scale set can’t be deallocated and when a reservation is no longer needed. For example, you may create a capacity reservation to temporarily assure capacity during a large-scale deployment. Once completed, the reservation is no longer needed. 

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

1. Update the virtual machine scale set to remove the association with the Capacity Reservation Group

    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMScaleSetName}/update?api-version=2021-04-01
    ```

    In the request body, set the `capacityReservationGroup` property to empty to remove the association:
    
    ```json
    {
   "location":"eastus",
   "properties":{
        "virtualMachineProfile":{
            "capacityReservation":{
                "capacityReservationGroup":{  
                }
            }
        }
    }
    }
    ```

### [Portal](#tab/portal2)

<!-- no images necessary if steps are straightforward --> 

Currently, Capacity Reservation for Uniform virtual machine scale sets isn't supported in Azure portal. The following steps will only remove the association of the Capacity Reservation Group at the virtual machine scale set level. The underlying VMs may still be associated with the group, depending on the upgrade policy set for the scale set.

1. Open [Azure portal](https://portal.azure.com)
1. Go to your Capacity Reservation Group and select **Overview**
1. Select **Reservations** 
1. Select **Manage Reservation** at the top of the page 
1. On the *Manage Reservations* blade:
    1. Enter `0` in the **Instances** field
    1. Select **Save** 
1. For a multi-zonal scale sets, update the **Instances** (reserved quantity) to zero for all the member Capacity Reservations

Upgrade policies: 
- **Automatic Upgrade** – In this mode, VMs are automatically dissociated from the Capacity Reservation Group without any further action from you. With Automatic Upgrade, all the VMs can be brought down and updated at the same time.   
- **Rolling Upgrade** – In this mode, VMs are dissociated from the Capacity Reservation Group without any further action from you. They're updated in batches with an optional pause time between batches. 
- **Manual Upgrade** – In this mode, nothing happens to the VM when the virtual machine scale set is updated. You'll need to do individually remove each VM by [upgrading them with the latest Scale Set model](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-scale-set.md).

### [PowerShell](#tab/powershell2)

1. Update reserved quantity to zero:

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

2. Update the scale set to remove association with Capacity Reservation Group by setting the `CapacityReservationGroupId` property to empty: 

    ```powershell-interactive
    $vmss =
    Get-AzVmss
    -ResourceGroupName "myResourceGroup"
    -VMScaleSetName "myVmss"
    
    Update-AzVmss
    -ResourceGroupName "myResourceGroup"
    -VMScaleSetName "myvmss"
    -VirtualMachineScaleSet $vmss
    -CapacityReservationGroupId ""
    ```

To learn more, go to [Azure PowerShell commands for Capacity Reservation]().

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Next steps

> [!div class="nextstepaction"]
> [Learn about overallocating a Capacity Reservation](capacity-reservation-overallocate.md)