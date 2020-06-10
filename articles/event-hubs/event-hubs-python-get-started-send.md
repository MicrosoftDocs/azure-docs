---
title: Send or receive events from Azure Event Hubs using Python (old)
description: This walkthrough shows you how to create and run Python scripts that send events to or receive events from Azure Event Hubs using the old azure-eventhub version 1 package. 
services: event-hubs
author: spelluru
manager: femila

ms.service: event-hubs
ms.workload: core
ms.topic: quickstart
ms.date: 01/15/2020
ms.author: spelluru
ms.custom: tracking-python

---

# Quickstart: Send and receive events with Event Hubs using Python (azure-eventhub version 1)
This quickstart shows how to send events to and receive events from an event hub using the **azure-eventhub version 1** Python package. 

> [!WARNING]
> This quickstart uses the old azure-eventhub version 1 package. For a quickstart that uses the latest **version 5** of the package, see [Send and receive events using azure-eventhub version 5](get-started-python-send-v2.md). To move your application from using the old package to new one, see the [Guide to migrate from azure-eventhub version 1 to version 5](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/eventhub/azure-eventhub/migration_guide.md).
 

## Prerequisites
If you are new to Azure Event Hubs, see [Event Hubs overview](event-hubs-about.md) before you do this quickstart. 

To complete this quickstart, you need the following prerequisites:

- **Microsoft Azure subscription**. To use Azure services, including Azure Event Hubs, you need a subscription.  If you don't have an existing Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/) or use your MSDN subscriber benefits when you [create an account](https://azure.microsoft.com).
- Python 3.4 or later, with `pip` installed and updated.
- The Python package for Event Hubs. To install the package, run this command in a command prompt that has Python in its path: 
  
  ```cmd
  pip install azure-eventhub==1.3.*
  ```
- **Create an Event Hubs namespace and an event hub**. The first step is to use the [Azure portal](https://portal.azure.com) to create a namespace of type Event Hubs, and obtain the management credentials your application needs to communicate with the event hub. To create a namespace and an event hub, follow the procedure in [this article](event-hubs-create.md). Then, get the value of access key for the event hub by following instructions from the article: [Get connection string](event-hubs-get-connection-string.md#get-connection-string-from-the-portal). You use the access key in the code you write later in this quickstart. The default key name is: **RootManageSharedAccessKey**. 


## Send events

To create a Python application that sends events to an event hub:

> [!NOTE]
> Instead of working through the quickstart, you can download and run the [sample apps](https://github.com/Azure/azure-event-hubs-python/tree/master/examples) from GitHub. Replace the `EventHubConnectionString` and `EventHubName` strings with your event hub values.

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

