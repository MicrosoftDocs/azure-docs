---
title: Manage VNet flow logs - Azure CLI
titleSuffix: Azure Network Watcher
description: Learn how to create, change, enable, disable, or delete Azure Network Watcher VNet flow logs using the Azure CLI. 
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 08/16/2023
ms.custom: devx-track-azurecli
---

# Create, change, enable, disable, or delete VNet flow logs using the Azure CLI

> [!IMPORTANT]
> VNet flow logs is currently in PREVIEW. This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Virtual network flow logging is a feature of Azure Network Watcher that allows you to log information about IP traffic flowing through an Azure virtual network. For more information about virtual network flow logging, see [VNet flow logs overview](vnet-flow-logs-overview.md).

In this article, you learn how to create, change, enable, disable, or delete a VNet flow log using the Azure CLI. You can learn how to manage a VNet flow log using [PowerShell](vnet-flow-logs-powershell.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Insights provider. For more information, see [Register Insights provider](#register-insights-provider).

- A virtual network. If you need to create a virtual network, see [Create a virtual network using the Azure CLI](../virtual-network/quick-create-cli.md).

- An Azure storage account. If you need to create a storage account, see [Create a storage account using the Azure CLI](../storage/common/storage-account-create.md?tabs=azure-cli).

- Bash environment in [Azure Cloud Shell](https://shell.azure.com) or the Azure CLI installed locally. To learn more about using Bash in Azure Cloud Shell, see [Azure Cloud Shell Quickstart - Bash](../cloud-shell/quickstart.md). 

	- If you choose to install and use Azure CLI locally, this article requires the Azure CLI version 2.39.0 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). Run `az login` to sign in to Azure.

## Register insights provider

*Microsoft.Insights* provider must be registered to successfully log traffic in a virtual network. If you aren't sure if the *Microsoft.Insights* provider is registered, use [az provider register](/cli/azure/provider#az-provider-register) to register it.

```azurecli-interactive
# Register Microsoft.Insights provider.
az provider register --namespace Microsoft.Insights
```

## Enable VNet flow logs

Use [az network watcher flow-log create](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-create) to create a VNet flow log. 

```azurecli-interactive
# Create a VNet flow log.
az network watcher flow-log create --location eastus --resource-group myResourceGroup --name myVNetFlowLog --vnet myVNet --storage-account myStorageAccount
```

## Enable VNet flow logs and traffic analytics

Use [az monitor log-analytics workspace create](/cli/azure/monitor/log-analytics/workspace#az-monitor-log-analytics-workspace-create) to create a traffic analytics workspace, and then use [az network watcher flow-log create](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-create) to create a VNet flow log that uses it.

```azurecli-interactive
# Create a traffic analytics workspace.
az monitor log-analytics workspace create --name myWorkspace --resource-group myResourceGroup --location eastus

# Create a VNet flow log.
az network watcher flow-log create --location eastus --name myVNetFlowLog --resource-group myResourceGroup --vnet myVNet --storage-account myStorageAccount --workspace myWorkspace --interval 10 --traffic-analytics true
```

## List all flow logs in a region 

Use [az network watcher flow-log list](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-list) to list all flow log resources in a particular region in your subscription.

```azurecli-interactive
# Get all flow logs in East US region.
az network watcher flow-log list --location eastus --out table
```

## View VNet flow log resource 

Use [az network watcher flow-log show](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-show) to see details of a flow log resource.

```azurecli-interactive
# Get the flow log details.
az network watcher flow-log show --name myVNetFlowLog --resource-group NetworkWatcherRG --location eastus
```

## Download a flow log

To access and download VNet flow logs from your storage account, you can use Azure Storage Explorer. Fore more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

VNet flow log files saved to a storage account follow the logging path shown in the following example:

```
https://{storageAccountName}.blob.core.windows.net/insights-logs-flowlogflowevent/flowLogResourceID=/SUBSCRIPTIONS/{subscriptionID}/RESOURCEGROUPS/NETWORKWATCHERRG/PROVIDERS/MICROSOFT.NETWORK/NETWORKWATCHERS/NETWORKWATCHER_{Region}/FLOWLOGS/{FlowlogResourceName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json
```

## Disable traffic analytics on flow log resource 

To disable traffic analytics on the flow log resource and continue to generate and save VNet flow logs to a storage account, use [az network watcher flow-log update](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-update).

```azurecli-interactive
# Update the VNet flow log.
az network watcher flow-log update --location eastus --name myVNetFlowLog --resource-group myResourceGroup --vnet myVNet --storage-account myStorageAccount --traffic-analytics false
```

## Delete a VNet flow log resource

To delete a VNet flow log resource, use [az network watcher flow-log delete](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-delete).

```azurecli-interactive
# Delete the VNet flow log.
az network watcher flow-log delete --name myVNetFlowLog --location eastus
```

## Next steps

- To learn about traffic analytics, see [Traffic analytics](traffic-analytics.md).
- To learn how to use Azure built-in policies to audit or enable traffic analytics, see [Manage traffic analytics using Azure Policy](traffic-analytics-policy-portal.md).
