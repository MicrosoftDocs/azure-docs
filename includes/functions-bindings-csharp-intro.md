---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 11/16/2021
ms.author: glenga
---

A C# function can be created using one of the following C# modes:

* [In-process class library](../articles/azure-functions/functions-dotnet-class-library.md): compiled C# function that runs in the same process as the Functions runtime. 
* [Isolated worker process class library](../articles/azure-functions/dotnet-isolated-process-guide.md): compiled C# function that runs in a worker process that is isolated from the runtime. Isolated worker process is required to support C# functions running on non-LTS versions .NET and the .NET Framework.     
* [C# script](../articles/azure-functions/functions-reference-csharp.md): used primarily when creating C# functions in the Azure portal.
