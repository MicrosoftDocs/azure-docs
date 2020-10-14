---
title: 'Use Azure Service Bus queues with Python azure-servicebus package version 7.0.0'
description: This article shows you how to use azure-servicebus version 7.0.0 Python package to send messages to, and receive messages from Azure Service Bus queues. 
author: spelluru
documentationcenter: python
ms.devlang: python
ms.topic: quickstart
ms.date: 06/23/2020
ms.author: spelluru
ms.custom: seo-python-october2019, devx-track-python
---

# Quickstart: Use Azure Service Bus queues with Python (azure-servicebus version 7.0.0)
This article shows you how to use Python to send messages to, and receive messages from Azure Service Bus queues. 

> [!NOTE]
> This quickstart uses the 7.0.0 version of the azure-servicebus package. For a quickstart that uses the old 0.50.3 version of the package, see [Send and receive events using azure-sevicebus (0.50.3 version)](service-bus-python-how-to-use-queues-legacy.md). For information about different versions of the azure-servicebus package, See the [Release history](https://pypi.org/project/azure-servicebus/7.0.0b7/#history).

## Prerequisites
- An Azure subscription. You can activate your [Visual Studio or MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- A Service Bus namespace, created by following the steps at [Quickstart: Use the Azure portal to create a Service Bus topic and subscriptions](service-bus-quickstart-topics-subscriptions-portal.md). Copy the primary connection string from the **Shared access policies** screen to use later in this article. 
- Python 3.5x or higher, with the [Python Azure Service Bus][Python Azure Service Bus package] package installed. For more information, see the [Python Installation Guide](/azure/developer/python/azure-sdk-install). 

## Send messages to a queue
The following sample code shows you how to send a batch of messages to a queue. See code comments for details. 
    
```python
import os
import asyncio
from azure.servicebus import Message
from azure.servicebus.aio import ServiceBusClient

connection_string = "<CONNECTION STRING TO SERVICE BUS NAMESPACE>"
queue_name = "<QUEUE NAME>"

async def main():    
    # create a Service Bus Client using the connection string for the namespace
    async with ServiceBusClient.from_connection_string(connection_string) as servicebus_client:

        # create a Queue Sender for the queue
        async with servicebus_client.get_queue_sender(queue_name) as queue_sender:

            # create a batch and add three messages to it
            batch_message = await queue_sender.create_batch()
            batch_message.add(Message("First message"))
            batch_message.add(Message("Second message"))
            batch_message.add(Message("Third message"))

            # send the batch of three messages to the queue
            await queue_sender.send_messages(batch_message)
            print ("Sent a batch of three messages to the queue: " + queue_name)           

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
```

> [!IMPORTANT]
> - Replace `<CONNECTION STRING TO SERVICE BUS NAMESPACE>` with the connection string to your Service Bus namespace.
> - Replace `<QUEUE NAME>` with the name of the queue.
    
## Receive messages from a queue
Add the following code after the print statement in the main method to receive messages from the queue. 

```python
        # create a Queue Receiver for the queue
        async with servicebus_client.get_queue_receiver(queue_name, max_wait_time=5) as queue_receiver:
            
            # iterate over all the received messages
            async for msg in queue_receiver:
                # print the message
                print("Received: " + str(msg))

                # complete the message to denote that processing is done and to remove it from the queue
                await msg.complete()
```

Here's the complete code: 

```python

import os
import asyncio
from azure.servicebus import Message
from azure.servicebus.aio import ServiceBusClient

connection_string = "<CONNECTION STRING TO SERVICE BUS NAMESPACE>"
queue_name = "<QUEUE NAME>"

async def main():
    # create a Service Bus Client using the connection string for the namespace
    async with ServiceBusClient.from_connection_string(connection_string) as servicebus_client:

        # create a Queue Sender for the queue
        async with servicebus_client.get_queue_sender(queue_name) as queue_sender:

            # create a batch and add three messages to it
            batch_message = await queue_sender.create_batch()
            batch_message.add(Message("First message"))
            batch_message.add(Message("Second message"))
            batch_message.add(Message("Third message"))

            # send the batch of three messages to the queue
            await queue_sender.send_messages(batch_message)
            print ("Sent a batch of three messages to the queue: " + queue_name)           

        # create a Queue Receiver for the queue
        async with servicebus_client.get_queue_receiver(queue_name, max_wait_time=5) as queue_receiver:
            
            # iterate over all the received messages
            async for msg in queue_receiver:
                # print the message
                print("Received: " + str(msg))

                # complete the message to denote that processing is done and to remove it from the queue
                await msg.complete()
            

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
```

## Run the app
When you run the application, you should see the following output: 

:::image type="content" source="./media/service-bus-python-how-to-use-queues/output.png" alt-text="Program output":::

## Next steps
Check out our [GitHub repository with samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/servicebus/azure-servicebus/samples). 

[Azure portal]: https://portal.azure.com
[Python Azure Service Bus package]: https://pypi.python.org/pypi/azure-servicebus  
[Queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
[Service Bus quotas]: service-bus-quotas.md
