<properties 
	pageTitle="How to use Azure Service Bus with the WebJobs SDK" 
	description="Learn how to use Azure Service Bus queues and topics with the WebJobs SDK." 
	services="app-service\web, service-bus" 
	documentationCenter=".net" 
	authors="tdykstra" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="06/01/2016" 
	ms.author="tdykstra"/>

# How to use Azure Service Bus with the WebJobs SDK

## Overview

This guide provides C# code samples that show how to trigger a process when an Azure Service Bus message is received. The code samples use [WebJobs SDK](websites-dotnet-webjobs-sdk.md) version 1.x.

The guide assumes you know [how to create a WebJob project in Visual Studio with connection strings that point to your storage account](websites-dotnet-webjobs-sdk-get-started.md).

The code snippets only show functions, not the code that creates the `JobHost` object as in this example:

```
public class Program
{
   public static void Main()
   {
      JobHostConfiguration config = new JobHostConfiguration();
      config.UseServiceBus();
      JobHost host = new JobHost(config);
      host.RunAndBlock();
   }
}
```

A [complete Service Bus code example](https://github.com/Azure/azure-webjobs-sdk-samples/blob/master/BasicSamples/ServiceBus/Program.cs) is in the azure-webjobs-sdk-samples repository on GitHub.com.

## <a id="prerequisites"></a> Prerequisites

To work with Service Bus you have to install the [Microsoft.Azure.WebJobs.ServiceBus](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.ServiceBus/) NuGet package in addition to the other WebJobs SDK packages. 

You also have to set the AzureWebJobsServiceBus connection string in addition to the storage connection strings.  You can do this in the `connectionStrings` section of the App.config file, as shown in the following example:

		<connectionStrings>
		    <add name="AzureWebJobsDashboard" connectionString="DefaultEndpointsProtocol=https;AccountName=[accountname];AccountKey=[accesskey]"/>
		    <add name="AzureWebJobsStorage" connectionString="DefaultEndpointsProtocol=https;AccountName=[accountname];AccountKey=[accesskey]"/>
		    <add name="AzureWebJobsServiceBus" connectionString="Endpoint=sb://[yourServiceNamespace].servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=[yourKey]"/>
		</connectionStrings>

For a sample project that includes the Service Bus connection string setting in the App.config file, see [Service Bus example](https://github.com/Azure/azure-webjobs-sdk-samples/tree/master/BasicSamples/ServiceBus). 

The connection strings can also be set in the Azure runtime environment, which then overrides the App.config settings when the WebJob runs in Azure; for more information, see [Get Started with the WebJobs SDK](websites-dotnet-webjobs-sdk-get-started.md#configure-the-web-app-to-use-your-azure-sql-database-and-storage-account).

## <a id="trigger"></a> How to trigger a function when a Service Bus queue message is received

To write a function that the WebJobs SDK calls when a queue message is received, use the `ServiceBusTrigger` attribute. The attribute constructor takes a parameter that specifies the name of the queue to poll.

### How ServiceBusTrigger works

The SDK receives a message in `PeekLock` mode and calls `Complete` on the message if the function finishes successfully, or calls `Abandon` if the function fails. If the function runs longer than the `PeekLock` timeout, the lock is automatically renewed.

Service Bus does its own poison queue handling which cannot be controlled or configured by the WebJobs SDK. 

### String queue message

The following code sample reads a queue message that contains a string and writes the string to the WebJobs SDK dashboard.

		public static void ProcessQueueMessage([ServiceBusTrigger("inputqueue")] string message, 
		    TextWriter logger)
		{
		    logger.WriteLine(message);
		}

**Note:** If you are creating the queue messages in an application that doesn't use the WebJobs SDK, make sure to set [BrokeredMessage.ContentType](http://msdn.microsoft.com/library/microsoft.servicebus.messaging.brokeredmessage.contenttype.aspx) to "text/plain".

### POCO queue message

The SDK will automatically deserialize a queue message that contains JSON for a POCO [(Plain Old CLR Object](http://en.wikipedia.org/wiki/Plain_Old_CLR_Object)) type. The following code sample reads a queue message that contains a `BlobInformation` object which has a `BlobName` property:

		public static void WriteLogPOCO([ServiceBusTrigger("inputqueue")] BlobInformation blobInfo,
		    TextWriter logger)
		{
		    logger.WriteLine("Queue message refers to blob: " + blobInfo.BlobName);
		}

For code samples showing how to use properties of the POCO to work with blobs and tables in the same function, see the [storage queues version of this article](websites-dotnet-webjobs-sdk-storage-queues-how-to.md#pocoblobs).

If your code that creates the queue message doesn't use the WebJobs SDK, use code similar to the following example:

		var client = QueueClient.CreateFromConnectionString(ConfigurationManager.ConnectionStrings["AzureWebJobsServiceBus"].ConnectionString, "blobadded");
		BlobInformation blobInformation = new BlobInformation () ;
		var message = new BrokeredMessage(blobInformation);
		client.Send(message);

### Types ServiceBusTrigger works with

Besides `string` and POCO  types, you can use the `ServiceBusTrigger` attribute with a byte array or a `BrokeredMessage` object.

## <a id="create"></a> How to create Service Bus queue messages

To write a function that creates a new queue message use the `ServiceBus` attribute and pass in the queue name to the attribute constructor. 


### Create a single queue message in a non-async function

The following code sample uses an output parameter to create a new message in the queue named "outputqueue" with the same content as the message received in the queue named "inputqueue".

		public static void CreateQueueMessage(
		    [ServiceBusTrigger("inputqueue")] string queueMessage,
		    [ServiceBus("outputqueue")] out string outputQueueMessage)
		{
		    outputQueueMessage = queueMessage;
		}

The output parameter for creating a single queue message can be any of the following types:

* `string`
* `byte[]`
* `BrokeredMessage`
* A serializable POCO type that you define. Automatically serialized as JSON.

For POCO type parameters, a queue message is always created when the function ends; if the parameter is null, the SDK creates a queue message that will return null when the message is received and deserialized. For the other types, if the parameter is null no queue message is created.

### Create multiple queue messages or in async functions

To create multiple messages, use  the `ServiceBus` attribute with `ICollector<T>` or `IAsyncCollector<T>`, as shown in the following code sample:

		public static void CreateQueueMessages(
		    [ServiceBusTrigger("inputqueue")] string queueMessage,
		    [ServiceBus("outputqueue")] ICollector<string> outputQueueMessage,
		    TextWriter logger)
		{
		    logger.WriteLine("Creating 2 messages in outputqueue");
		    outputQueueMessage.Add(queueMessage + "1");
		    outputQueueMessage.Add(queueMessage + "2");
		}

Each queue message is created immediately when the `Add` method is called.

## <a id="topics"></a>How to work with Service Bus topics

To write a function that the SDK calls when a message is received on a Service Bus topic, use the `ServiceBusTrigger` attribute with the constructor that takes topic name and subscription name, as shown in the following code sample:

		public static void WriteLog([ServiceBusTrigger("outputtopic","subscription1")] string message,
		    TextWriter logger)
		{
		    logger.WriteLine("Topic message: " + message);
		}

To create a message on a topic, use the `ServiceBus` attribute with a topic name the same way you use it with a queue name.

## Features added in release 1.1

The following features were added in release 1.1:

* Allow deep customization of message processing via `ServiceBusConfiguration.MessagingProvider`.
* `MessagingProvider` supports customization of the Service Bus `MessagingFactory` and `NamespaceManager`.
* A `MessageProcessor` strategy pattern allows you to specify a processor per queue/topic.
* Message processing concurrency is supported by default. 
* Easy customization of `OnMessageOptions` via `ServiceBusConfiguration.MessageOptions`.
* Allow [AccessRights](https://github.com/Azure/azure-webjobs-sdk-samples/blob/master/BasicSamples/ServiceBus/Functions.cs#L71) to be specified on `ServiceBusTriggerAttribute`/`ServiceBusAttribute` (for scenarios where you might not have Manage rights). 

## <a id="queues"></a>Related topics covered by the storage queues how-to article

For information about WebJobs SDK scenarios not specific to Service Bus, see [How to use Azure queue storage with the WebJobs SDK](websites-dotnet-webjobs-sdk-storage-queues-how-to.md). 

Topics covered in that article include the following:

* Async functions
* Multiple instances
* Graceful shutdown
* Use WebJobs SDK attributes in the body of a function
* Set the SDK connection strings in code
* Set values for WebJobs SDK constructor parameters in code
* Trigger a function manually
* Write logs

## <a id="nextsteps"></a> Next steps

This guide has provided code samples that show how to handle common scenarios for working with Azure Service Bus. For more information about how to use Azure WebJobs and the WebJobs SDK, see [Azure WebJobs Recommended Resources](http://go.microsoft.com/fwlink/?linkid=390226).
 
