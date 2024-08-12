---
title: Send and receive events by using Data Generator
description: This quickstart shows you how to send and receive events to an Azure event hub by using Data Generator in the Azure portal.
author:      Saglodha # GitHub alias
ms.author:   saglodha # Microsoft alias
ms.topic:    quickstart
ms.date:     06/07/2024
#customer intent: As a developer, I want to send test events to an event hub in Azure Event Hubs and receive or view them.
---

# Quickstart: Send and receive events by using Azure Event Hubs Data Generator

In this quickstart, you learn how to send and receive events by using Azure Event Hubs Data Generator.

## Prerequisites

If you're new to Event Hubs, see the [Event Hubs overview](event-hubs-about.md) before you go through this quickstart.

To complete this quickstart, you need the following prerequisites:

- Have an Azure subscription. To use Azure services, including Event Hubs, you need a subscription. If you don't have an existing Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Create an Event Hubs namespace and an event hub. Follow the instructions in [Quickstart: Create an event hub by using the Azure portal](event-hubs-create.md).
- If the event hub is in a virtual network, you need to access the portal from a virtual machine (VM) in the same virtual network. Data Generator doesn't work with private endpoints with public access blocked unless you access the portal from the subnet of the virtual network for which the private endpoint is configured.

> [!NOTE]
> Data Generator for Event Hubs is in preview.

## Send events by using Event Hubs Data Generator

To send events to an event hub by using Event Hubs Data Generator:

1. On the **Event Hubs Namespace** page, select **Generate data** in the **Overview** section on the leftmost menu.

   :::image type="content" source="media/send-and-receive-events-using-data-generator/generate-data-menu.png" alt-text="Screenshot that shows the Generate data (preview) menu on an Event Hubs Namespace page." lightbox="media/send-and-receive-events-using-data-generator/generate-data-menu.png":::

1. On the **Generate Data** page, follow these steps:
   1. For the **Select event hub** field, use the dropdown list to send the data to an event hub in the namespace.
   1. For the **Select dataset** field, select a precanned dataset, such as **Weather data** and **Clickstream data**. You can also select the **Custom payload** option and specify your own payload.  
   1. If you select **Custom payload**, for the **Select Content-Type** field, choose the type of the content in the event data. Currently, Data Generator supports sending data in the JSON, XML, Text, and Binary content types.
   1. For the **Repeat Send** field, enter the number of times you want to send the sample dataset to the event hub. The maximum allowed value is 100.

       :::image type="content" source="media/send-and-receive-events-using-data-generator/highlighted-data-generator-landing.png" alt-text="Screenshot that shows the landing page for Data Generator." lightbox="media/send-and-receive-events-using-data-generator/highlighted-data-generator-landing.png":::

> [!TIP]
> For custom payload, the content in the **Enter payload** section is treated as a single event. The number of events sent is equal to the value of **Repeat Send**.
>
> Precanned datasets are collections of events. For precanned datasets, each event in the dataset is sent separately. For example, if the dataset has 50 events and the value of **Repeat Send** is 10, then 500 events are sent to the event hub.

### Maximum message size support with different tiers

The following table shows the maximum payload size that you can send to an event hub by using Data Generator.

| Tier | Basic | Standard | Premium | Dedicated |
|--|--|--|--|--|
| Maximum payload size| 256 Kb | 1 MB | 1 MB | 1 MB |

## View events by using Event Hubs Data Generator

> [!IMPORTANT]
> Viewing events is meant to act like a magnifying glass to the stream of events that you sent. The tabular section in the **View Events** section lets you glance at the last 15 events that were sent to the event hub. If the event content is in a format that can't be loaded, the **View Events** section shows metadata for the event.

When you select **Send**, Data Generator sends events to the selected event hub and the collapsible **View events** section loads automatically. Expand any tabular row to review the event content sent to event hubs.

:::image type="content" source="media/send-and-receive-events-using-data-generator/view-events-window.png" alt-text="Screenshot that shows the Event Hubs Data Generator UI showcasing View Events." lightbox="media/send-and-receive-events-using-data-generator/view-events-window.png":::

## Frequently asked questions

This section answers common questions.

#### I am getting the error "Oops! We couldn't read events from the event hub - `<your event hub name>`. Please make sure that there is no active consumer reading events from $Default Consumer group."

   Data Generator makes use of the `$Default` [consumer group](event-hubs-features.md) to view events that were sent to the event hub. To start receiving events from event hubs, a receiver needs to connect to the consumer group and take ownership of the underlying partition. If there's already a consumer reading from the `$Default` consumer group, Data Generator can't establish a connection and view events. If you have an active consumer silently listening to the events and checkpointing them, Data Generator can't find any events in the event hub. Disconnect any active consumer reading from the `$Default` consumer group and try again.

#### I see more events in the View Events section than the ones I sent by using Data Generator. Where are those events coming from?

   Multiple applications can connect to event hubs at the same time. If there are multiple applications sending data to event hubs alongside Data Generator, the **View Events** section also shows events sent by other clients. At any instance, the **View Events** section lets you view the last 15 events that were sent to Event Hubs.

## Related content

- [Send and receive events by using Event Hubs SDKs (AMQP)](event-hubs-dotnet-standard-getstarted-send.md)
- [Send and receive events by using Apache Kafka](event-hubs-quickstart-kafka-enabled-event-hubs.md)
