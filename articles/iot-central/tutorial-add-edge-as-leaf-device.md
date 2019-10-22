---
title: Add a edge device to an Azure IoT Central | Microsoft Docs
description: As an operator, add a real edge device to your Azure IoT Central
author: rangavadlamudi
ms.author: rangv
ms.date: 10/22/2019
ms.topic: tutorial
ms.service: iot-central
services: iot-central
ms.custom: mvc
manager: peterpr
---

# Tutorial: Add a edge device to your Azure IoT Central application (preview features)

[!INCLUDE [iot-central-pnp-original](../../includes/iot-central-pnp-original-note.md)]

This tutorial shows you how to add and configure a *azure iot edge device* to your Microsoft Azure IoT Central application. In this tutorial, For this we chose an Azure IoT Edge enabled Linux VM from Azure Marketplace.

This tutorial is made up of two parts:

* First, as an operator, you learn how to do cloud first provisioning of an azure iot edge device.
* Then, you will learn how to do device first provisioning of an azure iot edge device.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a new edge device
> * Configure the edge device to help provision using SAS Key
> * View Dashboards, Module Health in IoT Central
> * Send commands to a module running on the edge device
> * Set properties on a module running on the edge device

##Enable Edge Enrollment Group
Enable SAS keys for Azure IoT Edge enrollment group from the Administration page.

## Next steps

In this tutorial, you learned how to:

* Create a new edge as a leaf device template
* Generate Modules from an uploaded deployment manifest
* Add Complex Type Telemetry and properties
* Create cloud properties.
* Create customizations.
* Define a visualization for the device telemetry.
* Publish your edge device template.

Now that you've created a device template in your Azure IoT Central application, here is the suggested next step:

> [!div class="nextstepaction"]
> [Add Edge device](tutorial-add-edge-as-leaf-device.md?toc=/azure/iot-central-pnp/toc.json&bc=/azure/iot-central-pnp/breadcrumb/toc.json)
