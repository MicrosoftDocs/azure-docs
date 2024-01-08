---
title: Set the Upgrade Policy on Virtual Machine Scale Sets
description: Learn about to set the Upgrade Policy on Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 01/04/2024
ms.reviewer: ju-shim
ms.custom: maxsurge, upgradepolicy, devx-track-azurecli, devx-track-azurepowershell
---
# Set the Upgrade Policy on Virtual Machine Scale Sets

During Virtual Machine Scale Set creation, you can choose which upgrade policy you wish to use. The upgrade policy can be changed at any point in time. For more information see, [Changing the Upgrade Policy](virtual-machine-scale-sets-change-upgrade-policy.md)

### [Portal](#tab/portal)

During the Virtual Machine Scale Set creation in the Azure portal, under the **Management** tab, set the Upgrade Policy to **Rolling**, **Automatic**, or **Manual**. 

:::image type="content" source="../virtual-machine-scale-sets/media/maxsurge/maxsurge-1.png" alt-text="Screenshot showing deploying a scale set and enabling MaxSurge.":::

### [CLI](#tab/cli)
When creating a new scale set using Azure CLI, use [az vmss create](/cli/azure/vmss#az-vmss-create) and the `upgrade-policy-mode` parameter. Choose `Automatic`, `Manual` or `Rolling`. If using Rolling Upgrade Policy, you need to include more parameters. For more information, see [Configure Rolling Upgrade Policy](virtual-machine-scale-sets-configure-rolling-upgrades.md). 

```azurecli-interactive
az vmss create \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --image Ubuntu2204 \
    --lb myLoadBalancer \
    --health-probe myProbe \
    --upgrade-policy-mode Manual \
    --instance-count 5 \
    --admin-username azureuser \
    --generate-ssh-keys
```

### [PowerShell](#tab/powershell)
When creating a new scale set using Azure PowerShell, use [New-AzVmss](/powershell/module/az.compute/new-azvmss) and the `UpgradePolicyMode` parameter. Choose "Automatic", "Manual" or "Rolling". If using Rolling Upgrade Policy, you need to include more parameters. For more information, see [Configure Rolling Upgrade Policy](virtual-machine-scale-sets-configure-rolling-upgrades.md). 

```azurepowershell-interactive
#Create a Resource Group
New-AzResourceGroup -Name myResourceGroup -Location Eastus

New-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -Location "EastUS" `
  -VMScaleSetName "myScaleSet" `
  -VirtualNetworkName "myVnet" `
  -SubnetName "mySubnet" `
  -PublicIpAddressName "myPublicIPAddress" `
  -LoadBalancerName "myLoadBalancer" `
  -UpgradePolicyMode "Automatic"
```

### [Template](#tab/template)
When using an ARM template, add the upgradePolicy to the properties section. If using Automatic or Manual upgrade policy, you can omit everything after the "Mode" parameter. 

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
---





## Next steps
You can also perform common management tasks on Virtual Machine Scale Sets using the [Azure CLI](virtual-machine-scale-sets-manage-cli.md) or [Azure PowerShell](virtual-machine-scale-sets-manage-powershell.md).
