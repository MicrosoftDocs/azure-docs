---
title: Query Azure Event Grid subscriptions
description: This article describes how to list Event Grid subscriptions in your Azure subscription. You provide different parameters based on the type of subscription.
ms.topic: conceptual
ms.date: 09/28/2021 
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Query Event Grid subscriptions 

This article describes how to list the Event Grid subscriptions in your Azure subscription. When querying your existing Event Grid subscriptions, it's important to understand the different types of subscriptions. You provide different parameters based on the type of subscription you want to get.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Resource groups and Azure subscriptions

Azure subscriptions and resource groups aren't Azure resources. Therefore, event grid subscriptions to resource groups or Azure subscriptions do not have the same properties as event grid subscriptions to Azure resources. Event grid subscriptions to resource groups or Azure subscriptions are considered global.

To get event grid subscriptions for an Azure subscription and its resource groups, you don't need to provide any parameters. Make sure you've selected the Azure subscription you want to query. The following examples don't get event grid subscriptions for custom topics or Azure resources.

For Azure CLI, use:

```azurecli-interactive
az account set -s "My Azure Subscription"
az eventgrid event-subscription list
```

For PowerShell, use:

```azurepowershell-interactive
Set-AzContext -Subscription "My Azure Subscription"
Get-AzEventGridSubscription
```

To get event grid subscriptions for an Azure subscription, provide the topic type of **Microsoft.Resources.Subscriptions**.

For Azure CLI, use:

```azurecli-interactive
az eventgrid event-subscription list --topic-type-name "Microsoft.Resources.Subscriptions" --location global
```

For PowerShell, use:

```azurepowershell-interactive
Get-AzEventGridSubscription -TopicTypeName "Microsoft.Resources.Subscriptions"
```

To get event grid subscriptions for all resource groups within an Azure subscription, provide the topic type of **Microsoft.Resources.ResourceGroups**.

For Azure CLI, use:

```azurecli-interactive
az eventgrid event-subscription list --topic-type-name "Microsoft.Resources.ResourceGroups" --location global
```

For PowerShell, use:

```azurepowershell-interactive
Get-AzEventGridSubscription -TopicTypeName "Microsoft.Resources.ResourceGroups"
```

To get event grid subscriptions for a specified resource group, provide the name of the resource group as a parameter.

For Azure CLI, use:

```azurecli-interactive
az eventgrid event-subscription list --resource-group myResourceGroup --location global
```

For PowerShell, use:

```azurepowershell-interactive
Get-AzEventGridSubscription -ResourceGroupName myResourceGroup
```

## Custom topics and Azure resources

Event grid custom topics are Azure resources. Therefore, you query event grid subscriptions for custom topics and other resources, like Blob storage account, in the same way. To get event grid subscriptions for custom topics, you must provide parameters that identify the resource or identify the location of the resource. It's not possible to broadly query event grid subscriptions for resources across your Azure subscription.

To get event grid subscriptions for custom topics and other resources in a location, provide the name of the location.

For Azure CLI, use:

```azurecli-interactive
az eventgrid event-subscription list --location westus2
```

For PowerShell, use:

```azurepowershell-interactive
Get-AzEventGridSubscription -Location westus2
```

To get subscriptions to custom topics for a location, provide the location and the topic type of **Microsoft.EventGrid.Topics**.

For Azure CLI, use:

```azurecli-interactive
az eventgrid event-subscription list --topic-type-name "Microsoft.EventGrid.Topics" --location "westus2"
```

For PowerShell, use:

```azurepowershell-interactive
Get-AzEventGridSubscription -TopicTypeName "Microsoft.EventGrid.Topics" -Location westus2
```

To get subscriptions to storage accounts for a location, provide the location and the topic type of **Microsoft.Storage.StorageAccounts**.

For Azure CLI, use:

```azurecli-interactive
az eventgrid event-subscription list --topic-type "Microsoft.Storage.StorageAccounts" --location westus2
```

For PowerShell, use:

```azurepowershell-interactive
Get-AzEventGridSubscription -TopicTypeName "Microsoft.Storage.StorageAccounts" -Location westus2
```

To get event grid subscriptions for a custom topic, provide the name of the custom topic and the name of its resource group.

For Azure CLI, use:

```azurecli-interactive
az eventgrid event-subscription list --topic-name myCustomTopic --resource-group myResourceGroup
```

For PowerShell, use:

```azurepowershell-interactive
Get-AzEventGridSubscription -TopicName myCustomTopic -ResourceGroupName myResourceGroup
```

To get event grid subscriptions for a particular resource, provide the resource ID.

For Azure CLI, use:

```azurecli-interactive
resourceid=$(az resource show -n mystorage -g myResourceGroup --resource-type "Microsoft.Storage/storageaccounts" --query id --output tsv)
az eventgrid event-subscription list --resource-id $resourceid
```

For PowerShell, use:

```azurepowershell-interactive
$resourceid = (Get-AzResource -Name mystorage -ResourceGroupName myResourceGroup).ResourceId
Get-AzEventGridSubscription -ResourceId $resourceid
```

## Next steps

* For information about event delivery and retries, [Event Grid message delivery and retry](delivery-and-retry.md).
* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
