---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 11/01/2023
ms.author: glenga
---

When running on Linux, you must set `"kind": "functionapp,linux"` and `"reserved": true` for the function app. Linux apps must also include a `linuxFxVersion` property under `siteConfig`. If you're just deploying code, the value for this property is determined by your desired runtime stack in the format of `<runtime>|<runtimeVersion>`. For more information, see the [linuxFxVersion site setting](functions-app-settings.md#linuxfxversion) reference.
 
For a list of application settings required when running on Linux, see [Application configuration](#application-configuration). 