---
title: k4a_transformation_xy_tables_t structure
description: Tables used to compute X and Y coordinates given Z coordinate as an input. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, structure
---
# k4a_transformation_xy_tables_t structure

Tables used to compute X and Y coordinates given Z coordinate as an input. 

## Syntax

```C
typedef struct {
    float * x_table;
    float * y_table;
    int width;
    int height;
} k4a_transformation_xy_tables_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Members

`float *` `x_table`

table used to compute X coordinate 

`float *` `y_table`

table used to compute Y coordinate 

`int` `width`

width of x and y tables 

`int` `height`

height of x and y tables 

