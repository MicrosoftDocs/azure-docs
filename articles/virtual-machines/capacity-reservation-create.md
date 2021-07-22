---
title: Create a Capacity Reservation in Azure (preview)
description: Learn how to reserve Compute capacity in an Azure region or an Availability Zone by creating a Capacity Reservation.
author: vargupt
ms.author: vargupt
ms.service: virtual-machines #Required
ms.topic: how-to
ms.date: 07/30/2021
ms.reviewer: cynthn, jushiman
ms.custom: template-how-to
---

# Create a Capacity Reservation (preview)

Capacity Reservation is always created as part of a Capacity Reservation Group. Therefore, the first step is to create a group, if a suitable one doesn’t exist already, and then create reservations. Once successfully created, reservations are immediately available for use with virtual machines. The capacity is reserved for your use as long as the reservation is not deleted.     

A well-formed request for capacity reservation group should always succeed as it does not reserve any capacity. It just acts as a container for reservations. However, a request for capacity reservation could fail if you do not have the required quota for the VM series or if Azure doesn’t have enough capacity to fulfill the request. Either request more quota or try a different VM size, location, or zone combination. 

A Capacity Reservation creation succeeds or fails in its entirety. For a request to reserve 10 instances, success is returned only if all 10 could be allocated. Otherwise, the capacity reservation creation will fail. 

> [!IMPORTANT]
> Capacity Reservation is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Considerations

The Capacity Reservation must meet the following rules: 
- The location parameter must match the location property for the parent Capacity Reservation Group. A mismatch will result in an error. 
- The VM size must be available in the target region. Otherwise, the reservation creation will fail. 
- The subscription must have sufficient approved quota equal or more than the quantity of VMs being reserved for the VM series and for the region overall. If needed, [request additional quota](https://docs.microsoft.com/azure/azure-portal/supportability/per-vm-quota-requests).
- Each Capacity Reservation Group can have exactly one reservation for a given VM size. For example, only one Capacity Reservation can be created for the VM size `Standard_D2s_v3`. Attempt to create a second reservation for `Standard_D2s_v3` in the same Capacity Reservation Group will result in an error. However, another reservation can be created in the same group for other VM sizes such `Standard_D4s_v3`, `Standard_D8s_v3` and so on. 
- For a group that supports zones, each reservation type is defined by the combination of **VM size** and **zone**. For example, one Capacity Reservation for `Standard_D2s_v3` in `Zone 1`, another Capacity Reservation for `Standard_D2s_v3` in `Zone 2`, and `Standard_D2s_v3` in `Zone 3` is supported. 


## [API](#tab/api)

1. Create a Capacity Reservation Group 

    To create a capacity reservation group, construct the following PUT request on *Microsoft.Compute* provider: 
    
    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{apacityReservationGroupName}&api-version=2021-04-01
    ``` 
    
    In the request body, include the following: 
    
    ```json
    { 
      "location":"eastus",
    } 
    ```
    
    This group is created to contain reservations for the US East location. 
    
    In this example, the group will support only regional reservations because zones were not specified at the time of creation. In order to create a zonal group, pass an additional parameter *zones* in the request body as shown below: 
    
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
    
    In the request body, include the following: 
    
    ```json
    { 
      "location": "eastus", 
      "sku": { 
        "name": "Standard_D2s_v3” 
        "capacity": 5, 
      }, 
     "tags": { 
            "environment": "testing" 
    } 
    ```
    
    The above request creates a reservation in the East US location for 5 quantities of the D2s_v3 VM size. 

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->

## [Portal](#tab/portal)

<!-- no images necessary if steps are straightforward --> 

1. Open [Azure portal](https://portal.azure.com)
1. In the search bar, type **Capacity Reservation Groups**
1. Select **Capacity Reservation Groups** from the options
1. Select **Create**
1. Under the *Basics* tab, create a Capacity Reservation Group:
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
1. Under the *Review + Create* tab, review your capacity reservation group information
1. Select **Create**

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->

## [ARM template](#tab/arm)

An ARM template is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. The template uses declarative syntax. In declarative syntax, you describe your intended deployment without writing the sequence of programming commands to create the deployment. 

ARM templates let you deploy groups of related resources. In a single template, you can create capacity reservation group and capacity reservations. You can deploy templates through the Azure portal, Azure CLI, or Azure PowerShell, or from continuous integration / continuous delivery (CI/CD) pipelines. 

If your environment meets the prerequisites and you're familiar with using ARM templates, use any of the following templates. 

- [Create Zonal Capacity Reservation](https://github.com/Azure/on-demand-capacity-reservation/blob/main/ZonalCapacityReservation.json)
- [Create VM with Capacity Reservation](https://github.com/Azure/on-demand-capacity-reservation/blob/main/VirtualMachineWithReservation.json)
- [Create Virtual Machine Scale Sets with Capacity Reservation](https://github.com/Azure/on-demand-capacity-reservation/blob/main/VirtualMachineScaleSetWithReservation.json)


--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->

## Check on your Capacity Reservation 

Once successfully created, the Capacity Reservation is immediately available for use with VMs: 

```rest
GET  
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{capacityReservationName}?api-version=2021-07-01 
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

## Next steps

> [!div class="nextstepaction"]
> [Learn how to modify your capacity reservation](capacity-reservation-modify.md)