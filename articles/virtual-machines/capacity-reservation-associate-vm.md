---
title: Associate a virtual machine to a Capacity Reservation group (preview)
description: Learn how to associate a new or existing virtual machine to a Capacity Reservation group.
author: vargupt
ms.author: vargupt
ms.service: virtual-machines #Required
ms.topic: how-to
ms.date: 08/09/2021
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

To associate a new VM to the Capacity Reservation Group, the group must be explicitly referenced as a property of the virtual machine you're trying to associate. This reference protects the matching reservation in the group from accidental consumption by less critical applications and workloads that aren't intended to use it.  

### [API](#tab/api1)

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

### [Portal](#tab/portal1)

<!-- no images necessary if steps are straightforward --> 

1. Open [Azure portal](https://portal.azure.com)
1. In the search bar, type **virtual machine**
1. Under *Services*, select **Virtual machines**
1. On the *Virtual machines* page, select **Create** and then select **Virtual machine**
1. In the *Basics* tab, under *Project details*, select the correct **subscription** and then choose to create a new **resource group** or use an existing one
1. Under *Instance details*, type in the virtual machine **Name** and choose your **Region**
1. Choose an **Image** and the **VM size**
1. Under *Administrator account*, provide a **username** and a **password**
    1. The password must be at least 12 characters long and meet the defined complexity requirements
1. Under *Inbound port rules*, choose **Allow selected ports** and then select **RDP** (3389) and **HTTP** (80) from the drop-down
1. Go to the *Advanced section*
1. In the **Capacity Reservations** dropdown, select the capacity reservation group that you want the VM to be associated with
1. Select the **Review + create** button 
1. After validation runs, select the **Create** button 
1. After the deployment is complete, select **Go to resource**


### [PowerShell](#tab/powershell1)

Use `New-AzVM` to create a new VM and add the `CapacityReservationGroupId` property to associate it to an existing capacity reservation group. The example below creates a Standard_D2s_v3 VM in the East US location and associate the VM to a capacity reservation group.

```powershell-interactive
New-AzVm
-ResourceGroupName "myResourceGroup"
-Name "myVM"
-Location "eastus"
-VirtualNetworkName "myVnet"
-SubnetName "mySubnet"
-SecurityGroupName "myNetworkSecurityGroup"
-PublicIpAddressName "myPublicIpAddress"
-OpenPorts 80,3389
-Size "Standard_D2s_v3"
-CapacityReservationGroupId "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{capacityReservationGroupName}"
```

To learn more, go to [Azure PowerShell commands for Capacity Reservation]().

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Associate an existing VM 

While Capacity Reservation is in preview, to associate an existing VM to a Capacity Reservation Group, it is required to first deallocate the VM and then do the association at the time of reallocation. This process ensures the VM consumes one of the empty spots in the reservation. 

### [API](#tab/api2)

1. Deallocate the VM. 

    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourcegroupname}/providers/Microsoft.Compute/virtualMachines/{VirtualMachineName}/deallocate?api-version=2021-04-01
    ```

1. Add the `capacityReservationGroup` property to the VM. Construct the following PUT request to *Microsoft.Compute* provider:

    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{VirtualMachineName}?api-version=2021-04-01
    ```

    In the request body, include the `capacityReservationGroup` property: 
    
    ```json
    {
    "location": "eastus",
    "properties": {
        "capacityReservation": {
            "capacityReservationGroup": {
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{capacityReservationGroupName}"
            }
        }
    }
    }
    ```


### [Portal](#tab/portal2)

1. Open [Azure portal](https://portal.azure.com)
1. Go to your virtual machine
1. Select **Overview** on the left
1. Select **Stop** at the top of the page to deallocate the VM 
1. Go to **Configurations** on the left
1. In the **Capacity Reservation Group** dropdown, select the group that you want the VM to be associated with 


### [PowerShell](#tab/powershell2)

1. Deallocate the VM

    ```powershell-interactive
    Stop-AzVM
    -ResourceGroupName "myResourceGroup"
    -Name "myVM"
    ```

1. Associate the VM to a capacity reservation group

    ```powershell-interactive
    $VirtualMachine =
    Get-AzVM
    -ResourceGroupName "myResourceGroup"
    -Name "myVM"
    
    Update-AzVM
    -ResourceGroupName "myResourceGroup"
    -VM $VirtualMachine
    -CapacityReservationGroupId "subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{CapacityReservationGroupName}"
    ```

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## View VM association with Instance View 

Once the `capacityReservationGroup` property is set, an association now exists between the VM and the group. Azure automatically finds the matching capacity reservation in the group and consumes a reserved slot. The Capacity Reservation’s *Instance View* will reflect the new VM in the `virtualMachinesAllocated` property as shown below: 

### [API](#tab/api3)

```rest
GET Instance View https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{capacityReservationGroupName}?$expand=instanceView&api-version=2021-04-01 
```

```json
{
   "name":"{CapacityReservationGroupName}",
   "id":"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{CapacityReservationGroupName}",
   "type":"Microsoft.Compute/capacityReservationGroups",
   "location":"eastus",
   "properties":{
      "capacityReservations":[
         {
            "id":"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/ {CapacityReservationGroupName}/capacityReservations/{CapacityReservationName}"
         }
      ],
      "virtualMachinesAssociated":[
         {
            "id":"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{myVM}"
         }
      ],
      "instanceView":{
         "capacityReservations":[
            {
               "name":"{CapacityReservationName}",
               "utilizationInfo":{
                  "virtualMachinesAllocated":[
                     {
                        "id":"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{myVM}"
                     }
                  ]
               },
               "statuses":[
                  {
                     "code":"ProvisioningState/succeeded",
                     "level":"Info",
                     "displayStatus":"Provisioning succeeded",
                     "time":"2021-05-25T15:12:10.4165243+00:00"
                  }
               ]
            }
         ]
      }
   }
} 
``` 
### [PowerShell](#tab/powershell3)

```powershell-interactive
$CapRes=
Get-AzCapacityReservation
-ResourceGroupName <”ResourceGroupName”>
-ReservationGroupName] <"CapacityReservationGroupName">
-Name <"CapacityReservationName">
-InstanceView

$CapRes. InstanceView.Utilizationinfo.VirtualMachinesAllocated
```
--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Next steps

> [!div class="nextstepaction"]
> [Remove a VMs association to a Capacity Reservation Group](capacity-reservation-remove-vm.md)