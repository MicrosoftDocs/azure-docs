---
title: Modify an Azure virtual machine scale set| Microsoft Docs
description: Modify an Azure virtual machine scale set
services: virtual-machine-scale-sets
documentationcenter: ''
author: gatneil
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: e229664e-ee4e-4f12-9d2e-a4f456989e5d
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/14/2018
ms.author: negat

---
# Modify a virtual machine scale set
This article describes how to modify an existing virtual machine scale set. Tasks include how to change the configuration of the scale set, how to change the configuration of the applications running on the scale set, how to manage availability, and more.

## Fundamental concepts

### Scale set model

A scale set has a model that captures the *desired* state of the scale set as a whole. To query the model for a scale set, you can use:

* REST API: 

  `GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}?api-version={apiVersion}` 
   
  For more information, see the [REST API documentation](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/get).

* PowerShell:

  `Get-AzureRmVmss -ResourceGroupName {resourceGroupName} -VMScaleSetName {vmScaleSetName}`
   
  For more information, see the [PowerShell documentation](https://docs.microsoft.com/powershell/module/azurerm.compute/get-azurermvmss).

* Azure CLI: 

  `az vmss show -g {resourceGroupName} -n {vmSaleSetName}` 
   
  For more information, see the [Azure CLI documentation](https://docs.microsoft.com/cli/azure/vmss?view=azure-cli-latest#az_vmss_show).

You can also use [Azure Resource Explorer (Preview)](https://resources.azure.com) or the [Azure SDKs](https://azure.microsoft.com/downloads/) to query the model for a scale set.

The exact presentation of the output depends on the options that you provide to the command. Here's sample output from Azure CLI:

```
$ az vmss show -g {resourceGroupName} -n {vmScaleSetName}
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
  .
  .
  .
}
```

As you can see, these properties apply to the scale set as a whole.



### Scale set instance view

A scale set also has an instance view that captures the current *runtime* state of the scale set as a whole. To query the instance view for a scale set, you can use:

* REST API: 

  `GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}/instanceView?api-version={apiVersion}` 
   
  For more information, see the [REST API documentation](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/getinstanceview).

* PowerShell: 

  `Get-AzureRmVmss -ResourceGroupName {resourceGroupName} -VMScaleSetName {vmScaleSetName} -InstanceView` 
  
  For more information, see the [PowerShell documentation](https://docs.microsoft.com/powershell/module/azurerm.compute/get-azurermvmss).

* Azure CLI: 

  `az vmss get-instance-view -g {resourceGroupName} -n {vmSaleSetName}` 
   
  For more information, see the [Azure CLI documentation](https://docs.microsoft.com/cli/azure/vmss?view=azure-cli-latest#az_vmss_get_instance_view).

You can also use [Azure Resource Explorer (Preview)](https://resources.azure.com) or the [Azure SDKs](https://azure.microsoft.com/downloads/) to query the instance view for a scale set.

The exact presentation of the output depends on the options that you provide to the command. Here's sample output from Azure CLI:

```
$ az vmss get-instance-view -g {resourceGroupName} -n {virtualMachineScaleSetName}
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
  .
  .
  .
}
```

As you can see, these properties provide a summary of the current runtime state of the VMs in the scale set. The summary includes the status of extensions applied to the scale set (omitted for brevity).



### Scale set VM model view

Similar to how a scale set has a model view, each VM in the scale set has its own model view. To query the model view for a scale set, you can use:

* REST API: 

  `GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}/virtualmachines/{instanceId}?api-version={apiVersion}` 
  
  For more information, see the [REST API documentation](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/get).

* PowerShell: 

  `Get-AzureRmVmssVm -ResourceGroupName {resourceGroupName} -VMScaleSetName {vmScaleSetName} -InstanceId {instanceId}` 
  
  For more information, see the [PowerShell documentation](https://docs.microsoft.com/powershell/module/azurerm.compute/get-azurermvmssvm).

* Azure CLI: 

  `az vmss show -g {resourceGroupName} -n {vmSaleSetName} --instance-id {instanceId}` 
  
  For more information, see the [Azure CLI documentation](https://docs.microsoft.com/cli/azure/vmss?view=azure-cli-latest#az_vmss_show).

You can also use [Azure Resource Explorer (Preview)](https://resources.azure.com) or the [Azure SDKs](https://azure.microsoft.com/downloads/) to query the model for a VM in a scale set.

The exact presentation of the output depends on the options that you provide to the command. Here's sample output from Azure CLI:

```
$ az vmss show -g {resourceGroupName} -n {vmScaleSetName}
{
  "location": "westus",
  "name": "{name}",
  "sku": {
    "name": "Standard_D2_v2",
    "tier": "Standard"
  },
  .
  .
  .
}
```

As you can see, these properties describe the configuration of the VM itself, not the configuration of the scale set as a whole. For instance, the scale set model has `overprovision` as a property, whereas the model for a VM in a scale set does not. The reason for this difference is that overprovisioning is a property for the scale set as a whole, not individual VMs in the scale set. (For more information about overprovisioning, see [Design considerations for scale sets](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-design-overview#overprovisioning).)



### Scale set VM instance view

Similar to how a scale set has an instance view, each VM in the scale set has its own instance view. To query the instance view for a scale set, you can use:

* REST API: 

  `GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}/virtualmachines/{instanceId}/instanceView?api-version={apiVersion}` 
 
  For more information, see the [REST API documentation](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/getinstanceview).

* PowerShell: 

  `Get-AzureRmVmssVm -ResourceGroupName {resourceGroupName} -VMScaleSetName {vmScaleSetName} -InstanceId {instanceId} -InstanceView` 
  
  For more information, see the [PowerShell documentation](https://docs.microsoft.com/powershell/module/azurerm.compute/get-azurermvmssvm).

* Azure CLI: 

  `az vmss get-instance-view -g {resourceGroupName} -n {vmSaleSetName} --instance-id {instanceId}` 
  
  For more information, see the [Azure CLI documentation](https://docs.microsoft.com/cli/azure/vmss?view=azure-cli-latest#az_vmss_get_instance_view).

You can also use [Azure Resource Explorer (Preview)](https://resources.azure.com) or the [Azure SDKs](https://azure.microsoft.com/downloads/) to query the instance view for a VM in a scale set.

The exact presentation of the output depends on the options that you provide to the command. Here's sample output from Azure CLI:

```
$ az vmss get-instance-view -g {resourceGroupName} -n {vmScaleSetName} --instance-id {instanceId}
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
  .
  .
  .
}
```

As you can see, these properties describe the current runtime state of the VM itself. The state includes any extensions applied to the scale set (omitted for brevity).




## Techniques for updating global scale set properties

To update a global scale set property, you must update the property in the scale set model. You can do this update via:

* REST API: 

  `PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}?api-version={apiVersion}` 
  
  For more information, see the [REST API documentation](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/createorupdate).

  You can alternatively deploy an Azure Resource Manager template by using the properties from the REST API to update global scale set properties.

* PowerShell: 

  `Update-AzureRmVmss -ResourceGroupName {resourceGroupName} -VMScaleSetName {vmScaleSetName} -VirtualMachineScaleSet {scaleSetConfigPowershellObject}` 
  
  For more information, see the [PowerShell documentation](https://docs.microsoft.com/powershell/module/azurerm.compute/update-azurermvmss).

* Azure CLI:

  * To modify a property: `az vmss update --set {propertyPath}={value}` 
  
  * To add an object to a list property in a scale set: `az vmss update --add {propertyPath} {JSONObjectToAdd}` 
  
  * To remove an object from a list property in a scale set: `az vmss update --remove {propertyPath} {indexToRemove}` 
  
  For more information, see the [Azure CLI documentation](https://docs.microsoft.com/cli/azure/vmss?view=azure-cli-latest#az_vmss_update). 
  
  Alternatively, if you previously deployed the scale set by using the `az vmss create` command, you can run the `az vmss create` command again to update the scale set. To do this, ensure that all properties in the `az vmss create` command are the same as before, except for the properties that you want to modify.



You can also use [Azure Resource Explorer (Preview)](https://resources.azure.com) or the [Azure SDKs](https://azure.microsoft.com/downloads/) to update the scale set model.

After the scale set model is updated, the new configuration applies to any new VMs created in the scale set. However, the models for the existing VMs in the scale set must still be brought up to date with the latest overall scale set model. In the model for each VM, a Boolean property called `latestModelApplied` indicates whether or not the VM is up to date with the latest overall scale set model. (A value of `true` means the VM is up to date with the latest model.)




## Techniques for bringing VMs up to date with the latest scale set model

Scale sets have an *upgrade policy* that determines how VMs are brought up to date with the latest scale set model. The three modes for the upgrade policy are:

- **Automatic**: In this mode, the scale set makes no guarantees about the order of VMs that are brought down. The scale set might take down all VMs at the same time. 
- **Rolling**: In this mode, the scale set rolls out the update in batches, with an optional pause time between batches.
- **Manual**: In this mode, when you update the scale set model, nothing happens to existing VMs. To update existing VMs, you must manually upgrade each one. You can do this manual upgrade via:

  - REST API: 
  
    `POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}/manualupgrade?api-version={apiVersion}` 
    
    For more information, see the [REST API documentation](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/updateinstances).

  - PowerShell: 
  
    `Update-AzureRmVmssInstance -ResourceGroupName {resourceGroupName} -VMScaleSetName {vmScaleSetName} -InstanceId {instanceId}` 
    
    For more information, see the [PowerShell documentation](https://docs.microsoft.com/powershell/module/azurerm.compute/update-azurermvmssinstance).

  - Azure CLI: 
  
    `az vmss update-instances -g {resourceGroupName} -n {vmScaleSetName} --instance-ids {instanceIds}` 
    
    For more information, see the [Azure CLI documentation](https://docs.microsoft.com/cli/azure/vmss?view=azure-cli-latest#az_vmss_update_instances).

  You can also use the [Azure SDKs](https://azure.microsoft.com/downloads/) to manually upgrade a VM in a scale set.

>[!NOTE]
> Azure Service Fabric clusters can use only Automatic mode, but the update is handled differently. For more information on Service Fabric updates, see the [Service Fabric documentation](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-upgrade).

One type of modification to global scale set properties does not follow the upgrade policy: changes to the scale set OS profile. (Examples are admin username and password.) These properties can be changed only in API version 2017-12-01 or later. These changes apply only to VMs created after the change in the scale set model. To bring existing VMs up to date, you must reimage each existing VM. You reimage a VM via:

* REST API: 

  `POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}/reimage?api-version={apiVersion}` 
  
  For more information, see the [REST API documentation](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/reimage).

* PowerShell: 

  `Set-AzureRmVmssVM -ResourceGroupName {resourceGroupName} -VMScaleSetName {vmScaleSetName} -InstanceId {instanceId} -Reimage` 
  
  For more information, see the [PowerShell documentation](https://docs.microsoft.com/powershell/module/azurerm.compute/set-azurermvmssvm).

* Azure CLI: 

  `az vmss reimage -g {resourceGroupName} -n {vmScaleSetName} --instance-id {instanceId}` 
  
  For more information, see the [Azure CLI documentation](https://docs.microsoft.com/cli/azure/vmss?view=azure-cli-latest#az_vmss_reimage).

You can also use the [Azure SDKs](https://azure.microsoft.com/downloads/) to reimage a VM in a scale set.




## Properties with restrictions on modification

### Create-time properties

Some properties can be set only when you're initially creating the scale set. These properties include:

- Zones
- Image reference publisher
- Image reference offer

### Properties that can be changed based on the current value only

Some properties can be changed, with exceptions, depending on the current value. These properties include:

- `singlePlacementGroup`: If `singlePlacementGroup` is true, it can be modified to false. However, if `singlePlacementGroup` is false, it *cannot* be modified to true.
- `subnet`: The subnet of a scale set can be modified as long as the original subnet and the new subnet are in the same virtual network.

### Properties that require deallocation to change

Some properties can be changed to certain values only if the VMs in the scale set are deallocated. These properties include:

- `sku name`: If the new VM SKU is not supported on the hardware that the scale set is currently on, you need to deallocate the VMs in the scale set before you modify `sku name`. For more information on resizing VMs, see [this Azure blog post](https://azure.microsoft.com/blog/resize-virtual-machines/).


## VM-specific updates

Certain modifications can be applied to specific VMs instead of the global scale set properties. Currently, the only VM-specific update that is supported is attaching/detaching data disks to/from VMs in the scale set. This feature is in preview. For more information, see the [preview documentation](https://github.com/Azure/vm-scale-sets/tree/master/preview/disk).

## Scenarios

### Application updates

If an application is deployed to a scale set through extensions, updating the extension configuration causes the application to be updated in accordance with the upgrade policy. For instance, if you have a new version of a script to run in a custom script extension, you might update the `fileUris` property to point to the new script. 

In some cases, you might want to force an update even though the extension configuration is unchanged. (For example, you updated the script without changing the URI of the script.) In these cases, you can modify `forceUpdateTag` to force an update. The Azure platform does not interpret this property, so changing its value has no effect on how the extension runs. Modifying it simply forces the extension to rerun. 

For more information on `forceUpdateTag`, see the [REST API documentation for extensions](https://docs.microsoft.com/rest/api/compute/virtualmachineextensions/createorupdate).

It's also common for applications to be deployed through a custom image. This scenario is covered in the following section.

### OS updates

If you're using platform images, you can update the images by modifying `imageReference`. For more information, see the [REST API documentation](https://docs.microsoft.com/en-us/rest/api/compute/virtualmachinescalesets/createorupdate).

>[!NOTE]
> With platform images, it's common to specify "latest" for the image reference version. This means that when scale sets are created, scaled out, and reimaged, the VMs are created with the latest available version. However, it *does not* mean that the OS image will be automatically updated over time as new image versions are released. This is a separate feature, currently in preview. For more information, see [Automatic OS upgrades](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade).

If you're using custom images, you can update the images by updating the `imageReference` ID. For more information, see the [REST API documentation](https://docs.microsoft.com/en-us/rest/api/compute/virtualmachinescalesets/createorupdate).

## Examples

### Update the OS image for your scale set

Let's say you have a scale set running an old version of Ubuntu LTS 16.04. You want to update to a newer version of Ubuntu LTS 16.04 (for example, version 16.04.201801090). The image reference version property is not part of a list, so you can directly modify these properties by using these commands:

* PowerShell: 

  `Update-AzureRmVmss -ResourceGroupName {resourceGroupName} -VMScaleSetName {vmScaleSetName} -ImageReferenceVersion 16.04.201801090`

* Azure CLI: 

  `az vmss update -g {resourceGroupName} -n {vmScaleSetName} --set virtualMachineProfile.storageProfile.imageReference.version=16.04.201801090`


### Update the load balancer for your scale set

Let's say you have a scale set with an Azure load balancer, and you want to replace the load balancer with an Azure application gateway. The load balancer and application gateway properties for a scale set are part of a list. So, you can use the commands for removing and adding list elements instead of modifying the properties directly.

PowerShell:
```
# Get the current model of the scale set and store it in a local PowerShell object named $vmss
> $vmss=Get-AzureRmVmss -ResourceGroupName {resourceGroupName} -Name {vmScaleSetName}

# Create a local PowerShell object for the new desired IP configuration, which includes the reference to the application gateway
> $ipconf = New-AzureRmVmssIPConfig myNic -ApplicationGatewayBackendAddressPoolsId /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/applicationGateways/{applicationGatewayName}/backendAddressPools/{applicationGatewayBackendAddressPoolName} -SubnetId $vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].IpConfigurations[0].Subnet.Id –Name $vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].IpConfigurations[0].Name

# Replace the existing IP configuration in the local PowerShell object (which contains the references to the current Azure load balancer) with the new IP configuration
> $vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].IpConfigurations[0] = $ipconf

# Update the model of the scale set with the new configuration in the local PowerShell object
> Update-AzureRmVmss -ResourceGroupName {resourceGroupName} -Name {vmScaleSetName} -virtualMachineScaleSet $vmss

```

Azure CLI:
```
az vmss update -g {resourceGroupName} -n {vmScaleSetName} --remove virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerBackendAddressPools 0 # Remove the load balancer back-end pool from the scale set model
az vmss update -g {resourceGroupName} -n {vmScaleSetName} --remove virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].loadBalancerInboundNatPools 0 # Remove the load balancer back-end pool from the scale set model; only necessary if you have NAT pools configured on the scale set
az vmss update -g {resourceGroupName} -n {vmScaleSetName} --add virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].ipConfigurations[0].ApplicationGatewayBackendAddressPools '{"id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/applicationGateways/{applicationGatewayName}/backendAddressPools/{applicationGatewayBackendPoolName}"}' # Add the application gateway back-end pool to the scale set model
```

>[!NOTE]
> These commands assume there is only one IP configuration and load balancer on the scale set. If there are multiple, you might need to use a list index other than 0.