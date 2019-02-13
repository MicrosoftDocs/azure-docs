---
title: k4a_image_set_exposure_time_usec function
description: Set the exposure time, in micro seconds, of the image. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_image_set_exposure_time_usec function

Set the exposure time, in micro seconds, of the image. 

## Syntax

```C
void k4a_image_set_exposure_time_usec(
    k4a_image_t image_handle,
    uint64_t exposure_usec
)
```
## Parameters

[`k4a_image_t`](~/api/current/k4a-image-t.md) `image_handle`

Handle of the image for which the get operation is performed on.

`uint64_t` `exposure_usec`

exposure time of the image in micro seconds.

## Remarks
Use this function in conjunction with 
[k4a_image_create()](~/api/current/k4a-image-create.md)
 or 
[k4a_image_create_from_buffer()](~/api/current/k4a-image-create-from-buffer.md)
 to construct a 
[k4a_image_t](~/api/current/k4a-image-t.md)
. An exposure time of 0 is not valid. Only use this function with color image formats.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


