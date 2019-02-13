---
title: k4a_image_get_size function
description: Get the image buffer size. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_image_get_size function

Get the image buffer size. 

## Syntax

```C
size_t k4a_image_get_size(
    k4a_image_t image_handle
)
```
## Parameters

[`k4a_image_t`](~/api/0.6.0/k4a-image-t.md) `image_handle`

Handle of the image for which the get operation is performed on.

## Remarks
Returns the image buffer

Use this function to know what the size of the image buffer is returned by 
[k4a_image_get_buffer()](~/api/0.6.0/k4a-image-get-buffer.md)

## Return Value
`size_t`

This function is not expected to return 0, all 
[k4a_image_t](~/api/0.6.0/k4a-image-t.md)
's are created with a buffer.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


