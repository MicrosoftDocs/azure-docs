---
title: Get started with Azure Service Bus queues (Java)
description: This tutorial shows you how to send messages to and receive messages from Azure Service Bus queues using the Java programming language.
ms.date: 04/12/2023
ms.topic: quickstart
ms.devlang: java
ms.custom: passwordless-java, devx-track-extended-java
---

# Send messages to and receive messages from Azure Service Bus queues (Java)
> [!div class="op_single_selector" title1="Select the programming language:"]
> * [C#](service-bus-dotnet-get-started-with-queues.md)
> * [Java](service-bus-java-how-to-use-queues.md)
> * [JavaScript](service-bus-nodejs-how-to-use-queues.md)
> * [Python](service-bus-python-how-to-use-queues.md)

In this quickstart, you create a Java app to send messages to and receive messages from an Azure Service Bus queue.

> [!NOTE]
> This quick start provides step-by-step instructions for a simple scenario of sending messages to a Service Bus queue and receiving them. You can find pre-built Java samples for Azure Service Bus in the [Azure SDK for Java repository on GitHub](https://github.com/azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus/src/samples).

> [!TIP]
> If you're working with Azure Service Bus resources in a Spring application, we recommend that you consider [Spring Cloud Azure](/azure/developer/java/spring-framework/) as an alternative. Spring Cloud Azure is an open-source project that provides seamless Spring integration with Azure services. To learn more about Spring Cloud Azure, and to see an example using Service Bus, see [Spring Cloud Stream with Azure Service Bus](/azure/developer/java/spring-framework/configure-spring-cloud-stream-binder-java-app-with-service-bus).

## Prerequisites
- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- Install [Azure SDK for Java][Azure SDK for Java]. If you're using Eclipse, you can install the [Azure Toolkit for Eclipse][Azure Toolkit for Eclipse] that includes the Azure SDK for Java. You can then add the **Microsoft Azure Libraries for Java** to your project. If you're using IntelliJ, see [Install the Azure Toolkit for IntelliJ](/azure/developer/java/toolkit-for-intellij/installation).

[!INCLUDE [service-bus-create-namespace-portal](./includes/service-bus-create-namespace-portal.md)]

[!INCLUDE [service-bus-create-queue-portal](./includes/service-bus-create-queue-portal.md)]

[!INCLUDE [service-bus-passwordless-template-tabbed](../../includes/passwordless/service-bus/service-bus-passwordless-template-tabbed.md)]


## Send messages to a queue
In this section, you create a Java console project, and add code to send messages to the queue that you created earlier.

### Create a Java console project
Create a Java project using Eclipse or a tool of your choice.

### Configure your application to use Service Bus
Add references to Azure Core and Azure Service Bus libraries.

If you're using Eclipse and created a Java console application, convert your Java project to a Maven: right-click the project in the **Package Explorer** window, select **Configure** -> **Convert to Maven project**. Then, add dependencies to these two libraries as shown in the following example.


### [Passwordless (Recommended)](#tab/passwordless)
Update the `pom.xml` file to add dependencies to Azure Service Bus and Azure Identity packages.

```xml
    <dependencies>
        <dependency>
            <groupId>com.azure</groupId>
            <artifactId>azure-messaging-servicebus</artifactId>
            <version>7.13.3</version>
        </dependency>
        <dependency>
            <groupId>com.azure</groupId>
            <artifactId>azure-identity</artifactId>
            <version>1.8.0</version>
            <scope>compile</scope>
        </dependency>
    </dependencies>
```

### [Connection String](#tab/connection-string)
Update the `pom.xml` file to add a dependency to the Azure Service Bus package.

```xml
        <dependency>
            <groupId>com.azure</groupId>
            <artifactId>azure-messaging-servicebus</artifactId>
            <version>7.13.3</version>
        </dependency>
```
---

### Add code to send messages to the queue

1. Add the following `import` statements at the topic of the Java file.

    ### [Passwordless (Recommended)](#tab/passwordless)

    ```java
    import com.azure.messaging.servicebus.*;
    import com.azure.identity.*;

    import java.util.concurrent.CountDownLatch;
    import java.util.concurrent.TimeUnit;
    import java.util.Arrays;
    import java.util.List;
    ```

    ### [Connection String](#tab/connection-string)

    ```java
    import com.azure.messaging.servicebus.*;

    import java.util.concurrent.CountDownLatch;
    import java.util.concurrent.TimeUnit;
    import java.util.Arrays;
    import java.util.List;
    ```
    ---
2. In the class, define variables to hold connection string and queue name.

    ### [Passwordless (Recommended)](#tab/passwordless)

    ```java
    static String queueName = "<QUEUE NAME>";
    ```

    > [!IMPORTANT]
    > Replace `<QUEUE NAME>` with the name of the queue.

    ### [Connection String](#tab/connection-string)

    ```java
    static String connectionString = "<NAMESPACE CONNECTION STRING>";
    static String queueName = "<QUEUE NAME>";
    ```

    > [!IMPORTANT]
    > Replace `<NAMESPACE CONNECTION STRING>` with the connection string to your Service Bus namespace, and `<QUEUE NAME>` with the name of the queue.

    ---
3. Add a method named `sendMessage` in the class to send one message to the queue.

    ### [Passwordless (Recommended)](#tab/passwordless)

    > [!IMPORTANT]
    > Replace `NAMESPACENAME` with the name of your Service Bus namespace.

    ```java
    static void sendMessage()
    {
        // create a token using the default Azure credential
        DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
                .build();

        ServiceBusSenderClient senderClient = new ServiceBusClientBuilder()
                .fullyQualifiedNamespace("NAMESPACENAME.servicebus.windows.net")
                .credential(credential)
                .sender()
                .queueName(queueName)
                .buildClient();

        // send one message to the queue
        senderClient.sendMessage(new ServiceBusMessage("Hello, World!"));
        System.out.println("Sent a single message to the queue: " + queueName);
    }

    ```

    ### [Connection String](#tab/connection-string)

    ```java
    static void sendMessage()
    {
        // create a Service Bus Sender client for the queue
        ServiceBusSenderClient senderClient = new ServiceBusClientBuilder()
                .connectionString(connectionString)
                .sender()
                .queueName(queueName)
                .buildClient();

        // send one message to the queue
        senderClient.sendMessage(new ServiceBusMessage("Hello, World!"));
        System.out.println("Sent a single message to the queue: " + queueName);
    }
    ```
    ---
4. Add a method named `createMessages` in the class to create a list of messages. Typically, you get these messages from different parts of your application. Here, we create a list of sample messages.

    ```java
    static List<ServiceBusMessage> createMessages()
    {
        // create a list of messages and return it to the caller
        ServiceBusMessage[] messages = {
                new ServiceBusMessage("First message"),
                new ServiceBusMessage("Second message"),
                new ServiceBusMessage("Third message")
        };
        return Arrays.asList(messages);
    }
    ```
5. Add a method named `sendMessageBatch` method to send messages to the queue you created. This method creates a `ServiceBusSenderClient` for the queue, invokes the `createMessages` method to get the list of messages, prepares one or more batches, and sends the batches to the queue.

    ### [Passwordless (Recommended)](#tab/passwordless)

    > [!IMPORTANT]
    > Replace `NAMESPACENAME` with the name of your Service Bus namespace.


    ```java
    static void sendMessageBatch()
    {
        // create a token using the default Azure credential
        DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
                .build();

        ServiceBusSenderClient senderClient = new ServiceBusClientBuilder()
                .fullyQualifiedNamespace("NAMESPACENAME.servicebus.windows.net")
                .credential(credential)
                .sender()
                .queueName(queueName)
                .buildClient();

        // Creates an ServiceBusMessageBatch where the ServiceBus.
        ServiceBusMessageBatch messageBatch = senderClient.createMessageBatch();

        // create a list of messages
        List<ServiceBusMessage> listOfMessages = createMessages();

        // We try to add as many messages as a batch can fit based on the maximum size and send to Service Bus when
        // the batch can hold no more messages. Create a new batch for next set of messages and repeat until all
        // messages are sent.
        for (ServiceBusMessage message : listOfMessages) {
            if (messageBatch.tryAddMessage(message)) {
                continue;
            }

            // The batch is full, so we create a new batch and send the batch.
            senderClient.sendMessages(messageBatch);
            System.out.println("Sent a batch of messages to the queue: " + queueName);

            // create a new batch
            messageBatch = senderClient.createMessageBatch();

            // Add that message that we couldn't before.
            if (!messageBatch.tryAddMessage(message)) {
                System.err.printf("Message is too large for an empty batch. Skipping. Max size: %s.", messageBatch.getMaxSizeInBytes());
            }
        }

        if (messageBatch.getCount() > 0) {
            senderClient.sendMessages(messageBatch);
            System.out.println("Sent a batch of messages to the queue: " + queueName);
        }

        //close the client
        senderClient.close();
    }
    ```

    ### [Connection String](#tab/connection-string)

    ```java
    static void sendMessageBatch()
    {
        // create a Service Bus Sender client for the queue
        ServiceBusSenderClient senderClient = new ServiceBusClientBuilder()
                .connectionString(connectionString)
                .sender()
                .queueName(queueName)
                .buildClient();

        // Creates an ServiceBusMessageBatch where the ServiceBus.
        ServiceBusMessageBatch messageBatch = senderClient.createMessageBatch();

        // create a list of messages
        List<ServiceBusMessage> listOfMessages = createMessages();

        // We try to add as many messages as a batch can fit based on the maximum size and send to Service Bus when
        // the batch can hold no more messages. Create a new batch for next set of messages and repeat until all
        // messages are sent.
        for (ServiceBusMessage message : listOfMessages) {
            if (messageBatch.tryAddMessage(message)) {
                continue;
            }

            // The batch is full, so we create a new batch and send the batch.
            senderClient.sendMessages(messageBatch);
            System.out.println("Sent a batch of messages to the queue: " + queueName);

            // create a new batch
            messageBatch = senderClient.createMessageBatch();

            // Add that message that we couldn't before.
            if (!messageBatch.tryAddMessage(message)) {
                System.err.printf("Message is too large for an empty batch. Skipping. Max size: %s.", messageBatch.getMaxSizeInBytes());
            }
        }

        if (messageBatch.getCount() > 0) {
            senderClient.sendMessages(messageBatch);
            System.out.println("Sent a batch of messages to the queue: " + queueName);
        }

        //close the client
        senderClient.close();
    }
    ```

    ---

## Receive messages from a queue
In this section, you add code to retrieve messages from the queue.

1. Add a method named `receiveMessages` to receive messages from the queue. This method creates a `ServiceBusProcessorClient` for the queue by specifying a handler for processing messages and another one for handling errors. Then, it starts the processor, waits for few seconds, prints the messages that are received, and then stops and closes the processor.

    ### [Passwordless (Recommended)](#tab/passwordless)

    > [!IMPORTANT]
    > - Replace `NAMESPACENAME` with the name of your Service Bus namespace.
    > - Replace `QueueTest` in `QueueTest::processMessage` in the code with the name of your class.

    ```java
    // handles received messages
    static void receiveMessages() throws InterruptedException
    {
        CountDownLatch countdownLatch = new CountDownLatch(1);

        DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
                .build();

        ServiceBusProcessorClient processorClient = new ServiceBusClientBuilder()
                .fullyQualifiedNamespace("NAMESPACENAME.servicebus.windows.net")
                .credential(credential)
                .processor()
                .queueName(queueName)
                .processMessage(QueueTest::processMessage)
                .processError(context -> processError(context, countdownLatch))
                .buildProcessorClient();

        System.out.println("Starting the processor");
        processorClient.start();

        TimeUnit.SECONDS.sleep(10);
        System.out.println("Stopping and closing the processor");
        processorClient.close();
    }
    ```

    ### [Connection String](#tab/connection-string)

    > [!IMPORTANT]
    > Replace `QueueTest` in `QueueTest::processMessage` in the code with the name of your class.

    ```java
    // handles received messages
    static void receiveMessages() throws InterruptedException
    {
        CountDownLatch countdownLatch = new CountDownLatch(1);

        // Create an instance of the processor through the ServiceBusClientBuilder
        ServiceBusProcessorClient processorClient = new ServiceBusClientBuilder()
            .connectionString(connectionString)
            .processor()
            .queueName(queueName)
            .processMessage(QueueTest::processMessage)
            .processError(context -> processError(context, countdownLatch))
            .buildProcessorClient();

        System.out.println("Starting the processor");
        processorClient.start();

        TimeUnit.SECONDS.sleep(10);
        System.out.println("Stopping and closing the processor");
        processorClient.close();
    }
    ```
    ---
2. Add the `processMessage` method to process a message received from the Service Bus subscription.

    ```java
    private static void processMessage(ServiceBusReceivedMessageContext context) {
        ServiceBusReceivedMessage message = context.getMessage();
        System.out.printf("Processing message. Session: %s, Sequence #: %s. Contents: %s%n", message.getMessageId(),
            message.getSequenceNumber(), message.getBody());
    }
    ```
3. Add the `processError` method to handle error messages.

    ```java
    private static void processError(ServiceBusErrorContext context, CountDownLatch countdownLatch) {
        System.out.printf("Error when receiving messages from namespace: '%s'. Entity: '%s'%n",
            context.getFullyQualifiedNamespace(), context.getEntityPath());

        if (!(context.getException() instanceof ServiceBusException)) {
            System.out.printf("Non-ServiceBusException occurred: %s%n", context.getException());
            return;
        }

        ServiceBusException exception = (ServiceBusException) context.getException();
        ServiceBusFailureReason reason = exception.getReason();

        if (reason == ServiceBusFailureReason.MESSAGING_ENTITY_DISABLED
            || reason == ServiceBusFailureReason.MESSAGING_ENTITY_NOT_FOUND
            || reason == ServiceBusFailureReason.UNAUTHORIZED) {
            System.out.printf("An unrecoverable error occurred. Stopping processing with reason %s: %s%n",
                reason, exception.getMessage());

            countdownLatch.countDown();
        } else if (reason == ServiceBusFailureReason.MESSAGE_LOCK_LOST) {
            System.out.printf("Message lock lost for message: %s%n", context.getException());
        } else if (reason == ServiceBusFailureReason.SERVICE_BUSY) {
            try {
                // Choosing an arbitrary amount of time to wait until trying again.
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                System.err.println("Unable to sleep for period of time");
            }
        } else {
            System.out.printf("Error source %s, reason %s, message: %s%n", context.getErrorSource(),
                reason, context.getException());
        }
    }
    ```
2. Update the `main` method to invoke `sendMessage`, `sendMessageBatch`, and `receiveMessages` methods and to throw `InterruptedException`.

    ```java
    public static void main(String[] args) throws InterruptedException {
        sendMessage();
        sendMessageBatch();
        receiveMessages();
    }
    ```

## Run the app

### [Passwordless (Recommended)](#tab/passwordless)

1. If you're using Eclipse, right-click the project, select **Export**, expand **Java**, select **Runnable JAR file**, and follow the steps to create a runnable JAR file.
1. If you are signed into the machine using a user account that's different from the user account added to the **Azure Service Bus Data Owner** role, follow these steps. Otherwise, skip this step and move on to run the Jar file in the next step.

    1. [Install Azure CLI](/cli/azure/install-azure-cli-windows) on your machine.
    1. Run the following CLI command to sign in to Azure. Use the same user account that you added to the **Azure Service Bus Data Owner** role.

        ```azurecli
        az login
        ```
1. Run the Jar file using the following command.

    ```java
    java -jar <JAR FILE NAME>
    ```
1. You see the following output in the console window.

    ```console
    Sent a single message to the queue: myqueue
    Sent a batch of messages to the queue: myqueue
    Starting the processor
    Processing message. Session: 88d961dd801f449e9c3e0f8a5393a527, Sequence #: 1. Contents: Hello, World!
    Processing message. Session: e90c8d9039ce403bbe1d0ec7038033a0, Sequence #: 2. Contents: First message
    Processing message. Session: 311a216a560c47d184f9831984e6ac1d, Sequence #: 3. Contents: Second message
    Processing message. Session: f9a871be07414baf9505f2c3d466c4ab, Sequence #: 4. Contents: Third message
    Stopping and closing the processor
    ```

### [Connection String](#tab/connection-string)
When you run the application, you see the following messages in the console window.

```console
Sent a single message to the queue: myqueue
Sent a batch of messages to the queue: myqueue
Starting the processor
Processing message. Session: 88d961dd801f449e9c3e0f8a5393a527, Sequence #: 1. Contents: Hello, World!
Processing message. Session: e90c8d9039ce403bbe1d0ec7038033a0, Sequence #: 2. Contents: First message
Processing message. Session: 311a216a560c47d184f9831984e6ac1d, Sequence #: 3. Contents: Second message
Processing message. Session: f9a871be07414baf9505f2c3d466c4ab, Sequence #: 4. Contents: Third message
Stopping and closing the processor
```
---

On the **Overview** page for the Service Bus namespace in the Azure portal, you can see **incoming** and **outgoing** message count. You may need to wait for a minute or so and then refresh the page to see the latest values.

:::image type="content" source="./media/service-bus-java-how-to-use-queues/overview-incoming-outgoing-messages.png" alt-text="Incoming and outgoing message count" lightbox="./media/service-bus-java-how-to-use-queues/overview-incoming-outgoing-messages.png":::

Select the queue on this **Overview** page to navigate to the **Service Bus Queue** page. You see the **incoming** and **outgoing** message count on this page too. You also see other information such as the **current size** of the queue, **maximum size**, **active message count**, and so on.

:::image type="content" source="./media/service-bus-java-how-to-use-queues/queue-details.png" alt-text="Queue details" lightbox="./media/service-bus-java-how-to-use-queues/queue-details.png":::



## Next Steps
See the following documentation and samples:

- [Azure Service Bus client library for Java - Readme](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/servicebus/azure-messaging-servicebus/README.md)
- [Samples on GitHub](/samples/azure/azure-sdk-for-java/servicebus-samples/)
- [Java API reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-messaging-servicebus/7.0.0/index.html)

[Azure SDK for Java]: /azure/developer/java/sdk/get-started
[Azure Toolkit for Eclipse]: /azure/developer/java/toolkit-for-eclipse/installation
[Queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
[BrokeredMessage]: /dotnet/api/microsoft.servicebus.messaging.brokeredmessage
