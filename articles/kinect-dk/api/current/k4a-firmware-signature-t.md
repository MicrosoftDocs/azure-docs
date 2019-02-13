---
title: k4a_firmware_signature_t enumeration
description: Firmware signature. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, enumeration
---
# k4a_firmware_signature_t enumeration

Firmware signature. 

## Syntax

```C
typedef enum {
    K4A_FIRMWARE_SIGNATURE_MSFT,
    K4A_FIRMWARE_SIGNATURE_TEST,
    K4A_FIRMWARE_SIGNATURE_UNSIGNED,
} k4a_firmware_signature_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Values

 Constant       | Description   
----------------|---------------
K4A_FIRMWARE_SIGNATURE_MSFT | Microsoft signed firmware. 
K4A_FIRMWARE_SIGNATURE_TEST | Test signed firmware. 
K4A_FIRMWARE_SIGNATURE_UNSIGNED | Unsigned firmware. 

