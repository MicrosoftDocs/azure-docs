---
title: K4A_DECLARE_HANDLE definition
description: Internal use only. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, definition
---
# K4A_DECLARE_HANDLE definition

Internal use only. 

## Syntax

```C
#define K4A_DECLARE_HANDLE(
    _handle_name_
)
```
Declare an opaque handle type.
## Parameters

`_handle_name_`

The type name of the handle

## Remarks
This is used to define the public handle types for the k4a APIs. The macro should not be used outside of the k4a headers. 

