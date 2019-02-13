---
title: k4a_capture_t handle
description: Handle to a k4a capture. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, handle
---
# k4a_capture_t handle

Handle to a k4a capture. 

## Syntax

```C
typedef struct { } k4a_capture_t;
```
Handles are created with 
[k4a_device_get_capture()](~/api/0.5.2/k4a-device-get-capture.md)
 and closed with 
[k4a_capture_release()](~/api/0.5.2/k4a-capture-release.md)
. Invalid handles are set to 0.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Functions

|  Title | Description |
|--------|-------------|
| [k4a_capture_get_image_buffer](~/api/0.5.2/k4a-capture-get-image-buffer.md) | Get the capture buffer from the  [k4a_capture_t](~/api/0.5.2/k4a-capture-t.md) .  |
| [k4a_capture_get_image_descriptor](~/api/0.5.2/k4a-capture-get-image-descriptor.md) | Get the image descriptor of the capture.  |
| [k4a_capture_get_image_exposure_usec](~/api/0.5.2/k4a-capture-get-image-exposure-usec.md) | Get the exposure time of the capture.  |
| [k4a_capture_get_image_iso_speed](~/api/0.5.2/k4a-capture-get-image-iso-speed.md) | Get the ISO speed of the capture.  |
| [k4a_capture_get_image_white_balance](~/api/0.5.2/k4a-capture-get-image-white-balance.md) | Get the white balance of the capture.  |
| [k4a_capture_get_temperature](~/api/0.5.2/k4a-capture-get-temperature.md) | Get the temperature of the sensor at capture time.  |
| [k4a_capture_reference](~/api/0.5.2/k4a-capture-reference.md) | Add a reference to a capture.  |
| [k4a_capture_release](~/api/0.5.2/k4a-capture-release.md) | Release a capture back to the SDK.  |

