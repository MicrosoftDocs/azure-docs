<properties
	pageTitle="Use request and response actions | Microsoft Azure"
	description="Overview of the request and response trigger and action in an Azure logic app"
	services=""
	documentationCenter=""
	authors="jeffhollan"
	manager="erikre"
	editor=""
	tags="connectors"/>

<tags
   ms.service="logic-apps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/18/2016"
   ms.author="jehollan"/>

# Get started with the request and response components

With the request and response components in a logic app, you can respond in real time to events.

For example, you can:

- Respond to an HTTP request with data from an on-premises database through a logic app.
- Trigger a logic app from an external webhook event.
- Call a logic app with a request and response action from within another logic app.

To get started using the request and response actions in a logic app, see [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Use the HTTP Request trigger

A trigger is an event that can be used to start the workflow that is defined in a logic app. [Learn more about triggers](connectors-overview.md).

Here’s an example sequence of how to set up an HTTP request in the Logic App Designer.

1. Add the trigger **Request - When an HTTP request is received** in your logic app. You can optionally provide a JSON schema (by using a tool like [JSONSchema.net](http://jsonschema.net)) for the request body. This allows the designer to generate tokens for properties in the HTTP request.
2. Add another action so that you can save the logic app.
3. After saving the logic app, you can get the HTTP request URL from the request card.
4. An HTTP POST (you can use a tool like [Postman](https://www.getpostman.com/)) to the URL triggers the logic app.

>[AZURE.NOTE] If you don't define a response action, a `202 ACCEPTED` response is immediately returned to the caller. You can use the response action to customize a response.

![Response trigger](./media/connectors-native-reqres/using-trigger.png)

## Use the HTTP Response action

The HTTP Response action is only valid when you use it in a workflow that is triggered by an HTTP request. If you don't define a response action, a `202 ACCEPTED` response is immediately returned to the caller.  You can add a response action at any step within the workflow. The logic app only keeps the incoming request open for one minute for a response.  After one minute, if no response was sent from the workflow (and a response action exists in the definition), a `504 GATEWAY TIMEOUT` is returned to the caller.

Here's how to add an HTTP Response action:

1. Select the **New Step** button.
2. Choose **Add an action**.
3. In the action search box, type **response** to list the Response action.

	![Select the response action](./media/connectors-native-reqres/using-action-1.png)

4. Add in any parameters that are required for the HTTP response message.

	![Complete the response action](./media/connectors-native-reqres/using-action-2.png)

5. Click the upper-left corner of the toolbar to save, and your logic app will both save and publish (activate).

## Request trigger

Here are the details for the trigger that this connector supports. There is a single request trigger.

|Trigger|Description|
|---|---|
|Request|Occurs when an HTTP request is received|

## Response action

Here are the details for the action that this connector supports. There is a single response action that can only be used when it is accompanied by a request trigger.

|Action|Description|
|---|---|
|Response|Returns a response to the correlated HTTP request|

### Trigger and action details

The following tables describe the input fields for the trigger and action, and the corresponding output details.

#### Request trigger
The following is an input field for the trigger from an incoming HTTP request.

|Display name|Property name|Description|
|---|---|---|
|JSON Schema|schema|The JSON schema of the HTTP request body|
<br>

**Output details**

The following are output details for the request.

|Property name|Data type|Description|
|---|---|---|
|Headers|object|Request headers|
|Body|object|Request object|

#### Response action

The following are input fields for the HTTP Response action. A * means that it is a required field.

|Display name|Property name|Description|
|---|---|---|
|Status Code*|statusCode|The HTTP status code|
|Headers|headers|A JSON object of any response headers to include|
|Body|body|The response body|

## Next steps

Now, try out the platform and [create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md). You can explore the other available connectors in logic apps by looking at our [APIs list](apis-list.md).
