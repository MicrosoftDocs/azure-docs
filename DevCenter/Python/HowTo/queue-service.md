# How to Use the Queue Storage Service from Python

This guide shows you how to perform common scenarios using the Windows
Azure Queue storage service. The samples are written using the Python
API. The scenarios covered include **inserting**, **peeking**,
**getting**, and **deleting** queue messages, as well as **creating and
deleting queues**. For more information on queues, refer to the [Next Steps][] section.

## Table of Contents

[What is Queue Storage?][]   
 [Concepts][]   
 [Create a Windows Azure Storage Account][]   
 [How To: Create a Queue][]   
 [How To: Insert a Message into a Queue][]   
 [How To: Peek at the Next Message][]   
 [How To: Dequeue the Next Message][]   
 [How To: Change the Contents of a Queued Message][]   
 [How To: Additional Options for Dequeuing Messages][]   
 [How To: Get the Queue Length][]   
 [How To: Delete a Queue][]   
 [Next Steps][]

## <a name="what-is"> </a>What is Queue Storage?

Windows Azure Queue storage is a service for storing large numbers of
messages that can be accessed from anywhere in the world via
authenticated calls using HTTP or HTTPS. A single queue message can be
up to 64KB in size, a queue can contain millions of messages, up to the
100TB total capacity limit of a storage account. Common uses of Queue
storage include:

-   <span>Creating a backlog of work to process asynchronously</span>
-   Passing messages from a Windows Azure web role to a worker role

## <a name="concepts"> </a>Concepts

The Queue service contains the following components:

![Queue1][]

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

## <a name="create-account"> </a>Create a Windows Azure Storage Account

To use storage operations, you need a Windows Azure storage account. You
can create a storage account by following these steps. (You can also
create a storage account [using the REST API][].)

1.  Log into the [Windows Azure Management Portal][].

2.  In the navigation pane, click **Hosted Services, Storage Accounts & CDN**.

3.  At the top of the navigation pane, click **Storage Accounts**.

4.  On the ribbon, in the Storage group, click **New Storage Account**.
      
    ![Blob2][]  
      
    The **Create a New Storage Account** dialog box opens.   
    ![Blob3][]

5.  In **Choose a Subscription**, select the subscription that the
    storage account will be used with.

6.  In Enter a URL, type a subdomain name to use in the URI for the
    storage account. The entry can contain from 3-24 lowercase letters
    and numbers. This value becomes the host name within the URI that is
    used to address Blob, Queue, or Table resources for the
    subscription.

7.  Choose a country/region or an affinity group in which to locate the
    storage. If you will be using storage from your Windows Azure
    application, select the same region where you will deploy your
    application.

8.  Finally, take note of your **Primary access key** in the right-hand
    column. You will need this in subsequent steps to access storage.   
    ![Blob4][]


## <a name="create-queue"> </a>How To: Create a Queue

The **CloudQueueClient** object lets you work with queue storage services. The following code creates a **CloudQueueClient** object. Add the following near the top of any Python file in which you wish to programmatically access Windows Azure Storage:

	from windowsazure.storages.cloudqueueclient import *

The following code creates a **CloudQueueClient** object using the storage account name and account key. Replace 'myaccount' and 'mykey' with the real account and key.

	queue_client = CloudQueueClient(account_name='myaccount', account_key='mykey')

	queue_client.create_queue('taskqueue')


## <a name="insert-message"> </a>How To: Insert a Message into a Queue

To insert a message into a queue, use the **put\_message** method to
create a new message and add it to the queue.

	queue_client.put_message('taskqueue', 'Hello World')


## <a name="peek-message"> </a>How To: Peek at the Next Message

You can peek at the message in the front of a queue without removing it
from the queue by calling the **peek\_messages** method. By default,
**peek\_messages** peeks at a single message.

	messages = queue_client.peek_messages('taskqueue')
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

	messages = queue_client.get_messages('taskqueue')
	for message in messages:
		print(message.message_text)
		queue_client.delete_message('taskqueue', message.message_id, message.pop_receipt)


## <a name="change-contents"> </a>How To: Change the Contents of a Queued Message

You can change the contents of a message in-place in the queue. If the
message represents a work task, you could use this feature to update the
status of the work task. The code below uses the **update\_message**
method to update a message.

	messages = queue_client.get_messages('taskqueue')
	for message in messages:
		queue_client.update_message('taskqueue', message.message_id, 'Hello World Again', message.pop_receipt, 0)

## <a name="advanced-get"> </a>How To: Additional Options for Dequeuing Messages

There are two ways you can customize message retrieval from a queue.
First, you can get a batch of messages (up to 32). Second, you can set a
longer or shorter invisibility timeout, allowing your code more or less
time to fully process each message. The following code example uses the
**get\_messages** method to get 16 messages in one call. Then it processes
each message using a for loop. It also sets the invisibility timeout to
five minutes for each message.

	messages = queue_client.get_messages('taskqueue', numofmessages=16, visibilitytimeout=5*60)
	for message in messages:
		print(message.message_text)
		queue_client.delete_message('taskqueue', message.message_id, message.pop_receipt)

## <a name="get-queue-length"> </a>How To: Get the Queue Length

You can get an estimate of the number of messages in a queue. The
**get\_queue\_metadata** method asks the queue service to return metadata
about the queue, and the **x\_ms\_approximate\_messages\_count** property of the
response contains a count of how many messages are in a queue. The count
is only approximate because messages can be added or removed after the
queue service responds to your request.

	queue_metadata = queue_client.get_queue_metadata('taskqueue')
	count = queue_metadata.x_ms_approximate_messages_count

## <a name="delete-queue"> </a>How To: Delete a Queue

To delete a queue and all the messages contained in it, call the
**delete\_queue** method.

	queue_client.delete_queue('taskqueue')

## <a name="next-steps"> </a>Next Steps

Now that you’ve learned the basics of queue storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Windows Azure][]
-   Visit the [Windows Azure Storage Team Blog][]

  [Next Steps]: #next-steps
  [What is Queue Storage?]: #what-is
  [Concepts]: #concepts
  [Create a Windows Azure Storage Account]: #create-account
  [How To: Create a Queue]: #create-queue
  [How To: Insert a Message into a Queue]: #insert-message
  [How To: Peek at the Next Message]: #peek-message
  [How To: Dequeue the Next Message]: #get-message
  [How To: Change the Contents of a Queued Message]: #change-contents
  [How To: Additional Options for Dequeuing Messages]: #advanced-get
  [How To: Get the Queue Length]: #get-queue-length
  [How To: Delete a Queue]: #delete-queue
  [Queue1]: ../../../DevCenter/dotNet/Media/queue1.png
  [using the REST API]: http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx
  [Windows Azure Management Portal]: http://windows.azure.com
  [Blob2]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage2.png
  [Blob3]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage3.png
  [Blob4]: ../../../DevCenter/Java/Media/WA_HowToBlobStorage4.png
  [Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Windows Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
