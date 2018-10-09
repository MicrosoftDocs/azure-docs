---
title: Send events to Azure Event Hubs using Python | Microsoft Docs
description: Get started sending events to Event Hubs using Python
services: event-hubs
author: sethmanheim
manager: femila

ms.service: event-hubs
ms.workload: core
ms.topic: article
ms.date: 07/26/2018
ms.author: sethm

---

# Send events to Event Hubs using Python

Azure Event Hubs is a highly scalable event management system that can handle millions of events per second, enabling applications to process and analyze massive amounts of data produced by connected devices and other systems. Once collected into an event hub, you can receive and handle events using in-process handlers or by forwarding to other analytics systems.

To learn more about Event Hubs, see the [Event Hubs overview][Event Hubs overview].

This tutorial describes how to send events to an event hub from an application written in Python. To receive events, see [the corresponding Receive article](event-hubs-python-get-started-receive.md).

Code in this tutorial is taken from [these GitHub samples](https://github.com/Azure/azure-event-hubs-python/tree/master/examples), which you can examine to see the full working application, including import
statements and variable declarations. Other examples are available in the same GitHub folder.

## Prerequisites

To complete this tutorial, you need the following prerequisites:

- Python 3.4 or later.
- An existing Event Hubs namespace and event hub. You can create these entities by following the instructions in [this article](event-hubs-create.md). 

[!INCLUDE [create-account-note](../../includes/create-account-note.md)]


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

## Send events

To run the script, open a command prompt that has Python in its path, and then run this command:

```bash
start python send.py
```
 
## Next steps

Now that you've sent events to an event hub using Python, to receive events see [the corresponding Receive article](event-hubs-python-get-started-receive.md).

Visit the following pages to learn more about Event Hubs:

* [Event Hubs overview][Event Hubs overview]
* [Create an event hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.md)

<!-- Links -->
[Event Hubs overview]: event-hubs-about.md
[Visual Studio Code]: https://code.visualstudio.com/
[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
