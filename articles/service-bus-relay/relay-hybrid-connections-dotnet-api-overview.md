---
title: Overview of the Azure Relay .NET Standard APIs | Microsoft Docs
description: .NET Standard API overview
services: service-bus-relay
documentationcenter: na
author: jtaubensee
manager: timlt
editor: ''

ms.assetid: b1da9ac1-811b-4df7-a22c-ccd013405c40
ms.service: service-bus-relay
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/07/2017
ms.author: jotaub
---

# Azure Relay Hybrid Connections .NET Standard API overview
This article summarizes some of the key Azure Relay Hybrid Connections .NET Standard client APIs. There are currently two .NET Standard client libraries:
* [Microsoft.Azure.Relay](/dotnet/api/microsoft.azure.relay)
  
## Event Hub client
[**EventHubClient**](/dotnet/api/microsoft.azure.eventhubs.eventhubclient) is the primary object you use to send events, create receivers, and to get runtime information. This client is linked to a particular Event Hub, and creates a new connection to the Event Hubs endpoint.

### Create an Event Hub client
An [**EventHubClient**](/dotnet/api/microsoft.azure.eventhubs.eventhubclient) object is created from a connection string. The simplest way to instantiate a new client is shown in the following example:

```csharp
var eventHubClient = EventHubClient.CreateFromConnectionString("{Event Hub connection string}");
```

To programmatically edit the connection string, you can use the [**EventHubsConnectionStringBuilder**](/dotnet/api/microsoft.azure.eventhubs.eventhubsconnectionstringbuilder) class, and pass the connection string as a parameter to [**EventHubClient.CreateFromConnectionString**](/dotnet/api/microsoft.azure.eventhubs.eventhubclient#Microsoft_Azure_EventHubs_EventHubClient_CreateFromConnectionString_System_String_).

```csharp
var connectionStringBuilder = new EventHubsConnectionStringBuilder("{Event Hub connection string}")
{
    EntityPath = EhEntityPath
};

var eventHubClient = EventHubClient.CreateFromConnectionString(connectionStringBuilder.ToString());
```

### Send events
To send events to an Event Hub, use the [**EventData**](/dotnet/api/microsoft.azure.eventhubs.eventdata) class. The body must be a `byte` array, or a `byte` array segment.

```csharp
// Create a new EventData object by encoding a string as a byte array
var data = new EventData(Encoding.UTF8.GetBytes("This is my message..."));
// Set user properties if needed
data.Properties.Add("Type", "Informational");
// Send single message async
await eventHubClient.SendAsync(data);
```

### Receive events
The recommended way to receive events from Event Hubs is using the [**EventProcessorHost**](##Event-Processor-Host-APIs), which provides functionality to automatically keep track of offset, and partition information. However, there are certain situations in which you may want to use the flexibility of the core Event Hubs library to receive events.

#### Create a receiver
Receivers are tied to specific partitions, so in order to receive all events in an Event Hub, you will need to create multiple instances. Generally speaking, it is a good practice to get the partition information programatically, rather than hard-coding the partition ids. In order to do so, you can use the [**GetRuntimeInformationAsync**](/dotnet/api/microsoft.azure.eventhubs.eventhubclient#Microsoft_Azure_EventHubs_EventHubClient_GetRuntimeInformationAsync) method.

```csharp

// Create a list to keep track of the receivers
var receivers = new List<PartitionReceiver>();
// Use the eventHubClient created above to get the runtime information
var runTimeInformation = await eventHubClient.GetRuntimeInformationAsync();
// Loop over the resulting partition ids
foreach (var partitionId in runTimeInformation.PartitionIds)
{
    // Create the receiver
    var receiver = eventHubClient.CreateReceiver(PartitionReceiver.DefaultConsumerGroupName, partitionId, PartitionReceiver.EndOfStream);
    // Add the receiver to the list
    receivers.Add(receiver);
}
```

Since events are never removed from an Event Hub (and only expire), you will need to specify the proper starting point. The following example shows possible combinations.

```csharp
// partitionId is assumed to come from GetRuntimeInformationAsync()

// Using the constant 'PartitionReceiver.EndOfStream' will only receive all messages from this point forward.
var receiver = eventHubClient.CreateReceiver(PartitionReceiver.DefaultConsumerGroupName, partitionId, PartitionReceiver.EndOfStream);

// All messages available
var receiver = eventHubClient.CreateReceiver(PartitionReceiver.DefaultConsumerGroupName, partitionId, "-1");

// From one day ago
var receiver = eventHubClient.CreateReceiver(PartitionReceiver.DefaultConsumerGroupName, partitionId, DateTime.Now.AddDays(-1));
```

#### Consume an event
```csharp
// Receive a maximum of 100 messages in this call to ReceiveAsync
var ehEvents = await receiver.ReceiveAsync(100);
// ReceiveAsync can return null if there are no messages
if (ehEvents != null)
{
    // Since ReceiveAsync can return more than a single event you will need a loop to process
    foreach (var ehEvent in ehEvents)
    {
        // Decode the byte array segment
        var message = UnicodeEncoding.UTF8.GetString(ehEvent.Body.Array);
        // Load the custom property that we set in the send example
        var customType = ehEvent.Properties["Type"];
        // Implement processing logic here
    }
}		
```

## Next steps
To learn more about Event Hubs scenarios, visit these links:

* [What is Azure Event Hubs?](event-hubs-what-is-event-hubs.md)
* [Available Event Hubs apis](event-hubs-api-overview.md)

The .NET API references are here:

* [Microsoft.Azure.EventHubs](/dotnet/api/microsoft.azure.eventhubs)
* [Microsoft.Azure.EventHubs.Processor](/dotnet/api/microsoft.azure.eventhubs.processor)