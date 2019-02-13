---
title: K4A_PLUGIN_EXPORTED_FUNCTION definition
description: Name of the function all plugins must export in a dynamic library. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, definition
---
# K4A_PLUGIN_EXPORTED_FUNCTION definition

Name of the function all plugins must export in a dynamic library. 

## Syntax

```C
#define K4A_PLUGIN_EXPORTED_FUNCTION "k4a_register_plugin"
```

## Remarks
Upon finding a dynamic library named "depthengine", the k4aplugin loader will attempt to find a symbol named k4a_register_plugin. Please see 
[k4a_register_plugin_fn](~/api/current/k4a-register-plugin-fn.md)
 for the signature of that function. 

