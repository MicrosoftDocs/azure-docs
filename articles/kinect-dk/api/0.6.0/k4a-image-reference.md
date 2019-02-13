---
title: k4a_image_reference function
description: Add a reference to the  k4a_image_t . 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_image_reference function

Add a reference to the 
[k4a_image_t](~/api/0.6.0/k4a-image-t.md)
. 

## Syntax

```C
void k4a_image_reference(
    k4a_image_t image_handle
)
```
## Parameters

[`k4a_image_t`](~/api/0.6.0/k4a-image-t.md) `image_handle`

Handle of the image for which the get operation is performed on.

## Remarks
References manage the lifetime of the object. When the references reach zero the object is destroyed.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


