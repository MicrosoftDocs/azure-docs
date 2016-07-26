<properties
	pageTitle="Add the HTTP action in logic apps | Microsoft Azure"
	description="Overview of the HTTP action with properties"
	services=""
	documentationCenter=""
	authors="jeffhollan"
	manager="erikre"
	editor=""
	tags="connectors"/>

<tags
   ms.service="app-service-logic"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/15/2016"
   ms.author="jehollan"/>

# Get started with the HTTP action

With the HTTP action, you can extend workflows for your organization and communicate to any endpoint over HTTP. You can:

- Create logic app workflows that activate (trigger) when a website that you manage goes down.
- Communicate to any endpoint over HTTP to extend your workflows into other services.

To get started using the HTTP action in a logic app, see [create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Use the HTTP trigger

A trigger is an event that can be used to start the workflow that is defined in a logic app. [Learn more about triggers](connectors-overview.md).

Here’s an example sequence of how to set up the HTTP trigger in the logic app designer.

1. Add the HTTP trigger in your logic app.
2. Fill in the parameters for the HTTP endpoint that you want to poll.
3. Modify the recurrence interval on how frequently it should poll.
4. The logic app now fires with any content that is returned during each check.

![HTTP trigger](./media/connectors-native-http/using-trigger.png)

### How the HTTP trigger works

The HTTP trigger makes a call to an HTTP endpoint on a recurring interval. By default, any HTTP response code < 300 results in a logic app run. You can add a condition in code-view that will evaluate after the HTTP call to determine if the logic app should fire. Here's an example of an HTTP trigger that fires whenever the status code returned is greater than or equal to `400`.

```javascript
"Http":
{
	"conditions": [
		{
			"expression": "@greaterOrEquals(triggerOutputs()['statusCode'], 400)"
		}
	],
	"inputs": {
		"method": "GET",
		"uri": "https://blogs.msdn.microsoft.com/logicapps/",
		"headers": {
			"accept-language": "en"
		}
	},
	"recurrence": {
		"frequency": "Second",
		"interval": 15
	},
	"type": "Http"
}
```

Full details about the HTTP trigger parameters are available on [MSDN](https://msdn.microsoft.com/library/azure/mt643939.aspx#HTTP-trigger).

## Use the HTTP action

An action is an operation that is carried out by the workflow that is defined in a logic app. [Learn more about actions.](connectors-overview.md)

1. Select the **New Step** button.
2. Choose **Add an action**.
3. In the action search box, type "HTTP" to list the HTTP action.

	![Select the HTTP action](./media/connectors-native-http/using-action-1.png)

4. Add in any parameters that are required for the HTTP call.

	![Complete the HTTP action](./media/connectors-native-http/using-action-2.png)

5. Click save at the top left corner of the toolbar, and your logic app will both save and publish (activate).

## HTTP trigger

Here are the details for the trigger that this connector supports. The HTTP connector has one trigger.

|Trigger|Description|
|---|---|
|HTTP|Makes an HTTP call and returns the response content.|

## HTTP action

Here are the details for the action that this connector supports. The HTTP connector has one possible action.

|Action|Description|
|---|---|
|HTTP|Makes an HTTP call and returns the response content.|

### Action details

The following tables describe the required and optional input fields for the action and the corresponding output details that are associated with using the action.

#### HTTP Request
The action makes an HTTP outbound request.
A * means a required field.

|Display Name|Property Name|Description|
|---|---|---|
|Method*|method|The HTTP verb to use|
|URI*|uri|URI for the HTTP request|
|Headers|headers|A JSON object of HTTP headers to include|
|Body|body|The HTTP request body|
<br>

#### Output details

Here is the HTTP response.

|Property Name|Data Type|Description|
|---|---|---|
|Headers|object|Response headers|
|Body|object|Response object|
|Status Code|int|HTTP status code|

### HTTP responses

When you make calls to various actions, you might get certain responses. The following table outlines corresponding responses and descriptions.

|Name|Description|
|---|---|
|200|OK|
|202|Accepted|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occurred|
|default|Operation Failed.|

## Next steps

Now, try out the platform and [create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md). You can explore the other available connectors in logic apps by looking at our [APIs list](apis-list.md).
