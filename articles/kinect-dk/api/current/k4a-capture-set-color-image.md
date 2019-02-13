---
title: k4a_capture_set_color_image function
description: Set / add a color image to the associated capture. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_capture_set_color_image function

Set / add a color image to the associated capture. 

## Syntax

```C
void k4a_capture_set_color_image(
    k4a_capture_t capture_handle,
    k4a_image_t image_handle
)
```
## Parameters

[`k4a_capture_t`](~/api/current/k4a-capture-t.md) `capture_handle`

Capture handle containing to hold the image

[`k4a_image_t`](~/api/current/k4a-image-t.md) `image_handle`

Image handle containing the image

## Remarks
If there is already an image of this type contained by the capture, it will be dropped. The caller can pass in a NULL image to drop the existing image without having to add a new one. Calling capture_release() will also remove the image reference the capture has on the image and may result in the image being freed.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


