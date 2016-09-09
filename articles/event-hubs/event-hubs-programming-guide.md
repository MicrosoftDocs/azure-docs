<properties 
    pageTitle="Programming guide for Azure Event Hubs | Microsoft Azure"
    description="Describes programming with Azure Event Hubs using the Azure .NET SDK."
    services="event-hubs"
    documentationCenter="na"
    authors="sethmanheim"
    manager="timlt"
    editor="" />
<tags 
    ms.service="event-hubs"
    ms.devlang="na"
    ms.topic="get-started-article"
    ms.tgt_pltfrm="na"
    ms.workload="tbd"
    ms.date="04/15/2016"
    ms.author="sethm" />

# Event Hubs programming guide

This topic describes programming with Azure Event Hubs using the Azure .NET SDK. It assumes a preliminary understanding of Event Hubs. For a conceptual overview of Event Hubs, see the [Event Hubs overview](event-hubs-overview.md).

## Event publishers

Sending events to an Event Hub is accomplished either using HTTP POST or via an AMQP 1.0 connection. The choice of which to use when depends on the specific scenario being addressed. AMQP 1.0 connections are metered as brokered connections in Service Bus and are more appropriate in scenarios with frequent higher message volumes and lower latency requirements, as they provide a persistent messaging channel.

Event Hubs are created and managed using the [NamespaceManager](https://msdn.microsoft.com/library/azure/microsoft.servicebus.namespacemanager.aspx) class. When using the .NET managed APIs, the primary constructs for publishing data to Event Hubs are the [EventHubClient](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubclient.aspx) and [EventData](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventdata.aspx) classes. [EventHubClient](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubclient.aspx) provides the AMQP communication channel over which events are sent to the Event Hub. The [EventData](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventdata.aspx) class represents an event and is used to publish messages to an Event Hub. This class includes the body, some metadata, and header information about the event. Other properties are added to the [EventData](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventdata.aspx) object as it passes through an Event Hub.

## Get started

The .NET classes that support Event Hubs are provided in the Microsoft.ServiceBus.dll assembly. The easiest way to reference the Service Bus API and to configure your application with all of the Service Bus dependencies is to download the [Service Bus NuGet package](https://www.nuget.org/packages/WindowsAzure.ServiceBus). Alternatively, you can use the [Package Manager Console](http://docs.nuget.org/docs/start-here/using-the-package-manager-console) in Visual Studio. To do so, issue the following command in the [Package Manager Console](http://docs.nuget.org/docs/start-here/using-the-package-manager-console) window:

```
Install-Package WindowsAzure.ServiceBus
```

## Create an Event Hub

You can use the [NamespaceManager](https://msdn.microsoft.com/library/azure/microsoft.servicebus.namespacemanager.aspx) class to create Event Hubs. For example:

```
var manager = new Microsoft.ServiceBus.NamespaceManager("mynamespace.servicebus.windows.net");
var description = manager.CreateEventHub("MyEventHub");
```

In most cases, it is recommended that you use the [CreateEventHubIfNotExists](https://msdn.microsoft.com/library/azure/microsoft.servicebus.namespacemanager.createeventhubifnotexists.aspx) methods to avoid generating exceptions if the service restarts. For example:

```
var description = manager.CreateEventHubIfNotExists("MyEventHub");
```

All Event Hubs creation operations, including [CreateEventHubIfNotExists](https://msdn.microsoft.com/library/azure/microsoft.servicebus.namespacemanager.createeventhubifnotexists.aspx), require **Manage** permissions on the namespace in question. If you want to limit the permissions of your publisher or consumer applications, you can avoid these create operation calls in production code when you use credentials with limited permissions.

The [EventHubDescription](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubdescription.aspx) class contains details about an Event Hub, including the authorization rules, the message retention interval, partition IDs, status, and path. You can use this class to update the metadata on an Event Hub.

## Create an Event Hubs client

The primary class for interacting with Event Hubs is [Microsoft.ServiceBus.Messaging.EventHubClient](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubclient.aspx). This class provides both sender and receiver capabilities. You can instantiate this class using the [Create](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubclient.create.aspx) method, as shown in the following example.

```
var client = EventHubClient.Create(description.Path);
```

This method uses the Service Bus connection information in the App.config file, in the `appSettings` section. For an example of the `appSettings` XML used to store the Service Bus connection information, see the documentation for the [Microsoft.ServiceBus.Messaging.EventHubClient.Create(System.String)](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubclient.create.aspx) method.

Another option is to create the client from a connection string. This option works well when using Azure worker roles, because you can store the string in the configuration properties for the worker. For example:

```
EventHubClient.CreateFromConnectionString("your_connection_string");
```

The connection string will be in the same format as it appears in the App.config file for the previous methods:

```
Endpoint=sb://[namespace].servicebus.windows.net/;SharedAccessKeyName=Manage;SharedAccessKey=[key]
```

Finally, it is also possible to create an [EventHubClient](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubclient.aspx) object from a [MessagingFactory](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.messagingfactory.aspx) instance, as shown in the following example.

```
var factory = MessagingFactory.CreateFromConnectionString("your_connection_string");
var client = factory.CreateEventHubClient("MyEventHub");
```

It is important to note that additional [EventHubClient](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubclient.aspx) objects created from a messaging factory instance will reuse the same underlying TCP connection. Therefore, these objects have a client-side limit on throughput. The [Create](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubclient.create.aspx) method reuses a single messaging factory. If you need very high throughput from a single sender, then you can create multiple message factories and one [EventHubClient](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubclient.aspx) object from each messaging factory.

## Send events to an Event Hub

You send events to an Event Hub by creating an [EventData](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventdata.aspx) instance and sending it via the [Send](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubclient.send.aspx) method. This method takes a single [EventData](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventdata.aspx) instance parameter and synchronously sends it to an Event Hub.

## Event serialization

The [EventData](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventdata.aspx) class has [four overloaded constructors](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventdata.eventdata.aspx) that take a variety of parameters, such as an object and serializer, a byte array, or a stream. It is also possible to instantiate the [EventData](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventdata.aspx) class and set the body stream afterwards. When using JSON with [EventData](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventdata.aspx), you can use **Encoding.UTF8.GetBytes()** to retrieve the byte array for a JSON-encoded string.

## Partition key

The [EventData](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventdata.aspx) class has a [PartitionKey](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventdata.partitionkey.aspx) property that enables the sender to specify a value that is hashed to produce a partition assignment. Using a partition key ensures that all the events with the same key are sent to the same partition in the Event Hub. Common partition keys include user session IDs and unique sender IDs. The [PartitionKey](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventdata.partitionkey.aspx) property is optional and can be provided when using the [Microsoft.ServiceBus.Messaging.EventHubClient.Send(Microsoft.ServiceBus.Messaging.EventData)](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventdata.aspx) or [Microsoft.ServiceBus.Messaging.EventHubClient.SendAsync(Microsoft.ServiceBus.Messaging.EventData)](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventdata.aspx) methods. If you do not provide a value for [PartitionKey](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventdata.partitionkey.aspx), sent events are distributed to partitions using a round-robin model.

## Batch event send operations

Sending events in batches can dramatically increase throughput. The [SendBatch](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubclient.sendbatch.aspx) method takes an **IEnumerable** parameter of type [EventData](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventdata.aspx) and sends the entire batch as an atomic operation to the Event Hub.

```
public void SendBatch(IEnumerable<EventData> eventDataList);
```

Note that a single batch must not exceed the 256 KB limit of an event. Additionally, each message in the batch uses the same publisher identity. It is the responsibility of the sender to ensure that the batch does not exceed the maximum event size. If it does, a client **Send** error is generated.

## Send asynchronously and send at scale

You can also send events to an Event Hub asynchronously. Sending asynchronously can increase the rate at which a client is able to send events. Both the [Send](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubclient.send.aspx) and [SendBatch](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubclient.sendbatch.aspx) methods are available in asynchronous versions that return a [Task](https://msdn.microsoft.com/library/system.threading.tasks.task.aspx) object. While this technique can increase throughput, it can also cause the client to continue to send events even while it is being throttled by the Event Hubs service and can result in the client experiencing failures or lost messages if not properly implemented. In addition, you can use the [RetryPolicy](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.cliententity.retrypolicy.aspx) property on the client to control client retry options.

## Create a partition sender

Although it is most common to send events to an Event Hub with a partition key, in some cases you might want to send events directly to a given partition. For example:

```
var partitionedSender = client.CreatePartitionedSender(description.PartitionIds[0]);
```

[CreatePartitionedSender](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubclient.createpartitionedsender.aspx) returns an [EventHubSender](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubsender.aspx) object that you can use to publish events to a specific Event Hub partition.

## Event consumers

Event Hubs has two primary models for event consumption: direct receivers and higher-level abstractions, such as [EventProcessorHost](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventprocessorhost.aspx). Direct receivers are responsible for their own coordination of access to partitions within a consumer group.

### Direct consumer

The most direct way to read from a partition within a consumer group is to use the [EventHubReceiver](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubreceiver.aspx) class. To create an instance of this class, you must use an instance of the [EventHubConsumerGroup](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubconsumergroup.aspx) class. In the following example, the partition ID must be specified when creating the receiver for the consumer group.

```
EventHubConsumerGroup group = client.GetDefaultConsumerGroup();
var receiver = group.CreateReceiver(client.GetRuntimeInformation().PartitionIds[0]);
```

The [CreateReceiver](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubconsumergroup.createreceiver.aspx) method has several overloads that facilitate control over the reader being created. These methods include specifying an offset as either a string or timestamp, and the ability to specify whether to include this specified offset in the returned stream, or start after it. After you create the receiver, you can start receiving events on the returned object. The [Receive](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventhubreceiver.receive.aspx) method has four overloads that control the receive operation parameters, such as batch size and wait time. You can use the asynchronous versions of these methods to increase the throughput of a consumer. For example:

```
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

With respect to a specific partition, the messages are received in the order in which they were sent to the Event Hub. The offset is a string token used to identify a message in a partition.

Note that a single partition within a consumer group cannot have more than 5 concurrent readers connected at any time. As readers connect or become disconnected, their sessions might stay active for several minutes before the service recognizes that they have disconnected. During this time, reconnecting to a partition may fail. For a complete example of writing a direct receiver for Event Hubs, see the [Service Bus Event Hubs Direct Receivers](https://code.msdn.microsoft.com/Event-Hub-Direct-Receivers-13fa95c6) sample.

### Event processor host

The [EventProcessorHost](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventprocessorhost.aspx) class processes data from Event Hubs. You should use this implementation when building event readers on the .NET platform. [EventProcessorHost](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventprocessorhost.aspx) provides a thread-safe, multi-process, safe runtime environment for event processor implementations that also provides checkpointing and partition lease management.

To use the [EventProcessorHost](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventprocessorhost.aspx) class, you can implement [IEventProcessor](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.ieventprocessor.aspx). This interface contains three methods:

- [OpenAsync](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.ieventprocessor.openasync.aspx)

- [CloseAsync](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.ieventprocessor.closeasync.aspx)

- [ProcessEventsAsync](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.ieventprocessor.processeventsasync.aspx)

To start event processing, instantiate [EventProcessorHost](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventprocessorhost.aspx), providing the appropriate parameters for your Event Hub. Then, call [RegisterEventProcessorAsync](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventprocessorhost.registereventprocessorasync.aspx) to register your [IEventProcessor](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.ieventprocessor.aspx) implementation with the runtime. At this point, the host will attempt to acquire a lease on every partition in the Event Hub using a "greedy" algorithm. These leases will last for a given timeframe and must then be renewed. As new nodes, worker instances in this case, come online, they place lease reservations and over time the load shifts between nodes as each attempts to acquire more leases.

![Event Processor Host](./media/event-hubs-programming-guide/IC759863.png)

Over time, an equilibrium is established. This dynamic capability enables CPU-based autoscaling to be applied to consumers for both scale-up and scale-down. Because Event Hubs do not have a direct concept of message counts, average CPU utilization is often the best mechanism to measure back end or consumer scale. If publishers begin to publish more events than consumers can process, the CPU increase on consumers can be used to cause an auto-scale on worker instance count.

The [EventProcessorHost](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventprocessorhost.aspx) class also implements an Azure storage-based checkpointing mechanism. This mechanism stores the offset on a per partition basis, so that each consumer can determine what the last checkpoint from the previous consumer was. As partitions transition between nodes via leases, this is the synchronization mechanism that facilitates load shifting.

## Publisher revocation

In addition to the advanced runtime features of [EventProcessorHost](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventprocessorhost.aspx), Event Hubs enables publisher revocation in order to block specific publishers from sending event to an Event Hub. These features are particularly useful if a publisher token has been compromised, or a software update is causing them to behave inappropriately. In these situations, the publisher's identity, which is part of their SAS token, can be blocked from publishing events.

For more information about publisher revocation and how to send to Event Hubs as a publisher, see the [Service Bus Event Hubs Large Scale Secure Publishing](https://code.msdn.microsoft.com/Service-Bus-Event-Hub-99ce67ab) sample.

## Next steps

To learn more about Event Hubs scenarios, visit these links:

- [Event Hubs API overview](event-hubs-api-overview.md)
- [Event Hubs overview](event-hubs-overview.md)
- [Event Hubs code samples](http://code.msdn.microsoft.com/site/search?query=event hub&f[0].Value=event hub&f[0].Type=SearchText&ac=5)
- [Event processor host API reference](https://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventprocessorhost.aspx)
