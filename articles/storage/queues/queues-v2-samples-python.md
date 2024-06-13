---
title: Azure Queue Storage code samples using Python version 2 client libraries
titleSuffix: Azure Storage
description: View code samples that use the Azure Queue Storage client library for Python version 2.
services: storage
author: pauljewellmsft
ms.service: azure-queue-storage
ms.custom: devx-track-python
ms.topic: how-to
ms.date: 07/24/2023
ms.author: pauljewell
---

# Azure Queue Storage code samples using Python version 2 client libraries

This article shows code samples that use version 2 of the Azure Queue Storage client library for Python.

[!INCLUDE [storage-v11-sdk-support-retirement](../../../includes/storage-v11-sdk-support-retirement.md)]

For code samples using the latest version 12.x client library version, see [Quickstart: Azure Queue Storage client library for Python](storage-quickstart-queues-python.md).

## Create a queue

Add the following `import` directives:

```python
from azure.storage.queue import (
        QueueService,
        QueueMessageFormat
)
```

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

Azure queue messages are stored as text. If you want to store binary data, setup Base64 encoding and decoding functions before putting a message in the queue.

Configure Base64 encoding and decoding functions on Queue Storage object:

```python
# Setup Base64 encoding and decoding functions
queue_service.encode_function = QueueMessageFormat.binary_base64encode
queue_service.decode_function = QueueMessageFormat.binary_base64decode
```

## Insert a message into a queue

To insert a message into a queue, use the [`put_message`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueservice.queueservice?view=storage-py-v2&preserve-view=true#put-message-queue-name--content--visibility-timeout-none--time-to-live-none--timeout-none-) method to create a new message and add it to the queue.

```python
message = u"Hello, World"
print("Adding message: " + message)
queue_service.put_message(queue_name, message)
```

## Peek at messages

You can peek at messages without removing them from the queue by calling the [`peek_messages`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueservice.queueservice?view=storage-py-v2&preserve-view=true#peek-messages-queue-name--num-messages-none--timeout-none-) method. By default, this method peeks at a single message.

```python
messages = queue_service.peek_messages(queue_name)

for peeked_message in messages:
    print("Peeked message: " + peeked_message.content)
```

## Change the contents of a queued message

The following code uses the [`update_message`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueservice.queueservice?view=storage-py-v2&preserve-view=true#update-message-queue-name--message-id--pop-receipt--visibility-timeout--content-none--timeout-none-) method to update a message. The visibility timeout is set to 0, meaning the message appears immediately and the content is updated.

```python
messages = queue_service.get_messages(queue_name)

for message in messages:
    queue_service.update_message(
        queue_name, message.id, message.pop_receipt, 0, u"Hello, World Again")
```

## Get the queue length

The [`get_queue_metadata`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueservice.queueservice?view=storage-py-v2&preserve-view=true#get-queue-metadata-queue-name--timeout-none-) method returns queue properties including `approximate_message_count`.

```python
metadata = queue_service.get_queue_metadata(queue_name)
count = metadata.approximate_message_count
print("Message count: " + str(count))
```

The result is only approximate because messages can be added or removed after the service responds to your request.

## Dequeue messages

When you call [get_messages](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueservice.queueservice?view=storage-py-v2&preserve-view=true#get-messages-queue-name--num-messages-none--visibility-timeout-none--timeout-none-), you get the next message in the queue by default. A message returned from `get_messages` becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. To finish removing the message from the queue, you must also call [delete_message](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueservice.queueservice?view=storage-py-v2&preserve-view=true#delete-message-queue-name--message-id--pop-receipt--timeout-none-).

```python
messages = queue_service.get_messages(queue_name)

for message in messages:
    print("Deleting message: " + message.content)
    queue_service.delete_message(queue_name, message.id, message.pop_receipt)
```

There are two ways you can customize message retrieval from a queue. First, you can get a batch of messages (up to 32). Second, you can set a longer or shorter invisibility timeout, allowing your code more or less time to fully process each message.

The following code example uses the [`get_messages`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueservice.queueservice?view=storage-py-v2&preserve-view=true#get-messages-queue-name--num-messages-none--visibility-timeout-none--timeout-none-) method to get 16 messages in one call. Then it processes each message using a `for` loop. It also sets the invisibility timeout to five minutes for each message.

```python
messages = queue_service.get_messages(queue_name, num_messages=16, visibility_timeout=5*60)

for message in messages:
    print("Deleting message: " + message.content)
    queue_service.delete_message(queue_name, message.id, message.pop_receipt)
```

## Delete a queue

To delete a queue and all the messages contained in it, call the [`delete_queue`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueservice.queueservice?view=storage-py-v2&preserve-view=true#delete-queue-queue-name--fail-not-exist-false--timeout-none-) method.

```python
print("Deleting queue: " + queue_name)
queue_service.delete_queue(queue_name)
```
