---
title: k4a_image_release function
description: Remove a reference from the  k4a_image_t . 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_image_release function

Remove a reference from the 
[k4a_image_t](~/api/current/k4a-image-t.md)
. 

## Syntax

```C
void k4a_image_release(
    k4a_image_t image_handle
)
```
## Parameters

[`k4a_image_t`](~/api/current/k4a-image-t.md) `image_handle`

Handle of the image for which the get operation is performed on.

## Remarks
References manage the lifetime of the object. When the references reach zero the object is destroyed. Caller should assume this function frees the object, as a result the object should not be accessed after this call completes.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


