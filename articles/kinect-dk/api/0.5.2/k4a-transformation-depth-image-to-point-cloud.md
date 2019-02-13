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
k4a_buffer_result_t k4a_transformation_depth_image_to_point_cloud(
    k4a_transformation_t transformation_handle,
    const uint8_t * depth_image_data,
    const k4a_image_descriptor_t * depth_image_descriptor,
    const k4a_calibration_type_t camera,
    uint8_t * xyz_image_data,
    k4a_image_descriptor_t * xyz_image_descriptor
)
```
## Parameters

[`k4a_transformation_t`](~/api/0.5.2/k4a-transformation-t.md) `transformation_handle`

Handle to transformation context

`const uint8_t *` `depth_image_data`

Location to read depth image data

[`const k4a_image_descriptor_t *`](~/api/0.5.2/k4a-image-descriptor-t.md) `depth_image_descriptor`

Location to read depth image descriptor

[`const k4a_calibration_type_t`](~/api/0.5.2/k4a-calibration-type-t.md) `camera`

Geometry in which depth map was computed (depth or color camera)

`uint8_t *` `xyz_image_data`

Location to write the xyz image data

[`k4a_image_descriptor_t *`](~/api/0.5.2/k4a-image-descriptor-t.md) `xyz_image_descriptor`

Location to read/write xyz image descriptor

## Return Value
[`k4a_buffer_result_t`](~/api/0.5.2/k4a-buffer-result-t.md)

[K4A_BUFFER_RESULT_SUCCEEDED](~/api/0.5.2/k4a-buffer-result-t.md)
 if 
`xyz_image_data`
 was successfully written.
[K4A_BUFFER_RESULT_SUCCEEDED](~/api/0.5.2/k4a-buffer-result-t.md)
 if 
`xyz_image_data`
 was successfully written. If 
`xyz_image_descriptor`
 is different from the expected descriptor or if 
`xyz_image_data`
 is set to the NULL pointer, 
[K4A_BUFFER_RESULT_TOO_SMALL](~/api/0.5.2/k4a-buffer-result-t.md)
 is returned and 
`xyz_image_descriptor`
 is overwritten with the expected descriptor.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


