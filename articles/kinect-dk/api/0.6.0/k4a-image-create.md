---
title: k4a_image_create function
description: Create an image. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_image_create function

Create an image. 

## Syntax

```C
k4a_result_t k4a_image_create(
    k4a_image_format_t format,
    int width_pixels,
    int height_pixels,
    int stride_bytes,
    k4a_image_t * image_handle
)
```
## Parameters

[`k4a_image_format_t`](~/api/0.6.0/k4a-image-format-t.md) `format`

The format of the image that will be stored in this image container

`int` `width_pixels`

width in pixels

`int` `height_pixels`

height in pixels

`int` `stride_bytes`

stride in bytes

[`k4a_image_t *`](~/api/0.6.0/k4a-image-t.md) `image_handle`

pointer to store image handle in.

## Remarks
Call this API for image formats that have consistent stride, aka no compression. Image size is calculated by height_pixels * stride_bytes. For advances option use 
[k4a_image_create_from_buffer()](~/api/0.6.0/k4a-image-create-from-buffer.md)
.

[k4a_image_t](~/api/0.6.0/k4a-image-t.md)
 is created with a reference of 1.

Release the reference on this function with k4a_image_release

## Return Value
[`k4a_result_t`](~/api/0.6.0/k4a-result-t.md)

Returns K4A_RESULT_SUCCEEDED on success. Errors are indicated with K4A_RESULT_FAILED and error specific data can be found in the log.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


