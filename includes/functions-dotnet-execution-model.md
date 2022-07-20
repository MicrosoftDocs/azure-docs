---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 07/19/2022
ms.author: glenga
---

| Execution model | Description |
| --- | --- |
| **[In-process](../articles/azure-functions/create-first-function-cli-csharp.md?tabs=in-process)**| Your function code runs in the same process as the Functions host process. Check out [.NET supported versions](../articles/azure-functions/functions-dotnet-class-library.md#supported-versions) before getting started. To learn more, see [Develop C# class library functions using Azure Functions](../articles/azure-functions/functions-dotnet-class-library.md). |
| **[Isolated process](../articles/azure-functions/create-first-function-cli-csharp.md?tabs=isolated-process)**| Your function code runs in a separate .NET worker process. Check out [.NET supported versions](../articles/azure-functions/dotnet-isolated-process-guide.md#supported-versions) before getting started. To learn more, see [Develop isolated process functions in C#](../articles/azure-functions/dotnet-isolated-process-guide.md). |