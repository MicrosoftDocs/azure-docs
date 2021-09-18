---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/18/2021
ms.author: glenga
---

This article supports creating both types of compiled C# functions: 

| Execution model | Description |
| --- | --- |
| **[In-process](create-first-function-cli-csharp.md?tabs=in-process)**| Your function code runs in the same process as the Functions host process. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md). |
| **[Isolated process](create-first-function-cli-csharp.md?tabs=isolated-process)**| Your function code runs in a separate .NET worker process. To learn more, see [Guide for running functions on .NET 5.0 in Azure](dotnet-isolated-process-guide.md). |