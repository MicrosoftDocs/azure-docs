---
title: What is Azure Kinect DK? 
description: Azure Kinect development kit overview
author: joylital
ms.author: joylital
ms.prod: kinect-dk
ms.topic: overview 
ms.date: 04/11/2019
keywords: azure, kinect, overview, dev kit, DK, device, depth, body tracking, speech, cognitive services, SDKs, SDK, firmware
---

# What is Azure Kinect DK?

Azure Kinect DK is a developer kit and PC peripheral with advanced AI sensors that provide sophisticated computer vision and speech models.  Kinect contains a depth sensor, spatial microphone array with a video camera, and orientation sensor as an all in-one small device with multiple modes, options, and SDKs.

## Kinect SDKs

Developers must use the following 3 SDKs are used with Azure Kinect:

* The Sensor SDK  provides for low-level sensor and device access.
* The Body Tracking SDK tracks bodies in 3D.
* The Speech SDK enables microphone access and Azure cloud-based speech services.

In addition, Cognitive Vision services can be used with the device RGB camera.

## Sensor SDK

The Azure Kinect Sensor SDK provides low-level sensor access for Azure Kinect DK hardware sensors and device configuration.

* Visit Download Sensor SDK, to download and install the 1.0 version.
* See Using Sensor SDK, to learn more about the Sensor SDK.
* The Sensor SDK is also available in open source on GitHub.

### Sensor SDK features

The Sensor SDK has the following features that work once installed and run on the Kinect DK:

* One Depth camera with access and mode control. The camera offers both narrow and wide fields-of-view (FOV) depth mode, and passive infrared (IR) modes.
* One RGB camera access and control, including exposure and white balance.
* A motion sensor, such as gyroscope and accelerometer access.
* A synchronized depth-RGB camera that streams with configurable delay between cameras.
* An external device synchronization control with configurable delay offset between devices.
* Camera-frame metadata access for image resolution, timestamp, and temperature recognition.
* Device calibration to allow data access.

### Sensor tools

The following tools are available in the Sensor SDK:

* A viewer tool to monitor device data streams and configure different modes.
* A Sensor recording tool and playback reader API which uses the Matroska container format.
* An Azure Kinect DK firmware update tool.

## Body tracking SDK

The Body Tracking SDK includes a Windows library and runtime to track bodies in 3D when used with the Azure Kinect DK hardware.

### Body tracking features

The following body-tracking features are available on the accompanying SDK:

* Provides body segmentation.
* Contains an anatomically correct skeleton for each partial or full body in FOV.
* Offers a unique identity for each body.
* Can track bodies over time.

### Body tracking tools

* Body Tracker has a viewer tool to track bodies in 3D.

## Speech SDK

The Speech SDK enables Azure-connected speech services.

### Speech Services

* Speech-to-text
* Speech translation
* Text-to-Speech [**Note!**] The Azure Kinect DK does not have speakers.

For additional details and information, visit [Speech Service documentation](https://docs.microsoft.com/azure/cognitive-services/speech-service/).

## Vision services

The following [Azure Cognitive Vision Services](https://azure.microsoft.com/services/cognitive-services/directory/vision/) provide Azure services that can identify and analyze content within images and videos.

### Cognitive services

The following cognitive services are available in the Azure Kinect DK:

* Computer Vision
* Face
* Video indexer
* Content moderator
* Custom vision

Services evolve and improve constantly, so remember to check regularly for new or additional [Cognitive services]( https://azure.microsoft.com/services/cognitive-services/) to improve your application. For an early look on emerging new services, check out the [Cognitive services labs](https://labs.cognitive.microsoft.com/).

## Azure Kinect hardware requirements

The Azure Kinect DK integrates Microsoft's latest sensor technology into single USB connected accessory. See Azure Kinect DK Hardware Specification, for details.

## Next steps

* Set up Azure Kinect DK and verify sensor streaming using Kinect for the Azure Viewer.
* Download the Sensor SDK.
* See Sensor SDK source code and samples in GitHub.
* Learn more about how to Use the Sensor SDK and API documentation download-sdk.
* Get started with the Body Tracking SDK.
* Get started with the Speech SDK.
* Review the Azure Kinect DK Hardware Specification developer kit.
