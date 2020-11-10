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

# Send messages to and receive messages from Azure Service Bus queues (Python)
This article shows you how to use the [azure-servicebus](https://pypi.org/project/azure-servicebus) Python package to send messages to, and receive messages from Azure Service Bus queues. 

## Prerequisites
- An Azure subscription. You can activate your [Visual Studio or MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- If you don't have a queue to work with, follow steps in the [Use Azure portal to create a Service Bus queue](service-bus-quickstart-portal.md) article to create a queue. Note down the **connection string** for your Service Bus namespace and the name of the **queue** you created.
- Python 2.7 or higher, with the [Python Azure Service Bus][Python Azure Service Bus package] package installed. For more information, see the [Python Installation Guide](/azure/developer/python/azure-sdk-install). 

## Send messages to a queue
Add the following code to send a batch of messages to the queue you crated. 
    
```python
import os
import asyncio
from azure.servicebus import ServiceBusMessage
from azure.servicebus.aio import ServiceBusClient

connection_string = "<CONNECTION STRING TO SERVICE BUS NAMESPACE>"
queue_name = "<QUEUE NAME>"

async def main():    
    # create a Service Bus Client using the connection string for the namespace
    async with ServiceBusClient.from_connection_string(connection_string) as servicebus_client:

        # create a Queue Sender for the queue
        async with servicebus_client.get_queue_sender(queue_name) as queue_sender:

            # create a batch and add three messages to it
            batch_message = await queue_sender.create_message_batch()
            batch_message.add_message(ServiceBusMessage("First message"))
            batch_message.add_message(ServiceBusMessage("Second message"))
            batch_message.add_message(ServiceBusMessage("Third message"))

            # send the batch of three messages to the queue
            await queue_sender.send_messages(batch_message)
            print ("Sent a batch of three messages to the queue: " + queue_name)           
```

> [!IMPORTANT]
> - Replace `<CONNECTION STRING TO SERVICE BUS NAMESPACE>` with the connection string to your Service Bus namespace.
> - Replace `<QUEUE NAME>` with the name of the queue.
    
## Receive messages from a queue
Add the following code after the print statement in the main method to receive messages from the queue. 

```python

        # create a Queue Receiver for the queue
        async with servicebus_client.get_queue_receiver(queue_name) as queue_receiver:

            # receive messages
            received_msgs = await queue_receiver.receive_messages(max_message_count=10, max_wait_time=5)

            # iterate over all the received messages
            for msg in received_msgs:

                # print the message
                print("Received: " + str(msg))

                # complete the message to denote that processing is done and to remove it from the queue
                await queue_receiver.complete_message(msg);
```

Then, add the following statement to your Python file to asynchronously run the main method.

```python
loop = asyncio.get_event_loop()
loop.run_until_complete(main())
```

## Run the app
When you run the application, you should see the following output: 

:::image type="content" source="./media/service-bus-python-how-to-use-queues/output.png" alt-text="Program output":::

On the **Overview** page for the Service Bus namespace in the Azure portal, you can see **incoming** and **outgoing** message count. You may need to wait for a minute or so and then refresh the page to see the latest values. 

:::image type="content" source="./media/service-bus-java-how-to-use-queues/overview-incoming-outgoing-messages.png" alt-text="Incoming and outgoing message count":::

Select the queue on this **Overview** page to navigate to the **Service Bus Queue** page. You see the **incoming** and **outgoing** message count on this page too. You also see other information such as the **current size** of the queue, **maximum size**, **active message count**, and so on. 

:::image type="content" source="./media/service-bus-java-how-to-use-queues/queue-details.png" alt-text="Queue details":::

## Next steps
Check out our [GitHub repository with samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/servicebus/azure-servicebus/samples). 

[Azure portal]: https://portal.azure.com
[Python Azure Service Bus package]: https://pypi.python.org/pypi/azure-servicebus  
[Queues, topics, and subscriptions]: service-bus-queues-topics-subscriptions.md
[Service Bus quotas]: service-bus-quotas.md
