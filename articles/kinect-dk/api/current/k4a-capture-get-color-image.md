---
title: k4a_capture_get_color_image function
description: Get the color image associated with the given capture. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_capture_get_color_image function

Get the color image associated with the given capture. 

## Syntax

```C
k4a_image_t k4a_capture_get_color_image(
    k4a_capture_t capture_handle
)
```
## Parameters

[`k4a_capture_t`](~/api/current/k4a-capture-t.md) `capture_handle`

Capture handle containing the image

## Remarks
Call this function to access the given image. Release the image with 
[k4a_image_release()](~/api/current/k4a-image-release.md)
;

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


