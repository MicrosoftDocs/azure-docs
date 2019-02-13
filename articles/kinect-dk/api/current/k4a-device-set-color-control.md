---
title: k4a_device_set_color_control function
description: Set the K4A color sensor control value. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_device_set_color_control function

Set the K4A color sensor control value. 

## Syntax

```C
k4a_result_t k4a_device_set_color_control(
    k4a_device_t device_handle,
    k4a_color_control_command_t command,
    k4a_color_control_mode_t mode,
    int32_t value
)
```
## Parameters

[`k4a_device_t`](~/api/current/k4a-device-t.md) `device_handle`

Handle obtained by 
[k4a_device_open()](~/api/current/k4a-device-open.md)

[`k4a_color_control_command_t`](~/api/current/k4a-color-control-command-t.md) `command`

Color sensor control command

[`k4a_color_control_mode_t`](~/api/current/k4a-color-control-mode-t.md) `mode`

Color sensor control mode (auto / manual)

`int32_t` `value`

Color sensor control value. Only valid when mode is manual

## Return Value
[`k4a_result_t`](~/api/current/k4a-result-t.md)

K4A_RESULT_SUCCEEDED if the value was successfully set, K4A_RESULT_FAILED if an error occurred

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


