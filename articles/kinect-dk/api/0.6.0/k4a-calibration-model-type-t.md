---
title: k4a_calibration_model_type_t enumeration
description: Calibration model type. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, enumeration
---
# k4a_calibration_model_type_t enumeration

Calibration model type. 

## Syntax

```C
typedef enum {
    K4A_CALIBRATION_LENS_DISTORTION_MODEL_UNKNOWN = 0,
    K4A_CALIBRATION_LENS_DISTORTION_MODEL_THETA,
    K4A_CALIBRATION_LENS_DISTORTION_MODEL_POLYNOMIAL_3K,
    K4A_CALIBRATION_LENS_DISTORTION_MODEL_RATIONAL_6KT,
    K4A_CALIBRATION_LENS_DISTORTION_MODEL_BROWN_CONRADY,
} k4a_calibration_model_type_t;
```
The type of calibration performed on the sensor

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Values

 Constant       | Description   
----------------|---------------
K4A_CALIBRATION_LENS_DISTORTION_MODEL_UNKNOWN | Calibration model is unknown. 
K4A_CALIBRATION_LENS_DISTORTION_MODEL_THETA | Calibration model is Theta (arctan) 
K4A_CALIBRATION_LENS_DISTORTION_MODEL_POLYNOMIAL_3K | calibration model Polynomial 3K 
K4A_CALIBRATION_LENS_DISTORTION_MODEL_RATIONAL_6KT | calibration model Rational 6KT 
K4A_CALIBRATION_LENS_DISTORTION_MODEL_BROWN_CONRADY | calibration model Brown Conrady (compatible with OpenCV) 

