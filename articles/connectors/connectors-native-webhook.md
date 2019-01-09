---
title: Create event-based workflows or actions - Azure Logic Apps | Microsoft Docs
description: Automate event-based workflows or actions by using webhooks and Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, jehollan, LADocs
ms.assetid: 71775384-6c3a-482c-a484-6624cbe4fcc7
ms.topic: article
tags: connectors
ms.date: 07/21/2016
---

# Create event-based workflows or actions by using webhooks and Azure Logic Apps

With the webhook action and trigger, you can start, pause, 
and resume flows to perform these tasks:

* Trigger from an [Azure Event Hub](https://github.com/logicappsio/EventHubAPI) when an item is received
* Wait for an approval before continuing a workflow

Learn more about [how to create custom APIs that support a webhook](../logic-apps/logic-apps-create-api-app.md).

## Use the webhook trigger

A [*trigger*](connectors-overview.md) is an event that starts a logic app workflow. 
A webhook trigger is event-based and doesn't rely on polling for new items. 
Like the [request trigger](connectors-native-reqres.md), 
the logic app fires the instant that an event happens. 
The webhook trigger registers a *callback URL* to a service and uses that URL to fire the logic app as needed.

Here's an example that shows how to set up an HTTP trigger in the Logic App Designer. 
The steps assume that you have already deployed or are accessing an API that follows 
the [webhook subscribe and unsubscribe pattern in logic apps](../logic-apps/logic-apps-create-api-app.md#webhook-triggers). 
The subscribe call is made whenever a logic app is saved with a new webhook, 
or switched from disabled to enabled. The unsubscribe call is made when 
a logic app webhook trigger is removed and saved, or switched from enabled to disabled.

**To add the webhook trigger**

1. Add the **HTTP Webhook** trigger as the first step in a logic app.
2. Fill in the parameters for the webhook subscribe and unsubscribe calls.

   This step follows the same pattern as the [HTTP action](connectors-native-http.md) format.

     ![HTTP Trigger](./media/connectors-native-webhook/using-trigger.png)

3. Add at least one action.
4. Click **Save** to publish the logic app. 
This step calls the subscribe endpoint with the callback URL needed to trigger this logic app.
5. Whenever the service makes an `HTTP POST` to the callback URL, 
the logic app fires, and includes any data passed into the request.

## Use the webhook action

An [*action*](connectors-overview.md) is an operation carried out by the workflow defined in a logic app. 
A webhook action registers a *callback URL* with a service and waits until the URL is called before resuming. 
The ["Send Approval Email"](connectors-create-api-office365-outlook.md) 
is an example of a connector that follows this pattern. 
You can extend this pattern into any service through the webhook action. 

Here's an example that shows how to set up a webhook action in the Logic App Designer. 
These steps assume that you have already deployed or are accessing an API that follows the 
[webhook subscribe and unsubscribe pattern used in logic apps](../logic-apps/logic-apps-create-api-app.md#webhook-actions). 
The subscribe call is made when a logic app executes the webhook action. 
The unsubscribe call is made when a run is canceled while waiting for a response, 
or before the logic app times out.

**To add a webhook action**

1. Choose **New Step** > **Add an action**.

2. In the search box, type "webhook" to find the **HTTP Webhook** action.

    ![Select query action](./media/connectors-native-webhook/using-action-1.png)

3. Fill in the parameters for the webhook subscribe and unsubscribe calls

   This step follows the same pattern as the [HTTP action](connectors-native-http.md) format.

     ![Complete query action](./media/connectors-native-webhook/using-action-2.png)
   
   At runtime, the logic app calls the subscribe endpoint after reaching that step.

4. Click **Save** to publish the logic app.

## Technical details

Here are more details about the triggers and actions that webhook supports.

## Webhook triggers

| Action | Description |
| --- | --- |
| HTTP Webhook |Subscribe a callback URL to a service that can call the URL to fire logic app as needed. |

### Trigger details

#### HTTP Webhook

Subscribe a callback URL to a service that can call the URL to fire logic app as needed.
An * means required field.

| Display Name | Property Name | Description |
| --- | --- | --- |
| Subscribe Method* |method |HTTP Method to use for subscribe request |
| Subscribe URI* |uri |HTTP URI to use for subscribe request |
| Unsubscribe Method* |method |HTTP method to use for unsubscribe request |
| Unsubscribe URI* |uri |HTTP URI to use for unsubscribe request |
| Subscribe Body |body |HTTP request body for subscribe |
| Subscribe Headers |headers |HTTP request headers for subscribe |
| Subscribe Authentication |authentication |HTTP authentication to use for subscribe. [See HTTP connector](connectors-native-http.md#authentication) for details |
| Unsubscribe Body |body |HTTP request body for unsubscribe |
| Unsubscribe Headers |headers |HTTP request headers for unsubscribe |
| Unsubscribe Authentication |authentication |HTTP authentication to use for unsubscribe. [See HTTP connector](connectors-native-http.md#authentication) for details |

**Output Details**

Webhook request

| Property Name | Data Type | Description |
| --- | --- | --- |
| Headers |object |Webhook request headers |
| Body |object |Webhook request object |
| Status Code |int |Webhook request status code |

## Webhook actions

| Action | Description |
| --- | --- |
| HTTP Webhook |Subscribe a callback URL to a service that can call the URL to resume a workflow step as needed. |

### Action details

#### HTTP Webhook

Subscribe a callback URL to a service that can call the URL to resume a workflow step as needed.
An * means required field.

| Display Name | Property Name | Description |
| --- | --- | --- |
| Subscribe Method* |method |HTTP Method to use for subscribe request |
| Subscribe URI* |uri |HTTP URI to use for subscribe request |
| Unsubscribe Method* |method |HTTP method to use for unsubscribe request |
| Unsubscribe URI* |uri |HTTP URI to use for unsubscribe request |
| Subscribe Body |body |HTTP request body for subscribe |
| Subscribe Headers |headers |HTTP request headers for subscribe |
| Subscribe Authentication |authentication |HTTP authentication to use for subscribe. [See HTTP connector](connectors-native-http.md#authentication) for details |
| Unsubscribe Body |body |HTTP request body for unsubscribe |
| Unsubscribe Headers |headers |HTTP request headers for unsubscribe |
| Unsubscribe Authentication |authentication |HTTP authentication to use for unsubscribe. [See HTTP connector](connectors-native-http.md#authentication) for details |

**Output Details**

Webhook request

| Property Name | Data Type | Description |
| --- | --- | --- |
| Headers |object |Webhook request headers |
| Body |object |Webhook request object |
| Status Code |int |Webhook request status code |

## Next steps

* [Create a logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md)
* [Find other connectors](apis-list.md)