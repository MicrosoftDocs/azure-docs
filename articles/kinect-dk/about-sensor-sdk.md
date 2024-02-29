---
title: About Azure Kinect Sensor SDK
description: Overview of the Azure Kinect Sensor software development kit (SDK), its features, and tools.
author: tesych
ms.author: tesych
ms.service: azure-kinect-developer-kit
ms.date: 06/26/2019
ms.topic: article 
keywords: azure, kinect, rgb, IR, recording, sensor, sdk, access, depth, video, camera, imu, motion, sensor, audio, microphone, matroska, sensor sdk, download
---

# About Azure Kinect Sensor SDK

This article provides an overview of the Azure Kinect Sensor software development kit (SDK), its features, and tools.

## Features

The Azure Kinect Sensor SDK provides cross-platform low-level access for Azure Kinect device configuration and hardware sensors streams, including:

- Depth camera access and mode control (a passive IR mode, plus wide and narrow field-of-view depth modes) 
- RGB camera access and control (for example, exposure and white balance) 
- Motion sensor (gyroscope and accelerometer) access 
- Synchronized Depth-RGB camera streaming with configurable delay between cameras 
- External device synchronization control with configurable delay offset between devices 
- Camera frame meta-data access for image resolution, timestamp, etc. 
- Device calibration data access 

## Tools

- An [Azure Kinect viewer](azure-kinect-viewer.md) to monitor device data streams and configure different modes.
- An [Azure Kinect recorder](azure-kinect-recorder.md) and playback reader API that uses the [Matroska container format](record-file-format.md).
- An Azure Kinect DK [firmware update tool](azure-kinect-firmware-tool.md).

## Sensor SDK

- [Download Sensor SDK](sensor-sdk-download.md).
- The Sensor SDK is available in [open source on GitHub](https://github.com/microsoft/Azure-Kinect-Sensor-SDK).
- For more information about usage, see [Sensor SDK API documentation](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/index.html).

## Next steps

Now you learned about Azure Kinect sensor SDK, you can also:
>[!div class="nextstepaction"]
>[Download sensor SDK code](sensor-sdk-download.md)

>[!div class="nextstepaction"]
>[Find and open device](find-then-open-device.md)
