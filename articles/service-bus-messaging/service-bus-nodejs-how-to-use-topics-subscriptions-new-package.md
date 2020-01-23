---
title: 'Use azure/service-bus topics and subscriptions with Node.js'
description: 'Quickstart: Learn how to use Service Bus topics and subscriptions in Azure from a Node.js app.'
services: service-bus-messaging
documentationcenter: nodejs
author: axisc
manager: timlt
editor: spelluru

ms.assetid: b9f5db85-7b6c-4cc7-bd2c-bd3087c99875
ms.service: service-bus-messaging
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: quickstart
ms.date: 01/16/2020
ms.author: aschhab

---
# Quickstart: How to use Service Bus topics and subscriptions with Node.js and the azure/service-bus package
> [!div class="op_multi_selector" title1="Programming language" title2="Node.js pacakge"]
> - [(Node.js | azure-sb)](service-bus-nodejs-how-to-use-topics-subscriptions.md)
> - [(Node.js | @azure/service-bus)](service-bus-nodejs-how-to-use-topics-subscriptions-new-package.md)

In this tutorial, you learn how to write a Node.js program to send messages to a Service Bus topic and receive messages from a Service Bus subscription using the new [@azure/service-bus](https://www.npmjs.com/package/@azure/service-bus) package. This package uses the faster [AMQP 1.0 protocol](service-bus-amqp-overview.md) whereas the older [azure-sb](https://www.npmjs.com/package/azure-sb) package used [Service Bus REST run-time APIs](/rest/api/servicebus/service-bus-runtime-rest). The samples are written in JavaScript.

## Prerequisites
- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- If you don't have a topic and subscription to work with, follow steps in the [Use Azure portal to create a Service Bus topics and subscriptions](service-bus-quickstart-topics-subscriptions-portal.md) article to create them. Note down the connection string for your Service Bus instance and the names of the topic and subscription you created. We'll use these values in the samples.

> [!NOTE]
> - This tutorial works with samples that you can copy and run using [Nodejs](https://nodejs.org/). For instructions on how to create a Node.js application, see [Create and deploy a Node.js application to an Azure Website](../app-service/app-service-web-get-started-nodejs.md), or [Node.js Cloud Service using Windows PowerShell](../cloud-services/cloud-services-nodejs-develop-deploy-app.md).
> - The new [@azure/service-bus](https://www.npmjs.com/package/@azure/service-bus) package does not support creation of topcis and subscriptions yet. Please use the [@azure/arm-servicebus](https://www.npmjs.com/package/@azure/arm-servicebus) package if you want to programmatically create them.

### Use Node Package Manager (NPM) to install the package
To install the npm package for Service Bus, open a command prompt that has `npm` in its path, change the directory to the folder where you want to have your samples and then run this command.

```bash
npm install @azure/service-bus
```

## Send messages to a topic
Interacting with a Service Bus topic starts with instantiating the [ServiceBusClient](https://docs.microsoft.com/javascript/api/@azure/service-bus/servicebusclient) class and using it to instantiate the [TopicClient](https://docs.microsoft.com/javascript/api/%40azure/service-bus/topicclient) class. Once you have the topic client, you can create a sender and use  either [send](https://docs.microsoft.com/javascript/api/%40azure/service-bus/sender#send-sendablemessageinfo-) or [sendBatch](https://docs.microsoft.com/javascript/api/@azure/service-bus/sender#sendbatch-sendablemessageinfo---) method on it to send messages.

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. Create a file called `send.js` and paste the below code into it. This code will send 10 messages to your topic.

    ```javascript
    const { ServiceBusClient } = require("@azure/service-bus"); 
    
    // Define connection string and related Service Bus entity names here
    const connectionString = "";
    const topicName = ""; 
    
    async function main(){
      const sbClient = ServiceBusClient.createFromConnectionString(connectionString); 
      const topicClient = sbClient.createTopicClient(topicName);
      const sender = topicClient.createSender();
      
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

            await topicClient.close();
          } finally {
            await sbClient.close();
          }
    }
    
    main().catch((err) => {
      console.log("Error occurred: ", err);
    });
    ```
3. Enter the connection string and name of your topic in the above code.
4. Then run the command `node send.js` in a command prompt to execute this file. 

Congratulations! You just sent messages to a Service Bus queue.

Messages have some standard properties like `label` and `messageId` that you can set when sending. If you want to set any custom properties, use the `userProperties`, which is a json object that can hold key-value pairs of your custom data.

Service Bus topics support a maximum message size of 256 KB in the [Standard tier](service-bus-premium-messaging.md) and 1 MB in the [Premium tier](service-bus-premium-messaging.md). There's no limit on the number of messages held in a topic, but there's a limit on the total size of the messages held by a topic. This topic size is defined at creation time, with an upper limit of 5 GB. For more information about quotas, see [Service Bus quotas](service-bus-quotas.md).

## Receive messages from a subscription
Interacting with a Service Bus subscription starts with instantiating the [ServiceBusClient](https://docs.microsoft.com/javascript/api/@azure/service-bus/servicebusclient) class and using it to instantiate the [SubscriptionClient](https://docs.microsoft.com/javascript/api/%40azure/service-bus/subscriptionclient) class. Once you have the subscription client, you can create a receiver and use  either [receiveMessages](https://docs.microsoft.com/javascript/api/%40azure/service-bus/receiver#receivemessages-number--undefined---number-) or [registerMessageHandler](https://docs.microsoft.com/javascript/api/%40azure/service-bus/receiver#registermessagehandler-onmessage--onerror--messagehandleroptions-) method on it to receive messages.

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. Create a file called `recieve.js` and paste the below code into it. This code will attempt to receive 10 messages from your subscription. The actual count you receive depends on the number of messages in the subscription and network latency.

    ```javascript
    const { ServiceBusClient, ReceiveMode } = require("@azure/service-bus"); 
    
    // Define connection string and related Service Bus entity names here
    const connectionString = "";
    const topicName = ""; 
    const subscriptionName = ""; 
    
    async function main(){
      const sbClient = ServiceBusClient.createFromConnectionString(connectionString); 
      const subscriptionClient = sbClient.createSubscriptionClient(topicName, subscriptionName);
      const receiver = subscriptionClient.createReceiver(ReceiveMode.receiveAndDelete);
      
      try {
        const messages = await receiver.receiveMessages(10);
        console.log("Received messages:");
        console.log(messages.map(message => message.body));
        
        await subscriptionClient.close();
      } finally {
        await sbClient.close();
      }
    }
    
    main().catch((err) => {
      console.log("Error occurred: ", err);
    });
    ```
3. Enter the connection string and names of your topic and subscription in the above code.
4. Then run the command `node receiveMessages.js` in a command prompt to execute this file.

Congratulations! You just received messages from a Service Bus subscription.

The [createReceiver](https://docs.microsoft.com/javascript/api/%40azure/service-bus/subscriptionclient#createreceiver-receivemode-) method takes in a `ReceiveMode` which is an enum with values [ReceiveAndDelete](message-transfers-locks-settlement.md#settling-receive-operations) and [PeekLock](message-transfers-locks-settlement.md#settling-receive-operations). Remember to [settle your messages](message-transfers-locks-settlement.md#settling-receive-operations) if you use the `PeekLock` mode by using any of `complete()`, `abandon()`, `defer()`, or `deadletter()` methods on the message.

## Subscription filters and actions
Service Bus supports [filters and actions on subscriptions](topic-filters.md), which allows you to filter the incoming messages to a subscription and to edit their properties.

Once you have an instance of a `SubscriptionClient` you can use the below methods on it to get, add and remove rules on the subscription to control the filters and actions.

- getRules
- addRule
- removeRule

Every subscription has a default rule that uses the true filter to allow all incoming messages. When you add a new rule, remember to remove the default filter in order for the filter in your new rule to work. If a subscription has no rules, then it will receive no messages.

> [!NOTE]
> You can manage Service Bus resources with [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer/). The Service Bus Explorer allows users to connect to a Service Bus namespace and administer messaging entities in an easy manner. The tool provides advanced features like import/export functionality or the ability to test topic, queues, subscriptions, relay services, notification hubs and events hubs. 

## Next Steps
To learn more, see the following resources.

- [Queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
- Checkout other [Nodejs samples for Service Bus on GitHub](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/servicebus/service-bus/samples/javascript)
- [Node.js Developer Center](https://azure.microsoft.com/develop/nodejs/)


