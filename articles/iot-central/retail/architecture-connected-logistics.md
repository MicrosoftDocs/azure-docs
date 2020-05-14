---
title: Architecture IoT Connected logistics | Microsoft Docs
description: An architecture of IoT Connected Logistics application template for IoT Central
author: KishorIoT
ms.author: nandab
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: overview
ms.date: 10/20/2019
ms.custom:  mqtt
---

# Architecture of IoT Central connected logistics application template



Partners & customer can use the app template & following guidance to develop end to end **connected logistics solutions**.

> [!div class="mx-imgBorder"]
> ![connected logistics dashboard](./media/concept-connected-logistics-architecture/connected-logistics-architecture.png)

1. Set of IoT tags sending telemetry data to a gateway device
2. Gateway devices sending telemetry and aggregated insights to IoT Central
3. Data is routed to the desired Azure service for manipulation
4. Azure services like ASA or Azure Functions can be used to reformat data streams and send to the desired storage accounts 
5. Various business workflows can be powered by end-user business applications

## Details
Following section outlines each part of the conceptual architecture
Telemetry ingestion from IoT Tags & Gateways

## IoT tags
IoT tags provide physical, ambient, and environmental sensor capabilities such as Temperature, Humidity, Shock, Tilt &Light. IoT tags typically connect to gateway device through Zigbee (802.15.4). Tags are less expensive sensors; so, they can be discarded at the end of a typical logistics journey to avoid challenges with reverse logistics.

## Gateway
Gateways can also act as IoT tags with their ambient sensing capabilities. The gateway enables upstream Azure IoT cloud connectivity (MQTT) using cellular, Wi-Fi channels.  Bluetooth, NFC, and 802.15.4 Wireless Sensor Network (WSN) modes are used for downstream communication with IoT tags. Gateways provide end to end secure cloud connectivity, IoT tag pairing, sensor data aggregation, data retention, and ability to configure alarm thresholds.

## Device management with IoT Central 
Azure IoT Central is a solution development platform that simplifies IoT device connectivity, configuration, and management. The platform significantly reduces the burden and costs of IoT device management, operations, and related developments. Customers & partners can build an end to end enterprise solutions to achieve a digital feedback loop in logistics.

## Business insights and actions using data egress 
IoT Central platform provides rich extensibility options through Continuous Data Export (CDE) and APIs. Business insights based on telemetry data processing or raw telemetry are typically exported to a preferred line-of-business application. It can be achieved using webhook, service bus, event hub, or blob storage to build, train, and deploy machine learning models & further enrich insights.

## Next steps
* Learn how to deploy [connected logistics solution template](./tutorial-iot-central-connected-logistics.md)
* Learn more about [IoT Central retail templates](./overview-iot-central-retail.md)
* Learn more about IoT Central refer to [IoT Central overview](../core/overview-iot-central.md)
