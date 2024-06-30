---
title: Manage virtual network flow logs - PowerShell
titleSuffix: Azure Network Watcher
description: Learn how to create, change, enable, disable, or delete Azure Network Watcher virtual network flow logs using Azure PowerShell. 
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 04/24/2024
ms.custom: devx-track-azurepowershell

#CustomerIntent: As an Azure administrator, I want to log my virtual network IP traffic using Network Watcher virtual network flow logs so that I can analyze it later.
---

# Create, change, enable, disable, or delete virtual network flow logs using Azure PowerShell

Virtual network flow logging is a feature of Azure Network Watcher that allows you to log information about IP traffic flowing through an Azure virtual network. For more information about virtual network flow logging, see [Virtual network flow logs overview](vnet-flow-logs-overview.md).

In this article, you learn how to create, change, enable, disable, or delete a virtual network flow log using Azure PowerShell. You can learn how to manage a virtual network flow log using the [Azure portal](vnet-flow-logs-portal.md) or [Azure CLI](vnet-flow-logs-cli.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Insights provider. For more information, see [Register Insights provider](#register-insights-provider).

- A virtual network. If you need to create a virtual network, see [Create a virtual network using PowerShell](../virtual-network/quick-create-powershell.md).

- An Azure storage account. If you need to create a storage account, see [Create a storage account using PowerShell](../storage/common/storage-account-create.md?tabs=azure-powershell).

- PowerShell environment in [Azure Cloud Shell](https://shell.azure.com) or Azure PowerShell installed locally. To learn more about using PowerShell in Azure Cloud Shell, see [Azure Cloud Shell Quickstart - PowerShell](../cloud-shell/quickstart-powershell.md). 

	- If you choose to install and use PowerShell locally, this article requires the Azure PowerShell version 7.4.0 or later. Run `Get-InstalledModule -Name Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). Run `Connect-AzAccount` to sign in to Azure.

## Register insights provider

*Microsoft.Insights* provider must be registered to successfully log traffic in a virtual network. If you aren't sure if the *Microsoft.Insights* provider is registered, use [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider) to register it.

```azurepowershell-interactive
# Register Microsoft.Insights provider.
Register-AzResourceProvider -ProviderNamespace Microsoft.Insights
```

## Enable virtual network flow logs

Use [New-AzNetworkWatcherFlowLog](/powershell/module/az.network/new-aznetworkwatcherflowlog) to create a virtual network flow log. 

```azurepowershell-interactive
# Place the virtual network configuration into a variable.
$vnet = Get-AzVirtualNetwork -Name myVNet -ResourceGroupName myResourceGroup
# Place the storage account configuration into a variable.
$storageAccount = Get-AzStorageAccount -Name myStorageAccount -ResourceGroupName myResourceGroup

# Create a VNet flow log.
New-AzNetworkWatcherFlowLog -Enabled $true -Name myVNetFlowLog -NetworkWatcherName NetworkWatcher_eastus -ResourceGroupName NetworkWatcherRG -StorageId $storageAccount.Id -TargetResourceId $vnet.Id
```

## Enable virtual network flow logs and traffic analytics

Use [New-AzOperationalInsightsWorkspace](/powershell/module/az.operationalinsights/new-azoperationalinsightsworkspace) to create a traffic analytics workspace, and then use [New-AzNetworkWatcherFlowLog](/powershell/module/az.network/new-aznetworkwatcherflowlog) to create a virtual network flow log that uses it.

```azurepowershell-interactive
# Place the virtual network configuration into a variable.
$vnet = Get-AzVirtualNetwork -Name myVNet -ResourceGroupName myResourceGroup
# Place the storage account configuration into a variable.
$storageAccount = Get-AzStorageAccount -Name myStorageAccount -ResourceGroupName myResourceGroup

# Create a traffic analytics workspace and place its configuration into a variable.
$workspace = New-AzOperationalInsightsWorkspace -Name myWorkspace -ResourceGroupName myResourceGroup -Location EastUS

# Create a VNet flow log.
New-AzNetworkWatcherFlowLog -Enabled $true -Name myVNetFlowLog -NetworkWatcherName NetworkWatcher_eastus -ResourceGroupName NetworkWatcherRG -StorageId $storageAccount.Id -TargetResourceId $vnet.Id -EnableTrafficAnalytics -TrafficAnalyticsWorkspaceId $workspace.ResourceId -TrafficAnalyticsInterval 10
```

## List all flow logs in a region 

Use [Get-AzNetworkWatcherFlowLog](/powershell/module/az.network/get-aznetworkwatcherflowlog) to list all flow log resources in a particular region in your subscription.

```azurepowershell-interactive
# Get all flow logs in East US region.
Get-AzNetworkWatcherFlowLog -NetworkWatcherName NetworkWatcher_eastus -ResourceGroupName NetworkWatcherRG | format-table Name
```

## View virtual network flow log resource 

Use [Get-AzNetworkWatcherFlowLog](/powershell/module/az.network/get-aznetworkwatcherflowlog) to see details of a flow log resource.

```azurepowershell-interactive
# Get the flow log details.
Get-AzNetworkWatcherFlowLog -NetworkWatcherName NetworkWatcher_eastus -ResourceGroupName NetworkWatcherRG -Name myVNetFlowLog
```

## Download a flow log

To download virtual network flow logs from your storage account, use [Get-AzStorageBlobContent](/powershell/module/az.storage/get-azstorageblobcontent) cmdlet.

Virtual network flow log files are saved to the storage account at the following path:

```
https://{storageAccountName}.blob.core.windows.net/insights-logs-flowlogflowevent/flowLogResourceID=/SUBSCRIPTIONS/{subscriptionID}/RESOURCEGROUPS/NETWORKWATCHERRG/PROVIDERS/MICROSOFT.NETWORK/NETWORKWATCHERS/NETWORKWATCHER_{Region}/FLOWLOGS/{FlowlogResourceName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json
```

> [!NOTE]
> You can also access and download VNet flow logs files from the storage account container using the Azure Storage Explorer. Storage Explorer is a standalone app that you can conveniently use to access and work with Azure Storage data. For more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

## Disable traffic analytics on flow log resource 

To disable traffic analytics on the flow log resource and continue to generate and save virtual network flow logs to storage account, use [Set-AzNetworkWatcherFlowLog](/powershell/module/az.network/set-aznetworkwatcherflowlog).

```azurepowershell-interactive
# Place the virtual network configuration into a variable.
$vnet = Get-AzVirtualNetwork -Name myVNet -ResourceGroupName myResourceGroup
# Place the storage account configuration into a variable.
$storageAccount = Get-AzStorageAccount -Name mynwstorageaccount -ResourceGroupName Storage

# Update the VNet flow log.
Set-AzNetworkWatcherFlowLog -Enabled $true -Name myVNetFlowLog -NetworkWatcherName NetworkWatcher_eastus -ResourceGroupName NetworkWatcherRG -StorageId $storageAccount.Id -TargetResourceId $vnet.Id
```

## Disable virtual network flow logging 

To disable a virtual network flow log without deleting it so you can re-enable it later, use [Set-AzNetworkWatcherFlowLog](/powershell/module/az.network/set-aznetworkwatcherflowlog).

```azurepowershell-interactive
# Place the virtual network configuration into a variable.
$vnet = Get-AzVirtualNetwork -Name myVNet -ResourceGroupName myResourceGroup
# Place the storage account configuration into a variable.
$storageAccount = Get-AzStorageAccount -Name mynwstorageaccount -ResourceGroupName Storage

# Disable the VNet flow log.
Set-AzNetworkWatcherFlowLog -Enabled $false -Name myVNetFlowLog -NetworkWatcherName NetworkWatcher_eastus -ResourceGroupName NetworkWatcherRG -StorageId $storageAccount.Id -TargetResourceId $vnet.Id
```

## Delete a virtual network flow log resource

To delete a virtual network flow log resource, use [Remove-AzNetworkWatcherFlowLog](/powershell/module/az.network/remove-aznetworkwatcherflowlog).

```azurepowershell-interactive
# Delete the VNet flow log.
Remove-AzNetworkWatcherFlowLog -Name myVNetFlowLog -NetworkWatcherName NetworkWatcher_eastus -ResourceGroupName NetworkWatcherRG
```

## Related content

- To learn about traffic analytics, see [Traffic analytics](traffic-analytics.md).
- To learn how to use Azure built-in policies to audit or enable traffic analytics, see [Manage traffic analytics using Azure Policy](traffic-analytics-policy-portal.md).
