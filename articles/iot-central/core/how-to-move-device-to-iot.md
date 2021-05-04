---
title: How to move a device to Azure IoT Central from IoT Hub
description: How to move device to Azure IoT Central from IoT Hub
author: philmea
ms.author: philmea
ms.date: 02/20/2021 
ms.topic: how-to
ms.service: iot-central
services: iot-central
---
# How to transfer a device to Azure IoT Central from IoT Hub

*This article applies to operators and device developers.*  

This article describes how to transfer a device to an Azure IoT Central application from an IoT Hub. 

A device first connects to a DPS endpoint to retrieve the information it needs to connect to your application. Internally, your IoT Central application uses an IoT hub to handle device connectivity.  

A device can be connected to an IoT hub directly using a connection string or using DPS. [Azure IoT Hub Device Provisioning service (DPS)](../../iot-dps/about-iot-dps.md) is the route for IoT Central.

## To move the device to Azure IoT Central

To connect a device to IoT Central from the IoT Hub a device needs to be updated with:

* The [Scope ID](../../iot-dps/concepts-service.md) of the IoT Central application.
* A key derived either from the [group SAS](concepts-get-connected.md) key or [the X.509 cert](../../iot-hub/iot-hub-x509ca-overview.md)

To interact with IoT Central, there must be a device template that models the properties/telemetry/commands that the device implements. For more information, see [Get connected to IoT Central](concepts-get-connected.md) and [What are device templates?](concepts-device-templates.md)

## Next steps

If you're a device developer, some suggested next steps are to:

- Review some sample code that shows how to use SAS tokens in [Tutorial: Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md)
- Learn how to [How to connect devices with X.509 certificates using Node.js device SDK for IoT Central Application](how-to-connect-devices-x509.md)
- Learn how to [Monitor device connectivity using Azure CLI](./howto-monitor-devices-azure-cli.md)
- Learn how to [Define a new IoT device type in your Azure IoT Central application](./howto-set-up-template.md)
- Read about [Azure IoT Edge devices and Azure IoT Central](./concepts-iot-edge.md)