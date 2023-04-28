---
title: How to use Azure Queue Storage from Python
titleSuffix: Azure Storage
description: Learn to use the Azure Queue Storage from Python to create and delete queues, and insert, get, and delete messages.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 01/19/2023
ms.topic: how-to
ms.service: storage
ms.subservice: queues
ms.devlang: quickstart
ms.custom: seo-javascript-october2019, devx-track-python, py-fresh-zinc, engagement-fy23
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

```console
pip install azure-storage-queue
```

> [!NOTE]
> If you are upgrading from the Azure Storage SDK for Python v0.36 or earlier, uninstall the older SDK using `pip uninstall azure-storage` before installing the latest package.

For alternative installation methods, see [Azure SDK for Python](https://github.com/Azure/Azure-SDK-for-Python).

[!INCLUDE [storage-quickstart-credentials-include](../../../includes/storage-quickstart-credentials-include.md)]

## Configure your application to access Queue Storage

The [`QueueClient`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient) object lets you work with a queue. Add the following code near the top of any Python file in which you wish to programmatically access an Azure queue:

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_ImportStatements":::

The `os` package provides support to retrieve an environment variable. The `uuid` package provides support for generating a unique identifier for a queue name.

## Create a queue

The connection string is retrieved from the `AZURE_STORAGE_CONNECTION_STRING` environment variable set earlier.

The following code creates a `QueueClient` object using the storage connection string.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_CreateQueue":::

Azure queue messages are stored as text. If you want to store binary data, setup Base64 encoding and decoding functions before putting a message in the queue.

Configure Base64 encoding and decoding functions when creating the client object.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_EncodeMessage":::

## Insert a message into a queue

To insert a message into a queue, use the [`send_message`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#send-message-content----kwargs-) method.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_AddMessage":::

## Peek at messages

You can peek at messages without removing them from the queue by calling the [`peek_messages`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#peek-messages-max-messages-none----kwargs-) method. By default, this method peeks at a single message.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_PeekMessage":::

## Change the contents of a queued message

You can change the contents of a message in-place in the queue. If the message represents a task, you can use this feature to update the status of the task.

The following code uses the [`update_message`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#update-message-message--pop-receipt-none--content-none----kwargs-) method to update a message. The visibility timeout is set to 0, meaning the message appears immediately and the content is updated.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_ChangeMessage":::

## Get the queue length

You can get an estimate of the number of messages in a queue.

The [get_queue_properties](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#get-queue-properties---kwargs-) method returns queue properties including the `approximate_message_count`.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_GetQueueLength":::

The result is only approximate because messages can be added or removed after the service responds to your request.

## Dequeue messages

Remove a message from a queue in two steps. If your code fails to process a message, this two-step process ensures that you can get the same message and try again. Call `delete_message` after the message has been successfully processed.

When you call [receive_messages](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#receive-messages---kwargs-), you get the next message in the queue by default. A message returned from `receive_messages` becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. To finish removing the message from the queue, you must also call [delete_message](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#delete-message-message--pop-receipt-none----kwargs-).

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_DequeueMessages":::

There are two ways you can customize message retrieval from a queue. First, you can get a batch of messages (up to 32). Second, you can set a longer or shorter invisibility timeout, allowing your code more or less time to fully process each message.

The following code example uses the [`receive_messages`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#receive-messages---kwargs-) method to get messages in batches. Then it processes each message within each batch by using a nested `for` loop. It also sets the invisibility timeout to five minutes for each message.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_DequeueByPage":::

## Delete a queue

To delete a queue and all the messages contained in it, call the [`delete_queue`](/azure/developer/python/sdk/storage/azure-storage-queue/azure.storage.queue.queueclient#delete-queue---kwargs-) method.

:::code language="python" source="~/azure-storage-snippets/queues/howto/python/python-v12/python-howto-v12.py" id="Snippet_DeleteQueue":::

[!INCLUDE [storage-try-azure-tools-queues](../../../includes/storage-try-azure-tools-queues.md)]

## Next steps

Now that you've learned the basics of Queue Storage, follow these links to learn more.

- [Azure Queue Storage Python API reference](/python/api/azure-storage-queue)
- [Python developer center](https://azure.microsoft.com/develop/python/)
- [Azure Storage REST API reference](/rest/api/storageservices/)

For related code samples using deprecated Python version 2 SDKs, see [Code samples using Python version 2](queues-v2-samples-python.md).
