---
title: Azure Kinect DK External Sync
description: Using external synchronization for coordinated triggering
author: joylital
ms.author: joylital
ms.date: 1/23/2019
keywords: Kinect, sensor, viewer, external sync, phase delay, depth, RGB, camera, audio cable
---

# Azure Kinect DK External Synchronization (Preview)

Multiple Azure Kinect DK devices can be daisy-chained together using [3.5mm audio cable](azure-kinect-devkit.md#external-syncronization) to enable synchronized triggering.
This page explains how to setup and test external synchronization using [Azure Kinect viewer tool](k4a-viewer.md). 

## Requirements

- Azure Kinect DK units (2+)
- [3.5mm audio cable](azure-kinect-devkit.md#external-syncronization) for synchronization (not included inbox)
- Host PC for each device (or dedicated host controller depending on use case and amount of data transferred over USB)
- Master device has to stream RGB camera that is handling the synchronization

## Setting up system

1. Connect all the units to power and to host PC
2. Connect synchronization cable between the units
    - Master SYNC OUT to subordinate SYNC IN  
    - Subordinate-1 SYNC OUT to Subordinate-2 SYNC IN
    - etc.

![External sync setup](images/azurekinectdk-extsync.png)

## Configure and start syncronized triggering

Recommendation is to use the same framerate and resolution for all cameras. Configure and start subordinate devices first and master last.

### Subordinate-1

- Open Azure Kinect viewer for Subordinate-1 device
- Configure camera mode and framerate (RGB camera must be used in external sync)
- Set device as subordinate and any phase delay (if required)
- Check that viewer Jack detect reports status correctly, click refresh to update
- Start streaming
- ***Viewer is expected to hang while waiting images***

### Subordinate-2
- Open Azure Kinect viewer for Subordinate-2 device and set the same settings as subordinate-1
- Start streaming
- ***Viewer is expected to hang while waiting images to arrive***

### Master
- Open Azure Kinect viewer for Master device
- Configure same camera mode and framerate as subordinate devices
- Set device to master mode
- Start streaming
- Verify viewer that subordinate device timestamps roll back and all sensors stream synchronized

## Known limitations and tips
- Master has to be started last as to align timestamps across all devices
- Master device has to stream RGB camera
- External sync signal is not delayed, any delay configuration is handling internally in device and is driven by RGB camera
- Restarting subordinate device will cause synchronization to be lost
- Some [camera modes](azure-kinect-devkit.md) support 15fps max. It is not recommended to mix modes/framerates between devices
- Connecting multiple units to single PC can easily saturate USB bandwidth, consider using separate host PC per device
- Disable microphone and IMU in viewer if those are not needed, this can improve reliability
- K4Arecorder does not support mode setting yet

For any issues see [troubleshooting](troubleshooting.md)