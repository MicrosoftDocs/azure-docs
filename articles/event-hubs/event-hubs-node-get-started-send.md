---
title: Send or receive events from Azure Event Hubs using JavaScript (legacy)
description: This article provides a walkthrough for creating a JavaScript application that sends/receives events to/from Azure Event Hubs using the old azure/event-hubs version 2 package. 
ms.topic: quickstart
ms.date: 06/23/2020
---

# Quickstart: Send events to or receive events from Azure Event Hubs using JavaScript (@azure/event-hubs version 2)
This quickstart shows how to create JavaScript applications to send events to and receive events from an event hub using the azure/event-hubs version 2 JavaScript package. 

> [!WARNING]
> This quickstart uses the old azure/event-hubs version 2 package. For a quickstart that uses the latest **version 5** of the package, see [Send and receive events using azure/eventhubs version 5](get-started-node-send-v2.md). To move your application from the using the old package to new one, see the [Guide to migrate from azure/eventhubs version 1 to version 5](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/eventhub/event-hubs/migrationguide.md). 


## Prerequisites

If you are new to Azure Event Hubs, see [Event Hubs overview](event-hubs-about.md) before you do this quickstart. 

To complete this quickstart, you need the following prerequisites:

- **Microsoft Azure subscription**. To use Azure services, including Azure Event Hubs, you need a subscription.  If you don't have an existing Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/) or use your MSDN subscriber benefits when you [create an account](https://azure.microsoft.com).
- Node.js version 8.x and higher. Download the latest LTS version from [https://nodejs.org](https://nodejs.org).
- Visual Studio Code (recommended) or any other IDE
- **Create an Event Hubs namespace and an event hub**. The first step is to use the [Azure portal](https://portal.azure.com) to create a namespace of type Event Hubs, and obtain the management credentials your application needs to communicate with the event hub. To create a namespace and an event hub, follow the procedure in [this article](event-hubs-create.md), then continue with the following steps in this tutorial. Then, get the connection string for the event hub namespace by following instructions from the article: [Get connection string](event-hubs-get-connection-string.md#get-connection-string-from-the-portal). You use the connection string later in this tutorial.


### Install npm package
To install the [npm package for Event Hubs](https://www.npmjs.com/package/@azure/event-hubs/v/2.1.0), open a command prompt that has `npm` in its path, change the directory
to the folder where you want to have your samples and then run this command

```shell
npm install @azure/event-hubs@2
```

To install the [npm package for Event Processor Host](https://www.npmjs.com/package/@azure/event-processor-host), run the below command instead

```shell
npm install @azure/event-processor-host
```

## Send events

This section shows you how to create a JavaScript application that sends events to an event hub. 

> [!NOTE]
> You can download this quickstart as a sample from the [GitHub](https://github.com/Azure/azure-event-hubs-node/tree/master/client), replace `EventHubConnectionString` and `EventHubName` strings with your event hub values, and run it. Alternatively, you can follow the steps in this tutorial to create your own.

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com). 
2. Create a file called `send.js` and paste the below code into it. Get the connection string for the event hub namespace by following instructions from the article: [Get connection string](event-hubs-get-connection-string.md#get-connection-string-from-the-portal). 

    ```javascript
    const { EventHubClient } = require("@azure/event-hubs@2");

    // Connection string - primary key of the Event Hubs namespace. 
    // For example: Endpoint=sb://myeventhubns.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    const connectionString = "Endpoint=sb://<EVENT HUBS NAMESPACE NAME>.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=<SHARED ACCESS KEY>";

    // Name of the event hub. For example: myeventhub
    const eventHubsName = "<EVENT HUB NAME>";

    async function main() {
      const client = EventHubClient.createFromConnectionString(connectionString, eventHubsName);

      for (let i = 0; i < 100; i++) {
        const eventData = {body: `Event ${i}`};
        console.log(`Sending message: ${eventData.body}`);
        await client.send(eventData);
      }

      await client.close();
    }

    main().catch(err => {
      console.log("Error occurred: ", err);
    });
    ```
3. Enter the connection string and the name of your Event Hub in the above code
4. Then run the command `node send.js` in a command prompt to execute this file. This will send 100 events to your Event Hub

Congratulations! You have now sent events to an event hub.


## Receive events

This section shows you how to create a JavaScript application that receives events from a single partition
of the default consumer group in an event hub. 

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com). 
2. Create a file called `receive.js` and paste the below code into it.
    ```javascript
    const { EventHubClient, delay } = require("@azure/event-hubs@2");

    // Connection string - primary key of the Event Hubs namespace. 
    // For example: Endpoint=sb://myeventhubns.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    const connectionString = "Endpoint=sb://<EVENT HUBS NAMESPACE NAME>.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=<SHARED ACCESS KEY>";

    // Name of the event hub. For example: myeventhub
    const eventHubsName = "<EVENT HUB NAME>";

    async function main() {
      const client = EventHubClient.createFromConnectionString(connectionString, eventHubsName);
      const allPartitionIds = await client.getPartitionIds();
      const firstPartitionId = allPartitionIds[0];

      const receiveHandler = client.receive(firstPartitionId, eventData => {
        console.log(`Received message: ${eventData.body} from partition ${firstPartitionId}`);
      }, error => {
        console.log('Error when receiving message: ', error)
      });

      // Sleep for a while before stopping the receive operation.
      await delay(15000);
      await receiveHandler.stop();

      await client.close();
    }

    main().catch(err => {
      console.log("Error occurred: ", err);
    });
    ```
3. Enter the connection string and the name of your Event Hub in the above code.
4. Then run the command `node receive.js` in a command prompt to execute this file. This will receive events from one of the partitions of the default consumer group in your Event Hub

Congratulations! You have now received events from event hub.

## Receive events using Event Processor Host

This section shows how to receive events from an event hub by using Azure [EventProcessorHost](event-hubs-event-processor-host.md) in a JavaScript application. The EventProcessorHost (EPH) helps you efficiently receive events from an event hub by creating receivers across all partitions in the consumer group of an event hub. It checkpoints metadata on received messages at regular intervals in an Azure Storage Blob. This approach makes it easy to continue receiving messages from where you left off at a later time.

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com). 
2. Create a file called `receiveAll.js` and paste the below code into it.
    ```javascript
    const { EventProcessorHost, delay } = require("@azure/event-processor-host");

    // Connection string - primary key of the Event Hubs namespace. 
    // For example: Endpoint=sb://myeventhubns.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    const eventHubConnectionString = "Endpoint=sb://<EVENT HUBS NAMESPACE NAME>.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=<SHARED ACCESS KEY>";

    // Name of the event hub. For example: myeventhub
    const eventHubName = "<EVENT HUB NAME>";

    // Azure Storage connection string
    const storageConnectionString = "DefaultEndpointsProtocol=https;AccountName=<STORAGE ACCOUNT NAME>;AccountKey=<STORAGE ACCOUNT KEY>;EndpointSuffix=core.windows.net";

    async function main() {
      const eph = EventProcessorHost.createFromConnectionString(
        "my-eph",
        storageConnectionString,
        "my-storage-container-name",
        eventHubConnectionString,
        {
          eventHubPath: eventHubName,
          onEphError: (error) => {
            console.log("[%s] Error: %O", error);
          }
        }
      );


      eph.start((context, eventData) => {
        console.log(`Received message: ${eventData.body} from partition ${context.partitionId}`);
      }, error => {
        console.log('Error when receiving message: ', error)
      });

      // Sleep for a while before stopping the receive operation.
      await delay(15000);
      await eph.stop();
    }

    main().catch(err => {
      console.log("Error occurred: ", err);
    });

    ```
3. Enter the connection string and the name of your Event Hub in the above code along with connection string for an Azure Blob Storage
4. Then run the command `node receiveAll.js` in a command prompt to execute this file.

Congratulations! You have now received events from event hub using Event Processor Host. This will receive events from all the partitions of the default consumer group in your Event Hub

## Next steps
Read the following articles:

- [EventProcessorHost](event-hubs-event-processor-host.md)
- [Features and terminology in Azure Event Hubs](event-hubs-features.md)
- [Event Hubs FAQ](event-hubs-faq.md)
- Check out other JavaScript samples for [Event Hubs](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/eventhub/event-hubs/samples) and [Event Processor Host](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/eventhub/event-processor-host/samples) on GitHub
