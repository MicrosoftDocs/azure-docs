<properties
	pageTitle="Azure Functions DocumentDB bindings | Microsoft Azure"
	description="Understand how to use Azure DocumentDB bindings in Azure Functions."
	services="functions"
	documentationCenter="na"
	authors="christopheranderson"
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
	ms.author="chrande"/>

# Azure Functions DocumentDB bindings

This article explains how to configure and code Azure DocumentDB bindings in Azure Functions. 

[AZURE.INCLUDE [intro](../../includes/functions-bindings-intro.md)] 

## <a id="docdbinput"></a> Azure DocumentDB input binding

Input bindings can load a document from a DocumentDB collection and pass it directly to your binding. The document id can be determined based on the trigger that invoked the function. In a C# function, any changes made to the record will be automatically sent back to the collection when the function exits successfully.

#### function.json for DocumentDB input binding

The *function.json* file provides the following properties:

- `name` : Variable name used in function code for the document.
- `type` : must be set to "documentdb".
- `databaseName` : The database containing the document.
- `collectionName` : The collection containing the document.
- `id` : The Id of the document to retrieve. This property supports bindings similar to "{queueTrigger}", which will use the string value of the queue message as the document Id.
- `connection` : This string must be an Application Setting set to the endpoint for your DocumentDB account. If you choose your account from the Integrate tab, a new App setting will be created for you with a name that takes the following form, yourAccount_DOCUMENTDB. If you need to manually create the App setting, the actual connection string must take the following form, AccountEndpoint=<Endpoint for your account>;AccountKey=<Your primary access key>;.
- `direction  : must be set to *"in"*.

Example *function.json*:
 
	{
	  "bindings": [
	    {
	      "name": "document",
	      "type": "documentdb",
	      "databaseName": "MyDatabase",
	      "collectionName": "MyCollection",
	      "id" : "{queueTrigger}",
	      "connection": "MyAccount_DOCUMENTDB",     
	      "direction": "in"
	    }
	  ],
	  "disabled": false
	}

#### Azure DocumentDB input code example for a C# queue trigger
 
Using the example function.json above, the DocumentDB input binding will retrieve the document with the id that matches the queue message string and pass it to the 'document' parameter. If that document is not found, the 'document' parameter will be null. The document is then updated with the new text value when the function exits.
 
	public static void Run(string myQueueItem, dynamic document)
	{   
	    document.text = "This has changed.";
	}

#### Azure DocumentDB input code example for a Node.js queue trigger
 
Using the example function.json above, the DocumentDB input binding will retrieve the document with the id that matches the queue message string and pass it to the `documentIn` binding property. In Node.js functions, updated documents are not sent back to the collection. However, you can pass the input binding directly to a DocumentDB output binding named `documentOut` to support updates. This code example updates the text property of the input document and sets it as the output document.
 
	module.exports = function (context, input) {   
	    context.bindings.documentOut = context.bindings.documentIn;
	    context.bindings.documentOut.text = "This was updated!";
	    context.done();
	};

## <a id="docdboutput"></a> Azure DocumentDB output bindings

Your functions can write JSON documents to an Azure DocumentDB database using the **Azure DocumentDB Document** output binding. For more information on Azure DocumentDB review the [Introduction to DocumentDB](../documentdb/documentdb-introduction.md) and the [Getting Started tutorial](../documentdb/documentdb-get-started.md).

#### function.json for DocumentDB output binding

The function.json file provides the following properties:

- `name` : Variable name used in function code for the new document.
- `type` : must be set to *"documentdb"*.
- `databaseName` : The database containing the collection where the new document will be created.
- `collectionName` : The collection where the new document will be created.
- `createIfNotExists` : This is a boolean value to indicate whether the collection will be created if it does not exist. The default is *false*. The reason for this is new collections are created with reserved throughput, which has pricing implications. For more details, please visit the [pricing page](https://azure.microsoft.com/pricing/details/documentdb/).
- `connection` : This string must be an **Application Setting** set to the endpoint for your DocumentDB account. If you choose your account from the **Integrate** tab, a new App setting will be created for you with a name that takes the following form, `yourAccount_DOCUMENTDB`. If you need to manually create the App setting, the actual connection string must take the following form, `AccountEndpoint=<Endpoint for your account>;AccountKey=<Your primary access key>;`. 
- `direction` : must be set to *"out"*. 
 
Example function.json:

	{
	  "bindings": [
	    {
	      "name": "document",
	      "type": "documentdb",
	      "databaseName": "MyDatabase",
	      "collectionName": "MyCollection",
	      "createIfNotExists": false,
	      "connection": "MyAccount_DOCUMENTDB",
	      "direction": "out"
	    }
	  ],
	  "disabled": false
	}


#### Azure DocumentDB output code example for a Node.js queue trigger

	module.exports = function (context, input) {
	   
	    context.bindings.document = {
	        text : "I'm running in a Node function! Data: '" + input + "'"
	    }   
	 
	    context.done();
	};

The output document:

	{
	  "text": "I'm running in a Node function! Data: 'example queue data'",
	  "id": "01a817fe-f582-4839-b30c-fb32574ff13f"
	}
 

#### Azure DocumentDB output code example for a C# queue trigger


	using System;

	public static void Run(string myQueueItem, out object document, TraceWriter log)
	{
	    log.Info($"C# Queue trigger function processed: {myQueueItem}");
	   
	    document = new {
	        text = $"I'm running in a C# function! {myQueueItem}"
	    };
	}


#### Azure DocumentDB output code example setting file name

If you want to set the name of the document in the function, just set the `id` value.  For example, if JSON content for an employee was being dropped into the queue similar to the following:

	{
	  "name" : "John Henry",
      "employeeId" : "123456",
	  "address" : "A town nearby"
	}

You could use the following C# code in a queue trigger function: 
	
	#r "Newtonsoft.Json"
	
	using System;
	using Newtonsoft.Json;
	using Newtonsoft.Json.Linq;
	
	public static void Run(string myQueueItem, out object employeeDocument, TraceWriter log)
	{
	    log.Info($"C# Queue trigger function processed: {myQueueItem}");
	    
	    dynamic employee = JObject.Parse(myQueueItem);
	    
	    employeeDocument = new {
	        id = employee.name + "-" + employee.employeeId,
	        name = employee.name,
	        employeeId = employee.employeeId,
	        address = employee.address
	    };
	}

Example output:

	{
	  "id": "John Henry-123456",
	  "name": "John Henry",
	  "employeeId": "123456",
	  "address": "A town nearby"
	}

## Next steps

[AZURE.INCLUDE [next steps](../../includes/functions-bindings-next-steps.md)]
