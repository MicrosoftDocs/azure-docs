---
title: Capture Azure Kinect device synchronization 
description: Learn how to synchronize Azure Kinect capture devices using the Azure Kinect Sensor SDK.
author: xthexder
ms.author: jawirth
ms.prod: kinect-dk
ms.date: 06/26/2019
ms.topic: conceptual
keywords: kinect, azure, sensor, sdk, depth, rgb, internal, external, synchronization, daisy chain, phase offset
---

# Capture Azure Kinect device synchronization

The Azure Kinect hardware can align the capture time of color and depth images. Alignment between the cameras on the same device is **internal synchronization**. Capture time alignment across multiple connected devices is **external synchronization**.

## Device internal synchronization

Image capture between the individual cameras is synchronized in hardware. In every [k4a_capture_t](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__capture__t.html)
that contains images from both the color and depth sensor, the images' timestamps are aligned based on the operating mode of the hardware. By default the images of a capture are center of exposure aligned. The relative timing of
depth and color captures can be adjusted using the `depth_delay_off_color_usec` field of [k4a_device_configuration_t](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__device__configuration__t.html).

## Device external synchronization

See [setup external synchronization](https://support.microsoft.com/help/4494429/sync-multiple-azure-kinect-dk-devices) for hardware setup.

The software for each connected device must be configured to operate in a **master** or **subordinate** mode. This
setting is configured on the [k4a_device_configuration_t](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__device__configuration__t.html).

When using external synchronization, subordinate cameras should always be started before the master for the timestamps to align correctly.

### Subordinate mode

```C
k4a_device_configuration_t deviceConfig;
deviceConfig.wired_sync_mode = K4A_WIRED_SYNC_MODE_SUBORDINATE
```

### Master mode

```C
k4a_device_configuration_t deviceConfig;
deviceConfig.wired_sync_mode = K4A_WIRED_SYNC_MODE_MASTER;
```

### Retrieving synchronization jack state

To programmatically retrieve the current state of the synchronization input and synchronization output jacks, use the [k4a_device_get_sync_jack](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga0209ac87bfd055163677321b0304e962.html#ga0209ac87bfd055163677321b0304e962) function.

## Next steps

Now you know how to enable and capture device synchronization. You also can review how to use 

>[!div class="nextstepaction"]
>[Azure Kinect sensor SDK record and playback API](record-playback-api.md)
