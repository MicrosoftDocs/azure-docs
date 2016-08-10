<properties
 pageTitle="Azure IoT Hub information for IT Pros | Microsoft Azure"
 description="Information to help IT Pros work with Azure IoT Hub such as port requirements and security background."
 services="iot-hub"
 documentationCenter=""
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="08/09/2016"
 ms.author="dobett"/>

# Configuring and managing access to IoT Hub

This article provides information to help IT Pros configure an environment where IoT devices communicate with IoT Hub over a network infrastructure.

## Network connectivity

Devices can communicate with IoT Hub in Azure using a variety of protocols. Typically, the choice of protocol is driven by the specific requirements of the solution. The following table lists the outbound ports that must be open for a device to be able to use a specific protocol:

| Protocol | Port(s) |
| -------- | ------- |
| HTTPS    | 443     |
| AMQP     | 5671    |
| AMQP over WebSockets | 443    |
| MQTT | 8883 |
| LWM2M (Device management) | 5684 |

Once you have created an IoT hub in an Azure region, the hub will keep the same IP address for the lifetime of that hub. However, to maintain quality of service, if Microsoft moves the IoT hub to a different scale unit then it will be assigned a new IP address.

## IoT Hub and security

Only devices registered with an IoT hub are allowed to communicate with that IoT hub. A registered device must be granted the *DeviceConnect* permission. A device identifies itself by including a token that encapsulates the devices unique ID in each request it makes, and the hub checks the validity of the token and that the device is not blacklisted (*DeviceConnect* permission revoked). For information about the tokens supported by IoT Hub, see [Use IoT Hub security tokens and X.509 certificates][lnk-tokens]

Access to other management endpoints in an IoT hub is also controlled through a set of permissions: *iothubowner*, *service*, *registryRead*, and *registryReadWrite*. Any client management application that connects to an IoT hub must include a token with the appropriate permissions.

## Next steps

This article contains specific information for IT Pros and developers configuring their development and test environments. The [security section in the Azure IoT Hub developer guide][lnk-devguide] provides additional information about the tokens and permission system in IoT Hub.

To further explore the capabilities of IoT Hub, see:

- [Designing your solution][lnk-design]
- [Developer guide][lnk-devguide]
- [Exploring device management using the sample UI][lnk-dmui]
- [Simulating a device with the Gateway SDK][lnk-gateway]

[lnk-devguide]: iot-hub-devguide.md#security

[lnk-design]: iot-hub-guidance.md
[lnk-devguide]: iot-hub-devguide.md
[lnk-dmui]: iot-hub-device-management-ui-sample.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
[lnk-tokens]: iot-hub-sas-tokens.md