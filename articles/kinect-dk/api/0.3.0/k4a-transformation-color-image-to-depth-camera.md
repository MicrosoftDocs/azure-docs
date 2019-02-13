---
title: k4a_transformation_color_image_to_depth_camera function
description: Transforms the color image into the geometry of the depth camera. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_transformation_color_image_to_depth_camera function

Transforms the color image into the geometry of the depth camera. 

## Syntax

```C
k4a_buffer_result_t k4a_transformation_color_image_to_depth_camera(
    const k4a_calibration_t * calibration,
    const k4a_transformation_xy_tables_t * xy_tables_depth_camera,
    const uint8_t * depth_image,
    const size_t depth_image_size,
    const uint8_t * color_image,
    const size_t color_image_size,
    uint8_t * transformed_color_image,
    size_t * transformed_color_image_size
)
```
## Parameters

[`const k4a_calibration_t *`](~/api/0.3.0/k4a-calibration-t.md) `calibration`

Location to read calibration obtained from 
[k4a_device_get_calibration()](~/api/0.3.0/k4a-device-get-calibration.md)

[`const k4a_transformation_xy_tables_t *`](~/api/0.3.0/k4a-transformation-xy-tables-t.md) `xy_tables_depth_camera`

Structure providing access to the x and y tables for the depth camera obtained by 
[k4a_transformation_get_xy_tables()](~/api/0.3.0/k4a-transformation-get-xy-tables.md)

`const uint8_t *` `depth_image`

Location to read depth camera image data

`const size_t` `depth_image_size`

Size of the depth image in bytes

`const uint8_t *` `color_image`

Location to read color camera image data

`const size_t` `color_image_size`

Size of the color image in bytes

`uint8_t *` `transformed_color_image`

Location to write the transformed color image

`size_t *` `transformed_color_image_size`

Size of the transformed color image in bytes.

## Return Value
[`k4a_buffer_result_t`](~/api/0.3.0/k4a-buffer-result-t.md)

[K4A_BUFFER_RESULT_SUCCEEDED](~/api/0.3.0/k4a-buffer-result-t.md)
 if 
`transformed_color_image`
 was successfully written. If 
`transformed_color_image_size`
 points to a buffer size that is too small to hold the output or if 
`transformed_color_image`
 is set to the NULL pointer, 
[K4A_BUFFER_RESULT_TOO_SMALL](~/api/0.3.0/k4a-buffer-result-t.md)
 is returned and 
`transformed_color_image_size`
 is updated to contain the minimum buffer size needed to capture 
`transformed_color_image`
.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


