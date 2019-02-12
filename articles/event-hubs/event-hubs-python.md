---
title: Use Python to send and receive messages - Azure Event Hubs | Microsoft Docs
description: Learn how to send events to, receive events from, and capture events streaming through Event Hubs using Python. 
keywords:
documentationcenter: ''
services: event-hubs
author: ShubhaVijayasarathy
manager:
editor:

ms.assetid:
ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/26/2018
ms.author: shvija

---

# How to use Azure Event Hubs from a Python application
Azure Event Hubs is a Big Data streaming platform and event ingestion service, capable of receiving and processing millions of events per second. Event Hubs can process and store events, data, or telemetry produced by distributed software and devices. Data sent to an event hub can be transformed and stored using any real-time analytics provider or batching/storage adapters. For more information, see [Introduction to Event Hubs](event-hubs-what-is-event-hubs.md). 

This article provides links to articles that show you how to do the following tasks from an application written in **Python**:

- [Send events to an event hub](#send-events-to-event-hubs)
- [Receive events from an event hub](#receive-events-from-event-hubs)
- Read captured event data from an Azure storage. 

## Prerequisites
- Create an event hub by following one of these quickstarts: [Azure portal](event-hubs-create.md), [Azure CLI](event-hubs-quickstart-cli.md), [Azure PowerShell](event-hubs-quickstart-powershell.md), [Azure Resource Manager template](event-hubs-resource-manager-namespace-event-hub.md). 
- Python 3.4 or later installed on your machine.

## Install Python package

To install the Python package for Event Hubs, open a command prompt that has Python in its path, and then run this command: 

```bash
pip install azure-eventhub
```

## Send events to Event Hubs
The following code shows you how to send events to an event hub from a Python application: 

1. Create variables to hold URL of the event hub, key name, and key value. 

    ```python
    # Import classes from Event Hubs python package
    from azure.eventhub import EventHubClient, Receiver, Offset
    
    # Address can be in either of these formats:
    # "amqps://<URL-encoded-SAS-policy>:<URL-encoded-SAS-key>@<mynamespace>.servicebus.windows.net/myeventhub"
    # "amqps://<mynamespace>.servicebus.windows.net/myeventhub"
    # For example:
    ADDRESS = "amqps://<MyEventHubNamspaceName>.servicebus.windows.net/<MyEventHubName>"
    
    # SAS policy and key are not required if they are encoded in the URL
    USER = "<Name of the access key. Default name: RootManageSharedAccessKey>"
    KEY = "<The access key>"
    ```

2. Create an Event Hubs client, add a sender, run the client, send the event using sender, and then stop the client when you are done. 

    ```python
    # Create an Event Hubs client
    client = EventHubClient(ADDRESS, debug=False, username=USER, password=KEY)
    
    # Add a sender to the client
    sender = client.add_sender(partition="0")
    
    # Run the Event Hub client
    client.run()
    
    # Send event to the event hub
    sender.send(EventData("<MyEventData>"))
    
    # Stop the Event Hubs client
    client.stop()
    
    ```

For a complete tutorial on how to send events to an event hub from an application written in Python, see [this article](event-hubs-python-get-started-send.md).

## Receive events from Event Hubs
The following code shows you how to receive events from an event hub from a Python application: 

```python

# Create an Event Hubs client
client = EventHubClient(ADDRESS, debug=False, username=USER, password=KEY)

# Add a receiver to the client
receiver = client.add_receiver(CONSUMER_GROUP, PARTITION, prefetch=5000, offset=OFFSET)

# Run the Event Hubs client
client.run()

# Receive event data from the event hub
for event_data in receiver.receive(timeout=100):
    last_offset = event_data.offset
    last_sn = event_data.sequence_number
    print("Received: {}, {}".format(last_offset, last_sn))

# Stop the Event Hubs client
client.stop()
```

For a complete tutorial on how to receive events from an event hub from an application written in Python, see [this article](event-hubs-python-get-started-receive.md)

## Read capture event data from Azure Storage
The following code shows you how to read captured event data that's stored in an **Azure blob storage** from a Python application: Enable **Capture** feature for the event hub by following instructions from: [Enable Event Hubs Capture using the Azure portal](event-hubs-capture-enable-through-portal.md). Then, send some events to the event hub before testing the code. 

```python
import os
import string
import json
import avro.schema
from avro.datafile import DataFileReader, DataFileWriter
from avro.io import DatumReader, DatumWriter
from azure.storage.blob import BlockBlobService

def processBlob(filename):
    reader = DataFileReader(open(filename, 'rb'), DatumReader())
    dict = {}
    for reading in reader:
        parsed_json = json.loads(reading["Body"])
        if not 'id' in parsed_json:
            return
        if not dict.has_key(parsed_json['id']):
            list = []
            dict[parsed_json['id']] = list
        else:
            list = dict[parsed_json['id']]
            list.append(parsed_json)
    reader.close()
    for device in dict.keys():
        deviceFile = open(device + '.csv', "a")
        for r in dict[device]:
            deviceFile.write(", ".join([str(r[x]) for x in r.keys()])+'\n')

def startProcessing(accountName, key, container):
    print 'Processor started using path: ' + os.getcwd()
    block_blob_service = BlockBlobService(account_name=accountName, account_key=key)
    generator = block_blob_service.list_blobs(container)
    for blob in generator:
        #content_length == 508 is an empty file, so only process content_length > 508 (skip empty files)
        if blob.properties.content_length > 508:
            print('Downloaded a non empty blob: ' + blob.name)
            cleanName = string.replace(blob.name, '/', '_')
            block_blob_service.get_blob_to_path(container, blob.name, cleanName)
            processBlob(cleanName)
            os.remove(cleanName)
        block_blob_service.delete_blob(container, blob.name)
startProcessing('YOUR STORAGE ACCOUNT NAME', 'YOUR KEY', 'capture')

```

For a complete tutorial on how to read captured Event Hubs data in an Azure blob storage from an application written in Python, see [this article](event-hubs-capture-python.md)

## GitHub samples
You can find more Python samples in the [azure-event-hubs-python Git repository](https://github.com/Azure/azure-event-hubs-python/).

## Next steps
Read through articles in the Concepts section starting from [Event Hubs features overview](event-hubs-features.md).
