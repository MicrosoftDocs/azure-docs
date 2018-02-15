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
# Upgrade a virtual machine scale set
This article describes how to modify an existing scale set. This includes how to change the configuration of the scale set, how to change the configuration of the applications running on the scale set, how to manage availability, and more.

## Fundamental concepts

### The scale set model

A scale set has a "scale set model" that captures the *desired* state of the scale set as a whole. To query the model for a scale set, you can use:

REST API: `GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}?api-version={apiVersion}` (for more information, see the [REST API documentation](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/get))

Powershell: `Get-AzureRmVmss -ResourceGroupName {resourceGroupName} -VMScaleSetName {vmScaleSetName}` (for more information, see the [Powershell documentation[(https://docs.microsoft.com/powershell/module/azurerm.compute/get-azurermvmss))

CLI: `az vmss show -g {resourceGroupName} -n {vmSaleSetName}` (for more information, see the [CLI documentation](https://docs.microsoft.com/cli/azure/vmss?view=azure-cli-latest#az_vmss_show))

You can also use [resources.azure.com](https://resources.azure.com) or the [Azure SDKs](https://azure.microsoft.com/downloads/) to query the model for a scale set.

The exact presentation of the output depends on the options you provide to the command, but here is some sample output from the CLI:

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

As you can see, these are properties that apply to the scale set as a whole.



### The scale set instance view

A scale set also has a "scale set instance view" that captures the current *runtime* state of the scale set as a whole. To query the instance view for a scale set, you can use:

REST API: `GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}/instanceView?api-version={apiVersion}` (for more information, see the [REST API documentation](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/getinstanceview))

Powershell: `Get-AzureRmVmss -ResourceGroupName {resourceGroupName} -VMScaleSetName {vmScaleSetName} -InstanceView` (for more information, see the [Powershell documentation[(https://docs.microsoft.com/powershell/module/azurerm.compute/get-azurermvmss))

CLI: `az vmss get-instance-view -g {resourceGroupName} -n {vmSaleSetName}` (for more information, see the [CLI documentation](https://docs.microsoft.com/cli/azure/vmss?view=azure-cli-latest#az_vmss_get_instance_view))

You can also use [resources.azure.com](https://resources.azure.com) or the [Azure SDKs](https://azure.microsoft.com/downloads/) to query the instance view for a scale set.

The exact presentation of the output depends on the options you provide to the command, but here is a sample output from the CLI:

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

As you can see, these properties provide a summary of the current runtime state of the VMs in the scale set. This includes the status of extensions applied to the scale set (omitted for brevity).



### The scale set VM model view

Similar to how a scale set has a model view, each VM in the scale set has its own model view. To query the model view for a scale set, you can use:

REST API: `GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}/virtualmachines/{instanceId}?api-version={apiVersion}` (for more information, see the [REST API documentation](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/get))

Powershell: `Get-AzureRmVmssVm -ResourceGroupName {resourceGroupName} -VMScaleSetName {vmScaleSetName} -InstanceId {instanceId}` (for more information, see the [Powershell documentation[(https://docs.microsoft.com/powershell/module/azurerm.compute/get-azurermvmssvm))

CLI: `az vmss show -g {resourceGroupName} -n {vmSaleSetName} --instance-id {instanceId}` (for more information, see the [CLI documentation](https://docs.microsoft.com/cli/azure/vmss?view=azure-cli-latest#az_vmss_show))

You can also use [resources.azure.com](https://resources.azure.com) or the [Azure SDKs](https://azure.microsoft.com/downloads/) to query the model for a VM in a scale set.

The exact presentation of the output depends on the options you provide to the command, but here is some sample output from the CLI:

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

As you can see, these properties describe the configuration of the VM itself, not the configuration of the scale set as a whole. For instance, the scale set model has `overprovision` as a property, while the model for a VM in a scale set does not. This is because overprovisioning is a property for the scale set as a whole, not individual VMs in the scale set (for more information about overprovisioning, see [this documentation](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-design-overview#overprovisioning)).



### The scale set VM instance view

Similar to how a scale set has an instance view, each VM in the scale set has its own instance view. To query the instance view for a scale set, you can use:

REST API: `GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}/virtualmachines/{instanceId}/instanceView?api-version={apiVersion}` (for more information, see the [REST API documentation](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesetvms/getinstanceview))

Powershell: `Get-AzureRmVmssVm -ResourceGroupName {resourceGroupName} -VMScaleSetName {vmScaleSetName} -InstanceId {instanceId} -InstanceView` (for more information, see the [Powershell documentation[(https://docs.microsoft.com/powershell/module/azurerm.compute/get-azurermvmssvm))

CLI: `az vmss get-instance-view -g {resourceGroupName} -n {vmSaleSetName} --instance-id {instanceId}` (for more information, see the [CLI documentation](https://docs.microsoft.com/cli/azure/vmss?view=azure-cli-latest#az_vmss_get_instance_view))

You can also use [resources.azure.com](https://resources.azure.com) or the [Azure SDKs](https://azure.microsoft.com/downloads/) to query the instance view for a VM in a scale set.

The exact presentation of the output depends on the options you provide to the command, but here is some sample output from the CLI:

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

As you can see, these properties describe the current runtime state of the VM itself, including any extensions applied to the scale set (omitted for brevity).




## How to update global scale set properties

To update a global scale set property, you must update the property in the scale set model. You can do this via:

REST API: `PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}?api-version={apiVersion}` (for more information, see the [REST API documentation](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/createorupdate))

Powershell: `Update-AzureRmVmss -ResourceGroupName {resourceGroupName} -VMScaleSetName {vmScaleSetName} -VirtualMachineScaleSet {scaleSetConfigPowershellObject}` (for more information, see the [Powershell documentation[(https://docs.microsoft.com/powershell/module/azurerm.compute/update-azurermvmss))

CLI. To modify a property: `az vmss update --set {propertyPath}={value}`. To add an object to a list property in a scale set: `az vmss update --add {propertyPath} {JSONObjectToAdd}`. To remove an object from a list property in a scale set: `az vmss update --remove {propertyPath} {indexToRemove}`. (for more information, see the [CLI documentation](https://docs.microsoft.com/cli/azure/vmss?view=azure-cli-latest#az_vmss_update)). Alternatively, if you previously deployed the scale set using the `az vmss create` command, you can run the `az vmss create` command again to update the scale set. To do this, you need to ensure that all properties in the `az vmss create` command are the same as before, except for the properties you wish to modify.

You can also use [resources.azure.com](https://resources.azure.com) or the [Azure SDKs](https://azure.microsoft.com/downloads/) to update the scale set model.

Once the scale set model is updated, the new configuration will apply to any new VMs created in the scale set. However, the models for the existing VMs in the scale set must still be brought up to date with the latest overall scale set model. In the model for each VM is a boolean property called `latestModelApplied` that indicates whether or not the VM is up to date with the latest overall scale set model (`true` means the VM is up to date with the latest model).




## How to bring VMs up to date with the latest scale set model

Scale sets have an "upgrade policy" that determine how VMs are brought up to date with the latest scale set model. The 3 modes for the upgrade policy are:

- Automatic: In this mode, the scale set makes no guarantees about the order of VMs being brought down. The scale set may take down all VMs at the same time. 
- Rolling: In this mode, the scale set rolls out the update in batches with an optional pause time between batches.
- Manual: In this mode, when you update the scale set model, nothing happens to existing VMs. To update existing VMs, you must do a "manual upgrade" of each existing VM. You can do this via:

REST API: `POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}/manualupgrade?api-version={apiVersion}` (for more information, see the [REST API documentation](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/updateinstances))

Powershell: `Update-AzureRmVmssInstance -ResourceGroupName {resourceGroupName} -VMScaleSetName {vmScaleSetName} -InstanceId {instanceId}` (for more information, see the [Powershell documentation[(https://docs.microsoft.com/powershell/module/azurerm.compute/update-azurermvmssinstance))

CLI: `az vmss update-instances -g {resourceGroupName} -n {vmScaleSetName} --instance-ids {instanceIds}` (for more information, see the [CLI documentation](https://docs.microsoft.com/cli/azure/vmss?view=azure-cli-latest#az_vmss_update_instances)).

You can also use the [Azure SDKs](https://azure.microsoft.com/downloads/) to do a manual upgrade on a VM in a scale set.

>[!NOTE]
> Service Fabric clusters can only use Automatic mode, but the update is handled differently. For more information on service fabric updates, see [the Service Fabric documentation](https://docs.microsoft.com/azure/service-fabric/service-fabric-application-upgrade).

>[!NOTE]
> There is one type of modification to global scale set properties that does not follow the upgrade policy. These are changes to the scale set OS Profile (e.g. admin username and password). These changes only apply to VMs created after the change in the scale set model. To bring existing VMs up to date, you must do a "reimage" of each existing VM. You can do this via:

REST API: `POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}/reimage?api-version={apiVersion}` (for more information, see the [REST API documentation](https://docs.microsoft.com/rest/api/compute/virtualmachinescalesets/reimage))

Powershell: `Set-AzureRmVmssVM -ResourceGroupName {resourceGroupName} -VMScaleSetName {vmScaleSetName} -InstanceId {instanceId} -Reimage` (for more information, see the [Powershell documentation[(https://docs.microsoft.com/powershell/module/azurerm.compute/set-azurermvmssvm))

CLI: `az vmss reimage -g {resourceGroupName} -n {vmScaleSetName} --instance-id {instanceId}` (for more information, see the [CLI documentation](https://docs.microsoft.com/cli/azure/vmss?view=azure-cli-latest#az_vmss_reimage)).

You can also use the [Azure SDKs](https://azure.microsoft.com/downloads/) to reimage a VM in a scale set.




## Read-only properties

(*** TODO ***)


## VM-specific updates

(*** TODO ***)




## Examples

### Updating the OS image for your scale set

(*** TODO ***)

### Updating the load balancer for your scale set

(*** TODO ***)