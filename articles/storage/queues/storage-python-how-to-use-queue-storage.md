---
title: How to use Azure Queue storage from Python - Azure Storage
description: Learn to use the Azure Queue service from Python to create and delete queues, and insert, get, and delete messages.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 08/21/2020
ms.service: storage
ms.subservice: queues
ms.topic: how-to
ms.reviewer: dineshm
ms.custom: seo-javascript-october2019, devx-track-python
---

# How to use Azure Queue storage from Python

[!INCLUDE [storage-selector-queue-include](../../../includes/storage-selector-queue-include.md)]

This article demonstrates common scenarios using the Azure Queue storage service. The scenarios that are covered include inserting, peeking, getting, and deleting queue messages. Code for creating and deleting queues is also covered.

## Overview

The samples in this article are written in Python and use the [Azure Queue storage client library for Python]. For more information on queues, see the [Next steps](#next-steps) section.

[!INCLUDE [storage-queue-concepts-include](../../../includes/storage-queue-concepts-include.md)]

[!INCLUDE [storage-create-account-include](../../../includes/storage-create-account-include.md)]

## Download and install Azure Storage SDK for Python

The [Azure Storage SDK for Python](https://github.com/azure/azure-storage-python) requires Python version 2.7, 3.3, or later.
 
### Install via PyPi

To install via the Python Package Index (PyPi), type:

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
> If you are upgrading from the Azure Storage SDK for Python version 0.36 or earlier, uninstall the older SDK using `pip uninstall azure-storage` before installing the latest package.

For alternative installation methods, see [Azure SDK for Python].

[!INCLUDE [storage-quickstart-credentials-include](../../../includes/storage-quickstart-credentials-include.md)]

## Configure your application to access queue storage

# [Python v12](#tab/python)

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_ImportStatements":::

# [Python v2](#tab/python2)

The [QueueService](/python/api/azure-storage-queue/azure.storage.queue.queueservice.queueservice) object lets you work with queues. The following code creates a `QueueService` object. Add the following code near the top of any Python file in which you wish to programmatically access Azure Storage:

```python
from azure.storage.queue import QueueService
```

---

## Create a queue

# [Python v12](#tab/python)

The following code creates a `QueueServiceClient` object using the storage connection string. The connection string is retrieved from the `AZURE_STORAGE_CONNECTION_STRING` environment variable.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_CreateQueue":::

# [Python v2](#tab/python2)

The following code creates a `QueueService` object using the storage account name and account key. Replace *myaccount* and *my key* with your account name and key.

```python
queue_service = QueueService(account_name='myaccount', account_key='mykey')

queue_service.create_queue('taskqueue')
```

---

## Insert a message into a queue

# [Python v12](#tab/python)

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_AddMessage":::

# [Python v2](#tab/python2)

To insert a message into a queue, use the [put_message](/python/api/azure-storage-queue/azure.storage.queue.queueservice.queueservice#put-message-queue-name--content--visibility-timeout-none--time-to-live-none--timeout-none-) method to create a new message and add it to the queue.

```python
queue_service.put_message('taskqueue', u'Hello World')
```

---

Azure queue messages are stored as text. If you want to store binary data, setup Base64 encoding and decoding functions before putting a message in the queue.

# [Python v12](#tab/python)

Configure Base64 encoding and decoding functions on the queue client object.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_EncodeMessage":::

# [Python v2](#tab/python2)

Configure Base64 encoding and decoding functions on the queue service object.

```python
# Setup Base64 encoding and decoding functions
queue_service.encode_function = QueueMessageFormat.binary_base64encode
queue_service.decode_function = QueueMessageFormat.binary_base64decode
```

---

## Peek at the next message

You can peek at the message in the front of a queue without removing it from the queue by calling the [peek_messages](/python/api/azure-storage-queue/azure.storage.queue.queueservice.queueservice#peek-messages-queue-name--num-messages-none--timeout-none-) method. By default, `peek_messages` peeks at a single message.

# [Python v12](#tab/python)

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_PeekMessage":::

# [Python v2](#tab/python2)

```python
messages = queue_service.peek_messages('taskqueue')
for message in messages:
    print(message.content)
```

---

## Change the contents of a queued message

You can change the contents of a message in-place in the queue. If the message represents a task, you can use this feature to update the status of the task.

# [Python v12](#tab/python)

The code below uses the [update_message](/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#update-message-message--pop-receipt-none--content-none----kwargs-) method to update a message. The visibility timeout is set to 0, meaning the message appears immediately and the content is updated.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_ChangeMessage":::

# [Python v2](#tab/python2)

The code below uses the [update_message](/python/api/azure-storage-queue/azure.storage.queue.queueservice.queueservice#update-message-queue-name--message-id--pop-receipt--visibility-timeout--content-none--timeout-none-) method to update a message. The visibility timeout is set to 0, meaning the message appears immediately and the content is updated.

```python
messages = queue_service.get_messages('taskqueue')
for message in messages:
    queue_service.update_message(
        'taskqueue', message.id, message.pop_receipt, 0, u'Hello World Again')
```

---

## Get the queue length

You can get an estimate of the number of messages in a queue.

# [Python v12](#tab/python)

The [get_queue_properties](/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#get-queue-properties---kwargs-) method asks the queue service to return properties about the queue, and the `approximate_message_count`. The result is only approximate because messages can be added or removed after the queue service responds to your request.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_GetQueueLength":::

# [Python v2](#tab/python2)

The [get_queue_metadata](/python/api/azure-storage-queue/azure.storage.queue.queueservice.queueservice#get-queue-metadata-queue-name--timeout-none-) method asks the queue service to return metadata about the queue, and the `approximate_message_count`. The result is only approximate because messages can be added or removed after the queue service responds to your request.

```python
metadata = queue_service.get_queue_metadata('taskqueue')
count = metadata.approximate_message_count
```

---

## Dequeue messages

# [Python v12](#tab/python)

Your code removes a message from a queue in two steps. When you call [receive_messages](/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#receive-messages---kwargs-), you get the next message in a queue by default. A message returned from `get_messages` becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. To finish removing the message from the queue, you must also call [delete_message](/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#delete-message-message--pop-receipt-none----kwargs-). If your code fails to process a message, this two-step process ensures that you can get the same message and try again. Your code calls `delete_message` right after the message has been processed.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_DequeueMessages":::

# [Python v2](#tab/python2)

Your code removes a message from a queue in two steps. When you call [get_messages](/python/api/azure-storage-queue/azure.storage.queue.queueservice.queueservice#get-messages-queue-name--num-messages-none--visibility-timeout-none--timeout-none-), you get the next message in a queue by default. A message returned from `get_messages` becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. To finish removing the message from the queue, you must also call [delete_message](/python/api/azure-storage-queue/azure.storage.queue.queueservice.queueservice#delete-message-queue-name--message-id--pop-receipt--timeout-none-). If your code fails to process a message, this two-step process ensures that you can get the same message and try again. Your code calls `delete_message` right after the message has been processed.

```python
messages = queue_service.get_messages('taskqueue')
for message in messages:
    print(message.content)
    queue_service.delete_message('taskqueue', message.id, message.pop_receipt)
```

---

There are two ways you can customize message retrieval from a queue. First, you can get a batch of messages (up to 32). Second, you can set a longer or shorter invisibility timeout, allowing your code more or less time to fully process each message. The following code example uses the `get_messages` method to get 16 messages in one call. Then it processes each message using a for loop. It also sets the invisibility timeout to five minutes for each message.

```python
messages = queue_service.get_messages(
    'taskqueue', num_messages=16, visibility_timeout=5*60)
for message in messages:
    print(message.content)
    queue_service.delete_message('taskqueue', message.id, message.pop_receipt)
```

## Delete a queue

# [Python v12](#tab/python)

To delete a queue and all the messages contained in it, call the [delete_queue](/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#delete-queue---kwargs-) method.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_DeleteQueue":::

# [Python v2](#tab/python2)

To delete a queue and all the messages contained in it, call the [delete_queue](/python/api/azure-storage-queue/azure.storage.queue.queueservice.queueservice#delete-queue-queue-name--fail-not-exist-false--timeout-none-) method.

```python
queue_service.delete_queue('taskqueue')
```

---

[!INCLUDE [storage-try-azure-tools-queues](../../../includes/storage-try-azure-tools-queues.md)]

## Next steps

Now that you've learned the basics of queue storage, follow these links to learn more.

* [Azure Queues Python API reference](/python/api/azure-storage-queue)
* [Python Developer Center](https://azure.microsoft.com/develop/python/)
* [Azure Storage Services REST API](https://msdn.microsoft.com/library/azure/dd179355)

[Azure Queue storage client library for Python]: https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-queue
[Azure SDK for Python]: https://github.com/azure/azure-sdk-for-python
[Azure Storage Team Blog]: https://techcommunity.microsoft.com/t5/azure-storage/bg-p/AzureStorageBlog
