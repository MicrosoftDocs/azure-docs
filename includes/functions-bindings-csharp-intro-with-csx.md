---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 11/16/2021
ms.author: glenga
---

A C# function can be created by using one of the following C# modes:

* [Isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md): Compiled C# function that runs in a worker process that's isolated from the runtime. Isolated worker process is required to support C# functions running on LTS and non-LTS versions .NET and the .NET Framework.
* [In-process model](../articles/azure-functions/functions-dotnet-class-library.md): Compiled C# function that runs in the same process as the Functions runtime.
* [C# script](../articles/azure-functions/functions-reference-csharp.md): Used primarily when you create C# functions in the Azure portal.
