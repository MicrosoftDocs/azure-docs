---
title: Quickstart - Set up Azure Kinect body tracking
description: In this quickstart, you will set up the body tracking SDK for Azure Kinect.
author: qm13
ms.author: quentinm
ms.prod: kinect-dk
ms.date: 06/26/2019
ms.topic: quickstart
keywords: kinect, azure, sensor, access, depth, sdk, body, tracking, joint, setup, cuda, nvidia

#Customer intent: As an Azure Kinect DK developer, I want to set up Azure Kinect body tracking.

---

# Quickstart: Set up Azure Kinect body tracking

This quickstart will guide you through the process of getting body tracking running on your Azure Kinect DK.

## System requirements

The Body Tracking SDK requires a NVIDIA GPU installed in the host PC. The recommended body tracking host PC requirement is described in [system requirements](system-requirements.md) page.

## Install software

### [Install the latest NVIDIA Driver](https://www.nvidia.com/Download/index.aspx?lang=en-us)

Download and install the latest NVIDIA driver for your graphics card. Older drivers may not be compatible with the CUDA binaries redistributed with the body tracking SDK.

### [Visual C++ Redistributable for Visual Studio 2015](https://www.microsoft.com/en-us/download/details.aspx?id=48145)

Download and install Visual C++ Redistributable for Visual Studio 2015. 

## Set up hardware

### [Set up Azure Kinect DK](set-up-azure-kinect-dk.md)

Launch the [Azure Kinect Viewer](azure-kinect-viewer.md) to check that your Azure Kinect DK is set up correctly.

## Download the Body Tracking SDK
 
1. Select the link to [Download the Body Tracking SDK](body-sdk-download.md)
2. Install the Body Tracking SDK on your PC.

## Verify body tracking

Launch the **Azure Kinect Body Tracking Viewer** to check that the Body Tracking SDK is set up correctly. The viewer is installed with the SDK msi installer. You can find it at your start menu or at `<SDK Installation Path>\tools\k4abt_simple_3d_viewer.exe`.

If you don't have a powerful enough GPU and still want to test the result, you can launch the the **Azure Kinect Body Tracking Viewer** in the command line by the following command: `<SDK Installation Path>\tools\k4abt_simple_3d_viewer.exe CPU`

If everything is set up correctly, a window with a 3D point cloud and tracked bodies should appear.


![Body Tracking 3D Viewer](./media/quickstarts/samples-simple3dviewer.png)

## Examples

You can find the examples about how to use the body tracking SDK [here](https://github.com/microsoft/Azure-Kinect-Samples/tree/master/body-tracking-samples).

## Next steps

> [!div class="nextstepaction"]
>[Build your first body tracking application](build-first-body-app.md)

