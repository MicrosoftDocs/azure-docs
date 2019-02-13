---
title: Install latest tools and device firmware
description: Homepage for getting the pointers to latest tools and device firmware
author: joylital    
ms.author: joylital
ms.date: 10/03/2018
ms.topic: article
keywords: tools, visual studio, firmware, update, latest, available, install
---


# Get Latest Software

Get the tools to developer for Azure Kinect.

>[!TIP]
>Bookmark this page and check it regularly to keep up-to-date on the most recent version of each tool recommended Azure Kinect development.

## Sensor SDK
Download SDK: [Download](download-sdk.md)

Source code repository [here](https://microsoft.visualstudio.com/DefaultCollection/Analog/_git/analog.ai.depthcamera)

Check out especially the SDK\examples folder to get started with your own application!

Release notes: [Here](sdk-release-notes.md)

>[!IMPORTANT]
>By downloading the Sensor SDK on this page, you acknowledge Depth Engine license. See [Depth Engine License](sdk-depthengine-license.md) agreement.

## Visual Studio

For contributing into SDK or building SDK, get [Visual Studio 2017 w/ updates or later](https://developer.microsoft.com/en-us/windows/downloads) 

## Device firmware

We recommend updating to latest firmware before starting any project to take benefit of latest features and bug fixes.
- Latest firmware: Eden_Composite_TestCert_Release_TestSigned_1023_1.2.19_1.2.23_0.3.1_4005.103_5006.27.bin (released 10/23/2018)
- Instruction to [update Azure Kinect DK firmware](AzureKinect-FW-Update.md)

## K4A Sensor SDK supported features and plan forward

Kinect for Azure Sensor SDK is currently under active development, this page provides information about currently supported features as what is in plan.

Currently only Windows is supported, Linux support is in progress.

### Currently available features (v0.2.0)
* Depth camera access 
* RGB camera access
* Depth-RGB correlated API support
* RGB camera exposure control
* IMU access
* Device calibration blob access
* Coordinate space helpers (Project 3D to 2D, Unproject 2D to 3D, Extrinsic transformation (3D to 3D)
* Frame meta-data for Depth and RGB device timestamp, laser temperature
* Kinect for Azure Viewer
* Samples (streaming, enumeration,..)
* Recording tool (Depth and RGB streams)

### Next release (v-Next. ETA 12/3/2018)
* RGB camera controls (additional control e.g. white balance control)
* Recorder support for IMU stream
* Camera streaming indicator LED support
* External sync operation configuration and settings
* Point cloud support in viewer
* RGB to Depth mapping

### Under development
* Linux support
* Depth-RGB synchronized frame API change to provide frames only when both are available
* API improvements to reduce coding needed against RGBZ transformations

### In plan
* Transformation function GPU optimization
* Intrinsics corrected IMU stream
* IMU UpVector
* Improved failure handling
* K4A Viewer user interface/usability improvements
* Improved documentation and samples

### Backlog (we are figuring these out)
* Language support (C# and Python as top candidates)

## Known issues
- Check [Known Issues](troubleshooting.md)

