---
title: k4a_color_control_command_t enumeration
description: Color (RGB) sensor control commands. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, enumeration
---
# k4a_color_control_command_t enumeration

Color (RGB) sensor control commands. 

## Syntax

```C
typedef enum {
    K4A_COLOR_CONTROL_EXPOSURE_TIME_ABSOLUTE = 0,
    K4A_COLOR_CONTROL_AUTO_EXPOSURE_PRIORITY,
    K4A_COLOR_CONTROL_BRIGHTNESS,
    K4A_COLOR_CONTROL_CONTRAST,
    K4A_COLOR_CONTROL_SATURATION,
    K4A_COLOR_CONTROL_SHARPNESS,
    K4A_COLOR_CONTROL_WHITEBALANCE,
    K4A_COLOR_CONTROL_BACKLIGHT_COMPENSATION,
    K4A_COLOR_CONTROL_GAIN,
    K4A_COLOR_CONTROL_POWERLINE_FREQUENCY,
} k4a_color_control_command_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Values

 Constant       | Description   
----------------|---------------
K4A_COLOR_CONTROL_EXPOSURE_TIME_ABSOLUTE | Auto, Manual (in uSec unit) 
K4A_COLOR_CONTROL_AUTO_EXPOSURE_PRIORITY | Manual (0: framerate priority, 1: exposure priority) 
K4A_COLOR_CONTROL_BRIGHTNESS | Manual. 
K4A_COLOR_CONTROL_CONTRAST | Manual. 
K4A_COLOR_CONTROL_SATURATION | Manual. 
K4A_COLOR_CONTROL_SHARPNESS | Manual. 
K4A_COLOR_CONTROL_WHITEBALANCE | Auto, Manual (in degress Kelvin) 
K4A_COLOR_CONTROL_BACKLIGHT_COMPENSATION | Manual (0: disable, 1: enable) 
K4A_COLOR_CONTROL_GAIN | Manual. 
K4A_COLOR_CONTROL_POWERLINE_FREQUENCY | Manual (1: 50Hz, 2:60Hz) 

