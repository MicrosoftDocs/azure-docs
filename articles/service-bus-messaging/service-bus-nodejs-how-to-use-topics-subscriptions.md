---
title: Use preview JavaScript azure/service-bus with topics and subscriptions
description: Learn how to write a JavaScript program that uses the latest preview version of @azure/service-bus package to send messages to a Service Bus topic and receive messages from a subscription to the topic.
author: spelluru
ms.author: spelluru
ms.date: 11/09/2020
ms.topic: quickstart
ms.devlang: nodejs
ms.custom:
  - devx-track-js
  - mode-api
---

# Quickstart: Service Bus topics and subscriptions with Node.js and the preview azure/service-bus package
In this tutorial, you learn how to use the [@azure/service-bus](https://www.npmjs.com/package/@azure/service-bus) package in a JavaScript program to send messages to a Service Bus topic and receive messages from a Service Bus subscription to that topic.

## Prerequisites
- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- Follow steps in the [Quickstart: Use the Azure portal to create a Service Bus topic and subscriptions to the topic](service-bus-quickstart-topics-subscriptions-portal.md). Note down the connection string, topic name, and a subscription name. You will use only one subscription for this quickstart. 

> [!NOTE]
> - This tutorial works with samples that you can copy and run using [Nodejs](https://nodejs.org/). For instructions on how to create a Node.js application, see [Create and deploy a Node.js application to an Azure Website](../app-service/quickstart-nodejs.md), or [Node.js Cloud Service using Windows PowerShell](../cloud-services/cloud-services-nodejs-develop-deploy-app.md).

### Use Node Package Manager (NPM) to install the package
To install the npm package for Service Bus, open a command prompt that has `npm` in its path, change the directory to the folder where you want to have your samples and then run this command.

```bash
npm install @azure/service-bus
```

## Send messages to a topic
The following sample code shows you how to send a batch of messages to a Service Bus topic. See code comments for details. 

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. Create a file called `sendtotopic.js` and paste the below code into it. This code will send a message to your topic.

    ```javascript
    const { ServiceBusClient } = require("@azure/service-bus");
    
    const connectionString = "<SERVICE BUS NAMESPACE CONNECTION STRING>"
    const topicName = "<TOPIC NAME>";
    
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
     
    	// createSender() can also be used to create a sender for a queue.
    	const sender = sbClient.createSender(topicName);
     
    	try {
    		// Tries to send all messages in a single batch.
    		// Will fail if the messages cannot fit in a batch.
    		// await sender.sendMessages(messages);
     
    		// create a batch object
    		let batch = await sender.createMessageBatch(); 
    		for (let i = 0; i < messages.length; i++) {
    			// for each message in the arry			
    
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
    
    		// Send the last created batch of messages to the topic
    		await sender.sendMessages(batch);
     
    		console.log(`Sent a batch of messages to the topic: ${topicName}`);
    				
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
1. Replace `<TOPIC NAME>` with the name of the topic. 
1. Then run the command in a command prompt to execute this file.

    ```console
    node sendtotopic.js 
    ```
1. You should see the following output.

    ```console
    Sent a batch of messages to the topic: mytopic
    ```

## Receive messages from a subscription
1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. Create a file called **receivefromsubscription.js** and paste the following code into it. See code comments for details. 

    ```javascript
    const { delay, ServiceBusClient, ServiceBusMessage } = require("@azure/service-bus");
    
    const connectionString = "<SERVICE BUS NAMESPACE CONNECTION STRING>"
    const topicName = "<TOPIC NAME>";
    const subscriptionName = "<SUBSCRIPTION NAME>";
    
     async function main() {
    	// create a Service Bus client using the connection string to the Service Bus namespace
    	const sbClient = new ServiceBusClient(connectionString);
     
    	// createReceiver() can also be used to create a receiver for a queue.
    	const receiver = sbClient.createReceiver(topicName, subscriptionName);
    
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
3. Replace `<SERVICE BUS NAMESPACE CONNECTION STRING>` with the connection string to the namespace. 
1. Replace `<TOPIC NAME>` with the name of the topic. 
1. Replace `<SUBSCRIPTION NAME>` with the name of the subscription to the topic. 
1. Then run the command in a command prompt to execute this file.

    ```console
    node receivefromsubscription.js
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

In the Azure portal, navigate to your Service Bus namespace, and select the topic in the bottom pane to see the **Service Bus Topic** page for your topic. On this page, you should see three incoming and three outgoing messages in the **Messages** chart. 

:::image type="content" source="./media/service-bus-java-how-to-use-topics-subscriptions/topic-page-portal.png" alt-text="Incoming and outgoing messages":::

If you run the only the send app next time, on the **Service Bus Topic** page, you see six incoming messages (3 new) but three outgoing messages. 

:::image type="content" source="./media/service-bus-java-how-to-use-topics-subscriptions/updated-topic-page.png" alt-text="Updated topic page":::

On this page, if you select a subscription, you get to the **Service Bus Subscription** page. You can see the active message count, dead-letter message count, and more on this page. In this example, there are three active messages that haven't been received by a receiver yet. 

:::image type="content" source="./media/service-bus-java-how-to-use-topics-subscriptions/active-message-count.png" alt-text="Active message count":::

## Next steps
See the following documentation and samples: 

- [Azure Service Bus client library for Python](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/servicebus/service-bus/README.md)
- [Samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/servicebus/service-bus/samples). The **javascript** folder has JavaScript samples and the **typescript** has TypeScript samples. 
- [azure-servicebus reference documentation](/javascript/api/overview/azure/service-bus)
