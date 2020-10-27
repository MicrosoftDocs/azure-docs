---
title: Azure IoT Central micro-fulfillment center | Microsoft Docs
description: Learn to build a micro-fulfillment center application using our Micro-fulfillment center application template in IoT Central
author: avneet723
ms.author: avneets
ms.date: 10/13/2019
ms.topic: overview
ms.service: iot-central
ms.subservice: iot-central-retail
services: iot-central
manager: eliotgra
---

# Micro-fulfillment center architecture

Micro-fulfillment center solutions allow you to digitally connect, monitor, and manage all aspects of a fully automated fulfillment center to reduce costs by eliminating downtime while increasing security and overall efficiency. These solutions can be built by using one of the application templates within IoT Central and the architecture below as guidance.

![Azure IoT Central Store Analytics](./media/architecture/micro-fulfillment-center-architecture-frame.png)

- Set of IoT sensors sending telemetry data to a gateway device
- Gateway devices sending telemetry and aggregated insights to IoT Central
- Continuous data export to the desired Azure service for manipulation
- Data can be structured in the desired format and sent to a storage service
- Business applications can query data and generate insights that power retail operations
 
Let's take a look at key components that generally play a part in a micro-fulfillment center solution.

## Robotic carriers

A micro-fulfillment center solution will likely have a large set of robotic carriers generating different kinds of telemetry signals. These signals can be ingested by a gateway device, aggregated, and then sent to IoT Central as reflected by the left side of the architecture diagram.  

## Condition monitoring sensors

An IoT solution starts with a set of sensors capturing meaningful signals from within your fulfillment center. It's reflected by different kinds of sensors on the far left of the architecture diagram above.

## Gateway devices

Many IoT sensors can feed raw signals directly to the cloud or to a gateway device located near them. The gateway device performs data aggregation at the edge before sending summary insights to an IoT Central application. The gateway devices are also responsible for relaying command and control operations to the sensor devices when applicable. 

## IoT Central application

The Azure IoT Central application ingests data from different kinds of IoT sensors, robots, as well gateway devices within the fulfillment center environment and generates a set of meaningful insights.

Azure IoT Central also provides a tailored experience to the store operator enabling them to remotely monitor and manage the infrastructure devices.

## Data transform
The Azure IoT Central application within a solution can be configured to export raw or aggregated insights to a set of Azure PaaS (Platform-as-a-Service) services that can perform data manipulation and enrich these insights before landing them in a business application. 

## Business application
The IoT data can be used to power different kinds of business applications deployed within a retail environment. A fulfillment center manager or employee can use these applications to visualize business insights and take meaningful actions in real time. To learn how to build a real-time Power BI dashboard for your retail team, follow the [tutorial](./tutorial-in-store-analytics-create-app.md).

## Next steps
* Get started with the [Micro-fulfillment Center](https://aka.ms/checkouttemplate) application template. 
* Take a look at the [tutorial](https://aka.ms/mfc-tutorial) that walks you through how to build a solution using the Micro-fulfillment Center app template.
