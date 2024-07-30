---
title: Deploy modules from Azure portal - Azure IoT Edge 
description: Use your IoT Hub in the Azure portal to push an IoT Edge module from your IoT Hub to your IoT Edge device, as configured by a deployment manifest.
author: PatAltimore

ms.author: patricka
ms.date: 06/12/2024
ms.topic: how-to
ms.service: iot-edge
services: iot-edge
---

# Deploy Azure IoT Edge modules from the Azure portal

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

> [!IMPORTANT]
> Starting August 28th 2024, Azure Marketplace is updating the distribution model for IoT Edge modules. Partners (module publishers) will begin [hosting their IoT Edge modules](https://azuremarketplace.microsoft.com/marketplace/apps/category/internet-of-things?subcategories=iot-edge-modules&filters=partners&page=1) on publisher-owned container registries. IoT Edge module images won't be available for download from the Azure Marketplace container registry.
>
> Contact the [IoT Edge module publisher](https://azuremarketplace.microsoft.com/marketplace/apps/category/internet-of-things?filters=partners&subcategories=iot-edge-modules&page=1) to obtain the updated container image URI and [update your IoT Edge device configurations](how-to-update-iot-edge.md#update-partner-module-uris) with the new image URI provided by the publisher.
>
> IoT Edge devices that don't use [partner modules](https://azuremarketplace.microsoft.com/marketplace/apps/category/internet-of-things?filters=partners&page=1&subcategories=iot-edge-modules) acquired from Azure Marketplace aren't affected and no action is required.

Once you create IoT Edge modules with your business logic, you want to deploy them to your devices to operate at the edge. If you have multiple modules that work together to collect and process data, you can deploy them all at once and declare the routing rules that connect them.

This article shows how the Azure portal guides you through creating a deployment manifest and pushing the deployment to an IoT Edge device. For information about creating a deployment that targets multiple devices based on their shared tags, see [Deploy and monitor IoT Edge modules at scale](how-to-deploy-at-scale.md).

## Prerequisites

* An [IoT Hub](../iot-hub/iot-hub-create-through-portal.md) in your Azure subscription.
* An IoT Edge device.

  If you don't have an IoT Edge device set up, you can create one in an Azure virtual machine. Follow the steps in one of the quickstart articles to [Create a virtual Linux device](quickstart-linux.md) or [Create a virtual Windows device](quickstart.md).

## Configure a deployment manifest

A deployment manifest is a JSON document that describes which modules to deploy, how data flows between the modules, and desired properties of the module twins. For more information about how deployment manifests work and how to create them, see [Understand how IoT Edge modules can be used, configured, and reused](module-composition.md).

The Azure portal has a wizard that walks you through creating the deployment manifest, instead of building the JSON document manually. It has three steps: **Add modules**, **Specify routes**, and **Review deployment**.

>[!NOTE]
>The steps in this article reflect the latest schema version of the IoT Edge agent and hub. Schema version 1.1 was released along with IoT Edge version 1.0.10, and enables the module startup order and route prioritization features.
>
>If you are deploying to a device running version 1.0.9 or earlier, edit the **Runtime Settings** in the **Modules** step of the wizard to use schema version 1.0.

### Select device and add modules

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT Hub.
1. On the left pane, select **Devices** under the **Device management** menu.
1. Select the target IoT Edge device from the list.
1. On the upper bar, select **Set Modules**.
1. In the **Container Registry Credentials** section of the page, provide credentials to access container registries that contain module images. For example, your modules are in your private container registry or you are using a partner container registry that requires authentication.
1. In the **IoT Edge Modules** section of the page, select **Add**.

    :::image type="content" source="media/how-to-deploy-modules-portal/set-modules-add.png" alt-text="Screenshot of selecting add IoT Edges modules toolbar button in the Azure portal.":::

1. Choose the type of modules you want to add from the drop-down menu. You can add IoT Edge modules or Azure Stream Analytics modules.

#### IoT Edge Module

Use this option to add Microsoft modules, partner modules, or custom modules. You provide the module name and container image URI. The container image URI is the location of the module image in a container registry. For a list of Microsoft IoT Edge module images, see the [Microsoft Artifact Registry](https://mcr.microsoft.com/catalog?cat=IoT%20Edge%20Modules&alphaSort=asc&alphaSortKey=Name). For partner modules, contact the IoT Edge module publisher to obtain the container image URI.

For example to add the Microsoft simulated temperature sensor module:

1. Enter the following settings:

    | Setting | Value |
    |---------|-------|
    |Image URI | `mcr.microsoft.com/azureiotedge-simulated-temperature-sensor` |
    |Restart Policy | always |
    |Desired Status | running |
    
    :::image type="content" source="media/how-to-deploy-modules-portal/add-edge-module.png" alt-text="Screenshot showing adding IoT Edge settings for the simulated temperature sensor module in the Azure portal.":::
  
1. Select **Add**.
1. After adding a module, select the module name from the list to open the module settings. Fill out the optional fields if necessary.

    :::image type="content" source="media/how-to-deploy-modules-portal/update-module-settings.png" alt-text="Screenshot showing module list links to update IoT Edge module settings in the Azure portal.":::

For more information about the available module settings, see [Module configuration and management](module-composition.md#module-configuration-and-management).

   For more information about the module twin, see [Define or update desired properties](module-composition.md#define-or-update-desired-properties).

#### Azure Stream Analytics Module

Use this option for modules generated from an Azure Stream Analytics workload.

1. Select your subscription and the Azure Stream Analytics Edge job that you created.
1. Select **Save**.

For more information about deploying Azure Stream Analytics in an IoT Edge module, see [Tutorial: Deploy Azure Stream Analytics as an IoT Edge module](tutorial-deploy-stream-analytics.md).

### Specify routes

On the **Routes** tab, you define how messages are passed between modules and the IoT Hub. Messages are constructed using name/value pairs. By default, the first deployment for a new device includes a route called **route** and defined as **FROM /messages/\* INTO $upstream**, which means that any messages output by any modules are sent to your IoT Hub.  

The **Priority** and **Time to live** parameters are optional parameters that you can include in a route definition. The priority parameter allows you to choose which routes should have their messages processed first, or which routes should be processed last. Priority is determined by setting a number 0-9, where 0 is top priority. The time to live parameter allows you to declare how long messages in that route should be held until they're either processed or removed from the queue.

For more information about how to create routes, see [Declare routes](module-composition.md#declare-routes).

Once the routes are set, select **Next: Review + create** to continue to the next step of the wizard.

### Review deployment

The review section shows you the JSON deployment manifest that was created based on your selections in the previous two sections. Note that there are two modules declared that you didn't add: **$edgeAgent** and **$edgeHub**. These two modules make up the [IoT Edge runtime](iot-edge-runtime.md) and are required defaults in every deployment.

Review your deployment information, then select **Create**.

## View modules on your device

Once you've deployed modules to your device, you can view all of them in the device details page of your IoT Hub. This page displays the name of each deployed module, as well as useful information like the deployment status and exit code.

Select **Next: Routes** and continue with deployment as described by [Specify routes](#specify-routes) and [Review Deployment](#review-deployment) earlier in this article.

## Next steps

Learn how to [Deploy and monitor IoT Edge modules at scale](how-to-deploy-at-scale.md).
