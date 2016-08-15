<properties
	pageTitle="Microsoft Azure IoT Suite overview | Microsoft Azure"
	description="Overview of how Azure IoT Suite delivers internet of things preconfigured solutions to collect, analyze, and store data, provide visualizations, and integrate with other systems."
	services=""
    suite="iot-suite"
	documentationCenter=""
	authors="dominicbetts"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-suite"
     ms.devlang="na"
     ms.topic="get-started-article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="08/09/2016"
     ms.author="dobett"/>

# What is Azure IoT Suite?

The Azure internet of things (IoT) services offer a broad range of capabilities. These enterprise grade services enable you to:

- Collect data from devices
- Analyze data streams in-motion
- Store and query large data sets
- Visualize both real-time and historical data
- Integrate with back-office systems

To deliver these capabilities, Azure IoT Suite packages together multiple Azure services with custom extensions as *preconfigured solutions*. These preconfigured solutions are base implementations of common IoT solution patterns that help to reduce the time you take to deliver your IoT solutions. Using the [IoT software development kits][lnk-sdks], you can customize and extend these solutions to meet your own requirements. You can also use these solutions as examples or templates when you are developing new IoT solutions.

The following video provides an introduction to Azure IoT Suite:

> [AZURE.VIDEO azurecon-2015-introducing-the-microsoft-azure-iot-suite]

## Azure IoT services in Azure IoT Suite

The preconfigured solutions typically use the following services:

- Core to Azure IoT Suite is the [Azure IoT Hub][lnk-iot-hub] service. This service provides the device-to-cloud and cloud-to-device messaging capabilities and acts as the gateway to the cloud and the other key IoT Suite services. The service enables you to receive messages from your devices at scale, and send commands to your devices.

- [Azure Stream Analytics][lnk-asa] provides in-motion data analysis. IoT Suite leverages this service to process incoming telemetry, perform aggregation, and detect events. The preconfigured solutions also use stream analytics to process informational messages that contain data such as metadata or command responses from devices. The solutions use Stream Analytics to process the messages from your devices and deliver those messages to other services.

- [Azure Storage][lnk-azure-storage] and [Azure DocumentDB][lnk-document-db] provide the data storage capabilities. The preconfigured solutions use blob storage to store telemetry and to make it available for analysis. The solutions use DocumentDB to store device metadata and enable the device management capabilities of the solutions.

- [Azure Web Apps][lnk-web-apps] and [Microsoft Power BI][lnk-power-bi] provide the data visualization capabilities. The flexibility of Power BI enables you to quickly build your own interactive dashboards that use IoT Suite data.

For an overview of the architecture of a typical IoT solution, see [Microsoft Azure and the Internet of Things (IoT)][iot-suite-what-is-azure-iot].

## Preconfigured solutions

IoT Suite includes preconfigured solutions that enable you to quickly get started with and to explore the common IoT scenarios, such as *Remote monitoring* and *Predictive maintenance*, that Azure IoT Suite makes possible. You can deploy these solutions to your Azure subscription and then run a complete, end-to-end IoT scenario.

## Next steps

Now that you have an overview of what IoT Suite can do and what are its main components, you can learn more about the preconfigured solutions in IoT Suite, see [What are the Azure IoT preconfigured solutions?][lnk-what-are-preconfig]

[lnk-sdks]: https://azure.microsoft.com/documentation/articles/iot-hub-sdks-summary/
[lnk-iot-hub]: https://azure.microsoft.com/documentation/services/iot-hub/
[lnk-asa]: https://azure.microsoft.com/documentation/services/stream-analytics/
[lnk-azure-storage]: https://azure.microsoft.com/documentation/services/storage/
[lnk-document-db]: https://azure.microsoft.com/documentation/services/documentdb/
[lnk-power-bi]: https://powerbi.microsoft.com/
[lnk-web-apps]: https://azure.microsoft.com/documentation/services/app-service/web/
[iot-suite-what-is-azure-iot]: iot-suite-what-is-azure-iot.md
[lnk-what-are-preconfig]: iot-suite-what-are-preconfigured-solutions.md
