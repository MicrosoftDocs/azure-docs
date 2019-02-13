---
title: k4arecord_create_recording function
description: Opens a new recording file for writing. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4arecord_create_recording function

Opens a new recording file for writing. 

## Syntax

```C
k4a_result_t k4arecord_create_recording(
    const char * path,
    k4a_device_t device,
    const k4a_device_configuration_t device_config,
    k4arecord_recording_t * recording_handle
)
```
The file will be created if it doesn't exist, or overwritten if an existing file is specified.
## Parameters

`const char *` `path`

Filesystem path for the new recording.

[`k4a_device_t`](~/api/0.2.0/k4a-device-t.md) `device`

The k4a device that is being recorded.

[`const k4a_device_configuration_t`](~/api/0.2.0/k4a-device-configuration-t.md) `device_config`

The configuration the k4a device was opened with.

[`k4arecord_recording_t *`](~/api/0.2.0/k4arecord-recording-t.md) `recording_handle`

[OUT] If successful, this contains a pointer to the new recording handle. Caller must call 
[k4arecord_close_recording()](~/api/0.2.0/k4arecord-close-recording.md)
 when finished with recording.

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


