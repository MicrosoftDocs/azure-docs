---
title: Manage VNet flow logs - PowerShell
titleSuffix: Azure Network Watcher
description: Learn how to create, change, enable, disable, or delete Azure Network Watcher VNet flow logs using Azure PowerShell. 
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 08/16/2023
ms.custom: devx-track-azurepowershell
---

# Create, change, enable, disable, or delete VNet flow logs using Azure PowerShell

> [!IMPORTANT]
> VNet flow logs is currently in PREVIEW. This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Virtual network flow logging is a feature of Azure Network Watcher that allows you to log information about IP traffic flowing through an Azure virtual network. For more information about virtual network flow logging, see [VNet flow logs overview](vnet-flow-logs-overview.md).

In this article, you learn how to create, change, enable, disable, or delete a VNet flow log using Azure PowerShell. You can learn how to manage a VNet flow log using the [Azure CLI](vnet-flow-logs-cli.md).

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

## Enable VNet flow logs

Use [New-AzNetworkWatcherFlowLog](/powershell/module/az.network/new-aznetworkwatcherflowlog) to create a VNet flow log. 

```azurepowershell-interactive
# Place the virtual network configuration into a variable.
$vnet = Get-AzVirtualNetwork -Name myVNet -ResourceGroupName myResourceGroup
# Place the storage account configuration into a variable.
$storageAccount = Get-AzStorageAccount -Name myStorageAccount -ResourceGroupName myResourceGroup

# Create a VNet flow log.
New-AzNetworkWatcherFlowLog -Enabled $true -Name myVNetFlowLog -NetworkWatcherName NetworkWatcher_eastus -ResourceGroupName NetworkWatcherRG -StorageId $storageAccount.Id -TargetResourceId $vnet.Id
```

## Enable VNet flow logs and traffic analytics

Use [New-AzOperationalInsightsWorkspace](/powershell/module/az.operationalinsights/new-azoperationalinsightsworkspace) to create a traffic analytics workspace, and then use [New-AzNetworkWatcherFlowLog](/powershell/module/az.network/new-aznetworkwatcherflowlog) to create a VNet flow log that uses it.

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

## View VNet flow log resource 

Use [Get-AzNetworkWatcherFlowLog](/powershell/module/az.network/get-aznetworkwatcherflowlog) to see details of a flow log resource.

```azurepowershell-interactive
# Get the flow log details.
Get-AzNetworkWatcherFlowLog -NetworkWatcherName NetworkWatcher_eastus -ResourceGroupName NetworkWatcherRG -Name myVNetFlowLog
```

## Download a flow log

To access and download VNet flow logs from your storage account, you can use Azure Storage Explorer. Fore more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

VNet flow log files saved to a storage account follow the logging path shown in the following example:

```
https://{storageAccountName}.blob.core.windows.net/insights-logs-flowlogflowevent/flowLogResourceID=/SUBSCRIPTIONS/{subscriptionID}/RESOURCEGROUPS/NETWORKWATCHERRG/PROVIDERS/MICROSOFT.NETWORK/NETWORKWATCHERS/NETWORKWATCHER_{Region}/FLOWLOGS/{FlowlogResourceName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json
```

## Disable traffic analytics on flow log resource 

To disable traffic analytics on the flow log resource and continue to generate and save VNet flow logs to storage account, use [Set-AzNetworkWatcherFlowLog](/powershell/module/az.network/set-aznetworkwatcherflowlog).

```azurepowershell-interactive
# Place the virtual network configuration into a variable.
$vnet = Get-AzVirtualNetwork -Name myVNet -ResourceGroupName myResourceGroup
# Place the storage account configuration into a variable.
$storageAccount = Get-AzStorageAccount -Name mynwstorageaccount -ResourceGroupName Storage

# Update the VNet flow log.
Set-AzNetworkWatcherFlowLog -Enabled $true -Name myVNetFlowLog -NetworkWatcherName NetworkWatcher_eastus -ResourceGroupName NetworkWatcherRG -StorageId $storageAccount.Id -TargetResourceId $vnet.Id
```

## Disable VNet flow logging 

To disable a VNet flow log without deleting it so you can re-enable it later, use [Set-AzNetworkWatcherFlowLog](/powershell/module/az.network/set-aznetworkwatcherflowlog).

```azurepowershell-interactive
# Place the virtual network configuration into a variable.
$vnet = Get-AzVirtualNetwork -Name myVNet -ResourceGroupName myResourceGroup
# Place the storage account configuration into a variable.
$storageAccount = Get-AzStorageAccount -Name mynwstorageaccount -ResourceGroupName Storage

# Disable the VNet flow log.
Set-AzNetworkWatcherFlowLog -Enabled $false -Name myVNetFlowLog -NetworkWatcherName NetworkWatcher_eastus -ResourceGroupName NetworkWatcherRG -StorageId $storageAccount.Id -TargetResourceId $vnet.Id
```

## Delete a VNet flow log resource

To delete a VNet flow log resource, use [Remove-AzNetworkWatcherFlowLog](/powershell/module/az.network/remove-aznetworkwatcherflowlog).

```azurepowershell-interactive
# Delete the VNet flow log.
Remove-AzNetworkWatcherFlowLog -Name myVNetFlowLog -NetworkWatcherName NetworkWatcher_eastus -ResourceGroupName NetworkWatcherRG
```

## Next steps

- To learn about traffic analytics, see [Traffic analytics](traffic-analytics.md).
- To learn how to use Azure built-in policies to audit or enable traffic analytics, see [Manage traffic analytics using Azure Policy](traffic-analytics-policy-portal.md).
