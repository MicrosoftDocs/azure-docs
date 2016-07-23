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

## HTTP details

The HTTP connector comes with 1 possible action. Below, there is information on each of the actions, their required and optional input fields, and the corresponding output details associated with their usage.

### HTTP Request
Make an HTTP outbound request.
An * means required field.

|Display Name|Property Name|Description|
|---|---|---|
|Method*|method|HTTP Verb to use|
|URI*|uri|URI for the HTTP request|
|Headers|headers|A JSON object of HTTP headers to include|
|Body|body|The HTTP request body|
|Authentication|authentication|[Details here](#authentication)|
<br>

**Output Details**

HTTP Response

|Property Name|Data Type|Description|
|---|---|---|
|Headers|object|Response headers|
|Body|object|Response object|
|Status Code|int|HTTP status code|

## Authentication

Logic Apps allows you to use different types of authentication against HTTP endpoints.  This authentication can be used with the HTTP, [HTTP + Swagger](./connectors-native-http-swagger.md), and [HTTP Webhook](./connectors-native-webhook.md) connectors.  The following types of authentication are configurable:

* [Basic Authentication](#basic-authentication)
* [ClientCertificate Authentication](#client-certificate-authentication)
* [ActiveDirectoryOAuth Authentication](#azure-active-directory-oauth-authentication)

#### Basic authentication

The following authentication object is needed for basic authentication:
An * means required field.

|Property Name|Data Type|Description|
|---|---|---|
|Type*|type|Type of authentication. For Basic authentication, the value must be `Basic`|
|Username*|username|Username to authenticate|
|Password*|password|Password to authenticate|

>[AZURE.TIP] If you want to use a password that cannot be retrieved from the definition, use a `securestring` parameter and the `@parameters()` [workflow definition function](http://aka.ms/logicappdocs)

So you would create an object like this in the authentication field:

```javascript
{
	"type": "Basic",
	"username": "user",
	"password": "test"
}
```

#### Client certificate authentication

The following authentication object is needed for client certificate authentication:
An * means required field.

|Property Name|Data Type|Description|
|---|---|---|
|Type*|type|Type of authentication. For SSL client certificates, the value must be `ClientCertificate`|
|PFX*|pfx|Base64-encoded contents of the PFX file|
|Password*|password|Password to access the PFX file|

>[AZURE.TIP] You can use a `securestring` parameter and the `@parameters()` [workflow definition function](http://aka.ms/logicappdocs) to use a parameter that won't be readable in the definition after saving.

For example:

```javascript
{
	"type": "ClientCertificate",
	"pfx": "aGVsbG8g...d29ybGQ=",
	"password": "@parameters('myPassword')"
}
```

#### Azure Active Directory OAuth authentication

The following authentication object is needed for Azure Active Directory OAuth authentication:
An * means required field.

|Property Name|Data Type|Description|
|---|---|---|
|Type*|type|Type of authentication. For ActiveDirectoryOAuth, the value must be `ActiveDirectoryOAuth`|
|Tenant*|tenant|The tenant identifier for the Azure AD tenant|
|Audience*|audience|This is set to `https://management.core.windows.net/`|
|Client ID*|clientId|Provide the client identifier for the Azure AD application|
|Secret*|secret|Secret of the client that is requesting the token|

>[AZURE.TIP] You can use a `securestring` parameter and the `@parameters()` [workflow definition function](http://aka.ms/logicappdocs) to use a parameter that won't be readable in the definition after saving.

For example:

```javascript
{
	"type": "ActiveDirectoryOAuth",
	"tenant": "72f988bf-86f1-41af-91ab-2d7cd011db47",
	"audience": "https://management.core.windows.net/",
	"clientId": "34750e0b-72d1-4e4f-bbbe-664f6d04d411",
	"secret": "hcqgkYc9ebgNLA5c+GDg7xl9ZJMD88TmTJiJBgZ8dFo="
}
```

---

## Next steps

Below are details on how to move forward with logic apps and our community.

## Create a logic app

Try out the platform and [create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md) now. You can explore the other available connectors in logic apps by looking at our [APIs list](apis-list.md).
