---
title: 'Use Azure Service Bus topics and subscriptions with Python azure-servicebus package version 7.0.0'
description: This article shows you how to use Python azure-servicebus package version 7.0.0 to send messages to a topic and receive messages from subscription.
documentationcenter: python
author: spelluru
ms.devlang: python
ms.topic: quickstart
ms.date: 11/09/2020
ms.author: spelluru
ms.custom: devx-track-python
---

# Send messages to an Azure Service Bus topic and receive messages from subscriptions to the topic (Python)
This article describes how to use the [azure-servicebus](https://pypi.org/project/azure-servicebus) Python package to send messages an Azure Service Bus topic and receive messages from a subscription to the topic. 

## Prerequisites
- An Azure subscription. You can activate your [Visual Studio or MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- Follow steps in the [Quickstart: Use the Azure portal to create a Service Bus topic and subscriptions to the topic](service-bus-quickstart-topics-subscriptions-portal.md). Note down the connection string, topic name, and a subscription name. You will use only one subscription for this quickstart. 
- Python 2.7 or higher, with the [Azure Python SDK][Azure Python package] package installed. For more information, see the [Python Installation Guide](/azure/developer/python/azure-sdk-install).

## Send messages to a topic
The following sample code shows you how to send a batch of messages to a Service Bus topic. 

> [!IMPORTANT]
> - Replace `<CONNECTION STRING TO SERVICE BUS NAMESPACE>` with the connection string to your Service Bus namespace.
> - Replace `<TOPIC NAME>` with the name of the topic.

```python
import os
import asyncio
from azure.servicebus import ServiceBusMessage
from azure.servicebus.aio import ServiceBusClient

connection_string = "<CONNECTION STRING TO SERVICE BUS NAMESPACE>"
topic_name = "<TOPIC NAME>"

async def main():    
    # create a Service Bus Client using the connection string for the namespace
    async with ServiceBusClient.from_connection_string(connection_string) as servicebus_client:

        # create a Topic Sender for the topic
        async with servicebus_client.get_topic_sender(topic_name) as topic_sender:

            # create a batch and add three messages to it
            batch_message = await topic_sender.create_message_batch()
            batch_message.add_message(ServiceBusMessage("First message"))
            batch_message.add_message(ServiceBusMessage("Second message"))
            batch_message.add_message(ServiceBusMessage("Third message"))

            # send the batch of three messages to the topic
            await topic_sender.send_messages(batch_message)
            print ("Sent a batch of three messages to the topic: " + topic_name)           
```

## Receive messages from a subscription
Add the following code after the print statement in the main method to receive messages from the subscription. 

```python
        # create a Subscription Receiver for the subscription
        async with servicebus_client.get_subscription_receiver(topic_name, subscription_name) as subscription_receiver:

            # receive messages
            received_msgs = await subscription_receiver.receive_messages(max_message_count=10, max_wait_time=5)

            # iterate over all the received messages
            for msg in received_msgs:

                # print the message
                print("Received: " + str(msg) + " from the subscription: " + subscription_name)

                # complete the message to denote that processing is done
                await subscription_receiver.complete_message(msg);
```

Then, add the following statement to your Python file to asynchronously run the main method.

```python
loop = asyncio.get_event_loop()
loop.run_until_complete(main())
```


## Run app
When you run the application, you should see the following output: 

```console
Sent a batch of three messages to the topic: mytopic
Received: First message from the subscription: S1
Received: Second message from the subscription: S1
Received: Third message from the subscription: S1
Press any key to continue . . .
```

In the Azure portal, navigate to your Service Bus namespace, and select the topic in the bottom pane to see the **Service Bus Topic** page for your topic. On this page, you should see three incoming and three outgoing messages in the **Messages** chart. 

:::image type="content" source="./media/service-bus-java-how-to-use-topics-subscriptions/topic-page-portal.png" alt-text="Incoming and outgoing messages":::

If you comment out the receive code and run the app again, on the **Service Bus Topic** page, you see six incoming messages (3 new) but three outgoing messages. 

:::image type="content" source="./media/service-bus-java-how-to-use-topics-subscriptions/updated-topic-page.png" alt-text="Updated topic page":::

On this page, if you select a subscription, you get to the **Service Bus Subscription** page. You can see the active message count, dead-letter message count, and more on this page. In this example, there are three active messages that aren't received by a receiver yet. 

:::image type="content" source="./media/service-bus-java-how-to-use-topics-subscriptions/active-message-count.png" alt-text="Active message count":::


## Next steps
Check out our [GitHub repository with samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/servicebus/azure-servicebus/samples). 
