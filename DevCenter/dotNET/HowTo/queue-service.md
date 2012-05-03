<properties linkid="dev-net-how-to-queue-service" urldisplayname="Queue Service" headerexpose pagetitle="How to Use the Queue Storage Service from .NET" metakeywords="Get started Azure queue, Azure asynchronous processing, Azure queue, Azure queue storage, Azure queue .NET, Azure queue storage .NET, Azure queue C#, Azure queue storage C#" footerexpose metadescription="Learn how to use the Windows Azure queue storage service to create and delete queues and insert, peek, get, and delete queue messages." umbraconavihide="0" disquscomments="1"></properties>

# How to Use the Queue Storage Service

This guide will show you how to perform common scenarios using the
Windows Azure Queue storage service. The samples are written in C\# code
and use the .NET API. The scenarios covered include **inserting**,
**peeking**, **getting**, and **deleting**queue messages, as well as
**creating and deleting queues**. For more information on queues, refer
to the [Next Steps][] section.

## Table of Contents

-   [What is Queue Storage][]
-   [Concepts][]
-   [Create a Windows Azure Storage Account][]
-   [Create a Windows Azure Project in Visual Studio][]
-   [Configure your Application to Access Storage][]
-   [Setup a Windows Azure Storage Connection String][]
-   [How To: Create a Queue][]
-   [How To: Insert a Message into a Queue][]
-   [How To: Peek at the Next Message][]
-   [How To: Change the Contents of a Queued Message][]
-   [How To: Dequeue the Next Message][]
-   [How To: Additional Options for Dequeuing Messages][]
-   [How To: Get the Queue Length][]
-   [How To: Delete a Queue][]
-   [Next Steps][]

## <a name="what-is"> </a>What is Queue Storage

Windows Azure Queue storage is a service for storing large numbers of
messages that can be accessed from anywhere in the world via
authenticated calls using HTTP or HTTPS. A single queue message can be
up to 64KB in size, a queue can contain millions of messages, up to the
100TB total capacity limit of a storage account. Common uses of Queue
storage include:

-   <span>Creating a backlog of work to process asynchronously</span>
-   Passing messages from a Windows Azure Web role to a Windows Azure
    Worker role

## <a name="concepts"> </a>Concepts

The Queue service contains the following components:

![Queue1][]

-   **URL format:** Queues are addressable using the following URL
    format:   
    http://<storage account\>.queue.core.windows.net/<queue\>  
      
    The following URL addresses one of the queues in the diagram:  
    http://myaccount.queue.core.windows.net/imagesToDownload

-   **Storage Account:** All access to Windows Azure Storage is done
    through a storage account. A storage account is the highest level of
    the namespace for accessing queues. The total size of blob, table,
    and queue contents in a storage account cannot exceed 100TB.

-   **Queue:** A queue contains a set of messages. All messages must be
    in a queue.

-   **Message:** A message, in any format, of up to 64KB.

## <a name="create-account"> </a>Create a Windows Azure Storage Account

To use storage operations, you need a Windows Azure storage account. You
can create a storage account by following these steps. (You can also
create a storage account [using the REST API][].)

1.  Log into the [Windows Azure Management Portal][].

2.  In the navigation pane, click **Hosted Services, Storage Accounts &
    CDN**.

3.  At the top of the navigation pane, click **Storage Accounts**.

4.  On the ribbon, in the Storage group, click **New Storage Account**.
      
    ![Blob2][]  
      
    The **Create a New Storage Account**dialog box opens.   
    ![Blob3][]

5.  In **Choose a Subscription**, select the subscription that the
    storage account will be used with.

6.  In **Enter a URL**, type a subdomain name to use in the URI for the
    storage account. The entry can contain from 3-24 lowercase letters
    and numbers. This value becomes the host name within the URI that is
    used to address Blob, Queue, or Table resources for the
    subscription.

7.  Choose a region or an affinity group in which to locate the storage.
    If you will be using storage from your Windows Azure application,
    select the same region where you will deploy your application.

8.  Click **OK**.

9.  Click the **View** button in the right-hand column below to display
    and save the **Primary access key** for the storage account. You
    will need this in subsequent steps to access storage.   
    ![Blob4][]

## <a name="create-project"> </a>Create a Windows Azure Project in Visual Studio

In this guide, you will use storage features within a Windows Azure
cloud project in Visual Studio. To learn how to create Windows Azure
cloud projects:

1.  [Download and install the Windows Azure SDK for .NET][] if you have
    not already done so.

2.  Read [Creating a Windows Azure Project in Visual Studio][] on MSDN,
    and follow the steps for creating a Windows Azure project with at
    least one web or worker role.

## <a name="configure-access"> </a>Configure Your Application to Access Storage

The web and worker roles in your cloud project are already configured to
use Windows Azure storage. Add the following to the top of any C\# file
where you want to use Windows Azure Storage:

    using Microsoft.WindowsAzure;
    using Microsoft.WindowsAzure.StorageClient;

## <a name="setup-connection-string"> </a>Setup a Windows Azure Storage Connection String

The Windows Azure .NET storage client uses a storage connection string
to store endpoints and credentials for accessing storage services. You
can put your storage connection string in a configuration file, rather
than hard-coding it in code. One option is to use .NET's built-in
configuration mechanism (e.g. **Web.config** for web applications). In
this guide, you will store your connection string using Windows Azure
service configuration. The service configuration is unique to Windows
Azure projects and allows you to change configuration from the
Management Portal without redeploying your application.

To configure your connection string in the Windows Azure service
configuration:

1.  In the Solution Explorer, in the **Roles** folder, right-click a web
    role or worker role and click **Properties**.  
    ![Blob5][]

2.  Click **Settings** and click **Add Setting**.  
    ![Blob6][]

    A new setting is created.

3.  In the **Type** drop-down of the **Setting1** entry, choose
    **Connection String**.  
    ![Blob7][]

4.  Click the **...** button at the right end of the **Setting1** entry.
    The **Storage Account Connection String** dialog opens.

5.  Choose whether you want to target the storage emulator (Windows
    Azure storage simulated on your desktop) or an actual storage
    account in the cloud, and click **OK**. The code in this guide works
    with either option.  
    ![Blob8][]

6.  Change the entry **Name** from **Setting1** to
    **StorageConnectionString**. You will reference this name in the
    code in this guide.  
    ![Blob9][]

You are now ready to perform the How To's in this guide.

## <a name="create-queue"> </a>How To: Create a Queue

A **CloudQueueClient** object lets you get reference objects for queues.
The following code creates a **CloudQueueClient**object. All code in
this guide uses a storage connection string stored in the Windows Azure
application's service configuration. There are also other ways to create
a **CloudStorageAccount** object. See [CloudStorageAccount][]
documentation for details.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

Use the **queueClient** object to get a reference to the queue you want
to use. You can create the queue if it doesn't exist.

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.GetQueueReference("myqueue");

    // Create the queue if it doesn't already exist
    queue.CreateIfNotExist();

## <a name="insert-message"> </a>How To: Insert a Message into a Queue

To insert a message into an existing queue, first create a new
**CloudQueueMessage**. Next, call the **AddMessage** method. A
**CloudQueueMessage** can be created from either a string (in UTF-8
format) or a **byte** array. Here is code which creates a queue (if it
doesn't exist) and inserts the message 'Hello, World'.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.GetQueueReference("myqueue");

    // Create the queue if it doesn't already exist
    queue.CreateIfNotExist();

    // Create a message and add it to the queue
    CloudQueueMessage message = new CloudQueueMessage("Hello, World");
    queue.AddMessage(message);

## <a name="peek-message"> </a>How To: Peek at the Next Message

You can peek at the message in the front of a queue without removing it
from the queue by calling the **PeekMessage** method.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.GetQueueReference("myqueue");

    // Peek at the next message
    CloudQueueMessage peekedMessage = queue.PeekMessage();

## <a name="change-contents"> </a>How To: Change the Contents of a Queued Message

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

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.GetQueueReference("myqueue");

    CloudQueueMessage message = queue.GetMessage();
    message.SetMessageContent("Updated contents.") ;
    queue.UpdateMessage(message, 
        TimeSpan.FromSeconds(0.0),  // visible immediately
        MessageUpdateFields.Content | MessageUpdateFields.Visibility);

## <a name="get-message"> </a>How To: Dequeue the Next Message

Your code dequeues a message from a queue in two steps. When you call
**GetMessage**, you get the next message in a queue. A message returned
from **GetMessage** becomes invisible to any other code reading messages
from this queue. By default, this message stays invisible for 30
seconds. To finish removing the message from the queue, you must also
call **DeleteMessage**. This two-step process of removing a message
assures that if your code fails to process a message due to hardware or
software failure, another instance of your code can get the same message
and try again. Your code calls **DeleteMessage** right after the message
has been processed.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.GetQueueReference("myqueue");

    // Get the next message
    CloudQueueMessage retrievedMessage = queue.GetMessage();

    //Process the message in less than 30 seconds, and then delete the message
    queue.DeleteMessage(retrievedMessage);

## <a name="advanced-get"> </a>Additional Options for Dequeuing Messages

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

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.GetQueueReference("myqueue");

    foreach (CloudQueueMessage message in queue.GetMessages(20, TimeSpan.FromMinutes(5)))
    {
        // Do processing for all messages in less than 5 minutes, deleting each message after processing
        queue.DeleteMessage(message);
    }

## <a name="get-queue-length"> </a>How To: Get the Queue Length

You can get an estimate of the number of messages in a queue. The
**RetrieveApproximateMessageCount** method asks the Queue service to
count how many messages are in a queue. The count is only an
approximation because messages can be added or removed after the Queue
service responds to your request. The **ApproximateMethodCount**
property returns the last value retrieved by the
**RetrieveApproximateMessageCount**, without calling the Queue service.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.GetQueueReference("myqueue");

    // Retrieve the approximate message count
    int freshMessageCount = queue.RetrieveApproximateMessageCount();

    // Retrieve the cached approximate message count
    int? cachedMessageCount = queue.ApproximateMessageCount;

## <a name="delete-queue"> </a>How To: Delete a Queue

To delete a queue and all the messages contained in it, call the
**Delete** method on the queue object.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.GetQueueReference("myqueue");

    // Delete the queue
    queue.Delete();

## <a name="next-steps"> </a>Next Steps

Now that you've learned the basics of queue storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Windows
    Azure][]
-   Visit the [Windows Azure Storage Team Blog][]

  [Next Steps]: #next-steps
  [What is Queue Storage]: #what-is
  [Concepts]: #concepts
  [Create a Windows Azure Storage Account]: #create-account
  [Create a Windows Azure Project in Visual Studio]: #create-project
  [Configure your Application to Access Storage]: #configure-access
  [Setup a Windows Azure Storage Connection String]: #setup-connection-string
  [How To: Create a Queue]: #create-queue
  [How To: Insert a Message into a Queue]: #insert-message
  [How To: Peek at the Next Message]: #peek-message
  [How To: Change the Contents of a Queued Message]: #change-contents
  [How To: Dequeue the Next Message]: #get-message
  [How To: Additional Options for Dequeuing Messages]: #advanced-get
  [How To: Get the Queue Length]: #get-queue-length
  [How To: Delete a Queue]: #delete-queue
  [Queue1]: ../../../DevCenter/dotNet/Media/queue1.png
  [using the REST API]: http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx
  [Windows Azure Management Portal]: http://windows.azure.com
  [Blob2]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage2.png
  [Blob3]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage3.png
  [Blob4]: /media//java/WA_HowToBlobStorage4.png
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
