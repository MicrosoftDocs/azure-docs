---
title: Send HTTP or HTTPS request and responses - Azure Logic Apps
description: Respond to events in real time Overview of the request and response trigger and action in an Azure logic app
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewers: klam, LADocs
manager: carmonm
ms.assetid: 566924a4-0988-4d86-9ecd-ad22507858c0
ms.topic: article
ms.date: 09/06/2019
tags: connectors
---

# React to requests and send responses over HTTP or HTTPS by using Azure Logic Apps

With [Azure Logic Apps](../logic-apps/logic-apps-overview.md) and the built-in Request trigger or Response action, you can create automated tasks and workflows that respond in real time to events that are sent over HTTP or HTTPS. For example, you can have a logic app:

* Respond to an HTTP request for data in an on-premises database.
* Trigger a workflow when an external webhook event happens.
* Call a logic app from within another logic app.

## Prerequisites

* An Azure subscription. If you don't have a subscription, you can [sign up for a free Azure account](https://azure.microsoft.com/free/).

* Basic knowledge about [logic apps](../logic-apps/logic-apps-overview.md). If you're new to logic apps, learn [how to create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

<a name="add-request"></a>

## Add the Request trigger

This built-in trigger waits for an incoming request over HTTP or HTTPS. When this event happens, the trigger fires and runs the logic app. 

1. Sign in to the [Azure portal](https://portal.azure.com). Create a blank logic app.

1. After Logic App Designer appears, in the search box, enter "request" as your filter. From the triggers list, select the **When an HTTP request is received** trigger as the first step in your logic app workflow.

1. Optionally, you can provide a JSON schema that describes the body format for the incoming request. This schema helps the designer generate tokens for the properties in the request. 

   For example, you can use a tool such as [JSONSchema.net](https://jsonschema.net) to create a JSON schema for the request body.

The following is an input field for the trigger from an incoming HTTP request.

| Display name | Property name | Description |
|--------------|---------------|-------------|
| JSON Schema | schema | The JSON schema of the HTTP request body |
||||

1. Add another action so that you can save the logic app.

1. After you save the logic app, you can get the HTTP request URL from the request card.

1. Send an HTTP POST to the URL triggers the logic app. For example, you can use a tool like [Postman](https://www.getpostman.com/).

1. Save your logic app. On the designer toolbar, select **Save**.

**Output details**

The following are output details for the request.

| Property name | Data type | Description |
|---------------|-----------|-------------|
| Headers | Object | Request headers |
| Body | Object | Request object |
||||

> [!NOTE]
> If you don't define a response action, a `202 ACCEPTED` response is immediately returned to the caller. You can use the response action to customize a response.

![Response trigger](./media/connectors-native-reqres/using-trigger.png)

<a name="add-response"></a>

## Add a Response action

The HTTP Response action is only valid when you use it in a workflow that is triggered by an HTTP request. If you don't define a response action, a `202 ACCEPTED` response is immediately returned to the caller.  You can add a response action at any step within the workflow. The logic app only keeps the incoming request open for one minute for a response.  After one minute, if no response was sent from the workflow (and a response action exists in the definition), a `504 GATEWAY TIMEOUT` is returned to the caller.

Here's how to add an HTTP Response action:

1. Select the **New Step** button.

1. Choose **Add an action**.

1. In the action search box, type **response** to list the Response action.
   
   ![Select the response action](./media/connectors-native-reqres/using-action-1.png)

1. Add in any parameters that are required for the HTTP response message.
   
   ![Complete the response action](./media/connectors-native-reqres/using-action-2.png)

   Here are the details for the action that this connector supports. There is a single response action that can only be used when it is accompanied by a request trigger.

   | Action | Description |
   |---------|-------------|
   | Response | Returns a response to the correlated HTTP request. |
   |||

The following are input fields for the HTTP Response action. A * means that it is a required field.

| Display name | Property name | Description |
| --- | --- | --- |
| Status Code* |statusCode |The HTTP status code |
| Headers |headers |A JSON object of any response headers to include |
| Body |body |The response body |

1. Save your logic app. (On the designer toolbar, select **Save**.)

## Next steps

* [Connectors for Logic Apps](../connectors/apis-list.md)