---
title: Azure Kinect Sensor SDK system requirements
description: Sensor SDK system requirements
author: tesych
ms.author: tesych
ms.prod: kinect-dk
ms.date: 06/26/2019
ms.topic: article
keywords: azure, kinect, system requirements, CPU, GPU, USB, set up, setup, minimum, requirements
---

# Azure Kinect sensor SDK system requirements

This document provides details about the system requirements needed to install the sensor SDK and successfully deploy your Azure Kinect DK.

## Supported operating systems and architectures

- Windows 10 April 2018 release (x64) or later
- Linux Ubuntu 18.04 (x64) with OpenGLv4.4 or later GPU driver

The Sensor SDK is available for the Windows API (Win32) for native C/C++ Windows applications. The SDK isn't currently available to UWP applications. Azure Kinect DK isn't supported for Windows 10 in S mode.

## Development environment requirements

To contribute to sensor SDK development, visit [GitHub](https://github.com/Microsoft/Azure-Kinect-Sensor-SDK).

## Minimum host PC hardware requirements

The PC host hardware requirement is dependent on application/algorithm/sensor frame rate/resolution executed on host PC. Recommended minimum Sensor SDK configuration for Windows is:

- Seventh Gen Intel® CoreTM i3 Processor (Dual Core 2.4 GHz with HD620 GPU or faster)
- 4 GB Memory
- Dedicated USB3 port

Lower end or older CPUs may also work depending on your use-case.

Performance differs also between Windows/Linux operating systems and graphics drivers in use.

## Body tracking host PC hardware requirements

The body tracking PC host requirement is more stringent than the general PC host requirement. Recommended minimum Body Tracking SDK configuration for Windows is:

- Seventh Gen Intel® CoreTM i5 Processor (Quad Core 2.4 GHz or faster)
- 4 GB Memory
- NVIDIA GEFORCE GTX 1070 or better
- Dedicated USB3 port

Lower end or older CPUs and NVIDIA GPUs may also work depending on your use-case.

## USB3

There are known compatibility issues with USB Host controllers. You can find more information on [Troubleshooting page](troubleshooting.md#usb3-host-controller-compatibility)

## Next steps

- [Azure Kinect DK overview](about-azure-kinect-dk.md)

- [Set up Azure Kinect DK](set-up-azure-kinect-dk.md)

- [Set up Azure Kinect body tracking](body-sdk-setup.md)
