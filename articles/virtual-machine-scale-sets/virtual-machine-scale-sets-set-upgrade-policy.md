---
title: Set the upgrade policy on Virtual Machine Scale Sets (Preview)
description: Learn about to set the upgrade policy on Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: azure-virtual-machine-scale-sets
ms.date: 6/6/2024
ms.reviewer: ju-shim
ms.custom: upgradepolicy
---
# Set the upgrade policy on Virtual Machine Scale Sets (Preview)

> [!NOTE]
> Upgrade policies for Virtual Machine Scale Sets with Uniform Orchestration are in general availability (GA). 
>
>**Upgrade policies for Virtual Machine Scale Sets with Flexible Orchestration are currently in preview.** Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of these features may change prior to general availability (GA).

The upgrade policy can be set during scale set creation or changed post deployment. If you don't explicitly set the upgrade policy, it defaults to manual. To change the upgrade policy of an existing scale set deployment, see [changing the upgrade policy](virtual-machine-scale-sets-change-upgrade-policy.md).

### [Portal](#tab/portal)

During the Virtual Machine Scale Set creation in the Azure portal, under the **Management** tab, set the upgrade policy to **Rolling**, **Automatic**, or **Manual**. 

If using a rolling upgrade policy, see [configure rolling upgrade policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for configuration settings and suggestions.

:::image type="content" source="../virtual-machine-scale-sets/media/upgrade-policy/pick-upgrade-policy.png" alt-text="Screenshot showing deploying a scale set and enabling MaxSurge.":::

### [CLI](#tab/cli)

When creating a new scale set using Azure CLI, use [az vmss create](/cli/azure/vmss#az-vmss-create) and the `-upgrade-policy-mode` to set the upgrade policy mode.  

If using a rolling upgrade policy, see [configure rolling upgrade policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for configuration settings and suggestions.

```azurecli-interactive
az vmss create \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --orchestration-mode Flexible \
    --image Ubuntu2204 \
    --lb myLoadBalancer \
    --upgrade-policy-mode manual \
    --instance-count 5 \
    --admin-username azureuser \
    --generate-ssh-keys
```

### [PowerShell](#tab/powershell)

> [!NOTE]
> Setting the upgrade policy to automatic during scale set creation using PowerShell on Virtual Machine Scale Sets with Flexible Orchestration is not yet available. To set the upgrade policy to automatic, update the upgrade policy after scale set deployment. See [changing the upgrade policy on a Virtual Machine Scale Set](virtual-machine-scale-sets-change-upgrade-policy.md). 

When creating a new scale set using Azure PowerShell, use [New-AzVmss](/powershell/module/az.compute/new-azvmss) and the `-UpgradePolicyMode` parameter to set the upgrade policy mode.

If using a rolling upgrade policy, see [configure rolling upgrade policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for configuration settings and suggestions.

```azurepowershell-interactive
New-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -Location "EastUS" `
  -VMScaleSetName "myScaleSet" `
  -OrchestrationMode "Flexible" `
  -VirtualNetworkName "myVnet" `
  -SubnetName "mySubnet" `
  -PublicIpAddressName "myPublicIPAddress" `
  -LoadBalancerName "myLoadBalancer" `
  -UpgradePolicyMode "Manual"
```

### [ARM Template](#tab/template)
When using an ARM template, add the `upgradePolicy` parameter to the properties section of your template to set the upgrade policy mode. 

If using a rolling upgrade policy, see [configure rolling upgrade policy](virtual-machine-scale-sets-configure-rolling-upgrades.md) for configuration settings and suggestions.

```ARM
"properties": {
        "upgradePolicy": {
            "mode": "manual",
        }
    }
```
---


## Next steps
Learn how to [change the upgrade policy](virtual-machine-scale-sets-change-upgrade-policy.md) of your Virtual Machine Scale Set. 
