---
title: About Azure Kinect DK
description: Azure Kinect development kit overview
author: tesych
ms.author: tesych
ms.prod: kinect-dk
ms.topic: overview 
ms.date: 04/11/2019
keywords: azure, kinect, overview, dev kit, DK, device, depth, body tracking, speech, cognitive services, SDKs, SDK, firmware
---

# What is Azure Kinect DK?

Azure Kinect DK is a developer kit and PC peripheral with advanced AI sensors that provide sophisticated computer vision and speech models.  Kinect contains a depth sensor, spatial microphone array with a video camera, and orientation sensor as an all in-one small device with multiple modes, options, and SDKs.

The Azure Kinect development environment consists of the following multiple SDKs:

* Sensor SDK for low-level sensor and device access.
* Body Tracking SDK for tracking bodies in 3D.
* Speech SDK for enabling microphone access and Azure cloud-based speech services.

In addition, Cognitive Vision services can be used with the device RGB camera.

   ![Azure Kinect SDK diagram](./media/quickstarts/sdk-diagram.jpg)

## Azure Kinect sensor SDK

The Azure Kinect Sensor SDK provides low-level sensor access for Azure Kinect DK hardware sensors and device configuration.

To learn more about Azure Kinect Sensor SDK, see [Using Sensor SDK](overview-sensor-sdk.md).

### Azure Kinect sensor SDK features

The Sensor SDK has the following features that work once installed and run on the Kinect DK:

* One Depth camera with access and mode control. The camera offers both narrow and wide fields-of-view (FOV) depth mode, and passive infrared (IR) modes.
* One RGB camera access and control, including exposure and white balance.
* A motion sensor, such as gyroscope and accelerometer access.
* A synchronized depth-RGB camera that streams with configurable delay between cameras.
* An external device synchronization control with configurable delay offset between devices.
* Camera-frame metadata access for image resolution, timestamp, and temperature recognition.
* Device calibration to allow data access.

### Azure Kinect sensor SDK tools

The following tools are available in the Sensor SDK:

* A viewer tool to monitor device data streams and configure different modes.
* A Sensor recording tool and playback reader API that uses the Matroska container format.
* An Azure Kinect DK firmware update tool.

## Azure Kinect body tracking SDK

The Body Tracking SDK includes a Windows library and runtime to track bodies in 3D when used with the Azure Kinect DK hardware.

### Azure Kinect body tracking features

The following body-tracking features are available on the accompanying SDK:

* Provides body segmentation.
* Contains an anatomically correct skeleton for each partial or full body in FOV.
* Offers a unique identity for each body.
* Can track bodies over time.

### Azure Kinect body tracking tools

* Body Tracker has a viewer tool to track bodies in 3D.

## Azure Kinect speech SDK

The Speech SDK enables Azure-connected speech services.

### Speech services

* Speech-to-text
* Speech translation
* Text-to-Speech

>[!NOTE]
>The Azure Kinect DK does not have speakers.

For additional details and information, visit [Speech Service documentation](https://docs.microsoft.com/azure/cognitive-services/speech-service/).

## Vision services

The following [Azure Cognitive Vision Services](https://azure.microsoft.com/services/cognitive-services/directory/vision/) provide Azure services that can identify and analyze content within images and videos.

* [Computer vision](https://azure.microsoft.com/services/cognitive-services/computer-vision/)
* [Face](https://azure.microsoft.com/services/cognitive-services/face/)
* [Video indexer](https://azure.microsoft.com/services/media-services/video-indexer/)
* [Content moderator](https://azure.microsoft.com/services/cognitive-services/content-moderator/)
* [Custom vision](https://azure.microsoft.com/services/cognitive-services/custom-vision-service/)

Services evolve and improve constantly, so remember to check regularly for new or additional [Cognitive services](https://azure.microsoft.com/services/cognitive-services/) to improve your application. For an early look on emerging new services, check out the [Cognitive services labs](https://labs.cognitive.microsoft.com/).

## Azure Kinect hardware requirements

The Azure Kinect DK integrates Microsoft's latest sensor technology into single USB connected accessory. For more information, see [Azure Kinect DK Hardware Specification](hardware-specification.md).

## Next steps

You now have an overview of Azure Kinect DK. The next step is to dive in and set it up!

> [!div class="nextstepaction"]
>[Using Azure Kinect sensor SDK](overview-sensor-sdk.md)

> [!div class="nextstepaction"]
>[Review the Azure Kinect DK Hardware Specification](hardware-specification.md)
