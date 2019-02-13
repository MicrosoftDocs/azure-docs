---
title: System Requirements
description: Microsoft Azure Kinect DK recommended system requirements
author: joylital
ms.author: joylital
ms.date: 2/11/2019
ms.topic: article
keywords: system requirements, CPU, GPU, USB, Kinect, set up, setup, minimum, recommended, 
---
# Azure Kinect DK System Requirements

## Supported operating systems and architectures

- Windows 10 April 2018 release (64-bit) or later 
- Linux Ubuntu 18.04 (64-bit) with OpenGLv4.4 or later GPU driver

Windows S mode or Windows IoT core are not supported by Sensor SDK (No support for UWP apps). Color camera and microphone array are available through standard Windows Media APIs.

## Development environment requirements

- For contributing into SDK or building SDK, get [Visual Studio 2017 w/ updates or later](https://developer.microsoft.com/en-us/windows/downloads) 

## Host PC hardware requirements

The PC host hardware requirement is very dependent on application/algorithm/sensor frame rate/resolution executed on host PC. Recommended minimum Sensor SDK configuration for Windows is:

- 7th Gen Intel® CoreTM i3 Processor (Dual Core 2.4 GHz with HD620 GPU or faster) 
- 4GB Memory 
- Dedicated USB3 port 

Lower end and older CPU may also work depending on your use case/scenario. Body Tracking minimum hardware requirement will be higher and to be published later.  
Performance differs also between Windows/Linux operating systems and graphics drivers in use.

## Benchmarking results

New tooling in progress, benchmarking results to be published eventually here.

## Known compatibility issues

There are known compatibility issues with following USB Host controllers
- ASMedia USB 3.1 eXtensible Host Controller (e.g. ASM1142)
- Texas Instruments USB 3.0 xHCI Host Controller (Microphone array do not enumerate)          

## See also
* [Azure Kinect DK](azure-kinect-devkit.md)
* [Setup hardware](set-up-hardware.md)