---
title: Tutorial of IoT Connected logistics | Microsoft Docs
description: A tutorial of Connected logistics application template for IoT Central
author: dominicbetts
ms.author: dobett
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: tutorial
ms.date: 06/13/2022

---

# Tutorial: Deploy and walk through a connected logistics application template

Global logistics spending is expected to reach $10.6 trillion in 2020. Transportation of goods accounts for most of this spending and shipping providers are under intense competitive pressure and constraints.

You can use IoT sensors to collect and monitor ambient conditions such as temperature, humidity, tilt, shock, light, and the location of a shipment. You can combine telemetry gathered from IoT sensors and devices with other data sources such as weather and traffic information in cloud-based business intelligence systems.

The benefits of a connected logistics solution include:

- Shipment monitoring with real-time tracing and tracking.
- Shipment integrity with real-time ambient condition monitoring.
- Security from theft, loss, or damage of shipments.
- Geo-fencing, route optimization, fleet management, and vehicle analytics.
- Forecasting for predictable departure and arrival of shipments.

:::image type="content" source="media/tutorial-iot-central-connected-logistics/connected-logistics-architecture.png" alt-text="Connected logistics dashboard." border="false":::

*IoT tags (1)* provide physical, ambient, and environmental sensor capabilities such as temperature, humidity, shock, tilt, and light. IoT tags typically connect to gateway device through Zigbee (802.15.4). Tags are less expensive sensors and can be discarded at the end of a typical logistics journey to avoid challenges with reverse logistics.

*Gateways (2)* enable upstream Azure IoT cloud connectivity using cellular or Wi-Fi channels.  Bluetooth, NFC, and 802.15.4 Wireless Sensor Network modes are used for downstream communication with IoT tags. Gateways provide end-to-end secure cloud connectivity, IoT tag pairing, sensor data aggregation, data retention, and the ability to configure alarm thresholds.

Azure IoT Central is a solution development platform that simplifies IoT device connectivity, configuration, and management. The platform significantly reduces the burden and costs of IoT device management, operations, and related developments. You can build end-to-end enterprise solutions to achieve a digital feedback loop in logistics.

The IoT Central platform provides rich extensibility options through _data export and APIs (3)_. Business insights based on telemetry data processing or raw telemetry are typically exported to a preferred _line-of-business application (4,5)_.

This tutorial shows you how to get started with the IoT Central *connected logistics* application template. You'll learn how to deploy and use the template.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a connected logistics application.
> * Use the key features in the application.
> * Use Dashboard to show the critical logistics device operations activity.
> * Use Device Template
> * Follow Rules
> * Use Jobs

## Prerequisites

An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create connected logistics application

Create the application using following steps:

1. Navigate to the [Azure IoT Central Build](https://aka.ms/iotcentral) site. Then sign in with a Microsoft personal, work, or school account. Select **Build** from the left-hand navigation bar and then select the **Retail** tab.

1. Select **Create app** under **Connected Logistics**.

1. **Create app** opens the **New application** form. Enter the following details:


    * **Application name**: you can use default suggested name or enter your friendly application name.
    * **URL**: you can use suggested default URL or enter your friendly unique memorable URL.
    * **Billing Info**: The directory, Azure subscription, and region details are required to provision the resources.
    * **Create**: Select create at the bottom of the page to deploy your application.

## Walk through the application

The following sections walk you through the key features of the application.

### Dashboard

After deploying the application template, your default dashboard is a connected logistics operator focused portal. Northwind Trader is a fictitious logistics provider managing a cargo fleet at sea and on land. In this dashboard, you see two different gateways providing telemetry from shipments, along with associated commands, jobs, and actions.

This dashboard is pre-configured to show the critical logistics device operations activity.

The dashboard enables two different gateway device management operations:

* View the logistics routes for truck shipments and the [location](../core/howto-use-location-data.md) details of ocean shipments.
* View the gateway status and other relevant information.

:::image type="content" source="media/tutorial-iot-central-connected-logistics/connected-logistics-dashboard-1.png" alt-text="Connected logistics dashboard":::

* You can track the total number of gateways, active, and unknown tags.
* You can do device management operations such as: update firmware, disable and enable sensors, update a sensor threshold, update telemetry intervals, and update device service contracts.
* View device battery consumption.

:::image type="content" source="media/tutorial-iot-central-connected-logistics/connected-logistics-dashboard-2.png" alt-text="Connected logistics dashboard status":::

#### Device Template

Select **Device templates** to see the gateway capability model. A capability model is structured around the **Gateway Telemetry & Property** and **Gateway Commands** interfaces.

**Gateway Telemetry & Property** - This interface defines all the telemetry related to sensors, location, and device information. The interface also defines device twin property capabilities such as sensor thresholds and update intervals.

:::image type="content" source="media/tutorial-iot-central-connected-logistics/connected-logistics-device-template-1.png" alt-text="Telemetry and property interface":::

**Gateway Commands** - This interface organizes all the gateway command capabilities:

:::image type="content" source="media/tutorial-iot-central-connected-logistics/connected-logistics-device-template-2.png" alt-text="Gateway commands interface":::

### Rules

Select the **Rules** tab to the rules in this application template. These rules are configured to email notifications to the operators for further investigations:

**Gateway theft alert**: This rule triggers when there's unexpected light detection by the sensors during the journey. Operators must be notified immediately to investigate potential theft.

**Lost gateway alert**: This rule triggers if the gateway doesn't report to the cloud for a prolonged period. The gateway could be unresponsive because of low battery, loss of connectivity, or device damage.

:::image type="content" source="media/tutorial-iot-central-connected-logistics/connected-logistics-rules.png" alt-text="Rule definitions":::

### Jobs

Select the **Jobs** tab to create the jobs in this application. The following screenshot shows an example of jobs created.

:::image type="content" source="media/tutorial-iot-central-connected-logistics/connected-logistics-jobs.png" alt-text="Jobs to run":::

You can use jobs to do application-wide operations. The jobs in this application use device commands and twin capabilities to do tasks such as disabling specific sensors across all the gateways or modifying the sensor threshold depending on the shipment mode and route:

* It's a standard operation to disable shock sensors during ocean shipment to conserve battery or lower temperature threshold during cold chain transportation.

* Jobs enable you to do system-wide operations such as updating firmware on the gateways or updating service contract to stay current on maintenance activities.

## Clean up resources

If you're not going to continue to use this application, delete the application template by visiting **Application** > **Management** and select **Delete**.

:::image type="content" source="media/tutorial-iot-central-connected-logistics/connected-logistics-cleanup.png" alt-text="Template cleanup":::

## Next steps

Learn more about :

> [!div class="nextstepaction"]
> [IoT Central data integration](../core/overview-iot-central-solution-builder.md)
