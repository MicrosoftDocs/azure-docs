---
title: Azure Database for MySQL bindings for Functions
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

# Azure Database for MySQL bindings for Azure Functions overview (Preview)

This set of articles explains how to work with [Azure Database for MySQL](/azure/mysql/index) bindings in Azure Functions. For preview, Azure Functions supports input bindings and output bindings for Azure Database for MySQL.

| Action | Type |
|---------|---------|
| Read data from a database | [Input binding](./functions-bindings-azure-mysql-input.md) |
| Save data to a database |[Output binding](./functions-bindings-azure-mysql-output.md) |

::: zone pivot="programming-language-csharp"

## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app:

# [Isolated worker model](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

Add the extension to your project by installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.MySql/1.0.3-preview/).

```bash
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.MySql --version 1.0.3-preview
```

# [In-process model](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

Add the extension to your project by installing this [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.MySql/1.0.3-preview).

```bash
dotnet add package Microsoft.Azure.WebJobs.Extensions.MySql --version 1.0.3-preview
```

---

::: zone-end


::: zone pivot="programming-language-javascript, programming-language-powershell"

## Install bundle

The MySQL bindings extension is part of the v4 [extension bundle](./functions-bindings-register.md#extension-bundles), which is specified in your host.json project file.

### Preview Bundle v4.x

You can use the preview extension bundle by adding or replacing the following code in your `host.json` file:

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


## Install bundle

The MySQL bindings extension is part of the v4 [extension bundle](./functions-bindings-register.md#extension-bundles), which is specified in your host.json project file.


### Preview Bundle v4.x

You can use the preview extension bundle by adding or replacing the following code in your `host.json` file:

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


## Install bundle

The MySQL bindings extension is part of the v4 [extension bundle](./functions-bindings-register.md#extension-bundles), which is specified in your host.json project file.

### Preview Bundle v4.x

You can use the preview extension bundle by adding or replacing the following code in your `host.json` file:

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

You can use the preview extension bundle with an update to the `pom.xml` file in your Java Azure Functions project as seen in the following snippet:

```xml
<dependency>
<groupId>com.microsoft.azure.functions</groupId>
<artifactId>azure-functions-java-library-mysql</artifactId>
<version>1.0.1-preview</version>
</dependency>
```

::: zone-end

## MySQL connection string

Azure Database for MySQL bindings for Azure Functions have a required property for the connection string on all bindings. These pass the connection string to the MySql.Data.MySqlClient library and supports the connection string as defined in the [MySqlClient ConnectionString documentation](https://dev.mysql.com/doc/connector-net/en/connector-net-connections-string.html).  Notable keywords include:

- `server` the host on which the server instance is running. The value can be a host name, IPv4 address, or IPv6 address. 
- `uid` the MySQL user account to provide for the authentication process
- `pwd` the password to use for the authentication process. 
- `database` The default database for the connection. If no database is specified, the connection has no default database

## Considerations

- Azure Database for MySQL binding supports version 4.x and later of the Functions runtime.
- Source code for the Azure Database for MySQL bindings can be found in [this GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/src).
- This binding requires connectivity to an Azure Database for MySQL.
- Output bindings against tables with columns of spatial data types `GEOMETRY`, `POINT`, or `POLYGON` aren't supported and data upserts will fail.  

## Samples

In addition to the samples for C#, Java, JavaScript, PowerShell, and Python available in the [Azure MySQL bindings GitHub repository](https://github.com/Azure/azure-functions-mysql-extension/tree/main/samples), more are available in Azure Samples.


## Next steps

- [Read data from a database (Input binding)](./functions-bindings-azure-mysql-input.md)
- [Save data to a database (Output binding)](./functions-bindings-azure-mysql-output.md)

