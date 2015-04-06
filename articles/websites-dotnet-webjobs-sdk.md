<properties 
	pageTitle="What is the Azure WebJobs SDK" 
	description="An introduction to the Azure WebJobs SDK. Explains what the SDK is, typical scenarios it is useful for, and code samples." 
	services="app-service\web, storage" 
	documentationCenter=".net" 
	authors="tdykstra" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/03/2015" 
	ms.author="tdykstra"/>

# What is the Azure WebJobs SDK

## <a id="overview"></a>Overview

This article explains what the WebJobs SDK is, reviews some common scenarios it is useful for, and gives an overview of how you use it in your code.

[WebJobs](web-sites-create-web-jobs.md) is a feature of Azure App Service that enables you to run a program or script in the same context as a web app. The purpose of the WebJobs SDK is to simplify the task of writing code that runs as a WebJob and works with Azure Storage queues, blobs, and tables, and Service Bus queues.

The WebJobs SDK includes the following components:

* **NuGet packages**. NuGet packages that you add to a Visual Studio Console Application project provide a framework your code uses to work with the Azure Storage service or Service Bus queues.   
  
* **Dashboard**. Part of the WebJobs SDK is included in Azure App Service and provides rich monitoring and diagnostics for programs that use the NuGet packages. You don't have to write code to use these monitoring and diagnostics features.

## <a id="scenarios"></a>Scenarios

Here are some typical scenarios you can handle more easily with the Azure WebJobs SDK:

* Image processing or other CPU-intensive work. A common feature of websites is the ability to upload images or videos. Often you want to manipulate the content after it's uploaded, but you don't want to make the user wait while you do that.

* Queue processing. A common way for a web frontend to communicate with a backend service is to use queues. When the website needs to get work done, it pushes a message onto a queue. A backend service pulls messages from the queue and does the work. You could use queues for image processing: for example, after the user uploads a number of files, put the file names in a queue message to be picked up by the backend for processing. Or you could use queues to improve site responsiveness. For example, instead of writing directly to a SQL database, write to a queue, tell the user you're done, and let the backend service handle high-latency relational database work. For an example of queue processing with image process, see the [WebJobs SDK Get Started tutorial](websites-dotnet-webjobs-sdk-get-started.md).

* RSS aggregation. If you have a site that maintains a list of RSS feeds, you could pull in all of the articles from the feeds in a background process.

* File maintenance, such as aggregating or cleaning up log files.  You might have log files being created by several sites or for separate time spans which you want to combine in order to run analysis jobs on them. Or you might want to schedule a task to run weekly to clean up old log files.

* Ingress into Azure Tables. You might have files stored and blobs and want to parse them and store the data in tables. The ingress function could be writing lots of rows (millions in some cases), and the WebJobs SDK makes it possible to implement this functionality easily. The SDK also provides real-time monitoring of progress indicators such as the number of rows written in the table.

* Other long-running tasks that you want to run in a background thread, such as [sending emails](https://github.com/victorhurdugaci/AzureWebJobsSamples/tree/master/SendEmailOnFailure). 

## <a id="code"></a> Code samples

The code for handling typical tasks that work with Azure Storage is simple. In a Console Application, you write methods for the background tasks that you want to execute, and you decorate them with attributes from the WebJobs SDK. Your `Main` method creates a `JobHost` object that coordinates the calls to methods you write. The WebJobs SDK framework knows when to call your methods based on the WebJobs SDK attributes you use in them. 

Here is a simple program that polls a queue and creates a blob for each queue message received:

		public static void Main()
		{
		    JobHost host = new JobHost();
		    host.RunAndBlock();
		}

		public static void ProcessQueueMessage([QueueTrigger("webjobsqueue")] string inputText, 
            [Blob("containername/blobname")]TextWriter writer)
		{
		    writer.WriteLine(inputText);
		}

The `JobHost` object is a container for a set of background functions. The `JobHost` object monitors the functions, watches for events that trigger them, and executes the functions when trigger events occur. You call a `JobHost` method to indicate whether you want the container process to run on the current thread or a background thread. In the example, the `RunAndBlock` method runs the process continuously on the current thread.

Because the `ProcessQueueMessage` method in this example has a `QueueTrigger` attribute, the trigger for that function is the reception of a new queue message. The `JobHost` object watches for new queue messages on the specified queue ("webjobsqueue" in this sample) and when one is found, it calls `ProcessQueueMessage`. The `QueueTrigger` attribute also notifies the framework to bind the `inputText` parameter to the value of the queue message: 

<pre class="prettyprint">public static void ProcessQueueMessage([QueueTrigger(&quot;webjobsqueue&quot;)]] <mark>string inputText</mark>, 
    [Blob("containername/blobname")]TextWriter writer)</pre>

The framework also binds a `TextWriter` object to a blob named "blobname" in a container named "containername":

<pre class="prettyprint">public static void ProcessQueueMessage([QueueTrigger(&quot;webjobsqueue&quot;)]] string inputText, 
    <mark>[Blob("containername/blobname")]TextWriter writer</mark>)</pre>

The function then uses these parameters to write the value of the queue message to the blob:

		writer.WriteLine(inputText);

The trigger and binder features of the WebJobs SDK greatly simplify the code you have to write to work with Azure Storage and Service Bus queues. The low-level code required to handle queue and blob processing is done for you by the WebJobs SDK framework -- the framework creates queues that don't exist yet, opens the queue, reads queue messages, deletes queue messages when processing is completed, creates blob containers that don't exist yet, writes to blobs, and so on.

The WebJobs SDK provides many ways to work with  Azure Storage. For example, if the parameter you decorate with the `QueueTrigger` attribute is a byte array or a custom type, it is automatically deserialized from JSON. And you can use a `BlobTrigger` attribute to trigger a process whenever a new blob is created in an Azure Storage account. (Note that while `QueueTrigger` finds new queue messages within a few seconds, `BlobTrigger` can take up to 20 minutes to detect a new blob. `BlobTrigger` scans for blobs whenever the `JobHost` starts and then periodically checks the Azure Storage logs to detect new blobs.)

## <a id="workerrole"></a>Using the WebJobs SDK outside of WebJobs

A program that uses the the WebJobs SDK is a standard Console Application and can run anywhere -- it doesn't have to run as a WebJob. You can test the program locally on your development computer, and in production you can run it in a Cloud Service worker role or a Windows service if you prefer one of those environments. 

However, the dashboard is only available as an extension for an Azure App Service web app. If you want to run outside of a WebJob and still use the Dashboard, you can configure a web app to use the same storage account that your WebJobs SDK Dashboard connection string refers to, and that web app's WebJobs Dashboard will then show data about function execution from your program that is running somewhere else. You can get to the Dashboard by using the URL https://*{webappname}*.scm.azurewebsites.net/azurejobs/#/functions. For more information, see [Getting a dashboard for local development with the WebJobs SDK](http://blogs.msdn.com/b/jmstall/archive/2014/01/27/getting-a-dashboard-for-local-development-with-the-webjobs-sdk.aspx), but note that the blog post shows an old connection string name. 

## <a id="nostorage"></a>Using the WebJobs SDK to invoke any function

The WebJobs SDK provides several advantages even if you don't need to work directly with Azure Storage queues, tables, or blobs, or Service Bus queues:

* You can invoke functions from the Dashboard.
* You can replay functions from the Dashboard.
* You can view logs in the Dashboard, linked to the particular WebJob (application logs, written by using Console.Out, Console.Error, Trace, etc.) or linked to the particular function invocation that generated them (logs written by using a `TextWriter` object that the SDK passes to the function as a parameter). 

* For more information, see [How to manually invoke a function](websites-dotnet-webjobs-sdk-storage-queues-how-to.md#manual) and [How to write logs](websites-dotnet-webjobs-sdk-storage-queues-how-to.md#logs) 

## <a id="nextsteps"></a>Next steps

For more information about the WebJobs SDK, see [Azure WebJobs Recommended Resources](http://go.microsoft.com/fwlink/?linkid=390226).
