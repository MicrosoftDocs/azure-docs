---
title: k4a_device_get_serialnum function
description: Get the K4A device serial number. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_device_get_serialnum function

Get the K4A device serial number. 

## Syntax

```C
k4a_buffer_result_t k4a_device_get_serialnum(
    k4a_device_t device_handle,
    char * serial_number,
    size_t * serial_number_size
)
```
## Parameters

[`k4a_device_t`](~/api/0.5.2/k4a-device-t.md) `device_handle`

Handle obtained by 
[k4a_device_open()](~/api/0.5.2/k4a-device-open.md)

`char *` `serial_number`

Location to write the serial number to On output, this will be an ASCII null terminated string. This value may be NULL, so that 
`serial_number_size`
 may be used to return the size of the buffer needed to store the string.

`size_t *` `serial_number_size`

On input, the size of the 
`serial_number`
 buffer. On output, this value is set to the actual number of bytes in the serial number (including the null terminator)

## Return Value
[`k4a_buffer_result_t`](~/api/0.5.2/k4a-buffer-result-t.md)

A return of 
[K4A_BUFFER_RESULT_SUCCEEDED](~/api/0.5.2/k4a-buffer-result-t.md)
 means that the 
`serial_number`
 has been filled in. If the buffer is too small the function returns 
[K4A_BUFFER_RESULT_TOO_SMALL](~/api/0.5.2/k4a-buffer-result-t.md)
 and the needed size of the 
`serial_number`
 buffer is returned in the 
`serial_number_size`
 parameter. All other failures return 
[K4A_BUFFER_RESULT_FAILED](~/api/0.5.2/k4a-buffer-result-t.md)
.

## Remarks
Queries the device for its serial number. Set serial_number to NULL to query for serial number size required by the API

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


