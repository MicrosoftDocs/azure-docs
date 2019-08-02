---
title: Deploy modules from Azure portal - Azure IoT Edge | Microsoft Docs 
description: Use the Azure portal to deploy modules to an IoT Edge device
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 06/25/2019
ms.topic: conceptual
ms.reviewer: menchi
ms.service: iot-edge
services: iot-edge
ms.custom: seodec18
---

# Deploy Azure IoT Edge modules from the Azure portal

Once you create IoT Edge modules with your business logic, you want to deploy them to your devices to operate at the edge. If you have multiple modules that work together to collect and process data, you can deploy them all at once and declare the routing rules that connect them.

This article shows how the Azure portal guides you through creating a deployment manifest and pushing the deployment to an IoT Edge device. For information about creating a deployment that targets multiple devices based on their shared tags, see [Deploy and monitor IoT Edge modules at scale](how-to-deploy-monitor.md)

## Prerequisites

* An [IoT hub](../iot-hub/iot-hub-create-through-portal.md) in your Azure subscription.
* An [IoT Edge device](how-to-register-device-portal.md) with the IoT Edge runtime installed.

## Select your device

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.
1. Select **IoT Edge** from the menu.
1. Click on the ID of the target device from the list of devices.
1. Select **Set Modules**.

## Configure a deployment manifest

A deployment manifest is a JSON document that describes which modules to deploy, how data flows between the modules, and desired properties of the module twins. For more information about how deployment manifests work and how to create them, see [Understand how IoT Edge modules can be used, configured, and reused](module-composition.md).

The Azure portal has a wizard that walks you through creating the deployment manifest, instead of building the JSON document manually. It has three steps: **Add modules**, **Specify routes**, and **Review deployment**.

### Add modules

1. In the **Container Registry Settings** section of the page, provide the credentials to access any private container registries that contain your module images.

1. In the **Deployment Modules** section of the page, select **Add**.

1. Look at the types of modules from the drop-down list:

   * **IoT Edge Module** - the default option.
   * **Azure Stream Analytics Module** - only modules generated from an Azure Stream Analytics workload.
   * **Azure Machine Learning Module** - only model images generated from an Azure Machine Learning workspace.

1. Select the **IoT Edge Module**.

1. Provide a name for the module, then specify the container image. For example:

   * **Name** - tempSensor
   * **Image URI** - mcr.microsoft.com/azureiotedge-simulated-temperature-sensor:1.0

1. Fill out the optional fields if necessary. For more information about container create options, restart policy, and desired status see [EdgeAgent desired properties](module-edgeagent-edgehub.md#edgeagent-desired-properties). For more information about the module twin see [Define or update desired properties](module-composition.md#define-or-update-desired-properties).

1. Select **Save**.

1. Repeat steps 2-6 to add additional modules to your deployment.

1. Select **Next** to continue to the routes section.

### Specify routes

By default the wizard gives you a route called **route** and defined as **FROM /* INTO $upstream**, which means that any messages output by any modules are sent to your IoT hub.  

Add or update the routes with information from [Declare routes](module-composition.md#declare-routes), then select **Next** to continue to the review section.

### Review deployment

The review section shows you the JSON deployment manifest that was created based on your selections in the previous two sections. Note that there are two modules declared that you didn't add: **$edgeAgent** and **$edgeHub**. These two modules make up the [IoT Edge runtime](iot-edge-runtime.md) and are required defaults in every deployment.

Review your deployment information, then select **Submit**.

## View modules on your device

Once you've deployed modules to your device, you can view all of them in the **Device details** page of the portal. This page displays the name of each deployed module, as well as useful information like the deployment status and exit code.

## Deploy modules from Azure Marketplace

Azure Marketplace is an online applications and services marketplace where you can browse through a wide range of enterprise applications and solutions that are certified and optimized to run on Azure, including [IoT Edge modules](https://azuremarketplace.microsoft.com/marketplace/apps/category/internet-of-things?page=1&subcategories=iot-edge-modules). Azure Marketplace can also be accessed through the Azure portal under **Create a Resource**.

You can install an IoT Edge module from either Azure Marketplace or the Azure portal:

1. Find a module and begin the deployment process.

   * Azure portal: Find a module and select **Create**.

   * Azure Marketplace:

     1. Find a module and select **Get it now**.
     1. Acknowledge the provider's terms of use and privacy policy by selecting **Continue**.

1. Choose your subscription and the IoT Hub to which the target device is attached.

1. Choose **Deploy to a device**.

1. Enter the name of the device or select **Find Device** to browse among the devices registered with the hub.

1. Select **Create** to continue the standard process of configuring a deployment manifest, including adding other modules if desired. Details for the new module such as image URI, create options, and desired properties are predefined but can be changed.

## Next steps

Learn how to [Deploy and monitor IoT Edge modules at scale](how-to-deploy-monitor.md)
