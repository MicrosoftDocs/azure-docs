---
title: Device Update for Azure IoT Hub Agent Agent Quickstart| Microsoft Docs
description: Device Update for Azure IoT Hub Agent Quickstart
author: ValOlson
ms.author: valls
ms.date: 2/15/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Device Update for IoT Hub Agent Quickstart

Device Update for IoT Hub supports two forms of updates – image-based and package-based. 

* Image updates provide a higher level of confidence in the end-state of the device. It is typically easier to replicate the results of an image-update between a pre-production environment and a production environment, since it doesn’t pose the same challenges as packages and their dependencies. Due to their atomic nature, one can also adopt an A/B failover model easily. 
* Package-based updates are targeted updates that alter only a specific component or application on the device. Thus, leading to lower consumption of bandwidth and helps reduce the time to download and install the update. Package updates typically allow for less downtime of devices when applying an update and avoid the overhead of creating images. 

## Getting Started - Image-based Updating

To get started 
* Ensure that your devices are running the Device Update Agent. 
* Use below pre-built images and binaries for an easy demonstration of Device Update for IoT Hub.  
* Use either a Raspberry Pi 3 B+ or Ubuntu 18.04 x64, depending on whether testing will be using a device or simulator. 

[Getting Started with Raspberry Pi 3 B+ Reference Yocto Image](device-update-raspberry-pi.md)

[Getting Started Using Ubuntu (18.04 x64) Simulator Reference Agent](device-update-simulator.md)

## Getting Started - Package-based Updating

To get started 
* Ensure that your devices are running the Device Update Agent. 
* Use the below package-based agent that you can install on your device to exercise the OTA updating capabilities
* You will need an IoT device or Azure IoT Edge device running Ubuntu Server 18.04 x64. 

[Getting Started using Ubuntu Server 18.04 x64 Package agent](device-update-ubuntu-agent.md)

## Troubleshooting Guide

If you run into issues, review the Device Update for IoT Hub [Troubleshooting Guide](troubleshoot-device-update.md) to help unblock any possible issues and collect necessary information to provide to Microsoft.
