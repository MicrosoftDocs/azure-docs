---
title: k4a_calibration_extrinsics_t structure
description: Camera sensor extrinsic calibration data. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, structure
---
# k4a_calibration_extrinsics_t structure

Camera sensor extrinsic calibration data. 

## Syntax

```C
typedef struct {
    float rotation[9];
    float translation[3];
} k4a_calibration_extrinsics_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Members

`float` `rotation`

rotation matrix 

`float` `translation`

translation vector 

