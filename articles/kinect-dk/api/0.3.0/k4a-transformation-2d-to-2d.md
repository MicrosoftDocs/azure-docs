---
title: k4a_transformation_2d_to_2d function
description: Transform a 2d pixel coordinate with an associated depth value of the source camera into a 2d pixel coordinate of the target camera. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_transformation_2d_to_2d function

Transform a 2d pixel coordinate with an associated depth value of the source camera into a 2d pixel coordinate of the target camera. 

## Syntax

```C
k4a_result_t k4a_transformation_2d_to_2d(
    const k4a_calibration_t * calibration,
    const k4a_float2_t * source_point2d,
    const float source_depth,
    const k4a_calibration_type_t source_camera,
    const k4a_calibration_type_t target_camera,
    k4a_float2_t * target_point2d,
    int * valid
)
```
## Parameters

[`const k4a_calibration_t *`](~/api/0.3.0/k4a-calibration-t.md) `calibration`

Location to read the camera calibration obtained by k4a_transformation_get_calibration().

[`const k4a_float2_t *`](~/api/0.3.0/k4a-float2-t.md) `source_point2d`

The 2d pixel coordinates in 
`source_camera`

`const float` `source_depth`

The depth of 
`source_point2d`
 in millimeters

[`const k4a_calibration_type_t`](~/api/0.3.0/k4a-calibration-type-t.md) `source_camera`

The current camera

[`const k4a_calibration_type_t`](~/api/0.3.0/k4a-calibration-type-t.md) `target_camera`

The target camera

[`k4a_float2_t *`](~/api/0.3.0/k4a-float2-t.md) `target_point2d`

The 2d pixel coordinates in 
`target_camera`

`int *` `valid`

Takes a value of 1 if the transformation was successful and 0, otherwise

## Return Value
[`k4a_result_t`](~/api/0.3.0/k4a-result-t.md)

[K4A_RESULT_SUCCEEDED](~/api/0.3.0/k4a-result-t.md)
 if 
`target_point2d`
 was successfully written. 
[K4A_RESULT_FAILED](~/api/0.3.0/k4a-result-t.md)
 if 
`calibration`
 contained invalid transformation parameters.

## Remarks
This function allows generating a mapping between pixel coordinates of depth and color cameras. Internally, the function calls 
[k4a_transformation_2d_to_3d()](~/api/0.3.0/k4a-transformation-2d-to-3d.md)
 to compute the 3d point corresponding to 
`source_point2d`
 and to transform the resulting 3d point into the camera coordinate system of 
`target_camera`
. The function then calls 
[k4a_transformation_3d_to_2d()](~/api/0.3.0/k4a-transformation-3d-to-2d.md)
 to project this 3d point onto the image plane of 
`target_camera`
. If 
`source_camera`
 and 
`target_camera`
 are identical, the function immediately sets 
`target_point2d`
 to 
`source_point2d`
 and returns without computing any transformations. The parameter valid is to 0 if 
[k4a_transformation_2d_to_3d()](~/api/0.3.0/k4a-transformation-2d-to-3d.md)
 or 
[k4a_transformation_3d_to_2d()](~/api/0.3.0/k4a-transformation-3d-to-2d.md)
 return an invalid transformation. The user should not use the result of this transformation if 
`valid`
 was set to 0.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


