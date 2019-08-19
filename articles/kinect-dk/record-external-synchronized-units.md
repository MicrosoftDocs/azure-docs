---
title: Use Azure Kinect recorder with external synchronized units
description: Using Azure Kinect recorder with external synchronized units
author: joylital
ms.author: joylital
ms.reviewer: jawirth
ms.prod: kinect-dk
ms.date: 06/26/2019
ms.topic: conceptual
keywords: Kinect, sensor, viewer, external sync, phase delay, depth, RGB, camera, audio cable, recorder
---

# Use Azure Kinect recorder with external synchronized units

This article provides guidance on how the [Azure Kinect Recorder](azure-kinect-recorder.md) can record data external synchronization configured devices.

## Prerequisites

- [Set up multiple Azure Kinect DK units for external synchronization](https://support.microsoft.com/help/4494429).

## External synchronization constraints

- Master device can't have SYNC IN cable connected.
- Master device must stream RGB camera to enable synchronization.
- All units must use the same camera configuration (framerate and resolution).
- All units must run the same device firmware ([update firmware](update-device-firmware.md) instructions).
- All subordinate devices must be started before the master device.
- The same exposure value should be set on all devices.
- Each subordinate's *Delay off master* setting is relative to the master device.

## Record when each unit has a host PC

In the example below, each device has its own dedicated host PC.
It's recommended you connect devices to dedicated PCs to prevent issues with USB bandwidth and CPU/GPU usage.

### Subordinate-1

1. Set up recorder for the first unit

      `k4arecorder.exe --external-sync sub -e -8 -r 5 -l 10 sub1.mkv`

2. Device starts waiting

    ```console
    Device serial number: 000011590212
    Device version: Rel; C: 1.5.78; D: 1.5.60[6109.6109]; A: 1.5.13
    Device started
    [subordinate mode] Waiting for signal from master
    ```

### Subordinate-2

1. Set up recorder for the second unit

    `k4arecorder.exe --external-sync sub -e -8 -r 5 -l 10 sub2.mkv`

2. Device starts waiting

    ```console
    Device serial number: 000011590212
    Device version: Rel; C: 1.5.78; D: 1.5.60[6109.6109]; A: 1.5.13
    Device started
    [subordinate mode] Waiting for signal from master
    ```

### Master

1. Start recording on master

    `>k4arecorder.exe --external-sync master -e -8 -r 5 -l 10 master.mkv`

2. Wait until recording finished

## Recording when multiple units connected to single host PC

You can have multiple Azure Kinect DKs connected to a single host PC. However, that can be very demanding to USB bandwidth and host compute. To reduce the demand:

- Connect each device into own USB host controller.
- Have a powerful GPU that can handle depth engine for each device.
- Record only needed sensors and use lower framerate.

Always start subordinate devices first and the master last.

## Subordinate-1

1. Start recorder on subordinate

    `>k4arecorder.exe --device 1 --external-sync subordinate --imu OFF -e -8 -r 5 -l 5 output-2.mkv`

2. The device goes into waiting state

## Master

1. Start master device

    `>k4arecorder.exe --device 0 --external-sync master --imu OFF -e -8 -r 5 -l 5 output-1.mkv`

2. Wait recording to finish

## Playing recording

You can use the [Azure Kinect viewer](azure-kinect-viewer.md) to play back recording.



## Tips

- Use manual exposure for recording synchronized cameras. RGB camera auto-exposure may impact time-synchronization.
- Restarting subordinate device will cause synchronization to be lost.
- Some [camera modes](hardware-specification.md#depth-camera-supported-operating-modes) support 15 fps max. We recommended that you don't mix modes/frame rates between devices
- Connecting multiple units to single PC can easily saturate USB bandwidth, consider using separate host PC per device. Pay attention to CPU/GPU compute as well.
- Disable the microphone and IMU if they aren't needed to improve reliability.

For any issues see [Troubleshooting](troubleshooting.md)

## See also

- [Set up external sync](https://support.microsoft.com/help/4494429/sync-multiple-devices)
- [Azure Kinect Recorder](azure-kinect-recorder.md) for recorder settings and additional information.
- [Azure Kinect Viewer](azure-kinect-viewer.md) for playing recordings or setting RGB camera properties not available through recorder.
- [Azure Kinect Firmware Tool](azure-kinect-firmware-tool.md) for updating device firmware.
