---
title: Azure IoT protocol gateway | Microsoft Docs
description: How to use an Azure IoT protocol gateway to extend IoT Hub capabilities and protocol support to enable devices to connect to your hub using protocols not supported by IoT Hub natively.
author: fsautomata
manager: 
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 07/11/2017
ms.author: elioda
---

# Support additional protocols for IoT Hub
Azure IoT Hub natively supports communication over the MQTT, AMQP, and HTTPS protocols. In some cases, devices or field gateways might not be able to use one of these standard protocols and require protocol adaptation. In such cases, you can use a custom gateway. A custom gateway enables protocol adaptation for IoT Hub endpoints by bridging the traffic to and from IoT Hub. You can use an IoT Edge device [How an IoT Edge device can be used as a gateway](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/iot-edge/iot-edge-as-gateway.md) as a custom gateway to enable protocol adaptation for IoT Hub.

## Azure IoT protocol gateway
The Azure IoT Edge protocol gateway is a framework for protocol adaptation that is designed for high-scale, bidirectional device communication with IoT Hub. The protocol gateway is a pass-through component that accepts device connections over a specific protocol. It bridges the traffic to IoT Hub over AMQP 1.0. 

You can deploy the Edge protocol gateway in Azure in a highly scalable way by using Azure Service Fabric, Azure Cloud Services worker roles, or Windows Virtual Machines. In addition, the protocol gateway can be deployed in on-premises environments, such as field gateways.

The MQTT adapter also demonstrates the programming model for building protocol adapters for other protocols. In addition, the Azure IoT protocol gateway programming model allows you to plug in custom components for specialized processing such as custom authentication, message transformations, compression/decompression, or encryption/decryption of traffic between the devices and IoT Hub.

For flexibility, the Azure IoT Edge protocol gateway and MQTT implementation are provided in an open-source software project. You can use the open-source project to add support for various protocols and protocol versions, or customize the implementation for your scenario. 

## Next steps
To learn more about the Azure IoT Edge protocol gateway and how to use and deploy it as part of your IoT solution, see:

* [How an IoT Edge device can be used as a gateway](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/iot-edge/iot-edge-as-gateway.md)

To learn more about planning your IoT Hub deployment, see:

* [Compare with Event Hubs][lnk-compare]
* [Scaling, high availability, and disaster recovery][lnk-scaling]
* [IoT Hub developer guide][lnk-devguide]

[lnk-compare]: iot-hub-compare-event-hubs.md
[lnk-scaling]: iot-hub-scaling.md
[lnk-devguide]: iot-hub-devguide.md
