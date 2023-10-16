---
title: Tutorial - Azure IoT smart inventory management
description: This tutorial shows you how to deploy and use a smart inventory-management application template for IoT Central.
author: dominicbetts
ms.author: dobett
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: tutorial
ms.date: 06/12/2023
---

# Tutorial: Deploy a smart inventory-management application template

Inventory is the stock of goods that a retail business holds. As a retailer, you must balance the costs of storing too much inventory against the costs of having insufficient inventory to meet customer demand. It's critical to deploy smart inventory-management practices to ensure that the right products are in stock and in the right place at the right time.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a smart inventory-management application 
> * Use the application

The benefits of smart inventory management include:

- You reduce the risk of items being out of stock and ensure that you're reaching the desired customer service level.
- You get in-depth analysis and insights into inventory accuracy in near real time.
- You apply the right tools to help decide on the right amount of inventory to hold to meet customer orders.

IoT data that you generate from radio-frequency identification (RFID) tags, beacons, and cameras gives you opportunities to improve inventory-management processes. You can combine telemetry that you've gathered from IoT sensors and devices with other data sources, such as weather and traffic information in cloud-based business intelligence systems.

The application template that you create focuses on device connectivity, and it helps you configure and manage the RFID and Bluetooth low energy (BLE) reader devices.

## Smart inventory-management architecture

:::image type="content" source="media/tutorial-iot-central-smart-inventory-management/smart-inventory-management-architecture.png" alt-text="Diagram that shows the smart inventory-management application architecture." border="false":::

The preceding architecture diagram illustrates the smart inventory-management application workflow:

* (**1**) RFID tags

   RFID tags transmit data about an item through radio waves. RFID tags ordinarily don't have a battery, unless specified. Tags receive energy from radio waves that the RFID reader generates and then transmit a signal back to the reader.

* (**1**) BLE tags

   An energy beacon broadcasts packets of data at regular intervals. BLE readers or installed services on smartphones detect beacon data and then transmit it to the cloud.

* (**1**) RFID and BLE readers

   An RFID reader converts the radio waves to a more usable form of data. Information that's collected from the tags is then stored on a local edge server or sent to the cloud via JSON-RPC 2.0 over Message Queuing Telemetry Transport (MQTT).

   BLE readers, also known as Access Points (AP), are similar to RFID readers. They're used to detect nearby Bluetooth signals and relay them to a local Azure IoT Edge instance or the cloud via JSON-RPC 2.0 over MQTT.

   Many readers can read RFID and beacon signals and provide other sensor capabilities.

* (**2**) Azure IoT Edge gateway

   Azure IoT Edge server provides a place to preprocess the data locally before sending it on to the cloud. You can also deploy cloud workloads artificial intelligence, Azure and third-party services, and business logic by using standard containers.

* Device management with IoT Central

   Azure IoT Central is a solution-development platform that simplifies IoT device connectivity, configuration, and management. The platform significantly reduces the burden and costs of IoT device management, operations, and related developments. Customers and partners can build an end-to-end enterprise solution to achieve a digital feedback loop in inventory management.

* (**3**) Business insights and actions using data egress

   The IoT Central platform provides rich extensibility options through data export and APIs. Business insights that are based on telemetry data processing or raw telemetry are typically exported to a preferred line-of-business application.

   You can use a webhook, service bus, event hub, or blob storage to build, train, and deploy machine learning models and further enrich insights.

## Prerequisites

An active Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a smart inventory-management application

To create your IoT Central application:

1. Navigate to the [Create IoT Central Application](https://portal.azure.com/#create/Microsoft.IoTCentral) page in the Azure portal. If prompted, sign in with your Azure account.

1. Enter the following information:

    | Field | Description |
    | ----- | ----------- |
    | Subscription | The Azure subscription you want to use. |
    | Resource group | The resource group you want to use.  You can create a new resource group or use an existing one. |
    | Resource name | A valid Azure resource name. |
    | Application URL | The URL subdomain for your application. The URL for an IoT Central application looks like `https://yoursubdomain.azureiotcentral.com`. |
    | Template | **Smart Inventory Management** |
    | Region | The Azure region you want to use. |
    | Pricing plan | The pricing plan you want to use. |

1. Select **Review + create**. Then select **Create**.

[!INCLUDE [iot-central-navigate-from-portal](../../../includes/iot-central-navigate-from-portal.md)]

## Walk through the application

The following sections describe the key features of the application.

### Dashboard

After you deploy the application, your default dashboard is a smart, operator-focused, inventory-management portal. Northwind Trader is a fictitious smart inventory provider that manages its warehouse with Bluetooth low energy (BLE) beacons and its retail store with RFID tags.

On this dashboard are two different gateways, each providing telemetry about inventory, along with associated commands, jobs, and actions that you can perform.

This dashboard is preconfigured to display the activity of the critical smart inventory-management device. It's logically divided between two separate gateway device-management operations:

* The warehouse is deployed with a fixed BLE gateway and BLE tags on pallets to track and trace inventory at a larger facility.
* The retail store is implemented with a fixed RFID gateway and RFID tags at the item level to track and trace the inventory in a store outlet.
* View the gateway location, status, and related details.
* You can easily track the total number of gateways, active tags, and unknown tags.
* You can perform device management operations, such as:
  * Update firmware
  * Enable or disable sensors
  * Update sensor threshold
  * Update telemetry intervals
  * Update device service contracts

* Gateway devices can perform on-demand inventory management with a complete or incremental scan.

:::image type="content" source="media/tutorial-iot-central-smart-inventory-management/smart-inventory-management-dashboard.png" alt-text="Screenshot that shows the smart inventory-management application dashboard." lightbox="media/tutorial-iot-central-smart-inventory-management/smart-inventory-management-dashboard.png":::

### Device templates

Select the **Device templates** tab to display the gateway capability model. A capability model is structured around two separate interfaces:

* **Gateway Telemetry and Property**: This interface displays the telemetry that's related to sensors, location, device info, and device twin properties such as gateway thresholds and update intervals.

* **Gateway Commands**: This interface organizes all the gateway command capabilities.

:::image type="content" source="media/tutorial-iot-central-smart-inventory-management/smart-inventory-management-device-template.png" alt-text="Screenshot that shows the inventory gateway device template." lightbox="media/tutorial-iot-central-smart-inventory-management/smart-inventory-management-device-template.png":::

### Rules

Select the **Rules** tab to display two rules that exist in this application template. The rules are configured to email notifications to the operators for further investigation.

* **Gateway offline**: This rule is triggered if the gateway doesn't report to the cloud for a prolonged period. The gateway could be unresponsive because of a low battery, loss of connectivity, or device health.

* **Unknown tags**: It's critical to track all RFID and BLE tags that are associated with an asset. If the gateway detects too many unknown tags, it's an indication of synchronization challenges with tag-sourcing applications.

:::image type="content" source="media/tutorial-iot-central-smart-inventory-management/smart-inventory-management-rules.png" alt-text="Screenshot that shows the list of rules in the smart inventory-management application." lightbox="media/tutorial-iot-central-smart-inventory-management/smart-inventory-management-rules.png":::

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources-industry](../../../includes/iot-central-clean-up-resources-industry.md)]

## Next steps

Learn more about:

> [!div class="nextstepaction"]
> [IoT Central data integration](../core/overview-iot-central-solution-builder.md)
