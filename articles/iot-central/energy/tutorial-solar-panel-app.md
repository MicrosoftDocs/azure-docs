---
title: Tutorial - Azure IoT solar panel monitoring | Microsoft Docs
description: This tutorial shows you how to deploy and use the solar panel monitoring application template for IoT Central.
author: dominicbetts
ms.author: dobett
ms.date: 06/14/2022
ms.topic: tutorial
ms.service: iot-central
services: iot-central
manager: abjork
---

# Tutorial: Deploy and walk through the solar panel monitoring application template

The solar panel monitoring app enables utilities and partners to monitor solar panels, such as their energy generation and connection status in near real time. It can send notifications based on defined threshold criteria. It provides sample commands, such as update firmware and other properties. The solar panel data can be set up to egress to other business applications and to develop custom solutions.

Key application functionality:

- Solar panel sample device model
- Solar Panel info and live status
- Solar energy generation and other readings
- Command and control samples
- Built-in visualization and dashboards
- Extensibility for custom solution development

:::image type="content" source="media/tutorial-iot-central-solar-panel/solar-panel-app-architecture.png" alt-text="solar panel architecture.":::

This architecture consists of the following components. Some applications may not require every component listed here.

### Solar panels and connectivity

Solar panels are one of the significant sources of renewable energy. Typically, a solar panel uses a gateway to connect to an IoT Central application. You might need to build IoT Central device bridge to connect devices, which can't be connected directly. The IoT Central device bridge is an open-source solution and you can find the complete details [here](../core/howto-build-iotc-device-bridge.md).

### IoT Central platform

When you build an IoT solution, Azure IoT Central simplifies the build process and helps to reduce the burden and costs of IoT management, operations, and development. With IoT Central, you can easily connect, monitor, and manage your Internet of Things (IoT) assets at scale. After you connect your solar panels to IoT Central, the application template uses built-in features such as device models, commands, and dashboards. The application template also uses the IoT Central storage for warm path scenarios such as near real-time meter data monitoring, analytics, rules, and visualization.

### Extensibility options to build with IoT Central

The IoT Central platform provides two extensibility options: Continuous Data Export (CDE) and APIs. The customers and partners can choose between these options based to customize their solutions for specific needs. For example, one of our partners configured CDE with Azure Data Lake Storage (ADLS). They're using ADLS for long-term data retention and other cold path storage scenarios, such batch processing, auditing, and reporting purposes.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a solar panel app
> * Walk through the application
> * Clean up resources

## Prerequisites

An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a solar panel monitoring application

1. Navigate to the [Azure IoT Central Build](https://aka.ms/iotcentral) site. Then sign in with a Microsoft personal, work, or school account. Select **Build** from the left-hand navigation bar and then select the **Energy** tab:

    :::image type="content" source="media/tutorial-iot-central-solar-panel/solar-panel-build.png" alt-text="Smart meter template":::

1. Select **Create app** under **Solar panel monitoring**.

To learn more, see [Create an IoT Central application](../core/howto-create-iot-central-application.md).

## Walk through the application

The following sections walk you through the key features of the application:

### Dashboard

After you deploy the application template, you'll want to explore the app a bit more. Notice that it comes with sample smart meter device, device model, and dashboard.

Adatum is a fictitious energy company that monitors and manages solar panels. On the solar panel monitoring dashboard, you see solar panel properties, data, and sample commands. This dashboard allows you or your support team to perform the following activities proactively, before any problems require additional support:

* Review the latest panel info and its installed [location](../core/howto-use-location-data.md) on the map.
* Check the panel status and connection status.
* Review the energy generation and temperature trends to catch any anomalous patterns.
* Track the total energy generation for planning and billing purposes.
* Activate a panel and update the firmware version, if necessary. In the template, the command buttons show the possible functionalities, and don't send real commands.

:::image type="content" source="media/tutorial-iot-central-solar-panel/solar-panel-dashboard.png" alt-text="Screenshot of Solar Panel Monitoring Template Dashboard.":::

### Devices

The app comes with a sample solar panel device. To see device details, select **Devices**.

:::image type="content" source="media/tutorial-iot-central-solar-panel/solar-panel-device.png" alt-text="Screenshot of Solar Panel Monitoring Template Devices.":::

Select the sample device, **SP0123456789**. From the **Update Properties** tab, you can update the writable properties of the device and see a visual of the updated values on the dashboard. 

:::image type="content" source="media/tutorial-iot-central-solar-panel/solar-panel-device-properties.png" alt-text="Screenshot of Solar Panel Monitoring Template Update Properties tab.":::

### Device template

To see the solar panel device model, select the **Device templates** tab. The model has predefined interfaces for data, properties, commands, and views.

:::image type="content" source="media/tutorial-iot-central-solar-panel/solar-panel-device-templates.png" alt-text="Screenshot of Solar Panel Monitoring Template Device templates.":::

## Clean up resources

If you decide not to continue using this application, delete your application with the following steps:

1. From the left pane, select **Application**.
1. Select **Management** > **Delete**. 

    :::image type="content" source="media/tutorial-iot-central-solar-panel/solar-panel-delete-app.png" alt-text="Screenshot of Solar Panel Monitoring Template Administration.":::
