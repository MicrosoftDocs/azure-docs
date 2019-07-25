---
title: Azure Kinect body index map
description: Using body index maps
author: qm13
ms.author: quentinm
ms.reviewer: yijwan
ms.prod: kinect-dk
ms.date: 06/26/2019
ms.topic: conceptual
keywords: kinect, porting, body, tracking, index, segmentation, map
---

# Azure Kinect body tracking index map

The body index map includes the instance segmentation map for each body in the depth camera capture. Each pixel maps to the corresponding pixel in the depth or IR image. The value for each pixel represents which body the pixel belongs to. It can be either background (value `K4ABT_BODY_INDEX_MAP_BACKGROUND`) or the index of a detected `k4abt_body_t`.

![Body index map example](./media/concepts/body-index-map.png)

>[!NOTE]
> The body index is different than the body id. You can query the body id from a given body index by calling API: [k4abt_frame_get_body_id()](https://microsoft.github.io/Azure-Kinect-Body-Tracking/release/0.9.x/group__btfunctions_ga673def22c3e3d4683a5702d8fe3cdc5e.html#ga673def22c3e3d4683a5702d8fe3cdc5e).


## Using body index map

The body index map is stored as a `k4a_image_t` and has the same resolution as the depth or IR image. Each pixel is an 8-bit value. It can be queried from a `k4abt_frame_t` by calling `k4abt_frame_get_body_index_map`. The developer is responsible for releasing the memory for the body index map by calling `k4a_image_release()`.

## Next steps

[Build your first body tracking app](build-first-body-app.md)
