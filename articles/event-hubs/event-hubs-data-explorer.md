---
title: Overview of the Event Hubs Data Explorer
description: This article provides an overview of the Event Hubs Data Explorer, which provides an easy way to send data to and receive data from Azure Event Hubs.
ms.topic: article
ms.date: 11/18/2024
---

# Use Event Hubs Data Explorer to run data operations on Event Hubs

Azure Event Hubs is a scalable event processing service that ingests and processes large volumes of events and data, with low latency and high reliability. For a high-level overview of the service, see [What is Event Hubs?](event-hubs-about.md).

Developers and Operators are often looking for an easy tool to send sample data to their event hub to test the end-to-end flow, or view events at a specific offset (or point in time) for light debugging, often after the fact. The Event Hubs Data Explorer makes these common workflows simple by eliminating the need to write bespoke client applications to test and inspect the data on the event hub. 

This article highlights the functionality of Azure Event Hubs Data explorer that is made available on the Azure portal.

Operations run on an Azure Event Hubs namespace are of two kinds.

  * Management Operations - Create, update, delete of Event Hubs namespace, and event hubs.
  * Data Operations - Send and view events from an event hub.

> [!IMPORTANT]
>  * The Event Hubs Data Explorer doesn't support **management operations**. The event hub must be created before the data explorer can send or view events from that event hub.
>  * While events payloads (known as **values** in Kafka) sent using the **Kafka protocol** will be visible via the data explorer, the **key** for the specific event will not be visible.
>  * We advise against using the Event Hubs Data Explorer for larger messages, as this may result in timeouts, depending on the message size, network latency between client and Service Bus service etc. Instead, we recommend that you use your own client to work with larger messages, where you can specify your own timeout values.
>  * The operations that a user can perform using Event Hubs Data Explorer is determined by the [role-based access control (RBAC)](authorize-access-azure-active-directory.md#azure-built-in-roles-for-azure-event-hubs) role that the user is assigned to. 

## Prerequisites

To use the Event Hubs Data Explorer tool, [create an Azure Event Hubs namespace and an event hub](event-hubs-create.md).

## Use the Event Hubs Data Explorer

To use the Event Hubs data explorer, navigate to the Event Hubs namespace on which you want to perform the data operations.

Either navigate to the `Data Explorer` directly where you can pick the event hub, or pick the event hub from the `entities` and then pick the `Data Explorer` from the navigation menu.

:::image type="content" source="./media/event-hubs-data-explorer/left-pane-nav.png" alt-text="Screenshot showing the left pane nav with 'Data Explorer' selected.":::

### Send Events

You can send either custom payloads, or precanned datasets to the selected event hub using the `Send events` experience.

To do so, select the `send events` button, which enables the right pane.

:::image type="content" source="./media/event-hubs-data-explorer/select-send-events.png" alt-text="Screenshot showing the data explorer pane with 'Send events' selected.":::


#### Sending custom payload

To send a custom payload - 
1. **Select Dataset** - Pick `Custom payload`.
2. Select the **Content-Type**, from either `Text/Plain`, `JSON`, or `XML`.
3. Either upload a JSON file, or type out the payload in the **Enter payload** box.
4. **[Optional]** Specify system properties.
5. **[Optional]** Specify custom properties - available as key-value pair.
6. **[Optional]** If you wish to send multiple payloads, check the **Repeat send** box, and specify the **Repeat send count** (that is, the number of payloads to send) and the **Interval between repeat send in ms**.

Once the payload details are defined, select **Send** to send the event payload as defined.

:::image type="content" source="./media/event-hubs-data-explorer/send-event.png" alt-text="Screenshot showing the send event experience for custom payload.":::


#### Sending precanned dataset

To send event payloads from a precanned dataset -
1. **Select Dataset** - Pick an option from the **Pre canned datasets**, for example, Yellow taxi, Weather data, and others.
2. **[Optional]** Specify system properties.
3. **[Optional]** Specify custom properties - available as key-value pairs.
4. **[Optional]** If you wish to send multiple payloads, check the **Repeat send** box, and specify the **Repeat send count** (that is, the number of payloads to send) and the **Interval between repeat send in ms**.

Once the payload details are defined, select **Send** to send the event payload as defined.

:::image type="content" source="./media/event-hubs-data-explorer/send-pre-canned-payload.png" alt-text="Screenshot showing the send event experience for precanned payload.":::


### View Events

Event Hubs data explorer enables viewing the events to inspect the data that fit the criteria.

To view events, you can define the below properties, or rely on the default -

:::image type="content" source="./media/event-hubs-data-explorer/view-event-menu.png" alt-text="Screenshot showing the data explorer menu with view events selected.":::


1. **PartitionID** - Pick either a specific partition or select *All partition IDs*.
2. **Consumer Group** - Pick the *$Default* or another consumer group, or create one on the fly.
3. **Event position** - Pick the *oldest position* (that is, the start of the event hub), *Newest position* (that is, latest), *Custom position* (for a specific offset, sequence number or timestamp).
4. **Advanced properties** - Specify the *maximum batch size* and *maximum wait time in seconds*.

Once the above options are set, select **View events** to pull the events and render them on the data explorer.

:::image type="content" source="./media/event-hubs-data-explorer/grid-of-events.png" alt-text="Screenshot showing the grid of events.":::


Once the events are loaded, you can select **View next events** to pull events using the same query again, or **Clear all** to refresh the grid.

### Download event payload

When viewing the events on a given event hub, the event payload can be downloaded for further review.

To download the event payload, select the specific event and select the **download** button displayed above the event payload body.

:::image type="content" source="./media/event-hubs-data-explorer/download-event-body.png" alt-text="Screenshot showing the grid of events with selected event and highlighted download event button.":::


## Next steps

  * Learn more about [Event Hubs](event-hubs-about.md).
  * Check out [Event Hubs features and terminology](event-hubs-features.md)
