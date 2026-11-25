---
title: Get Connection String for Azure Event Hubs
description: Learn how to get a connection string for Azure Event Hubs using the portal, PowerShell, or CLI to enable secure communication with your event hub.
ms.topic: how-to
ms.date: 08/25/2026
ai-usage: ai-assisted
ms.custom:
  - devx-track-azurepowershell
  - devx-track-azurecli
  - sfi-image-nochange
# Customer intent: As a developer, I want to know how to get a connection string to an Event Hubs namespace or an event hub. 
---


# Get an Azure Event Hubs connection string
To communicate with an event hub in a namespace, you need a connection string for the namespace or the event hub. If you use a connection string to the namespace from your application, the application has the provided access (manage, read, or write) to all event hubs in the namespace. If you use a connection string to the event hub, you have the provided access to that specific event hub. 

The connection string for a namespace has the following components embedded within it:

* Fully qualified domain name of the Event Hubs namespace you created (it includes the Event Hubs namespace name followed by `servicebus.windows.net`)
* Name of the shared access key 
* Value of the shared access key

The connection string for a namespace looks like:

```bash
Endpoint=sb://<NamespaceName>.servicebus.windows.net/;SharedAccessKeyName=<KeyName>;SharedAccessKey=<KeyValue>
```

The connection string for an event hub has an extra component in it, that is, `EntityPath=<EventHubName>`. 

```bash
Endpoint=sb://<NamespaceName>.servicebus.windows.net/;SharedAccessKeyName=<KeyName>;SharedAccessKey=<KeyValue>;EntityPath=<EventHubName>
```

This article shows you how to get a connection string to a namespace or a specific event hub by using the Azure portal, PowerShell, or CLI. 

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.
- An Event Hubs namespace and an event hub. If you don't have them, see [Quickstart: Create an event hub by using the Azure portal](event-hubs-create.md).
- To use Azure PowerShell or the Azure CLI, use [Azure Cloud Shell](/azure/cloud-shell/overview), or install [Azure PowerShell](/powershell/azure/install-azure-powershell) or the [Azure CLI](/cli/azure/install-azure-cli) locally.

## Azure portal

### Connection string for a namespace

1. Sign in to the [Azure portal](https://portal.azure.com). 
1. In the search box at the top of the portal, enter **Event Hubs**, and then select **Event Hubs** from the results. 
1. In the list of Event Hubs namespaces, select your namespace. 
1. On the **Event Hubs namespace** page, select **Shared access policies** on the left menu under **Settings**. 
1. Select a shared access policy in the list of policies. The default policy is named **RootManageSharedAccessKey**. You can also add a policy with the appropriate permissions (**Send**, **Listen**), and use that policy. 
1. Select the **copy** button next to the **Connection string-primary key** field. 

    :::image type="content" source="./media/event-hubs-get-connection-string/event-hubs-namespace-get-connection-string.png" alt-text="Screenshot of Event Hubs - get connection string." lightbox="./media/event-hubs-get-connection-string/event-hubs-namespace-get-connection-string.png":::

### Connection string for a specific event hub in a namespace
This section gives you steps for getting a connection string to a specific event hub in a namespace. 

1. On the **Event Hubs namespace** page, select **Event Hubs** under **Entities** on the left menu, and then select your event hub. 
1. On the **Event Hubs instance** page, select **Shared access policies** on the left menu under **Settings**.  
1. There's no default policy created for an event hub. Create a policy with **Manage**, **Send**, or **Listen** access. 
1. Select the policy from the list. 
1. Select the **copy** button next to the **Connection string-primary key** field. 

    :::image type="content" source="./media/event-hubs-get-connection-string/connection-string-event-hub.png" alt-text="Screenshot of connection string to a specific event hub." lightbox="./media/event-hubs-get-connection-string/connection-string-event-hub.png":::

## Azure PowerShell

Use the [Get-AzEventHubKey](/powershell/module/az.eventhub/get-azeventhubkey) cmdlet to get the connection string for a specific policy or rule. 

The following example gets the connection string for a namespace. `MyAuthRuleName` is the name of the shared access policy. For a namespace, the default policy is `RootManageSharedAccessKey`.

```azurepowershell-interactive
Get-AzEventHubKey -ResourceGroupName MyResourceGroupName -NamespaceName MyNamespaceName -AuthorizationRuleName MyAuthRuleName
```

The following example gets the connection string for a specific event hub within a namespace: 

```azurepowershell-interactive
Get-AzEventHubKey -ResourceGroupName MyResourceGroupName -NamespaceName MyNamespaceName -EventHubName MyEventHubName -AuthorizationRuleName MyAuthRuleName
```

The following example gets the connection string for a namespace that's part of a Geo-disaster recovery configuration, by using its alias. 

```azurepowershell-interactive
Get-AzEventHubKey -ResourceGroupName MyResourceGroupName -NamespaceName MyNamespaceName -AliasName MyAliasName -AuthorizationRuleName MyAuthRuleName
```

## Azure CLI
The following example gets the connection string for a namespace. `MyAuthRuleName` is the name of the shared access policy. For a namespace, the default policy is `RootManageSharedAccessKey`.

```azurecli-interactive
az eventhubs namespace authorization-rule keys list --resource-group MyResourceGroupName --namespace-name MyNamespaceName --name RootManageSharedAccessKey
```

The following example gets the connection string for a specific event hub within a namespace: 

```azurecli-interactive
az eventhubs eventhub authorization-rule keys list --resource-group MyResourceGroupName --namespace-name MyNamespaceName --eventhub-name MyEventHubName --name MyAuthRuleName
```

The following example gets the connection string for a namespace that's part of a Geo-disaster recovery configuration, by using its alias. 

```azurecli-interactive
az eventhubs georecovery-alias authorization-rule keys list --resource-group MyResourceGroupName --namespace-name MyNamespaceName --alias MyAliasName --name MyAuthRuleName
```

For more information about Azure CLI commands for Event Hubs, see [Azure CLI for Event Hubs](/cli/azure/eventhubs).

## Related content

You can learn more about Event Hubs by visiting the following articles:

* [Event Hubs overview](./event-hubs-about.md)
* [Create an event hub](event-hubs-create.md)
