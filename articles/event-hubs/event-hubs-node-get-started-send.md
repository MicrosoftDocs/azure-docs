---
title: Send and receive events using Node.js - Azure Event Hubs | Microsoft Docs
description: This article provides a walkthrough for creating a Node.js application that sends events from Azure Event Hubs.
services: event-hubs
author: spelluru
manager: kamalb

ms.service: event-hubs
ms.workload: core
ms.topic: article
ms.custom: seodec18
ms.date: 04/15/2019
ms.author: spelluru

---

# Send events to or receive events from Azure Event Hubs using Node.js

Azure Event Hubs is a Big Data streaming platform and event ingestion service that can receive and process millions of events per second. Event Hubs can process and store events, data, or telemetry produced by distributed software and devices. Data sent to an event hub can be transformed and stored using any real-time analytics provider or batching/storage adapters. For detailed overview of Event Hubs, see [Event Hubs overview](event-hubs-about.md) and [Event Hubs features](event-hubs-features.md).

This tutorial describes how to create Node.js applications to send events to or receive events from an event hub.

> [!NOTE]
> You can download this quickstart as a sample from the [GitHub](https://github.com/Azure/azure-event-hubs-node/tree/master/client), replace `EventHubConnectionString` and `EventHubName` strings with your event hub values, and run it. Alternatively, you can follow the steps in this tutorial to create your own.

## Prerequisites

To complete this tutorial, you need the following prerequisites:

- An active Azure account. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- Node.js version 8.x and higher. Download the latest LTS version from [https://nodejs.org](https://nodejs.org).
- Visual Studio Code (recommended) or any other IDE
- **Create an Event Hubs namespace and an event hub**. The first step is to use the [Azure portal](https://portal.azure.com) to create a namespace of type Event Hubs, and obtain the management credentials your application needs to communicate with the event hub. To create a namespace and an event hub, follow the procedure in [this article](event-hubs-create.md), then continue with the following steps in this tutorial. Then, get the connection string for the event hub namespace by following instructions from the article: [Get connection string](event-hubs-get-connection-string.md#get-connection-string-from-the-portal). You use the connection string later in this tutorial.
- Clone the [sample GitHub repository](https://github.com/Azure/azure-event-hubs-node) on your machine. 


## Send events
This section shows you how to create a Node.js application that sends events to an event hub. 

### Install Node.js package
Install Node.js package for Azure Event Hubs on your machine. 

```shell
npm install @azure/event-hubs
```

If you haven't cloned the Git repository as mentioned in the prerequisite, download the [sample](https://github.com/Azure/azure-event-hubs-node/tree/master/client/examples) from GitHub. 

The SDK you have cloned contains multiple samples that show you how to send events to an event hub using node.js. In this quickstart, you use the **simpleSender.js** example. To observe events being received, open another terminal, and receive events using the [receive sample](event-hubs-node-get-started-receive.md).

1. Open the project on Visual Studio Code. 
2. Create a file named **.env** under the **client** folder. Copy and paste sample environmental variables from the **sample.env** in the root folder.
3. Configure your event hub connection string, event hub name, and storage endpoint. For instructions on getting a connection string for an event hub, [Get connection string](event-hubs-create.md#create-an-event-hubs-namespace).
4. On your Azure CLI, navigate to the **client** folder path. Install node packages and build the project by running the following commands:

    ```shell
    npm i
    npm run build
    ```
5. Start sending events by running the following command: 

    ```shell
    node dist/examples/simpleSender.js
    ```


### Review the sample code 
Review the sample code in the simpleSender.js file to send events to an event hub.

```javascript
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const dotenv = require("dotenv");
dotenv.config();
const connectionString = "EVENTHUB_CONNECTION_STRING";
const entityPath = "EVENTHUB_NAME";
const str = process.env[connectionString] || "";
const path = process.env[entityPath] || "";

async function main() {
    const client = lib_1.EventHubClient.createFromConnectionString(str, path);
    const data = {
        body: "Hello World!!"
    };
    const delivery = await client.send(data);
    console.log(">>> Sent the message successfully: ", delivery.tag.toString());
    console.log(delivery);
    console.log("Calling rhea-promise sender close directly. This should result in sender getting reconnected.");
    await Object.values(client._context.senders)[0]._sender.close();
    // await client.close();
}

main().catch((err) => {
    console.log("error: ", err);
});

```

Remember to set your environment variables before running the script. You can either configure them in the command line as shown in the following example, or use the [dotenv package](https://www.npmjs.com/package/dotenv#dotenv). 

```shell
// For windows
set EVENTHUB_CONNECTION_STRING="<your-connection-string>"
set EVENTHUB_NAME="<your-event-hub-name>"

// For linux or macos
export EVENTHUB_CONNECTION_STRING="<your-connection-string>"
export EVENTHUB_NAME="<your-event-hub-name>"
```

## Receive events
This tutorial shows how to receive events from an event hub by using Azure [EventProcessorHost](event-hubs-event-processor-host.md) in a Node.js application. The EventProcessorHost (EPH) helps you efficiently receive events from an event hub by creating receivers across all partitions in the consumer group of an event hub. It checkpoints metadata on received messages at regular intervals in an Azure Storage Blob. This approach makes it easy to continue receiving messages from where you left off at a later time.

The code for this quickstart is available on [GitHub](https://github.com/Azure/azure-event-hubs-node/tree/master/processor).

### Clone the Git repository
Download or clone the [sample](https://github.com/Azure/azure-event-hubs-node/tree/master/processor/examples/) from GitHub. 

### Install the EventProcessorHost
Install the EventProcessorHost for Event Hubs module. 

```shell
npm install @azure/event-processor-host
```

### Receive events using EventProcessorHost
The SDK you have cloned contains multiple samples that show you how to receive events from an event hub using Node.js. In this quickstart, you use the **singleEPH.js** example. To observe events being received, open another terminal, and send events using the [send sample](event-hubs-node-get-started-send.md).

1. Open the project on Visual Studio Code. 
2. Create a file named **.env** under the **processor** folder. Copy and paste sample environmental variables from the **sample.env** in the root folder.
3. Configure your event hub connection string, event hub name, and storage endpoint. You can copy connection string for your event hub from **Connection string-primary** key under **RootManageSharedAccessKey** on the Event Hub page in the Azure portal. For detailed steps, see [Get connection string](event-hubs-create.md#create-an-event-hubs-namespace).
4. On your Azure CLI, navigate to the **processor** folder path. Install node packages and build the project by running the following commands:

    ```shell
    npm i
    npm run build
    ```
5. Receive events with your event processor host by running the following command:

    ```shell
    node dist/examples/singleEph.js
    ```

### Review the sample code 
Here is the sample code to receive events from an event hub using node.js. You can manually create a sampleEph.js file, and run it to receive events to an event hub. 

  ```javascript
  const { EventProcessorHost, delay } = require("@azure/event-processor-host");

  const path = process.env.EVENTHUB_NAME;
  const storageCS = process.env.STORAGE_CONNECTION_STRING;
  const ehCS = process.env.EVENTHUB_CONNECTION_STRING;
  const storageContainerName = "test-container";
  
  async function main() {
    // Create the Event Processor Host
    const eph = EventProcessorHost.createFromConnectionString(
      EventProcessorHost.createHostName("my-host"),
      storageCS,
      storageContainerName,
      ehCS,
      {
        eventHubPath: path,
        onEphError: (error) => {
          console.log("This handler will notify you of any internal errors that happen " +
          "during partition and lease management: %O", error);
        }
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

```shell
// For windows
set EVENTHUB_CONNECTION_STRING="<your-connection-string>"
set EVENTHUB_NAME="<your-event-hub-name>"

// For linux or macos
export EVENTHUB_CONNECTION_STRING="<your-connection-string>"
export EVENTHUB_NAME="<your-event-hub-name>"
```

You can find more samples [here](https://github.com/Azure/azure-event-hubs-node/tree/master/processor/examples).


## Next steps
Read the following articles:

- [EventProcessorHost](event-hubs-event-processor-host.md)
- [Features and terminology in Azure Event Hubs](event-hubs-features.md)
- [Event Hubs FAQ](event-hubs-faq.md)
- Check out other Node.js samples for Event Hubs on [GitHub](https://github.com/Azure/azure-event-hubs-node/tree/master/client/examples/).
