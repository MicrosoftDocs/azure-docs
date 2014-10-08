<properties urlDisplayName="Queue Service" pageTitle="How to use queue storage from .NET | Microsoft Azure" metaKeywords="Get started Azure queue   Azure asynchronous processing   Azure queue   Azure queue storage   Azure queue .NET   Azure queue storage .NET   Azure queue C#   Azure queue storage C#" description="Learn how to use Microsoft Azure Queue storage to create and delete queues and insert, peek, get, and delete queue messages." metaCanonical="" disqusComments="1" umbracoNaviHide="1" services="storage" documentationCenter=".NET" title="How to use Microsoft Azure Queue Storage" authors="tamram" manager="adinah" />

<tags ms.service="storage" ms.workload="storage" ms.tgt_pltfrm="na" ms.devlang="dotnet" ms.topic="article" ms.date="01/01/1900" ms.author="tamram" />

# How to use Queue Storage from .NET

This guide will show you how to perform common scenarios using the
Azure Queue storage service. The samples are written in C\# code
and use the Azure Storage Client for .NET. The scenarios covered include **inserting**,
**peeking**, **getting**, and **deleting** queue messages, as well as
**creating and deleting queues**. For more information on queues, refer
to the [Next steps][] section.

> [WACOM.NOTE] This guide targets the Azure .NET Storage Client Library 2.x and above. The recommended version is Storage Client Library 4.x, which is available via [NuGet](https://www.nuget.org/packages/WindowsAzure.Storage/) or as part of the [Azure SDK for .NET](/en-us/downloads/). See [How to: Programmatically access Queue storage][] below for more details on obtaining the Storage Client Library.

<h2>Table of contents</h2>

-   [What is Queue Storage][]
-   [Concepts][]
-   [Create an Azure Storage Account][]
-   [Setup an Azure Storage connection string][]
-   [How to: Programmatically access Queue storage][]
-   [How to: Create a queue][]
-   [How to: Insert a message into a queue][]
-   [How to: Peek at the next message][]
-   [How to: Change the contents of a queued message][]
-   [How to: Dequeue the next message][]
-   [How to: Leverage additional options for dequeuing messages][]
-   [How to: Get the queue length][]
-   [How to: Delete a queue][]
-   [Next steps][]

[WACOM.INCLUDE [howto-queue-storage](../includes/howto-queue-storage.md)]

## <h2><a name="create-account"></a><span  class="short-header">Create an account</span>Create an Azure Storage account</h2>

[WACOM.INCLUDE [create-storage-account](../includes/create-storage-account.md)]

## <h2><a name="setup-connection-string"></a><span  class="short-header">Setup a connection string</span>Setup an Azure Storage Connection String</h2>

[WACOM.INCLUDE [storage-configure-connection-string](../includes/storage-configure-connection-string.md)]

## <a name="configure-access"> </a><span  class="short-header">Access programmatically</span>How to: Programmatically access Queue storage

<h3>Obtaining the assembly</h3>
You can use NuGet to obtain the `Microsoft.WindowsAzure.Storage.dll` assembly. Right-click your project in **Solution Explorer** and choose **Manage NuGet Packages**.  Search online for "WindowsAzure.Storage" and click **Install** to install the Azure Storage package and dependencies.

`Microsoft.WindowsAzure.Storage.dll` is also included in the Azure SDK for .NET, which can be downloaded from the <a href="http://www.windowsazure.com/en-us/develop/net/#">.NET Developer Center</a>. The assembly is installed to the `%Program Files%\Microsoft SDKs\Windows Azure\.NET SDK\<sdk-version>\ref\` directory.

<h3>Namespace declarations</h3>
Add the following code namespace declarations to the top of any C\# file
in which you wish to programmatically access Azure Storage:

    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Auth;
	using Microsoft.WindowsAzure.Storage.Queue;

Make sure you reference the `Microsoft.WindowsAzure.Storage.dll` assembly.

<h3>Retrieving your connection string</h3>
You can use the **CloudStorageAccount** type to represent 
your Storage Account information. If you are using a Windows 
Azure project template and/or have a reference to 
Microsoft.WindowsAzure.CloudConfigurationManager, you 
can you use the **CloudConfigurationManager** type
to retrieve your storage connection string and storage account
information from the Azure service configuration:

    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

If you are creating an application with no reference to Microsoft.WindowsAzure.CloudConfigurationManager and your connection string is located in the `web.config` or `app.config` as show above, then you can use **ConfigurationManager** to retrieve the connection string.  You will need to add a reference to System.Configuration.dll to your project, and add another namespace declaration for it:

	using System.Configuration;
	...
	CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
		ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString);

<h3>ODataLib dependencies</h3>
ODataLib dependencies in the Storage Client Library for .NET are resolved through the ODataLib (version 5.0.2) packages available through NuGet and not WCF Data Services.  The ODataLib libraries can be downloaded directly or referenced by your code project through NuGet.  The specific ODataLib packages are [OData], [Edm], and [Spatial].

<h2><a name="create-queue"></a><span  class="short-header">Create a queue</span>How to: Create a queue</h2>

A **CloudQueueClient** object lets you get reference objects for queues.
The following code creates a **CloudQueueClient** object. All code in
this guide uses a storage connection string stored in the Azure
application's service configuration. There are also other ways to create
a **CloudStorageAccount** object. See [CloudStorageAccount][]
documentation for details.

    // Retrieve storage account from connection string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

Use the **queueClient** object to get a reference to the queue you want
to use. You can create the queue if it doesn't exist.

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.GetQueueReference("myqueue");

    // Create the queue if it doesn't already exist
    queue.CreateIfNotExists();

<h2><a name="insert-message"> </a><span  class="short-header">Insert a message</span>How to: Insert a message into a queue</h2>

To insert a message into an existing queue, first create a new
**CloudQueueMessage**. Next, call the **AddMessage** method. A
**CloudQueueMessage** can be created from either a string (in UTF-8
format) or a **byte** array. Here is code which creates a queue (if it
doesn't exist) and inserts the message 'Hello, World':

    // Retrieve storage account from connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the queue client.
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

    // Retrieve a reference to a queue.
    CloudQueue queue = queueClient.GetQueueReference("myqueue");

    // Create the queue if it doesn't already exist.
    queue.CreateIfNotExists();

    // Create a message and add it to the queue.
    CloudQueueMessage message = new CloudQueueMessage("Hello, World");
    queue.AddMessage(message);

<h2><a name="peek-message"></a><span  class="short-header">Peek at the next message</span>How to: Peek at the next message</h2>

You can peek at the message in the front of a queue without removing it
from the queue by calling the **PeekMessage** method.

    // Retrieve storage account from connection string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.GetQueueReference("myqueue");

    // Peek at the next message
    CloudQueueMessage peekedMessage = queue.PeekMessage();

	// Display message.
	Console.WriteLine(peekedMessage.AsString);

<h2><a name="change-contents"></a><span  class="short-header">Change message contents</span>How to: Change the contents of a queued message</h2>

You can change the contents of a message in-place in the queue. If the
message represents a work task, you could use this feature to update the
status of the work task. The following code updates the queue message
with new contents, and sets the visibility timeout to extend another 60
seconds. This saves the state of work associated with the message, and
gives the client another minute to continue working on the message. You
could use this technique to track multi-step workflows on queue
messages, without having to start over from the beginning if a
processing step fails due to hardware or software failure. Typically,
you would keep a retry count as well, and if the message is retried more
than *n* times, you would delete it. This protects against a message
that triggers an application error each time it is processed.

    // Retrieve storage account from connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the queue client.
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

    // Retrieve a reference to a queue.
    CloudQueue queue = queueClient.GetQueueReference("myqueue");

	// Get the message from the queue and update the message contents.
    CloudQueueMessage message = queue.GetMessage();
    message.SetMessageContent("Updated contents.") ;
    queue.UpdateMessage(message, 
        TimeSpan.FromSeconds(0.0),  // Make it visible immediately.
        MessageUpdateFields.Content | MessageUpdateFields.Visibility);

<h2><a name="get-message"></a><span  class="short-header">De-queue the next message</span>How to: De-queue the next message</h2>

Your code de-queues a message from a queue in two steps. When you call
**GetMessage**, you get the next message in a queue. A message returned
from **GetMessage** becomes invisible to any other code reading messages
from this queue. By default, this message stays invisible for 30
seconds. To finish removing the message from the queue, you must also
call **DeleteMessage**. This two-step process of removing a message
assures that if your code fails to process a message due to hardware or
software failure, another instance of your code can get the same message
and try again. Your code calls **DeleteMessage** right after the message
has been processed.

    // Retrieve storage account from connection string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.GetQueueReference("myqueue");

    // Get the next message
    CloudQueueMessage retrievedMessage = queue.GetMessage();

    //Process the message in less than 30 seconds, and then delete the message
    queue.DeleteMessage(retrievedMessage);

<h2><a name="advanced-get"></a><span  class="short-header">More de-queueing options</span>How to: Leverage additional options for de-queuing messages</h2>

There are two ways you can customize message retrieval from a queue.
First, you can get a batch of messages (up to 32). Second, you can set a
longer or shorter invisibility timeout, allowing your code more or less
time to fully process each message. The following code example uses the
**GetMessages** method to get 20 messages in one call. Then it processes
each message using a **foreach** loop. It also sets the invisibility
timeout to five minutes for each message. Note that the 5 minutes starts
for all messages at the same time, so after 5 minutes have passed since
the call to **GetMessages**, any messages which have not been deleted
will become visible again.

    // Retrieve storage account from connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the queue client.
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

    // Retrieve a reference to a queue.
    CloudQueue queue = queueClient.GetQueueReference("myqueue");

    foreach (CloudQueueMessage message in queue.GetMessages(20, TimeSpan.FromMinutes(5)))
    {
        // Process all messages in less than 5 minutes, deleting each message after processing.
        queue.DeleteMessage(message);
    }

<h2><a name="get-queue-length"></a><span  class="short-header">Get the queue length</span>How to: Get the queue length</h2>

You can get an estimate of the number of messages in a queue. The
**FetchAttributes** method asks the Queue service to
retrieve the queue attributes, including the message count. The **ApproximateMethodCount**
property returns the last value retrieved by the
**FetchAttributes** method, without calling the Queue service.

    // Retrieve storage account from connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the queue client.
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

    // Retrieve a reference to a queue.
    CloudQueue queue = queueClient.GetQueueReference("myqueue");

	// Fetch the queue attributes.
	queue.FetchAttributes();

    // Retrieve the cached approximate message count.
    int? cachedMessageCount = queue.ApproximateMessageCount;

	// Display number of messages.
	Console.WriteLine("Number of messages in queue: " + cachedMessageCount);

<h2><a name="delete-queue"></a><span  class="short-header">Delete a queue</span>How to: Delete a queue</h2>

To delete a queue and all the messages contained in it, call the
**Delete** method on the queue object.

    // Retrieve storage account from connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the queue client.
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

    // Retrieve a reference to a queue.
    CloudQueue queue = queueClient.GetQueueReference("myqueue");

    // Delete the queue.
    queue.Delete();

<h2><a name="next-steps"></a>Next steps</h2>

Now that you've learned the basics of Queue storage, follow these links
to learn how to do more complex storage tasks.

<ul>
<li>View the Queue service reference documentation for complete details about available APIs:
  <ul>
    <li><a href="http://go.microsoft.com/fwlink/?LinkID=390731&clcid=0x409">Storage Client Library for .NET reference</a>
    </li>
    <li><a href="http://msdn.microsoft.com/en-us/library/windowsazure/dd179355">REST API reference</a></li>
  </ul>
</li>
<li>Learn about more advanced tasks you can perform with Azure Storage at <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx">Storing and Accessing Data in Azure</a>.</li>
<li>Learn how to work with Azure Storage in backend processes for Azure Websites at <a href="/en-us/documentation/articles/websites-dotnet-webjobs-sdk-get-started/">Get Started with the Azure WebJobs SDK</a>.</li>
<li>View more feature guides to learn about additional options for storing data in Azure.
  <ul>
    <li>Use <a href="/en-us/documentation/articles/storage-dotnet-how-to-use-tables/">Table Storage</a> to store structured data.</li>
    <li>Use <a href="/en-us/documentation/articles/storage-dotnet-how-to-use-blobs/">Blob Storage</a> to store unstructured data.</li>
    <li>Use <a href="/en-us/documentation/articles/sql-database-dotnet-how-to-use/">SQL Database</a> to store relational data.</li>
  </ul>
</li>
</ul>



  [Next Steps]: #next-steps
  [What is Queue Storage]: #what-is
  [Concepts]: #concepts
  [Create an Azure Storage Account]: #create-account
  [Setup an Azure Storage Connection String]: #setup-connection-string
  [How to: Programmatically access Queue storage]: #configure-access
  [How To: Create a Queue]: #create-queue
  [How To: Insert a Message into a Queue]: #insert-message
  [How To: Peek at the Next Message]: #peek-message
  [How To: Change the Contents of a Queued Message]: #change-contents
  [How To: Dequeue the Next Message]: #get-message
  [How To: Leverage Additional Options for Dequeuing Messages]: #advanced-get
  [How To: Get the Queue Length]: #get-queue-length
  [How To: Delete a Queue]: #delete-queue
  [Download and install the Azure SDK for .NET]: /en-us/develop/net/
  [.NET client library reference]: http://go.microsoft.com/fwlink/?LinkID=390731&clcid=0x409
  [Creating a Azure Project in Visual Studio]: http://msdn.microsoft.com/en-us/library/windowsazure/ee405487.aspx 
  [CloudStorageAccount]: http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.cloudstorageaccount_methods.aspx
  [Storing and Accessing Data in Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
  [Configuring Connection Strings]: http://msdn.microsoft.com/en-us/library/windowsazure/ee758697.aspx
  [OData]: http://nuget.org/packages/Microsoft.Data.OData/5.0.2
  [Edm]: http://nuget.org/packages/Microsoft.Data.Edm/5.0.2
  [Spatial]: http://nuget.org/packages/System.Spatial/5.0.2
