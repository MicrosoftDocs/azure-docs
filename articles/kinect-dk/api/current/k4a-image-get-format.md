---
title: k4a_image_get_format function
description: Get the image format of the image. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_image_get_format function

Get the image format of the image. 

## Syntax

```C
k4a_image_format_t k4a_image_get_format(
    k4a_image_t image_handle
)
```
## Parameters

[`k4a_image_t`](~/api/current/k4a-image-t.md) `image_handle`

Handle of the image for which the get operation is performed on.

## Remarks
Returns the image format

Use this function to know what the image format is.

## Return Value
[`k4a_image_format_t`](~/api/current/k4a-image-format-t.md)

This function is not expected to fail, all 
[k4a_image_t](~/api/current/k4a-image-t.md)
's are created with a known format.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


