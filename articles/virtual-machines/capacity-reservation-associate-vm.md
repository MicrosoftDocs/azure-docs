---
title: Associate a virtual machine to a Capacity Reservation group
description: Learn how to associate a new or existing virtual machine to a Capacity Reservation group.
author: bdeforeest
ms.author: bidefore
ms.service: virtual-machines
ms.topic: how-to
ms.date: 11/22/2022
ms.reviewer: cynthn, jushiman
ms.custom: template-how-to, devx-track-azurecli, devx-track-azurepowershell
---

# Associate a VM to a Capacity Reservation group

**Applies to:** :heavy_check_mark: Windows Virtual Machines :heavy_check_mark: Linux Virtual Machines 

Capacity reservation groups can be used with new or existing virtual machines. To learn more about Capacity Reservations, see the [overview article](capacity-reservation-overview.md). 

## Associate a new VM

To associate a new VM to the Capacity Reservation group, the group must be explicitly referenced as a property of the virtual machine. This reference protects the matching reservation in the group for applications and workloads intended to use it.

### [API](#tab/api1)

To add the `capacityReservationGroup` property to a VM, construct the following PUT request to the *Microsoft.Compute* provider:

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{VirtualMachineName}?api-version=2021-04-01
```

In the request body, include the `capacityReservationGroup` property:

```json
{ 
  "location": "eastus", 
  "properties": { 
    "hardwareProfile": { 
      "vmSize": "Standard_D2s_v3" 
    }, 
    … 
   "CapacityReservation":{ 
    "capacityReservationGroup":{ 
        "id":"subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}" 
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
1. Go to the *Advanced section*
1. In the **Capacity Reservations** dropdown, select the Capacity Reservation group that you want the VM to be associated with
1. Select the **Review + create** button 
1. After validation runs, select the **Create** button 
1. After the deployment is complete, select **Go to resource**

### [CLI](#tab/cli1)

Use `az vm create` to create a new VM and add the `capacity-reservation-group` property to associate it to an existing Capacity Reservation group. The following example creates a Standard_D2s_v3 VM in the East US location and associates the VM to a Capacity Reservation group.

```azurecli-interactive
az vm create 
--resource-group myResourceGroup 
--name myVM 
--location eastus 
--size Standard_D2s_v3 
--image Ubuntu2204 
--capacity-reservation-group /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{capacityReservationGroupName}
```

### [PowerShell](#tab/powershell1)

Use `New-AzVM` to create a new VM and add the `CapacityReservationGroupId` property to associate it to an existing Capacity Reservation group. The following example creates a Standard_D2s_v3 VM in the East US location and associate the VM to a Capacity Reservation group.

```powershell-interactive
New-AzVm
-ResourceGroupName "myResourceGroup"
-Name "myVM"
-Location "eastus"
-VirtualNetworkName "myVnet"
-SubnetName "mySubnet"
-SecurityGroupName "myNetworkSecurityGroup"
-PublicIpAddressName "myPublicIpAddress"
-Size "Standard_D2s_v3"
-CapacityReservationGroupId "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{capacityReservationGroupName}"
```

To learn more, go to Azure PowerShell command [New-AzVM](/powershell/module/az.compute/new-azvm).

### [ARM template](#tab/arm1)

An [ARM template](../azure-resource-manager/templates/overview.md) is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. The template uses declarative syntax. In declarative syntax, you describe your intended deployment without writing the sequence of programming commands to create the deployment. 

ARM templates let you deploy groups of related resources. In a single template, you can create Capacity Reservation group and capacity reservations. You can deploy templates through the Azure portal, Azure CLI, or Azure PowerShell, or from continuous integration/continuous delivery (CI/CD) pipelines. 

If your environment meets the prerequisites and you're familiar with using ARM templates, use this [Create VM with Capacity Reservation](https://github.com/Azure/on-demand-capacity-reservation/blob/main/VirtualMachineWithReservation.json) template. 


--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Associate an existing VM 

For the initial release of Capacity Reservation, a virtual machine must be allocated to a capacity reservation. 

- If not already complete, follow guidance to create a capacity reservation group and capacity reservation. Or increment the quantity of an existing capacity reservation so there's unused reserved capacity. 
- Deallocate the VM. 
- Update the capacity reservation group property on the VM.
- Restart the VM. 

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
1. Select **Overview**
1. Select **Stop** at the top of the page to deallocate the VM 
1. Go to **Configurations** on the left
1. In the **Capacity Reservation group** dropdown, select the group that you want the VM to be associated with 

### [CLI](#tab/cli2)

1. Deallocate the VM

    ```azurecli-interactive
    az vm deallocate 
    -g myResourceGroup 
    -n myVM
    ```

1. Associate the VM to a Capacity Reservation group

    ```azurecli-interactive
    az vm update 
    -g myresourcegroup 
    -n myVM 
    --capacity-reservation-group subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{CapacityReservationGroupName}
    ```

### [PowerShell](#tab/powershell2)

1. Deallocate the VM

    ```powershell-interactive
    Stop-AzVM
    -ResourceGroupName "myResourceGroup"
    -Name "myVM"
    ```

1. Associate the VM to a Capacity Reservation group

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

To learn more, go to Azure PowerShell commands [Stop-AzVM](/powershell/module/az.compute/stop-azvm), [Get-AzVM](/powershell/module/az.compute/get-azvm), and [Update-AzVM](/powershell/module/az.compute/update-azvm).

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## View VM association with Instance View 

Once the `capacityReservationGroup` property is set, an association now exists between the VM and the group. Azure automatically finds the matching Capacity Reservation in the group and consumes a reserved slot. The Capacity Reservation’s *Instance View* will reflect the new VM in the `virtualMachinesAllocated` property: 

### [API](#tab/api3)

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{capacityReservationGroupName}?$expand=instanceView&api-version=2021-04-01 
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

### [CLI](#tab/cli3)

```azurecli-interactive
az capacity reservation show 
-g myResourceGroup
-c myCapacityReservationGroup 
-n myCapacityReservation 
```

### [PowerShell](#tab/powershell3)

```powershell-interactive
$CapRes=
Get-AzCapacityReservation
-ResourceGroupName <"ResourceGroupName">
-ReservationGroupName] <"CapacityReservationGroupName">
-Name <"CapacityReservationName">
-InstanceView

$CapRes.InstanceView.Utilizationinfo.VirtualMachinesAllocated
```

To learn more, go to Azure PowerShell command [Get-AzCapacityReservation](/powershell/module/az.compute/get-azcapacityreservation).


### [Portal](#tab/portal3)

1. Open [Azure portal](https://portal.azure.com)
1. Go to your Capacity Reservation group
1. Select **Resources** under **Settings** on the left
1. Look at the table to see all the VMs that are associated with the Capacity Reservation group  

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Next steps

> [!div class="nextstepaction"]
> [Remove a VMs association to a Capacity Reservation group](capacity-reservation-remove-vm.md)
