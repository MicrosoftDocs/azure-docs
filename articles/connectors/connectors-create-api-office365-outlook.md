---
title: Connect to Office 365 Outlook
description: Automate tasks and workflows that manage email, contacts, and calendars in Office 365 Outlook by using Azure Logic Apps 
services: logic-apps
ms.suite: integration
ms.reviewer: klam, logicappspm
ms.topic: article
ms.date: 10/18/2016
tags: connectors
---

# Manage email, contacts, and calendars in Office 365 Outlook by using Azure Logic Apps

With [Azure Logic Apps](../logic-apps/logic-apps-overview.md) and the [Office 365 Outlook connector](/connectors/office365connector/), you can create automated tasks and workflows that manage your Office 365 account by building logic apps. For example, you automate these tasks:

* Get, send, and reply to email. 
* Schedule meetings on your calendar.
* Add and edit contacts. 

You can use any trigger to start your workflow, for example, when a new email arrives, when a calendar item is updated, or when an event happens in a difference service, such as Salesforce. You can use actions that respond to the trigger event, for example, send an email or create a new calendar event. 

> [!NOTE]
> To automate tasks for an @outlook.com or @hotmail.com account, use the 
> [Outlook.com connector](../connectors/connectors-create-api-outlook.md).

## Prerequisites

* An [Office 365 account](https://www.office.com/)

* An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/). 

* The logic app where you want to access your Office 365 Outlook account. To start your logic app with a trigger, you need a 
[blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

<a name="create-connection"></a>

## Connect to Office 365

Before your logic app can access any service, you first create a *connection* to the service. A connection provides connectivity between a logic app and another service. For example, to connect to Office 365 Outlook, you first need an Office 365 *connection*. To create a connection, enter the credentials you normally use to access the service you wish to connect to. So with Office 365 Outlook, enter the credentials to your Office 365 account to create the connection.

> [!INCLUDE [Steps to create a connection to Office 365](../../includes/connectors-create-api-office365-outlook.md)]

## Add a trigger

A trigger is an event that can be used to start the workflow defined in a logic app. Triggers "poll" the service at an interval and frequency that you want. [Learn more about triggers](../logic-apps/logic-apps-overview.md#logic-app-concepts).

This example logic app uses a trigger that fires when a calendar event is updated.

1. In the [Azure portal](https://portal.azure.com0, open your blank logic app in the Logic App Designer.

1. In the search box, enter "office 365" as your filter. For this example, select **When an upcoming event is starting soon**.
   
   ![Select trigger to start your logic app](./media/connectors-create-api-office365-outlook/office365-trigger.png)

1. If you're prompted to sign in, follow these steps to [create the connection](#create-connection). Otherwise, if the connection already exists, select a calendar from the list.
   
   ![Select calendar to use in your workflow](./media/connectors-create-api-office365-outlook/sample-calendar.png)

1. In the trigger, set the **Frequency** and **Interval** values.

   For example, if you want the trigger to poll every 15 minutes, set the **Frequency** to **Minute**, and set the **Interval** to **15**.
   
   ![Set frequency and interval for the trigger](./media/connectors-create-api-office365-outlook/calendar-settings.png)

1. On the designer toolbar, select **Save**, which saves your logic app.

To respond to the trigger, add another action. For example, you can add the Twilio **Send message** action, which sends a text when the calendar event starts in 15 minutes.

## Add an action

An action is an operation carried out by the workflow defined in a logic app. [Learn more about actions](../logic-apps/logic-apps-overview.md#logic-app-concepts).

This example logic app creates a new contact in Office 365 Outlook. You can use the output from another trigger to create the contact. For example, suppose your logic app uses the SalesForce **When an object is created** trigger. You can add the Office 365 Outlook **Create contact** action with the SalesForce trigger outputs to create the new contact.

1. To add an action as the latest step in your workflow, select **New step**. 

   To add an action between steps, move your pointer over the arrow between those steps. Select the plus sign (**+**) that appears, and then select **Add an action**.

1. In the search box, enter “office 365” as your filter. For this example, select **Create contact**. 

   ![Add the "Create contact" action to your logic app](./media/connectors-create-api-office365-outlook/office365-actions.png) 

1. If you're prompted to sign in, follow these steps to [create the connection](#create-connection). Otherwise, if a connection already exists, provide information for the **Folder ID**, **Given Name**, and other properties:  
   
   ![Enter information for the action](./media/connectors-create-api-office365-outlook/office365-sampleaction.png)

1. On the designer toolbar, select **Save**, which saves your logic app.

## Connector-specific details

For technical details about triggers, actions, and limits as described in the connector's Swagger file, see the [connector's reference page](/connectors/office365connector/). 

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
