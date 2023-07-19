---
title: "Tutorial: Azure IoT Micro-fulfillment center"
description: This tutorial shows you how to deploy and use the micro-fulfillment center application template for Azure IoT Central
author: dominicbetts
ms.author: dobett 
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: tutorial
ms.date: 02/13/2023
---

# Tutorial: Deploy and review the micro-fulfillment center application template

In the increasingly competitive retail landscape, retailers constantly face pressure to close the gap between demand and fulfillment. A new trend that has emerged to address the growing consumer demand is to house inventory near the end customers and the stores they visit.

The IoT Central micro-fulfillment center application template enables you to monitor and manage all aspects of your fully automated fulfillment centers. The template includes a set of simulated condition monitoring sensors and robotic carriers to accelerate the solution development process. These sensor devices capture meaningful signals that can be converted into business insights allowing retailers to reduce their operating costs and create experiences for their customers.

The application template enables you to:

* Seamlessly connect different kinds of IoT sensors such as robots or condition monitoring sensors to an IoT Central application instance.
* Monitor and manage the health of the sensor network, and any gateway devices in the environment.
* Create custom rules around the environmental conditions within a fulfillment center to trigger appropriate alerts.
* Transform the environmental conditions within your fulfillment center into insights that the retail warehouse team can use.
* Export the aggregated insights into existing or new business applications for the benefit of the retail staff members.

:::image type="content" source="media/tutorial-micro-fulfillment-center-app/micro-fulfillment-center-architecture-frame.png" alt-text="Diagram showing the micro-fulfillment application architecture." border="false":::

### Robotic carriers (1)

A micro-fulfillment center solution typically includes robotic carriers that generate different kinds of telemetry signals. These signals can be ingested by a gateway device, aggregated, and then sent to IoT Central as shown in the architecture diagram.  

### Condition monitoring sensors (1)

An IoT solution starts with a set of sensors capturing meaningful signals from within your fulfillment center. The architecture diagram shows different types on sensor.

### Gateway devices (2)

Many IoT sensors can feed raw signals directly to the cloud or to a gateway device located near them. The gateway device performs data aggregation at the edge before sending summary insights to an IoT Central application. The gateway devices are also responsible for relaying command and control operations to the sensor devices when applicable.

### IoT Central application

The Azure IoT Central application ingests data from different kinds of IoT sensors, robots, as well gateway devices within the fulfillment center environment and generates a set of meaningful insights.

Azure IoT Central also provides a tailored experience to store operators enabling them to remotely monitor and manage the infrastructure devices.

### Data transform (3,4)

The Azure IoT Central application within a solution can be configured to export raw or aggregated insights to other platform services. These services can perform data manipulation and enrichment before delivering insights to a business application.

### Business application (5)

The IoT data can be used to power different kinds of business applications deployed within a retail environment. A fulfillment center manager or employee can use these applications to visualize business insights and take meaningful actions in real time. To learn how to build a real-time Power BI dashboard for your retail team, follow the [tutorial](./tutorial-in-store-analytics-create-app.md).

In this tutorial, you learn:

> [!div class="checklist"]
> * How to deploy the application template
> * How to use the application template

## Prerequisites

An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create micro-fulfillment application

To create your IoT Central application:

1. Navigate to the [Create IoT Central Application](https://portal.azure.com/#create/Microsoft.IoTCentral) page in the Azure portal. If prompted, sign in with your Azure account.

1. Enter the following information:

    | Field | Description |
    | ----- | ----------- |
    | Subscription | The Azure subscription you want to use. |
    | Resource group | The resource group you want to use.  You can create a new resource group or use an existing one. |
    | Resource name | A valid Azure resource name. |
    | Application URL | The URL subdomain for your application. The URL for an IoT Central application looks like `https://yoursubdomain.azureiotcentral.com`. |
    | Template | **Micro-fulfillment Center** |
    | Region | The Azure region you want to use. |
    | Pricing plan | The pricing plan you want to use. |

1. Select **Review + create**. Then select **Create**.

[!INCLUDE [iot-central-navigate-from-portal](../../../includes/iot-central-navigate-from-portal.md)]

## Walk through the application

The following sections walk you through the key features of the application:

After successfully deploying the application template, you see the **Northwind Traders micro-fulfillment center dashboard**. Northwind Traders is a fictitious retailer that has a micro-fulfillment center being managed in this Azure IoT Central application. On this dashboard, you see information and telemetry about the devices in this template, along with a set of commands, jobs, and actions that you can take. The dashboard is logically split into two sections. One section lets you monitor the environmental conditions within the fulfillment structure, and the other lets you monitor the health of a robotic carrier within the facility.

From the dashboard, you can:

* See device telemetry, such as the number of picks, the number of orders processed.
* See properties such as the structure system status.  
* View the floor plan and location of the robotic carriers within the fulfillment structure.
* Trigger commands, such as resetting the control system, updating the carrier's firmware, and reconfiguring the network.
* See an example of the dashboard that an operator can use to monitor conditions within the fulfillment center.
* Monitor the health of the payloads that are running on the gateway device within the fulfillment center.

:::image type="content" source="media/tutorial-micro-fulfillment-center-app/mfc-dashboard.png" alt-text="Screenshot of the micro-fulfillment center application dashboard." lightbox="media/tutorial-micro-fulfillment-center-app/mfc-dashboard.png":::
### Device template

If you select the device templates tab, you see that there are two different device types that are part of the template:

* **Robotic Carrier**: This device template represents the definition for a functioning robotic carrier that has been deployed in the fulfillment structure, and is performing appropriate storage and retrieval operations. If you select the template, you see that the robot is sending device data, such as temperature and axis position, and properties like the robotic carrier status.
* **Structure Condition Monitoring**: This device template represents a device collection that lets you monitor environment conditions, and the gateway device that hosts various edge workloads. The device sends telemetry data, such as the temperature, the number of picks, and the number of orders. It also sends information about the state and health of the compute workloads running in your environment.

:::image type="content" source="media/tutorial-micro-fulfillment-center-app/device-templates.png" alt-text="Screenshot of the micro-fulfillment center application device templates." lightbox="media/tutorial-micro-fulfillment-center-app/device-templates.png":::

If you select the device groups tab, you also see that these device templates automatically have device groups created for them.

### Rules

On the **Rules** tab, you see a sample rule that exists in the application template to monitor the temperature conditions for the robotic carrier. You might use this rule to alert the operator if a specific robot in the facility is overheating, and needs to be taken offline for servicing. 

Use the sample rule as inspiration to define rules that are more appropriate for your business functions.

:::image type="content" source="media/tutorial-micro-fulfillment-center-app/rules.png" alt-text="Screenshot of the micro-fulfillment center application rules." lightbox="media/tutorial-micro-fulfillment-center-app/rules.png":::

### Clean up resources

[!INCLUDE [iot-central-clean-up-resources-industry](../../../includes/iot-central-clean-up-resources-industry.md)]

## Next steps

Learn more about:

> [!div class="nextstepaction"]
> [IoT Central data integration](../core/overview-iot-central-solution-builder.md)
