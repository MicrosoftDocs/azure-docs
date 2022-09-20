---
title: How to transfer a payload between device and Azure Device Provisioning Service
description: This document describes how to transfer a payload between device and Device Provisioning Service (DPS)
author: kgremban
ms.author: kgremban
ms.date: 12/03/2021
ms.topic: conceptual
ms.service: iot-dps
services: iot-dps
---

# How to transfer payloads between devices and DPS

Sometimes DPS needs more data from devices to properly provision them to the right IoT Hub, and that data needs to be provided by the device. Vice versa, DPS can return data to the device to facilitate client-side logic.

## When to use it

This feature can be used as an enhancement for [custom allocation](./how-to-use-custom-allocation-policies.md). For example, you want to allocate your devices based on the device model without human intervention. In this case, you can configure the device to report its model information as part of the [register device call](/rest/api/iot-dps/device/runtime-registration/register-device). DPS will pass the device’s payload to the custom allocation webhook. Then your function can decide which IoT hub the device will be provisioned to based on the device model information. If needed, the webhook can return data back to the device as a JSON object in the webhook response.  

## Device sends data payload to DPS

When your device is sending a [register device call](/rest/api/iot-dps/device/runtime-registration/register-device) to DPS, The register call can be enhanced to take other fields in the body. The body looks like the following:

```json
{ 
    "registrationId": "mydevice", 
    "tpm": { 
        "endorsementKey": "stuff", 
        "storageRootKey": "things" 
    }, 
    "payload": { A JSON object that contains your additional data } 
} 
```

## DPS returns data to the device

If the custom allocation policy webhook wishes to return some data to the device, it will pass the data back as a JSON object in the webhook response. The change is in the payload section below.

```json
{ 
    "iotHubHostName": "sample-iot-hub-1.azure-devices.net", 
    "initialTwin": { 
        "tags": { 
            "tag1": true 
        }, 
        "properties": { 
            "desired": { 
                "prop1": true 
            } 
        } 
    }, 
    "payload": { A JSON object that contains the data returned by the webhook } 
} 
```

## SDK support

This feature is available in C, C#, JAVA and Node.js client SDKs. To learn more about the Azure IoT SDKs available for IoT Hub and the IoT Hub Device Provisioning service, see [Microsoft Azure IoT SDKs]( https://github.com/Azure/azure-iot-sdks).

[IoT Plug and Play (PnP)](../iot-develop/overview-iot-plug-and-play.md) devices use the payload to send their model ID when they register with DPS. You can find examples of this usage in the PnP samples in the SDK or sample repositories. For example, [C# PnP thermostat](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/iothub/device/samples/solutions/PnpDeviceSamples/Thermostat/Program.cs) or [Node.js PnP temperature controller](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/javascript/pnp_temperature_controller.js).

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

The payload file (in this case `/home/aziot/payload/json`) can contain any valid JSON such as:


```json
{
    "modelId": "dtmi:com:example:edgedevice;1"
}
```

## Next steps

* To learn how to provision devices using a custom allocation policy, see [How to use custom allocation policies](./how-to-use-custom-allocation-policies.md)
