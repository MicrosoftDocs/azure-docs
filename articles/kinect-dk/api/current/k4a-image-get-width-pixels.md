---
title: k4a_image_get_width_pixels function
description: Get the image width in pixels. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_image_get_width_pixels function

Get the image width in pixels. 

## Syntax

```C
int k4a_image_get_width_pixels(
    k4a_image_t image_handle
)
```
## Parameters

[`k4a_image_t`](~/api/current/k4a-image-t.md) `image_handle`

Handle of the image for which the get operation is performed on.

## Remarks
Returns the image width in pixels

## Return Value
`int`

This function is not expected to fail, all 
[k4a_image_t](~/api/current/k4a-image-t.md)
's are created with a known width.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


