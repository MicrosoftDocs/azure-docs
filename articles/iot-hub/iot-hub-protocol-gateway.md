<properties
   pageTitle="Azure IoT protocol gateway | Microsoft Azure"
   description="Describes how to use Azure IoT protocol gateway to extend the capabilities and protocol support of Azure IoT Hub."
   services="iot-hub"
   documentationCenter=""
   authors="kdotchkoff"
   manager="timlt"
   editor=""/>

<tags
   ms.service="iot-hub"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/18/2016"
   ms.author="kdotchko"/>

# Supporting additional protocols for IoT Hub

Azure IoT Hub natively supports communication over the AMQP, MQTT, and HTTP/1 protocols. In some cases, devices or field gateways might not be able to use one of these standard protocols and will require protocol adaptation. In such cases, you can use a custom gateway. A custom gateway can enable protocol adaptation for IoT Hub endpoints by bridging the traffic to and from IoT Hub. You can use the [Azure IoT protocol gateway](https://github.com/Azure/azure-iot-protocol-gateway/blob/master/README.md) as a custom gateway to enable protocol adaptation for IoT Hub.

## Azure IoT protocol gateway

The Azure IoT protocol gateway is a framework for protocol adaptation that is designed for high-scale, bidirectional device communication with IoT Hub. The protocol gateway is a pass-through component that accepts device connections over a specific protocol. It bridges the traffic to IoT Hub over AMQP 1.0. The IoT protocol gateway is available as an open-source software project to provide flexibility for adding support for a variety of protocols and protocol versions.

You can deploy the protocol gateway in Azure in a highly scalable way by using Azure Cloud Services worker roles. In addition, the protocol gateway can be deployed in on-premises environments, such as field gateways.

The Azure IoT protocol gateway includes an MQTT protocol adapter that enables you to customize the MQTT protocol behavior if required. Since IoT Hub provides built-in support for the MQTT v3.1.1 protocol, you should only consider using the MQTT protocol adapter if you have a need for protocol customizations or specific requirements for additonal functionality.

The MQTT adapter also demonstrates the programming model for building protocol adapters for other protocols. In addition, the IoT protocol gateway programming model allows you to plug in custom components for specialized processing--such as custom authentication, message transformations, compression/decompression, or encryption/decryption of traffic between the devices and IoT Hub.

For flexibility, the protocol gateway and MQTT implementation are provided in an open-source software project. This allows you to customize the implementation as needed.

## Next steps

To learn more about the Azure IoT protocol gateway and how to use and deploy it as part of your IoT solution, see:

* [Azure IoT protocol gateway repository on GitHub](https://github.com/Azure/azure-iot-protocol-gateway/blob/master/README.md)
* [Azure IoT protocol gateway developer guide](https://github.com/Azure/azure-iot-protocol-gateway/blob/master/docs/DeveloperGuide.md)

To learn more about planning your IoT Hub deployment, see:

- [Compare with Event Hubs][lnk-compare]
- [Scaling, HA and DR][lnk-scaling]

To further explore the capabilities of IoT Hub, see:

- [Developer guide][lnk-devguide]
- [Exploring device management using the sample UI][lnk-dmui]
- [Simulating a device with the Gateway SDK][lnk-gateway]
- [Using the Azure Portal to manage IoT Hub][lnk-portal]

[lnk-compare]: iot-hub-compare-event-hubs.md
[lnk-scaling]: iot-hub-scaling.md
[lnk-devguide]: iot-hub-devguide.md
[lnk-dmui]: iot-hub-device-management-ui-sample.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
[lnk-portal]: iot-hub-manage-through-portal.md