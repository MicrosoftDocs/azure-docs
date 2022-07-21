---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/18/2021
ms.author: glenga
---

| Execution model | Description |
| --- | --- |
| **[In-process](../articles/azure-functions/create-first-function-cli-csharp.md?tabs=in-process)**| Your function code runs in the same process as the Functions host process. Supports both .NET Core 3.1 and .NET 6.0. To learn more, see [Develop C# class library functions using Azure Functions](../articles/azure-functions/functions-dotnet-class-library.md). |
| **[Isolated process](../articles/azure-functions/create-first-function-cli-csharp.md?tabs=isolated-process)**| Your function code runs in a separate .NET worker process. Supports both .NET 5.0 and .NET 6.0. To learn more, see [Develop isolated process functions in C#](../articles/azure-functions/dotnet-isolated-process-guide.md). |