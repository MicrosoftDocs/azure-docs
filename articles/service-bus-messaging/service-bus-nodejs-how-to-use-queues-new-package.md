---
title: How to use azure/service-bus queues in Node.js
description: Learn how to write a Nodejs program to send messages to and receive messages from a Service Bus queue using the new @azure/service-bus package.
services: service-bus-messaging
documentationcenter: nodejs
author: axisc
editor: spelluru

ms.assetid: a87a00f9-9aba-4c49-a0df-f900a8b67b3f
ms.service: service-bus-messaging
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: quickstart
ms.date: 01/27/2020
ms.author: aschhab

---
# Quickstart: How to use Service Bus queues with Node.js and the azure/service-bus package
In this tutorial, you learn how to write a Nodejs program to send messages to and receive messages from a Service Bus queue using the new [@azure/service-bus](https://www.npmjs.com/package/@azure/service-bus) package. This package uses the faster [AMQP 1.0 protocol](service-bus-amqp-overview.md) whereas the older [azure-sb](https://www.npmjs.com/package/azure-sb) package used [Service Bus REST run-time APIs](/rest/api/servicebus/service-bus-runtime-rest). The samples are written in JavaScript.

## Prerequisites
- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- If you don't have a queue to work with, follow steps in the [Use Azure portal to create a Service Bus queue](service-bus-quickstart-portal.md) article to create a queue. Note down the connection string for your Service Bus instance and the name of the queue you created. We'll use these values in the samples.

> [!NOTE]
> - This tutorial works with samples that you can copy and run using [Nodejs](https://nodejs.org/). For instructions on how to create a Node.js application, see [Create and deploy a Node.js application to an Azure Website](../app-service/app-service-web-get-started-nodejs.md), or [Node.js cloud service using Windows PowerShell](../cloud-services/cloud-services-nodejs-develop-deploy-app.md).
> - The new [@azure/service-bus](https://www.npmjs.com/package/@azure/service-bus) package does not support creation of queues yet. Please use the [@azure/arm-servicebus](https://www.npmjs.com/package/@azure/arm-servicebus) package if you want to programmatically create them.

### Use Node Package Manager (NPM) to install the package
To install the npm package for Service Bus, open a command prompt that has `npm` in its path, change the directory to the folder where you want to have your samples and then run this command.

```bash
npm install @azure/service-bus
```

## Send messages to a queue
Interacting with a Service Bus queue starts with instantiating the [ServiceBusClient](https://docs.microsoft.com/javascript/api/@azure/service-bus/servicebusclient) class and using it to instantiate the [QueueClient](https://docs.microsoft.com/javascript/api/%40azure/service-bus/queueclient) class. Once you have the queue client, you can create a sender and use  either [send](https://docs.microsoft.com/javascript/api/%40azure/service-bus/sender#send-sendablemessageinfo-) or [sendBatch](https://docs.microsoft.com/javascript/api/@azure/service-bus/sender#sendbatch-sendablemessageinfo---) method on it to send messages.

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. Create a file called `send.js` and paste the below code into it. This code will send 10 messages to your queue.

    ```javascript
    const { ServiceBusClient } = require("@azure/service-bus"); 
    
    // Define connection string and related Service Bus entity names here
    const connectionString = "";
    const queueName = ""; 
    
    async function main(){
      const sbClient = ServiceBusClient.createFromConnectionString(connectionString); 
      const queueClient = sbClient.createQueueClient(queueName);
      const sender = queueClient.createSender();
      
      try {
        for (let i = 0; i < 10; i++) {
          const message= {
            body: `Hello world! ${i}`,
            label: `test`,
            userProperties: {
                myCustomPropertyName: `my custom property value ${i}`
           }
          };
          console.log(`Sending message: ${message.body}`);
          await sender.send(message);
        }
        
        await queueClient.close();
      } finally {
        await sbClient.close();
      }
    }
    
    main().catch((err) => {
      console.log("Error occurred: ", err);
    });
    ```
3. Enter the connection string and name of your queue in the above code.
4. Then run the command `node send.js` in a command prompt to execute this file.

Congratulations! You just sent messages to a Service Bus queue.

Messages have some standard properties like `label` and `messageId` that you can set when sending. If you want to set any custom properties, use the `userProperties`, which is a json object that can hold key-value pairs of your custom data.

Service Bus queues support a maximum message size of 256 KB in the [Standard tier](service-bus-premium-messaging.md) and 1 MB in the [Premium tier](service-bus-premium-messaging.md). There's no limit on the number of messages held in a queue but there's a cap on the total size of the messages held by a queue. This queue size is defined at creation time, with an upper limit of 5 GB. For more information about quotas, see [Service Bus quotas](service-bus-quotas.md).

## Receive messages from a queue
Interacting with a Service Bus queue starts with instantiating the [ServiceBusClient](https://docs.microsoft.com/javascript/api/@azure/service-bus/servicebusclient) class and using it to instantiate the [QueueClient](https://docs.microsoft.com/javascript/api/%40azure/service-bus/queueclient) class. Once you have the queue client, you can create a receiver and use  either [receiveMessages](https://docs.microsoft.com/javascript/api/%40azure/service-bus/receiver#receivemessages-number--undefined---number-) or [registerMessageHandler](https://docs.microsoft.com/javascript/api/%40azure/service-bus/receiver#registermessagehandler-onmessage--onerror--messagehandleroptions-) method on it to receive messages.

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. Create a file called `recieve.js` and paste the below code into it. This code will attempt to receive 10 messages from your queue. The actual count you receive depends on the number of messages in the queue and network latency.

    ```javascript
    const { ServiceBusClient, ReceiveMode } = require("@azure/service-bus"); 
    
    // Define connection string and related Service Bus entity names here
    const connectionString = "";
    const queueName = ""; 
    
    async function main(){
      const sbClient = ServiceBusClient.createFromConnectionString(connectionString); 
      const queueClient = sbClient.createQueueClient(queueName);
      const receiver = queueClient.createReceiver(ReceiveMode.receiveAndDelete);
      try {
        const messages = await receiver.receiveMessages(10)
        console.log("Received messages:");
        console.log(messages.map(message => message.body));
         
        await queueClient.close();
      } finally {
        await sbClient.close();
      }
    }
    
    main().catch((err) => {
      console.log("Error occurred: ", err);
    });
    ```
3. Enter the connection string and name of your queue in the above code.
4. Then run the command `node receiveMessages.js` in a command prompt to execute this file.

Congratulations! You just received messages from a Service Bus queue.

The [createReceiver](https://docs.microsoft.com/javascript/api/%40azure/service-bus/queueclient#createreceiver-receivemode-) method takes in a `ReceiveMode` which is an enum with values [ReceiveAndDelete](message-transfers-locks-settlement.md#settling-receive-operations) and [PeekLock](message-transfers-locks-settlement.md#settling-receive-operations). Remember to [settle your messages](message-transfers-locks-settlement.md#settling-receive-operations) if you use the `PeekLock` mode by using any of `complete()`, `abandon()`, `defer()`, or `deadletter()` methods on the message.

> [!NOTE]
> You can manage Service Bus resources with [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/). The Service Bus Explorer allows users to connect to a Service Bus namespace and administer messaging entities in an easy manner. The tool provides advanced features like import/export functionality or the ability to test topic, queues, subscriptions, relay services, notification hubs and events hubs. 

## Next steps
To learn more, see the following resources.
- [Queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
- Checkout other [Nodejs samples for Service Bus on GitHub](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/servicebus/service-bus/samples/javascript)
- [Node.js Developer Center](https://azure.microsoft.com/develop/nodejs/)

