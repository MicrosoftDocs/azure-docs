---
title: k4a_capture_get_image_buffer function
description: Get the capture buffer from the  k4a_capture_t . 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_capture_get_image_buffer function

Get the capture buffer from the 
[k4a_capture_t](~/api/0.5.2/k4a-capture-t.md)
. 

## Syntax

```C
uint8_t * k4a_capture_get_image_buffer(
    k4a_capture_t capture_handle,
    k4a_image_format_t format,
    size_t * image_size
)
```
## Parameters

[`k4a_capture_t`](~/api/0.5.2/k4a-capture-t.md) `capture_handle`

Handle to a capture returned by 
[k4a_device_get_capture()](~/api/0.5.2/k4a-device-get-capture.md)

[`k4a_image_format_t`](~/api/0.5.2/k4a-image-format-t.md) `format`

The image format type the caller wants to access

`size_t *` `image_size`

[OUT] Output pointer to a location to write the image size to.

## Return Value
`uint8_t *`

byte * A byte pointer to the image, NULL if an image of that type is not available.

## Remarks
Called when the user has received a capture buffer and want to access the data contained in it.

## Return Value
`uint8_t *`

A pointer to the underlying capture buffer which contains the image data.
>[!WARNING]
> Once the capture is released, the buffer this points to is freed, and should no longer be accessed.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


