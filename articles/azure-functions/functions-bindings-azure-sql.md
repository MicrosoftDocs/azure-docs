---
title: Azure SQL bindings for Functions
description: Understand how to use Azure SQL bindings in Azure Functions.
author: dzsquared
ms.topic: reference
ms.custom: event-tier1-build-2022
ms.date: 6/3/2022
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

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

> [!NOTE]
> In the current preview, Azure SQL bindings aren't supported when your function app runs in an isolated worker process.

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


::: zone pivot="programming-language-javascript"


## Install bundle    

The SQL bindings extension is part of a preview [extension bundle], which is specified in your host.json project file.  

# [Preview Bundle v3.x](#tab/extensionv3)

You can add the preview extension bundle by adding or replacing the following code in your `host.json` file:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
    "version": "[3.*, 4.0.0)"
  }
}
```

# [Preview Bundle v4.x](#tab/extensionv4)

You can add the preview extension bundle by adding or replacing the following code in your `host.json` file:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
    "version": "[4.*, 5.0.0)"
  }
}
```

---

::: zone-end


::: zone pivot="programming-language-python"  

## Functions runtime

> [!NOTE]
> Python language support for the SQL bindings extension is available starting with v4.5.0 of the [functions runtime](./set-runtime-version.md#view-and-update-the-current-runtime-version).  You may need to update your install of Azure Functions [Core Tools](functions-run-local.md) for local development.  Learn more about determining the runtime in Azure regions from the [functions runtime](./set-runtime-version.md#view-and-update-the-current-runtime-version) documentation.  Please see the tracking [GitHub issue](https://github.com/Azure/azure-functions-sql-extension/issues/250) for the latest update on availability.


## Install bundle

The SQL bindings extension is part of a preview [extension bundle], which is specified in your host.json project file.  

# [Preview Bundle v4.x](#tab/extensionv4)

You can add the preview extension bundle by adding or replacing the following code in your `host.json` file:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
    "version": "[4.*, 5.0.0)"
  }
}
```

# [Preview Bundle v3.x](#tab/extensionv3)

Python support isn't available with the SQL bindings extension in the v3 version of the functions runtime.

---

## Update packages

Support for the SQL bindings extension is available in the 1.11.3b1 version of the [Azure Functions Python library](https://pypi.org/project/azure-functions/).  Add this version of the library to your functions project with an update to the line for `azure-functions==` in the `requirements.txt` file in your Python Azure Functions project as seen in the following snippet:

```
azure-functions==1.11.3b1
```

Following setting the library version, update your application settings to [isolate the dependencies](./functions-app-settings.md#python_isolate_worker_dependencies-preview) by adding `PYTHON_ISOLATE_WORKER_DEPENDENCIES` with the value `1` to your application settings.  Locally, this is set in the `local.settings.json` file as seen below:

```json
"PYTHON_ISOLATE_WORKER_DEPENDENCIES": "1"
```

Support for Python durable functions with SQL bindings isn't yet available.


::: zone-end


::: zone pivot="programming-language-java,programming-language-powershell"  

> [!NOTE]
> In the current preview, Azure SQL bindings are only supported by [C# class library functions](functions-dotnet-class-library.md), [JavaScript functions](functions-reference-node.md), and [Python functions](functions-reference-python.md). 

::: zone-end

## SQL connection string

Azure SQL bindings for Azure Functions have a required property for connection string on both [input](./functions-bindings-azure-sql-input.md) and [output](./functions-bindings-azure-sql-output.md) bindings. SQL bindings passes the connection string to the Microsoft.Data.SqlClient library and supports the connection string as defined in the [SqlClient ConnectionString documentation](/dotnet/api/microsoft.data.sqlclient.sqlconnection.connectionstring?view=sqlclient-dotnet-core-3.1&preserve-view=true).  Notable keywords include:

- `Authentication` allows a function to connect to Azure SQL with Azure Active Directory, including [Active Directory Managed Identity](./functions-identity-access-azure-sql-with-managed-identity.md)
- `Command Timeout` allows a function to wait for specified amount of time in seconds before terminating a query (default 30 seconds)
- `ConnectRetryCount` allows a function to automatically make additional reconnection attempts, especially applicable to Azure SQL Database serverless tier (default 1)


## Considerations

- Because the Azure SQL bindings doesn't have a trigger, you need to use another supported trigger to start a function that reads from or writes to an Azure SQL database. 
- Azure SQL binding supports version 2.x and later of the Functions runtime.
- Source code for the Azure SQL bindings can be found in [this GitHub repository](https://github.com/Azure/azure-functions-sql-extension).
- This binding requires connectivity to an Azure SQL or SQL Server database.
- Output bindings against tables with columns of data types `NTEXT`, `TEXT`, or `IMAGE` aren't supported and data upserts will fail. These types [will be removed](/sql/t-sql/data-types/ntext-text-and-image-transact-sql) in a future version of SQL Server and aren't compatible with the `OPENJSON` function used by this Azure Functions binding.


## Next steps

- [Read data from a database (Input binding)](./functions-bindings-azure-sql-input.md)
- [Save data to a database (Output binding)](./functions-bindings-azure-sql-output.md)
- [Run a function when data is changed in a SQL table (Trigger)](./functions-bindings-azure-sql-trigger.md)
- [Review ToDo API sample with Azure SQL bindings](/samples/azure-samples/azure-sql-binding-func-dotnet-todo/todo-backend-dotnet-azure-sql-bindings-azure-functions/)
- [Learn how to connect Azure Function to Azure SQL with managed identity](./functions-identity-access-azure-sql-with-managed-identity.md)
- [Use SQL bindings in Azure Stream Analytics](../stream-analytics/sql-database-upsert.md#option-1-update-by-key-with-the-azure-function-sql-binding)

[preview NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Sql
[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack
