---
title: IoT solution accelerators reference architecture - Azure | Microsoft Docs
description: Learn about the Azure IoT solution accelerators reference architecture. The existing solution accelerators leverage this reference architecture. You can also use the reference architecture when you build your own custom IoT solutions.
author: dominicbetts
ms.author: dobett
ms.date: 12/04/2018
ms.topic: conceptual
ms.custom: mvc
ms.service: iot-accelerators
services: iot-accelerators
manager: philmea

# Intent: As an architect or developer, I need to know what the IoT solution accelerators reference architecture is, so I can understand if it can help me to build my IoT solution.
---

# Introduction to the Azure IoT reference architecture

This article introduces the [Azure IoT reference architecture](https://aka.ms/iotrefarchitecture) and gives examples of how the [Azure IoT solution accelerators](about-iot-accelerators.md) follow its recommendations.

The open-source [Remote Monitoring](iot-accelerators-remote-monitoring-sample-walkthrough.md) and [Connected Factory](iot-accelerators-connected-factory-features.md) solution accelerators follow many of the reference architecture recommendations. You can use the solution accelerators either as a starting point for your own IoT solution or as learning tools.

## Overview

The reference architecture describes elements of an IoT solution such as the technology principles, the composition of Azure IoT services, and the devices. The architecture also makes recommendations about implementation technologies.

At the highest level, you can view an IoT solution as being made up of:

* Things that generate and send telemetry such as measurements and events. In the Remote Monitoring solution accelerator, devices such as trucks or elevators are the things that send telemetry.
* Insights generated from the telemetry sent from the things. In the Remote Monitoring solution accelerator, a rule generates an insight. For example, a rule can identify when the temperature in an engine reaches a threshold.
* Actions, based in insights, that help improve a business or process. In the Remote Monitoring solution accelerator, an email action can notify an operator about a potential issue with an engine.

The [Azure IoT reference architecture](https://aka.ms/iotrefarchitecture) is a living document updates as the technology evolves.

## Core subsystems

The reference architecture identifies the core subsystems shown in the following diagram:

![Core subsystems](media/iot-accelerators-architecture-overview/coresubsystems1.png)

The following sections describe how the components of the Remote Monitoring solution accelerator map to the core subsystems.

### IoT devices

An IoT solution should enable secure, efficient, and robust communication between nearly any kind of device and a cloud gateway. Devices are business assets that range from simple temperature sensors to complex factory production lines with hundreds of components and sensors.

A field gateway, or edge device, is a specialized device-appliance or general-purpose software that can act as a:

* Communication enabler to handle protocol conversion.
* Local device control system and device telemetry processing hub. An edge device can process telemetry locally to control devices without communicating with the cloud. An edge device can also filter or aggregate device telemetry to reduce the amount of telemetry transferred to the cloud.

In the Remote Monitoring solution, devices connect to an IoT hub and send telemetry for processing. The Remote Monitoring solution also lets operators manage devices using jobs or automatic device management. You can use the Azure IoT device SDKs to implement your devices.

The Remote Monitoring solution can deploy and manage IoT Edge devices. Processing at the edge helps to reduce the volume of telemetry sent to the cloud and speed up responses to device events.

### Cloud gateway

A cloud gateway enables communication to and from devices and edge devices. These devices may be at many remote sites.

The gateway manages device communication, including connection management, protection of the communication path, authentication, and authorization. The gateway also enforces connection and throughput quotas, and collects telemetry used for billing, diagnostics, and other monitoring tasks.

The Remote Monitoring solution deploys an IoT hub to provide a secure endpoint for devices to send telemetry to. The IoT hub also:

* Includes a device identity store to manage the devices allowed to connect to the solution.
* Enables the solution to send commands to devices. For example, to open a valve to release pressure.
* Enables bulk device management. For example, to upgrade the firmware on a set of devices.

### Stream processing

As the solution ingests telemetry, it's important to understand how the flow of telemetry processing can vary. Depending on the scenario, data records can flow through different stages:

* Storage, such as in-memory caches, temporary queues, and permanent archives.

* Analysis, to run input telemetry through a set of conditions and can produce different output data records. For example, input telemetry encoded in Avro may return output telemetry encoded in JSON.

* Original input telemetry and analysis output records are typically stored and made available for display. The input telemetry and output records may also trigger actions such as emails, incident tickets, and device commands.

Routing can dispatch telemetry to one or more storage endpoints, analysis processes, and actions. A solution might combine the stages in different orders, and process them with concurrent parallel tasks.

The Remote Monitoring solution uses [Azure Stream Analytics](/azure/stream-analytics/) for stream processing. The rules engine in the solution uses Stream Analytics queries to generate alerts and actions. For example, the solution can use a query to identify when the average temperature in a truck's storage compartment over five minutes falls below 36 degrees.

### Storage

IoT solutions can generate large amounts of data, which is often time series data. This data needs to be stored where it can be used for visualization and reporting. A solution may also need to access data later for analysis or additional processing. It's common to have data split into warm and cold data stores. The warm data store holds recent data for low latency access. The cold data store typically stores historical data.

The Remote Monitoring solution uses [Azure Time Series Insights](/azure/time-series-insights/) as its warm data store and Cosmos DB as its cold data store.

### UI and reporting tools

The solution UI can provide:

* Access to and visualization of device data and analysis results.
* Discovery of devices through the registry.
* Command and control of devices.
* Device provisioning workflows.
* Notifications and alerts.
* Integration with live, interactive dashboards to display data from large numbers of devices.  
* Geo-location and geo-aware services.

The Remote Monitoring solution includes a web UI to deliver this functionality. The web UI includes:

* An interactive map to show the location of devices.
* Access to the Time Series Insights explorer to query and analyze the telemetry.

### Business integration

The business integration layer handles the integration of the IoT solution with business systems such as CRM, ERP, and line-of-business applications. Examples include service billing, customer support, and replacement parts supply.

The Remote Monitoring solution uses rules to send emails when a condition is met. For example, the solution can notify an operator when the temperature in a truck falls below 36 degrees.

## Next steps

In this article, you learned about the Azure IoT reference architecture and saw some examples of how the Remote Monitoring solution accelerator follows its recommendations. The next step is to read the [Microsoft  Azure IoT Reference Architecture](https://aka.ms/iotrefarchitecture).