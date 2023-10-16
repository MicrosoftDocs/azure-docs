---
title: Associate a Virtual Machine Scale Set with uniform orchestration to a Capacity Reservation group
description: Learn how to associate a new or existing virtual machine scale with uniform orchestration set to a Capacity Reservation group.
author: bdeforeest
ms.author: bidefore
ms.service: virtual-machines
ms.topic: how-to
ms.date: 11/22/2022
ms.reviewer: cynthn, jushiman
ms.custom: template-how-to, devx-track-azurecli, devx-track-azurepowershell
---

# Associate a Virtual Machine Scale Set with uniform orchestration to a Capacity Reservation group

**Applies to:** :heavy_check_mark: Uniform scale set

Virtual Machine Scale Sets have two modes: 

- **Uniform Orchestration Mode:** In this mode, Virtual Machine Scale Sets use a VM profile or a template to scale up to the desired capacity. While there is some ability to manage or customize individual VM instances, Uniform uses identical VM instances. These instances are exposed through the Virtual Machine Scale Sets VM APIs and are not compatible with the standard Azure IaaS VM API commands. Since the scale set performs all the actual VM operations, reservations are associated with the Virtual Machine Scale Set directly. Once the scale set is associated with the reservation, all the subsequent VM allocations are done against the reservation. 
- **Flexible Orchestration Mode:** In this mode, you get more flexibility managing the individual Virtual Machine Scale Set VM instances as they can use the standard Azure IaaS VM APIs instead of using the scale set interface. To use reservations with flexible orchestration mode, define both the Virtual Machine Scale Set property and the capacity reservation property on each virtual machine.

To learn more about these modes, go to [Virtual Machine Scale Sets Orchestration Modes](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md). 

This content applies to the uniform orchestration mode. For flexible orchestration mode, go to [Associate a Virtual Machine Scale Set with flexible orchestration to a Capacity Reservation group](capacity-reservation-associate-virtual-machine-scale-set-flex.md)


## Limitations of scale sets in Uniform Orchestration 

- For Virtual Machine Scale Sets in Uniform orchestration to be compatible with Capacity Reservation, the `singlePlacementGroup` property must be set to *False*. 
- The **Static Fixed Spreading** availability option for multi-zone Uniform scale sets is not supported with Capacity Reservation. This option requires use of 5 Fault Domains while the reservations only support up to 3 Fault Domains for general purpose sizes. The recommended approach is to use the **Max Spreading** option that spreads VMs across as many FDs as possible within each zone. If needed, configure a custom Fault Domain configuration of 3 or less. 

There are some other restrictions while using Capacity Reservation. For the complete list, refer the [Capacity Reservations overview](capacity-reservation-overview.md).  

## Associate a new Virtual Machine Scale Set to a Capacity Reservation group


### [API](#tab/api1)  

To associate a new Uniform Virtual Machine Scale Set to a Capacity Reservation group, construct the following PUT request to the *Microsoft.Compute* provider:

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMScaleSetName}?api-version=2021-04-01
```

Add the `capacityReservationGroup` property in the `virtualMachineProfile` property: 

```json
{ 
    "name": "<VMScaleSetName>", 
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMScaleSetName}", 
    "type": "Microsoft.Compute/virtualMachineScaleSets", 
    "location": "eastus", 
    "sku": { 
        "name": "Standard_D2s_v3", 
        "tier": "Standard", 
        "capacity": 3 
}, 
"properties": { 
    "virtualMachineProfile": { 
        "capacityReservation": { 
            "capacityReservationGroup":{ 
                "id":"subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroup/{CapacityReservationGroupName}" 
            } 
         }, 
        "osProfile": { 
            … 
        }, 
        "storageProfile": { 
            … 
        }, 
        "networkProfile": { 
            …,
            "extensionProfile": { 
                … 
            } 
        } 
    } 
```

### [CLI](#tab/cli1)

Use `az vmss create` to create a new Virtual Machine Scale Set and add the `capacity-reservation-group` property to associate the scale set to an existing Capacity Reservation group. The following example creates a Uniform scale set for a Standard_Ds1_v2 VM in the East US location and associates the scale set to a Capacity Reservation group.

```azurecli-interactive
az vmss create 
--resource-group myResourceGroup 
--name myVMSS 
--location eastus 
--vm-sku Standard_Ds1_v2 
--image Ubuntu2204 
--capacity-reservation-group /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{capacityReservationGroupName} 
```


### [PowerShell](#tab/powershell1) 

Use `New-AzVmss` to create a new Virtual Machine Scale Set and add the `CapacityReservationGroupId` property to associate the scale set to an existing Capacity Reservation group. The following example creates a Uniform scale set for a Standard_Ds1_v2 VM in the East US location and associates the scale set to a Capacity Reservation group.

```powershell-interactive
$vmssName = <"VMSSNAME">
$vmPassword = ConvertTo-SecureString <"PASSWORD"> -AsPlainText -Force
$vmCred = New-Object System.Management.Automation.PSCredential(<"USERNAME">, $vmPassword)
New-AzVmss
–Credential $vmCred
-VMScaleSetName $vmssName
-ResourceGroupName "myResourceGroup"
-CapacityReservationGroupId "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{capacityReservationGroupName}"
-PlatformFaultDomainCount 2
```

To learn more, go to Azure PowerShell command [New-AzVmss](/powershell/module/az.compute/new-azvmss).

### [ARM template](#tab/arm1)

An [ARM template](../azure-resource-manager/templates/overview.md) is a JavaScript Object Notation (JSrestON) file that defines the infrastructure and configuration for your project. The template uses declarative syntax. In declarative syntax, you describe your intended deployment without writing the sequence of programming commands to create the deployment. 

ARM templates let you deploy groups of related resources. In a single template, you can create Capacity Reservation group and Capacity Reservations. You can deploy templates through the Azure portal, Azure CLI, or Azure PowerShell, or from continuous integration/continuous delivery (CI/CD) pipelines. 

If your environment meets the prerequisites and you are familiar with using ARM templates, use this [Create Virtual Machine Scale Sets with Capacity Reservation](https://github.com/Azure/on-demand-capacity-reservation/blob/main/VirtualMachineScaleSetWithReservation.json) template. 

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->


## Associate an existing Virtual Machine Scale Set to Capacity Reservation group 

To add an existing Capacity Reservation Group to an existing Uniform Scale Set:

- Stop the Scale Set to deallocate the VM instances
- Update the Scale Set to use a matching Capacity Reservation Group
- Start the Scale Set

This process ensures the placement for the Capacity Reservations and Scale Set in the region are compatible.


### Important notes on Upgrade Policies 

- **Automatic Upgrade** – In this mode, the scale set VM instances are automatically associated with the Capacity Reservation group without any further action from you. When the scale set VMs are reallocated, they start consuming the reserved capacity.
- **Rolling Upgrade** – In this mode, scale set VM instances are associated with the Capacity Reservation group without any further action from you. However, they are updated in batches with an optional pause time between them. When the scale set VMs are reallocated, they start consuming the reserved capacity.
- **Manual Upgrade** – In this mode, nothing happens to the scale set VM instances when the Virtual Machine Scale Set is attached to a Capacity Reservation group. You need to update to each scale set VM by [upgrading it with the latest Scale Set model](../virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-policy.md).

### [API](#tab/api2)

1. Deallocate the Virtual Machine Scale Set. 

    ```rest
    POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourcegroupname}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMScaleSetName}/deallocate?api-version=2021-04-01
    ```

1. Add the `capacityReservationGroup` property to the scale set model. Construct the following PUT request to *Microsoft.Compute* provider:

    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourcegroupname}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMScaleSetName}?api-version=2021-04-01
    ```

    In the request body, include the `capacityReservationGroup` property:

    ```json
    "location": "eastus",
    "properties": {
        "virtualMachineProfile": {
             "capacityReservation": {
                      "capacityReservationGroup": {
                            "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{capacityReservationGroupName}"
                      }
                }
        }
    }
    ```

### [CLI](#tab/cli2)

1. Deallocate the Virtual Machine Scale Set. 

    ```azurecli-interactive
    az vmss deallocate 
    --location eastus
    --resource-group myResourceGroup 
    --name myVMSS 
    ```

1. Associate the scale set to the Capacity Reservation group. 

    ```azurecli-interactive
    az vmss update 
    --resource-group myResourceGroup 
    --name myVMSS 
    --capacity-reservation-group /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{capacityReservationGroupName}
    ```

### [PowerShell](#tab/powershell2) 

1. Deallocate the Virtual Machine Scale Set. 

    ```powershell-interactive
    Stop-AzVmss
    -ResourceGroupName "myResourceGroup”
    -VMScaleSetName "myVmss”
    ```

1. Associate the scale set to the Capacity Reservation group. 

    ```powershell-interactive
    $vmss =
    Get-AzVmss
    -ResourceGroupName "myResourceGroup"
    -VMScaleSetName "myVmss"
    
    Update-AzVmss
    -ResourceGroupName "myResourceGroup"
    -VMScaleSetName "myVmss"
    -VirtualMachineScaleSet $vmss
    -CapacityReservationGroupId "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{capacityReservationGroupName}"
    ```

To learn more, go to Azure PowerShell commands [Stop-AzVmss](/powershell/module/az.compute/stop-azvmss), [Get-AzVmss](/powershell/module/az.compute/get-azvmss), and [Update-AzVmss](/powershell/module/az.compute/update-azvmss).

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->

## View Virtual Machine Scale Set association with Instance View 

Once the Uniform Virtual Machine Scale Set is associated with the Capacity Reservation group, all the subsequent VM allocations will happen against the Capacity Reservation. Azure automatically finds the matching Capacity Reservation in the group and consumes a reserved slot. 

### [API](#tab/api3) 

The Capacity Reservation group *Instance View* reflects the new scale set VMs under the `virtualMachinesAssociated` & `virtualMachinesAllocated` properties:  

```rest
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}?$expand=instanceview&api-version=2021-04-01 
```

```json
{ 
    "name": "<CapacityReservationGroupName>", 
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{CapacityReservationGroupName}", 
    "type": "Microsoft.Compute/capacityReservationGroups", 
    "location": "eastus" 
}, 
    "properties": { 
        "capacityReservations": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{CapacityReservationName}" 
            } 
        ], 
        "virtualMachinesAssociated": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMScaleSetName}/virtualMachines/{VirtualMachineId}" 
            } 
        ], 
        "instanceView": { 
            "capacityReservations": [ 
                { 
                    "name": "<CapacityReservationName>", 
                    "utilizationInfo": { 
                        "virtualMachinesAllocated": [ 
                            { 
                                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{VMScaleSetName}/virtualMachines/{VirtualMachineId}" 
                            } 
                        ] 
                    },
                    "statuses": [ 
                        { 
                            "code": "ProvisioningState/succeeded", 
                            "level": "Info", 
                            "displayStatus": "Provisioning succeeded", 
                            "time": "2021-05-25T15:12:10.4165243+00:00" 
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
az capacity reservation group show 
-g myResourceGroup
-n myCapacityReservationGroup 
``` 

### [PowerShell](#tab/powershell3) 

View your Virtual Machine Scale Set and Capacity Reservation group association with Instance View using PowerShell. 

```powershell-interactive
$CapRes=
Get-AzCapacityReservationGroup
-ResourceGroupName <"ResourceGroupName">
-Name <"CapacityReservationGroupName">
-InstanceView

$CapRes.InstanceView.Utilizationinfo.VirtualMachinesAllocated
``` 

To learn more, go to Azure PowerShell command [Get-AzCapacityReservationGroup](/powershell/module/az.compute/get-azcapacityreservationGroup).

### [Portal](#tab/portal3)

1. Open [Azure portal](https://portal.azure.com)
1. Go to your Capacity Reservation group
1. Select **Resources** under **Setting**
1. In the table, you are able to see all the scale set VMs that are associated with the Capacity Reservation group
--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->

## Region and Availability Zones considerations 

Virtual machine scale sets can be created regionally or in one or more Availability Zones to protect them from data-center-level failure. Learn more about multi-zonal Virtual Machine Scale Sets, refer to [Virtual Machine Scale Sets that use Availability Zones](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md).  

 
>[!IMPORTANT]
> The location (Region and Availability Zones) of the Virtual Machine Scale Set and the Capacity Reservation group must match for the association to succeed. For a regional scale set, the region must match between the scale set and the Capacity Reservation group. For a zonal scale set, both the regions and the zones must match between the scale set and the Capacity Reservation group. 


When a scale set is spread across multiple zones, it always attempts to deploy evenly across the included Availability Zones. Because of that even deployment, a Capacity Reservation group should always have the same quantity of reserved VMs in each zone. As an illustration of why this is important, consider the following example.   

In this example, each zone has a different quantity reserved. Let’s say that the Virtual Machine Scale Set scales out to 75 instances. Since scale set will always attempt to deploy evenly across zones, the VM distribution should look like this: 

| Zone  | Quantity Reserved  | No. of scale set VMs in each zone  | Unused Quantity Reserved  | Overallocated   |
|---|---|---|---|---|
| 1  | 40  | 25  | 15  | 0  |
| 2  | 20  | 25  | 0  | 5  |
| 3  | 15  | 25  | 0  | 10  |

In this case, the scale set is incurring extra cost for 15 unused instances in Zone 1. The scale-out is also relying on 5 VMs in Zone 2 and 10 VMs in Zone 3 that are not protected by Capacity Reservation. If each zone had 25 capacity instances reserved, then all 75 VMs would be protected by Capacity Reservation and the deployment would not incur any extra cost for unused instances.  

Since the reservations can be overallocated, the scale set can continue to scale normally beyond the limits of the reservation. The only difference is that the VMs allocated above the quantity reserved are not covered by Capacity Reservation SLA. To learn more, go to [Overallocating Capacity Reservation](capacity-reservation-overallocate.md).


## Next steps

> [!div class="nextstepaction"]
> [Learn how to remove a scale set association from a Capacity Reservation](capacity-reservation-remove-virtual-machine-scale-set.md)
