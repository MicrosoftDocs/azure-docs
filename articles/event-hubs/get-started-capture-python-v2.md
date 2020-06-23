---
title: Read Azure Event Hubs captured data from a Python app (latest)
description: This article shows you how to write Python code to capture data that's sent to an event hub and read the captured event data from an Azure storage account. 
ms.topic: quickstart
ms.date: 06/23/2020
---

# Capture Event Hubs data in Azure Storage and read it by using Python (azure-eventhub version 5)

You can configure an event hub so that the data that's sent to an event hub is captured in an Azure storage account or Azure Data Lake Storage Gen 1 or Gen 2. This article shows you how to write Python code to send events to an event hub and read the captured data from **Azure Blob storage**. For more information about this feature, see [Event Hubs Capture feature overview](event-hubs-capture-overview.md).

This quickstart uses the [Azure Python SDK](https://azure.microsoft.com/develop/python/) to demonstrate the Capture feature. The *sender.py* app sends simulated environmental telemetry to event hubs in JSON format. The event hub is configured to use the Capture feature to write this data to Blob storage in batches. The *capturereader.py* app reads these blobs and creates an append file for each device. The app then writes the data into CSV files.

> [!IMPORTANT]
> This quickstart uses version 5 of the Azure Event Hubs Python SDK. For a quickstart that uses version 1 of the Python SDK, see [this article](event-hubs-capture-python.md). 

In this quickstart, you: 

> [!div class="checklist"]
> * Create an Azure Blob storage account and container in the Azure portal.
> * Create an Event Hubs namespace by using the Azure portal.
> * Create an event hub with the Capture feature enabled and connect it to your storage account.
> * Send data to your event hub by using a Python script.
> * Read and process files from Event Hubs Capture by using another Python script.

## Prerequisites

- Python 2.7, and 3.5 or later, with PIP installed and updated.  
- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.  
- An active Event Hubs namespace and event hub.
[Create an Event Hubs namespace and an event hub in the namespace](event-hubs-create.md). Record the name of the Event Hubs namespace, the name of the event hub, and the primary access key for the namespace. To get the access key, see [Get an Event Hubs connection string](event-hubs-get-connection-string.md#get-connection-string-from-the-portal). The default key name is *RootManageSharedAccessKey*. For this quickstart, you need only the primary key. You don't need the connection string.  
- An Azure storage account, a blob container in the storage account, and a connection string to the storage account. If you don't have these items, do the following:  
    1. [Create an Azure storage account](../storage/common/storage-quickstart-create-account.md?tabs=azure-portal)  
    1. [Create a blob container in the storage account](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container)  
    1. [Get the connection string to the storage account](../storage/common/storage-configure-connection-string.md)

    Be sure to record the connection string and container name for later use in this quickstart.  
- Enable the Capture feature for the event hub. To do so, follow the instructions in [Enable Event Hubs Capture using the Azure portal](event-hubs-capture-enable-through-portal.md). Select the storage account and the blob container you created in the preceding step. You can also enable the feature when you create an event hub.  

## Create a Python script to send events to your event hub
In this section, you create a Python script that sends 200 events (10 devices * 20 events) to an event hub. These events are a sample environmental reading that's sent in JSON format. 

1. Open your favorite Python editor, such as [Visual Studio Code][Visual Studio Code].
2. Create a script called *sender.py*. 
3. Paste the following code into *sender.py*. 
   
    ```python
    import time
    import os
    import uuid
    import datetime
    import random
    import json
    
    from azure.eventhub import EventHubProducerClient, EventData
    
    # This script simulates the production of events for 10 devices.
    devices = []
    for x in range(0, 10):
        devices.append(str(uuid.uuid4()))
    
    # Create a producer client to produce and publish events to the event hub.
    producer = EventHubProducerClient.from_connection_string(conn_str="EVENT HUBS NAMESAPCE CONNECTION STRING", eventhub_name="EVENT HUB NAME")
    
    for y in range(0,20):    # For each device, produce 20 events. 
        event_data_batch = producer.create_batch() # Create a batch. You will add events to the batch later. 
        for dev in devices:
            # Create a dummy reading.
            reading = {'id': dev, 'timestamp': str(datetime.datetime.utcnow()), 'uv': random.random(), 'temperature': random.randint(70, 100), 'humidity': random.randint(70, 100)}
            s = json.dumps(reading) # Convert the reading into a JSON string.
            event_data_batch.add(EventData(s)) # Add event data to the batch.
        producer.send_batch(event_data_batch) # Send the batch of events to the event hub.
    
    # Close the producer.    
    producer.close()
    ```
4. Replace the following values in the scripts:  
    * Replace `EVENT HUBS NAMESPACE CONNECTION STRING` with the connection string for your Event Hubs namespace.  
    * Replace `EVENT HUB NAME` with the name of your event hub.  
5. Run the script to send events to the event hub.  
6. In the Azure portal, you can verify that the event hub has received the messages. Switch to **Messages** view in the **Metrics** section. Refresh the page to update the chart. It might take a few seconds for the page to display that the messages have been received. 

    [![Verify that the event hub received the messages](./media/get-started-capture-python-v2/messages-portal.png)](./media/get-started-capture-python-v2/messages-portal.png#lightbox)

## Create a Python script to read your Capture files
In this example, the captured data is stored in Azure Blob storage. The script in this section reads the captured data files from your Azure storage account and generates CSV files for you to easily open and view. You will see 10 files in the current working directory of the application. These files will contain the environmental readings for the 10 devices. 

1. In your Python editor, create a script called *capturereader.py*. This script reads the captured files and creates a file for each device to write the data only for that device.
2. Paste the following code into *capturereader.py*. 
   
    ```python
    import os
    import string
    import json
    import uuid
    import avro.schema
    
    from azure.storage.blob import ContainerClient, BlobClient
    from avro.datafile import DataFileReader, DataFileWriter
    from avro.io import DatumReader, DatumWriter
    
    
    def processBlob2(filename):
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
            filename = os.getcwd() + '\\' + str(device) + '.csv'
            deviceFile = open(filename, "a")
            for r in dict[device]:
                deviceFile.write(", ".join([str(r[x]) for x in r.keys()])+'\n')
    
    def startProcessing():
        print('Processor started using path: ' + os.getcwd())
        # Create a blob container client.
        container = ContainerClient.from_connection_string("AZURE STORAGE CONNECTION STRING", container_name="BLOB CONTAINER NAME")
        blob_list = container.list_blobs() # List all the blobs in the container.
        for blob in blob_list:
            # Content_length == 508 is an empty file, so process only content_length > 508 (skip empty files).        
            if blob.size > 508:
                print('Downloaded a non empty blob: ' + blob.name)
                # Create a blob client for the blob.
                blob_client = ContainerClient.get_blob_client(container, blob=blob.name)
                # Construct a file name based on the blob name.
                cleanName = str.replace(blob.name, '/', '_')
                cleanName = os.getcwd() + '\\' + cleanName 
                with open(cleanName, "wb+") as my_file: # Open the file to write. Create it if it doesn't exist. 
                    my_file.write(blob_client.download_blob().readall()) # Write blob contents into the file.
                processBlob2(cleanName) # Convert the file into a CSV file.
                os.remove(cleanName) # Remove the original downloaded file.
                # Delete the blob from the container after it's read.
                container.delete_blob(blob.name)
    
    startProcessing()    
    ```
3. Replace `AZURE STORAGE CONNECTION STRING` with the connection string for your Azure storage account. The name of the container you created in this quickstart is *capture*. If you used a different name for the container, replace *capture* with the name of the container in the storage account. 

## Run the scripts
1. Open a command prompt that has Python in its path, and then run these commands to install Python prerequisite packages:
   
   ```
   pip install azure-storage-blob
   pip install azure-eventhub
   pip install avro-python3
   ```
2. Change your directory to the directory where you saved *sender.py* and *capturereader.py*, and run this command:
   
   ```
   python sender.py
   ```
   
   This command starts a new Python process to run the sender.
3. Wait a few minutes for the capture to run, and then enter the following command in your original command window:
   
   ```
   python capturereader.py
   ```

   This capture processor uses the local directory to download all the blobs from the storage account and container. It processes any that are not empty, and it writes the results as CSV files into the local directory.

## Next steps
Check out [Python samples on GitHub](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/eventhub/azure-eventhub/samples). 


[Azure portal]: https://portal.azure.com/
[Overview of Event Hubs Capture]: event-hubs-capture-overview.md
[1]: ./media/event-hubs-archive-python/event-hubs-python1.png
[About Azure storage accounts]:../storage/common/storage-create-storage-account.md
[Visual Studio Code]: https://code.visualstudio.com/
[Event Hubs overview]: event-hubs-what-is-event-hubs.md
