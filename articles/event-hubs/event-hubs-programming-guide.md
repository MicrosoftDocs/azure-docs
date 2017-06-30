---
title: Programming guide for Azure Event Hubs | Microsoft Docs
description: Write code for Azure Event Hubs using the Azure .NET SDK.
services: event-hubs
documentationcenter: na
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: 64cbfd3d-4a0e-4455-a90a-7f3d4f080323
ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: tbd
ms.date: 05/17/2017
ms.author: sethm

---
# Event Hubs programming guide

This article discusses some common scenarios in writing code using Azure Event Hubs and the Azure .NET SDK. It assumes a preliminary understanding of Event Hubs. For a conceptual overview of Event Hubs, see the [Event Hubs overview](event-hubs-what-is-event-hubs.md).

## Event publishers

You send events to an event hub either using HTTP POST or via an AMQP 1.0 connection. The choice of which to use and when depends on the specific scenario being addressed. AMQP 1.0 connections are metered as brokered connections in Service Bus and are more appropriate in scenarios with frequent higher message volumes and lower latency requirements, as they provide a persistent messaging channel.

You create and manage Event Hubs using the [NamespaceManager][] class. When using the .NET managed APIs, the primary constructs for publishing data to Event Hubs are the [EventHubClient](/dotnet/api/microsoft.servicebus.messaging.eventhubclient) and [EventData][] classes. [EventHubClient][] provides the AMQP communication channel over which events are sent to the event hub. The [EventData][] class represents an event, and is used to publish messages to an event hub. This class includes the body, some metadata, and header information about the event. Other properties are added to the [EventData][] object as it passes through an event hub.

## Get started

The .NET classes that support Event Hubs are provided in the Microsoft.ServiceBus.dll assembly. The easiest way to reference the Service Bus API and to configure your application with all of the Service Bus dependencies is to download the [Service Bus NuGet package](https://www.nuget.org/packages/WindowsAzure.ServiceBus). Alternatively, you can use the [Package Manager Console](http://docs.nuget.org/docs/start-here/using-the-package-manager-console) in Visual Studio. To do so, issue the following command in the [Package Manager Console](http://docs.nuget.org/docs/start-here/using-the-package-manager-console) window:

```
Install-Package WindowsAzure.ServiceBus
```

## Create an event hub
You can use the [NamespaceManager][] class to create Event Hubs. For example:

```csharp
var manager = new Microsoft.ServiceBus.NamespaceManager("mynamespace.servicebus.windows.net");
var description = manager.CreateEventHub("MyEventHub");
```

In most cases, it is recommended that you use the [CreateEventHubIfNotExists][] methods to avoid generating exceptions if the service restarts. For example:

```csharp
var description = manager.CreateEventHubIfNotExists("MyEventHub");
```

All Event Hubs creation operations, including [CreateEventHubIfNotExists][], require **Manage** permissions on the namespace in question. If you want to limit the permissions of your publisher or consumer applications, you can avoid these create operation calls in production code when you use credentials with limited permissions.

The [EventHubDescription](/dotnet/api/microsoft.servicebus.messaging.eventhubdescription) class contains details about an event hub, including the authorization rules, the message retention interval, partition IDs, status, and path. You can use this class to update the metadata on an event hub.

## Create an Event Hubs client
The primary class for interacting with Event Hubs is [Microsoft.ServiceBus.Messaging.EventHubClient][EventHubClient]. This class provides both sender and receiver capabilities. You can instantiate this class using the [Create](/dotnet/api/microsoft.servicebus.messaging.eventhubclient.create) method, as shown in the following example.

```csharp
var client = EventHubClient.Create(description.Path);
```

This method uses the Service Bus connection information in the App.config file, in the `appSettings` section. For an example of the `appSettings` XML used to store the Service Bus connection information, see the documentation for the [Microsoft.ServiceBus.Messaging.EventHubClient.Create(System.String)](/dotnet/api/microsoft.servicebus.messaging.eventhubclient#Microsoft_ServiceBus_Messaging_EventHubClient_Create_System_String_) method.

Another option is to create the client from a connection string. This option works well when using Azure worker roles, because you can store the string in the configuration properties for the worker. For example:

```csharp
EventHubClient.CreateFromConnectionString("your_connection_string");
```

The connection string will be in the same format as it appears in the App.config file for the previous methods:

```
Endpoint=sb://[namespace].servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=[key]
```

Finally, it is also possible to create an [EventHubClient][] object from a [MessagingFactory](/dotnet/api/microsoft.servicebus.messaging.messagingfactory) instance, as shown in the following example.

```csharp
var factory = MessagingFactory.CreateFromConnectionString("your_connection_string");
var client = factory.CreateEventHubClient("MyEventHub");
```

It is important to note that additional [EventHubClient][] objects created from a messaging factory instance will reuse the same underlying TCP connection. Therefore, these objects have a client-side limit on throughput. The [Create](/dotnet/api/microsoft.servicebus.messaging.eventhubclient#Microsoft_ServiceBus_Messaging_EventHubClient_Create_System_String_) method reuses a single messaging factory. If you need very high throughput from a single sender, then you can create multiple message factories and one [EventHubClient][] object from each messaging factory.

## Send events to an event hub
You send events to an event hub by creating an [EventData][] instance and sending it via the [Send](/dotnet/api/microsoft.servicebus.messaging.eventhubclient#Microsoft_ServiceBus_Messaging_EventHubClient_Send_Microsoft_ServiceBus_Messaging_EventData_) method. This method takes a single [EventData][] instance parameter and synchronously sends it to an event hub.

## Event serialization
The [EventData][] class has [four overloaded constructors](/dotnet/api/microsoft.servicebus.messaging.eventdata#constructors_) that take a variety of parameters, such as an object and serializer, a byte array, or a stream. It is also possible to instantiate the [EventData][] class and set the body stream afterwards. When using JSON with [EventData][], you can use **Encoding.UTF8.GetBytes()** to retrieve the byte array for a JSON-encoded string.

## Partition key
The [EventData][] class has a [PartitionKey][] property that enables the sender to specify a value that is hashed to produce a partition assignment. Using a partition key ensures that all the events with the same key are sent to the same partition in the event hub. Common partition keys include user session IDs and unique sender IDs. The [PartitionKey][] property is optional and can be provided when using the [Microsoft.ServiceBus.Messaging.EventHubClient.Send(Microsoft.ServiceBus.Messaging.EventData)](/dotnet/api/microsoft.servicebus.messaging.eventhubclient#Microsoft_ServiceBus_Messaging_EventHubClient_Send_Microsoft_ServiceBus_Messaging_EventData_) or [Microsoft.ServiceBus.Messaging.EventHubClient.SendAsync(Microsoft.ServiceBus.Messaging.EventData)](/dotnet/api/microsoft.servicebus.messaging.eventhubclient#Microsoft_ServiceBus_Messaging_EventHubClient_SendAsync_Microsoft_ServiceBus_Messaging_EventData_) methods. If you do not provide a value for [PartitionKey][], sent events are distributed to partitions using a round-robin model.

### Availability considerations

Using a partition key is optional, and you should consider carefully whether or not to use one. In many cases, using a partition key is a good choice if event ordering is important. When you use a partition key, these partitions require availability on a single node, and outages can occur over time; for example, when compute nodes reboot and patch. As such, if you set a partition ID and that partition becomes unavailable for some reason, an attempt to access the data in that partition will fail. If high availability is most important, do not specify a partition key; in that case events will be sent to partitions using the round-robin model described previously. In this scenario, you are making an explicit choice between availability (no partition ID) and consistency (pinning events to a partition ID).

Another consideration is handling delays in processing events. In some cases it might be better to drop data and retry than to try and keep up with processing, which can potentially cause further downstream processing delays. For example, with a stock ticker it's better to wait for complete up-to-date data, but in a live chat or VOIP scenario you'd rather have the data quickly, even if it isn't complete.

Given these availability considerations, in these scenarios you might choose one of the following error handling strategies:

- Stop (stop reading from Event Hubs until things are fixed)
- Drop (messages aren’t important, drop them)
- Retry (retry the messages as you see fit)
- [Dead letter](../service-bus-messaging/service-bus-dead-letter-queues.md) (use a queue or another event hub to dead letter only the messages you couldn’t process)

For more information and a discussion about the trade-offs between availability and consistency, see [Availability and consistency in Event Hubs](event-hubs-availability-and-consistency.md). 

## Batch event send operations
Sending events in batches can dramatically increase throughput. The [SendBatch](/dotnet/api/microsoft.servicebus.messaging.eventhubclient#Microsoft_ServiceBus_Messaging_EventHubClient_SendBatch_System_Collections_Generic_IEnumerable_Microsoft_ServiceBus_Messaging_EventData__) method takes an **IEnumerable** parameter of type [EventData][] and sends the entire batch as an atomic operation to the event hub.

```csharp
public void SendBatch(IEnumerable<EventData> eventDataList);
```

Note that a single batch must not exceed the 256 KB limit of an event. Additionally, each message in the batch uses the same publisher identity. It is the responsibility of the sender to ensure that the batch does not exceed the maximum event size. If it does, a client **Send** error is generated.

## Send asynchronously and send at scale
You can also send events to an event hub asynchronously. Sending asynchronously can increase the rate at which a client is able to send events. Both the [Send](/dotnet/api/microsoft.servicebus.messaging.eventhubclient#Microsoft_ServiceBus_Messaging_EventHubClient_Send_Microsoft_ServiceBus_Messaging_EventData_) and [SendBatch](/dotnet/api/microsoft.servicebus.messaging.eventhubclient#Microsoft_ServiceBus_Messaging_EventHubClient_SendBatch_System_Collections_Generic_IEnumerable_Microsoft_ServiceBus_Messaging_EventData__) methods are available in asynchronous versions that return a [Task](https://msdn.microsoft.com/library/system.threading.tasks.task.aspx) object. While this technique can increase throughput, it can also cause the client to continue to send events even while it is being throttled by the Event Hubs service and can result in the client experiencing failures or lost messages if not properly implemented. In addition, you can use the [RetryPolicy](/dotnet/api/microsoft.servicebus.messaging.cliententity#Microsoft_ServiceBus_Messaging_ClientEntity_RetryPolicy) property on the client to control client retry options.

## Create a partition sender
Although it is most common to send events to an event hub without a partition key, in some cases you might want to send events directly to a given partition. For example:

```csharp
var partitionedSender = client.CreatePartitionedSender(description.PartitionIds[0]);
```

[CreatePartitionedSender](/dotnet/api/microsoft.servicebus.messaging.eventhubclient#Microsoft_ServiceBus_Messaging_EventHubClient_CreatePartitionedSender_System_String_) returns an [EventHubSender](/dotnet/api/microsoft.servicebus.messaging.eventhubsender) object that you can use to publish events to a specific event hub partition.

## Event consumers
Event Hubs has two primary models for event consumption: direct receivers and higher-level abstractions, such as [EventProcessorHost][]. Direct receivers are responsible for their own coordination of access to partitions within a consumer group.

### Direct consumer
The most direct way to read from a partition within a consumer group is to use the [EventHubReceiver](/dotnet/apie/microsoft.servicebus.messaging.eventhubreceiver) class. To create an instance of this class, you must use an instance of the [EventHubConsumerGroup](/dotnet/api/microsoft.servicebus.messaging.eventhubconsumergroup) class. In the following example, the partition ID must be specified when creating the receiver for the consumer group.

```csharp
EventHubConsumerGroup group = client.GetDefaultConsumerGroup();
var receiver = group.CreateReceiver(client.GetRuntimeInformation().PartitionIds[0]);
```

The [CreateReceiver](/dotnet/api/microsoft.servicebus.messaging.eventhubconsumergroup#methods_summary) method has several overloads that facilitate control over the reader being created. These methods include specifying an offset as either a string or timestamp, and the ability to specify whether to include this specified offset in the returned stream, or start after it. After you create the receiver, you can start receiving events on the returned object. The [Receive](/dotnet/api/microsoft.servicebus.messaging.eventhubreceiver#methods_summary) method has four overloads that control the receive operation parameters, such as batch size and wait time. You can use the asynchronous versions of these methods to increase the throughput of a consumer. For example:

```csharp
bool receive = true;
string myOffset;
while(receive)
{
    var message = receiver.Receive();
    myOffset = message.Offset;
    string body = Encoding.UTF8.GetString(message.GetBytes());
    Console.WriteLine(String.Format("Received message offset: {0} \nbody: {1}", myOffset, body));
}
```

With respect to a specific partition, the messages are received in the order in which they were sent to the event hub. The offset is a string token used to identify a message in a partition.

Note that a single partition within a consumer group cannot have more than 5 concurrent readers connected at any time. As readers connect or become disconnected, their sessions might stay active for several minutes before the service recognizes that they have disconnected. During this time, reconnecting to a partition may fail. For a complete example of writing a direct receiver for Event Hubs, see the [Event Hubs Direct Receivers](https://code.msdn.microsoft.com/Event-Hub-Direct-Receivers-13fa95c6) sample.

### Event processor host
The [EventProcessorHost][] class processes data from Event Hubs. You should use this implementation when building event readers on the .NET platform. [EventProcessorHost][] provides a thread-safe, multi-process, safe runtime environment for event processor implementations that also provides checkpointing and partition lease management.

To use the [EventProcessorHost][] class, you can implement [IEventProcessor](/dotnet/api/microsoft.servicebus.messaging.ieventprocessor). This interface contains three methods:

* [OpenAsync](/dotnet/api/microsoft.servicebus.messaging.ieventprocessor#Microsoft_ServiceBus_Messaging_IEventProcessor_OpenAsync_Microsoft_ServiceBus_Messaging_PartitionContext_)
* [CloseAsync](/dotnet/api/microsoft.servicebus.messaging.ieventprocessor#Microsoft_ServiceBus_Messaging_IEventProcessor_CloseAsync_Microsoft_ServiceBus_Messaging_PartitionContext_Microsoft_ServiceBus_Messaging_CloseReason_)
* [ProcessEventsAsync](/dotnet/api/microsoft.servicebus.messaging.ieventprocessor#Microsoft_ServiceBus_Messaging_IEventProcessor_ProcessEventsAsync_Microsoft_ServiceBus_Messaging_PartitionContext_System_Collections_Generic_IEnumerable_Microsoft_ServiceBus_Messaging_EventData__)

To start event processing, instantiate [EventProcessorHost][], providing the appropriate parameters for your event hub. Then, call [RegisterEventProcessorAsync](/dotnet/api/microsoft.servicebus.messaging.eventprocessorhost#Microsoft_ServiceBus_Messaging_EventProcessorHost_RegisterEventProcessorAsync__1) to register your [IEventProcessor](/dotnet/api/microsoft.servicebus.messaging.ieventprocessor) implementation with the runtime. At this point, the host will attempt to acquire a lease on every partition in the event hub using a "greedy" algorithm. These leases will last for a given timeframe and must then be renewed. As new nodes, worker instances in this case, come online, they place lease reservations and over time the load shifts between nodes as each attempts to acquire more leases.

![Event Processor Host](./media/event-hubs-programming-guide/IC759863.png)

Over time, an equilibrium is established. This dynamic capability enables CPU-based autoscaling to be applied to consumers for both scale-up and scale-down. Because Event Hubs do not have a direct concept of message counts, average CPU utilization is often the best mechanism to measure back end or consumer scale. If publishers begin to publish more events than consumers can process, the CPU increase on consumers can be used to cause an auto-scale on worker instance count.

The [EventProcessorHost][] class also implements an Azure storage-based checkpointing mechanism. This mechanism stores the offset on a per partition basis, so that each consumer can determine what the last checkpoint from the previous consumer was. As partitions transition between nodes via leases, this is the synchronization mechanism that facilitates load shifting.

## Publisher revocation
In addition to the advanced run-time features of [EventProcessorHost][], Event Hubs enables publisher revocation in order to block specific publishers from sending event to an event hub. These features are particularly useful if a publisher token has been compromised, or a software update is causing them to behave inappropriately. In these situations, the publisher's identity, which is part of their SAS token, can be blocked from publishing events.

For more information about publisher revocation and how to send to Event Hubs as a publisher, see the [Event Hubs Large Scale Secure Publishing](https://code.msdn.microsoft.com/Service-Bus-Event-Hub-99ce67ab) sample.

## Next steps
To learn more about Event Hubs scenarios, visit these links:

* [Event Hubs API overview](event-hubs-api-overview.md)
* [What is Event Hubs](event-hubs-what-is-event-hubs.md)
* [Availability and consistency in Event Hubs](event-hubs-availability-and-consistency.md)
* [Event processor host API reference](/dotnet/api/microsoft.servicebus.messaging.eventprocessorhost)

[NamespaceManager]: /dotnet/api/microsoft.servicebus.namespacemanager
[EventHubClient]: /dotnet/api/microsoft.servicebus.messaging.eventhubclient
[EventData]: /dotnet/api/microsoft.servicebus.messaging.eventdata
[CreateEventHubIfNotExists]: /dotnet/api/microsoft.servicebus.namespacemanager.createeventhubifnotexists
[PartitionKey]: /dotnet/api/microsoft.servicebus.messaging.eventdata#Microsoft_ServiceBus_Messaging_EventData_PartitionKey
[EventProcessorHost]: /dotnet/api/microsoft.servicebus.messaging.eventprocessorhost
