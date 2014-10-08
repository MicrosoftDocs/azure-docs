<properties urlDisplayName="Queue Service" pageTitle="How to use the queue service (Python) | Microsoft Azure" metaKeywords="Azure Queue Service messaging Python" description="Learn how to use the Azure Queue service to create and delete queues, and insert, get, and delete messages. Samples written in Python." metaCanonical="" services="storage" documentationCenter="Python" title="How to Use the Queue Storage Service from Python" authors="huvalo" solutions="" manager="wpickett" editor="" />

<tags ms.service="storage" ms.workload="storage" ms.tgt_pltfrm="na" ms.devlang="python" ms.topic="article" ms.date="09/19/2014" ms.author="huvalo" />



# How to Use the Queue Storage Service from Python
This guide shows you how to perform common scenarios using the Windows
Azure Queue storage service. The samples are written using the Python
API. The scenarios covered include **inserting**, **peeking**,
**getting**, and **deleting** queue messages, as well as **creating and
deleting queues**. For more information on queues, refer to the [Next Steps][] section.

## Table of Contents

[What is Queue Storage?][]   
 [Concepts][]   
 [Create an Azure Storage Account][]   
 [How To: Create a Queue][]   
 [How To: Insert a Message into a Queue][]   
 [How To: Peek at the Next Message][]   
 [How To: Dequeue the Next Message][]   
 [How To: Change the Contents of a Queued Message][]   
 [How To: Additional Options for Dequeuing Messages][]   
 [How To: Get the Queue Length][]   
 [How To: Delete a Queue][]   
 [Next Steps][]

[WACOM.INCLUDE [howto-queue-storage](../includes/howto-queue-storage.md)]

## <a name="create-account"> </a>Create an Azure Storage Account
[WACOM.INCLUDE [create-storage-account](../includes/create-storage-account.md)]


**Note:** If you need to install Python or the Client Libraries, please see the [Python Installation Guide](../python-how-to-install/).

## <a name="create-queue"> </a>How To: Create a Queue

The **QueueService** object lets you work with queues. The following code creates a **QueueService** object. Add the following near the top of any Python file in which you wish to programmatically access Azure Storage:

	from azure.storage import QueueService

The following code creates a **QueueService** object using the storage account name and account key. Replace 'myaccount' and 'mykey' with the real account and key.

	queue_service = QueueService(account_name='myaccount', account_key='mykey')

	queue_service.create_queue('taskqueue')


## <a name="insert-message"> </a>How To: Insert a Message into a Queue

To insert a message into a queue, use the **put\_message** method to
create a new message and add it to the queue.

	queue_service.put_message('taskqueue', 'Hello World')


## <a name="peek-message"> </a>How To: Peek at the Next Message

You can peek at the message in the front of a queue without removing it
from the queue by calling the **peek\_messages** method. By default,
**peek\_messages** peeks at a single message.

	messages = queue_service.peek_messages('taskqueue')
	for message in messages:
		print(message.message_text)


## <a name="get-message"> </a>How To: Dequeue the Next Message

Your code removes a message from a queue in two steps. When you call
**get\_messages**, you get the next message in a queue by default. A
message returned from **get\_messages** becomes invisible to any other
code reading messages from this queue. By default, this message stays
invisible for 30 seconds. To finish removing the message from the queue,
you must also call **delete\_message**. This two-step process of removing
a message assures that when your code fails to process a message due to
hardware or software failure, another instance of your code can get the
same message and try again. Your code calls **delete\_message** right
after the message has been processed.

	messages = queue_service.get_messages('taskqueue')
	for message in messages:
		print(message.message_text)
		queue_service.delete_message('taskqueue', message.message_id, message.pop_receipt)


## <a name="change-contents"> </a>How To: Change the Contents of a Queued Message

You can change the contents of a message in-place in the queue. If the
message represents a work task, you could use this feature to update the
status of the work task. The code below uses the **update\_message**
method to update a message.

	messages = queue_service.get_messages('taskqueue')
	for message in messages:
		queue_service.update_message('taskqueue', message.message_id, 'Hello World Again', message.pop_receipt, 0)

## <a name="advanced-get"> </a>How To: Additional Options for Dequeuing Messages

There are two ways you can customize message retrieval from a queue.
First, you can get a batch of messages (up to 32). Second, you can set a
longer or shorter invisibility timeout, allowing your code more or less
time to fully process each message. The following code example uses the
**get\_messages** method to get 16 messages in one call. Then it processes
each message using a for loop. It also sets the invisibility timeout to
five minutes for each message.

	messages = queue_service.get_messages('taskqueue', numofmessages=16, visibilitytimeout=5*60)
	for message in messages:
		print(message.message_text)
		queue_service.delete_message('taskqueue', message.message_id, message.pop_receipt)

## <a name="get-queue-length"> </a>How To: Get the Queue Length

You can get an estimate of the number of messages in a queue. The
**get\_queue\_metadata** method asks the queue service to return metadata
about the queue, and the **x-ms-approximate-messages-count** should be used as the index into the returned dictionary to find the count.
The result is only approximate because messages can be added or removed after the
queue service responds to your request.

	queue_metadata = queue_service.get_queue_metadata('taskqueue')
	count = queue_metadata['x-ms-approximate-messages-count']

## <a name="delete-queue"> </a>How To: Delete a Queue

To delete a queue and all the messages contained in it, call the
**delete\_queue** method.

	queue_service.delete_queue('taskqueue')

## <a name="next-steps"> </a>Next Steps

Now that you have learned the basics of queue storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Azure][]
-   Visit the [Azure Storage Team Blog][]

  [Next Steps]: #next-steps
  [What is Queue Storage?]: #what-is
  [Concepts]: #concepts
  [Create an Azure Storage Account]: #create-account
  [How To: Create a Queue]: #create-queue
  [How To: Insert a Message into a Queue]: #insert-message
  [How To: Peek at the Next Message]: #peek-message
  [How To: Dequeue the Next Message]: #get-message
  [How To: Change the Contents of a Queued Message]: #change-contents
  [How To: Additional Options for Dequeuing Messages]: #advanced-get
  [How To: Get the Queue Length]: #get-queue-length
  [How To: Delete a Queue]: #delete-queue
  [Storing and Accessing Data in Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
