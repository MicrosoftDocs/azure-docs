---
title: k4a_de_destroy_fn_t typedef
description: Destroys the depth engine context. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, typedef
---
# k4a_de_destroy_fn_t typedef

Destroys the depth engine context. 

## Syntax

```C
typedef void( * k4a_de_destroy_fn_t) (k4a_depth_engine_context_t **context);
```
## Parameters

`context`

context created by 
[k4a_de_create_and_initialize_fn_t](~/api/current/k4a-de-create-and-initialize-fn-t.md)

