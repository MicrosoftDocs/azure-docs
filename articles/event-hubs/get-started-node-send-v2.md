---
title: Send or receive events from Azure Event Hubs using Node.js (latest)
description: This article provides a walkthrough for creating a Node.js application that sends/receives events to/from Azure Event Hubs using the latest azure/event-hubs version 5 package. 
services: event-hubs
author: spelluru

ms.service: event-hubs
ms.workload: core
ms.topic: quickstart
ms.date: 01/30/2020
ms.author: spelluru

---

# Send events to or receive events from event hubs by using Node.js  (azure/event-hubs version 5)

Azure Event Hubs is a big data streaming platform and event-ingestion service that can receive and process millions of events per second. Event hubs can process and store events, data, or telemetry that's produced by distributed software and devices. Data that's sent to an event hub can be transformed and stored by using any real-time analytics provider or batching/storage adapters. For more information, see [Event Hubs overview](event-hubs-about.md) and [Event Hubs features](event-hubs-features.md).

This quickstart describes how to create Node.js applications that can send events to or receive events from an event hub.

> [!IMPORTANT]
> This quickstart uses version 5 of the Azure Event Hubs JavaScript SDK. For a quick start that uses version 2 of the JavaScript SDK, see [this article](event-hubs-node-get-started-send.md). 

## Prerequisites

To complete this quickstart, you need the following prerequisites:

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.  
- Node.js version 8.x or later. Download the latest [long-term support (LTS) version](https://nodejs.org).  
- Visual Studio Code (recommended) or any other integrated development environment (IDE).  
- An active Event Hubs namespace and event hub. To create them, do the following steps: 

   1. In the [Azure portal](https://portal.azure.com), create a namespace of type *Event Hubs*, and then obtain the management credentials that your application needs to communicate with the event hub. 
   1. To create the namespace and event hub, follow the instructions at [Quickstart: Create an event hub by using the Azure portal](event-hubs-create.md).
   1. Continue by following the instructions in this quickstart. 
   1. To get the connection string for your Event Hub namespace, follow the instructions in [Get connection string](event-hubs-get-connection-string.md#get-connection-string-from-the-portal). Record the connection string to use later in this quickstart.

### Install the npm package
To install the [Node Package Manager (npm) package for Event Hubs](https://www.npmjs.com/package/@azure/event-hubs), open a command prompt that has *npm* in its path, change the directory
to the folder where you want to keep your samples, and then run this command:

```shell
npm install @azure/event-hubs
```

For the receiving side, you need to install two more packages. In this quickstart, you use Azure Blob storage to persist checkpoints so that the program doesn't read the events that it has already read. It performs metadata checkpoints on received messages at regular intervals in a blob. This approach makes it easy to continue receiving messages later from where you left off.

Run the following commands:

```shell
npm install @azure/storage-blob
```

```shell
npm install @azure/eventhubs-checkpointstore-blob
```

## Send events

In this section, you create a Node.js application that sends events to an event hub.

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com).
1. Create a file called *send.js*, and paste the following code into it:

    ```javascript
    const { EventHubProducerClient } = require("@azure/event-hubs");

    const connectionString = "EVENT HUBS NAMESPACE CONNECTION STRING";
    const eventHubName = "EVENT HUB NAME";

    async function main() {

      // Create a producer client to send messages to the event hub.
      const producer = new EventHubProducerClient(connectionString, eventHubName);

      // Prepare a batch of three events.
      const batch = await producer.createBatch();
      batch.tryAdd({ body: "First event" });
      batch.tryAdd({ body: "Second event" });
      batch.tryAdd({ body: "Third event" });    

      // Send the batch to the event hub.
      await producer.sendBatch(batch);

      // Close the producer client.
      await producer.close();

      console.log("A batch of three events have been sent to the event hub");
    }

    main().catch((err) => {
      console.log("Error occurred: ", err);
    });
    ```
1. In the code, use real values to replace the following:
    * `EVENT HUBS NAMESPACE CONNECTION STRING` 
    * `EVENT HUB NAME`
1. Run `node send.js` to execute this file. This command sends a batch of three events to your event hub.
1. In the Azure portal, verify that the event hub has received the messages. In the **Metrics** section, switch to **Messages** view. Refresh the page to update the chart. It might take a few seconds for it to show that the messages have been received.

    [![Verify that the event hub received the messages](./media/getstarted-dotnet-standard-send-v2/verify-messages-portal.png)](./media/getstarted-dotnet-standard-send-v2/verify-messages-portal.png#lightbox)

    > [!NOTE]
    > For the complete source code, including additional informational comments, go to the [GitHub sendEvents.js page](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/eventhub/event-hubs/samples/javascript/sendEvents.js).

Congratulations! You have now sent events to an event hub.


## Receive events
In this section, you receive events from an event hub by using an Azure Blob storage checkpoint store in a Node.js application. It performs metadata checkpoints on received messages at regular intervals in an Azure Storage blob. This approach makes it easy to continue receiving messages later from where you left off.

### Create an Azure storage account and a blob container
To create an Azure storage account and a blob container in it, do the following actions:

1. [Create an Azure storage account](../storage/common/storage-account-create.md?tabs=azure-portal)  
2. [Create a blob container in the storage account](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container)  
3. [Get the connection string to the storage account](../storage/common/storage-configure-connection-string.md?#view-and-copy-a-connection-string)

Be sure to record the connection string and container name for later use in the receive code.

### Write code to receive events

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com).
1. Create a file called *receive.js*, and paste the following code into it:

    ```javascript
    const { EventHubConsumerClient } = require("@azure/event-hubs");
    const { ContainerClient } = require("@azure/storage-blob");    
    const { BlobCheckpointStore } = require("@azure/eventhubs-checkpointstore-blob");

    const connectionString = "EVENT HUBS NAMESPACE CONNECTION STRING";    
    const eventHubName = "EVENT HUB NAME";
    const consumerGroup = "$Default"; // name of the default consumer group
    const storageConnectionString = "AZURE STORAGE CONNECTION STRING";
    const containerName = "BLOB CONTAINER NAME";

    async function main() {
      // Create a blob container client and a blob checkpoint store using the client.
      const containerClient = new ContainerClient(storageConnectionString, containerName);
      const checkpointStore = new BlobCheckpointStore(containerClient);

      // Create a consumer client for the event hub by specifying the checkpoint store.
      const consumerClient = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName, checkpointStore);

      // Subscribe to the events, and specify handlers for processing the events and errors.
      const subscription = consumerClient.subscribe({
          processEvents: async (events, context) => {
            for (const event of events) {
              console.log(`Received event: '${event.body}' from partition: '${context.partitionId}' and consumer group: '${context.consumerGroup}'`);
            }
            // Update the checkpoint.
            await context.updateCheckpoint(events[events.length - 1]);
          },

          processError: async (err, context) => {
            console.log(`Error : ${err}`);
          }
        }
      );

      // After 30 seconds, stop processing.
      await new Promise((resolve) => {
        setTimeout(async () => {
          await subscription.close();
          await consumerClient.close();
          resolve();
        }, 30000);
      });
    }

    main().catch((err) => {
      console.log("Error occurred: ", err);
    });    
    ```
1. In the code, use real values to replace the following values:
    - `EVENT HUBS NAMESPACE CONNECTION STRING`
    - `EVENT HUB NAME`
    - `AZURE STORAGE CONNECTION STRING`
    - `BLOB CONTAINER NAME`
1. Run `node receive.js` in a command prompt to execute this file. The window should display messages about received events.

    > [!NOTE]
    > For the complete source code, including additional informational comments, go to the [GitHub receiveEventsUsingCheckpointStore.js page](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/eventhub/eventhubs-checkpointstore-blob/samples/receiveEventsUsingCheckpointStore.js).

Congratulations! You have now received events from your event hub. The receiver program will receive events from all the partitions of the default consumer group in the event hub.

## Next steps
Check out these samples on GitHub:

- [JavaScript samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/eventhub/event-hubs/samples/javascript)
- [TypeScript samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/eventhub/event-hubs/samples/typescript)
