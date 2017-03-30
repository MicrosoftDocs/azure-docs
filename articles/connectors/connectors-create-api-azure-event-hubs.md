---
title: Set up data stream and event monitor with Azure Event Hubs for Azure Logic Apps | Microsoft Docs
description: Monitor data streams to receive events and send events for Azure Logic Apps with the Azure Event Hubs connector
services: logic-apps
author: ecfan
manager: anneta
editor: ''
documentationcenter: ''
tags: connectors

ms.assetid: 
ms.service: logic-apps
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
keywords: data stream, event monitor, event hubs
ms.date: 03/31/2017
ms.author: LADocs; estfan
---

# Monitor, receive, and send events with the Azure Event Hubs connector

To set up a data stream and event monitor so your logic app can receive events and send events, 
connect to your [Azure Event Hub](https://azure.microsoft.com/services/event-hubs) 
from your logic app workflow. Learn more about 
[Azure Event Hubs](../event-hubs/event-hubs-what-is-event-hubs.md).

## Requirements

* To use [any connector](https://docs.microsoft.com/azure/connectors/apis-list), 
you must first have a logic app. Learn how to 
[create a basic logic app](../logic-apps/logic-apps-create-a-logic-app.md).

* You must already created an [Event Hubs](https://azure.microsoft.com/services/event-hubs/) 
namespace and an Event Hub in Azure. You also need **Manage** permissions 
and the connection string for your Event Hubs namespace. 
Learn [how to create your Event Hubs namespace and find the connection string](../event-hubs/event-hubs-create.md). 

## Connect to your Event Hubs namespace

Before your logic app can access any service, 
you have to create a [*connection*](./connectors-overview.md) 
between your logic app and the service, if you haven't already. 
You must also authorize your logic app to connect and access your Event Hub. 
Fortunately, you can set up authorization from your logic app in the Azure portal.

To connect and authorize your logic app to access your Event Hub, 
follow these steps.

1.  Sign in to the [Azure portal](https://portal.azure.com "Azure portal"). Go to your logic app, 
and open Logic App Designer.

2.  In the search box for the designer, enter `event hubs` for your filter. 
Select any Event Hubs trigger or action.

    ![Find the Event Hubs trigger](./media/connectors-create-api-azure-event-hubs/find-event-hubs-trigger.png)

4.  If you didn't previously connect to your Event Hub, 
you're prompted to provide your Event Hubs credentials.

    Your credentials authorize your logic app 
    to connect and access your Event Hub data. 

5.  Check that you have **Manage** permissions for your Event Hubs namespace. 
On the namespace blade, under **General**, choose **Shared access policies**.

    ![Manage permissions for your Event Hub namespace](./media/connectors-create-api-azure-event-hubs/event-hubs-namespace.png)

6.  To copy the connection string for your Event Hubs namspace, 
choose **RootManageSharedAccessKey**. Next to your primary key connection string, 
choose the copy button.

    > [!TIP]
    > To confirm whether your connection string is 
    > associated with your Event Hubs namespace or with a specific entity, 
    > check the connection string for the `EntityPath` parameter. 
    > If you find this paramter, the connection string is not the 
    > correct string for your logic app.

5.  After you find the connection string for your Event Hubs namespace, 
give your connection a name, enter that string as 
the API connection in your logic app, and choose **Create**.

    ![Enter connection string for Event Hubs namespace](./media/connectors-create-api-azure-event-hubs/event-hubs-connection.png)

    Now that you created your connection, 
    you can continue with the other steps for your logic app.

    ![Event Hubs namespace connection created](./media/connectors-create-api-azure-event-hubs/event-hubs-connection-created.png)

## Start your logic app when your Event Hub receives new events

A [*trigger*](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts) 
is the event that starts your logic app workflow. To start your workflow
when new events are sent to your Event Hub, follow these steps for adding 
the trigger that detects this event, if you haven't already.

1.  In the Azure portal, go to your logic app, and open Logic App Designer.

2.  In the search box for the designer, enter `event hubs` for your filter. 
Select the **When events are available in Event Hub** trigger.

    ![Select trigger for when your Event Hub receives new events](./media/connectors-create-api-azure-event-hubs/find-event-hubs-trigger.png)

    If you don't already have a connection to Azure Event Hubs, 
    you're prompted to sign in with your Event Hubs connection string.

    The settings for the **When an event in available in an Event Hub** trigger appear.

    ![Trigger settings for when your Event Hub receives new events](./media/connectors-create-api-azure-event-hubs/event-hubs-trigger.png)

3.  Enter the name for the Event Hub that you want to monitor. 
Or to optionally select a consumer group for reading events, 
choose **Show advanced options**.

    ![Specify Event Hub or consumer group](./media/connectors-create-api-azure-event-hubs/event-hubs-trigger-details.png)

    You've now set up a trigger to start your logic app. 
    When new events are available in the specified Event Hub, 
    the trigger runs other actions or triggers in your logic app workflow.

## Send events to your Event Hub from your logic app

An [*action*](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts) 
is a task performed by your logic app workflow. Now that you added a trigger, 
you can perform operations with the data that's generated by the trigger. 
To send an event to your Event Hub from your logic app, 
follow these steps for adding the action that performs this task.

1.  In your logic app, under your trigger, 
choose **New step** > **Add an action**.

    ![Choose "New Step", then "Add an action"](./media/connectors-create-api-azure-event-hubs/add-action.png)

    Now you can find and select an action to perform. 
    Although you can select any action, for this example, 
    we want the Event Hubs action to send events.

2.  In the search box, enter `event hubs` for your filter.
Select **Send event**.

    ![Select "Event Hubs - Send event" action](./media/connectors-create-api-azure-event-hubs/find-event-hubs-action.png)

3.  Enter the required details for the event, 
like the name for the Event Hub where you want to send the event. 
Enter any other optional details about the event.

    ![Enter Event Hub name and optional event details](./media/connectors-create-api-azure-event-hubs/event-hubs-send-event-action.png)

6.  Save your changes.

    ![Save your logic app](./media/connectors-create-api-azure-event-hubs/save-logic-app.png)

    You've now set up an action to send events from your logic app. 

## Technical Details

Here are more details about the triggers, actions, 
and responses that this connection supports. 
An asterisk (*) indicates a required property.

### Event Hubs triggers

| Trigger | Description |
| --- | --- |
| [When events are available in Event Hub](#available-events) | This operation triggers a workflow when events are available in the specified Event Hub. |

### Trigger details

<a name="available-events"></a>
#### When events are available in Event Hub

| Property name | Display name | Description |
| --- | --- | --- |
| EventHubName* | Event Hub name | The name for the Event Hub to monitor for events |

These advanced parameters are also available:

| Property name | Display name | Description |
| --- | --- | --- |
| ConsumerGroupName | Consumer group name | The name for the consumer group that reads events |

##### Output details

Event: This object has the content and properties for an event from an Event Hub.

| Property name | Data type | Description |
| --- | --- | --- |
| ContentData | string | Content for the event |
| Properties | object | Key-value pairs for each application property |
| SystemProperties | object | System properties for the Event Hub |

### Event Hubs actions

The Event Hubs connector comes with one possible action. 
Here is information about this action, required and optional input fields, 
and corresponding outputs.

| Action | Description |
| --- | --- |
| [Send an event](#send-event) | Send an event to the specified Event Hub |

### Action details

<a name="send-event"></a>
#### Send an event

| Property name | Display name | Description |
| --- | --- | --- |
| EventHubName* | Event Hub name | The name for the Event Hub where to send the event |
| ContentData | Content | Content for the event to send |
| Properties | Properties | Key-value pairs for each application property |

These advanced parameters are also available: 

| Property name | Display name | Description |
| --- | --- | --- |
| PartitionKey | Partition Key  | The key for the specific Event Hub partition where you want to send the event  |

## HTTP responses

The preceding triggers and actions can return one or more of these HTTP status codes:

| Name | Description |
| --- | --- |
| 200 | OK |
| default | Operation failed |


## Next steps

*  [Find other connectors for Azure Logic apps](./apis-list.md)