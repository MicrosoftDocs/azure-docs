---
title: 'Quickstart: Azure Queue Storage client library v12 - JavaScript'
description: Learn how to use the Azure Queue Storage client library v12 for JavaScript to create a queue and add messages to it. Then learn how to read and delete messages from the queue. You'll also learn how to delete a queue.
author: twooley
ms.author: twooley
ms.date: 12/13/2019
ms.topic: quickstart
ms.service: storage
ms.subservice: queues
ms.custom:
  - devx-track-js
  - mode-api
---

# Quickstart: Azure Queue Storage client library v12 for JavaScript

Get started with the Azure Queue Storage client library v12 for JavaScript. Azure Queue Storage is a service for storing large numbers of messages for later retrieval and processing. Follow these steps to install the package and try out example code for basic tasks.

Use the Azure Queue Storage client library v12 for JavaScript to:

- Create a queue
- Add messages to a queue
- Peek at messages in a queue
- Update a message in a queue
- Receive messages from a queue
- Delete messages from a queue
- Delete a queue

Additional resources:

- [API reference documentation](/javascript/api/@azure/storage-queue/)
- [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-queue)
- [Package (npm)](https://www.npmjs.com/package/@azure/storage-queue)
- [Samples](../common/storage-samples-javascript.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json#queue-samples)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure Storage account - [create a storage account](../common/storage-account-create.md)
- Current [Node.js](https://nodejs.org/en/download/) for your operating system.

## Setting up

This section walks you through preparing a project to work with the Azure Queue Storage client library v12 for JavaScript.

### Create the project

Create a Node.js application named `queues-quickstart-v12`

1. In a console window (such as cmd, PowerShell, or Bash), create a new directory for the project.

    ```console
    mkdir queues-quickstart-v12
    ```

1. Switch to the newly created `queues-quickstart-v12` directory.

    ```console
    cd queues-quickstart-v12
    ```

1. Create a new text file called `package.json`. This file defines the Node.js project. Save this file in the `queues-quickstart-v12` directory. Here are the contents of the file:

    ```json
    {
        "name": "queues-quickstart-v12",
        "version": "1.0.0",
        "description": "Use the @azure/storage-queue SDK version 12 to interact with Azure Queue storage",
        "main": "queues-quickstart-v12.js",
        "scripts": {
            "start": "node queues-quickstart-v12.js"
        },
        "author": "Your Name",
        "license": "MIT",
        "dependencies": {
            "@azure/storage-queue": "^12.0.0",
            "@types/dotenv": "^4.0.3",
            "dotenv": "^6.0.0"
        }
    }
    ```

    You can put your own name in for the `author` field, if you'd like.

### Install the package

While still in the `queues-quickstart-v12` directory, install the Azure Queue Storage client library for JavaScript package by using the `npm install` command.

```console
npm install
```

This command reads the `package.json` file and installs the Azure Queue Storage client library v12 for JavaScript package and all the libraries on which it depends.

### Set up the app framework

From the project directory:

1. Open another new text file in your code editor
1. Add `require` calls to load Azure and Node.js modules
1. Create the structure for the program, including very basic exception handling

    Here's the code:

    ```javascript
    const { QueueClient } = require("@azure/storage-queue");
    const uuidv1 = require("uuid/v1");

    async function main() {
        console.log("Azure Queue Storage client library v12 - JavaScript quickstart sample");
        // Quick start code goes here
    }

    main().then(() => console.log("\nDone")).catch((ex) => console.log(ex.message));

    ```

1. Save the new file as `queues-quickstart-v12.js` in the `queues-quickstart-v12` directory.

[!INCLUDE [storage-quickstart-credentials-include](../../../includes/storage-quickstart-credentials-include.md)]

## Object model

Azure Queue Storage is a service for storing large numbers of messages. A queue message can be up to 64 KB in size. A queue may contain millions of messages, up to the total capacity limit of a storage account. Queues are commonly used to create a backlog of work to process asynchronously. Queue Storage offers three types of resources:

- The storage account
- A queue in the storage account
- Messages within the queue

The following diagram shows the relationship between these resources.

![Diagram of Queue storage architecture](./media/storage-queues-introduction/queue1.png)

Use the following JavaScript classes to interact with these resources:

- [`QueueServiceClient`](/javascript/api/@azure/storage-queue/queueserviceclient): The `QueueServiceClient` allows you to manage the all queues in your storage account.
- [`QueueClient`](/javascript/api/@azure/storage-queue/queueclient): The `QueueClient` class allows you to manage and manipulate an individual queue and its messages.
- [`QueueMessage`](/javascript/api/@azure/storage-queue/queuemessage): The `QueueMessage` class represents the individual objects returned when calling [`ReceiveMessages`](/javascript/api/@azure/storage-queue/queueclient#receivemessages-queuereceivemessageoptions-) on a queue.

## Code examples

These example code snippets show you how to do the following actions with the Azure Queue Storage client library for JavaScript:

- [Get the connection string](#get-the-connection-string)
- [Create a queue](#create-a-queue)
- [Add messages to a queue](#add-messages-to-a-queue)
- [Peek at messages in a queue](#peek-at-messages-in-a-queue)
- [Update a message in a queue](#update-a-message-in-a-queue)
- [Receive messages from a queue](#receive-messages-from-a-queue)
- [Delete messages from a queue](#delete-messages-from-a-queue)
- [Delete a queue](#delete-a-queue)

### Get the connection string

The following code retrieves the connection string for the storage account from the environment variable created in the [Configure your storage connection string](#configure-your-storage-connection-string) section.

Add this code inside the `main` function:

```javascript
// Retrieve the connection string for use with the application. The storage
// connection string is stored in an environment variable on the machine
// running the application called AZURE_STORAGE_CONNECTION_STRING. If the
// environment variable is created after the application is launched in a
// console or with Visual Studio, the shell or application needs to be
// closed and reloaded to take the environment variable into account.
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
```

### Create a queue

Decide on a name for the new queue. The following code appends a UUID value to the queue name to ensure that it's unique.

> [!IMPORTANT]
> Queue names may only contain lowercase letters, numbers, and hyphens, and must begin with a letter or a number. Each hyphen must be preceded and followed by a non-hyphen character. The name must also be between 3 and 63 characters long. For more information, see [Naming queues and metadata](/rest/api/storageservices/naming-queues-and-metadata).

Create an instance of the [`QueueClient`](/javascript/api/@azure/storage-queue/queueclient) class. Then, call the [`create`](/javascript/api/@azure/storage-queue/queueclient#create-queuecreateoptions-) method to create the queue in your storage account.

Add this code to the end of the `main` function:

```javascript
// Create a unique name for the queue
const queueName = "quickstart" + uuidv1();

console.log("\nCreating queue...");
console.log("\t", queueName);

// Instantiate a QueueClient which will be used to create and manipulate a queue
const queueClient = new QueueClient(AZURE_STORAGE_CONNECTION_STRING, queueName);

// Create the queue
const createQueueResponse = await queueClient.create();
console.log("Queue created, requestId:", createQueueResponse.requestId);
```

### Add messages to a queue

The following code snippet adds messages to queue by calling the [`sendMessage`](/javascript/api/@azure/storage-queue/queueclient#sendmessage-string--queuesendmessageoptions-) method. It also saves the [`QueueMessage`](/javascript/api/@azure/storage-queue/queuemessage) returned from the third `sendMessage` call. The returned `sendMessageResponse` is used to update the message content later in the program.

Add this code to the end of the `main` function:

```javascript
console.log("\nAdding messages to the queue...");

// Send several messages to the queue
await queueClient.sendMessage("First message");
await queueClient.sendMessage("Second message");
const sendMessageResponse = await queueClient.sendMessage("Third message");

console.log("Messages added, requestId:", sendMessageResponse.requestId);
```

### Peek at messages in a queue

Peek at the messages in the queue by calling the [`peekMessages`](/javascript/api/@azure/storage-queue/queueclient#peekmessages-queuepeekmessagesoptions-) method. This method retrieves one or more messages from the front of the queue but doesn't alter the visibility of the message.

Add this code to the end of the `main` function:

```javascript
console.log("\nPeek at the messages in the queue...");

// Peek at messages in the queue
const peekedMessages = await queueClient.peekMessages({ numberOfMessages : 5 });

for (i = 0; i < peekedMessages.peekedMessageItems.length; i++) {
    // Display the peeked message
    console.log("\t", peekedMessages.peekedMessageItems[i].messageText);
}
```

### Update a message in a queue

Update the contents of a message by calling the [`updateMessage`](/javascript/api/@azure/storage-queue/queueclient#updatemessage-string--string--string--undefined---number--queueupdatemessageoptions-) method. This method can change a message's visibility timeout and contents. The message content must be a UTF-8 encoded string that is up to 64 KB in size. Along with the new content, pass in `messageId` and `popReceipt` from the response that was saved earlier in the code. The `sendMessageResponse` properties identify which message to update.

```javascript
console.log("\nUpdating the third message in the queue...");

// Update a message using the response saved when calling sendMessage earlier
updateMessageResponse = await queueClient.updateMessage(
    sendMessageResponse.messageId,
    sendMessageResponse.popReceipt,
    "Third message has been updated"
);

console.log("Message updated, requestId:", updateMessageResponse.requestId);
```

### Receive messages from a queue

Download previously added messages by calling the [`receiveMessages`](/javascript/api/@azure/storage-queue/queueclient#receivemessages-queuereceivemessageoptions-) method. In the `numberOfMessages` field, pass in the maximum number of messages to receive for this call.

Add this code to the end of the `main` function:

```javascript
console.log("\nReceiving messages from the queue...");

// Get messages from the queue
const receivedMessagesResponse = await queueClient.receiveMessages({ numberOfMessages : 5 });

console.log("Messages received, requestId:", receivedMessagesResponse.requestId);
```

### Delete messages from a queue

Delete messages from the queue after they're received and processed. In this case, processing is just displaying the message on the console.

Delete messages by calling the [`deleteMessage`](/javascript/api/@azure/storage-queue/queueclient#deletemessage-string--string--queuedeletemessageoptions-) method. Any messages not explicitly deleted will eventually become visible in the queue again for another chance to process them.

Add this code to the end of the `main` function:

```javascript
// 'Process' and delete messages from the queue
for (i = 0; i < receivedMessagesResponse.receivedMessageItems.length; i++) {
    receivedMessage = receivedMessagesResponse.receivedMessageItems[i];

    // 'Process' the message
    console.log("\tProcessing:", receivedMessage.messageText);

    // Delete the message
    const deleteMessageResponse = await queueClient.deleteMessage(
        receivedMessage.messageId,
        receivedMessage.popReceipt
    );
    console.log("\tMessage deleted, requestId:", deleteMessageResponse.requestId);
}
```

### Delete a queue

The following code cleans up the resources the app created by deleting the queue using the [`delete`](/javascript/api/@azure/storage-queue/queueclient#delete-queuedeleteoptions-) method.

Add this code to the end of the `main` function and save the file:

```javascript
// Delete the queue
console.log("\nDeleting queue...");
const deleteQueueResponse = await queueClient.delete();
console.log("Queue deleted, requestId:", deleteQueueResponse.requestId);
```

## Run the code

This app creates and adds three messages to an Azure queue. The code lists the messages in the queue, then retrieves and deletes them, before finally deleting the queue.

In your console window, navigate to the directory containing the `queues-quickstart-v12.js` file, then use the following `node` command to run the app.

```console
node queues-quickstart-v12.js
```

The output of the app is similar to the following example:

```output
Azure Queue Storage client library v12 - JavaScript quickstart sample

Creating queue...
         quickstartc095d120-1d04-11ea-af30-090ee231305f
Queue created, requestId: 5c0bc94c-6003-011b-7c11-b13d06000000

Adding messages to the queue...
Messages added, requestId: a0390321-8003-001e-0311-b18f2c000000

Peek at the messages in the queue...
         First message
         Second message
         Third message

Updating the third message in the queue...
Message updated, requestId: cb172c9a-5003-001c-2911-b18dd6000000

Receiving messages from the queue...
Messages received, requestId: a039036f-8003-001e-4811-b18f2c000000
        Processing: First message
        Message deleted, requestId: 4a65b82b-d003-00a7-5411-b16c22000000
        Processing: Second message
        Message deleted, requestId: 4f0b2958-c003-0030-2a11-b10feb000000
        Processing: Third message has been updated
        Message deleted, requestId: 6c978fcb-5003-00b6-2711-b15b39000000

Deleting queue...
Queue deleted, requestId: 5c0bca05-6003-011b-1e11-b13d06000000

Done
```

Step through the code in your debugger and check your [Azure portal](https://portal.azure.com) throughout the process. Check your storage account to verify messages in the queue are created and deleted.

## Next steps

In this quickstart, you learned how to create a queue and add messages to it using JavaScript code. Then you learned to peek, retrieve, and delete messages. Finally, you learned how to delete a message queue.

For tutorials, samples, quick starts and other documentation, visit:

> [!div class="nextstepaction"]
> [Azure for JavaScript documentation](/azure/developer/javascript/)

- To learn more, see the [Azure Queue Storage client library for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-queue).
- For more Azure Queue Storage sample apps, see [Azure Queue Storage client library v12 for JavaScript - samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-queue/samples).
