---
title: Get connection string - Azure Event Hubs 
description: This article provides instructions for getting a connection string that clients can use to connect to Azure Event Hubs. 
ms.topic: article
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.date: 07/28/2023
---

# Get an Event Hubs connection string
To communicate with an event hub in a namespace, you need a connection string for the namespace or the event hub. If you use a connection string to the namespace from your application, the application will have the provided access (manage, read, or write) to all event hubs in the namespace. If you use a connection string to the event hub, you will have the provided access to that specific event hub. 

The connection string for a namespace has the following components embedded within it,

* Fully qualified domain name of the Event Hubs namespace you created (it includes the Event Hubs namespace name followed by `servicebus.windows.net`)
* Name of the shared access key 
* Value of the shared access key

The connection string for a namespace looks like:

```
Endpoint=sb://<NamespaceName>.servicebus.windows.net/;SharedAccessKeyName=<KeyName>;SharedAccessKey=<KeyValue>
```

The connection string for an event hub has an additional component in it. That's, `EntityPath=<EventHubName>`. 

```
Endpoint=sb://<NamespaceName>.servicebus.windows.net/;SharedAccessKeyName=<KeyName>;SharedAccessKey=<KeyValue>;EntityPath=<EventHubName>
```

This article shows you how to get a connection string to a namespace or a specific event hub by using the Azure portal, PowerShell, or CLI. 

## Azure portal

### Connection string for a namespace

1. Sign in to [Azure portal](https://portal.azure.com). 
2. Select **All services** on the left navigational menu. 
3. Select **Event Hubs** in the **Analytics** section. 
4. In the list of event hubs, select your event hub.
6. On the **Event Hubs Namespace** page, select **Shared Access Policies** on the left menu.
7. Select a **shared access policy** in the list of policies. The default one is named: **RootManageSharedAccessPolicy**. You can add a policy with appropriate permissions (send, listen), and use that policy. 

    :::image type="content" source="./media/event-hubs-get-connection-string/event-hubs-get-connection-string2.png" alt-text="Event Hubs shared access policies":::
8. Select the **copy** button next to the **Connection string-primary key** field. 

    :::image type="content" source="./media/event-hubs-get-connection-string/event-hubs-get-connection-string3.png" alt-text="Event Hubs - get connection string":::

### Connection string for a specific event hub in a namespace
This section gives you steps for getting a connection string to a specific event hub in a namespace. 

1. On the **Event Hubs Namespace** page, select the event hub in the bottom pane. 
1. On the **Event Hubs instance** page, select **Shared access policies** on the left menu. 
1. There's no default policy created for an event hub. Create a policy with **Manage**, **Send**, or **Listen** access. 
1. Select the policy from the list. 
1. Select the **copy** button next to the **Connection string-primary key** field. 

    :::image type="content" source="./media/event-hubs-get-connection-string/connection-string-event-hub.png" alt-text="Connection string to a specific event hub.":::

## Azure PowerShell

You can use the [Get-AzEventHubKey](/powershell/module/az.eventhub/get-azeventhubkey) to get the connection string for the specific policy/rule. 

Here's a sample command to get the connection string for a namespace. `MyAuthRuleName` is the name of the shared access policy. For a namespace, there's a default one: `RootManageSharedAccessKey`.

```azurepowershell-interactive
Get-AzEventHubKey -ResourceGroupName MyResourceGroupName -NamespaceName MyNamespaceName -AuthorizationRuleName MyAuthRuleName
```

Here's a sample command to get the connection string for a specific event hub within a namespace: 

```azurepowershell-interactive
Get-AzEventHubKey -ResourceGroupName MyResourceGroupName -NamespaceName MyNamespaceName -EventHubName MyEventHubName -AuthorizationRuleName MyAuthRuleName
```

Here's a sample command to get the connection string for an event hub in a Geo-DR cluster, which has an alias. 

```azurepowershell-interactive
Get-AzEventHubKey -ResourceGroupName MyResourceGroupName -NamespaceName MyNamespaceName -EventHubName MyEventHubName -AliasName MyAliasName -Name MyAuthRuleName
```

## Azure CLI
Here's a sample command to get the connection string for a namespace. `MyAuthRuleName` is the name of the shared access policy. For a namespace, there's a default one: `RootManageSharedAccessKey`

```azurecli-interactive
az eventhubs namespace authorization-rule keys list --resource-group MyResourceGroupName --namespace-name MyNamespaceName --name RootManageSharedAccessKey
```

Here's a sample command to get the connection string for a specific event hub within a namespace: 

```azurecli-interactive
az eventhubs eventhub authorization-rule keys list --resource-group MyResourceGroupName --namespace-name MyNamespaceName --eventhub-name MyEventHubName --name MyAuthRuleName
```

Here's a sample command to get the connection string for an event hub in a Geo-DR cluster, which has an alias. 

```azurecli-interactive
az eventhubs georecovery-alias authorization-rule keys list --resource-group MyResourceGroupName --namespace-name MyNamespaceName --eventhub-name MyEventHubName --alias-name MyAliasName --name MyAuthRuleName
```

For more information about Azure CLI commands for Event Hubs, see [Azure CLI for Event Hubs](/cli/azure/eventhubs).

## Next steps

You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](./event-hubs-about.md)
* [Create an event hub](event-hubs-create.md)
