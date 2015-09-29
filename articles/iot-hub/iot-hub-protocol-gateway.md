<properties
   pageTitle="Azure IoT protocol gateway | Microsoft Azure"
   description="Describes how to use Azure IoT protocol gateway to extend the capabilities of Azure IoT Hub"
   services="iot-hub"
   documentationCenter=""
   authors="kdotchkoff"
   manager="kevinmil"
   editor=""/>

<tags
   ms.service="iot-hub"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="09/29/2015"
   ms.author="kdotchkoff"/>

# Supporting additional protocols for IoT Hub
IoT Hub natively supports communication over the HTTPS and AMQP protocols. In some cases, devices or field gateways might not be able to use one of these standard protocols, and they will require protocol translation to connect to IoT Hub. A custom gateway can enable protocol adaptation for IoT Hub endpoints by bridging the traffic to and from IoT Hub. Azure IoT protocol gateway enables communication between IoT devices and IoT Hub over the MQTT protocol by implementing a MQTT protocol adapter. 

## Azure IoT protocol gateway
Azure IoT protocol gateway is a framework for protocol adaptation designed for high-scale, bi-directional device communication with IoT Hub. The protocol gateway is a pass-through component accepting device connections over a specific protocol and bridging the traffic to IoT Hub over AMQP 1.0. 

The IoT protocol gateway is available as an open-source software (OSS) project to provide flexibility for adding support for a variety of protocols by using the provided framework.

The protocol gateway can be deployed in Azure in a highly scalable way using Cloud Services worker roles. In addition, the protocol gateway can be deployed in on-premises environments.

The Azure IoT protocol gateway includes an MQTT adapter to facilitate communication with devices over the MQTT v3.1.1 protocol.  
The MQTT adapter also demonstrates the programing model for building protocol adapters for other protocols. The Azure IoT protocol gateway programming model allows you to plug in custom components for specialized processing such as custom authentication, message transformations, compression/decompression, or encryption/decryption of traffic between the devices and IoT Hub. The protocol gateway and the MQTT implementation are provided as am OSS project for flexibility to allow for customizations of the implementation as needed.

## Next steps 

To learn more about the Azure IoT protocol gateway, and how to use and deploy it as part of your IoT solution, please see:

* [Azure IoT protocol gateway repository on GitHub](https://github.com/Azure/azure-iot-protocol-gateway/blob/master/README.md)
* [Azure IoT protocol gateway developer guide](https://github.com/Azure/azure-iot-protocol-gateway/blob/master/docs/DeveloperGuide.md)