---
title: k4a_device_close function
description: Closes a k4a device. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_device_close function

Closes a k4a device. 

## Syntax

```C
void k4a_device_close(
    k4a_device_t device_handle
)
```
## Parameters

[`k4a_device_t`](~/api/0.6.0/k4a-device-t.md) `device_handle`

Handle obtained by 
[k4a_device_open()](~/api/0.6.0/k4a-device-open.md)

## Remarks
Once closed, the handle is no longer valid.

Before closing the handle to the device, ensure that all 
[k4a_capture_t](~/api/0.6.0/k4a-capture-t.md)
 captures have been released with 
[k4a_capture_release()](~/api/0.6.0/k4a-capture-release.md)

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


