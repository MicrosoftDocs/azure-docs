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
    k4a_depth_mode_t depth_mode;
    k4a_fps_t camera_fps;
    bool synchronized_images_only;
    int32_t depth_delay_off_color_usec;
    k4a_wired_sync_mode_t wired_sync_mode;
    uint32_t subordinate_delay_off_master_usec;
    bool disable_streaming_indicator;
} k4a_device_configuration_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Members

[`k4a_image_format_t`](~/api/0.5.2/k4a-image-format-t.md) `color_format`

Image format to capture with the color camera. 

[`k4a_color_resolution_t`](~/api/0.5.2/k4a-color-resolution-t.md) `color_resolution`

Image resolution to capture with the color camera. 

[`k4a_depth_mode_t`](~/api/0.5.2/k4a-depth-mode-t.md) `depth_mode`

Capture mode for the depth camera. 

[`k4a_fps_t`](~/api/0.5.2/k4a-fps-t.md) `camera_fps`

Frame rate for the color and depth camera. 

`bool` `synchronized_images_only`

Only report 
[k4a_capture_t](~/api/0.5.2/k4a-capture-t.md)
 objects if they contain synchronized color and depth images. 


If set to false a capture may be reported that contains only a single image. NOTE: this can only be enabled if both color camera and depth camera's are configured to run 

`int32_t` `depth_delay_off_color_usec`

Delay after the capture of the color image and the capture of the depth image. 


Can be any value 1 period faster than the color capture (a negative value) upto 1 period after the color capture. 

[`k4a_wired_sync_mode_t`](~/api/0.5.2/k4a-wired-sync-mode-t.md) `wired_sync_mode`

The external synchronization mode. 

`uint32_t` `subordinate_delay_off_master_usec`

If this camera is a subordinate, this sets the capture delay between the color camera capture and the input pulse. 


If this is not a subordinate, then this value is ignored. 

`bool` `disable_streaming_indicator`

Streaming indicator automatically turns on when the color or depth camera's are in use. 


This setting disables that behavior and keeps the LED in an off state. 

