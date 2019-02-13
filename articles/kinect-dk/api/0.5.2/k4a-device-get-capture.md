---
title: k4a_device_get_capture function
description: Reads a sensor capture. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_device_get_capture function

Reads a sensor capture. 

## Syntax

```C
k4a_wait_result_t k4a_device_get_capture(
    k4a_device_t device_handle,
    k4a_capture_t * capture_handle,
    int32_t timeout_in_ms
)
```
## Parameters

[`k4a_device_t`](~/api/0.5.2/k4a-device-t.md) `device_handle`

Handle obtained by 
[k4a_device_open()](~/api/0.5.2/k4a-device-open.md)
.

[`k4a_capture_t *`](~/api/0.5.2/k4a-capture-t.md) `capture_handle`

If successful this contains a handle to a capture object. Caller must call 
[k4a_capture_release()](~/api/0.5.2/k4a-capture-release.md)
 when its done using this capture

`int32_t` `timeout_in_ms`

Specifies the time in milliseconds the function should block waiting for the capture. 0 is a check of the queue without blocking. Passing a value of 
[K4A_WAIT_INFINITE](~/api/0.5.2/K4A-WAIT-INFINITE.md)
 will blocking indefinitely.

## Return Value
[`k4a_wait_result_t`](~/api/0.5.2/k4a-wait-result-t.md)

[K4A_WAIT_RESULT_SUCCEEDED](~/api/0.5.2/k4a-wait-result-t.md)
 if a capture is returned. If a capture is not available before the timeout elapses, the function will return 
[K4A_WAIT_RESULT_TIMEOUT](~/api/0.5.2/k4a-wait-result-t.md)
. All other failures will return 
[K4A_WAIT_RESULT_FAILED](~/api/0.5.2/k4a-wait-result-t.md)
.

## Remarks
Gets the next capture in the streamed sequence of captures from the camera. If a new capture is not currently available, this function will block up until the timeout is reached. The SDK will buffer at least two captures worth of data before dropping the oldest capture. Callers needing to capture all data need to ensure they call this function at least once per capture interval on average. Capture data read must call 
[k4a_capture_release()](~/api/0.5.2/k4a-capture-release.md)
 to return the allocated memory to the SDK.

Upon successfully reading a capture this function will return success and populate 
`capture`
. If a capture is not available in the configured 
`timeout_in_ms`
, then the API will return 
[K4A_WAIT_RESULT_TIMEOUT](~/api/0.5.2/k4a-wait-result-t.md)
.

This function returns an error when an internal problem is encountered; such as lost of the USB connection, low memory condition, and other unexpected issues. Once an error is returned the API will continue to return an error until 
[k4a_device_stop_cameras()](~/api/0.5.2/k4a-device-stop-cameras.md)
 is called to clear the condition.

If this function is waiting for data (non-zero timeout) when 
[k4a_device_stop_cameras()](~/api/0.5.2/k4a-device-stop-cameras.md)
 or 
[k4a_device_close()](~/api/0.5.2/k4a-device-close.md)
 is called, this function will return an error. This function needs to be called while the device is in a running state; after 
[k4a_device_start_cameras()](~/api/0.5.2/k4a-device-start-cameras.md)
 is called and before 
[k4a_device_stop_cameras()](~/api/0.5.2/k4a-device-stop-cameras.md)
 is called.

## Return Value
[`k4a_wait_result_t`](~/api/0.5.2/k4a-wait-result-t.md)

[K4A_WAIT_RESULT_SUCCEEDED](~/api/0.5.2/k4a-wait-result-t.md)
 if a capture is returned. If a capture is not available before the timeout elapses, the function will return 
[K4A_WAIT_RESULT_TIMEOUT](~/api/0.5.2/k4a-wait-result-t.md)
. All other failures will return 
[K4A_WAIT_RESULT_FAILED](~/api/0.5.2/k4a-wait-result-t.md)
.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


