---
title: Deploy Event Grid module - Azure Event Grid IoT Edge | Microsoft Docs 
description: Deploy Event Grid IoT Edge Module from Azure portal
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: 
ms.date: 07/23/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Tutorial: Deploy Event Grid IoT Edge module

There are several ways to deploy modules to an IoT Edge device and all of them work for Azure Event Grid on IoT Edge. This article describes the steps to deploy Event Grid on IoT Edge from Azure portal. 

## Prerequisites

In order to complete this tutorial, you will need:-

* **Azure Subscription** - Create a [free account](https://azure.microsoft.com/free) if you don't already have one.

* **Azure IoT Hub and IoT Edge Device** - Follow the steps in the quickstart for [Linux](../../iot-edge/quickstart-linux.md) or [Windows devices](../../iot-edge/quickstart.md) if you don't already have one.

>[!IMPORTANT]
>For the purposes of this tutorial, we will deploy Event grid module without persistence. This means any topics and subscriptions you create in this tutorial will be deleted if you redeploy the module. Documentation on how to setup persistence on [Linux](persist-state-linux.md) or [Windows](persist-state-windows.md) is also available. For production workloads we do recommend you install Event Grid module with persistence.

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
1. Provide the name, image of the container:

   * **Name**: eventgridmodule
   * **Image URI**: msint.azurecr.io/azure-event-grid/iotedge:latest

1. Use the JSON provided below for **Container  Create Options**.  For the purposes of the quickstart, the configuration is simplified as follows:

    * Exposes Event Grid module's HTTPs' port onto the host machine - Needed so that we can create topics/subscriptions from outside the container network.
    * Turns off client authentication - To simplify the tutorial.
    * Allows HTTP subscribers - - Needed so that we can register an Azure Function IoT module as an HTTP Listener. Default is to only allow HTTPs.

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

 ### Setup routes

 Keep the default routes, and select **Next** to continue to the review section

### Review deployment

The review section shows you the JSON deployment manifest that was created based on your selections in the previous two sections. There are also two modules declared that you didn't add: $edgeAgent and $edgeHub. These two modules make up the IoT Edge runtime and are required defaults in every deployment.

Review your deployment information, then select **Submit**.

## Verify your deployment

After you submit the deployment, you return to the IoT Edge page of your IoT hub.

Select the IoT Edge device that you targeted with the deployment to open its details.
In the device details, verify that the Event grid module is listed as both **Specified in deployment** and **Reported by device**.

It may take a few moments for the module to be started on the device and then reported back to IoT Hub. Refresh the page to see an updated status.

## Next steps

Next, deploy a [subscriber module](deploy-func-webhook-module-portal.md) that can receive Event Grid events.