---
title: k4a_transformation_create function
description: Get handle to transformation context. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_transformation_create function

Get handle to transformation context. 

## Syntax

```C
k4a_transformation_t k4a_transformation_create(
    const k4a_calibration_t * calibration
)
```
## Parameters

[`const k4a_calibration_t *`](~/api/0.6.0/k4a-calibration-t.md) `calibration`

Location to read calibration obtained by 
[k4a_device_get_calibration()](~/api/0.6.0/k4a-device-get-calibration.md)
.

## Return Value
[`k4a_transformation_t`](~/api/0.6.0/k4a-transformation-t.md)

Location of handle to the transformation context. A null pointer is returned if creation fails.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


