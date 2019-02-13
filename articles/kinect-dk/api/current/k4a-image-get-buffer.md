---
title: k4a_image_get_buffer function
description: Get the image buffer. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_image_get_buffer function

Get the image buffer. 

## Syntax

```C
uint8_t * k4a_image_get_buffer(
    k4a_image_t image_handle
)
```
## Parameters

[`k4a_image_t`](~/api/current/k4a-image-t.md) `image_handle`

Handle of the image for which the get operation is performed on.

## Remarks
Returns the image buffer

Use this buffer to access the raw image data.

## Return Value
`uint8_t *`

This function is not expected to return null, all 
[k4a_image_t](~/api/current/k4a-image-t.md)
's are created with a buffer.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


