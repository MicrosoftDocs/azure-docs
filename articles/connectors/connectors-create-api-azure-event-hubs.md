---
title: Connect from Workflows to Azure Event Hubs
description: Learn how to connect to your event hub and then add an Azure Event Hubs trigger or action to your workflow in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/05/2025
#customer intent: As an integration developer, I want to connect my logic app workflows to Azure Event Hubs so I can automate tasks that monitor and manage events in my event hub.
---

# Connect workflows to event hubs in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To automate tasks that monitor and manage events in an event hub from within your workflow in Azure Logic Apps, use the Azure **Event Hubs** connector operations. For example, your workflow can check, send, and receive events from your event hub.

This article shows how to connect to your event hub by adding an **Event Hubs** trigger or action to your workflow.


## Connector reference

For information about this connector's operations, their parameters, and other technical information, such as limits, known issues, and so on, see the [Event Hubs connector's reference page](/connectors/eventhubs/).

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [Event Hubs namespace and event hub](../event-hubs/event-hubs-create.md)

  You also need the connection string for your event hub namespace. Make sure to check that your workflow can access your event hub. See [Check permissions and get connection string](#permissions-connection-string).

- The logic app workflow where you want to access your event hub

  To start your workflow with an Event Hubs trigger, you need an empty workflow. To use an Event Hubs action in your workflow, your workflow can start with any trigger that works best for your scenario.

<a name="permissions-connection-string"></a>

## Check permissions and get connection string

To make sure that your workflow can access your event hub, check your permissions. Then get the connection string for your event hub's namespace.

1. In the [Azure portal](https://portal.azure.com), go to your Event Hubs *namespace*, not a specific event hub.

1. On the namespace menu, under **Settings**, select **Shared access policies**. In the **Claims** column, check that you have at least **Manage** permissions for that namespace.

   :::image type="content" source="./media/connectors-create-api-azure-event-hubs/event-hubs-namespace.png" alt-text="Screenshot shows Azure portal, Event Hubs namespace, and Claims column with Manage permissions." lightbox="./media/connectors-create-api-azure-event-hubs/event-hubs-namespace.png":::

1. Get the connection string for your event hub namespace so you can manually enter your connection information later:

   1. In the **Policy** column, select **RootManageSharedAccessKey**.

   1. Find your primary key's connection string. Copy and save the connection string for later use.

      :::image type="content" source="media/connectors-create-api-azure-event-hubs/find-event-hub-namespace-connection-string.png" alt-text="Screenshot shows primary key connection string with copy button selected." lightbox="media/connectors-create-api-azure-event-hubs/find-event-hub-namespace-connection-string.png":::

      > [!TIP]
      >
      > To confirm that your connection string belongs to your Event Hubs namespace, and not a specific event hub, 
      > make sure the connection string doesn't have the `EntityPath` parameter. If you find this parameter, 
      > the connection string belongs to an event hub and isn't the correct string to use with your workflow.

<a name="create-connection"></a>

## Create an event hub connection

When you add an Event Hubs trigger or action for the first time, you're prompted to create a connection to your event hub.

1. Enter a name for your connection.

1. For **Authentication Type**, select **Access Key**.
1. Paste in your **Connection String** that you saved earlier and then select **Create new**.

   :::image type="content" source="./media/connectors-create-api-azure-event-hubs/create-event-hubs-connection.png" alt-text="Screenshot showing the provided connection information with Create now selected.":::

1. After you create your connection, continue with [Add an Event Hubs trigger](#add-trigger) or [Add an Event Hubs action](#add-action).

<a name="add-trigger"></a>

## Add Event Hubs trigger

In Azure Logic Apps, every workflow must start with a [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts), which fires when a specific condition is met. Each time the trigger fires, the Logic Apps service creates a workflow instance and starts running the steps in the workflow.

The following steps describe the general way to add a trigger, for example, **When events are available in Event Hub**. This example shows how to add a trigger that checks for new events in your event hub and starts a workflow run when new events exist.

1. In the Logic Apps Designer, open your blank logic app workflow, if not already open.

1. Select **Add a trigger**.

1. In the search box, enter `event hubs`. From the triggers list, select the trigger named **When events are available in Event Hub**.

   :::image type="content" source="./media/connectors-create-api-azure-event-hubs/find-event-hubs-trigger.png" alt-text="Screenshot showing the Logic App Designer with a trigger highlighted.":::

1. If you're prompted to create a connection to your event hub, [provide the requested connection information](#create-connection).

1. In the trigger, provide information about the event hub that you want to monitor, for example:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Event Hub Name** | Yes | The name for the event hub that you want to monitor |
   | **Content Type** | No | The event's content type. The default is `application/octet-stream`. |
   | **Consumer Group Name** | No | The [name for the Event Hubs consumer group](../event-hubs/event-hubs-features.md#consumer-groups) to use for reading events. If not specified, the default consumer group is used. |
   | **Minimum partition key** | No | Enter the minimum [partition](../event-hubs/event-hubs-features.md#partitions) ID to read. By default, all partitions are read. |
   | **Maximum partition key** | No | Enter the maximum [partition](../event-hubs/event-hubs-features.md#partitions) ID to read. By default, all partitions are read. |
   | **Maximum Events Count** | No | The maximum number of events. The trigger returns between one and the number of events specified by this property. |
   | **Interval** | Yes | Under **How often do you want to check for items**. A positive integer that describes how often the workflow runs based on the frequency |
   | **Frequency** | Yes | Under **How often do you want to check for items**. The unit of time for the recurrence |
   | **Time zone** | No | Under **How often do you want to check for items**. Applies only when you specify a start time because this trigger doesn't accept UTC offset. Select the time zone that you want to apply. <p>For more information, see [Schedule and run recurring workflows](../connectors/connectors-native-recurrence.md). |
   | **Start time** | No | Under **How often do you want to check for items**. Provide a start time in this format: <p>YYYY-MM-DDThh:mm:ss if you select a time zone<p>-or-<p>YYYY-MM-DDThh:mm:ssZ if you don't select a time zone<p>For more information, see [Schedule and run recurring workflows](../connectors/connectors-native-recurrence.md). |
  
1. When you're done, on the designer toolbar, select **Save**.

1. Now continue adding one or more actions so that you can perform other tasks using the trigger outputs.

   For example, to filter events based on a specific value, such as a category, you can add a condition so that the 
   **Send event** action sends only the events that meet your condition. 

## Trigger polling behavior

All Event Hubs triggers are long-polling triggers. This behavior means that when a trigger fires, the trigger processes all the events and waits 30 seconds for more events to appear in your event hub. By design, if no events appear in 30 seconds, the trigger is skipped. Otherwise, the trigger continues reading events until your event hub is empty. The next trigger poll happens based on the recurrence interval that you set in the trigger's properties.

For example, if the trigger is set up with four partitions, this delay might take up to two minutes before the trigger finishes polling all the partitions. If no events are received within this delay, the trigger run is skipped. Otherwise, the trigger continues reading events until your event hub is empty. The next trigger poll happens based on the recurrence interval that you specify in the trigger's properties.

If you know the specific partitions where the messages appear, you can update the trigger to read events from only those partitions. Set the trigger's maximum and minimum partition keys. For more information, review the [Add Event Hubs trigger](#add-trigger) section.

## Trigger checkpoint behavior

When an Event Hubs trigger reads events from each partition in an event hub, the trigger users its own state to maintain information about the *stream offset* (the event position in a partition) and the partitions from which the trigger reads events.

Each time your workflow runs, the trigger reads events from a partition, starting from the stream offset stored in the trigger state. In round-robin fashion, the trigger iterates over each partition in the event hub and reads events in subsequent trigger runs. A single run gets events from a single partition at a time.

The trigger doesn't use this checkpoint capability in storage, resulting in no extra cost. Updating the Event Hubs trigger resets the trigger's state, which might cause the trigger to read events at start of the stream.

<a name="add-action"></a>

## Add Event Hubs action

In Azure Logic Apps, an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) follows the trigger or another action and performs some operation in your workflow. The following steps describe the general way to add an action, for example, **Send event**. For this example, the workflow starts with an Event Hubs trigger that checks for new events in your event hub.

1. In the Logic Apps Designer, open your logic app workflow, if not already open.

1. Under the trigger or another action, add a new step.

   To add a step between existing steps, move your mouse over the arrow. Select the plus sign (**+**) that appears, and then select **Add an action**.

1. In the operation search box, enter `event hubs`. From the actions list, select the action named **Send event**.

   :::image type="content" source="./media/connectors-create-api-azure-event-hubs/find-event-hubs-action.png" alt-text="Screenshot showing the Logic App Designer with the Send event option highlighted.":::

1. If you're prompted to create a connection to your event hub, [provide the requested connection information](#create-connection).

1. In the action, provide information about the events that you want to send. Open the **Advanced parameters** list. Selecting a parameter adds that property to the action.

   :::image type="content" source="./media/connectors-create-api-azure-event-hubs/event-hubs-send-event-action.png" alt-text="Screenshot showing the Advanced Parameters option." lightbox="./media/connectors-create-api-azure-event-hubs/event-hubs-send-event-action.png":::

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Event Hub name** | Yes | The event hub where you want to send the event |
   | **Partition key** | No | The [partition](../event-hubs/event-hubs-features.md#partitions) ID for where to send the event |
   | **Content** | No | The content for the event you want to send |
   | **Properties** | No | The app properties and values to send |

   For example, you can send the output from your Event Hubs trigger to another event hub:

   :::image type="content" source="./media/connectors-create-api-azure-event-hubs/event-hubs-send-event-action-example.png" alt-text="Screenshot showing the action with the advanced parameter Content added to the action.":::

1. When you're done, on the designer toolbar, select **Save**.


For all the operations and other technical information, such as properties and limits, see the [Event Hubs connector's reference page](/connectors/eventhubs/).

## Related content

- [Managed connectors for Azure Logic Apps](managed.md)
- [Built-in connectors for Azure Logic Apps](built-in.md)
- [What are connectors in Azure Logic Apps](introduction.md)
