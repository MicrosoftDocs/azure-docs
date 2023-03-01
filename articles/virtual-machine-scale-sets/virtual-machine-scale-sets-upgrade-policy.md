---
title: Upgrade Policies for Virtual Machine Scale Sets
description: Learn about the different upgrade policies available for Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 02/28/2023
ms.reviewer: ju-shim
ms.custom: 

---
# Upgrade Policies for Virtual Machine Scale Sets

> [!NOTE]
> Upgrade Policies only apply to Virtual Machine Scale Sets using Uniform Orchestration. 

Scale sets have an Upgrade Policy that determines how VMs are brought up-to-date with the latest scale set model. This includes updates such as changes in the OS version, adding or removing data disks, NIC updates, or other updates that apply to the scale set instances as a whole. The three modes for the upgrade policy are Automatic, Rolling and Manual. 

### Automatic 
In this mode, the scale set makes no guarantees about the order of VMs being brought down. The scale set may take down all VMs at the same time. 

>[!NOTE]
> Service Fabric clusters can only use *Automatic* mode, but the update is handled differently. For more information, see [Service Fabric application upgrades](../service-fabric/service-fabric-application-upgrade.md).

### Rolling

> [!IMPORTANT]
> Rolling Upgrades with MaxSurge is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA).

In this mode, the scale set rolls out the update in batches with an optional pause time between batches. Additionally, when selecting a Rolling Upgrade policy, users can select to enable **MaxSurge** via a `true` or `false` flag. When MaxSurge is set to `true`, new instances are created and brought up-to-date to the latest scale model in batches. Once complete, the new instances will be added to the scale set and the old model instances will be removed. This will occur in multiple batches (batch size determined by customer) until all instances are brought up to date. 

With MaxSurge set to `false`, the existing instances in a scale set are brought down to be upgraded. Once the upgrade is complete, the instances will begin taking traffic again. 

### Manual
In this mode, you choose when to update the scale set model. Nothing happens automatically to the existing VMs when changes occur to the scale model.

## Setting the Upgrade Policy

When deploying a new scale set, include the Upgrade Policy Mode and set the MaxSurge flag to either `True` or `False`.

### CLI

```azurecli-interactive
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --image UbuntuLTS \
  --upgrade-policy-mode Rolling \
  --max-surge True \
  --instance-count 2 \
  --admin-username azureuser \
  --generate-ssh-keys
```

### PowerShell

```azurepowershell-interactive
New-AzVmss `
    -ResourceGroup "myVMSSResourceGroup" `
    -Name "myScaleSet" ` 
    -UpgradePolicyMode "Rolling" `
    -MaxSurge "True" `
    -Location "East US" `
    -InstanceCount "2" `
    -ImageName "Win2019Datacenter"
```

### Template
Add the following to your ARM template: 

```ARM
"properties": {
        "singlePlacementGroup": false,
        "upgradePolicy": {
            "mode": "Rolling",
            "rollingUpgradePolicy": {
                "maxBatchInstancePercent": 20,
                "maxUnhealthyInstancePercent": 20,
                "maxUnhealthyUpgradedInstancePercent": 20,
                "pauseTimeBetweenBatches": "PT2S",
	              "MaxSurge": "true"
```

## Changing the Upgrade Policy

The Upgrade Policy for a Virtual Machine Scale Set can be change at any point in time. 

### CLI
```azurecli-interactive
az vmss update \
    --upgrade-policy-mode Rolling \
    --max-unhealthy-instance-percent 40 \
    --max-unhealthy-upgraded-instance-percent 30 \
    --pause-time-between-batches PT30S \
    --max-surge true
```

### PowerShell

```azurepowershell-interactive
Set-AzVmssRollingUpgradePolicy `
    -VirtualMachineScaleSet $vmss `
    -MaxBatchInstancePercent 40 `
    -MaxUnhealthyInstancePercent 35 `
    -MaxUnhealthyUpgradedInstancePercent 30 `
    -PauseTimeBetweenBatches "PT30S" `
    -MaxSurge "True"

Update-AzVMSS -VMScaleSetName $vmss
```

### Template

Add the following to your ARM template: 

```ARM
"properties": {
        "singlePlacementGroup": false,
        "upgradePolicy": {
            "mode": "Rolling",
            "rollingUpgradePolicy": {
                "maxBatchInstancePercent": 20,
                "maxUnhealthyInstancePercent": 20,
                "maxUnhealthyUpgradedInstancePercent": 20,
                "pauseTimeBetweenBatches": "PT2S",
	              "MaxSurge": "true"
```

## Performing Manual Upgrades
 
If you have the Upgrade Policy set to manual, you need to perform manual upgrades of each existing VM to apply changes to the instances based on the updated scale set model. 

> [!NOTE]
> While upgrading, the instances may be restarted.

### CLI
Using [az vmss update-instances](/cli/azure/vmss)

```azurecli
az vmss update-instances --resource-group myResourceGroup --name myScaleSet --instance-ids {instanceIds}
```
### PowerShell 
Using [Update-AzVmssInstance](/powershell/module/az.compute/update-azvmssinstance):
    
```powershell
Update-AzVmssInstance -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId instanceId
```

### REST API 
Using [compute/virtualmachinescalesets/updateinstances](/rest/api/compute/virtualmachinescalesets/updateinstances) as follows:

```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/manualupgrade?api-version={apiVersion}
```

## Exceptions to Upgrade Policy

There is one type of modification to global scale set properties that does not follow the upgrade policy. Changes to the scale set OS and Data disk Profile (such as admin username and password) can only be changed in API version *2017-12-01* or later. These changes only apply to VMs created after the change in the scale set model. To bring existing VMs up-to-date, you must do a "reimage" of each existing VM. You can do this reimage using:

### CLI 
Using [az vmss reimage](/cli/azure/vmss):

> [!NOTE]
> The `az vmss reimage` command will reimage the selected instance, restoring it to the initial state. The instance may be restarted, and any local data will be lost.

```azurecli
az vmss reimage --resource-group myResourceGroup --name myScaleSet --instance-id instanceId
```

### PowerShell 
Using [Set-AzVmssVm](/powershell/module/az.compute/set-azvmssvm):

```powershell
Set-AzVmssVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId instanceId -Reimage
```

### REST API 
Using [compute/virtualmachinescalesets/reimage](/rest/api/compute/virtualmachinescalesets/reimage) as follows:

```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/reimage?api-version={apiVersion}
```

## Next steps
You can also perform common management tasks on scale sets with the [Azure CLI](virtual-machine-scale-sets-manage-cli.md) or [Azure PowerShell](virtual-machine-scale-sets-manage-powershell.md).
