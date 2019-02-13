---
title: k4arecord_recording_t handle
description: Handle to a k4a recording. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, handle
---
# k4arecord_recording_t handle

Handle to a k4a recording. 

## Syntax

```C
typedef struct { } k4arecord_recording_t;
```
Handles are created with 
[k4arecord_create_recording()](~/api/0.2.0/k4arecord-create-recording.md)
, and closed with 
[k4arecord_close_recording()](~/api/0.2.0/k4arecord-close-recording.md)
. Invalid handles are set to 0.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4arecord.h (include k4a/k4arecord.h) 


## Functions

|  Title | Description |
|--------|-------------|
| [k4arecord_add_tag](~/api/0.2.0/k4arecord-add-tag.md) | Adds a tag to the recording.  |
| [k4arecord_close_recording](~/api/0.2.0/k4arecord-close-recording.md) | Closes a recording handle.  |
| [k4arecord_finish_recording](~/api/0.2.0/k4arecord-finish-recording.md) | Finishes writing a recording and flushes all unwritten data to disk.  |
| [k4arecord_write_capture](~/api/0.2.0/k4arecord-write-capture.md) | Writes a camera capture to file.  |
| [k4arecord_write_header](~/api/0.2.0/k4arecord-write-header.md) | Writes the recording header and metadata to file.  |

