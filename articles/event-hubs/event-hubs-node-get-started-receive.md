---
title: Receive events from Azure Event Hubs using Node.js | Microsoft Docs
description: Learn how to receive events from Event Hubs using Node.js.
services: event-hubs
author: ShubhaVijayasarathy
manager: kamalb

ms.service: event-hubs
ms.workload: core
ms.topic: article
ms.date: 09/18/2018
ms.author: shvija

---

# Receive events from Azure Event Hubs using Node.js

Azure Event Hubs is a highly scalable event management system that can handle millions of events per second, enabling applications to process and analyze massive amounts of data produced by connected devices and other systems. Once collected into an event hub, you can receive and handle events using in-process handlers or by forwarding to other analytics systems. You can also capture event data in Azure Storage or Azure Data Lake Store before it's processed.  

To learn more about Event Hubs, see the [Event Hubs overview](event-hubs-about.md).

This tutorial shows how to receive events from an event hub by using Azure [EventProcessorHost](event-hubs-event-processor-host.md) in a Node.js application. The EventProcessorHost (EPH) helps you efficiently receive events from an event hub by creating receivers across all partitions in the consumer group of an event hub. It checkpoints metadata on received messages at regular intervals in an Azure Storage Blob. This approach makes it easy to continue receiving messages from where you left off at a later time.

The code for this quickstart is available on [GitHub](https://github.com/Azure/azure-event-hubs-node/tree/master/processor).

> [!NOTE]
>  To send events to Event Hubs using Node.js, see this article: [Send events to Azure Event Hubs using Node.js](event-hubs-node-get-started-send.md). 

## Prerequisites

To complete this tutorial, you need the following prerequisites:

- Node.js version 8.x and higher. Download the latest LTS version from [https://nodejs.org](https://nodejs.org). Do not use older LTS version of node.js. 
- An active Azure account. If you don't have an Azure subscription, create a [free account][] before you begin.

## Create a namespace and event hub
The first step is to use the Azure portal to create an Event Hubs namespace with an event hub. If you do not have an existing one, you can create these entities by following the instructions in [Create an Event Hubs namespace and an event hub using the Azure portal](event-hubs-create.md).

## Create a storage account and container
To use the EventProcessorHost, you must have an Azure Storage account. The state information such as leases on partitions and checkpoints in the event stream are shared between receivers using an Azure Storage container. You can create an Azure Storage account by following the instructions in [this article](../storage/common/storage-quickstart-create-account.md).

## Clone the Git repository
Download or clone the [sample](https://github.com/Azure/azure-event-hubs-node/tree/master/processor/examples/) from Github. 

## Install the EventProcessorHost
Install the EventProcessorHost for Event Hubs module. 

```nodejs
npm install @azure/event-processor-host
```

## Receive events using EventProcessorHost
The SDK you have cloned contains multiple samples that show you how to receive events from an event hub using Node.js. In this quickstart, you use the **singleEPH.js** example. To observe events being received, open another terminal, and send events using the [send sample](event-hubs-node-get-started-send.md).

1. Open the project on Visual Studio Code. 
2. Create a file named **.env** under the **processor** folder. Copy and paste sample environmental variables from the **sample.env** in the root folder.
3. Configure your event hub connection string, event hub name, and storage endpoint. You can copy connection string for your event hub from **Connection string-primary** key under **RootManageSharedAccessKey** on the Event Hub page in the Azure portal. For detailed steps, see [Get connection string](event-hubs-quickstart-portal.md#create-an-event-hubs-namespace).
4. On your Azure CLI, navigate to the **processor** folder path. Install node packages and build the project by running the following commands:

    ```nodejs
    npm i
    npm run build
    ```
5. Receive events with your event processor host by running the following command:

    ```nodejs
    node dist/examples/singleEph.js
    ```

## Review the sample code 
Here is the sample code to receive events from an event hub using node.js. You can manually create a sampleEph.js file, and run it to receive events to an event hub. 

  ```nodejs
  const { EventProcessorHost, delay } = require("@azure/event-processor-host");

  const path = process.env.EVENTHUB_NAME;
  const storageCS = process.env.STORAGE_CONNECTION_STRING;
  const ehCS = process.env.EVENTHUB_CONNECTION_STRING;
  const storageContainerName = "test-container";
  
  async function main() {
    // Create the Event Processo Host
    const eph = EventProcessorHost.createFromConnectionString(
      EventProcessorHost.createHostName("my-host"),
      storageCS,
      storageContainerName,
      ehCS,
      {
        eventHubPath: path
      },
      onEphError: (error) => {
        console.log("This handler will notify you of any internal errors that happen " +
        "during partition and lease management: %O", error);
      }
    );
    let count = 0;
    // Message event handler
    const onMessage = async (context/*PartitionContext*/, data /*EventData*/) => {
      console.log(">>>>> Rx message from '%s': '%s'", context.partitionId, data.body);
      count++;
      // let us checkpoint every 100th message that is received across all the partitions.
      if (count % 100 === 0) {
        return await context.checkpoint();
      }
    };
    // Error event handler
    const onError = (error) => {
      console.log(">>>>> Received Error: %O", error);
    };
    // start the EPH
    await eph.start(onMessage, onError);
    // After some time let' say 2 minutes
    await delay(120000);
    // This will stop the EPH.
    await eph.stop();
  }
  
  main().catch((err) => {
    console.log(err);
  });
      
  ```

Remember to set your environment variables before running the script. You can either configure this in the command line as shown in the following example, or use the [dotenv package](https://www.npmjs.com/package/dotenv#dotenv). 

```
// For windows
set EVENTHUB_CONNECTION_STRING="<your-connection-string>"
set EVENTHUB_NAME="<your-event-hub-name>"

// For linux or macos
export EVENTHUB_CONNECTION_STRING="<your-connection-string>"
export EVENTHUB_NAME="<your-event-hub-name>"
```

You can find more samples [here](https://github.com/Azure/azure-event-hubs-node/tree/master/processor/examples).


## Next steps

Visit the following pages to learn more about Event Hubs:

* [Send events using Node.js](event-hubs-go-get-started-send.md)
* [Event Hubs samples](https://github.com/Azure/azure-event-hubs-node/tree/master/processor/examples/)
* [Capture events to Azure Storage or Data Lake Store](event-hubs-capture-overview.md)
* [Event Hubs FAQ](event-hubs-faq.md)

<!-- Links -->
[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
