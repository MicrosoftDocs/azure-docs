---
title: Create a Virtual Network Flow Log by Using Bicep
titleSuffix: Azure Network Watcher
description: Learn how to use Bicep to create a virtual network flow log for an existing Azure virtual network.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 08/03/2026
ms.custom:
  - devx-track-bicep
  - mode-arm
  - build-2025

# Customer intent: As an Azure administrator, I want to create a virtual network flow log by using Bicep so that I can programmatically log and monitor traffic through my virtual network.
---

# Create a virtual network flow log by using Bicep

In this article, you use Bicep to create a virtual network flow log for an existing virtual network. The Bicep file also creates an Azure storage account for the flow log data. For more information, see [Virtual network flow logs overview](vnet-flow-logs-overview.md) and [What is Bicep?](../azure-resource-manager/bicep/overview.md)

Bicep is a domain-specific language that uses declarative syntax to deploy Azure resources.

## Prerequisites

# [PowerShell](#tab/powershell)

- An Azure account with an active subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
- An existing virtual network. The virtual network must be in the same region as the Network Watcher instance. If you need to create one, see [Create a virtual network using PowerShell](../virtual-network/quickstart-create-virtual-network.md?tabs=powershell).
- Azure PowerShell installed locally. For more information, see [Install Azure PowerShell](/powershell/azure/install-azure-powershell). Sign in by using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [Azure CLI](#tab/cli)

- An Azure account with an active subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
- An existing virtual network. The virtual network must be in the same region as the Network Watcher instance. If you need to create one, see [Create a virtual network using the Azure CLI](../virtual-network/quickstart-create-virtual-network.md?tabs=cli).
- Azure CLI installed locally. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli). Sign in by using the [az login](/cli/azure/reference-index#az-login) command.

---

## Review the Bicep file

This article uses the [Create virtual network flow logs](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/networkwatcher-flowLogs-create/main.bicep) Bicep file from the Azure Quickstart Templates. For more information, see [Enable Virtual Network Flow Logs](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/networkwatcher-flowLogs-create/README.md).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/networkwatcher-flowLogs-create/main.bicep" range="1-71" highlight="51-68":::

The Bicep file defines the following resources:

- [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts?pivots=deployment-language-bicep)
- [Microsoft.Network/networkWatchers](/azure/templates/microsoft.network/networkwatchers?pivots=deployment-language-bicep)
- [Microsoft.Network/networkWatchers/flowLogs](/azure/templates/microsoft.network/networkwatchers/flowlogs?pivots=deployment-language-bicep)

The highlighted code defines a virtual network flow log whose `targetResourceId` is the resource ID of an existing virtual network.

## Deploy the Bicep file

You must deploy the flow log to the resource group that contains the Network Watcher instance for the virtual network's region.

# [PowerShell](#tab/powershell)

1. Save the [Bicep file](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/networkwatcher-flowLogs-create/main.bicep) as *main.bicep* on your local computer.

1. Set the virtual network and Network Watcher variables. Replace the placeholder values with your values.

    ```azurepowershell
    $vnet = Get-AzVirtualNetwork -Name '<virtual-network-name>' -ResourceGroupName '<virtual-network-resource-group>'
    $networkWatcher = Get-AzNetworkWatcher -Location $vnet.Location
    ```

1. Deploy the Bicep file.

    ```azurepowershell
    $deployment = New-AzResourceGroupDeployment `
        -Name 'createVNetFlowLog' `
        -ResourceGroupName $networkWatcher.ResourceGroupName `
        -TemplateFile ./main.bicep `
        -location $vnet.Location `
        -existingVNet $vnet.Id
    ```

# [Azure CLI](#tab/cli)

1. Save the [Bicep file](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/networkwatcher-flowLogs-create/main.bicep) as *main.bicep* on your local computer.

1. Set the virtual network and Network Watcher variables. Replace the placeholder values with your values.

    ```azurecli
    vnetId=$(az network vnet show --name '<virtual-network-name>' --resource-group '<virtual-network-resource-group>' --query id --output tsv)
    location=$(az network vnet show --ids "$vnetId" --query location --output tsv)
    networkWatcherResourceGroup=$(az network watcher list --query "[?location=='$location'].resourceGroup | [0]" --output tsv)
    networkWatcherName=$(az network watcher list --query "[?location=='$location'].name | [0]" --output tsv)
    ```

1. Deploy the Bicep file.

    ```azurecli
    az deployment group create \
        --name 'createVNetFlowLog' \
        --resource-group "$networkWatcherResourceGroup" \
        --template-file main.bicep \
        --parameters location="$location" networkWatcherName="$networkWatcherName" existingVNet="$vnetId"
    ```

---

When the deployment finishes, the output shows that the provisioning state is `Succeeded`.

## Validate the deployment

# [PowerShell](#tab/powershell)

Use [Get-AzNetworkWatcherFlowLog](/powershell/module/az.network/get-aznetworkwatcherflowlog) to verify the flow log:

```azurepowershell
Get-AzNetworkWatcherFlowLog `
    -NetworkWatcherName $networkWatcher.Name `
    -ResourceGroupName $networkWatcher.ResourceGroupName `
    -Name $deployment.Outputs.flowLogName.Value
```

# [Azure CLI](#tab/cli)

Use [az network watcher flow-log show](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-show) to verify the flow log:

```azurecli
az network watcher flow-log show \
    --name 'VNetFlowLog1' \
    --resource-group "$networkWatcherResourceGroup" \
    --location "$location"
```

---

You can also go to **Network Watcher** > **Flow logs** in the [Azure portal](https://portal.azure.com) to confirm the flow log settings.

If you encounter deployment issues, see [Troubleshoot common Azure deployment errors](../azure-resource-manager/troubleshooting/common-deployment-errors.md).

## Clean up resources

When you no longer need the flow log and storage account, delete them.

# [PowerShell](#tab/powershell)

```azurepowershell
Remove-AzNetworkWatcherFlowLog `
    -Name $deployment.Outputs.flowLogName.Value `
    -Location $vnet.Location

Remove-AzStorageAccount `
    -ResourceGroupName $networkWatcher.ResourceGroupName `
    -Name $deployment.Outputs.storageAccountName.Value
```

# [Azure CLI](#tab/cli)

```azurecli
storageAccountName=$(az deployment group show --name 'createVNetFlowLog' --resource-group "$networkWatcherResourceGroup" --query properties.outputs.storageAccountName.value --output tsv)

az network watcher flow-log delete \
    --name 'VNetFlowLog1' \
    --location "$location"

az storage account delete \
    --name "$storageAccountName" \
    --resource-group "$networkWatcherResourceGroup" \
    --yes
```

---

## Related content

- [Create, change, enable, disable, or delete virtual network flow logs](vnet-flow-logs-manage.md)
- [Traffic analytics overview](traffic-analytics.md)
- [Manage virtual network flow logs using Azure Policy](vnet-flow-logs-policy.md)
