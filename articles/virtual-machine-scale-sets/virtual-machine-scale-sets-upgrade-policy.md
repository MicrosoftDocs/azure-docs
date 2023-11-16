---
title: Manage Upgrade Policies for Virtual Machine Scale Sets
description: Learn about the different upgrade policies available for Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.date: 03/28/2023
ms.reviewer: ju-shim
ms.custom: maxsurge, upgradepolicy, devx-track-azurecli, devx-track-azurepowershell
---
# Manage Upgrade Policies for Virtual Machine Scale Sets

> [!NOTE]
> Upgrade Policy currently only applies to Uniform Orchestration mode. We recommend using Flexible Orchestration for new workloads. For more information, see [Orchestration modes for Virtual Machine Scale Sets in Azure](virtual-machine-scale-sets-orchestration-modes.md).

The Upgrade Policy for a Virtual Machine Scale Set determines how VMs are brought up-to-date with the latest scale set model. This includes updates such as changes to the OS version, adding or removing data disks, NIC updates, or other updates that apply to the scale set instances as a whole.  

## Upgrade Policy modes
There are three different modes an Upgrade Policy can be set to. The modes are **Automatic**, **Rolling** and **Manual**. The upgrade mode you choose can impact the overall service uptime of your Virtual Machine Scale Set. 

Additionally, as your application processes traffic, there can be situations where you might want specific instances to be treated differently from the rest of the scale set instance. For example, certain instances in the scale set could be needed to perform additional or different tasks than the other members of the scale set. You might require these 'special' VMs not to be modified with the other instances in the scale set. In these situations, [Instance Protection](virtual-machine-scale-sets-instance-protection.md) provides the additional controls needed to protect these instances from the various upgrades discussed in this article.

### Manual
In this mode, you choose when to initiate an update to the scale set instances. Nothing happens automatically to the existing VMs when changes occur to the scale set model. New instances added to the scale set will use the most update-to-date model available.

### Automatic 
In this mode, the scale set makes no guarantees about the order of VMs being brought down. The scale set might take down all VMs at the same time when performing upgrades. If your scale set is part of a Service Fabric cluster, *Automatic* mode is the only available mode. For more information, see [Service Fabric application upgrades](../service-fabric/service-fabric-application-upgrade.md).

### Rolling

> [!IMPORTANT]
> Rolling Upgrades with MaxSurge is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 
>
> To enable this feature for your subscription, run `Register-AzProviderFeature -FeatureName MaxSurgeRollingUpgrade -ProviderNamespace Microsoft.Compute` in [Azure CloudShell](../cloud-shell/overview.md?).


In this mode, the scale set performs updates in batches with an optional pause time in between. There are two types of Rolling Upgrade Policies that can be configured:

-  **Rolling Upgrades with MaxSurge disabled**
    
    With MaxSurge disabled, the existing instances in a scale set are brought down in batches to be upgraded. Once the upgraded batch is complete, the instances will begin taking traffic again, and the next batch will begin. This continues until all instances brought up-to-date. 

-  **Rolling Upgrades with MaxSurge enabled**
    
    With MaxSurge enabled, new instances are created and brought up-to-date with the latest scale model in batches rather than taking down the old instances for upgrades. Once complete, the new instances are added to the scale set and the old instances are removed. This continues until all instances are brought up-to-date. Rolling Upgrades with MaxSurge can help improve service uptime during upgrade events. 


When using a Rolling Upgrade Policy, the scale set must also have a [health probe](../load-balancer/load-balancer-custom-probe-overview.md) or use the [Application Health Extension](virtual-machine-scale-sets-health-extension.md) to monitor application health.
 

## Setting the Upgrade Policy

> [!IMPORTANT]
>Starting November 2023, VM scale sets created using PowerShell and Azure CLI will default to Flexible Orchestration Mode if no orchestration mode is specified. For more information about this change and what actions you should take, go to [Breaking Change for VMSS PowerShell/CLI Customers - Microsoft Community Hub](https://techcommunity.microsoft.com/t5/azure-compute-blog/breaking-change-for-vmss-powershell-cli-customers/ba-p/3818295)

The Upgrade Policy can be set during deployment or updated post deployment.  

### [Portal](#tab/portal)

During the Virtual Machine Scale Set creation in the Azure portal, under the **Management** tab, set the Upgrade Policy to **Rolling**, **Automatic**, or **Manual**. 

:::image type="content" source="../virtual-machine-scale-sets/media/maxsurge/maxsurge-1.png" alt-text="Screenshot showing deploying a scale set and enabling MaxSurge.":::

### [CLI](#tab/cli)
Create a new Virtual Machine Scale Set using [az vmss create](/cli/azure/vmss#az-vmss-create) and set the Upgrade Policy to `Rolling` and enable `MaxSurge`. When using an Upgrade Policy set to Rolling, the scale set must also have a [health probe](../load-balancer/load-balancer-custom-probe-overview.md) or use the [Application Health Extension](virtual-machine-scale-sets-health-extension.md) to monitor application health. 

```azurecli-interactive
# Create a Resource Group
az group create --name myResourceGroup --location eastus

#Create a load balancer
az network lb create --resource-group MyResourceGroup --name MyLoadBalancer --sku Standard

# Create a health probe
az network lb probe create --resource-group MyResourceGroup --lb-name MyLoadBalancer --name MyProbe --protocol tcp --port 80

# Create a load balancing rule and assign the health probe
az network lb rule create --resource-group MyResourceGroup --lb-name myLoadBalancer --name MyLbRule --protocol Tcp --frontend-ip-name LoadBalancerFrontEnd --frontend-port 80 --backend-pool-name MyLoadBalancerbepool --backend-port 80 --probe myProbe

# Create the scale set
az vmss create \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --image Ubuntu2204 \
    --orchestration-mode Uniform \
    --lb myLoadBalancer \
    --health-probe myProbe \
    --upgrade-policy-mode Rolling \
    --max-surge true \
    --instance-count 5 \
    --disable-overprovision \
    --admin-username azureuser \
    --generate-ssh-keys
```

### [PowerShell](#tab/powershell)
Create a new Virtual Machine Scale Set using [New-AzVmss](/powershell/module/az.compute/new-azvmss) and set the Upgrade Policy to `Automatic`.

```azurepowershell-interactive
#Create a Resource Group
New-AzResourceGroup -Name myResourceGroup -Location Eastus

#Create the scale set
New-AzVmss `
  -ResourceGroupName "myResourceGroup" `
  -Location "EastUS" `
  -VMScaleSetName "myScaleSet" `
  -OrchestrationMode "Uniform" `
  -VirtualNetworkName "myVnet" `
  -SubnetName "mySubnet" `
  -PublicIpAddressName "myPublicIPAddress" `
  -LoadBalancerName "myLoadBalancer" `
  -UpgradePolicyMode "Automatic"
```

### [Template](#tab/template)
When using an ARM template, add the upgradePolicy to the properties section: 

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

## Changing the Upgrade Policy

The Upgrade Policy for a Virtual Machine Scale Set can be changed at any point in time. 

### [Portal](#tab/portal2)

Select the Virtual Machine Scale Set you want to change the Upgrade Policy for. In the menu under **Settings**, select **Upgrade Policy** and from the drop down menu, select the Upgrade Policy you want to enable. 

:::image type="content" source="../virtual-machine-scale-sets/media/maxsurge/maxsurge-2.png" alt-text="Screenshot showing changing the upgrade policy and enabling MaxSurge in the Azure portal.":::


### [CLI](#tab/cli2)
Update an existing Virtual Machine Scale Set using [az vmss update](/cli/azure/vmss#az-vmss-update) and enable `MaxSurge`. If you don't already have a health probe or the Application Health Extension installed, configure that prior to changing the Upgrade Policy.

```azurecli-interactive
az vmss update \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --set upgradePolicy.rollingUpgradePolicy.maxSurge=true
```

### [PowerShell](#tab/powershell2)
Update an existing Virtual Machine Scale Set using [Set-AzVmssRollingUpgradePolicy](/powershell/module/az.compute/set-azvmssrollingupgradepolicy) and [Update-AzVmss](/powershell/module/az.compute/update-azvmss). If you don't already have a health probe or the Application Health Extension installed, configure that prior to changing the Upgrade Policy.

```azurepowershell-interactive
$vmss = Get-AzVmss -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet"

Set-AzVmssRollingUpgradePolicy `
    -VirtualMachineScaleSet $vmss `
    -MaxBatchInstancePercent 40 `
    -MaxUnhealthyInstancePercent 35 `
    -MaxUnhealthyUpgradedInstancePercent 30 `
    -PauseTimeBetweenBatches "PT30S" `
    -MaxSurge $true

Update-Azvmss -ResourceGroupName "myResourceGroup" -Name "myScaleSet" -VirtualMachineScaleSet $vmss
```

### [Template](#tab/template2)

Update the properties section of your ARM template as follows: 

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

## Performing manual upgrades
 
If you have the Upgrade Policy set to manual, you need to trigger manual upgrades of each existing VM to apply changes to the instances based on the updated scale set model. 

> [!NOTE]
> While performing upgrades, the instances may be restarted.

### [Portal](#tab/portal3)

Select the Virtual Machine Scale Set you want to perform instance upgrades for. In the menu under **Settings**, select **Instances** and select the instances you want to upgrade. Once selected, click the **Upgrade** option.

:::image type="content" source="../virtual-machine-scale-sets/media/maxsurge/manual-upgrade-1.png" alt-text="Screenshot showing how to perform manual upgrades using the Azure portal.":::


### [CLI](#tab/cli3)
Update Virtual Machine Scale Set instances using [az vmss update-instances](/cli/azure/vmss#az-vmss-update-instances).

```azurecli-interactive
az vmss update-instances --resource-group myResourceGroup --name myScaleSet --instance-ids {instanceIds}
```
### [PowerShell](#tab/powershell3)
Update Virtual Machine Scale Set instances using [Update-AzVmssInstance](/powershell/module/az.compute/update-azvmssinstance).
    
```azurepowershell-interactive
Update-AzVmssInstance -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId instanceId
```

### [REST API](#tab/rest3)
Update Virtual Machine Scale Set instances using [update instances](/rest/api/compute/virtualmachinescalesets/updateinstances).

```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/manualupgrade?api-version={apiVersion}
```
---

## Exceptions to Upgrade Policies

Changes to the scale set OS, data disk Profile (such as admin username and password) and [Custom Data](../virtual-machines/custom-data.md) only apply to VMs created after the change in the scale set model. To bring existing VMs up-to-date, you must do a "reimage" of each existing VM. 

> [!NOTE]
> The Reimage flag will reimage the selected instance, restoring it to the initial state. The instance may be restarted, and any local data will be lost.

### [Portal](#tab/portal4)

Select the Virtual Machine Scale Set you want to perform instance upgrades for. In the menu under **Settings**, select **Instances** and select the instances you want to reimage. Once selected, click the **Reimage** option.


:::image type="content" source="../virtual-machine-scale-sets/media/maxsurge/reimage-upgrade-1.png" alt-text="Screenshot showing reimaging scale set instances using the Azure portal.":::


### [CLI](#tab/cli4)
Reimage a Virtual Machine Scale Set instance using [az vmss reimage](/cli/azure/vmss#az-vmss-reimage).

```azurecli-interactive
az vmss reimage --resource-group myResourceGroup --name myScaleSet --instance-id instanceId
```

### [PowerShell](#tab/powershell4)
Reimage a Virtual Machine Scale Set instance using [Set-AzVmssVM](/powershell/module/az.compute/set-azvmssvm).

```azurepowershell-interactive
Set-AzVmssVM -ResourceGroupName "myResourceGroup" -VMScaleSetName "myScaleSet" -InstanceId instanceId -Reimage
```

### [REST API](#tab/rest4)
Reimage a Virtual Machine Scale Set instance using [reimage](/rest/api/compute/virtualmachinescalesets/reimage).

```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/reimage?api-version={apiVersion}
```
---

## Next steps
You can also perform common management tasks on Virtual Machine Scale Sets using the [Azure CLI](virtual-machine-scale-sets-manage-cli.md) or [Azure PowerShell](virtual-machine-scale-sets-manage-powershell.md).
