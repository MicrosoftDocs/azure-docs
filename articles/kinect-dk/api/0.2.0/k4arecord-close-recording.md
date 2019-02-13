---
title: k4arecord_close_recording function
description: Closes a recording handle. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4arecord_close_recording function

Closes a recording handle. 

## Syntax

```C
k4a_result_t k4arecord_close_recording(
    const k4arecord_recording_t recording_handle
)
```
## Parameters

[`const k4arecord_recording_t`](~/api/0.2.0/k4arecord-recording-t.md) `recording_handle`

The handle of a recording.

## Return Value
[`k4a_result_t`](~/api/0.2.0/k4a-result-t.md)

[K4A_RESULT_SUCCEEDED](~/api/0.2.0/k4a-result-t.md)
 is returned on success

## Remarks
If there is any unwritten data, 
[k4arecord_close_recording()](~/api/0.2.0/k4arecord-close-recording.md)
 will automatically flush before closing the recording.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4arecord.h (include k4a/k4arecord.h) 
 Library | k4arecord.lib 
 DLL | k4arecord.dll 


