---
title: Send or receive events from Azure Event Hubs using Python
description: This article provides a walkthrough for creating a Python application that sends/receives events to/from Azure Event Hubs.
ms.topic: quickstart
ms.date: 01/08/2023
ms.devlang: python
ms.custom: mode-api, passwordless-python, devx-track-python
---

# Send events to or receive events from event hubs by using Python
This quickstart shows how to send events to and receive events from an event hub using the **azure-eventhub** Python package.

## Prerequisites
If you're new to Azure Event Hubs, see [Event Hubs overview](event-hubs-about.md) before you do this quickstart. 

To complete this quickstart, you need the following prerequisites:

- **Microsoft Azure subscription**. To use Azure services, including Azure Event Hubs, you need a subscription. If you don't have an existing Azure account, sign up for a [free trial](https://azure.microsoft.com/free/).
- Python 3.7 or later, with pip installed and updated.
- Visual Studio Code (recommended) or any other integrated development environment (IDE). 
- **Create an Event Hubs namespace and an event hub**. The first step is to use the [Azure portal](https://portal.azure.com) to create an Event Hubs namespace, and obtain the management credentials that your application needs to communicate with the event hub. To create a namespace and an event hub, follow the procedure in [this article](event-hubs-create.md).

### Install the packages to send events

To install the Python packages for Event Hubs, open a command prompt that has Python in its path. Change the directory to the folder where you want to keep your samples.

## [Passwordless (Recommended)](#tab/passwordless)

```shell
pip install azure-eventhub
pip install azure-identity
pip install aiohttp
```

## [Connection String](#tab/connection-string)

```shell
pip install azure-eventhub
```

---

### Authenticate the app to Azure

[!INCLUDE [event-hub-passwordless-template-tabbed](../../includes/passwordless/event-hub/event-hub-passwordless-template-tabbed-basic.md)]


## Send events

In this section, create a Python script to send events to the event hub that you created earlier.

1. Open your favorite Python editor, such as [Visual Studio Code](https://code.visualstudio.com/).
1. Create a script called *send.py*. This script sends a batch of events to the event hub that you created earlier.
1. Paste the following code into *send.py*:

    ## [Passwordless (Recommended)](#tab/passwordless)

    In the code, use real values to replace the following placeholders:

    * `EVENT_HUB_FULLY_QUALIFIED_NAMESPACE`
    * `EVENT_HUB_NAME`

    ```python
    import asyncio
    
    from azure.eventhub import EventData
    from azure.eventhub.aio import EventHubProducerClient
    from azure.identity.aio import DefaultAzureCredential
    
    EVENT_HUB_FULLY_QUALIFIED_NAMESPACE = "EVENT_HUB_FULLY_QUALIFIED_NAMESPACE"
    EVENT_HUB_NAME = "EVENT_HUB_NAME"
    
    credential = DefaultAzureCredential()
    
    async def run():
        # Create a producer client to send messages to the event hub.
        # Specify a credential that has correct role assigned to access
        # event hubs namespace and the event hub name.
        producer = EventHubProducerClient(
            fully_qualified_namespace=EVENT_HUB_FULLY_QUALIFIED_NAMESPACE,
            eventhub_name=EVENT_HUB_NAME,
            credential=credential,
        )
        async with producer:
            # Create a batch.
            event_data_batch = await producer.create_batch()
    
            # Add events to the batch.
            event_data_batch.add(EventData("First event "))
            event_data_batch.add(EventData("Second event"))
            event_data_batch.add(EventData("Third event"))
    
            # Send the batch of events to the event hub.
            await producer.send_batch(event_data_batch)
    
            # Close credential when no longer needed.
            await credential.close()
    
    asyncio.run(run())
    ```

    ## [Connection String](#tab/connection-string)

    In the code, use real values to replace the following placeholders:

    * `EVENT_HUB_CONNECTION_STR`
    * `EVENT_HUB_NAME`

    > [!NOTE]
    > Make sure that **EVENT_HUB_NAME** is the name of the event hub and not the Event Hubs namespace. If this value is incorrect, you will receive the error code: `CBS Token authentication failed.`.

    ```python
    import asyncio
    
    from azure.eventhub import EventData
    from azure.eventhub.aio import EventHubProducerClient
    
    EVENT_HUB_CONNECTION_STR = "EVENT_HUB_CONNECTION_STR"
    EVENT_HUB_NAME = "EVENT_HUB_NAME"
    
    async def run():
        # Create a producer client to send messages to the event hub.
        # Specify a connection string to your event hubs namespace and
        # the event hub name.
        producer = EventHubProducerClient.from_connection_string(
            conn_str=EVENT_HUB_CONNECTION_STR, eventhub_name=EVENT_HUB_NAME
        )
        async with producer:
            # Create a batch.
            event_data_batch = await producer.create_batch()
    
            # Add events to the batch.
            event_data_batch.add(EventData("First event "))
            event_data_batch.add(EventData("Second event"))
            event_data_batch.add(EventData("Third event"))
    
            # Send the batch of events to the event hub.
            await producer.send_batch(event_data_batch)
    
    asyncio.run(run())    
    ```
    ---
    > [!NOTE]
    > For examples of other options for sending events to Event Hub asynchronously using a connection string, see the [GitHub send_async.py page](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/eventhub/azure-eventhub/samples/async_samples/send_async.py). The patterns shown there are also applicable to sending events passwordless.
    

## Receive events

This quickstart uses Azure Blob storage as a checkpoint store. The checkpoint store is used to persist checkpoints (that is, the last read positions).  

[!INCLUDE [storage-checkpoint-store-recommendations](./includes/storage-checkpoint-store-recommendations.md)]


### Create an Azure storage account and a blob container
Create an Azure storage account and a blob container in it by doing the following steps:

1. [Create an Azure Storage account](../storage/common/storage-account-create.md?tabs=azure-portal)
2. [Create a blob container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container).
3. Authenticate to the blob container.

Be sure to record the connection string and container name for later use in the receive code.

## [Passwordless (Recommended)](#tab/passwordless)

[!INCLUDE [event-hub-storage-assign-roles](../../includes/passwordless/event-hub/event-hub-storage-assign-roles.md)]

## [Connection String](#tab/connection-string)

[Get the connection string to the storage account](../storage/common/storage-configure-connection-string.md)

---

### Install the packages to receive events

For the receiving side, you need to install one or more packages. In this quickstart, you use Azure Blob storage to persist checkpoints so that the program doesn't read the events that it has already read. It performs metadata checkpoints on received messages at regular intervals in a blob. This approach makes it easy to continue receiving messages later from where you left off.

## [Passwordless (Recommended)](#tab/passwordless)

```shell
pip install azure-eventhub-checkpointstoreblob-aio
pip install azure-identity
```

## [Connection String](#tab/connection-string)

```shell
pip install azure-eventhub-checkpointstoreblob-aio
```

---

### Create a Python script to receive events

In this section, you create a Python script to receive events from your event hub:

1. Open your favorite Python editor, such as [Visual Studio Code](https://code.visualstudio.com/).
1. Create a script called *recv.py*.
1. Paste the following code into *recv.py*:

    ## [Passwordless (Recommended)](#tab/passwordless)

    In the code, use real values to replace the following placeholders:

    * `BLOB_STORAGE_ACCOUNT_URL`
    * `BLOB_CONTAINER_NAME`
    * `EVENT_HUB_FULLY_QUALIFIED_NAMESPACE`
    * `EVENT_HUB_NAME`

    ```python
    import asyncio
    
    from azure.eventhub.aio import EventHubConsumerClient
    from azure.eventhub.extensions.checkpointstoreblobaio import (
        BlobCheckpointStore,
    )
    from azure.identity.aio import DefaultAzureCredential
    
    BLOB_STORAGE_ACCOUNT_URL = "BLOB_STORAGE_ACCOUNT_URL"
    BLOB_CONTAINER_NAME = "BLOB_CONTAINER_NAME"
    EVENT_HUB_FULLY_QUALIFIED_NAMESPACE = "EVENT_HUB_FULLY_QUALIFIED_NAMESPACE"
    EVENT_HUB_NAME = "EVENT_HUB_NAME"
    
    credential = DefaultAzureCredential()
    
    async def on_event(partition_context, event):
        # Print the event data.
        print(
            'Received the event: "{}" from the partition with ID: "{}"'.format(
                event.body_as_str(encoding="UTF-8"), partition_context.partition_id
            )
        )
    
        # Update the checkpoint so that the program doesn't read the events
        # that it has already read when you run it next time.
        await partition_context.update_checkpoint(event)
    
    
    async def main():
        # Create an Azure blob checkpoint store to store the checkpoints.
        checkpoint_store = BlobCheckpointStore(
            blob_account_url=BLOB_STORAGE_ACCOUNT_URL,
            container_name=BLOB_CONTAINER_NAME,
            credential=credential,
        )
    
        # Create a consumer client for the event hub.
        client = EventHubConsumerClient(
            fully_qualified_namespace=EVENT_HUB_FULLY_QUALIFIED_NAMESPACE,
            eventhub_name=EVENT_HUB_NAME,
            consumer_group="$Default",
            checkpoint_store=checkpoint_store,
            credential=credential,
        )
        async with client:
            # Call the receive method. Read from the beginning of the partition
            # (starting_position: "-1")
            await client.receive(on_event=on_event, starting_position="-1")
    
        # Close credential when no longer needed.
        await credential.close()
    
    if __name__ == "__main__":
        # Run the main method.
        asyncio.run(main())
    ```

    ## [Connection String](#tab/connection-string)

    In the code, use real values to replace the following placeholders:

    * `BLOB_STORAGE_CONNECTION_STRING`
    * `BLOB_CONTAINER_NAME`
    * `EVENT_HUB_CONNECTION_STR`
    * `EVENT_HUB_NAME`

    ```python
    import asyncio
    
    from azure.eventhub.aio import EventHubConsumerClient
    from azure.eventhub.extensions.checkpointstoreblobaio import (
        BlobCheckpointStore,
    )
    
    BLOB_STORAGE_CONNECTION_STRING = "BLOB_STORAGE_CONNECTION_STRING"
    BLOB_CONTAINER_NAME = "BLOB_CONTAINER_NAME"
    EVENT_HUB_CONNECTION_STR = "EVENT_HUB_CONNECTION_STR"
    EVENT_HUB_NAME = "EVENT_HUB_NAME"
    
    
    async def on_event(partition_context, event):
        # Print the event data.
        print(
            'Received the event: "{}" from the partition with ID: "{}"'.format(
                event.body_as_str(encoding="UTF-8"), partition_context.partition_id
            )
        )
    
        # Update the checkpoint so that the program doesn't read the events
        # that it has already read when you run it next time.
        await partition_context.update_checkpoint(event)
    
    async def main():
        # Create an Azure blob checkpoint store to store the checkpoints.
        checkpoint_store = BlobCheckpointStore.from_connection_string(
            BLOB_STORAGE_CONNECTION_STRING, BLOB_CONTAINER_NAME
        )
    
        # Create a consumer client for the event hub.
        client = EventHubConsumerClient.from_connection_string(
            EVENT_HUB_CONNECTION_STR,
            consumer_group="$Default",
            eventhub_name=EVENT_HUB_NAME,
            checkpoint_store=checkpoint_store,
        )
        async with client:
            # Call the receive method. Read from the beginning of the
            # partition (starting_position: "-1")
            await client.receive(on_event=on_event, starting_position="-1")
    
    if __name__ == "__main__":
        loop = asyncio.get_event_loop()
        # Run the main method.
        loop.run_until_complete(main())
    ```

    ---

    > [!NOTE]
    > For examples of other options for receiving events from Event Hub asynchronously using a connection string, see the [GitHub recv_with_checkpoint_store_async.py 
page](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/eventhub/azure-eventhub/samples/async_samples/recv_with_checkpoint_store_async.py). The patterns shown there are also applicable to receiving events passwordless.


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

The receiver window should display the messages that were sent to the event hub. 

### Troubleshooting

If you don't see events in the receiver window or the code reports an error, try the following troubleshooting tips:

* If you don't see results from *recy.py*, run *send.py* several times.

* If you see errors about "coroutine" when using the passwordless code (with credentials), make sure you're using importing from `azure.identity.aio`.

* If you see "Unclosed client session" with passwordless code (with credentials), make sure you close the credential when finished. For more information, see [Async credentials](/python/api/overview/azure/identity-readme?view=azure-python&preserve-view=true#async-credentials).

* If you see authorization errors with *recv.py* when accessing storage, make sure you followed the steps in [Create an Azure storage account and a blob container](#create-an-azure-storage-account-and-a-blob-container) and assigned the **Storage Blob Data Contributor** role to the service principal.

* If you receive events with different partition IDs, this result is expected. Partitions are a data organization mechanism that relates to the downstream parallelism required in consuming applications. The number of partitions in an event hub directly relates to the number of concurrent readers you expect to have. For more information, see [Learn more about partitions](./event-hubs-features.md#partitions).

## Next steps

In this quickstart, you've sent and received events asynchronously. To learn how to send and receive events synchronously, go to the [GitHub sync_samples page](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventhub/azure-eventhub/samples/sync_samples).

For all the samples (both synchronous and asynchronous) on GitHub, go to [Azure Event Hubs client library for Python samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventhub/azure-eventhub/samples).
