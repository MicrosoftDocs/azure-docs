<properties linkid="dev-net-how-to-use-queue-storage-service-java" urldisplayname="Queue Service" headerexpose="" pagetitle="How to Use the Queue Storage Service from Java" metakeywords="Azure Queue Java" footerexpose="" metadescription="This guide will show you how to perform common scenarios using the Windows Azure Queue storage service with the Java programming language." umbraconavihide="0" disquscomments="1"></properties>

# How to use the Queue storage service from Java

This guide will show you how to perform common scenarios using the
Windows Azure Queue storage service. The samples are written in Java and
use the [Windows Azure SDK for Java][]. The scenarios covered include
inserting, peeking, getting, and deleting queue messages, as well as
creating and deleting queues. For more information on queues, refer to
the [Next steps](#NextSteps) section.

## <a name="Contents"> </a>Table of Contents

* [What is Blob Storage](#what-is)
* [Concepts](#Concepts)
* [Create a Windows Azure storage account](#CreateAccount)
* [Create a Java application](#CreateApplication)
* [Configure your application to access queue storage](#ConfigureStorage)
* [Setup a Windows Azure storage connection string](#ConnectionString)
* [How to: Create a queue](#create-queue)
* [How to: Add a message to a queue](#add-message)
* [How to: Peek at the next message](#peek-message)
* [How to: Dequeue the next message](#dequeue-message)
* [How to: Change the contents of a queued message](#change-message)
* [Additional options for dequeuing messages](#additional-options)
* [How to: Get the queue length](#get-queue-length)
* [How to: Delete a queue](#delete-queue)
* [Next steps](#NextSteps)

<div chunk="../../Shared/Chunks/howto-queue-storage" />

<h2 id="CreateAccount">Create a Windows Azure storage account</h2>

<div chunk="../../Shared/Chunks/create-storage-account" />

## <a name="CreateApplication"> </a>Create a Java application

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

## <a name="ConfigureStorage"> </a>Configure your application to access queue storage

Add the following import statements to the top of the Java file where
you want to use Windows Azure storage APIs to access queues:

    // Include the following imports to use queue APIs
    import com.microsoft.windowsazure.services.core.storage.*;
    import com.microsoft.windowsazure.services.queue.client.*;

## <a name="ConnectionString"> </a>Setup a Windows Azure storage connection string

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

## <a name="create-queue"> </a>How to: Create a queue

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

## <a name="add-message"> </a>How to: Add a message to a queue

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

## <a name="peek-message"> </a>How to: Peek at the next message

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

## <a name="dequeue-message"> </a>How to: Dequeue the next message

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

## <a name="change-message"> </a>How to: Change the contents of a queued message

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

## <a name="additional-options"> </a>Additional options for dequeuing messages

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

## <a name="get-queue-length"> </a>How to: Get the queue length

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

## <a name="delete-queue"> </a>How to: Delete a queue

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

## <a name="NextSteps"> </a>Next steps

Now that you’ve learned the basics of queue storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Windows
    Azure]
-   Visit the Windows Azure Storage Team Blog: <http://blogs.msdn.com/b/windowsazurestorage/>

[Windows Azure SDK for Java]: http://www.windowsazure.com/en-us/develop/java/java-home/download-the-windows-azure-sdk-for-java/
[Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
