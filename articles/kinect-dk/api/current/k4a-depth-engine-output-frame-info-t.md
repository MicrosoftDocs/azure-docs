---
title: k4a_depth_engine_output_frame_info_t structure
description: Depth Engine output frame information. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, structure
---
# k4a_depth_engine_output_frame_info_t structure

Depth Engine output frame information. 

## Syntax

```C
typedef struct {
    uint16_t output_width;
    uint16_t output_height;
    float sensor_temp;
    float laser_temp[2];
    uint64_t center_of_exposure_in_ticks;
    uint64_t usb_sof_tick;
} k4a_depth_engine_output_frame_info_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4aplugin.h (include k4a/k4aplugin.h) 


## Members

`uint16_t` `output_width`

Outputted frame width. 

`uint16_t` `output_height`

Outputted frame height. 

`float` `sensor_temp`

Sensor temperature degrees in C. 

`float` `laser_temp`

Laser temperature degrees in C. 

`uint64_t` `center_of_exposure_in_ticks`

Tick timestamp with the center of exposure. 

`uint64_t` `usb_sof_tick`

Tick timestamp with the USB SoF was seen. 

