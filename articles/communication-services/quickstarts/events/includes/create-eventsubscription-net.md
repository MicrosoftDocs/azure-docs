---
author: pgrandhi
ms.service: azure-communication-services
ms.topic: include
ms.date: 01/28/2024
ms.author: pgrandhi
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- The latest version [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- Get the latest version of the [.NET Microsoft Azure EventGrid Management SDK](/azure/event-grid/sdk-overview).
- An [Azure Communication Services resource](../../create-communication-resource.md).

## Installing the SDK

First, install the Microsoft Azure Event Grid Management library for .NET with Nuget:

```csharp
dotnet add package Azure.ResourceManager.EventGrid;
```
1. include the Communication Services Management SDK in your C# project:

```csharp
using Microsoft.Azure.Management.EventGrid;
using Microsoft.Azure.Management.EventGrid.Models;
```
## Communication Services ResourceId
You will need to know the resourceId of your Azure Commmunication Services resource. This can be acquired from the portal:

1. Login into your Azure account
2. Select Resources in the left sidebar
3. Select your Azure Communication Services resource
4. Click on Overview and click on **JSON View**
    :::image type="content" source="../media/subscribe-through-portal/resource-json-view.png" alt-text="Screenshot highlighting the JSON View button in the Overview tab in the Azure portal.":::
5. Select the Copy button to copy the resourceId 
    :::image type="content" source="../media/subscribe-through-portal/communication-services-resourceid.png" alt-text="Screenshot highlighting the ResourceID button in the JSON View in the Azure portal.":::

## Authentication

To communicate with Azure Communication Services, you must first authenticate yourself to Azure. 

## Create Event Subscription
This code sample shows how to create the event subscription for the webhook subscriber endpoint.

```csharp
string webhookUri = $"<webhookUri>";
string resourceId="/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Communication/CommunicationServices/<acsResourceName>";
string[] includedEventTypes = new string[]{ "Microsoft.Communication.SMSReceived", 
                                            "Microsoft.Communication.SMSDeliveryReportReceived"
                                            };

EventSubscription eventSubscription = new EventSubscription(
    name: "<eventSubscriptionName>",
    eventDeliverySchema: "EventGridSchema",
    filter: new EventSubscriptionFilter(
    includedEventTypes: includedEventTypes),
    destination: new WebHookEventSubscriptionDestination(webhookUri));

await _eventGridClient.EventSubscriptions.CreateOrUpdateAsync(
    scope: resourceId,
    eventSubscriptionName: "<eventSubscriptionName>",
    eventSubscriptionInfo: eventSubscription);
```

## Update Event Subscription
This code sample shows how to update the event subscription to add additional events you want to receive on the webhook subscriber endpoint.

```csharp
string webhookUri = $"<webhookUri>";
string resourceId="/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Communication/CommunicationServices/<acsResourceName>";
string[] additionalEventTypes = new string[]{ 
                                            "Microsoft.Communication.ChatMessageReceived"
                                        };

await _eventGridClient.EventSubscriptions.UpdateAsync(
    scope: resourceId,
    eventSubscriptionName: "<eventSubscriptionName>",
    eventSubscriptionUpdateParameters: new EventSubscriptionUpdateParameters(
            filter: new EventSubscriptionFilter(includedEventTypes: additionalEventTypes)));
```

## Delete Event Subscription
This code sample shows how to delete the event susbcription for the webhook subscriber endpoint.

```csharp
string webhookUri = $"<webhookUri>";
string resourceId="/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Communication/CommunicationServices/<acsResourceName>";

await _eventGridClient.EventSubscriptions.DeleteAsync(
    scope: resourceId,
    eventSubscriptionName: "<eventSubscriptionName>");
```

