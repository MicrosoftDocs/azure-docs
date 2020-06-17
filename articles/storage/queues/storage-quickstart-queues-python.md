---
title: "Quickstart: Azure Queue storage library v12 - Python"
description: Learn how to use the Azure Queue Python v12 library to create a queue and add messages to the queue. Next, you learn how to read and delete messages from the queue. You'll also learn how to delete a queue.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 12/10/2019
ms.service: storage
ms.subservice: queues
ms.topic: quickstart
ms.custom: tracking-python
---

# Quickstart: Azure Queue storage client library v12 for Python

Get started with the Azure Queue storage client library version 12 for Python. Azure Queue storage is a service for storing large numbers of messages for later retrieval and processing. Follow these steps to install the package and try out example code for basic tasks.

Use the Azure Queue storage client library v12 for Python to:

* Create a queue
* Add messages to a queue
* Peek at messages in a queue
* Update a message in a queue
* Receive messages from a queue
* Delete messages from a queue
* Delete a queue

[API reference documentation](https://docs.microsoft.com/python/api/azure-storage-queue/index) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-queue) | [Package (Python Package Index)](https://pypi.org/project/azure-storage-queue/) | [Samples](https://docs.microsoft.com/azure/storage/common/storage-samples-python?toc=%2fazure%2fstorage%2fqueues%2ftoc.json#queue-samples)

## Prerequisites

* Azure subscription - [create one for free](https://azure.microsoft.com/free/)
* Azure storage account - [create a storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account)
* [Python](https://www.python.org/downloads/) for your operating system - 2.7, 3.5 or above

## Setting up

This section walks you through preparing a project to work with the Azure Queue storage client library v12 for Python.

### Create the project

Create a Python application named *queues-quickstart-v12*.

1. In a console window (such as cmd, PowerShell, or Bash), create a new directory for the project.

    ```console
    mkdir queues-quickstart-v12
    ```

1. Switch to the newly created *queues-quickstart-v12* directory.

    ```console
    cd queues-quickstart-v12
    ```

### Install the package

Install the Azure Blob storage client library for Python package by using the `pip install` command.

```console
pip install azure-storage-queue
```

This command installs the Azure Queue storage client library for Python package and all the libraries on which it depends. In this case, that is just the Azure core library for Python.

### Set up the app framework

1. Open a new text file in your code editor
1. Add `import` statements
1. Create the structure for the program, including very basic exception handling

    Here's the code:

    ```python
    import os, uuid
    from azure.storage.queue import QueueServiceClient, QueueClient, QueueMessage

    try:
        print("Azure Queue storage v12 - Python quickstart sample")
        # Quick start code goes here
    except Exception as ex:
        print('Exception:')
        print(ex)

    ```

1. Save the new file as *queues-quickstart-v12.py* in the *queues-quickstart-v12* directory.

[!INCLUDE [storage-quickstart-credentials-include](../../../includes/storage-quickstart-credentials-include.md)]

## Object model

Azure Queue storage is a service for storing large numbers of messages. A queue message can be up to 64 KB in size. A queue may contain millions of messages, up to the total capacity limit of a storage account. Queues are commonly used to create a backlog of work to process asynchronously. Queue storage offers three types of resources:

* The storage account
* A queue in the storage account
* Messages within the queue

The following diagram shows the relationship between these resources.

![Diagram of Queue storage architecture](./media/storage-queues-introduction/queue1.png)

Use the following Python classes to interact with these resources:

* [QueueServiceClient](https://docs.microsoft.com/python/api/azure-storage-queue/azure.storage.queue.queueserviceclient): The `QueueServiceClient` allows you to manage the all queues in your storage account.
* [QueueClient](https://docs.microsoft.com/python/api/azure-storage-queue/azure.storage.queue.queueclient): The `QueueClient` class allows you to manage and manipulate an individual queue and its messages.
* [QueueMessage](https://docs.microsoft.com/python/api/azure-storage-queue/azure.storage.queue.queuemessage): The `QueueMessage` class represents the individual objects returned when calling [receive_messages](https://docs.microsoft.com/python/api/azure-storage-queue/azure.storage.queue.queueclient#receive-messages---kwargs-) on a queue.

## Code examples

These example code snippets show you how to do the following actions with the Azure Queue storage client library for Python:

* [Get the connection string](#get-the-connection-string)
* [Create a queue](#create-a-queue)
* [Add messages to a queue](#add-messages-to-a-queue)
* [Peek at messages in a queue](#peek-at-messages-in-a-queue)
* [Update a message in a queue](#update-a-message-in-a-queue)
* [Receive messages from a queue](#receive-messages-from-a-queue)
* [Delete messages from a queue](#delete-messages-from-a-queue)
* [Delete a queue](#delete-a-queue)

### Get the connection string

The code below retrieves the connection string for the storage account. The connection string is stored the environment variable created in the [Configure your storage connection string](#configure-your-storage-connection-string) section.

Add this code inside the `try` block:

```python
    # Retrieve the connection string for use with the application. The storage
    # connection string is stored in an environment variable on the machine
    # running the application called AZURE_STORAGE_CONNECTION_STRING. If the
    # environment variable is created after the application is launched in a
    # console or with Visual Studio, the shell or application needs to be
    # closed and reloaded to take the environment variable into account.
    connect_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
```

### Create a queue

Decide on a name for the new queue. The code below appends a UUID value to the queue name to ensure that it's unique.

> [!IMPORTANT]
> Queue names may only contain lowercase letters, numbers, and hyphens, and must begin with a letter or a number. Each hyphen must be preceded and followed by a non-hyphen character. The name must also be between 3 and 63 characters long. For more information about naming queues, see [Naming Queues and Metadata](https://docs.microsoft.com/rest/api/storageservices/naming-queues-and-metadata).

Create an instance of the [QueueClient](https://docs.microsoft.com/python/api/azure-storage-queue/azure.storage.queue.queueclient) class. Then, call the [create_queue](https://docs.microsoft.com/python/api/azure-storage-queue/azure.storage.queue.queueclient#create-queue---kwargs-) method to create the queue in your storage account.

Add this code to the end of the `try` block:

```python
    # Create a unique name for the queue
    queue_name = "quickstartqueues-" + str(uuid.uuid4())

    print("Creating queue: " + queue_name)

    # Instantiate a QueueClient which will be
    # used to create and manipulate the queue
    queue_client = QueueClient.from_connection_string(connect_str, queue_name)

    # Create the queue
    queue_client.create_queue()
```

### Add messages to a queue

The following code snippet adds messages to queue by calling the [send_message](https://docs.microsoft.com/python/api/azure-storage-queue/azure.storage.queue.queueclient#send-message-content----kwargs-) method. It also saves the [QueueMessage](https://docs.microsoft.com/python/api/azure-storage-queue/azure.storage.queue.queuemessage) returned from the third `send_message` call. The `saved_message` is used to update the message content later in the program.

Add this code to the end of the `try` block:

```python
    print("\nAdding messages to the queue...")

    # Send several messages to the queue
    queue_client.send_message(u"First message")
    queue_client.send_message(u"Second message")
    saved_message = queue_client.send_message(u"Third message")
```

### Peek at messages in a queue

Peek at the messages in the queue by calling the [peek_messages](https://docs.microsoft.com/python/api/azure-storage-queue/azure.storage.queue.queueclient#peek-messages-max-messages-none----kwargs-) method. The `peek_messages` method retrieves one or more messages from the front of the queue but doesn't alter the visibility of the message.

Add this code to the end of the `try` block:

```python
    print("\nPeek at the messages in the queue...")

    # Peek at messages in the queue
    peeked_messages = queue_client.peek_messages(max_messages=5)

    for peeked_message in peeked_messages:
        # Display the message
        print("Message: " + peeked_message.content)
```

### Update a message in a queue

Update the contents of a message by calling the [update_message](https://docs.microsoft.com/python/api/azure-storage-queue/azure.storage.queue.queueclient#update-message-message--pop-receipt-none--content-none----kwargs-) method. The `update_message` method can change a message's visibility timeout and contents. The message content must be a UTF-8 encoded string that is up to 64 KB in size. Along with the new content, pass in values from the message that was saved earlier in the code. The `saved_message` values identify which message to update.

```python
    print("\nUpdating the third message in the queue...")

    # Update a message using the message saved when calling send_message earlier
    queue_client.update_message(saved_message, pop_receipt=saved_message.pop_receipt, \
        content="Third message has been updated")
```

### Receive messages from a queue

Download previously added messages by calling the [receive_messages](https://docs.microsoft.com/python/api/azure-storage-queue/azure.storage.queue.queueclient#receive-messages---kwargs-) method.

Add this code to the end of the `try` block:

```python
    print("\nReceiving messages from the queue...")

    # Get messages from the queue
    messages = queue_client.receive_messages(messages_per_page=5)
```

### Delete messages from a queue

Delete messages from the queue after they're received and processed. In this case, processing is just displaying the message on the console.

The app pauses for user input by calling `input` before it processes and deletes the messages. Verify in your [Azure portal](https://portal.azure.com) that the resources were created correctly, before they're deleted. Any messages not explicitly deleted will eventually become visible in the queue again for another chance to process them.

Add this code to the end of the `try` block:

```python
    print("\nPress Enter key to 'process' messages and delete them from the queue...")
    input()

    for msg_batch in messages.by_page():
            for msg in msg_batch:
                # "Process" the message
                print(msg.content)
                # Let the service know we're finished with
                # the message and it can be safely deleted.
                queue_client.delete_message(msg)
```

### Delete a queue

The following code cleans up the resources the app created by deleting the queue using the [​delete_queue](https://docs.microsoft.com/python/api/azure-storage-queue/azure.storage.queue.queueclient#delete-queue---kwargs-) method.

Add this code to the end of the `try` block and save the file:

```python
    print("\nPress Enter key to delete the queue...")
    input()

    # Clean up
    print("Deleting queue...")
    queue_client.delete_queue()

    print("Done")
```

## Run the code

This app creates and adds three messages to an Azure queue. The code lists the messages in the queue, then retrieves and deletes them, before finally deleting the queue.

In your console window, navigate to the directory containing the *queues-quickstart-v12.py* file, then execute the following `python` command to run the app.

```console
python queues-quickstart-v12.py
```

The output of the app is similar to the following example:

```output
Azure Queue storage v12 - Python quickstart sample
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

In this quickstart, you learned how to create a queue and add messages to it using Python code. Then you learned to peek, retrieve, and delete messages. Finally, you learned how to delete a message queue.

For tutorials, samples, quick starts and other documentation, visit:

> [!div class="nextstepaction"]
> [Azure for Python Developers](https://docs.microsoft.com/azure/python/)

* To learn more, see the [Azure Storage libraries for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage).
* To see more Azure Queue storage sample apps, continue to [Azure Queue storage v12 Python client library samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-queue/samples).
