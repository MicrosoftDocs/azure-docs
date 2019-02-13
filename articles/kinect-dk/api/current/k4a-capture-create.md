---
title: k4a_capture_create function
description: create an empty capture object 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_capture_create function

create an empty capture object 

## Syntax

```C
k4a_result_t k4a_capture_create(
    k4a_capture_t * capture_handle
)
```
## Parameters

[`k4a_capture_t *`](~/api/current/k4a-capture-t.md) `capture_handle`

Pointer to a location to write an empty capture handle

## Remarks
Call this function to create a capture handle. Release it with 
[k4a_capture_release()](~/api/current/k4a-capture-release.md)
.
[k4a_capture_t](~/api/current/k4a-capture-t.md)
 is created with a reference of 1.

## Return Value
[`k4a_result_t`](~/api/current/k4a-result-t.md)

Returns K4A_RESULT_SUCCEEDED on success. Errors are indicated with K4A_RESULT_FAILED and error specific data can be found in the log.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


