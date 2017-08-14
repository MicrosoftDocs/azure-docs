---
title: Overview of Azure Service Bus messaging queues, topics, and subscriptions | Microsoft Docs
description: Overview of Service Bus messaging entities.
services: service-bus-messaging
documentationcenter: na
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: a306ced4-74e9-47c6-990a-d9c47efa31d5
ms.service: service-bus-messaging
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/28/2017
ms.author: sethm

---
# Service Bus queues, topics, and subscriptions

Microsoft Azure Service Bus supports a set of cloud-based, message-oriented middleware technologies including reliable message queuing and durable publish/subscribe messaging. These "brokered" messaging capabilities can be thought of as decoupled messaging features that support publish-subscribe, temporal decoupling, and load balancing scenarios using the Service Bus messaging fabric. Decoupled communication has many advantages; for example, clients and servers can connect as needed and perform their operations in an asynchronous fashion.

The messaging entities that form the core of the messaging capabilities in Service Bus are queues, topics and subscriptions, and rules/actions.

## Queues

Queues offer *First In, First Out* (FIFO) message delivery to one or more competing consumers. That is, messages are typically expected to be received and processed by the receivers in the order in which they were added to the queue, and each message is received and processed by only one message consumer. A key benefit of using queues is to achieve "temporal decoupling" of application components. In other words, the producers (senders) and consumers (receivers) do not have to be sending and receiving messages at the same time, because messages are stored durably in the queue. Furthermore, the producer does not have to wait for a reply from the consumer in order to continue to process and send messages.

A related benefit is "load leveling," which enables producers and consumers to send and receive messages at different rates. In many applications, the system load varies over time; however, the processing time required for each unit of work is typically constant. Intermediating message producers and consumers with a queue means that the consuming application only has to be provisioned to be able to handle average load instead of peak load. The depth of the queue grows and contracts as the incoming load varies. This directly saves money with regard to the amount of infrastructure required to service the application load. As the load increases, more worker processes can be added to read from the queue. Each message is processed by only one of the worker processes. Furthermore, this pull-based load balancing allows for optimum use of the worker computers even if the worker computers differ with regard to processing power, as they will pull messages at their own maximum rate. This pattern is often termed the "competing consumer" pattern.

Using queues to intermediate between message producers and consumers provides an inherent loose coupling between the components. Because producers and consumers are not aware of each other, a consumer can be upgraded without having any effect on the producer.

Creating a queue is a multi-step process. You perform management operations for Service Bus messaging entities (both queues and topics) via the [Microsoft.ServiceBus.NamespaceManager](/dotnet/api/microsoft.servicebus.namespacemanager#microsoft_servicebus_namespacemanager) class, which is constructed by supplying the base address of the Service Bus namespace and the user credentials. [NamespaceManager](/dotnet/api/microsoft.servicebus.namespacemanager#microsoft_servicebus_namespacemanager) provides methods to create, enumerate and delete messaging entities. After creating a [Microsoft.ServiceBus.TokenProvider](/dotnet/api/microsoft.servicebus.tokenprovider#microsoft_servicebus_tokenprovider) object from the SAS name and key, and a service namespace management object, you can use the [Microsoft.ServiceBus.NamespaceManager.CreateQueue](/dotnet/api/microsoft.servicebus.namespacemanager#Microsoft_ServiceBus_NamespaceManager_CreateQueue_System_String_) method to create the queue. For example:

```csharp
// Create management credentials
TokenProvider credentials = TokenProvider.CreateSharedAccessSignatureTokenProvider(sasKeyName,sasKeyValue);
// Create namespace client
NamespaceManager namespaceClient = new NamespaceManager(ServiceBusEnvironment.CreateServiceUri("sb", ServiceNamespace, string.Empty), credentials);
```

You can then create a queue object and a messaging factory with the Service Bus URI as an argument. For example:

```csharp
QueueDescription myQueue;
myQueue = namespaceClient.CreateQueue("TestQueue");
MessagingFactory factory = MessagingFactory.Create(ServiceBusEnvironment.CreateServiceUri("sb", ServiceNamespace, string.Empty), credentials); 
QueueClient myQueueClient = factory.CreateQueueClient("TestQueue");
```

You can then send messages to the queue. For example, if you have a list of brokered messages called `MessageList`, the code appears similar to the following:

```csharp
for (int count = 0; count < 6; count++)
{
    var issue = MessageList[count];
    issue.Label = issue.Properties["IssueTitle"].ToString();
    myQueueClient.Send(issue);
}
```

You then receive messages from the queue as follows:

```csharp
while ((message = myQueueClient.Receive(new TimeSpan(hours: 0, minutes: 0, seconds: 5))) != null)
    {
        Console.WriteLine(string.Format("Message received: {0}, {1}, {2}", message.SequenceNumber, message.Label, message.MessageId));
        message.Complete();

        Console.WriteLine("Processing message (sleeping...)");
        Thread.Sleep(1000);
    }
```

In the [ReceiveAndDelete](/dotnet/api/microsoft.servicebus.messaging.receivemode) mode, the receive operation is single-shot; that is, when Service Bus receives the request, it marks the message as being consumed and returns it to the application. **ReceiveAndDelete** mode is the simplest model and works best for scenarios in which the application can tolerate not processing a message in the event of a failure. To understand this, consider a scenario in which the consumer issues the receive request and then crashes before processing it. Because Service Bus marks the message as being consumed, when the application restarts and begins consuming messages again, it will have missed the message that was consumed prior to the crash.

In [PeekLock](/dotnet/api/microsoft.servicebus.messaging.receivemode) mode, the receive operation becomes two-stage, which makes it possible to support applications that cannot tolerate missing messages. When Service Bus receives the request, it finds the next message to be consumed, locks it to prevent other consumers from receiving it, and then returns it to the application. After the application finishes processing the message (or stores it reliably for future processing), it completes the second stage of the receive process by calling [Complete](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage#Microsoft_ServiceBus_Messaging_BrokeredMessage_Complete) on the received message. When Service Bus sees the **Complete** call, it marks the message as being consumed.

If the application is unable to process the message for some reason, it can call the [Abandon](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage#Microsoft_ServiceBus_Messaging_BrokeredMessage_Abandon) method on the received message (instead of [Complete](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage#Microsoft_ServiceBus_Messaging_BrokeredMessage_Complete)). This enables Service Bus to unlock the message and make it available to be received again, either by the same consumer or by another competing consumer. Secondly, there is a timeout associated with the lock and if the application fails to process the message before the lock timeout expires (for example, if the application crashes), then Service Bus unlocks the message and makes it available to be received again (essentially performing an [Abandon](/dotnet/api/microsoft.servicebus.messaging.brokeredmessage#Microsoft_ServiceBus_Messaging_BrokeredMessage_Abandon) operation by default).

Note that in the event that the application crashes after processing the message, but before the **Complete** request is issued, the message is redelivered to the application when it restarts. This is often called *At Least Once* processing; that is, each message is processed at least once. However, in certain situations the same message may be redelivered. If the scenario cannot tolerate duplicate processing, then additional logic is required in the application to detect duplicates which can be achieved based upon the **MessageId** property of the message, which remains constant across delivery attempts. This is known as *Exactly Once* processing.

## Topics and subscriptions
In contrast to queues, in which each message is processed by a single consumer, *topics* and *subscriptions* provide a one-to-many form of communication, in a *publish/subscribe* pattern. Useful for scaling to very large numbers of recipients, each published message is made available to each subscription registered with the topic. Messages are sent to a topic and delivered to one or more associated subscriptions, depending on filter rules that can be set on a per-subscription basis. The subscriptions can use additional filters to restrict the messages that they want to receive. Messages are sent to a topic in the same way they are sent to a queue, but messages are not received from the topic directly. Instead, they are received from subscriptions. A topic subscription resembles a virtual queue that receives copies of the messages that are sent to the topic. Messages are received from a subscription identically to the way they are received from a queue.

By way of comparison, the message-sending functionality of a queue maps directly to a topic and its message-receiving functionality maps to a subscription. Among other things, this means that subscriptions support the same patterns described earlier in this section with regard to queues: competing consumer, temporal decoupling, load leveling, and load balancing.

Creating a topic is similar to creating a queue, as shown in the example in the previous section. Create the service URI, and then use the [NamespaceManager](/dotnet/api/microsoft.servicebus.namespacemanager) class to create the namespace client. You can then create a topic using the [CreateTopic](/dotnet/api/microsoft.servicebus.namespacemanager#Microsoft_ServiceBus_NamespaceManager_CreateTopic_System_String_) method. For example:

```csharp
TopicDescription dataCollectionTopic = namespaceClient.CreateTopic("DataCollectionTopic");
```

Next, add subscriptions as desired:

```csharp
SubscriptionDescription myAgentSubscription = namespaceClient.CreateSubscription(myTopic.Path, "Inventory");
SubscriptionDescription myAuditSubscription = namespaceClient.CreateSubscription(myTopic.Path, "Dashboard");
```

You can then create a topic client. For example:

```csharp
MessagingFactory factory = MessagingFactory.Create(serviceUri, tokenProvider);
TopicClient myTopicClient = factory.CreateTopicClient(myTopic.Path)
```

Using the message sender, you can send and receive messages to and from the topic, as shown in the previous section. For example:

```csharp
foreach (BrokeredMessage message in messageList)
{
    myTopicClient.Send(message);
    Console.WriteLine(
    string.Format("Message sent: Id = {0}, Body = {1}", message.MessageId, message.GetBody<string>()));
}
```

Similar to queues, messages are received from a subscription using a [SubscriptionClient](/dotnet/api/microsoft.servicebus.messaging.subscriptionclient) object instead of a [QueueClient](/dotnet/api/microsoft.servicebus.messaging.queueclient) object. Create the subscription client, passing the name of the topic, the name of the subscription, and (optionally) the receive mode as parameters. For example, with the **Inventory** subscription:

```csharp
// Create the subscription client
MessagingFactory factory = MessagingFactory.Create(serviceUri, tokenProvider); 

SubscriptionClient agentSubscriptionClient = factory.CreateSubscriptionClient("IssueTrackingTopic", "Inventory", ReceiveMode.PeekLock);
SubscriptionClient auditSubscriptionClient = factory.CreateSubscriptionClient("IssueTrackingTopic", "Dashboard", ReceiveMode.ReceiveAndDelete); 

while ((message = agentSubscriptionClient.Receive(TimeSpan.FromSeconds(5))) != null)
{
    Console.WriteLine("\nReceiving message from Inventory...");
    Console.WriteLine(string.Format("Message received: Id = {0}, Body = {1}", message.MessageId, message.GetBody<string>()));
    message.Complete();
}          

// Create a receiver using ReceiveAndDelete mode
while ((message = auditSubscriptionClient.Receive(TimeSpan.FromSeconds(5))) != null)
{
    Console.WriteLine("\nReceiving message from Dashboard...");
    Console.WriteLine(string.Format("Message received: Id = {0}, Body = {1}", message.MessageId, message.GetBody<string>()));
}
```

### Rules and actions
In many scenarios, messages that have specific characteristics must be processed in different ways. To enable this, you can configure subscriptions to find messages that have desired properties and then perform certain modifications to those properties. While Service Bus subscriptions see all messages sent to the topic, you can only copy a subset of those messages to the virtual subscription queue. This is accomplished using subscription filters. Such modifications are called *filter actions*. When a subscription is created, you can supply a filter expression that operates on the properties of the message, both the system properties (for example, **Label**) and custom application properties (for example, **StoreName**.) The SQL filter expression is optional in this case; without a SQL filter expression, any filter action defined on a subscription will be performed on all the messages for that subscription.

Using the previous example, to filter messages coming only from **Store1**, you would create the Dashboard subscription as follows:

```csharp
namespaceManager.CreateSubscription("IssueTrackingTopic", "Dashboard", new SqlFilter("StoreName = 'Store1'"));
```

With this subscription filter in place, only messages that have the `StoreName` property set to `Store1` are copied to the virtual queue for the `Dashboard` subscription.

For more information about possible filter values, see the documentation for the [SqlFilter](/dotnet/api/microsoft.servicebus.messaging.sqlfilter) and [SqlRuleAction](/dotnet/api/microsoft.servicebus.messaging.sqlruleaction) classes. Also, see the [Brokered Messaging: Advanced Filters](http://code.msdn.microsoft.com/Brokered-Messaging-6b0d2749) and [Topic Filters](https://github.com/Azure-Samples/azure-servicebus-messaging-samples/tree/master/TopicFilters) samples.

## Next steps
See the following advanced topics for more information and examples of using Service Bus messaging.

* [Service Bus messaging overview](service-bus-messaging-overview.md)
* [Service Bus brokered messaging .NET tutorial](service-bus-brokered-tutorial-dotnet.md)
* [Service Bus brokered messaging REST tutorial](service-bus-brokered-tutorial-rest.md)
* [Topic Filters sample ](https://github.com/Azure-Samples/azure-servicebus-messaging-samples/tree/master/TopicFilters)
* [Brokered Messaging: Advanced Filters sample](http://code.msdn.microsoft.com/Brokered-Messaging-6b0d2749)

