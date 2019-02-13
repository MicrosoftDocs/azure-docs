---
title: k4a_image_get_white_balance function
description: Get the image white_balance. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_image_get_white_balance function

Get the image white_balance. 

## Syntax

```C
uint32_t k4a_image_get_white_balance(
    k4a_image_t image_handle
)
```
## Parameters

[`k4a_image_t`](~/api/current/k4a-image-t.md) `image_handle`

Handle of the image for which the get operation is performed on.

## Remarks
Returns the images white balance. This function is only valid for color captures, and not for depth captures.

## Return Value
`uint32_t`

White balance in Kelvin, 0 if image format is not supported by the given capture.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


