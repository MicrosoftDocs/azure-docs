---
title: k4a_calibration_intrinsic_parameters_t::_param structure
description: individual parameter or array representation of intrinsic model. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, structure
---
# k4a_calibration_intrinsic_parameters_t::_param structure

individual parameter or array representation of intrinsic model. 

## Syntax

```C
typedef struct {
    float cx;
    float cy;
    float fx;
    float fy;
    float k1;
    float k2;
    float k3;
    float k4;
    float k5;
    float k6;
    float codx;
    float cody;
    float p2;
    float p1;
    float metric_radius;
} k4a_calibration_intrinsic_parameters_t::_param;
```

## Members

`float` `cx`

principal point in image, x 

`float` `cy`

principal point in image, y 

`float` `fx`

focal length x 

`float` `fy`

focal length y 

`float` `k1`

k1 radial distortion coefficient 

`float` `k2`

k2 radial distortion coefficient 

`float` `k3`

k3 radial distortion coefficient 

`float` `k4`

k4 radial distortion coefficient 

`float` `k5`

k5 radial distortion coefficient 

`float` `k6`

k6 radial distortion coefficient 

`float` `codx`

center of distortion in Z=1 plane, x (only used for Rational6KT) 

`float` `cody`

center of distortion in Z=1 plane, y (only used for Rational6KT) 

`float` `p2`

tangential distortion coefficient 2 

`float` `p1`

tangential distortion coefficient 1 

`float` `metric_radius`

metric radius 

