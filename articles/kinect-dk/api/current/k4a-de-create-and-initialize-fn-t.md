---
title: k4a_de_create_and_initialize_fn_t typedef
description: Function for creating and initialzing the depth engine. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, typedef
---
# k4a_de_create_and_initialize_fn_t typedef

Function for creating and initialzing the depth engine. 

## Syntax

```C
typedef k4a_depth_engine_result_code_t( * k4a_de_create_and_initialize_fn_t) (k4a_depth_engine_context_t **context, size_t cal_block_size_in_bytes, void *cal_block, k4a_depth_engine_mode_t mode, k4a_depth_engine_input_type_t input_format, void *camera_calibration, k4a_processing_complete_cb_t *callback, void *callback_context);
```
## Parameters

`context`

An opaque pointer to be passed around to the rest of the depth engine calls.

`cal_block_size_in_bytes`

Size of the calibration block being passed in

`cal_block`

The cal_block being passed into the device

`mode`

The 
[k4a_depth_engine_mode_t](~/api/current/k4a-depth-engine-mode-t.md)
 to initialize the depth engine

`input_format`

The 
[k4a_depth_engine_input_type_t](~/api/current/k4a-depth-engine-input-type-t.md)
 being passed into this depth engine

`camera_calibration`

Camera calibration blob

`callback`

Callback to call when processing is complete

`callback_context`

An optional context to be passed back to the callback

## Return Value

K4A_DEPTH_ENGINE_RESULT_SUCCEEDED on success, or the proper failure code on failure 

