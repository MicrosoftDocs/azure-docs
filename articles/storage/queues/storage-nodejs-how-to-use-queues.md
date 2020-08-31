---
title: Use Azure Queue storage from Node.js - Azure Storage
description: Learn how to use the Azure Queue service to create and delete queues, and insert, get, and delete messages. Samples written in Node.js.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 08/31/2020
ms.service: storage
ms.subservice: queues
ms.topic: how-to
ms.reviewer: dineshm
ms.custom: seo-javascript-september2019, devx-track-javascript
---

# Use Azure Queue storage to create and delete queues by using Node.js

[!INCLUDE [storage-selector-queue-include](../../../includes/storage-selector-queue-include.md)]

## Overview

This guide shows you how to perform common scenarios using the Microsoft Azure Queue service. The samples are written using the Node.js API. The scenarios covered include **inserting**, **peeking**, **getting**, and **deleting** queue messages, as well as **creating and deleting queues**.

[!INCLUDE [storage-queue-concepts-include](../../../includes/storage-queue-concepts-include.md)]

[!INCLUDE [storage-create-account-include](../../../includes/storage-create-account-include.md)]

## Create a Node.js application

Create a blank Node.js application. For instructions creating a Node.js application, see [Create a Node.js web app in Azure App Service](../../app-service/quickstart-nodejs.md), [Build and deploy a Node.js application to an Azure Cloud Service](../../cloud-services/cloud-services-nodejs-develop-deploy-app.md) using Windows PowerShell, or [Visual Studio Code](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial).

## Configure your application to access storage

To use Azure storage, you need the Azure Storage SDK for Node.js, which includes a set of convenience libraries that communicate with the storage REST services.

### Use Node Package Manager (NPM) to obtain the package

1. Use a command-line interface such as **PowerShell** (Windows,) **Terminal** (Mac,) or **Bash** (Unix), navigate to the folder where you created your sample application.

# [JavaScript v12](#tab/javascript)

1. Type **npm install @azure/storage-queue** in the command window.

1. Verify that a **node\_modules** folder was created. Inside that folder you will find the **@azure/storage-queue** package, which contains the client library you need to access storage.

# [JavaScript v2](#tab/javascript2)

1. Type **npm install azure-storage** in the command window.

1. Verify that a **node\_modules** folder was created. Inside that folder you will find the **azure-storage** package, which contains the libraries you need to access storage.

---

### Import the package

Using your text editor, add the following to the top the JavaScript file where you intend to use queues.

# [JavaScript v12](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_ImportStatements":::

# [JavaScript v2](#tab/javascript2)

```javascript
var azure = require('azure-storage');
```

---

## Setup an Azure Storage connection

## How to create a queue

# [JavaScript v12](#tab/javascript)

The following code gets the value of an environment variable called `AZURE_STORAGE_CONNECTION_STRING` and uses it to create a [QueueServiceClient](/javascript/api/@azure/storage-queue/queueserviceclient) object. The **QueueServiceClient** object is then used to create a [QueueClient](/javascript/api/@azure/storage-queue/queueclient) object. The **QueueClient** object enables you to work with a specific queue.

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_CreateQueue":::

If the queue already exists, an exception is thrown.

# [JavaScript v2](#tab/javascript2)

The Azure module will read the environment variables `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_ACCESS_KEY`, or `AZURE_STORAGE_CONNECTION_STRING` for information required to connect to your Azure storage account. If these environment variables are not set, you must specify the account information when calling **createQueueService**.

The following code creates a **QueueService** object, which enables you to work with queues.

```javascript
var queueSvc = azure.createQueueService();
```

Use the **createQueueIfNotExists** method, which returns the specified queue if it already exists or creates a new queue with the specified
name if it does not already exist.

```javascript
queueSvc.createQueueIfNotExists('myqueue', function(error, results, response){
  if(!error){
    // Queue created or exists
  }
});
```

If the queue is created, `result.created` is true. If the queue exists, `result.created` is false.

---

## How to insert a message into a queue

# [JavaScript v12](#tab/javascript)

To add a message to the back of the queue, call the [sendMessage](/javascript/api/@azure/storage-queue/queueclient#sendmessage-string--queuesendmessageoptions-) method.

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_AddMessage":::

# [JavaScript v2](#tab/javascript2)

To insert a message into a queue, use the **createMessage** method to create a new message and add it to the queue.

```javascript
queueSvc.createMessage('myqueue', "Hello world!", function(error, results, response){
  if(!error){
    // Message inserted
  }
});
```

---

## How to peek at the next message

You can peek at the message in the front of a queue without removing it from the queue by calling the **peekMessages** method.

# [JavaScript v12](#tab/javascript)

By default, [peekMessages](/javascript/api/@azure/storage-queue/queueclient#peekmessages-queuepeekmessagesoptions-) peeks at a single message.

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_PeekMessage":::

# [JavaScript v2](#tab/javascript2)

By default, **peekMessages** peeks at a single message.

```javascript
queueSvc.peekMessages('myqueue', function(error, results, response){
  if(!error){
    // Message text is in results[0].messageText
  }
});
```

The `result` contains the message.

---

> [!NOTE]
> Calling **peekMessages** when there are no messages in the queue will not return an error. However, no messages are returned.


## How to dequeue the next message

Processing a message is a two-stage process:

1. Get the message.

1. Delete the message.

The following example gets a message, then deletes it.

# [JavaScript v12](#tab/javascript)

To get a message, call the [receiveMessages](/javascript/api/@azure/storage-queue/queueclient#receivemessages-queuereceivemessageoptions-) method. This makes the messages invisible in the queue, so no other clients can process them. Once your application has processed a message, call [deleteMessage](/javascript/api/@azure/storage-queue/queueclient#deletemessage-string--string--queuedeletemessageoptions-) to delete it from the queue.

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_DequeueMessage":::

By default, a message is only hidden for 30 seconds, after which it is visible to other clients. You can specify a different value by setting [options.visibilityTimeout](/javascript/api/@azure/storage-queue/queuereceivemessageoptions#visibilitytimeout) when you call **receiveMessages**.

Calling **receiveMessages** when there are no messages in the queue will not return an error. However, no messages will be returned.

# [JavaScript v2](#tab/javascript2)

To get a message, call the **getMessages** method. This makes the messages invisible in the queue, so no other clients can process them. Once your application has processed a message, call **deleteMessage** to delete it from the queue.

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

By default, a message is only hidden for 30 seconds, after which it is visible to other clients. You can specify a different value by using `options.visibilityTimeout` with **getMessages**.

Using **getMessages** when there are no messages in the queue will not return an error. However, no messages will be returned.

---


## How to change the contents of a queued message

The following example updates the text of a message.

# [JavaScript v12](#tab/javascript)

Change the contents of a message in-place in the queue by calling [updateMessage](/javascript/api/@azure/storage-queue/queueclient#updatemessage-string--string--string--number--queueupdatemessageoptions-). 

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_UpdateMessage":::

# [JavaScript v2](#tab/javascript2)

Change the contents of a message in-place in the queue by calling **updateMessage**. 

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

---

## Additional options for dequeuing messages

# [JavaScript v12](#tab/javascript)

There are two ways you can customize message retrieval from a queue:

* [options.numberOfMessages](/javascript/api/@azure/storage-queue/queuereceivemessageoptions#numberofmessages) - Retrieve a batch of messages (up to 32.)
* [options.visibilityTimeout](/javascript/api/@azure/storage-queue/queuereceivemessageoptions#visibilitytimeout) - Set a longer or shorter invisibility timeout.

The following example uses the **receiveMessages** method to get 15 messages in one call. Then it processes each message using a for loop. It also sets the invisibility timeout to five minutes for all messages returned by this method.

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_DequeueMessages":::

# [JavaScript v2](#tab/javascript2)

There are two ways you can customize message retrieval from a queue:

* `options.numOfMessages` - Retrieve a batch of messages (up to 32.)
* `options.visibilityTimeout` - Set a longer or shorter invisibility timeout.

The following example uses the **getMessages** method to get 15 messages in one call. Then it processes each message using a for loop. It also sets the invisibility timeout to five minutes for all messages returned by this method.

```javascript
queueSvc.getMessages('myqueue', {numOfMessages: 15, visibilityTimeout: 5 * 60}, function(error, results, getResponse){
  if(!error){
    // Messages retrieved
    for(var index in results){
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

---

## How to get the queue length

# [JavaScript v12](#tab/javascript)

The [getProperties](/javascript/api/@azure/storage-queue/queueclient#getproperties-queuegetpropertiesoptions-) method returns metadata about the queue, including the approximate number of messages waiting in the queue.

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_QueueLength":::

# [JavaScript v2](#tab/javascript2)

The **getQueueMetadata** method returns metadata about the queue, including the approximate number of messages waiting in the queue.

```javascript
queueSvc.getQueueMetadata('myqueue', function(error, results, response){
  if(!error){
    // Queue length is available in results.approximateMessageCount
  }
});
```

---

## How to list queues

# [JavaScript v12](#tab/javascript)

To retrieve a list of queues, call [QueueServiceClient.listQueues](). To retrieve a list filtered by a specific prefix, set [options.prefix](/javascript/api/@azure/storage-queue/servicelistqueuesoptions#prefix) in your call to **listQueues**.

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_ListQueues":::

# [JavaScript v2](#tab/javascript2)

To retrieve a list of queues, use **listQueuesSegmented**. To retrieve a list filtered by a specific prefix, use **listQueuesSegmentedWithPrefix**.

```javascript
queueSvc.listQueuesSegmented(null, function(error, results, response){
  if(!error){
    // results.entries contains the list of queues
  }
});
```

If all queues cannot be returned, `result.continuationToken` can be used as the first parameter of **listQueuesSegmented** or the second parameter of **listQueuesSegmentedWithPrefix** to retrieve more results.

---

## How to Delete a Queue

# [JavaScript v12](#tab/javascript)

To delete a queue and all the messages contained in it, call the [deleteQueue](/javascript/api/@azure/storage-queue/queueclient#delete-queuedeleteoptions-) method on the **QueueClient** object.

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_DeleteQueue":::

To clear all messages from a queue without deleting it, call [clearMessages](/javascript/api/@azure/storage-queue/queueclient#clearmessages-queueclearmessagesoptions-).

# [JavaScript v2](#tab/javascript2)

To delete a queue and all the messages contained in it, call the **deleteQueue** method on the queue object.

```javascript
queueSvc.deleteQueue(queueName, function(error, response){
  if(!error){
    // Queue has been deleted
  }
});
```

To clear all messages from a queue without deleting it, call **clearMessages**.

---

[!INCLUDE [storage-check-out-samples-all](../../../includes/storage-check-out-samples-all.md)]

## Next Steps

Now that you've learned the basics of queue storage, follow these links to learn about more complex storage tasks.

* Visit the [Azure Storage Team Blog][Azure Storage Team Blog].
* Visit the [Azure Storage SDK for Node][Azure Storage SDK for Node] repository on GitHub.

[Azure Storage SDK for Node]: https://github.com/Azure/azure-storage-node
[using the REST API]: https://msdn.microsoft.com/library/azure/hh264518.aspx
[Azure Portal]: https://portal.azure.com
[Create a Node.js web app in Azure App Service](../../app-service/quickstart-nodejs.md)
[Build and deploy a Node.js application to an Azure Cloud Service](../../cloud-services/cloud-services-nodejs-develop-deploy-app.md)
[Azure Storage Team Blog]: https://blogs.msdn.com/b/windowsazurestorage/
[Build and deploy a Node.js web app to Azure using Web Matrix]: https://www.microsoft.com/web/webmatrix/
