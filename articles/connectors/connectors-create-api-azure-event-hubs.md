---
title: Connect from Workflows to Azure Event Hubs
description: Learn how to connect to your event hub and then add an Azure Event Hubs trigger or action to your workflow in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/05/2025
ms.custom: sfi-image-nochange
#customer intent: As an integration developer, I want to connect my logic app workflows to Azure Event Hubs so I can automate tasks that monitor and manage events in my event hub.
---

# Connect workflows to event hubs in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To automate tasks that monitor and manage events in an event hub from within your workflow in Azure Logic Apps, use the Azure **Event Hubs** connector operations. For example, your workflow can check, send, and receive events from your event hub.

This article shows how to connect to your event hub by adding an **Event Hubs** trigger or action to your workflow.

## Connector reference

For information about this connector's operations, their parameters, and other technical information, such as limits, known issues, and so on, see the [Event Hubs connector's reference page](/connectors/eventhubs/).

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- An [Event Hubs namespace and event hub](../event-hubs/event-hubs-create.md).

  Make sure to check that your workflow can access your event hub. To complete this task, follow these steps:

  1. In the [Azure portal](https://portal.azure.com), go to your Event Hubs *namespace*, not a specific event hub.

  1. On the namespace menu, under **Settings**, select **Shared access policies**. In the **Claims** column, check that you have at least **Manage** permissions for that namespace.

     > [!NOTE]
     >
     > When you later create a connection to your Event Hubs namespace, you're asked to select
     > an authentication type for the connection. Based on your authentication type selection,
     > you might need the namespace connection string. For example, **Access Key** authentication
     > requires this connection string.

  1. If you plan to later select an authentication type that requires the connection string for your Event Hubs namespace, save that string now so that you can enter that information later:

     1. In the **Policy** column, select **RootManageSharedAccessKey**.

     1. Find your primary key's connection string. Copy and save the connection string for later use.

        To confirm that your connection string belongs to your Event Hubs namespace, and not a specific event hub, make sure the connection string doesn't have the `EntityPath` parameter. If you find this parameter, the connection string belongs to an event hub and isn't the correct string to use with your workflow.

        :::image type="content" source="media/connectors-create-api-azure-event-hubs/find-event-hub-namespace-connection-string.png" alt-text="Screenshot shows primary key connection string with copy button selected." lightbox="media/connectors-create-api-azure-event-hubs/find-event-hub-namespace-connection-string.png":::

- The logic app workflow where you want to access your event hub

  To start your workflow with an Event Hubs trigger, you need an empty workflow. To use an Event Hubs action in your workflow, you can use any trigger that works best for your scenario to start your workflow.

<a name="add-trigger"></a>

## Add an Event Hubs trigger

In Azure Logic Apps, every workflow must start with a [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts), which fires when a specific condition is met. Each time the trigger fires, Azure Logic Apps creates an instance of your workflow and starts to run the steps in the workflow.

The following steps describe the general way to add an **Event Hubs** trigger such as **When events are available in Event Hub**. This example trigger checks for new events in your event hub and starts a workflow run when new events exist.

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. Based on whether you have a Consumption or Standard logic app resource, follow the corresponding steps:

   - Consumption: On the resource sidebar, under **Development Tools**, select the designer to open your blank workflow.

   - Standard: On the resource sidebar, under **Workflows**, select **Workflows**, and then select your blank workflow. On the workflow sidebar, under **Tools**, select the designer to open the blank workflow.

1. On the designer, follow these [general steps to add the **Event Hubs** trigger you want](../logic-apps/add-trigger-action-workflow.md#add-trigger) to your workflow.

   For more information, see [Event Hubs - Triggers](/connectors/eventhubs/#triggers). This example continues with the trigger named **When events are available in Event Hub**. This trigger checks for new events in your event hub and starts a workflow run when new events exist.

1. If prompted, [provide the connection information for your event hub](#create-connection).

1. In the trigger, provide the necessary information for your selected trigger.

   For the example trigger, the following tables describe the available parameters, starting with the following default parameter:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Event Hub Name** | Yes | The name for the event hub to monitor. |

   Under **How often do you want to check for items**, the following default parameters are available:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Interval** | Yes | A positive integer that describes how often the workflow runs based on the frequency. |
   | **Frequency** | Yes | The unit of time for the recurrence. |
   | **Time zone** | No | Applies only when you specify a start time because this trigger doesn't accept UTC offset. Select the time zone that you want to apply. <br><br>For more information, see [Schedule and run recurring workflows](../connectors/connectors-native-recurrence.md). |
   | **Start time** | No | Provide a start time in this format: <br><br>YYYY-MM-DDThh:mm:ss if you select a time zone<br><br>-or-<br><br>YYYY-MM-DDThh:mm:ssZ if you don't select a time zone<p>For more information, see [Schedule and run recurring workflows](../connectors/connectors-native-recurrence.md). |

   In the **Advanced parameters** list, the following optional parameters are available:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Content type** | No | The event's content type. The default is **application/octet-stream**. |
   | **Content schema** | No | The event's content schema. |
   | **Consumer group name** | No | The name for the [Event Hubs consumer group](../event-hubs/event-hubs-features.md#consumer-groups) to use for reading events. If unspecified, the default consumer group is used. |
   | **Minimum partition key** | No | Enter the minimum [partition](../event-hubs/event-hubs-features.md#partitions) ID to read. By default, all partitions are read. |
   | **Maximum partition key** | No | Enter the maximum [partition](../event-hubs/event-hubs-features.md#partitions) ID to read. By default, all partitions are read. |
   | **Maximum events count** | No | The maximum number of events. The trigger returns between one and the number of events specified by this property. |
  
1. When you're done, on the designer toolbar, select **Save**.

1. Now continue adding one or more actions so that you can perform other tasks using the trigger outputs.

   For example, to filter events based on a specific value, such as a category, you can add a condition so that the **Send event** action sends only the events that meet your condition. 

### Trigger behavior

#### Trigger polling behavior

All Event Hubs triggers are long-polling triggers. This behavior means that when a trigger fires, the trigger processes all the events and waits 30 seconds for more events to appear in your event hub. By design, if no events appear in 30 seconds, the trigger is skipped. Otherwise, the trigger continues reading events until your event hub is empty. The next trigger poll happens based on the recurrence interval that you set in the trigger's properties.

For example, if the trigger is set up with four partitions, this delay might take up to two minutes before the trigger finishes polling all the partitions. If no events are received within this delay, the trigger run is skipped. Otherwise, the trigger continues reading events until your event hub is empty. The next trigger poll happens based on the recurrence interval that you specify in the trigger's properties.

If you know the specific partitions where the messages appear, you can update the trigger to read events from only those partitions. Set the trigger's maximum and minimum partition keys. For more information, review the [Add Event Hubs trigger](#add-trigger) section.

#### Trigger checkpoint behavior

When an Event Hubs trigger reads events from each partition in an event hub, the trigger users its own state to maintain information about the *stream offset* (the event position in a partition) and the partitions from which the trigger reads events.

Each time your workflow runs, the trigger reads events from a partition, starting from the stream offset stored in the trigger state. In round-robin fashion, the trigger iterates over each partition in the event hub and reads events in subsequent trigger runs. A single run gets events from a single partition at a time.

The trigger doesn't use this checkpoint capability in storage, resulting in no extra cost. Updating the Event Hubs trigger resets the trigger's state, which might cause the trigger to read events at start of the stream.

<a name="add-action"></a>

## Add Event Hubs action

In Azure Logic Apps, an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) follows the trigger or another action and performs some task in your workflow. The following steps describe the general way to add an **Event Hubs** action such as **Send event**. For this example, the workflow starts with an **Event Hubs** trigger that checks for new events in the event hub.

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. Based on whether you have a Consumption or Standard logic app resource, follow the corresponding steps:

   - Consumption: On the resource sidebar, under **Development Tools**, select the designer to open your workflow.

   - Standard: On the resource sidebar, under **Workflows**, select **Workflows**, and then select your workflow. On the workflow sidebar, under **Tools**, select the designer to open the workflow.

1. On the designer, follow these [general steps to add the **Event Hubs** action you want](../logic-apps/add-trigger-action-workflow.md#add-action) to your workflow.

   For more information, see [Event Hubs - Actions](/connectors/eventhubs/#actions). This example continues with the action named **Send event**.

1. If prompted, [provide the connection information for your event hub](#create-connection).

1. In the action, provide the necessary information for your selected action.

   For the example action, the following tables describe the available parameters, starting with the following default parameter:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Event Hub Name** | Yes | The name for the event hub where you want to send the event. |

   In the **Advanced parameters** list, the following optional parameters are available:

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Partition key** | No | The [partition](../event-hubs/event-hubs-features.md#partitions) ID for where to send the event. |
   | **Content** | No | The content for the event you want to send. |
   | **Properties** | No | The app properties and values to send. |

   For example, you can send the output from the Event Hubs trigger to another event hub:

   :::image type="content" source="media/connectors-create-api-azure-event-hubs/event-hubs-send-event-action-example.png" alt-text="Screenshot shows Event Hubs action with the advanced parameter Content added to the action.":::

1. When you're done, on the designer toolbar, select **Save**.

<a name="create-connection"></a>

## Create a connection

When you add an Event Hubs trigger or action for the first time, you're prompted to create a connection to your event hub. For this connection, provide the following information and select **Create new**:

| Parameter | Required | Description |
|-----------|----------|-------------|
| **Connection Name** | Yes | The name to identify the connection. |
| **Authentication Type** | Yes | The authentication type for the connection, based on your scenario. Other authentication parameters appear, based on your selection. <br><br>In the example, **Access Key** requires a connection string for your Event Hubs namespace. <br><br>For more information, see [Event Hubs - Creating a connection](/connectors/eventhubs/#creating-a-connection). |

After you create your connection, continue with [Add an Event Hubs trigger](#add-trigger) or [Add an Event Hubs action](#add-action).

## Related content

- [What are connectors in Azure Logic Apps](introduction.md)
- [Managed connectors for Azure Logic Apps](managed.md)
