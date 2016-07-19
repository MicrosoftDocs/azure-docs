<properties
	pageTitle="Getting started with queue storage and Visual Studio connected services (WebJob projects) | Microsoft Azure"
	description="How to get started using Azure Queue storage in a WebJob project after connecting to a storage account using Visual Studio connected services."
	services="storage"
	documentationCenter=""
	authors="TomArcher"
	manager="douge"
	editor=""/>

<tags
	ms.service="storage"
	ms.workload="web"
	ms.tgt_pltfrm="vs-getting-started"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/18/2016"
	ms.author="tarcher"/>

# Getting started with Azure Queue storage and Visual Studio connected services (WebJob Projects)

[AZURE.INCLUDE [storage-try-azure-tools](../../includes/storage-try-azure-tools.md)]

## Overview

This article describes how get started using Azure Queue storage in a Visual Studio Azure WebJob project after you have created or referenced an Azure storage account by using the Visual Studio  **Add Connected Services** dialog box. When you add a storage account to a WebJob project by using the Visual Studio **Add Connected Services** dialog, the appropriate Azure Storage NuGet packages are installed, the appropriate .NET references are added to the project, and connection strings for the storage account are updated in the App.config file.  

This article provides C# code samples that show how to use the Azure WebJobs SDK version 1.x with the Azure Queue storage service.

Azure Queue storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. A single queue message can be up to 64 KB in size, and a queue can contain millions of messages, up to the total capacity limit of a storage account. See [Get started with Azure Queue Storage using .NET](storage-dotnet-how-to-use-queues.md) for more information. For more information about ASP.NET, see [ASP.NET](http://www.asp.net).



## How to trigger a function when a queue message is received

To write a function that the WebJobs SDK calls when a queue message is received, use the **QueueTrigger** attribute. The attribute constructor takes a string parameter that specifies the name of the queue to poll. To see how to set the queue name dynamically, check out [How to set Configuration Options](#how-to-set-configuration-options).

### String queue messages

In the following example, the queue contains a string message, so **QueueTrigger** is applied to a string parameter named **logMessage** which contains the content of the queue message. The function [writes a log message to the Dashboard](#how-to-write-logs).


		public static void ProcessQueueMessage([QueueTrigger("logqueue")] string logMessage, TextWriter logger)
		{
		    logger.WriteLine(logMessage);
		}

Besides **string**, the parameter may be a byte array, a **CloudQueueMessage** object, or a POCO  that you define.

### POCO [(Plain Old CLR Object](http://en.wikipedia.org/wiki/Plain_Old_CLR_Object)) queue messages

In the following example, the queue message contains JSON for a **BlobInformation** object which includes a **BlobName** property. The SDK automatically deserializes the object.

		public static void WriteLogPOCO([QueueTrigger("logqueue")] BlobInformation blobInfo, TextWriter logger)
		{
		    logger.WriteLine("Queue message refers to blob: " + blobInfo.BlobName);
		}

The SDK uses the [Newtonsoft.Json NuGet package](http://www.nuget.org/packages/Newtonsoft.Json) to serialize and deserialize messages. If you create queue messages in a program that doesn't use the WebJobs SDK, you can write code like the following example to create a POCO queue message that the SDK can parse.

		BlobInformation blobInfo = new BlobInformation() { BlobName = "log.txt" };
		var queueMessage = new CloudQueueMessage(JsonConvert.SerializeObject(blobInfo));
		logQueue.AddMessage(queueMessage);

### Async functions

The following async function [writes a log to the Dashboard](#how-to-write-logs).

		public async static Task ProcessQueueMessageAsync([QueueTrigger("logqueue")] string logMessage, TextWriter logger)
		{
		    await logger.WriteLineAsync(logMessage);
		}

Async functions may take a [cancellation token](http://www.asp.net/mvc/overview/performance/using-asynchronous-methods-in-aspnet-mvc-4#CancelToken), as shown in the following example which copies a blob. (For an explanation of the **queueTrigger** placeholder, see the [Blobs](#how-to-read-and-write-blobs-and-tables-while-processing-a-queue-message) section.)

		public async static Task ProcessQueueMessageAsyncCancellationToken(
		    [QueueTrigger("blobcopyqueue")] string blobName,
		    [Blob("textblobs/{queueTrigger}",FileAccess.Read)] Stream blobInput,
		    [Blob("textblobs/{queueTrigger}-new",FileAccess.Write)] Stream blobOutput,
		    CancellationToken token)
		{
		    await blobInput.CopyToAsync(blobOutput, 4096, token);
		}

## Types the QueueTrigger attribute works with

You can use **QueueTrigger** with the following types:

* **string**
* A POCO type serialized as JSON
* **byte[]**
* **CloudQueueMessage**

## Polling algorithm

The SDK implements a random exponential back-off algorithm to reduce the effect of idle-queue polling on storage transaction costs.  When a message is found, the SDK waits two seconds and then checks for another message; when no message is found it waits about four seconds before trying again. After subsequent failed attempts to get a queue message, the wait time continues to increase until it reaches the maximum wait time, which defaults to one minute. [The maximum wait time is configurable](#how-to-set-configuration-options).

## Multiple instances

If your web app runs on multiple instances, a continuous WebJobs runs on each machine, and each machine will wait for triggers and attempt to run functions. In some scenarios this can lead to some functions processing the same data twice, so functions should be idempotent (written so that calling them repeatedly with the same input data doesn't produce duplicate results).  

## Parallel execution

If you have multiple functions listening on different queues, the SDK will call them in parallel when messages are received simultaneously.

The same is true when multiple messages are received for a single queue. By default, the SDK gets a batch of 16 queue messages at a time and executes the function that processes them in parallel. [The batch size is configurable](#how-to-set-configuration-options). When the number being processed gets down to half of the batch size, the SDK gets another batch and starts processing those messages. Therefore the maximum number of concurrent messages being processed per function is one and a half times the batch size. This limit applies separately to each function that has a **QueueTrigger** attribute. If you don't want parallel execution for messages received on one queue, set the batch size to 1.

## Get queue or queue message metadata

You can get the following message properties by adding parameters to the method signature:

* **DateTimeOffset** expirationTime
* **DateTimeOffset** insertionTime
* **DateTimeOffset** nextVisibleTime
* **string** queueTrigger (contains message text)
* **string** id
* **string** popReceipt
* **int** dequeueCount

If you want to work directly with the Azure storage API, you can also add a **CloudStorageAccount** parameter.

The following example writes all of this metadata to an INFO application log. In the example, both logMessage and queueTrigger contain the content of the queue message.

		public static void WriteLog([QueueTrigger("logqueue")] string logMessage,
		    DateTimeOffset expirationTime,
		    DateTimeOffset insertionTime,
		    DateTimeOffset nextVisibleTime,
		    string id,
		    string popReceipt,
		    int dequeueCount,
		    string queueTrigger,
		    CloudStorageAccount cloudStorageAccount,
		    TextWriter logger)
		{
		    logger.WriteLine(
		        "logMessage={0}\n" +
			"expirationTime={1}\ninsertionTime={2}\n" +
		        "nextVisibleTime={3}\n" +
		        "id={4}\npopReceipt={5}\ndequeueCount={6}\n" +
		        "queue endpoint={7} queueTrigger={8}",
		        logMessage, expirationTime,
		        insertionTime,
		        nextVisibleTime, id,
		        popReceipt, dequeueCount,
		        cloudStorageAccount.QueueEndpoint,
		        queueTrigger);
		}

Here is a sample log written by the sample code:

		logMessage=Hello world!
		expirationTime=10/14/2014 10:31:04 PM +00:00
		insertionTime=10/7/2014 10:31:04 PM +00:00
		nextVisibleTime=10/7/2014 10:41:23 PM +00:00
		id=262e49cd-26d3-4303-ae88-33baf8796d91
		popReceipt=AgAAAAMAAAAAAAAAfc9H0n/izwE=
		dequeueCount=1
		queue endpoint=https://contosoads.queue.core.windows.net/
		queueTrigger=Hello world!

## Graceful shutdown

A function that runs in a continuous WebJob can accept a **CancellationToken** parameter which enables the operating system to notify the function when the WebJob is about to be terminated. You can use this notification to make sure the function doesn't terminate unexpectedly in a way that leaves data in an inconsistent state.

The following example shows how to check for impending WebJob termination in a function.

	public static void GracefulShutdownDemo(
	            [QueueTrigger("inputqueue")] string inputText,
	            TextWriter logger,
	            CancellationToken token)
	{
	    for (int i = 0; i < 100; i++)
	    {
	        if (token.IsCancellationRequested)
	        {
	            logger.WriteLine("Function was cancelled at iteration {0}", i);
	            break;
	        }
	        Thread.Sleep(1000);
	        logger.WriteLine("Normal processing for queue message={0}", inputText);
	    }
	}

**Note:** The Dashboard might not correctly show the status and output of functions that have been shut down.

For more information, see [WebJobs Graceful Shutdown](http://blog.amitapple.com/post/2014/05/webjobs-graceful-shutdown/#.VCt1GXl0wpR).   

## How to create a queue message while processing a queue message

To write a function that creates a new queue message, use the **Queue** attribute. Like **QueueTrigger**, you pass in the queue name as a string or you can [set the queue name dynamically](#how-to-set-configuration-options).

### String queue messages

The following non-async code sample creates a new queue message in the queue named "outputqueue" with the same content as the queue message received in the queue named "inputqueue". (For async functions use **IAsyncCollector<T>** as shown later in this section.)


		public static void CreateQueueMessage(
		    [QueueTrigger("inputqueue")] string queueMessage,
		    [Queue("outputqueue")] out string outputQueueMessage )
		{
		    outputQueueMessage = queueMessage;
		}

### POCO [(Plain Old CLR Object](http://en.wikipedia.org/wiki/Plain_Old_CLR_Object)) queue messages

To create a queue message that contains a POCO rather than a string, pass the POCO type as an output parameter to the **Queue** attribute constructor.

		public static void CreateQueueMessage(
		    [QueueTrigger("inputqueue")] BlobInformation blobInfoInput,
		    [Queue("outputqueue")] out BlobInformation blobInfoOutput )
		{
		    blobInfoOutput = blobInfoInput;
		}

The SDK automatically serializes the object to JSON. A queue message is always created, even if the object is null.

### Create multiple messages or in async functions

To create multiple messages, make the parameter type for the output queue **ICollector<T>** or **IAsyncCollector<T>**, as shown in the following example.

		public static void CreateQueueMessages(
		    [QueueTrigger("inputqueue")] string queueMessage,
		    [Queue("outputqueue")] ICollector<string> outputQueueMessage,
		    TextWriter logger)
		{
		    logger.WriteLine("Creating 2 messages in outputqueue");
		    outputQueueMessage.Add(queueMessage + "1");
		    outputQueueMessage.Add(queueMessage + "2");
		}

Each queue message is created immediately when the **Add** method is called.

### Types that the Queue attribute works with

You can use the **Queue** attribute on the following parameter types:

* **out string** (creates queue message if parameter value is non-null when the function ends)
* **out byte[]** (works like **string**)
* **out CloudQueueMessage** (works like **string**)
* **out POCO** (a serializable type, creates a message with a null object if the paramter is null when the function ends)
* **ICollector**
* **IAsyncCollector**
* **CloudQueue** (for creating messages manually using the Azure Storage API directly)

### Use WebJobs SDK attributes in the body of a function

If you need to do some work in your function before using a WebJobs SDK attribute such as **Queue**, **Blob**, or **Table**, you can use the **IBinder** interface.

The following example takes an input queue message and creates a new message with the same content in an output queue. The output queue name is set by code in the body of the function.

		public static void CreateQueueMessage(
		    [QueueTrigger("inputqueue")] string queueMessage,
		    IBinder binder)
		{
		    string outputQueueName = "outputqueue" + DateTime.Now.Month.ToString();
		    QueueAttribute queueAttribute = new QueueAttribute(outputQueueName);
		    CloudQueue outputQueue = binder.Bind<CloudQueue>(queueAttribute);
		    outputQueue.AddMessage(new CloudQueueMessage(queueMessage));
		}

The **IBinder** interface can also be used with the **Table** and **Blob** attributes.

## How to read and write blobs and tables while processing a queue message

The **Blob** and **Table** attributes enable you to read and write blobs and tables. The samples in this section apply to blobs. For code samples that show how to trigger processes when blobs are created or updated, see [How to use Azure blob storage with the WebJobs SDK](../app-service-web/websites-dotnet-webjobs-sdk-storage-blobs-how-to.md), and for code samples that read and write tables, see [How to use Azure table storage with the WebJobs SDK](../app-service-web/websites-dotnet-webjobs-sdk-storage-tables-how-to.md).

### String queue messages triggering blob operations

For a queue message that contains a string, **queueTrigger** is a placeholder you can use in the **Blob** attribute's **blobPath** parameter that contains the contents of the message.

The following example uses **Stream** objects to read and write blobs. The queue message is the name of a blob located in the textblobs container. A copy of the blob with "-new" appended to the name is created in the same container.

		public static void ProcessQueueMessage(
		    [QueueTrigger("blobcopyqueue")] string blobName,
		    [Blob("textblobs/{queueTrigger}",FileAccess.Read)] Stream blobInput,
		    [Blob("textblobs/{queueTrigger}-new",FileAccess.Write)] Stream blobOutput)
		{
		    blobInput.CopyTo(blobOutput, 4096);
		}

The **Blob** attribute constructor takes a **blobPath** parameter that specifies the container and blob name. For more information about this placeholder, see [How to use Azure blob storage with the WebJobs SDK](../app-service-web/websites-dotnet-webjobs-sdk-storage-blobs-how-to.md).

When the attribute decorates a **Stream** object, another constructor parameter specifies the **FileAccess** mode as read, write, or read/write.

The following example uses a **CloudBlockBlob** object to delete a blob. The queue message is the name of the blob.

		public static void DeleteBlob(
		    [QueueTrigger("deleteblobqueue")] string blobName,
		    [Blob("textblobs/{queueTrigger}")] CloudBlockBlob blobToDelete)
		{
		    blobToDelete.Delete();
		}

### POCO [(Plain Old CLR Object](http://en.wikipedia.org/wiki/Plain_Old_CLR_Object)) queue messages

For a POCO stored as JSON in the queue message, you can use placeholders that name properties of the object in the **Queue** attribute's **blobPath** parameter. You can also use queue metadata property names as placeholders. See [Get queue or queue message metadata](#get-queue-or-queue-message-metadata).

The following example copies a blob to a new blob with a different extension. The queue message is a **BlobInformation** object that includes **BlobName** and **BlobNameWithoutExtension** properties. The property names are used as placeholders in the blob path for the **Blob** attributes.

		public static void CopyBlobPOCO(
		    [QueueTrigger("copyblobqueue")] BlobInformation blobInfo,
		    [Blob("textblobs/{BlobName}", FileAccess.Read)] Stream blobInput,
		    [Blob("textblobs/{BlobNameWithoutExtension}.txt", FileAccess.Write)] Stream blobOutput)
		{
		    blobInput.CopyTo(blobOutput, 4096);
		}

The SDK uses the [Newtonsoft.Json NuGet package](http://www.nuget.org/packages/Newtonsoft.Json) to serialize and deserialize messages. If you create queue messages in a program that doesn't use the WebJobs SDK, you can write code like the following example to create a POCO queue message that the SDK can parse.

		BlobInformation blobInfo = new BlobInformation() { BlobName = "boot.log", BlobNameWithoutExtension = "boot" };
		var queueMessage = new CloudQueueMessage(JsonConvert.SerializeObject(blobInfo));
		logQueue.AddMessage(queueMessage);

If you need to do some work in your function before binding a blob to an object, you can use the attribute in the body of the function, as shown in [Use WebJobs SDK attributes in the body of a function](#use-webjobs-sdk-attributes-in-the-body-of-a-function).

###Types you can use the Blob attribute with

The **Blob** attribute can be used with the following types:

* **Stream** (read or write, specified by using the FileAccess constructor parameter)
* **TextReader**
* **TextWriter**
* **string** (read)
* **out string** (write; creates a blob only if the string parameter is non-null when the function returns)
* POCO (read)
* out POCO (write; always creates a blob, creates as null object if POCO parameter is null when the function returns)
* **CloudBlobStream** (write)
* **ICloudBlob** (read or write)
* **CloudBlockBlob** (read or write)
* **CloudPageBlob** (read or write)

##How to handle poison messages

Messages whose content causes a function to fail are called *poison messages*. When the function fails, the queue message is not deleted and eventually is picked up again, causing the cycle to be repeated. The SDK can automatically interrupt the cycle after a limited number of iterations, or you can do it manually.

### Automatic poison message handling

The SDK will call a function up to 5 times to process a queue message. If the fifth try fails, the message is moved to a poison queue. You can see how to configure the maximum number of retries in [How to set configuration options](#how-to-set-configuration-options).

The poison queue is named *{originalqueuename}*-poison. You can write a function to process messages from the poison queue by logging them or sending a notification that manual attention is needed.

In the following example the **CopyBlob** function will fail when a queue message contains the name of a blob that doesn't exist. When that happens, the message is moved from the copyblobqueue queue to the copyblobqueue-poison queue. The **ProcessPoisonMessage** then logs the poison message.

		public static void CopyBlob(
		    [QueueTrigger("copyblobqueue")] string blobName,
		    [Blob("textblobs/{queueTrigger}", FileAccess.Read)] Stream blobInput,
		    [Blob("textblobs/{queueTrigger}-new", FileAccess.Write)] Stream blobOutput)
		{
		    blobInput.CopyTo(blobOutput, 4096);
		}

		public static void ProcessPoisonMessage(
		    [QueueTrigger("copyblobqueue-poison")] string blobName, TextWriter logger)
		{
		    logger.WriteLine("Failed to copy blob, name=" + blobName);
		}

The following illustration shows console output from these functions when a poison message is processed.

![Console output for poison message handling](./media/vs-storage-webjobs-getting-started-queues/poison.png)

### Manual poison message handling

You can get the number of times a message has been picked up for processing by adding an **int** parameter named **dequeueCount** to your function. You can then check the dequeue count in function code and perform your own poison message handling when the number exceeds a threshold, as shown in the following example.

		public static void CopyBlob(
		    [QueueTrigger("copyblobqueue")] string blobName, int dequeueCount,
		    [Blob("textblobs/{queueTrigger}", FileAccess.Read)] Stream blobInput,
		    [Blob("textblobs/{queueTrigger}-new", FileAccess.Write)] Stream blobOutput,
		    TextWriter logger)
		{
		    if (dequeueCount > 3)
		    {
		        logger.WriteLine("Failed to copy blob, name=" + blobName);
		    }
		    else
		    {
		    blobInput.CopyTo(blobOutput, 4096);
		    }
		}

## How to set configuration options

You can use the **JobHostConfiguration** type to set the following configuration options:

* Set the SDK connection strings in code.
* Configure **QueueTrigger** settings such as maximum dequeue count.
* Get queue names from configuration.

###Set SDK connection strings in code

Setting the SDK connection strings in code enables you to use your own connection string names in configuration files or environment variables, as shown in the following example.

		static void Main(string[] args)
		{
		    var _storageConn = ConfigurationManager
		        .ConnectionStrings["MyStorageConnection"].ConnectionString;

		    var _dashboardConn = ConfigurationManager
		        .ConnectionStrings["MyDashboardConnection"].ConnectionString;

		    var _serviceBusConn = ConfigurationManager
		        .ConnectionStrings["MyServiceBusConnection"].ConnectionString;

		    JobHostConfiguration config = new JobHostConfiguration();
		    config.StorageConnectionString = _storageConn;
		    config.DashboardConnectionString = _dashboardConn;
		    config.ServiceBusConnectionString = _serviceBusConn;
		    JobHost host = new JobHost(config);
		    host.RunAndBlock();
		}

### Configure QueueTrigger  settings

You can configure the following settings that apply to the queue message processing:

- The maximum number of queue messages that are picked up simultaneously to be executed in parallel (default is 16).
- The maximum number of retries before a queue message is sent to a poison queue (default is 5).
- The maximum wait time before polling again when a queue is empty (default is 1 minute).

The following example shows how to configure these settings:

		static void Main(string[] args)
		{
		    JobHostConfiguration config = new JobHostConfiguration();
		    config.Queues.BatchSize = 8;
		    config.Queues.MaxDequeueCount = 4;
		    config.Queues.MaxPollingInterval = TimeSpan.FromSeconds(15);
		    JobHost host = new JobHost(config);
		    host.RunAndBlock();
		}

### Set values for WebJobs SDK constructor parameters in code

Sometimes you want to specify a queue name, a blob name or container, or a table name in code rather than hard-code it. For example, you might want to specify the queue name for **QueueTrigger** in a configuration file or environment variable.

You can do that by passing in a **NameResolver** object to the **JobHostConfiguration** type. You include special placeholders surrounded by percent (%) signs in WebJobs SDK attribute constructor parameters, and your **NameResolver** code specifies the actual values to be used in place of those placeholders.

For example, suppose you want to use a queue named logqueuetest in the test environment and one named logqueueprod in production. Instead of a hard-coded queue name, you want to specify the name of an entry in the **appSettings** collection that would have the actual queue name. If the **appSettings** key is logqueue, your function could look like the following example.

		public static void WriteLog([QueueTrigger("%logqueue%")] string logMessage)
		{
		    Console.WriteLine(logMessage);
		}

Your **NameResolver** class could then get the queue name from **appSettings** as shown in the following example:

		public class QueueNameResolver : INameResolver
		{
		    public string Resolve(string name)
		    {
		        return ConfigurationManager.AppSettings[name].ToString();
		    }
		}

You pass the **NameResolver** class in to the **JobHost** object as shown in the following example.

		static void Main(string[] args)
		{
		    JobHostConfiguration config = new JobHostConfiguration();
		    config.NameResolver = new QueueNameResolver();
		    JobHost host = new JobHost(config);
		    host.RunAndBlock();
		}

**Note:** Queue, table, and blob names are resolved each time a function is called, but blob container names are resolved only when the application starts. You can't change blob container name while the job is running.

## How to trigger a function manually

To trigger a function manually, use the **Call** or **CallAsync** method on the **JobHost** object and the **NoAutomaticTrigger** attribute on the function, as shown in the following example.

		public class Program
		{
		    static void Main(string[] args)
		    {
		        JobHost host = new JobHost();
		        host.Call(typeof(Program).GetMethod("CreateQueueMessage"), new { value = "Hello world!" });
		    }

		    [NoAutomaticTrigger]
		    public static void CreateQueueMessage(
		        TextWriter logger,
		        string value,
		        [Queue("outputqueue")] out string message)
		    {
		        message = value;
		        logger.WriteLine("Creating queue message: ", message);
		    }
		}

## How to write logs

The Dashboard shows logs in two places: the page for the WebJob, and the page for a particular WebJob invocation.

![Logs in WebJob page](./media/vs-storage-webjobs-getting-started-queues/dashboardapplogs.png)

![Logs in function invocation page](./media/vs-storage-webjobs-getting-started-queues/dashboardlogs.png)

Output from Console methods that you call in a function or in the **Main()** method appears in the Dashboard page for the WebJob, not in the page for a particular method invocation. Output from the TextWriter object that you get from a parameter in your method signature appears in the Dashboard page for a method invocation.

Console output can't be linked to a particular method invocation because the Console is single-threaded, while many job functions may be running at the same time. That's why the  SDK provides each function invocation with its own unique log writer object.

To write [application tracing logs](web-sites-dotnet-troubleshoot-visual-studio.md#logsoverview), use **Console.Out** (creates logs marked as INFO) and **Console.Error** (creates logs marked as ERROR). An alternative is to use [Trace or TraceSource](http://blogs.msdn.com/b/mcsuksoldev/archive/2014/09/04/adding-trace-to-azure-web-sites-and-web-jobs.aspx), which provides Verbose, Warning, and Critical levels in addition to Info and Error. Application tracing logs appear in the web app log files, Azure tables, or Azure blobs depending on how you configure your Azure web app. As is true of all Console output, the most recent 100 application logs also appear in the Dashboard page for the WebJob, not the page for a function invocation.

Console output appears in the Dashboard only if the program is running in an Azure WebJob, not if the program is running locally or in some other environment.

You can disable logging by setting the Dashboard connection string to null. For more information, see [How to set Configuration Options](#how-to-set-configuration-options).

The following example shows several ways to write logs:

		public static void WriteLog(
		    [QueueTrigger("logqueue")] string logMessage,
		    TextWriter logger)
		{
		    Console.WriteLine("Console.Write - " + logMessage);
		    Console.Out.WriteLine("Console.Out - " + logMessage);
		    Console.Error.WriteLine("Console.Error - " + logMessage);
		    logger.WriteLine("TextWriter - " + logMessage);
		}

In the WebJobs SDK Dashboard, the output from the **TextWriter** object shows up when you go to the page for a particular function invocation and select **Toggle Output**:

![Invocation link](./media/vs-storage-webjobs-getting-started-queues/dashboardinvocations.png)

![Logs in function invocation page](./media/vs-storage-webjobs-getting-started-queues/dashboardlogs.png)

In the WebJobs SDK Dashboard, the most recent 100 lines of Console output show up when you go to the page for the WebJob (not for the function invocation) and select **Toggle Output**.

![Toggle output](./media/vs-storage-webjobs-getting-started-queues/dashboardapplogs.png)

In a continuous WebJob, application logs show up in /data/jobs/continuous/*{webjobname}*/job_log.txt in the web app file system.

		[09/26/2014 21:01:13 > 491e54: INFO] Console.Write - Hello world!
		[09/26/2014 21:01:13 > 491e54: ERR ] Console.Error - Hello world!
		[09/26/2014 21:01:13 > 491e54: INFO] Console.Out - Hello world!

In an Azure blob the application logs look like this:
		2014-09-26T21:01:13,Information,contosoadsnew,491e54,635473620738373502,0,17404,17,Console.Write - Hello world!,
		2014-09-26T21:01:13,Error,contosoadsnew,491e54,635473620738373502,0,17404,19,Console.Error - Hello world!,
		2014-09-26T21:01:13,Information,contosoadsnew,491e54,635473620738529920,0,17404,17,Console.Out - Hello world!,

And in an Azure table the **Console.Out** and **Console.Error** logs look like this:

![Info log in table](./media/vs-storage-webjobs-getting-started-queues/tableinfo.png)

![Error log in table](./media/vs-storage-webjobs-getting-started-queues/tableerror.png)

##Next steps

This article has provided code samples that show how to handle common scenarios for working with Azure queues. For more information about how to use Azure WebJobs and the WebJobs SDK, see [Azure WebJobs documentation resources](http://go.microsoft.com/fwlink/?linkid=390226).
