<properties
	pageTitle="Azure Functions triggers and bindings | Microsoft Azure"
	description="Understand how to use triggers and bindings in Azure Functions."
	services="functions"
	documentationCenter="na"
	authors="christopheranderson"
	manager="erikre"
	editor=""
	tags=""
	keywords="azure functions, functions, event processing, webhooks, dynamic compute, serverless architecture"/>

<tags
	ms.service="functions"
	ms.devlang="multiple"
	ms.topic="reference"
	ms.tgt_pltfrm="multiple"
	ms.workload="na"
	ms.date="10/27/2016"
	ms.author="chrande"/>

# Azure Functions triggers and bindings developer reference


This topic provides reference for triggers and bindings along with some of the advanced binding features you can use with your function apps. 

If you are looking for information regarding how to configure and code specific types of triggers and bindings in Azure Functions, click on a trigger or binding listed below to learn more:

[AZURE.INCLUDE [functions-selector-bindings](../../includes/functions-selector-bindings.md)] 

These articles assume that you've read the [Azure Functions developer reference](functions-reference.md), and the [C#](functions-reference-csharp.md), [F#](functions-reference-fsharp.md), or [Node.js](functions-reference-node.md) developer reference articles.



## Overview

Triggers are event responses used to trigger your custom code. This allows you to respond to events across Azure or on premise. Bindings represent the necessary meta data used to connect your code to the desired trigger or associated input or output data.

To get a better idea of the bindings you can integrate with your Azure Function app, refer to the table below.

[AZURE.INCLUDE [dynamic compute](../../includes/functions-bindings.md)]  

Suppose you want to execute some code when a new item is dropped into an Azure Storage queue. You could use an Azure Queue trigger to do this. You would need the following binding information to monitor the queue: the storage account where the queue exists, the queue name, and a variable name that your code would use to refer to the new item that was dropped into the queue.  Here is an example queue trigger binding that could be used with provisioning new user accounts in a system.

    {
      "name": "myNewUserQueueItem",
      "type": "queueTrigger",
      "direction": "in",
      "queueName": "queue-newusers",
      "connection": "MY_STORAGE_ACCT_APP_SETTING"
    }

Your code may want to send different types of output depending on how the new queue item is processed. For example, you might want to write a new record to an Azure Storage table.  To accomplish this you would setup an output binding that indicates the Storage connection of the table with the table name. The binding would also contain a variable name that you would use to refer to that table. Here is an example storage table output binding you might use. 

    {
      "type": "table",
      "name": "myOutputNewUserTable",
      "tableName": "newUserTable",
      "connection": "MY_TABLE_STORAGE_ACCT_APP_SETTING",
      "direction": "out"
    }


## Advanced binding features for your code

To use some of the more advanced binding features in the Azure Portal, click the **Advanced Editor** option on the **Integrate** tab of your function. This will allow you to edit the *function.json* directly in the portal.

#### Dynamic parameter binding 

Instead of a static configuration setting for your output binding properties, you can configure the settings to be dynamically bound to data that is part of your trigger's input binding. Consider a scenario where new orders are processed using an Azure Storage queue. Each new queue item will be a JSON string containing at least the following properties.

	{
	  name : "Customer Name",
	  address : "Customer's Address".
	  mobileNumber : "Customer's mobile number."
	}

You might want to send the customer an SMS text message using your Twilio account as an update that the order was received.  You can configure the `body` and `to` field of your Twilio output binding to be dynamically bound to the `name` and `mobileNumber` that were part of the input as follows.

    {
      "name": "myNewOrderItem",
      "type": "queueTrigger",
      "direction": "in",
      "queueName": "queue-newOrders",
      "connection": "orders_STORAGE"
    },
    {
      "type": "twilioSms",
      "name": "message",
      "accountSid": "TwilioAccountSid",
      "authToken": "TwilioAuthToken",
      "to": "{mobileNumber}",
      "from": "+XXXYYYZZZZ",
      "body": "Thank you {name}, your order was received",
      "direction": "out"
    },
 
Now your function code only has to initialize the output parameter as follows. During execution the output properties will be bound to the desired input data.

C#

    // Even if you want to use a hard coded message and number in the binding, you must at least 
    // initialize the message variable.
    message = new SMSMessage();

    // When using dynamic parameter binding no need to set this in code.
	// message.body = msg;
	// message.to = myNewOrderItem.mobileNumber

Node.js

    context.bindings.message = {
        // When using dynamic parameter binding no need to set this in code.
        //body : msg,
        //to : myNewOrderItem.mobileNumber
    };




#### Random GUIDs

Azure Functions provides a syntax to generate random GUIDs with your bindings. For example, if your function code needed to write output to a new BLOB with a unique name in an Azure Storage container, you could use a BLOB output binding with `{rand-guid}` in the path. Here is an example BLOB output binding that demonstrates this. 

	{
	  "type": "blob",
	  "name": "blobOutput",
	  "direction": "out",
	  "path": "my-output-container/{rand-guid}"
	}



#### Returning a single output

In cases where your function code returns a single output, you can use an output binding named `$return` to retain a more natural function signature in your code. This can only be used with languages that support a return value (C#, Node.js, F#). The binding would be similar to the following blob output binding that is used with a queue trigger.

	{
	  "bindings": [
	    {
	      "type": "queueTrigger",
	      "name": "input",
	      "direction": "in",
	      "queueName": "test-input-node"
	    },
	    {
	      "type": "blob",
	      "name": "$return",
	      "direction": "out",
	      "path": "test-output-node/{id}"
	    }
	  ]
	}


The following C# code returns the output more naturally without using an `out` parameter in the function signature.


	public static string Run(WorkItem input, TraceWriter log)
	{
	    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
	    log.Info($"C# script processed queue message. Item={json}");
	    return json;
	}

	// Async example
	public static Task<string> Run(WorkItem input, TraceWriter log)
	{
	    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
	    log.Info($"C# script processed queue message. Item={json}");
	    return json;
	}


This same approach is demonstrated below with Node.js.

	module.exports = function (context, input) {
	    var json = JSON.stringify(input);
	    context.log('Node.js script processed queue message', json);
	    context.done(null, json);
	}

F# example provided below.

	let Run(input: WorkItem, log: TraceWriter) =
	    let json = String.Format("{{ \"id\": \"{0}\" }}", input.Id)   
	    log.Info(sprintf "F# script processed queue message '%s'" json)
	    json

This can also be used with multiple output parameters by designating a single output with `$return`.


#### Route support

By default when you create a function for an HTTP trigger, or WebHook, the function is addressable with a route of the form:

	http://<yourapp>.azurewebsites.net/api/<funcname> 

You can customize this route using the optional `route` property on the HTTP trigger's input binding. As an example, the following *function.json* file defines a `route` property for an HTTP trigger:

	{
	  "bindings": [
	    {
	      "type": "httpTrigger",
	      "name": "req",
	      "direction": "in",
	      "methods": [ "get" ],
	      "route": "products/{category:alpha}/{id:int?}"
	    },
	    {
	      "type": "http",
	      "name": "res",
	      "direction": "out"
	    }
	  ]
	}

Using this configuration, the function is now addressable with the following route instead of the original route.

	http://<yourapp>.azurewebsites.net/api/products/electronics/357

This allows the function code to support two parameters in the address, `category` and `id`. The following C# function code makes use of both parameters as an example.

	public static Task<HttpResponseMessage> Run(
	     HttpRequestMessage request, string category, int? id, TraceWriter log)
	{
	    ...
	}

Here is Node.js function code to use the same route parameters.

	module.exports = function (context, req) {
	    var category = context.bindingData.category;
	    var id = context.bindingData.id;
	
	    ...
	} 

By default, all function routes are prefixed with *api*. You can also customize this, or remove it, using the `http.routePrefix` property in your *function.json* file. The following example remove the *api* route prefix by using an empty string.

	{
	  "http": {
	    "routePrefix": ""
	  },
	  "bindings": [
	    {
	      "type": "httpTrigger",
	      "name": "req",
	      "direction": "in",
	      "methods": [ "get" ],
	      "route": "products/{category:alpha}/{id:int?}"
	    },
	    {
	      "type": "http",
	      "name": "res",
	      "direction": "out"
	    }
	  ]
	}

Using this configuration, the function is now addressable with the following route.

	http://<yourapp>.azurewebsites.net/products/electronics/357





## Next steps

For more information, see the following resources:

* [Testing a function](functions-test-a-function.md)
* [Scale a function](functions-scale.md)
