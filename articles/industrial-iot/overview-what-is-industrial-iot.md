---
title: Azure Industrial IoT Overview
description: This article provides an overview of Industrial IoT. It explains the shop floor connectivity and security components in IIoT.
author: jehona-m
ms.author: jemorina
ms.service: industrial-iot
ms.topic: overview
ms.date: 3/22/2021
---

# What is Industrial IoT (IIoT)?

IIoT (Industrial Internet of Things) enhances industrial efficiencies through the application of IoT in the manufacturing industry.

![Industrial Iot](media/overview-what-is-Industrial-IoT/icon-255-px.png)

## Improve industrial efficiencies
Enhance your operational productivity and profitability with Azure Industrial IoT. Reduce the time-consuming process of accessing the assets on-site. Connect and monitor your industrial equipment and devices in the cloud - including your machines already operating on the factory floor. Analyze your IoT data for insights that help you increase the performance of the entire site.

## Industrial IoT Components

**IoT Edge devices**
An IoT Edge device is composed of Edge Runtime and Edge Modules. 
- *Edge Modules* are docker containers, which are the smallest unit of computation, like OPC Publisher and OPC Twin. 
- *Edge device* is used to deploy such modules, which act as mediator between OPC UA server and IoT Hub in cloud. More information about IoT Edge is [here](https://azure.microsoft.com/services/iot-edge/).

**IoT Hub** 
The IoT Hub acts as a central message hub for bi-directional communication between IoT application and the devices it manages. It's an open and flexible cloud platform as a service that supports open-source SDKs and multiple protocols. Read more about IoT Hub [here](https://azure.microsoft.com/services/iot-hub/).

**Industrial Edge Modules**
- *OPC Publisher*: The OPC Publisher runs inside IoT Edge. It connects to OPC UA servers and publishes JSON encoded telemetry data from these servers in OPC UA "Pub/Sub" format to Azure IoT Hub. All transport protocols supported by the Azure IoT Hub client SDK can be used, i.e. HTTPS, AMQP, and MQTT.
- *OPC Twin*: The OPC Twin consists of microservices that use Azure IoT Edge and IoT Hub to connect the cloud and the factory network. OPC Twin provides discovery, registration, and remote control of industrial devices through REST APIs. OPC Twin doesn't require an OPC Unified Architecture (OPC UA) SDK. It's programming language agnostic, and can be included in a serverless workflow.
- *Discovery*: The discovery module, represented by the discoverer identity, provides discovery services on the edge, which include OPC UA server discovery. If discovery is configured and enabled, the module will send the results of a scan probe via the IoT Edge and IoT Hub telemetry path to the Onboarding service. The service processes the results and updates all related Identities in the Registry.


**Discover, register, and manage your Industrial Assets with Azure**
Azure Industrial IoT allows plant operators to discover OPC UA enabled servers in a factory network and register them in Azure IoT Hub. Operations personnel can subscribe and react to events on the factory floor from anywhere in the world. The Microservices' REST APIs mirror the OPC UA services edge-side. They are secured using OAUTH authentication and authorization backed by Azure Active Directory (AAD). This enables your cloud applications to browse server address spaces or read/write variables and execute methods using HTTPS and simple OPC UA JSON payloads.

## Next steps
Now that you have learned what Industrial IoT is, you can read about the Industrial IoT Platform and the OPC Publisher:

> [!div class="nextstepaction"]
> [What is the Industrial IoT Platform?](overview-what-is-industrial-iot-platform.md)

> [!div class="nextstepaction"]
> [What is the OPC Publisher?](overview-what-is-opc-publisher.md)