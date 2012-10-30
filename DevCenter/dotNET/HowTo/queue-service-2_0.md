<properties linkid="dev-net-how-to-queue-service" urldisplayname="Queue Service" headerexpose="" pagetitle="How to Use the Queue Storage Service from .NET" metakeywords="Get started Azure queue, Azure asynchronous processing, Azure queue, Azure queue storage, Azure queue .NET, Azure queue storage .NET, Azure queue C#, Azure queue storage C#" footerexpose="" metadescription="Learn how to use the Windows Azure queue storage service to create and delete queues and insert, peek, get, and delete queue messages." umbraconavihide="0" disquscomments="1"></properties>

# How to use the Queue Storage Service

<div class="dev-center-tutorial-selector">
<a href="/en-us/develop/net/how-to-guides/queue-service-v17/" title="version 1.7">version 1.7</a>
<a href="/en-us/develop/net/how-to-guides/queue-service/" title="version 2.0" class="current">version 2.0</a> 
</div>


This guide will show you how to perform common scenarios using the
Windows Azure Queue storage service. The samples are written in C\# code
and use the Windows Azure Storage Client for .NET (Version 2.0). The scenarios covered include **inserting**,
**peeking**, **getting**, and **deleting** queue messages, as well as
**creating and deleting queues**. For more information on queues, refer
to the [Next steps][] section.

<h2>Table of contents</h2>

-   [What is Queue Storage][]
-   [Concepts][]
-   [Create a Windows Azure Storage Account][]
-   [Setup a Windows Azure Storage connection string][]
-   [How to: Programmatically access queues using .NET][]
-   [How to: Create a queue][]
-   [How to: Insert a message into a queue][]
-   [How to: Peek at the next message][]
-   [How to: Change the contents of a queued message][]
-   [How to: Dequeue the next message][]
-   [How to: Leverage additional options for dequeuing messages][]
-   [How to: Get the queue length][]
-   [How to: Delete a queue][]
-   [Next steps][]

<div chunk="../../Shared/Chunks/howto-queue-storage.md" />

<h2><a name="create-account"></a><span  class="short-header">Create an account</span>Create a Windows Azure Storage account</h2>

<div chunk="../../Shared/Chunks/create-storage-account.md" />

<h2><a name="setup-connection-string"></a><span  class="short-header">Setup a connection string</span>Setup a Windows Azure Storage Connection String</h2>

The Windows Azure Storage Client Library for .NET supports using a storage connection
string to configure endpoints and credentials for accessing storage
services. You can put your storage connection string in a configuration
file, rather than hard-coding it in code:

- When using Windows Azure Cloud Services, it is recommended you store your connection string using the Windows Azure service configuration system (`*.csdef` and `*.cscfg` files).
- When using Windows Azure Web Sites, Windows Azure Virtual Machines, or building .NET applications that are intentded to run outside of Windows Azure, it is recommended you store your connection string using the .NET configuration system (e.g. `web.config` or `app.config` file).

In both cases, you can retrieve your connection string using the `CloudConfigurationManager.GetSetting` method, as shown later in this guide.

### Configuring your connection string when using Cloud Services

The service configuration mechanism is unique to Windows Azure Cloud Services
projects and enables you to dynamically change configuration settings
from the Windows Azure Management Portal without redeploying your
application.

To configure your connection string in the Windows Azure service
configuration:

1.  Within the Solution Explorer of Visual Studio, in the **Roles**
    folder of your Windows Azure Deployment Project, right-click your
    web role or worker role and click **Properties**.  
    ![Blob5][]

2.  Click the **Settings** tab and press the **Add Setting** button.  
    ![Blob6][]

    A new **Setting1** entry will then show up in the settings grid.

3.  In the **Type** drop-down of the new **Setting1** entry, choose
    **Connection String**.  
    ![Blob7][]

4.  Click the **...** button at the right end of the **Setting1** entry.
    The **Storage Account Connection String** dialog will open.

5.  Choose whether you want to target the storage emulator (the Windows
    Azure storage simulated on your local machine) or an actual storage
    account in the cloud. The code in this guide works with either
    option. Enter the **Primary Access Key** value copied from the
    earlier step in this tutorial if you wish to store queue data in the
    storage account we created earlier on Windows Azure.   
    ![Blob8][]

6.  Change the entry **Name** from **Setting1** to a "friendlier" name
    like **StorageConnectionString**. You will reference this
    connection string later in the code in this guide.  
    ![Blob9][]
	
### Configuring your connection string using .NET configuration

Unless you are using Windows Azure Cloud Services (see previous section), it is recommended you use the .NET configuration system (e.g. `web.config` or `app.config`).  This includes Windows Azure Web Sites or Windows Azure Virtual Machines, as well as applications designed to run outside of Windows Azure.  You store the connection string using the `<connectionStrings>` element as follows:

	<configuration>
	    <connectionStrings>
		    <add name="StorageConnectionString"
			     connectionString="DefaultEndpointsProtocol=https;AccountName=[AccountName];AccountKey=[AccountKey]" />
		</connectionStrings>
	</configuration>

Read [Configuring Connection Strings][] for more information on storage connection strings.
	
You are now ready to perform the how-to tasks in this guide.

<h2><a name="access"></a><span  class="short-header">Access programmatically</span>How to: Programmatically access queues using .NET</h2>

<h3>Obtaining the assembly</h3>
To obtain version 2.0 of the Windows Azure Storage Client Library, you can use NuGet. Right-click your project in Solution Explorer and choose Manage NuGet Packages. Type "windowsazure.storage" (including the quotes) into the search box to locate the package.

<h3>Namespace declarations</h3>
Add the following code namespace declarations to the top of any C\# file
in which you wish to programmatically access Windows Azure Storage:

    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Auth;
	using Microsoft.WindowsAzure.Storage.Queue;

Make sure you reference the Microsoft.WindowsAzure.Storage.dll assembly.

<h3>Retrieving your connection string</h3>
You can use the **CloudStorageAccount** type to represent 
your Storage Account information. If you are using a Windows 
Azure project template and/or have a reference to 
Microsoft.WindowsAzure.CloudConfigurationManager, you 
can you use the **CloudConfigurationManager** type
to retrieve your storage connection string and storage account
information from the Windows Azure service configuration:

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
this guide uses a storage connection string stored in the Windows Azure
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

Now that you've learned the basics of queue storage, follow these links
to learn how to do more complex storage tasks.

<ul>
<li>View the queue service reference documentation for complete details about available APIs:
  <ul>
    <li><a href="http://msdn.microsoft.com/en-us/library/windowsazure/wl_svchosting_mref_reference_home">.NET client library reference</a>
    </li>
    <li><a href="http://msdn.microsoft.com/en-us/library/windowsazure/dd179355">REST API reference</a></li>
  </ul>
</li>
<li>Learn about more advanced tasks you can perform with Windows Azure Storage at <a href="http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx">Storing and Accessing Data in Windows Azure</a>.</li>
<li>View more feature guides to learn about additional options for storing data in Windows Azure.
  <ul>
    <li>Use <a href="/en-us/develop/net/how-to-guides/table-services/">Table Storage</a> to store structured data.</li>
    <li>Use <a href="/en-us/develop/net/how-to-guides/blob-storage/">Blob Storage</a> to store unstructured data.</li>
    <li>Use <a href="/en-us/develop/net/how-to-guides/sql-database/">SQL Database</a> to store relational data.</li>
  </ul>
</li>
</ul>



  [Next Steps]: #next-steps
  [What is Queue Storage]: #what-is
  [Concepts]: #concepts
  [Create a Windows Azure Storage Account]: #create-account
  [Setup a Windows Azure Storage Connection String]: #setup-connection-string
  [How to: Programmatically access queues using .NET]: #access
  [How To: Create a Queue]: #create-queue
  [How To: Insert a Message into a Queue]: #insert-message
  [How To: Peek at the Next Message]: #peek-message
  [How To: Change the Contents of a Queued Message]: #change-contents
  [How To: Dequeue the Next Message]: #get-message
  [How To: Leverage Additional Options for Dequeuing Messages]: #advanced-get
  [How To: Get the Queue Length]: #get-queue-length
  [How To: Delete a Queue]: #delete-queue
  [Download and install the Windows Azure SDK for .NET]: /en-us/develop/net/
  [Creating a Windows Azure Project in Visual Studio]: http://msdn.microsoft.com/en-us/library/windowsazure/ee405487.aspx
  [Blob5]: ../../../DevCenter/dotNet/Media/blob5.png
  [Blob6]: ../../../DevCenter/dotNet/Media/blob6.png
  [Blob7]: ../../../DevCenter/dotNet/Media/blob7.png
  [Blob8]: ../../../DevCenter/dotNet/Media/blob8.png
  [Blob9]: ../../../DevCenter/dotNet/Media/blob9.png
  [CloudStorageAccount]: http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.cloudstorageaccount_methods.aspx
  [Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Windows Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
  [Configuring Connection Strings]: http://msdn.microsoft.com/en-us/library/windowsazure/ee758697.aspx
  [OData]: http://nuget.org/packages/Microsoft.Data.OData/5.0.2
  [Edm]: http://nuget.org/packages/Microsoft.Data.Edm/5.0.2
  [Spatial]: http://nuget.org/packages/System.Spatial/5.0.2