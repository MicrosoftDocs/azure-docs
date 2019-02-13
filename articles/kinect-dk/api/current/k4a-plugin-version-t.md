---
title: k4a_plugin_version_t structure
description: Depth Engine Plugin Version. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, structure
---
# k4a_plugin_version_t structure

Depth Engine Plugin Version. 

## Syntax

```C
typedef struct {
    uint32_t major;
    uint32_t minor;
    uint32_t patch;
} k4a_plugin_version_t;
```
/remarks On load, k4a will validate that major versions match between the SDK and the plugin

## Requirements

Requirement | Value
------------|--------------------------------
 #text |  
 Header | k4aplugin.h (include k4a/k4aplugin.h) 


## Members

`uint32_t` `major`

Plugin Major Version. 

`uint32_t` `minor`

Plugin Minor Version. 

`uint32_t` `patch`

Plugin Patch Version. 

