---
title: Send and receive events using Azure Event Hubs Data Generator. 
description: This quickstart helps you send and receive events to Azure event hubs using Data generator.
author:      Saglodha # GitHub alias
ms.author:   saglodha # Microsoft alias
ms.service:  event-hubs
ms.topic:    quickstart
ms.date:     05/22/2023
---

# QuickStart: Send and receive events using Azure Event Hubs Data Generator

In this QuickStart, you learn how to Send and Receive Events using Azure Event Hubs Data Generator.  

### Prerequisites

If you're new to Azure Event Hubs, see the [Event Hubs overview](/azure/event-hubs/event-hubs-about) before you go through this QuickStart. 

To complete this QuickStart, you need the following prerequisites: 

- Microsoft Azure subscription. To use Azure services, including Azure Event Hubs, you need a subscription. If you don't have an existing Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) or use your MSDN subscriber benefits when you [create an account](https://azure.microsoft.com/). 

- Create Event Hubs namespace and an event hub. The first step is to use the Azure portal to create an Event Hubs namespace and an event hub in the namespace. To create a namespace and an event hub, see [QuickStart: Create an event hub using Azure portal. ](/azure/event-hubs/event-hubs-create)

> [!NOTE]
> Data Generator for Azure Event Hubs is in Public Preview.

## Send events using Event Hubs Data Generator

You could follow the steps below to send events to Azure Event Hubs Data Generator: 

1. Select Generate data blade under “Overview” section of Event Hubs namespace.

   :::image type="content" source="media/send-and-receive-events-using-data-generator/Highlighted-final-overview-namespace.png" alt-text="Screenshot displaying overview page for event hub namespace.":::

2. On Generate Data blade, you would find below properties for Data generation: 
   1. **Select Event Hub:** Since you would be sending data to event hub, you could use the dropdown to send the data into event hubs of your choice. If there is no event hub created within event hubs namespaces, you could use “create Event Hubs” to [create a new event hub](/azure/event-hubs/event-hubs-create) within namespace and stream data post creation of event hub.  
   2. **Select Payload:** You could send custom payload to event hubs using User defined payload or make use of different pre-canned datasets available in data generator. 
   3.  **Select Content-Type:** Based on the type of data you’re sending; you could choose the Content-type Option. As of today, Data generator supports sending data in following content-type - JSON, XML, Text and Binary. 
   4.  **Repeat send**:-If you want to send the same payload as multiple events, you can enter the number of repeat events that you wish to send. Repeat Send supports sending up to 100 repetitions.
   5.  **Authentication Type**: Under settings, you can choose from two different authentication type: Shared Access key or Microsoft Entra ID. Please make sure that you have Azure Event Hubs Data owner permission before using Microsoft Entra ID. 
   
   :::image type="content" source="media/send-and-receive-events-using-data-generator/highlighted-data-generator-landing.png" alt-text="Screenshot displaying landing page for data generator.":::

> [!TIP]
> For user defined payload, the content under the "Enter payload" section is treated as a single event The number of events sent is equal to the value of repeat send. 
> 
> Pre-canned datasets are collection of events. For pre-canned datasets, each event in the dataset is sent separately. For example, if the dataset has 20 events and the value of repeat send is 10, then 200 events are sent to the event hub.

### Maximum Message size support with different SKU

You could send data until the permitted payload size with Data Generator. Below table talks about maximum message/payload size that you could send with Data Generator.

SKU 				|	 Basic    | 	Standard | Premium | Dedicated
--------------------|-------------|--------------|---------|----------|
Maximum Payload Size| 	256 Kb		| 	1 MB 	     | 1 MB     | 1 MB 

## View events using Event Hubs Data Generator

> [!IMPORTANT]
> View Events is meant to act like a magnifying glass to the stream of events that you had sent. The tabular section under View events would let you glance at the last 15 events that have been sent to Azure Event hubs.If the event content is in format that cannot be loaded, View events would show metadata for the event.

As soon as you select send, data generator would take care of sending the events to event hubs of your choice and new collapsible “View Events” window would load automatically. You could expand any tabular row to review the event content sent to event hubs. 

:::image type="content" source="media/send-and-receive-events-using-data-generator/view-events-window.png" alt-text="Screenshot for event hub data generator UI showcasing View events." lightbox="media/send-and-receive-events-using-data-generator/view-events-window.png":::

## Frequently asked questions

- **I am getting the error “Oops! We couldn't read events from Event Hub -`<your event hub name>`. Please make sure that there is no active consumer reading events from $Default Consumer group**”


   Data generator makes use of $Default [consumer group](/azure/event-hubs/event-hubs-features) to view events that have been sent to Event hubs. To start receiving events from event hubs, a receiver needs to connect to consumer group and take ownership of the underlying partition. If in case, there is already a consumer reading from $Default consumer group, then Data generator wouldn’t be able to establish a connection and view events. Additionally, If you have an active consumer silently listening to the events and checkpointing them, then data generator wouldn't find any events in event hub. Please disconnect any active consumer reading from $Default consumer group and try again. 

- **I am observing additional events in the View events section from the ones I had sent using Data Generator. Where are those events coming from?**


   Multiple applications can connect to event hubs at the same time. If in case, there are multiple applications sending data to event hubs alongside Data generator, view events section would also show events sent by other clients. At any instance, view events would let you read last 15 events that have sent to Azure Event Hubs.

## Next Steps

[Send and Receive events using Event Hubs SDKs(AMQP)](/azure/event-hubs/event-hubs-dotnet-standard-getstarted-send?tabs=passwordless%2Croles-azure-portal)

[Send and Receive events using Apache Kafka](/azure/event-hubs/event-hubs-quickstart-kafka-enabled-event-hubs?tabs=passwordless)
