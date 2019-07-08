---
title: Read captured data from Python app - Azure Event Hubs | Microsoft Docs
description: Sample that uses the Azure Python SDK to demonstrate using the Event Hubs Capture feature.
services: event-hubs
documentationcenter: ''
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.assetid: bdff820c-5b38-4054-a06a-d1de207f01f6
ms.service: event-hubs
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.custom: seodec18
ms.date: 12/06/2018
ms.author: shvija

---

# Event Hubs Capture walkthrough: Python

Capture is a feature of Azure Event Hubs. You can use it to automatically deliver the streaming data in your event hub to an Azure Blob storage account of your choice. This capability makes it easy to perform batch processing on real-time streaming data. This article describes how to use Event Hubs Capture with Python. For more information about Event Hubs Capture, see the [overview article](event-hubs-capture-overview.md).

This sample uses the [Azure Python SDK](https://azure.microsoft.com/develop/python/) to demonstrate the Capture feature. The sender.py program sends simulated environmental telemetry to Event Hubs in JSON format. The event hub is configured to use the Capture feature to write this data to Blob storage in batches. The capturereader.py app reads these blobs and creates an append file per device. The app then writes the data into .csv files.

## What you'll accomplish

1. Create an Azure Blob storage account and a blob container within it, by using the Azure portal.
2. Create an Event Hubs namespace, by using the Azure portal.
3. Create an event hub with the Capture feature enabled, by using the Azure portal.
4. Send data to the event hub by using a Python script.
5. Read the files from the capture and process them by using another Python script.

## Prerequisites

- Python 2.7.x
- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.
- An active [Event Hubs namespace and event hub](event-hubs-create.md). 
- Enable **Capture** feature for the event hub by following instructions from: [Enable Event Hubs Capture using the Azure portal](event-hubs-capture-enable-through-portal.md)

## Create an Azure Blob storage account
1. Sign in to the [Azure portal][Azure portal].
2. In the left pane of the portal, select **New** > **Storage** > **Storage Account**.
3. Complete the selections in the **Create storage account** pane, and then select **Create**.
   
   !["Create storage account" pane][1]
4. After you see the **Deployments Succeeded** message, select the name of the new storage account and in the **Essentials** pane, and then select **Blobs**. When the **Blob service** pane opens, select **+ Container** at the top. Name the container **capture**, and then close the **Blob service** pane.
5. Select **Access keys** in the left pane and copy the name of the storage account and the value of **key1**. Save these values to Notepad or some other temporary location.

## Create a Python script to send events to your event hub
1. Open your favorite Python editor, such as [Visual Studio Code][Visual Studio Code].
2. Create a script called **sender.py**. This script sends 200 events to your event hub. They are simple environmental readings sent in JSON.
3. Paste the following code into sender.py:
   
   ```python
   import uuid
   import datetime
   import random
   import json
   from azure.servicebus.control_client import ServiceBusService
   
   sbs = ServiceBusService(service_namespace='INSERT YOUR NAMESPACE NAME', shared_access_key_name='RootManageSharedAccessKey', shared_access_key_value='INSERT YOUR KEY')
   devices = []
   for x in range(0, 10):
       devices.append(str(uuid.uuid4()))
   
   for y in range(0,20):
       for dev in devices:
           reading = {'id': dev, 'timestamp': str(datetime.datetime.utcnow()), 'uv': random.random(), 'temperature': random.randint(70, 100), 'humidity': random.randint(70, 100)}
           s = json.dumps(reading)
           sbs.send_event('INSERT YOUR EVENT HUB NAME', s)
       print y
   ```
4. Update the preceding code to use your namespace name, key value, and event hub name that you obtained when you created the Event Hubs namespace.

## Create a Python script to read your Capture files

1. Fill out the pane and select **Create**.
2. Create a script called **capturereader.py**. This script reads the captured files and creates a file per device to write the data only for that device.
3. Paste the following code into capturereader.py:
   
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
4. Paste the appropriate values for your storage account name and key in the call to `startProcessing`.

## Run the scripts
1. Open a command prompt that has Python in its path, and then run these commands to install Python prerequisite packages:
   
   ```
   pip install azure-storage
   pip install azure-servicebus
   pip install avro
   ```
   
   If you have an earlier version of either **azure-storage** or **azure**, you might need to use the **--upgrade** option.
   
   You might also need to run the following command (not necessary on most systems):
   
   ```
   pip install cryptography
   ```
2. Change your directory to wherever you saved sender.py and capturereader.py, and run this command:
   
   ```
   start python sender.py
   ```
   
   This command starts a new Python process to run the sender.
3. Wait a few minutes for the capture to run. Then type the following command into your original command window:
   
   ```
   python capturereader.py
   ```

   This capture processor uses the local directory to download all the blobs from the storage account/container. It processes any that are not empty, and it writes the results as .csv files into the local directory.

## Next steps

You can learn more about Event Hubs by using the following links:

* [Overview of Event Hubs Capture][Overview of Event Hubs Capture]
* [Sample applications that use Event Hubs](https://github.com/Azure/azure-event-hubs/tree/master/samples)
* [Event Hubs overview][Event Hubs overview]

[Azure portal]: https://portal.azure.com/
[Overview of Event Hubs Capture]: event-hubs-capture-overview.md
[1]: ./media/event-hubs-archive-python/event-hubs-python1.png
[About Azure storage accounts]:../storage/common/storage-create-storage-account.md
[Visual Studio Code]: https://code.visualstudio.com/
[Event Hubs overview]: event-hubs-what-is-event-hubs.md
