---
title: k4a_color_control_mode_t enumeration
description: Color (RGB) sensor control mode. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, enumeration
---
# k4a_color_control_mode_t enumeration

Color (RGB) sensor control mode. 

## Syntax

```C
typedef enum {
    K4A_COLOR_CONTROL_MODE_AUTO = 0,
    K4A_COLOR_CONTROL_MODE_MANUAL,
} k4a_color_control_mode_t;
```
Used in conjunction with k4a_color_control_command_t

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Values

 Constant       | Description   
----------------|---------------
K4A_COLOR_CONTROL_MODE_AUTO | set the associated k4a_color_control_command_t to auto 
K4A_COLOR_CONTROL_MODE_MANUAL | set the associated k4a_color_control_command_t to manual 

