---
title: k4a_depth_engine_mode_t enumeration
description: Valid Depth Engine modes. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, enumeration
---
# k4a_depth_engine_mode_t enumeration

Valid Depth Engine modes. 

## Syntax

```C
typedef enum {
    K4A_DEPTH_ENGINE_MODE_UNKNOWN = -1,
    K4A_DEPTH_ENGINE_MODE_ST = 0,
    K4A_DEPTH_ENGINE_MODE_LT_HW_BINNING = 1,
    K4A_DEPTH_ENGINE_MODE_LT_SW_BINNING = 2,
    K4A_DEPTH_ENGINE_MODE_PCM = 3,
    K4A_DEPTH_ENGINE_MODE_LT_NATIVE = 4,
    K4A_DEPTH_ENGINE_MODE_MEGA_PIXEL = 5,
    K4A_DEPTH_ENGINE_MODE_QUARTER_MEGA_PIXEL = 7,
} k4a_depth_engine_mode_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4aplugin.h (include k4a/k4aplugin.h) 


## Values

 Constant       | Description   
----------------|---------------
K4A_DEPTH_ENGINE_MODE_UNKNOWN | 
K4A_DEPTH_ENGINE_MODE_ST | 
K4A_DEPTH_ENGINE_MODE_LT_HW_BINNING | 
K4A_DEPTH_ENGINE_MODE_LT_SW_BINNING | 
K4A_DEPTH_ENGINE_MODE_PCM | 
K4A_DEPTH_ENGINE_MODE_LT_NATIVE | 
K4A_DEPTH_ENGINE_MODE_MEGA_PIXEL | 
K4A_DEPTH_ENGINE_MODE_QUARTER_MEGA_PIXEL | 

