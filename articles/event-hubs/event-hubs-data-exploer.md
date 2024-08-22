---
title: Overview of the Event Hubs Data Explorer
description: This article provides an overview of the Event Hubs Data Explorer, which provides an easy way to send data to and receive data from Azure Event Hubs.
ms.topic: article
ms.date: 08/22/2024
---

Azure Event Hubs is a scalable event processing service that ingests and processes large volumes of events and data, with low latency and high reliability. For a high-level overview of the service, see [What is Event Hubs?](event-hubs-about.md).

Developers and Operators are often looking for an easy tool to send sample data to their Event Hub to test the end-to-end flow, or view events at a specific offset (or point in time) for light debugging, often after the fact. The Event Hubs Data Explorer makes these common workflows simple by eliminating the need to write bespoke client applications to test and inspect the data on the event hub. 

This article highlights the functionality of Azure Event Hubs Data explorer, that is made available on the Azure portal.

Operations run on an Azure Event Hubs namespace are of two kinds.

  * Management Operations - Create, update, delete of Event Hubs namespace, and topics.
  * Data Operations - Send and view events from an event hub.

> [!IMPORTANT]
>  * The Event Hubs Data Explorer doesn't support **management operations**. The event hub must be created before the data explorer can send or view events from that event hub.
>  * While events payloads (known as **values** in Kafka) sent using the **Kafka protocol** will be visible via the data explorer, the **key** for the specific event will not be visible.
>  * We advice against using the Event Hubs Data Explorer for larger messages, as this may result in timeouts, depending on the message size, network latency between client and Service Bus service etc. Instead, we recommend that you use your own client to work with larger messages, where you can specify your own timeout values.
>

# Prerequisites

To use the Event Hubs Data Explorer tool, [create an Azure Event Hubs namespace and an event hub](event-hubs-create.md).

# Use the Event Hubs Data Explorer

To use 