---
title: Using sensor SDK - Capture synchronization
description: Device synchronization
author: joylital, cedmonds
ms.author: joylital, cedmonds
ms.date: 01/10/2019
keywords: kinect, azure, sensor, sdk, depth, rgb, internal, external, synchronization, daisychain, phase offset
---

# Capture Synchronization

The Kinect sensor is capable of hardware time alignment between the color and depth sensors on an the same Kinect. In addition,
multiple Kinects can be connected to one another to enable cross device synchronization. Synchronizing captures and timestamps
is important to make sure that the color and depth data align well. 

## Device internal synchronization
Image capture between the individuals cameras is synchronized in hardware. In every [k4a_capture_t](~/api/current/k4a-capture-t.md) 
that contains images from the both the color and depth sensor the images are timestamp aligned based on the operating mode of the
hardware. By default the images of a capture are center of exposure aligned. The relative timing of 
depth and color captures can be adjusted using the ```depth_delay_off_color_usec``` field of [k4a_device_configuration_t](~/api/current/k4a-device-configuration-t.md).

## Device external synchronization
See [external synchronization](external-sync.md) for hardware setup. Once the hardware is configured the software 
for each camera must be configured to specify if the camera is operating in a master or subordinate mode. This 
setting is configured on the [k4a_device_configuration_t](~/api/current/k4a-device-configuration-t.md).

### Master mode:
```
k4a_device_configuration_t deviceConfig;
deviceConfig.wired_sync_mode = K4A_WIRED_SYNC_MODE_MASTER;
```

### Subordinate mode:
```
k4a_device_configuration_t deviceConfig;
deviceConfig.wired_sync_mode = K4A_WIRED_SYNC_MODE_SUBORDINATE
```
### Retrieving synchronization jack state

To programatically retrieve the current state of the synchronization input and synchronization output jacks use 
the [k4a_device_get_sync_jack](~/api/0.5.2/k4a-device-get-sync-jack.md) function.


## See Also
- [k4a_device_configuration_t](~/api/current/k4a-device-configuration-t.md)
- [k4a_wired_sync_mode_t](~/api/current/k4a-wired-sync-mode-t.md)
- [k4a_device_get_sync_jack](~/api/0.5.2/k4a-device-get-sync-jack.md)
