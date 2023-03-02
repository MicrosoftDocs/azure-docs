---
title: Azure Service Bus to Event Grid integration overview | Microsoft Docs
description: This article provides a description of how Azure Service Bus messaging integrates with Azure Event Grid. 
documentationcenter: .net
author: spelluru
ms.topic: conceptual
ms.date: 12/08/2022
ms.author: spelluru 
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Azure Service Bus to Event Grid integration overview
Service Bus can emit events to Event Grid when there are messages in a queue or a subscription when no receivers are present. You can create Event Grid subscriptions to your Service Bus namespaces, listen to these events, and then react to the events by starting a receiver. With this feature, you can use Service Bus in reactive programming models. The key scenario of this feature is that Service Bus queues or subscriptions with a low volume of messages do not need to have a receiver that polls for messages continuously. 

To enable the feature, you need the following items:

* A Service Bus Premium namespace with at least one Service Bus queue or a Service Bus topic with at least one subscription.
* Contributor access to the Service Bus namespace. Navigate to your Service Bus namespace in the Azure portal, and then select **Access control (IAM)**, and select **Role assignments** tab. Verify that you have the contributor access to the namespace. 
* Additionally, you need an Event Grid subscription for the Service Bus namespace. This subscription receives a notification from Event Grid that there are messages to be picked up. Typical subscribers could be the Logic Apps feature of Azure App Service, Azure Functions, or a webhook contacting a web app. The subscriber then processes the messages. 

![19][]

[!INCLUDE [event-grid-service-bus.md](./includes/event-grid-service-bus.md)]

## Event Grid subscriptions for Service Bus namespaces
You can create Event Grid subscriptions for Service Bus namespaces in three different ways:

- Azure portal. See the following tutorials to learn how to use Azure portal to create Event Grid subscriptions for Service Bus events with Azure Logic Apps and Azure Functions as handlers. 
    - [Azure Logic Apps](service-bus-to-event-grid-integration-example.md#receive-messages-by-using-logic-apps)
    - [Azure Functions](service-bus-to-event-grid-integration-function.md#connect-the-function-and-the-service-bus-namespace-via-event-grid)
* Azure CLI. The following CLI example shows how to create an Azure Functions subscription for a [system topic](../event-grid/system-topics.md) created by a Service Bus namespace.

     ```azurecli-interactive
    namespaceid=$(az resource show --namespace Microsoft.ServiceBus --resource-type namespaces --name "<service bus namespace>" --resource-group "<resource group that contains the service bus namespace>" --query id --output tsv
    
    az eventgrid event-subscription create --resource-id $namespaceid --name "<YOUR EVENT GRID SUBSCRIPTION NAME>" --endpoint "<your_endpoint_url>" --subject-ends-with "<YOUR SERVICE BUS SUBSCRIPTION NAME>"
    ```
- PowerShell. Here's an example:
    ```powershell-interactive
    $namespaceID = (Get-AzServiceBusNamespace -ResourceGroupName "<YOUR RESOURCE GROUP NAME>" -NamespaceName "<YOUR NAMESPACE NAME>").Id
    
    New-AzEVentGridSubscription -EventSubscriptionName "<YOUR EVENT GRID SUBSCRIPTION NAME>" -ResourceId $namespaceID -Endpoint "<YOUR ENDPOINT URL>” -SubjectEndsWith "<YOUR SERVICE BUS SUBSCRIPTION NAME>"
    ```
### How many events are emitted, and how often?

If you have multiple queues and topics or subscriptions in the namespace, you get at least one event per queue and one per subscription. The events are emitted immediately if there are no messages in the Service Bus entity and a new message arrives. Or the events are emitted every two minutes unless Service Bus detects an active receiver. Message browsing doesn't interrupt the events.

By default, Service Bus emits events for all entities in the namespace. If you want to get events for specific entities only, see the next section.

### Use filters to limit where you get events from

If you want to get events only from, for example, one queue or one subscription within your namespace, you can use the *Begins with* or *Ends with* filters that are provided by Event Grid. In some interfaces, the filters are called *Pre* and *Suffix* filters. If you want to get events for multiple, but not all, queues and subscriptions, you can create multiple Event Grid subscriptions and provide a filter for each.

## Next steps
See the following tutorials: 
- [Azure Logic Apps to handle Service Bus messages received via Event Grid](service-bus-to-event-grid-integration-example.md#receive-messages-by-using-logic-apps)
- [Azure Functions to handle Service Bus messages received via Event Grid](service-bus-to-event-grid-integration-function.md#connect-the-function-and-the-service-bus-namespace-via-event-grid)

[1]: ./media/service-bus-to-event-grid-integration-concept/sbtoeventgrid1.png
[19]: ./media/service-bus-to-event-grid-integration-concept/sbtoeventgriddiagram.png
[8]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid8.png
[9]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid9.png
[20]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgridportal.png
[21]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgridportal2.png
