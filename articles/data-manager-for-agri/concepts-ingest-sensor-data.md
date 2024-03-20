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

# Ingest sensor data

Smart agriculture, also known as precision agriculture, allows growers to maximize yields using minimal resources such as water, fertilizer, and seeds, etc. By deploying sensors, growers and research organization can begin to understand crops at a micro-scale, conserve resources, reduce impact on the environment and ultimately maximize  crop yield. Sensors enable important ground truth data (soil moisture, rainfall, wind speed etc.) and this data in turn improves accuracy of recommendations.

[!INCLUDE [public-preview-notice.md](includes/public-preview-notice.md)]

Sensors are of various types:

* Location-sensor (determines lat/long & altitude)
* Electrochemical sensor (determines pH, soil nutrients)
* Soil moisture sensor
* Airflow sensor (determines the pressure required to push a pre-determined amount of air into the ground at a prescribed depth)
* Weather sensor

There's a large ecosystem of sensor providers that help growers to monitor and optimize crop performance. Sensor based data also enables an understanding of the changing environmental factors.

## How sensors work

Sensors are placed in the field based on its characteristics. Sensors record measurements and transfer the data to the connected node. Each node has one or more sensors connected to it. Nodes equipped with internet connectivity can  directly push the data to cloud. Other nodes use an IOT agent to transfer data the gateway.

Gateways collect all essential data from the nodes and push it securely to the cloud via either cellular connectivity, Wi-Fi, or Ethernet. Once the data resides in a sensor partner cloud, the sensor partner pushes the relevant sensors data to the dedicated IOTHub endpoint provided by Azure Data Manager for Agriculture.

In addition to the above approach, IOT devices (sensors/nodes/gateway) can directly push the data to IOTHub endpoint. In both cases, the data first reaches the IOTHub, post that the next set of processing happens.  

:::image type="content" source="./media/sensor-data-flow-new.png" alt-text="Screenshot showing sensor data flow.":::

## Sensor topology

The following diagram depicts the topology of a sensor in Azure Data Manager for Agriculture. Each geometry under a party has a set of devices placed within it. A device can be either be a node or a gateway and each device has a set of sensors associated with it. Sensors send the recordings via gateway to the cloud. Sensors are tagged with GPS coordinates helping in creating a geospatial time series for all measured data.

:::image type="content" source="./media/sensor-topology-new.png" alt-text="Screenshot showing sensor topology.":::

## Next steps

* Learn how to [get started when you push and consume sensor data](./how-to-set-up-sensor-as-customer-and-partner.md).

* Learn how to [get started as a customer](./how-to-set-up-sensors-customer.md) to consume sensor data from a supported sensor partner like Davis Instruments.

* Learn how to [get started as a sensor partner](./how-to-set-up-sensors-partner.md) to push sensor data into Azure Data Manager for Agriculture.
