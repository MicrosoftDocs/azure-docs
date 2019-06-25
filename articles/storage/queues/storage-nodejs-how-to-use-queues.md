---
title: How to use Queue storage from Node.js - Azure Storage
description: Learn how to use the Azure Queue service to create and delete queues, and insert, get, and delete messages. Samples written in Node.js.
services: storage
author: mhopkins-msft
ms.service: storage

ms.devlang: nodejs
ms.topic: article
ms.date: 12/08/2016
ms.author: mhopkins
ms.reviewer: cbrooks
ms.subservice: queues
---

# How to use Queue storage from Node.js
[!INCLUDE [storage-selector-queue-include](../../../includes/storage-selector-queue-include.md)]

[!INCLUDE [storage-check-out-samples-all](../../../includes/storage-check-out-samples-all.md)]

## Overview
This guide shows you how to perform common scenarios using the Microsoft
Azure Queue service. The samples are written using the Node.js
API. The scenarios covered include **inserting**, **peeking**,
**getting**, and **deleting** queue messages, as well as **creating and
deleting queues**.

[!INCLUDE [storage-queue-concepts-include](../../../includes/storage-queue-concepts-include.md)]

[!INCLUDE [storage-create-account-include](../../../includes/storage-create-account-include.md)]

## Create a Node.js Application
Create a blank Node.js application. For instructions creating a Node.js application, see [Create a Node.js web app in Azure App Service](../../app-service/app-service-web-get-started-nodejs.md), [Build and deploy a Node.js application to an Azure Cloud Service](../../cloud-services/cloud-services-nodejs-develop-deploy-app.md) using Windows PowerShell, or [Visual Studio Code](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial).

## Configure Your Application to Access Storage
To use Azure storage, you need the Azure Storage SDK for Node.js, which includes a set of convenience libraries that
communicate with the storage REST services.

### Use Node Package Manager (NPM) to obtain the package
1. Use a command-line interface such as **PowerShell** (Windows,) **Terminal** (Mac,) or **Bash** (Unix), navigate to the folder where you created your sample application.
2. Type **npm install azure-storage** in the command window. Output from the command is similar to the following example.
 
	```bash
	azure-storage@0.5.0 node_modules\azure-storage
	+-- extend@1.2.1
	+-- xmlbuilder@0.4.3
	+-- mime@1.2.11
	+-- node-uuid@1.4.3
	+-- validator@3.22.2
	+-- underscore@1.4.4
	+-- readable-stream@1.0.33 (string_decoder@0.10.31, isarray@0.0.1, inherits@2.0.1, core-util-is@1.0.1)
	+-- xml2js@0.2.7 (sax@0.5.2)
	+-- request@2.57.0 (caseless@0.10.0, aws-sign2@0.5.0, forever-agent@0.6.1, stringstream@0.0.4, oauth-sign@0.8.0, tunnel-agent@0.4.1, isstream@0.1.2, json-stringify-safe@5.0.1, bl@0.9.4, combined-stream@1.0.5, qs@3.1.0, mime-types@2.0.14, form-data@0.2.0, http-signature@0.11.0, tough-cookie@2.0.0, hawk@2.3.1, har-validator@1.8.0)
	```

3. You can manually run the **ls** command to verify that a
   **node\_modules** folder was created. Inside that folder you will
   find the **azure-storage** package, which contains the libraries you need to
   access storage.

### Import the package
Using Notepad or another text editor, add the following to the top the
**server.js** file of the application where you intend to use storage:

```javascript
var azure = require('azure-storage');
```

## Setup an Azure Storage Connection
The azure module will read the environment variables AZURE\_STORAGE\_ACCOUNT and AZURE\_STORAGE\_ACCESS\_KEY, or AZURE\_STORAGE\_CONNECTION\_STRING for information required to connect to your Azure storage account. If these environment variables are not set, you must specify the account information when calling **createQueueService**.

## How To: Create a Queue
The following code creates a **QueueService** object, which enables you
to work with queues.

```javascript
var queueSvc = azure.createQueueService();
```

Use the **createQueueIfNotExists** method, which returns the specified
queue if it already exists or creates a new queue with the specified
name if it does not already exist.

```javascript
queueSvc.createQueueIfNotExists('myqueue', function(error, results, response){
  if(!error){
    // Queue created or exists
  }
});
```

If the queue is created, `result.created` is true. If the queue exists, `result.created` is false.

### Filters
Optional filtering operations can be applied to operations performed using **QueueService**. Filtering operations can include logging, automatically retrying, etc. Filters are objects that implement a method with the signature:

```javascript
function handle (requestOptions, next)
```

After doing its preprocessing on the request options, the method needs to call "next" passing a callback with the following signature:

```javascript
function (returnObject, finalCallback, next)
```

In this callback, and after processing the returnObject (the response from the request to the server), the callback needs to either invoke next if it exists to continue processing other filters or simply invoke finalCallback otherwise to end up the service invocation.

Two filters that implement retry logic are included with the Azure SDK for Node.js, **ExponentialRetryPolicyFilter** and **LinearRetryPolicyFilter**. The following creates a **QueueService** object that uses the **ExponentialRetryPolicyFilter**:

```javascript
var retryOperations = new azure.ExponentialRetryPolicyFilter();
var queueSvc = azure.createQueueService().withFilter(retryOperations);
```

## How To: Insert a Message into a Queue
To insert a message into a queue, use the **createMessage** method to
create a new message and add it to the queue.

```javascript
queueSvc.createMessage('myqueue', "Hello world!", function(error, results, response){
  if(!error){
    // Message inserted
  }
});
```

## How To: Peek at the Next Message
You can peek at the message in the front of a queue without removing it
from the queue by calling the **peekMessages** method. By default,
**peekMessages** peeks at a single message.

```javascript
queueSvc.peekMessages('myqueue', function(error, results, response){
  if(!error){
    // Message text is in results[0].messageText
  }
});
```

The `result` contains the message.

> [!NOTE]
> Using **peekMessages** when there are no messages in the queue will not return an error, however no messages will be returned.
> 
> 

## How To: Dequeue the Next Message
Processing a message is a two-stage process:

1. Dequeue the message.
2. Delete the message.

To dequeue a message, use **getMessages**. This makes the messages invisible in the queue, so no other clients can process them. Once your application has processed a message, call **deleteMessage** to delete it from the queue. The following example gets a message, then deletes it:

```javascript
queueSvc.getMessages('myqueue', function(error, results, response){
  if(!error){
    // Message text is in results[0].messageText
    var message = results[0];
    queueSvc.deleteMessage('myqueue', message.messageId, message.popReceipt, function(error, response){
      if(!error){
        //message deleted
      }
    });
  }
});
```

> [!NOTE]
> By default, a message is only hidden for 30 seconds, after which it is visible to other clients. You can specify a different value by using `options.visibilityTimeout` with **getMessages**.
> 
> [!NOTE]
> Using **getMessages** when there are no messages in the queue will not return an error, however no messages will be returned.
> 
> 

## How To: Change the Contents of a Queued Message
You can change the contents of a message in-place in the queue using **updateMessage**. The following example updates the text of a message:

```javascript
queueSvc.getMessages('myqueue', function(error, getResults, getResponse){
  if(!error){
    // Got the message
    var message = getResults[0];
    queueSvc.updateMessage('myqueue', message.messageId, message.popReceipt, 10, {messageText: 'new text'}, function(error, updateResults, updateResponse){
      if(!error){
        // Message updated successfully
      }
    });
  }
});
```

## How To: Additional Options for Dequeuing Messages
There are two ways you can customize message retrieval from a queue:

* `options.numOfMessages` - Retrieve a batch of messages (up to 32.)
* `options.visibilityTimeout` - Set a longer or shorter invisibility timeout.

The following example uses the **getMessages** method to get 15 messages in one call. Then it processes
each message using a for loop. It also sets the invisibility timeout to five minutes for all messages returned by this method.

```javascript
queueSvc.getMessages('myqueue', {numOfMessages: 15, visibilityTimeout: 5 * 60}, function(error, results, getResponse){
  if(!error){
    // Messages retrieved
    for(var index in result){
      // text is available in result[index].messageText
      var message = results[index];
      queueSvc.deleteMessage(queueName, message.messageId, message.popReceipt, function(error, deleteResponse){
        if(!error){
          // Message deleted
        }
      });
    }
  }
});
```

## How To: Get the Queue Length
The **getQueueMetadata** returns metadata about the queue, including the approximate number of messages waiting in the queue.

```javascript
queueSvc.getQueueMetadata('myqueue', function(error, results, response){
  if(!error){
    // Queue length is available in results.approximateMessageCount
  }
});
```

## How To: List Queues
To retrieve a list of queues, use **listQueuesSegmented**. To retrieve a list filtered by a specific prefix, use **listQueuesSegmentedWithPrefix**.

```javascript
queueSvc.listQueuesSegmented(null, function(error, results, response){
  if(!error){
    // results.entries contains the list of queues
  }
});
```

If all queues cannot be returned, `result.continuationToken` can be used as the first parameter of **listQueuesSegmented** or the second parameter of **listQueuesSegmentedWithPrefix** to retrieve more results.

## How To: Delete a Queue
To delete a queue and all the messages contained in it, call the
**deleteQueue** method on the queue object.

```javascript
queueSvc.deleteQueue(queueName, function(error, response){
  if(!error){
    // Queue has been deleted
  }
});
```

To clear all messages from a queue without deleting it, use **clearMessages**.

## How to: Work with Shared Access Signatures
Shared Access Signatures (SAS) are a secure way to provide granular access to queues without providing your storage account name or keys. SAS are often used to provide limited access to your queues, such as allowing a mobile app to submit messages.

A trusted application such as a cloud-based service generates a SAS using the **generateSharedAccessSignature** of the **QueueService**, and provides it to an untrusted or semi-trusted application. For example, a mobile app. The SAS is generated using a policy, which describes the start and end dates during which the SAS is valid, as well as the access level granted to the SAS holder.

The following example generates a new shared access policy that will allow the SAS holder to add messages to the queue, and expires 100 minutes after the time it is created.

```javascript
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
```

Note that the host information must be provided also, as it is required when the SAS holder attempts to access the queue.

The client application then uses the SAS with **QueueServiceWithSAS** to perform operations against the queue. The following example connects to the queue and creates a message.

```javascript
var sharedQueueService = azure.createQueueServiceWithSas(host, queueSAS);
sharedQueueService.createMessage('myqueue', 'Hello world from SAS!', function(error, result, response){
  if(!error){
    //message added
  }
});
```

Since the SAS was generated with add access, if an attempt were made to read, update or delete messages, an error would be returned.

### Access control lists
You can also use an Access Control List (ACL) to set the access policy for a SAS. This is useful if you wish to allow multiple clients to access the queue, but provide different access policies for each client.

An ACL is implemented using an array of access policies, with an ID associated with each policy. The  following example defines two policies; one for 'user1' and one for 'user2':

```javascript
var sharedAccessPolicy = {
  user1: {
    Permissions: azure.QueueUtilities.SharedAccessPermissions.PROCESS,
    Start: startDate,
    Expiry: expiryDate
  },
  user2: {
    Permissions: azure.QueueUtilities.SharedAccessPermissions.ADD,
    Start: startDate,
    Expiry: expiryDate
  }
};
```

The following example gets the current ACL for **myqueue**, then adds the new policies using **setQueueAcl**. This approach allows:

```javascript
var extend = require('extend');
queueSvc.getQueueAcl('myqueue', function(error, result, response) {
  if(!error){
    var newSignedIdentifiers = extend(true, result.signedIdentifiers, sharedAccessPolicy);
    queueSvc.setQueueAcl('myqueue', newSignedIdentifiers, function(error, result, response){
      if(!error){
        // ACL set
      }
    });
  }
});
```

Once the ACL has been set, you can then create a SAS based on the ID for a policy. The following example creates a new SAS for 'user2':

```javascript
queueSAS = queueSvc.generateSharedAccessSignature('myqueue', { Id: 'user2' });
```

## Next Steps
Now that you've learned the basics of queue storage, follow these links
to learn about more complex storage tasks.

* Visit the [Azure Storage Team Blog][Azure Storage Team Blog].
* Visit the [Azure Storage SDK for Node][Azure Storage SDK for Node] repository on GitHub.



[Azure Storage SDK for Node]: https://github.com/Azure/azure-storage-node

[using the REST API]: https://msdn.microsoft.com/library/azure/hh264518.aspx

[Azure Portal]: https://portal.azure.com

[Create a Node.js web app in Azure App Service](../../app-service/app-service-web-get-started-nodejs.md)

[Build and deploy a Node.js application to an Azure Cloud Service](../../cloud-services/cloud-services-nodejs-develop-deploy-app.md)

[Azure Storage Team Blog]: https://blogs.msdn.com/b/windowsazurestorage/

[Build and deploy a Node.js web app to Azure using Web Matrix]: https://www.microsoft.com/web/webmatrix/
