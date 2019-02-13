---
title: k4a_calibration_type_t enumeration
description: Calibration types Specifies the calibration type. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, enumeration
---
# k4a_calibration_type_t enumeration

Calibration types Specifies the calibration type. 

## Syntax

```C
typedef enum {
    K4A_CALIBRATION_TYPE_UNKNOWN = 0,
    K4A_CALIBRATION_TYPE_DEPTH,
    K4A_CALIBRATION_TYPE_COLOR,
} k4a_calibration_type_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Values

 Constant       | Description   
----------------|---------------
K4A_CALIBRATION_TYPE_UNKNOWN | Calibration type is unknown. 
K4A_CALIBRATION_TYPE_DEPTH | depth sensor 
K4A_CALIBRATION_TYPE_COLOR | color sensor 

