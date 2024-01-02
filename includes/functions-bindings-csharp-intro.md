---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 08/22/2023
ms.author: glenga
---

A C# function can be created by using one of the following C# modes:

* [Isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md): Compiled C# function that runs in a worker process that's isolated from the runtime. Isolated worker process is required to support C# functions running on LTS and non-LTS versions .NET and the .NET Framework. Extensions for isolated worker process functions use `Microsoft.Azure.Functions.Worker.Extensions.*` namespaces.
* [In-process model](../articles/azure-functions/functions-dotnet-class-library.md): Compiled C# function that runs in the same process as the Functions runtime. In a variation of this model, Functions can be run using [C# scripting](../articles/azure-functions/functions-reference-csharp.md), which is supported primarily for C# portal editing. Extensions for in-process functions use `Microsoft.Azure.WebJobs.Extensions.*` namespaces.
