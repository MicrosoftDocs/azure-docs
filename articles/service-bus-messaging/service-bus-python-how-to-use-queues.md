---
title: Use Azure Service Bus queues with Python azure-servicebus package version 7.0.0
description: This article shows you how to use Python to send messages to, and receive messages from Azure Service Bus queues.
documentationcenter: python
author: spelluru
ms.author: spelluru
ms.date: 11/18/2020
ms.topic: quickstart
ms.devlang: python
ms.custom:
  - seo-python-october2019
  - devx-track-python
  - mode-api
---

# Send messages to and receive messages from Azure Service Bus queues (Python)
This article shows you how to use Python to send messages to, and receive messages from Azure Service Bus queues. 

## Prerequisites
- An Azure subscription. You can activate your [Visual Studio or MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- If you don't have a queue to work with, follow steps in the [Use Azure portal to create a Service Bus queue](service-bus-quickstart-portal.md) article to create a queue. Note down the **connection string** for your Service Bus namespace and the name of the **queue** you created.
- Python 2.7 or higher, with the [Python Azure Service Bus](https://pypi.python.org/pypi/azure-servicebus) package installed. For more information, see the [Python Installation Guide](/azure/developer/python/azure-sdk-install). 

## Send messages to a queue

1. Add the following import statement. 

    ```python
    from azure.servicebus import ServiceBusClient, ServiceBusMessage
    ```
2. Add the following constants. 

    ```python
    CONNECTION_STR = "<NAMESPACE CONNECTION STRING>"
    QUEUE_NAME = "<QUEUE NAME>"
    ```

    > [!IMPORTANT]
    > - Replace `<NAMESPACE CONNECTION STRING>` with the connection string for your Service Bus namespace.
    > - Replace `<QUEUE NAME>` with the name of the queue. 
3. Add a method to send a single message.

    ```python
    def send_single_message(sender):
        # create a Service Bus message
        message = ServiceBusMessage("Single Message")
        # send the message to the queue
        sender.send_messages(message)
        print("Sent a single message")
    ```

    The sender is an object that acts as a client for the queue you created. You'll create it later and send as an argument to this function. 
4. Add a method to send a list of messages.

    ```python
    def send_a_list_of_messages(sender):
        # create a list of messages
        messages = [ServiceBusMessage("Message in list") for _ in range(5)]
        # send the list of messages to the queue
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
        # send the batch of messages to the queue
        sender.send_messages(batch_message)
        print("Sent a batch of 10 messages")
    ```
6. Create a Service Bus client and then a queue sender object to send messages.

    ```python
    # create a Service Bus client using the connection string
    servicebus_client = ServiceBusClient.from_connection_string(conn_str=CONNECTION_STR, logging_enable=True)
    with servicebus_client:
        # get a Queue Sender object to send messages to the queue
        sender = servicebus_client.get_queue_sender(queue_name=QUEUE_NAME)
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
 
## Receive messages from a queue
Add the following code after the print statement. This code continually receives new messages until it doesn't receive any new messages for 5 (`max_wait_time`) seconds. 

```python
with servicebus_client:
    # get the Queue Receiver object for the queue
    receiver = servicebus_client.get_queue_receiver(queue_name=QUEUE_NAME, max_wait_time=5)
    with receiver:
        for msg in receiver:
            print("Received: " + str(msg))
            # complete the message so that the message is removed from the queue
            receiver.complete_message(msg)
```

## Full code

```python
# import os
from azure.servicebus import ServiceBusClient, ServiceBusMessage

CONNECTION_STR = "<NAMESPACE CONNECTION STRING>"
QUEUE_NAME = "<QUEUE NAME>"

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
    sender = servicebus_client.get_queue_sender(queue_name=QUEUE_NAME)
    with sender:
        send_single_message(sender)
        send_a_list_of_messages(sender)
        send_batch_message(sender)

print("Done sending messages")
print("-----------------------")

with servicebus_client:
    receiver = servicebus_client.get_queue_receiver(queue_name=QUEUE_NAME, max_wait_time=5)
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

Select the queue on this **Overview** page to navigate to the **Service Bus Queue** page. You can also see the **incoming** and **outgoing** message count on this page. You also see other information such as the **current size** of the queue and **active message count**. 

:::image type="content" source="./media/service-bus-python-how-to-use-queues/queue-details.png" alt-text="Queue details":::


## Next steps
See the following documentation and samples: 

- [Azure Service Bus client library for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/servicebus/azure-servicebus)
- [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/servicebus/azure-servicebus/samples). 
    - The **sync_samples** folder has samples that show you how to interact with Service Bus in a synchronous manner. In this quick start, you used this method. 
    - The **async_samples** folder has samples that show you how to interact with Service Bus in an asynchronous manner. 
- [azure-servicebus reference documentation](/python/api/azure-servicebus/azure.servicebus?preserve-view=true)
