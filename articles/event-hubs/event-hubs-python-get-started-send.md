---
title: Send events to Azure Event Hubs using Python | Microsoft Docs
description: Get started sending events to Event Hubs using Python
services: event-hubs
author: ShubhaVijayasarathy
manager: femila

ms.service: event-hubs
ms.workload: core
ms.topic: article
ms.date: 10/16/2018
ms.author: shvija

---

# Send events to Event Hubs using Python

Azure Event Hubs is a Big Data streaming platform and event ingestion service, capable of receiving and processing millions of events per second. Event Hubs can process and store events, data, or telemetry produced by distributed software and devices. Data sent to an event hub can be transformed and stored using any real-time analytics provider or batching/storage adapters. For detailed overview of Event Hubs, see [Event Hubs overview](event-hubs-about.md) and [Event Hubs features](event-hubs-features.md).

This tutorial describes how to send events to an event hub from an application written in Python. 

> [!NOTE]
> You can download this quickstart as a sample from the [GitHub](https://github.com/Azure/azure-event-hubs-python/tree/master/examples), replace `EventHubConnectionString` and `EventHubName` strings with your event hub values, and run it. Alternatively, you can follow the steps in this tutorial to create your own.

## Prerequisites

To complete this tutorial, you need the following prerequisites:

- Python 3.4 or later.


## Create an Event Hubs namespace and an event hub
The first step is to use the [Azure portal](https://portal.azure.com) to create a namespace of type Event Hubs, and obtain the management credentials your application needs to communicate with the event hub. To create a namespace and an event hub, follow the procedure in [this article](event-hubs-create.md), then proceed with the following steps in this tutorial.

## Install Python package

To install the Python package for Event Hubs, open a command prompt that has Python in its path, and then run this command: 

```bash
pip install azure-eventhub
```

## Create a Python script to send events

Next, create a Python application that sends events to an event hub:

1. Open your favorite Python editor, such as [Visual Studio Code][Visual Studio Code].
2. Create a script called **send.py**. This script sends 100 events to your event hub.
3. Paste the following code into send.py, replacing the ADDRESS, USER, and KEY values with the values you obtained from the Azure portal in the previous section: 

```python
import sys
import logging
import datetime
import time
import os

from azure.eventhub import EventHubClient, Sender, EventData

logger = logging.getLogger("azure")

# Address can be in either of these formats:
# "amqps://<URL-encoded-SAS-policy>:<URL-encoded-SAS-key>@<mynamespace>.servicebus.windows.net/myeventhub"
# "amqps://<mynamespace>.servicebus.windows.net/myeventhub"
# For example:
ADDRESS = "amqps://mynamespace.servicebus.windows.net/myeventhub"

# SAS policy and key are not required if they are encoded in the URL
USER = "RootManageSharedAccessKey"
KEY = "namespaceSASKey"

try:
    if not ADDRESS:
        raise ValueError("No EventHubs URL supplied.")

    # Create Event Hubs client
    client = EventHubClient(ADDRESS, debug=False, username=USER, password=KEY)
    sender = client.add_sender(partition="0")
    client.run()
    try:
        start_time = time.time()
        for i in range(100):
            print("Sending message: {}".format(i))
            sender.send(EventData(str(i)))
    except:
        raise
    finally:
        end_time = time.time()
        client.stop()
        run_time = end_time - start_time
        logger.info("Runtime: {} seconds".format(run_time))

except KeyboardInterrupt:
    pass
```

## Run application to send events

To run the script, open a command prompt that has Python in its path, and then run this command:

```bash
start python send.py
```

Congratulations! You have now sent messages to an event hub.
 
## Next steps
In this quickstart, you have sent messages to an event hub using Python. To learn how to receive events from an event hub using Python, see [Receive events from event hub - Python](event-hubs-python-get-started-receive.md).

<!-- Links -->
[Event Hubs overview]: event-hubs-about.md
[Visual Studio Code]: https://code.visualstudio.com/
[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
