---
title: k4a_camera_calibration_t structure
description: Camera calibration contains intrinsic and extrinsic calibration information. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, structure
---
# k4a_camera_calibration_t structure

Camera calibration contains intrinsic and extrinsic calibration information. 

## Syntax

```C
typedef struct {
    k4a_calibration_extrinsics_t extrinsics;
    k4a_calibration_intrinsics_t intrinsics;
    int resolution_width;
    int resolution_height;
    float metric_radius;
} k4a_camera_calibration_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Members

[`k4a_calibration_extrinsics_t`](~/api/0.3.0/k4a-calibration-extrinsics-t.md) `extrinsics`

extrinsic calibration data 

[`k4a_calibration_intrinsics_t`](~/api/0.3.0/k4a-calibration-intrinsics-t.md) `intrinsics`

intrinsic calibration data 

`int` `resolution_width`

resolution width of the calibration sensor 

`int` `resolution_height`

resolution height of the calibration sensor 

`float` `metric_radius`

max FOV of the camera 

