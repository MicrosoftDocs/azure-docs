---
title: k4arecord_add_tag function
description: Adds a tag to the recording. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4arecord_add_tag function

Adds a tag to the recording. 

## Syntax

```C
void k4arecord_add_tag(
    const k4arecord_recording_t recording_handle,
    const char * name,
    const char * value
)
```
Any tags need to be added before the recording header is written.
## Parameters

[`const k4arecord_recording_t`](~/api/0.2.0/k4arecord-recording-t.md) `recording_handle`

The handle of a new recording.

`const char *` `name`

The name of the tag to write.

`const char *` `value`

The string value to store in the tag.

## Remarks
Tags are global to a file, and should store data related to the entire recording, such as camera configuration or recording location.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4arecord.h (include k4a/k4arecord.h) 
 Library | k4arecord.lib 
 DLL | k4arecord.dll 


