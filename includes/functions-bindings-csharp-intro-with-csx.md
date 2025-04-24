---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 11/16/2021
ms.author: glenga
---

You can create a C# function by using one of the following C# modes:

* [Isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md): Compiled C# function that runs in a worker process that's isolated from the runtime. An isolated worker process is required to support C# functions running on long-term support (LTS) and non-LTS versions for .NET and the .NET Framework.
* [In-process model](../articles/azure-functions/functions-dotnet-class-library.md): Compiled C# function that runs in the same process as the Azure Functions runtime.
* [C# script](../articles/azure-functions/functions-reference-csharp.md): Used primarily when you create C# functions in the Azure portal.
