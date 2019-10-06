---
title: Deploy Event Grid module - Azure Event Grid IoT Edge | Microsoft Docs 
description: Deploy Event Grid IoT Edge Module from Azure portal
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 10/06/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Tutorial: Deploy Event Grid IoT Edge module

There are several ways to deploy modules to an IoT Edge device and all of them work for Azure Event Grid on IoT Edge. This article describes the steps to deploy Event Grid on IoT Edge from the Azure portal.

## Prerequisites

To complete this tutorial, you will need:

* An **Azure Subscription** - Create a [free account](https://azure.microsoft.com/free) if you don't already have one.

* An **Azure IoT Hub** and an **IoT Edge device** - Follow the steps in the quickstart for [Linux](../../iot-edge/quickstart-linux.md) or [Windows devices](../../iot-edge/quickstart.md) if you don't already have one.

>[!NOTE]
> In this tutorial, you will deploy the Event Grid module without persistence. It means that any topics and subscriptions you create in this tutorial will be deleted when you redeploy the module. For more information on how to setup persistence, see the following articles: [Persist state in Linux](persist-state-linux.md) or [Persist state in Windows](persist-state-windows.md). For production workloads, we recommend that you install the Event Grid module with persistence.

>[!IMPORTANT]
> In this tutorial, you will deploy the Event Grid module with client authentication disabled and allow HTTP subscribers. For production workloads, we recommend that you enable the client authentication and allow only HTTPs subscribers. For more information on how to configure Event Grid module securely, see [Security and authentication](security-authentication.md).

## Select your IoT Edge device

1. Sign in to the [Azure portal](https://portal.azure.com)
1. Navigate to your IoT Hub.
1. Select **IoT Edge** from the menu in the **Automatic Device Management** section. 
1. Click on the ID of the target device from the list of devices
1. Select **Set Modules**. Keep the page open. You will continue with the steps in the next section.

## Configure a deployment manifest

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
 1. Click **Next** to continue to the routes section

### Setup routes

 Keep the default routes, and select **Next** to continue to the review section

### Review deployment

1. The review section shows you the JSON deployment manifest that was created based on your selections in the previous two sections. Confirm that you see the two modules in the list: **$edgeAgent** and **$edgeHub**. These two modules make up the IoT Edge runtime and are required defaults in every deployment.
1. Review your deployment information, then select **Submit**.

## Verify your deployment

1. After you submit the deployment, you return to the IoT Edge page of your IoT hub.
1. Select the **IoT Edge device** that you targeted with the deployment to open its details.
1. In the device details, verify that the Event Grid module is listed as both **Specified in deployment** and **Reported by device**.

It may take a few moments for the module to be started on the device and then reported back to IoT Hub. Refresh the page to see an updated status.

## Next steps

Next, deploy a [subscriber module](deploy-func-webhook-module-portal.md) that can receive Event Grid events.
