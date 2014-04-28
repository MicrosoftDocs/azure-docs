<properties linkid="dev-nodejs-how-to-service-bus-queues" urlDisplayName="Queue Service" pageTitle="How to use the queue service (Node.js) | Microsoft Azure" metaKeywords="Azure Queue Service get messages Node.js" description="Learn how to use the Azure Queue service to create and delete queues, and insert, get, and delete messages. Samples written in Node.js." metaCanonical="" services="storage" documentationCenter="Node.js" title="How to Use the Queue Service from Node.js" authors="" solutions="" manager="" editor="" />





# How to Use the Queue Service from Node.js

This guide shows you how to perform common scenarios using the Windows
Azure Queue service. The samples are written using the Node.js
API. The scenarios covered include **inserting**, **peeking**,
**getting**, and **deleting** queue messages, as well as **creating and
deleting queues**. For more information on queues, refer to the [Next Steps][] section.

## Table of Contents

* [What is the Queue Service?][]   
* [Concepts][]   
* [Create an Azure Storage Account][]   
* [Create a Node.js Application][]   
* [Configure your Application to Access Storage][]   
* [Setup an Azure Storage Connection String][]   
* [How To: Create a Queue][]   
* [How To: Insert a Message into a Queue][]   
* [How To: Peek at the Next Message][]   
* [How To: Dequeue the Next Message][]   
* [How To: Change the Contents of a Queued Message][]   
* [How To: Additional Options for Dequeuing Messages][]   
* [How To: Get the Queue Length][]   
* [How To: Delete a Queue][]   
* [Next Steps][]

[WACOM.INCLUDE [howto-queue-storage](../includes/howto-queue-storage.md)]

<h2><a name="create-account"></a><span  class="short-header">Create an account</span>Create an Azure Storage account</h2>

[WACOM.INCLUDE [create-storage-account](../includes/create-storage-account.md)]

## <a name="create-app"> </a>Create a Node.js Application

Create a blank Node.js application. For instructions creating a Node.js application, see [Create and deploy a Node.js application to an Azure Web Site], [Node.js Cloud Service] (using Windows PowerShell), or [Web Site with WebMatrix].

## <a name="configure-access"> </a>Configure Your Application to Access Storage

To use Azure storage, you need to download and use the Node.js
azure package, which includes a set of convenience libraries that
communicate with the storage REST services.

### Use Node Package Manager (NPM) to obtain the package

1.  Use a command-line interface such as **PowerShell** (Windows,) **Terminal** (Mac,) or **Bash** (Unix), navigate to the folder where you created your sample application.

2.  Type **npm install azure** in the command window, which should
    result in the following output:

        azure@0.7.5 node_modules\azure
		|-- dateformat@1.0.2-1.2.3
		|-- xmlbuilder@0.4.2
		|-- node-uuid@1.2.0
		|-- mime@1.2.9
		|-- underscore@1.4.4
		|-- validator@1.1.1
		|-- tunnel@0.0.2
		|-- wns@0.5.3
		|-- xml2js@0.2.7 (sax@0.5.2)
		|-- request@2.21.0 (json-stringify-safe@4.0.0, forever-agent@0.5.0, aws-sign@0.3.0, tunnel-agent@0.3.0, oauth-sign@0.3.0, qs@0.6.5, cookie-jar@0.3.0, node-uuid@1.4.0, http-signature@0.9.11, form-data@0.0.8, hawk@0.13.1)

3.  You can manually run the **ls** command to verify that a
    **node\_modules** folder was created. Inside that folder you will
    find the **azure** package, which contains the libraries you need to
    access storage.

### Import the package

Using Notepad or another text editor, add the following to the top the
**server.js** file of the application where you intend to use storage:

    var azure = require('azure');

## <a name="setup-connection-string"> </a>Setup an Azure Storage Connection

The azure module will read the environment variables AZURE\_STORAGE\_ACCOUNT and AZURE\_STORAGE\_ACCESS\_KEY for information required to connect to your Azure storage account. If these environment variables are not set, you must specify the account information when calling **createQueueService**.

For an example of setting the environment variables in a configuration file for an Azure Cloud Service, see [Node.js Cloud Service with Storage].

For an example of setting the environment variables in the management portal for an Azure Web Site, see [Node.js Web Application with Storage]

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

###Filters

Optional filtering operations can be applied to operations performed using **QueueService**. Filtering operations can include logging, automatically retrying, etc. Filters are objects that implement a method with the signature:

		function handle (requestOptions, next)

After doing its preprocessing on the request options, the method needs to call "next" passing a callback with the following signature:

		function (returnObject, finalCallback, next)

In this callback, and after processing the returnObject (the response from the request to the server), the callback needs to either invoke next if it exists to continue processing other filters or simply invoke finalCallback otherwise to end up the service invocation.

Two filters that implement retry logic are included with the Azure SDK for Node.js, **ExponentialRetryPolicyFilter** and **LinearRetryPolicyFilter**. The following creates a **QueueService** object that uses the **ExponentialRetryPolicyFilter**:

	var retryOperations = new azure.ExponentialRetryPolicyFilter();
	var queueService = azure.createQueueService().withFilter(retryOperations);

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


> [WACOM.NOTE] 
>Using <strong>peekMessage</strong> when there are no messages in the queue will not return an error, however no messages will be returned.

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

> [WACOM.NOTE]
> Using <b>getMessages</b> when there are no messages in the queue will not return an error, however no messages will be returned.

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

Now that you've learned the basics of queue storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Azure][].
-   Visit the [Azure Storage Team Blog][].
-   Visit the [Azure SDK for Node] repository on GitHub.

  [Azure SDK for Node]: https://github.com/WindowsAzure/azure-sdk-for-node
  [Next Steps]: #next-steps
  [What is the Queue Service?]: #what-is
  [Concepts]: #concepts
  [Create an Azure Storage Account]: #create-account
  [Create a Node.js Application]: #create-app
  [Configure your Application to Access Storage]: #configure-access
  [Setup an Azure Storage Connection String]: #setup-connection-string
  [How To: Create a Queue]: #create-queue
  [How To: Insert a Message into a Queue]: #insert-message
  [How To: Peek at the Next Message]: #peek-message
  [How To: Dequeue the Next Message]: #get-message
  [How To: Change the Contents of a Queued Message]: #change-contents
  [How To: Additional Options for Dequeuing Messages]: #advanced-get
  [How To: Get the Queue Length]: #get-queue-length
  [How To: Delete a Queue]: #delete-queue
  [using the REST API]: http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx
  [Azure Management Portal]: http://manage.windowsazure.com
  [Create and deploy a Node.js application to an Azure Web Site]: /en-us/develop/nodejs/tutorials/create-a-website-(mac)/
  [Node.js Cloud Service with Storage]: /en-us/develop/nodejs/tutorials/web-app-with-storage/
  [Node.js Web Application with Storage]: /en-us/develop/nodejs/tutorials/web-site-with-storage/
  
  [Queue1]: ./media/storage-nodejs-how-to-use-queues/queue1.png
  [plus-new]: ./media/storage-nodejs-how-to-use-queues/plus-new.png
  [quick-create-storage]: ./media/storage-nodejs-how-to-use-queues/quick-storage.png
  
  
  
  [Node.js Cloud Service]: {localLink:2221} "Web App with Express"
  [Storing and Accessing Data in Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
  [Web Site with WebMatrix]: /en-us/develop/nodejs/tutorials/web-site-with-webmatrix/
