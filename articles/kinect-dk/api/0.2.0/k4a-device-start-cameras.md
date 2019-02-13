---
title: k4a_device_start_cameras function
description: Starts the K4A device. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_device_start_cameras function

Starts the K4A device. 

## Syntax

```C
k4a_result_t k4a_device_start_cameras(
    k4a_device_t device_handle,
    k4a_device_configuration_t * config
)
```
## Parameters

[`k4a_device_t`](~/api/0.2.0/k4a-device-t.md) `device_handle`

Handle obtained by 
[k4a_device_open()](~/api/0.2.0/k4a-device-open.md)

[`k4a_device_configuration_t *`](~/api/0.2.0/k4a-device-configuration-t.md) `config`

The configuration we want to run the device in. This can be initialized with K4A_DEVICE_CONFIG_INIT_DISABLE_ALL.

## Return Value
[`k4a_result_t`](~/api/0.2.0/k4a-result-t.md)

K4A_RESULT_SUCCEEDED is returned on success

## Remarks
Individual sensors configured to run will now start stream capture data.

It is not valid to call 
[k4a_device_start_cameras()](~/api/0.2.0/k4a-device-start-cameras.md)
 a second time on the same 
[k4a_device_t](~/api/0.2.0/k4a-device-t.md)
 until 
[k4a_device_stop_cameras()](~/api/0.2.0/k4a-device-stop-cameras.md)
 has been called.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


