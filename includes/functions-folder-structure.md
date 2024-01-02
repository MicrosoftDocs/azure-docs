---
title: include file
description: include file
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/17/2021
ms.author: glenga
ms.custom: include file
---

The code for all the functions in a specific function app is located in a root project folder that contains a host configuration file. The [host.json](../articles/azure-functions/functions-host-json.md) file contains runtime-specific configurations and is in the root folder of the function app. A *bin* folder contains packages and other library files that the function app requires. Specific folder structures required by the function app depend on language:

* [C# compiled (.csproj)](../articles/azure-functions/functions-dotnet-class-library.md#functions-class-library-project)
* [C# script (.csx)](../articles/azure-functions/functions-reference-csharp.md#folder-structure)
* [F# script](../articles/azure-functions/functions-reference-fsharp.md#folder-structure)
* [Java](../articles/azure-functions/functions-reference-java.md#folder-structure)
* [JavaScript](../articles/azure-functions/functions-reference-node.md?tabs=javascript#folder-structure)
* [TypeScript](../articles/azure-functions/functions-reference-node.md?tabs=typescript#folder-structure)
* [PowerShell](../articles/azure-functions/functions-reference-powershell.md#folder-structure)
* [Python](../articles/azure-functions/functions-reference-python.md#folder-structure)

In version 2.x and higher of the Functions runtime, all functions in the function app must share the same language stack. 
