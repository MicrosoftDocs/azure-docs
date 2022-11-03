---
title: Limits and restrictions - Azure IoT Edge | Microsoft Docs 
description: Description of the limits and restrictions when using IoT Edge.
author: raisalitch
ms.author: ralitchf
ms.date: 09/01/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Understand Azure IoT Edge limits and restrictions

[!INCLUDE [iot-edge-version-1.1-or-1.4](./includes/iot-edge-version-1.1-or-1.4.md)]

This article explains the limits and restrictions when using IoT Edge.

## Limits

### Number of children in gateway hierarchy

Each IoT Edge parent device in gateway hierarchies can have up to 100 connected child devices by default.

However, it's important to know that each IoT Edge device in a nested topology must open a separate logical connection to the parent EdgeHub (or IoT Hub) on behalf of each connected client (device or module), plus one connection for itself. So the connections at each layer are not aggregated, but added.

For example, if there are 2 IoT Edge child devices in one layer L4, each in turn has 100 clients, then the parent IoT Edge device in the layer above L5 would have 202 total incoming connections from L4.

This limit can be changed by setting the **MaxConnectedClients** environment variable in the parent device's edgeHub module. But IoT Edge can run into issues with reporting its state in the twin reported properties if the number of clients exceeds a few hundred because of the IoT Hub twin size limit. In general, be careful when increasing the limit by changing this environment variable.

For more information, see [Create a gateway hierarchy](how-to-connect-downstream-iot-edge-device.md#create-a-gateway-hierarchy).

### Size of desired properties

IoT Hub enforces the following restrictions:

* An 8-kb size limit on the value of tags.
* A 32-kb size limit on both the value of `properties/desired` and `properties/reported`.

For more information, see [Module twin size](../iot-hub/iot-hub-devguide-module-twins.md#module-twin-size).

### Number of nested hierarchy layers

An IoT Edge device has a limit of five layers of IoT Edge devices linked as children below it.

For more information, see [Parent and child relationships](iot-edge-as-gateway.md#cloud-identities).

### Number of modules in a deployment

IoT Hub has the following restrictions for IoT Edge automatic deployments:

* 50 modules per deployment
  * This limit is superseded by the IoT Hub 32-kb module twin size limit. For more information, see [Be mindful of twin size limits when using custom modules](production-checklist.md#be-mindful-of-twin-size-limits-when-using-custom-modules).
* 100 deployments (including layered deployments per paid SKU hub)
* 10 deployments per free SKU hub

## Restrictions

### Certificates

IoT Edge certificates have the following restrictions:

* The common name (CN) can't be the same as the "hostname" that will be used in the configuration file on the IoT Edge device.
* The name used by clients to connect to IoT Edge can't be the same as the common name used in the edge CA certificate.

For more information, see [Certificates for device security](iot-edge-certs.md).

### TPM attestation

When using TPM attestation with the device provisioning service, you need to use TPM 2.0.

For more information, see [TPM attestation device requirements](how-to-provision-devices-at-scale-linux-tpm.md#device-requirements).

### Routing syntax

IoT Edge and IoT Hub routing syntax is almost identical.
Supported query syntax:

* [Message routing query based on message properties](../iot-hub/iot-hub-devguide-routing-query-syntax.md#message-routing-query-based-on-message-properties)
* [Message routing query based on message body](../iot-hub/iot-hub-devguide-routing-query-syntax.md#message-routing-query-based-on-message-body)

Not supported query syntax:

* [Message routing query based on device twin](../iot-hub/iot-hub-devguide-routing-query-syntax.md#message-routing-query-based-on-device-twin)

### Restart policies

 Don't use `on-unhealthy` or `on-failure` as values in modules' `restartPolicy` because they are unimplemented and won't initiate a restart. Only `never` and `always` restart policies are implemented.

The recommended way to automatically restart unhealthy IoT Edge modules is noted in [this workaround](https://github.com/Azure/iotedge/issues/6358#issuecomment-1144022920). Configure the `Healthcheck` property in the module's `createOptions` to handle a failed health check.

### File upload

IoT Hub only supports file upload APIs for device identities, not module identities. Since IoT Edge exclusively uses modules, file upload isn't natively supported in IoT Edge.

For more information on uploading files with IoT Hub, see [Upload files with IoT Hub](../iot-hub/iot-hub-devguide-file-upload.md).

### Edge agent environment variables

Changes made in `config.toml` to `edgeAgent` environment variables like the `hostname` aren't applied to `edgeAgent` if the container already existed. To apply these changes, remove the `edgeAgent` container using the command  `sudo docker rm -f edgeAgent`. The IoT Edge daemon recreates the container and starts edgeAgent in about a minute.

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

### AMQP transport

When using Node.js to send device to cloud messages with the AMQP protocol to an IoT Edge runtime, messages stop sending after 2047 messages. No error is thrown and the messages eventually start sending again, then cycle repeats. If the client connects directly to Azure IoT Hub, there's no issue with sending messages. This issue has been fixed in IoT Edge 1.2 and later.

:::moniker-end
<!-- end 1.1 -->

## Next steps

For more information, see [IoT Hub other limits](../iot-hub/iot-hub-devguide-quotas-throttling.md#other-limits).
