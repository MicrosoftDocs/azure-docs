---
title: k4a_capture_set_temperature_c function
description: Set the temperature associated with the capture. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_capture_set_temperature_c function

Set the temperature associated with the capture. 

## Syntax

```C
void k4a_capture_set_temperature_c(
    k4a_capture_t capture_handle,
    float temperature_c
)
```
## Parameters

[`k4a_capture_t`](~/api/0.6.0/k4a-capture-t.md) `capture_handle`

Capture handle for the temperature to modify

`float` `temperature_c`

Temperature in Kelvin to store.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


