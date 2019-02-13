---
title: k4a_transformation_depth_image_to_color_camera function
description: Transforms the depth map into the geometry of the color camera. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_transformation_depth_image_to_color_camera function

Transforms the depth map into the geometry of the color camera. 

## Syntax

```C
k4a_buffer_result_t k4a_transformation_depth_image_to_color_camera(
    k4a_transformation_t transformation_handle,
    const uint8_t * depth_image_data,
    const k4a_image_descriptor_t * depth_image_descriptor,
    uint8_t * transformed_depth_image_data,
    k4a_image_descriptor_t * transformed_depth_image_descriptor
)
```
## Parameters

[`k4a_transformation_t`](~/api/0.5.2/k4a-transformation-t.md) `transformation_handle`

Handle to transformation context

`const uint8_t *` `depth_image_data`

Location to read depth image data

[`const k4a_image_descriptor_t *`](~/api/0.5.2/k4a-image-descriptor-t.md) `depth_image_descriptor`

Location to read depth image descriptor

`uint8_t *` `transformed_depth_image_data`

Location to write transformed depth image

[`k4a_image_descriptor_t *`](~/api/0.5.2/k4a-image-descriptor-t.md) `transformed_depth_image_descriptor`

Location to read/write transformed depth image descriptor

## Return Value
[`k4a_buffer_result_t`](~/api/0.5.2/k4a-buffer-result-t.md)

[K4A_BUFFER_RESULT_SUCCEEDED](~/api/0.5.2/k4a-buffer-result-t.md)
 if 
`transformed_depth_image_data`
 was successfully written. If 
`transformed_depth_image_descriptor`
 is different from the expected descriptor or if 
`transformed_depth_image_data`
 is set to the NULL pointer, 
[K4A_BUFFER_RESULT_TOO_SMALL](~/api/0.5.2/k4a-buffer-result-t.md)
 is returned and 
`transformed_depth_image_descriptor`
 is overwritten with the expected descriptor.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


