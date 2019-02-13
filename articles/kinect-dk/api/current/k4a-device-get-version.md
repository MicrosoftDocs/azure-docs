---
title: k4a_device_get_version function
description: Get the version numbers of the K4A sub systems. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_device_get_version function

Get the version numbers of the K4A sub systems. 

## Syntax

```C
k4a_result_t k4a_device_get_version(
    k4a_device_t device_handle,
    k4a_hardware_version_t * version
)
```
## Parameters

[`k4a_device_t`](~/api/current/k4a-device-t.md) `device_handle`

Handle obtained by 
[k4a_device_open()](~/api/current/k4a-device-open.md)

[`k4a_hardware_version_t *`](~/api/current/k4a-hardware-version-t.md) `version`

Location to write the version info to

## Return Value
[`k4a_result_t`](~/api/current/k4a-result-t.md)

A return of 
[K4A_RESULT_SUCCEEDED](~/api/current/k4a-result-t.md)
 means that the version structure has been filled in. All other failures return 
[K4A_RESULT_FAILED](~/api/current/k4a-result-t.md)
.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


