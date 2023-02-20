---
title: Ingesting Sensor Data
description: Provides step by step guidance to ingest Sensor data
author: gourdsay #Required; your GitHub user alias, with correct capitalization.
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 02/14/2023
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Ingesting Sensor Data

Smart agriculture, also known as precision agriculture, allows growers to maximize yields using minimal resources such as water, fertilizer, and seeds, etc. By deploying sensors, growers and research organization can begin to understand crops at a micro-scale, conserve resources, reduce impact on the environment and ultimately maximize  crop yield. Sensors enable important ground truth data (soil moisture, rainfall, wind speed etc.) and this data in turn improves accuracy of recommendations. 

> [!NOTE]
> Microsoft Azure Data Manager for Agriculture is currently in preview. For legal terms that apply to features that are in beta, in preview, or otherwise not yet released into general availability, see the [**Supplemental Terms of Use for Microsoft Azure Previews**](https://azure.microsoft.com/en-us/support/legal/preview-supplemental-terms/).
> Microsoft Azure Data Manager for Agriculture requires registration and is available to only approved customers and partners during the preview period. To request access to Microsoft Data Manager for Agriculture during the preview period, use this [**form**](https://forms.office.com/r/SDR0m3yjeS).

Sensors are of various types:
* Location-sensor (determines lat/long & altitude) 
* Electrochemical sensor (determines pH, soil nutrients) 
* Soil moisture sensor 
* Airflow sensor (determines the pressure required to push a pre-determined amount of air into the ground at a prescribed depth)
* Weather sensor 

There is a large ecosystem of sensors providers that helps monitor and optimize crop performance, as well as enable understanding of the changing environmental factors.

## How sensor works

Each sensor based on its characteristics is placed in certain parts of the field. Sensors record measurements and transfer the data to the nodes it is connected to. Each node has one or more sensors connected to it. Nodes can be equipped with internet in which case they directly push the data to cloud. If nodes are not equipped with internet, then date is transferred to the gateway  using an IOT agent (a software component which talks to IOT devices).

Gateways collect all essential data from the nodes and push it securely to the cloud via either cellular connectivity, Wi-Fi, or Ethernet. Once the data resides in a sensor partner cloud, the sensor partner pushes the relevant sensors data to the dedicated IOTHub endpoint provided by Data Manager for Agriculture.

In addition to the above approach, IOT devices (sensors/nodes/gateway) can directly push the data to IOTHub endpoint. In both cases the data first reaches the IOTHub, post which the next set of processing happens.  

![Sensor data flow](./media/sensor-data-flow-new.png)

## Sensor topology

The following diagram depicts the topology of a sensor in Azure Data Manager for Agriculture. Each boundary under a party has a set of devices placed within it. A device can be either be a node or a gateway and each device has a set of sensors associated with it. Sensors sends the recordings via gateway to the cloud. Most of the sensors, are tagged based on GPS coordinates and this helps in creating a geospatial time series for all measured data.

![Sensor topology](./media/sensor-topology-new.png)

## Next steps

How to [get started as a customer](./how-to-setup-sensors-customer.md) to consume sensor data from the supported sensor partners.

How to [get started as a sensor partner](./how-to-setup-sensors-partner.md) to push sensor data into Data Manager for Agriculture Service.
