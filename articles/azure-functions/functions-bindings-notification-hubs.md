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
	ms.date="05/16/2016"
	ms.author="wesmc"/>

# Azure Functions Notification Hub output binding

This article explains how to configure and code Azure Notification Hub bindings in Azure Functions. 

[AZURE.INCLUDE [intro](../../includes/functions-bindings-intro.md)] 

Your functions can send push notifications using a configured Azure Notification Hub with a very few lines of code. However, the notification hub must be configured for the Platform Notifications Services (PNS) you want to use. For more information on configuring an Azure Notification Hub and developing a client applications that register to receive notifications, see [Getting started with Notification Hubs](../notification-hubs/notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md) and click your target client platform at the top.

## function.json for Azure Notification Hub output binding

The function.json file provides the following properties:

- `name` : Variable name used in function code for the notification hub message.
- `type` : must be set to *"notificationHub"*.
- `tagExpression` : Tag expressions allow you to specify that notifications be delivered to a set of devices who have registered to receive notifications that match the tag expression.  For more information, see [Routing and tag expressions](../notification-hubs/notification-hubs-tags-segment-push-message.md).
- `hubName` : Name of the notification hub resource in the Azure portal.
- `connection` : This connection string must be an **Application Setting** connection string set to the *DefaultFullSharedAccessSignature* value for your notification hub.
- `direction` : must be set to *"out"*. 
 
Example function.json:

	{
	  "bindings": [
	    {
	      "name": "notification",
	      "type": "notificationHub",
	      "tagExpression": "",
	      "hubName": "my-notification-hub",
	      "connection": "MyHubConnectionString",
	      "direction": "out"
	    }
	  ],
	  "disabled": false
	}

## Azure Notification Hub connection string setup

To use a Notification hub output binding you must configure the connection string for the hub. You can do this on the *Integrate* tab by simply selecting your notification hub or creating a new one. 

You can also manually add a connection string for an existing hub by adding a connection string for the *DefaultFullSharedAccessSignature* to your notification hub. This connection string provides your function access permission to send notification messages. The *DefaultFullSharedAccessSignature* connection string value can be accessed from the **keys** button in the main blade of your notification hub resource in the Azure portal. To manually add a connection string for your hub, use the following steps: 

1. On the **Function app** blade of the Azure portal, click **Function App Settings > Go to App Service settings**.

2. In the **Settings** blade, click **Application Settings**.

3. Scroll down to the **Connection strings** section, and add an named entry for *DefaultFullSharedAccessSignature* value for you notification hub. Change the type to **Custom**.
4. Reference your connection string name in the output bindings. Similar to **MyHubConnectionString** used in the example above.

## Azure Notification Hub code example for a Node.js timer trigger 

This example sends a notification for a [template registration](../notification-hubs/notification-hubs-templates-cross-platform-push-messages.md) that contains `location` and `message`.

	module.exports = function (context, myTimer) {
	    var timeStamp = new Date().toISOString();
	   
	    if(myTimer.isPastDue)
	    {
	        context.log('Node.js is running late!');
	    }
	    context.log('Node.js timer trigger function ran!', timeStamp);  
	    context.bindings.notification = {
	        location: "Redmond",
	        message: "Hello from Node!"
	    };
	    context.done();
	};

## Azure Notification Hub code example for a C# queue trigger

This example sends a notification for a [template registration](../notification-hubs/notification-hubs-templates-cross-platform-push-messages.md) that contains `message`.


	using System;
	using System.Threading.Tasks;
	using System.Collections.Generic;
	 
	public static void Run(string myQueueItem,  out IDictionary<string, string> notification, TraceWriter log)
	{
	    log.Info($"C# Queue trigger function processed: {myQueueItem}");
        notification = GetTemplateProperties(myQueueItem);
	}
	 
	private static IDictionary<string, string> GetTemplateProperties(string message)
	{
	    Dictionary<string, string> templateProperties = new Dictionary<string, string>();
	    templateProperties["message"] = message;
	    return templateProperties;
	}

This example sends a notification for a [template registration](../notification-hubs/notification-hubs-templates-cross-platform-push-messages.md) that contains `message` using a valid JSON string.

	using System;
	 
	public static void Run(string myQueueItem,  out string notification, TraceWriter log)
	{
		log.Info($"C# Queue trigger function processed: {myQueueItem}");
		notification = "{\"message\":\"Hello from C#. Processed a queue item!\"}";
	}

## Azure Notification Hub queue trigger C# code example using Notification type

This example shows how to use the `Notification` type that is defined in the [Microsoft Azure Notification Hubs Library](https://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/). In order to use this type, and the library, you must upload a *project.json* file for your function app. The project.json file is a JSON text file which will look similar to the follow:

	{
	  "frameworks": {
	    ".NETFramework,Version=v4.6": {
	      "dependencies": {
	        "Microsoft.Azure.NotificationHubs": "1.0.4"
	      }
	    }
	  }
	}

For more information on uploading your project.json file, see [uploading a project.json file](functions-reference.md#fileupdate).

Example code:

	using System;
	using System.Threading.Tasks;
	using Microsoft.Azure.NotificationHubs;
	 
	public static void Run(string myQueueItem,  out Notification notification, TraceWriter log)
	{
	   log.Info($"C# Queue trigger function processed: {myQueueItem}");
	   notification = GetTemplateNotification(myQueueItem);
	}
	private static TemplateNotification GetTemplateNotification(string message)
	{
	    Dictionary<string, string> templateProperties = new Dictionary<string, string>();
	    templateProperties["message"] = message;
	    return new TemplateNotification(templateProperties);
	}

## Next steps

[AZURE.INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)]
