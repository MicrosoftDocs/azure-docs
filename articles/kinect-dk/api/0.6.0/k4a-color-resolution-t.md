---
title: k4a_color_resolution_t enumeration
description: Color (RGB) sensor resolutions. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, enumeration
---
# k4a_color_resolution_t enumeration

Color (RGB) sensor resolutions. 

## Syntax

```C
typedef enum {
    K4A_COLOR_RESOLUTION_OFF = 0,
    K4A_COLOR_RESOLUTION_720P,
    K4A_COLOR_RESOLUTION_1080P,
    K4A_COLOR_RESOLUTION_1440P,
    K4A_COLOR_RESOLUTION_1536P,
    K4A_COLOR_RESOLUTION_2160P,
    K4A_COLOR_RESOLUTION_3072P,
} k4a_color_resolution_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Values

 Constant       | Description   
----------------|---------------
K4A_COLOR_RESOLUTION_OFF | Color camera will be turned off with this setting. 
K4A_COLOR_RESOLUTION_720P | 1280 * 720 16:9 
K4A_COLOR_RESOLUTION_1080P | 1920 * 1080 16:9 
K4A_COLOR_RESOLUTION_1440P | 2560 * 1440 16:9 
K4A_COLOR_RESOLUTION_1536P | 2048 * 1536 4:3 
K4A_COLOR_RESOLUTION_2160P | 3840 * 2160 16:9 
K4A_COLOR_RESOLUTION_3072P | 4096 * 3072 4:3 

