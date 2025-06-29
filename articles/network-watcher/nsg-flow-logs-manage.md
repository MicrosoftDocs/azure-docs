---
title: Manage NSG flow logs
titleSuffix: Azure Network Watcher
description: Learn how to create, change, enable, disable, or delete Azure Network Watcher network security group (NSG) flow logs.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: how-to
ms.date: 04/18/2025

#CustomerIntent: As an Azure administrator, I want to log my virtual network IP traffic using Network Watcher NSG flow logs so that I can analyze it later.
# Customer intent: As an Azure network administrator, I want to create, manage, and analyze NSG flow logs, so that I can monitor and understand the IP traffic flowing through my network security groups effectively.
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

- A network security group. If you need to create a network security group, see [Create, change, or delete a network security group](../virtual-network/manage-network-security-group.md?tabs=network-security-group-powershell&toc=/azure/network-watcher/toc.json).

- An Azure storage account. If you need to create a storage account, see [Create a storage account using PowerShell](../storage/common/storage-account-create.md?tabs=azure-powershell&toc=/azure/network-watcher/toc.json).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the cmdlets in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. This article requires the Azure PowerShell module. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Insights provider. For more information, see [Register Insights provider](#register-insights-provider).

- A network security group. If you need to create a network security group, see [Create, change, or delete a network security group](../virtual-network/manage-network-security-group.md?tabs=network-security-group-cli&toc=/azure/network-watcher/toc.json).

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

***Microsoft.Insights*** provider must be registered to successfully log traffic in a virtual network. If you aren't sure if the *Microsoft.Insights* provider is registered, use [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider) to register it:

```azurepowershell-interactive
# Register Microsoft.Insights provider.
Register-AzResourceProvider -ProviderNamespace 'Microsoft.Insights'
```

# [**Azure CLI**](#tab/cli)

***Microsoft.Insights*** provider must be registered to successfully log traffic in a virtual network. If you aren't sure if the *Microsoft.Insights* provider is registered, use [az provider register](/cli/azure/provider#az-provider-register) to register it:

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

    :::image type="content" source="./media/flow-logs.png" alt-text="Screenshot of Flow logs page in the Azure portal." lightbox="./media/flow-logs.png":::

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
    | Retention (days) | Enter a retention time for the logs (this option is only available with [Standard general-purpose v2](../storage/common/storage-account-overview.md?toc=/azure/network-watcher/toc.json#types-of-storage-accounts) storage accounts).  Enter *0* if you want to retain the flow logs data in the storage account forever (until you manually delete it from the storage account). For information about pricing, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/). |

    :::image type="content" source="./media/nsg-flow-logs-manage/create-nsg-flow-log-basics.png" alt-text="Screenshot of creating an NSG flow log in the Azure portal.":::

1. To enable traffic analytics, select **Next: Analytics** button, or select the **Analytics** tab. Enter or select the following values:

    | Setting | Value |
    | ------- | ----- |
    | Flow logs version | Select the version of the network security group flow log, available options are: **Version 1** and **Version 2**.  The default version is version 2. For more information, see [Flow logging for network security groups](nsg-flow-logs-overview.md). |
    | Enable traffic analytics | Select the checkbox to enable traffic analytics for your flow log. |
    | Traffic analytics processing interval  | Select the processing interval that you prefer, available options are: **Every 1 hour** and **Every 10 mins**. The default processing interval is every one hour. For more information, see [Traffic analytics](traffic-analytics.md). |
    | Subscription | Select the Azure subscription of your Log Analytics workspace. |
    | Log Analytics Workspace | Select your Log Analytics workspace. By default, Azure portal creates ***DefaultWorkspace-{SubscriptionID}-{Region}*** Log Analytics workspace in ***defaultresourcegroup-{Region}*** resource group. |

    :::image type="content" source="./media/nsg-flow-logs-manage/create-nsg-flow-log-analytics.png" alt-text="Screenshot that shows how to enable traffic analytics for a new flow log in the Azure portal.":::

    > [!NOTE]
    > To create and select a Log Analytics workspace other than the default one, see [Create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace?toc=/azure/network-watcher/toc.json)

1. Select **Review + create**.

1. Review the settings, and then select **Create**.

# [**PowerShell**](#tab/powershell)

Use [New-AzNetworkWatcherFlowLog](/powershell/module/az.network/new-aznetworkwatcherflowlog) cmdlet to create a flow log. The flow log is created in the Network Watcher default resource group **NetworkWatcherRG**.

- Enable NSG flow logs without traffic analytics:

    ```azurepowershell-interactive
    # Place the network security group properties into a variable.
    $nsg = Get-AzNetworkSecurityGroup -Name 'myNSG' -ResourceGroupName 'myResourceGroup'
    
    # Place the storage account configuration into a variable.
    $sa = Get-AzStorageAccount -Name 'myStorageAccount' -ResourceGroupName 'myResourceGroup'
    
    # Create a version 1 NSG flow log.
    New-AzNetworkWatcherFlowLog -Name 'myFlowLog' -Location 'eastus' -TargetResourceId $nsg.Id -StorageId $sa.Id -Enabled $true
    ```

- Enable NSG flow logs with traffic analytics:

    ```azurepowershell-interactive
    # Place the network security group properties into a variable.
    $nsg = Get-AzNetworkSecurityGroup -Name 'myNSG' -ResourceGroupName 'myResourceGroup'
    
    # Place the storage account configuration into a variable.
    $sa = Get-AzStorageAccount -Name 'myStorageAccount' -ResourceGroupName 'myResourceGroup'
    
    # Create a traffic analytics workspace and place its configuration into a variable.
    $workspace = New-AzOperationalInsightsWorkspace -Name 'myWorkspace' -ResourceGroupName 'myResourceGroup' -Location 'eastus'
    
    # Create a version 1 NSG flow log.
    New-AzNetworkWatcherFlowLog -Name 'myFlowLog' -Location 'eastus' -TargetResourceId $nsg.Id -StorageId $sa.Id -Enabled $true -EnableTrafficAnalytics -TrafficAnalyticsWorkspaceId $workspace.ResourceId
    ```

# [**Azure CLI**](#tab/cli)

Use [az network watcher flow-log create](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-create) command to create a virtual network flow log. The flow log is created in the Network Watcher default resource group **NetworkWatcherRG**.

- Enable NSG flow logs without traffic analytics:

    ```azurecli-interactive
    # Create a version 1 NSG flow log.
    az network watcher flow-log create --name 'myFlowLog' --nsg 'myNSG' --resource-group 'myResourceGroup' --storage-account 'myStorageAccount' --location 'eastus' 
    ```
    
    If the storage account is in a different resource group from the network security group, use the resource ID of the storage account instead of its name:

    ```azurecli-interactive
    # Create a version 1 NSG flow log (the storage account is in a different resource group from the network security group).
    az network watcher flow-log create --name 'myFlowLog' --nsg 'myNSG' --resource-group 'myResourceGroup' --storage-account '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/StorageRG/providers/Microsoft.Storage/storageAccounts/myStorageAccount' --location 'eastus' 
    ```

- Enable NSG flow logs with traffic analytics:

    ```azurecli-interactive
    # Create a traffic analytics workspace.
    az monitor log-analytics workspace create --name 'myWorkspace' --resource-group 'myResourceGroup' --location 'eastus'

    # Create a version 1 NSG flow log and enable traffic analytics for it.
    az network watcher flow-log create --name 'myFlowLog' --nsg 'myNSG' --resource-group 'myResourceGroup' --storage-account 'myStorageAccount' --traffic-analytics true --workspace 'myWorkspace' --location 'eastus' 
    ```
    
    If the storage account is in a different resource group from the network security group, use the resource ID of the storage account instead of its name.

---

> [!NOTE]
> If the storage account is in a different subscription, the network security group and storage account must be associated with the same Microsoft Entra tenant. The account you use for each subscription must have the [necessary permissions](required-rbac-permissions.md).

> [!IMPORTANT]
> The storage account must not have network rules that restrict network access to only Microsoft services or specific virtual networks.

## Enable or disable traffic analytics

Enable traffic analytics for a flow log to analyze the flow log data. Traffic analytics provides insights into the traffic patterns of your virtual network. You can enable or disable traffic analytics for a flow log at any time.

> [!NOTE]
> In addition to enabling or disabling traffic analytics, you can also change other flow log settings.

# [**Portal**](#tab/portal)

To enable traffic analytics for a flow log, follow these steps:

1. In the search box at the top of the portal, enter ***network watcher***. Select **Network Watcher** from the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the flow log that you want to enable traffic analytics for.

1. In **Flow logs settings**, under **Traffic analytics**, check the **Enable traffic analytics** checkbox.

    :::image type="content" source="./media/nsg-flow-logs-manage/enable-traffic-analytics.png" alt-text="Screenshot that shows how to enable traffic analytics for an existing flow log in the Azure portal." lightbox="./media/nsg-flow-logs-manage/enable-traffic-analytics.png":::

1. Enter or select the following values:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select the Azure subscription of your Log Analytics workspace. |
    | Log Analytics workspace | Select your Log Analytics workspace. By default, Azure portal creates ***DefaultWorkspace-{SubscriptionID}-{Region}*** Log Analytics workspace in ***defaultresourcegroup-{Region}*** resource group. |
    | Traffic logging interval  | Select the processing interval that you prefer, available options are: **Every 1 hour** and **Every 10 mins**. The default processing interval is every one hour. For more information, see [Traffic analytics](traffic-analytics.md). |

    :::image type="content" source="./media/nsg-flow-logs-manage/enable-traffic-analytics-settings.png" alt-text="Screenshot that shows configurations of traffic analytics for an existing flow log in the Azure portal." lightbox="./media/nsg-flow-logs-manage/enable-traffic-analytics-settings.png":::

1. Select **Save** to apply the changes.

To disable traffic analytics for a flow log, take the previous steps 1-3, then uncheck the **Enable traffic analytics** checkbox and select **Save**.

:::image type="content" source="./media/nsg-flow-logs-manage/disable-traffic-analytics.png" alt-text="Screenshot that shows how to disable traffic analytics for an existing flow log in the Azure portal." lightbox="./media/nsg-flow-logs-manage/disable-traffic-analytics.png":::

# [**PowerShell**](#tab/powershell)

To enable traffic analytics on a flow log resource, use [Set-AzNetworkWatcherFlowLog](/powershell/module/az.network/set-aznetworkwatcherflowlog) cmdlet:

```azurepowershell-interactive
# Place the network security group properties into a variable.
$nsg = Get-AzNetworkSecurityGroup -Name 'myNSG' -ResourceGroupName 'myResourceGroup'

# Place the storage account properties into a variable.
$sa = Get-AzStorageAccount -Name 'myStorageAccount' -ResourceGroupName 'myResourceGroup'

# Place the workspace configuration into a variable.
$workspace = Get-AzOperationalInsightsWorkspace -Name 'myWorkspace' -ResourceGroupName 'myResourceGroup'

# Update the NSG flow log.
Set-AzNetworkWatcherFlowLog -Enabled $true -Name 'myFlowLog' -Location 'eastus' -TargetResourceId $nsg.Id -StorageId $sa.Id -EnableTrafficAnalytics -TrafficAnalyticsWorkspaceId $workspace.ResourceId -FormatVersion 2
```

To disable traffic analytics on the flow log resource and continue to generate and save flow logs to storage account, use [Set-AzNetworkWatcherFlowLog](/powershell/module/az.network/set-aznetworkwatcherflowlog) cmdlet:

```azurepowershell-interactive
# Place the network security group properties into a variable.
$nsg = Get-AzNetworkSecurityGroup -Name 'myNSG' -ResourceGroupName 'myResourceGroup'

# Place the storage account configuration into a variable.
$sa = Get-AzStorageAccount -Name 'myStorageAccount' -ResourceGroupName 'myResourceGroup'

# Update the NSG flow log.
Set-AzNetworkWatcherFlowLog -Enabled $true -Name 'myFlowLog' -Location 'eastus' -TargetResourceId $nsg.Id -StorageId $sa.Id -FormatVersion 2
```

# [**Azure CLI**](#tab/cli)

To enable traffic analytics on a flow log resource, use [az network watcher flow-log update](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-update) command:

```azurecli-interactive
# Update the NSG flow log.
az network watcher flow-log update --name 'myFlowLog' --nsg 'myNSG' --resource-group 'myResourceGroup' --storage-account 'myStorageAccount' --traffic-analytics true --workspace 'myWorkspace' --log-version '2'
```

To disable traffic analytics on the flow log resource and continue to generate and save flow logs to the storage account, use [az network watcher flow-log update](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-update) command:

```azurecli-interactive
# Update the NSG flow log.
az network watcher flow-log update --name 'myFlowLog' --nsg 'myNSG' --resource-group 'myResourceGroup' --storage-account 'myStorageAccount' --traffic-analytics false --log-version '2'
```

---

## List all flow logs

You can list all flow logs in a subscription or a group of subscriptions (Azure portal). You can also list all flow logs in a region.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter ***network watcher***. Select **Network Watcher** from the search results.

1. Under **Logs**, select **Flow logs**.

1. Select **Subscription equals** filter to choose one or more of your subscriptions. You can apply other filters like **Location equals** to list all flow logs in a region.

    :::image type="content" source="./media/nsg-flow-logs-manage/list-flow-logs.png" alt-text="Screenshot shows how to use filters to list all existing flow logs in a subscription using the Azure portal." lightbox="./media/nsg-flow-logs-manage/list-flow-logs.png":::


# [**PowerShell**](#tab/powershell)

Use [Get-AzNetworkWatcherFlowLog](/powershell/module/az.network/get-aznetworkwatcherflowlog) cmdlet to list all flow log resources in a particular region in your subscription:

```azurepowershell-interactive
# Get all flow logs in East US region.
Get-AzNetworkWatcherFlowLog -Location 'eastus' | format-table Name
```

> [!NOTE]
> To use the `-Location` parameter with `Get-AzNetworkWatcherFlowLog` cmdlet, you need an additional **Reader** permission in the **NetworkWatcherRG** resource group.

# [**Azure CLI**](#tab/cli)

Use [az network watcher flow-log list](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-list) command to list all flow log resources in a particular region in your subscription:

```azurecli-interactive
# Get all flow logs in East US region.
az network watcher flow-log list --location 'eastus' --out table
```

---

## View details of a flow log resource

You can view the details of a flow log.

# [**Portal**](#tab/portal)


1. In the search box at the top of the portal, enter ***network watcher***. Select **Network Watcher** from the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the flow log that you want to see.

1. In **Flow logs settings**, you can view the settings of the flow log resource.

    :::image type="content" source="./media/nsg-flow-logs-manage/flow-log-settings.png" alt-text="Screenshot of Flow logs settings page in the Azure portal." lightbox="./media/nsg-flow-logs-manage/flow-log-settings.png":::

1. Select **Cancel** to close the settings page without making changes.


# [**PowerShell**](#tab/powershell)

Use [Get-AzNetworkWatcherFlowLog](/powershell/module/az.network/get-aznetworkwatcherflowlog) cmdlet to see details of a flow log resource:

```azurepowershell-interactive
# Get the details of a flow log.
Get-AzNetworkWatcherFlowLog -Name 'myFlowLog' -Location 'eastus'
```

> [!NOTE]
> To use the `-Location` parameter with `Get-AzNetworkWatcherFlowLog` cmdlet, you need an additional **Reader** permission in the **NetworkWatcherRG** resource group.

# [**Azure CLI**](#tab/cli)

Use [az network watcher flow-log show](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-show) command to see details of a flow log resource:

```azurecli-interactive
# Get the details of a flow log.
az network watcher flow-log show --name 'myFlowLog' --resource-group 'NetworkWatcherRG' --location 'eastus'
```

---

## Download a flow log

You can download the flow logs data from the storage account that you saved the flow logs to.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter ***storage accounts***. Select **Storage accounts** from the search results.

1. Select the storage account you used to store the logs.

1. Under **Data storage**, select **Containers**.

1. Select the **insights-logs-networksecuritygroupflowevent** container.

1. In **insights-logs-networksecuritygroupflowevent**, navigate the folder hierarchy until you get to the `PT1H.json` file that you want to download. NSG flow log files follow the following path:

    ```
    https://{storageAccountName}.blob.core.windows.net/insights-logs-networksecuritygroupflowevent/resourceId=/SUBSCRIPTIONS/{subscriptionID}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/{NetworkSecurityGroupName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json
    ```

1. Select the ellipsis **...** to the right of the `PT1H.json` file, then select **Download**.

# [**PowerShell**](#tab/powershell)

To download virtual network flow logs from your storage account, use [Get-AzStorageBlobContent](/powershell/module/az.storage/get-azstorageblobcontent) cmdlet. For more information, see [Download a blob](../storage/blobs/storage-quickstart-blobs-powershell.md#download-blobs).

NSG flow log files saved to a storage account follow this path:

```
https://{storageAccountName}.blob.core.windows.net/insights-logs-networksecuritygroupflowevent/resourceId=/SUBSCRIPTIONS/{subscriptionID}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/{NetworkSecurityGroupName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json
```

# [**Azure CLI**](#tab/cli)

To download virtual network flow logs from your storage account, use the [az storage blob download](/cli/azure/storage/blob#az-storage-blob-download) command. For more information, see [Download a blob](../storage/blobs/storage-quickstart-blobs-cli.md#download-a-blob).

NSG flow log files saved to a storage account follow this path:

```
https://{storageAccountName}.blob.core.windows.net/insights-logs-networksecuritygroupflowevent/resourceId=/SUBSCRIPTIONS/{subscriptionID}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/{NetworkSecurityGroupName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json
```

---

> [!NOTE]
> As an alternative way to access and download flow logs from your storage account, you can use Azure Storage Explorer. For more information, see [Get started with Storage Explorer](../storage/storage-explorer/vs-azure-tools-storage-manage-with-storage-explorer.md) and [Download blobs using Storage Explorer](../storage/blobs/quickstart-storage-explorer.md#download-blobs).

For information about the structure of a flow log, see [Log format of NSG flow logs](nsg-flow-logs-overview.md#log-format).

## Disable a flow log

You can temporarily disable a flow log without deleting it. Disabling a flow log stops flow logging for the associated network security group. However, the flow log resource remains with all its settings and associations. You can re-enable it at any time to resume flow logging for the configured network security group.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** from the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the checkbox of the flow log that you want to disable.

1. Select **Disable**.

    :::image type="content" source="./media/nsg-flow-logs-manage/disable-flow-log.png" alt-text="Screenshot shows how to disable a flow log in the Azure portal." lightbox="./media/nsg-flow-logs-manage/disable-flow-log.png":::

# [**PowerShell**](#tab/powershell)

Use [Set-AzNetworkWatcherFlowLog](/powershell/module/az.network/set-aznetworkwatcherflowlog) cmdlet to disable a flow log:

```azurepowershell-interactive
# Place the network security group properties into a variable.
$nsg = Get-AzNetworkSecurityGroup -Name 'myNSG' -ResourceGroupName 'myResourceGroup'

# Place the storage account properties into a variable.
$sa = Get-AzStorageAccount -Name 'myStorageAccount' -ResourceGroupName 'myResourceGroup'

# Update the NSG flow log.
Set-AzNetworkWatcherFlowLog -Enabled $false -Name 'myFlowLog' -Location 'eastus' -TargetResourceId $nsg.Id -StorageId $sa.Id
```


# [**Azure CLI**](#tab/cli)

Use [az network watcher flow-log update](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-update) command to disable a flow log:

```azurecli-interactive
# Disable the flow log.
az network watcher flow-log update --name 'myFlowLog' --nsg 'myNSG' --resource-group 'myResourceGroup' --storage-account 'myStorageAccount' --enabled false
```

---

> [!NOTE]
> If traffic analytics is enabled for a flow log, it must disabled before you can disable the flow log. To disable traffic analytics, see [Enable or disable traffic analytics](#enable-or-disable-traffic-analytics).

## Delete a flow log

You can permanently delete a virtual network flow log. Deleting a flow log deletes all its settings and associations. To begin flow logging again for the same resource, you must create a new flow log for it.

# [**Portal**](#tab/portal)

1. In the search box at the top of the portal, enter *network watcher*. Select **Network Watcher** from the search results.

1. Under **Logs**, select **Flow logs**.

1. In **Network Watcher | Flow logs**, select the checkbox of the flow log that you want to delete.

1. Select **Delete**.

    :::image type="content" source="./media/nsg-flow-logs-manage/delete-flow-log.png" alt-text="Screenshot shows how to delete a flow log in the Azure portal." lightbox="./media/nsg-flow-logs-manage/delete-flow-log.png":::


# [**PowerShell**](#tab/powershell)

To delete a flow log resource, use [Remove-AzNetworkWatcherFlowLog](/powershell/module/az.network/remove-aznetworkwatcherflowlog) cmdlet:

```azurepowershell-interactive
# Delete the flow log.
Remove-AzNetworkWatcherFlowLog -Name 'myFlowLog' -Location 'eastus'
```

# [**Azure CLI**](#tab/cli)

To delete a flow log resource, use [az network watcher flow-log delete](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-delete) command:

```azurecli-interactive
# Delete the flow log.
az network watcher flow-log delete --name 'myFlowLog' --location 'eastus' --no-wait 'true'
```

---

> [!NOTE]
> Deleting a flow log does not delete the flow log data from the storage account. Flow logs data stored in a storage account follows the configured retention policy or stays stored in the storage account until manually deleted.

## Related content

- [Virtual network flow logs](vnet-flow-logs-overview.md)
- [Migrate from network security group flow logs to virtual network flow logs](nsg-flow-logs-migrate.md)
- [Traffic analytics](traffic-analytics.md)
