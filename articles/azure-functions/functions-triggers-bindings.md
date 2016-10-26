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
	ms.date="10/25/2016"
	ms.author="chrande"/>

# Azure Functions triggers and bindings developer reference

## Overview

Triggers are event responses used to trigger your custom code. This allows you to respond to events across Azure or on premise. Bindings represent the necessary meta data used to connect your code to the desired trigger or associated input or output data.

To get a better idea of the scope of bindings you can integrate with your Azure Function app, refer to the table below.

[AZURE.INCLUDE [dynamic compute](../../includes/functions-bindings.md)]  

As an example, suppose you want to execute your code when a new item is dropped into an Azure Storage queue. You would need the following binding information to monitor the queue: the storage account where the queue exists, the queue name, and a variable name that your code would use to refer to the new item that was dropped into the queue.  Here is an example queue trigger binding that could be used.

    {
      "name": "myNewQueueItem",
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


## Supported binding features for your code

#### Returning a single output - $return

In cases where your function code returns a single output, you can use an output binding named `$return` to retain a more natural function signature in your code. The binding would be similar to the following blob output binding that is used with a queue trigger.

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


Language | Example using a named output binding | Example with $return 
-----|---------|---------
Node.js | ```JavaScript
module.exports = function (context, input) {
    var json = JSON.stringify(input);
    context.log('Node.js script processed queue message', json);
    context.bindings.output = json;
    context.done();
} ``` | ```JavaScript
module.exports = function (context, input) {
    var json = JSON.stringify(input);
    context.log('Node.js script processed queue message', json);
    context.done(null, json);
} ```
C# | ```csharp
public static void Run(WorkItem input, out string output, TraceWriter log)
{
    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
    log.Info($"C# script processed queue message. Item={json}");
    output = json;
} ``` | ```csharp
public static string Run(WorkItem input, TraceWriter log)
{
    string json = string.Format("{{ \"id\": \"{0}\" }}", input.Id);
    log.Info($"C# script processed queue message. Item={json}");
    return json;
}
F# | ```
let Run(input: WorkItem, output: byref<string>, log: TraceWriter) =
    let json = String.Format("{{ \"id\": \"{0}\" }}", input.Id)   
    log.Info(sprintf "F# script processed queue message '%s'" json)
    output <- json ``` | ```
let Run(input: WorkItem, log: TraceWriter) =
    let json = String.Format("{{ \"id\": \"{0}\" }}", input.Id)   
    log.Info(sprintf "F# script processed queue message '%s'" json)
    json ```

This can only be used with languages that support a return value (C#, Node.js, F#). This can also be used with multiple output parameters if you want to designate a single output with `$return`.



- You can use %% and {} binding functionality...
- There is also a syntax for adding random Guids...
- #load

## Trigger and bindings types with code examples

The following articles explain how to configure and code specific types of triggers and bindings in Azure Functions. These articles assume that you've read the [Azure Functions developer reference](functions-reference.md), and the [C#](functions-reference-csharp.md), [F#](functions-reference-fsharp.md), or [Node.js](functions-reference-node.md) developer reference articles.

Click on a trigger or binding listed below to learn more:

[AZURE.INCLUDE [functions-selector-bindings](../../includes/functions-selector-bindings.md)]

## Next steps

For more information, see the following resources:

* [Testing a function](functions-test-a-function.md)
* [Scale a function](functions-scale.md)
