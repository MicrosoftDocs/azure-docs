---
title: k4a_device_get_calibration function
description: Get the camera calibration for the entire K4A device. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_device_get_calibration function

Get the camera calibration for the entire K4A device. 

## Syntax

```C
k4a_result_t k4a_device_get_calibration(
    k4a_device_t device_handle,
    const k4a_depth_mode_t depth_mode,
    const k4a_color_resolution_t color_resolution,
    k4a_calibration_t * calibration
)
```
The output struct is used as input to all transformation functions.
## Parameters

[`k4a_device_t`](~/api/0.5.2/k4a-device-t.md) `device_handle`

Handle obtained by 
[k4a_device_open()](~/api/0.5.2/k4a-device-open.md)
.

[`const k4a_depth_mode_t`](~/api/0.5.2/k4a-depth-mode-t.md) `depth_mode`

Mode in which depth camera is operated.

[`const k4a_color_resolution_t`](~/api/0.5.2/k4a-color-resolution-t.md) `color_resolution`

Resolution in which color camera is operated

[`k4a_calibration_t *`](~/api/0.5.2/k4a-calibration-t.md) `calibration`

Location to write the calibration

## Return Value
[`k4a_result_t`](~/api/0.5.2/k4a-result-t.md)

[K4A_RESULT_SUCCEEDED](~/api/0.5.2/k4a-result-t.md)
 if 
`calibration`
 was successfully written. 
[K4A_RESULT_FAILED](~/api/0.5.2/k4a-result-t.md)
 otherwise.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


