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

[IoT Plug and Play (PnP)](../iot-develop/overview-iot-plug-and-play.md) devices use the payload to send their model ID when they register with DPS. You can find examples of this usage in the PnP samples in the SDK or sample repositories. For example, [C# PnP thermostat](https://github.com/Azure-Samples/azure-iot-samples-csharp/blob/main/iot-hub/Samples/device/PnpDeviceSamples/Thermostat/Program.cs) or [Node.js PnP temperature controller](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/javascript/pnp_temperature_controller.js).

## Next steps

* To learn how to provision devices using a custom allocation policy, see [How to use custom allocation policies](./how-to-use-custom-allocation-policies.md)