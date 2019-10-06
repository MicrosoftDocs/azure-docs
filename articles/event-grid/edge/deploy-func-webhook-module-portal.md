---
title: Deploy Azure Function module - Azure Event Grid IoT Edge | Microsoft Docs 
description: Deploy Azure Function as a Subscriber from Azure portal
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru 
ms.date: 10/06/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Tutorial: Deploy Azure Function IoT Edge module

This article shows you how to deploy the Azure Functions IoT module, which would act as an Event Grid subscriber to which events can be delivered.

## Prerequisites

To complete this tutorial, you will need:-

* **Azure Event Grid module on an IoT Edge Device**. Follow the steps in described in the [Tutorial: Deploy Event Grid IoT Edge module](deploy-event-grid-portal.md) article if you don't have this set up.

>[!IMPORTANT]
>In this tutorial, you will deploy a sample Azure Function-based subscribing module. It can of course be any custom IoT Module that can listen for HTTP POST requests.

## Select your IoT Edge device

1. Sign in to the [Azure portal](https://portal.azure.com)
1. Navigate to your IoT Hub.
1. Select **IoT Edge** from the menu
1. Select the ID of the target device from the list of devices.
1. Select **Set Modules**

## Configure a deployment manifest

A deployment manifest is a JSON document that describes which modules to deploy, how data flows between the modules, and desired properties of the module twins. The Azure portal has a wizard that walks you through creating a deployment manifest, instead of manually building the JSON document. It has three steps: **Add modules**, **Specify routes**, and **Review deployment**.

### Add modules

1. In the **Deployment Modules** section, select **Add**
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

### Review deployment

1. The review section shows you the JSON deployment manifest that was created based on your selections in the previous section. Confirm that you see the following three modules: **$edgeAgent**, **$edgeHub** and **eventgridmodule** that were deployed previously.
1. Review your deployment information, then select **Submit**.

## Verify your deployment

1. After you submit the deployment, you return to the IoT Edge page of your IoT hub.
1. Select the **IoT Edge device** that you targeted with the deployment to open its details.
1. In the device details, verify that the subscriber module is listed as both **Specified in deployment** and **Reported by device**.

    It may take a few moments for the module to be started on the device and then reported back to IoT Hub. Refresh the page to see an updated status.

## Next steps

Next, you can [publish and subscribe](pub-sub-events-webhook-local.md) to events locally using Event Grid on IoT Edge.
