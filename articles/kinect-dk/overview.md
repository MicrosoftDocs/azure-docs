---
title: Azure Kinect Sensor SDK overview
description: Azure Kinect Sensor SDK overview
author: joylital
ms.author: joylital
ms.date: 12/2/2018
keywords: kinect, azure, overview, sensors, low level
---

# Azure Kinect Sensor SDK

Azure Kinect Sensor SDK provides low level sensor access for Azure Kinect DK hardware sensors and device configuration.

## Supported functionality
- Depth camera access
- RGB camera access and control (e.g. exposure and white balance)
- Motion sensor (gyroscope and accelerometer) access
- Synchronized Depth-RGB camera streaming with configurable delay between cameras
- External device synchronization control with configurable delay offset between devices
- Camera frame meta-data access for image resolution, timestamp and temperature
- Device calibration data access 

## Tools
- Viewer tool for checking device data streams and configuring different modes
- Sensor recording tool and playback reader API using Matroska container format
- Azure Kinect DK firmware update tool

For more details and code see https://github.com/microsoft/azure-kinect-sensor-sdk

Microphone array is standard USB Audio Class device and can be accessed through Windows API or through devices [Speech Services SDK](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/)

## Related SDK or Azure Cognitive Services

- Body Tracking SDK (***under development***) provides articulated skeletal tracking functionality on top of Sensor SDK.
- [Speech Services SDK](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/) enabled Azure connected speech services (e.g. speech-to-text and translation)
- [Azure Vision Services ](https://azure.microsoft.com/en-us/services/cognitive-services/directory/vision/") provide several useful services to enhance your application capabilities (e.g. face detection and activity detection )


## Next steps

- [Setup Azure Kinect DK](set-up-hardware.md) and verify sensor streaming using Kinect for Azure Viewer
- [Download Sensor SDK](download-sdk.md)
- [See source code and samples in GitHub](https://github.com/microsoft/azure-kinect-sensor-sdk)
- Learn more about [using Sensor SDK](sensor-sdk.md) and [API documentation](download-sdk.md)
