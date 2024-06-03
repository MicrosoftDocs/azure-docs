---
title: Send and receive events by using Azure Event Hubs Data Generator
description: This quickstart helps you send and receive events to Azure Event Hubs by using Data Generator.
author:      Saglodha # GitHub alias
ms.author:   saglodha # Microsoft alias
ms.service:  event-hubs
ms.topic:    quickstart
ms.date:     05/22/2023
---

# Quickstart: Send and receive events by using Azure Event Hubs Data Generator

In this quickstart, you learn how to send and receive events by using Azure Event Hubs Data Generator.

### Prerequisites

If you're new to Event Hubs, see the [Event Hubs overview](event-hubs-about.md) before you go through this quickstart.

To complete this quickstart, you need the following prerequisites:

- Azure subscription. To use Azure services, including Event Hubs, you need a subscription. If you don't have an existing Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Event Hubs namespace and an event hub. The first step is to use the Azure portal to create an Event Hubs namespace and an event hub in the namespace. To create a namespace and an event hub, see [Quickstart: Create an event hub by using the Azure portal](event-hubs-create.md).

> [!NOTE]
> Data Generator for Azure Event Hubs is in public preview.

## Send events by using Event Hubs Data Generator

To send events to Event Hubs Data Generator:

1. On the **Event Hubs Namespace** page, select **Generate data** in the **Overview** section on the leftmost menu.

   :::image type="content" source="media/send-and-receive-events-using-data-generator/Highlighted-final-overview-namespace.png" alt-text="Screenshot that shows the Overview page for the event hub namespace.":::

1. On the **Generate data** page, you see the properties for data generation:

   1. **Select Event Hub**: Because you're sending data to an event hub, use the dropdown to send the data into the event hubs of your choice. If there's no event hub created within event hubs namespaces, use **Create Event Hubs** to [create a new event hub](event-hubs-create.md) within the namespace and stream data after you create the event hub.  
   1. **Select Payload**: You can send custom payload to event hubs by using user-defined payload. You can also make use of different precanned datasets available in Data Generator.
   1. **Select Content-Type**: Based on the type of data you're sending, select the **Content-Type** option. As of today, Data Generator supports sending data in the JSON, XML, Text, and Binary content types.
   1. **Repeat Send**: To send the same payload as multiple events, enter the number of repeat events that you want to send. **Repeat Send** supports sending up to 100 repetitions.
   1. **Authentication Type**: Under **Settings**, you can choose from two different authentication types: Shared Access key or Microsoft Entra ID. Make sure that you have Azure Event Hubs Data owner permission before you use Microsoft Entra ID.
   
   :::image type="content" source="media/send-and-receive-events-using-data-generator/highlighted-data-generator-landing.png" alt-text="Screenshot that shows the landing page for Data Generator.":::

> [!TIP]
> For user-defined payload, the content under the **Enter payload** section is treated as a single event. The number of events sent is equal to the value of **Repeat Send**.
>
> Pre-canned datasets are collections of events. For precanned datasets, each event in the dataset is sent separately. For example, if the dataset has 20 events and the value of **Repeat Send** is 10, then 200 events are sent to the event hub.

### Maximum message size support with different tiers

You can send data until you reach the permitted payload size with Data Generator. The following table lists the maximum message/payload size that you can send with Data Generator.

Tier 				|	 Basic    | 	Standard | Premium | Dedicated
--------------------|-------------|--------------|---------|----------|
Maximum payload size| 	256 Kb		| 	1 MB 	     | 1 MB     | 1 MB 

## View events by using Event Hubs Data Generator

> [!IMPORTANT]
> **View Events** is meant to act like a magnifying glass to the stream of events that you send. The tabular section under **View Events** lets you glance at the last 15 events that were sent to Event Hubs. If the event content is in a format that can't be loaded, **View Events** shows metadata for the event.

When you select **Send**, Data Generator sends the events to the event hubs of your choice. A new collapsible **View Events** window loads automatically. You can expand any tabular row to review the event content sent to event hubs.

:::image type="content" source="media/send-and-receive-events-using-data-generator/view-events-window.png" alt-text="Screenshot that shows the Event Hubs Data Generator UI showcasing View Events." lightbox="media/send-and-receive-events-using-data-generator/view-events-window.png":::

## Frequently asked questions

This section has answers to common questions.

#### I get the error "Oops! We couldn't read events from Event Hubs -`<your event hub name>`. Please make sure that there is no active consumer reading events from $Default Consumer group."

   Data Generator makes use of `$Default` [consumer group](event-hubs-features.md) to view events that were sent to event hubs. To start receiving events from event hubs, a receiver needs to connect to the consumer group and take ownership of the underlying partition. If a consumer is already reading from the `$Default` consumer group, Data Generator can't establish a connection and view events. If you have an active consumer silently listening to the events and checkpointing them, Data Generator can't find any events in the event hub. Disconnect any active consumer reading from the `$Default` consumer group and try again.

#### I see more events in the View Events section than the ones I sent by using Data Generator. Where are those events coming from?

   Multiple applications can connect to event hubs at the same time. If multiple applications send data to event hubs alongside Data Generator, the **View Events** section also shows events sent by other clients. At any instance, you can read the last 15 events that were sent to Event Hubs.

## Related content

- [Send and receive events by using Event Hubs SDKs (AMQP)](event-hubs-dotnet-standard-getstarted-send.md)
- [Send and receive events by using Apache Kafka](event-hubs-quickstart-kafka-enabled-event-hubs.md)
