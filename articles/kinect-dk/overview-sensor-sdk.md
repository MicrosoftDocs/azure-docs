---
title: Azure Kinect Sensor SDK
description: Azure Kinect Sensor SDK
author: joylital
ms.author: joylital
ms.prod: kinect-dk
ms.date: 06/10/2019
ms.topic: overview 
keywords: azure, kinect, rgb, IR, recording, sensor, sdk, access, depth, video, camera, imu, motion, sensor, audio, microphone, matroska, sensor sdk, download
---

# Azure Kinect Sensor SDK

The Azure Kinect Sensor SDK provides low-level sensor access for Azure Kinect DK hardware sensors and device configuration.

## Features

The Kinect Sensor SDK provides the following product and service features:

* Depth camera access and mode control. The camera offers both narrow and wide fields-of-view depth mode, and passive infrared (IR) modes.
* RGB camera with access to both exposure and white balance abilities.
* Motion sensor, such as gyroscope and accelerometer access.
* Synchronized depth-RGB camera that streams with configurable delay between cameras.
* External device synchronization control with configurable delay offset between devices.
* Camera-frame metadata that provides access for image resolution, timestamp, and temperature recognition.
* Device calibration data access.

## Tools

* A [viewer tool](azure-kinect-sensor-viewer.md) to monitor device data streams and configure different modes.
* A sensor [recording tool](azure-kinect-dk-recorder.md) and playback reader API that uses the [Matroska container format](sdk-record-format.md).
* An Azure Kinect DK [firmware update tool](azure-kinect-firmware-tool.md).

## Sensor SDK

* [Download Sensor SDK](sensor-sdk-download.md).
* The Sensor SDK is available in [open source on GitHub](https://github.com/microsoft/Azure-Kinect-Sensor-SDK).
* For more information about usage, see [Sensor SDK API documentation](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/index.html).

## Next steps

Now you learned about Azure Kinect sensor SDK, you can also:
>[!div class="nextstepaction"]
>[Download sensor SDK code](sensor-sdk-download.md)

>[!div class="nextstepaction"]
>[Find and open device](find-then-open-device.md)
