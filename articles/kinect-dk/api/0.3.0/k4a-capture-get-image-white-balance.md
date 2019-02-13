---
title: k4a_capture_get_image_white_balance function
description: Get the white balance of the capture. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_capture_get_image_white_balance function

Get the white balance of the capture. 

## Syntax

```C
uint32_t k4a_capture_get_image_white_balance(
    k4a_capture_t capture_handle,
    k4a_image_format_t format
)
```
## Parameters

[`k4a_capture_t`](~/api/0.3.0/k4a-capture-t.md) `capture_handle`

Handle to a capture returned by 
[k4a_device_get_capture()](~/api/0.3.0/k4a-device-get-capture.md)

[`k4a_image_format_t`](~/api/0.3.0/k4a-image-format-t.md) `format`

The image format type the caller wants to access

## Remarks
This function is only valid for color captures, and not for depth captures.

## Return Value
`uint32_t`

White balance in Kelvin, 0 if image format is not supported by the given capture.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


