---
author: pgrandhi
ms.service: azure-communication-services
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 01/27/2024
ms.author: pgrandhi
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- Install [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli) 
- An [Azure Communication Services resource](../../create-communication-resource.md)
- Create a Webhook to receive events. [Webhook Event Delivery](../../../../../articles/event-grid/webhook-event-delivery.md)


[!INCLUDE [register-provider-cli.md](register-provider-cli.md)]

## Create event subscription

To create event subscriptions for Azure Communication Services resource, [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can sign in running the ```az login``` command from the terminal and providing your credentials. Run the following command to create the event subscription for the resource:

To create an event subscription by using [the Azure CLI](/cli/azure/get-started-with-azure-cli), use the [`az eventgrid event-subscription create`](/cli/azure/eventgrid/event-subscription#az-eventgrid-event-subscription-create) command. 

```azurecli-interactive
az eventgrid event-subscription create 
    --name EventsWebhookSubscription
    --source-resource-id /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Communication/CommunicationServices/<acsResourceName>
    --included-event-types Microsoft.Communication.SMSReceived Microsoft.Communication.SMSDeliveryReportReceived
    --endpoint-type webhook 
    --endpoint https://azureeventgridviewer.azurewebsites.net/api/updates  
```

For a list of Communication Services events, see [Communication Services Events](../../../../../articles/event-grid/event-schema-communication-services.md).

## List event subscriptions

To list all the existing event subscriptions set up for an Azure Communication Services resource, by using [the Azure CLI](/cli/azure/get-started-with-azure-cli), use the [`az eventgrid event-subscription list`](/cli/azure/eventgrid/event-subscription#az-eventgrid-event-subscription-list) command. 

```azurecli-interactive
az eventgrid event-subscription list 
    --source-resource-id /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Communication/CommunicationServices/<acsResourceName>    
```

## Update event subscription

To update an existing event subscription by using [the Azure CLI](/cli/azure/get-started-with-azure-cli), use the [`az eventgrid event-subscription update`](/cli/azure/eventgrid/event-subscription#az-eventgrid-event-subscription-update) command. 

```azurecli-interactive
az eventgrid event-subscription update 
    --name EventsWebhookSubscription
    --source-resource-id /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Communication/CommunicationServices/<acsResourceName>
    --included-event-types Microsoft.Communication.SMSReceived Microsoft.Communication.SMSDeliveryReportReceived Microsoft.Communication.ChatMessageReceived
    --endpoint-type webhook 
    --endpoint https://azureeventgridviewer.azurewebsites.net/api/updates
```

## Delete event subscription

To delete an existing event subscription by using [the Azure CLI](/cli/azure/get-started-with-azure-cli), use the [`az eventgrid event-subscription delete`](/cli/azure/eventgrid/event-subscription#az-eventgrid-event-subscription-delete) command. 

```azurecli-interactive
az eventgrid event-subscription delete 
    --name EventsWebhookSubscription 
    --source-resource-id /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Communication/CommunicationServices/<acsResourceName>
```

## Next steps
* For information on other commands, see [Azure Event Grid CLI](/cli/azure/eventgrid/event-subscription).
