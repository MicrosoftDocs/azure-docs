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

## Common samples

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
