---
title: k4a_transformation_3d_to_3d function
description: Transform a 3d point of a source coordinate system into a 3d point of the target coordinate system. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_transformation_3d_to_3d function

Transform a 3d point of a source coordinate system into a 3d point of the target coordinate system. 

## Syntax

```C
k4a_result_t k4a_transformation_3d_to_3d(
    const k4a_calibration_t * calibration,
    const k4a_float3_t * source_point3d,
    const k4a_calibration_type_t source_camera,
    const k4a_calibration_type_t target_camera,
    k4a_float3_t * target_point3d
)
```
## Parameters

[`const k4a_calibration_t *`](~/api/0.3.0/k4a-calibration-t.md) `calibration`

Location to read the camera calibration obtained by k4a_transformation_get_calibration().

[`const k4a_float3_t *`](~/api/0.3.0/k4a-float3-t.md) `source_point3d`

The 3d coordinates in millimeters representing a point in 
`source_camera`

[`const k4a_calibration_type_t`](~/api/0.3.0/k4a-calibration-type-t.md) `source_camera`

The current camera

[`const k4a_calibration_type_t`](~/api/0.3.0/k4a-calibration-type-t.md) `target_camera`

The target camera

[`k4a_float3_t *`](~/api/0.3.0/k4a-float3-t.md) `target_point3d`

The new 3d coordinates of the input point in 
`target_camera`

## Return Value
[`k4a_result_t`](~/api/0.3.0/k4a-result-t.md)

[K4A_RESULT_SUCCEEDED](~/api/0.3.0/k4a-result-t.md)
 if 
`target_point3d`
 was successfully written. 
[K4A_RESULT_FAILED](~/api/0.3.0/k4a-result-t.md)
 if 
`calibration`
 contained invalid transformation parameters.

## Remarks
This function is used to transform 3d points between depth and color camera coordinate systems. The function uses the extrinsic camera calibration. It computes the output via multiplication with a precomputed matrix encoding a 3d rotation and a 3d translation. The values 
`source_camera`
 and 
`target_point3d`
 can be identical in which case 
`target_point3d`
 will be identical to 
`source_point3d`
.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


