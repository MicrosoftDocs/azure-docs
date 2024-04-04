---
title: Limits and restrictions - Azure IoT Edge | Microsoft Docs 
description: Description of the limits and restrictions when using IoT Edge.
author: raisalitch
ms.author: ralitchf
ms.date: 11/7/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Understand Azure IoT Edge limits and restrictions

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

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

* [Message routing query based on message properties](../iot-hub/iot-hub-devguide-routing-query-syntax.md#query-based-on-message-properties)
* [Message routing query based on message body](../iot-hub/iot-hub-devguide-routing-query-syntax.md#query-based-on-message-body)

Not supported query syntax:

* [Message routing query based on device twin](../iot-hub/iot-hub-devguide-routing-query-syntax.md#query-based-on-device-or-module-twin)

### Restart policies

Don't use `on-unhealthy` or `on-failure` as values in modules' `restartPolicy` because they are unimplemented and won't initiate a restart. Only `never` and `always` restart policies are implemented.

The recommended way to automatically restart unhealthy IoT Edge modules is noted in [this workaround](https://github.com/Azure/iotedge/issues/6358#issuecomment-1144022920). Configure the `Healthcheck` property in the module's `createOptions` to handle a failed health check.

### Troubleshooting logs

Accessing module logs from Azure portal could be delayed while modules are being updated. 

If you view the **Troubleshoot** tab from your device in IoT Edge in the Azure portal, you may see the message "Unable to retrieve logs. The request failed with status code 504." The request times out and the **Runtime Status** might show as "Error" for all modules. 

This ability to see the logs will resume in time. The reason the access is delayed is because **edgeAgent** may be busy starting modules so it can't simultaneously retrieve logs. Logs are pulled from Moby/Docker, so this process takes time, and the request can time out if **edgeAgent** is busy.

### File upload

IoT Hub only supports file upload APIs for device identities, not module identities. Since IoT Edge exclusively uses modules, file upload isn't natively supported in IoT Edge.

For more information on uploading files with IoT Hub, see [Upload files with IoT Hub](../iot-hub/iot-hub-devguide-file-upload.md).

### Edge agent environment variables

Changes made in `config.toml` to `edgeAgent` environment variables like the `hostname` aren't applied to `edgeAgent` if the container already existed. To apply these changes, remove the `edgeAgent` container using the command  `sudo docker rm -f edgeAgent`. The IoT Edge daemon recreates the container and starts edgeAgent in about a minute.

### NTLM Authentication

NTLM authentication is not supported. Proxies configured with NTLM authentication won't work.

IoT Edge has limited support for proxy authentication. Proxies configured for username and password authentication only are supported.

## Next steps

For more information, see [IoT Hub other limits](../iot-hub/iot-hub-devguide-quotas-throttling.md#other-limits).
