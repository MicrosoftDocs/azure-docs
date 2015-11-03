<properties
	pageTitle="Microsoft Azure IoT Suite overview | Microsoft Azure"
	description="This provides an overview of Azure IoT Suite including packaging and the preconfigured solutions."
	services=""
	documentationCenter=""
	authors="aguilaaj"
	manager="timlt"
	editor=""/>

<tags
     ms.service="na"
     ms.devlang="na"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="10/06/2015"
     ms.author="araguila"/>

# Overview of Azure IoT Suite

Microsoft provides a breadth of capabilities with the Azure IoT services. These services deliver enterprise grade abilities to collect data from devices, analyze data streams in-motion, store and query large data sets, visualize both real-time and historical data, and integrate with important back office systems. The Azure IoT Suite packages a set of commonly leveraged services together and extended capabilities to reduce time-to-value for customers. These extensions include pre-configured solutions which deliver a base implementation of the most common solution patterns. Combined with the IoT software development kits (SDKs), customers are able to easily customize the pre-configured solutions or leverage them as examples for development of new solutions.

## Azure IoT services in Azure IoT Suite

Core to the Azure IoT Suite is the IoT Hub service. This service provides the device-to-cloud and cloud-to-service messaging. It acts as the gateway into the cloud and the other key IoT Suite services.

In-motion data analysis is provided by Azure Stream Analytics. The IoT Suite leverages this service for processing incoming telemetry messages, performing aggregation, and detecting events. It is also used to process informational messages which can be used for device metadata or command response.

Data storage capabilities are enabled through a combination of Azure Storage and Azure Document DB. Azure Storage enables blob storage of telemetry for preservation and future analysis. Document DB is utilized for its indexed storage capability on semi-structured data to manage device metadata. This enables the management of heterogenous devices by allowing different devices to have different content.

Visualization of data is provided by a combination of Azure Websites and Microsoft Power BI. The flexibility of Power BI enables customers to quickly build their own interactive dashboards from IoT Suite data.

More details on the architecture and how these services are used can be found in the article [Microsoft Azure and the Internet of Things (IoT)](iot-suite-what-is-azure-iot.md).

## Preconfigured solutions

Preconfigured solutions are included in the Azure IoT Suite to enable customers to quickly get started and explore scenarios made possible by Azure IoT Suite.

The first preconfigured solution available is [Remote Monitoring](iot-suite-what-are-preconfigured-solutions.md).
