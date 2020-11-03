---
title: How to use azure/service-bus queues in JavaScript
description: Learn how to write a JavaScript program that uses the latest preview version of @azure/service-bus package to send messages to and receive messages from a Service Bus queue.
author: spelluru
ms.devlang: nodejs
ms.topic: quickstart
ms.date: 10/13/2020
ms.author: spelluru
ms.custom: devx-track-js
---

# Quickstart: How to use Service Bus queues with JavaScript and the azure/service-bus package 
In this tutorial, you learn how to use the [@azure/service-bus](https://www.npmjs.com/package/@azure/service-bus) package in a JavaScript program to send messages to and receive messages from a Service Bus queue.

## Prerequisites
- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- If you don't have a queue to work with, follow steps in the [Use Azure portal to create a Service Bus queue](service-bus-quickstart-portal.md) article to create a queue. Note down the **connection string** for your Service Bus namespace and the name of the **queue** you created.

> [!NOTE]
> - This tutorial works with samples that you can copy and run using [Nodejs](https://nodejs.org/). For instructions on how to create a Node.js application, see [Create and deploy a Node.js application to an Azure Website](../app-service/quickstart-nodejs.md), or [Node.js cloud service using Windows PowerShell](../cloud-services/cloud-services-nodejs-develop-deploy-app.md).

### Use Node Package Manager (NPM) to install the package
To install the npm package for Service Bus, open a command prompt that has `npm` in its path, change the directory to the folder where you want to have your samples and then run this command.

```bash
npm install @azure/service-bus@next
```

## Send messages to a queue
The following sample code shows you how to send a message to a queue.

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. Create a file called `send.qs` and paste the below code into it. This code will send a message to your queue. The message has a label (Scientist) and body (Einstein).

    ```typescript
    const { ServiceBusClient } = require("@azure/service-bus");
    
    // connection string to your Service Bus namespace
    const connectionString = "<CONNECTION STRING TO SERVICE BUS NAMESPACE>"

    // name of the queue
    const queueName = "<QUEUE NAME>"
    
    const messages = [
    	{ body: "Albert Einstein" },
    	{ body: "Werner Heisenberg" },
    	{ body: "Marie Curie" },
    	{ body: "Steven Hawking" },
    	{ body: "Isaac Newton" },
    	{ body: "Niels Bohr" },
    	{ body: "Michael Faraday" },
    	{ body: "Galileo Galilei" },
    	{ body: "Johannes Kepler" },
    	{ body: "Nikolaus Kopernikus" }
     ];
    
     async function main() {
    	// create a Service Bus client using the connection string to the Service Bus namespace
    	const sbClient = new ServiceBusClient(connectionString);
     
    	// createSender() can also be used to create a sender for a topic.
    	const sender = sbClient.createSender(queueName);
     
    	try {
    		// Tries to send all messages in a single batch.
    		// Will fail if the messages cannot fit in a batch.
    		// await sender.sendMessages(messages);
     
    		// create a batch object
    		let batch = await sender.createBatch(); 
    		for (let i = 0; i < messages.length; i++) {
    			// for each message in the array			
    
    			// try to add the message to the batch
    			if (!batch.tryAdd(messages[i])) {			
    				// if it fails to add the message to the current batch
    				// send the current batch as it is full
    				await sender.sendMessages(batch);
    
    				// then, create a new batch 
    				batch = await sender.createBatch();
     
    				// now, add the message failed to be added to the previous batch to this batch
    				if (!batch.tryAdd(messages[i])) {
    					// if it still can't be added to the batch, the message is probably too big to fit in a batch
    					throw new Error("Message too big to fit in a batch");
    				}
    			}
    		}
    
    		// Send the last created batch of messages to the queue
    		await sender.sendMessages(batch);

            console.log(`Sent a batch of messages to the queue: ${queueName}`);

    		// Close the sender
    		await sender.close();
    	} finally {
    		await sbClient.close();
    	}
    }
    
    // call the main function
    main().catch((err) => {
    	console.log("Error occurred: ", err);
    	process.exit(1);
     });
    ```
3. Replace `<SERVICE BUS NAMESPACE CONNECTION STRING>` with the connection string to your Service Bus namespace.
1. Replace `<QUEUE NAME>` with the name of the queue. 
1. Then run the command in a command prompt to execute this file.

    ```console
    node send.js 
    ```
1. You should see the following output.

    ```console
    Sent a batch of messages to the queue: myqueue
    ```

## Receive messages from a queue

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. Create a file called `receive.ts` and paste the following code into it.

    ```typescript
    const { delay, ServiceBusClient, ServiceBusMessage } = require("@azure/service-bus");

    // connection string to your Service Bus namespace
    const connectionString = "<CONNECTION STRING TO SERVICE BUS NAMESPACE>"

    // name of the queue
    const queueName = "<QUEUE NAME>"

    async function main() {
    	// create a Service Bus client using the connection string to the Service Bus namespace
    	const sbClient = new ServiceBusClient(connectionString);
     
    	// createSender() can also be used to create a sender for a topic.
    	const receiver = sbClient.createReceiver(queueName);
    
    	// function to handle messages
    	const myMessageHandler = async (messageReceived) => {
    		console.log(`Received message: ${messageReceived.body}`);
    		await messageReceived.complete();
    	};
    
    	// function to handle any errors
    	const myErrorHandler = async (error) => {
    		console.log(error);
    	};
    
    	// subscribe and specify the message and error handlers
    	receiver.subscribe({
    		processMessage: myMessageHandler,
    		processError: myErrorHandler
    	});
    
    	// Waiting long enough before closing the sender to send messages
    	await delay(5000);
    
    	await receiver.close();	
    	await sbClient.close();
    }
    
    // call the main function
    main().catch((err) => {
    	console.log("Error occurred: ", err);
    	process.exit(1);
     });
    ```
3. Replace `<SERVICE BUS NAMESPACE CONNECTION STRING>` with the connection string to your Service Bus namespace.
1. Replace `<QUEUE NAME>` with the name of the queue. 
1. Then, run the command in a command prompt to execute this file.

    ```console
    node receive.js
    ```
1. You should see the following output.

    ```console
    Received message: Albert Einstein
    Received message: Werner Heisenberg
    Received message: Marie Curie
    Received message: Steven Hawking
    Received message: Isaac Newton
    Received message: Niels Bohr
    Received message: Michael Faraday
    Received message: Galileo Galilei
    Received message: Johannes Kepler
    Received message: Nikolaus Kopernikus
    ```

## Next steps
Check out our [GitHub repository with samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/servicebus/service-bus/samples). 