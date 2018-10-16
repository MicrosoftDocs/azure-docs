---
title: Send events to Azure Event Hubs using Node.js | Microsoft Docs
description: Get started sending events to Event Hubs using Node.js.
services: event-hubs
author: ShubhaVijayasarathy
manager: kamalb

ms.service: event-hubs
ms.workload: core
ms.topic: article
ms.date: 09/18/2018
ms.author: shvija

---

# Send events to Azure Event Hubs using Node.js

Azure Event Hubs is a highly scalable event management system that can handle millions of events per second, enabling applications to process and analyze massive amounts of data produced by connected devices and other systems. Once collected into an event hub, you can receive and handle events using in-process handlers or by forwarding to other analytics systems.

To learn more about Event Hubs, see the [Event Hubs overview](event-hubs-about.md).

This tutorial describes how to send events to an event hub from an application written in Node.js. To receive events using the Node.js Event Processor Host package, see [the corresponding Receive article](event-hubs-node-get-started-receive.md).

Code for this quickstart is available on [GitHub](https://github.com/Azure/azure-event-hubs-node/tree/master/client). 

## Prerequisites

To complete this tutorial, you need the following prerequisites:

- Node.js version 8.x and higher. Download the latest LTS version from [https://nodejs.org](https://nodejs.org).
- An active Azure account. If you don't have an Azure subscription, create a [free account][] before you begin.
- Visual Studio Code (recommended) or any other IDE

## Create a namespace and event hub
The first step is to use the Azure portal to create an Event Hubs namespace with an event hub. If you do not have an existing one, you can create these entities by following the instructions in [Create an Event Hubs namespace and an event hub using the Azure portal](event-hubs-create.md).

## Clone the sample Git repository
Clone the sample Git repository from [Github](https://github.com/Azure/azure-event-hubs-node) on your machine. 

## Install Node.js package
Install Node.js package for Azure Event Hubs on your machine. 

```nodejs
npm install @azure/event-hubs
```

## Clone the Git repository
Download or clone the [sample](https://github.com/Azure/azure-event-hubs-node/tree/master/client/examples) from Github. 

## Send events
The SDK you have cloned contains multiple samples that show you how to send events to an event hub using node.js. In this quickstart, you use the **simpleSender.js** example. To observe events being received, open another terminal, and receive events using the [receive sample](event-hubs-node-get-started-receive.md).

1. Open the project on Visual Studio Code. 
2. Create a file named **.env** under the **client** folder. Copy and paste sample environmental variables from the **sample.env** in the root folder.
3. Configure your event hub connection string, event hub name, and storage endpoint. You can copy connection string for your event hub from **Connection string-primary** key under **RootManageSharedAccessKey** on the Event Hub page in the Azure portal. For detailed steps, see [Get connection string](event-hubs-quickstart-portal.md#create-an-event-hubs-namespace).
4. On your Azure CLI, navigate to the **client** folder path. Install node packages and build the project by running the following commands:

    ```nodejs
    npm i
    npm run build
    ```
5. Start sending events by running the following command: 

    ```nodejs
    node dist/examples/simpleSender.js
    ```


## Review the sample code 
Here is the sample code to send events to an event hub using node.js. You can manually create a sampleSender.js file, and run it to send events to an event hub. 


```nodejs
const { EventHubClient, EventPosition } = require('@azure/event-hubs');

const client = EventHubClient.createFromConnectionString(process.env["EVENTHUB_CONNECTION_STRING"], process.env["EVENTHUB_NAME"]);

async function main() {
    // NOTE: For receiving events from Azure Stream Analytics, please send Events to an EventHub where the body is a JSON object/array.
    // const eventData = { body: { "message": "Hello World" } };
    const data = { body: "Hello World 1" };
    const delivery = await client.send(data);
    console.log("message sent successfully.");
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

## Next steps

See the following articles to learn more about Event Hubs:

* [Receive events using Node.js](event-hubs-node-get-started-receive.md)
* [Samples on GitHub](https://github.com/Azure/azure-event-hubs-node/tree/master/client/examples/)
* [Event Hubs FAQ](event-hubs-faq.md)

<!-- Links -->
[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
