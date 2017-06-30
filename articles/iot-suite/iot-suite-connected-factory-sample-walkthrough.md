---
title: Connected factory Azure IoT Suite solution walkthrough | Microsoft Docs
description: A description of the Azure IoT preconfigured solution connected factory and its architecture.
services: ''
suite: iot-suite
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 31fe13af-0482-47be-b4c8-e98e36625855
ms.service: iot-suite
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/08/2017
ms.author: dobett

---
# Connected factory preconfigured solution walkthrough

The IoT Suite connected factory [preconfigured solution][lnk-preconfigured-solutions] is an implementation of an end-to-end industrial solution that:

* Connects to both simulated industrial devices running OPC UA servers in simulated factory production lines, and real OPC UA server devices. For more information about OPC UA, see the [FAQ][lnk-faq].
* Shows operational KPIs and OEE of those devices and production lines.
* Demonstrates how a cloud-based application could be used to interact with OPC UA server systems.
* Enables you to connect your own OPC UA server devices.
* Enables you to browse and modify the OPC UA server data.
* Integrates with the Azure Time Series Insights (TSI) service to provide customized views of the data from your OPC UA servers.

You can use the solution as a starting point for your own implementation and [customize][lnk-customize] it to meet your own specific business requirements.

This article walks you through some of the key elements of the connected factory solution to enable you to understand how it works. This knowledge helps you to:

* Troubleshoot issues in the solution.
* Plan how to customize to the solution to meet your own specific requirements.
* Design your own IoT solution that uses Azure services.

## Logical architecture

The following diagram outlines the logical components of the preconfigured solution:

![Connected factory logical architecture][connected-factory-logical]

## Simulation

The simulated stations and the simulated manufacturing execution systems (MES) make up a factory production line. The simulated devices and the OPC Publisher Module are based on the [OPC UA .NET Standard][lnk-OPC-UA-NET-Standard] published by the OPC Foundation.

The OPC Proxy and OPC Publisher are implemented as modules based on [Azure IoT Edge][lnk-Azure-IoT-Gateway]. Each simulated production line has a designated gateway attached.

All simulation components run in Docker containers  hosted in an Azure Linux VM. The simulation is configured to run eight simulated production lines by default.

## Simulated production line

A production line manufactures parts. It is composed of different stations: an assembly station, a test station, and a packaging station.

The simulation runs and updates the data that is exposed through the OPC UA nodes. All simulated production line stations are orchestrated by the MES through OPC UA.

## Simulated manufacturing execution system

The MES monitors each station in the production line through OPC UA to detect station status changes. It calls OPC UA methods to control the stations and passes a product from one station to the next until it is complete.

## Gateway OPC publisher module

OPC Publisher Module connects to the station OPC UA servers and subscribes to the OPC nodes to be published. The module converts the node data into JSON format, encrypts it, and sends it to IoT Hub as OPC UA Pub/Sub messages.

The OPC Publisher module only requires an outbound https port (443) and can work with existing enterprise infrastructure.

## Gateway OPC proxy module

The Gateway OPC UA Proxy Module tunnels binary OPC UA command and control messages and only requires an outbound https port (443). It can work with existing enterprise infrastructure, including Web Proxies.

It uses IoT Hub Device methods to transfer packetized TCP/IP data at the application layer and thus ensures endpoint trust, data encryption, and integrity using SSL/TLS.

The OPC UA binary protocol relayed through the proxy itself uses UA authentication and encryption.

## Azure Time Series Insights

The Gateway OPC Publisher Module subscribes to OPC UA server nodes to detect change in the data values. If a data change is detected in one of the nodes, this module then sends messages to Azure IoT Hub.

IoT Hub provides an event source to Azure TSI. TSI stores data for 30 days based on timestamps attached to the messages. This data includes:

* OPC UA ApplicationUri
* OPC UA NodeId
* Value of the node
* Source timestamp
* OPC UA DisplayName

Currently, TSI does not allow customers to customize how long they wish to keep the data for.

TSI queries against node data using a SearchSpan (Time.From, Time.To) and aggregates by OPC UA ApplicationUri or OPC UA NodeId or OPC UA DisplayName.

To retrieve the data for the OEE and KPI gauges, and the time series charts, data is aggregated by count of events, Sum, Avg, Min, and Max.

The time series are built using a different process. OEE and KPIs are calculated from station base data and bubbled up for the topology (production lines, factories, enterprise) in the application.

Additionally, time series for OEE and KPI topology is calculated in the app, whenever a displayed timespan is ready. For example, the day view is updated every full hour.

The time series view of node data comes directly from TSI using an aggregation for timespan.

## IoT Hub
The [IoT hub][lnk-IoT Hub] receives data sent from the OPC Publisher Module into the cloud and makes it available to the Azure TSI service. 

The IoT Hub in the solution also:
- Maintains an identity registry that stores the IDs for all OPC Publisher Module and all OPC Proxy Modules.
- Is used as transport channel for bidirectional communication of the OPC Proxy Module.

## Azure Storage
The solution uses Azure blob storage as disk storage for the VM and to store deployment data.

## Web app
The web app deployed as part of the preconfigured solution comprises of an integrated OPC UA client, alerts processing and telemetry visualization.

## Next steps

You can continue getting started with IoT Suite by reading the following articles:

* [Permissions on the azureiotsuite.com site][lnk-permissions]

[connected-factory-logical]:media/iot-suite-connected-factory-walkthrough/cf-logical-architecture.png

[lnk-preconfigured-solutions]: iot-suite-what-are-preconfigured-solutions.md
[lnk-customize]: iot-suite-guidance-on-customizing-preconfigured-solutions.md
[lnk-IoT Hub]: https://azure.microsoft.com/documentation/services/iot-hub/
[lnk-direct-methods]: ../iot-hub/iot-hub-devguide-direct-methods.md
[lnk-OPC-UA-NET-Standard]:https://github.com/OPCFoundation/UA-.NETStandardLibrary
[lnk-Azure-IoT-Gateway]: https://github.com/azure/iot-edge
[lnk-permissions]: iot-suite-permissions.md
[lnk-faq]: iot-suite-faq.md