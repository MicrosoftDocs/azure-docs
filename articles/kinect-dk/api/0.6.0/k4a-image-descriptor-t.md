---
title: k4a_image_descriptor_t structure
description: k4a_image_descriptor_t
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, structure
---
# k4a_image_descriptor_t structure

[k4a_image_descriptor_t](~/api/0.6.0/k4a-image-descriptor-t.md)

## Syntax

```C
typedef struct {
    int width_pixels;
    int height_pixels;
    int stride_bytes;
} k4a_image_descriptor_t;
```

## Remarks
deprecated

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Members

`int` `width_pixels`

image width in pixels 

`int` `height_pixels`

image height in pixels 

`int` `stride_bytes`

image stride in bytes 

