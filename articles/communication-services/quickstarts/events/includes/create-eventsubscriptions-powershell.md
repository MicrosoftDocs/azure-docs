---
author: pgrandhi
ms.service: azure-communication-services
ms.custom: devx-track-azurepowershell
ms.topic: include
ms.date: 01/27/2024
ms.author: pgrandhi
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- Install the [Azure Az PowerShell Module](/powershell/azure/)
- An [Azure Communication Services resource](../../../create-communication-resource.md)
- Create a Webhook to receive events. [Webhook Event Delivery](../../../../../articles/event-grid/webhook-event-delivery.md)


[!INCLUDE [register-provider-powershell.md](register-provider-powershell.md)]

## Create Event Subscription

First, make sure to install the Azure Communication Services module ```Az.EventGrid``` using the following command.

```PowerShell
PS C:\> Install-Module Az.EventGrid
```

To create event subscriptions for Azure Communication Services resource, [sign in to Azure Powershell](powershell/module/az.accounts/connect-azaccount). You can sign in running the ``` Connect AzAccount``` command from the terminal and providing your credentials. Run the following command to create the event subscription for the resource:

To create an event subscription by using the [Azure Powershell](/powershell/azure/get-started-azureps), use the [`New-AzEventGridSubscription`](/powershell/module/az.eventgrid/new-azeventgridsubscription) command. 

```PowerShell
$includedEventTypes = "Microsoft.Communication.SMSReceived", "Microsoft.Communication.SMSDeliveryReportReceived"
New-AzEventGridSubscription 
    -EndpointType webhook
    -Endpoint https://azureeventgridviewer.azurewebsites.net/api/updates
    -EventSubscriptionName EventsWebhookSubscription 
    -IncludedEventType $includedEventTypes
    -ResourceId "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Communication/CommunicationServices/<acsResourceName>"
```

## List Event Subscriptions

To list all the existing event subscriptions set up for an Azure Communication Services resource, by using the [Azure Powershell](/powershell/azure/get-started-azureps), use the [`Get-AzEventGridSubscription`](/powershell/module/az.eventgrid/get-azeventgridsubscription) command. 

```PowerShell
Get-AzEventGridSubscription 
    -ResourceId "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Communication/CommunicationServices/<acsResourceName>"
```

## Update Event Subscription

To update an existing event subscription by using the [Azure Powershell](/cli/azure/get-started-with-azure-cli), use the [`Update-AzEventGridSubscription `](/powershell/module/az.eventgrid/update-azeventgridsubscription) command. 

```PowerShell
$includedEventTypes = "Microsoft.Communication.SMSReceived", "Microsoft.Communication.SMSDeliveryReportReceived", "Microsoft.Communication.ChatMessageReceived"
Update-AzEventGridSubscription 
    -EventSubscriptionName ES2 
    -IncludedEventType $includedEventTypes
    -ResourceId "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Communication/CommunicationServices/<acsResourceName>" 
    -Endpoint https://azureeventgridviewer2.azurewebsites.net/api/updates
    -SubjectEndsWith "phoneNumber"
 
```

## Delete Event Subscription

To delete an existing event subscription by using [the Azure CLI](/cli/azure/get-started-with-azure-cli), use the [`Remove-AzEventGridSubscription`](/powershell/module/az.eventgrid/remove-azeventgridsubscription) command. 

```PowerShell
Get-AzResource 
    -ResourceId "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Communication/CommunicationServices/<acsResourceName>" | Remove-AzEventGridSubscription -EventSubscriptionName ES2
```


For information on other commands, see [Az.EventGrid Powershell Module](/powershell/module/az.eventgrid/new-azeventgridsubscription).
