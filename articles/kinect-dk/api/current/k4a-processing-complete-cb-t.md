---
title: k4a_processing_complete_cb_t typedef
description: callback function for depth engine finishing processing 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, typedef
---
# k4a_processing_complete_cb_t typedef

callback function for depth engine finishing processing 

## Syntax

```C
typedef void() k4a_processing_complete_cb_t(void *context, int status, void *output_frame);
```
## Parameters

`context`

The context passed into k4a_de_process_frame_fn_t

`status`

The result of the processing. 0 is a success

`output_frame`

The final processed buffer passed back out to the user 

