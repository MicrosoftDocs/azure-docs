---
title: k4a_capture_get_temperature function
description: Get the temperature of the sensor at capture time. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_capture_get_temperature function

Get the temperature of the sensor at capture time. 

## Syntax

```C
float k4a_capture_get_temperature(
    k4a_capture_t capture_handle
)
```
## Parameters

[`k4a_capture_t`](~/api/0.3.0/k4a-capture-t.md) `capture_handle`

Handle to a capture returned by 
[k4a_device_get_capture()](~/api/0.3.0/k4a-device-get-capture.md)
.

## Return Value
`float`

Temperature in Celsius

## Remarks
Called when the user has received a capture handle and wants to access the temperature. User must call 
[k4a_capture_release()](~/api/0.3.0/k4a-capture-release.md)
 to when done with the capture.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


