---
title: k4a_capture_get_image_descriptor function
description: Get the image descriptor of the capture. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_capture_get_image_descriptor function

Get the image descriptor of the capture. 

## Syntax

```C
k4a_result_t k4a_capture_get_image_descriptor(
    k4a_capture_t capture_handle,
    k4a_image_format_t format,
    k4a_image_descriptor_t * descriptor
)
```
## Parameters

[`k4a_capture_t`](~/api/0.3.0/k4a-capture-t.md) `capture_handle`

Handle to a capture returned by 
[k4a_device_get_capture()](~/api/0.3.0/k4a-device-get-capture.md)
.

[`k4a_image_format_t`](~/api/0.3.0/k4a-image-format-t.md) `format`

The image format type the caller wants to access.

[`k4a_image_descriptor_t *`](~/api/0.3.0/k4a-image-descriptor-t.md) `descriptor`

The pointer to a location to write the image descriptor information.

## Remarks
This function returns the image descriptor for the provided image format.

## Return Value
[`k4a_result_t`](~/api/0.3.0/k4a-result-t.md)

[K4A_RESULT_SUCCEEDED](~/api/0.3.0/k4a-result-t.md)
 if successful, 
[K4A_RESULT_FAILED](~/api/0.3.0/k4a-result-t.md)
 otherwise.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


