---
title: How to configure a Microphone Array - Speech Service
titleSuffix: Azure Cognitive Services
description: Learn how to configure a Microphone Array so that the Speech Devices SDK can use it.
services: cognitive-services
author: mswellsi
manager: yanbo
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/01/2020
ms.author: wellsi
---

# How to configure a Microphone Array

In this article, you learn how to configure a [microphone array](https://aka.ms/sdsdk-microphone). It includes setting the working angle, and how to select which microphone is used for the Speech Devices SDK.

The Speech Devices SDK works best with a microphone array that has been designed according to [our guidelines](https://aka.ms/sdsdk-microphone). The microphone array configuration can be provided by the Operating System or supplied through one of the following methods.

The Speech Devices SDK initially supported microphone arrays by selecting from a fixed set of configurations.

```java
private static String DeviceGeometry = "Circular6+1"; // "Circular6+1", "Linear4",
private static String SelectedGeometry = "Circular6+1"; // "Circular6+1", "Circular3+1", "Linear4", "Linear2"
```

On Windows, the microphone array configuration is supplied by the audio driver.

From v1.11.0, the Speech Devices SDK also supports configuration from a [JSON file](https://aka.ms/sdsdk-micarray-json).


## Windows
On Windows, the microphone array geometry information is automatically obtained from the audio driver. So, the properties `DeviceGeometry`,  `SelectedGeometry`, and `MicArrayGeometryConfigFile` are optional. We use the [JSON file](https://aka.ms/sdsdk-micarray-json) provided using `MicArrayGeometryConfigFile` for only getting the beamforming range.

If a microphone array is specified using `AudioConfig::FromMicrophoneInput`, then we use the specified microphone. If a microphone is not specified or `AudioConfig::FromDefaultMicrophoneInput` is called, then we use the default microphone, which is specified in Sound settings on Windows.
The Microsoft Audio Stack in the Speech Devices SDK only supports down sampling for sample rates that are integral multiples of 16 KHz.

## Linux
On Linux, the microphone geometry information must be provided. The use of `DeviceGeometry` and `SelectedGeometry` remains supported. It can also be provided via the JSON file using the `MicArrayGeometryConfigFile` property. Similar to Windows, the beamforming range can be provided by the JSON file.

If a microphone array is specified using `AudioConfig::FromMicrophoneInput`, then we use the specified microphone. If a microphone is not specified or `AudioConfig::FromDefaultMicrophoneInput` is called, then we record from ALSA device named *default*. By default, *default* always points to card 0 device 0, but users can change it in the `asound.conf` file. 

The Microsoft Audio Stack in the Speech Devices SDK only supports downsampling for sample rates that are integral multiples of 16 KHz. Additionally the following formats are supported: 32-bit IEEE little endian float, 32-bit little endian signed int, 24-bit little endian signed int, 16-bit little endian signed int, and 8-bit signed int.

## Android
Currently only [Roobo v1](speech-devices-sdk-android-quickstart.md) is supported by the Speech Devices SDK. Behavior is same as previous releases, except now `MicArrayGeometryConfigFile` property can be used to specify JSON file containing beamforming range.

## Microphone Array Configuration JSON

The JSON file for microphone array geometry configuration will follow the [JSON schema](https://aka.ms/sdsdk-micarray-json). Following are some examples that follow the schema.


```json
{
    "micArrayType": "Linear",
    "geometry": "Linear4"
}
```


Or


```json
{
    "micArrayType": "Planar",
    "horizontalAngleBegin": 0,
    "horizontalAngleEnd": 360,
    "numberOfMicrophones": 4,
    "micCoord": [
        {
            "xCoord": 0,
            "yCoord": 0,
            "zCoord": 0
        },
        {
            "xCoord": 40,
            "yCoord": 0,
            "zCoord": 0
        },
        {
            "xCoord": -20,
            "yCoord": -35,
            "zCoord": 0
        },
        {
            "xCoord": -20,
            "yCoord": 35,
            "zCoord": 0
        }
    ]
}
```

Or

```json
{
    "micArrayType": "Linear",
    "horizontalAngleBegin": 70,
    "horizontalAngleEnd": 110
}
```


## Next steps

> [!div class="nextstepaction"]
> [Choose your speech device](get-speech-devices-sdk.md)
