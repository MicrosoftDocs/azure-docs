---
title: k4a_depth_engine_input_frame_info_t structure
description: Depth Engine input frame information. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, structure
---
# k4a_depth_engine_input_frame_info_t structure

Depth Engine input frame information. 

## Syntax

```C
typedef struct {
    float sensor_temp;
    float laser_temp[2];
    uint64_t center_of_exposure_in_ticks;
    uint64_t usb_sof_tick;
} k4a_depth_engine_input_frame_info_t;
```
/remarks At Runtime, please set to NULL, we parse these information from a raw 12bit compressed input. Some playback testing may use this to pass in temperature info

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4aplugin.h (include k4a/k4aplugin.h) 


## Members

`float` `sensor_temp`

Sensor Temperature in Deg C. 

`float` `laser_temp`

Laser Temperature in Deg C. 

`uint64_t` `center_of_exposure_in_ticks`

Tick timestamp with the center of exposure. 

`uint64_t` `usb_sof_tick`

Tick timestamp with the USB SoF was seen. 

