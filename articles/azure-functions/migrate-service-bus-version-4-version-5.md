---
title: Migrate Azure Service Bus extension for Azure Functions to version 5.x 
description: This article shows you how to upgrade your existing function apps using the Azure Service Bus extension version 5.x to be able to use version 5.x of the extension. 
ms.service: azure-functions
ms.topic: how-to 
ms.date: 11/13/2023
zone_pivot_groups: programming-languages-set-functions-lang-workers
---

# Migrate function apps from Azure Service Bus extension version 4.x to version 5.x 

This article highlights considerations for upgrading your existing Azure Functions applications that use the Azure Service Bus extension version 4.x to use the newer [extension version 5.x](./functions-bindings-service-bus.md?tabs=extensionv5). Migrating from version 4.x to version 5.x of the Azure Service Bus extension has breaking changes for your application. 

> [!IMPORTANT]
> On March 31, 2025 the Azure Service Bus extension version 4.x will be retired. The extension and all applications using the extension will continue to function, but Azure Service Bus will cease to provide further maintenance and support for this extension. We recommend migrating to the latest version 5.x of the extension.

This article walks you through the process of migrating your function app to run on version 5.x of the Azure Service Bus extension. Because project upgrade instructions are language dependent, make sure to choose your development language from the selector at the [top of the article](#top).

::: zone pivot="programming-language-csharp"

## Update the extension version

.NET Functions use bindings that are installed in the project as NuGet packages. Depending on your Functions process model, the NuGet package to update varies.

|Functions process model |Azure Service Bus extension |Recommended version |
|------------------------|--------------------------|--------------------|
|[In-process model](./functions-dotnet-class-library.md)|[Microsoft.Azure.WebJobs.Extensions.ServiceBus](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.ServiceBus) |>= 5.13.4 |
|[Isolated worker model](./dotnet-isolated-process-guide.md) |[Microsoft.Azure.Functions.Worker.Extensions.ServiceBus](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.ServiceBus)|>= 5.14.1 |

Update your `.csproj` project file to use the latest extension version for your process model. The following `.csproj` file uses version 5 of the Azure Service Bus extension.

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
    <PackageReference Include="Microsoft.Azure.Functions.Worker.Extensions.ServiceBus" Version="5.14.1" />
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
    <PackageReference Include="Microsoft.Azure.WebJobs.Extensions.ServiceBus" Version="5.13.4" />
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

## Azure Service Bus SDK changes

The underlying SDK used by extension changed to use the [Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus) SDK, for cases where you were using SDK related types, please look at the [Guide for migrating to Azure.Messaging.ServiceBus from Microsoft.Azure.ServiceBus](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/MigrationGuide.md) for more information.

---

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

## Update the extension bundle

By default, [extension bundles](./functions-bindings-register.md#extension-bundles) are used by non-.NET function apps to install binding extensions. The Azure Service Bus version 5 extension is part of the Microsoft Azure Functions version 4 extension bundle.

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

## Modify your function code

The Azure Functions extension version 5 is built on top of the Azure.Messaging.ServiceBus SDK version 3, which removed support for the `Message` class. Instead, use the `ServiceBusReceivedMessage` type to receive message metadata from Service Bus Queues and Subscriptions.

::: zone-end
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

## Modify your function code

After you update your `host.json` to use the correct extension bundle version and modify your `function.json` to use the correct attribute names, there are no further code changes required.

::: zone-end

## Next steps

- [Run a function when a Service Bus queue or topic message is created (Trigger)](./functions-bindings-service-bus-trigger.md)
- [Send Azure Service Bus messages from Azure Functions (Output binding)](./functions-bindings-service-bus-output.md)