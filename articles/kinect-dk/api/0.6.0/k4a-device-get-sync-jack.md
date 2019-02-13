---
title: k4a_device_get_sync_jack function
description: Get the device jack status for the synchronization in and synchronization out connectors. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_device_get_sync_jack function

Get the device jack status for the synchronization in and synchronization out connectors. 

## Syntax

```C
k4a_result_t k4a_device_get_sync_jack(
    k4a_device_t device_handle,
    bool * sync_in_jack_connected,
    bool * sync_out_jack_connected
)
```
## Parameters

[`k4a_device_t`](~/api/0.6.0/k4a-device-t.md) `device_handle`

Handle obtained by 
[k4a_device_open()](~/api/0.6.0/k4a-device-open.md)
.

`bool *` `sync_in_jack_connected`

Upon successful return this value will be set to true if a cable is connected to this sync in jack.

`bool *` `sync_out_jack_connected`

Upon successful return this value will be set to true if a cable is connected to this sync out jack.

## Return Value
[`k4a_result_t`](~/api/0.6.0/k4a-result-t.md)

[K4A_RESULT_SUCCEEDED](~/api/0.6.0/k4a-result-t.md)
 if the connector status was successfully ready.

## Remarks
If sync_out_jack_connected is true then 
[k4a_device_configuration_t](~/api/0.6.0/k4a-device-configuration-t.md)
 wired_sync_mode mode can be set to 
[K4A_WIRED_SYNC_MODE_STANDALONE](~/api/0.6.0/k4a-wired-sync-mode-t.md)
 or 
[K4A_WIRED_SYNC_MODE_MASTER](~/api/0.6.0/k4a-wired-sync-mode-t.md)
. If sync_in_jack_connected is true then 
[k4a_device_configuration_t](~/api/0.6.0/k4a-device-configuration-t.md)
 wired_sync_mode mode can be set to 
[K4A_WIRED_SYNC_MODE_STANDALONE](~/api/0.6.0/k4a-wired-sync-mode-t.md)
 or 
[K4A_WIRED_SYNC_MODE_SUBORDINATE](~/api/0.6.0/k4a-wired-sync-mode-t.md)
.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


