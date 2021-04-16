---
title: How to use azure/service-bus queues in JavaScript
description: Learn how to write a JavaScript program that uses the latest version of @azure/service-bus package to send messages to and receive messages from a Service Bus queue.
author: spelluru
ms.author: spelluru
ms.date: 11/09/2020
ms.topic: quickstart
ms.devlang: nodejs
ms.custom:
  - devx-track-js
  - mode-api
---

# Send messages to and receive messages from Azure Service Bus queues (JavaScript)
In this tutorial, you learn how to use the [@azure/service-bus](https://www.npmjs.com/package/@azure/service-bus) package in a JavaScript program to send messages to and receive messages from a Service Bus queue.

## Prerequisites
- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- If you don't have a queue to work with, follow steps in the [Use Azure portal to create a Service Bus queue](service-bus-quickstart-portal.md) article to create a queue. Note down the **connection string** for your Service Bus namespace and the name of the **queue** you created.

> [!NOTE]
> - This tutorial works with samples that you can copy and run using [Nodejs](https://nodejs.org/). For instructions on how to create a Node.js application, see [Create and deploy a Node.js application to an Azure Website](../app-service/quickstart-nodejs.md), or [Node.js cloud service using Windows PowerShell](../cloud-services/cloud-services-nodejs-develop-deploy-app.md).

### Use Node Package Manager (NPM) to install the package
To install the npm package for Service Bus, open a command prompt that has `npm` in its path, change the directory to the folder where you want to have your samples and then run this command.

```bash
npm install @azure/service-bus
```

## Send messages to a queue
The following sample code shows you how to send a message to a queue.

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/).
2. Create a file called `send.js` and paste the below code into it. This code will send a message to your queue. The message has a label (Scientist) and body (Einstein).

    ```javascript
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
    		let batch = await sender.createMessageBatch(); 
    		for (let i = 0; i < messages.length; i++) {
    			// for each message in the array			
    
    			// try to add the message to the batch
    			if (!batch.tryAddMessage(messages[i])) {			
    				// if it fails to add the message to the current batch
    				// send the current batch as it is full
    				await sender.sendMessages(batch);
    
    				// then, create a new batch 
    				batch = await sender.createMessageBatch();
     
    				// now, add the message failed to be added to the previous batch to this batch
    				if (!batch.tryAddMessage(messages[i])) {
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
3. Replace `<CONNECTION STRING TO SERVICE BUS NAMESPACE>` with the connection string to your Service Bus namespace.
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
2. Create a file called `receive.js` and paste the following code into it.

    ```javascript
    const { delay, ServiceBusClient, ServiceBusMessage } = require("@azure/service-bus");

    // connection string to your Service Bus namespace
    const connectionString = "<CONNECTION STRING TO SERVICE BUS NAMESPACE>"

    // name of the queue
    const queueName = "<QUEUE NAME>"

     async function main() {
    	// create a Service Bus client using the connection string to the Service Bus namespace
    	const sbClient = new ServiceBusClient(connectionString);
     
    	// createReceiver() can also be used to create a receiver for a subscription.
    	const receiver = sbClient.createReceiver(queueName);
    
    	// function to handle messages
    	const myMessageHandler = async (messageReceived) => {
    		console.log(`Received message: ${messageReceived.body}`);
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
3. Replace `<CONNECTION STRING TO SERVICE BUS NAMESPACE>` with the connection string to your Service Bus namespace.
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

On the **Overview** page for the Service Bus namespace in the Azure portal, you can see **incoming** and **outgoing** message count. You may need to wait for a minute or so and then refresh the page to see the latest values. 

:::image type="content" source="./media/service-bus-java-how-to-use-queues/overview-incoming-outgoing-messages.png" alt-text="Incoming and outgoing message count":::

Select the queue on this **Overview** page to navigate to the **Service Bus Queue** page. You see the **incoming** and **outgoing** message count on this page too. You also see other information such as the **current size** of the queue, **maximum size**, **active message count**, and so on. 

:::image type="content" source="./media/service-bus-java-how-to-use-queues/queue-details.png" alt-text="Queue details":::
## Next steps
See the following documentation and samples: 

- [Azure Service Bus client library for JavaScript](https://www.npmjs.com/package/@azure/service-bus)
- [JavaScript samples](/samples/azure/azure-sdk-for-js/service-bus-javascript/)
- [TypeScript samples](/samples/azure/azure-sdk-for-js/service-bus-typescript/)
- [API reference documentation](/javascript/api/overview/azure/service-bus)
