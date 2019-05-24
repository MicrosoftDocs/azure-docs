---
title: Azure Kinect DK record external synchronized units
description: Using Azure Kinect recorder with external synchronized units
author: joylital
ms.author: joylital
ms.prod: kinect-dk
ms.date: 06/26/2019
ms.topic: conceptual
keywords: Kinect, sensor, viewer, external sync, phase delay, depth, RGB, camera, audio cable, recorder
---

# Use Azure Kinect DK recorder with external synchronized units

This article provides guidance on how the [Azure Kinect Recorder](azure-kinect-dk-recorder.md) can record data external synchronization configured devices.

## Prerequisites

- You must [set up multiple Azure Kinect DK units for external synchronization](https://aka.ms/AzureKinectAPIDocs/external-sync-setup.md).

## External synchronization constraints

The following issues will not let you record with external synchronized units:

- Master device cannot have SYNC IN cable connected (device fails to get into master mode if SYNC IN is connected).
- Master device has to stream RGB camera to enable synchronization.
- Use the same camera configuration for all units (framerate and resolution) and device firmware ([update firmware](azure-kinect-dk-update-device-firmware.md) instructions).
- Start subordinate devices first and master last.
- Delay off master setting is relative to master for each subordinate device.

## Record when each unit has a host PC

In the example below, each device has its own dedicated host PC. It is the recommended setup.

### Subordinate-1

1. Set up recorder for the first unit

      `k4arecorder.exe --external-sync subordinate -r 5 -l 10 sub1.mkv`

2. Device starts waiting.

    ```
    Device serial number: 000011590212
    Device version: Rel; C: 1.5.78; D: 1.5.60[6109.6109]; A: 1.5.13
    Device started
    [subordinate mode] Waiting for signal from master
    ```

### Subordinate-2
 
1. Set up recorder for the second unit

    `k4arecorder.exe --external-sync subordinate -r 5 -l 10 sub2.mkv`
 
2. Device starts waiting.

    ```
    Device serial number: 000011590212
    Device version: Rel; C: 1.5.78; D: 1.5.60[6109.6109]; A: 1.5.13
    Device started
    [subordinate mode] Waiting for signal from master
    ```

### Master

1. Start recording on master:

    `>k4arecorder.exe --external-sync master -r 5 -l 10 master.mkv`

2. Wait until recording finished

## Recording when multiple units connected to single host PC

You can have multiple Azure Kinect DKs connected to a single host PC. However, that can be very demanding to USB bandwidth and host compute. To mitigate this:

- Connect each device into own USB host controller.
- Have a powerful GPU that can handle depth engine for each device.
- Record only needed sensors and use lower framerate.

You must start subordinate devices first and the master last.

## Subordinate-1

1. Start recorder on subordinate.

    `>k4arecorder.exe --device 1 --external-sync subordinate --imu OFF -r 5 -l 5 output-2.mkv`

2. This goes into waiting state.

## Master

1. start Master device

    `>k4arecorder.exe --device 0 --external-sync master --imu OFF -r 5 -l 5 output-1.mkv`

2. Wait recording to finish.

## Playing recording

You can use the [Azure Kinect viewer](azure-kinect-sensor-viewer.md) to play back recording.

## Tips

- Use manual exposure (for example, by setting using viewer before recording). RGB camera auto-exposure may impact time-synchronization and some lost depth frames if exposure is too long.
- Restarting subordinate device will cause synchronization to be lost.
- Some [camera modes](https://aka.ms/AzureKinectAPIDocs/azure-kinect-devkit.md) support 15 fps max. We recommended that you do not mix modes/frame rates between devices
- Connecting multiple units to single PC can easily saturate USB bandwidth, consider using separate host PC per device. Pay attention to CPU/GPU compute as well.
- Disable microphone and IMU in the viewer if those are not needed. This can improve reliability.

For any issues see [Troubleshooting](https://aka.ms/AzureKinectAPIDocs/troubleshooting.md)

## Next steps

Learn how to synchronize multiple Azure Kinect DK devices
> [!div class="nextstepaction"]
>[Setup external sync](https://support.microsoft.com/en-us/help/4494429/sync-multiple-azure-kinect-dk-devices)

## See also

- [Azure Kinect Recorder](azure-kinect-dk-recorder.md) for recorder settings and additional information.
- [Azure Kinect Viewer](azure-kinect-sensor-viewer.md) for playing recordings or setting RGB camera properties not available through recorder.
- [Azure Kinect Firmware Tool](azure-kinect-firmware-tool.md) for updating device firmware.