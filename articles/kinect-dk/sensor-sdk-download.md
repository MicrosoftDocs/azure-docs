---
title: Azure Kinect Sensor SDK download
description: Download links for the Sensor SDK and instructions how to install.
author: Brent-A
ms.author: brenta
ms.prod: kinect-dk
ms.date: 06/26/2019
ms.topic: conceptual
keywords: azure, kinect,sdk, download update, latest, available, install
---

# Azure Kinect Sensor SDK download

This page has the download links for each version of the Azure Kinect Sensor SDK. The installer provides all of the needed files to develop for the Azure Kinect.

## Azure Kinect Sensor SDK contents

- Headers and libraries to build an application using the Azure Kinect DK.
- Redistributable DLLs needed by applications using the Azure Kinect DK.
- The [Azure Kinect Viewer](azure-kinect-viewer.md).
- The [Azure Kinect Recorder](azure-kinect-recorder.md).
- The [Azure Kinect Firmware Tool](azure-kinect-firmware-tool.md).

## Windows download link

[Microsoft installer](https://download.microsoft.com/download/E/B/D/EBDBB3C1-ED3F-4236-96D6-2BCB352F3710/Azure%20Kinect%20SDK%201.1.0.msi) | [GitHub source code](https://github.com/Microsoft/Azure-Kinect-Sensor-SDK/releases/tag/v1.1.0)

> [!NOTE]
> When installing the SDK, remember the path you install to. For example, "C:\Program Files\Azure Kinect SDK 1.0.2". You will find the tools referenced in articles in this path.

## Linux installation instructions

Currently, the only supported distribution is Ubuntu 18.04. To request support for other distributions, see [this page](https://aka.ms/azurekinectfeedback).

First, you'll need to configure [Microsoft's Package Repository](https://packages.microsoft.com/), following the instructions [here](https://docs.microsoft.com/windows-server/administration/linux-package-repository-for-microsoft-software).

Now, you can install the necessary packages. The `k4a-tools` package includes the [Azure Kinect Viewer](azure-kinect-viewer.md), the [Azure Kinect Recorder](record-sensor-streams-file.md), and the [Azure Kinect Firmware Tool](azure-kinect-firmware-tool.md). To install it, run

 `sudo apt install k4a-tools`

 The `libk4a<major>.<minor>-dev` package contains the headers and CMake files to build against `libk4a`.
 The `libk4a<major>.<minor>` package contains the shared objects needed to run executables that depend on `libk4a`.

 The basic tutorials require the `libk4a<major>.<minor>-dev` package. To install it, run

 `sudo apt install libk4a1.1-dev`

If the command succeeds, the SDK is ready for use.

## Change log and older versions

You can find the change log for the Azure Kinect Sensor SDK [here](https://github.com/microsoft/Azure-Kinect-Sensor-SDK/blob/develop/CHANGELOG.md).

If you need an older version of the Azure Kinect Sensor SDK, find it [here](https://github.com/microsoft/Azure-Kinect-Sensor-SDK/blob/develop/docs/usage.md).

## Next steps

[Set up Azure Kinect DK](set-up-azure-kinect-dk.md)
