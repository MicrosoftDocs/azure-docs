---
title: k4a_fps_t enumeration
description: Color (RGB) sensor frame rates. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, enumeration
---
# k4a_fps_t enumeration

Color (RGB) sensor frame rates. 

## Syntax

```C
typedef enum {
    K4A_FRAMES_PER_SECOND_OFF = 0,
    K4A_FRAMES_PER_SECOND_5,
    K4A_FRAMES_PER_SECOND_15,
    K4A_FRAMES_PER_SECOND_30,
} k4a_fps_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Values

 Constant       | Description   
----------------|---------------
K4A_FRAMES_PER_SECOND_OFF | Turns the sensor off. 
K4A_FRAMES_PER_SECOND_5 | 5 FPS 
K4A_FRAMES_PER_SECOND_15 | 15 FPS 
K4A_FRAMES_PER_SECOND_30 | 30 FPS 

