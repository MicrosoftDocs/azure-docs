---
title: Azure SQL bindings for Functions
description: Understand how to use Azure SQL bindings in Azure Functions.
author: dzsquared
ms.topic: reference
ms.date: 5/3/2022
ms.author: drskwier
ms.reviewer: glenga
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure SQL bindings for Azure Functions overview (preview)

This set of articles explains how to work with [Azure SQL](/azure/azure-sql/index) bindings in Azure Functions. Azure Functions supports input and output bindings for the Azure SQL and SQL Server products.

| Action | Type |
|---------|---------|
| Read data from a database | [Input binding](./functions-bindings-azure-sql-input.md) |
| Save data to a database |[Output binding](./functions-bindings-azure-sql-output.md) |

::: zone pivot="programming-language-csharp"

## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [In-process](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

Add the extension to your project by installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Sql).

# [Isolated process](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated process](dotnet-isolated-process-guide.md).

> [!NOTE]
> In the current preview, Azure SQL bindings aren't supported when your function app runs in an isolated process.

<!--
Add the extension to your project by installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.SignalRService/).
-->

<!-- awaiting bundle support
# [C# script](#tab/csharp-script)

Functions run as C# script, which is supported primarily for C# portal editing. To update existing binding extensions for C# script apps running in the portal without having to republish your function app, see [Update your extensions].

You can install this version of the extension in your function app by registering the [extension bundle], version 3.x, or a later version.
-->

---

::: zone-end 


::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

> [!NOTE]
> In the current preview, Azure SQL bindings are only supported by [C# class library functions](functions-dotnet-class-library.md). 

<!-- awaiting bundle support 
## Install bundle    

The Kafka extension is part of an [extension bundle], which is specified in your host.json project file. When you create a project that targets version 2.x or later, you should already have this bundle installed. To learn more, see [extension bundle].

-->

::: zone-end

## Considerations

- Because the Azure SQL bindings doesn't have a trigger, you need to use another supported trigger to start a function that reads from or writes to an Azure SQL database. 
- Azure SQL binding supports version 2.x and later of the Functions runtime.
- Source code for the Azure SQL bindings can be found in [this GitHub repository](https://github.com/Azure/azure-functions-sql-extension).
- This binding requires connectivity to an Azure SQL or SQL Server database.
- Output bindings against tables with columns of data types `NTEXT`, `TEXT`, or `IMAGE` aren't supported and data upserts will fail. These types [will be removed](/sql/t-sql/data-types/ntext-text-and-image-transact-sql) in a future version of SQL Server and aren't compatible with the `OPENJSON` function used by this Azure Functions binding.


## Next steps

- [Read data from a database (Input binding)](./functions-bindings-azure-sql-input.md)
- [Save data to a database (Output binding)](./functions-bindings-azure-sql-output.md)
- [Review ToDo API sample with Azure SQL bindings](/samples/azure-samples/azure-sql-binding-func-dotnet-todo/todo-backend-dotnet-azure-sql-bindings-azure-functions/)
- [Learn how to connect Azure Function to Azure SQL with managed identity](./functions-identity-access-azure-sql-with-managed-identity.md)
- [Use SQL bindings in Azure Stream Analytics](../stream-analytics/sql-database-upsert.md#option-1-update-by-key-with-the-azure-function-sql-binding)

[preview NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Sql
[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack

