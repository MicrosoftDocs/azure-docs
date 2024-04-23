---
title: Manage NSG flow logs - Azure CLI
titleSuffix: Azure Network Watcher
description: Learn how to create, change, disable, or delete Azure Network Watcher NSG flow logs using the Azure CLI.
author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 05/31/2023
ms.author: halkazwini
ms.custom: devx-track-azurecli
---

# Manage NSG flow logs using the Azure CLI

Network security group flow logging is a feature of Azure Network Watcher that allows you to log information about IP traffic flowing through a network security group. For more information about network security group flow logging, see [NSG flow logs overview](nsg-flow-logs-overview.md).

In this article, you learn how to create, change, disable, or delete an NSG flow log using the Azure CLI. You can learn how to manage an NSG flow log using the [Azure portal](nsg-flow-logs-portal.md), [PowerShell](nsg-flow-logs-powershell.md), [REST API](nsg-flow-logs-rest.md), or [ARM template](nsg-flow-logs-azure-resource-manager.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Insights provider. For more information, see [Register Insights provider](#register-insights-provider).

- A network security group. If you need to create a network security group, see [Create, change, or delete a network security group](../virtual-network/manage-network-security-group.md?tabs=network-security-group-cli).

- An Azure storage account. If you need to create a storage account, see [create a storage account using PowerShell](../storage/common/storage-account-create.md?tabs=azure-cli).

- [Azure Cloud Shell](/azure/cloud-shell/overview) or Azure CLI installed locally.

    - The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.
    
    - You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

## Register Insights provider

*Microsoft.Insights* provider must be registered to successfully log traffic flowing through a network security group. If you aren't sure if the *Microsoft.Insights* provider is registered, use [az provider register](/cli/azure/provider#az-provider-register) to register it.

```azurecli-interactive
# Register Microsoft.Insights provider.
az provider register --namespace 'Microsoft.Insights'
```

## Create a flow log

Create a flow log using [az network watcher flow-log create](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-create). The flow log is created in the Network Watcher default resource group **NetworkWatcherRG**.

```azurecli-interactive
# Create a version 1 NSG flow log.
az network watcher flow-log create --name 'myFlowLog' --nsg 'myNSG' --resource-group 'myResourceGroup' --storage-account 'myStorageAccount'
```

> [!NOTE]
> - If the storage account is in a different subscription, the network security group and storage account must be associated with the same Azure Active Directory tenant. The account you use for each subscription must have the [necessary permissions](required-rbac-permissions.md).
> - If the storage account is in a different resource group or subscription, you must specify the full ID of the storage account instead of only its name. For example, if **myStorageAccount** storage account is in a resource group named **StorageRG** while the network security group is in the resource group **myResourceGroup**, you must use `/subscriptions/{SubscriptionID}/resourceGroups/RG-Storage/providers/Microsoft.Storage/storageAccounts/myStorageAccount` for `--storage-account` parameter instead of `myStorageAccount`.

```azurecli-interactive
# Place the storage account resource ID into a variable.
sa=$(az storage account show --name 'myStorageAccount' --query 'id' --output 'tsv')

# Create a version 1 NSG flow log (the storage account is in a different resource group).
az network watcher flow-log create --name 'myFlowLog' --nsg 'myNSG' --resource-group 'myResourceGroup' --storage-account $sa
```

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

> [!NOTE]
> - The storage account can't have network rules that restrict network access to only Microsoft services or specific virtual networks.
> - If the storage account is in a different subscription, the network security group and storage account must be associated with the same Azure Active Directory tenant. The account you use for each subscription must have the [necessary permissions](required-rbac-permissions.md).
> - If the storage account is in a different resource group or subscription, the full ID of the storage account must be used. For example, if **myStorageAccount** storage account is in a resource group named **StorageRG** while the network security group is in the resource group **myResourceGroup**, you must use `/subscriptions/{SubscriptionID}/resourceGroups/RG-Storage/providers/Microsoft.Storage/storageAccounts/myStorageAccount` for `--storage-account` parameter instead of `myStorageAccount`.

```azurecli-interactive
# Place the storage account resource ID into a variable.
sa=$(az storage account show --name 'myStorageAccount' --query 'id' --output 'tsv')

# Create a Log Analytics workspace.
az monitor log-analytics workspace create --name 'myWorkspace' --resource-group 'myResourceGroup'

# Create a version 1 NSG flow log and enable traffic analytics for it (the storage account is in a different resource group).
az network watcher flow-log create --name 'myFlowLog' --nsg 'myNSG' --resource-group 'myResourceGroup' --storage-account $sa --traffic-analytics 'true' --workspace 'myWorkspace'
```

## Change a flow log

You can use [az network watcher flow-log update](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-update) to change the properties of a flow log. For example, you can change the flow log version or disable traffic analytics.

```azurecli-interactive
# Update the flow log.
az network watcher flow-log update --name 'myFlowLog' --nsg 'myNSG' --resource-group 'myResourceGroup' --storage-account 'myStorageAccount' --traffic-analytics 'false' --log-version '2'
```

## List all flow logs in a region

Use [az network watcher flow-log list](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-list) to list all NSG flow log resources in a particular region in your subscription.

```azurecli-interactive
# Get all NSG flow logs in East US region.
az network watcher flow-log list --location 'eastus' --out table
```

## View details of a flow log resource

Use [az network watcher flow-log show](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-show) to see details of a flow log resource.

```azurecli-interactive
# Get the details of a flow log.
az network watcher flow-log show --name 'myFlowLog' --resource-group 'NetworkWatcherRG' --location 'eastus'
```

## Download a flow log

The storage location of a flow log is defined at creation. To access and download flow logs from your storage account, you can use Azure Storage Explorer. Fore more information, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

NSG flow log files saved to a storage account follow this path:

```
https://{storageAccountName}.blob.core.windows.net/insights-logs-networksecuritygroupflowevent/resourceId=/SUBSCRIPTIONS/{subscriptionID}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/{NetworkSecurityGroupName}/y={year}/m={month}/d={day}/h={hour}/m=00/macAddress={macAddress}/PT1H.json
```

For information about the structure of a flow log, see [Log format of NSG flow logs](nsg-flow-logs-overview.md#log-format).

## Disable a flow log

To temporarily disable a flow log without deleting it, use [az network watcher flow-log update](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-update) command. Disabling a flow log stops flow logging for the associated network security group. However, the flow log resource remains with all its settings and associations. You can re-enable it at any time to resume flow logging for the configured network security group.

> [!NOTE]
> If traffic analytics is enabled for a flow log, it must disabled before you can disable the flow log.

```azurecli-interactive
# Disable traffic analytics log if it's enabled.
az network watcher flow-log update --name 'myFlowLog' --nsg 'myNSG' --resource-group 'myResourceGroup' --storage-account 'myStorageAccount' --traffic-analytics 'false' --workspace 'myWorkspace'

# Disable the flow log.
az network watcher flow-log update --name 'myFlowLog' --nsg 'myNSG' --resource-group 'myResourceGroup' --storage-account 'myStorageAccount' --enabled 'false'
```

## Delete a flow log

To permanently delete a flow log, use [az network watcher flow-log delete](/cli/azure/network/watcher/flow-log#az-network-watcher-flow-log-delete) command. Deleting a flow log deletes all its settings and associations. To begin flow logging again for the same network security group, you must create a new flow log for it.

```azurecli-interactive
# Delete the flow log.
az network watcher flow-log delete --name 'myFlowLog' --location 'eastus' --no-wait 'true'
```

> [!NOTE]
> Deleting a flow log does not delete the flow log data from the storage account. Flow logs data stored in the storage account follow the configured retention policy.  

## Next steps

- To learn how to use Azure built-in policies to audit or deploy NSG flow logs, see [Manage NSG flow logs using Azure Policy](nsg-flow-logs-policy-portal.md).
- To learn about traffic analytics, see [Traffic analytics](traffic-analytics.md).
