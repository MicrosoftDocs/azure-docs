---
title: Connect an Azure Sphere device in Azure IoT Central | Microsoft Docs
description: Learn how to connect an Azure Sphere (DevKit) device to an Azure IoT Central application. 
services: iot-central
ms.service: iot-central
ms.topic: how-to
ms.author: sandeepu
author: sandeeppujar
ms.date: 04/30/2020
---

# Connect an Azure Sphere device to your Azure IoT Central application

*This article applies to device developers.*

This article shows you how to connect an Azure Sphere (DevKit) device to an Azure IoT Central application.

Azure Sphere is a secured, high-level application platform with built-in communication and security features for internet-connected devices. It includes a secured, connected, crossover microcontroller unit (MCU), a custom high-level Linux-based operating system (OS), and a cloud-based security service that provides continuous, renewable security. For more information, see [What is Azure Sphere?](https://docs.microsoft.com/azure-sphere/product-overview/what-is-azure-sphere).

[Azure Sphere development kits](https://azure.microsoft.com/services/azure-sphere/get-started/) provide everything you need to start prototyping and developing Azure Sphere applications. Azure IoT Central with Azure Sphere enables an end-to-end stack for an IoT Solution. Azure Sphere provides the device support and IoT Central as a zero-code, managed IoT application platform.

In this how-to article, you:

- Create an Azure Sphere device in IoT Central using the Azure Sphere DevKit device template from the library.
- Prepare Azure Sphere DevKit device for Azure IoT.
- Connect Azure Sphere DevKit to Azure IoT Central.
- View the telemetry from the device in IoT Central.

## Prerequisites

To complete the steps in this article, you need the following resources:

- An Azure IoT Central application.
- Visual Studio 2019, version 16.4 or later.
- An [Azure Sphere MT3620 development kit from Seeed Studios](https://docs.microsoft.com/azure-sphere/hardware/mt3620-reference-board-design).

> [!NOTE]
> If you don't have a physical device, then after the first step step skip to the last section to try a simulated device.

## Create the device in IoT Central

To create an Azure Sphere device in IoT Central:

1. In your Azure IoT Central application, select the **Device Templates** tab and select **+ New**. In the section **Use a featured device template**, select **Azure Sphere Sample Device**.

    :::image type="content" source="media/howto-connect-sphere/sphere-create-template.png" alt-text="Device template for Azure Sphere DevKit":::

1. In the device template, edit the view called **Overview** to show **Temperature** and **Button Press**.

1. Select the **Editing Device and Cloud Data** view type to add another view that shows the read/write property **Status LED**. Drag the **Status LED** property to the empty, dotted rectangle on the right-side of the form. Select **Save**.

## Prepare the device

Before you can connect the Azure Sphere DevKit device to IoT Central, you need to [setup the device and development environment](https://github.com/Azure/azure-sphere-samples/tree/master/Samples/AzureIoT).

## Connect the device

To enable the sample to connect to IoT Central, you must [configure an Azure IoT Central application and then modify the sample's application manifest](https://aka.ms/iotcentral-sphere-git-readme).

## View the telemetry from the device

When the device is connected to IoT Central, you can see the telemetry on the dashboard.

:::image type="content" source="media/howto-connect-sphere/sphere-view.png" alt-text="Dashboard for Azure Sphere DevKit":::

## Create a simulated device

If you don't have a physical Azure Sphere DevKit device, you can create a simulated device to try Azure IoT Central application.

To create a simulated device:

- Select **Devices > Azure IoT Sphere**
- Select **+ New**.
- Enter a unique **Device ID** and a friendly **Device name**.
- Enable the **Simulated** setting.
- Select **Create**.

## Next steps

If you're a device developer, some suggested next steps are to:

- Read about [Device connectivity in Azure IoT Central](./concepts-get-connected.md)
- Learn how to [Monitor device connectivity using Azure CLI](./howto-monitor-devices-azure-cli.md)
