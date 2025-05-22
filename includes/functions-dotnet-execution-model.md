---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 07/19/2022
ms.author: glenga
---

| Execution model | Description |
| --- | --- |
| **Isolated worker model**| Your function code runs in a separate .NET worker process. Use with [supported versions of .NET and .NET Framework](../articles/azure-functions/dotnet-isolated-process-guide.md#supported-versions). To learn more, see [Guide for running C# Azure Functions in the isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md). |
| **In-process model**| Your function code runs in the same process as the Functions host process. Supports only [Long Term Support (LTS) versions of .NET](../articles/azure-functions/functions-dotnet-class-library.md#supported-versions). To learn more, see [Develop C# class library functions using Azure Functions](../articles/azure-functions/functions-dotnet-class-library.md). |
