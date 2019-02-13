---
title: k4a_transformation_2d_to_3d function
description: Transform a 2d pixel coordinate with an associated depth value of the source camera into a 3d point of the target coordinate system. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_transformation_2d_to_3d function

Transform a 2d pixel coordinate with an associated depth value of the source camera into a 3d point of the target coordinate system. 

## Syntax

```C
k4a_result_t k4a_transformation_2d_to_3d(
    const k4a_calibration_t * calibration,
    const k4a_float2_t * source_point2d,
    const float source_depth,
    const k4a_calibration_type_t source_camera,
    const k4a_calibration_type_t target_camera,
    k4a_float3_t * target_point3d,
    int * valid
)
```
## Parameters

[`const k4a_calibration_t *`](~/api/0.2.0/k4a-calibration-t.md) `calibration`

Location to read the camera calibration obtained by k4a_transformation_get_calibration().

[`const k4a_float2_t *`](~/api/0.2.0/k4a-float2-t.md) `source_point2d`

The 2d pixel coordinates in 
`source_camera`

`const float` `source_depth`

The depth of 
`source_point2d`
 in millimeters

[`const k4a_calibration_type_t`](~/api/0.2.0/k4a-calibration-type-t.md) `source_camera`

The current camera

[`const k4a_calibration_type_t`](~/api/0.2.0/k4a-calibration-type-t.md) `target_camera`

The target camera

[`k4a_float3_t *`](~/api/0.2.0/k4a-float3-t.md) `target_point3d`

The 3d coordinates of the input pixel in the coordinate system of 
`target_camera`

`int *` `valid`

Takes a value of 1 if the transformation was successful and 0, otherwise

## Return Value
[`k4a_result_t`](~/api/0.2.0/k4a-result-t.md)

[K4A_RESULT_SUCCEEDED](~/api/0.2.0/k4a-result-t.md)
 if 
`target_point3d`
 was successfully written. 
[K4A_RESULT_FAILED](~/api/0.2.0/k4a-result-t.md)
 if 
`calibration`
 contained invalid transformation parameters.

## Remarks
This function applies the intrinsic calibration of 
`source_camera`
 to compute the 3d ray from the focal point of the camera through pixel 
`source_point2d`
. The 3d point on this ray is then found using 
`source_depth`
. If 
`target_camera`
 is different from 
`source_camera`
, the 3d point is transformed to 
`target_camera`
 using 
[k4a_transformation_3d_to_3d()](~/api/0.2.0/k4a-transformation-3d-to-3d.md)
. In practice, 
`source_camera`
 and 
`target_camera`
 will often be identical. In this case, no 3d to 3d transformation is applied. If 
`source_point2d`
 is not considered as valid pixel coordinate according to the intrinsic camera model, 
`valid`
 is set to 0 and 1, otherwise. The user should not use the result of this transformation if 
`valid`
 was set to 0.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


