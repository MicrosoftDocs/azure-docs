---
title: k4a_transformation_get_xy_tables function
description: Get tables used to compute X and Y 3D coordinates. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_transformation_get_xy_tables function

Get tables used to compute X and Y 3D coordinates. 

## Syntax

```C
k4a_buffer_result_t k4a_transformation_get_xy_tables(
    const k4a_calibration_t * calibration,
    const k4a_calibration_type_t camera,
    float * data,
    size_t * data_size,
    k4a_transformation_xy_tables_t * xy_tables
)
```
## Parameters

[`const k4a_calibration_t *`](~/api/0.2.0/k4a-calibration-t.md) `calibration`

Location to read calibration obtained from 
[k4a_device_get_calibration()](~/api/0.2.0/k4a-device-get-calibration.md)
.

[`const k4a_calibration_type_t`](~/api/0.2.0/k4a-calibration-type-t.md) `camera`

Camera for which tables are computed (depth or color camera)

`float *` `data`

Location to write the tables to. This field may optionally be set to NULL if the caller wants to query for the needed data size.

`size_t *` `data_size`

On passing 
`data_size`
 into the function this variable represents the available size to write the raw data to. On return this variable is updated with the amount of data actually written to the buffer.

[`k4a_transformation_xy_tables_t *`](~/api/0.2.0/k4a-transformation-xy-tables-t.md) `xy_tables`

Structure providing access to the x and y tables.

## Return Value
[`k4a_buffer_result_t`](~/api/0.2.0/k4a-buffer-result-t.md)

[K4A_BUFFER_RESULT_SUCCEEDED](~/api/0.2.0/k4a-buffer-result-t.md)
 if 
`data`
 was successfully written. If 
`data_size`
 points to a buffer size that is too small to hold the output, 
[K4A_BUFFER_RESULT_TOO_SMALL](~/api/0.2.0/k4a-buffer-result-t.md)
 is returned and 
`data_size`
 is updated to contain the minimum buffer size needed to capture the calibration data.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


