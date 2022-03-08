---
title: Azure SQL bindings for Functions
description: Understand how to use Azure SQL bindings in Azure Functions.
author: dzsquared
ms.topic: reference
ms.date: 1/25/2022
ms.author: drskwier
ms.reviewer: cachai
ms.devlang: csharp
---

# Azure SQL bindings for Azure Functions overview (preview)

This set of articles explains how to work with [Azure SQL](../azure-sql/index.yml) bindings in Azure Functions. Azure Functions supports input and output bindings for the Azure SQL and SQL Server products.

| Action | Type |
|---------|---------|
| Read data from a database | [Input binding](./functions-bindings-azure-sql-input.md) |
| Save data to a database |[Output binding](./functions-bindings-azure-sql-output.md) |

> [!NOTE]
> This reference is for [Azure Functions version 2.x and higher](functions-versions.md). 
>
> This binding requires connectivity to an Azure SQL or SQL Server database.

## Add to your Functions app

### Functions

Working with the trigger and bindings requires you reference the appropriate package. The NuGet package is used for .NET class libraries while the extension bundle is used for all other application types.

| Language                                        | Add by...                                   | Remarks 
|-------------------------------------------------|---------------------------------------------|-------------|
| C#                                              | Installing the [preview NuGet package] | |
<!--| C# Script, Java, JavaScript, Python, PowerShell | Registering the [extension bundle]          | The [Azure Tools extension] is recommended to use with Visual Studio Code. | -->


[preview NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Sql
[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack


## Known issues

- Output bindings against tables with columns of data types `NTEXT`, `TEXT`, or `IMAGE` aren't supported and data upserts will fail. These types [will be removed](/sql/t-sql/data-types/ntext-text-and-image-transact-sql) in a future version of SQL Server and aren't compatible with the `OPENJSON` function used by this Azure Functions binding.


## Open source

The Azure SQL bindings for Azure Functions are open-source and available on the repository at [https://github.com/Azure/azure-functions-sql-extension](https://github.com/Azure/azure-functions-sql-extension).


## Next steps

- [Read data from a database (Input binding)](./functions-bindings-azure-sql-input.md)
- [Save data to a database (Output binding)](./functions-bindings-azure-sql-output.md)
- [Review ToDo API sample with Azure SQL bindings](/samples/azure-samples/azure-sql-binding-func-dotnet-todo/todo-backend-dotnet-azure-sql-bindings-azure-functions/)
- [Learn how to connect Azure Function to Azure SQL with managed identity](./functions-identity-access-azure-sql-with-managed-identity.md)