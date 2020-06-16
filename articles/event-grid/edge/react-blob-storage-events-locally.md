---
title: React to Blob Storage module events - Azure Event Grid IoT Edge | Microsoft Docs 
description: React to Blob Storage module events
author: arduppal
manager: brymat
ms.author: arduppal
ms.reviewer: spelluru 
ms.date: 12/13/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Tutorial: React to Blob Storage events on IoT Edge (Preview)
This article shows you how to deploy the Azure Blob Storage on IoT module, which would act as an Event Grid publisher to send events on Blob creation and Blob deletion to Event Grid.  

For an overview of the Azure Blob Storage on IoT Edge, see [Azure Blob Storage on IoT Edge](../../iot-edge/how-to-store-data-blob.md) and its features.

> [!WARNING]
> Azure Blob Storage on IoT Edge integration with Event Grid is in Preview

In order to complete this tutorial, you will need:

* **Azure subscription** - Create a [free account](https://azure.microsoft.com/free) if you don't already have one. 
* **Azure IoT Hub and IoT Edge device** - Follow the steps in the quickstart for [Linux](../../iot-edge/quickstart-linux.md) or [Windows devices](../../iot-edge/quickstart.md) if you don't already have one.

## Deploy Event Grid IoT Edge module

There are several ways to deploy modules to an IoT Edge device and all of them work for Azure Event Grid on IoT Edge. This article describes the steps to deploy Event Grid on IoT Edge from the Azure portal.

>[!NOTE]
> In this tutorial, you will deploy the Event Grid module without persistence. It means that any topics and subscriptions you create in this tutorial will be deleted when you redeploy the module. For more information on how to setup persistence, see the following articles: [Persist state in Linux](persist-state-linux.md) or [Persist state in Windows](persist-state-windows.md). For production workloads, we recommend that you install the Event Grid module with persistence.


### Select your IoT Edge device

1. Sign in to the [Azure portal](https://portal.azure.com)
1. Navigate to your IoT Hub.
1. Select **IoT Edge** from the menu in the **Automatic Device Management** section. 
1. Click on the ID of the target device from the list of devices
1. Select **Set Modules**. Keep the page open. You will continue with the steps in the next section.

### Configure a deployment manifest

A deployment manifest is a JSON document that describes which modules to deploy, how data flows between the modules, and desired properties of the module twins. The Azure portal has a wizard that walks you through creating a deployment manifest, instead of building the JSON document manually.  It has three steps: **Add modules**, **Specify routes**, and **Review deployment**.

### Add modules

1. In the **Deployment Modules** section, select **Add**
1. From the types of modules in the drop-down list, select **IoT Edge Module**
1. Provide the name, image, container create options of the container:

   * **Name**: eventgridmodule
   * **Image URI**: `mcr.microsoft.com/azure-event-grid/iotedge:latest`
   * **Container Create Options**:

    ```json
        {
          "Env": [
           "inbound__serverAuth__tlsPolicy=enabled",
           "inbound__clientAuth__clientCert__enabled=false"
          ],
          "HostConfig": {
            "PortBindings": {
              "4438/tcp": [
                {
                    "HostPort": "4438"
                }
              ]
            }
          }
        }
    ```    

 1. Click **Save**
 1. Continue to the next section to add the Azure Event Grid Subscriber module before deploying them together.

    >[!IMPORTANT]
    > In this tutorial, you will learn to deploy the Event Grid module to allow both HTTP/HTTPs requests, client authentication disabled. For production workloads, we recommend that you enable only HTTPs requests and subscribers with client authentication enabled. For more information on how to configure Event Grid module securely, see [Security and authentication](security-authentication.md).
    

## Deploy Event Grid Subscriber IoT Edge module

This section shows you how to deploy another IoT module which would act as an event handler to which events can be delivered.

### Add modules

1. In the **Deployment Modules** section, select **Add** again. 
1. From the types of modules in the drop-down list, select **IoT Edge Module**
1. Provide the name, image, and container create options of the container:

   * **Name**: subscriber
   * **Image URI**: `mcr.microsoft.com/azure-event-grid/iotedge-samplesubscriber:latest`
   * **Container Create Options**: None
1. Click **Save**
1. Continue to the next section to add the Azure Blob Storage module

## Deploy Azure Blob Storage module

This section shows you how to deploy the Azure Blob Storage module, which would act as an Event Grid publisher publishing Blob created and deleted events.

### Add modules

1. In the **Deployment Modules** section, select **Add**
2. From the types of modules in the drop-down list, select **IoT Edge Module**
3. Provide the name, image, and container create options of the container:

   * **Name**: azureblobstorageoniotedge
   * **Image URI**: mcr.microsoft.com/azure-blob-storage:latest
   * **Container Create Options**:

   ```json
       {
         "Env":[
           "LOCAL_STORAGE_ACCOUNT_NAME=<your storage account name>",
           "LOCAL_STORAGE_ACCOUNT_KEY=<your storage account key>",
           "EVENTGRID_ENDPOINT=http://<event grid module name>:5888"
         ],
         "HostConfig":{
           "Binds":[
               "<storage mount>"
           ],
           "PortBindings":{
             "11002/tcp":[{"HostPort":"11002"}]
           }
         }
       }
   ```

   > [!IMPORTANT]
   > - Blob Storage module can publish events using both HTTPS and HTTP. 
   > - If you have enabled the client-based authentication for EventGrid, make sure you update the value of EVENTGRID_ENDPOINT to allow https, like this: `EVENTGRID_ENDPOINT=https://<event grid module name>:4438`.
   > - Also add another environment variable `AllowUnknownCertificateAuthority=true` to the above Json. When talking to EventGrid over HTTPS, **AllowUnknownCertificateAuthority** allows the storage module to trust self-signed EventGrid server certificates.

4. Update the JSON that you copied with the following information:

   - Replace `<your storage account name>` with a name that you can remember. Account names should be 3 to 24 characters long, with lowercase letters and numbers. No spaces.

   - Replace `<your storage account key>` with a 64-byte base64 key. You can generate a key with tools like [GeneratePlus](https://generate.plus/en/base64?gp_base64_base[length]=64). You'll use these credentials to access the blob storage from other modules.

   - Replace `<event grid module name>` with the name of your Event Grid module.
   - Replace `<storage mount>` according to your container operating system.
     - For Linux containers, **my-volume:/blobroot**
     - For Windows containers,**my-volume:C:/BlobRoot**

5. Click **Save**
6. Click **Next** to continue to the routes section

    > [!NOTE]
    > If you are using an Azure VM as the edge device, add an inbound port rule to allow inbound traffic on the host ports used in this tutorial: 4438, 5888, 8080, and 11002. For instructions on adding the rule, see [How to open ports to a VM](../../virtual-machines/windows/nsg-quickstart-portal.md).

### Setup routes

Keep the default routes, and select **Next** to continue to the review section

### Review deployment

1. The review section shows you the JSON deployment manifest that was created based on your selections in the previous section. Confirm that you see the following four modules: **$edgeAgent**, **$edgeHub**, **eventgridmodule**, **subscriber** and **azureblobstorageoniotedge** that all being deployed.
2. Review your deployment information, then select **Submit**.

## Verify your deployment

1. After you submit the deployment, you return to the IoT Edge page of your IoT hub.
2. Select the **IoT Edge device** that you targeted with the deployment to open its details.
3. In the device details, verify that the eventgridmodule, subscriber and azureblobstorageoniotedge modules are listed as both **Specified in deployment** and **Reported by device**.

   It may take a few moments for the module to be started on the device and then reported back to IoT Hub. Refresh the page to see an updated status.

## Publish BlobCreated and BlobDeleted events

1. This module automatically creates topic **MicrosoftStorage**. Verify that it exists
    ```sh
    curl -k -H "Content-Type: application/json" -X GET -g https://<your-edge-device-public-ip-here>:4438/topics/MicrosoftStorage?api-version=2019-01-01-preview
    ```

    Sample output:

    ```json
        [
          {
            "id": "/iotHubs/eg-iot-edge-hub/devices/eg-edge-device/modules/eventgridmodule/topics/MicrosoftStorage",
            "name": "MicrosoftStorage",
            "type": "Microsoft.EventGrid/topics",
            "properties": {
              "endpoint": "https://<edge-vm-ip>:4438/topics/MicrosoftStorage/events?api-version=2019-01-01-preview",
              "inputSchema": "EventGridSchema"
            }
          }
        ]
    ```

    > [!IMPORTANT]
    > - For the HTTPS flow, if the client authentication is enabled via SAS key, then the SAS key specified earlier should be added as a header. Hence the curl request will be: `curl -k -H "Content-Type: application/json" -H "aeg-sas-key: <your SAS key>" -X GET -g https://<your-edge-device-public-ip-here>:4438/topics/MicrosoftStorage?api-version=2019-01-01-preview`
    > - For the HTTPS flow, if the client authentication is enabled via certificate, the curl request will be: `curl -k -H "Content-Type: application/json" --cert <certificate file> --key <certificate private key file> -X GET -g https://<your-edge-device-public-ip-here>:4438/topics/MicrosoftStorage?api-version=2019-01-01-preview`

2. Subscribers can register for events published to a topic. To receive any event, you'll need to create an Event Grid subscription for **MicrosoftStorage** topic.
    1. Create blobsubscription.json with the following content. For details about the payload, see our [API documentation](api.md)

       ```json
        {
          "properties": {
            "destination": {
              "endpointType": "WebHook",
              "properties": {
                "endpointUrl": "https://subscriber:4430"
              }
            }
          }
        }
       ```

       >[!NOTE]
       > The **endpointType** property specifies that the subscriber is a **Webhook**.  The **endpointUrl** specifies the URL at which the subscriber is listening for events. This URL corresponds to the Azure Function sample you deployed earlier.

    2. Run the following command to create a subscription for the topic. Confirm that you see the HTTP status code is `200 OK`.

       ```sh
       curl -k -H "Content-Type: application/json" -X PUT -g -d @blobsubscription.json https://<your-edge-device-public-ip-here>:4438/topics/MicrosoftStorage/eventSubscriptions/sampleSubscription5?api-version=2019-01-01-preview
       ```

       > [!IMPORTANT]
       > - For the HTTPS flow, if the client authentication is enabled via SAS key, then the SAS key specified earlier should be added as a header. Hence the curl request will be: `curl -k -H "Content-Type: application/json" -H "aeg-sas-key: <your SAS key>" -X PUT -g -d @blobsubscription.json https://<your-edge-device-public-ip-here>:4438/topics/MicrosoftStorage/eventSubscriptions/sampleSubscription5?api-version=2019-01-01-preview` 
       > - For the HTTPS flow, if the client authentication is enabled via certificate, the curl request will be:`curl -k -H "Content-Type: application/json" --cert <certificate file> --key <certificate private key file> -X PUT -g -d @blobsubscription.json https://<your-edge-device-public-ip-here>:4438/topics/MicrosoftStorage/eventSubscriptions/sampleSubscription5?api-version=2019-01-01-preview`

    3. Run the following command to verify subscription was created successfully. HTTP Status Code of 200 OK should be returned.

       ```sh
       curl -k -H "Content-Type: application/json" -X GET -g https://<your-edge-device-public-ip-here>:4438/topics/MicrosoftStorage/eventSubscriptions/sampleSubscription5?api-version=2019-01-01-preview
       ```

       Sample output:

       ```json
        {
          "id": "/iotHubs/eg-iot-edge-hub/devices/eg-edge-device/modules/eventgridmodule/topics/MicrosoftStorage/eventSubscriptions/sampleSubscription5",
          "type": "Microsoft.EventGrid/eventSubscriptions",
          "name": "sampleSubscription5",
          "properties": {
            "Topic": "MicrosoftStorage",
            "destination": {
              "endpointType": "WebHook",
              "properties": {
                "endpointUrl": "https://subscriber:4430"
              }
            }
          }
        }
       ```

       > [!IMPORTANT]
       > - For the HTTPS flow, if the client authentication is enabled via SAS key, then the SAS key specified earlier should be added as a header. Hence the curl request will be: `curl -k -H "Content-Type: application/json" -H "aeg-sas-key: <your SAS key>" -X GET -g https://<your-edge-device-public-ip-here>:4438/topics/MicrosoftStorage/eventSubscriptions/sampleSubscription5?api-version=2019-01-01-preview`
       > - For the HTTPS flow, if the client authentication is enabled via certificate, the curl request will be: `curl -k -H "Content-Type: application/json" --cert <certificate file> --key <certificate private key file> -X GET -g https://<your-edge-device-public-ip-here>:4438/topics/MicrosoftStorage/eventSubscriptions/sampleSubscription5?api-version=2019-01-01-preview`

3. Download [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) and [connect it to your local storage](../../iot-edge/how-to-store-data-blob.md#connect-to-your-local-storage-with-azure-storage-explorer)

## Verify event delivery

### Verify BlobCreated event delivery

1. Upload files as block blobs to the local storage from Azure Storage Explorer, and the module will automatically publish create events. 
2. Check out the subscriber logs for create event. Follow the steps to [verify the event delivery](pub-sub-events-webhook-local.md#verify-event-delivery)

    Sample Output:

    ```json
            Received Event:
            {
              "id": "d278f2aa-2558-41aa-816b-e6d8cc8fa140",
              "topic": "MicrosoftStorage",
              "subject": "/blobServices/default/containers/cont1/blobs/Team.jpg",
              "eventType": "Microsoft.Storage.BlobCreated",
              "eventTime": "2019-10-01T21:35:17.7219554Z",
              "dataVersion": "1.0",
              "metadataVersion": "1",
              "data": {
                "api": "PutBlob",
                "clientRequestId": "00000000-0000-0000-0000-000000000000",
                "requestId": "ef1c387b-4c3c-4ac0-8e04-ff73c859bfdc",
                "eTag": "0x8D746B740DA21FB",
                "url": "http://azureblobstorageoniotedge:11002/myaccount/cont1/Team.jpg",
                "contentType": "image/jpeg",
                "contentLength": 858129,
                "blobType": "BlockBlob"
              }
            }
    ```

### Verify BlobDeleted event delivery

1. Delete blobs from the local storage using Azure Storage Explorer, and the module will automatically publish delete events. 
2. Check out the subscriber logs for delete event. Follow the steps to [verify the event delivery](pub-sub-events-webhook-local.md#verify-event-delivery)

    Sample Output:
    
    ```json
            Received Event:
            {
              "id": "ac669b6f-8b0a-41f3-a6be-812a3ce6ac6d",
              "topic": "MicrosoftStorage",
              "subject": "/blobServices/default/containers/cont1/blobs/Team.jpg",
              "eventType": "Microsoft.Storage.BlobDeleted",
              "eventTime": "2019-10-01T21:36:09.2562941Z",
              "dataVersion": "1.0",
              "metadataVersion": "1",
              "data": {
                "api": "DeleteBlob",
                "clientRequestId": "00000000-0000-0000-0000-000000000000",
                "requestId": "2996bbfb-c819-4d02-92b1-c468cc67d8c6",
                "eTag": "0x8D746B740DA21FB",
                "url": "http://azureblobstorageoniotedge:11002/myaccount/cont1/Team.jpg",
                "contentType": "image/jpeg",
                "contentLength": 858129,
                "blobType": "BlockBlob"
              }
            }
    ```

Congratulations! You have completed the tutorial. The following sections provide details on the event properties.

### Event properties

Here's the list of supported event properties and their types and descriptions. 

| Property | Type | Description |
| -------- | ---- | ----------- |
| topic | string | Full resource path to the event source. This field is not writeable. Event Grid provides this value. |
| subject | string | Publisher-defined path to the event subject. |
| eventType | string | One of the registered event types for this event source. |
| eventTime | string | The time the event is generated based on the provider's UTC time. |
| id | string | Unique identifier for the event. |
| data | object | Blob storage event data. |
| dataVersion | string | The schema version of the data object. The publisher defines the schema version. |
| metadataVersion | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| api | string | The operation that triggered the event. It can be one of the following values: <ul><li>BlobCreated - allowed values are: `PutBlob` and `PutBlockList`</li><li>BlobDeleted - allowed values are `DeleteBlob`, `DeleteAfterUpload` and `AutoDelete`. <p>The `DeleteAfterUpload` event is generated when blob is automatically deleted because deleteAfterUpload desired property is set to true. </p><p>`AutoDelete` event is generated when blob is automatically deleted because deleteAfterMinutes desired property value expired.</p></li></ul>|
| clientRequestId | string | a client-provided request ID for the storage API operation. This ID can be used to correlate to Azure Storage diagnostic logs using the "client-request-id" field in the logs, and can be provided in client requests using the "x-ms-client-request-id" header. For details, see [Log Format](/rest/api/storageservices/storage-analytics-log-format). |
| requestId | string | Service-generated request ID for the storage API operation. Can be used to correlate to Azure Storage diagnostic logs using the "request-id-header" field in the logs and is returned from initiating API call in the 'x-ms-request-id' header. See [Log Format](https://docs.microsoft.com/rest/api/storageservices/storage-analytics-log-format). |
| eTag | string | The value that you can use to perform operations conditionally. |
| contentType | string | The content type specified for the blob. |
| contentLength | integer | The size of the blob in bytes. |
| blobType | string | The type of blob. Valid values are either "BlockBlob" or "PageBlob". |
| url | string | The path to the blob. <br>If the client uses a Blob REST API, then the url has this structure: *\<storage-account-name\>.blob.core.windows.net/\<container-name\>/\<file-name\>*. <br>If the client uses a Data Lake Storage REST API, then the url has this structure: *\<storage-account-name\>.dfs.core.windows.net/\<file-system-name\>/\<file-name\>*. |


## Next steps

See the following articles from the Blob Storage documentation:

- [Filter Blob Storage events](../../storage/blobs/storage-blob-event-overview.md#filtering-events)
- [Recommended practices for consuming Blob Storage events](../../storage/blobs/storage-blob-event-overview.md#practices-for-consuming-events)

In this tutorial, you published events by creating or deleting blobs in an Azure Blob Storage. See the other tutorials to learn how to forward events to cloud (Azure Event Hub or Azure IoT Hub): 

- [Forward events to Azure Event Grid](forward-events-event-grid-cloud.md)
- [Forward events to Azure IoT Hub](forward-events-iothub.md)
