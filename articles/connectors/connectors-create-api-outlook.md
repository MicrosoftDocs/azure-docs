---
title: Connect to Outlook.com
description: Automate tasks and workflows that manage email, calendars, and contacts in Outlook.com by using Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: klam, logicappspm
ms.topic: article
ms.date: 08/18/2016
tags: connectors
---

# Manage email, calendars, and contacts in Outlook.com by using Azure Logic Apps

With [Azure Logic Apps](../logic-apps/logic-apps-overview.md) and the [Outlook.com connector](/connectors/outlook/), you can create automated tasks and workflows that manage your @outlook.com or @hotmail.com account by building logic apps. For example, you automate these tasks:

* Get, send, and reply to email.
* Schedule meetings on your calendar.
* Add and edit contacts.

You can use any trigger to start your workflow, for example, when a new email arrives, when a calendar item is updated, or when an event happens in a difference service. You can use actions that respond to the trigger event, for example, send an email or create a new calendar event.

> [!NOTE]
> To automate tasks for a Microsoft work account such as @fabrikam.onmicrosoft.com, use the 
> [Office 365 Outlook connector](../connectors/connectors-create-api-office365-outlook.md).

## Prerequisites

* An [Outlook.com account](https://outlook.live.com/owa/)

* An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/). 

* The logic app where you want to access your Outlook.com account. To start your workflow with an Outlook.com trigger, you need to have a [blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). To add an Outlook.com action to your workflow, your logic app needs to already have a trigger.

## Add a trigger

A [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts) is an event that starts the workflow in your logic app. This example logic app uses a "polling" trigger that checks for any new email in your email account, based on the specified interval and frequency.

1. In the [Azure portal](https://portal.azure.com), open your blank logic app in the Logic App Designer.

1. In the search box, enter "outlook.com" as your filter. For this example, select **When a new email arrives**.

1. If you're prompted to sign in, provide your Outlook.com credentials so that your logic app can connect to your account. Otherwise, if your connection already exists, provide the information for the trigger properties:

1. In the trigger, set the **Frequency** and **Interval** values.

   For example, if you want the trigger to poll every 15 minutes, set the **Frequency** to **Minute**, and set the **Interval** to **15**.

1. On the designer toolbar, select **Save**, which saves your logic app.

To respond to the trigger, add another action. For example, you can add the Twilio **Send message** action, which sends a text when an email arrives.

## Add an action

An [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) is an operation that's run by the workflow in your logic app. This example logic app sends an email from your Outlook.com account. You can use the output from another trigger to populate the action. For example, suppose your logic app uses the SalesForce **When an object is created** trigger. You can add the Outlook.com **Send an email** action and use the outputs from the SalesForce trigger in the email.

1. In the [Azure portal](https://portal.azure.com), open your logic app in the Logic App Designer.

1. To add an action as the last step in your workflow, select **New step**. 

   To add an action between steps, move your pointer over the arrow between those steps. Select the plus sign (**+**) that appears, and then select **Add an action**.

1. In the search box, enter “outlook.com” as your filter. For this example, select **Send an email**. 

1. If you're prompted to sign in, provide your Outlook.com credentials so that your logic app can connect to your account. Otherwise, if your connection already exists, provide the information for the action properties.

1. On the designer toolbar, select **Save**, which saves your logic app.

## Connector reference

For technical details, such as triggers, actions, and limits, as described by the connector's Swagger file, see the [connector's reference page](/connectors/outlook/). 

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
