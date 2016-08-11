<properties 
	pageTitle="How to use Queue storage from Ruby | Microsoft Azure" 
	description="Learn how to use the Azure Queue service to create and delete queues, and insert, get, and delete messages. Samples written in Ruby." 
	services="storage" 
	documentationCenter="ruby" 
	authors="rmcmurray" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="ruby" 
	ms.topic="article" 
	ms.date="06/24/2016" 
	ms.author="robmcm"/>


# How to use Queue storage from Ruby

[AZURE.INCLUDE [storage-selector-queue-include](../../includes/storage-selector-queue-include.md)]
<br/>
[AZURE.INCLUDE [storage-try-azure-tools-queues](../../includes/storage-try-azure-tools-queues.md)]

## Overview

This guide shows you how to perform common scenarios using the Microsoft
Azure Queue Storage service. The samples are written using the Ruby Azure API.
The scenarios covered include **inserting**, **peeking**, **getting**,
and **deleting** queue messages, as well as **creating and deleting
queues**.

[AZURE.INCLUDE [storage-queue-concepts-include](../../includes/storage-queue-concepts-include.md)]

[AZURE.INCLUDE [storage-create-account-include](../../includes/storage-create-account-include.md)]

## Create a Ruby Application

Create a Ruby application. For instructions, 
see [Ruby on Rails Web application on an Azure VM](../virtual-machines/virtual-machines-linux-classic-ruby-rails-web-app.md).

## Configure Your Application to Access Storage

To use Azure storage, you need to download and use the Ruby azure package, which includes a set of convenience libraries that communicate with the storage REST services.

### Use RubyGems to obtain the package

1. Use a command-line interface such as **PowerShell** (Windows), **Terminal** (Mac), or **Bash** (Unix).

2. Type "gem install azure" in the command window to install the gem and dependencies.

### Import the package

Use your favorite text editor, add the following to the top of the Ruby file where you intend to use storage:

	require "azure"

## Setup an Azure Storage Connection

The azure module will read the environment variables **AZURE\_STORAGE\_ACCOUNT** and **AZURE\_STORAGE\_ACCESS_KEY** 
for information required to connect to your Azure storage account. If these environment variables are not set, 
you must specify the account information before using **Azure::QueueService** with the following code:

	Azure.config.storage_account_name = "<your azure storage account>"
	Azure.config.storage_access_key = "<your Azure storage access key>"

 
To obtain these values from a classic or Resource Manager storage account in the Azure portal:

1. Log in to the [Azure portal](https://portal.azure.com).
2. Navigate to the storage account you want to use.
3. In the Settings blade on the right, click **Access Keys**.
4. In the Access keys blade that appears, you'll see the access key 1 and access key 2. You can use either of these. 
5. Click the copy icon to copy the key to the clipboard. 

To obtain these values from a classic storage account in the classic Azure portal:

1. Log in to the [classic Azure portal](https://manage.windowsazure.com).
2. Navigate to the storage account you want to use.
3. Click **MANAGE ACCESS KEYS** at the bottom of the navigation pane.
4. In the pop up dialog, you'll see the storage account name, primary access key and secondary access key. For access key, you can use either the primary one or the secondary one. 
5. Click the copy icon to copy the key to the clipboard.

## How To: Create a Queue

The following code creates a **Azure::QueueService** object, which enables you to work with queues.

	azure_queue_service = Azure::QueueService.new

Use the **create_queue()** method to create a queue with the specified name.

	begin
	  azure_queue_service.create_queue("test-queue")
	rescue
	  puts $!
	end

## How To: Insert a Message into a Queue

To insert a message into a queue, use the **create_message()** method to create a new message and add it to the queue.

	azure_queue_service.create_message("test-queue", "test message")

## How To: Peek at the Next Message

You can peek at the message in the front of a queue without removing it from the queue by calling the **peek\_messages()** method. By default, **peek\_messages()** peeks at a single message. You can also specify how many messages you want to peek.

	result = azure_queue_service.peek_messages("test-queue",
	  {:number_of_messages => 10})

## How To: Dequeue the Next Message

You can remove a message from a queue in two steps.

1. When you call **list\_messages()**, you get the next message in a queue by default. You can also specify how many messages you want to get. The messages returned from **list\_messages()** becomes invisible to any other code reading messages from this queue. You pass in the visibility timeout in seconds as a parameter.

2. To finish removing the message from the queue, you must also call **delete_message()**.

This two-step process of removing a message assures that when your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. Your code calls **delete\_message()** right after the message has been processed.

	messages = azure_queue_service.list_messages("test-queue", 30)
	azure_queue_service.delete_message("test-queue", 
	  messages[0].id, messages[0].pop_receipt)

## How To: Change the Contents of a Queued Message

You can change the contents of a message in-place in the queue. The code below uses the **update_message()** method to update a message. The method will return a tuple which contains the pop receipt of the queue message and a UTC date time value that represents when the message will be visible on the queue.

	message = azure_queue_service.list_messages("test-queue", 30)
	pop_receipt, time_next_visible = azure_queue_service.update_message(
	  "test-queue", message.id, message.pop_receipt, "updated test message", 
	  30)

## How To: Additional Options for Dequeuing Messages

There are two ways you can customize message retrieval from a queue.

1. You can get a batch of message.

2. You can set a longer or shorter invisibility timeout, allowing your code more or less time to fully process each message.

The following code example uses the **list\_messages()** method to get 15 messages in one call. Then it prints and deletes each message. It also sets the invisibility timeout to five minutes for each message.

	azure_queue_service.list_messages("test-queue", 300
	  {:number_of_messages => 15}).each do |m|
	  puts m.message_text
	  azure_queue_service.delete_message("test-queue", m.id, m.pop_receipt)
	end

## How To: Get the Queue Length

You can get an estimation of the number of messages in the queue. The **get\_queue\_metadata()** method asks the queue service to return the approximate message count and metadata about the queue.

	message_count, metadata = azure_queue_service.get_queue_metadata(
	  "test-queue")

## How To: Delete a Queue

To delete a queue and all the messages contained in it, call the **delete\_queue()** method on the queue object.

	azure_queue_service.delete_queue("test-queue")

## Next Steps

Now that you've learned the basics of queue storage, follow these links to learn about more complex storage tasks.

- Visit the [Azure Storage Team Blog](http://blogs.msdn.com/b/windowsazurestorage/)
- Visit the [Azure SDK for Ruby](https://github.com/WindowsAzure/azure-sdk-for-ruby) repository on GitHub

For a comparison between the Azure Queue Service discussed in this article and Azure Service Bus Queues discussed in the [How to use Service Bus Queues](/develop/ruby/how-to-guides/service-bus-queues/) article, see [Azure Queues and Service Bus Queues - Compared and Contrasted](../service-bus/service-bus-azure-and-service-bus-queues-compared-contrasted.md)
 
