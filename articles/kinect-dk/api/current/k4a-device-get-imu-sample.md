---
title: k4a_device_get_imu_sample function
description: Reads a imu sample. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_device_get_imu_sample function

Reads a imu sample. 

## Syntax

```C
k4a_wait_result_t k4a_device_get_imu_sample(
    k4a_device_t device_handle,
    k4a_imu_sample_t * imu_sample,
    int32_t timeout_in_ms
)
```
## Parameters

[`k4a_device_t`](~/api/current/k4a-device-t.md) `device_handle`

Handle obtained by 
[k4a_device_open()](~/api/current/k4a-device-open.md)
.

[`k4a_imu_sample_t *`](~/api/current/k4a-imu-sample-t.md) `imu_sample`

[out] pointer to a location to write the IMU sample to

`int32_t` `timeout_in_ms`

Specifies the time in milliseconds the function should block waiting for the capture. 0 is a check of the queue without blocking. Passing a value of 
[K4A_WAIT_INFINITE](~/api/current/K4A-WAIT-INFINITE.md)
 will blocking indefinitely.

## Return Value
[`k4a_wait_result_t`](~/api/current/k4a-wait-result-t.md)

[K4A_WAIT_RESULT_SUCCEEDED](~/api/current/k4a-wait-result-t.md)
 if a capture is returned. If a capture is not available before the timeout elapses, the function will return 
[K4A_WAIT_RESULT_TIMEOUT](~/api/current/k4a-wait-result-t.md)
. All other failures will return 
[K4A_WAIT_RESULT_FAILED](~/api/current/k4a-wait-result-t.md)
.

## Remarks
Gets the next sample in the streamed sequence of samples from the device. If a new sample is not currently available, this function will block up until the timeout is reached. The SDK will buffer at least two samples worth of data before dropping the oldest sample. Callers needing to see all data must ensure they call this function at least once per IMU sample interval on average.

Upon successfully reading a sample this function will return success and populate 
`imu_sample`
. If a sample is not available in the configured 
`timeout_in_ms`
, then the API will return 
[K4A_WAIT_RESULT_TIMEOUT](~/api/current/k4a-wait-result-t.md)
.

This function returns an error when an internal problem is encountered; such as loss of the USB connection, low memory condition, and other unexpected issues. Once an error is returned, the API will continue to return an error until 
[k4a_device_stop_imu()](~/api/current/k4a-device-stop-imu.md)
 is called to clear the condition.

If this function is waiting for data (non-zero timeout) when 
[k4a_device_stop_imu()](~/api/current/k4a-device-stop-imu.md)
 or 
[k4a_device_close()](~/api/current/k4a-device-close.md)
 is called, this function will return an error. This function needs to be called while the device is in a running state; after 
[k4a_device_start_imu()](~/api/current/k4a-device-start-imu.md)
 is called and before 
[k4a_device_stop_imu()](~/api/current/k4a-device-stop-imu.md)
 is called.

There is no need to free the imu_sample after using imu_sample.

## Return Value
[`k4a_wait_result_t`](~/api/current/k4a-wait-result-t.md)

[K4A_WAIT_RESULT_SUCCEEDED](~/api/current/k4a-wait-result-t.md)
 if a capture is returned. If a capture is not available before the timeout elapses, the function will return 
[K4A_WAIT_RESULT_TIMEOUT](~/api/current/k4a-wait-result-t.md)
. All other failures will return 
[K4A_WAIT_RESULT_FAILED](~/api/current/k4a-wait-result-t.md)
.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


