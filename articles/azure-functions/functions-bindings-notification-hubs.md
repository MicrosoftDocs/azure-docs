<properties
	pageTitle="Azure Functions Notification Hub binding | Microsoft Azure"
	description="Understand how to use Azure Notification Hub binding in Azure Functions."
	services="functions"
	documentationCenter="na"
	authors="wesmc7777"
	manager="erikre"
	editor=""
	tags=""
	keywords="azure functions, functions, event processing, dynamic compute, serverless architecture"/>

<tags
	ms.service="functions"
	ms.devlang="multiple"
	ms.topic="reference"
	ms.tgt_pltfrm="multiple"
	ms.workload="na"
	ms.date="10/26/2016"
	ms.author="wesmc"/>

# Azure Functions Notification Hubs bindings

[AZURE.INCLUDE [functions-selector-bindings](../../includes/functions-selector-bindings.md)]

This article explains how to configure and code Azure Notification Hubs bindings in Azure Functions. 
Azure Functions supports the output binding for Notification Hubs.

This binding requires a fully configured notification hub for the Platform Notifications Services (PNS) you want to use. 
For more information, see 
[Getting started with Notification Hubs](../notification-hubs/notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md) 
and click your target client platform at the top of the article.

[AZURE.INCLUDE [intro](../../includes/functions-bindings-intro.md)] 

<a name="output"></a>
## Notification Hubs output binding

The Notification Hubs output binding lets you send notifications to the bound notification hub. 

The Notification Hubs output for a function uses the following JSON object in the `bindings` array of function.json:

	{
		"name": "<Name of output parameter in function signature>",
		"type": "notificationHub",
		"tagExpression": "",
		"hubName": "my-notification-hub",
		"connection": "MyHubConnectionString",
		"direction": "out"
	}


Note the following:

- `tagExpression` : Tag expressions allow you to specify that notifications be delivered to a set of devices who have registered to receive notifications that match the tag expression.  For more information, see [Routing and tag expressions](../notification-hubs/notification-hubs-tags-segment-push-message.md).
- `hubName` : Name of the notification hub resource in the Azure portal.
- `connection` must be the name of an app setting that points to the endpoint for your notification hub (with the value 
`Endpoint=<URL>;SharedAccessKeyName=<access policy name>;SharedAccessKey=<key>`). In Azure Portal, the standard editor in the **Integrate** tab configures
this app setting for you when you create a new notification hub or selects an existing one. To manually create this app setting, see 
[configure this app setting manually](). 
 
<a name="outputusage"></a>
## Output usage

This section shows you how to use your Notification Hubs output binding in your function code. 

In C# and F#, your output parameter can be one the following types: `string`, [`IDictionary<string, string>`](https://msdn.microsoft.com/library/s4ys34ea.aspx), 
and [`Notification`](https://msdn.microsoft.com/library/microsoft.azure.notificationhubs.notification.aspx)
and any of its inherited types. For example, the following C# code outputs a notification as a `string` that contains a JSON. 

	public static void Run(out string notification)
	{
		notification = "{\"message\":\"A notification from C#.\"}";
	}

To use the [`Notification`](https://msdn.microsoft.com/library/microsoft.azure.notificationhubs.notification.aspx) type or
any of its inherited types, you must [create a project.json file](functions-reference.md#fileupdate) for your function app 
with the `Microsoft.Azure.NotificationHubs` package dependency. For example:

	{
		"frameworks": {
			".NETFramework,Version=v4.6": {
				"dependencies": {
					"Microsoft.Azure.NotificationHubs": "1.0.4"
				}
			}
		}
	}

In Node.js, you simply create a JavaScript object and assigns it to `context.bindings.<outputBindingName>`.

Suppose you have the following function.json, that defines a Notification Hubs output:

	{
		"name": "myNotification",
		"type": "notificationHub",
		"tagExpression": "",
		"hubName": "my-notification-hub",
		"connection": "MyHubConnectionString",
		"direction": "out"
	}

See the language-specific sample that sends a notification for a 
[template registration](../notification-hubs/notification-hubs-templates-cross-platform-push-messages.md) 
that contains `location` and `message`.

- [C#](#outcsharp)
- [F#](#outfsharp)
- [Node.js](#outnodejs)

<a name="outcsharp"></a>
### Output usage in C\# 

	using System;
	using System.Threading.Tasks;
	using System.Collections.Generic;
	 
	public static void Run(out IDictionary<string, string> myNotification, TraceWriter log)
	{
        myNotification = new Dictionary<string, string>
        {
            { "location", "Redmond" },
            { "message", "Hello from C#!" }
        };
	}

<a name="outfsharp"></a>
### Output usage in F\# 

	let Run(myNotification: byref<IDictionary<string, string>>) =
	    myNotification = dict [("location", "Redmond"); ("message", "Hello from F#!")]

<a name="outnodejs"></a>
### Output usage in Node.js

	module.exports = function (context) {
	    context.bindings.myNotification = {
	        location: "Redmond",
	        message: "Hello from Node.js!"
	    };
	    context.done();
	};

## Next steps

[AZURE.INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)]
