---
title: k4a_transformation_depth_image_to_point_cloud function
description: Transforms the depth image into 3 planar images representing X, Y and Z-coordinates of corresponding 3d points. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_transformation_depth_image_to_point_cloud function

Transforms the depth image into 3 planar images representing X, Y and Z-coordinates of corresponding 3d points. 

## Syntax

```C
k4a_result_t k4a_transformation_depth_image_to_point_cloud(
    k4a_transformation_t transformation_handle,
    const k4a_image_t depth_image,
    const k4a_calibration_type_t camera,
    k4a_image_t xyz_image
)
```
## Parameters

[`k4a_transformation_t`](~/api/current/k4a-transformation-t.md) `transformation_handle`

Handle to transformation context

[`const k4a_image_t`](~/api/current/k4a-image-t.md) `depth_image`

Handle to input depth image

[`const k4a_calibration_type_t`](~/api/current/k4a-calibration-type-t.md) `camera`

Geometry in which depth map was computed (depth or color camera)

[`k4a_image_t`](~/api/current/k4a-image-t.md) `xyz_image`

Handle to output xyz image

## Return Value
[`k4a_result_t`](~/api/current/k4a-result-t.md)

[K4A_RESULT_SUCCEEDED](~/api/current/k4a-result-t.md)
 if 
`xyz_image`
 was successfully written and 
[K4A_RESULT_FAILED](~/api/current/k4a-result-t.md)
 otherwise.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


