---
title: k4a_image_get_timestamp_usec function
description: Get the image timestamp in micro seconds. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_image_get_timestamp_usec function

Get the image timestamp in micro seconds. 

## Syntax

```C
uint64_t k4a_image_get_timestamp_usec(
    k4a_image_t image_handle
)
```
## Parameters

[`k4a_image_t`](~/api/current/k4a-image-t.md) `image_handle`

Handle of the image for which the get operation is performed on.

## Remarks
Returns the timestamp of the image. Timestamps are recorded by the device and represent the mid-point of exposure. They may be used for relative comparison, but their absolute value has no defined meaning.

## Return Value
`uint64_t`

Returning a timestamp of 0 is considered an error.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


