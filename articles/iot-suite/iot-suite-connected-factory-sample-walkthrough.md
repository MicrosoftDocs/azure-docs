---
title: connected factory preconfigured solution walkthrough | Microsoft Docs
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
ms.date: 02/15/2017
ms.author: dobett

---
# Connected factory preconfigured solution walkthrough
## Introduction
The IoT Suite connected factory [preconfigured solution][lnk-preconfigured-solutions] is an implementation of an end-to-end industrial solution that:

* Connects to multiple simulated industrial devices running OPC servers in simulated factory production lines
* Shows operational KPIs of those devices
* Demonstrates how a cloud based application could be used to interact with OPC server systems 
* Enables you connect your own OPC server devices
* Enables you browse and modify the OPC servers data
* Integrates the new Azure Time Series Insights service
 
 You can use the solution as a starting point for your own implementation and [customize][lnk-customize] it to meet your own specific business requirements.

This article walks you through some of the key elements of the connected factory solution to enable you to understand how it works. This knowledge helps you to:

* Troubleshoot issues in the solution.
* Plan how to customize to the solution to meet your own specific requirements. 
* Design your own IoT solution that uses Azure services.

## Logical architecture
The following diagram outlines the logical components of the preconfigured solution:

![Logical architecture][Connected-Factory-Logical]

 ## Simulation
The simulated stations and the simulated MES make up an factory production line, which could be easily instantiated. These simulated devices as well as the OPC Publisher Module are based on [OPC UA .NET Standard][lnk-OPC-UA-NET-Standard] published by the OPC Foundation. 

The OPC Proxy and OPC Publisher are implemented as modules based on the [Microsoft Azure IoT Gateway SDK][lnk-Azure-IoT-Gateway] Each simulated production line has a designated gateway attached.

All simulation components are running in Docker containers, which are hosted in a Azure Linux VM. The simulation is configured to run 8 simulated production lines by default.


## Simulated production line
An production line manufactures parts. It is composed of different stations: an assembly station, a test station and a packaging station.

The simulation runs and updates the data that is exposed through the OPC UA nodes. All simulated production line stations are orchestrated by the manufacturing execution system (MES) through OPC UA.


## Simulated manufacturing execution system 
The MES monitors each station in the production line via OPC UA to detect station status chnages. It calls OPC UA methods to control the stations and passes a product from one station to the next till it is completed.


## Gateway OPC publisher module
OPC Publisher Module connects to the station OPC UA servers and subscribes to the OPC nodes which should be published. It converts the node data into JSON format and send the data as encrypted telemetry to Azure IoTHub as OPC UA Pub/Sub messages. 

The OPC Publisher module only requires and outbound https port (443) and can work with existing enterprise infrastructure.

## Gateway OPC proxy
The Gateway OPC UA Proxy Module tunnels binary OPC UA command and control messages and only requires an outbound https port (443). It can work with existing enterprise infrastructure, including Web Proxies.

It uses IoT Hub Device methods to transfer packetized TCP/IP data at the application layer and thus ensures endpoint trust, data encryption and integrity using SSL/TLS.

The OPC UA binary protocol relayed through the proxy itself uses UA authentication and encryption.

## Azure Time Series Insights:  
The Gateway OPC Publisher Module subscribes to OPC UA server nodes to detect change in the data values, this module then send messages to Azure IoTHub, if a data change is detected in one of the nodes.

IoTHub provides an event source to Azure Time Series Insights (TSI). TSI stores data for 30 days based on timestamps attached to the messages, including OPC UA ApplicationUri, OPC UA NodeId, value of the node, source timestamp and OPC UA DisplayName. In the future TSI will allow customers to customize how long they wish to keep the data for.

Aggregated data of node changes is queried from Azure Time Series Insights based on SearchSpan (Time.From, Time.To) and aggregated by OPC UA ApplicationUri or OPC UA NodeId or OPC UA DisplayName.

Aggregation is done based on count of events, Sum, Avg, Min and Max to retrieve the data for the Connected factory preconfigured solutions gauges and time series.
The time series are built in different means: OEE & KPIs are calculated from station base data and bubbled up for the topology in the application.

Additionally, time series for OEE and KPI topology is calculated in the app, whenever a displayed timespan is ready for example every full hour the day view is updated etc.

The time series view of node data comes directly from TSI using an aggregation for timespan.

## IoT Hub
The [IoT hub][lnk-iothub] receives data sent from the OPC Publisher Module into the cloud and makes it available to the Azure Time Series Insights service. 

The IoT Hub in the solution also:
- Maintains an identity registry that stores the IDs for all OPC Publisher Module and all OPC Proxy Modules.
- It is used as transport channel for bidirectional communication of the OPC Proxy Module.

## Azure Storage
The solution uses Azure blob storage as disk storage for the VM and to store deployment data.

## Web app
The web app deployed as part of the preconfigured solution. It comprises of an integrated OPC UA client, alerts processing and telemetry visualization.

## Next steps

You can continue getting started with IoT Suite by reading the following articles:

* [Connect your device to the remote monitoring preconfigured solution][lnk-connect-rm]
* [Permissions on the azureiotsuite.com site][lnk-permissions]

[Connected-Factory-Logical]:media/iot-suite-connected-factory-walkthrough/CF-Logical-architecture.png

[lnk-preconfigured-solutions]: iot-suite-what-are-preconfigured-solutions.md
[lnk-customize]: iot-suite-guidance-on-customizing-preconfigured-solutions.md
[lnk-iothub]: https://azure.microsoft.com/documentation/services/iot-hub/
[lnk-asa]: https://azure.microsoft.com/documentation/services/stream-analytics/
[lnk-webjobs]: https://azure.microsoft.com/documentation/articles/websites-webjobs-resources/
[lnk-connect-rm]: iot-suite-connecting-devices.md
[lnk-permissions]: iot-suite-permissions.md
[lnk-c2d-guidance]: ../iot-hub/iot-hub-devguide-c2d-guidance.md
[lnk-device-twins]:  ../iot-hub/iot-hub-devguide-device-twins.md
[lnk-direct-methods]: ../iot-hub/iot-hub-devguide-direct-methods.md
[lnk-OPC-UA-NET-Standard]:https://github.com/OPCFoundation/UA-.NETStandardLibrary
[lnk-Azure-IoT-Gateway]: https://github.com/azure/azure-iot-gateway-sdk