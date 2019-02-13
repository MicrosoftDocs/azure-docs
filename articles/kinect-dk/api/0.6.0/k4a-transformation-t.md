---
title: k4a_transformation_t handle
description: Handle to a k4a transformation context. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, handle
---
# k4a_transformation_t handle

Handle to a k4a transformation context. 

## Syntax

```C
typedef struct { } k4a_transformation_t;
```
Handles are created with k4a_device_get_transformation_context() and closed with k4a_transformation_context_release(). Invalid handles are set to 0.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Functions

|  Title | Description |
|--------|-------------|
| [k4a_transformation_color_image_to_depth_camera](~/api/0.6.0/k4a-transformation-color-image-to-depth-camera.md) | Transforms the color image into the geometry of the depth camera.  |
| [k4a_transformation_depth_image_to_color_camera](~/api/0.6.0/k4a-transformation-depth-image-to-color-camera.md) | Transforms the depth map into the geometry of the color camera.  |
| [k4a_transformation_depth_image_to_point_cloud](~/api/0.6.0/k4a-transformation-depth-image-to-point-cloud.md) | Transforms the depth image into 3 planar images representing X, Y and Z-coordinates of corresponding 3d points.  |
| [k4a_transformation_destroy](~/api/0.6.0/k4a-transformation-destroy.md) | Destroy transformation context.  |

