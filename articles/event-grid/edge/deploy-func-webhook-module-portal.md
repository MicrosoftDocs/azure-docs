---
title: Deploy Azure Function module - Azure Event Grid IoT Edge | Microsoft Docs 
description: Deploy Azure Function as a Subscriber from Azure portal
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: 
ms.date: 07/23/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Tutorial: Deploy Azure Function IoT Edge module

This article walks through the steps to deploy Azure Functions IoT Module capable of receiving Event Grid events.

## Prerequisites

In order to complete this tutorial, you will need:-

* **Azure Event Grid module on IoT Edge Device** - Follow the steps in described [here](deploy-event-grid-portal.md) on how to do that if not already done.

>[!IMPORTANT]
>For the purposes of this tutorial, we will deploy a sample Azure Function based subscribing module. It can of course be any custom IoT Module that can listen for HTTP POST requests.

## Select your IoT Edge device

1. Sign in to the [Azure portal](https://ms.portal.azure.com)
1. Navigate to the IoT Hub
1. Select **IoT Edge** from the menu
1. Click on the ID of the target device from the list of devices
1. Select **Set Modules**

## Configure a deployment manifest

A deployment manifest is a JSON document that describes which modules to deploy, how data flows between the modules, and desired properties of the module twins. The Azure portal has a wizard that walks you through creating a deployment manifest, instead of building the JSON document manually.  It has three steps: **Add modules**, **Specify routes**, and **Review deployment**.

### Add modules

1. In the **Deployment Modules** section, select **Add**
1. From the types of modules in the drop-down list, select **IoT Edge Module**
1. Provide the name, image, and container create options of the container:

   * **Name**: subscriber
   * **Image URI**: msint.azurecr.io/azure-event-grid/iotedge-samplesubscriber-azfunc:latest
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

### Review deployment

The review section shows you the JSON deployment manifest that was created based on your selections in the previous section. There are three modules declared that you didn't add: **$edgeAgent**, **$edgeHub** and **eventgridmodule** that were deployed previously.

Review your deployment information, then select **Submit**.

## Verify your deployment

After you submit the deployment, you return to the IoT Edge page of your IoT hub.

Select the IoT Edge device that you targeted with the deployment to open its details.
In the device details, verify that the subscriber module is listed as both **Specified in deployment** and **Reported by device**.

It may take a few moments for the module to be started on the device and then reported back to IoT Hub. Refresh the page to see an updated status.

## Next steps

Follow this [tutorial](pub-sub-events-webhook-local.md) on how-to publish and subscribe to events locally using Event Grid on IoT Edge.