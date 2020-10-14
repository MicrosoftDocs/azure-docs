---
title: How to use azure/service-bus queues in JavaScript (Preview)
description: Learn how to write a JavaScript program that uses the latest preview version of @azure/service-bus package to send messages to and receive messages from a Service Bus queue.
author: spelluru
ms.devlang: nodejs
ms.topic: quickstart
ms.date: 10/13/2020
ms.author: spelluru
ms.custom: devx-track-js
---

# Quickstart: How to use Service Bus queues with JavaScript and the azure/service-bus (preview) package 
In this tutorial, you learn how to write a JavaScript program to send messages to and receive messages from a Service Bus queue. This quickstart uses the latest preview version of [@azure/service-bus](https://www.npmjs.com/package/@azure/service-bus) package. To see a list of all versions of the package, see the **Versions** tab. For a quickstart that uses the latest generally available version (1.1.10) of this package, see [Send and receive messages using the azure/service-bus package](service-bus-nodejs-how-to-use-queues-new-package-legacy.md) 

## Prerequisites
- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- If you don't have a queue to work with, follow steps in the [Use Azure portal to create a Service Bus queue](service-bus-quickstart-portal.md) article to create a queue. Note down the connection string for your Service Bus instance and the name of the queue you created. We'll use these values in the samples.

> [!NOTE]
> - This tutorial works with samples that you can copy and run using [Nodejs](https://nodejs.org/). For instructions on how to create a Node.js application, see [Create and deploy a Node.js application to an Azure Website](../app-service/quickstart-nodejs.md), or [Node.js cloud service using Windows PowerShell](../cloud-services/cloud-services-nodejs-develop-deploy-app.md).

### Use Node Package Manager (NPM) to install the package
To install the npm package for Service Bus, open a command prompt that has `npm` in its path, change the directory to the folder where you want to have your samples and then run this command.

```bash
npm install @azure/service-bus@next
```

## Send messages to a queue
The following sample code shows you how to send a message to a queue. The main steps are:

1. Creates a `ServiceBusClient` using the connection string to the Service Bus namespace.
1. Gets a sender object that can be used to send messages to the specified queue. 
1. Prepares a message of type `ServiceBusMessage`. 
1. Uses the sender object to send the message to the queue. 

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. Create a file called `send.ts` and paste the below code into it. This code will send a message to your queue. The message has a label (Scientist) and body (Einstein).

    ```typescript
    import { ServiceBusClient, ServiceBusMessage } from "@azure/service-bus";
    
    // connection string to your Service Bus namespace
    const connectionString = "<SERVICE BUS NAMESPACE CONNECTION STRING>"

    // name of the queue
    const queueName = "<QUEUE NAME>"
    
    export async function main() {
        
        // create Service Bus client using the Service Bus namespace
        const sbClient = new ServiceBusClient(connectionString);
    
        // create a sender for the queue to send messages to the queue
        const sender = sbClient.createSender(queueName);
    
        // prepare a message to send to the queue
        const message: ServiceBusMessage = {
            body: `Einstein`,
            label: "Scientist"
        };
    
        // send the message to the queue
        console.log(`Sending message: ${message.body} - ${message.label}`);
        await sender.sendMessages(message);

        // dispose sender    
        await sender.close();	
   
        // dispose Service Bus client
        await sbClient.close();    
    }
    
    main().catch((err) => {
      console.log("Error occurred: ", err);
    });
    ```
3. Replace `<SERVICE BUS NAMESPACE CONNECTION STRING>` with the connection string to your Service Bus namespace.
1. Replace `<QUEUE NAME>` with the name of the queue. 
1. Compile the TypeScript file to generate a JavaScript file. 

    ```console
    tsc send.ts
    ```
1. Then run the command in a command prompt to execute this file.

    ```console
    node send.js 
    ```
1. You should see the following output.

    ```console
    Sending message: Einstein - Scientist
    ```

## Receive messages from a queue

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. Create a file called `receive.ts` and paste the following code into it.

    ```typescript
    import { delay, ServiceBusClient, ServiceBusMessage } from "@azure/service-bus";
    
    // connection string to your Service Bus namespace
    const connectionString = "<SERVICE BUS NAMESPACE CONNECTION STRING>"

    // name of the queue
    const queueName = "<QUEUE NAME>"
        
    export async function main() {
        // create a Service Bus client using the connection string to the Service Bus namespace
        const sbClient = new ServiceBusClient(connectionString);  
   
        // create a receiver for your queue
        const receiver = sbClient.createReceiver(queueName);
    
        // create a handler to handle the received message
        const myMessageHandler = async (messageReceived) => {
            console.log(`Received message: ${messageReceived.body}`);
            await messageReceived.complete();
        };
        
        // create a handler to handle any error messages
        const myErrorHandler = async (error) => {
            console.log(error);
        };
    
        // subscribe for messages using the handlers
        receiver.subscribe({
            processMessage: myMessageHandler,
            processError: myErrorHandler
        });
    
        // Waiting long enough before closing the sender to send messages
        await delay(5000);
    
        await receiver.close();	
        await sbClient.close();    
    }
    ```
3. Enter the connection string and name of your queue in the above code.
1. Compile the TypeScript file to generate a JavaScript file. 

    ```console
    tsc receive.ts
    ```
1. Then run the command in a command prompt to execute this file.

    ```console
    node receive.js
    ```
1. You should see the following output.

    ```console
    Received message: Einstein
    ```

## Next steps
Check out our [GitHub repository with samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/servicebus/service-bus/samples). 