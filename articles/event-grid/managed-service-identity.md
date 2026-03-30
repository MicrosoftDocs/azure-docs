---
title: Use Managed Identities to Deliver Events in Azure Event Grid
description: Learn how to enable managed identities for Azure Event Grid topics and domains, and then use them to securely deliver events to destinations like Service Bus, Event Hubs, and Storage accounts.
#customer intent: As a developer, I want to enable managed identities for Azure Event Grid topics so that I can securely deliver events to supported destinations.  
ms.topic: how-to
ms.custom:
  - devx-track-azurecli
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:07/29/2025
  - ai-gen-description
ms.date: 07/29/2025
---

# Use managed identities to deliver events in Azure Event Grid
This article explains how to enable [managed service identities](/entra/identity/managed-identities-azure-resources/overview) for Azure Event Grid system topics, custom topics, and domains. It also explains how to use managed identities to deliver events to supported destinations, such as Service Bus queues and topics, event hubs, and storage accounts.

## Prerequisites

1. Assign a system-assigned identity or user-assigned identity to a system topic, custom topic, or domain.

   - For custom topics and domains, see [Enable managed identity for custom topics and domains](enable-identity-custom-topics-domains.md).
   - For system topics, see [Enable managed identity for system topics](enable-identity-system-topics.md).

1. Add the identity to an appropriate role, such as Service Bus Data Sender, on the destination, such as a Service Bus queue. For detailed steps, see [Add identity to Azure roles on destinations](add-identity-roles.md).

   > [!NOTE]
   > Currently, it's not possible to deliver events using [private endpoints](../private-link/private-endpoint-overview.md). For more information, see the [Private endpoints](#private-endpoints) section at the end of this article.

## Create event subscriptions that use an identity

After you set up an Event Grid custom topic, system topic, or domain with a managed identity and add the identity to the appropriate role on the destination, you're ready to create subscriptions that use the identity.

### Use the Azure portal

When you create an event subscription, you see an option to enable the use of a system-assigned identity or user-assigned identity for an endpoint in the **ENDPOINT DETAILS** section.

This example shows how to enable a system-assigned identity while creating an event subscription with a Service Bus queue as a destination.

:::image type="content" source="./media/managed-service-identity/service-bus-queue-subscription-identity.png" alt-text="Screenshot showing how to enable a system-assigned identity for a Service Bus queue subscription.":::

You can also enable a system-assigned identity for dead-lettering on the **Additional Features** tab.

:::image type="content" source="./media/managed-service-identity/enable-deadletter-identity.png" alt-text="Screenshot of enabling a system-assigned identity for dead-lettering.":::

Enable a managed identity on an event subscription after it's created. On the **Event Subscription** page for the event subscription, switch to the **Additional Features** tab to see the option. You can also enable identity for dead-lettering on this page.

:::image type="content" source="./media/managed-service-identity/event-subscription-additional-features.png" alt-text="Screenshot of enabling a system-assigned identity on an existing event subscription.":::

If you enable user-assigned identities for the topic, you see the user-assigned identity option enabled in the drop-down list for **Managed Identity Type**. If you select **User Assigned** for **Managed Identity Type**, you can then select the user-assigned identity that you want to use to deliver events.

:::image type="content" source="./media/managed-service-identity/event-subscription-user-identity.png" alt-text="Screenshot of enabling a user-assigned identity on an event subscription.":::

### Use the Azure CLI

In this section, you learn how to use the Azure CLI to enable the use of a system-assigned identity to deliver events to a Service Bus queue. The identity must be a member of the **Azure Service Bus Data Sender** role and the **Storage Blob Data Contributor** role on the storage account used for dead-lettering.

#### Define variables

```azurecli-interactive
subid="<AZURE SUBSCRIPTION ID>"
rg = "<RESOURCE GROUP of EVENT GRID CUSTOM TOPIC>"
topicname = "<EVENT GRID TOPIC NAME>"

# get the service bus queue resource id
queueid=$(az servicebus queue show --namespace-name <SERVICE BUS NAMESPACE NAME> --name <QUEUE NAME> --resource-group <RESOURCE GROUP NAME> --query id --output tsv)
sb_esname = "<Specify a name for the event subscription>"
```

#### Create an event subscription by using a managed identity for delivery

This command creates an event subscription for an Event Grid custom topic with the endpoint type set to **Service Bus queue**.

```azurecli-interactive
az eventgrid event-subscription create  
    --source-resource-id /subscriptions/$subid/resourceGroups/$rg/providers/Microsoft.EventGrid/topics/$topicname
    --delivery-identity-endpoint-type servicebusqueue  
    --delivery-identity systemassigned 
    --delivery-identity-endpoint $queueid
    -n $sb_esname 
```

#### Create an event subscription by using a managed identity for delivery and dead-lettering

This sample command creates an event subscription for an Event Grid custom topic with an endpoint type set to **Service Bus queue**. It also specifies that the system-managed identity is to be used for dead-lettering.

```azurecli-interactive
storageid=$(az storage account show --name demoStorage --resource-group gridResourceGroup --query id --output tsv)
deadletterendpoint="$storageid/blobServices/default/containers/<BLOB CONTAINER NAME>"

az eventgrid event-subscription create  
    --source-resource-id /subscriptions/$subid/resourceGroups/$rg/providers/Microsoft.EventGrid/topics/$topicname 
    --delivery-identity-endpoint-type servicebusqueue
    --delivery-identity systemassigned 
    --delivery-identity-endpoint $queueid
    --deadletter-identity-endpoint $deadletterendpoint 
    --deadletter-identity systemassigned 
    -n $sb_esnameq 
```

### Use the Azure CLI - Event Hubs

In this section, you learn how to use the Azure CLI to enable the use of a system-assigned identity to deliver events to an event hub. The identity must be a member of the **Azure Event Hubs Data Sender** role. It must also be a member of the **Storage Blob Data Contributor** role on the storage account that's used for dead-lettering.

#### Define variables

```azurecli-interactive
subid="<AZURE SUBSCRIPTION ID>"
rg = "<RESOURCE GROUP of EVENT GRID CUSTOM TOPIC>"
topicname = "<EVENT GRID CUSTOM TOPIC NAME>"

hubid=$(az eventhubs eventhub show --name <EVENT HUB NAME> --namespace-name <NAMESPACE NAME> --resource-group <RESOURCE GROUP NAME> --query id --output tsv)
eh_esname = "<SPECIFY EVENT SUBSCRIPTION NAME>"
```

#### Create an event subscription by using a managed identity for delivery

This sample command creates an event subscription for an Event Grid custom topic with an endpoint type set to **Event Hubs**.

```azurecli-interactive
az eventgrid event-subscription create  
    --source-resource-id /subscriptions/$subid/resourceGroups/$rg/providers/Microsoft.EventGrid/topics/$topicname 
    --delivery-identity-endpoint-type eventhub 
    --delivery-identity systemassigned 
    --delivery-identity-endpoint $hubid
    -n $sbq_esname 
```

#### Create an event subscription by using a managed identity for delivery + deadletter

This sample command creates an event subscription for an Event Grid custom topic with an endpoint type set to **Event Hubs**. It also specifies that the system-managed identity is to be used for dead-lettering.

```azurecli-interactive
storageid=$(az storage account show --name demoStorage --resource-group gridResourceGroup --query id --output tsv)
deadletterendpoint="$storageid/blobServices/default/containers/<BLOB CONTAINER NAME>"

az eventgrid event-subscription create
    --source-resource-id /subscriptions/$subid/resourceGroups/$rg/providers/Microsoft.EventGrid/topics/$topicname 
    --delivery-identity-endpoint-type servicebusqueue  
    --delivery-identity systemassigned 
    --delivery-identity-endpoint $hubid
    --deadletter-identity-endpoint $eh_deadletterendpoint
    --deadletter-identity systemassigned 
    -n $eh_esname 
```

### Use the Azure CLI - Azure Storage queue

In this section, you learn how to use the Azure CLI to enable the use of a system-assigned identity to deliver events to an Azure Storage queue. The identity must be a member of the **Storage Queue Data Message Sender** role on the storage account. It must also be a member of the **Storage Blob Data Contributor** role on the storage account that's used for dead-lettering.

#### Define variables

```azurecli-interactive
subid="<AZURE SUBSCRIPTION ID>"
rg = "<RESOURCE GROUP of EVENT GRID CUSTOM TOPIC>"
topicname = "<EVENT GRID CUSTOM TOPIC NAME>"

# get the storage account resource id
storageid=$(az storage account show --name <STORAGE ACCOUNT NAME> --resource-group <RESOURCE GROUP NAME> --query id --output tsv)

# build the resource id for the queue
queueid="$storageid/queueservices/default/queues/<QUEUE NAME>"

sa_esname = "<SPECIFY EVENT SUBSCRIPTION NAME>"
```

#### Create an event subscription by using a managed identity for delivery

```azurecli-interactive
az eventgrid event-subscription create 
    --source-resource-id /subscriptions/$subid/resourceGroups/$rg/providers/Microsoft.EventGrid/topics/$topicname 
    --delivery-identity-endpoint-type storagequeue  
    --delivery-identity systemassigned 
    --delivery-identity-endpoint $queueid
    -n $sa_esname 
```

#### Create an event subscription by using a managed identity for delivery + deadletter

```azurecli-interactive
storageid=$(az storage account show --name demoStorage --resource-group gridResourceGroup --query id --output tsv)
deadletterendpoint="$storageid/blobServices/default/containers/<BLOB CONTAINER NAME>"

az eventgrid event-subscription create  
    --source-resource-id /subscriptions/$subid/resourceGroups/$rg/providers/Microsoft.EventGrid/topics/$topicname 
    --delivery-identity-endpoint-type storagequeue  
    --delivery-identity systemassigned 
    --delivery-identity-endpoint $queueid
    --deadletter-identity-endpoint $deadletterendpoint 
    --deadletter-identity systemassigned 
    -n $sa_esname 
```

## Private endpoints

Currently, it's not possible to deliver events using [private endpoints](../private-link/private-endpoint-overview.md). That is, there's no support if you have strict network isolation requirements where your delivered events traffic must not leave the private IP space.

However, if your requirements call for a secure way to send events using an encrypted channel and a known identity of the sender (in this case, Event Grid) using public IP space, you could deliver events to Event Hubs, Service Bus, or Azure Storage service using an Azure Event Grid custom topic or a domain with a managed identity as shown in this article. You can then use a private link configured in Azure Functions or a webhook deployed on your virtual network to pull events. See the tutorial: [Connect to private endpoints with Azure Functions](../azure-functions/functions-create-vnet.md).

Under this configuration, the traffic goes over the public IP/internet from Event Grid to Event Hubs, Service Bus, or Azure Storage, but the channel can be encrypted and a managed identity of Event Grid is used. If you configure Azure Functions or a webhook deployed to your virtual network to use Event Hubs, Service Bus, or Azure Storage via private link, that section of the traffic stays within Azure.

## Next steps

To learn about managed identities, see [what are managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview).
