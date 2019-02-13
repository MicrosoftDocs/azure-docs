---
title: k4a_device_stop_imu function
description: Stops the K4A IMU. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_device_stop_imu function

Stops the K4A IMU. 

## Syntax

```C
void k4a_device_stop_imu(
    k4a_device_t device_handle
)
```
## Parameters

[`k4a_device_t`](~/api/0.3.0/k4a-device-t.md) `device_handle`

Handle obtained by 
[k4a_device_open()](~/api/0.3.0/k4a-device-open.md)

## Remarks
The streaming of the imu stops as a result of this call. Once called, 
[k4a_device_start_imu()](~/api/0.3.0/k4a-device-start-imu.md)
 may be called again to resume sensor streaming. It is ok to call the API twice, if the IMU is not running nothing will happen.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


