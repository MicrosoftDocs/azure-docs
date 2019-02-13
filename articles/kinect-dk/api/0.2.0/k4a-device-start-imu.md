---
title: k4a_device_start_imu function
description: Starts the K4A IMU. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_device_start_imu function

Starts the K4A IMU. 

## Syntax

```C
k4a_result_t k4a_device_start_imu(
    k4a_device_t device_handle
)
```
## Parameters

[`k4a_device_t`](~/api/0.2.0/k4a-device-t.md) `device_handle`

Handle obtained by 
[k4a_device_open()](~/api/0.2.0/k4a-device-open.md)

## Return Value
[`k4a_result_t`](~/api/0.2.0/k4a-result-t.md)

K4A_RESULT_SUCCEEDED is returned on success. 
[K4A_RESULT_FAILED](~/api/0.2.0/k4a-result-t.md)
 if the sensor is already running or a failure is encountered

## Remarks
Call this API to start streaming IMU data. It is not valid to call this API a 2nd time without calling stop after the first call.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


