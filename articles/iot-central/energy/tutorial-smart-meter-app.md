---
title: Tutorial - Azure IoT smart-meter monitoring
description: This tutorial shows you how to deploy and use an application template for monitoring smart meters in Azure IoT Central.
author: dominicbetts
ms.author: dobett
ms.date: 06/14/2022
ms.topic: tutorial
ms.service: iot-central
services: iot-central
manager: abjork
---

# Tutorial: Deploy and walk through an application template for monitoring smart meters

Smart meters enable not only automated billing, but also advanced metering use cases like real-time readings and bidirectional communication. 

An application template enables utilities and partners to monitor the status and data of smart meters, along with defining alarms and notifications. The template provides sample commands, such as disconnecting a meter and updating software. You can set up the meter data to egress to other business applications, and to develop custom solutions.

The application's key functionalities include:

- Sample device model for meters
- Meter info and live status
- Meter readings such as energy, power, and voltage
- Meter command samples
- Built-in visualization and dashboards
- Extensibility for custom solution development

In this tutorial, you learn how to:

- Create an application for monitoring smart meters.
- Walk through the application.
- Clean up resources.

## Application architecture

:::image type="content" source="media/tutorial-iot-central-smart-meter/smart-meter-app-architecture.png" alt-text="Diagram of the architecture of a smart-meter application." border="false":::

The architecture of the application consists of the following components. Some solutions might not require every component listed here.

### Smart meters and connectivity

A smart meter is one of the most important devices among all the energy assets. It records and communicates energy consumption data to utilities for monitoring and other use cases, such as billing and demand response. 

Typically, a meter uses a gateway or bridge to connect to an Azure IoT Central application. To learn more about bridges, see [Use the Azure IoT Central device bridge to connect other IoT clouds to Azure IoT Central](../core/howto-build-iotc-device-bridge.md).

### Azure IoT Central platform

When you build an Internet of Things (IoT) solution, Azure IoT Central simplifies the build process and helps reduce the burden and costs of IoT management, operations, and development. With Azure IoT Central, you can easily connect, monitor, and manage your IoT assets at scale. 

After you connect your smart meters to Azure IoT Central, the application template uses built-in features such as device models, commands, and dashboards. The application template also uses the Azure IoT Central storage for warm path scenarios such as near real-time meter data monitoring, analytics, rules, and visualization.

### Extensibility options to build with Azure IoT Central

The Azure IoT Central platform provides two extensibility options: Continuous Data Export and APIs. Customers and partners can choose between these options to customize their solutions for their specific needs. 

For example, a partner might configure Continuous Data Export with Azure Data Lake Storage. That partner can then use Data Lake Storage for long-term data retention and other scenarios for cold path storage, such batch processing, auditing, and reporting.

## Prerequisites

To complete this tutorial, you need an active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an application for monitoring smart meters

1. Go to the [Azure IoT Central build](https://aka.ms/iotcentral) site. Then sign in with a Microsoft personal, work, or school account. 

1. Select **Build** from the left menu, and then select the **Energy** tab.

    :::image type="content" source="media/tutorial-iot-central-smart-meter/smart-meter-build.png" alt-text="Screenshot that shows the Azure IoT Central build site with energy app templates.":::

1. Under **Smart meter monitoring**, select **Create app**.

To learn more, see [Create an Azure IoT Central application](../core/howto-create-iot-central-application.md).

## Walk through the application

The following sections walk you through the key features of the application.

### Dashboard

After you deploy the application template, it comes with a sample smart meter, a device model, and a dashboard.

Adatum is a fictitious energy company that monitors and manages smart meters. The dashboard for monitoring smart meters shows properties, data, and sample commands for meters. The dashboard enables operators and support teams to proactively perform the following activities before they become support incidents:

* Review the latest meter info and its installed [location](../core/howto-use-location-data.md) on the map.
* Proactively check the meter network and connection status.
* Monitor minimum and maximum voltage readings for network health.
* Review the energy, power, and voltage trends to catch any anomalous patterns.
* Track the total energy consumption for planning and billing purposes.
* Perform command and control operations, such as reconnecting a meter and updating a firmware version. In the template, the command buttons show the possible functionalities and don't send real commands.

:::image type="content" source="media/tutorial-iot-central-smart-meter/smart-meter-dashboard.png" alt-text="Screenshot that shows the dashboard for monitoring smart meters." lightbox="media/tutorial-iot-central-smart-meter/smart-meter-dashboard.png":::

### Devices

The application comes with a sample smart-meter device. You can see available devices by selecting **Devices** on the left menu.

:::image type="content" source="media/tutorial-iot-central-smart-meter/smart-meter-devices.png" alt-text="Screenshot that shows smart-meter devices." lightbox="media/tutorial-iot-central-smart-meter/smart-meter-devices.png":::

Select the link for sample device **SM0123456789** to see the device details. You can update the writable properties of the device on the **Update Properties** page, and then visualize the updated values on the dashboard.

:::image type="content" source="media/tutorial-iot-central-smart-meter/smart-meter-device-properties.png" alt-text="Screenshot that shows the properties of a smart-meter device." lightbox="media/tutorial-iot-central-smart-meter/smart-meter-device-properties.png":::

### Device template

Select **Device templates** on the left menu to see the model of the smart meter. The model has a predefined interface for data, properties, commands, and views.

:::image type="content" source="media/tutorial-iot-central-smart-meter/smart-meter-device-template.png" alt-text="Screenshot that shows a template for a smart-meter device." lightbox="media/tutorial-iot-central-smart-meter/smart-meter-device-template.png":::

## Customize your application

[!INCLUDE [iot-central-customize-appearance](../../../includes/iot-central-customize-appearance.md)]

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources-industry](../../../includes/iot-central-clean-up-resources-industry.md)]

## Next steps

> [Tutorial: Deploy and walk through a solar panel application template](tutorial-solar-panel-app.md)
