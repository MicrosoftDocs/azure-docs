---
title: k4a_transformation_depth_image_to_color_camera function
description: Transforms the depth map into the geometry of the color camera. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_transformation_depth_image_to_color_camera function

Transforms the depth map into the geometry of the color camera. 

## Syntax

```C
k4a_result_t k4a_transformation_depth_image_to_color_camera(
    k4a_transformation_t transformation_handle,
    const k4a_image_t depth_image,
    k4a_image_t transformed_depth_image
)
```
## Parameters

[`k4a_transformation_t`](~/api/current/k4a-transformation-t.md) `transformation_handle`

Handle to transformation context

[`const k4a_image_t`](~/api/current/k4a-image-t.md) `depth_image`

Handle to input depth image

[`k4a_image_t`](~/api/current/k4a-image-t.md) `transformed_depth_image`

Handle to output transformed depth image

## Return Value
[`k4a_result_t`](~/api/current/k4a-result-t.md)

[K4A_RESULT_SUCCEEDED](~/api/current/k4a-result-t.md)
 if 
`transformed_depth_image`
 was successfully written and 
[K4A_RESULT_FAILED](~/api/current/k4a-result-t.md)
 otherwise.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


