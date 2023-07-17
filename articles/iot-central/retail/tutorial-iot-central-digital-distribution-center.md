---
title: Tutorial - Azure IoT Digital Distribution Center
description: This tutorial shows you how to deploy and use the digital distribution center application template for IoT Central
author: dominicbetts
ms.author: dobett
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: tutorial
ms.date: 06/12/2023
---

# Tutorial: Deploy and walk through the digital distribution center application template

As manufacturers and retailers establish worldwide presences, their supply chains branch out and become more complex. Consumers now expect a large selection of products, and for those goods to arrive within one or two days of purchase. Distribution centers must adapt to these trends while overcoming existing inefficiencies.

Today, reliance on manual labor means that picking and packing accounts for 55-65% of distribution center costs. Manual picking and packing are also typically slower than automated systems, and rapidly fluctuating staffing needs make it even harder to meet shipping volumes. This seasonal fluctuation results in high staff turnover and increases the likelihood of costly errors.

Solutions based on IoT enabled cameras can deliver transformational benefits by enabling a digital feedback loop. Data from across the distribution center leads to actionable insights that, in turn, results in better data.

The benefits of a digital distribution center include:

- Cameras monitor goods as they arrive and move through the conveyor system.
- Automatic identification of faulty goods.
- Efficient order tracking.
- Reduced costs, improved productivity, and optimized usage.

:::image type="content" source="media/tutorial-iot-central-ddc/digital-distribution-center-architecture.png" alt-text="Diagram showing the digital distribution center application architecture." border="false":::

### Video cameras (1)

Video cameras are the primary sensors in this example application. Machine learning and artificial intelligence enable video to be turned into structured data and that you can process at the edge before sending it to the cloud. Use IP cameras to capture images, compress them on the camera, and then send the compressed data to edge compute resources for video analytics.

### Azure IoT Edge gateway (2)

Azure IoT Edge manages the "cameras-as-sensors" and edge workloads locally and a video analytics pipeline processes the data stream from the camera. The video analytics processing pipeline at Azure IoT Edge brings many benefits including decreased response times and low-bandwidth consumption. The IoT Edge device  sends only the most essential metadata, insights, or actions to the cloud.

### Device management with IoT Central

Azure IoT Central is a solution development platform that simplifies IoT device and Azure IoT Edge gateway connectivity, configuration, and management. The platform significantly reduces the burden and costs of IoT device management, operations, and related developments. Customers and partners can build an end-to-end enterprise solution to achieve a digital feedback loop in distribution centers.

### Business insights and actions using data egress (5,6)

IoT Central platform provides rich extensibility options through data export and APIs. Business insights based on telemetry data processing or raw telemetry are typically exported to a preferred line-of-business application. Export destinations include webhooks, Azure Service Bus, an event hub, or blob storage.

In this tutorial, you learn how to,

> [!div class="checklist"]
> * Create digital distribution center application.
> * Walk through the application.

## Prerequisites

An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create digital distribution center application template

To create your IoT Central application:

1. Navigate to the [Create IoT Central Application](https://portal.azure.com/#create/Microsoft.IoTCentral) page in the Azure portal. If prompted, sign in with your Azure account.

1. Enter the following information:

    | Field | Description |
    | ----- | ----------- |
    | Subscription | The Azure subscription you want to use. |
    | Resource group | The resource group you want to use.  You can create a new resource group or use an existing one. |
    | Resource name | A valid Azure resource name. |
    | Application URL | The URL subdomain for your application. The URL for an IoT Central application looks like `https://yoursubdomain.azureiotcentral.com`. |
    | Template | **Digital Distribution Center** |
    | Region | The Azure region you want to use. |
    | Pricing plan | The pricing plan you want to use. |

1. Select **Review + create**. Then select **Create**.

[!INCLUDE [iot-central-navigate-from-portal](../../../includes/iot-central-navigate-from-portal.md)]

## Walk through the application

The following sections walk you through the key features of the application:

### Dashboard

The default dashboard is a distribution center operator focused portal. Northwind Trader is a fictitious distribution center solution provider managing conveyor systems.

In this dashboard, you see one gateway and one camera acting as an IoT device. The gateway provides telemetry about packages such as valid, invalid, unidentified, and size along with associated device twin properties. All downstream commands are executed at IoT devices. This dashboard is preconfigured to show the critical distribution center device operations activity.

The dashboard is logically organized to show the device management capabilities of the Azure IoT gateway and IoT device. You can:

- Complete gateway command and control tasks.
- Manage all the cameras in the solution.

:::image type="content" source="media/tutorial-iot-central-ddc/ddc-dashboard.png" alt-text="Screenshot showing the digital distribution center dashboard." lightbox="media/tutorial-iot-central-ddc/ddc-dashboard.png":::

### Device templates

Navigate to **Device templates**. The application has two device templates:

- **Camera** - Organizes all the camera-specific command capabilities.

- **Digital Distribution Gateway** - Represents all the telemetry coming from camera, cloud defined device twin properties and gateway info.

:::image type="content" source="media/tutorial-iot-central-ddc/ddc-devicetemplate.png" alt-text="Screenshot showing the digital distribution gateway device template." lightbox="media/tutorial-iot-central-ddc/ddc-devicetemplate.png":::

### Rules

Select the rules tab to see two different rules that exist in this application template. These rules configure email notifications to the operators for further investigations:

- **Too many invalid packages alert** - This rule triggers when the camera detects a high number of invalid packages flowing through the conveyor system.

- **Large package** - This rule triggers if the camera detects huge package that can't be inspected for the quality.

:::image type="content" source="media/tutorial-iot-central-ddc/ddc-rules.png" alt-text="Screenshot showing the list of rules in the digital distribution center application." lightbox="media/tutorial-iot-central-ddc/ddc-rules.png":::

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources-industry](../../../includes/iot-central-clean-up-resources-industry.md)]

## Next steps

Learn more about:

> [!div class="nextstepaction"]
> [IoT Central data integration](../core/overview-iot-central-solution-builder.md)
