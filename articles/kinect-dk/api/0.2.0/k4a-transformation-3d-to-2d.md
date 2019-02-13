---
title: k4a_transformation_3d_to_2d function
description: Transform a 3d point of a source coordinate system into a 2d pixel coordinate of the target camera. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_transformation_3d_to_2d function

Transform a 3d point of a source coordinate system into a 2d pixel coordinate of the target camera. 

## Syntax

```C
k4a_result_t k4a_transformation_3d_to_2d(
    const k4a_calibration_t * calibration,
    const k4a_float3_t * source_point3d,
    const k4a_calibration_type_t source_camera,
    const k4a_calibration_type_t target_camera,
    k4a_float2_t * target_point2d,
    int * valid
)
```
## Parameters

[`const k4a_calibration_t *`](~/api/0.2.0/k4a-calibration-t.md) `calibration`

Location to read the camera calibration obtained by k4a_transformation_get_calibration().

[`const k4a_float3_t *`](~/api/0.2.0/k4a-float3-t.md) `source_point3d`

The 3d coordinates in millimeters representing a point in 
`source_camera`

[`const k4a_calibration_type_t`](~/api/0.2.0/k4a-calibration-type-t.md) `source_camera`

The current camera

[`const k4a_calibration_type_t`](~/api/0.2.0/k4a-calibration-type-t.md) `target_camera`

The target camera

[`k4a_float2_t *`](~/api/0.2.0/k4a-float2-t.md) `target_point2d`

The 2d pixel coordinates in 
`target_camera`

`int *` `valid`

Takes a value of 1 if the transformation was successful and 0, otherwise

## Return Value
[`k4a_result_t`](~/api/0.2.0/k4a-result-t.md)

[K4A_RESULT_SUCCEEDED](~/api/0.2.0/k4a-result-t.md)
 if 
`target_point2d`
 was successfully written. 
[K4A_RESULT_FAILED](~/api/0.2.0/k4a-result-t.md)
 if 
`calibration`
 contained invalid transformation parameters.

## Remarks
If 
`target_camera`
 is different from 
`source_camera`
, 
`source_point3d`
 is transformed to 
`target_camera`
 using 
[k4a_transformation_3d_to_3d()](~/api/0.2.0/k4a-transformation-3d-to-3d.md)
. In practice, 
`source_camera`
 and 
`target_camera`
 will often be identical. In this case, no 3d to 3d transformation is applied. The 3d point in the coordinate system of 
`target_camera`
 is then projected onto the image plane using the intrinsic calibration of 
`target_camera`
. If the intrinsic camera model cannot handle this projection, 
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


