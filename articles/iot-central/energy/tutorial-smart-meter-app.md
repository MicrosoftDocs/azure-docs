---
title: Tutorial - Azure IoT smart meter monitoring | Microsoft Docs
description: This tutorial shows you how to deploy and use the smart meter monitoring application template for IoT Central.
author: dominicbetts
ms.author: dobett
ms.date: 06/14/2022
ms.topic: tutorial
ms.service: iot-central
services: iot-central
manager: abjork
---

# Tutorial: Deploy and walk through the smart meter monitoring application template

The smart meters not only enable automated billing, but also advanced metering use cases such as real-time readings and bi-directional communication. The _smart meter monitoring_ application template enables utilities and partners to monitor smart meters status and data, define alarms and notifications. It provides sample commands, such as disconnect meter and update software. The meter data can be set up to egress to other business applications and to develop custom solutions.

App's key functionalities:

- Meter sample device model
- Meter info and live status
- Meter readings such as energy, power, and voltages
- Meter command samples
- Built-in visualization and dashboards
- Extensibility for custom solution development


:::image type="content" source="media/tutorial-iot-central-smart-meter/smart-meter-app-architecture.png" alt-text="smart meter architecture.":::

This architecture consists of the following components. Some solutions may not require every component listed here.

### Smart meters and connectivity

A smart meter is one of the most important devices among all the energy assets. It records and communicates energy consumption data to utilities for monitoring and other use cases, such as billing and demand response. Typically, a meter uses a gateway or bridge to connect to an IoT Central application. To learn more about bridges, see [Use the IoT Central device bridge to connect other IoT clouds to IoT Central](../core/howto-build-iotc-device-bridge.md).

### IoT Central platform

When you build an IoT solution, Azure IoT Central simplifies the build process and helps to reduce the burden and costs of IoT management, operations, and development. With IoT Central, you can easily connect, monitor, and manage your Internet of Things (IoT) assets at scale. After you connect your smart meters to IoT Central, the application template uses built-in features such as device models, commands, and dashboards. The application template also uses the IoT Central storage for warm path scenarios such as near real-time meter data monitoring, analytics, rules, and visualization.

### Extensibility options to build with IoT Central

The IoT Central platform provides two extensibility options: Continuous Data Export (CDE) and APIs. The customers and partners can choose between these options based to customize their solutions for specific needs. For example, one of our partners configured CDE with Azure Data Lake Storage (ADLS). They're using ADLS for long-term data retention and other cold path storage scenarios, such batch processing, auditing and reporting purposes.

In this tutorial, you learn how to:

- Create the smart meter app
- Application walk-through
- Clean up resources

## Prerequisites

An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a smart meter monitoring application

1. Navigate to the [Azure IoT Central Build](https://aka.ms/iotcentral) site. Then sign in with a Microsoft personal, work, or school account. Select **Build** from the left-hand navigation bar and then select the **Energy** tab:

    :::image type="content" source="media/tutorial-iot-central-smart-meter/smart-meter-build.png" alt-text="Smart meter template":::

1. Select **Create app** under **Smart meter monitoring**.

To learn more, see [Create an IoT Central application](../core/howto-create-iot-central-application.md).

## Walk through the application

The following sections walk you through the key features of the application:

### Dashboard

After you deploy the application template, it comes with sample smart meter device, device model, and a dashboard.

Adatum is a fictitious energy company, who monitors and manages smart meters. On the smart meter monitoring dashboard, you see smart meter properties, data, and sample commands. It enables operators and support teams to proactively perform the following activities before it turns into support incidents:

* Review the latest meter info and its installed [location](../core/howto-use-location-data.md) on the map.
* Proactively check the meter network and connection status.
* Monitor Min and Max voltage readings for network health.
* Review the energy, power, and voltage trends to catch any anomalous patterns.
* Track the total energy consumption for planning and billing purposes.
* Command and control operations such as reconnect meter and update firmware version. In the template, the command buttons show the possible functionalities and don't send real commands.

:::image type="content" source="media/tutorial-iot-central-smart-meter/smart-meter-dashboard.png" alt-text="Smart meter monitoring dashboard.":::

### Devices

The app comes with a sample smart meter device. You can see the device details by clicking on the **Devices** tab.

:::image type="content" source="media/tutorial-iot-central-smart-meter/smart-meter-devices.png" alt-text="Smart meter devices.":::

Click on the sample device **SM0123456789** link to see the device details. You can update the writable properties of the device on the **Update Properties** page, and visualize the updated values on the dashboard.

:::image type="content" source="media/tutorial-iot-central-smart-meter/smart-meter-device-properties.png" alt-text="Smart meter properties.":::

### Device Template

Click on the **Device templates** tab to see the smart meter device model. The model has pre-define interface for Data, Property, Commands, and Views.

:::image type="content" source="media/tutorial-iot-central-smart-meter/smart-meter-device-template.png" alt-text="Smart meter device templates.":::

## Clean up resources

If you decide to not continue using this application, delete your application with the following these steps:

1. From the left pane, open the **Application** tab.
1. Select **Management** and then the **Delete** button.

    :::image type="content" source="media/tutorial-iot-central-smart-meter/smart-meter-delete-app.png" alt-text="Delete application.":::

## Next steps

> [Tutorial: Deploy and walk through a Solar panel application template](tutorial-solar-panel-app.md)
