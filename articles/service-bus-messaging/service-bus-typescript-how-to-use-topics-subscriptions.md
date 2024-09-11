---
title: Get started with Azure Service Bus topics (TypeScript)
description: This tutorial shows you how to send messages to Azure Service Bus topics and receive messages from topics' subscriptions using the TypeScript programming language.
author: spelluru
ms.author: spelluru
ms.date:  07/17/2024
ms.topic: quickstart
ms.devlang: typescript
ms.custom: devx-track-ts, mode-api
---

# Send messages to an Azure Service Bus topic and receive messages from subscriptions to the topic (TypeScript)

> [!div class="op_single_selector" title1="Select the programming language:"]
> * [C#](service-bus-dotnet-how-to-use-topics-subscriptions.md)
> * [Java](service-bus-java-how-to-use-topics-subscriptions.md)
> * [JavaScript](service-bus-nodejs-how-to-use-topics-subscriptions.md)
> * [Python](service-bus-python-how-to-use-topics-subscriptions.md)
> * [TypeScript](service-bus-typescript-how-to-use-topics-subscriptions.md)

In this tutorial, you complete the following steps:

1. Create a Service Bus namespace, using the Azure portal.
2. Create a Service Bus topic, using the Azure portal.
3. Create a Service Bus subscription to that topic, using the Azure portal.
4. Write a TypeScript ESM application to use the [@azure/service-bus](https://www.npmjs.com/package/@azure/service-bus) package to:
    * Send a set of messages to the topic.
    * Receive those messages from the subscription.

> [!NOTE]
> This quick start provides step-by-step instructions for a simple scenario of sending a batch of messages to a Service Bus topic and receiving those messages from a subscription of the topic. You can find pre-built JavaScript and TypeScript samples for Azure Service Bus in the [Azure SDK for JavaScript repository on GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/servicebus/service-bus/samples/v7).

## Prerequisites
- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- [TypeScript 5+](https://www.typescriptlang.org/download/)
- [Node.js LTS](https://nodejs.org/en/download/)
- Follow steps in the [Quickstart: Use the Azure portal to create a Service Bus topic and subscriptions to the topic](service-bus-quickstart-topics-subscriptions-portal.md). You will use only one subscription for this quickstart.


### [Passwordless](#tab/passwordless)

To use this quickstart with your own Azure account, you need:
* Install [Azure CLI](/cli/azure/install-azure-cli), which provides the passwordless authentication to your developer machine.
* Sign in with your Azure account at the terminal or command prompt with `az login`.
* Use the same account when you add the appropriate role to your resource.
* Run the code in the same terminal or command prompt.
* Note down your **topic** name and **subscription** for your Service Bus namespace. You'll need that in the code.

### [Connection string](#tab/connection-string)

Note down the following, which you'll use in the code below:
* Service Bus namespace **connection string**
* Service Bus namespace **topic** name you created
* Service Bus namespace **subscription**

---

> [!NOTE]
> This tutorial works with samples that you can copy and run using [Node.js](https://nodejs.org/). For instructions on how to create a Node.js application, see [Create and deploy a Node.js application to an Azure Website](../app-service/quickstart-nodejs.md), or [Node.js Cloud Service using Windows PowerShell](../cloud-services/cloud-services-nodejs-develop-deploy-app.md).


[!INCLUDE [service-bus-create-namespace-portal](./includes/service-bus-create-namespace-portal.md)]

[!INCLUDE [service-bus-create-topic-subscription-portal](./includes/service-bus-create-topic-subscription-portal.md)]

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

## Send messages to a topic
The following sample code shows you how to send a batch of messages to a Service Bus topic. See code comments for details.

### [Passwordless](#tab/passwordless)

You must have signed in with the Azure CLI's `az login` in order for your local machine to provide the passwordless authentication required in this code.

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. In the `src` folder, create a file called `sendtotopic.ts` and paste the below code into it. This code will send a message to your topic.

    > [!IMPORTANT]
    > The passwordless credential is provided with the [**DefaultAzureCredential**](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity#defaultazurecredential).

    :::code language="typescript" source="~/azure-typescript-e2e-apps/quickstarts/service-bus/ts/src/topic-passwordless-send.ts" :::

3. Replace `<SERVICE BUS NAMESPACE CONNECTION STRING>` with the connection string to your Service Bus namespace.
1. Replace `<TOPIC NAME>` with the name of the topic.
1. Then run the command in a command prompt to execute this file.

    ```console
    npm run build
    node dist/sendtotopic.js
    ```
1. You should see the following output.

    ```console
    Sent a batch of messages to the topic: mytopic
    ```

### [Connection string](#tab/connection-string)

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. In the `src` folder, create a file called `sendtotopic.ts` and paste the below code into it. This code will send a message to your topic.

    :::code language="typescript" source="~/azure-typescript-e2e-apps/quickstarts/service-bus/ts/src/topic-connection-string-send.ts" :::

3. Replace `<SERVICE BUS NAMESPACE CONNECTION STRING>` with the connection string to your Service Bus namespace.
1. Replace `<TOPIC NAME>` with the name of the topic.
1. Then run the command in a command prompt to execute this file.

    ```console
    npm run build
    node dist/sendtotopic.js
    ```
1. You should see the following output.

    ```console
    Sent a batch of messages to the topic: mytopic
    ```

---

## Receive messages from a subscription

### [Passwordless](#tab/passwordless)

You must have signed in with the Azure CLI's `az login` in order for your local machine to provide the passwordless authentication required in this code.

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. In the `src` folder, create a file called `receivefromsubscription.ts` and paste the following code into it. See code comments for details.

    :::code language="typescript" source="~/azure-typescript-e2e-apps/quickstarts/service-bus/ts/src/topic-passwordless-receive.ts" :::

3. Replace `<SERVICE BUS NAMESPACE CONNECTION STRING>` with the connection string to the namespace.
4. Replace `<TOPIC NAME>` with the name of the topic.
5. Replace `<SUBSCRIPTION NAME>` with the name of the subscription to the topic.
6. Then run the command in a command prompt to execute this file.

    ```console
    npm run build
    node dist/receivefromsubscription.js
    ```

### [Connection string](#tab/connection-string)

1. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. In the `src` folder, create a file called `receivefromsubscription.js` and paste the following code into it. See code comments for details.

    :::code language="typescript" source="~/azure-typescript-e2e-apps/quickstarts/service-bus/ts/src/topic-connection-string-receive.ts" :::

3. Replace `<SERVICE BUS NAMESPACE CONNECTION STRING>` with the connection string to the namespace.
4. Replace `<TOPIC NAME>` with the name of the topic.
5. Replace `<SUBSCRIPTION NAME>` with the name of the subscription to the topic.
6. Then run the command in a command prompt to execute this file.

    ```console
    npm run build 
    node dist/receivefromsubscription.js
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

In the Azure portal, navigate to your Service Bus namespace, switch to **Topics** in the bottom pane, and select your topic to see the **Service Bus Topic** page for your topic. On this page, you should see 10 incoming and 10 outgoing messages in the **Messages** chart.

:::image type="content" source="./media/service-bus-nodejs-how-to-use-topics-subscriptions/topic-page-portal.png" alt-text="Screenshot of Azure portal  showing incoming and outgoing messages.":::

If you run only the send app next time, on the **Service Bus Topic** page, you see 20 incoming messages (10 new) but 10 outgoing messages.

:::image type="content" source="./media/service-bus-nodejs-how-to-use-topics-subscriptions/updated-topic-page.png" alt-text="Screenshot of Azure portal showing updated topic page.":::

On this page, if you select a subscription in the bottom pane, you get to the **Service Bus Subscription** page. You can see the active message count, dead-letter message count, and more on this page. In this example, there are 10 active messages that haven't been received by a receiver yet.

:::image type="content" source="./media/service-bus-nodejs-how-to-use-topics-subscriptions/active-message-count.png" alt-text="Screenshot of Azure portal showing active message count.":::

## Troubleshooting

If you receive an error when running the **passwordless** version of the TypeScript code about required claims, make sure you are signed in via the Azure CLI command, `az login` and the [appropriate role](#azure-built-in-roles-for-azure-service-bus) is applied to your Azure user account.

## Clean up resources

Navigate to your Service Bus namespace in the Azure portal, and select **Delete** on the Azure portal to delete the namespace and the topic in it.

## Next steps
See the following documentation and samples:

- [Azure Service Bus client library for JavaScript](https://www.npmjs.com/package/@azure/service-bus)
- [JavaScript samples](/samples/azure/azure-sdk-for-js/service-bus-javascript/)
- [TypeScript samples](/samples/azure/azure-sdk-for-js/service-bus-typescript/)
- [API reference documentation](/javascript/api/overview/azure/service-bus)
