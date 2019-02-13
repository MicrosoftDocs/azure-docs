---
title: k4a_image_format_t enumeration
description: Image types. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, enumeration
---
# k4a_image_format_t enumeration

Image types. 

## Syntax

```C
typedef enum {
    K4A_IMAGE_FORMAT_COLOR_MJPG = 0,
    K4A_IMAGE_FORMAT_COLOR_NV12,
    K4A_IMAGE_FORMAT_COLOR_YUY2,
    K4A_IMAGE_FORMAT_COLOR_RGB24,
    K4A_IMAGE_FORMAT_DEPTH16,
    K4A_IMAGE_FORMAT_IR16,
} k4a_image_format_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Values

 Constant       | Description   
----------------|---------------
K4A_IMAGE_FORMAT_COLOR_MJPG | Color image type MJPG. 
K4A_IMAGE_FORMAT_COLOR_NV12 | Color image type NV12. 
K4A_IMAGE_FORMAT_COLOR_YUY2 | Color image type YUY2. 
K4A_IMAGE_FORMAT_COLOR_RGB24 | Color image type RGB24 (8 bits per channel) 
K4A_IMAGE_FORMAT_DEPTH16 | Depth image type Depth16. 
K4A_IMAGE_FORMAT_IR16 | Depth image type IR16. 

