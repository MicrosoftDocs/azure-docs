---
title: Get started with Azure Service Bus topics (Python)
description: This tutorial shows you how to send messages to Azure Service Bus topics and receive messages from topics' subscriptions using the Python programming language.
documentationcenter: python
author: spelluru
ms.author: spelluru
ms.date: 01/16/2023
ms.topic: quickstart
ms.devlang: python
ms.custom: devx-track-python, mode-api
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
> This quick start provides step-by-step instructions for a simple scenario of sending a batch of messages to a Service Bus topic and receiving those messages from a subscription of the topic. You can find pre-built Python samples for Azure Service Bus in the [Azure SDK for Python repository on GitHub](https://github.com/azure/azure-sdk-for-python/tree/main/sdk/servicebus/azure-servicebus/samples). 


## Prerequisites

- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- Python 3.7 or higher, with the [Azure Python SDK][/azure/developer/python/sdk/azure-sdk-overview] package installed.

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

>[!NOTE]
> This tutorial works with samples that you can copy and run using Python. For instructions on how to create a Python application, see [Create and deploy a Python application to an Azure Website](../app-service/quickstart-python.md). For more information about installing packages used in this tutorial, see the [Python Installation Guide](/azure/developer/python/sdk/azure-sdk-install).

[!INCLUDE [service-bus-create-namespace-portal](./includes/service-bus-create-namespace-portal.md)]

[!INCLUDE [service-bus-create-topic-subscription-portal](./includes/service-bus-create-topic-subscription-portal.md)]

[!INCLUDE [service-bus-passwordless-template-tabbed](../../includes/passwordless/service-bus/service-bus-passwordless-template-tabbed.md)]

## Use pip to install packages

### [Passwordless (Recommended)](#tab/passwordless)

1. To install the required Python packages for this Service Bus tutorial, open a command prompt that has Python in its path, change the directory to the folder where you want to have your samples.

1. Install the following packages by running: 

    ```shell
    pip install azure-servicebus
    pip install azure-identity
    pip install aiohttp
    ```

### [Connection string](#tab/connection-string)

1. To install the required Python packages for this Service Bus tutorial, open a command prompt that has Python in its path, change the directory to the folder where you want to have your samples.

1. Install the following packages by running: 

    ```bash
    pip install azure-servicebus
    pip install aiohttp
    ```

---

## Send messages to a topic

1. Add the following import statement. 

    ```python
    from azure.servicebus import ServiceBusClient, ServiceBusMessage
    ```
2. Add the following constants. 

    ```python
    CONNECTION_STR = "<NAMESPACE CONNECTION STRING>"
    TOPIC_NAME = "<TOPIC NAME>"
    SUBSCRIPTION_NAME = "<SUBSCRIPTION NAME>"
    ```
    
    > [!IMPORTANT]
    > - Replace `<NAMESPACE CONNECTION STRING>` with the connection string for your namespace.
    > - Replace `<TOPIC NAME>` with the name of the topic.
    > - Replace `<SUBSCRIPTION NAME>` with the name of the subscription to the topic. 
3. Add a method to send a single message.

    ```python
    def send_single_message(sender):
        # create a Service Bus message
        message = ServiceBusMessage("Single Message")
        # send the message to the topic
        sender.send_messages(message)
        print("Sent a single message")
    ```

    The sender is a object that acts as a client for the topic you created. You'll create it later and send as an argument to this function. 
4. Add a method to send a list of messages.

    ```python
    def send_a_list_of_messages(sender):
        # create a list of messages
        messages = [ServiceBusMessage("Message in list") for _ in range(5)]
        # send the list of messages to the topic
        sender.send_messages(messages)
        print("Sent a list of 5 messages")
    ```
5. Add a method to send a batch of messages.

    ```python
    def send_batch_message(sender):
        # create a batch of messages
        batch_message = sender.create_message_batch()
        for _ in range(10):
            try:
                # add a message to the batch
                batch_message.add_message(ServiceBusMessage("Message inside a ServiceBusMessageBatch"))
            except ValueError:
                # ServiceBusMessageBatch object reaches max_size.
                # New ServiceBusMessageBatch object can be created here to send more data.
                break
        # send the batch of messages to the topic
        sender.send_messages(batch_message)
        print("Sent a batch of 10 messages")
    ```
6. Create a Service Bus client and then a topic sender object to send messages.

    ```python
    # create a Service Bus client using the connection string
    servicebus_client = ServiceBusClient.from_connection_string(conn_str=CONNECTION_STR, logging_enable=True)
    with servicebus_client:
        # get a Topic Sender object to send messages to the topic
        sender = servicebus_client.get_topic_sender(topic_name=TOPIC_NAME)
        with sender:
            # send one message        
            send_single_message(sender)
            # send a list of messages
            send_a_list_of_messages(sender)
            # send a batch of messages
            send_batch_message(sender)
    
    print("Done sending messages")
    print("-----------------------")
    ```
 
## Receive messages from a subscription
Add the following code after the print statement. This code continually receives new messages until it doesn't receive any new messages for 5 (`max_wait_time`) seconds. 

```python
with servicebus_client:
    # get the Subscription Receiver object for the subscription    
    receiver = servicebus_client.get_subscription_receiver(topic_name=TOPIC_NAME, subscription_name=SUBSCRIPTION_NAME, max_wait_time=5)
    with receiver:
        for msg in receiver:
            print("Received: " + str(msg))
            # complete the message so that the message is removed from the subscription
            receiver.complete_message(msg)
```

## Full code

```python
from azure.servicebus import ServiceBusClient, ServiceBusMessage

CONNECTION_STR = "<NAMESPACE CONNECTION STRING>"
TOPIC_NAME = "<TOPIC NAME>"
SUBSCRIPTION_NAME = "<SUBSCRIPTION NAME>"

def send_single_message(sender):
    message = ServiceBusMessage("Single Message")
    sender.send_messages(message)
    print("Sent a single message")

def send_a_list_of_messages(sender):
    messages = [ServiceBusMessage("Message in list") for _ in range(5)]
    sender.send_messages(messages)
    print("Sent a list of 5 messages")

def send_batch_message(sender):
    batch_message = sender.create_message_batch()
    for _ in range(10):
        try:
            batch_message.add_message(ServiceBusMessage("Message inside a ServiceBusMessageBatch"))
        except ValueError:
            # ServiceBusMessageBatch object reaches max_size.
            # New ServiceBusMessageBatch object can be created here to send more data.
            break
    sender.send_messages(batch_message)
    print("Sent a batch of 10 messages")

servicebus_client = ServiceBusClient.from_connection_string(conn_str=CONNECTION_STR, logging_enable=True)

with servicebus_client:
    sender = servicebus_client.get_topic_sender(topic_name=TOPIC_NAME)
    with sender:
        send_single_message(sender)
        send_a_list_of_messages(sender)
        send_batch_message(sender)

print("Done sending messages")
print("-----------------------")

with servicebus_client:
    receiver = servicebus_client.get_subscription_receiver(topic_name=TOPIC_NAME, subscription_name=SUBSCRIPTION_NAME, max_wait_time=5)
    with receiver:
        for msg in receiver:
            print("Received: " + str(msg))
            receiver.complete_message(msg)
```

## Run the app
When you run the application, you should see the following output: 

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
