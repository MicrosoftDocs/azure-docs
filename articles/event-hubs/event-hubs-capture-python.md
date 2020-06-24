---
title: 'Quickstart: Read captured data from Python app - Azure Event Hubs'
description: 'Quickstart: Scripts that use the Azure Python SDK to demonstrate the Event Hubs Capture feature.'
ms.topic: quickstart
ms.date: 06/23/2020
---

# Quickstart: Event Hubs Capture walkthrough: Python (azure-eventhub version 1)

Capture is a feature of Azure Event Hubs. You can use Capture to automatically deliver the streaming data in your event hub to an Azure Blob storage account of your choice. This capability makes it easy to do batch processing on real-time streaming data. This article describes how to use Event Hubs Capture with Python. For more information about Event Hubs Capture, see [Capture events through Azure Event Hubs][Overview of Event Hubs Capture].

This walkthrough uses the [Azure Python SDK](https://azure.microsoft.com/develop/python/) to demonstrate the Capture feature. The *sender.py* program sends simulated environmental telemetry to Event Hubs in JSON format. The event hub uses the Capture feature to write this data to Blob storage in batches. The *capturereader.py* app reads these blobs, creates an append file for each of your devices, and writes the data to *.csv* files on each device.

> [!WARNING]
> This quickstart is for version 1 of the Azure Event Hubs Python SDK. We recommend that you [migrate](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/eventhub/azure-eventhub/migration_guide.md) your code to [version 5 of the Python SDK](get-started-capture-python-v2.md).

In this walkthrough, you: 

> [!div class="checklist"]
> * Create an Azure Blob storage account and container in the Azure portal.
> * Enable Event Hubs Capture and direct it to your storage account.
> * Send data to your event hub by using a Python script.
> * Read and process files from Event Hubs Capture by using another Python script.

## Prerequisites

- Python 3.4 or later, with `pip` installed and updated.
  
- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.
  
- An active Event Hubs namespace and event hub, created by following the instructions at [Quickstart: Create an event hub using Azure portal](event-hubs-create.md). Make a note of your namespace and event hub names to use later in this walkthrough. 
  
  > [!NOTE]
  > If you already have a storage container to use, you can enable Capture and select the storage container when you create the Event Hub. 
  > 
  
- Your Event Hubs shared access key name and primary key value. Find or create these values under **Shared access policies** on your Event Hubs page. The default access key name is **RootManageSharedAccessKey**. Copy the access key name and the primary key value to use later in this walkthrough. 

## Create an Azure Blob storage account and container

Create a storage account and container to use for the capture. 

1. Sign in to the [Azure portal][Azure portal].
2. In the left navigation, select **Storage accounts**, and on the **Storage accounts** screen, select **Add**.
3. On the storage account creation screen, select a subscription and resource group, and give the storage account a name. You can leave the other selections at default. Select **Review + create**, review the settings, and then select **Create**. 
   
   ![Create storage account][1]
   
4. When the deployment completes, select **Go to resource**, and on the storage account **Overview** screen, select **Containers**.
5. On the **Containers** screen, select **+ Container**. 
6. On the **New container** screen, give the container a name, and then select **OK**. Make a note of the container name to use later in the walkthrough. 
7. In the left navigation of the **Containers** screen, select **Access keys**. Copy the **Storage account name**, and the **Key** value under **key1**, to use later in the walkthrough.
 
## Enable Event Hubs Capture

1. In the Azure portal, navigate to your event hub by selecting its Event Hubs Namespace from **All resources**, selecting **Event hubs** in the left navigation, and then selecting your event hub. 
2. On the event hub **Overview** screen, select **Capture events**.
3. On the **Capture** screen, select **On**. Then, under **Azure Storage Container**, select **Select Container**. 
4. On the **Containers** screen, select the storage container you want to use, and then select **Select**. 
5. On the **Capture** screen, select **Save changes**. 

## Create a Python script to send events to Event Hub
This script sends 200 events to your event hub. The events are simple environmental readings sent in JSON.

1. Open your favorite Python editor, such as [Visual Studio Code][Visual Studio Code].
2. Create a new file called *sender.py*. 
3. Paste the following code into *sender.py*. Substitute your own values for the Event Hubs \<namespace>, \<AccessKeyName>, \<primary key value>, and \<eventhub>.
   
   ```python
   import uuid
   import datetime
   import random
   import json
   from azure.servicebus.control_client import ServiceBusService
   
   sbs = ServiceBusService(service_namespace='<namespace>', shared_access_key_name='<AccessKeyName>', shared_access_key_value='<primary key value>')
   devices = []
   for x in range(0, 10):
       devices.append(str(uuid.uuid4()))
   
   for y in range(0,20):
       for dev in devices:
           reading = {'id': dev, 'timestamp': str(datetime.datetime.utcnow()), 'uv': random.random(), 'temperature': random.randint(70, 100), 'humidity': random.randint(70, 100)}
           s = json.dumps(reading)
           sbs.send_event('<eventhub>', s)
       print(y)
   ```
4. Save the file.

## Create a Python script to read Capture files

This script reads the captured files and creates a file for each of your devices to write the data only for that device.

1. In your Python editor, create a new file called *capturereader.py*. 
2. Paste the following code into *capturereader.py*. Substitute your saved values for your \<storageaccount>, \<storage account access key>, and \<storagecontainer>.
   
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
           if not parsed_json['id'] in dict:
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
       print('Processor started using path: ' + os.getcwd())
       block_blob_service = BlockBlobService(account_name=accountName, account_key=key)
       generator = block_blob_service.list_blobs(container)
       for blob in generator:
           #content_length == 508 is an empty file, so only process content_length > 508 (skip empty files)
           if blob.properties.content_length > 508:
               print('Downloaded a non empty blob: ' + blob.name)
               cleanName = str.replace(blob.name, '/', '_')
               block_blob_service.get_blob_to_path(container, blob.name, cleanName)
               processBlob(cleanName)
               os.remove(cleanName)
           block_blob_service.delete_blob(container, blob.name)
   startProcessing('<storageaccount>', '<storage account access key>', '<storagecontainer>')
   ```

## Run the Python scripts

1. Open a command prompt that has Python in its path, and run these commands to install the Python prerequisite packages:
   
   ```cmd
   pip install azure-storage
   pip install azure-servicebus
   pip install avro-python3
   ```
   
   If you have an earlier version of `azure-storage` or `azure`, you might need to use the `--upgrade` option.
   
   You might also need to run the following command. Running this command isn't necessary on most systems. 
   
   ```cmd
   pip install cryptography
   ```
   
2. From the directory where you saved *sender.py* and *capturereader.py*, run this command:
   
   ```cmd
   start python sender.py
   ```
   
   The command starts a new Python process to run the sender.
   
3. When the capture finishes running, run this command:
   
   ```cmd
   python capturereader.py
   ```

   The capture processor downloads all the non-empty blobs from the storage account container and writes the results as *.csv* files into the local directory. 

## Next steps

To learn more about Event Hubs, see: 

* [Overview of Event Hubs Capture][Overview of Event Hubs Capture]
* [Sample applications that use Event Hubs](https://github.com/Azure/azure-event-hubs/tree/master/samples)
* [Event Hubs overview][Event Hubs overview]

[Azure portal]: https://portal.azure.com/
[Overview of Event Hubs Capture]: event-hubs-capture-overview.md
[1]: ./media/event-hubs-archive-python/event-hubs-python1.png
[About Azure storage accounts]:../storage/common/storage-create-storage-account.md
[Visual Studio Code]: https://code.visualstudio.com/
[Event Hubs overview]: event-hubs-what-is-event-hubs.md
