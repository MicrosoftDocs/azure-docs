---
title: k4a_imu_sample_t structure
description: IMU frame structure. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, structure
---
# k4a_imu_sample_t structure

IMU frame structure. 

## Syntax

```C
typedef struct {
    float temperature;
    k4a_float3_t acc_sample;
    uint64_t acc_timestamp_usec;
    k4a_float3_t gyro_sample;
    uint64_t gyro_timestamp_usec;
} k4a_imu_sample_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Members

`float` `temperature`

Temperature reading of this sample (Celsius) 

[`k4a_float3_t`](~/api/0.5.2/k4a-float3-t.md) `acc_sample`

accelerometer sample in G's 

`uint64_t` `acc_timestamp_usec`

timestamp in uSec 

[`k4a_float3_t`](~/api/0.5.2/k4a-float3-t.md) `gyro_sample`

gyro sample in degree's per second 

`uint64_t` `gyro_timestamp_usec`

timestamp in uSec 

