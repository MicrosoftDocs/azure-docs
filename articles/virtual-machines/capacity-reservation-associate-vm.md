---
title: Associate a virtual machine to a Capacity Reservation group (preview)
description: Learn how to associate a new or existing virtual machine to a Capacity Reservation group.
author: vargupt
ms.author: vargupt
ms.service: virtual-machines #Required
ms.topic: how-to
ms.date: 07/30/2021
ms.reviewer: cynthn, jushiman
ms.custom: template-how-to
---

# Associate a VM to a Capacity Reservation group (preview) 

This article walks you through the steps of associating a new or existing virtual machine to a Capacity Reservation Group. To learn more about capacity reservations, see the [overview article](capacity-reservation-overview.md). 

> [!IMPORTANT]
> Capacity Reservation is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Associate a new VM

To associate a new VM to the Capacity Reservation Group, the group must be explicitly referenced as a property of the virtual machine you are trying to associate. This protects the matching reservation in the group from accidental consumption by less critical applications and workloads that are not intended to use it.  

### [API](#tab/api)

To add the `capacityReservationGroup` property to a VM, construct the following PUT request to the *Microsoft.Compute* provider:

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{VirtualMachineName}?api-version=2021-04-01
```

In the request body, include the `capacityReservationGroup` property as shown below:

```json
{ 
  "location": "eastus", 
  "properties": { 
    "hardwareProfile": { 
      "vmSize": "Standard_D2s_v3" 
    }, 
    … 
   “CapacityReservation”:{ 
    “capacityReservationGroup”:{ 
        “id”:”subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}” 
    } 
    "storageProfile": { 
    … 
    }, 
    "osProfile": { 
    … 
    }, 
    "networkProfile": { 
     …     
    } 
  } 
} 
```

### [Portal](#tab/portal)

<!-- no images necessary if steps are straightforward --> 

1. Open [Azure portal](https://portal.azure.com)
1. In the search bar, type **Capacity Reservation Groups**
1. Select **Capacity Reservation Groups** from the options
1. Select **Create**

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Associate an existing VM 

While Capacity Reservation is in preview, in order to associate an existing VM to a Capacity Reservation Group, it is required to first deallocate the VM and then do the association at the time of reallocation. This ensures that the VM consumes one of the empty spots in the reservation. 

Refer to the steps above on how to associate a VM to a Capacity Reservation Group.


## View VM association with Instance View 

Once the `capacityReservationGroup` property is set, an association now exists between the VM and the group. Azure automatically finds the matching capacity reservation in the group and consumes a reserved slot. The Capacity Reservation’s *Instance View* will reflect the new VM in the `virtualMachinesAllocated` property as shown below: 

```rest
GET Instance View https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{capacityReservationGroupName}/capacityReservations/{capacityReservationName}?$expand=instanceView&api-version=2021-04-01 
```

```json
{ 
    "name": "{capacityReservationName}", 
    "id": "/subscriptions/{susbscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{capacityReservationName}", 
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
        "provisioningState": "Succeeded", 
        "instanceView": { 
            "utilizationInfo": { 
                "virtualMachinesAllocated": [ 
                            { 
                                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{VirtualMachineName}" 
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
    } 
} 
``` 


## Next steps

> [!div class="nextstepaction"]
> [Remove a VMs association to a Capacity Reservation Group](capacity-reservation-remove-vm.md)