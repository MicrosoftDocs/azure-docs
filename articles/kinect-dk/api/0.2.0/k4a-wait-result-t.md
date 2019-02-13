---
title: k4a_wait_result_t enumeration
description: Return codes returned by k4a APIs. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, enumeration
---
# k4a_wait_result_t enumeration

Return codes returned by k4a APIs. 

## Syntax

```C
typedef enum {
    K4A_WAIT_RESULT_SUCCEEDED = 0,
    K4A_WAIT_RESULT_FAILED,
    K4A_WAIT_RESULT_TIMEOUT,
} k4a_wait_result_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Values

 Constant       | Description   
----------------|---------------
K4A_WAIT_RESULT_SUCCEEDED | The result was successful. 
K4A_WAIT_RESULT_FAILED | The result was a failure. 
K4A_WAIT_RESULT_TIMEOUT | The operation timed out. 

