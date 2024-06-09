---
title: Send and receive events using Data Generator. 
description: This quickstart shows you how to send and receive events to an Azure event hub using Data generator in the Azure portal.
author:      Saglodha # GitHub alias
ms.author:   saglodha # Microsoft alias
ms.service:  event-hubs
ms.topic:    quickstart
ms.date:     06/07/2024
#customer intent: As a developer, I want to send test events to an event hub in Azure Event Hubs and receive or view them.
---

# QuickStart: Send and receive events using Azure Event Hubs Data Generator
In this QuickStart, you learn how to send and receive Events using Azure Event Hubs Data Generator.  

## Prerequisites

If you're new to Azure Event Hubs, see the [Event Hubs overview](event-hubs-about.md) before you go through this QuickStart. 

To complete this QuickStart, you need the following prerequisites: 

- Azure subscription. To use Azure services, including Azure Event Hubs, you need a subscription. If you don't have an existing Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- Create an Event Hubs namespace and an event hub using instructions from [QuickStart: Create an event hub using Azure portal](event-hubs-create.md). 
- If the event hub is in a virtual network, you need to access the portal from a virtual machine (VM) in the same virtual network. The data generator doesn't work with private endpoints with public access blocked unless you access the portal from the subnet of the virtual network for which the private endpoint is configured.

> [!NOTE]
> Data Generator for Azure Event Hubs is in preview.

## Send events using Event Hubs Data Generator

You could follow these steps to send events to Azure Event Hubs Data Generator: 

1. On the **Event Hubs Namespace** page, select **Generate data** in the **Overview** section on the left navigation menu.

   :::image type="content" source="media/send-and-receive-events-using-data-generator/generate-data-menu.png" alt-text="Screenshot that shows the Generate data (preview) menu on an Event Hubs Namespace page." lightbox="media/send-and-receive-events-using-data-generator/generate-data-menu.png":::
2. On the **Generate Data** page, follow these steps:
   1. For the **Select event hub** field, use the dropdown list to send the data to an event hub in the namespace. 
   1. For the **Select dataset** field, select a precanned dataset such as **Weather data** and **Clickstream data** or select **Custom payload** option and specify your own payload.  
   1. If you select **Custom payload**, for the **Select Content-Type** field, choose the type of the content in the event data. Currently, Data generator supports sending data in following content types: JSON, XML, Text, and Binary. 
   1. For the **Repeat send** field, enter the number of times you want to send the sample dataset to the event hub. The maximum allowed value is 100. 
   
       :::image type="content" source="media/send-and-receive-events-using-data-generator/highlighted-data-generator-landing.png" alt-text="Screenshot displaying landing page for data generator." lightbox="media/send-and-receive-events-using-data-generator/highlighted-data-generator-landing.png":::

> [!TIP]
> For custom payload, the content in the **Enter payload** section is treated as a single event. The number of events sent is equal to the value of repeat send. 
> 
> Pre-canned datasets are collection of events. For pre-canned datasets, each event in the dataset is sent separately. For example, if the dataset has 50 events and the value of repeat send is 10, then 500 events are sent to the event hub.

### Maximum message size support with different tiers
The following table shows the maximum payload size that you can send to an event hub using the Data Generator.

| Tier | Basic | Standard | Premium | Dedicated |
|--|--|--|--|--|
| Maximum Payload Size| 256 Kb | 1 MB | 1 MB | 1 MB |

## View events using Event Hubs Data Generator

> [!IMPORTANT]
> Viewing events is meant to act like a magnifying glass to the stream of events that you sent. The tabular section in the **View events** section lets you glance at the last 15 events that have been sent to the event hub. If the event content is in format that cannot be loaded, ther **View events** section shows metadata for the event.

As soon as you select **Send**, data generator sends events to the selected event hub and the collapsible **View events** section loads automatically. Expand any tabular row to review the event content sent to event hubs. 

:::image type="content" source="media/send-and-receive-events-using-data-generator/view-events-window.png" alt-text="Screenshot for event hub data generator UI showcasing View events." lightbox="media/send-and-receive-events-using-data-generator/view-events-window.png":::

## Frequently asked questions

- **I am getting the error “Oops! We couldn't read events from the event hub -`<your event hub name>`. Please make sure that there is no active consumer reading events from $Default Consumer group**”


   Data generator makes use of `$Default` [consumer group](event-hubs-features.md) to view events that were sent to the event hub. To start receiving events from event hubs, a receiver needs to connect to consumer group and take ownership of the underlying partition. If there's already a consumer reading from `$Default` consumer group, the data generator wouldn’t be able to establish a connection and view events. Additionally, If you have an active consumer silently listening to the events and checkpointing them, the data generator wouldn't find any events in the event hub. Disconnect any active consumer reading from `$Default` consumer group and try again. 

- **I am observing additional events in the View events section from the ones I had sent using Data Generator. Where are those events coming from?**

   Multiple applications can connect to event hubs at the same time. If there are multiple applications sending data to event hubs alongside data generator, view events section also shows events sent by other clients. At any instance, the view events section lets you view the last 15 events that were sent to Azure Event Hubs.

## Related content

- [Send and Receive events using Event Hubs SDKs(AMQP)](event-hubs-dotnet-standard-getstarted-send.md)
- [Send and Receive events using Apache Kafka](event-hubs-quickstart-kafka-enabled-event-hubs.md)
