---
title: Send or receive events using Python - Azure Event Hubs | Microsoft Docs
description: This article provides a walkthrough for creating a Python application that sends events to Azure Event Hubs.
services: event-hubs
author: spelluru

ms.service: event-hubs
ms.workload: core
ms.topic: article
ms.date: 01/08/2020
ms.author: spelluru

---

# Send events to or receive events from Event Hubs using Python

Azure Event Hubs is a Big Data streaming platform and event ingestion service, capable of receiving and processing millions of events per second. Event Hubs can process and store events, data, or telemetry produced by distributed software and devices. Data sent to an event hub can be transformed and stored using any real-time analytics provider or batching/storage adapters. For detailed overview of Event Hubs, see [Event Hubs overview](event-hubs-about.md) and [Event Hubs features](event-hubs-features.md).

This tutorial describes how to create Python applications to send events to or receive events from an event hub.

> [!IMPORTANT]
> This quickstart uses version 5 of the Azure Event Hubs Python SDK. For a quick start that uses the old version 1 of the Python SDK, see [this article](event-hubs-python-get-started-send.md). If you are using version 1 of the SDK, we recommend that you migrate your code to the latest version. For details, see the [migration guide](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/eventhub/azure-eventhub/migration_guide.md).


## Prerequisites

To complete this tutorial, you need the following prerequisites:

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.
- An active Event Hubs namespace and event hub, created by following the instructions at [Quickstart: Create an event hub using Azure portal](event-hubs-create.md). Make a note of the namespace and event hub names to use later in this walkthrough.
- The shared access key name and primary key value for your Event Hubs namespace. Get the access key name and value by following the instructions at [Get connection string](event-hubs-get-connection-string.md#get-connection-string-from-the-portal). The default access key name is **RootManageSharedAccessKey**. Copy the key name and the primary key value to use later in this walkthrough.
- Python 2.7, and 3.5 or later, with `pip` installed and updated.
- The Python package for Event Hubs. To install the package, run this command in a command prompt that has Python in its path:

    ```cmd
    pip install azure-eventhub
    ```

    Install this package for receiving the events using an Azure Blob storage as the checkpoint store.

    ```cmd
    pip install azure-eventhub-checkpointstoreblobaio
    ```

## Send events
In this section, you create a Python script to send events to the event hub you created earlier.

1. Open your favorite Python editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. Create a script called **send.py**. This script sends a batch of events to the event hub you created earlier.
3. Paste the following code into send.py. See the code comments for details.

    ```python
    import asyncio
    from azure.eventhub.aio import EventHubProducerClient
    from azure.eventhub import EventData

    async def run():
        # create a producer client to send messages to the event hub
        # specify connection string to your event hubs namespace and
     	    # the event hub name
        producer = EventHubProducerClient.from_connection_string(conn_str="EVENT HUBS NAMESPACE - CONNECTION STRING", eventhub_name="EVENT HUB NAME")
        async with producer:
            # create a batch
            event_data_batch = await producer.create_batch()

            # add events to the batch
            event_data_batch.add(EventData('First event '))
            event_data_batch.add(EventData('Second event'))
            event_data_batch.add(EventData('Third event'))

            # send the batch of events to the event hub
            await producer.send_batch(event_data_batch)

    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())

    ```

    > [!NOTE]
    > For the complete source code with very useful comments, see [this file on the GitHub](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/eventhub/azure-eventhub/samples/async_samples/send_async.py)

## Receive events
This quickstart uses an Azure Blob Storage as a checkpoint store. The checkpoint store is used to persist checkpoints (last read position).  

### Create an Azure Storage and a blob container
Follow these steps to create an Azure Storage account a blob container in it.

1. [Create an Azure Storage account](../storage/common/storage-account-create.md?tabs=azure-portal)
2. [Create a blob container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container)
3. [Get the connection string to the storage account](../storage/common/storage-configure-connection-string.md?#view-and-copy-a-connection-string)

    Note down connection string and the container name. You will use them in the receive code.


### Create Python script to receive events

In this section, you create a Python script to receive events from your event hub:

1. Open your favorite Python editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. Create a script called **recv.py**.
3. Paste the following code into recv.py. See the code comments for details.

    ```python
    import asyncio
    from azure.eventhub.aio import EventHubConsumerClient
    from azure.eventhub.extensions.checkpointstoreblobaio import BlobCheckpointStore


    async def on_event(partition_context, event):
        # print the event data
        print("Received the event: \"{}\" from the partition with ID: \"{}\"".format(event.body_as_str(encoding='UTF-8'), partition_context.partition_id))

        # update the checkpoint so that the program doesn't read the events
        # that it has already read when you run it next time
        await partition_context.update_checkpoint(event)

    async def main():
        # create an Azure blob checkpoint store to store the checkpoints
        checkpoint_store = BlobCheckpointStore.from_connection_string("AZURE STORAGE CONNECTION STRING", "BLOB CONTAINER NAME")

        # create a consumer client for the event hub
        client = EventHubConsumerClient.from_connection_string("EVENT HUBS NAMESPACE CONNECTION STRING", consumer_group="$Default", eventhub_name="EVENT HUB NAME", checkpoint_store=checkpoint_store)
        async with client:
            # call the receive method
            await client.receive(on_event=on_event)

    if __name__ == '__main__':
        loop = asyncio.get_event_loop()
        # run the main method
        loop.run_until_complete(main())    
    ```

    > [!NOTE]
    > For the complete source code with very useful comments, see [this file on the GitHub](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/eventhub/azure-eventhub/samples/async_samples/recv_with_checkpoint_store_async.py)


### Run the receiver app

To run the script, open a command prompt that has Python in its path, and then run this command:

```bash
python recv.py
```

### Run the sender app

To run the script, open a command prompt that has Python in its path, and then run this command:

```bash
python send.py
```

You should see the messages that were sent to the event hub in the receiver window.


## Next steps
In this quickstart, you have sent and receive events asynchronously. To learn how to send and receive events synchronously, see samples in [this location](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventhub/azure-eventhub/samples/sync_samples).

You can find all the samples (both sync and async) on the GitHub [here](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventhub/azure-eventhub/samples).
