---
title: How to transfer a payload between devices and DPS
titleSuffix: Azure IoT Hub Device Provisioning Service
description: This document describes how to transfer a payload between device and Device Provisioning Service (DPS)
author: kgremban

ms.author: kgremban
ms.date: 09/21/2022
ms.topic: how-to
ms.service: iot-dps
---

# How to transfer payloads between devices and DPS

Devices that register with DPS are required to provide a registration ID and valid credentials (keys or X.509 certificates) when they register. However, there may be IoT solutions or scenarios in which additional data is needed from the device. For example, a custom allocation policy webhook may use information like a device model number to select an IoT hub to provision the device to. Likewise, a device may require additional data in the registration response to facilitate its client-side logic. DPS provides the capability for devices to both send and receive an optional payload when they register.

## When to use it

Common scenarios for sending optional payloads are:

* [Custom allocation policies](concepts-custom-allocation.md) can use the device payload to help select an IoT hub for a device or set its initial twin. For example, you may want to allocate your devices based on the device model. In this case, you can configure the device to report its model information when it registers. DPS will pass the device’s payload to the custom allocation webhook. Then your webhook can decide which IoT hub the device will be provisioned to based on the device model information. If needed, the webhook can also return data back to the device as a JSON object in the webhook response. To learn more, see [Use device payloads in custom allocation](concepts-custom-allocation.md#use-device-payloads-in-custom-allocation).

* [IoT Plug and Play (PnP)](../iot-develop/overview-iot-plug-and-play.md) devices *may* use the payload to send their model ID when they register with DPS. You can find examples of this usage in the PnP samples in the SDK or sample repositories. For example, [C# PnP thermostat](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/iothub/device/samples/solutions/PnpDeviceSamples/Thermostat/Program.cs) or [Node.js PnP temperature controller](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/javascript/pnp_temperature_controller.js).

* [IoT Central](../iot-central/core/overview-iot-central.md) devices that connect through DPS *should* follow [IoT Plug and Play conventions](..//iot-develop/concepts-convention.md) and send their model ID when they register. IoT Central uses the model ID to assign the device to the correct device template. To learn more, see [Device implementation and best practices for IoT Central](../iot-central/core/concepts-device-implementation.md).  

## Device sends data payload to DPS

When your device calls [Register Device](/rest/api/iot-dps/device/runtime-registration/register-device) to register with DPS, it can include additional data in the **payload** property. For example, the following JSON shows the body for a request to register using TPM attestation:

```json
{ 
    "registrationId": "mydevice", 
    "tpm": { 
        "endorsementKey": "xxxx-device-endorsement-key-xxxx", 
        "storageRootKey": "xxx-device-storage-root-key-xxxx" 
    }, 
    "payload": { A JSON object that contains your additional data } 
} 
```

The **payload** property must be a JSON object and can contain any data relevant to your IoT solution or scenario.

## DPS returns data to the device

DPS can return data back to the device in the registration response. Currently, this feature is exclusively used in custom allocation scenarios. If the custom allocation policy webhook needs to return data to the device, it can pass the data back as a JSON object in the webhook response. DPS will then pass that data back in the **registrationState.payload** property in the [Register Device response](/rest/api/iot-dps/device/runtime-registration/register-device#registrationoperationstatus). For example, the following JSON shows the body of a successful response to register using TPM attestation.

```json
{
   "operationId":"5.316aac5bdc130deb.b1e02da8-xxxx-xxxx-xxxx-7ea7a6b7f550",
   "status":"assigned",
   "registrationState":{
      "registrationId":"my-tpm-device",
      "createdDateTimeUtc":"2022-08-31T22:02:50.5163352Z",
      "assignedHub":"sample-iot-hub-1.azure-devices.net",
      "deviceId":"my-tpm-device",
      "status":"assigned",
      "substatus":"initialAssignment",
      "lastUpdatedDateTimeUtc":"2022-08-31T22:02:50.7370676Z",
      "etag":"xxxx-etag-value-xxxx",
      "tpm": {"authenticationKey": "xxxx-encrypted-authentication-key-xxxxx"},
      "payload": { A JSON object that contains the data returned by the webhook }
   }
}
```

The **payload** property must be a JSON object and can contain any data relevant to your IoT solution or scenario.

## SDK support

This feature is available in C, C#, JAVA and Node.js client SDKs. To learn more about the Azure IoT SDKs available for IoT Hub and IoT Hub Device Provisioning service, see [Microsoft Azure IoT SDKs]( https://github.com/Azure/azure-iot-sdks).

## IoT Edge support

Starting with version 1.4, IoT Edge supports sending a data payload contained in a JSON file. The payload file is read and sent to DPS when the device is (re)registered which typically happens when you run `iotedge config apply` for the first time. You can also force it to be re-read and registered by using the CLI's reprovision command `iotedge system reprovision`.

Below is an example snippet from `/etc/aziot/config.toml` where the `payload` property is set to the path of a local JSON file.

```toml
   [provisioning]
   source = "dps"
   global_endpoint = "https://global.azure-devices-provisioning.net"
   id_scope = "0ab1234C5D6"

   # Uncomment to send a custom payload during DPS registration
   payload = { uri = "file:///home/aziot/payload.json" }
 
```

The payload file (in this case `/home/aziot/payload.json`) can contain any valid JSON such as:


```json
{
    "modelId": "dtmi:com:example:edgedevice;1"
}
```

## Next steps

* For an overview of custom allocation policies, see [Understand custom allocation policies](./concepts-custom-allocation.md)

* To learn how to provision devices using a custom allocation policy, see [Use custom allocation policies](./tutorial-custom-allocation-policies.md)
