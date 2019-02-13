---
title: k4a_device_get_raw_calibration function
description: Get the raw calibration blob for the entire K4A device. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_device_get_raw_calibration function

Get the raw calibration blob for the entire K4A device. 

## Syntax

```C
k4a_buffer_result_t k4a_device_get_raw_calibration(
    k4a_device_t device_handle,
    uint8_t * data,
    size_t * data_size
)
```
## Parameters

[`k4a_device_t`](~/api/0.2.0/k4a-device-t.md) `device_handle`

Handle obtained by 
[k4a_device_open()](~/api/0.2.0/k4a-device-open.md)
.

`uint8_t *` `data`

Location to write the calibration data to. This field may optionally be set to NULL if the caller wants to query for the needed data size.

`size_t *` `data_size`

On passing 
`data_size`
 into the function this variable represents the available size to write the raw data to. On return this variable is updated with the amount of data actually written to the buffer.

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


