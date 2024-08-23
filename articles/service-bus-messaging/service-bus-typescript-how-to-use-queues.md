---
title: Get started with Azure Service Bus queues (TypeScript)
description: This tutorial shows you how to send messages to and receive messages from Azure Service Bus queues using the TypeScript programming language.
author: spelluru
ms.author: spelluru
ms.date: 07/17/2024
ms.topic: quickstart
ms.devlang: typescript
ms.custom: devx-track-ts, mode-api
---

# Send messages to and receive messages from Azure Service Bus queues (TypeScript)
> [!div class="op_single_selector" title1="Select the programming language:"]
> * [C#](service-bus-dotnet-get-started-with-queues.md)
> * [Java](service-bus-java-how-to-use-queues.md)
> * [JavaScript](service-bus-nodejs-how-to-use-queues.md)
> * [Python](service-bus-python-how-to-use-queues.md)
> * [TypeScript](service-bus-typescript-how-to-use-queues.md)

In this tutorial, you complete the following steps:

1. Create a Service Bus namespace, using the Azure portal.
2. Create a Service Bus queue, using the Azure portal.
3. Write a TypeScript ESM application to use the [@azure/service-bus](https://www.npmjs.com/package/@azure/service-bus) package to:
    1. Send a set of messages to the queue.
    1. Receive those messages from the queue.

> [!NOTE]
> This quick start provides step-by-step instructions for a simple scenario of sending messages to a Service Bus queue and receiving them. You can find pre-built JavaScript and TypeScript samples for Azure Service Bus in the [Azure SDK for JavaScript repository on GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/servicebus/service-bus/samples/v7).

## Prerequisites

If you're new to the service, see [Service Bus overview](service-bus-messaging-overview.md) before you do this quickstart.

- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- [TypeScript 5+](https://www.typescriptlang.org/download/)
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
> This tutorial works with samples that you can copy and run using [Node.js](https://nodejs.org/). For instructions on how to create a Node.js application, see [Create and deploy a Node.js application to an Azure Website](../app-service/quickstart-nodejs.md), or [Node.js cloud service using Windows PowerShell](../cloud-services/cloud-services-nodejs-develop-deploy-app.md).

[!INCLUDE [service-bus-create-namespace-portal](./includes/service-bus-create-namespace-portal.md)]

[!INCLUDE [service-bus-create-queue-portal](./includes/service-bus-create-queue-portal.md)]

[!INCLUDE [service-bus-passwordless-template-tabbed](../../includes/passwordless/service-bus/service-bus-passwordless-template-tabbed.md)]

[!INCLUDE [service-bus-typescript-configure-project](./includes/service-bus-typescript-how-to-configure-project.md)]


## Use Node Package Manager (npm) to install the package

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
1. In the `src` folder, create a file called `send.ts` and paste the below code into it. This code sends the names of scientists as messages to your queue.

    > [!IMPORTANT]
    > The passwordless credential is provided with the [**DefaultAzureCredential**](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity#defaultazurecredential).

    :::code language="typescript" source="~/azure-typescript-e2e-apps/quickstarts/service-bus/ts/src/queue-passwordless-send.ts" :::

3. Replace `<SERVICE-BUS-NAMESPACE>` with your Service Bus namespace.
4. Replace `<QUEUE NAME>` with the name of the queue.
5. Then run the command in a command prompt to execute this file.

    ```console
    npm run build
    node dist/send.js
    ```
6. You should see the following output.

    ```console
    Sent a batch of messages to the queue: myqueue
    ```

### [Connection string](#tab/connection-string)

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/).
1. In the `src` folder, create a file called `src/send.ts` and paste the below code into it. This code sends the names of scientists as messages to your queue.

    :::code language="typescript" source="~/azure-typescript-e2e-apps/quickstarts/service-bus/ts/src/queue-connection-string-send.ts" :::

3. Replace `<CONNECTION STRING TO SERVICE BUS NAMESPACE>` with the connection string to your Service Bus namespace.
4. Replace `<QUEUE NAME>` with the name of the queue.
5. Then run the command in a command prompt to execute this file.

    ```console
    npm run build
    node dist/send.js
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
2. In the `src` folder, create a file called `receive.ts` and paste the following code into it.

    :::code language="typescript" source="~/azure-typescript-e2e-apps/quickstarts/service-bus/ts/src/queue-passwordless-receive.ts" :::

3. Replace `<SERVICE-BUS-NAMESPACE>` with your Service Bus namespace.
4. Replace `<QUEUE NAME>` with the name of the queue.
5. Then run the command in a command prompt to execute this file.

    ```console
    npm run build
    node dist/receive.js
    ```

### [Connection string](#tab/connection-string)

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. In the `src` folder, create a file called `receive.ts` and paste the following code into it.

    :::code language="typescript" source="~/azure-typescript-e2e-apps/quickstarts/service-bus/ts/src/queue-connection-string-receive.ts" :::

3. Replace `<CONNECTION STRING TO SERVICE BUS NAMESPACE>` with the connection string to your Service Bus namespace.

4. Replace `<QUEUE NAME>` with the name of the queue.
5. Then run the command in a command prompt to execute this file.

    ```console
    npm run build
    node dist/receive.js
    ```

---

You should see the following output.

```console
Received message: Albert Einstein
Received message: Werner Heisenberg
Received message: Marie Curie
Received message: Stephen Hawking
Received message: Isaac Newton
Received message: Niels Bohr
Received message: Michael Faraday
Received message: Galileo Galilei
Received message: Johannes Kepler
Received message: Nikolaus Kopernikus
```

On the **Overview** page for the Service Bus namespace in the Azure portal, you can see **incoming** and **outgoing** message count. You may need to wait for a minute or so and then refresh the page to see the latest values.

:::image type="content" source="./media/service-bus-java-how-to-use-queues/overview-incoming-outgoing-messages.png" alt-text="Screenshot of Azure portal showing incoming and outgoing message count.":::

Select the queue on this **Overview** page to navigate to the **Service Bus Queue** page. You see the **incoming** and **outgoing** message count on this page too. You also see other information such as the **current size** of the queue, **maximum size**, **active message count**, and so on.

:::image type="content" source="./media/service-bus-java-how-to-use-queues/queue-details.png" alt-text="Screenshot of Azure portal showing queue details.":::

## Troubleshooting

If you receive one of the following errors when running the **passwordless** version of the TypeScript code, make sure you are signed in via the Azure CLI command, `az login` and the [appropriate role](#azure-built-in-roles-for-azure-service-bus) is applied to your Azure user account:

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
