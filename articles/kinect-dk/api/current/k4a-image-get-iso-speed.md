---
title: k4a_image_get_iso_speed function
description: Get the images ISO speed. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_image_get_iso_speed function

Get the images ISO speed. 

## Syntax

```C
uint32_t k4a_image_get_iso_speed(
    k4a_image_t image_handle
)
```
## Parameters

[`k4a_image_t`](~/api/current/k4a-image-t.md) `image_handle`

Handle of the image for which the get operation is performed on.

## Remarks
Returns the images ISO speed This function is only valid for color captures, and not for depth captures.

## Return Value
`uint32_t`

0 indicates the ISO speed was not available or an error occurred.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


