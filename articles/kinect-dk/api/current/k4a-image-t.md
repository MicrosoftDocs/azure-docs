---
title: k4a_image_t handle
description: Handle to a k4a image. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, handle
---
# k4a_image_t handle

Handle to a k4a image. 

## Syntax

```C
typedef struct { } k4a_image_t;
```
Handles are created with k4a_capture_get_image(), 
[k4a_image_create()](~/api/current/k4a-image-create.md)
, or k4a_image_create_with_buffer() and closed with 
[k4a_image_release()](~/api/current/k4a-image-release.md)
. Invalid handles are set to 0.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Functions

|  Title | Description |
|--------|-------------|
| [k4a_image_create](~/api/current/k4a-image-create.md) | Create an image.  |
| [k4a_image_create_from_buffer](~/api/current/k4a-image-create-from-buffer.md) | Create an image from a pre-allocated buffer.  |
| [k4a_image_get_buffer](~/api/current/k4a-image-get-buffer.md) | Get the image buffer.  |
| [k4a_image_get_exposure_usec](~/api/current/k4a-image-get-exposure-usec.md) | Get the image exposure in micro seconds.  |
| [k4a_image_get_format](~/api/current/k4a-image-get-format.md) | Get the image format of the image.  |
| [k4a_image_get_height_pixels](~/api/current/k4a-image-get-height-pixels.md) | Get the image height in pixels.  |
| [k4a_image_get_iso_speed](~/api/current/k4a-image-get-iso-speed.md) | Get the images ISO speed.  |
| [k4a_image_get_size](~/api/current/k4a-image-get-size.md) | Get the image buffer size.  |
| [k4a_image_get_stride_bytes](~/api/current/k4a-image-get-stride-bytes.md) | Get the image stride in bytes.  |
| [k4a_image_get_timestamp_usec](~/api/current/k4a-image-get-timestamp-usec.md) | Get the image timestamp in micro seconds.  |
| [k4a_image_get_white_balance](~/api/current/k4a-image-get-white-balance.md) | Get the image white_balance.  |
| [k4a_image_get_width_pixels](~/api/current/k4a-image-get-width-pixels.md) | Get the image width in pixels.  |
| [k4a_image_reference](~/api/current/k4a-image-reference.md) | Add a reference to the  [k4a_image_t](~/api/current/k4a-image-t.md) .  |
| [k4a_image_release](~/api/current/k4a-image-release.md) | Remove a reference from the  [k4a_image_t](~/api/current/k4a-image-t.md) .  |
| [k4a_image_set_exposure_time_usec](~/api/current/k4a-image-set-exposure-time-usec.md) | Set the exposure time, in micro seconds, of the image.  |
| [k4a_image_set_iso_speed](~/api/current/k4a-image-set-iso-speed.md) | Set the ISO speed of the image.  |
| [k4a_image_set_timestamp_usec](~/api/current/k4a-image-set-timestamp-usec.md) | Set the time stamp, in micro seconds, of the image.  |
| [k4a_image_set_white_balance](~/api/current/k4a-image-set-white-balance.md) | Set the white balance of the image.  |

