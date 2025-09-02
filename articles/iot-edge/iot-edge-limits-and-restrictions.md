---
title: Azure IoT Edge limits and restrictions
description: Understand the limits and restrictions when using Azure IoT Edge
author: sethmanheim
ms.author: sethm
ms.date: 07/11/2025
ms.topic: concept-article
ms.service: azure-iot-edge
services: iot-edge
---

# Understand Azure IoT Edge limits and restrictions

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

This article explains the limits and restrictions when you use IoT Edge.

## Limits

### Number of children in gateway hierarchy

Each IoT Edge parent device in a gateway hierarchy can have up to 100 connected child devices by default.

Each IoT Edge device in a nested topology opens a separate logical connection to the parent EdgeHub (or IoT Hub) for each connected client (device or module), plus one connection for itself. Connections at each layer aren't aggregated, but added.

For example, if there are two IoT Edge child devices in layer L4, and each has 100 clients, the parent IoT Edge device in layer L5 has 202 total incoming connections from L4.

You can change this limit by setting the **MaxConnectedClients** environment variable in the parent device's edgeHub module. IoT Edge can have issues reporting its state in the twin reported properties if the number of clients exceeds a few hundred because of the IoT Hub twin size limit. Be careful when increasing the limit by changing this environment variable.

For more information, see [Create a gateway hierarchy](how-to-connect-downstream-iot-edge-device.md#create-a-gateway-hierarchy).

### Size of desired properties

IoT Hub enforces these restrictions:

* 8 KB size limit on the value of tags.
* 32 KB size limit on both the value of `properties/desired` and `properties/reported`.

For more information, see [Module twin size](../iot-hub/iot-hub-devguide-module-twins.md#module-twin-size).

### Number of nested hierarchy layers

An IoT Edge device supports up to five layers of IoT Edge devices linked as children below it.

For more information, see [Parent and child relationships](iot-edge-as-gateway.md#cloud-identities).

### Number of modules in a deployment

IoT Hub has these restrictions for IoT Edge automatic deployments:

* 50 modules per deployment
  * This limit is superseded by the IoT Hub 32 KB module twin size limit. For more information, see [Be mindful of twin size limits when using custom modules](production-checklist.md#be-mindful-of-twin-size-limits-when-using-custom-modules).
* 100 deployments (including layered deployments per paid SKU hub)
* 10 deployments per free SKU hub

## Restrictions

### Certificates

IoT Edge certificates have the following restrictions:

* The common name (CN) can't be the same as the *hostname* that is used in the configuration file on the IoT Edge device.
* The name used by clients to connect to IoT Edge can't be the same as the common name used in the Edge CA certificate.

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

Accessing module logs from Azure portal can be delayed while modules are updated.

If you view the **Troubleshoot** tab from your device in IoT Edge in the Azure portal, you might see the message "Unable to retrieve logs. The request failed with status code 504." The request times out, and the **Runtime Status** can show as "Error" for all modules.

You can see the logs again after some time. Access is delayed because **edgeAgent** can be busy starting modules, so it can't retrieve logs at the same time. Logs are pulled from Moby or Docker, so this process takes time, and the request can time out if **edgeAgent** is busy.

### File upload

IoT Hub only supports file upload APIs for device identities, not module identities. Since IoT Edge exclusively uses modules, file upload isn't natively supported in IoT Edge.

For more information on uploading files with IoT Hub, see [Upload files with IoT Hub](../iot-hub/iot-hub-devguide-file-upload.md).

### Edge agent environment variables

Changes you make in `config.toml` to `edgeAgent` environment variables like the `hostname` aren't applied to `edgeAgent` if the container already exists. To apply these changes, remove the `edgeAgent` container by running `sudo docker rm -f edgeAgent`. The IoT Edge daemon recreates the container and starts edgeAgent in about a minute.

### NTLM Authentication

NTLM authentication isn't supported. Proxies configured with NTLM authentication don't work.

IoT Edge has limited support for proxy authentication. Only proxies configured for username and password authentication are supported.

## Next steps

For more information, see [IoT Hub other limits](../iot-hub/iot-hub-devguide-quotas-throttling.md#other-limits).
