---
title: 'Quickstart: Azure Queue Storage client library for Python'
titleSuffix: Azure Storage
description: Learn how to use the Azure Queue Storage client library for Python to create a queue and add messages to it. Then learn how to read and delete messages from the queue. You also learn how to delete a queue.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 06/29/2023
ms.topic: quickstart
ms.service: azure-queue-storage
ms.devlang: python
ms.custom: devx-track-python, mode-api, py-fresh-zinc, passwordless-python
---

# Quickstart: Azure Queue Storage client library for Python

Get started with the Azure Queue Storage client library for Python. Azure Queue Storage is a service for storing large numbers of messages for later retrieval and processing. Follow these steps to install the package and try out example code for basic tasks.

[API reference documentation](/python/api/azure-storage-queue/index) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-queue) | [Package (Python Package Index)](https://pypi.org/project/azure-storage-queue/) | [Samples](../common/storage-samples-python.md?toc=/azure/storage/queues/toc.json#queue-samples)

Use the Azure Queue Storage client library for Python to:

- Create a queue
- Add messages to a queue
- Peek at messages in a queue
- Update a message in a queue
- Get the queue length
- Receive messages from a queue
- Delete messages from a queue
- Delete a queue

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure Storage account - [create a storage account](../common/storage-account-create.md)
- [Python](https://www.python.org/downloads/) 3.7+

## Setting up

This section walks you through preparing a project to work with the Azure Queue Storage client library for Python.

### Create the project

Create a Python application named *queues-quickstart*.

1. In a console window (such as cmd, PowerShell, or Bash), create a new directory for the project.

    ```console
    mkdir queues-quickstart
    ```

1. Switch to the newly created *queues-quickstart* directory.

    ```console
    cd queues-quickstart
    ```

### Install the packages

From the project directory, install the Azure Queue Storage client library for Python package by using the `pip install` command. The **azure-identity** package is needed for passwordless connections to Azure services.

```console
pip install azure-storage-queue azure-identity
```

### Set up the app framework

1. Open a new text file in your code editor
1. Add `import` statements
1. Create the structure for the program, including basic exception handling

    Here's the code:

    ```python
    import os, uuid
    from azure.identity import DefaultAzureCredential
    from azure.storage.queue import QueueServiceClient, QueueClient, QueueMessage, BinaryBase64DecodePolicy, BinaryBase64EncodePolicy

    try:
        print("Azure Queue storage - Python quickstart sample")
        # Quickstart code goes here
    except Exception as ex:
        print('Exception:')
        print(ex)

    ```

1. Save the new file as *queues-quickstart.py* in the *queues-quickstart* directory.

## Authenticate to Azure

[!INCLUDE [passwordless-overview](../../../includes/passwordless/passwordless-overview.md)]

### [Passwordless (Recommended)](#tab/passwordless)

`DefaultAzureCredential` is a class provided by the Azure Identity client library for Python. To learn more about `DefaultAzureCredential`, see the [DefaultAzureCredential overview](/python/api/overview/azure/identity-readme#defaultazurecredential). `DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code.

For example, your app can authenticate using your Visual Studio Code sign-in credentials when developing locally, and then use a [managed identity](../../../articles/active-directory/managed-identities-azure-resources/overview.md) once it has been deployed to Azure. No code changes are required for this transition.

[!INCLUDE [storage-queues-create-assign-roles](../../../includes/passwordless/storage-queues/storage-queues-assign-roles.md)]

### [Connection String](#tab/connection-string)

[!INCLUDE [storage-quickstart-credentials-include](../../../includes/storage-quickstart-credentials-include.md)]

> [!IMPORTANT]
> The account access key should be used with caution. If your account access key is lost or accidentally placed in an insecure location, your service may become vulnerable. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authorization to Azure services.

---

## Object model

Azure Queue Storage is a service for storing large numbers of messages. A queue message can be up to 64 KB in size. A queue may contain millions of messages, up to the total capacity limit of a storage account. Queues are commonly used to create a backlog of work to process asynchronously. Queue Storage offers three types of resources:

- **Storage account**: All access to Azure Storage is done through a storage account. For more information about storage accounts, see [Storage account overview](../common/storage-account-overview.md)
- **Queue**: A queue contains a set of messages. All messages must be in a queue. Note that the queue name must be all lowercase. For information on naming queues, see [Naming Queues and Metadata](/rest/api/storageservices/Naming-Queues-and-Metadata).
- **Message**: A message, in any format, of up to 64 KB. A message can remain in the queue for a maximum of 7 days. For version 2017-07-29 or later, the maximum time-to-live can be any positive number, or -1 indicating that the message doesn't expire. If this parameter is omitted, the default time-to-live is seven days.

The following diagram shows the relationship between these resources.

![Diagram of Queue storage architecture](./media/storage-queues-introduction/queue1.png)

Use the following Python classes to interact with these resources:

- [`QueueServiceClient`](/python/api/azure-storage-queue/azure.storage.queue.queueserviceclient): The `QueueServiceClient` allows you to manage the all queues in your storage account.
- [`QueueClient`](/python/api/azure-storage-queue/azure.storage.queue.queueclient): The `QueueClient` class allows you to manage and manipulate an individual queue and its messages.
- [`QueueMessage`](/python/api/azure-storage-queue/azure.storage.queue.queuemessage): The `QueueMessage` class represents the individual objects returned when calling [`receive_messages`](/python/api/azure-storage-queue/azure.storage.queue.queueclient#azure-storage-queue-queueclient-receive-messages) on a queue.

## Code examples

These example code snippets show you how to do the following actions with the Azure Queue Storage client library for Python:

- [Authorize access and create a client object](#authorize-access-and-create-a-client-object)
- [Create a queue](#create-a-queue)
- [Add messages to a queue](#add-messages-to-a-queue)
- [Peek at messages in a queue](#peek-at-messages-in-a-queue)
- [Update a message in a queue](#update-a-message-in-a-queue)
- [Get the queue length](#get-the-queue-length)
- [Receive messages from a queue](#receive-messages-from-a-queue)
- [Delete messages from a queue](#delete-messages-from-a-queue)
- [Delete a queue](#delete-a-queue)

## [Passwordless (Recommended)](#tab/passwordless)

### Authorize access and create a client object

[!INCLUDE [default-azure-credential-sign-in-no-vs](../../../includes/passwordless/default-azure-credential-sign-in-no-vs.md)]

Once authenticated, you can create and authorize a `QueueClient` object using `DefaultAzureCredential` to access queue data in the storage account. `DefaultAzureCredential` automatically discovers and uses the account you signed in with in the previous step. 

To authorize using `DefaultAzureCredential`, make sure you've added the **azure-identity** package, as described in [Install the packages](#install-the-packages). Also, be sure to add the following import statement in the *queues-quickstart.py* file:

```python
from azure.identity import DefaultAzureCredential
```

Decide on a name for the queue and create an instance of the [`QueueClient`](/python/api/azure-storage-queue/azure.storage.queue.queueclient) class, using `DefaultAzureCredential` for authorization. We use this client object to create and interact with the queue resource in the storage account.

> [!IMPORTANT]
> Queue names may only contain lowercase letters, numbers, and hyphens, and must begin with a letter or a number. Each hyphen must be preceded and followed by a non-hyphen character. The name must also be between 3 and 63 characters long. For more information about naming queues, see [Naming queues and metadata](/rest/api/storageservices/naming-queues-and-metadata).

Add the following code inside the `try` block, and make sure to replace the `<storage-account-name>` placeholder value:

```python
    print("Azure Queue storage - Python quickstart sample")

    # Create a unique name for the queue
    queue_name = "quickstartqueues-" + str(uuid.uuid4())

    account_url = "https://<storageaccountname>.queue.core.windows.net"
    default_credential = DefaultAzureCredential()

    # Create the QueueClient object
    # We'll use this object to create and interact with the queue
    queue_client = QueueClient(account_url, queue_name=queue_name ,credential=default_credential)
```

## [Connection String](#tab/connection-string)

### Get the connection string and create a client

The following code retrieves the connection string for the storage account. The connection string is stored in the environment variable created in the [Configure your storage connection string](#configure-your-storage-connection-string) section.

Add this code inside the `try` block:

```python
    print("Azure Queue storage - Python quickstart sample")

    # Retrieve the connection string for use with the application. The storage
    # connection string is stored in an environment variable on the machine
    # running the application called AZURE_STORAGE_CONNECTION_STRING. If the
    # environment variable is created after the application is launched in a
    # console or with Visual Studio, the shell or application needs to be
    # closed and reloaded to take the environment variable into account.
    connect_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
```

Decide on a name for the queue and create an instance of the [`QueueClient`](/python/api/azure-storage-queue/azure.storage.queue.queueclient) class, using the connection string for authorization. We use this client object to create and interact with the queue resource in the storage account.

> [!IMPORTANT]
> Queue names may only contain lowercase letters, numbers, and hyphens, and must begin with a letter or a number. Each hyphen must be preceded and followed by a non-hyphen character. The name must also be between 3 and 63 characters long. For more information, see [Naming queues and metadata](/rest/api/storageservices/naming-queues-and-metadata).

Add this code to the end of the `try` block:

```python
    # Create a unique name for the queue
    queue_name = "quickstartqueues-" + str(uuid.uuid4())

    print("Creating queue: " + queue_name)

    # Instantiate a QueueClient which will be
    # used to create and manipulate the queue
    queue_client = QueueClient.from_connection_string(connect_str, queue_name)
```

---

Queue messages are stored as text. If you want to store binary data, set up Base64 encoding and decoding functions before putting a message in the queue.

You can configure Base64 encoding and decoding functions when creating the client object:

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_EncodeMessage":::

### Create a queue

Using the `QueueClient` object, call the [`create_queue`](/python/api/azure-storage-queue/azure.storage.queue.queueclient#azure-storage-queue-queueclient-create-queue) method to create the queue in your storage account.

Add this code to the end of the `try` block:

```python
    print("Creating queue: " + queue_name)

    # Create the queue
    queue_client.create_queue()
```

### Add messages to a queue

The following code snippet adds messages to queue by calling the [`send_message`](/python/api/azure-storage-queue/azure.storage.queue.queueclient#azure-storage-queue-queueclient-send-message) method. It also saves the [`QueueMessage`](/python/api/azure-storage-queue/azure.storage.queue.queuemessage) returned from the third `send_message` call. The `saved_message` is used to update the message content later in the program.

Add this code to the end of the `try` block:

```python
    print("\nAdding messages to the queue...")

    # Send several messages to the queue
    queue_client.send_message(u"First message")
    queue_client.send_message(u"Second message")
    saved_message = queue_client.send_message(u"Third message")
```

### Peek at messages in a queue

Peek at the messages in the queue by calling the [`peek_messages`](/python/api/azure-storage-queue/azure.storage.queue.queueclient#azure-storage-queue-queueclient-peek-messages) method. This method retrieves one or more messages from the front of the queue but doesn't alter the visibility of the message.

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

Update the contents of a message by calling the [`update_message`](/python/api/azure-storage-queue/azure.storage.queue.queueclient#azure-storage-queue-queueclient-update-message) method. This method can change a message's visibility timeout and contents. The message content must be a UTF-8 encoded string that is up to 64 KB in size. Along with the new content, pass in values from the message that was saved earlier in the code. The `saved_message` values identify which message to update.

```python
    print("\nUpdating the third message in the queue...")

    # Update a message using the message saved when calling send_message earlier
    queue_client.update_message(saved_message, pop_receipt=saved_message.pop_receipt, \
        content="Third message has been updated")
```

### Get the queue length

You can get an estimate of the number of messages in a queue.

The [get_queue_properties](/python/api/azure-storage-queue/azure.storage.queue.QueueClient#azure-storage-queue-queueclient-get-queue-properties) method returns queue properties including the `approximate_message_count`.

```python
properties = queue_client.get_queue_properties()
count = properties.approximate_message_count
print("Message count: " + str(count))
```

The result is approximate since messages can be added or removed after the service responds to your request.

### Receive messages from a queue

You can download previously added messages by calling the [`receive_messages`](/python/api/azure-storage-queue/azure.storage.queue.queueclient#azure-storage-queue-queueclient-receive-messages) method.

Add this code to the end of the `try` block:

```python
    print("\nReceiving messages from the queue...")

    # Get messages from the queue
    messages = queue_client.receive_messages(max_messages=5)
```

When calling the `receive_messages` method, you can optionally specify a value for `max_messages`, which is the number of messages to retrieve from the queue. The default is 1 message and the maximum is 32 messages. You can also specify a value for `visibility_timeout`, which hides the messages from other operations for the timeout period. The default is 30 seconds.

### Delete messages from a queue

Delete messages from the queue after they're received and processed. In this case, processing is just displaying the message on the console.

The app pauses for user input by calling `input` before it processes and deletes the messages. Verify in your [Azure portal](https://portal.azure.com) that the resources were created correctly, before they're deleted. Any messages not explicitly deleted eventually become visible in the queue again for another chance to process them.

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

The following code cleans up the resources the app created by deleting the queue using the [`delete_queue`](/python/api/azure-storage-queue/azure.storage.queue.queueclient#azure-storage-queue-queueclient-delete-queue) method.

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

In your console window, navigate to the directory containing the *queues-quickstart.py* file, then use the following `python` command to run the app.

```console
python queues-quickstart.py
```

The output of the app is similar to the following example:

```output
Azure Queue Storage client library - Python quickstart sample
Creating queue: quickstartqueues-<UUID>

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

Press the `Enter` key to receive and delete the messages. When prompted, press the `Enter` key again to delete the queue and finish the demo.

## Next steps

In this quickstart, you learned how to create a queue and add messages to it using Python code. Then you learned to peek, retrieve, and delete messages. Finally, you learned how to delete a message queue.

For tutorials, samples, quick starts and other documentation, visit:

> [!div class="nextstepaction"]
> [Azure for Python developers](/azure/python/)

- For related code samples using deprecated Python version 2 SDKs, see [Code samples using Python version 2](queues-v2-samples-python.md).
- To learn more, see the [Azure Storage libraries for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage).
- For more Azure Queue Storage sample apps, see [Azure Queue Storage client library for Python - samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-queue/samples).
