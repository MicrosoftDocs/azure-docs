---
title: Capture device synchronization 
description: Device synchronization
author: joylital, cedmonds
ms.author: joylital, cedmonds
ms.prod: kinect-dk
ms.date: 2/22/2019
ms.topic: overview
keywords: kinect, azure, sensor, sdk, depth, rgb, internal, external, synchronization, daisy chain, phase offset
---

# Capture Synchronization

The Azure Kinect is capable of hardware time alignment between the color and depth sensors on a single device. In addition,
multiple Azure Kinect devices can be connected to one another to enable cross-device synchronization.

## Device internal synchronization

Image capture between the individual cameras is synchronized in hardware. In every [k4a_capture_t](~/api/k4a-capture-t.md)
that contains images from both the color and depth sensor, the images' timestamps are aligned based on the operating mode of the
hardware. By default the images of a capture are center of exposure aligned. The relative timing of
depth and color captures can be adjusted using the ```depth_delay_off_color_usec``` field of [k4a_device_configuration_t](~/api/k4a-device-configuration-t.md).

## Device external synchronization

See [setup external synchronization](external-sync-setup.md) for hardware setup. Once the devices are connected together, the software
for each device must be configured to specify if the device is operating in a master or subordinate mode. This
setting is configured on the [k4a_device_configuration_t](~/api/k4a-device-configuration-t.md).

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

To programmatically retrieve the current state of the synchronization input and synchronization output jacks, use the [k4a_device_get_sync_jack](~/api/k4a-device-get-sync-jack.md) function.

## Next steps

- [k4a_device_configuration_t](~/api/k4a-device-configuration-t.md)
- [k4a_wired_sync_mode_t](~/api/k4a-wired-sync-mode-t.md)
- [k4a_device_get_sync_jack](~/api/k4a-device-get-sync-jack.md)
