---
title: k4a_device_open function
description: Open a k4a device. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_device_open function

Open a k4a device. 

## Syntax

```C
k4a_result_t k4a_device_open(
    uint8_t index,
    k4a_device_t * device_handle
)
```
## Parameters

`uint8_t` `index`

The index of the device to open, starting with 0. Optionally pass in 
[K4A_DEVICE_DEFAULT](~/api/0.6.0/K4A-DEVICE-DEFAULT.md)
.

[`k4a_device_t *`](~/api/0.6.0/k4a-device-t.md) `device_handle`

Output parameter which on success will return a handle to the device

## Return Value
[`k4a_result_t`](~/api/0.6.0/k4a-result-t.md)

[K4A_RESULT_SUCCEEDED](~/api/0.6.0/k4a-result-t.md)
 if the device was opened successfully

## Remarks
If successful, 
[k4a_device_open()](~/api/0.6.0/k4a-device-open.md)
 will return a device handle in the device parameter. This handle grants exclusive access to the device and may be used in the other k4a API calls.

When done with the device, close the handle with 
[k4a_device_close()](~/api/0.6.0/k4a-device-close.md)

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


