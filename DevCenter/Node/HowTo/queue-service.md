<properties linkid="dev-nodejs-how-to-service-bus-queues" urlDisplayName="Queue Service" pageTitle="How to use the queue service (Node.js) - Windows Azure" metaKeywords="Windows Azure Queue Service get messages Node.js" metaDescription="Learn how to use the Windows Azure Queue service to create and delete queues, and insert, get, and delete messages. Samples written in Node.js." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />



# How to Use the Queue Service from Node.js

This guide shows you how to perform common scenarios using the Windows
Azure Queue service. The samples are written using the Node.js
API. The scenarios covered include **inserting**, **peeking**,
**getting**, and **deleting** queue messages, as well as **creating and
deleting queues**. For more information on queues, refer to the [Next Steps][] section.

## Table of Contents

* [What is the Queue Service?][]   
* [Concepts][]   
* [Create a Windows Azure Storage Account][]   
* [Create a Node.js Application][]   
* [Configure your Application to Access Storage][]   
* [Setup a Windows Azure Storage Connection String][]   
* [How To: Create a Queue][]   
* [How To: Insert a Message into a Queue][]   
* [How To: Peek at the Next Message][]   
* [How To: Dequeue the Next Message][]   
* [How To: Change the Contents of a Queued Message][]   
* [How To: Additional Options for Dequeuing Messages][]   
* [How To: Get the Queue Length][]   
* [How To: Delete a Queue][]   
* [Next Steps][]

## <a name="what-is"> </a>What is the Queue Service?

The Windows Azure Queue service is a service for storing large numbers of
messages that can be accessed from anywhere in the world via
authenticated calls using HTTP or HTTPS. A single queue message can be
up to 64KB in size, a queue can contain millions of messages, up to the
100TB total capacity limit of a storage account. Common uses of the Queue
service include:

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

1.  Log into the [Windows Azure Management Portal].

2.  At the bottom of the navigation pane, click **+NEW**.

	![+new][plus-new]

3.  Click **Storage Account**, and then click **Quick Create**.

	![Quick create dialog][quick-create-storage]

4.  In URL, type a subdomain name to use in the URI for the
    storage account. The entry can contain from 3-24 lowercase letters
    and numbers. This value becomes the host name within the URI that is
    used to address Blob, Queue, or Table resources for the
    subscription.

5.  Choose a Region/Affinity Group in which to locate the
    storage. If you will be using storage from your Windows Azure
    application, select the same region where you will deploy your
    application.

6.  Click **Create Storage Account**.

## <a name="create-app"> </a>Create a Node.js Application

Create a blank Node.js application. For instructions creating a Node.js application, see [Create and deploy a Node.js application to a Windows Azure Web Site], [Node.js Cloud Service] (using Windows PowerShell), or [Web Site with WebMatrix].

## <a name="configure-access"> </a>Configure Your Application to Access Storage

To use Windows Azure storage, you need to download and use the Node.js
azure package, which includes a set of convenience libraries that
communicate with the storage REST services.

### Use Node Package Manager (NPM) to obtain the package

1.  Use a command-line interface such as **PowerShell** (Windows,) **Terminal** (Mac,) or **Bash** (Unix), navigate to the folder where you created your sample application.

2.  Type **npm install azure** in the command window, which should
    result in the following output:

        azure@0.6.0 ./node_modules/azure
		├── easy-table@0.0.1
		├── dateformat@1.0.2-1.2.3
		├── xmlbuilder@0.3.1
		├── eyes@0.1.7
		├── colors@0.6.0-1
		├── mime@1.2.5
		├── log@1.3.0
		├── commander@0.6.1
		├── node-uuid@1.2.0
		├── xml2js@0.1.14
		├── async@0.1.22
		├── tunnel@0.0.1
		├── underscore@1.3.3
		├── qs@0.5.0
		├── underscore.string@2.2.0rc
		├── sax@0.4.0
		├── streamline@0.2.4
		└── winston@0.6.1 (cycle@1.0.0, stack-trace@0.0.6, pkginfo@0.2.3, request@2.9.202)

3.  You can manually run the **ls** command to verify that a
    **node\_modules** folder was created. Inside that folder you will
    find the **azure** package, which contains the libraries you need to
    access storage.

### Import the package

Using Notepad or another text editor, add the following to the top the
**server.js** file of the application where you intend to use storage:

    var azure = require('azure');

## <a name="setup-connection-string"> </a>Setup a Windows Azure Storage Connection

The azure module will read the environment variables AZURE\_STORAGE\_ACCOUNT and AZURE\_STORAGE\_ACCESS\_KEY for information required to connect to your Windows Azure storage account. If these environment variables are not set, you must specify the account information when calling **createQueueService**.

For an example of setting the environment variables in a configuration file for a Windows Azure Cloud Service, see [Node.js Cloud Service with Storage].

For an example of setting the environment variables in the management portal for a Windows Azure Web Site, see [Node.js Web Application with Storage]

## <a name="create-queue"> </a>How To: Create a Queue

The following code creates a **QueueService** object, which enables you
to work with queues.

    var queueService = azure.createQueueService();

Use the **createQueueIfNotExists** method, which returns the specified
queue if it already exists or creates a new queue with the specified
name if it does not already exist.

	queueService.createQueueIfNotExists(queueName, function(error){
    	if(!error){
        	// Queue exists
	    }
	});

## <a name="insert-message"> </a>How To: Insert a Message into a Queue

To insert a message into a queue, use the **createMessage** method to
create a new message and add it to the queue.

	queueService.createMessage(queueName, "Hello world!", function(error){
	    if(!error){
	        // Message inserted
	    }
	});


## <a name="peek-message"> </a>How To: Peek at the Next Message

You can peek at the message in the front of a queue without removing it
from the queue by calling the **peekMessages** method. By default,
**peekMessages** peeks at a single message.

	queueService.peekMessages(queueName, function(error, messages){
		if(!error){
			// Messages peeked
			// Text is available in messages[0].messagetext
		}
	});

<div class="dev-callout">
<b>Note</b>
<p>Using <b>peekMessage</b> when there are no messages in the queue will not return an error, however no messages will be returned.</p>
</div>

## <a name="get-message"> </a>How To: Dequeue the Next Message

Your code removes a message from a queue in two steps. When you call
**getMessages**, you get the next message in a queue by default. A
message returned from **getMessages** becomes invisible to any other
code reading messages from this queue. By default, this message stays
invisible for 30 seconds. To finish removing the message from the queue,
you must also call **deleteMessage**. This two-step process of removing
a message assures that when your code fails to process a message due to
hardware or software failure, another instance of your code can get the
same message and try again. Your code calls **deleteMessage** right
after the message has been processed.

	queueService.getMessages(queueName, function(error, messages){
	    if(!error){
	        // Process the message in less than 30 seconds, the message
	        // text is available in messages[0].messagetext 
			var message = messages[0]
	        queueService.deleteMessage(queueName
				, message.messageid
				, message.popreceipt
				, function(error){
	            	if(!error){
	                	// Message deleted
	            	}
	        	});
	    }
	});

<div class="dev-callout">
<b>Note</b>
<p>Using <b>getMessages</b> when there are no messages in the queue will not return an error, however no messages will be returned.</p>
</div>

## <a name="change-contents"> </a>How To: Change the Contents of a Queued Message

You can change the contents of a message in-place in the queue. If the
message represents a work task, you could use this feature to update the
status of the work task. The code below uses the **updateMessage**
method to update a message.

    queueService.getMessages(queueName, function(error, messages){
		if(!error){
			// Got the message
			var message = messages[0];
			queueService.updateMessage(queueName
				, message.messageid
				, message.popreceipt
				, 10
				, { messagetext: 'in your message, doing stuff.' }
				, function(error){
					if(!error){
						// Message updated successfully
					}
				});
		}
	});

## <a name="advanced-get"> </a>How To: Additional Options for Dequeuing Messages

There are two ways you can customize message retrieval from a queue.
First, you can get a batch of messages (up to 32). Second, you can set a
longer or shorter invisibility timeout, allowing your code more or less
time to fully process each message. The following code example uses the
**getMessages** method to get 15 messages in one call. Then it processes
each message using a for loop. It also sets the invisibility timeout to
five minutes for each message.

    queueService.getMessages(queueName
		, {numofmessages: 15, visibilitytimeout: 5 * 60}
		, function(error, messages){
		if(!error){
			// Messages retreived
			for(var index in messages){
				// text is available in messages[index].messagetext
				var message = messages[index];
				queueService.deleteMessage(queueName
					, message.messageid
					, message.popreceipt
					, function(error){
						if(!error){
							// Message deleted
						}
					});
			}
		}
	});

## <a name="get-queue-length"> </a>How To: Get the Queue Length

You can get an estimate of the number of messages in a queue. The
**getQueueMetadata** method asks the queue service to return metadata
about the queue, and the **approximatemessagecount** property of the
response contains a count of how many messages are in a queue. The count
is only approximate because messages can be added or removed after the
queue service responds to your request.

    queueService.getQueueMetadata(queueName, function(error, queueInfo){
		if(!error){
			// Queue length is available in queueInfo.approximatemessagecount
		}
	});

## <a name="delete-queue"> </a>How To: Delete a Queue

To delete a queue and all the messages contained in it, call the
**deleteQueue** method on the queue object.

    queueService.deleteQueue(queueName, function(error){
		if(!error){
			// Queue has been deleted
		}
	});

## <a name="next-steps"> </a>Next Steps

Now that you’ve learned the basics of queue storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Windows Azure][].
-   Visit the [Windows Azure Storage Team Blog][].
-   Visit the [Azure SDK for Node] repository on GitHub.

  [Azure SDK for Node]: https://github.com/WindowsAzure/azure-sdk-for-node
  [Next Steps]: #next-steps
  [What is the Queue Service?]: #what-is
  [Concepts]: #concepts
  [Create a Windows Azure Storage Account]: #create-account
  [Create a Node.js Application]: #create-app
  [Configure your Application to Access Storage]: #configure-access
  [Setup a Windows Azure Storage Connection String]: #setup-connection-string
  [How To: Create a Queue]: #create-queue
  [How To: Insert a Message into a Queue]: #insert-message
  [How To: Peek at the Next Message]: #peek-message
  [How To: Dequeue the Next Message]: #get-message
  [How To: Change the Contents of a Queued Message]: #change-contents
  [How To: Additional Options for Dequeuing Messages]: #advanced-get
  [How To: Get the Queue Length]: #get-queue-length
  [How To: Delete a Queue]: #delete-queue
  [Queue1]: ../../dotNet/Media/queue1.png
  [using the REST API]: http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx
  [Windows Azure Management Portal]: http://windows.azure.com
  [Create and deploy a Node.js application to a Windows Azure Web Site]: /en-us/develop/nodejs/tutorials/create-a-website-(mac)/
  [Node.js Cloud Service with Storage]: /en-us/develop/nodejs/tutorials/web-app-with-storage/
  [Node.js Web Application with Storage]: /en-us/develop/nodejs/tutorials/web-site-with-storage/

  [plus-new]: ../../Shared/Media/plus-new.png
  [quick-create-storage]: ../../Shared/Media/quick-storage.png
  [Blob2]: ../../Java/Media/WA_HowToBlobStorage2.png
  [Blob3]: ../../Java/Media/WA_HowToBlobStorage3.png
  [Blob4]: ../../Java/Media/WA_HowToBlobStorage4.png
  [Node.js Cloud Service]: {localLink:2221} "Web App with Express"
  [Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Windows Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
  [Web Site with WebMatrix]: /en-us/develop/nodejs/tutorials/web-site-with-webmatrix/
