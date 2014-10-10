<properties urlDisplayName="Queue Service" pageTitle="How to use the queue service (Ruby) | Microsoft Azure" metaKeywords="Azure Queue Service get messages Ruby" description="Learn how to use the Azure Queue service to create and delete queues, and insert, get, and delete messages. Samples written in Ruby." metaCanonical="" services="storage" documentationCenter="Ruby" title="How to Use the Queue Storage Service from Ruby" authors="guayan" solutions="" manager="wpickett" editor="" />

<tags ms.service="storage" ms.workload="storage" ms.tgt_pltfrm="na" ms.devlang="ruby" ms.topic="article" ms.date="01/01/1900" ms.author="guayan" />





# How to Use the Queue Storage Service from Ruby

This guide shows you how to perform common scenarios using the Windows
Azure Queue Storage service. The samples are written using the Ruby Azure API.
The scenarios covered include **inserting**, **peeking**, **getting**,
and **deleting** queue messages, as well as **creating and deleting
queues**. For more information on queues, refer to the [Next
Steps](#next-steps) section.

## Table of Contents

* [What is Queue Storage?](#what-is)
* [Concepts](#concepts)
* [Create an Azure Storage Account](#CreateAccount)
* [Create a Ruby Application](#create-a-ruby-application)
* [Configure Your Application to Access Storage](#configure-your-application-to-access-storage)
* [Setup an Azure Storage Connection](#setup-a-windows-azure-storage-connection)
* [How To: Create a Queue](#how-to-create-a-queue)
* [How To: Insert a Message into a Queue](#how-to-insert-a-message-into-a-queue)
* [How To: Peek at the Next Message](#how-to-peek-at-the-next-message)
* [How To: Dequeue the Next Message](#how-to-dequeue-the-next-message)
* [How To: Change the Contents of a Queued Message](#how-to-change-the-contents-of-a-queued-message)
* [How To: Additional Options for Dequeuing Messages](#how-to-additional-options-for-dequeuing-messages)
* [How To: Get the Queue Length](#how-to-get-the-queue-length)
* [How To: Delete a Queue](#how-to-delete-a-queue)
* [Next Steps](#next-steps)

[WACOM.INCLUDE [howto-queue-storage](../includes/howto-queue-storage.md)]

## <a id="CreateAccount"></a>Create an Azure storage account

[WACOM.INCLUDE [create-storage-account](../includes/create-storage-account.md)]

## <a id="create-a-ruby-application"></a>Create a Ruby Application

Create a Ruby application. For instructions, 
see [Create a Ruby Application on Azure](/en-us/develop/ruby/tutorials/web-app-with-linux-vm/).

## <a id="configure-your-application-to-access-storage"></a>Configure Your Application to Access Storage

To use Azure storage, you need to download and use the Ruby azure package, which includes a set of convenience libraries that communicate with the storage REST services.

### Use RubyGems to obtain the package

1. Use a command-line interface such as **PowerShell** (Windows), **Terminal** (Mac), or **Bash** (Unix).

2. Type "gem install azure" in the command window to install the gem and dependencies.

### Import the package

Use your favorite text editor, add the following to the top of the Ruby file where you intend to use storage:

	require "azure"

## <a id="setup-a-windows-azure-storage-connection"></a>Setup an Azure Storage Connection

The azure module will read the environment variables **AZURE\_STORAGE\_ACCOUNT** and **AZURE\_STORAGE\_ACCESS_KEY** 
for information required to connect to your Azure storage account. If these environment variables are not set, 
you must specify the account information before using **Azure::QueueService** with the following code:

	Azure.config.storage_account_name = "<your azure storage account>"
	Azure.config.storage_access_key = "<your Azure storage access key>"

To obtain these values:

1. Log into the [Azure Management Portal](https://manage.windowsazure.com/).
2. Navigate to the storage account you want to use
3. Click **MANAGE KEYS** at the bottom of the navigation pane.
4. In the pop up dialog, you will see the storage account name, primary access key and secondary access key. For access key, you can select either the primary one or the secondary one.

## <a id="how-to-create-a-queue"></a>How To: Create a Queue

The following code creates a **Azure::QueueService** object, which enables you to work with queues.

	azure_queue_service = Azure::QueueService.new

Use the **create_queue()** method to create a queue with the specified name.

	begin
	  azure_queue_service.create_queue("test-queue")
	rescue
	  puts $!
	end

## <a id="how-to-insert-a-message-into-a-queue"></a>How To: Insert a Message into a Queue

To insert a message into a queue, use the **create_message()** method to create a new message and add it to the queue.

	azure_queue_service.create_message("test-queue", "test message")

## <a id="how-to-peek-at-the-next-message"></a>How To: Peek at the Next Message

You can peek at the message in the front of a queue without removing it from the queue by calling the **peek\_messages()** method. By default, **peek\_messages()** peeks at a single message. You can also specify how many messages you want to peek.

	result = azure_queue_service.peek_messages("test-queue",
	  {:number_of_messages => 10})

## <a id="how-to-dequeue-the-next-message"></a>How To: Dequeue the Next Message

Your can removes a message from a queue in two steps.

1. When you call **list\_messages()**, you get the next message in a queue by default. You can also specify how many messages you want to get. The messages returned from **list\_messages()** becomes invisible to any other code reading messages from this queue. You pass in the visibility timeout in seconds as a parameter.

2. To finish removing the message from the queue, you must also call **delete_message()**.

This two-step process of removing a message assures that when your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. Your code calls **delete\_message()** right after the message has been processed.

	messages = azure_queue_service.list_messages("test-queue", 30)
	azure_queue_service.delete_message("test-queue", 
	  messages[0].id, messages[0].pop_receipt)

## <a id="how-to-change-the-contents-of-a-queued-message"></a>How To: Change the Contents of a Queued Message

You can change the contents of a message in-place in the queue. The code below uses the **update_message()** method to update a message. The method will return a tuple which contains the pop receipt of the queue message and a UTC date time value that represents when the message will be visible on the queue.

	message = azure_queue_service.list_messages("test-queue", 30)
	pop_receipt, time_next_visible = azure_queue_service.update_message(
	  "test-queue", message.id, message.pop_receipt, "updated test message", 
	  30)

## <a id="how-to-additional-options-for-dequeuing-messages"></a>How To: Additional Options for Dequeuing Messages

There are two ways you can customize message retrieval from a queue.

1. You can get a batch of message.

2. You can set a longer or shorter invisibility timeout, allowing your code more or less time to fully process each message.

The following code example uses the **list\_messages()** method to get 15 messages in one call. Then it prints and deletes each message. It also sets the invisibility timeout to five minutes for each message.

	azure_queue_service.list_messages("test-queue", 300
	  {:number_of_messages => 15}).each do |m|
	  puts m.message_text
	  azure_queue_service.delete_message("test-queue", m.id, m.pop_receipt)
	end

## <a id="how-to-get-the-queue-length"></a>How To: Get the Queue Length

You can get an estimation of the number of messages in the queue. The **get\_queue\_metadata()** method asks the queue service to return the approximate message count and metadata about the queue.

	message_count, metadata = azure_queue_service.get_queue_metadata(
	  "test-queue")

## <a id="how-to-delete-a-queue"></a>How To: Delete a Queue

To delete a queue and all the messages contained in it, call the **delete\_queue()** method on the queue object.

	azure_queue_service.delete_queue("test-queue")

## <a id="next-steps"></a>Next Steps

Now that you've learned the basics of queue storage, follow these links to learn how to do more complex storage tasks.

- See the MSDN Reference: [Storing and Accessing Data in Azure](http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx)
- Visit the [Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/)
- Visit the [Azure SDK for Ruby](https://github.com/WindowsAzure/azure-sdk-for-ruby) repository on GitHub

For a comparision between the Azure Queue Service discussed in this article and Azure Service Bus Queues discussed in the [How to use Service Bus Queues](/en-us/develop/ruby/how-to-guides/service-bus-queues/) article, see [Azure Queues and Azure Service Bus Queues - Compared and Contrasted](http://msdn.microsoft.com/en-us/library/windowsazure/hh767287.aspx)
