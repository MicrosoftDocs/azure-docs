---
title: k4a_image_create_from_buffer function
description: Create an image from a pre-allocated buffer. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_image_create_from_buffer function

Create an image from a pre-allocated buffer. 

## Syntax

```C
k4a_result_t k4a_image_create_from_buffer(
    k4a_image_format_t format,
    int width_pixels,
    int height_pixels,
    int stride_bytes,
    uint8_t * buffer,
    size_t buffer_size,
    k4a_memory_destroy_cb_t * buffer_release_cb,
    void * buffer_release_cb_context,
    k4a_image_t * image_handle
)
```
## Parameters

[`k4a_image_format_t`](~/api/current/k4a-image-format-t.md) `format`

The format of the image that will be stored in this image container

`int` `width_pixels`

width in pixels

`int` `height_pixels`

height in pixels

`int` `stride_bytes`

stride in bytes

`uint8_t *` `buffer`

pointer to a pre-allocated image buffer

`size_t` `buffer_size`

size in bytes of the pre-allocated image buffer

[`k4a_memory_destroy_cb_t *`](~/api/current/k4a-memory-destroy-cb-t.md) `buffer_release_cb`

buffer free function, called when all references to the buffer have been released

`void *` `buffer_release_cb_context`

Context for the memory free function

[`k4a_image_t *`](~/api/current/k4a-image-t.md) `image_handle`

pointer to store image handle in.

## Remarks
This function creates a 
[k4a_image_t](~/api/current/k4a-image-t.md)
 from a pre-allocated buffer. When all references to this object reach zero the provided buffer_release_cb callback function is called to release the memory. If this function fails, then the caller must free the pre-allocated memory, if this function succeeds, then the 
[k4a_image_t](~/api/current/k4a-image-t.md)
 is responsible for freeing the memory. 
[k4a_image_t](~/api/current/k4a-image-t.md)
 is created with a reference of 1.

Release the reference on this function with k4a_image_release.

## Return Value
[`k4a_result_t`](~/api/current/k4a-result-t.md)

Returns K4A_RESULT_SUCCEEDED on success. Errors are indicated with K4A_RESULT_FAILED and error specific data can be found in the log.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


