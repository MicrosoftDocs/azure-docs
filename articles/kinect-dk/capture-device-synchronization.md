---
title: Capture Azure Kinect device synchronization 
description: Device synchronization
author: xthexder
ms.author: xthexder
ms.prod: kinect-dk
ms.date: 6/22/2019
ms.topic: overview
keywords: kinect, azure, sensor, sdk, depth, rgb, internal, external, synchronization, daisy chain, phase offset
---

# Capture synchronization

The Azure Kinect is capable of hardware time alignment between the color and depth sensors on a single device. In addition,
multiple Azure Kinect devices can be connected to one another to enable cross-device synchronization.

## Device internal synchronization

Image capture between the individual cameras is synchronized in hardware. In every [k4a_capture_t](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__capture__t.html)
that contains images from both the color and depth sensor, the images' timestamps are aligned based on the operating mode of the
hardware. By default the images of a capture are center of exposure aligned. The relative timing of
depth and color captures can be adjusted using the `depth_delay_off_color_usec` field of [k4a_device_configuration_t](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__device__configuration__t.html).

## Device external synchronization

See [setup external synchronization](https://aka.ms/AzureKinectAPIDocs/external-sync-setup.md) for hardware setup. Once the devices are connected together, the software
for each device must be configured to specify if the device is operating in a master or subordinate mode. This
setting is configured on the [k4a_device_configuration_t](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/structk4a__device__configuration__t.html).

### Master mode

```
k4a_device_configuration_t deviceConfig;
deviceConfig.wired_sync_mode = K4A_WIRED_SYNC_MODE_MASTER;
```

### Subordinate mode

```
k4a_device_configuration_t deviceConfig;
deviceConfig.wired_sync_mode = K4A_WIRED_SYNC_MODE_SUBORDINATE
```

### Retrieving synchronization jack state

To programmatically retrieve the current state of the synchronization input and synchronization output jacks, use the [k4a_device_get_sync_jack](https://microsoft.github.io/Azure-Kinect-Sensor-SDK/master/group___functions_ga0209ac87bfd055163677321b0304e962.html#ga0209ac87bfd055163677321b0304e962) function.

## Next steps

Now you know how to enable and capture device synchronization, you also can review how to use 

>[!div class="nextstepaction"]
>[Azure Kinect sensor SDK record and playback API](record-playback-api.md)