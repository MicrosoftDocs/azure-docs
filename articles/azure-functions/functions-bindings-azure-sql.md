---
title: Azure SQL bindings for Functions
description: Understand how to use Azure SQL bindings in Azure Functions.
author: dzsquared
ms.topic: reference
ms.custom: event-tier1-build-2022, build-2023, devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 4/17/2023
ms.author: drskwier
ms.reviewer: glenga
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Azure SQL bindings for Azure Functions overview

This set of articles explains how to work with [Azure SQL](/azure/azure-sql/index) bindings in Azure Functions. Azure Functions supports input bindings, output bindings, and a function trigger for the Azure SQL and SQL Server products.

| Action | Type |
|---------|---------|
| Trigger a function when a change is detected on a SQL table | [SQL trigger (preview)](./functions-bindings-azure-sql-trigger.md) |
| Read data from a database | [Input binding](./functions-bindings-azure-sql-input.md) |
| Save data to a database |[Output binding](./functions-bindings-azure-sql-output.md) |

::: zone pivot="programming-language-csharp"

## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app:

# [Isolated worker model](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

Add the extension to your project by installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Sql/).

```bash
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Sql
```

To use a preview version of the Microsoft.Azure.Functions.Worker.Extensions.Sql package for [SQL trigger](functions-bindings-azure-sql-trigger.md) functionality, add the `--prerelease` flag to the command.

```bash
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Sql --prerelease
```

> [!NOTE]
> Breaking changes between preview releases of the Azure SQL trigger for Functions requires that all Functions targeting the same database use the same version of the SQL extension package.

# [In-process model](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

Add the extension to your project by installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Sql).

```bash
dotnet add package Microsoft.Azure.WebJobs.Extensions.Sql
```

To use a preview version of the Microsoft.Azure.WebJobs.Extensions.Sql package for [SQL trigger](functions-bindings-azure-sql-trigger.md) functionality, add the `--prerelease` flag to the command.

```bash
dotnet add package Microsoft.Azure.WebJobs.Extensions.Sql --prerelease
```

> [!NOTE]
> Breaking changes between preview releases of the Azure SQL trigger for Functions requires that all Functions targeting the same database use the same version of the SQL extension package.

---

::: zone-end


::: zone pivot="programming-language-javascript, programming-language-powershell"


## Install bundle

The SQL bindings extension is part of the v4 [extension bundle], which is specified in your host.json project file.  For [SQL trigger](functions-bindings-azure-sql-trigger.md) functionality, use a preview version of the extension bundle.


# [Bundle v4.x](#tab/extensionv4)

The extension bundle is specified by the following code in your `host.json` file:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  }
}
```

# [Preview Bundle v4.x](#tab/extensionv4p)

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

> [!NOTE]
> Breaking changes between preview releases of the Azure SQL trigger for Functions requires that all Functions targeting the same database use the same version of the extension bundle.

---

::: zone-end


::: zone pivot="programming-language-python"

## Functions runtime

<!-- > [!NOTE]
> Python language support for the SQL bindings extension is available starting with v4.5.0 of the [functions runtime](./set-runtime-version.md#view-and-update-the-current-runtime-version).  You may need to update your install of Azure Functions [Core Tools](functions-run-local.md) for local development. -->


## Install bundle

The SQL bindings extension is part of the v4 [extension bundle], which is specified in your host.json project file.  For [SQL trigger](functions-bindings-azure-sql-trigger.md) functionality, use a preview version of the extension bundle.


# [Bundle v4.x](#tab/extensionv4)

The extension bundle is specified by the following code in your `host.json` file:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  }
}
```

# [Preview Bundle v4.x](#tab/extensionv4p)

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

> [!NOTE]
> Breaking changes between preview releases of the Azure SQL trigger for Functions requires that all Functions targeting the same database use the same version of the extension bundle.

---

::: zone-end


::: zone pivot="programming-language-java"


## Install bundle

The SQL bindings extension is part of the v4 [extension bundle], which is specified in your host.json project file.  For [SQL trigger](functions-bindings-azure-sql-trigger.md) functionality, use a preview version of the extension bundle.


# [Bundle v4.x](#tab/extensionv4)

The extension bundle is specified by the following code in your `host.json` file:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  }
}
```

# [Preview Bundle v4.x](#tab/extensionv4p)

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

> [!NOTE]
> Breaking changes between preview releases of the Azure SQL trigger for Functions requires that all Functions targeting the same database use the same version of the extension bundle.

---

## Update packages

Add the Java library for SQL bindings to your functions project with an update to the `pom.xml` file in your Java Azure Functions project as seen in the following snippet:

```xml
<dependency>
    <groupId>com.microsoft.azure.functions</groupId>
    <artifactId>azure-functions-java-library-sql</artifactId>
    <version>1.0.0</version>
</dependency>
```

For [SQL trigger](functions-bindings-azure-sql-trigger.md) functionality, use a preview version of the Java library for SQL bindings instead:

```xml
<dependency>
    <groupId>com.microsoft.azure.functions</groupId>
    <artifactId>azure-functions-java-library-sql</artifactId>
    <version>2.0.0-preview</version>
</dependency>
```

::: zone-end

## SQL connection string

Azure SQL bindings for Azure Functions have a required property for the connection string on all bindings and triggers. These pass the connection string to the Microsoft.Data.SqlClient library and supports the connection string as defined in the [SqlClient ConnectionString documentation](/dotnet/api/microsoft.data.sqlclient.sqlconnection.connectionstring?view=sqlclient-dotnet-core-5.0&preserve-view=true#Microsoft_Data_SqlClient_SqlConnection_ConnectionString).  Notable keywords include:

- `Authentication` allows a function to connect to Azure SQL with Microsoft Entra ID, including [Active Directory Managed Identity](./functions-identity-access-azure-sql-with-managed-identity.md)
- `Command Timeout` allows a function to wait for specified amount of time in seconds before terminating a query (default 30 seconds)
- `ConnectRetryCount` allows a function to automatically make additional reconnection attempts, especially applicable to Azure SQL Database serverless tier (default 1)
- `Pooling` allows a function to reuse connections to the database, which can improve performance (default `true`). Additional settings for connection pooling include `Connection Lifetime`, `Max Pool Size`, and `Min Pool Size`. Learn more about connection pooling in the [ADO.NET documentation](/sql/connect/ado-net/sql-server-connection-pooling)

## Considerations

- Azure SQL binding supports version 4.x and later of the Functions runtime.
- Source code for the Azure SQL bindings can be found in [this GitHub repository](https://github.com/Azure/azure-functions-sql-extension).
- This binding requires connectivity to an Azure SQL or SQL Server database.
- Output bindings against tables with columns of data types `NTEXT`, `TEXT`, or `IMAGE` aren't supported and data upserts will fail. These types [will be removed](/sql/t-sql/data-types/ntext-text-and-image-transact-sql) in a future version of SQL Server and aren't compatible with the `OPENJSON` function used by this Azure Functions binding.

## Samples

In addition to the samples for C#, Java, JavaScript, PowerShell, and Python available in the [Azure SQL bindings GitHub repository](https://github.com/Azure/azure-functions-sql-extension/tree/main/samples), more are available in Azure Samples:

- [C# ToDo API sample with Azure SQL bindings](/samples/azure-samples/azure-sql-binding-func-dotnet-todo/todo-backend-dotnet-azure-sql-bindings-azure-functions/)
- [Use SQL bindings in Azure Stream Analytics](../stream-analytics/sql-database-upsert.md#option-1-update-by-key-with-the-azure-function-sql-binding)
- [Send data from Azure SQL with Python](/samples/azure-samples/sqlbindings-python-datatransfer/sample-load-data-from-sql-using-python-and-azure-functions/)


## Next steps

- [Read data from a database (Input binding)](./functions-bindings-azure-sql-input.md)
- [Save data to a database (Output binding)](./functions-bindings-azure-sql-output.md)
- [Run a function when data is changed in a SQL table (Trigger)](./functions-bindings-azure-sql-trigger.md)
- [Learn how to connect Azure Function to Azure SQL with managed identity](./functions-identity-access-azure-sql-with-managed-identity.md)

[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack
