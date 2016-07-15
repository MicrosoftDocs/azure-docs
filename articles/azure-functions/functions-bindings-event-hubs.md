<properties
	pageTitle="Azure Functions Event Hub bindings | Microsoft Azure"
	description="Understand how to use Azure Event Hub bindings in Azure Functions."
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
	ms.date="05/27/2016"
	ms.author="wesmc"/>

# Azure Functions Event Hub bindings

This article explains how to configure and code [Azure Event Hub](../event-hubs/event-hubs-overview.md) bindings for Azure Functions. Azure functions supports trigger and output bindings for Azure Event Hubs.

[AZURE.INCLUDE [intro](../../includes/functions-bindings-intro.md)] 


## Azure Event Hub trigger binding

An Azure Event Hub trigger can be used to respond to an event sent to an event hub event stream. You must have read access to the event hub to setup a trigger binding.

#### function.json for Event Hub trigger binding

The *function.json* file for an Azure Event Hub trigger specifies the following properties:

- `type` : Must be set to *eventHubTrigger*.
- `name` : The variable name used in function code for the event hub message. 
- `direction` : Must be set to *in*. 
- `path` : The name of the event hub.
- `connection` : The name of an app setting that contains the connection string to the namespace that the event hub resides in. Copy this connection string by clicking the **Connection Information** button for the namespace, not the event hub itself.  This connection string must have at least read permissions to activate the trigger.

		{
		  "bindings": [
		    {
		      "type": "eventHubTrigger",
		      "name": "myEventHubMessage",
		      "direction": "in",
		      "path": "MyEventHub",
		      "connection": "myEventHubReadConnectionString"
		    }
		  ],
		  "disabled": false
		}

#### Azure Event Hub trigger C# example
 
Using the example function.json above, the body of the event message will be logged using the C# function code below:
 
	using System;
	
	public static void Run(string myEventHubMessage, TraceWriter log)
	{
	    log.Info($"C# Event Hub trigger function processed a message: {myEventHubMessage}");
	}

#### Azure Event Hub trigger Node.js example
 
Using the example function.json above, the body of the event message will be logged using the Node.js function code below:
 
	module.exports = function (context, myEventHubMessage) {
	    context.log('Node.js eventhub trigger function processed work item', myEventHubMessage);	
	    context.done();
	};


## Azure Event Hub output binding

An Azure Event Hub output binding is used to write events to an event hub event stream. You must have send permission to an event hub to write events to it. 

#### function.json for Event Hub output binding

The *function.json* file for an Azure Event Hub output binding specifies the following properties:

- `type` : Must be set to *eventHub*.
- `name` : The variable name used in function code for the event hub message. 
- `path` : The name of the event hub.
- `connection` : The name of an app setting that contains the connection string to the namespace that the event hub resides in. Copy this connection string by clicking the **Connection Information** button for the namespace, not the event hub itself.  This connection string must have send permissions to send the message to the Event Hub stream.
- `direction` : Must be set to *out*. 

	    {
	      "type": "eventHub",
	      "name": "outputEventHubMessage",
	      "path": "myeventhub",
	      "connection": "MyEventHubSend",
	      "direction": "out"
	    }


#### Azure Event Hub C# code example for output binding
 
The following C# example function code demonstrates writing a event to an Event Hub event stream. This example represents the Event Hub output binding shown above applied to a C# timer trigger.  
 
	using System;
	
	public static void Run(TimerInfo myTimer, out string outputEventHubMessage, TraceWriter log)
	{
	    String msg = $"TimerTriggerCSharp1 executed at: {DateTime.Now}";
	
	    log.Verbose(msg);   
	    
	    outputEventHubMessage = msg;
	}

#### Azure Event Hub Node.js code example for output binding
 
The following Node.js example function code demonstrates writing a event to an Event Hub event stream. This example represents the Event Hub output binding shown above applied to a Node.js timer trigger.  
 
	module.exports = function (context, myTimer) {
	    var timeStamp = new Date().toISOString();
	    
	    if(myTimer.isPastDue)
	    {
	        context.log('TimerTriggerNodeJS1 is running late!');
	    }

	    context.log('TimerTriggerNodeJS1 function ran!', timeStamp);   
	    
	    context.bindings.outputEventHubMessage = "TimerTriggerNodeJS1 ran at : " + timeStamp;
	
	    context.done();
	};

## Next steps

[AZURE.INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)]
