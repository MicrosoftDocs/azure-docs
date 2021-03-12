---
title: How to use Azure Queue Storage from Python
description: Learn to use the Azure Queue Storage from Python to create and delete queues, and insert, get, and delete messages.
author: mhopkins-msft

ms.author: mhopkins
ms.reviewer: dineshm
ms.date: 02/16/2021
ms.topic: how-to
ms.service: storage
ms.subservice: queues
ms.custom: seo-javascript-october2019, devx-track-python
---

# How to use Azure Queue Storage from Python

[!INCLUDE [storage-selector-queue-include](../../../includes/storage-selector-queue-include.md)]

## Overview

This article demonstrates common scenarios using the Azure Queue Storage service. The scenarios covered include inserting, peeking, getting, and deleting queue messages. Code for creating and deleting queues is also covered.

The examples in this article are written in Python and use the [Azure Queue Storage client library for Python](https://github.com/azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-queue). For more information on queues, see the [Next steps](#next-steps) section.

[!INCLUDE [storage-queue-concepts-include](../../../includes/storage-queue-concepts-include.md)]

[!INCLUDE [storage-create-account-include](../../../includes/storage-create-account-include.md)]

## Download and install Azure Storage SDK for Python

The [Azure Storage SDK for Python](https://github.com/azure/azure-storage-python) requires Python v2.7, v3.3, or later.

### Install via PyPI

To install via the Python Package Index (PyPI), type:

# [Python v12](#tab/python)

```console
pip install azure-storage-queue
```

# [Python v2](#tab/python2)

```console
pip install azure-storage-queue==2.1.0
```

---

> [!NOTE]
> If you are upgrading from the Azure Storage SDK for Python v0.36 or earlier, uninstall the older SDK using `pip uninstall azure-storage` before installing the latest package.

For alternative installation methods, see [Azure SDK for Python](https://github.com/Azure/Azure-SDK-for-Python).

[!INCLUDE [storage-quickstart-credentials-include](../../../includes/storage-quickstart-credentials-include.md)]

## Configure your application to access Queue Storage

# [Python v12](#tab/python)

The [`QueueClient`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient) object lets you work with a queue. Add the following code near the top of any Python file in which you wish to programmatically access an Azure queue:

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_ImportStatements":::

# [Python v2](#tab/python2)

The [`QueueService`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueservice.queueservice?view=storage-py-v2&preserve-view=true) object lets you work with queues. The following code creates a `QueueService` object. Add the following code near the top of any Python file in which you wish to programmatically access Azure Storage:

```python
from azure.storage.queue import (
        QueueService,
        QueueMessageFormat
)

import os, uuid
```

---

The `os` package provides support to retrieve an environment variable. The `uuid` package provides support for generating a unique identifier for a queue name.

## Create a queue

The connection string is retrieved from the `AZURE_STORAGE_CONNECTION_STRING` environment variable set earlier.

# [Python v12](#tab/python)

The following code creates a `QueueClient` object using the storage connection string.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_CreateQueue":::

# [Python v2](#tab/python2)

The following code creates a `QueueService` object using the storage connection string.

```python
# Retrieve the connection string from an environment
# variable named AZURE_STORAGE_CONNECTION_STRING
connect_str = os.getenv("AZURE_STORAGE_CONNECTION_STRING")

# Create a unique name for the queue
queue_name = "queue-" + str(uuid.uuid4())

# Create a QueueService object which will
# be used to create and manipulate the queue
print("Creating queue: " + queue_name)
queue_service = QueueService(connection_string=connect_str)

# Create the queue
queue_service.create_queue(queue_name)
```

---

Azure queue messages are stored as text. If you want to store binary data, setup Base64 encoding and decoding functions before putting a message in the queue.

# [Python v12](#tab/python)

Configure Base64 encoding and decoding functions when creating the client object.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_EncodeMessage":::

# [Python v2](#tab/python2)

Configure Base64 encoding and decoding functions on Queue Storage object.

```python
# Setup Base64 encoding and decoding functions
queue_service.encode_function = QueueMessageFormat.binary_base64encode
queue_service.decode_function = QueueMessageFormat.binary_base64decode
```

---

## Insert a message into a queue

# [Python v12](#tab/python)

To insert a message into a queue, use the [`send_message`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#send-message-content----kwargs-) method.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_AddMessage":::

# [Python v2](#tab/python2)

To insert a message into a queue, use the [`put_message`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueservice.queueservice?view=storage-py-v2&preserve-view=true#put-message-queue-name--content--visibility-timeout-none--time-to-live-none--timeout-none-) method to create a new message and add it to the queue.

```python
message = u"Hello, World"
print("Adding message: " + message)
queue_service.put_message(queue_name, message)
```

---

## Peek at messages

# [Python v12](#tab/python)

You can peek at messages without removing them from the queue by calling the [`peek_messages`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#peek-messages-max-messages-none----kwargs-) method. By default, this method peeks at a single message.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_PeekMessage":::

# [Python v2](#tab/python2)

You can peek at messages without removing them from the queue by calling the [`peek_messages`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueservice.queueservice?view=storage-py-v2&preserve-view=true#peek-messages-queue-name--num-messages-none--timeout-none-) method. By default, this method peeks at a single message.

```python
messages = queue_service.peek_messages(queue_name)

for peeked_message in messages:
    print("Peeked message: " + peeked_message.content)
```

---

## Change the contents of a queued message

You can change the contents of a message in-place in the queue. If the message represents a task, you can use this feature to update the status of the task.

# [Python v12](#tab/python)

The following code uses the [`update_message`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#update-message-message--pop-receipt-none--content-none----kwargs-) method to update a message. The visibility timeout is set to 0, meaning the message appears immediately and the content is updated.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_ChangeMessage":::

# [Python v2](#tab/python2)

The following code uses the [`update_message`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueservice.queueservice?view=storage-py-v2&preserve-view=true#update-message-queue-name--message-id--pop-receipt--visibility-timeout--content-none--timeout-none-) method to update a message. The visibility timeout is set to 0, meaning the message appears immediately and the content is updated.

```python
messages = queue_service.get_messages(queue_name)

for message in messages:
    queue_service.update_message(
        queue_name, message.id, message.pop_receipt, 0, u"Hello, World Again")
```

---

## Get the queue length

You can get an estimate of the number of messages in a queue.

# [Python v12](#tab/python)

The [get_queue_properties](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#get-queue-properties---kwargs-) method returns queue properties including the `approximate_message_count`.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_GetQueueLength":::

# [Python v2](#tab/python2)

The [`get_queue_metadata`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueservice.queueservice?view=storage-py-v2&preserve-view=true#get-queue-metadata-queue-name--timeout-none-) method returns queue properties including `approximate_message_count`.

```python
metadata = queue_service.get_queue_metadata(queue_name)
count = metadata.approximate_message_count
print("Message count: " + str(count))
```

---

The result is only approximate because messages can be added or removed after the service responds to your request.

## Dequeue messages

Remove a message from a queue in two steps. If your code fails to process a message, this two-step process ensures that you can get the same message and try again. Call `delete_message` after the message has been successfully processed.

# [Python v12](#tab/python)

When you call [receive_messages](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#receive-messages---kwargs-), you get the next message in the queue by default. A message returned from `receive_messages` becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. To finish removing the message from the queue, you must also call [delete_message](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#delete-message-message--pop-receipt-none----kwargs-).

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_DequeueMessages":::

# [Python v2](#tab/python2)

When you call [get_messages](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueservice.queueservice?view=storage-py-v2&preserve-view=true#get-messages-queue-name--num-messages-none--visibility-timeout-none--timeout-none-), you get the next message in the queue by default. A message returned from `get_messages` becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. To finish removing the message from the queue, you must also call [delete_message](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueservice.queueservice?view=storage-py-v2&preserve-view=true#delete-message-queue-name--message-id--pop-receipt--timeout-none-).

```python
messages = queue_service.get_messages(queue_name)

for message in messages:
    print("Deleting message: " + message.content)
    queue_service.delete_message(queue_name, message.id, message.pop_receipt)
```

---

There are two ways you can customize message retrieval from a queue. First, you can get a batch of messages (up to 32). Second, you can set a longer or shorter invisibility timeout, allowing your code more or less time to fully process each message.

# [Python v12](#tab/python)

The following code example uses the [`receive_messages`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#receive-messages---kwargs-) method to get messages in batches. Then it processes each message within each batch by using a nested `for` loop. It also sets the invisibility timeout to five minutes for each message.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_DequeueByPage":::

# [Python v2](#tab/python2)

The following code example uses the [`get_messages`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueservice.queueservice?view=storage-py-v2&preserve-view=true#get-messages-queue-name--num-messages-none--visibility-timeout-none--timeout-none-) method to get 16 messages in one call. Then it processes each message using a `for` loop. It also sets the invisibility timeout to five minutes for each message.

```python
messages = queue_service.get_messages(queue_name, num_messages=16, visibility_timeout=5*60)

for message in messages:
    print("Deleting message: " + message.content)
    queue_service.delete_message(queue_name, message.id, message.pop_receipt)
```

---

## Delete a queue

# [Python v12](#tab/python)

To delete a queue and all the messages contained in it, call the [`delete_queue`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#delete-queue---kwargs-) method.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_DeleteQueue":::

# [Python v2](#tab/python2)

To delete a queue and all the messages contained in it, call the [`delete_queue`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueservice.queueservice?view=storage-py-v2&preserve-view=true#delete-queue-queue-name--fail-not-exist-false--timeout-none-) method.

```python
print("Deleting queue: " + queue_name)
queue_service.delete_queue(queue_name)
```

---

[!INCLUDE [storage-try-azure-tools-queues](../../../includes/storage-try-azure-tools-queues.md)]

## Next steps

Now that you've learned the basics of Queue Storage, follow these links to learn more.

- [Azure Queue Storage Python API reference](/python/api/azure-storage-queue)
- [Python developer center](https://azure.microsoft.com/develop/python/)
- [Azure Storage REST API reference](/rest/api/storageservices/)
