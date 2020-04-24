---
title: Azure IoT protocol gateway | Microsoft Docs
description: How to use an Azure IoT protocol gateway to extend IoT Hub capabilities and protocol support to enable devices to connect to your hub using protocols not supported by IoT Hub natively.
author: robinsh
manager: philmea
ms.author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 07/11/2017
ms.custom: [amqp, mqtt]
---

# Support additional protocols for IoT Hub

Azure IoT Hub natively supports communication over the MQTT, AMQP, and HTTPS protocols. In some cases, devices or field gateways might not be able to use one of these standard protocols and require protocol adaptation. In such cases, you can use a custom gateway. A custom gateway enables protocol adaptation for IoT Hub endpoints by bridging the traffic to and from IoT Hub. You can use the [Azure IoT protocol gateway](https://github.com/Azure/azure-iot-protocol-gateway/blob/master/README.md) as a custom gateway to enable protocol adaptation for IoT Hub.

## Azure IoT protocol gateway

The Azure IoT protocol gateway is a framework for protocol adaptation that is designed for high-scale, bidirectional device communication with IoT Hub. The protocol gateway is a pass-through component that accepts device connections over a specific protocol. It bridges the traffic to IoT Hub over AMQP 1.0.

You can deploy the protocol gateway in Azure in a highly scalable way by using Azure Service Fabric, Azure Cloud Services worker roles, or Windows Virtual Machines. In addition, the protocol gateway can be deployed in on-premises environments, such as field gateways.

The Azure IoT protocol gateway includes an MQTT protocol adapter that enables you to customize the MQTT protocol behavior if necessary. Since IoT Hub provides built-in support for the MQTT v3.1.1 protocol, you should only consider using the MQTT protocol adapter if protocol customizations or specific requirements for additional functionality are required.

The MQTT adapter also demonstrates the programming model for building protocol adapters for other protocols. In addition, the Azure IoT protocol gateway programming model allows you to plug in custom components for specialized processing such as custom authentication, message transformations, compression/decompression, or encryption/decryption of traffic between the devices and IoT Hub.

For flexibility, the Azure IoT protocol gateway and MQTT implementation are provided in an open-source software project. You can use the open-source project to add support for various protocols and protocol versions, or customize the implementation for your scenario. 

## Next steps

To learn more about the Azure IoT protocol gateway and how to use and deploy it as part of your IoT solution, see:

* [Azure IoT protocol gateway repository on GitHub](https://github.com/Azure/azure-iot-protocol-gateway/blob/master/README.md)

* [Azure IoT protocol gateway developer guide](https://github.com/Azure/azure-iot-protocol-gateway/blob/master/docs/DeveloperGuide.md)

To learn more about planning your IoT Hub deployment, see:

* [Compare with Event Hubs](iot-hub-compare-event-hubs.md)

* [Scaling, high availability, and disaster recovery](iot-hub-scaling.md)

* [IoT Hub developer guide](iot-hub-devguide.md)