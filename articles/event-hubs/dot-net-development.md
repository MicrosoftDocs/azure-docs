---
title: .NET development for Azure Event Hubs - overview
description: This article describes how to develop .NET applications that send and receives events from Azure Event Hubs. 
ms.topic: how-to
ms.date: 07/27/2022
---

# .NET development for Azure Event Hubs
This section provides how to develop applications using the Azure Event Hubs client library ([Azure.Messaging.EventHubs](https://www.nuget.org/packages/Azure.Messaging.EventHubs/)). Articles in this section are ordered by increasing complexity, starting with more basic scenarios to help get started quickly. Though articles are independent, they'll assume an understanding of the content discussed in earlier articles.

## Install the package
Install the Azure Event Hubs client library for .NET with [NuGet](https://www.nuget.org/packages/Azure.Messaging.EventHubs/):

```dotnetcli
dotnet add package Azure.Messaging.EventHubs
```

## Authenticate the client
For the Event Hubs client library to interact with an event hub, it will need to understand how to connect and authorize with it.  The easiest means for doing so is to use a connection string, which is created automatically when you create an Event Hubs namespace.  If you aren't familiar with using connection strings, see [Get Event Hubs connection string](event-hubs-get-connection-string.md).

## Key concepts
- An **Event Hubs client** is the primary interface for developers interacting with the Event Hubs client library. 
- An **Event Hubs producer** is a type of client that serves as a source of telemetry data, diagnostics information, usage logs, or other log data, as part of an embedded device solution, a mobile device application, a game title running on a console or other device, some client or server based business solution, or a web site.  
- An **Event Hubs consumer** is a type of client that reads information from the event hub and processes it. Processing may involve aggregation, complex computation, and filtering. Processing may also involve distribution or storage of the information in a raw or transformed fashion. Consumers are often robust and high-scale platform infrastructure parts with built-in analytics capabilities, like Azure Stream Analytics, Apache Spark, or Apache Storm.  
- A **partition** is an ordered sequence of events that's held in an event hub. Partitions are a means of data organization associated with the parallelism required by event consumers. Azure Event Hubs provides message streaming through a partitioned consumer pattern in which each consumer only reads a specific subset, or partition, of the message stream. As newer events arrive, they're added to the end of this sequence. The number of partitions is specified at the time an event hub is created and can't be changed.
- A **consumer group** is a view of an entire event hub. Consumer groups enable multiple consuming applications to each have a separate view of the event stream, and to read the stream independently at their own pace and from their own position.  There can be at most 5 concurrent readers on a partition per consumer group. However, we recommend that there's only one active consumer for a given partition and consumer group pairing. Each active reader receives all of the events from its partition. If there are multiple readers on the same partition, then they'll receive duplicate events. 

    For more concepts and deeper discussion, see [Event Hubs Features](event-hubs-features.md).

### Client lifetime
Each of the Event Hubs client types is safe to cache and use as a singleton for the lifetime of the application, which is a best practice when events are being published or read regularly. The clients are responsible for efficient management of network, CPU, and memory use, working to keep usage low during periods of inactivity.  Calling either `CloseAsync` or `DisposeAsync` on a client is required to ensure that network resources and other unmanaged objects are properly cleaned up.

### Thread safety
We guarantee that all client instance methods are thread-safe and independent of each other ([guideline](https://azure.github.io/azure-sdk/dotnet_introduction.html#dotnet-service-methods-thread-safety)). It ensures that the recommendation of reusing client instances is always safe, even across threads.

## Examples

### Inspect an event hub
Many Event Hubs operations take place within the scope of a specific partition.  Because partitions are owned by an event hub (an Event Hubs instance), their names are assigned at the time of creation. To understand what partitions are available, you query the event hub using one of the Event Hubs clients.  For illustration, the `EventHubProducerClient` is demonstrated in these examples, but the concept and form are common across clients.

```csharp
var connectionString = "<< CONNECTION STRING FOR THE EVENT HUBS NAMESPACE >>";
var eventHubName = "<< NAME OF THE EVENT HUB >>";

await using (var producer = new EventHubProducerClient(connectionString, eventHubName))
{
    string[] partitionIds = await producer.GetPartitionIdsAsync();
}
```

### Publish events to an event hub
To publish events, you'll need to create an `EventHubProducerClient`. Producers publish events in batches and may request a specific partition, or allow the Event Hubs service to decide which partition the events should be published to. We recommend that you use automatic routing when the publishing of events that need to be highly available or when event data should be distributed evenly among partitions. The following example takes advantage of automatic routing.

```csharp
var connectionString = "<< CONNECTION STRING FOR THE EVENT HUBS NAMESPACE >>";
var eventHubName = "<< NAME OF THE EVENT HUB >>";

await using (var producer = new EventHubProducerClient(connectionString, eventHubName))
{
    using EventDataBatch eventBatch = await producer.CreateBatchAsync();
    eventBatch.TryAdd(new EventData(new BinaryData("First")));
    eventBatch.TryAdd(new EventData(new BinaryData("Second")));

    await producer.SendAsync(eventBatch);
}
```

### Read events from an event hub
To read events from an event hub, you'll need to create an `EventHubConsumerClient` for a given consumer group. When an event hub is created, it provides a default consumer group.  The example in this section focuses on reading all events that have been published to the event hub using an iterator.

> [!NOTE]
> It's important to note that this approach to consuming is intended to improve the experience of exploring the Event Hubs client library and prototyping. We recommend that you don't use this approach in production scenarios.  For production use, we recommend using the [Event Processor Client](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/eventhub/Azure.Messaging.EventHubs.Processor), as it provides a more robust and performant experience.

```csharp
var connectionString = "<< CONNECTION STRING FOR THE EVENT HUBS NAMESPACE >>";
var eventHubName = "<< NAME OF THE EVENT HUB >>";

string consumerGroup = EventHubConsumerClient.DefaultConsumerGroupName;

await using (var consumer = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName))
{
    using var cancellationSource = new CancellationTokenSource();
    cancellationSource.CancelAfter(TimeSpan.FromSeconds(45));

    await foreach (PartitionEvent receivedEvent in consumer.ReadEventsAsync(cancellationSource.Token))
    {
        // At this point, the loop will wait for events to be available in the event hub. When an event
        // is available, the loop will iterate with the event that was received. Because we did not
        // specify a maximum wait time, the loop will wait forever unless cancellation is requested using
        // the cancellation token.
    }
}
```

### Read events from a partition
To read events from a partition, you'll need to create an `EventHubConsumerClient` for a given consumer group. When an event hub is created, it provides a default consumer group. To read from a specific partition, the consumer will also need to specify where in the event stream to begin receiving events. The following example focuses on reading all published events for the first partition of the event hub.

```csharp
var connectionString = "<< CONNECTION STRING FOR THE EVENT HUBS NAMESPACE >>";
var eventHubName = "<< NAME OF THE EVENT HUB >>";

string consumerGroup = EventHubConsumerClient.DefaultConsumerGroupName;

await using (var consumer = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName))
{
    EventPosition startingPosition = EventPosition.Earliest;
    string partitionId = (await consumer.GetPartitionIdsAsync()).First();

    using var cancellationSource = new CancellationTokenSource();
    cancellationSource.CancelAfter(TimeSpan.FromSeconds(45));

    await foreach (PartitionEvent receivedEvent in consumer.ReadEventsFromPartitionAsync(partitionId, startingPosition, cancellationSource.Token))
    {
        // At this point, the loop will wait for events to be available in the partition.  When an event
        // is available, the loop will iterate with the event that was received.  Because we did not
        // specify a maximum wait time, the loop will wait forever unless cancellation is requested using
        // the cancellation token.
    }
}
```

### Process events using an event processor client
For most production scenarios, we recommend that you use the [Event Processor Client](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/eventhub/Azure.Messaging.EventHubs.Processor) for reading and processing events. The processor is intended to provide a robust experience for processing events across all partitions of an event hub in a performant and fault tolerant manner while providing a means to persist its state. Event processor clients are also capable of working cooperatively within the context of a consumer group for a given event hub, where they'll automatically manage distribution and balancing of work as instances become available or unavailable for the group.

Since the `EventProcessorClient` has a dependency on Azure Storage blobs for persistence of its state, you'll need to provide a `BlobContainerClient` for the processor, which has been configured for the storage account and container that should be used.

```csharp
var cancellationSource = new CancellationTokenSource();
cancellationSource.CancelAfter(TimeSpan.FromSeconds(45));

var storageConnectionString = "<< CONNECTION STRING FOR THE STORAGE ACCOUNT >>";
var blobContainerName = "<< NAME OF THE BLOB CONTAINER >>";

var eventHubsConnectionString = "<< CONNECTION STRING FOR THE EVENT HUBS NAMESPACE >>";
var eventHubName = "<< NAME OF THE EVENT HUB >>";
var consumerGroup = "<< NAME OF THE EVENT HUB CONSUMER GROUP >>";

Task processEventHandler(ProcessEventArgs eventArgs) => Task.CompletedTask;
Task processErrorHandler(ProcessErrorEventArgs eventArgs) => Task.CompletedTask;

var storageClient = new BlobContainerClient(storageConnectionString, blobContainerName);
var processor = new EventProcessorClient(storageClient, consumerGroup, eventHubsConnectionString, eventHubName);

processor.ProcessEventAsync += processEventHandler;
processor.ProcessErrorAsync += processErrorHandler;

await processor.StartProcessingAsync();

try
{
    // The processor performs its work in the background; block until cancellation
    // to allow processing to take place.

    await Task.Delay(Timeout.Infinite, cancellationSource.Token);
}
catch (TaskCanceledException)
{
    // This is expected when the delay is canceled.
}

try
{
    await processor.StopProcessingAsync();
}
finally
{
    // To prevent leaks, the handlers should be removed when processing is complete.

    processor.ProcessEventAsync -= processEventHandler;
    processor.ProcessErrorAsync -= processErrorHandler;
}
```

You can find more details in the Event Processor Client [README](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/eventhub/Azure.Messaging.EventHubs.Processor/README.md) and the accompanying [samples](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/eventhub/Azure.Messaging.EventHubs.Processor/samples).

### Use an Active Directory principal with Event Hubs clients
The [Azure Identity library](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/identity/Azure.Identity/README.md) provides Azure Active Directory authentication support, which can be used for the Azure client libraries, including Event Hubs.

To make use of an Active Directory principal, one of the available credentials from the `Azure.Identity` library is specified when creating the Event Hubs client.  In addition, the fully qualified Event Hubs namespace and the name of desired event hub are supplied in lieu of the Event Hubs connection string. For illustration, the `EventHubProducerClient` is demonstrated in these examples, but the concept and form are common across clients.

```csharp
var fullyQualifiedNamespace = "<< FULLY-QUALIFIED EVENT HUBS NAMESPACE (like myeventhub.servicebus.windows.net) >>";
var eventHubName = "<< NAME OF THE EVENT HUB >>";
var credential = new DefaultAzureCredential();

await using (var producer = new EventHubProducerClient(fullyQualifiedNamespace, eventHubName, credential))
{
    using EventDataBatch eventBatch = await producer.CreateBatchAsync();
    eventBatch.TryAdd(new EventData(new BinaryData("First")));
    eventBatch.TryAdd(new EventData(new BinaryData("Second")));

    await producer.SendAsync(eventBatch);
}
```

When you use Azure Active Directory, your principal must be assigned a role, which allows access to an event hub, such as the `Azure Event Hubs Data Owner` role. For more information about using Azure Active Directory authorization with Event Hubs, see [Authenticate with Azure Active Directory](authorize-access-azure-active-directory.md).

## Troubleshoot

For detailed troubleshooting information, see [Event Hubs troubleshooting guide](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/eventhub/Azure.Messaging.EventHubs/TROUBLESHOOTING.md).

### Logging and diagnostics
The Event Hubs client library is fully instrumented for logging information at various levels of detail using the .NET `EventSource` to emit information. Logging is performed for each operation and follows the pattern of marking the starting point of the operation, its completion, and any exceptions encountered.  Additional information that may offer insight is also logged in the context of the associated operation.

The Event Hubs client logs are available to any `EventListener` by opting into the source named `Azure-Messaging-EventHubs` or opting into all sources that have the trait `AzureEventSource`.  To make capturing logs from the Azure client libraries easier, the `Azure.Core` library used by Event Hubs offers an `AzureEventSourceListener`. More information can be found in [Capturing Event Hubs logs using the AzureEventSourceListener](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/eventhub/Azure.Messaging.EventHubs/samples/Sample10_AzureEventSourceListener.md).

The Event Hubs client library is also instrumented for distributed tracing using Application Insights or OpenTelemetry.  More information can be found in the [Azure.Core Diagnostics sample](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/samples/Diagnostics.md#distributed-tracing).

## Next steps
See the following samples (in the order of complexity).

- [Hello world](hello-world-publish-receive-events.md)  
  An introduction to Event Hubs, illustrating the basic flow of events through an event hub, with the goal of quickly allowing you to view events being published and read from the Event Hubs service.  
  
- [Event Hubs Clients](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/eventhub/Azure.Messaging.EventHubs/samples/Sample02_EventHubsClients.md)  
  An overview of the Event Hubs clients, detailing the available client types, the scenarios they serve, and demonstrating options for customizing their configuration, such as specifying a proxy.  

- [Event Hubs Metadata](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/eventhub/Azure.Messaging.EventHubs/samples/Sample03_EventHubMetadata.md)  
  A discussion of the metadata available for an Event Hubs instance and demonstration of how to query and inspect the information.  
  
- [Publishing Events](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/eventhub/Azure.Messaging.EventHubs/samples/Sample04_PublishingEvents.md)  
  A deep dive into publishing events using the Event Hubs client library, detailing the different options available and illustrating common scenarios.  
  
- [Reading Events](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/eventhub/Azure.Messaging.EventHubs/samples/Sample05_ReadingEvents.md)  
  A deep dive into reading events using the Event Hubs client library, detailing the different options available and illustrating common scenarios.  
  
- [Identity and Shared Access Credentials](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/eventhub/Azure.Messaging.EventHubs/samples/Sample06_IdentityAndSharedAccessCredentials.md)  
  A discussion of the different types of authorization supported, focusing on identity-based credentials for Azure Active Directory and use of shared access signatures and keys.  
  
- [Earlier Language Versions](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/eventhub/Azure.Messaging.EventHubs/samples/Sample07_EarlierLanguageVersions.md)  
  A demonstration of how to interact with the client library using earlier versions of C#, where newer syntax for asynchronous enumeration and disposal isn't available.

- [Create a Custom Event Processor using EventProcessor&lt;TPartition&gt;](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/eventhub/Azure.Messaging.EventHubs/samples/Sample08_CustomEventProcessor.md)  
  An introduction to the `EventProcessor<TPartition>` base class, which is used when building advanced processors, which need full control over state management.

- [Observable Event Data Batch](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/eventhub/Azure.Messaging.EventHubs/samples/Sample09_ObservableEventBatch.md)  
  A demonstration of how to write an `ObservableEventDataBatch` class that wraps an `EventDataBatch` in order to allow an application to read events that have been added to a batch.

- [Capturing Event Hubs logs using AzureEventSourceListener class](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/eventhub/Azure.Messaging.EventHubs/samples/Sample10_AzureEventSourceListener.md)  
  A demonstration of how to use the [`AzureEventSourceListener`](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/core/Azure.Core/samples/Diagnostics.md#logging) from the `Azure.Core` package to capture logs emitted by the Event Hubs client library.

## Next steps
See the following quickstarts and samples. 

- Quickstarts: [.NET](event-hubs-dotnet-standard-getstarted-send.md), [Java](event-hubs-java-get-started-send.md), [Python](event-hubs-python-get-started-send.md), [JavaScript](event-hubs-node-get-started-send.md)
- Samples on GitHub: [.NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/eventhub/Azure.Messaging.EventHubs/samples), [Java](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/eventhubs/azure-messaging-eventhubs/src/samples), [Python](https://github.com/Azure/azure-sdk-for-python/blob/azure-eventhub_5.3.1/sdk/eventhub/azure-eventhub/samples), [JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/eventhub/event-hubs/samples/v5/javascript), [TypeScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/eventhub/event-hubs/samples/v5/typescript)
