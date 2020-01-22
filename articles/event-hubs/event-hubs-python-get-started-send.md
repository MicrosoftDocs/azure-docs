---
title: 'Quickstart: Send and receive events using Python - Azure Event Hubs'
description: 'Quickstart: This walkthrough shows how to create and run Python scripts that send events to or receive events from Azure Event Hubs.'
services: event-hubs
author: ShubhaVijayasarathy
manager: femila

ms.service: event-hubs
ms.workload: core
ms.topic: quickstart
ms.date: 01/08/2020
ms.author: shvija

---

# Quickstart: Send and receive events with Event Hubs using Python

Azure Event Hubs is a Big Data streaming platform and event ingestion service that can receive and process millions of events per second. Event Hubs can process and store events, data, or telemetry from distributed software and devices. Data sent to an event hub can be transformed and stored using any real-time analytics provider or batching/storage adapters. For more information about Event Hubs, see [Azure Event Hubs](event-hubs-about.md) and [Features and terminology in Azure Event Hubs](event-hubs-features.md).

This quickstart shows how to create Python applications that send events to and receive events from an event hub. 

> [!IMPORTANT]
> This quickstart uses version 1 of the Azure Event Hubs Python SDK. If you are new to Azure Event Hubs, use version 5 of the Python SDK. For a quickstart that uses version 5 of the Python SDK, see [this article](get-started-python-send-v2.md). To migrate existing code from version 1 to version 5, see the [migration guide](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/eventhub/azure-eventhub/migration_guide.md).


> [!NOTE]
> Instead of working through the quickstart, you can download and run the [sample apps](https://github.com/Azure/azure-event-hubs-python/tree/master/examples) from GitHub. Replace the `EventHubConnectionString` and `EventHubName` strings with your event hub values. 

## Prerequisites

To complete this quickstart, you need the following prerequisites:

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.
- An active Event Hubs namespace and event hub, created by following the instructions at [Quickstart: Create an event hub using Azure portal](event-hubs-create.md). Make a note of the namespace and event hub names to use later in this walkthrough. 
- The shared access key name and primary key value for your Event Hubs namespace. Get the access key name and value by following the instructions at [Get connection string](event-hubs-get-connection-string.md#get-connection-string-from-the-portal). The default access key name is **RootManageSharedAccessKey**. Copy the key name and the primary key value to use later in this walkthrough. 
- Python 3.4 or later, with `pip` installed and updated.
- The Python package for Event Hubs. To install the package, run this command in a command prompt that has Python in its path: 
  
  ```cmd
  pip install azure-eventhub
  ```
  
  > [!NOTE]
  > The code in this quickstart uses the current stable version 1.3.1 of the Event Hubs SDK. For sample code that uses the preview version of the SDK, see [https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventhub/azure-eventhubs/examples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventhub/azure-eventhubs/examples).

## Send events

To create a Python application that sends events to an event hub:

1. Open your favorite Python editor, such as [Visual Studio Code](https://code.visualstudio.com/)
2. Create a new file called *send.py*. This script sends 100 events to your event hub.
3. Paste the following code into *send.py*, replacing the Event Hubs \<namespace>, \<eventhub>, \<AccessKeyName>, and \<primary key value> with your values: 
   
   ```python
   import sys
   import logging
   import datetime
   import time
   import os
   
   from azure.eventhub import EventHubClient, Sender, EventData
   
   logger = logging.getLogger("azure")
   
   # Address can be in either of these formats:
   # "amqps://<URL-encoded-SAS-policy>:<URL-encoded-SAS-key>@<namespace>.servicebus.windows.net/eventhub"
   # "amqps://<namespace>.servicebus.windows.net/<eventhub>"
   # SAS policy and key are not required if they are encoded in the URL
   
   ADDRESS = "amqps://<namespace>.servicebus.windows.net/<eventhub>"
   USER = "<AccessKeyName>"
   KEY = "<primary key value>"
   
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
               message = "Message {}".format(i)
               sender.send(EventData(message))
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
   
4. Save the file. 

To run the script, from the directory where you saved *send.py*, run this command:

```cmd
start python send.py
```

Congratulations! You have now sent messages to an event hub.

## Receive events

To create a Python application that receives events from an event hub:

1. In your Python editor, create a file called *recv.py*.
2. Paste the following code into *recv.py*, replacing the Event Hubs \<namespace>, \<eventhub>, \<AccessKeyName>, and \<primary key value> with your values: 
   
   ```python
   import os
   import sys
   import logging
   import time
   from azure.eventhub import EventHubClient, Receiver, Offset
   
   logger = logging.getLogger("azure")
   
   # Address can be in either of these formats:
   # "amqps://<URL-encoded-SAS-policy>:<URL-encoded-SAS-key>@<mynamespace>.servicebus.windows.net/myeventhub"
   # "amqps://<namespace>.servicebus.windows.net/<eventhub>"
   # SAS policy and key are not required if they are encoded in the URL
   
   ADDRESS = "amqps://<namespace>.servicebus.windows.net/<eventhub>"
   USER = "<AccessKeyName>"
   KEY = "<primary key value>"
   
   
   CONSUMER_GROUP = "$default"
   OFFSET = Offset("-1")
   PARTITION = "0"
   
   total = 0
   last_sn = -1
   last_offset = "-1"
   client = EventHubClient(ADDRESS, debug=False, username=USER, password=KEY)
   try:
       receiver = client.add_receiver(
           CONSUMER_GROUP, PARTITION, prefetch=5000, offset=OFFSET)
       client.run()
       start_time = time.time()
       for event_data in receiver.receive(timeout=100):
           print("Received: {}".format(event_data.body_as_str(encoding='UTF-8')))
           total += 1
   
       end_time = time.time()
       client.stop()
       run_time = end_time - start_time
       print("Received {} messages in {} seconds".format(total, run_time))
   
   except KeyboardInterrupt:
       pass
   finally:
       client.stop()
   ```
   
4. Save the file.

To run the script, from the directory where you saved *recv.py*, run this command:

```cmd
start python recv.py
```

## Next steps
For more information about Event Hubs, see the following articles:

- [EventProcessorHost](event-hubs-event-processor-host.md)
- [Features and terminology in Azure Event Hubs](event-hubs-features.md)
- [Event Hubs FAQ](event-hubs-faq.md)

