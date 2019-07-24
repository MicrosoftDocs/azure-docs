---
title: Publish, subscribe using HTTP on IoT Edge - Azure Event Grid IoT Edge | Microsoft Docs 
description: Publish, subscribe using HTTP with Event Grid on IoT Edge
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: 
ms.date: 07/23/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Quickstart: Deploy Event Grid IoT Edge module and subscribe to a Webhook

Azure Event Grid on edge is a IoT Edge marketplace module deployed and managed by IoT Edge runtime. It enables building applications with event-based architectures using HTTP.
Promotes consistent event schemas and event handling across cloud and IoT Edge.
If new to Event Grid refer to [Event Grid Concepts](concepts.md) documentation first.

In this quickstart, you will learn how to:

1. Deploy Azure Event Grid IoT Edge module
1. Deploy an HTTP subscriber module that can subscribe to Event Grid events
1. Create a topic where you can publish events
1. Create a subscription on which on you receive events
1. Publish events on the topic, and see them delivered to subscriber

## Prerequisites

In order to complete this tutorial, you will need:-

* **Azure Subscription** - Create a [free account](https://azure.microsoft.com/free) if you don't already have one.

* **Azure IoT Hub and IoT Edge Device** - Follow the steps in the quickstart for [Linux](../iot-edge/quickstart-linux.md) or [Windows devices](../iot-edge/quickstart.md) if you don't already have one.

>[!IMPORTANT]
>For the purposes of this quick start we will deploy Event grid module without persistence. This means the topics and subscriptions you create in this tutorial will be deleted if you redeploy the module. Documentation on how to setup persistence on [Linux](persist-state-linux.md) or [Windows](persist-state-windows.md) is also available. For production workloads we do recommend you install Event Grid module with persistence.

## Deploy Event Grid Module

### Select your device

1. Sign in to the [Azure portal](https://ms.portal.azure.com)
1. Navigate to the IoT Hub
1. Select **IoT Edge** from the menu
1. Click on the ID of the target device from the list of devices
1. Select **Set Modules**

### Configure a deployment manifest

A deployment manifest is a JSON document that describes which modules to deploy, how data flows between the modules, and desired properties of the module twins. The Azure portal has a wizard that walks you through creating a deployment manifest, instead of building the JSON document manually

1. In the **Deployment Modules** section, select **Add**
1. From the types of modules in the drop-down list, select **IoT Edge Module**
1. Provide the name, image of the container:

   * **Name**: eventgridmodule
   * **Image URI**: msint.azurecr.io/azure-event-grid/iotedge:latest

1. Use the JSON provided below for **Container  Create Options**.  For the purposes of the quickstart, the configuration is simplified as follows:

    * Exposes Event Grid module's HTTPs' port onto the host machine
    * Turns off client authentication
    * Allows HTTP subscribers

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
 1. Click **Next** to continue to the routes section
 1. Keep the default routes, and select **Next** to continue to the review section

### Review deployment

The review section shows you the JSON deployment manifest that was created based on your selections in the previous two sections. There are also two modules declared that you didn't add: $edgeAgent and $edgeHub. These two modules make up the IoT Edge runtime and are required defaults in every deployment.

Review your deployment information, then select **Submit**.

### Verify your deployment

After you submit the deployment, you return to the IoT Edge page of your IoT hub.

Select the IoT Edge device that you targeted with the deployment to open its details.
In the device details, verify that the Event grid module is listed as both **Specified in deployment** and **Reported by device**.

It may take a few moments for the module to be started on the device and then reported back to IoT Hub. Refresh the page to see an updated status.

## Deploy Subscriber Module

Next, deploy the subscriber module that will register to receive events from Event Grid module.

1. Sign in to the [Azure portal](https://ms.portal.azure.com)
1. Navigate to the IoT Hub
1. Select **IoT Edge** from the menu
1. Click on the ID of the target device from the list of devices
1. Select **Set Modules**
1. In the **Deployment Modules** section, select **Add**
1. From the types of modules in the drop-down list, select **IoT Edge Module**
1. Provide the name, image of the container:

   * **Name**: subscriber
   * **Image URI**: msint.azurecr.io/azure-event-grid/iotedge-samplesubscriber-azfunc:latest

1. Use the JSON provided below for **Container  Create Options**.  The configuration:

    * Exposes subscriber module on port 8080 on the host machine

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
 1. Click **Next** to continue to the routes section, click **Next**
 1. Review deployment shows all the modules that will be deployed. It should have $edgeAgent, $edgeHub, eventgridmodule, and subscriber modules listed.
 1. Click **Submit**

After you submit the deployment, you return to the IoT Edge page of your IoT hub.

Select the IoT Edge device that you targeted with the deployment to open its details.
In the device details, verify that the subscriber module is listed as both **Specified in deployment** and **Reported by device**.

It may take a few moments for the module to be started on the device and then reported back to IoT Hub. Refresh the page to see an updated status.

The following sections cover how to create topic, subscription, and publish events to Event Grid. For the purposes of this quickstart, we will use curl commands. To complete the next section, you will need to retrieve public IP of your edge device.

## Create Topic

1. Create topic.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

   ```json
   {
       "name": "sampleTopic1",
       "properties" : {
          "inputschema": "customeventschema",
       },
   }
   ```

1. Run the following command to create the topic. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @topic.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1?api-version=2019-01-01
    ```

## Create Event Subscription

1. Create subscription.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

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

2. Run the following command to create the subscription. HTTP Status Code of 200 OK should be returned.

    ```sh
    curl -k -H "Content-Type: application/json" -X PUT -g -d @subscription.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1/eventSubscriptions/sampleSubscription1?api-version=2019-01-01
    ```

## Publish Event

1. Create event.json with the below content. Refer to our [API documentation](api.md) for details about the payload.

   ```json
   [{
       "data": {
            "make": "Ducati",
            "model": "Monster"
        }
    }]
    ```

1. Run the following command to publish event

    ```sh
    curl -k -H "Content-Type: application/json" -X POST -g -d @event.json https://<your-edge-device-public-ip-here>:4438/topics/sampleTopic1/eventSubscriptions/sampleSubscription1?api-version=2019-01-01
    ```

## Verify Event Delivery

1. SSH or RDP into your VM.
1. Run the following command to check the logs on the subscriber to confirm delivery.

On Windows,

```sh
docker -H npipe:////./pipe/iotedge_moby_engine container logs subscriber
```

On Linux,

```sh
sudo docker logs subscriber
```

Sample Output: -

```json
 Received event data [
        {
          "data": {
            "make": "Ducati",
            "model": "Monster"
          }
        }
      ]
```

## Summary

In this tutorial you learnt how to: -

1. Deploy Azure Event Grid IoT module to your edge device.
2. Deploy a sample HTTP subscriber module that can be used to subscribe to events.
3. Create an event grid topic and subscription.
4. Publish events on the topic, and verified that the event was delivered to the subscriber.
