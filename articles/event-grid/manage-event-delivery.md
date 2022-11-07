---
title: Dead letter and retry policies - Azure Event Grid
description: Describes how to customize event delivery options for Event Grid. Set a dead-letter destination, and specify how long to retry delivery.
ms.topic: conceptual
ms.date: 07/27/2021 
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli
---

# Set dead-letter location and retry policy

When creating an event subscription, you can customize the settings for event delivery. This article shows you how to set up a dead letter location and customize the retry settings. For information about these features, see [Event Grid message delivery and retry](delivery-and-retry.md).

> [!NOTE]
> To learn about message delivery, retries, and dead-lettering, see the conceptual article: [Event Grid message delivery and retry](delivery-and-retry.md).

## Set dead-letter location

To set a dead letter location, you need a storage account for holding events that can't be delivered to an endpoint. The examples get the resource ID of an existing storage account. They create an event subscription that uses a container in that storage account for the dead-letter endpoint.

> [!NOTE]
> - Create a storage account and a blob container in the storage before running commands in this article.
> - The Event Grid service creates blobs in this container. The names of blobs will have the name of the Event Grid subscription with all the letters in upper case. For example, if the name of the subscription is `My-Blob-Subscription`, names of the dead letter blobs will have `MY-BLOB-SUBSCRIPTION` (`myblobcontainer/MY-BLOB-SUBSCRIPTION/2019/8/8/5/111111111-1111-1111-1111-111111111111.json`). This behavior is to protect against differences in case handling between Azure services.
> - In the above example `.../2019/8/8/5/...` represents the non-zero padded date and hour (UTC): `.../YYYY/MM/DD/HH/...`.`
> - The dead letter blobs created will contain one or more events in an array, which is an important behavior to consider when processing dead letters.

### Azure portal


### Azure CLI

```azurecli-interactive
containername=testcontainer

topicid=$(az eventgrid topic show --name demoTopic -g gridResourceGroup --query id --output tsv)
storageid=$(az storage account show --name demoStorage --resource-group gridResourceGroup --query id --output tsv)

az eventgrid event-subscription create \
  --source-resource-id $topicid \
  --name <event_subscription_name> \
  --endpoint <endpoint_URL> \
  --deadletter-endpoint $storageid/blobServices/default/containers/$containername
```

To turn off dead-lettering, rerun the command to create the event subscription but don't provide a value for `deadletter-endpoint`. You don't need to delete the event subscription.

> [!NOTE]
> If you are using Azure CLI on your local machine, use Azure CLI version 2.0.56 or greater. For instructions on installing the latest version of Azure CLI, see [Install the Azure CLI](/cli/azure/install-azure-cli).

### PowerShell

```azurepowershell-interactive
$containername = "testcontainer"

$topicid = (Get-AzEventGridTopic -ResourceGroupName gridResourceGroup -Name demoTopic).Id
$storageid = (Get-AzStorageAccount -ResourceGroupName gridResourceGroup -Name demostorage).Id

New-AzEventGridSubscription `
  -ResourceId $topicid `
  -EventSubscriptionName <event_subscription_name> `
  -Endpoint <endpoint_URL> `
  -DeadLetterEndpoint "$storageid/blobServices/default/containers/$containername"
```

To turn off dead-lettering, rerun the command to create the event subscription but don't provide a value for `DeadLetterEndpoint`. You don't need to delete the event subscription.

> [!NOTE]
> If you are using Azure Poweshell on your local machine, use Azure PowerShell version 1.1.0 or greater. Download and install the latest Azure PowerShell from [Azure downloads](https://azure.microsoft.com/downloads/).

## Set retry policy

When creating an Event Grid subscription, you can set values for how long Event Grid should try to deliver the event. By default, Event Grid tries for 24 hours (1440 minutes), or 30 times. You can set either of these values for your event grid subscription. The value for event time-to-live must be an integer from 1 to 1440. The value for max retries must be an integer from 1 to 30.

You can't configure the [retry schedule](delivery-and-retry.md#retry-schedule).

### Azure CLI

To set the event time-to-live to a value other than 1440 minutes, use:

```azurecli-interactive
az eventgrid event-subscription create \
  -g gridResourceGroup \
  --topic-name <topic_name> \
  --name <event_subscription_name> \
  --endpoint <endpoint_URL> \
  --event-ttl 720
```

To set the max retries to a value other than 30, use:

```azurecli-interactive
az eventgrid event-subscription create \
  -g gridResourceGroup \
  --topic-name <topic_name> \
  --name <event_subscription_name> \
  --endpoint <endpoint_URL> \
  --max-delivery-attempts 18
```

> [!NOTE]
> If you set both `event-ttl` and `max-deliver-attempts`, Event Grid uses the first to expire to determine when to stop event delivery. For example, if you set 30 minutes as time-to-live (TTL) and 10 max delivery attempts. When an event isn't delivered after 30 minutes (or) isn't delivered after 10 attempts, whichever happens first, the event is dead-lettered.  

### PowerShell

To set the event time-to-live to a value other than 1440 minutes, use:

```azurepowershell-interactive
$topicid = (Get-AzEventGridTopic -ResourceGroupName gridResourceGroup -Name demoTopic).Id

New-AzEventGridSubscription `
  -ResourceId $topicid `
  -EventSubscriptionName <event_subscription_name> `
  -Endpoint <endpoint_URL> `
  -EventTtl 720
```

To set the max retries to a value other than 30, use:

```azurepowershell-interactive
$topicid = (Get-AzEventGridTopic -ResourceGroupName gridResourceGroup -Name demoTopic).Id

New-AzEventGridSubscription `
  -ResourceId $topicid `
  -EventSubscriptionName <event_subscription_name> `
  -Endpoint <endpoint_URL> `
  -MaxDeliveryAttempt 18
```

> [!NOTE]
> If you set both `event-ttl` and `max-deliver-attempts`, Event Grid uses the first to expire to determine when to stop event delivery. For example, if you set 30 minutes as time-to-live (TTL) and 10 max delivery attempts. When an event isn't delivered after 30 minutes (or) isn't delivered after 10 attempts, whichever happens first, the event is dead-lettered.  

## Managed identity
If you enable managed identity for dead-lettering, you'll need to add the managed identity to the appropriate role-based access control (RBAC) role on the Azure Storage account that will hold the dead-lettered events. For more information, see [Supported destinations and Azure roles](add-identity-roles.md#supported-destinations-and-azure-roles).

## Next steps

* For a sample application that uses an Azure Function app to process dead letter events, see [Azure Event Grid Dead Letter Samples for .NET](https://azure.microsoft.com/resources/samples/event-grid-dotnet-handle-deadlettered-events/).
* For information about event delivery and retries, [Event Grid message delivery and retry](delivery-and-retry.md).
* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
