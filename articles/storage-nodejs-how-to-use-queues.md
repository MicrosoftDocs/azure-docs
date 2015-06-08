<properties 
	pageTitle="How to use Queue storage from Node.js | Microsoft Azure" 
	description="Learn how to use the Azure Queue service to create and delete queues, and insert, get, and delete messages. Samples written in Node.js." 
	services="storage" 
	documentationCenter="nodejs" 
	authors="MikeWasson" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="nodejs" 
	ms.topic="article" 
	ms.date="03/11/2015" 
	ms.author="mwasson"/>


# How to use Queue storage from Node.js

[AZURE.INCLUDE [storage-selector-queue-include](../includes/storage-selector-queue-include.md)]

## Overview

This guide shows you how to perform common scenarios using the Microsoft
Azure Queue service. The samples are written using the Node.js
API. The scenarios covered include **inserting**, **peeking**,
**getting**, and **deleting** queue messages, as well as **creating and
deleting queues**.

[AZURE.INCLUDE [storage-queue-concepts-include](../includes/storage-queue-concepts-include.md)]

[AZURE.INCLUDE [storage-create-account-include](../includes/storage-create-account-include.md)]

## Create a Node.js Application

Create a blank Node.js application. For instructions creating a Node.js application, see [Create and deploy a Node.js application to an Azure Web Site], [Node.js Cloud Service][Node.js Cloud Service] (using Windows PowerShell), or [Web Site with WebMatrix].

## Configure Your Application to Access Storage

To use Azure storage, you need the Azure Storage SDK for Node.js, which includes a set of convenience libraries that
communicate with the storage REST services.

### Use Node Package Manager (NPM) to obtain the package

1.  Use a command-line interface such as **PowerShell** (Windows,) **Terminal** (Mac,) or **Bash** (Unix), navigate to the folder where you created your sample application.

2.  Type **npm install azure-storage** in the command window, which should
    result in the following output:

        azure-storage@0.1.0 node_modules\azure-storage
		├── extend@1.2.1
		├── xmlbuilder@0.4.3
		├── mime@1.2.11
		├── underscore@1.4.4
		├── validator@3.1.0
		├── node-uuid@1.4.1
		├── xml2js@0.2.7 (sax@0.5.2)
		└── request@2.27.0 (json-stringify-safe@5.0.0, tunnel-agent@0.3.0, aws-sign@0.3.0, forever-agent@0.5.2, qs@0.6.6, oauth-sign@0.3.0, cookie-jar@0.3.0, hawk@1.0.0, form-data@0.1.3, http-signature@0.10.0)

3.  You can manually run the **ls** command to verify that a
    **node\_modules** folder was created. Inside that folder you will
    find the **azure-storage** package, which contains the libraries you need to
    access storage.

### Import the package

Using Notepad or another text editor, add the following to the top the
**server.js** file of the application where you intend to use storage:

    var azure = require('azure-storage');

## Setup an Azure Storage Connection

The azure module will read the environment variables AZURE\_STORAGE\_ACCOUNT and AZURE\_STORAGE\_ACCESS\_KEY, or AZURE\_STORAGE\_CONNECTION\_STRING for information required to connect to your Azure storage account. If these environment variables are not set, you must specify the account information when calling **createQueueService**.

For an example of setting the environment variables in the management portal for an Azure Website, see [Node.js Web Application with Storage]

## How To: Create a Queue

The following code creates a **QueueService** object, which enables you
to work with queues.

    var queueSvc = azure.createQueueService();

Use the **createQueueIfNotExists** method, which returns the specified
queue if it already exists or creates a new queue with the specified
name if it does not already exist.

	queueSvc.createQueueIfNotExists('myqueue', function(error, result, response){
      if(!error){
        // Queue created or exists
	  }
	});

If the queue is created, `result` is true. If the queue exists, `result` is false.

### Filters

Optional filtering operations can be applied to operations performed using **QueueService**. Filtering operations can include logging, automatically retrying, etc. Filters are objects that implement a method with the signature:

		function handle (requestOptions, next)

After doing its preprocessing on the request options, the method needs to call "next" passing a callback with the following signature:

		function (returnObject, finalCallback, next)

In this callback, and after processing the returnObject (the response from the request to the server), the callback needs to either invoke next if it exists to continue processing other filters or simply invoke finalCallback otherwise to end up the service invocation.

Two filters that implement retry logic are included with the Azure SDK for Node.js, **ExponentialRetryPolicyFilter** and **LinearRetryPolicyFilter**. The following creates a **QueueService** object that uses the **ExponentialRetryPolicyFilter**:

	var retryOperations = new azure.ExponentialRetryPolicyFilter();
	var queueSvc = azure.createQueueService().withFilter(retryOperations);

## How To: Insert a Message into a Queue

To insert a message into a queue, use the **createMessage** method to
create a new message and add it to the queue.

	queueSvc.createMessage('myqueue', "Hello world!", function(error, result, response){
	  if(!error){
	    // Message inserted
	  }
	});

## How To: Peek at the Next Message

You can peek at the message in the front of a queue without removing it
from the queue by calling the **peekMessages** method. By default,
**peekMessages** peeks at a single message.

	queueSvc.peekMessages('myqueue', function(error, result, response){
	  if(!error){
		// Messages peeked
	  }
	});

The `result` contains the message.

> [AZURE.NOTE] Using **peekMessages** when there are no messages in the queue will not return an error, however no messages will be returned.

## How To: Dequeue the Next Message

Processing a message is a two-stage process:

1. Dequeue the message.

2. Delete the message.

To dequeue a message, use **getMessage**. This makes the message invisible in the queue, so no other clients can process it. Once your application has processed the message, call **deleteMessage** to delete it from the queue. The following example gets a message, then deletes it:

	queueSvc.getMessages('myqueue', function(error, result, response){
      if(!error){
	    // message dequed
        var message = result[0];
        queueSvc.deleteMessage('myqueue', message.messageid, message.popreceipt, function(error, response){
	      if(!error){
		    //message deleted
		  }
		});
	  }
	});

> [AZURE.NOTE] By default, a message is only hidden for 30 seconds, after which it is visible to other clients. You can specify a different value by using `options.visibilityTimeout` with **getMessages**.

> [AZURE.NOTE]
> Using <b>getMessages</b> when there are no messages in the queue will not return an error, however no messages will be returned.

## How To: Change the Contents of a Queued Message

You can change the contents of a message in-place in the queue using **updateMessage**. The following example updates the text of a message:

    queueSvc.getMessages('myqueue', function(error, result, response){
	  if(!error){
		// Got the message
		var message = result[0];
		queueSvc.updateMessage('myqueue', message.messageid, message.popreceipt, 10, {messageText: 'new text'}, function(error, result, response){
		  if(!error){
			// Message updated successfully
		  }
		});
	  }
	});

## How To: Additional Options for Dequeuing Messages

There are two ways you can customize message retrieval from a queue:

* `options.numOfMessages` - Retrieve a batch of messages (up to 32.)
* `options.visibilityTimeout` - Set a longer or shorter invisibility timeout.

The following example uses the **getMessages** method to get 15 messages in one call. Then it processes
each message using a for loop. It also sets the invisibility timeout to five minutes for all messages returned by this method.

    queueSvc.getMessages('myqueue', {numOfMessages: 15, visibilityTimeout: 5 * 60}, function(error, result, response){
	  if(!error){
		// Messages retreived
		for(var index in result){
		  // text is available in result[index].messageText
		  var message = result[index];
		  queueSvc.deleteMessage(queueName, message.messageid, message.popreceipt, function(error, response){
			if(!error){
			  // Message deleted
			}
		  });
		}
	  }
	});

## How To: Get the Queue Length

The **getQueueMetadata** returns metadata about the queue, including the approximate number of messages waiting in the queue.

    queueSvc.getQueueMetadata('myqueue', function(error, result, response){
	  if(!error){
		// Queue length is available in result.approximatemessagecount
	  }
	});

## How To: List Queues

To retrieve a list of queues, use **listQueuesSegmented**. To retrieve a list filtered by a specific prefix, use **listQueuesSegmentedWithPrefix**.

	queueSvc.listQueuesSegmented(null, function(error, result, response){
	  if(!error){
	    // result.entries contains the list of queues
	  }
	});

If all queues cannot be returned, `result.continuationToken` can be used as the first parameter of **listQueuesSegmented** or the second parameter of **listQueuesSegmentedWithPrefix** to retrieve more results.

## How To: Delete a Queue

To delete a queue and all the messages contained in it, call the
**deleteQueue** method on the queue object.

    queueSvc.deleteQueue(queueName, function(error, response){
		if(!error){
			// Queue has been deleted
		}
	});

To clear all messages from a queue without deleting it, use **clearMessages**.

## How to: Work with Shared Access Signatures

Shared Access Signatures (SAS) are a secure way to provide granular access to queues without providing your storage account name or keys. SAS are often used to provide limited access to your queues, such as allowing a mobile app to submit messages.

A trusted application such as a cloud-based service generates a SAS using the **generateSharedAccessSignature** of the **QueueService**, and provides it to an untrusted or semi-trusted application. For example, a mobile app. The SAS is generated using a policy, which describes the start and end dates during which the SAS is valid, as well as the access level granted to the SAS holder.

The following example generates a new shared access policy that will allow the SAS holder to add messages to the queue, and expires 100 minutes after the time it is created.

	var startDate = new Date();
	var expiryDate = new Date(startDate);
	expiryDate.setMinutes(startDate.getMinutes() + 100);
	startDate.setMinutes(startDate.getMinutes() - 100);
	
	var sharedAccessPolicy = {
	  AccessPolicy: {
	    Permissions: azure.QueueUtilities.SharedAccessPermissions.ADD,
	    Start: startDate,
	    Expiry: expiryDate
	  }
	};

	var queueSAS = queueSvc.generateSharedAccessSignature('myqueue', sharedAccessPolicy);
	var host = queueSvc.host;

Note that the host information must be provided also, as it is required when the SAS holder attempts to access the queue.

The client application then uses the SAS with **QueueServiceWithSAS** to perform operations against the queue. The following example connects to the queue and creates a message.

	var sharedQueueService = azure.createQueueServiceWithSas(host, queueSAS);
	sharedQueueService.createMessage('myqueue', 'Hello world from SAS!', function(error, result, response){
	  if(!error){
	    //message added
	  }
	});

Since the SAS was generated with add access, if an attempt were made to read, update or delete messages, an error would be returned.

### Access control lists

You can also use an Access Control List (ACL) to set the access policy for a SAS. This is useful if you wish to allow multiple clients to access the queue, but provide different access policies for each client.

An ACL is implemented using an array of access policies, with an ID associated with each policy. The  following example defines two policies; one for 'user1' and one for 'user2':

	var sharedAccessPolicy = [
	  {
	    AccessPolicy: {
	      Permissions: azure.QueueUtilities.SharedAccessPermissions.PROCESS,
	      Start: startDate,
	      Expiry: expiryDate
	    },
	    Id: 'user1'
	  },
	  {
	    AccessPolicy: {
	      Permissions: azure.QueueUtilities.SharedAccessPermissions.ADD,
	      Start: startDate,
	      Expiry: expiryDate
	    },
	    Id: 'user2'
	  }
	];

The following example gets the current ACL for **myqueue**, then adds the new policies using **setQueueAcl**. This approach allows:

	queueSvc.getQueueAcl('myqueue', function(error, result, response) {
      if(!error){
		//push the new policy into signedIdentifiers
		result.signedIdentifiers.push(sharedAccessPolicy);
		queueSvc.setQueueAcl('myqueue', result, function(error, result, response){
	  	  if(!error){
	    	// ACL set
	  	  }
		});
	  }
	});

Once the ACL has been set, you can then create a SAS based on the ID for a policy. The following example creates a new SAS for 'user2':

	queueSAS = queueSvc.generateSharedAccessSignature('myqueue', { Id: 'user2' });

## Next Steps

Now that you've learned the basics of queue storage, follow these links
to learn about more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Azure][].
-   Visit the [Azure Storage Team Blog][].
-   Visit the [Azure Storage SDK for Node][] repository on GitHub.

  [Azure Storage SDK for Node]: https://github.com/Azure/azure-storage-node
  [using the REST API]: http://msdn.microsoft.com/library/azure/hh264518.aspx
  [Azure Management Portal]: http://manage.windowsazure.com
  [Create and deploy a Node.js application to an Azure Web Site]: web-sites-nodejs-develop-deploy-mac.md
  [Node.js Cloud Service with Storage]: storage-nodejs-use-table-storage-cloud-service-app.md
  [Node.js Web Application with Storage]: storage-nodejs-use-table-storage-web-site.md

  
  [Queue1]: ./media/storage-nodejs-how-to-use-queues/queue1.png
  [plus-new]: ./media/storage-nodejs-how-to-use-queues/plus-new.png
  [quick-create-storage]: ./media/storage-nodejs-how-to-use-queues/quick-storage.png
  
  
  
  [Node.js Cloud Service]: cloud-services-nodejs-develop-deploy-app.md
  [Storing and Accessing Data in Azure]: http://msdn.microsoft.com/library/azure/gg433040.aspx
  [Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
 [Web Site with WebMatrix]: web-sites-nodejs-use-webmatrix.md
