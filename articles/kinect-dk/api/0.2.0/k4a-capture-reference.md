---
title: k4a_capture_reference function
description: Add a reference to a capture. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_capture_reference function

Add a reference to a capture. 

## Syntax

```C
void k4a_capture_reference(
    k4a_capture_t capture_handle
)
```
## Parameters

[`k4a_capture_t`](~/api/0.2.0/k4a-capture-t.md) `capture_handle`

capture to add a reference to

## Remarks
Called when the user wants to add an additional reference to a capture. This reference must be removed with 
[k4a_capture_release()](~/api/0.2.0/k4a-capture-release.md)
 to allow the capture to be released.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


