---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/23/2024
ms.author: glenga
---

The code for all the functions in a specific function app is located in a root project folder that contains a host configuration file. The [host.json](../articles/azure-functions/functions-host-json.md) file contains runtime-specific configurations and is in the root folder of the function app. A *bin* folder contains packages and other library files that the function app requires. Specific folder structures required by the function app depend on language:

* [C#](../articles/azure-functions/functions-dotnet-class-library.md#functions-class-library-project)
* [Java](../articles/azure-functions/functions-reference-java.md#folder-structure)
* [JavaScript](../articles/azure-functions/functions-reference-node.md?tabs=javascript#folder-structure)
* [TypeScript](../articles/azure-functions/functions-reference-node.md?tabs=typescript#folder-structure)
* [PowerShell](../articles/azure-functions/functions-reference-powershell.md#folder-structure)
* [Python](../articles/azure-functions/functions-reference-python.md#folder-structure)

All functions in the function app must share the same language stack. 
