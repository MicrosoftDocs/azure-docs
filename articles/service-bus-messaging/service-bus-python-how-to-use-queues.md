---
title: Get started with Azure Service Bus queues (Python)
description: This tutorial shows you how to send messages to and receive messages from Azure Service Bus queues using the Python programming language.
documentationcenter: python
author: spelluru
ms.author: spelluru
ms.date: 01/12/2023
ms.topic: quickstart
ms.devlang: python
ms.custom: seo-python-october2019, devx-track-python, mode-api, passwordless-python
---

# Send messages to and receive messages from Azure Service Bus queues (Python)
> [!div class="op_single_selector" title1="Select the programming language:"]
> * [C#](service-bus-dotnet-get-started-with-queues.md)
> * [Java](service-bus-java-how-to-use-queues.md)
> * [JavaScript](service-bus-nodejs-how-to-use-queues.md)
> * [Python](service-bus-python-how-to-use-queues.md)

In this tutorial, you complete the following steps: 

1. Create a Service Bus namespace, using the Azure portal.
1. Create a Service Bus queue, using the Azure portal.
1. Write Python code to use the [azure-servicebus](https://pypi.org/project/azure-servicebus/) package to:
    1. Send a set of messages to the queue.
    1. Receive those messages from the queue.

> [!NOTE]
> This quick start provides step-by-step instructions for a simple scenario of sending messages to a Service Bus queue and receiving them. You can find pre-built JavaScript and TypeScript samples for Azure Service Bus in the [Azure SDK for Python repository on GitHub](https://github.com/azure/azure-sdk-for-python/tree/main/sdk/servicebus/azure-servicebus/samples). 


## Prerequisites

If you're new to the service, see [Service Bus overview](service-bus-messaging-overview.md) before you do this quickstart.

- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).

- [Python 3.7](https://www.python.org/downloads/) or higher.

### [Passwordless (Recommended)](#tab/passwordless)

To use this quickstart with your own Azure account:
* Install [Azure CLI](/cli/azure/install-azure-cli), which provides the passwordless authentication to your developer machine.
* Sign in with your Azure account at the terminal or command prompt with `az login`. 
* Use the same account when you add the appropriate data role to your resource.
* Run the code in the same terminal or command prompt.
* Note the **queue** name for your Service Bus namespace. You'll need that in the code.  

### [Connection string](#tab/connection-string)

Note the following, which you'll use in the code below:
* Service Bus namespace **connection string** 
* Service Bus namespace **queue** you created

---

>[!NOTE]
> This tutorial works with samples that you can copy and run using Python. For instructions on how to create a Python application, see [Create and deploy a Python application to an Azure Website](../app-service/quickstart-python.md). For more information about installing packages used in this tutorial, see the [Python Installation Guide](/azure/developer/python/sdk/azure-sdk-install).

[!INCLUDE [service-bus-create-namespace-portal](./includes/service-bus-create-namespace-portal.md)]

[!INCLUDE [service-bus-create-queue-portal](./includes/service-bus-create-queue-portal.md)]

[!INCLUDE [service-bus-passwordless-template-tabbed](../../includes/passwordless/service-bus/service-bus-passwordless-template-tabbed.md)]

## Use pip to install packages

### [Passwordless (Recommended)](#tab/passwordless)

1. To install the required Python packages for this Service Bus tutorial, open a command prompt that has Python in its path, change the directory to the folder where you want to have your samples.

1. Install the following packages: 

    ```shell
    pip install azure-servicebus
    pip install azure-identity
    pip install aiohttp
    ```

### [Connection string](#tab/connection-string)

1. To install the required Python packages for this Service Bus tutorial, open a command prompt that has Python in its path, change the directory to the folder where you want to have your samples.

1. Install the following package: 

    ```bash
    pip install azure-servicebus
    ```

---

## Send messages to a queue

The following sample code shows you how to send a message to a queue. Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/), create a file *send.py*, and add the following code into it.

### [Passwordless (Recommended)](#tab/passwordless)

1. Add import statements.

    ```python
    import asyncio
    from azure.servicebus.aio import ServiceBusClient
    from azure.servicebus import ServiceBusMessage
    from azure.identity.aio import DefaultAzureCredential
    ```
1. Add constants and define a credential.

    ```python
    FULLY_QUALIFIED_NAMESPACE = "FULLY_QUALIFIED_NAMESPACE"
    QUEUE_NAME = "QUEUE_NAME"

    credential = DefaultAzureCredential()
    ```

    > [!IMPORTANT]
    > - Replace `FULLY_QUALIFIED_NAMESPACE` with the fully qualified namespace for your Service Bus namespace.
    > - Replace `QUEUE_NAME` with the name of the queue. 

1. Add a method to send a single message.

    ```python
    async def send_single_message(sender):
        # Create a Service Bus message and send it to the queue
        message = ServiceBusMessage("Single Message")
        await sender.send_messages(message)
        print("Sent a single message")
    ```

    The sender is an object that acts as a client for the queue you created. You'll create it later and send as an argument to this function.

1. Add a method to send a list of messages.

    ```python
    async def send_a_list_of_messages(sender):
        # Create a list of messages and send it to the queue
        messages = [ServiceBusMessage("Message in list") for _ in range(5)]
        await sender.send_messages(messages)
        print("Sent a list of 5 messages")
    ```

1. Add a method to send a batch of messages.

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
            # Send the batch of messages to the queue
            await sender.send_messages(batch_message)
        print("Sent a batch of 10 messages")
    ```

1. Create a Service Bus client and then a queue sender object to send messages.

    ```python
    async def run():
        # create a Service Bus client using the credential
        async with ServiceBusClient(
            fully_qualified_namespace=FULLY_QUALIFIED_NAMESPACE,
            credential=credential,
            logging_enable=True) as servicebus_client:
            # get a Queue Sender object to send messages to the queue
            sender = servicebus_client.get_queue_sender(queue_name=QUEUE_NAME)
            async with sender:
                # send one message
                await send_single_message(sender)
                # send a list of messages
                await send_a_list_of_messages(sender)
                # send a batch of messages
                await send_batch_message(sender)
    
            # Close credential when no longer needed.
            await credential.close()
    ```

1. Call the `run` method and print a message.

    ```python
    asyncio.run(run())
    print("Done sending messages")
    print("-----------------------")
    ```

### [Connection string](#tab/connection-string)

1. Add import statements.

    ```python
    import asyncio
    from azure.servicebus.aio import ServiceBusClient
    from azure.servicebus import ServiceBusMessage
    ```

1. Add constants. 

    ```python
    NAMESPACE_CONNECTION_STR = "NAMESPACE_CONNECTION_STR"
    QUEUE_NAME = "QUEUE_NAME"
    ```

    > [!IMPORTANT]
    > - Replace `NAMESPACE_CONNECTION_STR` with the connection string for your Service Bus namespace.
    > - Replace `QUEUE_NAME` with the name of the queue. 

1. Add a method to send a single message.

    ```python
    async def send_single_message(sender):
        # Create a Service Bus message and send it to the queue
        message = ServiceBusMessage("Single Message")
        await sender.send_messages(message)
        print("Sent a single message")
    ```

    The sender is an object that acts as a client for the queue you created. You'll create it later and send as an argument to this function.

1. Add a method to send a list of messages.

    ```python
    async def send_a_list_of_messages(sender):
        # Create a list of messages and send it to the queue
        messages = [ServiceBusMessage("Message in list") for _ in range(5)]
        await sender.send_messages(messages)
        print("Sent a list of 5 messages")
    ```

1. Add a method to send a batch of messages.

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
            # Send the batch of messages to the queue
            await sender.send_messages(batch_message)
        print("Sent a batch of 10 messages")
    ```

1. Create a Service Bus client and then a queue sender object to send messages.

    ```python
    async def run():
        # create a Service Bus client using the connection string
        async with ServiceBusClient.from_connection_string(
            conn_str=NAMESPACE_CONNECTION_STR,
            logging_enable=True) as servicebus_client:
            # Get a Queue Sender object to send messages to the queue
            sender = servicebus_client.get_queue_sender(queue_name=QUEUE_NAME)
            async with sender:
                # Send one message
                await send_single_message(sender)
                # Send a list of messages
                await send_a_list_of_messages(sender)
                # Send a batch of messages
                await send_batch_message(sender)
    ```

1. Call the `run` method and print a message.

    ```python
    asyncio.run(run())
    print("Done sending messages")
    print("-----------------------")
    ```

---

## Receive messages from a queue

The following sample code shows you how to receive messages from a queue. The code shown receives new messages until it doesn't receive any new messages for 5 (`max_wait_time`) seconds.

Open your favorite editor, such as [Visual Studio Code](https://code.visualstudio.com/), create a file *recv.py*, and add the following code into it.

### [Passwordless (Recommended)](#tab/passwordless)

1. Similar to the send sample, add `import` statements, define constants that you should replace with your own values, and define a credential.

    ```python
    import asyncio
    
    from azure.servicebus.aio import ServiceBusClient
    from azure.identity.aio import DefaultAzureCredential
    
    FULLY_QUALIFIED_NAMESPACE = "FULLY_QUALIFIED_NAMESPACE"
    QUEUE_NAME = "QUEUE_NAME"
    
    credential = DefaultAzureCredential()
    ```

1. Create a Service Bus client and then a queue receiver object to receive messages.

    ```python
    async def run():
        # create a Service Bus client using the connection string
        async with ServiceBusClient(
            fully_qualified_namespace=FULLY_QUALIFIED_NAMESPACE,
            credential=credential,
            logging_enable=True) as servicebus_client:
    
            async with servicebus_client:
                # get the Queue Receiver object for the queue
                receiver = servicebus_client.get_queue_receiver(queue_name=QUEUE_NAME)
                async with receiver:
                    received_msgs = await receiver.receive_messages(max_wait_time=5, max_message_count=20)
                    for msg in received_msgs:
                        print("Received: " + str(msg))
                        # complete the message so that the message is removed from the queue
                        await receiver.complete_message(msg)
    
            # Close credential when no longer needed.
            await credential.close()
    ```

1. Call the `run` method.

    ```python
    asyncio.run(run())
    ```

### [Connection string](#tab/connection-string)

1. Similar to the send sample, add `import` statements and define constants that you should replace with your own values.

    ```python
    import asyncio
    from azure.servicebus.aio import ServiceBusClient

    NAMESPACE_CONNECTION_STR = "NAMESPACE_CONNECTION_STR"
    QUEUE_NAME = "QUEUE_NAME"
    ```

1. Create a Service Bus client and then a queue receiver object to receive messages.

    ```python
    async def run():
        # create a Service Bus client using the connection string
        async with ServiceBusClient.from_connection_string(
            conn_str=NAMESPACE_CONNECTION_STR,
            logging_enable=True) as servicebus_client:
    
            async with servicebus_client:
                # get the Queue Receiver object for the queue
                receiver = servicebus_client.get_queue_receiver(queue_name=QUEUE_NAME)
                async with receiver:
                    received_msgs = await receiver.receive_messages(max_wait_time=5, max_message_count=20)
                    for msg in received_msgs:
                        print("Received: " + str(msg))
                        # complete the message so that the message is removed from the queue
                        await receiver.complete_message(msg)
    ```

1. Call the `run` method.

    ```python
    asyncio.run(run())
    ```

---

## Run the app

Open a command prompt that has Python in its path, and then run the code to send and receive messages from the queue.

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

Select the queue on this **Overview** page to navigate to the **Service Bus Queue** page. You can also see the **incoming** and **outgoing** message count on this page. You also see other information such as the **current size** of the queue and **active message count**. 

:::image type="content" source="./media/service-bus-python-how-to-use-queues/queue-details.png" alt-text="Queue details":::


## Next steps

See the following documentation and samples: 

- [Azure Service Bus client library for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/servicebus/azure-servicebus)
- [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/servicebus/azure-servicebus/samples). 
    - The **sync_samples** folder has samples that show you how to interact with Service Bus in a synchronous manner. In this quick start, you used this method. 
    - The **async_samples** folder has samples that show you how to interact with Service Bus in an asynchronous manner. 
- [azure-servicebus reference documentation](/python/api/azure-servicebus/azure.servicebus?preserve-view=true)
