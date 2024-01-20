---
title: Set the Upgrade Policy on Virtual Machine Scale Sets
description: Learn about to set the Upgrade Policy on Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 01/19/2024
ms.reviewer: ju-shim
ms.custom: upgradepolicy
---
# Set the Upgrade Policy on Virtual Machine Scale Sets

> [!IMPORTANT]
> **Upgrade Policies for Virtual Machine Scale Sets using Flexible Orchestration mode are currently in preview**. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of these features may change prior to general availability (GA). 
>
>Upgrade Policies for Virtual Machine Scale Sets using Uniform Orchestration mode are generally available (GA). 

The Upgrade Policy can be set during the scale set creation process or changed post deployment. If you don't explicitly set the Upgrade Policy, it defaults to Manual. To change the Upgrade Policy of an existing scale set deployment, see [Changing the Upgrade Policy](virtual-machine-scale-sets-change-upgrade-policy.md).

### [Portal](#tab/portal)

During the Virtual Machine Scale Set creation in the Azure portal, under the **Management** tab, set the Upgrade Policy to **Rolling**, **Automatic**, or **Manual**. 

If using a Rolling Upgrade Policy, see [Configure Rolling Upgrade Policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for configuration settings and suggestions.

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/pick-upgrade-policy.png" alt-text="Screenshot showing deploying a scale set and enabling MaxSurge.":::

### [CLI](#tab/cli)
When creating a new scale set using Azure CLI, use [az vmss create](/cli/azure/vmss#az-vmss-create) and the `-upgrade-policy-mode` parameter. Choose `Automatic`, `Manual` or `Rolling`. 

If using a Rolling Upgrade Policy, see [Configure Rolling Upgrade Policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for configuration settings and suggestions.

```azurecli-interactive
az vmss create \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --image Ubuntu2204 \
    --lb myLoadBalancer \
    --upgrade-policy-mode Manual \
    --instance-count 5 \
    --admin-username azureuser \
    --generate-ssh-keys
```

### [PowerShell](#tab/powershell)
When creating a new scale set using Azure PowerShell, use [New-AzVmss](/powershell/module/az.compute/new-azvmss) and the `UpgradePolicyMode` parameter. Choose `"Automatic"`, `"Manual"`" or `"Rolling"` 

If using a Rolling Upgrade Policy, see [Configure Rolling Upgrade Policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for configuration settings and suggestions.

```azurepowershell-interactive
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

### [ARM Template](#tab/template)
When using an ARM template, add the upgradePolicy to the properties section of your template 

If using a Rolling Upgrade Policy, see [Configure Rolling Upgrade Policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for configuration settings and suggestions.

```ARM
"properties": {
        "upgradePolicy": {
            "mode": "Manual",
        }
    }
```
---


## Next steps
Learn how to [change the Upgrade Policy](virtual-machine-scale-sets-change-upgrade-policy.md) of your Virtual Machine Scale Set. 