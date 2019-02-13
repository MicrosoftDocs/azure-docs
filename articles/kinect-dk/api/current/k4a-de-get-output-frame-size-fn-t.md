---
title: k4a_de_get_output_frame_size_fn_t typedef
description: Get the size of the output frame in bytes. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, typedef
---
# k4a_de_get_output_frame_size_fn_t typedef

Get the size of the output frame in bytes. 

## Syntax

```C
typedef size_t( * k4a_de_get_output_frame_size_fn_t) (k4a_depth_engine_context_t *context);
```
## Parameters

`context`

context created by 
[k4a_de_create_and_initialize_fn_t](~/api/current/k4a-de-create-and-initialize-fn-t.md)

## Return Value

The size of the output frame in bytes (or 0 if passed a null context) 

