
# How to Use the Queue Service from Ruby

This guide shows you how to perform common scenarios using the Windows
Azure Queue service. The samples are written using the Ruby Azure API.
The scenarios covered include **inserting**, **peeking**, **getting**,
and **deleting** queue messages, as well as **creating and deleting
queues**. For more information on queues, refer to the [Next
Steps](#next-steps) section.

## Table of Contents

* [What is the Queue Service?](#what-is-the-queue-service)
* [Concepts](#concepts)
* [Create a Windows Azure Storage Account](#create-a-windows-azure-storage-account)
* [Create a Ruby Application](#create-a-ruby-application)
* [Configure Your Application to Access Storage](#configure-your-application-to-access-storage)
* [Setup a Windows Azure Storage Connection](#setup-a-windows-azure-storage-connection)
* [How To: Create a Queue](#how-to-create-a-queue)
* [How To: Insert a Message into a Queue](#how-to-insert-a-message-into-a-queue)
* [How To: Peek at the Next Message](#how-to-peek-at-the-next message)
* [How To: Dequeue the Next Message](#how-to-dequeue-the-next-message)
* [How To: Change the Contents of a Queued Message](#how-to-change-the-contents-of-a-queued-message)
* [How To: Additional Options for Dequeuing Messages](#how-to-additional-options-for-dequeuing-messages)
* [How To: Get the Queue Length](#how-to-get-the-queue-length)
* [How To: Delete a Queue](#how-to-delete-a-queue)
* [Next Steps](#next-steps)

[Common Section Start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~]

## What is the Queue Service?

The Windows Azure Queue service is a service for storing large numbers of
messages that can be accessed from anywhere in the world via
authenticated calls using HTTP or HTTPS. A single queue message can be
up to 64KB in size, a queue can contain millions of messages, up to the
100TB total capacity limit of a storage account. Common uses of the Queue
service include:

* Creating a backlog of work to process asynchronously
* Passing messages from a Windows Azure web role to a worker role

## Concepts

The Queue service contains the following components:

![Queue1](images/queue1.png?raw=true)

-   **URL format:** Queues are addressable using the following URL
    format:   
    http://storageaccount.queue.core.windows.net/queue  
      
    The following URL addresses one of the queues in the diagram:  
    http://myaccount.queue.core.windows.net/imagesToDownload

-   **Storage Account:** All access to Windows Azure Storage is done
    through a storage account. A storage account is the highest level of
    the namespace for accessing queues. The total size of blob, table,
    and queue contents in a storage account cannot exceed 100TB.

-   **Queue:** A queue contains a set of messages. All messages must be
    in a queue.

-   **Message:** A message, in any format, of up to 64KB.

## Create a Windows Azure Storage Account

To use storage operations, you need a Windows Azure storage account. You
can create a storage account by following these steps. 

1.  Log into the [Windows Azure Management Portal].

2.  At the bottom of the navigation pane, click **+NEW**.

	![+new](images/plus-new.png?raw=true)

3.  Click **Storage Account**, and then click **Quick Create**.

	![Quick create dialog](images/quick-storage.png?raw=true)

4.  In URL, type a subdomain name to use in the URI for the
    storage account. The entry can contain 3 to 24 lowercase letters
    and numbers. This value becomes the host name within the URI that is
    used to address Blob, Queue, or Table resources for the
    subscription.

5.  Choose a Region/Affinity Group in which to locate the
    storage. If you will be using storage from your Windows Azure
    application, select the same region where you will deploy your
    application.

6.  Click **Create Storage Account**.

[Common Section End~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~]

## Create a Ruby Application

Create a Ruby application. For instructions, 
see [Create a Ruby Application on Windows Azure](no-link-yet). **No link yet**

## Configure Your Application to Access Storage

To use Windows Azure storage, you need to download and use the Ruby azure package, 
which includes a set of convenience libraries that communicate with the storage REST services.

###Use RubyGems to obtain the package

1. Use a command-line interface such as **PowerShell** (Windows), **Terminal** (Mac), or **Bash** (Unix).
2. Type ``gem install azure`` in the command window to install the gem and dependencies.

###Import the package

Use your favorite text editor, add the following to the top of the Ruby file where you intend to use storage:

	require "azure"


##Setup a Windows Azure Storage Connection

The azure module will read the environment variables **AZURE_STORAGE_ACCOUNT** and **AZURE_STORAGE_ACCESS_KEY** 
for information required to connect to your Windows Azure storage account. If these environment variables are not set, 
you must specify the account information before using ``Azure::QueueService`` with the following code:


	Azure.config.account_name = "<your azure storage account>"
	Azure.config.access_key = "<your Azure storage access key>"

To obtain these values:

1. Log into the [Windows Azure Management Portal](https://manage.windowsazure.com/).
2. On the left side of the navigation pan, click **STORAGE**.

   ![Storage](images/storage.png)

3. On the right side, choose the storage account you want to use in the table and click **MANAGE KEYS** at the bottom of the navigation pane.

   ![Manage keys](images/manage-keys.png)

4. In the pop up dialog, you will see the storage account name, primary access key and secondary access key. For access key, you can either the primary one or the secondary one.

   ![Manage keys dialog](images/manage-keys-dialog.png)

## How To: Create a Queue

The following code creates a ``Azure::QueueService`` object, which enables you to work with queues.

	azure_queue_service = Azure::QueueService.new

Use the ``create_queue()`` method to create a queue with the specified name.

	begin
	  azure_queue_service.create_queue("test-queue")
	rescue
	  puts $!
	end

## How To: Insert a Message into a Queue

To insert a message into a queue, use the ``create_message()`` method to create a new message and add it to the queue.

	azure_queue_service.create_message("test-queue", "test message")

## How To: Peek at the Next Message

You can peek at the message in the front of a queue without removing it from the queue by calling the ``peek_messages()`` method. By default, ``peek_messages()`` peeks at a single message. You can also specify how many messages you want to peek.

	result = azure_queue_service.peek_messages("test-queue", {:number_of_messages => 10})

## How To: Dequeue the Next Message

Your can removes a message from a queue in two steps.

1. When you call ``list_messages()``, you get the next message in a queue by default. You can also specify how many messages you want to get. The messages returned from ``list_messages()`` becomes invisible to any other code reading messages from this queue. You pass in the visibility timeout in seconds as a parameter.
2. To finish removing the message from the queue, you must also call ``delete_message()``.

This two-step process of removing a message assures that when your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. Your code calls ``delete_message()`` right after the message has been processed.

	messages = azure_queue_service.list_messages("test-queue", 30)
	azure_queue_service.delete_message("test-queue", messages[0].id, messages[0].pop_receipt)

## How To: Change the Contents of a Queued Message

You can change the contents of a message in-place in the queue. The code below uses the ``update_message()`` method to update a message. The method will return a tuple which contains the pop receipt of the queue message and a UTC date time value that represents when the message will be visible on the queue.

	message = azure_queue_service.list_messages("test-queue", 30)
	pop_receipt, time_next_visible = azure_queue_service.update_message("test-queue", message.id, message.pop_receipt, "updated test message", 30)

## How To: Additional Options for Dequeuing Messages

There are two ways you can customize message retrieval from a queue.

1. You can get a batch of message
2. You can set a longer or shorter invisibility timeout, allowing your code more or less time to fully process each message.

The following code example uses the ``list_messages()`` method to get 15 messages in one call. Then it prints and deletes each message. It also sets the invisibility timeout to five minutes for each message.

	azure_queue_service.list_messages("test-queue", 300, {:number_of_messages => 15}).each do |m|
	  puts m.message_text
	  azure_queue_service.delete_message("test-queue", m.id, m.pop_receipt)
	end

## How To: Get the Queue Length

You can get an estimation of the number of messages in the queue. The ``get_queue_metadata()`` method asks the queue service to return the approximate message count and metadata about the queue.

	approximate_message_count, metadata = azure_queue_service.get_queue_metadata("test-queue")

## How To: Delete a Queue

To delete a queue and all the messages contained in it, call the ``delete_queue()`` method on the queue object.

	azure_queue_service.delete_queue("test-queue")

## Next Steps

Now that you've learned the basics of queue storage, follow these links
to learn how to do more complex storage tasks.

- See the MSDN Reference: [Storing and Accessing Data in Windows Azure](http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx)
- Visit the [Windows Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/)
- Visit the [Azure SDK for Ruby](https://github.com/WindowsAzure/azure-sdk-for-ruby) repository on GitHub.