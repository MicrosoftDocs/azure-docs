---
title: Publish, subscribe to events locally - Azure Event Grid IoT Edge | Microsoft Docs 
description: Publish, subscribe to events locally using Webhook with Event Grid on IoT Edge
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 10/29/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Tutorial: Publish, subscribe to events locally

This article walks you through all the steps needed to publish and subscribe to events using Event Grid on IoT Edge.

> [!NOTE]
> To learn about Azure Event Grid topics and subscriptions, see [Event Grid Concepts](concepts.md).

## Prerequisites 
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

   [!INCLUDE [event-grid-edge-module-version-update](../../../includes/event-grid-edge-module-version-update.md)]

    ```json
        {
          "Env": [
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
    > In this tutorial, you will deploy the Event Grid module with client authentication disabled. For production workloads, we recommend that you enable the client authentication. For more information on how to configure Event Grid module securely, see [Security and authentication](security-authentication.md).
    > 
    > If you are using an Azure VM as an edge device, add an inbound port rule to allow inbound traffic on the port 4438. For instructions on adding the rule, see [How to open ports to a VM](../../virtual-machines/windows/nsg-quickstart-portal.md).
    

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
1. Click **Next** to continue to the routes section

 ### Setup routes

Keep the default routes, and select **Next** to continue to the review section

### Submit the deployment request

1. The review section shows you the JSON deployment manifest that was created based on your selections in the previous section. Confirm that you see both the modules: **eventgridmodule** and **subscriber** listed in the JSON. 
1. Review your deployment information, then select **Submit**. After you submit the deployment, you return to the **device** page.
1. In the **Modules section**, verify that both **eventgrid** and **subscriber** modules are listed. And, verify that the **Specified in deployment** and **Reported by device** columns are set to **Yes**.

    It may take a few moments for the module to be started on the device and then reported back to IoT Hub. Refresh the page to see an updated status.

## Create a topic

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

## Create an event subscription

Subscribers can register for events published to a topic. To receive any event, you'll need to create an Event Grid subscription for a topic of interest.

[!INCLUDE [event-grid-deploy-iot-edge](../../../includes/event-grid-edge-persist-event-subscriptions.md)]

1. Create subscription.json with the following content. For details about the payload, see our [API documentation](api.md)

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
    > The **endpointType** property specifies that the subscriber is a **Webhook**.  The **endpointUrl** specifies the URL at which the subscriber is listening for events. This URL corresponds to the Azure Subscriber sample you deployed earlier.
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
                "endpointUrl": "https://subscriber:4430"
              }
            }
          }
        }
    ```

## Publish an event

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

## Verify event delivery

1. SSH or RDP into your IoT Edge VM.
1. Check the subscriber logs:

    On Windows, run the following command:

    ```sh
    docker -H npipe:////./pipe/iotedge_moby_engine container logs subscriber
    ```

   On Linux, run the following command:

    ```sh
    sudo docker logs subscriber
    ```

    Sample output:

    ```sh
        Received Event:
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
    ```

## Cleanup resources

* Run the following command to delete the topic and all its subscriptions.

    ```sh
    curl -k -H "Content-Type: application/json" -X DELETE https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1?api-version=2019-01-01-preview
    ```
* Delete the subscriber module from your IoT Edge device.


## Next steps
In this tutorial, you created an event grid topic, subscription, and published events. Now that you know the basic steps, see the following articles: 

- To troubleshoot issues with using Azure Event Grid on IoT Edge, see [Troubleshooting guide](troubleshoot.md).
- Create/update subscription with [filters](advanced-filtering.md).
- Enable persistence of Event Grid module on [Linux](persist-state-linux.md) or [Windows](persist-state-windows.md)
- Follow [documentation](configure-client-auth.md) to configure client authentication
- Forward events to Azure Functions in the cloud by following this [tutorial](pub-sub-events-webhook-cloud.md)
- [React to Blob Storage events on IoT Edge](react-blob-storage-events-locally.md)
- [Monitor topics and subscriptions on the edge](monitor-topics-subscriptions.md)

