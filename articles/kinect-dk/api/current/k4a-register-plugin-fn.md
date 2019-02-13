---
title: k4a_register_plugin_fn typedef
description: Function signature for  K4A_PLUGIN_EXPORTED_FUNCTION . 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, typedef
---
# k4a_register_plugin_fn typedef

Function signature for 
[K4A_PLUGIN_EXPORTED_FUNCTION](~/api/current/K4A-PLUGIN-EXPORTED-FUNCTION.md)
. 

## Syntax

```C
typedef bool(* k4a_register_plugin_fn) (k4a_plugin_t *plugin);
```

## Remarks
Plugins must implement a function named "k4a_register_plugin" which will fill out all fields in the passed in 
[k4a_plugin_t](~/api/current/k4a-plugin-t.md)
## Parameters

`plugin`

function pointers and version of the plugin to filled out

## Return Value

True if the plugin believes it successfully registered, false otherwise. 

