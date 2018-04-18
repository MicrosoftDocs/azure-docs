---
title: Azure Service Bus to Event Grid integration overview | Microsoft Docs
description: Description of Service Bus messaging and Event Grid integration
services: service-bus-messaging
documentationcenter: .net
author: ChristianWolf42
manager: timlt
editor: ''

ms.assetid: f99766cb-8f4b-4baf-b061-4b1e2ae570e4
ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: get-started-article
ms.date: 02/15/2018
ms.author: chwolf

---
# Azure Service Bus to Azure Event Grid integration Overview

Azure Service Bus launched a new integration to Azure Event Grid. The key scenario this feature enables is that Service Bus Queues or Subscriptions that have a low volume of messages, do not have to have a receiver polling for messages at all times. Service Bus can now emit events to Azure Event Grid when there are messages in a Queue or Subscription when no receivers are present. You can create Azure Event Grid subscriptions to your Service Bus namespaces and listen to these events and react to the events by starting a receiver. With this feature, Service Bus can be used in reactive programming models.

To enable the feature, you need the following things:

* An Azure Service Bus Premium namespace with at least one Service Bus Queue or a Service Bus Topic with at least one Subscription.
* Contributor access to the Azure Service Bus Namespace.
* Additionally, you need an Azure Event Grid subscription for the Service Bus Namespace. This subscription is getting the notification from Azure Event Grid that there are messages to be picked up. Typical subscribers could be Logic Apps, Azure Functions, or a Web Hook contacting a Web App, which then process the messages. 

![19][]

### Verify that you have contributor access

Navigate to your Service Bus Namespace and select "Access control (IAM)" as shown below:

![1][]

### Events and Event Schemas

Azure Service Bus today sends events for two scenarios.

* [ActiveMessagesWithNoListenersAvailable](#active-messages-available-event)
* [DeadletterMessagesAvailable](#dead-lettered-messages-available-event)

Additionally it uses the standard Azure Event Grid Security and [authentication mechanisms](https://docs.microsoft.com/en-us/azure/event-grid/security-authentication).

To get more details on Event Grid Event Schemas, follow [this](https://docs.microsoft.com/en-us/azure/event-grid/event-schema) link.

#### Active Messages Available Event

This Event is generated if you have active messages in a Queue or Subscription and no receivers listening.

The schema for this Event is as follows:

```JSON
{
  "topic": "/subscriptions/<subscription id>/resourcegroups/DemoGroup/providers/Microsoft.ServiceBus/namespaces/<YOUR SERVICE BUS NAMESPACE WILL SHOW HERE>",
  "subject": "topics/<service bus topic>/subscriptions/<service bus subscription>",
  "eventType": "Microsoft.ServiceBus.ActiveMessagesAvailableWithNoListeners",
  "eventTime": "2018-02-14T05:12:53.4133526Z",
  "id": "dede87b0-3656-419c-acaf-70c95ddc60f5",
  "data": {
    "namespaceName": "YOUR SERVICE BUS NAMESPACE WILL SHOW HERE",
    "requestUri": "https://YOUR-SERVICE-BUS-NAMESPACE-WILL-SHOW-HERE.servicebus.windows.net/TOPIC-NAME/subscriptions/SUBSCRIPTIONNAME/messages/head",
    "entityType": "subscriber",
    "queueName": "QUEUE NAME IF QUEUE",
    "topicName": "TOPIC NAME IF TOPIC",
    "subscriptionName": "SUBSCRIPTION NAME"
  },
  "dataVersion": "1",
  "metadataVersion": "1"
}
```

#### Dead lettered Messages Available Event

You get at least one event per Dead Letter Queue, which has messages and no active receivers.

The schema for this Event is as follows:

```JSON
[{
  "topic": "/subscriptions/<subscription id>/resourcegroups/DemoGroup/providers/Microsoft.ServiceBus/namespaces/<YOUR SERVICE BUS NAMESPACE WILL SHOW HERE>",
  "subject": "topics/<service bus topic>/subscriptions/<service bus subscription>",
  "eventType": "Microsoft.ServiceBus.DeadletterMessagesAvailableWithNoListener",
  "eventTime": "2018-02-14T05:12:53.4133526Z",
  "id": "dede87b0-3656-419c-acaf-70c95ddc60f5",
  "data": {
    "namespaceName": "YOUR SERVICE BUS NAMESPACE WILL SHOW HERE",
    "requestUri": "https://YOUR-SERVICE-BUS-NAMESPACE-WILL-SHOW-HERE.servicebus.windows.net/TOPIC-NAME/subscriptions/SUBSCRIPTIONNAME/$deadletterqueue/messages/head",
    "entityType": "subscriber",
    "queueName": "QUEUE NAME IF QUEUE",
    "topicName": "TOPIC NAME IF TOPIC",
    "subscriptionName": "SUBSCRIPTION NAME"
  },
  "dataVersion": "1",
  "metadataVersion": "1"
}]
```

### How often and how many events are emitted?

If you have multiple Queues and Topics / Subscriptions in the namespace, you get at least one event per Queue and one per Subscription. The events are emitted immediately if there is no messages in the Service Bus entity and a new message arrives or every two minutes unless Azure Service Bus detects an active receiver. Message browsing does not interrupt the events.

By default Azure Service Bus emits events for all entities in the namespace. If you want to get events for specific entities only,  see the following filtering section.

### Filtering, limiting from where you get events

If you want to get events only for example one Queue or one Subscription within your namespace, you can use the "Begins with" or "Ends with" filters provided by Azure Event Grid. In some interfaces, the filters are called “Pre” and “Suffix” filters. If you would want to get events for multiple but not all Queues and Subscriptions, you can create multiple different Azure Event Grid Subscriptions and provide a filter for each.

## How to create Azure Event Grid Subscriptions for Service Bus Namespaces

There are three different ways of creating Event Grid Subscriptions for Service Bus Namespaces.

* [The Azure portal](#portal-instructions)
* [Azure CLI](#azure-cli-instructions)
* [PowerShell](#powershell-instructions)

## Portal instructions

To create a new Azure Event Grid subscription, navigate to your namespace in the Azure portal and select the Event Grid blade. Click on “+ Event Subscription” Below shows a namespace, which already has a few Event Grid subscriptions.

![20][]

The following screenshot shows a sample for how to subscribe to an Azure Function or a Web Hook without any specific filtering:

![21][]

## Azure CLI instructions

First make sure you have at least Azure CLI version 2.0 installed. You can download the installer here. Then press “Windows + X” and open a new PowerShell console with Administrator permissions. Alternatively you can also use a command shell within the Azure portal.

Execute the following code:

```PowerShell
Az login

Aa account set -s “THE SUBSCRIPTION YOU WANT TO USE”

$namespaceid=(az resource show --namespace Microsoft.ServiceBus --resource-type namespaces --name “<yourNamespace>“--resource-group “<Your Resource Group Name>” --query id --output tsv)

az eventgrid event-subscription create --resource-id $namespaceid --name “<YOUR EVENT GRID SUBSCRIPTION NAME (CAN BE ANY NOT EXISTING)>” --endpoint “<your_function_url>” --subject-ends-with “<YOUR SERVICE BUS SUBSCRIPTION NAME>”
```

## PowerShell instructions

Make sure you have Azure PowerShell installed. You can find it here. Then press “Windows + X” and open a new PowerShell console with Administrator permissions. Alternatively you can also use a command shell within the Azure portal.

```PowerShell
Login-AzureRmAccount

Select-AzureRmSubscription -SubscriptionName "<YOUR SUBSCRIPTION NAME>"

# This might be installed already
Install-Module AzureRM.ServiceBus

$NSID = (Get-AzureRmServiceBusNamespace -ResourceGroupName "<YOUR RESOURCE GROUP NAME>" -Na
mespaceName "<YOUR NAMESPACE NAME>").Id 

New-AzureRmEVentGridSubscription -EventSubscriptionName “<YOUR EVENT GRID SUBSCRIPTION NAME (CAN BE ANY NOT EXISTING)>” -ResourceId $NSID -Endpoint "<YOUR FUNCTION URL>” -SubjectEndsWith “<YOUR SERVICE BUS SUBSCRIPTION NAME>”
```

From here, you can explore the other setup options or [test that events are flowing](#test-that-events-are-flowing).

## Next steps

* Service Bus and Event Grid [examples](service-bus-to-event-grid-integration-example.md).
* Learn more about [Azure Event Grid](https://docs.microsoft.com/en-us/azure/azure-functions/).
* Learn more about [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/).
* Learn more about [Azure Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/).
* Learn more about [Azure Service Bus](https://docs.microsoft.com/en-us/azure/azure-functions/).

[1]: ./media/service-bus-to-event-grid-integration-concept/sbtoeventgrid1.png
[19]: ./media/service-bus-to-event-grid-integration-concept/sbtoeventgriddiagram.png
[8]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid8.png
[9]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgrid9.png
[20]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgridportal.png
[21]: ./media/service-bus-to-event-grid-integration-example/sbtoeventgridportal2.png