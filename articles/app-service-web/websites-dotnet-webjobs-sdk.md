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
	ms.date="06/01/2016" 
	ms.author="tdykstra"/>

# What is the Azure WebJobs SDK

## <a id="overview"></a>Overview

This article explains what the WebJobs SDK is, reviews some common scenarios it is useful for, and gives an overview of how you use it in your code.

[WebJobs](websites-webjobs-resources.md) is a feature of Azure App Service that enables you to run a program or script in the same context as a web app, API app, or mobile app. The purpose of the [WebJobs SDK](websites-webjobs-resources.md) is to simplify the code you write for common tasks that a WebJob can perform, such as image processing, queue processing, RSS aggregation, file maintenance, and sending emails. The WebJobs SDK has built-in features for working with Azure Storage and Service Bus, for scheduling tasks and handling errors, and for many other common scenarios. In addition, it's designed to be extensible. The [WebJobs SDK is open source](https://github.com/Azure/azure-webjobs-sdk/), and there's an [open source repository for extensions](https://github.com/Azure/azure-webjobs-sdk-extensions/wiki/Binding-Extensions-Overview).

The WebJobs SDK includes the following components:

* **NuGet packages**. NuGet packages that you add to a Visual Studio Console Application project provide a framework that your code uses by decorating your methods with WebJobs SDK attributes.
  
* **Dashboard**. Part of the WebJobs SDK is included in Azure App Service and provides rich monitoring and diagnostics for programs that use the NuGet packages. You don't have to write code to use these monitoring and diagnostics features.

## <a id="scenarios"></a>Scenarios

Here are some typical scenarios you can handle more easily with the Azure WebJobs SDK:

* Image processing or other CPU-intensive work. A common feature of websites is the ability to upload images or videos. Often you want to manipulate the content after it's uploaded, but you don't want to make the user wait while you do that.

* Queue processing. A common way for a web frontend to communicate with a backend service is to use queues. When the website needs to get work done, it pushes a message onto a queue. A backend service pulls messages from the queue and does the work. You could use queues for image processing: for example, after the user uploads a number of files, put the file names in a queue message to be picked up by the backend for processing. Or you could use queues to improve site responsiveness. For example, instead of writing directly to a SQL database, write to a queue, tell the user you're done, and let the backend service handle high-latency relational database work. For an example of queue processing with image process, see the [WebJobs SDK Get Started tutorial](websites-dotnet-webjobs-sdk-get-started.md).

* RSS aggregation. If you have a site that maintains a list of RSS feeds, you could pull in all of the articles from the feeds in a background process.

* File maintenance, such as aggregating or cleaning up log files.  You might have log files being created by several sites or for separate time spans which you want to combine in order to run analysis jobs on them. Or you might want to schedule a task to run weekly to clean up old log files.

* Ingress into Azure Tables. You might have files stored and blobs and want to parse them and store the data in tables. The ingress function could be writing lots of rows (millions in some cases), and the WebJobs SDK makes it possible to implement this functionality easily. The SDK also provides real-time monitoring of progress indicators such as the number of rows written in the table.

* Other long-running tasks that you want to run in a background thread, such as [sending emails](https://github.com/victorhurdugaci/AzureWebJobsSamples/tree/master/SendEmailOnFailure). 

* Any tasks that you want to run on a schedule, such as performing a back-up operation every night.

In many of these scenarios you may want to scale a web app to run on multiple VMs, which would run multiple WebJobs simultaneously. In some scenarios this could result in the same data getting processed multiple times, but this is not a problem when you use the built-in queue, blob, and Service Bus triggers of the WebJobs SDK. The SDK ensures that your functions will be processed only once for each message or blob.

The WebJobs SDK also makes it easy to handle common error handling scenarios. You can set up alerts to send notifications when a function fails, and you can set timeouts so that a function is automatically canceled if it doesn't complete within a specified time limit.

## <a id="code"></a> Code samples

The code for handling typical tasks that work with Azure Storage is simple. In your Console Application's `Main` method you create a `JobHost` object that coordinates the calls to methods you write. The WebJobs SDK framework knows when to call your methods and what parameter values to use based on the WebJobs SDK attributes you use in them. The SDK provides *triggers* that specify what conditions cause the function to be called, and *binders* that specify how to get information into and out of method parameters.

For example, the [QueueTrigger](websites-dotnet-webjobs-sdk-storage-queues-how-to.md) attribute causes a function to be called when a message is received on a queue, and if the message format is JSON for a byte array or a custom type, the message is automatically deserialized. The [BlobTrigger](websites-dotnet-webjobs-sdk-storage-blobs-how-to.md) attribute triggers a process whenever a new blob is created in an Azure Storage account.

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

Because the `ProcessQueueMessage` method in this example has a `QueueTrigger` attribute, the trigger for that function is the reception of a new queue message. The `JobHost` object watches for new queue messages on the specified queue ("webjobsqueue" in this sample) and when one is found, it calls `ProcessQueueMessage`. 

The `QueueTrigger` attribute binds the `inputText` parameter to the value of the queue message. And the `Blob` attribute binds a `TextWriter` object to a blob named "blobname" in a container named "containername".  

		public static void ProcessQueueMessage([QueueTrigger("webjobsqueue")]] string inputText, 
		    [Blob("containername/blobname")]TextWriter writer)

The function then uses these parameters to write the value of the queue message to the blob:

		writer.WriteLine(inputText);

The trigger and binder features of the WebJobs SDK greatly simplify the code you have to write. The low-level code required to process queues, blobs, or files, or to initiate scheduled tasks, is done for you by the WebJobs SDK framework. For example, the framework creates queues that don't exist yet, opens the queue, reads queue messages, deletes queue messages when processing is completed, creates blob containers that don't exist yet, writes to blobs, and so on.

The following code example shows a variety of triggers in one WebJob: `QueueTrigger`, `FileTrigger`, `WebHookTrigger`, and `ErrorTrigger`. 

```
    public class Functions
    {
        public static void ProcessQueueMessage([QueueTrigger("queue")] string message,
        TextWriter log)
        {
            log.WriteLine(message);
        }

        public static void ProcessFileAndUploadToBlob(
            [FileTrigger(@"import\{name}", "*.*", autoDelete: true)] Stream file,
            [Blob(@"processed/{name}", FileAccess.Write)] Stream output,
            string name,
            TextWriter log)
        {
            output = file;
            file.Close();
            log.WriteLine(string.Format("Processed input file '{0}'!", name));
        }

        [Singleton]
        public static void ProcessWebHookA([WebHookTrigger] string body, TextWriter log)
        {
            log.WriteLine(string.Format("WebHookA invoked! Body: {0}", body));
        }

        public static void ProcessGitHubWebHook([WebHookTrigger] string body, TextWriter log)
        {
            dynamic issueEvent = JObject.Parse(body);
            log.WriteLine(string.Format("GitHub WebHook invoked! ('{0}', '{1}')",
                issueEvent.issue.title, issueEvent.action));
        }

        public static void ErrorMonitor(
        [ErrorTrigger("00:01:00", 1)] TraceFilter filter, TextWriter log,
        [SendGrid(
            To = "admin@emailaddress.com",
            Subject = "Error!")]
         SendGridMessage message)
        {
            // log last 5 detailed errors to the Dashboard
            log.WriteLine(filter.GetDetailedMessage(5));
            message.Text = filter.GetDetailedMessage(1);
        }
    }
```

## <a id="schedule"></a> Scheduling

The `TimerTrigger` attribute gives you the ability to trigger functions to run on a schedule. You can schedule a WebJob as a whole through Azure or schedule individual functions of a WebJob using the WebJobs SDK `TimerTrigger`. Here's a code sample.

```
public class Functions
{
    public static void ProcessTimer([TimerTrigger("*/15 * * * * *", RunOnStartup = true)]
    TimerInfo info, [Queue("queue")] out string message)
    {
        message = info.FormatNextOccurrences(1);
    }
}
```

For more sample code, see [TimerSamples.cs](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/ExtensionsSample/Samples/TimerSamples.cs) in the azure-webjobs-sdk-extensions repository on GitHub.com.

## Extensibility

You're not limited to built-in functionality -- the WebJobs SDK allows you to write custom triggers and binders.  For example, you can write triggers for cache events and periodic schedules. An [open source repository](https://github.com/Azure/azure-webjobs-sdk-extensions) contains a [detailed guide on WebJobs SDK extensibility](https://github.com/Azure/azure-webjobs-sdk-extensions/wiki/Binding-Extensions-Overview) and sample code to help get you started writing your own triggers and binders.

## <a id="workerrole"></a>Using the WebJobs SDK outside of WebJobs

A program that uses the the WebJobs SDK is a standard Console Application and can run anywhere -- it doesn't have to run as a WebJob. You can test the program locally on your development computer, and in production you can run it in a Cloud Service worker role or a Windows service if you prefer one of those environments. 

However, the dashboard is only available as an extension for an Azure App Service web app. If you want to run outside of a WebJob and still use the Dashboard, you can configure a web app to use the same storage account that your WebJobs SDK Dashboard connection string refers to, and that web app's WebJobs Dashboard will then show data about function execution from your program that is running somewhere else. You can get to the Dashboard by using the URL https://*{webappname}*.scm.azurewebsites.net/azurejobs/#/functions. For more information, see [Getting a dashboard for local development with the WebJobs SDK](http://blogs.msdn.com/b/jmstall/archive/2014/01/27/getting-a-dashboard-for-local-development-with-the-webjobs-sdk.aspx), but note that the blog post shows an old connection string name. 

## <a id="nostorage"></a>Dashboard features

The WebJobs SDK provides several advantages even if you don't use WebJobs SDK triggers or binders:

* You can invoke functions from the Dashboard.
* You can replay functions from the Dashboard.
* You can view logs in the Dashboard, linked to the particular WebJob (application logs, written by using Console.Out, Console.Error, Trace, etc.) or linked to the particular function invocation that generated them (logs written by using a `TextWriter` object that the SDK passes to the function as a parameter). 

For more information, see [How to manually invoke a function](websites-dotnet-webjobs-sdk-storage-queues-how-to.md#manual) and [How to write logs](websites-dotnet-webjobs-sdk-storage-queues-how-to.md#logs) 

## <a id="nextsteps"></a>Next steps

For more information about the WebJobs SDK, see [Azure WebJobs Recommended Resources](http://go.microsoft.com/fwlink/?linkid=390226).

For information about the latest enhancements to the WebJobs SDK, see the [Release Notes](https://github.com/Azure/azure-webjobs-sdk/wiki/Release-Notes).
 
