<properties 
	pageTitle="AMQP 1.0 support for Service Bus Partitioned Queues and Topics | Microsoft Azure" 
	description="Learn about using the Advanced Message Queuing Protocol (AMQP) 1.0 with Service Bus Partitioned Queues and Topics." 
	services="service-bus" 
	documentationCenter=".net" 
	authors="hillaryc" 
	manager="hillaryc" 
	editor="hillaryc"/>

<tags 
	ms.service="service-bus" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="07/21/2015" 
	ms.author="hillaryc"/>



# AMQP 1.0 support for Service Bus Partitioned Queues and Topics 

Azure Service Bus now supports the Advanced Message Queuing Protocol (**AMQP**) 1.0 for Azure Service Bus **Partitioned Queues and Topics.**

**AMQP** is an open standard message queuing protocol that enables developing cross-platform applications using different programming languages.  More information about Service Bus general support of AMQP can be found at: [AMQP 1.0 support in Service Bus](service-bus-amqp-overview.md).

**Partitioned queues and topics**, also known as partitioned entities, offer higher availability, reliability and throughput over conventional non-partitioned queues and topics. More details about partitioned entities can be found at: [Partitioning Messaging Entities](https://msdn.microsoft.com/library/azure/dn520246.aspx).

The addition of AMQP 1.0 as a protocol to communicating with partitioned queues and topics allows customers to build inter-operable applications that take advantages of the higher availability, reliability, and throughout offered by Service Bus partitioned entities.    

### Using AMQP with partitioned queues

Queues are useful for scenarios that require temporal decoupling, load leveling, load balancing, and loose coupling. In a queue, publishers send messages to the queue and consumers receive messages from the queue where a message can only be received once. A classic example of this is an inventory system where point-of-sale terminals would publish data to a queue instead of directly to the inventory management system. The inventory management system would then consume the data at any time to manage stock replenishment. This has several advantages including the inventory management system not having to be online at all times. Find more details about Service Bus queues here: [Creating Applications that Use Service Bus Queues](https://msdn.microsoft.com/library/azure/hh689723.aspx) 

A partitioned queue would further increase the availability, reliability, and throughput for applications as these queues are partitioned across multiple message brokers and messaging stores.     

#### Creating partitioned queues

A partitioned queue can be created through the Azure Portal and the Service Bus SDK. To create a partitioned queue, the EnablePartitioning property has to be set to true in the QueueDescription intance. The code snippet below shows how to create one using the Service Bus SDK. 
 
	// Create partitioned queue
	var nm = NamespaceManager.CreateFromConnectionString(myConnectionString);
	var queueDescription = new QueueDescription("myQueue");
	queueDescription.EnablePartitioning = true;
	nm.CreateQueue(queueDescription);

#### Sending and receiving messaging using AMQP

Sending messages to a partitioned queue and receiving messages from a partitioned queue using AMQP as protocol is done by setting the TransportType to TransportType.Amqp as shown in the code snippet below.  

	// Sending and receiving messages to and from a Queue
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


### Using AMQP with partitioned topics

Similar to queues, Topics are useful for scenarios that require temporal decoupling, load leveling, load balancing, and loose coupling. Different to queues, topics can route a copy of the same message to multiple subscribers. In a topic, publishers send messages to the topic and consumers receive messages from subscriptions. In the example of an inventory system point-of-sale terminals would publish data to the topic. The inventory management system would then receive messages from a subscription. In addition, a monitoring system can receive the same message from a different subscription. Find more details about Service Bus topic here: [Creating Applications that Use Service Bus Topics and Subscriptions](https://msdn.microsoft.com/library/azure/hh699844.aspx) 

A partitioned topic would further increase the availability, reliability, and throughput for applications as these topics and their subscriptions are partitioned across multiple message brokers and messaging stores. 

#### Creating partitioned topics

A partitioned topic can be created through the Azure Portal and the Service Bus SDK. To create a partitioned topic, the EnablePartitioning property has to be set to true in the TopicDescription instance. The code snippet below shows how to create one using the Service Bus SDK.
	
	// Create partitioned topic
	var nm = NamespaceManager.CreateFromConnectionString(myConnectionString);
	var topicDescription = new TopicDescription("myTopic");
	topicDescription.EnablePartitioning = true;
	nm.CreateTopic(topicDescription);

	var subscriptionDescription = new SubscriptionDescription("myTopic", "mySubscription");
	nm.CreateSubscription(subscriptionDescription);

#### Sending and receiving messaging using AMQP

Sending messages to a partitioned topc and receiving messages from a partitioned topic's subscription using AMQP as protocol is done by setting the TransportType to TransportType.Amqp as shown in the code snippet below.  

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


## References

*    [Partitioning Messaging Entities](https://msdn.microsoft.com/library/azure/dn520246.aspx)
*    [OASIS Advanced Message Queuing Protocol (AMQP) Version 1.0](http://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-complete-v1.0-os.pdf)
*    [AMQP 1.0 support in Service Bus](service-bus-amqp-overview.md)
*    [Service Bus AMQP: Developer's Guide]("https://msdn.microsoft.com/library/azure/jj841071.aspx")
*    [How to use the Java Message Service (JMS) API with Service Bus and AMQP 1.0](service-bus-java-how-to-use-jms-api-amqp.md)
*    [How to use AMQP 1.0 with the Service Bus .NET API](service-bus-dotnet-advanced-message-queuing.md)

