---
title: k4arecord_write_capture function
description: Writes a camera capture to file. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4arecord_write_capture function

Writes a camera capture to file. 

## Syntax

```C
k4a_result_t k4arecord_write_capture(
    const k4arecord_recording_t recording_handle,
    k4a_capture_t capture_handle
)
```
Captures must be written in increasing order of timestamp, and the file's header must already be written.
## Parameters

[`const k4arecord_recording_t`](~/api/0.2.0/k4arecord-recording-t.md) `recording_handle`

The handle of a new recording in progress.

[`k4a_capture_t`](~/api/0.2.0/k4a-capture-t.md) `capture_handle`

The handle of a capture to write to file.

## Return Value
[`k4a_result_t`](~/api/0.2.0/k4a-result-t.md)

[K4A_RESULT_SUCCEEDED](~/api/0.2.0/k4a-result-t.md)
 is returned on success

## Remarks
k4arecord_write_capture will write all images in the capture to the corresponding tracks in the recording file.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4arecord.h (include k4a/k4arecord.h) 
 Library | k4arecord.lib 
 DLL | k4arecord.dll 


