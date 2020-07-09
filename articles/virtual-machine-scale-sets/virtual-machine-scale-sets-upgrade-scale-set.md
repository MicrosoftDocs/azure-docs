---
title: Modify an Azure virtual machine scale set
description: Learn how to modify and update an Azure virtual machine scale set with the REST APIs, Azure PowerShell, and Azure CLI
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: management
ms.date: 03/10/2020
ms.reviewer: mimckitt
ms.custom: mimckitt

---
# Modify a virtual machine scale set

Throughout the lifecycle of your applications, you may need to modify or update your virtual machine scale set. These updates may include how to update the configuration of the scale set, or change the application configuration. This article describes how to modify an existing scale set with the REST APIs, Azure PowerShell, or Azure CLI.

## Fundamental concepts

### The scale set model
A scale set has a "scale set model" that captures the *desired* state of the scale set as a whole. To query the model for a scale set, you can use the 

- REST API with [compute/virtualmachinescalesets/get](/rest/api/compute/virtualmachinescalesets/get) as follows:

    ```rest
    GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet?api-version={apiVersion}
    ```

- Azure PowerShell with [Get-AzVmss](/powershell/module/az.compute/get-azvmss):

    ```powershell
    Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"
    ```

- Azure CLI with [az vmss show](/cli/azure/vmss):

    ```azurecli
    az vmss show --resource-group myResourceGroup --name myScaleSet
    ```

- You can also use [resources.azure.com](https://resources.azure.com) or the language-specific [Azure SDKs](https://azure.microsoft.com/downloads/).

The exact presentation of the output depends on the options you provide to the command. The following example shows condensed sample output from the Azure CLI:

```azurecli
az vmss show --resource-group myResourceGroup --name myScaleSet
{
  "location": "westus",
  "overprovision": true,
  "plan": null,
  "singlePlacementGroup": true,
  "sku": {
    "additionalProperties": {},
    "capacity": 1,
    "name": "Standard_D2_v2",
    "tier": "Standard"
  },
}
```

These properties apply to the scale set as a whole.


### The scale set instance view
A scale set also has a "scale set instance view" that captures the current *runtime* state of the scale set as a whole. To query the instance view for a scale set, you can use:

- REST API with [compute/virtualmachinescalesets/getinstanceview](/rest/api/compute/virtualmachinescalesets/getinstanceview) as follows:

    ```rest
    GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/instanceView?api-version={apiVersion}
    ```

- Azure PowerShell with [Get-AzVmss](/powershell/module/az.compute/get-azvmss):

    ```powershell
    Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceView
    ```

- Azure CLI with [az vmss get-instance-view](/cli/azure/vmss):

    ```azurecli
    az vmss get-instance-view --resource-group myResourceGroup --name myScaleSet
    ```

- You can also use [resources.azure.com](https://resources.azure.com) or the language-specific [Azure SDKs](https://azure.microsoft.com/downloads/)

The exact presentation of the output depends on the options you provide to the command. The following example shows condensed sample output from the Azure CLI:

```azurecli
$ az vmss get-instance-view --resource-group myResourceGroup --name myScaleSet
{
  "statuses": [
    {
      "additionalProperties": {},
      "code": "ProvisioningState/succeeded",
      "displayStatus": "Provisioning succeeded",
      "level": "Info",
      "message": null,
      "time": "{time}"
    }
  ],
  "virtualMachine": {
    "additionalProperties": {},
    "statusesSummary": [
      {
        "additionalProperties": {},
        "code": "ProvisioningState/succeeded",
        "count": 1
      }
    ]
  }
}
```

These properties provide a summary of the current runtime state of the VMs in the scale set, such as the status of extensions applied to the scale set.


### The scale set VM model view
Similar to how a scale set has a model view, each VM instance in the scale set has its own model view. To query the model view for a particular VM instance in a scale set, you can use:

- REST API with [compute/virtualmachinescalesetvms/get](/rest/api/compute/virtualmachinescalesetvms/get) as follows:

    ```rest
    GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/virtualmachines/instanceId?api-version={apiVersion}
    ```

- Azure PowerShell with [Get-AzVmssVm](/powershell/module/az.compute/get-azvmssvm):

    ```powershell
    Get-AzVmssVm -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId instanceId
    ```

- Azure CLI with [az vmss show](/cli/azure/vmss):

    ```azurecli
    az vmss show --resource-group myResourceGroup --name myScaleSet --instance-id instanceId
    ```

- You can also use [resources.azure.com](https://resources.azure.com) or the [Azure SDKs](https://azure.microsoft.com/downloads/).

The exact presentation of the output depends on the options you provide to the command. The following example shows condensed sample output from the Azure CLI:

```azurecli
$ az vmss show --resource-group myResourceGroup --name myScaleSet
{
  "location": "westus",
  "name": "{name}",
  "sku": {
    "name": "Standard_D2_v2",
    "tier": "Standard"
  },
}
```

These properties describe the configuration of a VM instance within a scale set, not the configuration of the scale set as a whole. For example, the scale set model has `overprovision` as a property, while the model for a VM instance within a scale set does not. This difference is because overprovisioning is a property for the scale set as a whole, not individual VM instances in the scale set (for more information about overprovisioning, see [Design considerations for scale sets](virtual-machine-scale-sets-design-overview.md#overprovisioning)).


### The scale set VM instance view
Similar to how a scale set has an instance view, each VM instance in the scale set has its own instance view. To query the instance view for a particular VM instance within a scale set, you can use:

- REST API with [compute/virtualmachinescalesetvms/getinstanceview](/rest/api/compute/virtualmachinescalesetvms/getinstanceview) as follows:

    ```rest
    GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/virtualmachines/instanceId/instanceView?api-version={apiVersion}
    ```

- Azure PowerShell with [Get-AzVmssVm](/powershell/module/az.compute/get-azvmssvm):

    ```powershell
    Get-AzVmssVm -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId instanceId -InstanceView
    ```

- Azure CLI with [az vmss get-instance-view](/cli/azure/vmss)

    ```azurecli
    az vmss get-instance-view --resource-group myResourceGroup --name myScaleSet --instance-id instanceId
    ```

- You can also use [resources.azure.com](https://resources.azure.com) or the [Azure SDKs](https://azure.microsoft.com/downloads/)

The exact presentation of the output depends on the options you provide to the command. The following example shows condensed sample output from the Azure CLI:

```azurecli
$ az vmss get-instance-view --resource-group myResourceGroup --name myScaleSet --instance-id instanceId
{
  "additionalProperties": {
    "osName": "ubuntu",
    "osVersion": "16.04"
  },
  "disks": [
    {
      "name": "{name}",
      "statuses": [
        {
          "additionalProperties": {},
          "code": "ProvisioningState/succeeded",
          "displayStatus": "Provisioning succeeded",
          "time": "{time}"
        }
      ]
    }
  ],
  "statuses": [
    {
      "additionalProperties": {},
      "code": "ProvisioningState/succeeded",
      "displayStatus": "Provisioning succeeded",
      "time": "{time}"
    },
    {
      "additionalProperties": {},
      "code": "PowerState/running",
      "displayStatus": "VM running"
    }
  ],
  "vmAgent": {
    "statuses": [
      {
        "additionalProperties": {},
        "code": "ProvisioningState/succeeded",
        "displayStatus": "Ready",
        "level": "Info",
        "message": "Guest Agent is running",
        "time": "{time}"
      }
    ],
    "vmAgentVersion": "{version}"
  },
}
```

These properties describe the current runtime state of a VM instance within a scale set, which includes any extensions applied to the scale set.


## How to update global scale set properties
To update a global scale set property, you must update the property in the scale set model. You can do this update via:

- REST API with [compute/virtualmachinescalesets/createorupdate](/rest/api/compute/virtualmachinescalesets/createorupdate) as follows:

    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet?api-version={apiVersion}
    ```

- You can deploy a Resource Manager template with the properties from the REST API to update global scale set properties.

- Azure PowerShell with [Update-AzVmss](/powershell/module/az.compute/update-azvmss):

    ```powershell
    Update-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -VirtualMachineScaleSet {scaleSetConfigPowershellObject}
    ```

- Azure CLI with [az vmss update](/cli/azure/vmss):
    - To modify a property:

        ```azurecli
        az vmss update --set {propertyPath}={value}
        ```

    - To add an object to a list property in a scale set: 

        ```azurecli
        az vmss update --add {propertyPath} {JSONObjectToAdd}
        ```

    - To remove an object from a list property in a scale set: 

        ```azurecli
        az vmss update --remove {propertyPath} {indexToRemove}
        ```

    - If you previously deployed the scale set with the `az vmss create` command, you can run the `az vmss create` command again to update the scale set. Make sure that all properties in the `az vmss create` command are the same as before, except for the properties that you wish to modify.

- You can also use [resources.azure.com](https://resources.azure.com) or the [Azure SDKs](https://azure.microsoft.com/downloads/).

Once the scale set model is updated, the new configuration applies to any new VMs created in the scale set. However, the models for the existing VMs in the scale set must still be brought up-to-date with the latest overall scale set model. In the model for each VM is a boolean property called `latestModelApplied` that indicates whether or not the VM is up-to-date with the latest overall scale set model (`true` means the VM is up-to-date with the latest model).


## How to bring VMs up-to-date with the latest scale set model
Scale sets have an "upgrade policy" that determine how VMs are brought up-to-date with the latest scale set model. The three modes for the upgrade policy are:

- **Automatic** - In this mode, the scale set makes no guarantees about the order of VMs being brought down. The scale set may take down all VMs at the same time. 
- **Rolling** - In this mode, the scale set rolls out the update in batches with an optional pause time between batches.
- **Manual** - In this mode, when you update the scale set model, nothing happens to existing VMs.
 
To update existing VMs, you must do a "manual upgrade" of each existing VM. You can do this manual upgrade with:

- REST API with [compute/virtualmachinescalesets/updateinstances](/rest/api/compute/virtualmachinescalesets/updateinstances) as follows:

    ```rest
    POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/manualupgrade?api-version={apiVersion}
    ```

- Azure PowerShell with [Update-AzVmssInstance](/powershell/module/az.compute/update-azvmssinstance):
    
    ```powershell
    Update-AzVmssInstance -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId instanceId
    ```

- Azure CLI with [az vmss update-instances](/cli/azure/vmss)

    ```azurecli
    az vmss update-instances --resource-group myResourceGroup --name myScaleSet --instance-ids {instanceIds}
    ```

- You can also use the language-specific [Azure SDKs](https://azure.microsoft.com/downloads/).

>[!NOTE]
> Service Fabric clusters can only use *Automatic* mode, but the update is handled differently. For more information, see [Service Fabric application upgrades](../service-fabric/service-fabric-application-upgrade.md).

There is one type of modification to global scale set properties that does not follow the upgrade policy. Changes to the scale set OS and Data disk Profile (such as admin username and password) can only be changed in API version *2017-12-01* or later. These changes only apply to VMs created after the change in the scale set model. To bring existing VMs up-to-date, you must do a "reimage" of each existing VM. You can do this reimage via:

- REST API with [compute/virtualmachinescalesets/reimage](/rest/api/compute/virtualmachinescalesets/reimage) as follows:

    ```rest
    POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/reimage?api-version={apiVersion}
    ```

- Azure PowerShell with [Set-AzVmssVm](https://docs.microsoft.com/powershell/module/az.compute/set-azvmssvm):

    ```powershell
    Set-AzVmssVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId instanceId -Reimage
    ```

- Azure CLI with [az vmss reimage](https://docs.microsoft.com/cli/azure/vmss):

    ```azurecli
    az vmss reimage --resource-group myResourceGroup --name myScaleSet --instance-id instanceId
    ```

- You can also use the language-specific [Azure SDKs](https://azure.microsoft.com/downloads/).


## Properties with restrictions on modification

### Create-time properties
Some properties can only be set when you create the scale set. These properties include:

- Availability Zones
- Image reference publisher
- Image reference offer
- Managed OS disk storage account type

### Properties that can only be changed based on the current value
Some properties may be changed, with exceptions depending on the current value. These properties include:

- **singlePlacementGroup** - If singlePlacementGroup is true, it may be modified to false. However, if singlePlacementGroup is false, it **may not** be modified to true.
- **subnet** - The subnet of a scale set may be modified as long as the original subnet and the new subnet are in the same virtual network.

### Properties that require deallocation to change
Some properties may only be changed to certain values if the VMs in the scale set are deallocated. These properties include:

- **SKU name**- If the new VM SKU is not supported on the hardware the scale set is currently on, you need to deallocate the VMs in the scale set before you modify the SKU name. For more information, see [how to resize an Azure VM](../virtual-machines/windows/resize-vm.md).


## VM-specific updates
Certain modifications may be applied to specific VMs instead of the global scale set properties. Currently, the only VM-specific update that is supported is to attach/detach data disks to/from VMs in the scale set. This feature is in preview. For more information, see the [preview documentation](https://github.com/Azure/vm-scale-sets/tree/master/preview/disk).


## Scenarios

### Application updates
If an application is deployed to a scale set through extensions, an update to the extension configuration causes the application to update in accordance with the upgrade policy. For instance, if you have a new version of a script to run in a Custom Script Extension, you could update the *fileUris* property to point to the new script. In some cases, you may wish to force an update even though the extension configuration is unchanged (for example, you updated the script without a change to the URI of the script). In these cases, you can modify the *forceUpdateTag* to force an update. The Azure platform does not interpret this property. If you change the value, there is no effect on how the extension runs. A change simply forces the extension to rerun. For more information on the *forceUpdateTag*, see the [REST API documentation for extensions](/rest/api/compute/virtualmachineextensions/createorupdate). Note that the *forceUpdateTag* can be used with all extensions, not just the custom script extension.

It's also common for applications to be deployed through a custom image. This scenario is covered in the following section.

### OS Updates
If you use Azure platform images, you can update the image by modifying the *imageReference* (more information, see the [REST API documentation](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/createorupdate)).

>[!NOTE]
> With platform images, it is common to specify "latest" for the image reference version. When you create, scale out, and reimage, VMs are created with the latest available version. However, it **does not** mean that the OS image is automatically updated over time as new image versions are released. A separate feature is currently in preview that provides automatic OS upgrades. For more information, see the [Automatic OS Upgrades documentation](virtual-machine-scale-sets-automatic-upgrade.md).

If you use custom images, you can update the image by updating the *imageReference* ID (more information, see the [REST API documentation](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/createorupdate)).

## Examples

### Update the OS image for your scale set
You may have a scale set that runs an old version of Ubuntu LTS 16.04. You want to update to a newer version of Ubuntu LTS 16.04, such as version *16.04.201801090*. The image reference version property is not part of a list, so you can directly modify these properties with one of the following commands:

- Azure PowerShell with [Update-AzVmss](/powershell/module/az.compute/update-azvmss) as follows:

    ```powershell
    Update-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -ImageReferenceVersion 16.04.201801090
    ```

- Azure CLI with [az vmss update](/cli/azure/vmss):

    ```azurecli
    az vmss update --resource-group myResourceGroup --name myScaleSet --set virtualMachineProfile.storageProfile.imageReference.version=16.04.201801090
    ```

Alternatively, you may want to change the image your scale set uses. For example, you may want to update or change a custom image used by your scale set. You can change the image your scale set uses by updating the image reference ID property. The image reference ID property is not part of a list, so you can directly modify this property with one of the following commands:

- Azure PowerShell with [Update-AzVmss](/powershell/module/az.compute/update-azvmss) as follows:

    ```powershell
    Update-AzVmss `
        -ResourceGroupName "myResourceGroup" `
        -VMScaleSetName "myScaleSet" `
        -ImageReferenceId /subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/myNewImage
    ```

- Azure CLI with [az vmss update](/cli/azure/vmss):

    ```azurecli
    az vmss update \
        --resource-group myResourceGroup \
        --name myScaleSet \
        --set virtualMachineProfile.storageProfile.imageReference.id=/subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/myNewImage
    ```


### Update the load balancer for your scale set
Let's say you have a scale set with an Azure Load Balancer, and you want to replace the Azure Load Balancer with an Azure Application Gateway. The load balancer and Application Gateway properties for a scale set are part of a list, so you can use the commands to remove or add list elements instead of modifying the properties directly:

- Azure Powershell:

    ```powershell
    # Get the current model of the scale set and store it in a local PowerShell object named $vmss
    $vmss=Get-AzVmss -ResourceGroupName "myResourceGroup" -Name "myScaleSet"
    
    # Create a local PowerShell object for the new desired IP configuration, which includes the reference to the application gateway
    $ipconf = New-AzVmssIPConfig "myNic" -ApplicationGatewayBackendAddressPoolsId /subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Network/applicationGateways/{applicationGatewayName}/backendAddressPools/{applicationGatewayBackendAddressPoolName} -SubnetId $vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].IpConfigurations[0].Subnet.Id –Name $vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].IpConfigurations[0].Name
    
    # Replace the existing IP configuration in the local PowerShell object (which contains the references to the current Azure Load Balancer) with the new IP configuration
    $vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].IpConfigurations[0] = $ipconf
    
    # Update the model of the scale set with the new configuration in the local PowerShell object
    Update-AzVmss -ResourceGroupName "myResourceGroup" -Name "myScaleSet" -virtualMachineScaleSet $vmss
    ```

- Azure CLI:

    ```azurecli
    # Remove the load balancer backend pool from the scale set model
    az vmss update --resource-group myResourceGroup --name myScaleSet --remove virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerBackendAddressPools 0
    
    # Remove the load balancer backend pool from the scale set model; only necessary if you have NAT pools configured on the scale set
    az vmss update --resource-group myResourceGroup --name myScaleSet --remove virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerInboundNatPools 0
    
    # Add the application gateway backend pool to the scale set model
    az vmss update --resource-group myResourceGroup --name myScaleSet --add virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].ApplicationGatewayBackendAddressPools '{"id": "/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Network/applicationGateways/{applicationGatewayName}/backendAddressPools/{applicationGatewayBackendPoolName}"}'
    ```

>[!NOTE]
> These commands assume there is only one IP configuration and load balancer on the scale set. If there are multiple, you may need to use a list index other than *0*.


## Next steps
You can also perform common management tasks on scale sets with the [Azure CLI](virtual-machine-scale-sets-manage-cli.md) or [Azure PowerShell](virtual-machine-scale-sets-manage-powershell.md).
