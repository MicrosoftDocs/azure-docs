---
title: Manage NSG flow logs - Azure PowerShell
titleSuffix: Azure Network Watcher
description: Learn how to create, change, disable, or delete Azure Network Watcher NSG flow logs using Azure PowerShell.
author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 05/31/2023
ms.author: halkazwini
ms.custom: template-how-to, devx-track-azurepowershell, engagement-fy23
---

# Manage NSG flow logs using Azure PowerShell

> [!div class="op_single_selector"]
> - [Azure portal](nsg-flow-logging.md)
> - [PowerShell](network-watcher-nsg-flow-logging-powershell.md)
> - [Azure CLI](network-watcher-nsg-flow-logging-cli.md)
> - [REST API](network-watcher-nsg-flow-logging-rest.md)
> - [ARM template](network-watcher-nsg-flow-logging-azure-resource-manager.md)

Network security group flow logging is a feature of Azure Network Watcher that allows you to log information about IP traffic flowing through a network security group. For more information about network security group flow logging, see [NSG flow logs overview](network-watcher-nsg-flow-logging-overview.md).

In this article, you learn how to create, change, disable, or delete an NSG flow log using Azure PowerShell. You can learn how to manage an NSG flow log using the [Azure portal](nsg-flow-logging.md), [Azure CLI](network-watcher-nsg-flow-logging-cli.md), [REST API](network-watcher-nsg-flow-logging-rest.md), or [ARM template](network-watcher-nsg-flow-logging-azure-resource-manager.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Insights provider. For more information, see [Register Insights provider](#register-insights-provider).

- A network security group. If you need to create a network security group, see [Create, change, or delete a network security group](../virtual-network/manage-network-security-group.md?tabs=network-security-group-powershell).

- An Azure storage account. If you need to create a storage account, see [create a storage account using PowerShell](../storage/common/storage-account-create.md?tabs=azure-powershell).

- [Azure Cloud Shell](/azure/cloud-shell/overview) or Azure PowerShell installed locally.

    - The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloudshell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.
    
    - You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

## Register insights provider

*Microsoft.Insights* provider must be registered to successfully log traffic flowing through a network security group. If you aren't sure if the *Microsoft.Insights* provider is registered, use [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider) to register it.

```azurepowershell-interactive
# Register Microsoft.Insights provider.
Register-AzResourceProvider -ProviderNamespace 'Microsoft.Insights'
```

## Create a flow log

1. Get the properties of the network security group that you want to create the flow log for and the storage account that you want to use to store the created flow log using [Get-AzNetworkSecurityGroup](/powershell/module/az.network/get-aznetworksecuritygroup) and [Get-AzStorageAccount](/powershell/module/az.storage/get-azstorageaccount) respectively.

    ```azurepowershell-interactive
    # Place the network security group properties into a variable.
    $nsg = Get-AzNetworkSecurityGroup -Name 'myNSG' -ResourceGroupName 'myResourceGroup'
    
    # Place the storage account properties into a variable.
    $sa = Get-AzStorageAccount -Name 'myStorageAccount' -ResourceGroupName 'myResourceGroup'
    ```

    > [!NOTE]
    > - If the storage account is in a different subscription, the network security group and storage account must be associated with the same Microsoft Entra tenant. The account you use for each subscription must have the [necessary permissions](required-rbac-permissions.md).

1. Create the flow log using [New-AzNetworkWatcherFlowLog](/powershell/module/az.network/new-aznetworkwatcherflowlog). The flow log is created in the Network Watcher default resource group **NetworkWatcherRG**.

    ```azurepowershell-interactive
    # Create a version 1 NSG flow log.
    New-AzNetworkWatcherFlowLog -Name 'myFlowLog' -Location 'eastus' -TargetResourceId $nsg.Id -StorageId $sa.Id -Enabled $true
    ```

## Create a flow log and traffic analytics workspace

1. Get the properties of the network security group that you want to create the flow log for and the storage account that you want to use to store the created flow log using [Get-AzNetworkSecurityGroup](/powershell/module/az.network/get-aznetworksecuritygroup) and [Get-AzStorageAccount](/powershell/module/az.storage/get-azstorageaccount) respectively.

    ```azurepowershell-interactive
    # Place the network security group properties into a variable.
    $nsg = Get-AzNetworkSecurityGroup -Name 'myNSG' -ResourceGroupName 'myResourceGroup'
    
    # Place the storage account properties into a variable.
    $sa = Get-AzStorageAccount -Name 'myStorageAccount' -ResourceGroupName 'myResourceGroup'
    ```

    > [!NOTE]
    > - The storage account can't have network rules that restrict network access to only Microsoft services or specific virtual networks.
    > - If the storage account is in a different subscription, the network security group and storage account must be associated with the same Microsoft Entra tenant. The account you use for each subscription must have the [necessary permissions](required-rbac-permissions.md).

1. Create a traffic analytics workspace using [New-AzOperationalInsightsWorkspace](/powershell/module/az.operationalinsights/new-azoperationalinsightsworkspace).

    ```azurepowershell-interactive
    # Create a traffic analytics workspace and place its properties into a variable.
    $workspace = New-AzOperationalInsightsWorkspace -Name 'myWorkspace' -ResourceGroupName 'myResourceGroup' -Location 'eastus'
    ```

1. Create the flow log using [New-AzNetworkWatcherFlowLog](/powershell/module/az.network/new-aznetworkwatcherflowlog). The flow log is created in the Network Watcher default resource group **NetworkWatcherRG**.

    ```azurepowershell-interactive
    # Create a version 1 NSG flow log with traffic analytics.
    New-AzNetworkWatcherFlowLog -Name 'myFlowLog' -Location 'eastus' -TargetResourceId $nsg.Id -StorageId $sa.Id -Enabled $true -EnableTrafficAnalytics -TrafficAnalyticsWorkspaceId $workspace.ResourceId
    ```

## Change a flow log

You can use [Set-AzNetworkWatcherFlowLog](/powershell/module/az.network/set-aznetworkwatcherflowlog) to change the properties of a flow log. For example, you can change the flow log version or disable traffic analytics.

```azurepowershell-interactive
# Place the network security group properties into a variable.
$nsg = Get-AzNetworkSecurityGroup -Name 'myNSG' -ResourceGroupName 'myResourceGroup'

# Place the storage account properties into a variable.
$sa = Get-AzStorageAccount -Name 'myStorageAccount' -ResourceGroupName 'myResourceGroup'

# Update the NSG flow log.
Set-AzNetworkWatcherFlowLog -Name 'myFlowLog' -Location 'eastus' -TargetResourceId $nsg.Id -StorageId $sa.Id -Enabled $true -FormatVersion 2 
```

## List all flow logs in a region

Use [Get-AzNetworkWatcherFlowLog](/powershell/module/az.network/get-aznetworkwatcherflowlog) to list all NSG flow log resources in a particular region in your subscription.

```azurepowershell-interactive
# Get all NSG flow logs in East US region.
Get-AzNetworkWatcherFlowLog -Location 'eastus' | format-table Name
```

> [!NOTE]
> To use the `-Location` parameter with `Get-AzNetworkWatcherFlowLog` cmdlet, you need an additional **Reader** permission in the **NetworkWatcherRG** resource group.

## View details of a flow log resource

Use [Get-AzNetworkWatcherFlowLog](/powershell/module/az.network/get-aznetworkwatcherflowlog) to see details of a flow log resource.

```azurepowershell-interactive
# Get the details of a flow log.
Get-AzNetworkWatcherFlowLog -Name 'myFlowLog' -Location 'eastus'
```

> [!NOTE]
> To use the `-Location` parameter with `Get-AzNetworkWatcherFlowLog` cmdlet, you need an additional **Reader** permission in the **NetworkWatcherRG** resource group.

## Download a flow log

The storage location of a flow log is defined at creation. To access and download flow logs from your storage account, you can use Azure Storage Explorer. Fore more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

NSG flow log files saved to a storage account follow this path:

```
https://{storageAccountName}.blob.core.windows.net/insights-logs-networksecuritygroupflowevent/resourceId=/SUBSCRIPTIONS/{subscriptionID}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/{NetworkSecurityGroupName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json
```

For information about the structure of a flow log, see [Log format of NSG flow logs](network-watcher-nsg-flow-logging-overview.md#log-format).

## Disable a flow log

To temporarily disable a flow log without deleting it, use [Set-AzNetworkWatcherFlowLog](/powershell/module/az.network/set-aznetworkwatcherflowlog) with the `-Enabled $false` parameter. Disabling a flow log stops flow logging for the associated network security group. However, the flow log resource remains with all its settings and associations. You can re-enable it at any time to resume flow logging for the configured network security group.

> [!NOTE]
> If traffic analytics is enabled for a flow log, it must disabled before you can disable the flow log.

```azurepowershell-interactive
# Place the network security group properties into a variable.
$nsg = Get-AzNetworkSecurityGroup -Name 'myNSG' -ResourceGroupName 'myResourceGroup'

# Place the storage account properties into a variable.
$sa = Get-AzStorageAccount -Name 'myStorageAccount' -ResourceGroupName 'myResourceGroup'

# Update the NSG flow log.
Set-AzNetworkWatcherFlowLog -Enabled $false -Name 'myFlowLog' -Location 'eastus' -TargetResourceId $nsg.Id -StorageId $sa.Id
```

## Delete a flow log

To permanently delete an NSG flow log, use [Remove-AzNetworkWatcherFlowLog](/powershell/module/az.network/remove-aznetworkwatcherflowlog) command. Deleting a flow log deletes all its settings and associations. To begin flow logging again for the same network security group, you must create a new flow log for it.

```azurepowershell-interactive
# Delete the flow log.
Remove-AzNetworkWatcherFlowLog -Name 'myFlowLog' -Location 'eastus'
```
> [!NOTE]
> Deleting a flow log does not delete the flow log data from the storage account. Flow logs data stored in the storage account follow the configured retention policy.

## Next steps

- To learn how to use Azure built-in policies to audit or deploy NSG flow logs, see [Manage NSG flow logs using Azure Policy](nsg-flow-logs-policy-portal.md).
- To learn about traffic analytics, see [Traffic analytics](traffic-analytics.md).
