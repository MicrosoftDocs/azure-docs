---
title: k4a_device_configuration_t structure
description: Structure to define configuration for k4a sensor. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, structure
---
# k4a_device_configuration_t structure

Structure to define configuration for k4a sensor. 

## Syntax

```C
typedef struct {
    k4a_image_format_t color_format;
    k4a_color_resolution_t color_resolution;
    k4a_fps_t color_fps;
    k4a_depth_mode_t depth_mode;
    k4a_fps_t depth_fps;
    int32_t depth_delay_off_color_usec;
    uint32_t wired_sync_mode;
    uint32_t subordinate_capture_delay_off_master_usec;
} k4a_device_configuration_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Members

[`k4a_image_format_t`](~/api/0.2.0/k4a-image-format-t.md) `color_format`

Image format to capture with the color camera. 

[`k4a_color_resolution_t`](~/api/0.2.0/k4a-color-resolution-t.md) `color_resolution`

Image resolution to capture with the color camera. 

[`k4a_fps_t`](~/api/0.2.0/k4a-fps-t.md) `color_fps`

Frame rate for the color camera. 

[`k4a_depth_mode_t`](~/api/0.2.0/k4a-depth-mode-t.md) `depth_mode`

Capture mode for the depth camera. 

[`k4a_fps_t`](~/api/0.2.0/k4a-fps-t.md) `depth_fps`

Frame rate for the depth camera. 

`int32_t` `depth_delay_off_color_usec`

NOT SUPPORTED: Delay after the capture of the color image and the capture of the depth image. 


Can be any value 1 period faster than the color capture (a negative value) upto 1 period after the color capture 

`uint32_t` `wired_sync_mode`

NOT SUPPORTED: The external synchronization mode; standalone, master, slave. 

`uint32_t` `subordinate_capture_delay_off_master_usec`

NOT SUPPORTED: If this camera is a slave, this sets the delay between the color camera capture and the input pulse. 

