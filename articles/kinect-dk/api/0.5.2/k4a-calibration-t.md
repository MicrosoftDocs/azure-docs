---
title: k4a_calibration_t structure
description: Calibration contains the individual camera calibrations, the device configuration to identify image resolutions and the extrinsic transformation parameters to transform 3d points of the depth camera coordinate system into 3d points of the color camera coordinate system and vice versa. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, structure
---
# k4a_calibration_t structure

Calibration contains the individual camera calibrations, the device configuration to identify image resolutions and the extrinsic transformation parameters to transform 3d points of the depth camera coordinate system into 3d points of the color camera coordinate system and vice versa. 

## Syntax

```C
typedef struct {
    k4a_camera_calibration_t depth_camera_calibration;
    k4a_camera_calibration_t color_camera_calibration;
    k4a_calibration_extrinsics_t depth_to_color;
    k4a_calibration_extrinsics_t color_to_depth;
    k4a_depth_mode_t depth_mode;
    k4a_color_resolution_t color_resolution;
} k4a_calibration_t;
```
Can be extended to include IMU calibration

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Members

[`k4a_camera_calibration_t`](~/api/0.5.2/k4a-camera-calibration-t.md) `depth_camera_calibration`

depth camera calibration 

[`k4a_camera_calibration_t`](~/api/0.5.2/k4a-camera-calibration-t.md) `color_camera_calibration`

color camera calibration 

[`k4a_calibration_extrinsics_t`](~/api/0.5.2/k4a-calibration-extrinsics-t.md) `depth_to_color`

tranformation parameters from depth camera coordinates to color camera coordinates 

[`k4a_calibration_extrinsics_t`](~/api/0.5.2/k4a-calibration-extrinsics-t.md) `color_to_depth`

tranformation parameters from color camera coordinates to depth camera coordinates 

[`k4a_depth_mode_t`](~/api/0.5.2/k4a-depth-mode-t.md) `depth_mode`

depth camera mode for which calibration was obtained 

[`k4a_color_resolution_t`](~/api/0.5.2/k4a-color-resolution-t.md) `color_resolution`

color camera resolution for which calibration was obtained 

## Functions

|  Title | Description |
|--------|-------------|
| [k4a_calibration_2d_to_2d](~/api/0.5.2/k4a-calibration-2d-to-2d.md) | Transform a 2d pixel coordinate with an associated depth value of the source camera into a 2d pixel coordinate of the target camera.  |
| [k4a_calibration_2d_to_3d](~/api/0.5.2/k4a-calibration-2d-to-3d.md) | Transform a 2d pixel coordinate with an associated depth value of the source camera into a 3d point of the target coordinate system.  |
| [k4a_calibration_3d_to_2d](~/api/0.5.2/k4a-calibration-3d-to-2d.md) | Transform a 3d point of a source coordinate system into a 2d pixel coordinate of the target camera.  |
| [k4a_calibration_3d_to_3d](~/api/0.5.2/k4a-calibration-3d-to-3d.md) | Transform a 3d point of a source coordinate system into a 3d point of the target coordinate system.  |
| [k4a_transformation_create](~/api/0.5.2/k4a-transformation-create.md) | Get handle to transformation context.  |

