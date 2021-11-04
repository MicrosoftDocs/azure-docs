---
title: Azure SQL bindings for Functions
description: Understand how to use Azure SQL bindings in Azure Functions.
author: dzsquared
ms.topic: reference
ms.date: 11/9/2021
ms.author: drskwier
---

# Azure Cosmos DB trigger and bindings for Azure Functions overview

This set of articles explains how to work with [Azure SQL](../azure-sql) bindings in Azure Functions. Azure Functions supports input and output bindings for the Azure SQL and SQL Server products.

| Action | Type |
|---------|---------|
| Read data from a SQL database | [Input binding](./functions-bindings-azuresql-input.md) |
| Save data to a SQL database |[Output binding](./functions-bindings-azuresql-output.md) |

> [!NOTE]
> This reference is for [Azure Functions version 2.x and higher](functions-versions.md). 
>
> This binding requires connectivity to an Azure SQL or SQL Server database.

## Add to your Functions app

### Functions

Working with the trigger and bindings requires that you reference the appropriate package. The NuGet package is used for .NET class libraries while the extension bundle is used for all other application types.

| Language                                        | Add by...                                   | Remarks 
|-------------------------------------------------|---------------------------------------------|-------------|
| C#                                              | Installing the [preview NuGet package] | |
<!--| C# Script, Java, JavaScript, Python, PowerShell | Registering the [extension bundle]          | The [Azure Tools extension] is recommended to use with Visual Studio Code. | -->


[preview NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Sql
[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack


## Open Source

The Azure SQL bindings for Azure Functions are open source and available on the repository at [https://github.com/Azure/azure-functions-sql-extension](https://github.com/Azure/azure-functions-sql-extension).  [Known issues](https://github.com/Azure/azure-functions-sql-extension#known-issues) are also tracked on the repository.

## Next steps

- [Read data from a SQL database (Input binding)](./functions-bindings-azuresql-input.md)
- [Save data to a SQL database (Output binding)](./functions-bindings-azuresql-output.md)