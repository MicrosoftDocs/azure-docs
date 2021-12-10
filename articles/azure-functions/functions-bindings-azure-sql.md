---
title: Azure SQL bindings for Functions
description: Understand how to use Azure SQL bindings in Azure Functions.
author: dzsquared
ms.topic: reference
ms.date: 11/12/2021
ms.author: drskwier
ms.reviewer: cachai
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

Working with the trigger and bindings requires that you reference the appropriate package. The NuGet package is used for .NET class libraries while the extension bundle is used for all other application types.

| Language                                        | Add by...                                   | Remarks 
|-------------------------------------------------|---------------------------------------------|-------------|
| C#                                              | Installing the [preview NuGet package] | |
<!--| C# Script, Java, JavaScript, Python, PowerShell | Registering the [extension bundle]          | The [Azure Tools extension] is recommended to use with Visual Studio Code. | -->


[preview NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Sql
[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack


## Known issues

- Output bindings against tables with columns of data types `NTEXT`, `TEXT`, or `IMAGE` are not supported and data upserts will fail. These types [will be removed](/sql/t-sql/data-types/ntext-text-and-image-transact-sql) in a future version of SQL Server and are not compatible with the `OPENJSON` function used by this Azure Functions binding.
- Case-sensitive [collations](/sql/relational-databases/collations/collation-and-unicode-support#Collation_Defn) are not currently supported. [GitHub item #133](https://github.com/Azure/azure-functions-sql-extension/issues/133) tracks progress on this issue.


## Open source

The Azure SQL bindings for Azure Functions are open source and available on the repository at [https://github.com/Azure/azure-functions-sql-extension](https://github.com/Azure/azure-functions-sql-extension).


## Next steps

- [Read data from a database (Input binding)](./functions-bindings-azure-sql-input.md)
- [Save data to a database (Output binding)](./functions-bindings-azure-sql-output.md)