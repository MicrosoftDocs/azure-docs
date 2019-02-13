---
title: k4a_image_get_exposure_usec function
description: Get the image exposure in micro seconds. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_image_get_exposure_usec function

Get the image exposure in micro seconds. 

## Syntax

```C
uint64_t k4a_image_get_exposure_usec(
    k4a_image_t image_handle
)
```
## Parameters

[`k4a_image_t`](~/api/current/k4a-image-t.md) `image_handle`

Handle of the image for which the get operation is performed on.

## Remarks
Returns an exposure time in micro seconds. This is only supported on Color image formats.

## Return Value
`uint64_t`

Returning an exposure of 0 is considered an error.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


