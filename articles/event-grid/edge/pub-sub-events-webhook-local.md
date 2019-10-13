---
title: Publish, subscribe to events locally - Azure Event Grid IoT Edge | Microsoft Docs 
description: Publish, subscribe to events locally using Webhook with Event Grid on IoT Edge
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 10/06/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Tutorial: Publish, subscribe to events locally

This article walks you through all the steps needed to publish and subscribe to events using Event Grid on IoT Edge.

> [!NOTE]
> To learn about Azure Event Grid topics and subscriptions, see [Event Grid Concepts](concepts.md).

## Deploy Event Grid IoT Edge module

There are several ways to deploy modules to an IoT Edge device and all of them work for Azure Event Grid on IoT Edge. This article describes the steps to deploy Event Grid on IoT Edge from the Azure portal.

>[!NOTE]
> In this tutorial, you will deploy the Event Grid module without persistence. It means that any topics and subscriptions you create in this tutorial will be deleted when you redeploy the module. For more information on how to setup persistence, see the following articles: [Persist state in Linux](persist-state-linux.md) or [Persist state in Windows](persist-state-windows.md). For production workloads, we recommend that you install the Event Grid module with persistence.

>[!IMPORTANT]
> In this tutorial, you will deploy the Event Grid module with client authentication disabled and allow HTTP subscribers. For production workloads, we recommend that you enable the client authentication and allow only HTTPs subscribers. For more information on how to configure Event Grid module securely, see [Security and authentication](security-authentication.md).

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
   * **Image URI**: `msint.azurecr.io/azure-event-grid/iotedge:latest`
   * **Container Create Options**:

    ```json
        {
          "Env": [
            "inbound:clientAuth:clientCert:enabled=false",
            "outbound:webhook:httpsOnly=false"
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
 1. Continue to the next section to add the Azure Functions module before deploying them together.

## Deploy Azure Function IoT Edge module

This section shows you how to deploy the Azure Functions IoT module, which would act as an Event Grid subscriber to which events can be delivered.

>[!IMPORTANT]
>In this tutorial, you will deploy a sample Azure Function-based subscribing module. It can of course be any custom IoT Module that can listen for HTTP POST requests.


### Add modules

1. In the **Deployment Modules** section, select **Add** again. 
1. From the types of modules in the drop-down list, select **IoT Edge Module**
1. Provide the name, image, and container create options of the container:

   * **Name**: subscriber
   * **Image URI**: `msint.azurecr.io/azure-event-grid/iotedge-samplesubscriber-azfunc:latest`
   * **Container Create Options**:

       ```json
            {
              "HostConfig": {
                "PortBindings": {
                  "80/tcp": [
                    {
                      "HostPort": "8080"
                    }
                  ]
                }
              }
            }
       ```

1. Click **Save**
1. Click **Next** to continue to the routes section

 ### Setup routes

Keep the default routes, and select **Next** to continue to the review section

### Submit the deployment request

1. The review section shows you the JSON deployment manifest that was created based on your selections in the previous section. Confirm that you see both the modules: **eventgridmodule** and **subscriber** listed in the JSON. 
1. Review your deployment information, then select **Submit**. After you submit the deployment, you return to the **device** page.
1. In the **Modules section**, verify that both **eventgrid** and **subscriber** modules are listed. And, verify that the **Specified in deployment** and **Reported by device** columns are set to **Yes**.

    It may take a few moments for the module to be started on the device and then reported back to IoT Hub. Refresh the page to see an updated status.

## Publish and subscribe for events

### Create a topic

As a publisher of an event, you need to create an event grid topic. In Azure Event Grid, a topic refers to an endpoint where publishers can send events to.

1. Create topic.json with the following content. For details about the payload, see our [API documentation](api.md).

    ```json
        {
          "name": "sampleTopic1",
          "properties": {
            "inputschema": "eventGridSchema"
          }
        }
    ```

1. Run the following command to create an event grid topic. Confirm that you see the HTTP status code is `200 OK`.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @topic.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1?api-version=2019-01-01-preview
    ```

1. Run the following command to verify topic was created successfully. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X GET -g https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1?api-version=2019-01-01-preview
    ```

   Sample output:

   ```json
        [
          {
            "id": "/iotHubs/eg-iot-edge-hub/devices/eg-edge-device/modules/eventgridmodule/topics/sampleTopic1",
            "name": "sampleTopic1",
            "type": "Microsoft.EventGrid/topics",
            "properties": {
              "endpoint": "https://<edge-vm-ip>:4438/topics/sampleTopic1/events?api-version=2019-01-01-preview",
              "inputSchema": "EventGridSchema"
            }
          }
        ]
   ```

### Create an event subscription

Subscribers can register for events published to a topic. To receive any event, you'll need to create an Event Grid subscription for a topic of interest.

1. Create subscription.json with the following content. For details about the payload, see our [API documentation](api.md)

    ```json
        {
          "properties": {
            "destination": {
              "endpointType": "WebHook",
              "properties": {
                "endpointUrl": "http://subscriber:80/api/subscriber"
              }
            }
          }
        }
    ```

    >[!NOTE]
    > The **endpointType** property specifies that the subscriber is a **Webhook**.  The **endpointUrl** specifies the URL at which the subscriber is listening for events. This URL corresponds to the Azure Function sample you deployed earlier.
2. Run the following command to create a subscription for the topic. Confirm that you see the HTTP status code is `200 OK`.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @subscription.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1/eventSubscriptions/sampleSubscription1?api-version=2019-01-01-preview
    ```
3. Run the following command to verify subscription was created successfully. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X GET -g https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1/eventSubscriptions/sampleSubscription1?api-version=2019-01-01-preview
    ```

    Sample output:

   ```json
        {
          "id": "/iotHubs/eg-iot-edge-hub/devices/eg-edge-device/modules/eventgridmodule/topics/sampleTopic1/eventSubscriptions/sampleSubscription1",
          "type": "Microsoft.EventGrid/eventSubscriptions",
          "name": "sampleSubscription1",
          "properties": {
            "Topic": "sampleTopic1",
            "destination": {
              "endpointType": "WebHook",
              "properties": {
                "endpointUrl": "http://subscriber:80/api/subscriber"
              }
            }
          }
        }
    ```

### Publish an event

1. Create event.json with the following content. For details about the payload, see our [API documentation](api.md).

    ```json
        [
          {
            "id": "eventId-func-0",
            "eventType": "recordInserted",
            "subject": "myapp/vehicles/motorcycles",
            "eventTime": "2019-07-28T21:03:07+00:00",
            "dataVersion": "1.0",
            "data": {
              "make": "Ducati",
              "model": "Monster"
            }
          }
        ]
    ```
1. Run the following command to publish an event.

    ```sh
    curl -k -H "Content-Type: application/json" -X POST -g -d @event.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1/events?api-version=2019-01-01-preview
    ```

### Verify event delivery

1. SSH or RDP into your IoT Edge VM.
1. Check the subscriber logs:

    On Windows, run the following command:

    ```sh
    docker -H npipe:////./pipe/notedly_moby_engine container logs subscriber
    ```

   On Linux, run the following command:

    ```sh
    sudo docker logs subscriber
    ```

    Sample output:

    ```sh
        Received event data [
            {
              "id": "eventId-func-0",
              "topic": "sampleTopic1",
              "subject": "myapp/vehicles/motorcycles",
              "eventType": "recordInserted",
              "eventTime": "2019-07-28T21:03:07+00:00",
              "dataVersion": "1.0",
              "metadataVersion": "1",
              "data": {
                "make": "Ducati",
                "model": "Monster"
              }
            }
          ]
    ```

### Cleanup resources

* Run the following command to delete the topic and all its subscriptions.

    ```sh
    curl -k -H "Content-Type: application/json" -X DELETE https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1?api-version=2019-01-01-preview
    ```
* Delete the subscriber module from your IoT Edge device.

## Deploy Azure Blob Storage on IoT Edge module (Preview)

This section shows you how to deploy the Azure Blob Storage on IoT module, which would act as an Event Grid publisher to send events on Blob creation and Blob deletion to Event Grid

> [!CAUTION]
> Azure Blob Storage on IoT Edge integration with Event Grid is in Preview

## Select your IoT Edge device

1. Sign in to the [Azure portal](https://portal.azure.com)
2. Navigate to your IoT Hub.
3. Select **IoT Edge** from the menu
4. Select the ID of the target device from the list of devices.
5. Select **Set Modules**

## Configure a deployment manifest

A deployment manifest is a JSON document that describes which modules to deploy, how data flows between the modules, and desired properties of the module twins. The Azure portal has a wizard that walks you through creating a deployment manifest, instead of manually building the JSON document. It has three steps: **Add modules**, **Specify routes**, and **Review deployment**.

### Add modules

1. In the **Deployment Modules** section, select **Add**
2. From the types of modules in the drop-down list, select **IoT Edge Module**
3. Provide the name, image, and container create options of the container:

   * **Name**: azureblobstorageoniotedge
   * **Image URI**: mcr.microsoft.com/azure-blob-storage:1.2.2-preview
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

4. Update the JSON that you copied with the following information:

   - Replace `<your storage account name>` with a name that you can remember. Account names should be 3 to 24 characters long, with lowercase letters and numbers. No spaces.

   - Replace `<your storage account key>` with a 64-byte base64 key. You can generate a key with tools like [GeneratePlus](https://generate.plus/en/base64?gp_base64_base[length]=64). You'll use these credentials to access the blob storage from other modules.

   - Replace `<event grid module name>` with the name of your Event Grid module.
       - If you followed [Deploy Event Grid IoT Edge module](deploy-event-grid-portal.md) tutorial then the value is **eventgridmodule**

   - Replace `<storage mount>` according to your container operating system.
     - For Linux containers, **my-volume:/blobroot**
     - For Windows containers,**my-volume:C:/BlobRoot**

5. Click **Save**
6. Click **Next** to continue to the routes section

 ### Setup routes

Keep the default routes, and select **Next** to continue to the review section

### Review deployment

1. The review section shows you the JSON deployment manifest that was created based on your selections in the previous section. Confirm that you see the following four modules: **$edgeAgent**, **$edgeHub**, **eventgridmodule**, and **subscriber** that were deployed previously.
2. Review your deployment information, then select **Submit**.

## Verify your deployment

1. After you submit the deployment, you return to the IoT Edge page of your IoT hub.
2. Select the **IoT Edge device** that you targeted with the deployment to open its details.
3. In the device details, verify that the azureblobstorageoniotedge module is listed as both **Specified in deployment** and **Reported by device**.

    It may take a few moments for the module to be started on the device and then reported back to IoT Hub. Refresh the page to see an updated status.

### Publish create and delete events

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

2. Subscribers can register for events published to a topic. To receive any event, you'll need to create an Event Grid subscription for **MicrosoftStorage** topic.
    1. Create subscription.json with the following content. For details about the payload, see our [API documentation](api.md)

    ```json
        {
          "properties": {
            "destination": {
              "endpointType": "WebHook",
              "properties": {
                "endpointUrl": "http://subscriber:80/api/subscriber"
              }
            }
          }
        }
    ```

    >[!NOTE]
    > The **endpointType** property specifies that the subscriber is a **Webhook**.  The **endpointUrl** specifies the URL at which the subscriber is listening for events. This URL corresponds to the Azure Function sample you deployed earlier.

    2. Run the following command to create a subscription for the topic. Confirm that you see the HTTP status code is `200 OK`.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @subscription.json https://<your-edge-device-public-ip-here>:4438/topics/MicrosoftStorage/eventSubscriptions/sampleSubscription1?api-version=2019-01-01-preview
    ```

    3. Run the following command to verify subscription was created successfully. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X GET -g https://<your-edge-device-public-ip-here>:4438/topics/MicrosoftStorage/eventSubscriptions/sampleSubscription1?api-version=2019-01-01-preview
    ```

    Sample output:

    ```json
        {
          "id": "/iotHubs/eg-iot-edge-hub/devices/eg-edge-device/modules/eventgridmodule/topics/MicrosoftStorage/eventSubscriptions/sampleSubscription1",
          "type": "Microsoft.EventGrid/eventSubscriptions",
          "name": "sampleSubscription1",
          "properties": {
            "Topic": "MicrosoftStorage",
            "destination": {
              "endpointType": "WebHook",
              "properties": {
                "endpointUrl": "http://subscriber:80/api/subscriber"
              }
            }
          }
        }
    ```

2. Download [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) and [connect it to your local storage](../../iot-edge/how-to-store-data-blob.md#connect-to-your-local-storage-with-azure-storage-explorer)

### Verify Event Delivery

### Verify BlobCreated event delivery

1. Upload files as block blobs to the local storage from Azure Storage Explorer, and the module will automatically publish create events. 
2. Check out the subscriber logs for create event. Follow the steps to [verify the event delivery](pub-sub-events-webhook-local.md#verify-event-delivery)

Sample Output:

```json
        Received event data [
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
      ]
```
### Verify BlobDeleted event delivery

1. Delete blobs from the local storage using Azure Storage Explorer, and the module will automatically publish delete events. 
2. Check out the subscriber logs for delete event. Follow the steps to [verify the event delivery](pub-sub-events-webhook-local.md#verify-event-delivery)

Sample Output:

```json
        Received event data [
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
      ]
```

## Next steps

In this tutorial, you created an event grid topic, subscription, and published events. Now that you know the basic steps, see the following articles: 

*Create/update subscription with [filters](advanced-filtering.md).
*Enable persistence of Event Grid module on [Linux](persist-state-linux.md) or [Windows](persist-state-windows.md)
*Follow [documentation](configure-client-auth.md) to configure client authentication
*Forward events to Azure Functions in the cloud by following this [tutorial](pub-sub-events-webhook-cloud.md)
