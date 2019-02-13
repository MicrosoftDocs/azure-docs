---
title: k4a_device_stop_cameras function
description: Stops the K4A device. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_device_stop_cameras function

Stops the K4A device. 

## Syntax

```C
void k4a_device_stop_cameras(
    k4a_device_t device_handle
)
```
## Parameters

[`k4a_device_t`](~/api/0.6.0/k4a-device-t.md) `device_handle`

Handle obtained by 
[k4a_device_open()](~/api/0.6.0/k4a-device-open.md)

## Remarks
The streaming of individual sensors stops as a result of this call. Once called, 
[k4a_device_start_cameras()](~/api/0.6.0/k4a-device-start-cameras.md)
 may be called again to resume sensor streaming.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


