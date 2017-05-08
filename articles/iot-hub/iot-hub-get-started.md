---
title: 'Azure IoT Hub - get started connecting IoT devices to the cloud | Microsoft Docs'
description: 'Learn how to connect your IoT devices to Azure IoT Hub. Your devices can send telemtry to IoT Hub and Iot Hub can monitor and manage your devices.'
services: iot-hub
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''
keywords: 'azure iot hub tutorial'

ms.assetid: 24376318-5344-4a81-a1e6-0003ed587d53
ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/28/2017
ms.author: dobett

---
# Azure IoT Hub get started tutorials

You can use Azure IoT Hub and the Azure IoT device SDKs to build Internet of Things (IoT) solutions.

* Azure IoT Hub is a fully managed service in the cloud that securely connects, monitors, and manages your IoT devices. Use the Azure IoT Device SDKs to implement your IoT devices.
* Use an IoT gateway in more complex IoT scenarios where you need to consider factors such as legacy devices, bandwidth costs, security and privacy policies, or edge data processing. In these scenarios, you use Azure IoT Gateway SDK to build a gateway device that connects devices to your IoT hub.

## What do the tutorials cover

These tutorials introduce you to Azure IoT Hub and the device SDKs. The tutorials cover common IoT scenarios to demonstrate the capabilities of IoT Hub. The tutorials also illustrate how to combine IoT Hub with other Azure services and tools to build more powerful IoT solutions. In the tutorials you can choose to use either simulated or real IoT devices. In addition, you can learn how to use a gateway to enable devices to connect to your IoT hub.

## Device setup scenario: Connect IoT device or gateway to Azure IoT Hub

You can choose your real or simulated device to get started.

| IoT device                       | Programming language |
|---------------------------------|----------------------|
| Raspberry Pi                    | [Node.js][Pi_Nd], [C][Pi_C]           |
| Intel Edison                    | [Node.js][Ed_Nd], [C][Ed_C]           |
| Adafruit Feather HUZZAH ESP8266 | [Arduino][Hu_Ard]              |
| Sparkfun ESP8266 Thing Dev      | [Arduino][Th_Ard]              |
| Adafruit Feather M0             | [Arduino][M0_Ard]              |
| Simulated device                | [.NET][Sim_NET], [Java][Sim_Jav], [Node.js][Sim_Nd], [Python][Sim_Pyth]              |

In addition, you can use a gateway to enable devices to connect to your IoT hub.

| Gateway device               | Programming language | Platform         |
|------------------------------|----------------------|------------------|
| Intel NUC (model DE3815TYKE) | C                    | [Wind River Linux][NUC_Lnx] |
| Simulated gateway            | C                    | [Linux][Sim_Lnx], [Windows][Sim_Win] |

## Extended IoT scenarios: Use other Azure services and tools

When you have connected your device to IoT Hub, you can explore additional scenarios that use other Azure tools and services:

| Scenario                                    | Azure service or tool              |
|---------------------------------------------|------------------------------------|
| [Manage IoT Hub messages][Mg_IoT_Hub_Msg]                    | iothub-explorer tool               |
| [Manage your IoT device][Mg_IoT_Dv]               | iothub-explorer tool               |
| [Save IoT Hub messages to Azure storage][Sv_IoT_Msg_Stor]                      | Azure table storage               |
| [Visualize sensor data][Vis_Data]             | Microsoft Power BI, Azure Web Apps |
| [Forecast weather with sensor data][Weather_Forecast] | Azure Machine Learning             |
| [Automatic anomaly detection and reaction][Anomaly_Detect]    | Azure Logic Apps                   |

## Next steps

When you have completed these tutorials, you can further explore the capabilities of IoT Hub in the [Developer guide][lnk-dev-guide]. You can find additional tutorials in the [How To][lnk-how-to] section.


[Pi_Nd]: iot-hub-raspberry-pi-kit-node-get-started.md
[Pi_C]: iot-hub-raspberry-pi-kit-c-get-started.md
[Ed_Nd]: iot-hub-intel-edison-kit-node-get-started.md
[Ed_C]: iot-hub-intel-edison-kit-c-get-started.md
[Hu_Ard]: iot-hub-arduino-huzzah-esp8266-get-started.md
[Th_Ard]: iot-hub-sparkfun-esp8266-thing-dev-get-started.md
[M0_Ard]: iot-hub-adafruit-feather-m0-wifi-kit-arduino-get-started.md
[Sim_NET]: iot-hub-csharp-csharp-getstarted.md
[Sim_Jav]: iot-hub-java-java-getstarted.md
[Sim_Nd]: iot-hub-node-node-getstarted.md
[Sim_Pyth]: iot-hub-python-getstarted.md
[NUC_Lnx]: iot-hub-gateway-kit-c-lesson1-set-up-nuc.md
[Sim_Lnx]: iot-hub-linux-gateway-sdk-get-started.md
[Sim_Win]: iot-hub-windows-gateway-sdk-get-started.md
[Mg_IoT_Hub_Msg]: iot-hub-explorer-cloud-device-messaging.md
[Mg_IoT_Dv]: iot-hub-device-management-iothub-explorer.md
[Sv_IoT_Msg_Stor]: iot-hub-store-data-in-azure-table-storage.md
[Vis_Data]: iot-hub-live-data-visualization-in-power-bi.md
[Weather_Forecast]: iot-hub-weather-forecast-machine-learning.md
[Anomaly_Detect]: iot-hub-monitoring-notifications-with-azure-logic-apps.md
[lnk-dev-guide]: iot-hub-devguide.md
[lnk-how-to]: iot-hub-how-to.md