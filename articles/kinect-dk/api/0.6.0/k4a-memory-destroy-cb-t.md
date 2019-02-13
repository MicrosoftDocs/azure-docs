---
title: k4a_memory_destroy_cb_t typedef
description: callback function for a memory object being destroyed 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, typedef
---
# k4a_memory_destroy_cb_t typedef

callback function for a memory object being destroyed 

## Syntax

```C
typedef void() k4a_memory_destroy_cb_t(void *buffer, void *context);
```
## Parameters

`buffer`

The buffer pointer that was supplied by the caller in k4a_memory_description_t.

`context`

The context for the memory object that needs to be destroyed. This was given to k4a in k4a_memory_description_t.buffer_release_cb_context.

## Remarks
We all references for the memory object are released, this callback will be invoked as the final destroy for the given memory. 

