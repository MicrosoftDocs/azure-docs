---
title: Ingest sensor data in Azure Data Manager for Agriculture
description: Get step-by-step guidance for ingesting sensor data.
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 06/19/2023
ms.custom: template-concept
---

# Ingest sensor data in Azure Data Manager for Agriculture

Smart agriculture, also known as precision agriculture, allows growers to maximize yields by using minimal resources such as water, fertilizer, and seeds. By deploying sensors, growers and research organizations can begin to understand crops at a micro scale, conserve resources, reduce impact on the environment, and maximize crop yield. Sensors enable important ground-truth data (such as soil moisture, rainfall, and wind speed). This data, in turn, improves the accuracy of recommendations.

Sensors are of various types:

* Location sensors, which determine latitude, longitude, and altitude
* Electrochemical sensors, which determine pH and soil nutrients
* Soil moisture sensors
* Airflow sensors, which determine the pressure required to push a predetermined amount of air into the ground at a prescribed depth
* Weather sensors

There's a large ecosystem of sensor providers that help growers to monitor and optimize crop performance. Sensor-based data also enables an understanding of the changing environmental factors.

[!INCLUDE [public-preview-notice.md](includes/public-preview-notice.md)]

## How sensors work

Sensors are placed in a field based on its characteristics. Sensors record measurements and transfer the data to the connected node. Each node has one or more sensors connected to it. Nodes equipped with internet connectivity can push data directly to the cloud. Other nodes use an Internet of Things (IoT) agent to transfer data to the gateway.

Gateways collect all essential data from the nodes and push it securely to the cloud via cellular connectivity, Wi-Fi, or Ethernet. After the data resides in a sensor partner's cloud, the sensor partner pushes the relevant sensor data to the dedicated Azure IoT Hub endpoint that Azure Data Manager for Agriculture provides.

In addition to the preceding approach, IoT devices (sensors, nodes, and gateway) can push the data directly to the IoT Hub endpoint. In both cases, the data first reaches IoT Hub, where the next set of processing happens.  

:::image type="content" source="./media/sensor-data-flow-new.png" alt-text="Diagram that shows sensor data flow.":::

## Sensor topology

The following diagram depicts the topology of a sensor in Azure Data Manager for Agriculture. Each geometry under a party has a set of devices placed within it. A device can be either a node or a gateway, and each device has a set of sensors associated with it. Sensors send the recordings via gateway to the cloud. Sensors are tagged with GPS coordinates to help in creating a geospatial time series for all measured data.

:::image type="content" source="./media/sensor-topology-new.png" alt-text="Diagram that shows sensor topology.":::

## Next steps

* Learn how to [get started with pushing and consuming sensor data](./how-to-set-up-sensor-as-customer-and-partner.md).
* Learn how to [get started as a customer](./how-to-set-up-sensors-customer.md) to consume sensor data from a supported sensor partner like Davis Instruments.
* Learn how to [get started as a sensor partner](./how-to-set-up-sensors-partner.md) to push sensor data into Azure Data Manager for Agriculture.
