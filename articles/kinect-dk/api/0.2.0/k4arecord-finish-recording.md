---
title: k4arecord_finish_recording function
description: Finishes writing a recording and flushes all unwritten data to disk. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4arecord_finish_recording function

Finishes writing a recording and flushes all unwritten data to disk. 

## Syntax

```C
k4a_result_t k4arecord_finish_recording(
    const k4arecord_recording_t recording_handle
)
```
## Parameters

[`const k4arecord_recording_t`](~/api/0.2.0/k4arecord-recording-t.md) `recording_handle`

The handle of a new recording in progress.

## Return Value
[`k4a_result_t`](~/api/0.2.0/k4a-result-t.md)

[K4A_RESULT_SUCCEEDED](~/api/0.2.0/k4a-result-t.md)
 is returned on success

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4arecord.h (include k4a/k4arecord.h) 
 Library | k4arecord.lib 
 DLL | k4arecord.dll 


