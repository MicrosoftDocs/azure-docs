---
title: Get started with Azure Service Bus queues (JavaScript)
description: This tutorial shows you how to send messages to and receive messages from Azure Service Bus queues using the JavaScript programming language.
author: spelluru
ms.author: spelluru
ms.date: 11/17/2022
ms.topic: quickstart
ms.devlang: javascript
ms.custom: devx-track-js, mode-api
---

# Send messages to and receive messages from Azure Service Bus queues (JavaScript)
> [!div class="op_single_selector" title1="Select the programming language:"]
> * [C#](service-bus-dotnet-get-started-with-queues.md)
> * [Java](service-bus-java-how-to-use-queues.md)
> * [JavaScript](service-bus-nodejs-how-to-use-queues.md)
> * [Python](service-bus-python-how-to-use-queues.md)

In this tutorial, you complete the following steps:

1. Create a Service Bus namespace, using the Azure portal.
2. Create a Service Bus queue, using the Azure portal.
3. Write a JavaScript application to use the [@azure/service-bus](https://www.npmjs.com/package/@azure/service-bus) package to:
    1. Send a set of messages to the queue.
    1. Receive those messages from the queue.

> [!NOTE]
> This quick start provides step-by-step instructions for a simple scenario of sending messages to a Service Bus queue and receiving them. You can find pre-built JavaScript and TypeScript samples for Azure Service Bus in the [Azure SDK for JavaScript repository on GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/servicebus/service-bus/samples/v7).

## Prerequisites

If you're new to the service, see [Service Bus overview](service-bus-messaging-overview.md) before you do this quickstart.

- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- [Node.js LTS](https://nodejs.org/en/download/)

### [Passwordless](#tab/passwordless)

To use this quickstart with your own Azure account, you need:
* Install [Azure CLI](/cli/azure/install-azure-cli), which provides the passwordless authentication to your developer machine.
* Sign in with your Azure account at the terminal or command prompt with `az login`.
* Use the same account when you add the appropriate data role to your resource.
* Run the code in the same terminal or command prompt.
* Note down your **queue** name for your Service Bus namespace. You'll need that in the code.

### [Connection string](#tab/connection-string)

Note down the following, which you'll use in the code below:
* Service Bus namespace **connection string**
* Service Bus namespace **queue** you created

---

> [!NOTE]
> This tutorial works with samples that you can copy and run using [Nodejs](https://nodejs.org/). For instructions on how to create a Node.js application, see [Create and deploy a Node.js application to an Azure Website](../app-service/quickstart-nodejs.md), or [Node.js cloud service using Windows PowerShell](../cloud-services/cloud-services-nodejs-develop-deploy-app.md).

[!INCLUDE [service-bus-create-namespace-portal](./includes/service-bus-create-namespace-portal.md)]

[!INCLUDE [service-bus-create-queue-portal](./includes/service-bus-create-queue-portal.md)]

[!INCLUDE [service-bus-passwordless-template-tabbed](../../includes/passwordless/service-bus/service-bus-passwordless-template-tabbed.md)]


## Use Node Package Manager (NPM) to install the package

### [Passwordless](#tab/passwordless)

1. To install the required npm package(s) for Service Bus, open a command prompt that has `npm` in its path, change the directory to the folder where you want to have your samples and then run this command.

1. Install the following packages:

    ```bash
    npm install @azure/service-bus @azure/identity
    ```

### [Connection string](#tab/connection-string)

1. To install the required npm package(s) for Service Bus, open a command prompt that has `npm` in its path, change the directory to the folder where you want to have your samples and then run this command.

1. Install the following package:

    ```bash
    npm install @azure/service-bus
    ```

---

## Send messages to a queue

The following sample code shows you how to send a message to a queue.

### [Passwordless](#tab/passwordless)

You must have signed in with the Azure CLI's `az login` in order for your local machine to provide the passwordless authentication required in this code.

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/).
1. Create a file called `send.js` and paste the below code into it. This code sends the names of scientists as messages to your queue.

    The passwordless credential is provided with the [**DefaultAzureCredential**](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity#defaultazurecredential).

    ```javascript
    const { ServiceBusClient } = require("@azure/service-bus");
    const { DefaultAzureCredential } = require("@azure/identity");

    // Replace `<SERVICE-BUS-NAMESPACE>` with your namespace
    const fullyQualifiedNamespace = "<SERVICE-BUS-NAMESPACE>.servicebus.windows.net";

    // Passwordless credential
    const credential = new DefaultAzureCredential();

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
        // create a Service Bus client using the passwordless authentication to the Service Bus namespace
        const sbClient = new ServiceBusClient(fullyQualifiedNamespace, credential);

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

3. Replace `<SERVICE-BUS-NAMESPACE>` with your Service Bus namespace.
4. Replace `<QUEUE NAME>` with the name of the queue.
5. Then run the command in a command prompt to execute this file.

    ```console
    node send.js
    ```
6. You should see the following output.

    ```console
    Sent a batch of messages to the queue: myqueue
    ```

### [Connection string](#tab/connection-string)

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/).
1. Create a file called `send.js` and paste the below code into it. This code sends the names of scientists as messages to your queue.

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
4. Replace `<QUEUE NAME>` with the name of the queue.
5. Then run the command in a command prompt to execute this file.

    ```console
    node send.js
    ```
6. You should see the following output.

    ```console
    Sent a batch of messages to the queue: myqueue
    ```

---

## Receive messages from a queue

### [Passwordless](#tab/passwordless)

You must have signed in with the Azure CLI's `az login` in order for your local machine to provide the passwordless authentication required in this code.

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. Create a file called `receive.js` and paste the following code into it.

    ```javascript
    const { delay, ServiceBusClient, ServiceBusMessage } = require("@azure/service-bus");
    const { DefaultAzureCredential } = require("@azure/identity");

    // Replace `<SERVICE-BUS-NAMESPACE>` with your namespace
    const fullyQualifiedNamespace = "<SERVICE-BUS-NAMESPACE>.servicebus.windows.net";

    // Passwordless credential
    const credential = new DefaultAzureCredential();

    // name of the queue
    const queueName = "<QUEUE NAME>"

     async function main() {
        // create a Service Bus client using the passwordless authentication to the Service Bus namespace
        const sbClient = new ServiceBusClient(fullyQualifiedNamespace, credential);

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
        await delay(20000);

        await receiver.close();
        await sbClient.close();
    }
    // call the main function
    main().catch((err) => {
        console.log("Error occurred: ", err);
        process.exit(1);
     });
    ```
3. Replace `<SERVICE-BUS-NAMESPACE>` with your Service Bus namespace.
4. Replace `<QUEUE NAME>` with the name of the queue.
5. Then run the command in a command prompt to execute this file.

    ```console
    node receive.js
    ```

### [Connection string](#tab/connection-string)

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
        await delay(20000);

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

4. Replace `<QUEUE NAME>` with the name of the queue.
5. Then run the command in a command prompt to execute this file.

    ```console
    node receive.js
    ```

---

You should see the following output.

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

## Troubleshooting

If you receive one of the following errors when running the **passwordless** version of the JavaScript code, make sure you are signed in via the Azure CLI command, `az login` and the [appropriate role](#azure-built-in-roles-for-azure-service-bus) is applied to your Azure user account:

* 'Send' claim(s) are required to perform this operation
* 'Receive' claim(s) are required to perform this operation

## Clean up resources

Navigate to your Service Bus namespace in the Azure portal, and select **Delete** on the Azure portal to delete the namespace and the queue in it.

## Next steps
See the following documentation and samples:

- [Azure Service Bus client library for JavaScript](https://www.npmjs.com/package/@azure/service-bus)
- [JavaScript samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/servicebus/service-bus/samples/v7/javascript)
- [TypeScript samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/servicebus/service-bus/samples/v7/typescript)
- [API reference documentation](/javascript/api/overview/azure/service-bus)
