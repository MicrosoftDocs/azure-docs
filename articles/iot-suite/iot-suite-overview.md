<properties
	pageTitle="Microsoft Azure IoT Suite overview | Microsoft Azure"
	description="This provides an overview of Azure IoT Suite including packaging and the preconfigured solutions."
	services=""
	documentationCenter=""
	authors="dominicbetts"
	manager="timlt"
	editor=""/>

<tags
     ms.service="na"
     ms.devlang="na"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="11/27/2015"
     ms.author="dobett"/>

# Overview of Azure IoT Suite

The Azure IoT services offer a broad range of capabilities. These enterprise grade services enable you to:

- Collect data from devices
- Analyze data streams in-motion
- Store and query large data sets
- Visualize both real-time and historical data
- Integrate with back-office systems

Azure IoT Suite packages together commonly leveraged Azure services with custom extensions as preconfigured solutions. These preconfigured solutions are base implementations of common IoT solution patterns that help you to reduce the time you take to deliver your IoT solutions. Using the [IoT software development kits][lnk-sdks], you can easily customize these preconfigured solutions to meet your own requirements or leverage them as examples when you are developing new solutions.

The following video provides an introduction to Azure IoT Suite:

> [AZURE.VIDEO azurecon-2015-introducing-the-microsoft-azure-iot-suite]

## Azure IoT services in Azure IoT Suite

Core to Azure IoT Suite is the [Azure IoT Hub][lnk-iot-hub] service. This service provides the device-to-cloud and cloud-to-device messaging capabilities and acts as the gateway to the cloud and the other key IoT Suite services.

[Azure Stream Analytics][lnk-asa] provides in-motion data analysis. IoT Suite leverages this service to process incoming telemetry, perform aggregation, and detect events. The preconfigured solutions also use stream analytics to process informational messages that contain data such as metadata or command responses from devices.

[Azure Storage][lnk-azure-storage] and [Azure DocumentDB][lnk-document-db] provide the data storage capabilities. The preconfigured solutions use blob storage to store telemetry and to make it available for analysis. The preconfigured solutions use the indexed storage  on semi-structured data capability of DocumentDB to manage device metadata. This enables the solutions to manage heterogeneous devices that have different content storage requirements.

[Azure Web Apps][lnk-web-apps] and [Microsoft Power BI][lnk-power-bi] provide the data visualization capabilities. The flexibility of Power BI enables you to quickly build your own interactive dashboards that use IoT Suite data.

For an overview of the architecture of a typical IoT solution, see [Microsoft Azure and the Internet of Things (IoT)][iot-suite-what-is-azure-iot].

## Preconfigured solutions

IoT Suite includes preconfigured solutions that enable you to quickly get started with and to explore the common IoT scenarios that Azure IoT Suite makes possible. You can deploy the preconfigured solutions to your Azure subscription and then run a complete, end-to-end IoT solution.

## Next steps

To learn more about the preconfigured solutions in IoT Suite, see [What are the Azure IoT preconfigured solutions?][lnk-what-are-preconfig]

To get started using one of the preconfigured solutions, see [Getting started with the IoT preconfigured solutions][lnk-preconfig-start].

To learn more about the Azure IoT Hub service, see the [IoT Hub documentation][lnk-iot-hub].


[lnk-sdks]: https://azure.microsoft.com/documentation/articles/iot-hub-sdks-summary/
[lnk-iot-hub]: https://azure.microsoft.com/documentation/services/iot-hub/
[lnk-asa]: https://azure.microsoft.com/documentation/services/stream-analytics/
[lnk-azure-storage]: https://azure.microsoft.com/documentation/services/storage/
[lnk-document-db]: https://azure.microsoft.com/documentation/services/documentdb/
[lnk-power-bi]: https://powerbi.microsoft.com/
[lnk-web-apps]: https://azure.microsoft.com/documentation/services/app-service/web/
[iot-suite-what-is-azure-iot]: iot-suite-what-is-azure-iot.md
[lnk-what-are-preconfig]: iot-suite-what-are-preconfigured-solutions.md
[lnk-preconfig-start]: iot-suite-getstarted-preconfigured-solutions/
[lnk-iot-hub]: https://azure.microsoft.com/documentation/services/iot-hub/