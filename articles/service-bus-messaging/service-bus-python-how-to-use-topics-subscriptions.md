---
title: 'Use Azure Service Bus topics and subscriptions with Python azure-servicebus package version 7.0.0'
description: This article shows you how to use Python azure-servicebus package version 7.0.0 to send messages to a topic and receive messages from subscription.
documentationcenter: python
author: spelluru
ms.devlang: python
ms.topic: quickstart
ms.date: 06/23/2020
ms.author: spelluru
ms.custom: devx-track-python
---

# Quickstart: Use Service Bus topics and subscriptions with Python (azure-servicebus package version 7.0.0)
This article describes how to use the [azure-servicebus](https://pypi.org/project/azure-servicebus) Python package to send messages an Azure Service Bus topic and receive messages from a subscription to the topic. 

## Prerequisites
- An Azure subscription. You can activate your [Visual Studio or MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- A Service Bus namespace, created by following the steps at [Quickstart: Use the Azure portal to create a Service Bus topic and subscriptions](service-bus-quickstart-topics-subscriptions-portal.md). Copy the namespace name, shared access key name, and primary key value from the **Shared access policies** screen to use later in this quickstart. 
- Python 3.5x or higher, with the [Azure Python SDK][Azure Python package] package installed. For more information, see the [Python Installation Guide](/azure/developer/python/azure-sdk-install).

## Send messages to a topic
The following sample code shows you how to send a batch of messages to a Service Bus topic. 

1. Creates a `ServiceBusClient` using the connection string to the Service Bus namespace.
1. Gets a **topic sender** object for the topic to send messages to it. 
1. Prepares a batch of three messages.
1. Uses the topic sender object to send the batch of messages to the topic. 

> [!IMPORTANT]
> - Replace `<CONNECTION STRING TO SERVICE BUS NAMESPACE>` with the connection string to your Service Bus namespace.
> - Replace `<TOPIC NAME>` with the name of the topic.

```python
import os
import asyncio
from azure.servicebus import Message
from azure.servicebus.aio import ServiceBusClient

connection_string = "<CONNECTION STRING TO SERVICE BUS NAMESPACE>"
topic_name = "<TOPIC NAME>"

async def main():    
    # create a service bus client using the connection string for the namespace
    async with ServiceBusClient.from_connection_string(connection_string) as servicebus_client:

        # get a topic sender for the topic
        topic_sender = servicebus_client.get_topic_sender(topic_name)

        async with topic_sender:
            
            # create a batch and add three messages to it
            batch_message = await topic_sender.create_batch()
            batch_message.add(Message("First message"))
            batch_message.add(Message("Second message"))
            batch_message.add(Message("Third message"))

            # send the batch of three messages to the topic
            await topic_sender.send_messages(batch_message)
            print ("Sent a batch of three messages to the topic: " + topic_name)           

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
```

## Receive messages from a subscription
The following sample code shows you how to receive messages from a Service Bus subscription. 

1. Creates a `ServiceBusClient` using the connection string to the Service Bus namespace.
1. Gets a **subscription receiver** object for the subscription to receive messages from it. 
1. Receive messages using the subscription receiver object. 

```python
import os
import asyncio
from azure.servicebus import Message
from azure.servicebus.aio import ServiceBusClient

connection_string = "<CONNECTION STRING TO SERVICE BUS NAMESPACE>"
topic_name = "<TOPIC NAME>"
subscription_name = "<SUBSCRIPTION NAME>"

async def main():    
    
    # create a service bus client using the connection string for the namespace
    async with ServiceBusClient.from_connection_string(connection_string) as servicebus_client:
        
        # create a subscription receiver for the subcription
        subscription_receiver = servicebus_client.get_subscription_receiver(topic_name, subscription_name)

        async with subscription_receiver:
            
            # start receiving messages
            received_msgs = await subscription_receiver.receive_messages(max_message_count=10, max_wait_time=30)

            for msg in received_msgs:

                # print the received message
                print("Received from S1 subscription: " + str(msg))

                # complete the message to denote that processing is done and to remove it from the subscription
                await msg.complete()
            

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
```

## Run apps
Run the subscription receiver application and then run the topic sender application. You see the output similar to what's shown in the following images:

### Topic sender
:::image type="content" source="./media/service-bus-python-how-to-use-topics-subscriptions/topic-sender.png" alt-text="Topic sender output":::

### Subscription receiver
:::image type="content" source="./media/service-bus-python-how-to-use-topics-subscriptions/subscription-receiver.png" alt-text="Subscription receiver output":::

> [!NOTE]
> If you create multiple subscriptions for a topic, each subscription gets a copy of the message.

## Next steps
Check out our [GitHub repository with samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/servicebus/azure-servicebus/samples). 
