---
title: k4a_calibration_get_from_raw function
description: Get the camera calibration for a device from a raw calibration blob. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_calibration_get_from_raw function

Get the camera calibration for a device from a raw calibration blob. 

## Syntax

```C
k4a_result_t k4a_calibration_get_from_raw(
    char * raw_calibration,
    const k4a_depth_mode_t depth_mode,
    const k4a_color_resolution_t color_resolution,
    k4a_calibration_t * calibration
)
```
## Parameters

`char *` `raw_calibration`

Raw calibration blob obtained from a device or recording.

[`const k4a_depth_mode_t`](~/api/0.6.0/k4a-depth-mode-t.md) `depth_mode`

Mode in which depth camera is operated.

[`const k4a_color_resolution_t`](~/api/0.6.0/k4a-color-resolution-t.md) `color_resolution`

Resolution in which color camera is operated

[`k4a_calibration_t *`](~/api/0.6.0/k4a-calibration-t.md) `calibration`

Location to write the calibration

## Return Value
[`k4a_result_t`](~/api/0.6.0/k4a-result-t.md)

[K4A_RESULT_SUCCEEDED](~/api/0.6.0/k4a-result-t.md)
 if 
`calibration`
 was successfully written. 
[K4A_RESULT_FAILED](~/api/0.6.0/k4a-result-t.md)
 otherwise.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


