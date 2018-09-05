---
# required metadata
title: Connect to Azure Event Hubs - Azure Logic Apps | Microsoft Docs
description: Manage and monitor events with Azure Event Hubs and Azure Logic Apps 
author: ecfan
manager: jeconnoc
ms.author: estfan
ms.date: 05/21/2018
ms.topic: article
ms.service: logic-apps
services: logic-apps

# optional metadata
ms.reviewer: klam, LADocs
ms.suite: integration
tags: connectors
---

# Monitor, receive, and send events with Azure Event Hubs and Azure Logic Apps 

This article shows how you can monitor and manage events sent to 
[Azure Event Hubs](../event-hubs/event-hubs-what-is-event-hubs.md) 
from inside a logic app with the Azure Event Hubs connector. 
That way, you can create logic apps that automate tasks and workflows 
for checking, sending, and receiving events from your Event Hub. 

If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 
If you're new to logic apps, review 
[What is Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
and [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).
For connector-specific technical information, see the 
<a href="https://docs.microsoft.com/connectors/eventhubs/" target="blank">Azure Event Hubs connector reference</a>.

## Prerequisites

* An [Azure Event Hubs namespace and Event Hub](../event-hubs/event-hubs-create.md)

* The logic app where you want to access your Event Hub. 
To start your logic app with an Azure Event Hubs trigger, you need a 
[blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 

<a name="permissions-connection-string"></a>

## Check permissions and get connection string

For your logic app to access your Event Hub, 
check your permissions and get the connection string for your Event Hubs namespace.

1. Sign in to the <a href="https://portal.azure.com" target="_blank">Azure portal</a>. 

2. Go to your Event Hubs *namespace*, not a specific Event Hub. 
On the namespace page, under **Settings**, choose **Shared access policies**. 
Under **Claims**, check that you have **Manage** permissions for that namespace.

   ![Manage permissions for your Event Hub namespace](./media/connectors-create-api-azure-event-hubs/event-hubs-namespace.png)

3. If you want to later manually enter your connection information, 
get the connection string for your Event Hubs namespace. 

   1. Under **Policy**, choose **RootManageSharedAccessKey**. 

   2. Find your primary key's connection string. Choose the copy button, 
   and save the connection string for later use.

      ![Copy Event Hubs namespace connection string](media/connectors-create-api-azure-event-hubs/find-event-hub-namespace-connection-string.png)

      > [!TIP]
      > To confirm whether your connection string is associated with 
      > your Event Hubs namespace or with a specific event hub, 
      > make sure the connection string doesn't have the `EntityPath` parameter. 
      > If you find this parameter, the connection string is for a specific 
      > Event Hub "entity" and is not the correct string to use with your logic app.

4. Now continue with [Add an Event Hubs trigger](#add-trigger) 
or [Add an Event Hubs action](#add-action).

<a name="add-trigger"></a>

## Add an Event Hubs trigger

In Azure Logic Apps, every logic app must start with a 
[trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts), 
which fires when a specific event happens or when a 
specific condition is met. Each time the trigger fires, 
the Logic Apps engine creates a logic app instance 
and starts running your app's workflow.

This example shows how you can start a logic app workflow
when new events are sent to your Event Hub. 

1. In the Azure portal or Visual Studio, 
create a blank logic app, which opens Logic Apps Designer. 
This example uses the Azure portal.

2. In the search box, enter "event hubs" as your filter. 
From the triggers list, select the trigger you want. 

   This example uses this trigger: 
   **Event Hubs - When events are available in Event Hub**

   ![Select trigger](./media/connectors-create-api-azure-event-hubs/find-event-hubs-trigger.png)

3. If you're prompted for connection details, 
[create your Event Hubs connection now](#create-connection). 
Or, if your connection already exists, 
provide the necessary information for the trigger.

   1. From the **Event Hub name** list, select the Event Hub you want to monitor.

      ![Specify Event Hub or consumer group](./media/connectors-create-api-azure-event-hubs/select-event-hub.png)

   2. Select the interval and frequency for how often you want 
   the trigger to check the Event Hub.
 
   3. To optionally select some of the advanced trigger options, choose **Show advanced options**.
   
      ![Trigger advanced options](./media/connectors-create-api-azure-event-hubs/event-hubs-trigger-advanced.png)

      | Property | Details | 
      |----------|---------| 
      | Content type  | Select the event's content type. The default is "application/octet-stream". |
      | Content schema | Enter the content schema in JSON for the events that are read from the Event Hub. |
      | Consumer group name | Enter the Event Hub [consumer group name](../event-hubs/event-hubs-features.md#consumer-groups) for reading events. If not specified, the default consumer group is used. |
      | Minimum partition key | Enter the minimum [partition](../event-hubs/event-hubs-features.md#partitions) ID to read. By default, all partitions are read. |
      | Maximum partition key | Enter the maximum [partition](../event-hubs/event-hubs-features.md#partitions) ID to read. By default, all partitions are read. |
      | Maximum events count | Enter a value for the maximum number of events. The trigger returns between one and the number of events specified by this property. |
      |||

4. When you're done, on the designer toolbar, choose **Save**.

5. Now continue adding one or more actions to your logic app 
for the tasks you want to perform with the trigger results.

> [!NOTE]
> All Event Hub triggers are *long-polling* triggers, 
> which means that when a trigger fires, the trigger processes all the events
> and then waits for 30 seconds for more events to appear in your Event Hub.
> If no events are received in 30 seconds, the trigger run is skipped. 
> Otherwise, the trigger continues reading events until your Event Hub is empty.
> The next trigger poll happens based on the recurrence 
> interval that you specify in the trigger's properties.

<a name="add-action"></a>

## Add an Event Hubs action

In Azure Logic Apps, an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) 
is a step in your workflow that follows a trigger or another action. 
For this example, the logic app starts with an Event Hubs trigger 
that checks for new events in your Event Hub. 

1. In the Azure portal or Visual Studio, 
open your logic app in Logic Apps Designer. 
This example uses the Azure portal.

2. Under the trigger or action, choose **New step** > **Add an action**.

   To add an action between existing steps, 
   move your mouse over the connecting arrow. 
   Choose the plus sign (**+**) that appears, 
   and then choose **Add an action**.

3. In the search box, enter "event hubs" as your filter.
From the actions list, select the action you want. 

   For this example, select this action: **Event Hubs - Send event**

   ![Select "Event Hubs - Send event"](./media/connectors-create-api-azure-event-hubs/find-event-hubs-action.png)

4. If you're prompted for connection details, 
[create your Event Hubs connection now](#create-connection). 
Or, if your connection already exists, 
provide the necessary information for the action.

   | Property | Required | Description | 
   |----------|----------|-------------|
   | Event Hub name | Yes | Select the Event Hub where you want to send the event | 
   | Event content | No | The content for the event you want to send | 
   | Properties | No | The app properties and values to send | 
   |||| 

   For example: 

   ![Select Event Hub name and provide event content](./media/connectors-create-api-azure-event-hubs/event-hubs-send-event-action.png)

5. When you're done, on the designer toolbar, choose **Save**.

<a name="create-connection"></a>

## Connect to your Event Hub

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)] 

1. When you're prompted for connection information, 
provide these details:

   | Property | Required | Value | Description | 
   |----------|----------|-------|-------------|
   | Connection Name | Yes | <*connection-name*> | The name to create for your connection |
   | Event Hubs Namespace | Yes | <*event-hubs-namespace*> | Select the Event Hubs namespace you want to use. | 
   |||||  

   For example:

   ![Create Event Hub connection](./media/connectors-create-api-azure-event-hubs/create-event-hubs-connection-1.png)

   To manually enter the connection string, 
   choose **Manually enter connection information**. 
   Learn [how to find your connection string](#permissions-connection-string).

2. Select the Event Hubs policy to use, 
if not already selected. Choose **Create**.

   ![Create Event Hub connection, part 2](./media/connectors-create-api-azure-event-hubs/create-event-hubs-connection-2.png)

3. After you create your connection, 
continue with [Add Event Hubs trigger](#add-trigger) 
or [Add Event Hubs action](#add-action).

## Connector reference

For technical details, such as triggers, actions, and limits, 
as described by the connector's Swagger file, 
see the [connector's reference page](/connectors/eventhubs/). 

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)