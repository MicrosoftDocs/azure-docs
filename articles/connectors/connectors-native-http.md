<properties
	pageTitle="Add the HTTP action in Logic Apps | Microsoft Azure"
	description="Overview of HTTP action with properties"
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

# Get started with the HTTP Action

With the HTTP action, you can extend workflows for your organization and communicate to any endpoint over HTTP.

- Create logic app workflows that activate (trigger) when a website you manage goes down.
- Communicate to any endpoint over HTTP to extend your workflows into other services.

To get started using the HTTP action in a logic app, see [create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

---

## Use an HTTP trigger

A trigger is an event that can be used to start the workflow defined in a Logic app. [Learn more about triggers](connectors-overview.md). 

Here’s an example sequence of how to setup a HTTP trigger in the logic app designer.

1. Add the HTTP trigger in your logic app
1. Fill in the parameters for the HTTP endpoint you want to poll
1. Modify the recurrence interval on how frequently it should poll
1. The logic app will now fire with any content returned during each check.

![HTTP Trigger](./media/connectors-native-http/using-trigger.png)

### How the HTTP trigger works

The HTTP trigger will make a call to an HTTP endpoint on a recurring interval.  By default, any HTTP response code < 300 will result in a logic app run.  You can add a condition in code-view which will evaluate after the HTTP call to determine if the logic app should fire.  Here is an example of an HTTP trigger that will fire whenever the status code returned is greater than or equal to `400`.

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

Full details on the HTTP trigger parameters [can be found on MSDN](https://msdn.microsoft.com/library/azure/mt643939.aspx#HTTP-trigger).

## Use an HTTP action
	
An action is an operation carried out by the workflow defined in a Logic app. [Learn more about actions.](connectors-overview.md)

1. Select the **New Step** button
1. Choose **Add an action**
1. In the action search box, type "HTTP" to list the HTTP action

	![Select HTTP action](./media/connectors-native-http/using-action-1.png)

1. Add in any parameters required for the HTTP call

	![Complete HTTP action](./media/connectors-native-http/using-action-2.png)

1. Click save at the top left corner of the toolbar, and your logic app will both save and publish (activate)

---

## Technical details

Below are the details for the triggers and actions this connector supports.

## HTTP triggers

A trigger is an event that can be used to start the workflow defined in a Logic app. [Learn more about triggers.](connectors-overview.md) The HTTP connector has 1 trigger. 

|Trigger|Description|
|---|---|
|HTTP|Make an HTTP call and return the response content|

## HTTP actions

An action is an operation carried out by the workflow defined in a Logic app. [Learn more about actions.](connectors-overview.md) The HTTP connector has 1 possible action. 

|Action|Description|
|---|---|
|HTTP|Make an HTTP call and return the response content|

### Action details

The HTTP connector comes with 1 possible action. Below, there is information on each of the actions, their required and optional input fields, and the corresponding output details associated with their usage.

#### HTTP Request
Make an HTTP outbound request.
An * means required field.

|Display Name|Property Name|Description|
|---|---|---|
|Method*|method|HTTP Verb to use|
|URI*|uri|URI for the HTTP request|
|Headers|headers|A JSON object of HTTP headers to include|
|Body|body|The HTTP request body|
<br>

**Output Details**

HTTP Response

|Property Name|Data Type|Description|
|---|---|---|
|Headers|object|Response headers|
|Body|object|Response object|
|Status Code|int|HTTP status code|

### HTTP responses

When making calls to various actions, you might get certain responses. Below is a table outlining corresponding responses and descriptions.

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

---

## Next steps

Below are details on how to move forward with logic apps and our community.

## Create a logic app

Try out the platform and [create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md) now. You can explore the other available connectors in logic apps by looking at our [APIs list](apis-list.md).
