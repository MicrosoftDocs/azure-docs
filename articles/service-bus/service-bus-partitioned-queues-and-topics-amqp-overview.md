<properties 
	pageTitle="AMQP 1.0 support for Service Bus partitioned queues and topics | Microsoft Azure" 
	description="Learn about using the Advanced Message Queuing Protocol (AMQP) 1.0 with Service Bus partitioned queues and topics." 
	services="service-bus" 
	documentationCenter=".net" 
	authors="hillaryc" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="service-bus" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="07/08/2016" 
	ms.author="hillaryc;sethm"/>

# AMQP 1.0 support for Service Bus partitioned queues and topics 

Azure Service Bus now supports the Advanced Message Queuing Protocol (**AMQP**) 1.0 for Service Bus **Partitioned Queues and Topics.**

**AMQP** is an open-standard message queuing protocol that enables you to develop cross-platform applications using different programming languages. For general information about AMQP support in Service Bus, see [AMQP 1.0 support in Service Bus](service-bus-amqp-overview.md).

**Partitioned queues and topics**, also known as *partitioned entities*, offer higher availability, reliability and throughput over conventional non-partitioned queues and topics. For more information about partitioned entities, see [Partitioned Messaging Entities](service-bus-partitioning.md).

The addition of AMQP 1.0 as a protocol for communicating with partitioned queues and topics enables you to build interoperable applications that can take advantage of the higher availability, reliability, and throughout offered by Service Bus partitioned entities.

For a detailed wire-level AMQP 1.0 protocol guide, which explains how Service Bus implements and builds on the OASIS AMQP technical specification, see the [AMQP 1.0 in Azure Service Bus and Event Hubs protocol guide](service-bus-amqp-protocol-guide.md).    

## Use AMQP with partitioned queues

Queues are useful for scenarios that require temporal decoupling, load leveling, load balancing, and loose coupling. With a queue, publishers send messages to the queue and consumers receive messages from the queue, in situations where a message can only be received once. A good example of this is an inventory system in which point-of-sale terminals publish data to a queue instead of directly to the inventory management system. The inventory management system then consumes the data at any time to manage stock replenishment. This has several advantages, including the inventory management system not having to be online at all times. For more details about Service Bus queues, see [Create applications that use Service Bus queues](service-bus-create-queues.md). 

A partitioned queue further increases the availability, reliability, and throughput for applications, as these queues are partitioned across multiple message brokers and messaging stores.     

### Create partitioned queues

You can create a partitioned queue using the [Azure classic portal][] and the Service Bus SDK. To create a partitioned queue, set the [EnablePartitioning](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.queuedescription.enablepartitioning.aspx) property to **true** in the [QueueDescription](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.queuedescription.aspx) instance. The following code shows how to create a partitioned queue using the Service Bus SDK. 
 
```
// Create partitioned queue
var nm = NamespaceManager.CreateFromConnectionString(myConnectionString);
var queueDescription = new QueueDescription("myQueue");
queueDescription.EnablePartitioning = true;
nm.CreateQueue(queueDescription);
```

### Send and receive messages using AMQP

You can send messages to, and receive messages from a partitioned queue using AMQP as protocol, by setting the [TransportType](https://msdn.microsoft.com/library/azure/microsoft.servicebus.servicebusconnectionstringbuilder.transporttype.aspx) property to [TransportType.Amqp](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.transporttype.aspx) as shown in the following code.  

```
// Sending and receiving messages to and from a queue
var myConnectionStringBuilder = new ServiceBusConnectionStringBuilder(myConnectionString);
myConnectionStringBuilder.TransportType = TransportType.Amqp;
string amqpConnectionString = myConnectionStringBuilder.ToString();
var queueClient = QueueClient.CreateFromConnectionString(amqpConnectionString, "myQueue");

BrokeredMessage message = new BrokeredMessage("Hello AMQP");
Console.WriteLine("Sending message {0}...", message.MessageId);
queueClient.Send(message);

var receivedMessage = queueClient.Receive();
Console.WriteLine("Received message: {0}", receivedMessage.GetBody<string>());
receivedMessage.Complete();
```

## Use AMQP with partitioned topics

Topics are conceptually similar to queues, but topics can route a copy of the same message to multiple *subscriptions*. In a topic, publishers send messages to the topic and consumers receive messages from subscriptions. In the inventory system point-of-sale scenario, terminals publish data to the topic. The inventory management system then receives messages from a subscription. In addition, a monitoring system can receive the same message from a different subscription. For more details about Service Bus topics and subscriptions, see [Create applications that use Service Bus topics and subscriptions](service-bus-create-topics-subscriptions.md). 

As with queues, partitioned topics further increase the availability, reliability, and throughput for applications, as these topics and their subscriptions are partitioned across multiple message brokers and messaging stores. 

### Create partitioned topics

You can create a partitioned topic using the [Azure classic portal][] and the Service Bus SDK. To create a partitioned topic, set the [EnablePartitioning](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.topicdescription.enablepartitioning.aspx) property to **true** in the [TopicDescription](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.topicdescription.aspx) instance. The following code shows how to create a partitioned topic using the Service Bus SDK.
	
```
// Create partitioned topic
var nm = NamespaceManager.CreateFromConnectionString(myConnectionString);
var topicDescription = new TopicDescription("myTopic");
topicDescription.EnablePartitioning = true;
nm.CreateTopic(topicDescription);

var subscriptionDescription = new SubscriptionDescription("myTopic", "mySubscription");
nm.CreateSubscription(subscriptionDescription);
```

### Send and receive messages using AMQP

You can send messages to, and receive messages from a partitioned topic subscription using AMQP as a protocol, by setting the [TransportType](https://msdn.microsoft.com/library/azure/microsoft.servicebus.servicebusconnectionstringbuilder.transporttype.aspx) property to [TransportType.Amqp](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.transporttype.aspx), as shown in the following code.  

```
// Sending and receiving messages to a topic and from a subscription
var myConnectionStringBuilder = new ServiceBusConnectionStringBuilder(myConnectionString);
myConnectionStringBuilder.TransportType = TransportType.Amqp;
string amqpConnectionString = myConnectionStringBuilder.ToString();
	
var topicClient = TopicClient.CreateFromConnectionString(amqpConnectionString, "myTopic");
BrokeredMessage message = new BrokeredMessage("Hello AMQP");
Console.WriteLine("Sending message {0}...", message.MessageId);
topicClient.Send(message);
	
var subcriptionClient = SubscriptionClient.CreateFromConnectionString(amqpConnectionString, "myTopic", "mySubscription");
var receivedMessage = subcriptionClient.Receive();
Console.WriteLine("Received message: {0}", receivedMessage.GetBody<string>());
receivedMessage.Complete();
```

## Next steps

See the following additional information to learn more about partitioned messaging entities as well as AMQP.

*    [Partitioned messaging entities](service-bus-partitioning.md)
*    [OASIS Advanced Message Queuing Protocol (AMQP) Version 1.0](http://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-complete-v1.0-os.pdf)
*    [AMQP 1.0 support in Service Bus](service-bus-amqp-overview.md)
*    [AMQP 1.0 in Azure Service Bus and Event Hubs protocol guide](service-bus-amqp-protocol-guide.md)
*    [How to use the Java Message Service (JMS) API with Service Bus and AMQP 1.0](service-bus-java-how-to-use-jms-api-amqp.md)
*    [How to use AMQP 1.0 with the Service Bus .NET API](service-bus-dotnet-advanced-message-queuing.md)

[Azure classic portal]: http://manage.windowsazure.com
