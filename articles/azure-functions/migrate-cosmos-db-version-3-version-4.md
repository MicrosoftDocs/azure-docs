---
title: Migrate Azure Cosmos DB extension for Azure Functions to version 4.x 
description: This article shows you how to upgrade your existing function apps using the Azure Cosmos DB extension version 3.x to be able to use version 4.x of the extension. 
ms.service: azure-functions
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
ms.topic: how-to 
ms.date: 10/05/2023
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Migrate function apps from Azure Cosmos DB extension version 3.x to version 4.x 

This article highlights considerations for upgrading your existing Azure Functions applications that use the Azure Cosmos DB extension version 3.x to use the newer [extension version 4.x](./functions-bindings-cosmosdb-v2.md?tabs=extensionv4). Migrating from version 3.x to version 4.x of the Azure Cosmos DB extension has breaking changes for your application. 

> [!IMPORTANT]
> On August 31, 2024 the Azure Cosmos DB extension version 3.x will be retired. The extension and all applications using the extension will continue to function, but Azure Cosmos DB will cease to provide further maintenance and support for this extension. We recommend migrating to the latest version 4.x of the extension.

This article walks you through the process of migrating your function app to run on version 4.x of the Azure Cosmos DB extension. Because project upgrade instructions are language dependent, make sure to choose your development language from the selector at the [top of the article](#top).

## Changes to item ID generation

Item ID is no longer auto populated in the Extension. Therefore, the Item ID must specifically include a generated ID for cases where you were using the Output Binding to create items.

::: zone pivot="programming-language-csharp"

## Update the extension version

.NET Functions use bindings that are installed in the project as NuGet packages. Depending on your Functions process model, the NuGet package to update varies.

|Functions process model |Azure Cosmos DB extension |Recommended version |
|------------------------|--------------------------|--------------------|
|[In-process model](./functions-dotnet-class-library.md)|[Microsoft.Azure.WebJobs.Extensions.CosmosDB](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB) |>= 4.3.0 |
|[Isolated worker model](./dotnet-isolated-process-guide.md) |[Microsoft.Azure.Functions.Worker.Extensions.CosmosDB](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.CosmosDB)|>= 4.4.1 |

Update your `.csproj` project file to use the latest extension version for your process model. The following `.csproj` file uses version 4 of the Azure Cosmos DB extension.

### [Isolated worker model](#tab/isolated-process)

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net7.0</TargetFramework>
    <AzureFunctionsVersion>v4</AzureFunctionsVersion>
    <OutputType>Exe</OutputType>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Azure.Functions.Worker" Version="1.14.1" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.CosmosDB" Version="4.4.1" />
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Sdk" Version="1.10.0" />
  </ItemGroup>
  <ItemGroup>
    <None Update="host.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </None>
    <None Update="local.settings.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
      <CopyToPublishDirectory>Never</CopyToPublishDirectory>
    </None>
  </ItemGroup>
</Project>
```

### [In-process model](#tab/in-process)

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net7.0</TargetFramework>
    <AzureFunctionsVersion>v4</AzureFunctionsVersion>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Azure.WebJobs.Extensions.CosmosDB" Version="4.3.0" />
    <PackageReference Include="Microsoft.NET.Sdk.Functions" Version="4.1.1" />
  </ItemGroup>
  <ItemGroup>
    <None Update="host.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </None>
    <None Update="local.settings.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
      <CopyToPublishDirectory>Never</CopyToPublishDirectory>
    </None>
  </ItemGroup>
</Project>
```

## Azure Cosmos DB SDK changes

The underlying SDK used by extension changed to use the Azure Cosmos DB V3 SDK, for cases where you were using SDK related types, please look at the [Azure Cosmos DB SDK V3 migration guide](../cosmos-db/nosql/migrate-dotnet-v3.md) for more information.

---

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

## Update the extension bundle

By default, [extension bundles](./functions-bindings-register.md#extension-bundles) are used by non-.NET function apps to install binding extensions. The Azure Cosmos DB version 4 extension is part of the Microsoft Azure Functions version 4 extension bundle.

To update your application to use the latest extension bundle, update your `host.json`. The following `host.json` file uses version 4 of the Microsoft Azure Functions extension bundle.

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  }
}
```

::: zone-end

::: zone pivot="programming-language-csharp"

## Rename the binding attributes

Both [in-process](functions-dotnet-class-library.md) and [isolated process](dotnet-isolated-process-guide.md) C# libraries use the [CosmosDBTriggerAttribute](https://github.com/Azure/azure-webjobs-sdk-extensions/blob/master/src/WebJobs.Extensions.CosmosDB/Trigger/CosmosDBTriggerAttribute.cs) to define the function.

The following table only includes attributes that were renamed or were removed from the version 3 extension. For a full list of attributes available in the version 4 extension, visit the [attribute reference](./functions-bindings-cosmosdb-v2-trigger.md?tabs=extensionv4#attributes).

|Version 3 attribute property |Version 4 attribute property |Version 4 attribute description |
|-----------------------------|-----------------------------|--------------------------------|
|**ConnectionStringSetting** |**Connection** | The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account being monitored. For more information, see [Connections](./functions-bindings-cosmosdb-v2-trigger.md#connections).|
|**CollectionName** |**ContainerName** | The name of the container being monitored. |
|**LeaseConnectionStringSetting** |**LeaseConnection** | (Optional) The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account that holds the lease container. <br><br> When not set, the `Connection` value is used. This parameter is automatically set when the binding is created in the portal. The connection string for the leases container must have write permissions.|
|**LeaseCollectionName** |**LeaseContainerName** | (Optional) The name of the container used to store leases. When not set, the value `leases` is used. |
|**CreateLeaseCollectionIfNotExists** |**CreateLeaseContainerIfNotExists** | (Optional) When set to `true`, the leases container is automatically created when it doesn't already exist. The default value is `false`. When using Azure AD identities if you set the value to `true`, creating containers isn't [an allowed operation](../cosmos-db/nosql/troubleshoot-forbidden.md#non-data-operations-are-not-allowed) and your Function won't be able to start.|
|**LeasesCollectionThroughput** |**LeasesContainerThroughput** | (Optional) Defines the number of Request Units to assign when the leases container is created. This setting is only used when `CreateLeaseContainerIfNotExists` is set to `true`. This parameter is automatically set when the binding is created using the portal. |
|**LeaseCollectionPrefix** |**LeaseContainerPrefix** | (Optional) When set, the value is added as a prefix to the leases created in the Lease container for this function. Using a prefix allows two separate Azure Functions to share the same Lease container by using different prefixes. |
|**UseMultipleWriteLocations** |*Removed* | This attribute is no longer needed as it's automatically detected. |
|**UseDefaultJsonSerialization** |*Removed* | This attribute is no longer needed as you can fully customize the serialization using built in support in the [Azure Cosmos DB version 3 .NET SDK](../cosmos-db/nosql/migrate-dotnet-v3.md#customize-serialization). |
|**CheckpointInterval**|*Removed* | This attribute has been removed in the version 4 extension. |
|**CheckpointDocumentCount** |*Removed* | This attribute has been removed in the version 4 extension. |

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

## Rename the binding attributes

Update your binding configuration properties in the `function.json` file. 

The following table only includes attributes that changed or were removed from the version 3.x extension. For a full list of attributes available in the version 4 extension, visit the [attribute reference](./functions-bindings-cosmosdb-v2-trigger.md#attributes).

|Version 3 attribute property |Version 4 attribute property |Version 4 attribute description |
|-----------------------------|-----------------------------|--------------------------------|
|**connectionStringSetting** |**connection** | The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account being monitored. For more information, see [Connections](./functions-bindings-cosmosdb-v2-trigger.md#connections).|
|**collectionName** |**containerName** | The name of the container being monitored. |
|**leaseConnectionStringSetting** |**leaseConnection** | (Optional) The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account that holds the lease container. <br><br> When not set, the `connection` value is used. This parameter is automatically set when the binding is created in the portal. The connection string for the leases container must have write permissions.|
|**leaseCollectionName** |**leaseContainerName** | (Optional) The name of the container used to store leases. When not set, the value `leases` is used. |
|**createLeaseCollectionIfNotExists** |**createLeaseContainerIfNotExists** | (Optional) When set to `true`, the leases container is automatically created when it doesn't already exist. The default value is `false`. When using Azure AD identities if you set the value to `true`, creating containers isn't [an allowed operation](../cosmos-db/nosql/troubleshoot-forbidden.md#non-data-operations-are-not-allowed) and your Function won't be able to start.|
|**leasesCollectionThroughput** |**leasesContainerThroughput** | (Optional) Defines the number of Request Units to assign when the leases container is created. This setting is only used when `createLeaseContainerIfNotExists` is set to `true`. This parameter is automatically set when the binding is created using the portal. |
|**leaseCollectionPrefix** |**leaseContainerPrefix** | (Optional) When set, the value is added as a prefix to the leases created in the Lease container for this function. Using a prefix allows two separate Azure Functions to share the same Lease container by using different prefixes. |
|**useMultipleWriteLocations** |*Removed* | This attribute is no longer needed as it's automatically detected. |
|**checkpointInterval**|*Removed* | This attribute has been removed in the version 4 extension. |
|**checkpointDocumentCount** |*Removed* | This attribute has been removed in the version 4 extension. |

::: zone-end

::: zone pivot="programming-language-csharp"

## Modify your function code

The Azure Functions extension version 4 is built on top of the Azure Cosmos DB .NET SDK version 3, which removed support for the [`Document` class](../cosmos-db/nosql/migrate-dotnet-v3.md#major-name-changes-from-v2-sdk-to-v3-sdk). Instead of receiving a list of `Document` objects with each function invocation, which you must then deserialize into your own object type, you can now directly receive a list of objects of your own type.

This example refers to a simple `ToDoItem` type.

```cs
namespace CosmosDBSamples
{
    // Customize the model with your own desired properties
    public class ToDoItem
    {
        public string id { get; set; }
        public string Description { get; set; }
    }
}
```

Changes to the attribute names must be made directly in the code when defining your Function.

```cs
using System.Collections.Generic;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;

namespace CosmosDBSamples
{
    public static class CosmosTrigger
    {
        [FunctionName("CosmosTrigger")]
        public static void Run([CosmosDBTrigger(
            databaseName: "databaseName",
            containerName: "containerName",
            Connection = "CosmosDBConnectionSetting",
            LeaseContainerName = "leases",
            CreateLeaseContainerIfNotExists = true)]IReadOnlyList<ToDoItem> input, ILogger log)
        {
            if (input != null && input.Count > 0)
            {
                log.LogInformation("Documents modified " + input.Count);
                log.LogInformation("First document Id " + input[0].id);
            }
        }
    }
}
```

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

## Modify your function code

After you update your `host.json` to use the correct extension bundle version and modify your `function.json` to use the correct attribute names, there are no further code changes required.

::: zone-end

## Next steps

- [Run a function when an Azure Cosmos DB document is created or modified (Trigger)](./functions-bindings-cosmosdb-v2-trigger.md)
- [Read an Azure Cosmos DB document (Input binding)](./functions-bindings-cosmosdb-v2-input.md)
- [Save changes to an Azure Cosmos DB document (Output binding)](./functions-bindings-cosmosdb-v2-output.md)
