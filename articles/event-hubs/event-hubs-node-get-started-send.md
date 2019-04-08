---
title: Send events using Node.js - Azure Event Hubs | Microsoft Docs
description: This article provides a walkthrough for creating a Node.js application that sends events from Azure Event Hubs.
services: event-hubs
author: spelluru
manager: kamalb

ms.service: event-hubs
ms.workload: core
ms.topic: article
ms.custom: seodec18
ms.date: 02/19/2019
ms.author: spelluru

---

# Send events to Azure Event Hubs using Node.js

Azure Event Hubs is a Big Data streaming platform and event ingestion service that can receive and process millions of events per second. Event Hubs can process and store events, data, or telemetry produced by distributed software and devices. Data sent to an event hub can be transformed and stored using any real-time analytics provider or batching/storage adapters. For detailed overview of Event Hubs, see [Event Hubs overview](event-hubs-about.md) and [Event Hubs features](event-hubs-features.md).

This tutorial describes how to send events to an event hub from an application written in Node.js.

> [!NOTE]
> You can download this quickstart as a sample from the [GitHub](https://github.com/Azure/azure-event-hubs-node/tree/master/client), replace `EventHubConnectionString` and `EventHubName` strings with your event hub values, and run it. Alternatively, you can follow the steps in this tutorial to create your own.

## Prerequisites

To complete this tutorial, you need the following prerequisites:

- Node.js version 8.x and higher. Download the latest LTS version from [https://nodejs.org](https://nodejs.org).
- Visual Studio Code (recommended) or any other IDE

## Create an Event Hubs namespace and an event hub
The first step is to use the [Azure portal](https://portal.azure.com) to create a namespace of type Event Hubs, and obtain the management credentials your application needs to communicate with the event hub. To create a namespace and an event hub, follow the procedure in [this article](event-hubs-create.md), then continue with the following steps in this tutorial.

Get the connection string for the event hub namespace by following instructions from the article: [Get connection string](event-hubs-get-connection-string.md#get-connection-string-from-the-portal). You use the connection string later in this tutorial.

## Clone the sample Git repository
Clone the sample Git repository from [GitHub](https://github.com/Azure/azure-event-hubs-node) on your machine. 

## Install Node.js package
Install Node.js package for Azure Event Hubs on your machine. 

```shell
npm install @azure/event-hubs
```

## Clone the Git repository
Download or clone the [sample](https://github.com/Azure/azure-event-hubs-node/tree/master/client/examples) from GitHub. 

## Send events
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


## Review the sample code 
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

## Next steps
In this quickstart, you have sent messages to an event hub using Node.js. To learn how to receive events from an event hub using Node.js, see [Receive events from event hub - Node.js](event-hubs-node-get-started-receive.md)

Check out other Node.js samples for Event Hubs on [GitHub](https://github.com/Azure/azure-event-hubs-node/tree/master/client/examples/).
