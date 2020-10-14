---
title: Use preview JavaScript azure/service-bus with topics and subscriptions
description: Learn how to write a JavaScript program that uses the latest preview version of @azure/service-bus package to send messages to a Service Bus topic and receive messages from a subscription to the topic.
author: spelluru
ms.devlang: nodejs
ms.topic: quickstart
ms.date: 10/13/2020
ms.author: spelluru
ms.custom: devx-track-js
---

# Quickstart: Service Bus topics and subscriptions with Node.js and the preview azure/service-bus package
In this tutorial, you learn how to use the [@azure/service-bus](https://www.npmjs.com/package/@azure/service-bus) package in a JavaScript program to send messages to and receive messages from a Service Bus queue.

## Prerequisites
- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- If you don't have a topic and subscription to work with, follow steps in the [Use Azure portal to create a Service Bus topics and subscriptions](service-bus-quickstart-topics-subscriptions-portal.md) article to create them. Note down the connection string for your Service Bus instance and the names of the topic and subscription you created. We'll use these values in the samples.

> [!NOTE]
> - This tutorial works with samples that you can copy and run using [Nodejs](https://nodejs.org/). For instructions on how to create a Node.js application, see [Create and deploy a Node.js application to an Azure Website](../app-service/quickstart-nodejs.md), or [Node.js Cloud Service using Windows PowerShell](../cloud-services/cloud-services-nodejs-develop-deploy-app.md).
> - The new [@azure/service-bus](https://www.npmjs.com/package/@azure/service-bus) package does not support creation of topcis and subscriptions yet. Please use the [@azure/arm-servicebus](https://www.npmjs.com/package/@azure/arm-servicebus) package if you want to programmatically create them.

### Use Node Package Manager (NPM) to install the package
To install the npm package for Service Bus, open a command prompt that has `npm` in its path, change the directory to the folder where you want to have your samples and then run this command.

```bash
npm install @azure/service-bus
```

## Send messages to a topic
The following sample code shows you how to send a batch of messages to a queue. See code comments for details. 

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. Create a file called `sendtotopic.ts` and paste the below code into it. This code will send a message to your topic.

    ```javascript
    import { ServiceBusClient, ServiceBusMessage } from "@azure/service-bus";
    
    // connection string to the Service Bus namespace
    const connectionString = "<CONNECTION STRING TO SERVICE BUS NAMESPACE>"
    
    // name of the topic
    const topicName = "<TOPIC NAME>"
    
    export async function main() {
    	// create a Service Bus client using the connection string to the namespace
    	const sbClient = new ServiceBusClient(connectionString);
    
    	// createSender() to create a sender for a topic.
    	const sender = sbClient.createSender(topicName)
    
    	// prepare a message with a label (Scientist) and body (Einstein)
    	const message: ServiceBusMessage = {
    		body: `Einstein`,
    		label: "Scientist"
    	};
    
    	// print the message to the console
    	console.log(`Sending message: ${message.body} - ${message.label}`);
    
    	// send the message to the topic
    	await sender.sendMessages(message);
    
    	// close the sender
    	await sender.close();	
    
    	// close the Service Bus client
    	await sbClient.close();
    }
    
    // call the main function
    main().catch((err) => {
      console.log("Error occurred: ", err);
    });
    ```
3. Replace `<SERVICE BUS NAMESPACE CONNECTION STRING>` with the connection string to your Service Bus namespace.
1. Replace `<TOPIC NAME>` with the name of the topic. 
1. Compile the TypeScript file to generate a JavaScript file. 

    ```console
    tsc sendtotopic.ts
    ```
1. Then run the command in a command prompt to execute this file.

    ```console
    node sendtotopic.js 
    ```
1. You should see the following output.

    ```console
    Sending message: Einstein - Scientist
    ```

## Receive messages from a subscription
1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. Create a file called **receivefromsubscription.ts** and paste the following code into it. See code comments for details. 

    ```typescript
    import { delay, ServiceBusClient, ServiceBusMessage } from "@azure/service-bus";
    
    // connection string to the Service Bus namespace
    const connectionString = "<CONNECTION STRING TO SERVICE BUS NAMESPACE>"
    
    // name of the topic
    const topicName = "<TOPIC NAME>"
    
    // name of the subscription to the topic
    const subName = "<SUBSCRIPTION NAME>"
    
    export async function main() {
        // create a ServiceBusClient using the connection string to the namespace
        const sbClient = new ServiceBusClient(connectionString);
    
        // create a receiver for the subscription to the topic
        const receiver = sbClient.createReceiver(topicName, subName);
    
        // create a handler to handle messages received from the subscription
        const myMessageHandler = async (messageReceived) => {
            console.log(`Received message: ${messageReceived.body}`);
            await messageReceived.complete();
        };
    
        // create a handler to handle any error messages while receiving messages from the subscription
        const myErrorHandler = async (error) => {
            console.log(error);
        };
    
        // subscribe for messages specifying the message handler and error handler
        receiver.subscribe({
            processMessage: myMessageHandler,
            processError: myErrorHandler
        });
    
        // waiting long enough to receive the message
        await delay(5000);
    
        // close the receiver
        await receiver.close();	
    
        // close the Service Bus client
        await sbClient.close();
    }
    
    main().catch((err) => {
      console.log("Error occurred: ", err);
    });
    ```
3. Replace `<CONNECTION STRING TO SERVICE BUS NAMESPACE>` with the connection string to the namespace. 
1. Replace `<TOPIC NAME>` with the name of the topic. 
1. Replace `<SUBSCRIPTION NAME>` with the name of the subscription to the topic. 
1. Compile the TypeScript file to generate a JavaScript file. 

    ```console
    tsc receivefromsubscription.ts
    ```
1. Then run the command in a command prompt to execute this file.

    ```console
    node receivefromsubscription.js
    ```
1. You should see the following output.

    ```console
    Received message: Einstein
    ```

## Next steps
Check out our [GitHub repository with samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/servicebus/service-bus/samples). 