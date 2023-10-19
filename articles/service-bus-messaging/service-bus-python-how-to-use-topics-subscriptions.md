---
title: Get started with Azure Service Bus topics (Python)
description: This tutorial shows you how to send messages to Azure Service Bus topics and receive messages from topics' subscriptions using the Python programming language.
documentationcenter: python
author: spelluru
ms.author: spelluru
ms.date: 01/17/2023
ms.topic: quickstart
ms.devlang: python
ms.custom: devx-track-python, mode-api, passwordless-python
---

# Send messages to an Azure Service Bus topic and receive messages from subscriptions to the topic (Python)

> [!div class="op_single_selector" title1="Select the programming language:"]
> * [C#](service-bus-dotnet-how-to-use-topics-subscriptions.md)
> * [Java](service-bus-java-how-to-use-topics-subscriptions.md)
> * [JavaScript](service-bus-nodejs-how-to-use-topics-subscriptions.md)
> * [Python](service-bus-python-how-to-use-topics-subscriptions.md)


In this tutorial, you complete the following steps: 

1. Create a Service Bus namespace, using the Azure portal.
2. Create a Service Bus topic, using the Azure portal.
3. Create a Service Bus subscription to that topic, using the Azure portal.
4. Write a Python application to use the [azure-servicebus](https://pypi.org/project/azure-servicebus/) package to: 
    * Send a set of messages to the topic.
    * Receive those messages from the subscription.

> [!NOTE]
> This quickstart provides step-by-step instructions for a simple scenario of sending a batch of messages to a Service Bus topic and receiving those messages from a subscription of the topic. You can find pre-built Python samples for Azure Service Bus in the [Azure SDK for Python repository on GitHub](https://github.com/azure/azure-sdk-for-python/tree/main/sdk/servicebus/azure-servicebus/samples). 

## Prerequisites

- An [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- Python 3.7 or higher, with the [Azure Python SDK](/azure/developer/python/sdk/azure-sdk-overview) package installed.

>[!NOTE]
> This tutorial works with samples that you can copy and run using Python. For instructions on how to create a Python application, see [Create and deploy a Python application to an Azure Website](../app-service/quickstart-python.md). For more information about installing packages used in this tutorial, see the [Python Installation Guide](/azure/developer/python/sdk/azure-sdk-install).

[!INCLUDE [service-bus-create-namespace-portal](./includes/service-bus-create-namespace-portal.md)]

[!INCLUDE [service-bus-create-topic-subscription-portal](./includes/service-bus-create-topic-subscription-portal.md)]

[!INCLUDE [service-bus-passwordless-template-tabbed](../../includes/passwordless/service-bus/service-bus-passwordless-template-tabbed.md)]

## Code setup 

### [Passwordless (Recommended)](#tab/passwordless)

To follow this quickstart using passwordless authentication and your own Azure account:

* Install the [Azure CLI](/cli/azure/install-azure-cli).
* Sign in with your Azure account at the terminal or command prompt with `az login`. 
* Use the same account when you add the appropriate role to your resource later in the tutorial.
* Run the tutorial code in the same terminal or command prompt.

>[!IMPORTANT]
> Make sure you sign in with `az login`. The `DefaultAzureCredential` class in the passwordless code uses the Azure CLI credentials to authenticate with Microsoft Entra ID.

To use the passwordless code, you'll need to specify a:

* fully qualified service bus namespace, for example: *\<service-bus-namespace>.servicebus.windows.net*
* topic name
* subscription name

### [Connection string](#tab/connection-string)

To follow this quickstart using a connection string to authenticate, you don't use your own Azure account. Instead, you'll use the connection string for the service bus namespace.

To use the connection code, you'll need to specify a:

* connection string
* topic name
* subscription name

---

### Use pip to install packages

### [Passwordless (Recommended)](#tab/passwordless)

1. To install the required Python packages for this Service Bus tutorial, open a command prompt that has Python in its path. Change the directory to the folder where you want to have your samples.

1. Install packages:

    ```shell
    pip install azure-servicebus
    pip install azure-identity
    pip install aiohttp
    ```

### [Connection string](#tab/connection-string)

1. To install the required Python packages for this Service Bus tutorial, open a command prompt that has Python in its path. Change the directory to the folder where you want to have your samples.

1. Install package:

    ```bash
    pip install azure-servicebus
    ```

---

## Send messages to a topic

The following sample code shows you how to send a batch of messages to a Service Bus topic. See code comments for details.

Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/), create a file *send.py*, and add the following code into it.

### [Passwordless (Recommended)](#tab/passwordless)

1. Add the following `import` statements.

    ```python
    import asyncio
    from azure.servicebus.aio import ServiceBusClient
    from azure.servicebus import ServiceBusMessage
    from azure.identity.aio import DefaultAzureCredential
    ```

2. Add the constants and define a credential.

    ```python
    FULLY_QUALIFIED_NAMESPACE = "FULLY_QUALIFIED_NAMESPACE"
    TOPIC_NAME = "TOPIC_NAME"

    credential = DefaultAzureCredential()
    ```
    
    > [!IMPORTANT]
    > - Replace `FULLY_QUALIFIED_NAMESPACE` with the fully qualified namespace for your Service Bus namespace.
    > - Replace `TOPIC_NAME` with the name of the topic.

    In the preceding code, you used the Azure Identity client library's `DefaultAzureCredential` class. When the app runs locally during development, `DefaultAzureCredential` will automatically discover and authenticate to Azure using the account you logged into the Azure CLI with. When the app is deployed to Azure, `DefaultAzureCredential` can authenticate your app to Microsoft Entra ID via a managed identity without any code changes.

3. Add a method to send a single message.

    ```python
    async def send_single_message(sender):
        # Create a Service Bus message
        message = ServiceBusMessage("Single Message")
        # send the message to the topic
        await sender.send_messages(message)
        print("Sent a single message")
    ```

    The sender is an object that acts as a client for the topic you created. You'll create it later and send as an argument to this function. 

4. Add a method to send a list of messages.

    ```python
    async def send_a_list_of_messages(sender):
        # Create a list of messages
        messages = [ServiceBusMessage("Message in list") for _ in range(5)]
        # send the list of messages to the topic
        await sender.send_messages(messages)
        print("Sent a list of 5 messages")
    ```

5. Add a method to send a batch of messages.

    ```python
    async def send_batch_message(sender):
        # Create a batch of messages
        async with sender:
            batch_message = await sender.create_message_batch()
            for _ in range(10):
                try:
                    # Add a message to the batch
                    batch_message.add_message(ServiceBusMessage("Message inside a ServiceBusMessageBatch"))
                except ValueError:
                    # ServiceBusMessageBatch object reaches max_size.
                    # New ServiceBusMessageBatch object can be created here to send more data.
                    break
            # Send the batch of messages to the topic
            await sender.send_messages(batch_message)
        print("Sent a batch of 10 messages")
    ```

6. Create a Service Bus client and then a topic sender object to send messages.

    ```Python
    async def run():
        # create a Service Bus client using the credential.
        async with ServiceBusClient(
            fully_qualified_namespace=FULLY_QUALIFIED_NAMESPACE,
            credential=credential,
            logging_enable=True) as servicebus_client:
            # Get a Topic Sender object to send messages to the topic
            sender = servicebus_client.get_topic_sender(topic_name=TOPIC_NAME)
            async with sender:
                # Send one message
                await send_single_message(sender)
                # Send a list of messages
                await send_a_list_of_messages(sender)
                # Send a batch of messages
                await send_batch_message(sender)
            # Close credential when no longer needed.
            await credential.close()
    
    asyncio.run(run())
    print("Done sending messages")
    print("-----------------------")
    ```

### [Connection string](#tab/connection-string)

1. Add the following `import` statements.

    ```python
    import asyncio
    from azure.servicebus.aio import ServiceBusClient
    from azure.servicebus import ServiceBusMessage
    ```

2. Add the following constants. 

    ```python
    NAMESPACE_CONNECTION_STR = "NAMESPACE_CONNECTION_STRING"
    TOPIC_NAME = "TOPIC_NAME"
    ```
    
    > [!IMPORTANT]
    > - Replace `NAMESPACE_CONNECTION_STRING` with the connection string for your namespace.
    > - Replace `TOPIC_NAME` with the name of the topic.

3. Add a method to send a single message.

    ```python
    async def send_single_message(sender):
        # Create a Service Bus message
        message = ServiceBusMessage("Single Message")
        # send the message to the topic
        await sender.send_messages(message)
        print("Sent a single message")
    ```

    The sender is an object that acts as a client for the topic you created. You'll create it later and send as an argument to this function. 

4. Add a method to send a list of messages.

    ```python
    async def send_a_list_of_messages(sender):
        # Create a list of messages
        messages = [ServiceBusMessage("Message in list") for _ in range(5)]
        # send the list of messages to the topic
        await sender.send_messages(messages)
        print("Sent a list of 5 messages")
    ```

5. Add a method to send a batch of messages.

    ```python
    async def send_batch_message(sender):
        # Create a batch of messages
        async with sender:
            batch_message = await sender.create_message_batch()
            for _ in range(10):
                try:
                    # Add a message to the batch
                    batch_message.add_message(ServiceBusMessage("Message inside a ServiceBusMessageBatch"))
                except ValueError:
                    # ServiceBusMessageBatch object reaches max_size.
                    # New ServiceBusMessageBatch object can be created here to send more data.
                    break
            # Send the batch of messages to the topic
            await sender.send_messages(batch_message)
        print("Sent a batch of 10 messages")
    ```

6. Create a Service Bus client and then a topic sender object to send messages.

    ```python
    async def run():
        # create a Service Bus client using the connection string
        async with ServiceBusClient.from_connection_string(
            conn_str=NAMESPACE_CONNECTION_STR,
            logging_enable=True) as servicebus_client:
            # Get a Topic Sender object to send messages to the topic
            sender = servicebus_client.get_topic_sender(topic_name=TOPIC_NAME)
            async with sender:
                # Send one message
                await send_single_message(sender)
                # Send a list of messages
                await send_a_list_of_messages(sender)
                # Send a batch of messages
                await send_batch_message(sender)
    
    asyncio.run(run())
    print("Done sending messages")
    print("-----------------------")
    ```

---

## Receive messages from a subscription

The following sample code shows you how to receive messages from a subscription. This code continually receives new messages until it doesn't receive any new messages for 5 (`max_wait_time`) seconds.

Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/), create a file *recv.py*, and add the following code into it.

### [Passwordless (Recommended)](#tab/passwordless)

1. Similar to the send sample, add `import` statements, define constants that you should replace with your own values, and define a credential.

    ```python
    import asyncio
    from azure.servicebus.aio import ServiceBusClient
    from azure.identity.aio import DefaultAzureCredential
    
    FULLY_QUALIFIED_NAMESPACE = "FULLY_QUALIFIED_NAMESPACE"
    SUBSCRIPTION_NAME = "SUBSCRIPTION_NAME"
    TOPIC_NAME = "TOPIC_NAME"
    
    credential = DefaultAzureCredential()
    ```

2. Create a Service Bus client and then a subscription receiver object to receive messages.

    ```python
    async def run():
        # create a Service Bus client using the credential
        async with ServiceBusClient(
            fully_qualified_namespace=FULLY_QUALIFIED_NAMESPACE,
            credential=credential,
            logging_enable=True) as servicebus_client:
    
            async with servicebus_client:
                # get the Subscription Receiver object for the subscription
                receiver = servicebus_client.get_subscription_receiver(topic_name=TOPIC_NAME, 
                subscription_name=SUBSCRIPTION_NAME, max_wait_time=5)
                async with receiver:
                    received_msgs = await receiver.receive_messages(max_wait_time=5, max_message_count=20)
                    for msg in received_msgs:
                        print("Received: " + str(msg))
                        # complete the message so that the message is removed from the subscription
                        await receiver.complete_message(msg)
            # Close credential when no longer needed.
            await credential.close()
    ```
    
3. Call the `run` method.

    ```python
    asyncio.run(run())
    ```

### [Connection string](#tab/connection-string)

1. Similar to the send sample, add `import` statements and define constants that you should replace with your own values.

    ```python
    import asyncio
    from azure.servicebus.aio import ServiceBusClient
    
    NAMESPACE_CONNECTION_STR = "NAMESPACE_CONNECTION_STRING"
    SUBSCRIPTION_NAME = "SUBSCRIPTION_NAME"
    TOPIC_NAME = "TOPIC_NAME"
    ```

2. Create a Service Bus client and then a subscription receiver object to receive messages.

    ```python
    async def run():
        # create a Service Bus client using the connection string
        async with ServiceBusClient.from_connection_string(
            conn_str=NAMESPACE_CONNECTION_STR,
            logging_enable=True) as servicebus_client:
    
            async with servicebus_client:
                # get the Subscription Receiver object for the subscription
                receiver = servicebus_client.get_subscription_receiver(topic_name=TOPIC_NAME, 
                subscription_name=SUBSCRIPTION_NAME, max_wait_time=5)
                async with receiver:
                    received_msgs = await receiver.receive_messages(max_wait_time=5, max_message_count=20)
                    for msg in received_msgs:
                        print("Received: " + str(msg))
                        # complete the message so that the message is removed from the subscription
                        await receiver.complete_message(msg)
    ```

3. Call the `run` method.

    ```python
    asyncio.run(run())
    ```

---

## Run the app

Open a command prompt that has Python in its path, and then run the code to send and receive messages for a subscription under a topic.

```shell
python send.py; python recv.py
```

You should see the following output: 

```console
Sent a single message
Sent a list of 5 messages
Sent a batch of 10 messages
Done sending messages
-----------------------
Received: Single Message
Received: Message in list
Received: Message in list
Received: Message in list
Received: Message in list
Received: Message in list
Received: Message inside a ServiceBusMessageBatch
Received: Message inside a ServiceBusMessageBatch
Received: Message inside a ServiceBusMessageBatch
Received: Message inside a ServiceBusMessageBatch
Received: Message inside a ServiceBusMessageBatch
Received: Message inside a ServiceBusMessageBatch
Received: Message inside a ServiceBusMessageBatch
Received: Message inside a ServiceBusMessageBatch
Received: Message inside a ServiceBusMessageBatch
Received: Message inside a ServiceBusMessageBatch
```

In the Azure portal, navigate to your Service Bus namespace. On the **Overview** page, verify that the **incoming** and **outgoing** message counts are 16. If you don't see the counts, refresh the page after waiting for a few minutes. 

:::image type="content" source="./media/service-bus-python-how-to-use-queues/overview-incoming-outgoing-messages.png" alt-text="Incoming and outgoing message count":::

Select the topic in the bottom pane to see the **Service Bus Topic** page for your topic. On this page, you should see three incoming and three outgoing messages in the **Messages** chart. 

:::image type="content" source="./media/service-bus-python-how-to-use-topics-subscriptions/topic-page-portal.png" alt-text="Incoming and outgoing messages":::

On this page, if you select a subscription, you get to the **Service Bus Subscription** page. You can see the active message count, dead-letter message count, and more on this page. In this example, all the messages have been received, so the active message count is zero. 

:::image type="content" source="./media/service-bus-python-how-to-use-topics-subscriptions/active-message-count.png" alt-text="Active message count":::

If you comment out the receive code, you'll see the active message count as 16. 

:::image type="content" source="./media/service-bus-python-how-to-use-topics-subscriptions/active-message-count-2.png" alt-text="Active message count - no receive":::

## Next steps
See the following documentation and samples: 

- [Azure Service Bus client library for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/servicebus/azure-servicebus)
- [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/servicebus/azure-servicebus/samples). 
    - The **sync_samples** folder has samples that show you how to interact with Service Bus in a synchronous manner. In this quick start, you used this method. 
    - The **async_samples** folder has samples that show you how to interact with Service Bus in an asynchronous manner. 
- [azure-servicebus reference documentation](/python/api/azure-servicebus/azure.servicebus?preserve-view=true)
