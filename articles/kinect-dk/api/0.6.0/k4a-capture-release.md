---
title: k4a_capture_release function
description: Release a capture back to the SDK. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_capture_release function

Release a capture back to the SDK. 

## Syntax

```C
void k4a_capture_release(
    k4a_capture_t capture_handle
)
```
## Parameters

[`k4a_capture_t`](~/api/0.6.0/k4a-capture-t.md) `capture_handle`

capture to return to SDK

## Remarks
Called when the user is finished using the capture. All captures must be released prior to calling 
[k4a_device_close()](~/api/0.6.0/k4a-device-close.md)
, not doing so will result in undefined behavior.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


