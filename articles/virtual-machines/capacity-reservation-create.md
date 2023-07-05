---
title: Create a Capacity Reservation in Azure
description: Learn how to reserve Compute capacity in an Azure region or an Availability Zone by creating a Capacity Reservation.
author: bdeforeest
ms.author: bidefore
ms.service: virtual-machines
ms.topic: how-to
ms.date: 04/24/2023
ms.reviewer: cynthn, jushiman, mattmcinnes
ms.custom: template-how-to, devx-track-azurecli, devx-track-azurepowershell
---

# Create a Capacity Reservation

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Uniform scale set :heavy_check_mark: Flexible scale sets

Capacity Reservation is always created as part of a Capacity Reservation group. The first step is to create a group if a suitable one doesn’t exist already, then create reservations. Once successfully created, reservations are immediately available for use with virtual machines. The capacity is reserved for your use as long as the reservation isn't deleted.     

A well-formed request for Capacity Reservation group should always succeed as it doesn't reserve any capacity. It just acts as a container for reservations. However, a request for Capacity Reservation could fail if you don't have the required quota for the VM series or if Azure doesn’t have enough capacity to fulfill the request. Either request more quota or try a different VM size, location, or zone combination. 

A Capacity Reservation creation succeeds or fails in its entirety. For a request to reserve 10 instances, success is returned only if all 10 could be allocated. Otherwise, the Capacity Reservation creation fails. 


## Considerations

The Capacity Reservation must meet the following rules: 
- The location parameter must match the location property for the parent Capacity Reservation group. A mismatch results in an error. 
- The VM size must be available in the target region. Otherwise, the reservation creation fails. 
- The subscription must have available quota equal to or more than the quantity of VMs being reserved for the VM series and for the region overall. If needed, [request more quota](../azure-portal/supportability/per-vm-quota-requests.md). 
    - As needed to satisfy existing quota limits, single VMs can be done in stages. Create a capacity reservation with a smaller quantity and reallocate that quantity of virtual machines. This frees up quota to increase the quantity reserved and add more virtual machines. Alternatively, if the subscription uses different VM sizes in the same series, reserve and redeploy VMs for the first size. Then add a reservation to the group for another size and redeploy the VMs for the new size to the reservation group. Repeat until complete. 
    - For Scale Sets, available quota is required unless the Scale Set or you delete its VM instances, capacity is reserved, and the Scale Set instances are added using reserved capacity. If the Scale Set is updated using blue green deployment, then reserve the capacity and deploy the new Scale Set to the reserved capacity at the next update. 
- Each Capacity Reservation group can have exactly one reservation for a given VM size. For example, only one Capacity Reservation can be created for the VM size `Standard_D2s_v3`. Attempt to create a second reservation for `Standard_D2s_v3` in the same Capacity Reservation group results in an error. However, another reservation can be created in the same group for other VM sizes, such as `Standard_D4s_v3`, `Standard_D8s_v3`, and so on.  
- For a Capacity Reservation group that supports zones, each reservation type is defined by the combination of **VM size** and **zone**. For example, one Capacity Reservation for `Standard_D2s_v3` in `Zone 1`, another Capacity Reservation for `Standard_D2s_v3` in `Zone 2`, and a third Capacity Reservation for `Standard_D2s_v3` in `Zone 3` is supported.


## Checking VM sizes available for Capacity Reservation in a region

Before creating capacity reservation, VM sizes available for reservation can be checked for a particular region.

 
### [Portal](#tab/portal1)

<!-- no images necessary if steps are straightforward --> 

1. Open [Azure portal](https://portal.azure.com)
1. In the search bar, type **Capacity Reservation groups**
1. Select **Capacity Reservation groups** from the options
1. Select **Create**
1. Under the *Basics* tab, create a Capacity Reservation group:
    1. Select a **Subscription**
    1. Select or create a **Resource group**
    1. **Name** your group 
    1. Select a **Region** 
    1. Optionally select **Availability zones** or opt not to specify any zones and allow Azure to choose for you
1. Select **Next**
1. On VM size, click on **See all sizes** to check what VM sizes are available for Capacity Reservation

  ### [CLI](#tab/cli1)

Before you create a capacity reservation, you can check the reservation available VM sizes for the region selected. The following example lists the capacity reservation available VM sizes in East US location using Azure CLI:

   ```azurecli-interactive
    az vm list-skus -l eastus --resource-type virtualMachines --query "[?contains(capabilities[?name == 'CapacityReservationSupported' && value == 'True'].name,'CapacityReservationSupported')].name"
   ```
 ### [PowerShell](#tab/powershell1)

Before you create a capacity reservation, you can check the reservation available VM sizes for the region selected using Get-AzComputeResourceSku for Capability property for Resource type Virtual Machines. The following example lists the capacity reservation available VM sizes in East US location:

   ```powershell-interactive
    $vmsizes = Get-AzComputeResourceSku -Location eastus | where {$_.ResourceType -eq "virtualMachines"}
    foreach($vmsize in $vmsizes) { foreach($capability in $vmsize.capabilities) {  if($capability.Name -eq 'CapacityReservationSupported' -and $capability.Value -eq 'true'){ $vmsize.name  } } }
   ```
--- 
<!-- The three dashes above show that your section of tabbed content is complete. Do not remove them :) -->

## Create a Capacity Reservation 

### [API](#tab/api1)

1. Create a Capacity Reservation group 

    To create a Capacity Reservation group, construct the following PUT request on *Microsoft.Compute* provider: 
    
    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}&api-version=2021-04-01
    ``` 
    
    In the request body, include the following parameter: 
    
    ```json
    { 
      "location":"eastus"
    } 
    ```
    
    This group is created to contain reservations for the US East location. 
    
    The group in the following example only supports regional reservations, because zones weren't specified at the time of creation. To create a zonal group, pass an extra parameter *zone* in the request body: 
    
    ```json
    { 
      "location":"eastus",
      "zones": ["1", "2", "3"] 
    } 
    ```
 
1. Create a Capacity Reservation 

    To create a reservation, construct the following PUT request on *Microsoft.Compute* provider: 
    
    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{capacityReservationName}?api-version=2021-04-01 
    ```
    
    In the request body, include the following parameters: 
    
    ```json
    { 
      "location": "eastus", 
      "sku": { 
        "name": "Standard_D2s_v3", 
        "capacity": 5 
      }, 
     "tags": { 
            "environment": "testing" 
    } 
    ```
    
    The above request creates a reservation in the East US location for five quantities of the D2s_v3 VM size. 


### [Portal](#tab/portal2)

<!-- no images necessary if steps are straightforward --> 

1. Open [Azure portal](https://portal.azure.com)
1. In the search bar, type **Capacity Reservation groups**
1. Select **Capacity Reservation groups** from the options
1. Select **Create**
1. Under the *Basics* tab, create a Capacity Reservation group:
    1. Select a **Subscription**
    1. Select or create a **Resource group**
    1. **Name** your group 
    1. Select a **Region** 
    1. Optionally select **Availability zones** or opt not to specify any zones and allow Azure to choose for you
1. Select **Next**
1. Under the *Reservations* tab, create at least one Capacity Reservation:
    1. Give each reservation a **Reservation Name**, the quantity of VM **Instances**, and select a unique **VM size**
    1. The *Cost/month* column will display billing information based on your selections
1. Select **Next**
1. Under the *Tags* tab, optionally create tags
1. Select **Next** 
1. Under the *Review + Create* tab, review your Capacity Reservation group information
1. Select **Create**


### [CLI](#tab/cli2)

1. Before you can create a Capacity Reservation, create a resource group with `az group create`. The following example creates a resource group *myResourceGroup* in the East US location.

    ```azurecli-interactive
    az group create 
    -l eastus 
    -g myResourceGroup
    ```

1. Now create a Capacity Reservation group with `az capacity reservation group create`. The following example creates a group *myCapacityReservationGroup* in the East US location for all three availability zones.

    ```azurecli-interactive
    az capacity reservation group create 
    -n myCapacityReservationGroup 
    -l eastus 
    -g myResourceGroup 
    --zones 1 2 3 
    ```

1. Once the Capacity Reservation group is created, create a new Capacity Reservation with `az capacity reservation create`. The following example creates *myCapacityReservation* for five quantities of Standard_D2s_v3 VM size in Zone 1 of East US location.

    ```azurecli-interactive
    az capacity reservation create 
    -c myCapacityReservationGroup 
    -n myCapacityReservation 
    -l eastus 
    -g myResourceGroup 
    --sku Standard_D2s_v3 
    --capacity 5 
    --zone 1
    ```

### [PowerShell](#tab/powershell2)

1. Before you can create a Capacity Reservation, create a resource group with `New-AzResourceGroup`. The following example creates a resource group *myResourceGroup* in the East US location.

    ```powershell-interactive
    New-AzResourceGroup
    -ResourceGroupName "myResourceGroup"
    -Location "eastus"
    ```

1. Now create a Capacity Reservation group with `New-AzCapacityReservationGroup`. The following example creates a group *myCapacityReservationGroup* in the East US location for all three availability zones.

    ```powershell-interactive
    New-AzCapacityReservationGroup
    -ResourceGroupName "myResourceGroup"
    -Location "eastus"
    -Zone "1","2","3"
    -Name "myCapacityReservationGroup"
    ```

1. Once the Capacity Reservation group is created, create a new Capacity Reservation with `New-AzCapacityReservation`. The following example creates *myCapacityReservation* for five quantities of Standard_D2s_v3 VM size in Zone 1 of East US location.

    ```powershell-interactive
    New-AzCapacityReservation
    -ResourceGroupName "myResourceGroup"
    -Location "eastus"
    -Zone "1"
    -ReservationGroupName "myCapacityReservationGroup"
    -Name "myCapacityReservation"
    -Sku "Standard_D2s_v3"
    -CapacityToReserve 5
    ```

To learn more, go to Azure PowerShell commands [New-AzResourceGroup](/powershell/module/az.Resources/new-azresourcegroup), [New-AzCapacityReservationGroup](/powershell/module/az.compute/new-azcapacityreservationgroup), and [New-AzCapacityReservation](/powershell/module/az.compute/new-azcapacityreservation).


### [ARM template](#tab/arm1)

An [ARM template](../azure-resource-manager/templates/overview.md) is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. The template uses declarative syntax. In declarative syntax, you describe your intended deployment without writing the sequence of programming commands to create the deployment. 

ARM templates let you deploy groups of related resources. In a single template, you can create Capacity Reservation group and Capacity Reservations. You can deploy templates through the Azure portal, Azure CLI, or Azure PowerShell, or from continuous integration/continuous delivery (CI/CD) pipelines. 

If your environment meets the prerequisites and you're familiar with using ARM templates, use any of the following templates: 

- [Create Zonal Capacity Reservation](https://github.com/Azure/on-demand-capacity-reservation/blob/main/ZonalCapacityReservation.json)
- [Create VM with Capacity Reservation](https://github.com/Azure/on-demand-capacity-reservation/blob/main/VirtualMachineWithReservation.json)
- [Create Virtual Machine Scale Sets with Capacity Reservation](https://github.com/Azure/on-demand-capacity-reservation/blob/main/VirtualMachineScaleSetWithReservation.json)


--- 
<!-- The three dashes above show that your section of tabbed content is complete. Do not remove them :) -->

## Check on your Capacity Reservation 

Once successfully created, the Capacity Reservation is immediately available for use with VMs. 

### [API](#tab/api2)

```rest
GET  
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{capacityReservationName}?api-version=2021-04-01
```
 
```json
{ 
    "name": "<CapacityReservationName>", 
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{CapacityReservationName}", 
    "type": "Microsoft.Compute/capacityReservationGroups/capacityReservations", 
    "location": "eastus", 
    "tags": { 
        "environment": "testing" 
    }, 
    "sku": { 
        "name": "Standard_D2s_v3", 
        "capacity": 5 
    }, 
    "properties": { 
        "reservationId": "<reservationId>", 
         "provisioningTime": "<provisioningTime>", 
         "provisioningState": "Updating" 
    } 
} 
```

### [CLI](#tab/cli3)

 ```azurecli-interactive
 az capacity reservation show 
 -c myCapacityReservationGroup 
 -n myCapacityReservation 
 -g myResourceGroup
 ```

### [PowerShell](#tab/powershell3)

Check on your Capacity Reservation:

```powershell-interactive
Get-AzCapacityReservation
-ResourceGroupName <"ResourceGroupName">
-ReservationGroupName <"CapacityReservationGroupName">
-Name <"CapacityReservationName">
```

To find the VM size and the quantity reserved, use the following command: 

```powershell-interactive
$CapRes =
Get-AzCapacityReservation
-ResourceGroupName <"ResourceGroupName">
-ReservationGroupName <"CapacityReservationGroupName">
-Name <"CapacityReservationName">

$CapRes.sku
```

To learn more, go to Azure PowerShell command [Get-AzCapacityReservation](/powershell/module/az.compute/get-azcapacityreservation).

### [Portal](#tab/portal3)

1. Open [Azure portal](https://portal.azure.com)
1. In the search bar, type **Capacity Reservation groups**
1. Select **Capacity Reservation groups** from the options
1. From the list, select the Capacity Reservation group name you just created
1. Select **Overview** 
1. Select **Reservations**
1. In this view, you are able to see all the reservations in the group along with the VM size and quantity reserved
--- 
<!-- The three dashes above show that your section of tabbed content is complete. Do not remove them :) -->

## Next steps

> [!div class="nextstepaction"]
> [Learn how to modify your Capacity Reservation](capacity-reservation-modify.md)
