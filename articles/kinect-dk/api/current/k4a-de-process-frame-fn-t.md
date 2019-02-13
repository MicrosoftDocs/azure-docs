---
title: k4a_de_process_frame_fn_t typedef
description: Function to process depth frame. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, typedef
---
# k4a_de_process_frame_fn_t typedef

Function to process depth frame. 

## Syntax

```C
typedef k4a_depth_engine_result_code_t( * k4a_de_process_frame_fn_t) (k4a_depth_engine_context_t *context, void *input_frame, size_t input_frame_size, k4a_depth_engine_output_type_t output_type, void *output_frame, size_t output_frame_size, k4a_depth_engine_output_frame_info_t *output_frame_info, k4a_depth_engine_input_frame_info_t *input_frame_info);
```
## Parameters

`context`

context created by 
[k4a_de_create_and_initialize_fn_t](~/api/current/k4a-de-create-and-initialize-fn-t.md)

`input_frame`

Frame buffer containing depth engine data

`input_frame_size`

Size of of the input_frame buffer

`output_type`

The type of frame the depth engine should output

`output_frame`

The buffer of the outputted frame

`output_frame_size`

The size of the output_frame buffer

`output_frame_info`

TODO

`input_frame_info`

TODO

## Return Value

K4A_DEPTH_ENGINE_RESULT_SUCCEEDED on success, or the proper failure code on failure 

