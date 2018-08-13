---
title: include file
description: include file
services: functions
author: ggailey777
manager: jeconnoc
ms.service: functions
ms.topic: include
ms.date: 08/12/2018
ms.author: glenga
ms.custom: include file
---

The code for all the functions in a specific function app is located in a root folder (`wwwroot`) that contains a host configuration file and one or more subfolders. Each subfolder contains the code for a separate function, as in the following example:

```
wwwroot
 | - host.json
 | - mynodefunction
 | | - function.json
 | | - index.js
 | | - node_modules
 | | | - ... packages ...
 | | - package.json
 | - mycsharpfunction
 | | - function.json
 | | - run.csx
 | - bin
 | | - mycompiledcsharp.dll
```

The host.json file contains some runtime-specific configurations, and sits in the root folder of the function app. For information about settings that are available, see the [host.json reference](../articles/azure-functions/functions-host-json.md).

Each function has a folder that contains one or more code files, the function.json configuration, and other dependencies. For a C# class library project, the compiled class library (.dll) file is deployed to the `bin` subfolder.

