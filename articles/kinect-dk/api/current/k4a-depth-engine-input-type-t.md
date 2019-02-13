---
title: k4a_depth_engine_input_type_t enumeration
description: Depth Engine valid input formats. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, enumeration
---
# k4a_depth_engine_input_type_t enumeration

Depth Engine valid input formats. 

## Syntax

```C
typedef enum {
    K4A_DEPTH_ENGINE_INPUT_TYPE_UNKNOWN = 0,
    K4A_DEPTH_ENGINE_INPUT_TYPE_16BIT_LINEAR,
    K4A_DEPTH_ENGINE_INPUT_TYPE_12BIT_RAW,
    K4A_DEPTH_ENGINE_INPUT_TYPE_12BIT_COMPRESSED,
    K4A_DEPTH_ENGINE_INPUT_TYPE_8BIT_COMPRESSED,
} k4a_depth_engine_input_type_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4aplugin.h (include k4a/k4aplugin.h) 


## Values

 Constant       | Description   
----------------|---------------
K4A_DEPTH_ENGINE_INPUT_TYPE_UNKNOWN | 
K4A_DEPTH_ENGINE_INPUT_TYPE_16BIT_LINEAR | 
K4A_DEPTH_ENGINE_INPUT_TYPE_12BIT_RAW | 
K4A_DEPTH_ENGINE_INPUT_TYPE_12BIT_COMPRESSED | 
K4A_DEPTH_ENGINE_INPUT_TYPE_8BIT_COMPRESSED | 

