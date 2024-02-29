---
title: Azure Kinect Sensor SDK download
description: Learn how to download and install the Azure Kinect Sensor SDK on Windows and Linux.
author: Brent-A
ms.author: brenta
ms.service: azure-kinect-developer-kit
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

## Windows installation instructions

You can find installation details for the latest and previous versions of Azure Kinect Sensor SDK and Firmware [here](https://github.com/microsoft/Azure-Kinect-Sensor-SDK/blob/develop/docs/usage.md).

You can find the source code [here](https://github.com/microsoft/Azure-Kinect-Sensor-SDK).

> [!NOTE]
> When installing the SDK, remember the path you install to. For example, "C:\Program Files\Azure Kinect SDK 1.2". You will find the tools referenced in articles in this path.

## Linux installation instructions

Currently, the only supported distribution is Ubuntu 18.04. To request support for other distributions, see [this page](https://aka.ms/azurekinectfeedback).

First, you'll need to configure [Microsoft's Package Repository](https://packages.microsoft.com/), following the instructions [here](/windows-server/administration/linux-package-repository-for-microsoft-software).

Now, you can install the necessary packages. The `k4a-tools` package includes the [Azure Kinect Viewer](azure-kinect-viewer.md), the [Azure Kinect Recorder](record-sensor-streams-file.md), and the [Azure Kinect Firmware Tool](azure-kinect-firmware-tool.md). To install the package, run:

`sudo apt install k4a-tools`
 
This command installs the dependency packages that are required for the tools to work correctly, including the latest version of `libk4a<major>.<minor>`. You will need to add udev rules to access Azure Kinect DK without being the root user. For instructions, see [Linux Device Setup](https://github.com/microsoft/Azure-Kinect-Sensor-SDK/blob/develop/docs/usage.md#linux-device-setup). As an alternative, you can launch applications that use the device as root.

The `libk4a<major>.<minor>-dev` package contains the headers and CMake files to build your applications/executables against `libk4a`.

The `libk4a<major>.<minor>` package contains the shared objects needed to run applications/executables that depend on `libk4a`.

The basic tutorials require the `libk4a<major>.<minor>-dev` package. To install the package, run:

`sudo apt install libk4a<major>.<minor>-dev` 

If the command succeeds, the SDK is ready for use.

Be sure to install the matching version of `libk4a<major>.<minor>` with `libk4a<major>.<minor>-dev`. For example, if you install the `libk4a4.1-dev` package, install the corresponding `libk4a4.1` package that contains the matching version of shared object files. For the latest version of `libk4a`, see the links in the next section.

## Change log and older versions

You can find the change log for the Azure Kinect Sensor SDK [here](https://github.com/microsoft/Azure-Kinect-Sensor-SDK/blob/develop/CHANGELOG.md).

If you need an older version of the Azure Kinect Sensor SDK, find it [here](https://github.com/microsoft/Azure-Kinect-Sensor-SDK/blob/develop/docs/usage.md).

## Next steps

[Set up Azure Kinect DK](set-up-azure-kinect-dk.md)
