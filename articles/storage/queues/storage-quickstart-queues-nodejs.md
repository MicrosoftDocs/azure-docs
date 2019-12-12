---
title: "Quickstart: Azure Queue storage library v12 - JavaScript"
description: Learn how to use the Azure Queue JavaScript v12 library to create a queue and add messages to the queue. Next, you learn how to read and delete messages from the queue. You'll also learn how to delete a queue.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 12/12/2019
ms.service: storage
ms.subservice: queues
ms.topic: quickstart
---

# Quickstart: Azure Queue storage client library v12 for JavaScript

Get started with the Azure Queue storage client library version 12 for JavaScript. Azure Queue storage is a service for storing large numbers of messages for later retrieval and processing. Follow these steps to install the package and try out example code for basic tasks.

Use the Azure Queue storage client library v12 for JavaScript to:

* Create a queue
* Add messages to a queue
* Peek at messages in a queue
* Update a message in a queue
* Receive messages from a queue
* Delete messages from a queue
* Delete a queue

[API reference documentation](https://docs.microsoft.com/javascript/api/@azure/storage-queue/) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-queue) | [Package (Node Package Manager)](https://www.npmjs.com/package/@azure/storage-queue) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-queue/samples)

## Prerequisites

* Azure subscription - [create one for free](https://azure.microsoft.com/free/)
* Azure storage account - [create a storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account)
* Current [Node.js](https://nodejs.org/en/download/) for your operating system.

## Setting up

This section walks you through preparing a project to work with the Azure Queue storage client library v12 for JavaScript.

### Create the project

Create a JavaScript application named *queues-quickstart-v12*.

1. In a console window (such as cmd, PowerShell, or Bash), create a new directory for the project.

    ```console
    mkdir queues-quickstart-v12
    ```

1. Switch to the newly created *blob-quickstart-v12* directory.

    ```console
    cd queues-quickstart-v12
    ```

1. Create a new text file called *package.json*. This file defines the Node.js project. Save this file in the *blob-quickstart-v12* directory. Here is the contents of the file:

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

While still in the *queues-quickstart-v12* directory, install the Azure Queue storage client library for JavaScript package by using the `npm install` command.

```console
npm install
```

 This command reads the *package.json* file and installs the Azure Queue storage client library v12 for JavaScript package and all the libraries on which it depends.

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
        console.log("Azure Queue storage v12 - JavaScript quickstart sample");
        // Quick start code goes here
    }

    main().then(() => console.log("Done")).catch((ex) => console.log(ex.message));

    ```

1. Save the new file as *queues-quickstart-v12.js* in the *queues-quickstart-v12* directory.

[!INCLUDE [storage-quickstart-credentials-include](../../../includes/storage-quickstart-credentials-include.md)]

## Object model

Azure Queue storage is a service for storing large numbers of messages. A queue message can be up to 64 KB in size. A queue may contain millions of messages, up to the total capacity limit of a storage account. Queues are commonly used to create a backlog of work to process asynchronously. Queue storage offers three types of resources:

* The storage account
* A queue in the storage account
* Messages within the queue

The following diagram shows the relationship between these resources.

![Diagram of Queue storage architecture](./media/storage-queues-introduction/queue1.png)

Use the following JavaScript classes to interact with these resources:

* [QueueServiceClient](https://docs.microsoft.com/javascript/api/@azure/storage-queue/queueserviceclient): The `QueueServiceClient` allows you to manage the all queues in your storage account.
* [QueueClient](https://docs.microsoft.com/javascript/api/@azure/storage-queue/queueclient): The `QueueClient` class allows you to manage and manipulate an individual queue and its messages.
* [QueueMessage](https://docs.microsoft.com/javascript/api/@azure/storage-queue/queuemessage): The `QueueMessage` class represents the individual objects returned when calling [receiveMessages](https://docs.microsoft.com/javascript/api/@azure/storage-queue/queueclient?view=azure-node-latest#receivemessages-queuereceivemessageoptions-) on a queue.

## Code examples

These example code snippets show you how to do the following actions with the Azure Queue storage client library for JavaScript:

* [Get the connection string](#get-the-connection-string)
* [Create a queue](#create-a-queue)
* [Add messages to a queue](#add-messages-to-a-queue)
* [Peek at messages in a queue](#peek-at-messages-in-a-queue)
* [Update a message in a queue](#update-a-message-in-a-queue)
* [Receive messages from a queue](#receive-messages-from-a-queue)
* [Delete messages from a queue](#delete-messages-from-a-queue)
* [Delete a queue](#delete-a-queue)

### Get the connection string

The code below retrieves the connection string for the storage account from the environment variable created in the [Configure your storage connection string](#configure-your-storage-connection-string) section.

Add this code inside the `main` function:

```javascript
// Retrieve the connection string for use with the application. The storage
// connection string is stored in an environment variable on the machine
// running the application called AZURE_STORAGE_CONNECTION_STRING. If the
// environment variable is created after the application is launched in a
// console or with Visual Studio, the shell or application needs to be closed
// and reloaded to take the environment variable into account.
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
```

### Create a queue

Decide on a name for the new queue. The code below appends a UUID value to the queue name to ensure that it's unique.

> [!IMPORTANT]
> Queue names may only contain lowercase letters, numbers, and hyphens, and must begin with a letter or a number. Each hyphen must be preceded and followed by a non-hyphen character. The name must also be between 3 and 63 characters long. For more information about naming queues, see [Naming Queues and Metadata](https://docs.microsoft.com/rest/api/storageservices/naming-queues-and-metadata).

Create an instance of the [QueueClient](https://docs.microsoft.com/javascript/api/@azure/storage-queue/queueclient) class. Then, call the [create](https://docs.microsoft.com/javascript/api/@azure/storage-queue/queueclient#create-queuecreateoptions-) method to create the queue in your storage account.

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
console.log("Queue was created successfully. requestId: ", createQueueResponse.requestId);
```

### Add messages to a queue

The following code snippet adds messages to queue by calling the [sendMessage](https://docs.microsoft.com/javascript/api/@azure/storage-queue/queueclient#sendmessage-string--queuesendmessageoptions-) method. It also saves the [QueueMessage](https://docs.microsoft.com/javascript/api/@azure/storage-queue/queuemessage) returned from the third `sendMessage` call. The `sendMessageResponse` is used to update the message content later in the program.

Add this code to the end of the `main` function:

```javascript
console.log("\nAdding messages to the queue...");

// Send several messages to the queue
await queueClient.sendMessage("First message");
await queueClient.sendMessage("Second message");
const sendMessageResponse = await queueClient.sendMessage("Third message");
```

### Peek at messages in a queue

Peek at the messages in the queue by calling the [peekMessages](https://docs.microsoft.com/javascript/api/@azure/storage-queue/queueclient#peekmessages-queuepeekmessagesoptions-) method. The `peekMessages` method retrieves one or more messages from the front of the queue but doesn't alter the visibility of the message.

Add this code to the end of the `main` function:

```javascript
console.log("\nPeek at the messages in the queue...");

// Peek at messages in the queue
const peekedMessages = await queueClient.peekMessages(5);

for (i = 0; i < peekedMessages.peekedMessageItems.length; i++) {
    // Display the peeked message
    console.log("\n\tMessage:", peekedMessages.peekedMessageItems[i].messageText);
}
```

### Update a message in a queue

Update the contents of a message by calling the [updateMessage](https://docs.microsoft.com/javascript/api/@azure/storage-queue/queueclient#updatemessage-string--string--string--undefined---number--queueupdatemessageoptions-) method. The `update_message` method can change a message's visibility timeout and contents. The message content must be a UTF-8 encoded string that is up to 64 KB in size. Along with the new content, pass in values from the message that was saved earlier in the code. The `saved_message` values identify which message to update.

```javascript
console.log("\nUpdating the third message in the queue...");

// Update a message using the response saved when calling sendMessage earlier
updateMessageResponse = await queueClient.updateMessage(
    sendMessageResponse.messageId,
    sendMessageResponse.popReceipt,
    "Third message has been updated"
);

console.log("\nMessage updated, requestId:", updateMessageResponse.requestId);
```

### Receive messages from a queue

Download previously added messages by calling the [receiveMessages](https://docs.microsoft.com/javascript/api/@azure/storage-queue/queueclient#receivemessages-queuereceivemessageoptions-) method.

Add this code to the end of the `main` function:

```javascript
console.log("\nReceiving messages from the queue...");

// Get messages from the queue
const receivedMessagesResponse = await queueClient.receiveMessages(5);
```

### Delete messages from a queue

Delete messages from the queue after they're received and processed. In this case, processing is just displaying the message on the console.

Delete messages by calling the [deleteMessage](https://docs.microsoft.com/javascript/api/@azure/storage-queue/queueclient#deletemessage-string--string--queuedeletemessageoptions-) method. Any messages not explicitly deleted will eventually become visible in the queue again for another chance to process them.

Add this code to the end of the `main` function:

```javascript
// 'Process' and delete messages from the queue
for (i = 0; i < receivedMessagesResponse.receivedMessageItems.length; i++) {
    const receivedMessage = receivedMessagesResponse.receivedMessageItems[i];

    // 'Process' the message
    console.log("\n\tMessage:", receivedMessage.messageText);

    // Delete the message
    const deleteMessageResponse = await queueClient.deleteMessage(
        receivedMessage.messageId,
        receivedMessage.popReceipt
    );
}
```

### Delete a queue

The following code cleans up the resources the app created by deleting the queue using the [​delete](https://docs.microsoft.com/javascript/api/@azure/storage-queue/queueclient#delete-queuedeleteoptions-) method.

Add this code to the end of the `main` function and save the file:

```javascript
// Delete the queue
console.log("Deleting queue...");
const deleteQueueResponse = await queueClient.delete();
console.log("Queue deleted, requestId:", deleteQueueResponse.requestId);
```

## Run the code

This app creates and adds three messages to an Azure queue. The code lists the messages in the queue, then retrieves and deletes them, before finally deleting the queue.

In your console window, navigate to the directory containing the *queues-quickstart-v12.py* file, then execute the following `python` command to run the app.

```console
python queues-quickstart-v12.py
```

The output of the app is similar to the following example:

```output
Azure Queue storage v12 - JavaScript quickstart sample
Creating queue: quickstartqueues-cac365be-7ce6-4065-bd65-3756ea052cb8

Adding messages to the queue...

Peek at the messages in the queue...
Message: First message
Message: Second message
Message: Third message

Updating the third message in the queue...

Receiving messages from the queue...

Press Enter key to 'process' messages and delete them from the queue...

First message
Second message
Third message has been updated

Press Enter key to delete the queue...

Deleting queue...
Done
```

When the app pauses before receiving messages, check your storage account in the [Azure portal](https://portal.azure.com). Verify the messages are in the queue.

Press the **Enter** key to receive and delete the messages. When prompted, press the **Enter** key again to delete the queue and finish the demo.

## Next steps

In this quickstart, you learned how to create a queue and add messages to it using JavaScript code. Then you learned to view, retrieve, and delete messages. Finally, you learned how to delete a message queue.

For tutorials, samples, quick starts and other documentation, visit:

> [!div class="nextstepaction"]
> [Azure for JavaScript Developers](https://docs.microsoft.com/azure/javascript/)

* To learn more, see the [Azure Storage libraries for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage).
* To see more Azure Queue storage sample apps, continue to [Azure Queue storage v12 JavaScript client library samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/storage/storage-queue/samples).
