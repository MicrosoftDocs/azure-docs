---
title: How to use Azure Queue Storage from Node.js
titleSuffix: Azure Storage
description: Learn to use the Azure Queue Storage to create and delete queues. Learn to insert, get, and delete messages using Node.js.
author: normesta
ms.author: normesta
ms.reviewer: dineshm
ms.date: 01/20/2023
ms.topic: how-to
ms.service: storage
ms.subservice: queues
ms.devlang: javascript
ms.custom: seo-javascript-september2019, devx-track-js
---

# How to use Azure Queue Storage from Node.js

[!INCLUDE [storage-selector-queue-include](../../../includes/storage-selector-queue-include.md)]

## Overview

This guide shows you how to accomplish common scenarios using Azure Queue Storage. The samples are written using the Node.js API. The scenarios covered include inserting, peeking, getting, and deleting queue messages. Also learn to create and delete queues.

[!INCLUDE [storage-queue-concepts-include](../../../includes/storage-queue-concepts-include.md)]

[!INCLUDE [storage-create-account-include](../../../includes/storage-create-account-include.md)]

## Create a Node.js application

To create a blank Node.js application, see [Create a Node.js web app in Azure App Service](../../app-service/quickstart-nodejs.md), [build and deploy a Node.js application to Azure Cloud Services](../../cloud-services/cloud-services-nodejs-develop-deploy-app.md) using PowerShell or [Visual Studio Code](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial).

## Configure your application to access storage

The [Azure Storage client library for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage#azure-storage-client-library-for-javascript) includes a set of convenience libraries that communicate with the storage REST services.

<!-- docutune:ignore Terminal -->

### Use Node package manager (npm) to obtain the package

1. Use a command-line interface such as PowerShell (Windows), Terminal (Mac), or Bash (Unix), navigate to the folder where you created your sample application.

1. Type `npm install @azure/storage-queue` in the command window.

1. Verify that a `node_modules` folder was created. Inside that folder you'll find the `@azure/storage-queue` package, which contains the client library you need to access storage.

### Import the package

Using your code editor, add the following to the top the JavaScript file where you intend to use queues.

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_ImportStatements":::


## How to create a queue


The following code gets the value of an environment variable called `AZURE_STORAGE_CONNECTION_STRING` and uses it to create a [`QueueServiceClient`](/javascript/api/@azure/storage-queue/queueserviceclient) object. This object is then used to create a [`QueueClient`](/javascript/api/@azure/storage-queue/queueclient) object that allows you to work with a specific queue.

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_CreateQueue":::

If the queue already exists, an exception is thrown.

## How to format the message

The message type is a string. All messages are treated as strings. If you need to send a different data type, you need to serialize that datatype into a string when sending the message and deserialize the string format when reading the message.

To convert **JSON** to a string format and back again in Node.js, use the following helper functions:

```javascript
function jsonToBase64(jsonObj) {
    const jsonString = JSON.stringify(jsonObj)
    return  Buffer.from(jsonString).toString('base64')
}
function encodeBase64ToJson(base64String) {
    const jsonString = Buffer.from(base64String,'base64').toString()
    return JSON.parse(jsonString)
}
``` 

## How to insert a message into a queue


To add a message to a queue, call the [`sendMessage`](/javascript/api/@azure/storage-queue/queueclient#sendmessage-string--queuesendmessageoptions-) method.

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_AddMessage":::


## How to peek at the next message

You can peek at messages in the queue without removing them from the queue by calling the `peekMessages` method.


By default, [`peekMessages`](/javascript/api/@azure/storage-queue/queueclient#peekmessages-queuepeekmessagesoptions-) peeks at a single message. The following example peeks at the first five messages in the queue. If fewer than five messages are visible, just the visible messages are returned.

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_PeekMessage":::

Calling `peekMessages` when there are no messages in the queue won't return an error. However, no messages are returned.

## How to change the contents of a queued message

The following example updates the text of a message.

Change the contents of a message in-place in the queue by calling [`updateMessage`](/javascript/api/@azure/storage-queue/queueclient#updatemessage-string--string--string--number--queueupdatemessageoptions-).

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_UpdateMessage":::

## How to dequeue a message

Dequeueing a message is a two-stage process:

1. Get the message.

1. Delete the message.

The following example gets a message, then deletes it.

To get a message, call the [`receiveMessages`](/javascript/api/@azure/storage-queue/queueclient#receivemessages-queuereceivemessageoptions-) method. This call makes the messages invisible in the queue, so no other clients can process them. Once your application has processed a message, call [`deleteMessage`](/javascript/api/@azure/storage-queue/queueclient#deletemessage-string--string--queuedeletemessageoptions-) to delete it from the queue.

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_DequeueMessage":::

By default, a message is only hidden for 30 seconds. After 30 seconds it's visible to other clients. You can specify a different value by setting [`options.visibilityTimeout`](/javascript/api/@azure/storage-queue/queuereceivemessageoptions#visibilitytimeout) when you call `receiveMessages`.

Calling `receiveMessages` when there are no messages in the queue won't return an error. However, no messages will be returned.

## Additional options for dequeuing messages

There are two ways you can customize message retrieval from a queue:

- [`options.numberOfMessages`](/javascript/api/@azure/storage-queue/queuereceivemessageoptions#numberofmessages): Retrieve a batch of messages (up to 32).
- [`options.visibilityTimeout`](/javascript/api/@azure/storage-queue/queuereceivemessageoptions#visibilitytimeout): Set a longer or shorter invisibility timeout.

The following example uses the `receiveMessages` method to get five messages in one call. Then it processes each message using a `for` loop. It also sets the invisibility timeout to five minutes for all messages returned by this method.

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_DequeueMessages":::

## How to get the queue length


The [`getProperties`](/javascript/api/@azure/storage-queue/queueclient#getproperties-queuegetpropertiesoptions-) method returns metadata about the queue, including the approximate number of messages waiting in the queue.

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_QueueLength":::

## How to list queues

To retrieve a list of queues, call [`QueueServiceClient.listQueues`](/javascript/api/@azure/storage-queue/servicelistqueuesoptions#prefix). To retrieve a list filtered by a specific prefix, set [options.prefix](/javascript/api/@azure/storage-queue/servicelistqueuesoptions#prefix) in your call to `listQueues`.

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_ListQueues":::

## How to delete a queue

To delete a queue and all the messages contained in it, call the [`DeleteQueue`](/javascript/api/@azure/storage-queue/queueclient#delete-queuedeleteoptions-) method on the `QueueClient` object.

:::code language="javascript" source="~/azure-storage-snippets/queues/howto/JavaScript/JavaScript-v12/javascript-queues-v12.js" id="Snippet_DeleteQueue":::

To clear all messages from a queue without deleting it, call [`ClearMessages`](/javascript/api/@azure/storage-queue/queueclient#clearmessages-queueclearmessagesoptions-).

[!INCLUDE [storage-check-out-samples-all](../../../includes/storage-check-out-samples-all.md)]

## Next steps

Now that you've learned the basics of Queue Storage, follow these links to learn about more complex storage tasks.

- Visit the [Azure Storage team blog](https://techcommunity.Microsoft.com/t5/Azure-storage/bg-p/azurestorageblog) to learn what's new
- Visit the [Azure Storage client library for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage#Azure-storage-client-library-for-JavaScript) repository on GitHub
