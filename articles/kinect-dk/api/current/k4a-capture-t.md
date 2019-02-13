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
[k4a_device_get_capture()](~/api/current/k4a-device-get-capture.md)
 or 
[k4a_capture_create()](~/api/current/k4a-capture-create.md)
 and closed with 
[k4a_capture_release()](~/api/current/k4a-capture-release.md)
. Invalid handles are set to 0.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Functions

|  Title | Description |
|--------|-------------|
| [k4a_capture_create](~/api/current/k4a-capture-create.md) | create an empty capture object  |
| [k4a_capture_get_color_image](~/api/current/k4a-capture-get-color-image.md) | Get the color image associated with the given capture.  |
| [k4a_capture_get_depth_image](~/api/current/k4a-capture-get-depth-image.md) | Get the depth image associated with the given capture.  |
| [k4a_capture_get_ir_image](~/api/current/k4a-capture-get-ir-image.md) | Get the ir image associated with the given capture.  |
| [k4a_capture_get_temperature_c](~/api/current/k4a-capture-get-temperature-c.md) | Get the temperature associated with the capture.  |
| [k4a_capture_reference](~/api/current/k4a-capture-reference.md) | Add a reference to a capture.  |
| [k4a_capture_release](~/api/current/k4a-capture-release.md) | Release a capture back to the SDK.  |
| [k4a_capture_set_color_image](~/api/current/k4a-capture-set-color-image.md) | Set / add a color image to the associated capture.  |
| [k4a_capture_set_depth_image](~/api/current/k4a-capture-set-depth-image.md) | Set / add a depth image to the associated capture.  |
| [k4a_capture_set_ir_image](~/api/current/k4a-capture-set-ir-image.md) | Set / add a ir image to the associated capture.  |
| [k4a_capture_set_temperature_c](~/api/current/k4a-capture-set-temperature-c.md) | Set the temperature associated with the capture.  |

