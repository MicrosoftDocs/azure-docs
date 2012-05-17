<properties linkid="dev-net-how-to-use-queue-storage-service-java" urldisplayname="Queue Service" headerexpose="" pagetitle="How to Use the Queue Storage Service from Java" metakeywords="Azure Queue Java" footerexpose="" metadescription="This guide will show you how to perform common scenarios using the Windows Azure Queue storage service with the Java programming language." umbraconavihide="0" disquscomments="1"></properties>

# How to Use the Queue Storage Service from Java

This guide will show you how to perform common scenarios using the
Windows Azure Queue storage service. The samples are written in Java and
use the [Windows Azure SDK for Java][]. The scenarios covered include
inserting, peeking, getting, and deleting queue messages, as well as
creating and deleting queues. For more information on queues, refer to
the [Next Steps][] section.

## What is Queue Storage

Windows Azure Queue storage is a service for storing large numbers of
messages that can be accessed from anywhere in the world via
authenticated calls using HTTP or HTTPS. A single queue message can be
up to 64KB in size, a queue can contain millions of messages, up to the
100TB total capacity limit of a storage account. Common uses of Queue
storage include:

-   Creating a backlog of work to process asynchronously
-   Passing messages from a Windows Azure Web role to a Windows Azure
    Worker role

## Table of Contents

-   [Concepts][]
-   [Create a Windows Azure Storage Account][]
-   [Create a Java Application][]
-   [Configure Your Application to Access Queue Storage][]
-   [Setup a Windows Azure Storage Connection String][]
-   [How to Create a Queue][]
-   [How to Insert a Message into a Queue][]
-   [How to Peek at the Next Message][]
-   [How to Dequeue the Next Message][]
-   [How to Change the Contents of a Queued Message][]
-   [Additional Options for Dequeuing Messages][]
-   [How to Get the Queue Length][]
-   [How to Delete a Queue][]
-   [Next Steps][]

## <a name="bkmk_Concepts"> </a>Concepts

The Queue service contains the following components:  
![Queue Service Components][]

1.  **URL format:**Queues are addressable using the following URL
    format:   
     http://<*storage account*\>.queue.core.windows.net/<*queue*\>  
     The following URL addresses one of the queues in the diagram:  
     http://myaccount.queue.core.windows.net/imagesToDownload
2.  **Storage Account:**All access to Windows Azure Storage is done
    through a storage account. A storage account is the highest level of
    the namespace for accessing queues. The total size of blob, table,
    and queue contents in a storage account cannot exceed 100TB.
3.  **Queue:**A queue contains a set of messages. All messages must be
    in a queue.
4.  **Message:**A message, in any format, of up to 64KB.

## <a name="bkmk_CreateWinAzure"> </a>Create a Windows Azure Storage Account

To use storage operations, you need a Windows Azure storage account. You
can create a storage account by following these steps. (You can also
create a storage account using the REST API.)

### <a name="bkmk_CreateStorageAcct"> </a>How to Create a Storage Account using the Management Portal

1.  Log into the [Windows Azure Management Portal][].
2.  In the navigation pane, click **Hosted Services, Storage Accounts &
    CDN**.
3.  At the top of the navigation pane, click **Storage Accounts**.
4.  On the ribbon, in the **Storage** group, click **New Storage
    Account**.  
    ![New Storage Account screenshot][]  
     The **Create a New Storage Account** dialog box opens.  
    ![Create New Storage Account screenshot][]
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
8.  Finally, take note of your **Primary access key** in the right-hand
    column. You will need this in subsequent steps to access storage.  
    ![Properties screenshot][]

## <a name="bkmk_CreateJavaApp"> </a>Create a Java Application

In this guide, you will use storage features which can be run within a
Java application locally, or in code running within a web role or worker
role in Windows Azure. We assume you have downloaded and installed the
Java Development Kit (JDK), and followed the instructions in [Download
the Windows Azure SDK for Java][Windows Azure SDK for Java] to install
the Windows Azure Libraries for Java and the Windows Azure SDK, and have
created a Windows Azure storage account in your Windows Azure
subscription. You can use any development tools to create your
application, including Notepad. All you need is the ability to compile a
Java project and reference the Windows Azure Libraries for Java.

## <a name="bkmk_ConfigApp"> </a>Configure Your Application to Access Queue Storage

Add the following import statements to the top of the Java file where
you want to use Windows Azure storage APIs to access queues:

    // Include the following imports to use queue APIs
    import com.microsoft.windowsazure.services.core.storage.*;
    import com.microsoft.windowsazure.services.queue.client.*;

## <a name="bkmk_SetupWinAzure"> </a>Setup a Windows Azure Storage Connection String

A Windows Azure storage client uses a storage connection string to store
endpoints and credentials for accessing storage services. When running
in a client application, you must provide the storage connection string
in the following format, using the name of your storage account and the
Primary access key for the storage account listed in the Management
Portal for the *AccountName* and *AccountKey* values. This example shows
how you can declare a static field to hold the connection string:

    // Define the connection-string with your values
    public static final String storageConnectionString = 
        "DefaultEndpointsProtocol=http;" + 
        "AccountName=your_storage_account;" + 
        "AccountKey=your_storage_account_key";

In an application running within a role in Windows Azure, this string
can be stored in the service configuration file,
ServiceConfiguration.cscfg, and can be accessed with a call to the
RoleEnvironment.getConfigurationSettings method. Here’s an example of
getting the connection string from a **Setting** element named
*StorageConnectionString* in the service configuration file:

    // Retrieve storage account from connection-string
    String storageConnectionString = 
        RoleEnvironment.getConfigurationSettings().get("StorageConnectionString");

## <a name="bkmk_CreateQueue"> </a>How to Create a Queue

A CloudQueueClient object lets you get reference objects for queues. The
following code creates a CloudQueueClient object.

All code in this guide uses a storage connection string declared one of
the two ways shown above. There are also other ways to create
CloudStorageAccount objects. See the Javadocs documentation for
CloudStorageAccount for details.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = 
        CloudStorageAccount.parse(storageConnectionString);

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

Use the CloudQueueClient object to get a reference to the queue you want
to use. You can create the queue if it doesn’t exist.

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.getQueueReference("myqueue");

    // Create the queue if it doesn't already exist
    queue.createIfNotExist();

## <a name="bkmk_InsertMessage"> </a>How to Insert a Message into a Queue

To insert a message into an existing queue, first create a new
CloudQueueMessage. Next, call the addMessage method. A CloudQueueMessage
can be created from either a string (in UTF-8 format) or a byte array.
Here is code which creates a queu (if it doesn’t exist) and inserts the
message “Hello, World”.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = 
        CloudStorageAccount.parse(storageConnectionString);

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.getQueueReference("myqueue");

    // Create the queue if it doesn't already exist
    queue.createIfNotExist();

    // Create a message and add it to the queue
    CloudQueueMessage message = new CloudQueueMessage("Hello, World");
    queue.addMessage(message);

## <a name="bkmk_PeekAtNextMsg"> </a>How to Peek at the Next Message

You can peek at the message in the front of a queue without removing it
from the queue by calling peekMessage.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = 
        CloudStorageAccount.parse(storageConnectionString);

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.getQueueReference("myqueue");

    // Peek at the next message
    CloudQueueMessage peekedMessage = queue.peekMessage();

## <a name="bkmk_DequeueNxtMsg"> </a>How to Dequeue the Next Message

Your code dequeues a message from a queue in two steps. When you call
retrieveMessage, you get the next message in a queue. A message returned
from retrieveMessage becomes invisible to any other code reading
messages from this queue. By default, this message stays invisible for
30 seconds. To finish removing the message from the queue, you must also
call deleteMessage. This two-step process of removing a message assures
that if your code fails to process a message due to hardware or software
failure, another instance of your code can get the same message and try
again. Your code calls deleteMessage right after the message has been
processed.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = 
        CloudStorageAccount.parse(storageConnectionString);

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.getQueueReference("myqueue");

    // Retrieve the first visible message in the queue
    CloudQueueMessage retrievedMessage = queue.retrieveMessage();

    // Process the message in less than 30 seconds, and then delete the message.
    queue.deleteMessage(retrievedMessage);

## <a name="bkmk_ChangeContents"> </a>How to Change the Contents of a Queued Message

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
than n times, you would delete it. This protects against a message that
triggers an application error each time it is processed.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = 
        CloudStorageAccount.parse(storageConnectionString);

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.getQueueReference("myqueue");

    // Retrieve the first visible message in the queue
    CloudQueueMessage message = queue.retrieveMessage();

    // Modify the message content and set it to be visible in 60 seconds
    message.setMessageContent("Updated contents.");
    EnumSet<MessageUpdateFields> updateFields = 
        EnumSet.of(MessageUpdateFields.CONTENT, MessageUpdateFields.VISIBILITY);
    queue.updateMessage(message, 60, updateFields, null, null);

## <a name="bkmk_AddOptions"> </a>Additional Options for Dequeuing Messages

There are two ways you can customize message retrieval from a queue.
First, you can get a batch of messages (up to 32). Second, you can set a
longer or shorter invisibility timeout, allowing your code more or less
time to fully process each message.

The following code example uses the retrieveMessages method to get 20
messages in one call. Then it processes each message using a **for**
loop. It also sets the invisibility timeout to five minutes (300
seconds) for each message. Note that the five minutes starts for all
messages at the same time, so when five minutes have passed since the
call to retrieveMessages, any messages which have not been deleted will
become visible again.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = 
        CloudStorageAccount.parse(storageConnectionString);

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.getQueueReference("myqueue");

    // Retrieve 20 messages from the queue with a visibility timeout of 300 seconds
    for (CloudQueueMessage message : queue.retrieveMessages(20, 300, null, null)) {
        // Do processing for all messages in less than 5 minutes, 
        // deleting each message after processing.
        queue.deleteMessage(message);
    }

## <a name="bkmk_GetQueueLength"> </a>How to Get the Queue Length

You can get an estimate of the number of messages in a queue. The
downloadAttributes method asks the Queue service for several current
values, including a count of how many messages are in a queue. The count
is only approximate because messages can be added or removed after the
Queue service responds to your request. The getApproximateMethodCount
method returns the last value retrieved by the call to
downloadAttributes, without calling the Queue service.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = 
        CloudStorageAccount.parse(storageConnectionString);

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.getQueueReference("myqueue");

    // Download the approximate message count from the server
    queue.downloadAttributes();

    // Retrieve the newly cached approximate message count
    long cachedMessageCount = queue.getApproximateMessageCount();

## <a name="bkmk_DeleteQueue"> </a>How to Delete a Queue

To delete a queue and all the messages contained in it, call the delete
method on the queue object.

    // Retrieve storage account from connection-string
    CloudStorageAccount storageAccount = 
        CloudStorageAccount.parse(storageConnectionString);

    // Create the queue client
    CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

    // Retrieve a reference to a queue
    CloudQueue queue = queueClient.getQueueReference("myqueue");

    // Delete the queue
    queue.delete();

## <a name="bkmk_NextSteps"> </a>Next Steps

Now that you’ve learned the basics of queue storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Windows
    Azure][]
-   Visit the [Windows Azure Storage Team Blog][]

  [Windows Azure SDK for Java]: http://msdn.microsoft.com/en-us/library/windowsazure/hh690953(v=VS.103).aspx
  [Next Steps]: #bkmk_NextSteps
  [Concepts]: #bkmk_Concepts
  [Create a Windows Azure Storage Account]: #bkmk_CreateWinAzure
  [Create a Java Application]: #bkmk_CreateJavaApp
  [Configure Your Application to Access Queue Storage]: #bkmk_ConfigApp
  [Setup a Windows Azure Storage Connection String]: #bkmk_SetupWinAzure
  [How to Create a Queue]: #bkmk_CreateQueue
  [How to Insert a Message into a Queue]: #bkmk_InsertMessage
  [How to Peek at the Next Message]: #bkmk_PeekAtNextMsg
  [How to Dequeue the Next Message]: #bkmk_DequeueNxtMsg
  [How to Change the Contents of a Queued Message]: #bkmk_ChangeContents
  [Additional Options for Dequeuing Messages]: #bkmk_AddOptions
  [How to Get the Queue Length]: #bkmk_GetQueueLength
  [How to Delete a Queue]: #bkmk_DeleteQueue
  [Queue Service Components]: ../../../DevCenter/Java/Media/WA_HowToQueueStorage1.png
  [Windows Azure Management Portal]: http://windows.azure.com/
  [New Storage Account screenshot]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage2.png
  [Create New Storage Account screenshot]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage3.png
  [Properties screenshot]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage4.png
  [Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Windows Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
