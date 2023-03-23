---
title: Tutorial - Azure IoT Digital Distribution Center | Microsoft Docs
description: This tutorial shows you how to deploy and use the digital distribution center application template for IoT Central
author: dominicbetts
ms.author: dobett
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: tutorial
ms.date: 06/14/2022
---

# Tutorial: Deploy and walk through the digital distribution center application template

As manufacturers and retailers establish worldwide presences, their supply chains branch out and become more complex. Consumers now expect large selections of products to be available, and for those goods to arrive within one or two days of purchase. Distribution centers must adapt to these trends while overcoming existing inefficiencies.

Today, reliance on manual labor means that picking and packing accounts for 55-65% of distribution center costs. Manual picking and packing are also typically slower than automated systems, and rapidly fluctuating staffing needs make it even harder to meet shipping volumes. This seasonal fluctuation results in high staff turnover and increase the likelihood of costly errors.

Solutions based on IoT enabled cameras can deliver transformational benefits by enabling a digital feedback loop. Data from across the distribution center leads to actionable insights that, in turn, results in better data.

The benefits of a digital distribution center include:

- Cameras monitor goods as they arrive and move through the conveyor system.
- Automatic identification of faulty goods.
- Efficient order tracking.
- Reduced costs, improved productivity, and optimized usage.

:::image type="content" source="media/tutorial-iot-central-ddc/digital-distribution-center-architecture.png" alt-text="Diagram showing the digital distribution center application architecture." border="false":::

### Video cameras (1)

Video cameras are the primary sensors in this digitally connected enterprise-scale ecosystem. Advancements in machine learning and artificial intelligence that allow video to be turned into structured data and process it at edge before sending to cloud. We can use IP cameras to capture images, compress them on the camera, and then send the compressed data over edge compute for video analytics pipeline or use GigE vision cameras to capture images on the sensor and then send these images directly to the Azure IoT Edge, which then compresses before processing in video analytics pipeline.

### Azure IoT Edge gateway (2)

The "cameras-as-sensors" and edge workloads are managed locally by Azure IoT Edge and the camera stream is processed by analytics pipeline. The video analytics processing pipeline at Azure IoT Edge brings many benefits, including decreased response time, low-bandwidth consumption, which results in low latency for rapid data processing. Only the most essential metadata, insights, or actions are sent to the cloud for further action or investigation.

### Device management with IoT Central

Azure IoT Central is a solution development platform that simplifies IoT device and Azure IoT Edge gateway connectivity, configuration, and management. The platform significantly reduces the burden and costs of IoT device management, operations, and related developments. Customers and partners can build an end-to-end enterprise solution to achieve a digital feedback loop in distribution centers.

### Business insights and actions using data egress (5,6)

IoT Central platform provides rich extensibility options through Continuous Data Export (CDE) and APIs. Business insights that are based on telemetry data processing or raw telemetry are typically exported to a preferred line-of-business application. It can be achieved through webhook, Service Bus, event hub, or blob storage to build, train, and deploy machine learning models and further enrich insights.

In this tutorial, you learn how to,

> [!div class="checklist"]
> * Create digital distribution center application.
> * Walk through the application.

## Prerequisites

An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create digital distribution center application template

Create the application using following steps:

1. Navigate to the [Azure IoT Central Build](https://aka.ms/iotcentral) site. Then sign in with a Microsoft personal, work, or school account. Select **Build** from the left-hand navigation bar and then select the **Retail** tab.

1. Select **Create app** under **Digital distribution center**.

To learn more, see [Create an IoT Central application](../core/howto-create-iot-central-application.md).

## Walk through the application

The following sections walk you through the key features of the application:

### Dashboard

The default dashboard is a distribution center operator focused portal. Northwind Trader is a fictitious distribution center solution provider managing conveyor systems.

In this dashboard, you'll see one gateway and one camera acting as an IoT device. Gateway is providing telemetry about packages such as valid, invalid, unidentified, and size along with associated device twin properties. All downstream commands are executed at IoT devices, such as a camera. This dashboard is pre-configured to showcase the critical distribution center device operations activity.

The dashboard is logically organized to show the device management capabilities of the Azure IoT gateway and IoT device. You can:

* Complete gateway command and control tasks.
* Manage all the cameras in the solution.

:::image type="content" source="media/tutorial-iot-central-ddc/ddc-dashboard.png" alt-text="Screenshot showing the digital distribution center dashboard." lightbox="media/tutorial-iot-central-ddc/ddc-dashboard.png":::

### Device templates

Navigate to **Device templates**. The application has two device templates:

* **Camera** - Organizes all the camera-specific command capabilities.

* **Digital Distribution Gateway** - Represents all the telemetry coming from camera, cloud defined device twin properties and gateway info.

:::image type="content" source="media/tutorial-iot-central-ddc/ddc-devicetemplate.png" alt-text="Screenshot showing the digital distribution gateway device template." lightbox="media/tutorial-iot-central-ddc/ddc-devicetemplate.png":::

### Rules

Select the rules tab to see two different rules that exist in this application template. These rules are configured to email notifications to the operators for further investigations.

**Too many invalid packages alert** - This rule is triggered when the camera detects a high number of invalid packages flowing through the conveyor system.

**Large package** - This rule will trigger if the camera detects huge package that can't be inspected for the quality.

:::image type="content" source="media/tutorial-iot-central-ddc/ddc-rules.png" alt-text="Screenshot showing the list of rules in the digital distribution center application." lightbox="media/tutorial-iot-central-ddc/ddc-rules.png":::

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources-industry](../../../includes/iot-central-clean-up-resources-industry.md)]

## Next steps

Learn more about:

> [!div class="nextstepaction"]
> [IoT Central data integration](../core/overview-iot-central-solution-builder.md)
