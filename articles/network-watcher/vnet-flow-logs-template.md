---
title: Create a Virtual Network Flow Log by Using an ARM Template
titleSuffix: Azure Network Watcher
description: Learn how to use an Azure Resource Manager template (ARM) to create a virtual network flow log for an existing Azure virtual network.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 08/04/2026
ms.custom:
  - devx-track-azurepowershell
  - devx-track-azurecli
  - devx-track-arm-template
  - mode-arm

# Customer intent: As an Azure administrator, I want to create a virtual network flow log by using an ARM template so that I can programmatically log and monitor traffic through my virtual network.
---

# Create a virtual network flow log by using an Azure Resource Manager template

In this article, you use an Azure Resource Manager (ARM) template to create a virtual network flow log for an existing virtual network. The template also creates an Azure storage account for the flow log data. For more information, see [Virtual network flow logs overview](vnet-flow-logs-overview.md) and [What are ARM templates?](../azure-resource-manager/templates/overview.md)

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select **Deploy to Azure**. In the Azure portal, select the resource group that contains the Network Watcher instance, enter the resource ID of your virtual network, and set **Location** to the virtual network's region.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fnetworkwatcher-flowLogs-create%2Fazuredeploy.json":::

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

## Review the template

This article uses the [Create virtual network flow logs](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/networkwatcher-flowLogs-create/azuredeploy.json) template from Azure Quickstart Templates. For more information, see [Enable Virtual Network Flow Logs](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/networkwatcher-flowLogs-create/README.md).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/networkwatcher-flowLogs-create/azuredeploy.json" range="1-128" highlight="94-116":::

The template defines the following resources:

- [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts?pivots=deployment-language-arm-template)
- [Microsoft.Network/networkWatchers](/azure/templates/microsoft.network/networkwatchers?pivots=deployment-language-arm-template)
- [Microsoft.Network/networkWatchers/flowLogs](/azure/templates/microsoft.network/networkwatchers/flowlogs?pivots=deployment-language-arm-template)

The highlighted code defines a virtual network flow log whose `targetResourceId` is the resource ID of an existing virtual network.

## Deploy the template

You must deploy the flow log to the resource group that contains the Network Watcher instance for the virtual network's region.

# [PowerShell](#tab/powershell)

1. Save the [ARM template](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/networkwatcher-flowLogs-create/azuredeploy.json) as *azuredeploy.json* on your local computer.

1. Set the virtual network and Network Watcher variables. Replace the placeholder values with your values.

    ```azurepowershell
    $vnet = Get-AzVirtualNetwork -Name '<virtual-network-name>' -ResourceGroupName '<virtual-network-resource-group>'
    $networkWatcher = Get-AzNetworkWatcher -Location $vnet.Location
    ```

1. Deploy the template.

    ```azurepowershell
    $deployment = New-AzResourceGroupDeployment `
        -Name 'createVNetFlowLog' `
        -ResourceGroupName $networkWatcher.ResourceGroupName `
        -TemplateFile ./azuredeploy.json `
        -location $vnet.Location `
        -networkWatcherName $networkWatcher.Name `
        -existingVNet $vnet.Id
    ```

# [Azure CLI](#tab/cli)

1. Save the [ARM template](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.network/networkwatcher-flowLogs-create/azuredeploy.json) as *azuredeploy.json* on your local computer.

1. Set the virtual network and Network Watcher variables. Replace the placeholder values with your values.

    ```azurecli
    vnetId=$(az network vnet show --name '<virtual-network-name>' --resource-group '<virtual-network-resource-group>' --query id --output tsv)
    location=$(az network vnet show --ids "$vnetId" --query location --output tsv)
    networkWatcherResourceGroup=$(az network watcher list --query "[?location=='$location'].resourceGroup | [0]" --output tsv)
    networkWatcherName=$(az network watcher list --query "[?location=='$location'].name | [0]" --output tsv)
    ```

1. Deploy the template.

    ```azurecli
    az deployment group create \
        --name 'createVNetFlowLog' \
        --resource-group "$networkWatcherResourceGroup" \
        --template-file azuredeploy.json \
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