---
title: Manage NSG flow logs
titleSuffix: Azure Network Watcher
description: Learn how to create, change, enable, disable, or delete Azure Network Watcher network security group (NSG) flow logs.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 03/17/2025

#CustomerIntent: As an Azure administrator, I want to log my virtual network IP traffic using Network Watcher NSG flow logs so that I can analyze it later.
---

# Create, change, enable, disable, or delete NSG flow logs

[!INCLUDE [NSG flow logs retirement](../../includes/network-watcher-nsg-flow-logs-retirement.md)]

Network security group flow logging is a feature of Azure Network Watcher that allows you to log information about IP traffic flowing through a network security group. For more information about network security group flow logging, see [NSG flow logs overview](nsg-flow-logs-overview.md).

In this article, you learn how to create, change, enable, disable, or delete a network security group flow log using the Azure portal, PowerShell, and Azure CLI.

## Prerequisites

# [**Portal**](#tab/portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Insights provider. For more information, see [Register Insights provider](#register-insights-provider).

- A network security group. If you need to create a network security group, see [Create, change, or delete a network security group](../virtual-network/manage-network-security-group.md?tabs=network-security-group-portal&toc=/azure/network-watcher/toc.json).

- An Azure storage account. If you need to create a storage account, see [Create a storage account using the Azure portal](../storage/common/storage-account-create.md?tabs=azure-portal&toc=/azure/network-watcher/toc.json).

# [**PowerShell**](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Insights provider. For more information, see [Register Insights provider](#register-insights-provider).

- A virtual network. If you need to create a virtual network, see [Create a virtual network using PowerShell](../virtual-network/quick-create-powershell.md).

- An Azure storage account. If you need to create a storage account, see [Create a storage account using PowerShell](../storage/common/storage-account-create.md?tabs=azure-powershell&toc=/azure/network-watcher/toc.json).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the cmdlets in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. This article requires the Azure PowerShell module. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Insights provider. For more information, see [Register Insights provider](#register-insights-provider).

- A virtual network. If you need to create a virtual network, see [Create a virtual network using the Azure CLI](../virtual-network/quick-create-cli.md).

- An Azure storage account. If you need to create a storage account, see [Create a storage account using the Azure CLI](../storage/common/storage-account-create.md?tabs=azure-cli).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

---

## Register Insights provider

# [**Portal**](#tab/portal)

*Microsoft.Insights* provider must be registered to successfully log traffic flowing through a virtual network. If you aren't sure if the *Microsoft.Insights* provider is registered, check its status in the Azure portal by following these steps:

1. In the search box at the top of the portal, enter ***subscriptions***. Select **Subscriptions** from the search results.

    :::image type="content" source="./media/subscriptions-portal-search.png" alt-text="Screenshot that shows how to search for Subscriptions in the Azure portal." lightbox="./media/subscriptions-portal-search.png":::

1. Select the Azure subscription that you want to enable the provider for in **Subscriptions**.

1. Under **Settings**, select **Resource providers**.

1. Enter ***insight*** in the filter box.

1. Confirm the status of the provider displayed is **Registered**. If the status is **NotRegistered**, select the **Microsoft.Insights** provider then select **Register**.

    :::image type="content" source="./media/register-microsoft-insights.png" alt-text="Screenshot that shows how to register Microsoft Insights provider in the Azure portal." lightbox="./media/register-microsoft-insights.png":::

# [**PowerShell**](#tab/powershell)

*Microsoft.Insights* provider must be registered to successfully log traffic in a virtual network. If you aren't sure if the *Microsoft.Insights* provider is registered, use [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider) to register it.

```azurepowershell-interactive
# Register Microsoft.Insights provider.
Register-AzResourceProvider -ProviderNamespace 'Microsoft.Insights'
```

# [**Azure CLI**](#tab/cli)

*Microsoft.Insights* provider must be registered to successfully log traffic in a virtual network. If you aren't sure if the *Microsoft.Insights* provider is registered, use [az provider register](/cli/azure/provider#az-provider-register) to register it.

```azurecli-interactive
# Register Microsoft.Insights provider.
az provider register --namespace 'Microsoft.Insights'
```

---

## Create a flow log

Create a flow log for your network security group. The flow log is saved in an Azure storage account.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter ***network watcher***. Select **Network Watcher** from the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select **+ Create** or **Create flow log** blue button.

    :::image type="content" source="./media/nsg-flow-logs-portal/flow-logs.png" alt-text="Screenshot of Flow logs page in the Azure portal." lightbox="./media/nsg-flow-logs-portal/flow-logs.png":::

1. On the **Basics** tab of **Create a flow log**, enter or select the following values:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select the Azure subscription of your network security group that you want to log. |
    | Flow log type | Select **Network security group** then select **+ Select target resource**. <br> Select the network security group that you want to flow log, then select **Confirm selection**. |
    | Flow Log Name | Enter a name for the flow log or leave the default name. Azure portal uses ***{ResourceName}-{ResourceGroupName}-flowlog*** as a default name for the flow log. **myNSG-myResourceGroup-flowlog** is the default name used in this article. |
    | **Instance details** |   |
    | Subscription | Select the Azure subscription of your storage account. |
    | Storage accounts | Select the storage account that you want to save the flow logs to. If you want to create a new storage account, select **Create a new storage account**. |
    | Retention (days) | Enter a retention time for the logs (this option is only available with [Standard general-purpose v2](../storage/common/storage-account-overview.md?toc=/azure/network-watcher/toc.json#types-of-storage-accounts) storage accounts).  Enter *0* if you want to retain the flow logs data in the storage account forever (until you delete it from the storage account). For information about pricing, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/). |

    :::image type="content" source="./media/nsg-flow-logs-portal/create-nsg-flow-log-basics.png" alt-text="Screenshot of creating an NSG flow log in the Azure portal.":::

    > [!NOTE]
    > If the storage account is in a different subscription, the network security group and storage account must be associated with the same Microsoft Entra tenant. The account you use for each subscription must have the [necessary permissions](required-rbac-permissions.md).

1. To enable traffic analytics, select **Next: Analytics** button, or select the **Analytics** tab. Enter or select the following values:

    | Setting | Value |
    | ------- | ----- |
    | Flow logs version | Select the version of the network security group flow log, available options are: **Version 1** and **Version 2**.  The default version is version 2. For more information, see [Flow logging for network security groups](nsg-flow-logs-overview.md). |
    | Enable traffic analytics | Select the checkbox to enable traffic analytics for your flow log. |
    | Traffic analytics processing interval  | Select the processing interval that you prefer, available options are: **Every 1 hour** and **Every 10 mins**. The default processing interval is every one hour. For more information, see [Traffic analytics](traffic-analytics.md). |
    | Subscription | Select the Azure subscription of your Log Analytics workspace. |
    | Log Analytics Workspace | Select your Log Analytics workspace. By default, Azure portal creates ***DefaultWorkspace-{SubscriptionID}-{Region}*** Log Analytics workspace in ***defaultresourcegroup-{Region}*** resource group. |

    :::image type="content" source="./media/nsg-flow-logs-portal/create-nsg-flow-log-analytics.png" alt-text="Screenshot that shows how to enable traffic analytics for a new flow log in the Azure portal.":::

    > [!NOTE]
    > To create and select a Log Analytics workspace other than the default one, see [Create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace?toc=/azure/network-watcher/toc.json)

1. Select **Review + create**.

1. Review the settings, and then select **Create**.


# [**PowerShell**](#tab/powershell)

1. Get the properties of the network security group that you want to create the flow log for and the storage account that you want to use to store the created flow log using [Get-AzNetworkSecurityGroup](/powershell/module/az.network/get-aznetworksecuritygroup) and [Get-AzStorageAccount](/powershell/module/az.storage/get-azstorageaccount) respectively.

    ```azurepowershell-interactive
    # Place the network security group properties into a variable.
    $nsg = Get-AzNetworkSecurityGroup -Name 'myNSG' -ResourceGroupName 'myResourceGroup'
    
    # Place the storage account properties into a variable.
    $sa = Get-AzStorageAccount -Name 'myStorageAccount' -ResourceGroupName 'myResourceGroup'
    ```

    > [!NOTE]
    > - If the storage account is in a different subscription, the network security group and storage account must be associated with the same Azure Active Directory tenant. The account you use for each subscription must have the [necessary permissions](required-rbac-permissions.md).

1. Create the flow log using [New-AzNetworkWatcherFlowLog](/powershell/module/az.network/new-aznetworkwatcherflowlog). The flow log is created in the Network Watcher default resource group **NetworkWatcherRG**.

    ```azurepowershell-interactive
    # Create a version 1 NSG flow log.
    New-AzNetworkWatcherFlowLog -Name 'myFlowLog' -Location 'eastus' -TargetResourceId $nsg.Id -StorageId $sa.Id -Enabled $true
    ```


# [**Azure CLI**](#tab/cli)

Create a flow log using [az network watcher flow-log create](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-create). The flow log is created in the Network Watcher default resource group **NetworkWatcherRG**.

```azurecli-interactive
# Create a version 1 NSG flow log.
az network watcher flow-log create --name 'myFlowLog' --nsg 'myNSG' --resource-group 'myResourceGroup' --storage-account 'myStorageAccount'
```

```azurecli-interactive
# Create a version 1 NSG flow log (the storage account is in a different resource group from the network security group).
az network watcher flow-log create --name 'myFlowLog' --nsg 'myNSG' --resource-group 'myResourceGroup' --storage-account '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/StorageRG/providers/Microsoft.Storage/storageAccounts/myStorageAccount'
```

> [!NOTE]
> If the storage account is in a different subscription, the network security group and storage account must be associated with the same Azure Active Directory tenant. The account you use for each subscription must have the [necessary permissions](required-rbac-permissions.md).

## Create a flow log and traffic analytics workspace

1. Create a Log Analytics workspace using [az monitor log-analytics workspace create](/cli/azure/monitor/log-analytics/workspace#az-monitor-log-analytics-workspace-create).

    ```azurecli-interactive
    # Create a Log Analytics workspace.
    az monitor log-analytics workspace create --name 'myWorkspace' --resource-group 'myResourceGroup'
    ```

1. Create a flow log using [az network watcher flow-log create](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-create). The flow log is created in the Network Watcher default resource group **NetworkWatcherRG**.

    ```azurecli-interactive
    # Create a version 1 NSG flow log and enable traffic analytics for it.
    az network watcher flow-log create --name 'myFlowLog' --nsg 'myNSG' --resource-group 'myResourceGroup' --storage-account 'myStorageAccount' --traffic-analytics 'true' --workspace 'myWorkspace'
    ```

    ```azurecli-interactive
    # Create a version 1 NSG flow log and enable traffic analytics for it (storage account and traffic analytics workspace are in different resource groups from the network security group).
    az network watcher flow-log create --name 'myFlowLog' --nsg 'myNSG' --resource-group 'myResourceGroup' --storage-account '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/StorageRG/providers/Microsoft.Storage/storageAccounts/myStorageAccount' --traffic-analytics 'true' --workspace '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/WorkspaceRG/providers/Microsoft.OperationalInsights/workspaces/myWorkspace'
    ```

> [!NOTE]
> - The storage account can't have network rules that restrict network access to only Microsoft services or specific virtual networks.
> - If the storage account is in a different subscription, the network security group and storage account must be associated with the same Azure Active Directory tenant. The account you use for each subscription must have the [necessary permissions](required-rbac-permissions.md).


---



## Related content

- [Audit and deploy NSG flow logs using Azure Policy](nsg-flow-logs-policy-portal.md)
- [NSG flow logs](nsg-flow-logs-overview.md)
- [Traffic analytics](traffic-analytics.md)
