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

Azure Service Bus now supports the Advanced Message Queuing Protocol (AMQP) 1.0 for Azure Service Bus **Partitioned Entities**.

AMQP is an open standard message queuing protocol that enables developing cross-platform applications using different programing languages.  More information about Service Bus general support of AMQP can be found at: [AMQP 1.0 support in Service Bus](https://azure.microsoft.com/en-us/documentation/articles/service-bus-amqp-overview).

Partitioned queues and topics offer higher availability, reliability and throughput over non-partitioned queues and topics. More details about partitioned entities can be found at: [Partitioning Messaging Entities](https://msdn.microsoft.com/en-us/library/azure/dn520246.aspx).

### Using AMQP with partitioned queues
#### Creating partitioned queues
	// Create partitioned queue
	var nm = NamespaceManager.CreateFromConnectionString(myConnectionString);
	var queueDescription = new QueueDescription("myQueue");
	queueDescription.EnablePartitioning = true;
	nm.CreateQueue(queueDescription);

#### Sending and receiving messaging using AMQP
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
#### Creating partitioned topics
	// Create partitioned topic
	var nm = NamespaceManager.CreateFromConnectionString(myConnectionString);
	var topicDescription = new TopicDescription("myTopic");
	topicDescription.EnablePartitioning = true;
	nm.CreateTopic(topicDescription);

	var subscriptionDescription = new SubscriptionDescription("myTopic", "mySubscription");
	nm.CreateSubscription(subscriptionDescription);

#### Sending and receiving messaging using AMQP
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
*    [AMQP 1.0 support in Service Bus](https://azure.microsoft.com/en-us/documentation/articles/service-bus-amqp-overview/)
*    [Service Bus AMQP: Developer's Guide]("https://msdn.microsoft.com/library/azure/jj841071.aspx")
*    [How to use the Java Message Service (JMS) API with Service Bus and AMQP 1.0](https://azure.microsoft.com/documentation/articles/service-bus-java-how-to-use-jms-api-amqp/)
*    [How to use AMQP 1.0 with the Service Bus .NET API](https://azure.microsoft.com/documentation/articles/service-bus-dotnet-advanced-message-queuing/)

