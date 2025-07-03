---
title: Azure Database for MySQL Bindings for Functions
description: Understand how to use Azure Database for MySQL bindings in Azure Functions.
author: JetterMcTedder
ms.topic: reference
ms.custom:
  - build-2023
  - devx-track-extended-java
  - devx-track-js
  - devx-track-python
  - ignite-2023
ms.date: 10/26/2024
ms.author: bspendolini
ms.reviewer: glenga
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Overview of Azure Database for MySQL bindings for Azure Functions

This set of articles explains how to work with [Azure Database for MySQL](/azure/mysql/index) bindings in Azure Functions. Azure Functions supports input bindings and output bindings in general availability. For the preview, Azure Functions supports trigger bindings for Azure Database for MySQL.

| Action | Type |
|---------|---------|
| Read data from a database | [Input binding](./functions-bindings-azure-mysql-input.md) |
| Save data to a database |[Output binding](./functions-bindings-azure-mysql-output.md) |
| Trigger a function when a change is detected in a MySQL table (preview) | [Trigger binding](./functions-bindings-azure-mysql-trigger.md) |

::: zone pivot="programming-language-csharp"

## Install the extension

The extension NuGet package that you install depends on the C# mode you're using in your function app:

# [Isolated worker model](#tab/isolated-process)

Functions run in an isolated C# worker process. To learn more, see [Guide for running C# Azure functions in an isolated worker process](dotnet-isolated-process-guide.md).

Add the extension to your project by installing [this NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.MySql/1.0.3-preview/).

```bash
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.MySql --version 1.0.3-preview
```

# [In-process model](#tab/in-process)

Functions run in the same process as the Azure Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

Add the extension to your project by installing [this NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.MySql/1.0.3-preview).

```bash
dotnet add package Microsoft.Azure.WebJobs.Extensions.MySql --version 1.0.3-preview
```

---

::: zone-end

::: zone pivot="programming-language-javascript, programming-language-powershell"

## Install the bundle

The extension for Azure Database for MySQL bindings is part of the v4 [extension bundle](./extension-bundles.md). This bundle is specified in your host.json project file.

### Preview bundle v4.x

You can use the preview extension bundle by adding or replacing the following code in your host.json file:

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

## Install the bundle

The extension for Azure Database for MySQL bindings is part of the v4 [extension bundle](./extension-bundles.md). This bundle is specified in your host.json project file.

### Preview bundle v4.x

You can use the preview extension bundle by adding or replacing the following code in your host.json file:

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

::: zone pivot="programming-language-java"

## Install the bundle

The extension for Azure Database for MySQL bindings is part of the v4 [extension bundle](./extension-bundles.md). This bundle is specified in your host.json project file.

### Preview bundle v4.x

You can use the preview extension bundle by adding or replacing the following code in your host.json file:

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

## Update packages

You can use the preview extension bundle with an update to the pom.xml file in your Java Azure Functions project, as shown in the following snippet:

```xml
<dependency>
<groupId>com.microsoft.azure.functions</groupId>
<artifactId>azure-functions-java-library-mysql</artifactId>
<version>1.0.1-preview</version>
</dependency>
```

::: zone-end

## MySQL connection string

Azure Database for MySQL bindings for Azure Functions have a required property for the connection string. These bindings pass the connection string to the MySql.Data.MySqlClient library and provide support as defined in the [MySqlClient ConnectionString documentation](https://dev.mysql.com/doc/connector-net/en/connector-net-connections-string.html). Notable keywords include:

- `server`: The host on which the server instance is running. The value can be a host name, IPv4 address, or IPv6 address.
- `uid`: The MySQL user account to provide for the authentication process.
- `pwd`: The password to use for the authentication process.
- `database`: The default database for the connection. If no database is specified, the connection has no default database.

## Considerations

- Azure Database for MySQL bindings support version 4.x and later of the Azure Functions runtime.
- You can find source code for the Azure Database for MySQL bindings in [this GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/src).
- These bindings require connectivity to Azure Database for MySQL.
- Output bindings against tables with columns of spatial data types `GEOMETRY`, `POINT`, and `POLYGON` aren't supported. Data upserts fail.

## Samples

In addition to the samples for C#, Java, JavaScript, PowerShell, and Python available in the [GitHub repository for Azure Database for MySQL bindings](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples), more are available in [Azure Samples](https://github.com/Azure-Samples).

## Related content

- [Read data from a database (input binding)](./functions-bindings-azure-mysql-input.md)
- [Save data to a database (output binding)](./functions-bindings-azure-mysql-output.md)
- [Trigger a function when a change is detected in a table (trigger binding)](./functions-bindings-azure-mysql-trigger.md)
