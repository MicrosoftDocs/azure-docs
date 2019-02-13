---
title: k4a_version_t structure
description: Version information. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, structure
---
# k4a_version_t structure

Version information. 

## Syntax

```C
typedef struct {
    uint32_t major;
    uint32_t minor;
    uint32_t iteration;
} k4a_version_t;
```

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Members

`uint32_t` `major`

major version; represents a breaking change 

`uint32_t` `minor`

Minor version; represents additional features, no regression from lower versions with same major version. 

`uint32_t` `iteration`

Reserved. 

