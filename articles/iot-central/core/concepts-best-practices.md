---
title: Device development best practices in Azure IoT Central | Microsoft Docs
description: This article outlines best practices for device connectivity in Azure IoT Central
author: dominicbetts
ms.author: dobett
ms.date: 03/03/2021
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom:  [device-developer]

---

# Best practices for device development

*This article applies to device developers.*

These recommendations show how to implement devices to take advantage of the built-in disaster recovery and automatic scaling in IoT Central.

The following list shows the high-level flow when a device connects to IoT Central:

1. Use DPS to provision the device and get a device connection string.

1. Use the connection string to connect IoT Central's internal IoT Hub endpoint. Send data to and receive data from your IoT Central application.

1. If the device gets connection failures, then depending on the error type, either retry the connection or reprovision the device.

## Use DPS to provision the device

To provision a device with DPS, use the scope ID, credentials, and device ID from your IoT Central application. To learn more about the credential types, see [X.509 group enrollment](concepts-get-connected.md#x509-group-enrollment) and [SAS group enrollment](concepts-get-connected.md#sas-group-enrollment). To learn more about device IDs, see [Device registration](concepts-get-connected.md#device-registration).

On success, DPS returns a connection string the device can use to connect to your IoT Central application. To troubleshoot provisioning errors, see [Check the provisioning status of your device](troubleshoot-connection.md#check-the-provisioning-status-of-your-device).

The device can cache the connection string to use for later connections. However, the device must be prepared to [handle connection failures](#handle-connection-failures).

## Connect to IoT Central

Use the connection string to connect IoT Central's internal IoT Hub endpoint. The connection lets you send telemetry to your IoT Central application, synchronize property values with your IoT Central application, and respond to commands sent by your IoT Central application.

## Handle connection failures

For scaling or disaster recovery purposes, IoT Central may update its underlying IoT hub. To maintain connectivity, your device code should handle specific connection errors by establishing a connection to the new IoT Hub endpoint.

If the device gets any of the following errors when it connects, it should redo the provisioning step with DPS to get a new connection string. These errors mean the connection string the device is using is no longer valid:

- Unreachable IoT Hub endpoint.
- Expired security token.
- Device disabled in IoT Hub.

If the device gets any of the following errors when it connects, it should use a back-off strategy to retry the connection. These errors mean the connection string the device is using is still valid, but transient conditions are stopping the device from connecting:

- Operator blocked device.
- Internal error 500 from the service.

To learn more about device error codes, see [Troubleshooting device connections](troubleshoot-connection.md).

## Next steps

If you're a device developer, some suggested next steps are to:

- Review some sample code that shows how to use SAS tokens in [Tutorial: Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md)
- Learn how to [How to connect devices with X.509 certificates using Node.js device SDK for IoT Central Application](how-to-connect-devices-x509.md)
- Learn how to [Monitor device connectivity using Azure CLI](./howto-monitor-devices-azure-cli.md)
- Learn how to [Define a new IoT device type in your Azure IoT Central application](./howto-set-up-template.md)
- Read about [Azure IoT Edge devices and Azure IoT Central](./concepts-iot-edge.md)
