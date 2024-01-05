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
    --lb myLoadBalancer \
    --health-probe myProbe \
    --upgrade-policy-mode Rolling \
    --max-surge true \
    --instance-count 5 \
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





## Next steps
You can also perform common management tasks on Virtual Machine Scale Sets using the [Azure CLI](virtual-machine-scale-sets-manage-cli.md) or [Azure PowerShell](virtual-machine-scale-sets-manage-powershell.md).
