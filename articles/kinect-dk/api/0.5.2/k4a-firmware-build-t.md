---
title: k4a_firmware_build_t enumeration
description: Firmware built type. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, enumeration
---
# k4a_firmware_build_t enumeration

Firmware built type. 

## Syntax

```C
typedef enum {
    K4A_FIRMWARE_BUILD_RELEASE,
    K4A_FIRMWARE_BUILD_DEBUG,
} k4a_firmware_build_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Values

 Constant       | Description   
----------------|---------------
K4A_FIRMWARE_BUILD_RELEASE | Production firmware. 
K4A_FIRMWARE_BUILD_DEBUG | Pre-production firmware. 

