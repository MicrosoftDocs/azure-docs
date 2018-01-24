---
title: Azure Service Bus messaging overview | Microsoft Docs
description: Description of Service Bus messaging
services: service-bus-messaging
documentationcenter: .net
author: ChristianWolf42
manager: timlt
editor: 'ChristianWolf42'

ms.assetid: f99766cb-8f4b-4baf-b061-4b1e2ae570e4
ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: get-started-article
ms.date: 1/23/2017
ms.author: chwolf

---
# An introduction to Azure Service Bus

Azure Service Bus (ASB) is a fully managed enterprise integration message broker. It is most commonly used to decouple applications and services from each other and give highly reliable and secure a platform for asynchronous data and state transfer. The data is transferred between the different applications, services or also commonly called endpoints via messages which can also be seen as data packages. A message can contain text (Including JSON and XML) as well as binary data.

Some common messaging scenarios are:

* Transferring business data like Sales or Purchase orders, Journals or Inventory movements
* Improve reliability and scalability of applications and services through decoupling
* Enable 1:N relations between publisher and subscribers

The messages which are being send to and received from the message broker are stored in so called channels or also called Queues. The Queues allow you to store the messages till the receiving side is available to receive and process them.

![Queue](./media/service-bus-messaging-overview/about-service-bus-queue.png)

Messages in [Queues](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-queues-topics-subscriptions) are ordered and timestamped on arrival. Once accepted, the message is held safely in redundantly triple replicated storage, with intra-region disaster-recovery backups.

Queues have two delivery modes: Pull and Forward
* [Pull](service-bus-quickstart-powershell.md) – delivers messages on request.
* [Forward](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-auto-forwarding) – delivers message to single forwarding destination.

Azure Service Bus has many advanced features which allow you to solve more complex messaging problems like for example: Enforcing first in, first out receiving via [Sessions](https://docs.microsoft.com/en-us/azure/service-bus-messaging/message-sessions), or chaining multiple entities utilizing [auto-forwarding](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-auto-forwarding) or [dead-letter](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dead-letter-queues) queues in case messages can for some reason not be processed. A full list of key features can be found below.

Another object which can be utilized to send and receive messages and decouple applications or services is the topic. Whereas the Queue is often used for point to point communication the topic is used for publisher / subscriber scenarios.

![Topic](./media/service-bus-messaging-overview/about-service-bus-topic.png)

[Topics](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-queues-topics-subscriptions) can have multiple, Independent Subscriptions. Each subscriber is eligible to receive a copy of each message. Subscriptions are named entities which are usually durably created but can optionally expire/auto-delete.

Many times the individual subscriptions should not get all the messages which are send to a topic. For that Azure Service Bus offers [rules and filter](https://docs.microsoft.com/en-us/azure/service-bus-messaging/topic-filters) conditions that can be defined, which trigger optional [actions](https://docs.microsoft.com/en-us/azure/service-bus-messaging/topic-filters) and set/modify message properties.

Topic 'tail' and subscription 'head' are fully protocol compatible with Queues and share the same delivery modes.

## Key features and integrations
|Features||Integrations|
|--------|--------| -----|
|[Scheduled delivery](https://docs.microsoft.com/en-us/azure/service-bus-messaging/message-sequencing)|[Filtering and Actions](https://docs.microsoft.com/en-us/azure/service-bus-messaging/topic-filters)| [Azure Event Grid](https://azure.microsoft.com/en-us/services/event-grid/)|
|[Dead lettering](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-dead-letter-queues)|[Auto-delete on idle](https://docs.microsoft.com/en-us/dotnet/api/microsoft.servicebus.messaging.subscriptiondescription.autodeleteonidle?view=azure-dotnet#Microsoft_ServiceBus_Messaging_SubscriptionDescription_AutoDeleteOnIdle)|[Azure Logic Apps](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-overview)|
|[Auto-forwarding](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-auto-forwarding)|[Duplicate detection](https://docs.microsoft.com/en-us/azure/service-bus-messaging/duplicate-detection)|[Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/)|
|[Deferral](https://docs.microsoft.com/en-us/azure/service-bus-messaging/message-deferral)|[SAS](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-sas), [RBAC](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-role-based-access-control) and [MSI](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-managed-service-identity) support|[Dynamics 365](https://docs.microsoft.com/en-us/dynamics365/) |
|[Sessions](https://docs.microsoft.com/en-us/azure/service-bus-messaging/message-sessions)|[Geo-Recovery](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-geo-dr)||
|[Batching](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-performance-improvements) and / or long polling |Secure, standard [AMQP 1.0](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-amqp-overview) and [HTTP/REST](https://docs.microsoft.com/en-us/rest/api/servicebus/) protocols||
|[Transactions](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-transactions)|Client libraries for [.Net](https://github.com/Azure/azure-service-bus-dotnet/tree/master), [Java](https://github.com/Azure/azure-service-bus-java/tree/master), [JMS](https://github.com/Azure/azure-service-bus/tree/master/samples/Java/qpid-jms-client) support||

## Next steps

To learn more about Service Bus messaging, see the following articles.

* Learn more about our [Standard and Premium](https://azure.microsoft.com/en-us/pricing/details/service-bus/) tiers and about their pricing.
* [Performance and Latency of our Premium offering](https://blogs.msdn.microsoft.com/servicebus/2016/07/18/premium-messaging-how-fast-is-it/).
* Try our quick starts in [.Net](service-bus-quickstart-powershell.md), [Java](TBD) or [JMS](TBD) or try these short tutorials about topics in .Net, Java and JMS.
