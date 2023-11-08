---
title: Azure Data Explorer bindings for Azure Functions overview (preview)
description: Learn how to use Azure Data Explorer bindings in Azure Functions.
author: ramacg
ms.topic: reference
ms.custom: build-2023, devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 05/04/2023
ms.author: shsagir
ms.reviewer: ramacg
zone_pivot_groups: programming-languages-set-functions-data-explorer
---

# Azure Data Explorer bindings for Azure Functions overview (preview)

This set of articles explains how to work with [Azure Data Explorer](/azure/data-explorer/index) bindings in Azure Functions. Azure Functions supports input bindings and output bindings for Azure Data Explorer clusters.

| Action | Type |
|---------|---------|
| Read data from a database | [Input binding](functions-bindings-azure-data-explorer-input.md) |
| Ingest data to a database | [Output binding](functions-bindings-azure-data-explorer-output.md) |

::: zone pivot="programming-language-csharp"

## Install the extension

The extension NuGet package you install depends on the C# mode you're using in your function app.

# [Isolated worker model](#tab/isolated-process)

Functions run in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

Add the extension to your project by installing [this NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.Kusto/).

```bash
dotnet add package Microsoft.Azure.Functions.Worker.Extensions.Kusto --prerelease
```

# [In-process model](#tab/in-process)

Functions run in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

Add the extension to your project by installing [this NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Kusto).

```bash
dotnet add package Microsoft.Azure.WebJobs.Extensions.Kusto --prerelease
```

---

::: zone-end

::: zone pivot="programming-language-javascript"

## Install the bundle

Azure Data Explorer bindings extension is part of a preview [extension bundle], which is specified in your *host.json* project file.

# [Preview Bundle v4.x](#tab/extensionv4)

You can add the preview extension bundle by adding or replacing the following code in your *host.json* file:

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

Azure Data Explorer bindings for Azure Functions aren't available for the v3 version of the Functions runtime.

---

::: zone-end

::: zone pivot="programming-language-python"

## Functions runtime

> [!NOTE]
> Python language support for the Azure Data Explorer bindings extension is available starting with v4.6.0 or later of the [Functions runtime](set-runtime-version.md#view-and-update-the-current-runtime-version). You might need to update your installation of Azure Functions [Core Tools](functions-run-local.md) for local development.

## Install the bundle

The Azure Data Explorer bindings extension is part of a preview [extension bundle], which is specified in your *host.json* project file.

# [Preview Bundle v4.x](#tab/extensionv4)

You can add the preview extension bundle by adding or replacing the following code in your *host.json* file:

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

Azure Data Explorer bindings for Azure Functions aren't available for the v3 version of the Functions runtime.

---

::: zone-end

::: zone pivot="programming-language-java"

## Install the bundle

Azure Data Explorer bindings extension is part of a preview [extension bundle], which is specified in your *host.json* project file.

# [Preview Bundle v4.x](#tab/extensionv4)

You can add the preview extension bundle by adding or replacing the following code in your *host.json* file:

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

Azure Data Explorer bindings for Azure Functions aren't available for the v3 version of the Functions runtime.

---

## Update packages

Add the Java library for Azure Data Explorer bindings to your Functions project with an update to the `pom.xml` file in your Python Azure Functions project, as follows:

```xml
<dependency>
    <groupId>com.microsoft.azure.functions</groupId>
    <artifactId>azure-functions-java-library-kusto</artifactId>
    <version>1.0.4-Preview</version>
</dependency>
```

::: zone-end

## Kusto connection string

Azure Data Explorer bindings for Azure Functions have a required property for the connection string on all bindings. The connection string is documented at [Kusto connection strings](/azure/data-explorer/kusto/api/connection-strings/kusto).

## Considerations

- Azure Data Explorer binding supports version 4.x and later of the Functions runtime.
- Source code for the Azure Data Explorer bindings is in [this GitHub repository](https://github.com/Azure/Webjobs.Extensions.Kusto).
- This binding requires connectivity to Azure Data Explorer. For input bindings, users require **Viewer** permissions. For output bindings, users require **Ingestor** permissions. For more information about permissions, see [Role-based access control](/azure/data-explorer/kusto/management/access-control/role-based-access-control).

## Next steps

- [Read data from a database (input binding)](functions-bindings-azure-data-explorer-input.md)
- [Save data to a database (output binding)](functions-bindings-azure-data-explorer-output.md)

[extension bundle]: functions-bindings-register.md#extension-bundles
