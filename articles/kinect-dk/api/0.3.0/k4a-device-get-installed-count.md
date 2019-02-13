---
title: k4a_device_get_installed_count function
description: Gets the number of connected devices. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, function
---
# k4a_device_get_installed_count function

Gets the number of connected devices. 

## Syntax

```C
uint32_t k4a_device_get_installed_count(
    void 
)
```

## Return Value
`uint32_t`

number of sensors connected to the PC

## Remarks
This API counts the number of K4A devices connected to the host PC

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4a.h (include k4a/k4a.h) 
 Library | k4a.lib 
 DLL | k4a.dll 


