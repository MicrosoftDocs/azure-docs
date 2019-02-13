---
title: k4a_image_set_iso_speed function
description: Set the ISO speed of the image. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_image_set_iso_speed function

Set the ISO speed of the image. 

## Syntax

```C
void k4a_image_set_iso_speed(
    k4a_image_t image_handle,
    uint32_t iso_speed
)
```
## Parameters

[`k4a_image_t`](~/api/0.6.0/k4a-image-t.md) `image_handle`

Handle of the image for which the get operation is performed on.

`uint32_t` `iso_speed`

ISO speed of the image.

## Remarks
Use this function in conjunction with 
[k4a_image_create()](~/api/0.6.0/k4a-image-create.md)
 or 
[k4a_image_create_from_buffer()](~/api/0.6.0/k4a-image-create-from-buffer.md)
 to construct a 
[k4a_image_t](~/api/0.6.0/k4a-image-t.md)
. An ISO speed of 0 is not valid. Only use this function with color image formats.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


